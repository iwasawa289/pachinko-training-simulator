const CACHE='pachinko-training-mobile-v4';
const ASSETS=['./index.html','./mobile.css?v=2','./mobile-layout.js?v=2','./mobile-lesson.js?v=1','./pc/love.css?v=4','./pc/assets/board-clean.jpg','./pc/assets/love-lcd.jpg','./pc/assets/training-title.png','./icon-192.png','./icon-512.png','./manifest.webmanifest?v=4'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pachinko-training-')&&!k.startsWith('pachinko-training-pc-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
 if(new URL(event.request.url).pathname.includes('/pc/')&&event.request.mode==='navigate')return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
