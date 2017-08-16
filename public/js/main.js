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

  $('#dropdown-bottom').click(function(){
    $('.dropdown').slideToggle(animSpeed);
    $('#dropdown-bottom').fadeToggle(animSpeed);
  });

  $('input[name="dueDate"]').datepicker({dateFormat: "yy-mm-dd", minDate: 0, constrainInput: true, prevText: "<", nextText: ">"});
  // $('a#calendarbtn').click(function(){
  //   $('input[name="dueDate"]').datepicker( "show" );
  // });

  $('#featuresContent ul li').click(function(){
    $(this).css({
    'height': 'auto'
    });
    $(this).find('span').css({
      'display': 'block',
      'height': 'auto',
      'max-width': '100%',
      'margin': '0',
      'padding': '2px 0',
      'white-space': 'normal',
      'overflow': 'visible',
      'text-overflow': 'inherit'
    });
    $(this).find('span.badge').css('max-width', '50%');
    $(this).find('span.right').removeClass('right');
    $(this).find('p').css({
      'color': '#444',
      'margin-top': '5px',
      'white-space': 'normal',
      'overflow': 'visible',
      'text-overflow': 'inherit',
      'height': 'auto',
      'padding': '2px 0',
    });
  });

});
