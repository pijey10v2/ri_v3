<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('PCA_Analysis');
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
                <h4>Pavement Analysis Report</h4>
                <h3>'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="../../Images/Logo_JKR.png">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar">
                <div class="filterContainer">
                    <div class="filter" style="">
                        <label>Date</label><br>
                        <select id="dateFilter" onchange="refreshDashboard()">
                        </select>
                    </div>
                    <div class="filter">
                        <label>Lane</label><br>
                        <select id="laneFilter" onchange="refreshDashboard()">
                            <option val="Fast" selected>Fast</option>
                            <option val="Slow">Slow</option>
                        </select>
                    </div>
                    <div class="filter">
                        <label>Chainage From</label><br>
                        <select id="chgFromFilter" class="chgFilter" onchange="refreshDashboard()">
                        </select>
                    </div>
                    <div class="filter">
                        <label>Chainage To</label><br>
                        <select id="chgToFilter" class="chgFilter" onchange="refreshDashboard()">
                        </select>
                    </div>
                </div>
            </div>
            <div class="minimizeButton active" id="minimizeButton" style="z-index: 1">
                <div class="lines"></div>
                <div class="lines"></div>
            </div>
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoRow">
                    <div class="rowOne M twoColumn">
                        <div class="columnOne M">
                            <div class="rowOne-T roundT shadow">CENTRAL DEFLECTION</div>
                            <div class="rowTwo-T roundB shadow">
                                <div class="rowOne-T bottomIndicator">
                                    <span class="cdDate"></span>
                                </div>
                                <div class="rowTwo-T rowThree-T twoColumn">
                                    <div id="cdIncChart" class="columnOne M"></div>
                                    <div id="cdDescChart" class="columnTwo M"></div>
                                </div>    
                                <div class="rowOne-T bottomIndicator">
                                    <span class="condGreen"> Good</span>
                                    <span class="condYellow"> Fair</span>
                                    <span class="condRed"> Poor</span>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M">
                            <div class="rowOne-T roundT shadow">RESILIENT MODULUS</div>
                            <div class="rowTwo-T roundB shadow">
                                <div class="rowOne-T bottomIndicator">
                                    <span class="rmDate"></span>
                                </div>
                                <div class="rowTwo-T rowThree-T twoColumn">
                                    <div id="rmIncChart" class="columnOne M"></div>
                                    <div id="rmDescChart" class="columnTwo M"></div>
                                </div>    
                                <div class="rowOne-T bottomIndicator">
                                    <span class="condGreen"> Good</span>
                                    <span class="condYellow"> Satisfactory</span>
                                    <span class="condRed"> Poor</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo M">
                        <div class="rowOne-T roundT shadow">MULTI LEVEL PROFILER (MLP)</div>
                            <div class="rowTwo-T roundB shadow" id = "">
                                <div class="rowOne-T bottomIndicator">
                                    <span class="mlpDate"></span>
                                </div>
                                <div class="rowTwo-T rowThree-T twoColumn">
                                    <div id="mlpIncChart" class="columnOne M"></div>
                                    <div id="mlpDescChart" class="columnTwo M"></div>
                                </div>  
                                <div class="rowOne-T bottomIndicator">
                                    <span class="condGreen"> Good</span>
                                    <span class="condYellow"> Fair</span>
                                    <span class="condOrange"> Poor</span>
                                    <span class="condRed"> Bad</span>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
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
    .bottomIndicator{
        background: rgba(255, 255, 255, 0.8196078431) !important;
        border-radius: 0px 0px 8px 8px;
        color: black !important;
        font-weight: unset !important;
    }
    .bottomIndicator span{
        margin-right: 10px;
    }
    .condGreen:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #52BE80;
    }
    .condYellow:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #F4D03F;
    }
    .condRed:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #E93232;
    }
    .condOrange:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #dd9941;
    }
</style>
