<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('PCA_Stripmap');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$projectName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
$fullName = 'PCA Stripmap';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">            <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  

        <script src="../../JS/highchart/heatmap.js"></script>
    </head>
    <body class='.$themeClass.'>
        <h4 id="printHeader">'.$fullName.' - '.$projectName.'</h4>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoRow">
                    <div class="rowOne-T roundT shadow">Strip Map Analysis</div>
                    <div class="rowTwo-T roundB shadow threeRow">
                        <div class="rowOne M tableFullWidth" id="mlpChart"></div>
                        <div class="rowTwo M tableFullWidth" id="rubiconChart"></div>
                        <div class="rowThree M tableFullWidth" id="fwdChart"></div>
                    </div>
                </div>
            </div>
        </div>

        <script src="../../JS/dashboard/dashboardv3.js"></script>
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
    #printHeader{
        color: var(--on-surface);
        display: none;
    }
    @media print{
        #printHeader{
            display: block
        }
    }
</style>
