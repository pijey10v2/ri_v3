<?php
include_once '../dashboard.class.php';

$dashObj = new RiDashboard('nod');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$projectName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
$fullNameAPJKPJ = "Anggaran/Kelulusan Penyelenggaraan Jalan";

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                  <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  

        <script src="https://code.highcharts.com/modules/heatmap.js"></script>
    </head>
    <body class='.$themeClass.'>
        <h4 id="printHeader">'.$fullNameAPJKPJ.' - '.$projectName.'</h4>
        <div class = "dashboardBody">
            <div class="layout oneRow" id="lOne" style="">
                <div class="rowOne M twoColumn">
                    <div class="columnOne M oneRow hiddenContainer">
                        <div div id="nodPieChartContainerAPJ" class="rowOne twoRow">
                            <div class="rowOne-T roundT shadow">APJ</div>
                            <div class="rowTwo-T roundB shadow twoRow">
                                <div class="rowOne SM" id="APJContainer">
                                    <div class="tableContainer roundB">
                                        <table class="tableHalfWidth z-indexHight" id="APJTable" style="width: 90%; margin-top: 5px;" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="printTablePackageOne">Total</td>
                                                    <td class="printTablePackageTwo" id="ttlAPJ">0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Item</td>
                                                    <td id="ttlAPJitem">0</td>
                                                </tr>
                                                <tr>
                                                    <td>Total (RM)</td>
                                                    <td id="ttlAmtAPJ">RM 0</td>
                                                </tr>
                                                <tr style="background: #E93232;">
                                                    <td>Critical (RM)</td>
                                                    <td id="ttlCriticalAPJ">RM 0</td>
                                                </tr>
                                                <tr style="background: #DD9941;">
                                                    <td>Serious (RM)</td>
                                                    <td id="ttlSeriousAPJ">RM 0</td>
                                                </tr>
                                                <tr style="background: #F4D03F;">
                                                    <td>Bad (RM)</td>
                                                    <td id="ttlBadAPJ">RM 0</td>
                                                </tr>
                                                <tr style="background: rgb(124, 181, 236);">
                                                    <td>Mild (RM)</td>
                                                    <td id="ttlMildAPJ">RM 0</td>
                                                </tr>
                                                <tr style="background: #52BE80;">
                                                    <td>Good (RM)</td>
                                                    <td id="ttlGoodAPJ">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    </div>
                                    <div class="rowTwo ML" id="APJPie">
                                        <div id = "pieQuantityStatusAPJ" style="height: 100%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M oneRow hiddenContainer">
                            <div div id="nodPieChartContainerKPJ" class="rowOne twoRow">
                                <div class="rowOne-T roundT shadow">KPJ</div>
                                <div class="rowTwo-T roundB shadow twoRow">
                                    <div class="rowOne SM" id="KPJContainer">
                                        <div class="tableContainer roundB">
                                            <table class="tableHalfWidth z-indexHight" id="KPJTable" style="width: 90%; margin-top: 5px;" align="center">
                                                <tbod>
                                                    <tr>
                                                        <td class="printTablePackageOne">Total</td>
                                                        <td class="printTablePackageTwo" id="ttlKPJ">0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Item</td>
                                                        <td id="ttlKPJitem">0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total (RM)</td>
                                                        <td id="ttlAmtKPJ">RM 0</td>
                                                    </tr>
                                                    <tr style="background: #E93232;">
                                                        <td>Critical (RM)</td>
                                                        <td id="ttlCriticalKPJ">RM 0</td>
                                                    </tr>
                                                    <tr style="background: #DD9941;">
                                                        <td>Serious (RM)</td>
                                                        <td id="ttlSeriousKPJ">RM 0</td>
                                                    </tr>
                                                    <tr style="background: #F4D03F;">
                                                        <td>Bad (RM)</td>
                                                        <td id="ttlBadKPJ">RM 0</td>
                                                    </tr>
                                                    <tr style="background: rgb(124, 181, 236);">
                                                        <td>Mild (RM)</td>
                                                        <td id="ttlMildKPJ">RM 0</td>
                                                    </tr>
                                                    <tr style="background: #52BE80;">
                                                        <td>Good (RM)</td>
                                                        <td id="ttlGoodKPJ">RM 0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="rowTwo ML" id="KPJPie">
                                        <div id = "pieQuantityStatusKPJ" style="height: 100%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>   
                        
                        <div div id="nodTableContainer" class="rowOne twoRow" style="display:none">
                            <div class="rowOne twoRow M round shadow tableHeaderGroup">
                                <div class="rowOne-T roundT shadow">APJ BASED ON PRIORITY</div>
                                <div class="rowTwo-T roundB shadow tableContainer">
                                    <table class="border tableFullWidth" id ="" class="" style="page-break-inside: avoid"> 
                                        <thead>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Path Name</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Path No.</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Section From</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Section To</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Length (KM)</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Work Location</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Amount (RM)</th>
                                        </thead>
                                        <tbody id="statusTableAPJ">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="rowTwo M twoRow round shadow tableHeaderGroup">
                                <div class="rowOne-T roundT shadow">KPJ BASED ON PRIORITY</div>
                                <div class="rowTwo-T roundB shadow tableContainer">
                                    <table id ="" class="border tableFullWidth" style="page-break-inside: avoid"> 
                                        <thead>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Path Name</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Path No.</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Section From</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Section To</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Length (KM)</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Work Location</th>
                                            <th class="border printTablePackageThree" style="background: #0B364D ;">Amount (RM)</th>
                                        </thead>
                                        <tbody id="statusTableKPJ">
                                        </tbody>
                                    </table>
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
    .purple{
        background: purple !important;
    }
    .small{
        margin: auto 15px !important;
    }
    .bold{
        font-weight: bold !important;
    }
    .infoContainer > div,span{
        cursor: default;
    }
    .showLabel{
        display: none;
        word-wrap: break-word;
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
