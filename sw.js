const CACHE_NAME = 'english-lesson-cache-v9'; // Подняли версию для сброса кеша

// Список ВСЕХ файлов, которые нужно сохранить для офлайн-режима
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  // --- IT (7 уроков) ---
  './lessons/it/it-lesson-1.html',
  './lessons/it/it-lesson-2.html',
  './lessons/it/it-lesson-3.html',
  './lessons/it/it-lesson-4.html',
  './lessons/it/it-lesson-5.html',
  './lessons/it/it-lesson-6.html',
  './lessons/it/it-lesson-7.html',
  // --- LIFE (7 уроков) ---
  './lessons/life/life-lesson-1.html',
  './lessons/life/life-lesson-2.html',
  './lessons/life/life-lesson-3.html',
  './lessons/life/life-lesson-4.html',
  './lessons/life/life-lesson-5.html',
  './lessons/life/life-lesson-6.html',
  './lessons/life/life-lesson-7.html',
  // --- CHINESE (1 урок) ---
  './lessons/chinese/ch-lesson-1.html',
  // --- Иконки ---
  './images/icons/icon-192.ico',
  './images/icons/og-preview.png'
];

// 1. Установка: кэшируем основные файлы
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Активация: чистим старый кеш
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
  self.clients.claim();
});

// 3. Стратегия Stale-While-Revalidate
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