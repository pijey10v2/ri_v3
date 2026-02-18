<?php
$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="CSS/V3/home.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="CSS/V3/Wizard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="CSS/V3/dashboard.css">           <!--     CSS for dashboard CSS-->
        <link rel="stylesheet" href="CSS/V3/systemAdmin.css">           <!--     CSS for dashboard CSS-->
        <link rel="stylesheet" href="CSS/jquery.scrollbar.css">
        <script src="JS/JsLibrary/jquery-3.5.1.js"></script>          <!--     JS for jquery-->
        <script src="JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src="JS/sysadminv3.js"></script>
        <script type="text/javascript" src="JS/fontawesome.js"></script>
    </head>';
    $themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
    echo '
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne">
                <div class="rowOne M twoColumn">
                    <div class="columnOne ML twoRow">
                        <div class="rowOne M round background twoColumn">
                            <div class="columnOne SM">
                                <div class="contentContainer flex">
                                    <p class="menuTitle">User</p>
                                    <div class="labelContainer">
                                        <i class="fa-duotone fa-shield-check" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                        <div>Active User</div>
                                    </div>
                                    <div class="labelContainer">
                                        <i class="fa-duotone fa-shield-xmark" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                        <div>Inctive User</div>
                                    </div>
                                    <div class="labelContainer">
                                        <i class="fa-duotone fa-user-plus" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                        <div>Add User</div>
                                    </div>
                                    <div class="labelContainer">
                                        <i class="fa-duotone fa-inbox-out" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                        <div>Export User</div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo ML">
                                <div class="contentContainer">
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M round background twoColumn">
                                <div class="columnOne SM">
                                    <div class="notiContainer">
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><img src="Images/icons/sysAdmin/clock.png"><img class="blue" src="Images/icons/sysAdmin/circle.png">
                                                Duration
                                            </span>
                                            <span>11 Projects not set with project duration</span>
                                        </div>
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><img src="Images/icons/sysAdmin/question.png"><img class="blue" src="Images/icons/sysAdmin/circle.png">
                                                Missing
                                            </span>
                                            <span>11 Projects are missing</span>
                                        </div>
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><img src="Images/icons/third_button/user.png"><img class="blue" src="Images/icons/sysAdmin/circle.png">
                                                User
                                            </span>
                                            <span>11 Projects with no user defined</span>
                                        </div>
                                        <div class="notiLabel">
                                            <span class="notiSmallLabel"><img src="Images/icons/sysAdmin/settings.png"><img class="blue" src="Images/icons/sysAdmin/circle.png">
                                                Admin
                                            </span>
                                            <span>11 Projects has no admin</span>
                                        </div>
                                    </div>
                                <div class="contentContainer flex">
                                    <p class="menuTitle">Project <img id="notiMessage" class="alert" src="Images/icons/third_button/danger.png"></p>
                                    <div class="labelContainer">
                                        <i class="fa-duotone fa-file-circle-check" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                        <div>Active Projects</div>
                                    </div>
                                    <div class="labelContainer">
                                        <i class="fa-duotone fa-file-circle-plus" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                        <div>New Project</div>
                                    </div>
                                    <div class="labelContainer">
                                    <i class="fa-duotone fa-file-lines" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                        <div>Archived Projects</div>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo ML">
                                <div class="contentContainer">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo SM twoRow">
                        <div class="rowOne M round background">
                            <div class="contentContainer flex">
                                <p class="menuTitle">Account</p>
                                <div class="flexRow">
                                    <div class="w50 flex">
                                        <div class="labelContainer">
                                            <i class="fa-duotone fa-user" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Name</span>
                                                <span class="textEllipsis">Dionnald</span>
                                            </div>
                                        </div>
                                        <div class="labelContainer">
                                            <i class="fa-duotone fa-address-book" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Name</span>
                                                <span class="textEllipsis">1234</span>
                                            </div>
                                        </div>
                                        <div class="labelContainer">
                                            <i class="fa-duotone fa-phone" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Number</span>
                                                <span class="textEllipsis">Dionnald</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w50 flex">
                                        <div class="labelContainer">
                                            <i class="fa-duotone fa-fingerprint" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"s></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">ID</span>
                                                <span class="textEllipsis">Dionnald</span>
                                            </div>
                                        </div>
                                        <div class="labelContainer">
                                            <i class="fa-duotone fa-envelope" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Email</span>
                                                <span class="textEllipsis">1234</span>
                                            </div>
                                        </div>
                                        <div class="labelContainer">
                                            <i class="fa-duotone fa-briefcase" style="--fa-primary-opacity: 0.6; --fa-secondary-opacity: 1; --fa-primary-color: #1e88e5; --fa-secondary-color: #1e88e5;"></i>
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Contact Person Position</span>
                                                <span class="textEllipsis">Dionnald</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo M round background marginTop">
                            <div class="contentContainer flex">
                                <p class="menuTitle">License</p>
                                <div class="flexRow">
                                    <div class="w50 flex">
                                        <div class="labelContainer">
                                            <img src="Images/icons/sysAdmin/contract.png">
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">License Type</span>
                                                <span class="textEllipsis">Reveron Insights Contstruct</span>
                                            </div>
                                        </div>
                                        <div class="labelContainer">
                                            <img src="Images/icons/admin_page/profile/start.png">
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">License Start</span>
                                                <span class="textEllipsis">12-2-2012</span>
                                            </div>
                                        </div>
                                        <div class="labelContainer">
                                            <img src="Images/icons/admin_page/profile/duration.png">
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Licesnce Duration</span>
                                                <span class="textEllipsis">200 Days</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w50 flex">
                                        <div class="labelContainer">
                                            <img src="Images/icons/sysAdmin/internet.png">
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">Hosting Type</span>
                                                <span class="textEllipsis">On-Premise</span>
                                            </div>
                                        </div>
                                        <div class="labelContainer">
                                            <img src="Images/icons/admin_page/profile/end.png">
                                            <div class="twoLabel">
                                                <span class="textEllipsis headerTitle">License End</span>
                                                <span class="textEllipsis">12-2-2022</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="loader" style="display:none;">
            <div class="cube-wrapper">
                <div class="cube-folding">
                    <span class="leaf1"></span>
                    <span class="leaf2"></span>
                    <span class="leaf3"></span>
                    <span class="leaf4"></span>
                </div>
                <span class="loading" data-name="Loading">Working</span>
            </div>
        </div>
    </body>
</html>';

echo $html;

?>

<style type="text/css">
    .main-div {
        height: 100%;
    }

    .white {
        background: white !important;
    }

    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .marginTop{
        margin-top: 10px !important;
    }
</style>