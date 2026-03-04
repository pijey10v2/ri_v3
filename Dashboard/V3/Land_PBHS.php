<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('land_PBHS', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

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
            <div class="layout threeRow" id="lOne">
                <div class="rowOne M round twoRow">
                    <div class="rowOne-T  roundT">Offer Issued</div>
                    <div class="rowTwo-T roundB twoColumn">
                        <div class="columnOne L" style="border-bottom-left-radius: 5px;" id="offerIssuedChart"></div>
                        <div class="columnTwo S flex">
                            <div class="infoContainer white">
                                <div class="head">Land</div>
                                <span id="offerLand"></span>
                            </div>
                            <div class="infoContainer white">
                                <div class="head">Structure</div>
                                <span id="offerStructure"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M round twoRow">
                    <div class="rowOne-T  roundT">Payment Made</div>
                    <div class="rowTwo-T roundB twoColumn">
                        <div class="columnOne L" style="border-bottom-left-radius: 5px;" id="paymentChart"></div>
                        <div class="columnTwo S flex">
                            <div class="infoContainer white">
                                <div class="head">Land</div>
                                <span id="paymentLand"></span>
                            </div>
                            <div class="infoContainer white">
                                <div class="head">Structure</div>
                                <span id="paymentStructure"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowThree M round twoRow">
                    <div class="rowOne-T  roundT">Demolished</div>
                    <div class="rowTwo-T roundB twoColumn">
                        <div class="columnOne L" style="border-bottom-left-radius: 5px;" id="demolisedChart"></div>
                        <div class="columnTwo S flex">
                            <div class="infoContainer white">
                                <div class="head">Structure</div>
                                <span id="demolishStructure"></span>
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
        <script src="../../JS/dashboard/dashboardv3.js"></script>
    </body>
    
</html>
';

echo $html;

?>
<style type="text/css">

    .showLabel{
        font-size: 10px;
        display: none;
    }

    .highcharts-menu > li{
        list-style: none !important
    }

    .clickableCard {
        cursor:pointer;
    }

    .table-font{
        font-size: 12px !important;
        overflow-y: auto
    }

    @media screen and (min-height: 924px){
        .table-font{
            font-size: 15px !important
        }
    }

    @media screen and (max-width: 1366px){
        .table-font{
            font-size: 12px !important
        }
    }

    .clickableCard{
        cursor: pointer
    }
    
</style>
