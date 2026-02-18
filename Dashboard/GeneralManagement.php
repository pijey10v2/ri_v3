<?php
include_once 'dashboard.class.php';
$dashObj = new RiDashboard('GeneralManagement');

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
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
            <div class = "title">
                <h4>General Management</h4>
                <h3 style="text-align: center;">'.$dashObj->projectInfo['project_name'].'</h3>
            </div>
            <div class = "logo right">
                <img src ="'.$dashObj->projectInfo['icon_url'].'">
            </div>
        </div>
        <div class = "dashboardBody">
            <div class="sidebar" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                <div class="filterContainer">
                    <div class="filter" style="display:'.(($dashObj->isWPC) ? 'none' : 'block').';">
                        <label>Work Package</label><br>
                        <select id="wpcFilter" onchange="refreshDashboard()">';
                            // load work package options
                            foreach ($dashObj->WPCOptions as $key => $val) {
                                $html .= '<option value="'.$key.'" onclick="refreshDashboard()">'.$val.'</option>';
                            }
                            $html .= '
                        </select>
                    </div>
                </div>
            </div>
            <div class="layout oneRow" id="lOne" '.(($dashObj->isWPC) ? 'style="width:98%;"' : '').'"> 
                <div class="columnOne twoColumn sss">
                    <div class="columnOne M twoRow flex">
                        <div class="rowOne M">
                            <div class="infoContainer round shadow">
                                <div class="head roundT">TOTAL PUBLIC COMPLAINT</div>
                                <span id="TotalPublicComplaintCard">0</span>
                            </div>
                        </div>
                        <div class="rowTwo M">
                            <div class="infoContainerDiv">
                                <div class="infoContainer round shadow">
                                    <div class="head roundT ">CLOSED</div>
                                    <span id="ClosedCard">0</span>
                                </div>
                                <div class="infoContainer round shadow">
                                    <div class="head roundT">OPEN</div>
                                    <span id="OpenCard">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo L">
                        <div class="rowOne-T roundT">PUBLIC COMPLAINT FORM</div>
                        <div class="dash-charts rowTwo-T roundB" id="PublicComplaintFormChart"></div>               
                    </div>
                </div>
            </div>       
        </div>        

        <script src="../JS/dashboard/dashboard.js"></script>
    </body>
</html>';

echo $html;

?>

<style type="text/css">
    .rowOne-T{
        background: #002171;
        height: 20px;
        line-height: 20px;
        color: white;
        text-align: center;
        overflow: hidden;
        font-size: 12px;
    }
</style>