$(document).ready(function () {

	$("ul#floatbox-tabs .tab").on("click", function () {

		let $pagetoopen = $(this).attr("rel")
		let $tabclicked = $(this).attr("id")

		$(this).parent().find(".active").removeClass("active")
		$("#" + $tabclicked).addClass("active")

		$(".floatbox-body .scrollcontainer.active").css("display", "none")
		$(".floatbox-body .scrollcontainer.active").removeClass("active")

		$("#" + $pagetoopen).css("display", "block")
		$("#" + $pagetoopen).addClass("active")
	})
})

function floatboxTurnON(title, content) {
	$(".floatbox#floatbox").css("transform", "translate(-50%, -100%)")
	$(".floatbox#floatbox").fadeIn(150)
	$(".floatbox#floatbox").css("top", movePosition.y)
	$(".floatbox#floatbox").css("left", movePosition.x)
	$(".floatbox-header h4").html(title)
	$(".floatbox-body .scrollcontainer#page1").html(content);
	var ellipsoid = viewer.scene.globe.ellipsoid;
	var cartesian = viewer.scene.camera.pickEllipsoid(movePosition, ellipsoid);
	if (!cartesian || !cartesian.x || !cartesian.y) {
		return movePosition;
	}
	var cartographic = ellipsoid.cartesianToCartographic(cartesian);
	var alt = viewer.scene.globe.getHeight(cartographic);
	var lon = Cesium.Math.toDegrees(cartographic.longitude);
	var lat = Cesium.Math.toDegrees(cartographic.latitude);
	cameraClickPosition = {
		lon: lon,
		lat: lat,
		alt: alt
	};
}

function floatboxTurnOFF() {
	$(".floatbox#floatbox").hide();
	$(".tabs-item .tab.active").removeClass("active");
	$(".tabs-item .tab#tab1").addClass("active");
	$(".floatbox-body .scrollcontainer.active").css("display", "none");
	$(".floatbox-body .scrollcontainer.active").removeClass("active");
	$(".floatbox-body .scrollcontainer#page1").css("display", "block");
	$(".floatbox-body .scrollcontainer#page1").addClass('active');

	$("#floatbox-tabs").children().each(function () {
		if (!$(this).is(":contains('Info')")) {
			$(this).hide();
		};
	});

	$(".floatbox-body .scrollcontainer#page1").html("")
	$(".floatbox-header h4").html("")

}

function updateFloatBox() {
	if (cameraClickPosition == undefined) {
		return
	}
	var scene = viewer.scene;
	var p3d = Cesium.Cartesian3.fromDegrees(cameraClickPosition.lon, cameraClickPosition.lat, cameraClickPosition.alt);
	var p = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, p3d);
	if (!p) {
		return;
	}
	var popupNode = document.getElementById("floatbox");
	popupNode.style.left = p.x + "px";
	popupNode.style.top = p.y + "px";
}

function triggerTileHighlight(ElementId, Root_Model) {
	console.log(Root_Model)
	tilesetlist.forEach(function (tileset) {
		if (tileset.tileset && tileset.url.includes(Root_Model)) {
			console.log("Correct Model")
			tileset.tileset._root._content._features //array
			if (tileset.tileset._root._content._features.length > 0) {
				for (let i = 0; i < tileset.tileset._root._content._features.length; i++) {
					feature = tileset.tileset._root._content._features[i];
					if (feature.getProperty('assembly') == ElementId) {
						silhouetteBlue.selected = [feature];
						break;
					}
				}
			}

		}
	})
}