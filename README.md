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

> ✍️ **Editing:** the on-screen Add/Edit/Record buttons change your **local view**;
> they do **not** write back to the Sheet yet, and are overwritten on the next Sync.
> To change data permanently, edit the Google Sheet. (Two-way write-back can be
> added later via a Google Apps Script — ask if you want it.)

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

## Login

Change these in **Settings → Users** after first sign-in.

| Username | Password | Access |
|---|---|---|
| `admin` | `123` | Everything |
| `agent` | `1234` | Properties, tenants, contracts, rent |
| `accountant` | `12345` | Finance, debts, rent |

> This login gates the on-screen app only; it is not bank-grade security.

## 🔄 Want two-way sync (edit in the app → updates the Sheet)?

Reading is built in. Writing back to the Sheet from a static site needs a small
Google Apps Script "web app" endpoint. Ask to have this set up and the app's
Add/Edit/Record actions can update your Sheet directly.
