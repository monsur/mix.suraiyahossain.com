var cacheName = 'mix-suraiyahossain-com';

var filesToCache = [
  '/',
  '/index.html',
  '/css/index.css',
  '/images/download-icon-white-32x32.png',
  '/images/icon.png',
  '/images/nexttrack.png',
  '/images/nexttrackpressed.png',
  '/images/pause.png',
  '/images/pausepressed.png',
  '/images/play.png',
  '/images/playpressed.png',
  '/images/prevtrack.png',
  '/images/prevtrackpressed.png',
  '/images/spotify-icon-white-32x32.png',
  '/js/analytics.js',
  '/js/events.js',
  '/js/globals.js',
  '/js/index.js',
  '/js/mix.js',
  '/js/mixes.js',
  '/js/page.js',
  '/js/player.js',
  '/js/track.js',
  '/js/uicontroller.js',
  '/years/2021/back.jpg',
  '/years/2021/data.json',
  '/years/2021/front.jpg',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});