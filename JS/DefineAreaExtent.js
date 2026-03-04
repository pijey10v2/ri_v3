
//Cesium for defining area extent
Cesium.BingMapsApi.defaultKey = 'AgWzRGyO26urfR6O6qFMkOAvSW8TZxds6jR_yPiTvbO_Dx9t-s5sheKO0m9vL_SJ';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YTU2OTcxMC0wNzdmLTQyZDItOWVkNy0xZjU4NTgzYTVjNTUiLCJpZCI6NzI3Miwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0ODg2ODEwM30.Lc-IQBDSPyhqgPR2v-Ejcb34ksKJLr23mXsOhszBcHI';

var viewerAdmin = new Cesium.Viewer('RIContainer1', {
     baseLayerPicker: false
    , timeline: false
    , animation: false
    , geocoder: false
	, fullscreenButton: false
	, credit: false
    , Button: true
    , sceneModePicker: false
    , navigationHelpButton: false
    , infoBox: false
    , imageryProvider: new Cesium.BingMapsImageryProvider({
                    url : 'https://dev.virtualearth.net',
                    mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
                })
 });

var defaultview = Cesium.Rectangle.fromDegrees(93.0, -15.0, 133.0, 30.0); // S.E.A. extent 
viewerAdmin.camera.setView({
    destination: defaultview
});

var viewer2 = new Cesium.Viewer('RIContainer2', {
     baseLayerPicker: false
    , timeline: false
    , animation: false
    , geocoder: false
	, fullscreenButton: false
	, credit: false
    , homeButton: true
    , sceneModePicker: false
    , navigationHelpButton: false
    , infoBox: false
    , imageryProvider: new Cesium.BingMapsImageryProvider({
        url : 'https://dev.virtualearth.net',
        mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
    })
});

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = defaultview;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

