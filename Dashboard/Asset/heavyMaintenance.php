<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('heavyMaintenance');
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
                </div>
            </div>
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M twoRow" style="margin-right: 10px; width: calc(50% - 10px);">
                        <div class="rowOne SM twoColumn">
                            <div class="columnOne M shadow">
                                <div class="rowOne-T roundT">PAVEMENT</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>Total Budget Amount</td>
                                                    <td id="ttlBudgetPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Contract Amount</td>
                                                    <td id="ttlContractPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Amount Claimed</td>
                                                    <td id="ttlClaimPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Claim Amount</td>
                                                    <td id="ttlRemainClaimPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Budget Amount</td>
                                                    <td id="ttlRemainBudgetPave">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M shadow">
                                <div class="rowOne-T roundT">NON PAVEMENT</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>Total Budget Amount</td>
                                                    <td id="ttlBudgetNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Contract Amount</td>
                                                    <td id="ttlContractNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Amount Claimed</td>
                                                    <td id="ttlClaimNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Claim Amount</td>
                                                    <td id="ttlRemainClaimNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Budget Amount</td>
                                                    <td id="ttlRemainBudgetNonPave">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo ML twoRow">
                            <div class="rowOne M">
                                <div class="rowOne-T roundT shadow">WORK ORDER</div>
                                <div class="rowTwo-T roundB shadow" id ="woChartParent"></div>
                            </div>
                            <div class="rowTwo M">
                                <div class="rowOne-T roundT shadow">WORK ORDER BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="woStatusChartParent"></div>
                            </div>
                        </div>
                    </div>
                    <div class="colummTwo M twoRow">
                        <div class="rowOne SM twoColumn">
                            <div class="columnOne M shadow">
                                <div class="rowOne-T roundT">BRIDGE</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>Total Budget Amount</td>
                                                    <td id="ttlBudgetBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Contract Amount</td>
                                                    <td id="ttlContractBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Amount Claimed</td>
                                                    <td id="ttlClaimBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Claim Amount</td>
                                                    <td id="ttlRemainClaimBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Budget Amount</td>
                                                    <td id="ttlRemainBudgetBr">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M shadow">
                                <div class="rowOne-T roundT">SLOPE</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>Total Budget Amount</td>
                                                    <td id="ttlBudgetSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Contract Amount</td>
                                                    <td id="ttlContractSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Amount Claimed</td>
                                                    <td id="ttlClaimSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Claim Amount</td>
                                                    <td id="ttlRemainClaimSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Remaining Budget Amount</td>
                                                    <td id="ttlRemainBudgetSlp">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo ML twoRow">
                        <div class="rowOne M">
                            <div class="rowOne-T roundT shadow">CLAIM BY ASSET GROUP</div>
                            <div class="rowTwo-T roundB shadow" id ="claimChartStatusParent"></div>
                        </div>
                            <div class="rowTwo M">
                                <div class="rowOne-T roundT shadow">CLAIM BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="claimChartParent"></div>
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
</style>
