function addPinEntity(ID, name, lon, lat, desc, color) {
	// var pinBuilder = new Cesium.PinBuilder();
	// var myColor;
	var myurl
	var ui_pref = localStorage.ui_pref;
	var path_prefix = "";

	if (ui_pref == 'ri_v3') {
		path_prefix = "../";
	}
	switch (color) {
		case "10%": myurl = path_prefix + 'Images/pins/red-pin.png';
			break;
		case "25%": myurl = path_prefix + 'Images/pins/orange-pin.png';
			break;
		case "50%": myurl = path_prefix + 'Images/pins/yellow-pin.png';
			break;
		case "75%": myurl = path_prefix + 'Images/pins/blue-pin.png';
			break;
		case "100%": myurl = path_prefix + 'Images/pins/green-pin.png';
			break;
		default: myurl = path_prefix + 'Images/pins/red-pin.png';
	};
	entitiesArray.push(viewer.entities.add({
		id: ID,
		name: name,
		position: Cesium.Cartesian3.fromDegrees(lon, lat),
		billboard: {
			image: myurl,
			height: 65,
			width: 30,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM
		},
		description: desc,
		label: {
			text: name,
			font: '13pt calibri',
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			verticalOrigin: Cesium.VerticalOrigin.CENTER,
			horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
			pixelOffset: new Cesium.Cartesian2(15, -55)
		}
	}));


}

function drawPolyLine(pos) {
	drawEntities.push(viewer.entities.add({
		polyline: {
			positions: pos,
			width: 2.0,
			material: Cesium.Color.RED.withAlpha(0.7),
			clampToGround: true
		}
	}));
}

function distancePolyLine(pos) {
	distEntities.push(viewer.entities.add({
		polyline: {
			positions: pos,
			width: 2,
			material: Cesium.Color.RED.withAlpha(0.5),
			clampToGround: true
		}
	}));
}


function addBillboard(lon, lat, hei) {
	var ui_pref = localStorage.ui_pref;
	var path_prefix = "";

	if (ui_pref == 'ri_v3') {
		path_prefix = "../";
	}

	var distEntities = viewer.entities.add({
		name: 'Mark',
		position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
		billboard: {
			image: path_prefix + 'Images/tack.png',
			width: 20,
			height: 20,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
			verticalOrigin: Cesium.VerticalOrigin.CENTER
		}
	});
	
	return (distEntities);

}

function addmeasureBillboard(lon, lat, hei) {
	distEntities.push(viewer.entities.add({
		name: "Measure",
		position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
		point: {
			color: Cesium.Color.BLUE,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 3,
			pixelSize: 7,
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			disableDepthTestDistance: Number.POSITIVE_INFINITY
		}
	}));
}

//fly to an entity within KML datasource
//flyToEntity('New Road Centerline 1.Style_v001.kml', 'coordinates value')
async function flyToEntity(tilesetURLFromJoget, coord) {
	//get tileset from tilesetlist
	var tileset = null;
	for (i = 0; i < tilesetlist.length; i++) {
		if (tilesetlist[i].url.includes(tilesetURLFromJoget)) {
			tileset = tilesetlist[i].tileset;
			break;
		}
	}

	if (!tileset) {
		console.error("Tileset not found")
	}

	let coordArray = coord.split(",");
	var drawnEntity;

	var path_prefix = "";
	var ui_pref = localStorage.ui_pref;
	if (ui_pref == 'ri_v3') {
		path_prefix = "../";
	}

	if (coordArray.length == 2) {
		//point
		drawnEntity = viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees(coordArray[0], coordArray[1], 0),
			billboard: {
				image: path_prefix + "Images/redPlaceholder.png",
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				width: 30,
				height: 30,
			},
		});
	}
	viewer.flyTo(drawnEntity);

	jogetConOpDraw.entity = drawnEntity;
}