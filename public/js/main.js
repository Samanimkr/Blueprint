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

$('#loginbtn').click(function(){
	$('#login-form').show();
	$('#signup-form').hide();
});

$('#signupbtn').click(function(){
	$('#login-form').hide();
	$('#signup-form').show();
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
