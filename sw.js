const staticCacheName = 'restReviews-static-v2'


self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll([
				'/',
				'index.html',
				'js/main.js',
				'js/restaurant_info.js',
				'css/styles.css',
				'css/responsive.css',
				'img/'
			]);
		})
	);
});

// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open('v1').then(function(cache) {
//       return cache.addAll(
//         [
// 		'/',
// 		'/js/main.js',
// 		'/js/restaurant_info.js',
// 		'/css/styles.css',
// 		'/css/responsive.css',
// 		'/img/1.jpg'
//         ]
//       );
//     })
//   );
// });


// self.addEventListener('activate', function (event) {
// 	event.waitUntil(
// 		caches.keys().then(function (keyList) {
// 			return Promise.all(keyList.map(function (key) {
// 				if (cacheWhitelist.indexOf(key) === -1) {
// 					return caches.delete(key);
// 				}
// 			}));
// 		})
// 	);
//
// });


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restReviews-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request).then(function(response) {
			if (response.status === 404) {
				return new Response("Sorry! Hope you're not too hungry!")
			}
			return response;
		}).catch(function() {
			return new Response("Uh oh, I guess it didn't work!");
		})
	);
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(caches.match(event.request).then(function(response) {
//     // caches.match() always resolves
//     // but in case of success response will have value
//     if (response !== undefined) {
//       return response;
//     } else {
//       return fetch(event.request).then(function (response) {
//         // response may be used only once
//         // we need to save clone to put one copy in cache
//         // and serve second one
//         let responseClone = response.clone();
//
//         caches.open('v1').then(function (cache) {
//           cache.put(event.request, responseClone);
//         });
//         return response;
//       }).catch(function () {
//         return caches.match('/sw-test/gallery/myLittleVader.jpg');
//       });
//     }
//   }));
// });
