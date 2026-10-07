const CACHE_NAME = 'ototakip-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); }))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (e.request.method === 'GET' && !e.request.url.startsWith('chrome-extension')) {
            cache.put(e.request, fetchRes.clone());
          }
          return fetchRes;
        });
      }).catch(() => caches.match('./index.html'));
    })
  );
});
