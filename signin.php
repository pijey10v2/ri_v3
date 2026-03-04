<?php
include "login/content/header.php";
session_start();
require 'Login/include/db_connect.php';

global $PRODUCTION_FLAG;

if (isset($_SESSION['email'])) {
  if (isset($_GET['redirect'])) {
    // code same as in postlogin.php and login.php
    // if redirect. set the session variable
    $url = parse_url($_GET['redirect']);
    $path = rtrim($url['path'],".php");
    parse_str($url['query'], $urlParam);

    $email = $_SESSION['email'];

    //read the access control json file
    $access_control = json_decode(file_get_contents("BackEnd/accessControl.json"), true);
    $sql = "SELECT * FROM users u left join pro_usr_rel pur on u.user_ID = pur.Usr_ID left join projects p on p.project_id_number=pur.Pro_ID where u.user_email='$email' AND u.user_type != 'non_active';";
    $proid_array = array();
    $admin_array = array();
    $result    = sqlsrv_query($conn, $sql);
    while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
      $p_Name = $row['project_name'];
      $icon_url = $row['icon_url'];
      $p_ID = $row['project_id_number'];
      $is_parent = $row['parent_project_id_number'];

      if (!isset($_SESSION['user_org'])) {
        $_SESSION['user_org'] = $row['user_org'];
      }

      if (!isset($_SESSION['theme'])) {
        if ($row['theme_preference'] == 1) {
            $_SESSION['theme'] = "dark_red";
        } else {
            $_SESSION['theme'] = "light_color";
        }
      }

      if ($row['user_type'] == 'system_admin') {
              $_SESSION['isSysadmin'] = true;
      }
                  
      if ($row['Pro_Role'] == 'non_Member' || $row['status'] == 'archive' || !$row['status']) {
          continue;
      }
      $object = (object) [
          'project_id' => $p_ID, 'project_name' => $p_Name,
          'icon_url' => $icon_url, 'project_par_id' => $is_parent
      ];
      array_push($proid_array, $object);
      if ($row['Pro_Role'] == "Project Manager" || $row['Pro_Role'] == "Project Monitor"   ) {
          array_push($admin_array, $p_ID);
      }
    };

    if ($urlParam['pidName']){
      $processID = $urlParam['pidName'];
      $sql = "SELECT project_id_number FROM projects WHERE project_id = '$processID'";
      $stmt = sqlsrv_query( $conn, $sql);

      while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
        $urlParam['pid'] = $row['project_id_number'];	
      }
    }

    $_SESSION['project_list'] = $proid_array;
    $_SESSION['admin_pro'] = $admin_array;
    echo '<form name = "projectPageSelection" action="Login/postlogin_processing" method="POST" style="display:none" id="projectPageSelection">';
    echo ' <input  name="projectid" id= "projectid" value= "'.$urlParam['pid'].'">';
    echo ' <input  name="buttonclicked" id= "buttonclicked" value="'.$path.'">';
    echo ' <input  name="urlparam" value="'.$url['query'].'">';
    echo ' </form>';
    echo '<script>document.getElementById("projectPageSelection").submit();</script>';
  }else{
    if($_SESSION['ui_pref'] == 'ri_v3'){
      header("Location: Login/homePage");
    }else{
      header("Location: Login/postlogin");
    }
  }
  exit();
};

$prodFlag = (isset($PRODUCTION_FLAG) && $PRODUCTION_FLAG == true) ? 'true' : 'false';

$formAction = "login/include/login";
if (isset($_GET["redirect"])) {
  $formAction = "login/include/login?redirect=".urlencode($_GET["redirect"]);
}

