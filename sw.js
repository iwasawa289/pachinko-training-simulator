const CACHE='pachinko-training-mobile-v9';
const ASSETS=['./index.html','./mobile.css?v=6','./mobile-layout.js?v=3','./mobile-lesson.js?v=2','./pc/love.css?v=4','./mobile/assets/board-natural.jpg','./pc/assets/love-lcd.jpg','./pc/assets/training-title.png','./icons/training-192.png','./icons/training-512.png','./icons/training-180.png','./manifest.webmanifest?v=6'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pachinko-training-')&&!k.startsWith('pachinko-training-pc-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
 if(new URL(event.request.url).pathname.includes('/pc/')&&event.request.mode==='navigate')return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
