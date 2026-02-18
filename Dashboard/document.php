<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('document');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">
        <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">
        <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
if ($showHeader) {
    $html .= '        
        <div class = "dashboardHeader">
            <div class = "logo">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
            <div class = "title">
                <h4>DOCUMENT MANAGEMENT DASHBOARD</h4>
                <h3 style="text-align: center;">'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
        </div>';
}
    $html .= ' <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Section</label><br>
                        <select id="sectionFilter" onchange="refreshDashboard()">
                        </select>
                    </div>
                    <div class="filter">
                        <label>Year</label><br>
                        <select onchange="refreshDashboard()" id = "yearFilter">
                            <option value="all">---</option>';
                            foreach ($dashObj->yearOptions['overall'] as $year) {
                                $html .= '<option value="'.$year.'">'.$year.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Month</label><br>
                        <select onchange="refreshDashboard()" id = "monthFilter" disabled>
                            <option value="all">---</option>
                            <option value="Jan">January</option>
                            <option value="Feb">February</option>
                            <option value="Mar">March</option>
                            <option value="Apr">April</option>
                            <option value="May">May</option>
                            <option value="Jun">June</option>
                            <option value="Jul">July</option>
                            <option value="Aug">August</option>
                            <option value="Sep">September</option>
                            <option value="Oct">October</option>
                            <option value="Nov">November</option>
                            <option value="Dec">December</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne">
                <div class="columnOne twoRow main-div">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M twoRow">
                            <div class="rowOne-T round">DOCUMENT</div>
                            <div class="rowTwo-T threeColumn transparent spacerTop">
                                <div class="columnOne L round shadow">
                                    <div class="rowOne-T roundT">DOCUMENT TYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="numOfDocumentByType"></div>
                                </div> 
                                <div class="columnTwo M round shadow white">
                                    <div class="infoContainer round shadow">
                                        <div class="rowOne-T roundT">TOTAL DOCUMENT</div>
                                        <span id="DocumentCard">0</span>
                                    </div>
                                </div>
                                <div class="columnThree L twoRow round shadow">
                                    <div class="rowOne-T roundT">DOCUMENT SUBTYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="typeOfdocument"></div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne-T round">DRAWING</div>
                            <div class="rowTwo-T twoColumn transparent spacerTop">
                                <div class="columnOne M twoRow round shadow">
                                    <div class="rowOne-T roundT">DRAWING STATUS</div>
                                    <div class="dash-charts rowTwo-T roundB" id="drawingRevisionChart"></div>
                                </div>
                                <div class="columnTwo M twoRow round shadow">
                                    <div class="rowOne-T roundT">DRAWING TYPE</div>
                                    <div class="dash-charts rowTwo-T roundB" id="drawingTypeChart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoRow">
                        <div class="rowOne-T round">CORRESPONDENCE</div>
                        <div class="rowTwo-T twoColumn transparent">
                            <div class="columnOne M twoColumn" style = "margin-top:10px; height:calc(100% - 10px)">
                                <div class = "columnOne M twoRow round shadow">
                                    <div class="rowOne-T roundT">THIRD PARTY</div>
                                    <div class="dash-charts rowTwo-T roundB" id="corrTypeChart"></div>
                                </div>
                                <div class = "columnTwo M round shadow flex white">
                                    <div class="infoContainer round shadow">
                                        <div class="head black">TOTAL CORRESPONDENCE</div>
                                        <span id="CorrespondenceTotalCard">0</span>
                                    </div>          
                                    <div class="infoContainer round shadow">
                                        <div class="head black">INCOMING THIRD PARTY</div>
                                        <span id="CorrespondenceIncCard">0</span>
                                    </div>
                                    <div class="infoContainer round shadow">
                                        <div class="head black">OUTGOING THIRD PARTY</div>
                                        <span id="CorrespondenceOutCard">0</span>
                                    </div>
                                    <div class="infoContainer round shadow">
                                        <div class="head black">INTERNAL</div>
                                        <span id="InternalInCard">0</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="columnTwo M twoRow round" style = "margin-top:10px; height:calc(100% - 10px)">
                                <div class = "rowOne-T round">CORRESPONDENCE STATUS</div>
                                <div class = "rowTwo-T roundB twoColumn transparent">
                                    <div class = "columnOne M twoRow round shadow" style = "margin-top:10px; height:calc(100% - 10px)">
                                        <div class = "rowOne-T roundT">INTERNAL</div>
                                        <div class = "rowTwo-T roundB dash-charts" id="statusInternal">
                                        </div>
                                    </div>
                                    <div class = "columnTwo M twoRow round shadow" style = "margin-top:10px; height:calc(100% - 10px)">
                                        <div class = "rowOne-T roundT">THIRD PARTY</div>
                                        <div class = "rowTwo-T roundB dash-charts" id="statusThird">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="minimizeButton active" id="minimizeButton">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>
        </div>

        <script src="../JS/dashboard/dashboard.js"></script>
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
    .showLabel{
        font-size: 10px;
        display: none;
    }
</style>