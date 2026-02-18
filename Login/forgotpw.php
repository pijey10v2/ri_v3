<?php include "content/header.php";
echo '<html lang="en">
  <link href="../CSS/signin.css" rel="stylesheet">
  <script src ="../JS/forgotpw.js"></script>
  <body class="main-container">
    <div class="container">
      <button class="btn btn-back" id="backbutton" href="../signin"></button>
      <div class="row row_img">
        <img src="../favicon.ico"/>
      </div>
      <div class="row">
        <form class="form-group" action="include/forgot" method="POST" autocomplete="off">
          <div class="row form-group">
            <h4>Account Recovery</h4>
            <label for="email">Email Registered:</label>
            <input required name="email" id="email" type="email" class="form-control" placeholder="example@reveronconsulting.com"/>
          </div>
          <div class="row form-group">
              <button type="submit" name="forgotpw" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </body>
</html>'
?>
