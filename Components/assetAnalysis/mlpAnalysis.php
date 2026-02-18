<?php
if (session_status() == PHP_SESSION_NONE) session_start();
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

require('../../login/include/_include.php');

global $CONN;
// handle the update here
if(isset($_POST['updateIRILegend'])){
    $vGood = filter_input(INPUT_POST, 'Good', FILTER_SANITIZE_STRING);
    $vFair = filter_input(INPUT_POST, 'Fair', FILTER_SANITIZE_STRING);
    $vPoor = filter_input(INPUT_POST, 'Poor', FILTER_SANITIZE_STRING);
    $CONN->execute("update analysis_legend set al_good =:0, al_fair=:1, al_poor =:2, al_bad =:3 where al_category = 'iri_analysis'", array($vGood, $vFair, $vPoor, $vPoor));
    if(!$CONN->lastRowCount()){
        $CONN->execute("insert into analysis_legend (al_good, al_fair, al_poor, al_bad, al_category) values (:0, :1, :2, :3, 'iri_analysis')", array($vGood, $vFair, $vPoor, $vPoor));
    }
}

// analysis_legend
$legendRow = $CONN->fetchRow("select * from analysis_legend where al_category = 'iri_analysis'");
$lgood = (isset($legendRow['al_good'])) ? $legendRow['al_good'] : '';
$lfair = (isset($legendRow['al_fair'])) ? $legendRow['al_fair'] : '';
$lpoor = (isset($legendRow['al_poor'])) ? $legendRow['al_poor'] : '';
$lbad = (isset($legendRow['al_bad'])) ? $legendRow['al_bad'] : '';

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
        <script src = "../../JS/asset/mlpAnalysis.js"></script> 
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
                <div class="titleHeader">Date<span id="titleHeader"></span></div>
                <div class="tableContainer scrollbar-inner">
                    <table>
                        <thead>
                            <tr>
                                <th class="center borderRadiusLeft" colspan="6" scope="colgroup">Increasing</th>
                                <th class="center textTop" rowspan="2" colspan="2" scope="colgroup">Chainage</th>
                                <th class="center borderRadiusRight" colspan="6" scope="colgroup">Decreasing</th>
                            </tr>
                            <tr>
                                <th class="secondRow center" colspan="3" scope="colgroup">Slow Lane</th>
                                <th class="secondRow center" colspan="3" scope="colgroup">Fast Lane</th>
                                <th class="secondRow center" colspan="3" scope="colgroup">Slow Lane</th>
                                <th class="secondRow center" colspan="3" scope="colgroup">Fast Lane</th>
                            </tr>
                            <tr>
                                <th class="thirdRow" scope="col">IRI</th>
                                <th class="thirdRow" scope="col">Rutting</th>
                                <th class="thirdRow" scope="col">Crack</th>
                                <th class="thirdRow" scope="col">IRI</th>
                                <th class="thirdRow" scope="col">Rutting</th>
                                <th class="thirdRow" scope="col">Crack</th>
                                <th class="thirdRow" scope="col">From</th>
                                <th class="thirdRow" scope="col">To</th>
                                <th class="thirdRow" scope="col">IRI</th>
                                <th class="thirdRow" scope="col">Rutting</th>
                                <th class="thirdRow" scope="col">Crack</th>
                                <th class="thirdRow" scope="col">IRI</th>
                                <th class="thirdRow" scope="col">Rutting</th>
                                <th class="thirdRow" scope="col">Crack</th>
                            </tr>
                            <tr>
                                <th class="forthRowMLP" scope="col">m/km</th>
                                <th class="forthRowMLP" scope="col">mm</th>
                                <th class="forthRowMLP" scope="col">%</th>
                                <th class="forthRowMLP" scope="col">m/km</th>
                                <th class="forthRowMLP" scope="col">mm</th>
                                <th class="forthRowMLP" scope="col">%</th>
                                <th class="forthRowMLP" scope="col">km</th>
                                <th class="forthRowMLP" scope="col">km</th>
                                <th class="forthRowMLP" scope="col">m/km</th>
                                <th class="forthRowMLP" scope="col">mm</th>
                                <th class="forthRowMLP" scope="col">%</th>
                                <th class="forthRowMLP" scope="col">m/km</th>
                                <th class="forthRowMLP" scope="col">mm</th>
                                <th class="forthRowMLP" scope="col">%</th>
                            </tr>
                        </thead>
                        <tbody id="mplAnalysisData">
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="legendContainer">
                <form method="post">
                    <h5>IRI Legend Setup</h5>
                    <label class="legendLabel legendLabelGood" for="legendGood">Good: Less than</label>
                    <input type="number" step=".01" class="inputfull" id="legendGood" name="Good" value="'.$lgood.'">
                    <label class="legendLabel" for="legendFairMin">Fair: Between</label>
                    <input type="number" step=".01" class="inputHalf" id="legendFairMin" disabled name="Fair" value="'.$lgood.'"> - 
                    <input type="number" step=".01" class="inputHalf" id="legendFair" name="Fair" value="'.$lfair.'">
                    <label class="legendLabel" for="legendPoorMin">Poor: Between</label>
                    <input type="number" step=".01" class="inputHalf" id="legendPoorMin" disabled name="Poor" value="'.$lfair.'"> -
                    <input type="number" step=".01" class="inputHalf" id="legendPoor" name="Poor" value="'.$lpoor.'">
                    <label class="legendLabel" for="legendBad">Bad: More Than</label>
                    <input type="number" step=".01" class="inputfull" disabled id="legendBad" name="Bad" value="'.$lbad.'">
                    <input type="hidden" name="updateIRILegend" value="1">
                    <input type="submit" class="inputUpdate" value="Update">
                </form> 
            </div>
        </div>
    </body>
</html>
';

echo $html;
?>
<!-- 
    good green #92D050 
    fair yellow #FFD966
    poor orange #df9814
    bad red #F00
-->

<style>
    .assetContainer .bodyContainer {
        width: 90%;
        margin-top: 5px;
        display:inline-block;
    }
    .legendContainer {
        display:inline-block;
        width: 8%;
        vertical-align:top;
    }
    .legendLabel {
        display:block;
    }
    #legendGood {
        background-color:#92D050;
    }
    #legendFair, #legendFairMin {
        background-color:#FFD966;
    }
    #legendPoor, #legendPoorMin {
        background-color:#df9814;
    }
    #legendBad{
        color:white;
        background-color:#F00;
    }
    .inputHalf {
        width : 40%;
    }
    .inputfull {
        width : 88%;
    }
    .inputUpdate {
        margin-top:5px;
    }

    /* hide the arrow on input type number */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }

    .blank_row{
        height: 15px !important;
        background-color: var(--surface);
    }
    .titleHeader {
        text-align : center;
    }
</style>