<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('procurement_SSLR2', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$showHeader = true;
if (isset($_GET['noHeader']) && $_GET['noHeader'] == 1) {
    $showHeader = false;
}

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
    </head>';
    $themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
    $html .= '
    <body class='.$themeClass.'>
        <div class = "dashboardBody"';
        if (!$showHeader){
            $html .= ' 
                style="height: calc(100% - 25px) !important;"
            ';
        }
        $html .= '>
            <div class="layout twoRow round" id="lOne">
                <div class="rowOne M threeColumn">
                    <div class="columnOne M flex round background">
                        <div class="rowOne-T roundT">CONTRACT DETAILS</div>
                        <div class="tableContainer  roundB" id = "dashboarditem">
                            <table> 
                                <tbody>
                                    <tr>
                                        <td>Contract No.</td>
                                        <td id="conNoCard">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Client Name (SO)</td>
                                        <td id="conClient">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Lead Consultant (ASOR)</td>
                                        <td id="conleadconsult">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Contractor Name</td>
                                        <td id="concontractor">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Commencement Date</td>
                                        <td id="concommencedate">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Original Completion date</td>
                                        <td id="concompletiondate">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Original Contract Period</td>
                                        <td id="conOriDuration">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Original Contract Sum (RM</td>
                                        <td id="conorigsum">N/A</td>
                                    </tr>
                                    <tr>
                                        <td>LAD/Day (RM/Day)</td>
                                        <td id="conlad">N/A</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="columnTwo M round flex background">
                        <div class="infoContainer procurement reMargin shadow">
                            <div class="rowOne-T roundT">Revised Completion Date</div>
                            <div class="body">
                                <div class="tableContainer  roundB" id = "dashboarditem">
                                    <table> 
                                        <tbody>
                                            <tr>
                                                <td>Revised Completion Date</td>
                                                <td id="revisedCompletionDate">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Approved EOT from VO (Days)</td>
                                                <td id="ApprovedEOTfromVO">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Approved EOT (Days)</td>
                                                <td id="ApprovedEOTDays">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Approved EOT Total (days)</td>
                                                <td id="totalApprovedEOTDays">N/A</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="infoContainer procurement reMargin shadow">
                            <div class="rowOne-T roundT">Revised Contract Sum (RM)</div>
                            <div class="body">
                                <div class="tableContainer  roundB" id = "dashboarditem">
                                    <table> 
                                        <tbody>
                                            <tr>
                                                <td>Revised Contract Sum</td>
                                                <td id="revisedContractSum">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Approved VO No</td>
                                                <td id="DSApprovedVo">N/A</td>
                                            </tr>
                                            <tr>
                                                <td>Approved Variation Order Nett (RM)</td>
                                                <td id="DSApprovedVONet">N/A</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnOne M flex round background">
                        <div class="rowOne-T roundT">Interim Certified Payment</div>
                        <div class="tableContainer  roundB" id = "dashboarditem">
                            <div class="infoContainer procurement reMargin" >
                                <div class="head">Current IPC No</div>
                                <div class="centerMiddle">
                                    <span id = "currentIPC">0</span>
                                </div>
                            </div>
                            <div class="infoContainer procurement reMargin" >
                                <div class="head">Work Done From (Date)</div>
                                <div class="centerMiddle">
                                    <span id = "workDoneFrom">0</span>
                                </div>
                            </div>
                            <div class="infoContainer procurement reMargin" >
                                <div class="head">Work Done To (Date)</div>
                                <div class="centerMiddle">
                                    <span id = "workDoneTo">0</span>
                                </div>
                            </div>
                            <div class="infoContainer procurement reMargin" >
                                <div class="head">Current IPC Amount (RM)</div>
                                <div class="centerMiddle">
                                    <span id = "currentIPCAmt">0</span>
                                </div>
                            </div>
                            <div class="infoContainer procurement reMargin" >
                                <div class="head">Total Cumulative Certified Payment</div>
                                <div class="centerMiddle">
                                    <span id = "totalCumulCertified">0</span>
                                </div>
                            </div>
                            <div class="infoContainer procurement reMargin" >
                                <div class="head">Total Cumulative Amount Paid by Client</div>
                                <div class=" centerMiddle">
                                    <span id = "totalCumulbyClient">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="columnOne M flex round background">
                    <div class="rowOne-T roundT">Original Contract Sum (RM), Revised Contract Sum (RM), Approved Variation Order Nett (RM) & Total Cumulative Certified Payment</div>
                    <div class="rowTwo-T roundB dash-charts" id="ipcChart"></div>
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
