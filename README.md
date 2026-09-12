# Sabir Amin Real Estate — Property Management Portal

A web-based property management app for **SABIR AMIN REAL ESTATE LLC SPC** that reads
your data **live from your Google Sheet**. Works on any device (PC, tablet, mobile)
and installs as an app on your phone. No servers, no monthly fees — just static files.

## What's inside

| Section | What it does |
|---|---|
| **Dashboard** | Everything at a glance — units, occupancy, rent collected, profit, receivables, expiring contracts, tasks + charts. |
| **Properties** | All studios/units with owner, tenant, rent, profit, contract, map & documents. |
| **Tenants** | Current occupants with one-tap call, WhatsApp, rent and contract status. |
| **Contracts** | Every tenancy with live "days left", expiry filters and one-click **Renew**. |
| **Documents** | Quick links to each unit's Google Drive folder + a contacts directory. |
| **Rent Payments** | Monthly **rent roll** (who paid / who didn't), record payments, history. |
| **Finance** | Income, expenses, net profit, accounts, recurring expenses & ledger. |
| **Debts & Dues** | Receivables & payables with balances, part-payments, overdue alerts. |
| **Tasks**, **Settings** | Reminders; Google Sheet sync, backup/restore, users. |

## 📊 Live Google Sheet sync (main data source)

The app pulls all data straight from your Google Sheet:
`https://docs.google.com/spreadsheets/d/1ryQPlHzOeL-IfwPUIwb0u5oQSyczVon4GEEE5zCrEtk/`

- It **auto-syncs every time you open the app**, and there's a **Sync** button in the
  top bar and in **Settings → Google Sheet Sync**.
- The **Google Sheet is the source of truth.** Keep editing your data in the Sheet
  (tabs `Table`, `RentRecords`, `DebtTracker`, `pending actions`, `CompanyAccounts`,
  `PersonnelAccounts`, `RecurringExpenses`, `Studios`) exactly as you do now — then
  press **Sync** to see it here. Sync **replaces** the app's data with the Sheet's.
- You can change the linked Sheet or turn off auto-sync in **Settings**.

> ⚠️ **Required sharing:** for the app to read it, the Sheet must be shared as
> **Anyone with the link → Viewer** (yours already is). This also means anyone who
> has the Sheet link can read its contents — keep the link private.

> ✍️ **Editing → two-way sync:** once you complete the one-time setup below, the
> on-screen Add/Edit/Record buttons (debt payments, rent, unit edits, tasks…) write
> straight back to your Google Sheet. Until then they only change the local view and
> are overwritten on the next Sync.

## ✅ Two-way sync setup (one time, ~3 minutes)

This lets the app **save changes back** to your Sheet.

1. Open your Google Sheet → menu **Extensions → Apps Script**.
2. Delete whatever is there and paste **all** of the file **`apps-script/Code.gs`**
   (in this project). Click the **Save** icon.
3. Click **Deploy → New deployment**. Set:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy** and allow the permissions Google asks for.
4. Copy the **Web app URL** (it ends with `/exec`).
5. In the app: **Settings → Two-way sync** → paste the URL → **Save settings** →
   **Test write-back** (should say "Connected ✓").

That's it. From now on, every change you make in the app updates the Sheet, and the
Sheet stays your single source of truth. (The secret in `Code.gs` and in the app must
match — both default to `sabir-sync-2026`; change both together if you like.)

> Note: any change you made in the app **before** setting this up was local only and
> may not be in the Sheet — just re-enter it once write-back is on (or type it in the
> Sheet directly).

## 🌐 Put the app online with GitHub (free, ~5 min)

You upload **only the app code** — no personal data is in these files.

1. Create a free account at <https://github.com> → **New repository**.
   Name it `sabir-estate`, keep **Public**, **Create**.
2. **Add file → Upload files**, drag in **all** of these, then **Commit changes**:
   - `index.html`, `app.js`, `sheets.js`, `seed.js`, `styles.css`
   - `manifest.webmanifest`, `sw.js`, `README.md`
   - the whole **`assets/`** folder (logo + icons)
3. **Settings → Pages** → Source: **Deploy from a branch** → branch **main**,
   folder **/(root)** → **Save**.
4. After ~1 minute your app is live at
   `https://<your-username>.github.io/sabir-estate/`
5. Open that link on your phone → browser menu → **Add to Home Screen** to install it
   like a real app. It signs in, then auto-loads your Sheet.

## 💻 Use it locally (no internet needed to open)

**Double-click `index.html`** → sign in → it syncs from the Sheet (needs internet for
the sync itself). For full offline behaviour, serve it instead:

```bash
python -m http.server 8000
```
Then open <http://localhost:8000>.

## 💾 Offline backup (optional)

`sabir-amin-data.json` is a snapshot of your data you can import via
**Settings → Restore** if you're offline or want a manual copy. The live Sheet sync
is the normal way to load data, so you usually won't need this. **Keep this file
private and do not upload it to GitHub.**

## Install as an app + auto-updates

- Open the site in Chrome/Edge (PC/Android) → an **“Install this app”** bar appears,
  or use **Settings → App & Security → Install app**. On iPhone/iPad: Share → **Add to
  Home Screen**. It then runs full-screen with its own icon and works offline.
- When you publish a new version, the app detects it and shows **“A new version is
  available → Update now.”** You can also **Settings → Check for updates**.

## Security

- The default-password hint is gone from the login screen.
- Passwords are stored **hashed** on the device (changing one via **Settings → Users**
  or **Change my password** never stores it in clear text).
- **Auto-lock:** the app locks after inactivity (default 15 min, configurable) and
  there's a **Lock** button by your name. Locking keeps your data but requires the
  password again.
- Reminder: data also lives in your **public-readable Google Sheet**, so real
  confidentiality means keeping the Sheet link private. For stronger security I can
  switch reads to go through your Apps Script (so the Sheet can be made **private**) —
  ask if you want that.

## Who hasn't paid rent

**Rent Payments** → pick any **month/year**, then use the **All / Unpaid / Paid**
tabs on the Rent Roll. Each row shows the tenant + phone, the rent amount, the
**date rent is due that month** (taken from each tenant's contract start day), what
was paid, and a status chip — `Overdue 11d`, `Due 8 Sep`, or `Paid 30 Aug`. Overdue
rows are highlighted, with a WhatsApp reminder button and a **Collect** button.
A red summary shows *"N unpaid · AED X outstanding this month"*.

## Daily morning WhatsApp report

Your Apps Script can message you every morning with the full rent + expiry picture.
One-time setup (all inside `apps-script/Code.gs`, see the comments at the top):

1. Register with **CallMeBot** (free) to get an API key for your own WhatsApp number.
2. Fill `OWNER_PHONE` and `CALLMEBOT_APIKEY` at the top of `Code.gs`.
   (Prefer email instead? Set `SEND_EMAIL = true` and `OWNER_EMAIL`.)
3. In the Apps Script editor, select the function **`createDailyTrigger`** and click
   **Run** once. That schedules it for ~7 AM daily.
4. To preview the message immediately, run **`testDigest`** and check View → Logs.

The message lists every unpaid unit (tenant, amount, due day), the total
outstanding, and every contract expiring within `EXPIRY_DAYS` (default 30).

## Studio marketing flyer (ad)

**Contracts → Marketing Flyer** builds a printable A4 advert of everything you can
offer: vacant units (*Available Now*) plus units whose contracts expire within the
window you choose (shown with their free-from date). Set the contact number, area
line, and an **uplift** added to units that have no asking price. Then **Print /
Save as PDF** or **Save HTML** to share on WhatsApp.

> **Pricing tip:** to control the advertised price per studio exactly, add an
> **`AskingRent`** column to your `Table` tab in the Google Sheet (or fill *Asking
> Rent for ads* when editing a unit). When set, it overrides the uplift. Without it
> the flyer uses the unit's rent + the uplift, so it never advertises at your cost.

## Handy extras

- **WhatsApp reminders:** on the **Rent Roll**, unpaid units show a WhatsApp button
  that opens a pre-written rent reminder to the tenant. **Contracts** that are
  expiring/expired show a renewal-reminder button.
- **Rent auto-fill:** recording a payment loads the unit's rent from your Table into
  *Amount Received* automatically (and updates when you change the unit).

## Login

Change these in **Settings → Users** after first sign-in.

| Username | Password | Access |
|---|---|---|
| `admin` | `123` | Everything |
| `agent` | `1234` | Properties, tenants, contracts, rent |
| `accountant` | `12345` | Finance, debts, rent |

> This login gates the on-screen app only; it is not bank-grade security.

## What writes back to the Sheet

Once two-way sync is set up, these all update the Google Sheet automatically:
debt payments & new debts (DebtTracker), rent payments (RentRecords), unit add/edit/
delete & contract renewals (Table), tasks (pending actions), finance transactions
(Transactions), recurring expenses (RecurringExpenses) and account balances.
