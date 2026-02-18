<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('statistic');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$text = ($dashObj->isWPC) ? 'TOTAL ASSET WITH TYPE BY SECTION' : 'TOTAL ASSET WITH TYPE FOR OVERALL';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeader">
            <div class = "logo">
                <img src ="../'.$dashObj->projectInfo['icon_url'].'">
            </div>
            <div class = "title">
                <h4>Asset Statistic</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../../Images/Logo_JKR.png">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne" '.(($dashObj->isWPC) ? 'style="width:98%;"' : '').'">
                <div class="rowOne M twoRow">
                    <div class="rowOne S twoColumn">
                        <div class="columnOne S twoRow">
                            <div class="rowOne-T roundT shadow">TOTAL LENGTH</div>
                            <div class="rowTwo-T roundB shadow infoContainerDiv">
                                <div class="infoContainerBox">
                                    <div class="head" id="divTitle">'.(($dashObj->isWPC) ? 'DIVISION' : 'OVERALL').'</div>
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
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo L twoColumn">
                        <div class="columnOne ML twoRow">
                            <div class="rowOne-T roundT shadow" id = "titleBarChartAsset">'.$text.'</div>
                            <div class="rowTwo-T fourRow roundB shadow" id = "barChartAsset"></div>
                        </div>
                        <div class="columnTwo SM twoRow">
                            <div class="rowOne-T roundT shadow">ROAD FURNITURE BY TYPE</div>
                            <div class="rowTwo-T fourRow roundB shadow" id = "rfByType"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="minimizeButton active" id="minimizeButton" style="display:'.(($dashObj->isWPC) ? 'none' : 'flex').';">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>
        </div>

        <script src="../../JS/dashboard/dashboard.js"></script>
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
        display: none
    }
</style>
