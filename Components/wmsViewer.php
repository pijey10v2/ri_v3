<!DOCTYPE html>
<html lang="en">
<?php
include_once("../BackEnd/class/jogetLink.class.php");
$jogetLinkObj = new JogetLink();
$jogetLinkObj->setToGlobalJSVariable();
?>
<head>
    <link rel="stylesheet"
        href="../CSS/openLayer.css"
        type="text/css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <style>
        .map {
            width: 100%;
            height: 90vh;
            border: solid;
        }
    </style>
    <script src="../JS/JsLibrary/openLayer/openLayer.js"></script>
</head>

<body>
    <h4 id="layerTitle"></h4>
    <div id="olMap" class="map"></div>

    <script>
        $(document).ready(() => {
            if(GEOHOST){
                const urlPara = window.location.search;
                const urlParams = new URLSearchParams(urlPara);
                const selectedWMS = urlParams.get("layer")
                const projectId = urlParams.get("packageId")
                console.log(selectedWMS)
                var parser = new ol.format.WMSCapabilities();
                fetch(
                    GEOHOST+"/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities"
                )
                .then(function (response) {
                    return response.text();
                })
                .then(function (text) {
                    var result = parser.read(text);
                    console.log(result)
                    var layer = result.Capability.Layer.Layer.find(
                        (l) => l.Name === projectId + ":" + selectedWMS
                    );
                    console.log(projectId + ":" + selectedWMS)
                    var projCode = layer.BoundingBox[1].crs;
                    var extent = layer.BoundingBox[1].extent;
                    console.log(projCode, extent)
                    var wms = new ol.layer.Image({
                        source: new ol.source.ImageWMS({
                            ratio: 1,
                            url: GEOHOST+`/geoserver/${projectId}/wms`,
                            params: {
                                LAYERS: [projectId + ":" + selectedWMS],
                            },
                        }),
                    });
                    var projection = new ol.proj.Projection({
                        code: projCode,
                        units: "m",
                        global: false,
                    });
                    var view = new ol.View({
                        projection: projection,
                        maxZoom: 2000,
                    });
                    var map = new ol.Map({
                        target: "olMap",
                        view: view,
                    });
                    map.addLayer(wms);
                    map.getView().fit(extent, map.getSize());
                });
            }
        })

    </script>
</body>

</html>