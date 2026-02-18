<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('procurement', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}
$showFilter = false;
if (isset($_GET['digitalReporting']) && $_GET['digitalReporting'] == 1) {
    $showFilter = true;
}

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  
    </head>
    <body class='.$themeClass.'>';
        $html .= ' 
        <div class = "dashboardBody"';
            if (!$showHeader){
                $html .= ' 
                    style="height: calc(100% - 25px) !important;"
                ';
            }
            $html .= '
        >';
            if($showFilter){
                $html .='
                    <div class="sidebar" style="display:block;">
                        <div class="filterContainer">
                            <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                                <label>Work Package</label><br>
                                <select id="wpcFilter" onchange="refreshDashboard();">
                                    <option value="overall">Overall</option>
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
                        </div>
                    </div>
                    <div class="minimizeButton active" id="minimizeButton" style="display:flex;">
                        <div class="lines"></div>
                        <div class="lines"></div>
                    </div>
                ';
            }
            $html .= '
            <div class="layout oneRow" id="lOne"';
            if($showFilter){
                $html.='
                    style="width: calc(80% - 12px);"
                ';
            }
            $html .='
            >
                <div class="columnOne twoRow main-div">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M twoRow">
                            <div class="rowOne-T roundT shadow">CONTRACT DETAILS</div>
                            <div class="rowTwo-T threeRow roundB shadow">
                                <div class="rowOne M infoContainerDiv procurement">
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">CONTRACT SUM</div>
                                        <div class="body centerMiddle">
                                            <span id = "contractSum">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">TOTAL IPA AMOUNT</div>
                                        <div class="body centerMiddle">
                                            <span id = "ttlIpaAmount">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">TOTAL RECEIVED AMOUNT</div>
                                        <div class="body centerMiddle">
                                            <span id = "ttlRecedAmount">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M infoContainerDiv procurement">
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">REVISED CONTRACT SUM</div>
                                        <div class="body centerMiddle">
                                            <span id = "revConSum">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">TOTAL RECOMMENDED AMOUNT</div>
                                        <div class="body centerMiddle">
                                            <span id = "ttlRecomAmount">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">REMAINING CLAIMABLE AMOUNT</div>
                                        <div class="body centerMiddle">
                                            <span id = "balClaimAmount">0</span>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M twoRow">
                            <div class="rowOne-T roundT shadow">SECTION - CONTRACT DETAILS</div>
                            <div class="rowTwo-T fourRow roundB shadow">
                                <div class="rowOne M infoContainerDiv procurement">
                                    <div class="infoContainer procurement reMargin shadow" style="width: 100%;">
                                        <div class="head">CONTRACT NAME</div>
                                        <div class="body centerMiddle">
                                            <span class="text-wrap" id="conName"></span> 
                                        </div>
                                    </div>
                                </div>
                                <div class="rowTwo M infoContainerDiv procurement">
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">ORIGINAL DURATION</div>
                                        <div class="body centerMiddle">
                                            <span id = "conOriDuration">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">RETAINAGE %</div>
                                        <div class="body centerMiddle">
                                            <span id = "conRetainage">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowThree M infoContainerDiv procurement">
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">EOT GRANTED</div>
                                        <div class="body centerMiddle">
                                            <span id = "eotGrant">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">CLAIMABLE AMOUNT AFTER RETAINAGE</div>
                                        <div class="body centerMiddle">
                                            <span id = "claimAmountAfterRetainage">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowFour M infoContainerDiv procurement">
                                    <div class="infoContainer procurement reMargin shadow">
                                        <div class="head">REVISED DURATION</div>
                                        <div class="body centerMiddle">
                                            <span id = "revDuration">0</span>
                                        </div>
                                    </div>
                                    <div class="infoContainer procurement reMargin transparent">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M twoRow">
                        <div class="rowOne-T roundT shadow">INTERIM PAYMENT</div>
                        <div class="rowTwo-T twoColumn tableContainer roundB scroll-content noscrollPrint" style="display: block">
                            <table id="incidentTb" class=""> 
                                <thead style="position: sticky;" class="procurement">
                                    <tr>
                                        <th colspan="4" class="lightbluePastel" scope="colgroup" style="text-align:center; border: 1px solid white">PAYMENT CLAIM</th>
                                        <th colspan="5" class="bluePastel" scope="colgroup" style="text-align:center;  border: 1px solid white">PAYMENT CERTIFIED AND RECEIVED</th>
                                    </tr>
                                    <tr>
                                        <th class="secondRow lightbluePastel interimHeader2" scope="col" style="text-align:center; border: 1px solid white">CONTRACT NO</th>
                                        <th class="secondRow lightbluePastel" scope="col" style="text-align:center; border: 1px solid white">IPA NO</th>
                                        <th class="secondRow lightbluePastel" scope="col" style="text-align:center; border: 1px solid white">For Period Ending</th>
                                        <th class="secondRow lightbluePastel" scope="col" style="text-align:center; border: 1px solid white">Net Interim Amount Claim</th>
                                        <th class="secondRow bluePastel" scope="col" style="text-align:center; border: 1px solid white">IPC NO</th>
                                        <th class="secondRow bluePastel" scope="col" style="text-align:center; border: 1px solid white">DATE OF RECOMMENDED</th>
                                        <th class="secondRow bluePastel" scope="col" style="text-align:center; border: 1px solid white">IPC RECOMMENDED AMOUNT</th>
                                        <th class="secondRow greenPastel" scope="col" style="text-align:center; border: 1px solid white">DATE OF PAYMENT RECEIVED FROM CLIENT</th>
                                        <th class="secondRow greenPastel" scope="col" style="text-align:center; border: 1px solid white">NETT AMOUNT RECEIVED FROM CLIENT</th>
                                    </tr>
                                </thead>
                                <tbody id="claimTbBody" class="procurement" style="text-align: middle;">
                                </tbody>
                                <thead style="position: sticky;" class="procurement">
                                    <tr>
                                        <th class="secondRowBottom lightbluePastel otherInterimHeader" colspan="3" scope="colgroup" style="text-align:right; border: 1px solid white">Total (MYR)</th>
                                        <th class="secondRowBottom lightbluePastel" colspan="1" id = "totalCumulClaim" scope="colgroup" style="text-align:center; border: 1px solid white">0</th>
                                        <th class="secondRowBottom bluePastel" colspan="2" scope="colgroup" style="text-align:right; border: 1px solid white">Total (MYR)</th>
                                        <th class="secondRowBottom bluePastel" colspan="1" id = "totalRecommendAmount" scope="colgroup" style="text-align:center; border: 1px solid white">0</th>
                                        <th class="secondRowBottom greenPastel" colspan="1" scope="colgroup" style="text-align:right; border: 1px solid white">Total (MYR)</th>
                                        <th class="secondRowBottom greenPastel" colspan="1" id = "totalReceivedClaimAmount" scope="colgroup" style="text-align:center; border: 1px solid white">0</th>
                                    </tr>
                                    <tr style="height:25px">
                                        <th class="bottom lightbluePastel otherInterimHeader" colspan="3" scope="colgroup" style="text-align:right; border: 1px solid white">Percentage (%)</th>
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
    .text-wrap {
        padding: 0;
        margin: 0;
        height: -webkit-fill-available;
        overflow-y: auto;
        display: flex;
        align-items: flex-start;
    }

    .clickableCard {
        cursor:pointer;
    }

    @media screen and (max-height:600px ){
        .infoContainer > .head {
            font-size: 0.6rem !important;
        }

        .reMargin{
            margin: 3px !important;
        }

        .overflowScroll{
            overflow-y: auto
        }

        ::-webkit-scrollbar {
            width: 7px;
            height: 7px;
        }

        ::-webkit-scrollbar-track {
            background: #e0e0e0; 
            border-radius: 10px;
        }
            
        ::-webkit-scrollbar-thumb {
            background: #c2c2c2;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #c2c2c2; 
            cursor: grab;
        }
    }
</style>
