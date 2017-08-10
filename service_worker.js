var cacheName = 'v1.7';

var cacheFiles = [
  // './',
  // './public/css/reset.css',
  // './public/css/main.css',
  './public/js/main.js',
  './public/js/offline.html',
  // './public/font-awesome/css/font-awesome.min.css',
  // './public/font-awesome/fonts/fontawesome-webfont.eot',
  // './public/font-awesome/fonts/fontawesome-webfont.svg',
  // './public/font-awesome/fonts/fontawesome-webfont.ttf',
  // './public/font-awesome/fonts/fontawesome-webfont.woff',
  // './public/font-awesome/fonts/FontAwesome.otf',
  // './public/favi.ico',
  // './public/logo.png',
  // './views/layouts/main.handlebars',
  // './views/dashboard.handlebars',
  // 'https://fonts.googleapis.com/css?family=Rubik',
  // 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'
  // 'https://fonts.gstatic.com/s/rubik/v4/_mlO9_1N7oXYhEnEzC2l-g.woff2',
];



self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then(function(cache) {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	); // end e.waitUntil
});


self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil

});


self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)
			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url);
					// Return the cached version
					return response;
				}
      })
    );
  });
