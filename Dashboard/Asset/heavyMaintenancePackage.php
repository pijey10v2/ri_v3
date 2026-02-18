<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('heavyMaintenancePackage');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

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

        <script src="https://code.highcharts.com/modules/heatmap.js"></script>
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
                <h4>PERIODIC MAINTENANCE</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../../Images/Logo_JKR.png">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter"  style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Division</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" onclick="refreshDashboard()">'.$val.'</option>';
                            }
                            $html .= '
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
                    <div class="filter">
                        <label>Asset Group</label><br>
                        <select onchange="refreshDashboard()" id = "assetGroupFilter">
                            <option value="all">---</option>
                            <option value="Pavement">Pavement</option>
                            <option value="Non Pavement">Non Pavement</option>
                            <option value="Bridge">Bridge</option>
                            <option value="Slope">Slope</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoRow">
                    <div class="rowOne M twoRow">
                        <div class="rowOne SM infoContainerDiv">
                            <div class="infoContainer round shadow" style="margin-left: 0px;">
                                <div class="head">TOTAL CONTRACT AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id="amtContract">RM 0</span>
                                </div>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL AMOUNT CLAIMED</div>
                                <div class="body centerMiddle">
                                    <span id="amtClaim">RM 0</span>
                                </div>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">REMAINING AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id="amtRemain">RM 0</span>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo ML threeColumn" style="margin-top: 0; padding-bottom: 5px;">
                            <div class="columnOne M twoRow">
                                <div class="rowOne-T roundT shadow">WORK ORDER</div>
                                <div class="rowTwo-T roundB shadow" id ="woChart"></div>
                            </div>
                            <div class="columnTwo M twoRow">
                                <div class="rowOne-T roundT shadow">WORK ORDER BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="woChartStatus"></div>
                            </div>
                            <div class="columnTwo M twoRow">
                                <div class="rowOne-T roundT shadow">CLAIM BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="claimChart"></div>
                            </div>
                        </div>
                    </div>
                    <div class="rowOne M twoRow round shadow">
                        <div class="rowOne-T roundT">WORK ORDER RECORD</div>
                        <div class="rowTwo-T roundB">
                            <div class="rowTwo-T tableContainer scrollbar-inner roundB">
                                <table id ="" class=""> 
                                    <thead>
                                        <th style="background: #0B364D;">Asset Type</th>
                                        <th style="background: #0B364D;">Contract No.</th>
                                        <th style="background: #0B364D;">Contract Name</th>
                                        <th style="background: #0B364D;">Contract Amount</th>
                                        <th style="background: #0B364D;">WO Ref</th>
                                        <th style="background: #0B364D;">WO Activity</th>
                                        <th style="background: #0B364D;">WO Amount</th>
                                        <th style="background: #0B364D;">WO Duration</th>
                                        <th style="background: #0B364D;">Status</th>
                                        <th style="background: #0B364D;">No of RFI</th>
                                        <th style="background: #0B364D;">No of NCP</th>
                                    </thead>
                                    <tbody id="wo_record_package">
                                    </tbody>
                                </table>
                            </div>
                            <div class="rowOne-T bottomIndicator">
                                <!--<span class="condGreen" style="padding-right: 10px"> Delay</span>
                                <span class="condRed"> Following</span>-->
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
    .purple{
        background: purple !important;
    }
    .small{
        margin: auto 15px !important;
    }
    .bold{
        font-weight: bold !important;
    }
    .infoContainer > div,span{
        cursor: default;
    }
    .centerMiddle {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bottomIndicator {
        background: white !important;
        border-radius: 0px 0px 8px 8px;
        color: black !important;
        font-weight: unset !important;
    }
    .condGreen:before {
        content: "";
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: inline-block;
        background-color: #52BE80;
        vertical-align: sub;
        margin-right: 3px;
    }
    .condRed:before {
        content: "";
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: inline-block;
        background-color: #E93232;
        vertical-align: sub;
        margin-right: 3px;
    }
    .condYellow:before {
        content: "";
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: inline-block;
        background-color: #F4D03F;
        vertical-align: sub;
        margin-right: 3px;
    }

    @media screen and (min-height: 924px){
        .condGreen:before {
            content: "";
            width: 14px;
            height: 14px;
        }
        .condRed:before {
            content: "";
            width: 14px;
            height: 14px;
        }
        .condYellow:before {
            content: "";
            width: 14px;
            height: 14px;
        }
    }
    @media screen and (max-width: 1366px){
        .condGreen:before {
            content: "";
            width: 11px;
            height: 11px;
        }
        .condRed:before {
            content: "";
            width: 11px;
            height: 11px;
        }
        .condYellow:before {
            content: "";
            width: 11px;
            height: 11px;
        }
    }
</style>
