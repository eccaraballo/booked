// Built 2026-09-26T19:47:09.193772 - this comment's only job is to change on every
// build, so browsers detect a new service worker file and install it.
const CACHE_NAME = 'booked-shell';
const STATIC_ASSETS = ['manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
    )).then(() => self.clients.claim())
  );
});

// Navigations (the app page itself): try the network first so visitors
// always get the latest build when online, falling back to whatever was
// last cached so the app still opens offline or on a flaky connection.
// Everything else same-origin (stockfish engine assets, icons, manifest):
// cache-first, since those are large/static and rarely change. Cross-origin
// requests (fonts, the Supabase/CDN scripts) are left alone entirely.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
      return res;
    }))
  );
});
