<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('publicComplaint_SSLR2', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
//TO DO
$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout oneRow round" id="lOne">
                <div class="rowOne twoRow">
                    <div class="rowOne XS round infoContainerDiv">
                        <div class="infoContainer round" margin:0 2.5px;">
                            <div class="head" style="font-weight: bold;">TOTAL PUBLIC COMPLAINT</div>
                            <div class="body centerMiddle">
                                <span id = "totalPBC">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round" margin:0 2.5px;">
                            <div class="head" style="font-weight: bold;">CLOSED</div>
                            <div class="body centerMiddle">
                                <span id = "totalPBCclose">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round" margin:0 0 0 2.5px;">
                            <div class="head" style="font-weight: bold;">OPEN</div>
                            <div class="body centerMiddle">
                                <span id = "totalPBCopen">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo XL twoRow round twoColumn">
                        <div class="columnOne M twoRow">
                            <div class="rowOne-T roundT">PUBLIC COMPLAINT CATEGORY</div>
                            <div class="rowTwo-T roundB" id="catgPBC">
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne-T roundT">PUBLIC COMPLAINT TYPE</div>
                            <div class="rowTwo-T roundB" id="typePBC">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="../../JS/dashboard/dashboardv3.js"></script>
    </body>
</html>
';

echo $html;
?>

<style type="text/css">
    .white{
        background: white !important;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .clickableCard {
        cursor:pointer;
    }
    .showLabel{
        display: none;
    }
</style>
