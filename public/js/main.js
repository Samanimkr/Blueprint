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
//
// window.addEventListener('load', function() {
//   function updateOnlineStatus(event) {
//     if (!navigator.onLine){
//       window.location = "./public/js/offline.html";
//     }
//   }
//
//   window.addEventListener('online',  updateOnlineStatus);
//   window.addEventListener('offline', updateOnlineStatus);
// });

var navWidth = "70%";
var animSpeed = 250; //milliseconds

$(document).ready(function(){

  $('#menu').click(function() {
    $('nav').animate({ left: "0"} , animSpeed);
    $('#nav-right').fadeIn(animSpeed);
  });

  $('#nav-right').click(function() {
    $('nav').animate({ left: ("-"+navWidth) } , animSpeed);
    $('#nav-right').fadeOut(animSpeed);
  });

  $('#newproject').click(function(){
  	$('.dropdown').slideToggle(animSpeed);
    $('#dropdown-bottom').fadeToggle(animSpeed);
  });

  $('.dropdown input[type="submit"], #dropdown-bottom').click(function(){
    $('.dropdown').slideToggle(animSpeed);
    $('#dropdown-bottom').fadeToggle(animSpeed);
  });

});
