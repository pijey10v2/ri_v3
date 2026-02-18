<?php
// for theme
if (session_status() == PHP_SESSION_NONE) session_start();

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/home.css">
        <link rel="stylesheet" href="../../CSS/V3/Wizard.css">
        <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <link rel="stylesheet" href="../../JS/JsLibrary/jquery-confirm.min.css">
        <script src="../../JS/JsLibrary/jquery-confirm.min.js"></script>
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script> 
        <script src = "../../JS/asset/fwdAnalysis.js"></script> 
    </head>
    <body style="background: transparent" class='.$themeClass.'>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>
        <div class="assetContainer">
                <div class="filterContainer">
                    <div class="filter" style="">
                    <label>Date</label>
                    <select id="dataDateOpt" onchange="fetchData(this)">
                    </select>
                </div>
                <div class="filter" style="">
                    <label>Chainage From</label>
                    <select id="chgFromOpt" class="chgOptions" onchange="filterChg()">
                    </select>
                </div>
                <div class="filter" style="">
                    <label>Chainage To</label>
                    <select id="chgToOpt" class="chgOptions" onchange="filterChg()">
                    </select>
                </div>
            </div>
            <div class="bodyContainer">
                <div class="titleHeader"></div>
                <div class="tableContainer scrollbar-inner">
                    <table>
                        <thead>
                            <tr>
                                <th class="borderRadiusLeft" rowspan="5">Chainage</th>
                                <th class="center" colspan="10" scope="colgroup">INCREASING</th>
                                <th class="center borderRadiusRight" colspan="10" scope="colgroup">DESCREASING</th>
                            </tr>
                            <tr>
                                <th class="secondRow center" colspan="5" scope="colgroup">SLOW LANE</th>
                                <th class="secondRow center" colspan="5" scope="colgroup">FAST LANE</th>
                                <th class="secondRow center" colspan="5" scope="colgroup">SLOW LANE</th>
                                <th class="secondRow center" colspan="5" scope="colgroup">FAST LANE</th>
                            </tr>
                            <tr>
                                <th class="thirdRow" rowspan="2" colspan="1" scope="colgroup">FWD<br>Central<br>Deflection<br>(&#181;m)</th>
                                <th class="thirdRow center" colspan="4" scope="colgroup">Resilient Modulus</th>
                                <th class="thirdRow" rowspan="2" colspan="1" scope="colgroup">FWD<br>Central<br>Deflection<br>(&#181;m)</th>
                                <th class="thirdRow center" colspan="4" scope="colgroup">Resilient Modulus</th>
                                <th class="thirdRow" rowspan="2" colspan="1" scope="colgroup">FWD<br>Central<br>Deflection<br>(&#181;m)</th>
                                <th class="thirdRow center" colspan="4" scope="colgroup">Resilient Modulus</th>
                                <th class="thirdRow" rowspan="2" colspan="1" scope="colgroup">FWD<br>Central<br>Deflection<br>(&#181;m)</th>
                                <th class="thirdRow center" colspan="4" scope="colgroup">Resilient Modulus</th>
                            </tr>
                            <tr>
                                <th class="forthRow" colspan="" scope="col">Asphalt</th>
                                <th class="forthRow" colspan="" scope="col">Roadbase</th>
                                <th class="forthRow" colspan="" scope="col">Subbase</th>
                                <th class="forthRow" colspan="" scope="col">Subgrade</th>
                                
                                <th class="forthRow" colspan="" scope="col">Asphalt</th>
                                <th class="forthRow" colspan="" scope="col">Roadbase</th>
                                <th class="forthRow" colspan="" scope="col">Subbase</th>
                                <th class="forthRow" colspan="" scope="col">Subgrade</th>

                                <th class="forthRow" colspan="" scope="col">Asphalt</th>
                                <th class="forthRow" colspan="" scope="col">Roadbase</th>
                                <th class="forthRow" colspan="" scope="col">Subbase</th>
                                <th class="forthRow" colspan="" scope="col">Subgrade</th>

                                <th class="forthRow" colspan="" scope="col">Asphalt</th>
                                <th class="forthRow" colspan="" scope="col">Roadbase</th>
                                <th class="forthRow" colspan="" scope="col">Subbase</th>
                                <th class="forthRow" colspan="" scope="col">Subgrade</th>
                            </tr>
                            <tr>
                                <th class="fifthRow" colspan="" scope="col">(D<small>0</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>1</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>2</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>3</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(ES)</th>
                                
                                <th class="fifthRow" colspan="" scope="col">(D<small>0</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>1</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>2</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>3</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(ES)</th>

                                <th class="fifthRow" colspan="" scope="col">(D<small>0</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>1</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>2</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>3</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(ES)</th>

                                <th class="fifthRow" colspan="" scope="col">(D<small>0</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>1</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>2</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(E<small>3</small>)</th>
                                <th class="fifthRow" colspan="" scope="col">(ES)</th>
                            </tr>
                        </thead>
                        <tbody id="fwdAnalysisData">
                        </tbody>
                        <tbody id="fwdAvgCalcData">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
';

echo $html;
?>
<style>
    .blank_row{
        height: 15px !important;
        background-color: #FFFFFF;
    }
    .titleHeader {
        text-align : center;
    }
</style>