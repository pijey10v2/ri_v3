<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('heavyMaintenancePackage');
$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';
$projectName = (isset($_SESSION['project_name'])) ? $_SESSION['project_name'] : '';
$fullName = 'Periodic Maintenance';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
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
                    <div class="rowOne M twoRow">
                        <div class="rowOne SM infoContainerDiv">
                            <div class="infoContainer round shadow" style="margin-left: 0px;">
                                <div class="head">TOTAL CONTRACT AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id="amtContract">RM 0</span>
                                </div>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">TOTAL AMOUNT CLAIMED</div>
                                <div class="body centerMiddle">
                                    <span id="amtClaim">RM 0</span>
                                </div>
                            </div>
                            <div class="infoContainer round shadow">
                                <div class="head">REMAINING AMOUNT</div>
                                <div class="body centerMiddle">
                                    <span id="amtRemain">RM 0</span>
                                </div>
                            </div>
                        </div>
                        <div class="rowTwo ML threeColumn columnToRow" style="margin-top: 0; padding-bottom: 5px;">
                            <div class="columnOne M twoRow">
                                <div class="rowOne-T roundT shadow">WORK ORDER</div>
                                <div class="rowTwo-T roundB shadow" id ="woChart"></div>
                            </div>
                            <div class="columnTwo M twoRow">
                                <div class="rowOne-T roundT shadow">WORK ORDER BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="woChartStatus"></div>
                            </div>
                            <div class="columnTwo M twoRow">
                                <div class="rowOne-T roundT shadow">CLAIM BY STATUS</div>
                                <div class="rowTwo-T roundB shadow" id ="claimChart"></div>
                            </div>
                        </div>
                    </div>
                    <div class="pagebreak"></div>
                    <div class="rowOne M twoRow round shadow positionAbsolute">
                        <div class="rowOne-T roundT" id="woTitle">WORK ORDER RECORD</div>
                        <div class="rowTwo-T roundB">
                            <div class="tableContainer roundB">
                                <table id ="" class=""> 
                                    <thead>
                                        <tr><th colspan="11" id="woTableTitle">WORK ORDER RECORD</th></tr>
                                        <tr>
                                            <th class="tableHeader">Asset Type</th>
                                            <th class="tableHeader">Contract No.</th>
                                            <th class="tableHeader">Contract Name</th>
                                            <th class="tableHeader">Contract Amount</th>
                                            <th class="tableHeader">WO Ref</th>
                                            <th class="tableHeader">WO Activity</th>
                                            <th class="tableHeader">WO Amount</th>
                                            <th class="tableHeader">WO Duration</th>
                                            <th class="tableHeader">Status</th>
                                            <th class="tableHeader">No of RFI</th>
                                            <th class="tableHeader">No of NCP</th>
                                        </tr>
                                    </thead>
                                    <tbody id="wo_record_package">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="pagebreak"></div>
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
    #woTableTitle{
        display: none;
    }
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
    .condGreen, .condRed, .condYellow{
        white-space: nowrap
    }
    .condGreen:before {
        content: "";
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: inline-block;
        background-color: #52BE80;
        vertical-align: sub;
        margin-right: 3px;
    }
    .condRed:before {
        content: "";
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: inline-block;
        background-color: #E93232;
        vertical-align: sub;
        margin-right: 3px;
    }
    .condYellow:before {
        content: "";
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: inline-block;
        background-color: #F4D03F;
        vertical-align: sub;
        margin-right: 3px;
    }

    @media screen and (min-height: 924px){
        .condGreen:before {
            content: "";
            width: 14px;
            height: 14px;
        }
        .condRed:before {
            content: "";
            width: 14px;
            height: 14px;
        }
        .condYellow:before {
            content: "";
            width: 14px;
            height: 14px;
        }
    }
    @media screen and (max-width: 1366px){
        .condGreen:before {
            content: "";
            width: 11px;
            height: 11px;
        }
        .condRed:before {
            content: "";
            width: 11px;
            height: 11px;
        }
        .condYellow:before {
            content: "";
            width: 11px;
            height: 11px;
        }
    }
    .showLabel{
        display: none
    }
    .clickableCard {
        cursor:pointer;
    }
    #printHeader{
        color: var(--on-surface);
        display: none
    }
    @media print{
        #printHeader{
            display: block
        }
        table {
            page-break-inside: avoid;
            page-break-after: auto;
        }

        table, td, th{
            border-collapse: collapse;
            padding: 5px 3px;
            border: 0.2px solid black !important;
            font-size: 12px;
        }

        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        
        table tfoot thead {
            break-inside: auto;
            overflow: hidden;
        }

        .dashboardBody .tableContainer th{
            top: unset;
            position: unset
        }

        .pagebreak {
            clear: both;
            page-break-after: always;
        }

        #lOne, .dashboardBody .twoRow{
            display: flex;
            flex-direction: column;
        }

        #woTitle{
            display: none;
        }

        #woTableTitle{
            display: table-cell;
            text-align: center;
        }

        .positionAbsolute{
            position: absolute;
            bottom: -115mm;
        }
    }
</style>
