<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('statistic');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$projectName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
$fullName = 'Asset Statistic';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">              <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  
    </head>
    <body class='.$themeClass.'>
        <h4 id="printHeader">'.$fullName.' - '.$projectName.'</h4>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne">
                <div class="rowOne M twoRow">
                    <div class="rowOne S twoColumn">
                        <div class="columnOne S twoRow">
                            <div class="rowOne-T roundT shadow">TOTAL LENGTH</div>
                            <div class="rowTwo-T roundB shadow infoContainerDiv">
                                <div class="infoContainerBox">
                                    <div class="head" id="divTitle">'.((!$dashObj->isWPC) ? 'OVERALL' : 'DIVISION').'</div>
                                    <div class="centerMiddle">
                                        <span id="ttlLength">0</span> KM
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo L twoRow" style="">
                            <div class="rowOne-T roundT shadow">TOTAL ASSET BY TYPE</div>
                            <div class="rowTwo-T roundB shadow infoContainerDiv">
                                <div class="infoContainerBox flexRow">
                                    <div>
                                        <img src="../../Images/icons/dashboard/asset/Bridge.png">
                                    </div>
                                    <div>
                                        <div class="head">BRIDGE</div>
                                        <div class="centerMiddle">
                                            <span id="allBridge">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="infoContainerBox flexRow">
                                    <div>
                                        <img src="../../Images/icons/dashboard/asset/Culvert.png">
                                    </div>
                                    <div>
                                        <div class="head">CULVERT</div>
                                        <div class="centerMiddle">
                                            <span id="allCulvert">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="infoContainerBox flexRow">
                                    <div>
                                        <img src="../../Images/icons/dashboard/asset/Drainage.png">
                                    </div>
                                    <div>
                                        <div class="head">DRAINAGE</div>
                                        <div class="centerMiddle">
                                            <span id="allDrainage">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="infoContainerBox flexRow">
                                    <div>
                                        <img src="../../Images/icons/dashboard/asset/Pavement.png">
                                    </div>
                                    <div>
                                        <div class="head">PAVEMENT</div>
                                        <div class="centerMiddle">
                                            <span id="allPave">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="infoContainerBox flexRow">
                                    <div>
                                        <img src="../../Images/icons/dashboard/asset/RoadFurniture.png">
                                    </div>
                                    <div>
                                        <div class="head">ROAD FURNITURE</div>
                                        <div class="centerMiddle">
                                            <span id="allRoad">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="infoContainerBox flexRow">
                                    <div>
                                        <img src="../../Images/icons/dashboard/asset/Slope.png">
                                    </div>
                                    <div>
                                        <div class="head">SLOPE</div>
                                        <div class="centerMiddle">
                                            <span id="allSlope">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="infoContainerBox flexRow">
                                    <div>
                                        <img src="../../Images/icons/dashboard/asset/Electrical.png">
                                    </div>
                                    <div>
                                        <div class="head">ELECTRICAL</div>
                                        <div class="centerMiddle">
                                            <span id="allElectric">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo L twoColumn">
                        <div class="columnOne ML twoRow">
                            <div class="rowOne-T roundT shadow" id = "titleBarChartAsset"></div>
                            <div class="rowTwo-T fourRow roundB shadow" id = "barChartAsset"></div>
                        </div>
                        <div class="columnTwo SM twoRow">
                            <div class="rowOne-T roundT shadow">ROAD FURNITURE BY TYPE</div>
                            <div class="rowTwo-T fourRow roundB shadow" id = "rfByType"></div>
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
    h4{
        text-align: center;
    }
    .white{
        background: white !important;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .flexColumn{
        display: flex !important;
        justify-content: center;
        flex-direction: column;
    }
    .showLabel{
        display: none;
        word-wrap: break-word
    }
    .clickableCard {
        cursor:pointer;
    }
    #printHeader{
        color: var(--on-surface);
        display: none;
    }

    @media print{
        img{
            width: 30px !important;
            height: 30px !important;
        }

        .centerMiddle span{
            font-size: 14px !important;
        }

        #printHeader{
            display: block
        }
    }
</style>
