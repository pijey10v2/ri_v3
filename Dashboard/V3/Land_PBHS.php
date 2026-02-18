<?php
include_once '../dashboard.class.php';
$dashObj = new RiDashboard('land_PBHS', false, 0);

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- original stylesheet: /V3/dashboard.css -->
        <link rel="stylesheet" href="../../CSS/V3/dashboard_land.css">
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
        <!-- Latest compiled and minified JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"></script>
    </head>
    <body class='.$themeClass.'>
        <div class="container-fluid charts-container" id="lOne">

                <div class="row highcharts background">
                    <div class="col-md-12" style="padding: 0;">
                        <div class="ri-dash-header ri-dash-round-top">
                            Offer Issued
                        </div>
                    </div>    


                        <div class="col-md-10">
                                <div id="offerIssuedChart"></div>
                        </div>
                        <div class="col-md-2">
                            <div class="ri-dash-info-card-2">
                                <div class="head">Land</div>
                                <span class="data" id="offerLand"></span>
                            </div>
                            <div class="ri-dash-info-card-2">
                                <div class="head">Structure</div>
                                <span class="data text" id="offerStructure"></span>
                            </div>
                        </div>
  
                </div>

            <div class="row highcharts background">
                <div class="col-md-12" style="padding: 0;">
                    <div class="ri-dash-header ri-dash-round-top">
                        Payment Made
                    </div>
                </div>    

                <div class="col-md-10">
                    <div class="">
                        <div id="paymentChart"></div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="ri-dash-info-card-2">
                        <div class="head">Land</div>
                        <span class="data" id="paymentLand"></span>
                    </div>
                    <div class="ri-dash-info-card-2">
                        <div class="head">Structure</div>
                        <span class="data" id="paymentStructure"></span>
                    </div>
                </div>
            </div>

            <div class="row highcharts background">
                <div class="col-md-12" style="padding: 0;">
                    <div class="ri-dash-header ri-dash-round-top">
                        Demolished
                    </div>
                </div>    

                <div class="col-md-10">
                    <div class="">
                        <div id="demolisedChart"></div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="ri-dash-info-card-2">
                        <div class="head">Structure</div>
                        <span class="data" id="demolishStructure"></span>
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

<script>
    function updateAllMasks() {
        document.querySelectorAll('.highcharts-scrollable-mask').forEach(mask => {
            mask.setAttribute('fill-opacity', '1');
        });
 
        document.querySelectorAll('.highcharts-scrolling').forEach(mask => {
            mask.setAttribute('width', 'calc(12 * 72px)');
        });
    }
 
    const observer = new MutationObserver(() => {
        updateAllMasks();
    });
   
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
</script>