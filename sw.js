const cacheNames = 'restReviews-static-v3';


/**
 *  Call the install event.  Cache the HTML, CSS, JS and static files.  |  caches.open()
 */
self.addEventListener('install', event => {
	console.log('SW: installed');
});


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
		fetch(event.request).then(res => {
			// Make a clone of response
			const resClone = res.clone();
			// Open cache
			caches
				.open(cacheNames)
				.then(cache => {
					// Add response to cache
					cache.put(event.request, resClone);
				});
			return res;
		}).catch(error => caches.match(event.request).then(res => res))
	);
});


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