$htmlProduction = '<head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta http-equiv="X-UA-Compatible" content="ie=edge">
                  <title>Reveron Insights</title>

                  <link href="CSS/signin.css" rel="stylesheet"> 
                  <link rel="shortcut icon" href="revicons.ico" type="image/x-icon" />
                  <link rel="stylesheet" href="JS/JsLibrary/jquery-confirm.min.css">

                  <script src="JS/JsLibrary/jquery-3.5.1.js"></script>
                  <script src="JS/signin.js"></script>
                  <script src="JS/JsLibrary/jquery-confirm.min.js"></script>
                  <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/all.min.css">
                  <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/fontawesome.min.css">
                  <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/solid.min.css">
                  <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/regular.min.css">
                  <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/brands.min.css">

                  </head>

                  <body class="main-container">
                  <div class="container" id="login">
                    <section class="table-box">
                      <div class="tab-panel">
                        <div id="panel1" class="panel active">
                          <div class="tab-pane" role="tabpanel" aria-labelledby="login-tab">
                            <form class="form-group" id="loginForm" action="'.$formAction.'" method="post" autocomplete="off">
                                <div class="row form-group">
                                  <label for="email">Email</label><br>
                                  <input required name="email" id="email" type="email" class="form-control" placeholder="example@domain.com"/>
                                </div>
                                <div class="row form-group">
                                  <label for="password">Password</label><br>
                                  <input required name="password" id="password" type="password" class="form-control" />
                                </div>
                                <div class="row form-group">
                                  <a id="forgot_pw" class="btn-link" href="login/forgotpw"> Forgot Password?</a>
                                </div>
                                <div class="row form-group new_user">
                                  <button type="submit" name="login" class="btn btn-primary">Log In</button>
                                </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  </body>

                  <footer class="footer-distributed">
                  <div class="footer-left">
                    <img src="Images/logo-light.png"/>
                    <p class="footer-links"> <a href="https://reveronconsulting.com/index.html" target="_blank" class="link-1">Home</a> <a href="https://reveronconsulting.com/about.html" target="_blank">About</a> <a href="https://reveronconsulting.com/news.html" target="_blank">News & Events</a> <a href="https://reveronconsulting.com/product_01.html" target="_blank">Products</a> <a href="https://reveronconsulting.com/clients.html" target="_blank">Clients</a> <a href="https://reveronconsulting.com/contact.html" target="_blank">Contact</a> <a href="https://reveronconsulting.com/login.html" target="_blank">Support</a></p>
                    <p class="footer-company-name">Reveron Consulting © 2022</p>
                  </div>
                  <div class="footer-center">
                    <div> <i class="fa fa-map-marker"></i>
                      <p><span>Suite 9-03, Level 9 Wisma E & C,</span> Bukit Damansara, Kuala Lumpur</p>
                    </div>
                    <div> <i class="fa fa-phone"></i>
                      <p>+603 2011 6559</p>
                    </div>
                    <div> <i class="fa fa-envelope"></i>
                      <p><a href="contact.us@reveronconsulting.com">contact.us@reveronconsulting.com</a></p>
                    </div>
                  </div>
                  <div class="footer-right">
                    <p class="footer-company-about"> <span>About the company</span>Delivering measurable business results through an unique value proposition of implementing end-end solutions around Infrastructure Life Cycle Solutions, Enterprise Applications and Enterprise Security. </p>
                    <div class="footer-icons"><a href="https://www.linkedin.com/company/reveron-consulting/" target="_blank"><i class="fa fa-linkedin"></i></a> <a href="https://reveronconsulting.com/login.html" target="_blank"><i class="fa fa-headset"></i></a> </div>
                  </div>
                  </footer>';

