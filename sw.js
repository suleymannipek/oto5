const CACHE_NAME = 'ototakip-oto5-v8';
const ASSETS = [
  '/oto5/',
  '/oto5/index.html',
  '/oto5/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;

      return fetch(e.request).then((fetchRes) => {
        // Yalnızca geçerli GET ve http/https isteklerini önbelleğe al
        if (
          e.request.method === 'GET' && 
          fetchRes.status === 200 && 
          (e.request.url.startsWith('http://') || e.request.url.startsWith('https://'))
        ) {
          const resClone = fetchRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, resClone);
          });
        }
        return fetchRes;
      }).catch(() => caches.match('/oto5/index.html'));
    })
  );
});
