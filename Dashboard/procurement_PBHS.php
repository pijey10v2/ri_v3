<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('procurement_PBHS');

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
        <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../CSS/scrollBarCollapse.css">
        <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../JS/scrollBarCollapse.js"></script>  
    </head>
    <body>
        <!--<div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>-->';
        if ($showHeader) {
            $html .= '   
            <div class = "dashboardHeader">
                <div class = "logo">
                    <img src ="'.$dashObj->projectInfo['icon_url'].'">
                </div>
                <div class = "title">
                    <h4>Contract Management Dashboard</h4>
                    <h3>'.$dashObj->projectInfo['project_name'].'</h3>
                </div>
                <div class = "logo right">
                    <img src ="'.$dashObj->projectInfo['icon_url'].'">
                </div>
            </div>';
        }
        $html .= ' 
        <div class = "dashboardBody"';
            if (!$showHeader){
                $html .= ' 
                    style="height: calc(100% - 25px) !important;"
                ';
            }
            $html .= '
        >
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard();">';
                    // load work package options
                    foreach ($dashObj->WPCOptions as $key => $val) {
                        if($key == 'overall') continue;
                        $html .= '<option value="'.$key.'">'.$val.'</option>';
                    }
                        $html .=        '</select>
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
                </div>
            </div>
            <div class="layout twoRow round" id="lOne">
                <div class="rowOne M twoRow">
                    <div class="rowOne-T roundT shadow">CONTRACT DETAILS</div>
                    <div class="rowTwo-T gridContainer roundB shadow" style="overflow: hidden">
                        <div class="infoContainerDiv">
                            <div class="infoContainer reMargin shadow" style="width: 100%;font-size: 11px !important">
                                <div class="head">CONTRACT NAME</div>
                                <div class="body centerMiddle">
                                    <span id="conName"></span> 
                                </div>
                            </div>
                        </div>
                        <div class="infoContainerDiv">
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">CONTRACT SUM</div>
                                <div class="body centerMiddle">
                                    <span id = "contractSum">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">ORIGINAL DURATION</div>
                                <div class="body centerMiddle">
                                    <span id = "conOriDuration">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">RETAINAGE %</div>
                                <div class="body centerMiddle">
                                    <span id = "conRetainage">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">TOTAL IPA AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id = "ttlIpaAmount">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">TOTAL RECEIVED AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id = "ttlRecedAmount">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="infoContainerDiv">
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">REVISED CONTRACT SUM</div>
                                <div class="body centerMiddle">
                                    <span id = "revConSum">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">EXTENSION OF TIME</div>
                                <div class="body centerMiddle">
                                    <span id = "eotGrant">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">CLAIMABLE AMOUNT AFTER RETAINAGE</div>
                                <div class="body">
                                    <span id = "claimAmountAfterRetainage">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">TOTAL CERTIFIED AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id = "ttlRecomAmount">0</span>
                                </div>
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">REMAINING CLAIMABLE AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id = "balClaimAmount">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="infoContainerDiv">
                            <div class="infoContainer transparent">
                            </div> 
                            <div class="infoContainer transparent">
                            </div>
                            <div class="infoContainer reMargin shadow" style="font-size: 11px !important">
                                <div class="head">REVISED DURATION</div>
                                <div class="body centerMiddle">
                                    <span id = "revDuration">0</span>
                                </div>
                            </div>
                            <div class="infoContainer transparent">
                            </div>
                            <div class="infoContainer transparent">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo M twoRow">
                    <div class="rowOne-T roundT shadow">INTERIM PAYMENT</div>
                    <div class="rowTwo-T twoColumn tableContainer roundB scroll-content" style="display: block">
                        <table id="incidentTb" class="">
                            <thead style="position: sticky;" id ="" class="procurement">
                                <tr>
                                    <th colspan="3" class="lightbluePastel interimHeader1" scope="colgroup" style="text-align:center; border: 1px solid white">PAYMENT CLAIM</th>
                                    <th colspan="5" class="bluePastel" scope="colgroup" style="text-align:center;  border: 1px solid white">PAYMENT CERTIFIED AND RECEIVED</th>
                                </tr>
                                <tr>
                                    <th class="secondRow lightbluePastel interimHeader2" scope="col" style="text-align:center; border: 1px solid white;">Interim Payment Application</th>
                                    <th class="secondRow lightbluePastel" scope="col" style="text-align:center; border: 1px solid white;">For Period Ending</th>
                                    <th class="secondRow lightbluePastel" scope="col" style="text-align:center; border: 1px solid white;">Nett IPA Amount</th>
                                    <th class="secondRow bluePastel" scope="col" style="text-align:center; border: 1px solid white;">Client Interim Payment Certificate</th>
                                    <th class="secondRow bluePastel" scope="col" style="text-align:center; border: 1px solid white;">Certified Payment Date</th>
                                    <th class="secondRow bluePastel" scope="col" style="text-align:center; border: 1px solid white;">Certified Payment Amount</th>
                                    <th class="secondRow greenPastel" scope="col" style="text-align:center; border: 1px solid white;">Date of Payment Received for Client</th>
                                    <th class="secondRow greenPastel" scope="col" style="text-align:center; border: 1px solid white;">Nett Amount Received for Client</th>
                                </tr>
                            </thead>
                            <tbody id="claimTbBody" class="procurement" style="text-align: middle;">
                            </tbody>
                            <thead style="position: sticky;" id ="" class="procurement">
                                <tr>
                                    <th class="secondRowBottom lightbluePastel otherInterimHeader" colspan="2" scope="colgroup" style="text-align:right; border: 1px solid white">Total (MYR)</th>
                                    <th class="secondRowBottom lightbluePastel" colspan="1" id = "totalCumulClaim" scope="colgroup" style="text-align:center; border: 1px solid white">0</th>
                                    <th class="secondRowBottom bluePastel" colspan="2" scope="colgroup" style="text-align:right; border: 1px solid white">Total (MYR)</th>
                                    <th class="secondRowBottom bluePastel" colspan="1" id = "totalRecommendAmount" scope="colgroup" style="text-align:center; border: 1px solid white">0</th>
                                    <th class="secondRowBottom greenPastel" colspan="1" scope="colgroup" style="text-align:right; border: 1px solid white">Total (MYR)</th>
                                    <th class="secondRowBottom greenPastel" colspan="1" id = "totalReceivedClaimAmount" scope="colgroup" style="text-align:center; border: 1px solid white">0</th>
                                </tr>
                                <tr>
                                    <th class="bottom lightbluePastel otherInterimHeader" colspan="2" scope="colgroup" style="text-align:right; border: 1px solid white">Percentage (%)</th>
                                    <th class="bottom lightbluePastel" colspan="1" scope="colgroup" id = "percentCumulClaim" style="text-align:center; border: 1px solid white">0</th>
                                    <th class="bottom bluePastel" colspan="2" scope="colgroup" style="text-align:right; border: 1px solid white">Percentage (%)</th>
                                    <th class="bottom bluePastel" colspan="1" scope="colgroup" id = "percentRecommendAmount" style="text-align:center; border: 1px solid white">0</th>
                                    <th class="bottom greenPastel" colspan="1" scope="colgroup" style="text-align:right; border: 1px solid white">Percentage (%)</th>
                                    <th class="bottom greenPastel" colspan="1" scope="colgroup" id = "percentReceivedClaimAmount" style="text-align:center; border: 1px solid white">0</th>
                                </tr>
                            </thead>
                        </table>
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
</html>
';

echo $html;
?>

<style type="text/css">
    .white{
        background: white !important;
    }
    .greenPastel{
        background: #C5E0B3 !important;
        color: black !important;
    }
    .bluePastel{
        background: #B4C6E7 !important;
        color: black !important;
    }
    .lightbluePastel{
        background: #BDD6EE !important;
        color: black !important;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .gridContainer{
        display: grid;
        grid-template-rows: repeat(4, 1fr);
    }
    .gridContainerColumn{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }
    .reMargin{
        margin: 5px !important;
    }
    .infoContainer > .head {
        font-size: 11px !important;
    }
    .showLabel{
        font-size: 10px;
        display: none;
    }
</style>
