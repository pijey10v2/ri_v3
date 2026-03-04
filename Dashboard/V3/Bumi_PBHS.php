<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('bumi', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css"> 
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
    </head>
    <body class='.$themeClass.'>
        <div class = "dashboardBody">
            <div class="layout twoRow" id="lOne">
                <div class="rowOne s twoColumn flex">
                    <div class="columnOne L infoContainerDiv round shadow" style="">
                        <div class="infoContainer round shadow">
                            <div class="head">Consortium</div>
                            <div class="body centerMiddle">
                                <span id="bumiConsortiumCard">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round shadow">
                            <div class="head">Domestic</div>
                            <div class="body centerMiddle">
                                <span id="bumiDomesticCard">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round shadow">
                            <div class="head">Designated</div>
                            <div class="body centerMiddle">
                                <span id="bumiDesignatedCard">0</span>
                            </div>
                        </div>
                        <div class="infoContainer round shadow">
                            <div class="head">Nominated</div>
                            <div class="body centerMiddle">
                                <span id="bumiNominatedCard">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="columnTwo S twoRow">
                        <div class="tableContainer legend round shadow">
                            <table class="legend"> 
                                <thead>
                                    <th style="border-top-left-radius: 5px">Status</th>
                                    <th style="border-top-right-radius: 5px">Color</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Receive LOA</td>
                                        <td style="background-color:lime;"></td>
                                    </tr>
                                    <tr>
                                        <td>Potential Deal</td>
                                        <td style="background-color:yellow;"></td>
                                    </tr>
                                    <tr>
                                        <td>Hard Case</td>
                                        <td style="background-color:red;"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="rowTwo L">
                    <div class="tableContainer scrollbar-inner round shadow white" id = "dashboarditem">
                        <table id ="bumitb" style="background: transparent;"> 
                            <thead style="background: transparent;">
                                <th style="border-top-left-radius: 5px;">WPC ID</th>
                                <th>Category</th>
                                <th>Consortium</th>
                                <th>Status</th>
                                <th>Scope of Work</th>
                                <th>Value (RM)</th>
                                <th style="border-top-right-radius: 5px;">Type (Sebut Harga)</th>
                            </thead>
                            <tbody id="bumiTBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="loader" style="display:none;">
            <div class="cube-wrapper">
                <div class="cube-folding">
                    <span class="leaf1"></span>
                    <span class="leaf2"></span>
                    <span class="leaf3"></span>
                    <span class="leaf4"></span>
                </div>
                <span class="loading" data-name="Loading">Working</span>
            </div>
        </div>
        <script src="../../JS/dashboard/dashboardv3.js"></script>
    </body>
</html>
';

echo $html;

?>

<style type="text/css">
    .filterBtn {
        background-color: white;
        border: none;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        width: 70%;
    }
    .white{
        background-color: var(--surface);
    }
    .activeBtn {
        background-color: #ffc961;;
    }
    .centerMiddle{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .showLabel{
        font-size: 10px;
        display: none;
    }
    .clickableCard {
        cursor:pointer;
    }
</style>