viewerAdmin._cesiumWidget._creditContainer.style.display = "none";
viewer2._cesiumWidget._creditContainer.style.display = "none";
function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}
var selector;
var selector2;
var selector3;
var rectangleSelector = new Cesium.Rectangle();
var screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(viewerAdmin.scene.canvas);
var cartesian = new Cesium.Cartesian3();
var tempCartographic = new Cesium.Cartographic();
var firstPoint = new Cesium.Cartographic();
var firstPointSet = false;
var mouseDown = false;
var camera = viewerAdmin.camera;
viewerAdmin.scene.screenSpaceCameraController.enableTranslate = false;
viewerAdmin.scene.screenSpaceCameraController.enableTilt = false;
viewerAdmin.scene.screenSpaceCameraController.enableLook = false;
viewerAdmin.scene.screenSpaceCameraController.enableCollisionDetection = false;
//Draw the selector while the user drags the mouse while holding shift
screenSpaceEventHandler.setInputAction(function drawSelector(movement) {
    if (!mouseDown) {
        return;
    }
    cartesian = camera.pickEllipsoid(movement.endPosition, viewerAdmin.scene.globe.ellipsoid, cartesian);
    if (cartesian) {
        //mouse cartographic
        tempCartographic = Cesium.Cartographic.fromCartesian(cartesian, Cesium.Ellipsoid.WGS84, tempCartographic);
        if (!firstPointSet) {
            Cesium.Cartographic.clone(tempCartographic, firstPoint);
            firstPointSet = true;
        }
        else { //in radian, may need to convert to degree
            rectangleSelector.east = Math.max(tempCartographic.longitude, firstPoint.longitude);
            rectangleSelector.west = Math.min(tempCartographic.longitude, firstPoint.longitude);
            rectangleSelector.north = Math.max(tempCartographic.latitude, firstPoint.latitude);
            rectangleSelector.south = Math.min(tempCartographic.latitude, firstPoint.latitude);
            selector.show = true;
            selector2.show = true;
        }
        $("#lat1,#latit1").html(radians_to_degrees(firstPoint.latitude).toFixed(4));
        $("#lat2,#latit2").html(radians_to_degrees(tempCartographic.latitude).toFixed(4));
        $("#long1,#longit1").html(radians_to_degrees(firstPoint.longitude).toFixed(4))
        $("#long2,#longit2").html(radians_to_degrees(tempCartographic.longitude).toFixed(4))
        $("#coordinateval2").show()
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);
var getSelectorLocation = new Cesium.CallbackProperty(function getSelectorLocation(time, result) {
    return Cesium.Rectangle.clone(rectangleSelector, result);
}, false);
screenSpaceEventHandler.setInputAction(function startClickShift() {

    if(ReadEntity && ReadEntity.show == true){
        return;
    }

    mouseDown = true;
    selector.rectangle.coordinates = getSelectorLocation;
}, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT);
screenSpaceEventHandler.setInputAction(function endClickShift() {
    mouseDown = false;
    firstPointSet = false;
    selector.rectangle.coordinates = rectangleSelector;
}, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.SHIFT);
screenSpaceEventHandler.setInputAction(function hideSelector() {
    selector.show = false;

	if(typeof click_project_details !== "undefined"){
        $("#latit1").html(click_project_details.lat1)
        $("#latit2").html(click_project_details.lat2)
        $("#longit1").html(  click_project_details.long1)
        $("#longit2").html(click_project_details.long2)
   }
   else if($("#lati1").html() !== ""){
        $("#latit1").html(  $("#lati1").html())
        $("#latit2").html(  $("#lati2").html())
        $("#longit1").html(  $("#longi1").html())
        $("#longit2").html(  $("#longi2").html())
   }
    if ( $("#latit1").html() ==  $("#latit2").html() || ( typeof ReadEntity !== "undefined" && ReadEntity.show == false) ){
        $("#coordinateval2").hide()
    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
selector = viewerAdmin.entities.add({
    selectable: false
    , show: false
    , rectangle: {
        coordinates: getSelectorLocation
        , material: Cesium.Color.RED.withAlpha(0.2)
    }
});
selector2 = viewer2.entities.add({
    selectable: false
    , show: false
    , rectangle: {
        coordinates: getSelectorLocation
        , material: Cesium.Color.GREEN.withAlpha(0.2)
    }
});

function OnClickAdminSaveProject(){
	if (selector.show == true){
		ReadEntity.show = false;
	} 	
}

function OnClickOpenViewer2() { //
    if (selector.show == true) { 
        viewer2.camera.setView({
            destination: rectangleSelector
        });
        selector2.show = true;
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = rectangleSelector;
    }    
    else if ((!(ReadEntity == null)) && ReadEntity.show == true){
        if(ReadEntity2){
            viewer2.entities.remove(ReadEntity2)
        }
        if(selector3){
            viewer2.entities.remove(selector3)
        }
        selector3 = viewer2.entities.add({
            selectable: false
            , show: true
            , rectangle: {
                coordinates: readRectangle
                , material: Cesium.Color.RED.withAlpha(0.2)
            }
        })
                viewer2.camera.setView({
            destination: readRectangle
        });
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = readRectangle;
    }  
    else  if (selector.show == false) {
        viewer2.camera.setView({
            destination: defaultview
        });
        selector2.show = false;
        $("#lat1,#lat2,#long1,#long2").text = "";
    } 
	else{
        console.log("No extent defined")
    }
    
}
var ReadEntity;
var ReadEntity2;

var readRectangle;
//cesium for read 
function OnClickOpenReadViewer() {
    if(typeof ReadEntity !=="undefined"){
        ReadEntity.show = false;
    }
	if(typeof click_project_details !== "undefined"){
		 lat1 = click_project_details.lat1;
		 lat2 = click_project_details.lat2;
		 long1 = click_project_details.long1;
         long2 = click_project_details.long2;
    }
	else{
		lat1 =  Number($("#lati1").text());
		lat2 = Number($("#lati2").text());
        long1 = Number($("#longi1").text());
        long2 = Number($("#longi2").text());
    }

    if (lat1 == long1 || lat1 == "" || !lat1 ) {
        viewer2.camera.setView({
            destination: defaultview
        });
        $("#coordinateval1").html("")
        $("#coordinateval2").hide()
        return
    }
    else {
        if(ReadEntity2){
            viewer2.entities.remove(ReadEntity2)
        }
        $("#lat1").html(lat1);
        $("#lat2").html(lat2);
        $("#long1").html(long1);
        $("#long2").html(long2);
        var west = Math.min(long1, long2)
        var east = Math.max(long1, long2)
        var south = Math.min(lat1, lat2)
        var north = Math.max(lat1, lat2)
        readRectangle = Cesium.Rectangle.fromDegrees(west, south, east, north)
        ReadEntity2 = viewer2.entities.add({
            selectable: false
            , show: true
            , rectangle: {
                coordinates: readRectangle
                , material: Cesium.Color.BLUE.withAlpha(0.2)
            }
        });
        viewer2.camera.setView({
            destination: readRectangle
        });
        
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = readRectangle;
    }
}

function OnClickClearMap(){
    event.preventDefault()
    if (typeof selector !== "undefined") {
        selector.show = false;
    }
    if (typeof ReadEntity !== "undefined") {
        ReadEntity.show = false;
        if(typeof ReadEntity2 !== "undefined"){
            ReadEntity2.show = false;
        }
    }
    $("#latit1").html("")
    $("#latit2").html("")
    $("#longit1").html("")
    $("#longit2").html("")
    $("#coordinateval2").hide()
}