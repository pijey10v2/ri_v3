<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('heavyMaintenance');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$projectName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
$fullName = 'Periodic Maintenance';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css"> 
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="../../CSS/jquery.scrollbar.css">
        <link rel="stylesheet" href="../../CSS/scrollBarCollapse.css">
        <script src="../../JS/JsLibrary/jquery.scrollbar.js"></script>
        <script src = "../../JS/scrollBarCollapse.js"></script>  
    </head>
    <body class='.$themeClass.'>
        <h4 id="printHeader">'.$fullName.' - '.$projectName.'</h4>
        <div class = "dashboardBody">
            <div class="layout twoRow" id="lOne" style="">
                <div class="rowOne SM twoColumn tableCell">
                    <div class="columnOne M40 twoColumn widthFull">
                        <div class="columnOne M shadow">
                            <div class="rowOne-T roundT">PAVEMENT</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td class="printTableParentOne">Total Budget Amount</td>
                                                    <td class="printTableParentOne" id="ttlBudgetPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Contract Amount</td>
                                                    <td class="printTableParentOne" id="ttlContractPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Amount Claimed</td>
                                                    <td class="printTableParentOne" id="ttlClaimPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Remaining Claim Amount</td>
                                                    <td class="printTableParentOne" id="ttlRemainClaimPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Remaining Budget Amount</td>
                                                    <td class="printTableParentOne" id="ttlRemainBudgetPave">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M shadow nonPaveHeightPrint">
                                <div class="rowOne-T roundT">NON PAVEMENT</div>
                                <div class="rowTwo-T roundB">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td class="printTableParentOne">Total Budget Amount</td>
                                                    <td class="printTableParentOne" id="ttlBudgetNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Contract Amount</td>
                                                    <td class="printTableParentOne" id="ttlContractNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Amount Claimed</td>
                                                    <td class="printTableParentOne" id="ttlClaimNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Remaining Claim Amount</td>
                                                    <td class="printTableParentOne" id="ttlRemainClaimNonPave">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentOne">Total Remaining Budget Amount</td>
                                                    <td class="printTableParentOne" id="ttlRemainBudgetNonPave">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columnTwo M60 threeColumn widthFull">
                            <div class="columnOne M shadow">
                                <div class="rowOne-T roundT">BRIDGE</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Budget Amount</td>
                                                    <td class="printTableParentTwo" id="ttlBudgetBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Contract Amount</td>
                                                    <td class="printTableParentTwo" id="ttlContractBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Amount Claimed</td>
                                                    <td class="printTableParentTwo" id="ttlClaimBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Remaining Claim Amount</td>
                                                    <td class="printTableParentTwo" id="ttlRemainClaimBr">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Remaining Budget Amount</td>
                                                    <td class="printTableParentTwo" id="ttlRemainBudgetBr">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M shadow">
                                <div class="rowOne-T roundT">SLOPE</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Budget Amount</td>
                                                    <td class="printTableParentTwo" id="ttlBudgetSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Contract Amount</td>
                                                    <td class="printTableParentTwo" id="ttlContractSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Amount Claimed</td>
                                                    <td class="printTableParentTwo" id="ttlClaimSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Remaining Claim Amount</td>
                                                    <td class="printTableParentTwo" id="ttlRemainClaimSlp">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Remaining Budget Amount</td>
                                                    <td class="printTableParentTwo" id="ttlRemainBudgetSlp">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="columnTwo M shadow">
                                <div class="rowOne-T roundT">ELECTRICAL</div>
                                <div class="rowTwo-T roundB" id ="">
                                    <div class="tableContainer scrollbar-inner roundB">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Budget Amount</td>
                                                    <td class="printTableParentTwo" id="ttlBudgetEl">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Contract Amount</td>
                                                    <td class="printTableParentTwo" id="ttlContractEl">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Amount Claimed</td>
                                                    <td class="printTableParentTwo" id="ttlClaimEl">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Remaining Claim Amount</td>
                                                    <td class="printTableParentTwo" id="ttlRemainClaimEl">RM 0</td>
                                                </tr>
                                                <tr>
                                                    <td class="printTableParentTwo">Total Remaining Budget Amount</td>
                                                    <td class="printTableParentTwo" id="ttlRemainBudgetEl">RM 0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rowTwo ML twoColumn">
                        <div class="columnOne M twoRow">
                            <div class="rowOne M">
                                <div class="rowOne-T roundT shadow">WORK ORDER</div>
                                <div class="rowTwo-T roundB shadow" id ="woChartParent"></div>
                            </div>
                            <div class="rowTwo M">
                                <div class="rowOne-T roundT shadow">WORK ORDER BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="woStatusChartParent"></div>
                            </div>
                        </div>
                        <div class="columnTwo M towRow">
                            <div class="rowOne M">
                                <div class="rowOne-T roundT shadow">CLAIM BY ASSET GROUP</div>
                                <div class="rowTwo-T roundB shadow" id ="claimChartStatusParent"></div>
                            </div>
                            <div class="rowTwo M">
                                <div class="rowOne-T roundT shadow">CLAIM BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="claimChartParent"></div>
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
    /* .infoContainer > div,span{
        cursor: default;
    } */
    .centerMiddle {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bottomIndicator {
        background: white !important;
        border-radius: 0px 0px 8px 8px;
        color: black !important;
        font-weight: unset !important;
    }
    .showLabel{
        display: none;
        word-wrap: break-word;
    }
    .clickableCard {
        cursor:pointer;
    }
    td:hover {
        cursor: default;
    }
    #printHeader{
        display: none;
        color: var(--on-surface);
    }
    @media print{
        #printHeader{
            display: block
        }
        .printTableParentOne{
            width: 260px
        }
        .printTableParentTwo{
            width: 180px
        }

        table { page-break-after:auto }
        table tr    { page-break-inside:avoid; page-break-after:auto }
        table td    { page-break-inside:avoid; page-break-after:auto }
        table thead { display:table-header-group }
        table tfoot { display:table-footer-group }
    }
</style>
