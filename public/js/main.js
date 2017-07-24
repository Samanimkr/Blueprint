// window.addEventListener('load', function() {
// 		navigator.serviceWorker
//     .register('./service_worker.js')
//     .then(function() { console.log('Service Worker Registered'); })
//
//     .catch(function (err) {
//             console.log('ServiceWorker registration failed: ', err);
//     });
//
// });

$(document).ready(function(){

  $('#menu').click(function() {
    $('nav').animate({ left: "0"} , 250);
    $('#nav-right').fadeIn(500);
});

});
