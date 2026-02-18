<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('GeneralManagement');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne" '.(($dashObj->isWPC) ? 'style="width:98%;"' : '').'"> 
                <div class="columnOne twoColumn sss">
                    <div class="columnOne M twoRow flex">
                        <div class="rowOne M">
                            <div class="infoContainer round shadow">
                                <div class="head roundT">TOTAL PUBLIC COMPLAINT</div>
                                <span id="TotalPublicComplaintCard">0</span>
                            </div>
                        </div>
                        <div class="rowTwo M">
                            <div class="infoContainerDiv">
                                <div class="infoContainer round shadow">
                                    <div class="head roundT ">CLOSED</div>
                                    <span id="ClosedCard">0</span>
                                </div>
                                <div class="infoContainer round shadow">
                                    <div class="head roundT">OPEN</div>
                                    <span id="OpenCard">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo L">
                        <div class="rowOne-T roundT">PUBLIC COMPLAINT FORM</div>
                        <div class="dash-charts rowTwo-T roundB" id="PublicComplaintFormChart"></div>               
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
        <script src="../../JS/dashboard/dashboardv3.js"></script>
    </body>
</html>';

echo $html;

?>

<style type="text/css">
    .rowOne-T{
        background: #002171;
        height: 20px;
        line-height: 20px;
        color: white;
        text-align: center;
        overflow: hidden;
        font-size: 12px;
    }
</style>