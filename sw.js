// Guarda la app para que abra sin conexión. Los vídeos y los audios no pasan por aquí.
const CACHE = 'mf-v4';
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'content.js', 'fonts.css', 'manifest.webmanifest',
  'manrope-latin-300.woff2', 'manrope-latin-ext-300.woff2',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'hoy.jpg', 'camino.jpg', 'meditar.jpg', 'escribir.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('.mp4')) return;
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