$htmlDeveloper = '<head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                  <meta http-equiv="x-ua-compatible" content="ie=edge" />
                  <title>Twinsights</title>
                  <!-- MDB icon -->
                  <link rel="icon" href="Images/icons/login/digile/cropped-digile-icon-1-32x32.png" type="image/x-icon" />
                  <!-- Font Awesome -->
                  <link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
                  <!-- Google Fonts Roboto -->
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"/>
                  <!-- MDB -->
                  <link rel="stylesheet" href="CSS/mdb.min.css" />
                  <!-- Confirm JS -->
                  <link rel="stylesheet" href="JS/JsLibrary/jquery-confirm.min.css" />
                  <!-- CUSTOM THEME -->
                  <link rel="stylesheet" href="CSS/V3/login.css" />
                  </head>
                  <body class="login">
                    <!-- Start your project here-->
                    <section class="vh-100">
                        <div class="container-fluid h-custom">
                          <div class="row d-flex justify-content-center align-items-center h-100">
                            <div class="left-container col-md-9 col-lg-6 col-xl-5 text-center">
                              <div class="img-slider">
                                <div class="img-background">
                                  <h4>Connecting teams, workflows, and data across the entire infrastructure lifecycle</h4>
                                </div>
                                <img src="Images/icons/login/digile/digital-infrastructure-lifestyle.jpg" class="img-custom">
                              </div>
                              <div class="detail-slider d-flex">
                                <div class="left-container  align-items-center justify-content-center">
                                  <img class="img-logo" src="Images/icons/login/digile/digile-logo-white.png">
                                </div>
                                <div class="right-container  d-flex flex-column justify-content-center">
                                  <p class="text-left">We believe that successful business transformation happens when technology strategy is aligned with the business objectives.</p>
                                  <p class="text-left">Follow Us</p>
                                  <ul class="text-left d-flex flex-wrap mb-0">
                                    <li class="mb-2"><a href="https://www.facebook.com/profile.php?id=100083626524797"><img src="Images/icons/login/icon/facebook.png"><span>Facebook</span></a></li>
                                    <li class="mb-2"><a href="https://www.instagram.com/digilespeak/"><img src="Images/icons/login/icon/instagram.png"><span>Instagram</span></a></li>
                                    <li class="mb-2"><a href="https://twitter.com/DigileTechnolo1"><img src="Images/icons/login/icon/twitter.png"><span>Twitter</span></a></li>
                                    <li class="mb-2"><a href="https://www.linkedin.com/company/digiletechnologies/"><img src="Images/icons/login/icon/linkedin.png"><span>LinkedIn</span></a></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div class="right-container card-custom card-flip col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                              <div class="card-front w-100 h-100 d-flex align-items-center">
                                <form class="form-custom" id="loginForm" action="'.$formAction.'" method ="post" autocomplete="off">
                                  <h4 class="mt-2">Login to Twinsights</h4>
                                  <!-- Email input -->
                                  <div class="form-outline mb-4">
                                    <input type="email" id="email" name = "email" class="form-control form-control-lg"
                                      placeholder="Enter a valid email address" />
                                    <label class="form-label" for="email">Email address</label>
                                  </div>
                        
                                  <!-- Password input -->
                                  <div class="form-outline mb-3">
                                    <input type="password" id="password" name ="password" class="form-control form-control-lg"
                                      placeholder="Enter password" />
                                    <label class="form-label" for="password">Password</label>
                                  </div>
                        
                                  <div class="d-flex justify-content-between align-items-center">
                                    <div></div>
                                    <a onclick="onclickForgotPass(this)" id="toReset" class="text-body text-hover">Forgot password?</a>
                                  </div>
                        
                                  <div class="text-center text-lg-start mt-4 pt-2">
                                    <button name = "login" type="submit" class="btn btn-custom btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem;">Login</button>
                                  </div>
                                </form>
                              </div>
                              <div class="card-back d-flex align-items-center" style="width: calc(100% - 1.6rem); height: 90%;">
                                <form class="form-custom" action="login/include/forgot" method="POST" autocomplete="off">
                                  <h4>Reset Password</h4>
                                  <!-- Email input -->
                                  <div class="form-outline mb-4">
                                    <input type="email" id="email" name="email" class="form-control form-control-lg"
                                      placeholder="Enter your registered email address" />
                                    <label class="form-label" for="emailRegister">Email Registered</label>
                                  </div>
                        
                                  <div class="text-center text-lg-start mt-4 pt-2">
                                    <button id = "forgotpw" name = "forgotpw" type="submit" class="btn btn-custom btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem;">Reset</button>
                                  </div>

                                  <div class="d-flex justify-content-end">
                                    <a onclick="onclickForgotPass(this)" id="toLogin" class="text-body text-hover">Login User?</a>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="d-flex flex-column flex-md-row text-center text-md-start justify-content-center py-2 px-2 px-xl-5 bg-custom">
                          <!-- Copyright -->
                          <div class="text-white mb-md-0" style="font-size: 0.8rem">
                            © Copyright <script>document.write(new Date().getFullYear())</script> <a style="color: #ffffff;" href="https://digile.com/" target="_self">Digile Technologies</a>. All Right Reserved.
                          </div>
                          <!-- Copyright -->
                        </div>
                    </section>
                    <!-- End your project here-->

                    <!-- Javascript files -->
                    <script src="Js/JsLibrary/jquery-3.5.1.js"></script>
                    <script src="Js/JsLibrary/jquery-confirm.min.js"></script>
                    <!-- Custom scripts -->
                    <script type="text/javascript" src="JS/login.js"></script>
                    <script type="text/javascript" src="JS/jogetFunctionv3.js"></script>
                    <script type="text/javascript" src="JS/JsLibrary/jogetUtil.js"></script>
                    <!-- MDB -->
                    <script type="text/javascript" src="Js/JsLibrary/mdb.min.js"></script>
                  </body>';


if(isset($PRODUCTION_FLAG) && $PRODUCTION_FLAG == true){
  echo $htmlProduction;
}else{
  echo $htmlDeveloper;
}
?>

<script>
  window.localStorage.clear();

  var prodFlag = '<?php echo $prodFlag; ?>';
    if(prodFlag == 'true'){

        // When the form is submitted
        $('#loginForm').on('submit', function(event) {
          console.log("masuk")
          var password = $('#password').val();

          var encryptedPassword = btoa(password);

          $('#password').val(encryptedPassword);
        });

        document.addEventListener("contextmenu", function(event) {
            event.preventDefault();
        });
    
        document.addEventListener("keydown", function(event) {
            if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I") || (event.ctrlKey && event.shiftKey && event.key === "C") || (event.ctrlKey && event.shiftKey && event.key === "J")) {
                event.preventDefault();
            }
        });
    }
</script>