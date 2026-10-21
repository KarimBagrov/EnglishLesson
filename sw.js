const CACHE_NAME = 'english-lesson-cache-v3'; // Подняли версию, чтобы браузеры сбросили старый кеш

// Список файлов, которые нужно сохранить для офлайн-режима
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './lessons/it/it-lesson-1.html',
  './lessons/it/it-lesson-2.html',
  './lessons/life/life-lesson-1.html',
  './lessons/life/life-lesson-2.html'
];

// 1. Установка: кэшируем основные файлы
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Активируем сразу
});

// 2. Активация: чистим старый кэш
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Берем контроль над страницами сразу
});

// 3. Стратегия Stale-While-Revalidate (Быстро из кэша, обновление в фоне)
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || fetchPromise;
      });
    })
  );
});