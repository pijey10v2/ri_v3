<?php
session_start();
?>

  <html lang="en">
    <head>
      <link href="../CSS/forgotpw.css" rel="stylesheet">
      <link href="../JS/JsLibrary/jquery-confirm.min.css" rel="stylesheet">
      <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>
      <script src="../JS/JsLibrary/jquery-ui.js"></script>
      <script src="../JS/JsLibrary/jquery-confirm.min.js"></script>
    </head>
    <body class="main-container">
      <div class="container resetPass">
        <div class="row row_img">
          <img src="../favicon.ico">
        </div>
        <div class="row">
          <form class="form-group" action="" method="POST" autocomplete="off">
            <div class="row form-group">
              <label for="token">Email:</label>
              <input required name="email" id="email" type="email" class="form-control"/>
            </div>
            <div class="row form-group">
              <label for="token">Temporary Token:</label>
              <input required name="token" id="token" type="text" class="form-control"/>
            </div>
            <div class="row form-group">
              <label for="password">New Password:</label>
              <input required name="password" id="password" type="password" class="form-control" autocomplete='new-password'/>
            </div>
            <div class="row form-group">
              <label for="re_password">Confirm Password:</label>
              <input required name="re_password" id="re_password" type="password" class="form-control" autocomplete='new-password'/>
            </div>
            <div class="row form-group">
                <button type="submit" name="updatePassword" class="btn btn-primary" id="btn-update-password">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </body>
    <script>

    $(document).ready(function(){
      const url = new URL(window.location);
      $("#email").val(url.searchParams.get('email'));
    })

    $("#btn-update-password").on('click', function () {
      event.preventDefault();
      // check pwd mismatch
      if($("#re_password").val() != $("#password").val()){
        $.alert({
          boxWidth: '30%',
          useBootstrap: false,
          title: 'Alert!',
          content: 'Passwords did not match!',
        });
        return;
      }
      // check pwd complexity
      var decimal= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      let $passfieldVal = $("#password").val()
      if($passfieldVal.match(decimal)){
          console.log("password ok");
      }else{
          $.alert({
              boxWidth: "30%",
              useBootstrap: false,
              title: "Message",
              content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
          });
          return;
      }

      // check token first then proceed if correct
      $.ajax({
          url: '../BackEnd/UserFunctions.php',
          data: {
            functionName : 'updateUserForgetPwd',
            token : $("#token").val(),
            email : $("#email").val(),
            password : $("#password").val(),
            fromResetPwdFlag : 'true'
          },
          type: 'POST',
          dataType: "json",
          success: function (obj) {
              if(obj.bool){
                $.confirm({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Confirm!',
                    content: 'Please sign in back with your new password.',
                    buttons: {
                        OK: function () {
                            window.open("../signin.php", '_self')
                        }
                    }
                });
              }else{
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Error",
                    content: obj.msg,
                });
                return;                
              }
          }
      })
    });
    </script>
  </html>
