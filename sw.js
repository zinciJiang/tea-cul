const CACHE_NAME = 'tea-culture-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/ChaYiChaDao.html',
  '/ChaFengChaSu.html',
  '/Products.html',
  '/tea-news.html',
  '/Cooperation.html',
  '/timeline.html',
  '/css/header.css',
  '/css/index.css',
  '/css/footer.css',
  '/css/login-modal.css',
  '/css/CYCD.css',
  '/css/CFCS.css',
  '/css/tea-news.css',
  '/js/index.js',
  '/js/login-modal.js',
  '/js/back-to-top.js',
  '/images/logo6.png',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png'
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 处理fetch请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到响应，则返回缓存的响应
        if (response) {
          return response;
        }

        // 克隆请求。请求是一个流，只能使用一次
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // 检查是否是有效的响应
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应。响应是一个流，只能使用一次
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // 只缓存同源请求
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
}); 