const CACHE_NAME = 'promptparto-v3';

// Use relative URLs so the service worker also functions when the site is
// served from a subdirectory (e.g. GitHub Pages). The base URL is derived from
// the service worker's location.
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/components/main.js',
  './js/utils/dragdrop.js',
  './js/utils/gemini.js',
  './js/utils/history.js',
  './manifest.webmanifest',
  './favicon.ico',
  './assets/fonts/Inter-Regular.woff2',
  './assets/fonts/Inter-Regular.woff',
  './assets/fonts/Inter-Bold.woff2',
  './assets/fonts/Inter-Bold.woff',
  './assets/fonts/Vazirmatn-Regular.woff2',
  './assets/fonts/Vazirmatn-Regular.woff',
  './assets/fonts/Vazirmatn-Bold.woff2',
  './assets/fonts/Vazirmatn-Bold.woff'
];

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