/* global $ */
/* global alertify */

$(document).ready(function(){

     alertify.set('notifier','position', 'bottom-center');


    $("#btnLogin").click(function(e) {
        e.preventDefault();
        //console.log($("#txtUsername").val());
        //alertify.alert("Login", $("#txtUsername").val(), loginSuccessful());
        $.post("http://18.188.24.223:8888/auth/login", {username: $("#txtUsername").val(), password: $("#txtPassword").val()}, function(data){
            console.log(data);
            if (data == 'invalid credentials'){
                alertify.error("Invalid credentials, please try again!");
                localStorage.token = "undefined";
            } else {
              localStorage.token = data;

              alertify.success("Login Successful!");
              $(location).attr('href', 'http://18.188.24.223/index.html');
            }

        })
    });

});
