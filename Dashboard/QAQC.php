<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('QAQC');

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
    </head>
    <body>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class = "dashboardHeader">
            <div class = "logo">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
            <div class = "title">
                <h4>QUALITY ASURANCE QUALITY CONTROL</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard();">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'">'.$val.'</option>';
                            }
                                $html .=        '
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout twoRow" id="lOne">
                <div class="rowOne-M oneColumn">
                    <div class="columnOne twoRow">
                        <div class="rowOne-T">NON-CONFOMANCE REPORT (NCR)</div>
                        <div class="rowTwo-T threeColumn">
                            <div class="columnOne-S flex">
                                <div class="infoContainer">
                                    <div class="head">NCR PREVIOUS MONTH</div>
                                    <span id="ncrPrevMonthCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">NCR CURRENT MONTH</div>
                                    <span id="ncrCurrMonthCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">NCR CUMULATIVE</div>
                                    <span id="ncrCumulativeCard">0</span>
                                </div>
                                <div class="infoContainerDiv">
                                    <div class="infoContainer">
                                        <div class="head">PENDING</div>
                                        <span id="ncrPendingCard">0</span>
                                    </div>
                                    <div class="infoContainer">
                                        <div class="head">CLOSED</div>
                                        <span id="ncrClosedCard">0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo-ML">
                                <div class="containerHeader">NCR WORK DICIPLINE</div>
                                <div class="dash-charts ncr-charts" id="ncr-wd"></div>
                            </div>
                            <div class="columnThree-ML">
                                <div class="containerHeader">NCR AGING</div>
                                <div class="dash-charts ncr-charts" id="ncr-aging"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rowTwo-M twoColumn">
                    <div class="columnOne-M">
                        <div class="containerHeader">NCR CLASSIFICATION</div>
                        <div class="dash-charts ncr-charts" id="ncr-classif"></div>
                    </div>
                    <div class="columnTwo-M fourRow">
                        <div class="rowOne-M twoRow">
                            <div class="rowOne-T">REQUEST FOR INFORMATION (RFI)</div>
                            <div class="rowTwo-T infoContainerFlex">
                                <div class="infoContainer">
                                    <div class="head">Draft</div>
                                    <span id="rfiDraftCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Submitted</div>
                                    <span id="rfiSubmittedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Closed</div>
                                    <span id="rfiClosedCard">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo-M twoRow">
                            <div class="rowOne-T">METHOD OF STATEMENT(MOS)</div>
                            <div class="rowTwo-T infoContainerFlex">
                                <div class="infoContainer">
                                    <div class="head">Draft</div>
                                    <span id="mosDraftCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Submitted</div>
                                    <span id="mosSubmittedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Rejected</div>
                                    <span id="mosRejectedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Closed</div>
                                    <span id="mosClosedCard">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="rowThree-M twoRow">
                            <div class="rowOne-T">MATERIAL SUBMISSION (MS)</div>
                            <div class="rowTwo-T infoContainerFlex">
                                <div class="infoContainer">
                                    <div class="head">Draft</div>
                                    <span id="msDraftCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Submitted</div>
                                    <span id="msSubmittedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Approved</div>
                                    <span id="msApprovedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Closed</div>
                                    <span id="msClosedCard">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="rowFour-M twoRow">
                            <div class="rowOne-T">WORK INSPECTION REPORT (WIR)</div>
                            <div class="rowTwo-T infoContainerFlex">
                                <div class="infoContainer">
                                    <div class="head">Draft</div>
                                    <span id="wirDraftCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Submitted</div>
                                    <span id="wirSubmittedCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Inspection</div>
                                    <span id="wirInspectionCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Supp. Doc</div>
                                    <span id="wirDocCard">0</span>
                                </div>
                                <div class="infoContainer">
                                    <div class="head">Approved</div>
                                    <span id="wirApprovedCard">0</span>
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