// sw.js
const CACHE_NAME = 'play-cache-v9';
const URLS_TO_CACHE = [
  '/Play.js',
  '/Play.wasm',
  '/favicon.ico',
  '/play-192.png',
  '/play-512.png',
  '/index.html',
  '/manifest.json',
  '/static/js/main.bedb2a19.js',
  '/static/css/main.5a525eca.css'
];

// Install: pre-cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchRes => {
          // Optionally cache new requests
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});
