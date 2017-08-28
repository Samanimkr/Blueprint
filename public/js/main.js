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
var activatedFeature = "none";

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

  $('input[name="dueDate"]').datepicker({dateFormat: "dd/mm/yy", minDate: 0, constrainInput: true, prevText: "<", nextText: ">"});

  // $('#dashboard-content ul li .settings').click(function(){
  //
  //   if (activatedProject == "none") {
  //       activatedProject = this.id;
  //       $(this).find('.feature-edit').slideDown(animSpeed);
  //
  //   } else if (activatedProject == this.id){
  //       activatedProject = "none";
  //       $(this).find('.feature-edit').slideUp(animSpeed);
  //
  //   } else {
  //       $('#featuresContent ul li .feature-edit').slideUp(animSpeed);
  //
  //       activatedProject = this.id;
  //       $(this).find('.feature-edit').slideDown(animSpeed);
  //   }
  // });

  $('#featuresContent ul li').click(function(){

    if (activatedFeature == "none") {
        activatedFeature = this.id;
        $(this).find('p').slideDown(animSpeed);
        $(this).find('.feature-edit').slideDown(animSpeed);

    } else if (activatedFeature == this.id){
        activatedFeature = "none";
        $(this).find('p').slideUp(animSpeed);
        $(this).find('.feature-edit').slideUp(animSpeed);

    } else {
        $('#featuresContent ul li p').slideUp(animSpeed);
        $('#featuresContent ul li .feature-edit').slideUp(animSpeed);

        activatedFeature = this.id;
        $(this).find('p').slideDown(animSpeed);
        $(this).find('.feature-edit').slideDown(animSpeed);
    }
  });

});
