<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('land_PBHS');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">  
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeader">
            <div class = "logo">
                <img src ="../Images/panborneo.png">
            </div>
            <div class = "title">
                <h4>Land Summary</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../Images/Logo_JKR_Sabah.png">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer" >
                    <div class="filter">
                        <label>LCM No.</label><br>
                        <select id="lcmNoFilter">
                        </select>
                    </div>
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'">'.$val.'</option>';
                            }
                            $html .=        '
                        </select>
                    </div>
                    <div class="filter">
                        <label>District</label><br>
                        <select id="disFilter">
                        </select>
                    </div>
                    <div class="filter">
                        <label>Year</label><br>
                        <select id = "yearFilter">
                            <option value="all">---</option>';
                            foreach ($dashObj->yearOptions['overall'] as $year) {
                                $html .= '<option value="'.$year.'">'.$year.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                    <div class="filter">
                        <label>Month</label><br>
                        <select id = "monthFilter" disabled>
                            <option value="all">---</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout twoRow" id="lOne">
                <div class="rowOne XS twoRow round infoContainerDiv">
                    <div class="infoContainer round shadow" style="background:white; margin:0 2.5px; height: 100%; overflow-y: auto">
                        <div class="head" style="position: sticky; top: 0;">LCM No.</div>
                        <table class="table-font"> 
                            <tbody id="lcmTableData"></tbody>
                        </table>
                    </div>
                    <div class="infoContainer round shadow" style="background:white; margin:0 2.5px;">
                        <div class="head">Year</div>
                        <span id="cardYear"></span>
                    </div>
                    <div class="infoContainer round shadow" style="background:white; margin:0 0 0 2.5px;">
                        <div class="head">Month</div>
                        <span id="cardMonth"></span>
                    </div>
                </div>
                <div class="rowTwo XL threeRow">
                    <div class="rowOne M round shadow">
                        <div class="rowOne-T  roundT">Offer Issued</div>
                        <div class="rowTwo-T roundB twoColumn">
                            <div class="columnOne L" style="border-bottom-left-radius: 5px;" id="offerIssuedChart"></div>
                            <div class="columnTwo S flex">
                                <div class="infoContainer white shadow">
                                    <div class="head">Land</div>
                                    <span id="offerLand"></span>
                                </div>
                                <div class="infoContainer white shadow">
                                    <div class="head">Structure</div>
                                    <span id="offerStructure"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M round shadow">
                        <div class="rowOne-T  roundT">Payment Made</div>
                        <div class="rowTwo-T roundB twoColumn">
                            <div class="columnOne L" style="border-bottom-left-radius: 5px;" id="paymentChart"></div>
                            <div class="columnTwo S flex">
                                <div class="infoContainer white shadow">
                                    <div class="head">Land</div>
                                    <span id="paymentLand"></span>
                                </div>
                                <div class="infoContainer white shadow">
                                    <div class="head">Structure</div>
                                    <span id="paymentStructure"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowThree M round shadow">
                        <div class="rowOne-T  roundT">Demolished</div>
                        <div class="rowTwo-T roundB twoColumn">
                            <div class="columnOne L" style="border-bottom-left-radius: 5px;" id="demolisedChart"></div>
                            <div class="columnTwo S flex">
                                <div class="infoContainer white shadow">
                                    <div class="head">Structure</div>
                                    <span id="demolishStructure"></span>
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
    
</style>
