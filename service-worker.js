const CACHE_NAME = 'promptparto-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/components/main.js',
  './js/utils/dragdrop.js',
  './js/utils/gemini.js',
  './js/utils/history.js',
  './assets/fonts/Inter-Regular.woff2',
  './assets/fonts/Inter-Bold.woff2',
  './assets/fonts/Vazirmatn-Regular.woff2',
  './assets/fonts/Vazirmatn-Bold.woff2',
  './manifest.webmanifest',
  './favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
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
