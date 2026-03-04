<?php
if (session_status() == PHP_SESSION_NONE) session_start();
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

require('../../../login/include/_include.php');

global $CONN;
// handle the update here
?>
<script rel="javascript" type="text/javascript">   
function updateLegend(lgdGood, lgdFair, lgdPoor) {
    var legendsTable = legendsTable = window.parent.document.getElementById("pipeLegends")
    window.parent.$(".header").show();
    
    legendsTable.innerHTML = "<tr><td style='background-color:rgb(0%, 100%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Good (IRI < "+lgdGood+")</td></tr>"
    legendsTable.innerHTML += "<tr><td style='background-color:rgb(100%, 100%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Fair (IRI between "+lgdGood+" & "+lgdFair+") </td></tr>"
    legendsTable.innerHTML += "<tr><td style='background-color:rgb(100%, 45%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Poor (IRI between "+lgdFair+" & "+lgdPoor+")</td></tr>"
    legendsTable.innerHTML += "<tr><td style='background-color:rgb(100%, 0%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Bad ( IRI >= "+lgdPoor+")</td></tr>"       
}
</script>
<?php

if(isset($_POST['updateIRILegend'])){
    $vGood = filter_input(INPUT_POST, 'Good', FILTER_SANITIZE_STRING);
    $vFair = filter_input(INPUT_POST, 'Fair', FILTER_SANITIZE_STRING);
    $vPoor = filter_input(INPUT_POST, 'Poor', FILTER_SANITIZE_STRING);
    $CONN->execute("update analysis_legend set al_good =:0, al_fair=:1, al_poor =:2, al_bad =:3 where al_category = 'iri_analysis'", array($vGood, $vFair, $vPoor, $vPoor));
        ?>
        <script type="text/javascript">
            var lgGood = "<?php Print($vGood); ?>";
            var lgFair = "<?php Print($vFair); ?>";
            var lgPoor = "<?php Print($vPoor); ?>";
            updateLegend(lgGood,lgFair,lgPoor);    
        </script>
        <?php

    if(!$CONN->lastRowCount()){
        $CONN->execute("insert into analysis_legend (al_good, al_fair, al_poor, al_bad, al_category) values (:0, :1, :2, :3, 'iri_analysis')", array($vGood, $vFair, $vPoor, $vPoor));
        ?>
        <script type="text/javascript">
            var lgGood = "<?php Print($vGood); ?>";
            var lgFair = "<?php Print($vFair); ?>";
            var lgPoor = "<?php Print($vPoor); ?>";
            updateLegend(lgGood,lgFair,lgPoor);    
        </script>
        <?php
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
        <link rel="stylesheet" href="../../../CSS/V3/home.css">
        <link rel="stylesheet" href="../../../CSS/V3/Wizard.css">
        <link rel="stylesheet" href="../../../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <link rel="stylesheet" href="../../../JS/JsLibrary/jquery-confirm.min.css">
        <script src="../../../JS/JsLibrary/jquery-confirm.min.js"></script>
        <script src = "../../../JS/asset/mlpAnalysis.js"></script>
        <link rel="stylesheet" href="../../../CSS/fontawesome7/fontawesome-free/css/all.min.css">
        <link rel="stylesheet" href="../../../CSS/fontawesome7/fontawesome-free/css/fontawesome.min.css">
        <link rel="stylesheet" href="../../../CSS/fontawesome7/fontawesome-free/css/solid.min.css">
        <link rel="stylesheet" href="../../../CSS/fontawesome7/fontawesome-free/css/regular.min.css">
        <link rel="stylesheet" href="../../../CSS/fontawesome7/fontawesome-free/css/brands.min.css">

    </head>
    <body style="background: transparent" class='.$themeClass.'>
        <div class="assetContainer">
            <div class="filterContainer filterOnly">
                <div class="filter">
                    <span class="labelTitle inlineLabel">Date</span>
                    <select id="dataDateOpt" class="selectOption" onchange="fetchData(this)">
                    </select>
                </div>
                <div style="display: flex">
                    <div class="filter">
                        <span class="labelTitle inlineLabel">Chainage From</span>
                        <select id="chgFromOpt" class="chgOptions selectOption" onchange="filterChg()">
                        </select>
                    </div>
                    <div class="filter marginRight">
                        <span class="labelTitle inlineLabel">Chainage To</span>
                        <select id="chgToOpt" class="chgOptions selectOption" onchange="filterChg()">
                        </select>
                    </div>
                </div>
            </div>
            <div class="bodyContainer mlpAnalysis">
                <div class="titleHeader" id="titleHeader">Date :</div>
                <div class="tableContainer mlpAnalysis">
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
            <div class="legendContainer mlpAnalysis">
                <form method="post">
                    <div><b>IRI Legend Setup</b></div>
                    <label class="legendLabel legendLabelGood" for="legendGood">Good: Less than</label>
                    <input type="number" step=".01" class="inputfull" id="legendGood" name="Good" value="'.$lgood.'">
                    <label class="legendLabel" for="legendFairMin">Fair: Between</label>
                    <div class="twoColumn indicatorContainer">
                        <input type="number" step=".01" class="inputHalf" id="legendFairMin" disabled name="Fair" value="'.$lgood.'">
                        <i class="fa-solid fa-minus"></i>
                        <input type="number" step=".01" class="inputHalf" id="legendFair" name="Fair" value="'.$lfair.'">
                    </div>
                    <label class="legendLabel" for="legendPoorMin">Poor: Between</label>
                    <div class="twoColumn indicatorContainer">
                        <input type="number" step=".01" class="inputHalf" id="legendPoorMin" disabled name="Poor" value="'.$lfair.'">
                        <i class="fa-solid fa-minus"></i>
                        <input type="number" step=".01" class="inputHalf" id="legendPoor" name="Poor" value="'.$lpoor.'">
                    </div>
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

<style>
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

    .blank_row{
        height: 15px !important;
        background-color: var(--surface);
    }
</style>

<script>
    $('body').removeClass().addClass(localStorage.themeJoget)
</script>