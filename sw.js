// https://codelabs.developers.google.com/codelabs/offline/index.html
// https://jakearchibald.com/2014/offline-cookbook/
// Adding to cache see https://www.youtube.com/watch?v=SdMxGNkZqnU @ 27:37
// Push notifications see https://www.youtube.com/watch?v=SdMxGNkZqnU @ 32:39
// Background Sync see https://www.youtube.com/watch?v=SdMxGNkZqnU @ 34:00

'use strict';

const CACHE_VERSION = '?v=0.1';

let assets = [
    '/',
    `/index.html${CACHE_VERSION}`,
    `/assets/images/icon.png${CACHE_VERSION}`
];

self.addEventListener('install', event => loadCache(event));
self.addEventListener('activate', event => cleanCache(event));
self.addEventListener('fetch', event => handleRequests(event));

function loadCache(event) {
    event.waitUntil(
      caches.open('app').then(cache => cache.addAll(assets))
    );
}

function cleanCache(event) {
    let cacheWhiteList = ['app'];

    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (cacheWhiteList.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            }));
    }));
}

function handleRequests(event) {
    console.log(event.request.url);

    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
}