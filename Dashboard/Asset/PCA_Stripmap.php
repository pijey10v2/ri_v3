<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('PCA_Stripmap');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  

        <script src="../../JS/highchart/heatmap.js"></script>
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
                        <select id="dateFilter" onchange="updateData()">
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
                    <div class="filter">
                        <label>Direction</label><br>
                        <select id="directionFilter" onchange="refreshDashboard()">
                            <option selected value="Increasing">Increasing</option>
                            <option value="Decreasing">Decreasing</option>
                        </select>
                    </div>
                    <div class="filter">
                        <label>Lane</label><br>
                        <select id="laneFilter" onchange="refreshDashboard()">
                            <option selected value="Fast">Fast</option>
                            <option value="Slow">Slow</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoRow">
                    <div class="rowOne-T roundT shadow">Strip Map Analysis</div>
                    <div class="rowTwo-T roundB shadow threeRow">
                        <div class="rowOne M" id="mlpChart"></div>
                        <div class="rowTwo M" id="rubiconChart"></div>
                        <div class="rowThree M" id="fwdChart"></div>
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
    .white{
        background: white !important;
    }
</style>
