
const CACHE_NAME = 'smartcalcu-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: Since we are using CDN for Tailwind and Vite's dev server for JS,
  // in a real build, you'd add your bundled JS/CSS files here.
  // For this setup, we primarily cache the root and HTML.
  // We will cache API responses dynamically.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // For API requests to exchangerate.host, use a network-first, then cache strategy.
  if (url.hostname === 'api.exchangerate.host') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If the request is successful, clone it and store it in the cache.
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If the network fails, try to get the response from the cache.
          return caches.match(event.request);
        })
    );
  } else {
    // For all other requests, use a cache-first strategy.
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
