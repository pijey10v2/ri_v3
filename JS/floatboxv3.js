$(document).ready(function () {

})

function floatboxV3TurnON(title, content, layerPath="") {
	//html cannot read undefined
	title = (title == undefined) ? '' : title;
	$("#floatBoxId").fadeIn(150)
	$("#floatBoxId").css("top", movePosition.y)
	$("#floatBoxId").css("left", movePosition.x)
	$(".floatBoxHeader .header").html(title)
	$(".floatBoxBody").html(content);


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

function floatboxV3TurnOFF() {
	$("#floatBoxId").hide();

}

function assetDataFloatBox(infoContID, docContID, elementID, fromList = false) {
	agileWOFlag = true;
	$("#" + infoContID).html('');
	$("#" + docContID).html('');

	$.ajax({
		url: "../BackEnd/fetchDatav3.php",
		type: "post",
		dataType: 'json',
		data: {
			functionName: 'getAssetInfo',
			elementId: elementID
		},
		success: function (response) {
			let infoHTML = '';
			let moreInfoHTML = '';
			let docHTML = '';
			let nameHTML = '';
			if (response.bool && response.bool === false) {
				nameHTML = 'No Data Found.';
				infoHTML = 'No info found.';
				moreInfoHTML = 'No info found.';
				docHTML = 'No document found.';
			} else {
				// populate info tab
				infoHTML += '<div class="cesium-infoBox-description-lighter" style="overflow:auto;word-wrap:break-word;background-color:rgb(255,255,255);color:rgb(0,0,0);"><table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
				moreInfoHTML += '<div class="cesium-infoBox-description-lighter" style="overflow:auto;word-wrap:break-word;background-color:rgb(255,255,255);color:rgb(0,0,0);"><table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
				if (response.CSV) {
					nameHTML = response.CSV.data.Item;
					agileWOCache = response.CSV.data
					moreInfoHTML += `<tr><th>Asset Name</th><td>` + ((response.CSV.data.Label === null) ? ` -` : response.CSV.data.Label) + `</td></tr>
					<tr><th>Floor</th><td>` + ((response.CSV.data.Level === null) ? ` -` : response.CSV.data.Level) + `</td></tr>
					<tr><th>Manufacturer</th><td>` + ((response.CSV.data.Mark === null) ? ` -` : response.CSV.data.Mark) + `</td></tr>
					<tr><th>Membermark</th><td>` + ((response.CSV.data.Membermark === null) ? ` -` : response.CSV.data.Membermark) + `</td></tr>
					<tr><th>Type</th><td>` + ((response.CSV.data.Type === null) ? ` -` : response.CSV.data.Type) + `</td></tr>
					<tr><th>Type Mark</th><td>` + ((response.CSV.data[`Type Mark`] === null) ? ` -` : response.CSV.data[`Type Mark`]) + `</td></tr>`;
					for (const [key, val] of Object.entries(response.CSV.data)) {
						if (key && key != 'Docs' && key != 'Coordinate') {
							if (key == "Label") {
							}
							else if (key == "Level") {
							}
							else if (key == "Mark") {
							}
							else if (key == "Membermark") {
							}
							else if (key == "Type") {
							}
							else if (key == "Type Mark") {
							} else {
								moreInfoHTML += '<tr><th>' + key + '</th><td>' + ((val === null) ? ' -' : val) + '</td></tr>';
							}
						}
					}
					moreInfoHTML += '<tr><th>Work Order</th><td><button id="floatboxWorkorderButton" onclick="OnClickWorkorderfloatbox()">Create</button></td></tr>';
				}
				if (response.Agile) {
					nameHTML = response.Agile.data.Name;
					for (const [key, val] of Object.entries(response.Agile.data)) {
						if (key && key != 'Docs' && key != 'Coordinate') {
							infoHTML += '<tr><th>' + key + '</th><td>' + ((val === null) ? ' -' : val) + '</td></tr>';
						}
					}
					// populate doc tab
					if (response.Agile.data.Docs) {
						let docLinkPrefix = 'https://www.dropbox.com/home';
						docHTML += '<div class="cesium-infoBox-description-lighter" style="overflow:auto;word-wrap:break-word;background-color:rgb(255,255,255);color:rgb(0,0,0);"><table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
						docHTML += '<tr><th>Document</th><th>Category</th></tr>';
						response.Agile.data.Docs.forEach(function (doc) {
							let docLink = (doc.link && doc.link.toUpperCase().includes("http")) ? doc.link : docLinkPrefix + doc.link;
							let docLinkHTML = '<a target = "_blank" href="' + docLink + '" title = "' + doc.file + '">' + doc.file + '</a>';
							docHTML += '<tr><td >' + docLinkHTML + '</td><td>' + doc.category + '</td></tr>';
						});
					}
				}
				else {
					docHTML += 'No document found.';
				}

			}
			$("#page1").html(infoHTML);
			$("#page1half").html(moreInfoHTML);
			$("#" + docContID).html(docHTML);

			// if from agile Asset List, manually show the box after fly to
			if (fromList) {
				// only fly and show float box when dat found
				if (response.bool !== false) {
					if (response.CSV.data.Coordinate) {
						$("#floatBoxId").fadeIn(150)
						$("#floatBoxId").css("top", "50%");
						$("#floatBoxId").css("left", "50%");
						$(".floatBoxHeader .header").html(nameHTML)
						$(".floatBoxBody").html(moreInfoHTML);
						// coordinate will be either from agile or set it somewhere as for now
						let lon = response.CSV.data.Coordinate.long;
						let lat = response.CSV.data.Coordinate.lat;
						let alt = response.CSV.data.Coordinate.alt;
						viewer.camera.flyTo({
							destination: new Cesium.Cartesian3.fromDegrees(lon, lat, alt + 100),
							complete: function () {
								$(".floatbox#floatbox").fadeIn(150);
								cameraClickPosition = {
									lon: lon,
									lat: lat,
									alt: alt
								};
								triggerTileHighlight(elementID, response.CSV.data.Root_Model)
							}
						});
					}
				}
			} else {
				$("#floatBoxId").fadeIn(150)
				$("#floatBoxId").css("top", "50%");
				$("#floatBoxId").css("left", "50%");
				$(".floatBoxHeader .header").html(nameHTML)
				$(".floatBoxBody").html(moreInfoHTML);
				// coordinate will be either from agile or set it somewhere as for now
				let lon = response.CSV.data.Coordinate.long;
				let lat = response.CSV.data.Coordinate.lat;
				let alt = response.CSV.data.Coordinate.alt;
				viewer.camera.flyTo({
					destination: new Cesium.Cartesian3.fromDegrees(lon, lat, alt + 100),
					complete: function () {
						$(".floatbox#floatbox").fadeIn(150);
						cameraClickPosition = {
							lon: lon,
							lat: lat,
							alt: alt
						};
						triggerTileHighlight(elementID, response.CSV.data.Root_Model)
					}
				});
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	});
}


function updateFloatBoxV3() {
	if (cameraClickPosition == undefined) {
		return
	}
	var scene = viewer.scene;
	var p3d = Cesium.Cartesian3.fromDegrees(cameraClickPosition.lon, cameraClickPosition.lat, cameraClickPosition.alt);
	var p = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, p3d);
	if (!p) {
		return;
	}
	var popupNode = document.getElementById("floatBoxId");
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

function floatboxV3B3DMTurnON(title, content, position) {
	$("#floatBoxId").fadeIn(150)
	$(".floatBoxHeader .header").html(title)
	$(".floatBoxBody").html(content);
	//for b3dm if possible can pass the long, lat and alt then camera fixed is correct to that asset.
	console.log(position)
	var alt = position.alt;
	var lon = position.lon;
	var lat = position.lat;
	
	cameraClickPosition = {
		lon: lon,
		lat: lat,
		alt: alt
	};
}
