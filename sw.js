// Guarda la app para que abra sin conexión. Los vídeos y los audios no pasan por aquí.
// Estrategia: SIEMPRE se pide primero a internet (así los cambios llegan en la siguiente
// apertura) y solo si no hay conexión se usa la última copia guardada.
const CACHE = 'mf-v11';
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'content.js', 'fonts.css', 'manifest.webmanifest',
  'manrope-latin-300.woff2', 'manrope-latin-ext-300.woff2',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'hoy.jpg', 'camino.jpg', 'meditar.jpg', 'escribir.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(u => fetch(u, { cache: 'reload' }).then(r => r.ok && c.put(u, r)).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
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
  // Centro Tapping (audios pesados y con rangos): no pasa por la caché de la app
  if (url.pathname.includes('/tapping/')) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
