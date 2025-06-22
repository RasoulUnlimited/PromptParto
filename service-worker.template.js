const CACHE_NAME = 'promptparto-v3';

// Use relative URLs so the service worker also functions when the site is
// served from a subdirectory (e.g. GitHub Pages). The base URL is derived from
// the service worker's location.
const ASSETS = [];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});
self.skipWaiting();

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(() => caches.match(event.request));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)))
    )
  );
});
self.clients.claim();
