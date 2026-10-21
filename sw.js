const CACHE_NAME = 'english-lesson-cache'; // Имя кэша (менять не нужно)

// Список файлов, которые нужно сохранить для офлайн-режима при первой загрузке
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
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
  self.skipWaiting(); // Активируем сразу, не ждем закрытия вкладок
});

// 2. Активация: чистим старый кэш, если имя изменилось
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
  // Нам нужны только GET-запросы (открытие страниц)
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        // Запускаем запрос в сеть параллельно
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          // Если сеть ответила — обновляем кэш свежей версией
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Если сети нет — ничего не делаем, отдадим то, что в кэше
          return null; 
        });

        // Возвращаем кэшированную версию (если она есть) ИЛИ ждем ответа сети
        return cachedResponse || fetchPromise;
      });
    })
  );
});