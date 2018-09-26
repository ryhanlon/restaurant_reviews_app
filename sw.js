const staticCacheName = 'restReviews-static-v2';
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


self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll(cacheFiles);
		})
	);
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
    	return response || fetch(event.request);
	})
  );
});

// all urls will be added to cache
function cacheAssets( assets ) {
  return new Promise( function (resolve, reject) {
    // open cache
    caches.open('assets')
      .then(cache => {
        // the API does all the magic for us
        cache.addAll(assets)
          .then(() => {
            console.log('all assets added to cache')
            resolve()
          })
          .catch(err => {
            console.log('error when syncing assets', err)
            reject()
          })
      }).catch(err => {
        console.log('error when opening cache', err)
        reject()
      })
  });
}
var assets = []; // list of urls to be cached

// cache responses of provided urls
cacheAssets(assets)
  .then(() => {
      console.log('All assets cached')
  });

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


