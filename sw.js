/* Offline cache for Sabir Amin Real Estate PWA.
   IMPORTANT: only same-origin app files are cached. Google Sheets / Apps Script
   requests must NEVER be cached, or the app would show stale sheet data. */
const CACHE = 'sare-v6';
const ASSETS = [
  './','./index.html','./styles.css','./app.js','./seed.js','./sheets.js','./manifest.webmanifest',
  './assets/logo.svg','./assets/icon.svg','./assets/favicon.png',
  './assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png'
];

self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Never intercept anything off our own origin (Google Sheets CSV, Apps Script, fonts…)
  // so live data is always fetched fresh from the network.
  if (url.origin !== self.location.origin) return;

  // Network-first for our own files: always get the newest version when online,
  // fall back to the cache when offline.
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() =>
      caches.match(req).then(hit => hit || caches.match('./index.html'))
    )
  );
});
