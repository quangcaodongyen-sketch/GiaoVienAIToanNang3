const CACHE_NAME = 'eng12-vocab-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './vocabulary_data.js',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});