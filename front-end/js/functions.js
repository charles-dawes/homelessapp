/* global $ */


$(document).ready(function(){
  if (localStorage.token != "undefined"){

    $("#header").load("/nav.html");
    $(".loadPage").each(function(){
        $(this).load($(this).attr("page"));
    })

    $("#allContent").show();

    var mySwiper = new Swiper('.swiper-container', {
        startSlide: 7,
        direction: 'horizontal'
    })
    mySwiper.slideTo(6, 0, false);
    // 
    // $.get("http://18.188.24.223:8888/users/get/"+localStorage.token, function(data){
    //   $("#loader").hide();
    //   $("#firstName").text("First Name: " + data.first_name);
    //   $("#lastName").text("Last Name: " + data.last_name);
    //   $("#userInfo").show();
    //   console.log(data.first_name);
    // })

  } else {
    $("#notLoggedIn").show();
    $("#loader").hide();
  }


})

function loadContent(pathToContent, element){
    $("#mainContent").load(pathToContent);
}

function spawnNotification(theBody, theIcon, theTitle){
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle, options);
    setTimeout(n.close.bind(n), 5000);
}
