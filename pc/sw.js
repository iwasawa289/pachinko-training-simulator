const CACHE='pachinko-training-pc-love-v6';
const ASSETS=[
  './index.html',
  './love.css?v=4',
  './lesson.js?v=3',
  './assets/board-natural.jpg',
  './assets/training-title.png',
  './assets/love-lcd.jpg',
  './manifest.webmanifest?v=2',
  '../icons/training-192.png',
  '../icons/training-512.png',
  '../icons/training-180.png'
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