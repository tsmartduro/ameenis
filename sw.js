/* PrimeScout offline shell. Cache failures for optional files never abort installation. */
const CACHE_PREFIX = 'primescout-shell-';
const CACHE_NAME = CACHE_PREFIX + 'v5';
const APP_SHELL = [
  './', './index.html', './accounts.html', './batches.html', './recipients.html',
  './rotation.html', './activity.html', './styles.css', './gate.js', './app.js',
  './accounts.js', './recipients.js', './manifest.webmanifest', './icon-192.png',
  './icon-512.png', './logo-mark.png', './logo-full.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async path => {
      try {
        const response = await fetch(path, { cache: 'reload' });
        if (response && response.ok) await cache.put(path, response);
      } catch (_) { /* Keep installing even when an optional asset is offline. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      return (await caches.match(request)) ||
        (request.mode === 'navigate' ? await caches.match('./index.html') : null) ||
        Response.error();
    }
  })());
});
