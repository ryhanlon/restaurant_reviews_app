/**
 * Entry point to service worker
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
	.then(function(reg) {
		console.log('Im here.');
		if(reg.installing) {
		  console.log('Service worker installing');
		} else if(reg.waiting) {
		  console.log('Service worker installed');
		} else if(reg.active) {
		  console.log('Service worker active');
		}
		})
	//registration failed

	.catch(error => console.log(`Registration failed with ${error}`));
}
