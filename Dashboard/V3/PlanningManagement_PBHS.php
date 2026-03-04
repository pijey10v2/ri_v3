<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('PlanningManagement', false, 0);

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
            <div class="layout oneRow round" id="lOne">
                <div class="rowOne twoColumn">
                    <div class="columnOne S round twoRow">
                        <div class="rowOne SM infoContainerDiv round column">
                            <div class="infoContainer full round" style="margin:0 2.5px;">
                                <div class="head" style="font-weight: bold;">TOTAL REPORT</div>
                                <div class="body centerMiddle">
                                    <span id = "totalReport">0</span>
                                </div>
                            </div>
                            <div class="infoContainer full round" style="margin:0 2.5px;">
                                <div class="head" style="font-weight: bold;">CLOSED</div>
                                <div class="body centerMiddle">
                                    <span id = "totalReportclose">0</span>
                                </div>
                            </div>
                            <div class="infoContainer full round" style="margin:0 0 0 2.5px;">
                                <div class="head" style="font-weight: bold;">PENDING</div>
                                <div class="body centerMiddle">
                                    <span id = "totalReportopen">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo ML">
                            <div class="tableContainer round background">
                                <table>
                                    <thead id="tblHeader">
                                    </thead>
                                    <tbody id="rsInfoMonthly">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo L twoRow round">
                        <div class="rowOne-T roundT">Report Category</div>
                        <div class="rowTwo-T roundB dash-charts risk-charts" id="categoryReport">

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
    .white{
        background: white !important;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

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
    .tableContainer{
        width: 100%;
    }
    .infoContainerDiv{
        justify-content: space-evenly !important;
    }
</style>
