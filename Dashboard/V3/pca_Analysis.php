<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('PCA_Analysis');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$projectName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
$fullName = 'PCA Analysis';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">               <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  
    </head>
    <body class='.$themeClass.'>
    <h4 id="printHeader">'.$fullName.' - '.$projectName.'</h4>
        <div class = "dashboardBody">
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
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bottomIndicator{
        background: var(--surface) !important;
        border-radius: 0px 0px 8px 8px;
        color: var(--on-surface) !important;
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
    .showLabel{
        display: none;
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
