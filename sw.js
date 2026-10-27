const CACHE_NAME = 'eidos-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://eidosedu.github.io/indexador-eidos/recursos.json'
];

// Instala o Service Worker e cria o Cache Inicial
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercepta as requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Estratégia Stale-While-Revalidate: Retorna do cache se tiver, mas tenta atualizar no fundo
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                    return networkResponse;
                }).catch(() => {
                    // Ignora falha de rede aqui, pois o cachedResponse assumirá
                });

                return cachedResponse || fetchPromise;
            })
    );
});