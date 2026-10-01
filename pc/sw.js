const CACHE='pachinko-training-pc-love-v3';
const ASSETS=[
  './index.html',
  './love.css?v=3',
  './lesson.js?v=3',
  './assets/board-clean.jpg',
  './assets/love-lcd.jpg',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-pachinko-v2.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('pachinko-training-pc-') && k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});