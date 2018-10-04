// This file is not used

const cacheNames = 'restReviews-static-v4';
const cacheFiles = [
	'/',
	'/index.html',
	'/restaurant.html',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/js/dbhelper.js',
	'/css/styles.css',
	'/css/response.css',
	'/data/restaurants.json',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
	'/img/'
];

/**
 *  Call the install event.  Cache the HTML, CSS, JS and static files.  |  caches.open()
 */
self.addEventListener('install', event => {
	console.log('SW: installed');

	event.waitUntil(
		caches
			.open(cacheNames)
			.then(cache => {
				console.log('Service Worker: Caching Files');
				cache.addAll(cacheFiles);
			})
			.then(() => self.skipWaiting())
	);
});

/**
 * Activate the event. caches.keys() not working
 */
// self.addEventListener('activate', event => {
//
// 	// Remove the unwanted caches
// 	event.waitUntil(
// 		caches.keys().then(cacheNames => {
// 			return Promise.all(
// 				cacheNames.map(cache => {
// 					if (cache !== cacheNames) {
// 						console.log('Clearing old cache');
// 						return caches.delete(cache);
// 					}
// 				})
// 			);
// 		})
// 	);
// });


/**
 * Activate the event. caches.keys()
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restReviews-') &&
                 cacheName != cacheNames;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


/**
 *  Call the Fetch event |  caches.match()
 */
self.addEventListener('fetch', event => {
	console.log('SW: Fetching');
    event.respondWith(
		fetch(event.request).catch(() => caches.match(event.request))
	)
});


/**
 *  Cache the files |  caches.match()
 */
// self.addEventListener('fetch', event => {
// 	console.log('SW: Fetching');
//     event.respondWith(
//     caches.match(event.request).then(function(response) {
//     	return response || fetch(event.request);
// 	})
//   );
// });

/**
 *
 * @type {Array}
 */
// var assets = []; // list of urls to be cached

// cache responses of provided urls
// cacheAssets(assets)
//   .then(() => {
//       console.log('All assets cached')
//   });






/**
 * all urls will be added to cache  |  caches.open()
 * @param assets
 * @returns {Promise<any>}
 */
// function cacheAssets( assets ) {
//   return new Promise( function (resolve, reject) {
//     // open cache
//     caches.open('assets')
//       .then(cache => {
//         // the API does all the magic for us
//         cache.addAll(assets)
//           .then(() => {
//             console.log('all assets added to cache');
//             resolve()
//           })
//           .catch(err => {
//             console.log('error when syncing assets', err);
//             reject()
//           })
//       }).catch(err => {
//         console.log('error when opening cache', err);
//         reject()
//       })
//   });
// }



/**
 * Custom response for response errors
 */
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


