<?php 

/*
    - can define coordinate on load
    - datasource
        - GeoJSON source
        - Vector tile source 
    - Spatial data supported format - https://docs.microsoft.com/en-us/azure/azure-maps/spatial-io-read-write-spatial-data
        - GeoJSON
        - GeoRSS
        - GML
        - GPX
        - KML
        - KMZ
        - Spatial CSV
        - Well-Known Text

    Need More Research
        - need to update bounding box information in kmz file in order to fly to
        - There are many ways to expose the dataset to the application. One approach is to load the data into a database and expose a web service that queries the data. You can then send the results to the user's browser. This option is ideal for large datasets or for datasets that are updated frequently. However, this option requires more development work and has a higher cost.


    Helpful tutorial
    https://docs.microsoft.com/en-us/azure/azure-maps/tutorial-create-store-locator
*/

?>
<head>
<link rel="stylesheet" type="text/css" href="css/multi-select.css">
<link rel="stylesheet" type="text/css" href="css/azure-map.css">

<!-- load jquery -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.1/jquery.min.js"></script> -->
<script src="js/JsLibrary/jquery-3.5.1.js"></script>
<!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>

<!-- Add a reference to the Azure Maps Services Module JavaScript file. -->
<script src="https://atlas.microsoft.com/sdk/javascript/service/2/atlas-service.min.js"></script>

<!-- Installing the Spatial IO module -->
<script src="https://atlas.microsoft.com/sdk/javascript/spatial/0/atlas-spatial.js"></script>

<!-- multi select  -->
<script src="js/JsLibrary/jquery.multi-select.js"></script>

<script src="js/JsLibrary/az-map.js"></script>

</head>

<body>

<!-- load map here -->
    <div id="myMap"></div>
    
    <!-- search box -->
    <div id="main-search">
        <div class="search-input-box">
            <div class="search-input-group">
                <div class="search-icon" type="button"></div>
                <input id="search-input" type="text" placeholder="Search">
            </div>
        </div>
        <ul id="results-panel"></ul>
    </div>
    <div class="menu-btn">
        <button onclick="showDiv(this)" data-dv="find-route" class="find-route-btn" title="Find Me the Distance"><img src="images/icons/azure_map/distance.png"></button>
        <button onclick="showDiv(this)" data-dv="recom-crew" class="recom-crew-btn" title="Recommend Maintenance Crew"><img src="images/icons/azure_map/engineer.png"></button>
        <button onclick="showDiv(this)" data-dv="opti-crew" class="opti-crew-btn" title="Optimise Maintenance Crew"><img src="images/icons/azure_map/maintenance.png"></button>
    </div>
    <div class="left-panel">
        <div id="routing-form" class="left-panel-item find-route-main">
            <div class="row row-size2 column">
                <h3>Routing:</h3>
            </div>
            <div class="row row-size2 column address-container" id="point-a-container">
                <label for="point-a-address">Point A</label>
                    <!-- <div class="search-input-box"> -->
                        <!-- <div class="search-input-group"> -->
                        <input class="address" id="point-a" name="point-a-address" type="text" value="" data-invalid-address="false" data-point="   PointA" placeholder="Search" autocomplete="off">
                        <!-- </div> -->
                    <!-- </div> -->
                <button class="point-a-btn" onclick="pickPointA()">Set Point A</button>
            </div>
            <div class="hide search-info-box" id="search-info-point-a"></div>
            <div class="row row-size2 column address-container" id="point-b-container">
                <label for="point-b-address">Point B</label>
            <input class="address" id="point-b" name="point-b-address" type="text" value="" data-invalid-address="false" data-point="PointB"    placeholder="Search" autocomplete="off">
                <button class="point-b-btn" onclick="pickPointB()">Set Point B</button>
            </div>
            <div class="hide search-info-box" id="search-info-point-b"></div>
            <div class="row row-size2">
                <input type="checkbox" id="show-date-checkbox" name="show-time" value="show">
                <label for="show-date-checkbox" autocomplete="off"> Specify date and time ? </label><br>
                <!--<div class="column medium-8">
                    <select id="time-type" name="departureType" aria-label="Departure Type">
                        <option value="departAt">Depart at</option>
                        <option value="arriveAt">Arrive by</option>
                    </select>
                </div> -->
            </div>
            <div class="route-datetime">
                <div class="row row-size2">
                    <div class="column medium-6 end">
                        <label for="date">Date</label><br>
                        <input id="date" name="date" type="date" value="">
                    </div>
                </div>
                <div class="row row-size2">
                    <div class="column medium-6 end">
                        <label for="time">Time</label><br>
                        <input id="time" name="time" type="time" value="">
                    </div>
                </div>
                <div class="row row-size1 column error-message" id="error-time">
                    <p>**Invalid date. Please set date/time in the future</p>
                </div>
            </div>

        </div>  

        <div class="route-matrix left-panel-item recom-crew-main">
            <div class="row row-size2 column">
                <h3>Routing Matrix:</h3>
            </div>
            <div>
                <label for="date-route-m">Date</label>
                <input id="date-route-m" name="date-route-m" type="date" value="">
            </div>
            <div>
                <label for="time">Time</label>
                <input id="time-route-m" name="time" type="time" value="">
            </div>
            <div class="category-drop-down">
                <label for="category">Maintenance for </label>
                <select name="category" id="category">
                    <option value="all">-- All --</option>
                    <option value="pavement">Pavement</option>
                    <option value="slope">Slope</option>
                    <option value="bridge">Bridge</option>
                    <option value="drainage">Drainage</option>
                    <option value="road-furniture">Road Furniture</option>
                </select>
            </div>
            <select name="crew" id="crew" multiple autocomplete="off">
            </select>
            <select name="wo" id="wo" multiple autocomplete="off">
            </select>
            <button id="rm-process" onclick="checkRouteDistance()">Run Checking</button>
            <div class="rm-error-msg"></div> 
            <div class="loader route-matrix-loader"></div> 
            <div id="route-matrix-res-cont">
                <div id="route-matrix-res"></div>
            </div>
        </div>

        <div class="left-panel-item opti-crew-main">
            <div class="opti-crew-wo-sel">
                <label for="category">Work Order </label>
                <select name="opti-crew-wo" id="opti-crew-wo">
                    <option disabled selected value> -- select work order -- </option>
                </select>
            </div>
            <div class="opti-crew-tdis">
                <label for="opti-crew-wo-tdis-inp">Travel distance (m)</label>
                <input class="address" id="opti-crew-wo-tdis-inp" name="opti-crew-wo-tdis-inp" type="number" value="3000" placeholder="" autocomplete="off"> 
            </div>
            <div class="loader opti-crew-loader"></div> 
            <div class="opti-crew-res"></div> 
        </div>

    </div>
    
    
    <!-- <div id="search"> -->
    <!--   <div class="search-input-box">
            <div class="search-input-group">
                <div class="search-icon" type="button"></div>
                <input id="search-input" type="text" placeholder="Search">
            </div>
        </div> -->

    <!-- </div> -->
</body>

