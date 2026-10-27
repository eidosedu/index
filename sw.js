const CACHE_NAME = 'eidos-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://eidosedu.github.io/indexador-eidos/recursos.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                    return networkResponse;
                }).catch(() => {
                    // Cache em caso de falha
                });

                return cachedResponse || fetchPromise;
            })
    );
});
