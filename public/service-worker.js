const CACHE_NAME = 'promptparto-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/components/main.js',
  '/js/utils/dragdrop.js',
  '/js/utils/gemini.js',
  '/js/utils/history.js',
  '/manifest.webmanifest',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)))
    )
  );
});