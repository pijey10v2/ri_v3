'use strict'
Cesium.BingMapsApi.defaultKey = 'Ap0nMgqVt8bPjZvIrd_3wrG9bhMs3ZZMRvCvDSj5lDBTQzm7nD_MxHzZwLhCw7bI'; // For use with this application only
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YTU2OTcxMC0wNzdmLTQyZDItOWVkNy0xZjU4NTgzYTVjNTUiLCJpZCI6NzI3Miwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0ODg2ODEwM30.Lc-IQBDSPyhqgPR2v-Ejcb34ksKJLr23mXsOhszBcHI';


//my global variables
var baseMap = 0;
var camTiltLock = 0; //Enable
var viewer
var keycontrol_trigger = false;
var flagName
var flags
var viewModelTileset;
var viewModel = {
	brightness: 0,
	maximumScreenSpaceError: 16.0
};
var imageryLayers;
var flagDraw = false; // flag true if Draw button is chosen
var flagEntity = false; // flag true if Entity button is chosen
var flagEdit = false; // flag true if editing location details
var flagCamera = false; // flag true if camera button is chosen
var flagAddImage = false; // flag true if add image button is chosen
var isEntityPicked = false; // true if enitiy is picked in the table
var isModelPicked = false; // flag true if asset model is picked
var flagAnnotateData = false;
var dashboardWindow = null;
var flagSearch = false;
var $jogetHost = JOGETHOST;
var $jogetAssetHost = JOGETASSETHOST;
var assetDataAPI = [];
//flags for Mark up tools
var flagMarkupTools = false; //will replace this with class active when button is created

//flags and arrays for measure tools
var flagMeasure = false;
var MeasureTool;
var distEntities = []; // array of distance entities -Cesium bill boards to be removed if deleted
var labelEntity = [];
var positionCounter = 0;
var point1 = new Cesium.Cartesian3();
var StartPoint = new Cesium.Cartesian3();
var EndPoint = new Cesium.Cartesian3();
var distance = 0;
var areaPositions = [];
var flagPosEntities = false;
var flagArea = false;
var distanceEntity = 0; // keeps track of number of distance entities
var positions; // used to draw a line between distance entities

var pwAssetData = [];
var myModels = []; // array of models/assets for the current project
var locations = []; // array of locations for the current project
var filedata = []; // array of projectwise files associated with the locations
var vid

var entitiesArray = []; // array of Cesium billboard entities-- needed for delete purpose
var modelsArray = [];
var tempModelData = []; //array to hold values for temp Model before saving to database;
var videoPinsArray = []; //array to hold all the video pins
var videoPinData = []; //array to hold all the data for video pins
var videoPinIndex; // index of the chosen video Pin
var videoPinEdit = false;
var folderTree = false;
var folderTreeSP = false;
var getPWFileData = false;
var getPWFolderData = false;
var pwloginCredentials = false;
var fileUrl, fileName;

var earthPinData = [];
var earthPinsArray = [];
var earthPinEdit = false;
var earthPinIndex;
var tempImagePin;
var imgInitialSource;
var fileURL;

var modelIndex; // stores the index number of the model/asset picked to access the asset
var entityIndex; // stores the index number of the the enitity picked to access the enitiy from array
var tempModel; // a variable to hold the temp geometry instance for draw tool;

var PWDocURL = "";
var PWLogURL = "";
var PowerBIURL = "";
var isGetFileUrl = false;
var folders = [];
var locationList = [];
var infoLocationList = [];
var currentLat;
var currentLng;
var selectedNodeId;
var selectedInfoEntity;
var arrangedView = false;
var entFlag = false
var modFlag = false;
var assetTableCellPicked; // to select the model asset from table
var assetTableCellOldColor; //old colour of the model asset from table

var tempVideoPin;
var tilesetlist = [];
var token;
var dashboardLoaded = false
var p_layers;
var clickHandler

var currentObjectId;
var currentPrimitive;
var currentColor;
var currentShow;
var attributes;
var selectedPrimitiveId;
var selectedPrimitive;
var selectedPrimitveColor;
var selectedPrimitiveShow;
//var g
var highlighted
var selected
var nameOverlay
var project_start;
var project_end;

var west
var east
var south
var north
var numClicks = 0;

var movePosition
var cameraClickPosition;

var silhouetteBlue
var bentleyCredentialsflag = false; // to check if we have the credentials for the signed in user
var checkCompleteDraw = false;
var highlightPoint
var highlightLabel
var changePointColour = false;

var flagLandBoth = false;
var flagLinkLand = false;
var pickedLot
var shpPickedLot
var polyLotAlpha
var polyLotBlue
var polyLotGreen
var polyLotRed
var shpLotId = "";
var lot = "";
var chainage = "";
var struct = "";
var fileLandName = "";
var shpURL = "";
var msgLand = "";
var flagLoadedEarth = false;
var landThematic = [];
var highlightLotParcel = "";

var arrAerialEdit = [];
var flagPolyProcess = false;

$(document).ready(function () {

	//if variable exist in url the open form 
	//to open the activity form from email link
	var url_string = window.location.href
	var url = new URL(url_string);

	var constructProcessID = url.searchParams.get("processid");
	var constructActID = url.searchParams.get("actid");
	var constructAppName = url.searchParams.get("processappname");

	//to open form for next activity
	if (constructProcessID && constructActID && constructAppName) {
		if(localStorage.Project_type == "ASSET"){
			openFormAssetNoti(constructProcessID, constructActID, constructAppName)
		}
		else{
			getCoordinate(constructProcessID, constructActID, constructAppName);
		}
	}

	//to open last form either complete/reject/closed
	var iniateConopBrowser = url.searchParams.get("initConop");
	var eleConopBrowser = url.searchParams.get("data");

	if (iniateConopBrowser && eleConopBrowser) {
		openCloseForm(iniateConopBrowser, eleConopBrowser);
	}

	var inactivityTime = function () {
		var time;
		window.onload = resetTimer;
		// DOM Events
		document.onmousemove = resetTimer;
		document.onkeypress = resetTimer;

		function logout() {
			$.confirm({
				boxWidth: "30%",
				useBootstrap: false,
				title: "Session Timeout!",
				content: "You'll be logged out in 15 seconds. ",
				autoClose: 'Logout|15000',
				buttons: {
					Continue: function () {
						resetTimer()
						return;
					},
					Logout: function () {
						$("#signOut").trigger("click")
						return;
					},
				},
			});
		}

		function resetTimer() {
			clearTimeout(time);
			time = setTimeout(logout, 600000) //change this to 10mins
			// 1000 milliseconds = 1 second
		}
	};
	inactivityTime();
	viewer = new Cesium.Viewer('RIContainer', {
		baseLayerPicker: false,
		timeline: false,
		contextOptions: {
			webgl: { preserveDrawingBuffer: true }
		},
		animation: false,
		geocoder: true,
		homeButton: false,
		sceneModePicker: false,
		imageryProvider: new Cesium.BingMapsImageryProvider({
			url: 'https://dev.virtualearth.net',
			mapStyle: Cesium.BingMapsStyle.AERIAL
		}),
		navigationHelpButton: false,
		infoBox: false,
		fullscreenButton: false,
		mapProjection: new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84),
		selectionIndicator: false


	});
	viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

	silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
	silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
	silhouetteBlue.uniforms.length = 0.01;
	silhouetteBlue.selected = [];
	viewer.scene.postProcessStages.add(
		Cesium.PostProcessStageLibrary.createSilhouetteStage([
			silhouetteBlue
		])
	);

	var projectlist = JSON.parse(localStorage.projectlist)

	projectlist.sort((a, b) => (a.project_name.toUpperCase() > b.project_name.toUpperCase()) ? 1 : -1)
	var projectlistChild = [];
	var projectlistOther = [];

	for (i = 0; i < projectlist.length; i++) {
		if (localStorage.p_id == projectlist[i].project_id) {
			continue; //skip this round
		}
		if (projectlist[i].project_par_id == localStorage.p_id || (localStorage.isParent && (localStorage.isParent == projectlist[i].project_id || localStorage.isParent == projectlist[i].project_par_id))) {
			projectlistChild.push(projectlist[i]);
		} else {
			projectlistOther.push(projectlist[i]);
		}
	}
	$("#projectslist").append(
		"<button class='activeProject'>\
		<span class='img'><img src='" + projectIcon(localStorage.iconurl) + "'></span><span class='atag'><a>" + localStorage.p_name + "</a></span>\
		</button>"
	)
	for (i = 0; i < projectlistChild.length; i++) {
		$("#projectslist").append(
			"<form action='login/postlogin_processing' method='POST'>\
			<button id='proID" + projectlistChild[i].project_id + "' value='" + projectlistChild[i].project_id + "' name ='projectid' action='submit'>\
			<span class='img'><img src='" + projectIcon(projectlistChild[i].icon_url) + "'></span><span class='atag'><a>" + projectlistChild[i].project_name + "</a></span></button>\
			</form>"
		)
	}
	for (i = 0; i < projectlistOther.length; i++) {
		$("#projectslistOther").append(
			"<form action='login/postlogin_processing' method='POST'>\
			<button id='proID" + projectlistOther[i].project_id + "' value='" + projectlistOther[i].project_id + "' name ='projectid' action='submit'>\
			<span class='img'><img src='" + projectIcon(projectlistOther[i].icon_url) + "'></span><span class='atag'><a>" + projectlistOther[i].project_name + "</a></span></button>\
			</form>"
		)
	}

	/////       Hazirah comment this for the (SORTING BASED ON RELEVANT PROJECT GROUP "APPSBAR")     /////

	// $("#projectslist").append(
	// 	"<button class='activeProject'>\
	// 	<span class='img'><img src='" + localStorage.iconurl + "'></span><span class='atag'><a>" + localStorage.p_name + "</a></span>\
	// 	</button>"
	// )
	// for (i = 0; i < projectlist.length; i++) {
	// 	if (localStorage.p_id == projectlist[i].project_id) {
	// 		continue; //skip this round
	// 	}
	// 	$("#projectslist").append(
	// 		"<form action='login/postlogin_processing' method='POST'>\
	// 		<button id='proID" + projectlist[i].project_id + "' value='" + projectlist[i].project_id + "' name ='projectid' action='submit'>\
	// 		<span class='img'><img src='" + projectlist[i].icon_url + "'></span><span class='atag'><a>" + projectlist[i].project_name + "</a></span></button>\
	// 		</form>"
	// 	)
	// }

	//project name for index.php
	document.getElementById('navprojectName').innerHTML = localStorage.p_name;
	if (localStorage.iconurl !== null && localStorage.iconurl.length !== 0) {
		document.getElementById('logo_img').src = projectIcon(localStorage.iconurl);
	}
	if (localStorage.latitude1 !== localStorage.latitude2) {
		west = Math.min(localStorage.longitude1, localStorage.longitude2)
		east = Math.max(localStorage.longitude1, localStorage.longitude2)
		south = Math.min(localStorage.latitude1, localStorage.latitude2)
		north = Math.max(localStorage.latitude1, localStorage.latitude2)
	} else {
		west = 93.0;
		south = -15.0;
		east = 133.0;
		north = 30.0;
	}
	Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(west, south, east, north);

	//temp for demo purpose
	if (localStorage.p_name == "Gandaria Mall") {
		viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
		viewer.camera.setView({
			destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
			orientation: {
				roll: (100 * (Math.PI / 180))
			}
		})
		//viewer.scene.screenSpaceCameraController.enableTilt = false;

		getPWChartData() //gets chart data
		getPWTableData(); // gets table data
		//plotChart();

		//FacilitiesSummary()
		jqwidgetBox("facilitiessummary", 1);

	} else {
		viewer.camera.setView({
			destination: Cesium.Rectangle.fromDegrees(west, south, east, north)
		})
		//FacilitiesSummary()
		jqwidgetBox("facilitiessummary", false);
	}

	viewer.scene.globe.maximumScreenSpaceError = 3 // higher value = lower graphics quality but higher performance; default = 2
	$.ajax({
		type: "POST",
		url: 'BackEnd/getConfigDetailsPWPBi.php',
		data: {
			functionName: "getConfigDetails"
		},
		dataType: 'json',
		success: function (obj, textstatus) {
			var mydata = obj['data'];
			if (!mydata) {
				return
			}
			for (var i = 0; i < mydata.length; i++) {
				if (mydata[i].type == "PW") {
					PWDocURL = mydata[i].url + "PW_WSG/Document/";
					PWLogURL = mydata[i].url + "PW_WSG/LogicalSet/";
					console.log(PWDocURL);
					console.log(PWLogURL);
				}
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	})

	LoadLocationData(function (response) {
		// all the saved data is loaded at the start of the application
		var data = JSON.parse(response);
		locations = data.locations;
		// filedata = data.filedata;
		locationList.push({
			id: "regions",
			parent: "#",
			text: "Regions"
		});
		infoLocationList.push({
			id: "regions",
			parent: "#",
			text: "Regions"
		});
		for (var i = 0; i < locations.length; i++) {
			var ID = locations[i].locationID;
			var myname = locations[i].locationName;
			var lon = locations[i].longitude;
			var lat = locations[i].latitude;
			var status = locations[i].status;
			var isRegion = false;
			var isSubregion = false;
			for (var j = 0; j < locationList.length; j++) {
				if (locationList[j].id == locations[i].region) {
					isRegion = true;
				};
			};
			if (!isRegion) {
				locationList.push({
					id: locations[i].region,
					parent: "regions",
					text: locations[i].region
				});
				infoLocationList.push({
					id: locations[i].region,
					parent: "regions",
					text: locations[i].region
				});
			};

			locationList.push({
				id: myname,
				parent: locations[i].region,
				text: myname
			});
			infoLocationList.push({
				id: myname,
				parent: locations[i].region,
				text: myname
			});

			var desc = '<div class="projectDesc">';
			desc += '<table ><tbody >';
			desc += '<tr><td>' + "Longitude : " + lon + '</td></tr>';
			desc += '<tr><td>' + "Latitude : " + lat + '</td></tr>';
			desc += '</tbody></table></div>';
			addPinEntity(ID, myname, lon, lat, desc, status);

		};
		$('#rootNode').jstree({
			'core': {
				'data': locationList,
				'check_callback': true
			},
			'plugins': ["sort"]
		});

		$('#infoRootNode').jstree({
			'core': {
				'data': infoLocationList,
				'check_callback': true
			},
			'plugins': ["sort"]
		});

	});

	LoadTilesets(function (p_layers) {
		// all the saved data is loaded at the start of the application
		var modelOptions = document.getElementById('modelLayerName');
		var layerDiv
		var groupList = document.getElementById('layergrouplist');
		for (var j = 0; j < p_layers.length; j++) {
			if (p_layers[j].layerGroup || p_layers[j].layerGroup == 0) {
				if (!document.getElementById('layerGroup_' + p_layers[j].layerGroup)) {
					var groupUl = document.createElement('ul');
					groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
					var groupLi = document.createElement('li');
					groupLi.setAttribute('class', 'layergroup')
					groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
					groupLi.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
					var groupCheck = document.createElement('input')
					groupCheck.setAttribute('type', 'checkbox')
					groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
					groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
					groupCheck.setAttribute('data', p_layers[j].layerGroup)
					if (p_layers[j].groupView == "1") {
						groupCheck.setAttribute('checked', true)
					}
					var groupLabel = document.createElement('label'); // CREATE LABEL.
					groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));
					var groupDiv = document.createElement('div'); // CREATE LABEL.
					groupDiv.setAttribute('class', 'clickContainer');
					groupDiv.setAttribute('onclick', 'togglelist(this)');
					groupDiv.appendChild(groupLabel);
					groupLi.appendChild(groupCheck);
					groupLi.appendChild(groupDiv);
					groupList.appendChild(groupLi)
					groupList.appendChild(groupUl);
				}
				layerDiv = groupUl
				flagSearch = true;
			}
			else {
				layerDiv = document.getElementById('layergrouplist');
			}

			var ul_li = document.createElement('li'); //CREATE li
			ul_li.setAttribute('id', "dataID_" + p_layers[j].Data_ID)
			if (!flagSearch) {
				ul_li.setAttribute('class', 'layerSearch');
			}
			var chk = document.createElement('input'); // CREATE CHECK BOX.
			chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
			chk.setAttribute('id', "dataChk_" + p_layers[j].Data_ID); // SET UNIQUE ID.
			chk.setAttribute('onclick', 'layerOnCheck(this)')
			if (p_layers[j].Default_View == true || p_layers[j].groupView == true) {
				chk.setAttribute('checked', true);
			}
			var lyr_icon = document.createElement('img');
			lyr_icon.setAttribute('class', 'fileicon');

			switch (p_layers[j].Data_Type) {
				case 'KML':
					lyr_icon.setAttribute('src', 'Images/icons/layer_window/kml.png');
					lyr_icon.setAttribute('title', 'KML/KMZ');
					break;
				case 'SHP':
					lyr_icon.setAttribute('src', 'Images/icons/layer_window/shp.png');
					lyr_icon.setAttribute('title', 'SHP');
					break;
				case 'B3DM': //b3dm
					lyr_icon.setAttribute('src', 'Images/icons/layer_window/b3dm.png');
					lyr_icon.setAttribute('title', 'B3DM');
					break;
				case 'ION': //ion
					lyr_icon.setAttribute('src', 'Images/icons/layer_window/ion.png');
					lyr_icon.setAttribute('title', 'ION');
					break

			}

			chk.setAttribute('name', 'checkbox');

			var lbl = document.createElement('label'); // CREATE LABEL.
			lbl.setAttribute('for', p_layers[j].Layer_Name);
			//lbl.style.fontSize = 'small';

			// CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
			lbl.appendChild(document.createTextNode(p_layers[j].Layer_Name));
			//CREATE
			// APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
			ul_li.appendChild(chk);
			ul_li.appendChild(lyr_icon);
			ul_li.appendChild(lbl);
			// if (p_layers[j].Data_Type == "B3DM") {
			// 	ul_li.innerHTML += "<img src='Images/icons/third_button/dark_red/theme.png' onclick = 'bimClassify(this)' title='BIM Classification' class='flyto'>"
			// }
			if (p_layers[j].meta_id) {
				ul_li.style.textAlign = 'right';
				ul_li.innerHTML += `<img src="Images/icons/layer_window/info.png" style="cursor:pointer;float:none;" onclick = "showMetadataInfo('`+p_layers[j].meta_id+`', '`+p_layers[j].Layer_Name+`')" class="">`;
			}
			ul_li.innerHTML += "<img src='Images/icons/layer_window/binoculars.png' onclick = 'flyToLayer(this)' class='flyto'>"
			layerDiv.prepend(ul_li)

			if (p_layers[j].Data_Type == "KML") {
				var mykml = null

				if (p_layers[j].groupView) {
					if (p_layers[j].groupView == true || p_layers[j].Default_View == true) {
						mykml = LoadKMLData(p_layers[j].Data_URL)
					}
				}
				else if (p_layers[j].Default_View == true) {
					mykml = LoadKMLData(p_layers[j].Data_URL)
					landThematic.push({
						id: p_layers[j].Data_ID,
						name: p_layers[j].Layer_Name,
					});
				}

				tilesetlist.push({
					id: p_layers[j].Data_ID,
					name: p_layers[j].Layer_Name,
					layerID: p_layers[j].Layer_ID,
					tileset: mykml,
					type: "kml",
					offset: p_layers[j].Offset,
					defaultView: p_layers[j].groupView || p_layers[j].Default_View,
					url: p_layers[j].Data_URL,
					groupID: p_layers[j].layerGroup
				});

			} else if (p_layers[j].Data_Type == "SHP") {
				var wms = null;
				if (p_layers[j].Default_View == true) {
					wms = LoadWMSTile(p_layers[j].project_id, p_layers[j].Data_URL, p_layers[j].Style)
				}

				tilesetlist.push({
					id: p_layers[j].Data_ID,
					name: p_layers[j].Layer_Name,
					layerID: p_layers[j].Layer_ID,
					tileset: wms,
					style: p_layers[j].Style,
					type: "shp",
					offset: p_layers[j].Offset,
					defaultView: p_layers[j].groupView || p_layers[j].Default_View,
					url: p_layers[j].Data_URL,
					groupID: p_layers[j].layerGroup,
					ownerLayerID: p_layers[j].project_id
				});
			} else {
				var myurl = p_layers[j].Data_URL;
				var mytileset;
				var height = p_layers[j].Offset;
				var view = p_layers[j].groupView || p_layers[j].Default_View;

				if (p_layers[j].Data_Type == "ION") {
					mytileset = LoadIONTileset(myurl, height, view);
					tilesetToViewModel(mytileset)
				} else {
					var longlat = 0;
					if (p_layers[j].Layer_Name == "OCC Building") {
						longlat = 1;
					} else if (p_layers[j].Layer_Name == "DOTr_BIM_IFC_Mesh") {
						longlat = 2;
					}
					mytileset = LoadB3DMTileset(myurl, height, view, longlat);
				};
				tilesetlist.push({
					id: p_layers[j].Data_ID,
					name: p_layers[j].Layer_Name,
					layerID: p_layers[j].Layer_ID,
					tileset: mytileset,
					type: "tileset",
					offset: p_layers[j].Offset,
					defaultView: p_layers[j].groupView || p_layers[j].Default_View,
					url: p_layers[j].Data_URL,
					groupID: p_layers[j].layerGroup
				});
			};
			//add the layers names as options to model form needed when saving models
			var option = document.createElement("option");
			option.text = p_layers[j].Layer_Name;
			option.value = p_layers[j].Layer_ID;
			modelOptions.add(option);
		};
	});

	getWMSCap()
	getECWList()
	
	LoadAnnotateData(function (myResponse) {
		// all the saved Annotate data for the current project is loaded at the start of the application
		var actual_JSON = JSON.parse(myResponse);
		myModels = actual_JSON.data;
		var pwflag = false;
		var tbody = document.getElementById('assetData');
		for (var i = 0; i < myModels.length; i++) {
			
			var center = new Cesium.Cartesian3(myModels[i].X, myModels[i].Y, myModels[i].Z);
			var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
			var hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(myModels[i].Head, myModels[i].Pitch, myModels[i].Roll));
			var hpr = Cesium.Matrix4.fromRotationTranslation(hprRotation, new Cesium.Cartesian3(0.0, 0.0, -2.0));
			Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
			if (myModels[i].Shape) {
				var building1 = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
					geometryInstances: new Cesium.GeometryInstance({
						geometry: new Cesium.EllipsoidGeometry({
							radii: new Cesium.Cartesian3(myModels[i].Width, myModels[i].Length, myModels[i].Height)
						}),
						modelMatrix: modelMatrix,
						attributes: {
							color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
							show: new Cesium.ShowGeometryInstanceAttribute(true)
						},
						id: myModels[i].EntityID

					}),
					classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
				}));

			} else {
				var building1 = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
					geometryInstances: new Cesium.GeometryInstance({
						geometry: Cesium.BoxGeometry.fromDimensions({
							vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
							dimensions: new Cesium.Cartesian3(myModels[i].Width, myModels[i].Length, myModels[i].Height)
						}),
						modelMatrix: modelMatrix,
						attributes: {
							color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
							show: new Cesium.ShowGeometryInstanceAttribute(true)
						},
						id: myModels[i].EntityID
					}),
					classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
				}));
			}
			modelsArray.push(building1);

			var row = tbody.insertRow();
			var cell = row.insertCell();
			var cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.class = 'annotateModel';
			cb.setAttribute('id', myModels[i].EntityID);
			cb.setAttribute('checked', true);
			cb.setAttribute('onchange', "OnChangeAnnotateModel(this)")
			cell.appendChild(cb);
			row.insertCell(1).innerHTML = myModels[i].AssetID;
			row.insertCell(2).innerHTML = myModels[i].AssetName;
			var cell = row.insertCell(3);
			cell.innerHTML = myModels[i].BuildingType;
			cell.className = 'hideColumn';
			var cell1 = row.insertCell(4);
			cell1.innerHTML = myModels[i].BuildingOwner;
			cell1.className = 'hideColumn';

			row.insertCell(5).innerHTML = myModels[i].AssetSLA;
		}

		if (localStorage.p_name == "Gandaria Mall") {
			addPWAssetDataToTable();
		}

	});

	function addPWAssetDataToTable() {
		var cols = document.getElementsByClassName("hideHeader");
		for (var i = 0; i < cols.length; i++) {
			cols[i].style.display = "none";
		};

		var cols = document.getElementsByClassName("hideColumn");
		for (var i = 0; i < cols.length; i++) {
			cols[i].style.display = "none";
		};
		var assetid = "";
		for (var i = 0; i < myModels.length; i++) {
			assetid += "'" + myModels[i].AssetID + "',";
		};
		var m = assetid.length;
		assetid = assetid.substr(0, m - 1);

		$.ajax({
			type: "POST",
			url: 'BackEnd/getPWAssetData.php',
			dataType: 'json',
			data: {
				assetID: assetid
			},
			success: function (obj, textstatus) {

				pwAssetData = obj;
				if (pwAssetData) {
					var row = document.getElementById('assetTableHeader');
					var headerCell = document.createElement("TH");
					headerCell.innerHTML = "Floor"
					row.appendChild(headerCell);
					headerCell = document.createElement("TH");
					headerCell.innerHTML = "Inventory ID"
					row.appendChild(headerCell);
					headerCell = document.createElement("TH");
					headerCell.innerHTML = "Asset Category"
					row.appendChild(headerCell);
					headerCell = document.createElement("TH");
					headerCell.innerHTML = "Asset Status"
					row.appendChild(headerCell);
					headerCell = document.createElement("TH");
					headerCell.innerHTML = "Brand"
					row.appendChild(headerCell);
					headerCell = document.createElement("TH");
					headerCell.innerHTML = "Description"
					row.appendChild(headerCell);
					headerCell = document.createElement("TH");
					headerCell.innerHTML = "Type"
					row.appendChild(headerCell);
					var tbody = document.getElementById('assetData');
					for (var i = 0; i < tbody.rows.length; i++) {
						var row = tbody.rows[i];
						var id = row.cells[1].innerHTML;

						var j = 0;
						while (j < pwAssetData.length) {
							if (pwAssetData[j].AssetID == id) {
								row.insertCell().innerHTML = pwAssetData[j].Floor;
								row.insertCell().innerHTML = pwAssetData[j].InventoryID;
								row.insertCell().innerHTML = pwAssetData[j].AssetCategory;
								row.insertCell().innerHTML = pwAssetData[j].AssetStatus;
								row.insertCell().innerHTML = pwAssetData[j].Brand;
								row.insertCell().innerHTML = pwAssetData[j].Description;
								row.insertCell().innerHTML = pwAssetData[j].Type;

								break;
							}
							j++;
						}
					}
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr);
				/* $.alert({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Message',
					content: 'Error in fetching the Projectwise folders!. Please click the browse again to fetch.'
				});*/
			}
		});
	}
	updateProjectFinanceDetails(); // updates the contract details in the finance info tab of project information on the nav bar // function is defined in navabaranimation.js
	//initial settings for Mark up tools
	$('#color-picker').spectrum({
		type: "color",
	});

	$("#jqxwindow-text").jqxWindow({
		height: 200,
		width: 250,
		autoOpen: false
	});

	$(".jqx-window-close-button").click(function () {
		$("body").css("cursor", "default");
		resetJogetConOpDraw();
		var videoContainer = document.getElementById("videoContainer");
		var myVideo = $(videoContainer).find("video")[0]
		if (myVideo !== undefined) {
			myVideo.pause()
		} else if ($(videoContainer).has("iframe")) {
			$(videoContainer).html("")
		}
		if ($("#aicpage .buttoncontainer button").hasClass("active")) {
			resetAicViewer();
		}
		if (planePrimitive){
			viewer.scene.primitives.remove(planePrimitive);
		}

		if(flagEditAerial){
			var i = 0;
            while (i < tilesetlist.length) {
                if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
                    tilesetlist[i].tileset.then((value) => {
                        viewer.imageryLayers.remove(value)
                    })
                } else {
                    viewer.imageryLayers.remove(tilesetlist[i].tileset)
                }
                tilesetlist[i].tileset = null;
                i++;
            }
			getECWList();
		}

		if(tempImagePin){
        	viewer.entities.removeById(tempImagePin.id);
    		$("#addimage.active").removeClass('active')
		}

	});

	// Add drag option to markup tools panel
	$("#toolbox-tools").draggable({
		handle: ".panel-heading",
		stop: function (evt, el) {
		}
	})

	highlighted = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};
	// Information about the currently selected feature
	selected = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	nameOverlay = document.createElement('div'); viewer.container.appendChild(nameOverlay); nameOverlay.className = 'backdrop'; nameOverlay.style.display = 'none'; nameOverlay.style.position = 'absolute'; nameOverlay.style.bottom = '0'; nameOverlay.style.left = '0'; nameOverlay.style['pointer-events'] = 'none'; nameOverlay.style.padding = '4px'; nameOverlay.style.backgroundColor = 'black';

	for (var i = 0; i < 3; i++) {
		labelEntity.push(viewer.entities.add({
			label: {
				show: false,
				showBackground: true,
				backgroundColor: Cesium.Color.BLACK,
				font: '14px Helvetica',
				fillColor: Cesium.Color.WHITE,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
				verticalOrigin: Cesium.VerticalOrigin.TOP,
				pixelOffset: new Cesium.Cartesian2(15, 0)
			}
		}));
	};
	var scene = viewer.scene; clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

	viewer.screenSpaceEventHandler.setInputAction(function (movement) {
		var pickedObject = scene.pick(movement.endPosition);

		if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
			if (pickedObject.id === currentObjectId) {
				return;
			}

			if (Cesium.defined(currentObjectId)) {
				attributes = currentPrimitive.getGeometryInstanceAttributes(currentObjectId);
				attributes.color = currentColor;
				attributes.show = currentShow;
				currentObjectId = undefined;
				currentPrimitive = undefined;
				currentColor = undefined;
				currentShow = undefined;
			}
		}

		if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.primitive.getGeometryInstanceAttributes)) {
			var i = 0;
			while (i < myModels.length) {
				if (pickedObject.id == myModels[i].EntityID) {
					currentObjectId = pickedObject.id;
					currentPrimitive = pickedObject.primitive;
					attributes = currentPrimitive.getGeometryInstanceAttributes(currentObjectId);
					currentColor = attributes.color;
					currentShow = attributes.show;
					attributes.color = [255, 255, 0, 128];
					attributes.show = [1];
					break;
				}
				i++;
			}

		} else if (Cesium.defined(currentObjectId)) {
			attributes = currentPrimitive.getGeometryInstanceAttributes(currentObjectId);
			attributes.color = currentColor;
			attributes.show = currentShow;
			currentObjectId = undefined;
			currentPrimitive = undefined;
			currentColor = undefined;
		} else if (flagMarkupTools) {

			if (drawOnlyFlagMarkupTool == "btn_delete") {
				addedBillboardMarkupTool.forEach(eleHover => {
					highlightPoint = eleHover;
					if (!highlightPoint) {
						return;
					}
					if (Cesium.defined(pickedObject) && pickedObject.id._id === highlightPoint.id) {
						highlightPoint.billboard.scale = 1.3;
						highlightPoint.billboard.color = Cesium.Color.YELLOW;
					} else {
						highlightPoint.billboard.scale = 1.0;
						highlightPoint.billboard.color = Cesium.Color.WHITE;
					}
				});

				addedLabelMarkupTool.forEach(elementHover => {
					highlightLabel = elementHover;
					if (!highlightLabel) {
						return;
					}
					if (Cesium.defined(pickedObject) && pickedObject.id._id === highlightLabel.id) {
						highlightLabel.label.scale = 1.3;
						highlightLabel.label.color = Cesium.Color.BLUE;
					} else {
						highlightLabel.label.scale = 1.0;
						highlightLabel.label.color = Cesium.Color.WHITE;
					}
				});

			}
		}

	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
		$("#floatboxBumiRegister").hide();
		silhouetteBlue.selected = [];
		
		floatboxTurnOFF()
		$("#floatboxEditButton").css('display', 'block')
		$("#rightclickMenu").removeClass("active")
		$(".sub-rightclickMenu.active").removeClass("active")

		var colourProcess = "";
		switch (changePointColour) {
			case "colourNCR":
				colourProcess = "Images/dotNCR.png"
				break;
			case "colourWIR":
				colourProcess = "Images/dotWIR.png"
				break;
			case "colourMS":
				colourProcess = "Images/dotMS.png"
				break;
			case "colourRS":
				colourProcess = "Images/dotRS.png"
				break;
			case "colourRFI":
				colourProcess = "Images/dotRFI.png"
				break;
			case "colourIR":
				colourProcess = "Images/dotIR.png"
				break;
			case "colourMOS":
				colourProcess = "Images/dotMOS.png"
				break;
			case "colourSD":
				colourProcess = "Images/dotSD.png"
				break;
			case "colourSDL":
				colourProcess = "Images/dotSDL.png"
				break;
			case "colourDCR":
				colourProcess = "Images/dot.png"
				break;
			case "colourNOI":
				colourProcess = "Images/dot.png"
				break;
			case "colourPBC":
				colourProcess = "Images/dotNCR.png"
				break;
			case "colourDA":
				colourProcess = "Images/dotSDL.png"
				break;
			default:
				colourProcess = "Images/dot.png"
				break;
		}

		if (jogetConOpDraw.flag && jogetConOpDraw.shape !== null) {

			let cartesian = viewer.camera.pickEllipsoid(movement.position);
			let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			let currentLong = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
			let currentLati = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);
			if (jogetConOpDraw.shape == "Point" && jogetConOpDraw.coordsArray.length >= 2) {
				jogetConOpDraw.billboardEntities.forEach(function (entity) {
					viewer.entities.remove(entity)
				})
				jogetConOpDraw.billboardEntities = []
				jogetConOpDraw.coordsArray = [];
				jogetConOpDraw.coordsArray.push(currentLong);
				jogetConOpDraw.coordsArray.push(currentLati);
				jogetConOpDraw.billboardEntities.push(viewer.entities.add({
					name: colourProcess,
					position: Cesium.Cartesian3.fromDegrees(currentLong, currentLati, 0),
					billboard: {
						image: colourProcess,
						horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						width: 15,
						height: 15
					}
				}))
				return
			}

			jogetConOpDraw.coordsRad.push(cartographic.longitude).toFixed(8)
			jogetConOpDraw.coordsRad.push(cartographic.latitude).toFixed(8)

			jogetConOpDraw.coordsArray.push(currentLong);
			jogetConOpDraw.coordsArray.push(currentLati);

			var projectedPosition = new Cesium.Cartesian3();
			var projection = viewer.scene.mapProjection
			projection.project(cartographic, projectedPosition);

			if (jogetConOpDraw.entity !== null) {
				viewer.entities.remove(jogetConOpDraw.entity)
			}

			jogetConOpDraw.billboardEntities.push(viewer.entities.add({
				name: "ncrPoints",
				position: Cesium.Cartesian3.fromDegrees(currentLong, currentLati, 0),
				billboard: {
					image: colourProcess,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					width: 15,
					height: 15
				}
			}))
			jogetConOpDraw.drawEntity()

		} else if (flagDraw) {
			var cartesian = viewer.scene.pickPosition(movement.position);
			if (Cesium.defined(cartesian)) {
				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				if (modFlag) {

					if (Cesium.defined(selectedPrimitiveId)) {
						attributes = selectedPrimitive.getGeometryInstanceAttributes(selectedPrimitiveId);
						attributes.color = selectedPrimitveColor;
						attributes.show = selectedPrimitiveShow;
						selectedPrimitiveId = undefined;
						selectedPrimitive = undefined;
						selectedPrimitveColor = undefined;
						selectedPrimitiveShow = undefined;
					}
				};
				var cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
				var lon = Cesium.Math.toDegrees(cartographicPosition.longitude);
				var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
				var hei = cartographicPosition.height;
				addBillboard(lon, lat, hei);
				var x = cartesian.x;
				var y = cartesian.y;
				var z = cartesian.z;

				//PinPointTool(true)
				jqwidgetBox("pintpointTool", 1);
				instructions('Click  <kbd>Save</kbd>  button to save location.<br>Press  <kbd>Esc</kbd>  to exit.')

				$("#inputx").val(x);
				$("#inputy").val(y);
				$("#inputz").val(z);

				$("#sizewidth").val('2.5');
				$("#sizelength").val('2.8');
				$("#sizeheight").val('2.9');

				$("#orientationhead").val('1.9');
				$("#orientationpitch").val('0.0');
				$("#orientationroll").val('0.0');

				var center = new Cesium.Cartesian3(x, y, z);
				var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
				var hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(1.9, 0.0, 0.0));
				var hpr = Cesium.Matrix4.fromRotationTranslation(hprRotation, new Cesium.Cartesian3(0.0, 0.0, -2.0));
				Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);

				tempModel = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
					geometryInstances: new Cesium.GeometryInstance({
						geometry: Cesium.BoxGeometry.fromDimensions({
							vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
							dimensions: new Cesium.Cartesian3(2.5, 2.8, 2.9)
						}),
						modelMatrix: modelMatrix,
						attributes: {
							color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
							show: new Cesium.ShowGeometryInstanceAttribute(true)
						},
						id: x

					}),
					classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
				}));


			};
			flagDraw = false;
			document.getElementsByTagName("body")[0].style.cursor = "default";

		} else if (flagMeasure) {

			//for 2D positioning
			// var cartesian = viewer.camera.pickEllipsoid(movement.position);
			// //console.log(cartesian);
			// //var cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
			// var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			// var lon = Cesium.Math.toDegrees(cartographicPosition.longitude);
			// var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
			var cartographicPosition, cartesian;
			var pickedFeature = viewer.scene.pick(movement.position);
			if (!Cesium.defined(pickedFeature)) {
				//no feature only cesium map
				cartesian = viewer.camera.pickEllipsoid(movement.position);
				cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			} else {
				// either tileset or kml	
				if (pickedFeature._content) {
					cartesian = viewer.scene.pickPosition(movement.position);
					cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
				} else {
					cartesian = viewer.camera.pickEllipsoid(movement.position);
					cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
				}
			}
			if (Cesium.defined(cartesian)) {
				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				if (modFlag) {

					if (Cesium.defined(selectedPrimitiveId)) {
						attributes = selectedPrimitive.getGeometryInstanceAttributes(selectedPrimitiveId);
						attributes.color = selectedPrimitveColor;
						attributes.show = selectedPrimitiveShow;
						selectedPrimitiveId = undefined;
						selectedPrimitive = undefined;
						selectedPrimitveColor = undefined;
						selectedPrimitiveShow = undefined;
					}
				};

				isEntityPicked = false;
				isModelPicked = false;
				entFlag = false;
				modFlag = false;

				//var cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
				var lon = Cesium.Math.toDegrees(cartographicPosition.longitude).toFixed(6);
				var lat = Cesium.Math.toDegrees(cartographicPosition.latitude).toFixed(6);
				var hei = cartographicPosition.height;

				if (MeasureTool == "Position") {
					positionCounter += 1;
					if (positionCounter > 3) {
						positionCounter = 1
						flagPosEntities = true;
					};
					if (flagPosEntities) {
						viewer.entities.remove(distEntities[0]);
						distEntities.splice(0, 1);
					};

					addmeasureBillboard(lon, lat, hei);

					var terrainProvider = Cesium.createWorldTerrain();
					var positions = [
						Cesium.Cartographic.fromDegrees(lon, lat)
					];

					instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png">  to mark more points.<br>Press  <kbd>Esc</kbd>  to exit.')

					var promise = Cesium.sampleTerrain(terrainProvider, 11, positions);
					Cesium.when(promise, function (updatedPositions) {
						var pickedFeature = viewer.scene.pick(movement.position);
						if (Cesium.defined(pickedFeature)) {
							labelEntity[positionCounter - 1].position = cartesian;
							labelEntity[positionCounter - 1].label.show = true;
							labelEntity[positionCounter - 1].label.text =
								'Lon: ' + lon + '\u00B0' +
								'\nLat: ' + lat + '\u00B0' +
								'\nHeight: ' + hei.toFixed(3) + ' m' +
								'\nTerrain Height :' + positions[0].height.toFixed(3) + 'm';
						} else {
							labelEntity[positionCounter - 1].position = cartesian;
							labelEntity[positionCounter - 1].label.show = true;
							labelEntity[positionCounter - 1].label.disableDepthTestDistance = Number.POSITIVE_INFINITY
							labelEntity[positionCounter - 1].label.text =
								'Lon: ' + lon + '\u00B0' +
								'\nLat: ' + lat + '\u00B0' +
								//'\nHeight: ' +hei + ' m' +
								'\nTerrain Height :' + positions[0].height.toFixed(3) + 'm';
						};

					});
				} else if (MeasureTool == "Distance") {
					distanceEntity += 1;
					addmeasureBillboard(lon, lat, hei);
					if (distanceEntity == 1) {
						point1 = cartesian;
						instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png">  to mark more points.<br>Press  <kbd>Esc</kbd>  to exit.')
					} else {
						var mydistance = Math.sqrt(Math.pow((point1.x - cartesian.x), 2) + Math.pow((point1.y - cartesian.y), 2) + Math.pow((point1.z - cartesian.z), 2));
						distance += mydistance;
						var heiDiff = Math.abs(point1.y - cartesian.y);
						labelEntity[0].position = cartesian;
						labelEntity[0].label.show = true;
						labelEntity[0].label.text =
							'Distance : ' + mydistance.toFixed(3) + 'm' +
							'\nHeight difference : ' + heiDiff.toFixed(3) + 'm' +
							'\nTotal Distance : ' + distance.toFixed(3) + 'm';
						var mypos = [];
						mypos[0] = point1;
						mypos[1] = cartesian;
						distancePolyLine(mypos);
						point1 = cartesian;
					}

				} else if (MeasureTool == "Area") {
					if (flagArea) {
						areaPositions.splice(0, areaPositions.length);
						distanceEntity = 0;
						for (var i = 0; i < 3; i++) {
							labelEntity[i].label.show = false;
						};
						for (var i = 0; i < distEntities.length; i++) {
							viewer.entities.remove(distEntities[i]);
						};
						flagArea = false;
					};
					areaPositions[distanceEntity] = cartesian;
					distanceEntity += 1;
					addmeasureBillboard(lon, lat, hei);

					instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png">  to mark more points.<br>Click  <img src="Images/icons/instructions/light_color/rightclick.png">  to finish.')

					if (distanceEntity == 1) {
						point1 = cartesian;
						StartPoint = cartesian;
					} else {
						var mypos = [];
						mypos[0] = point1;
						mypos[1] = cartesian;
						EndPoint = cartesian;
						distancePolyLine(mypos);
						var mydistance = Math.sqrt(Math.pow((point1.x - cartesian.x), 2) + Math.pow((point1.y - cartesian.y), 2) + Math.pow((point1.z - cartesian.z), 2));
						distance += mydistance;
						point1 = cartesian;
					};
				};

			} else {
				labelEntity[positionCounter - 1].label.show = false;
			};

		} else if (flagMarkupTools) {//mark up tools
			let cartesian = viewer.camera.pickEllipsoid(movement.position);
			let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			let currentLong = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
			let currentLati = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);

			coordsArrayMarkupTool = [];
			coordsArrayMarkupTool.push(currentLong);
			coordsArrayMarkupTool.push(currentLati);

			///////// for markup tools
			if (drawOnlyFlagMarkupTool) {

				if (drawOnlyFlagMarkupTool == 'btn_point') {
					// removeBillboard();
					addBillboardMarkupTool(coordsArrayMarkupTool);
				} else if (drawOnlyFlagMarkupTool == 'btn_line') {
					if (checkCompleteDraw) {
						checkCompleteDraw = false;
					}
					arrayOfCartesianMarkupTool.push(cartographic);
					drawFlagMarkupTool = 'line';
					drawMarkupTool(drawFlagMarkupTool)
				} else if (drawOnlyFlagMarkupTool == 'btn_polygon') {
					if (checkCompleteDraw) {
						checkCompleteDraw = false;
					}
					arrayOfCartesianMarkupTool.push(cartographic);
					drawFlagMarkupTool = 'polygon';
					drawMarkupTool(drawFlagMarkupTool)
				} else if (drawOnlyFlagMarkupTool == 'btn_text') {
					addLabelMarkupTool(coordsArrayMarkupTool);
				} else if (drawOnlyFlagMarkupTool == 'btn_delete') {
					var pickedFeature = viewer.scene.pick(movement.position);
					if (pickedFeature) {
						if (pickedFeature.id._id) {
							var existInDrawPoint = addedBillboardMarkupTool.findIndex((item) => item._id == pickedFeature.id._id);
							var existInDrawText = addedLabelMarkupTool.findIndex((item) => item._id == pickedFeature.id._id);
							if ((existInDrawPoint == '-1') && (existInDrawText == '-1')) {
								$.alert({
									boxWidth: "30%",
									useBootstrap: false,
									title: "Alert",
									content: "Line/ Polygon drawing cannot be erased, only undo is available for drawing.",
								});
							}
							else {
								undoArray.push({ "action": "delete", "details": pickedFeature.id });
								viewer.entities.removeById(pickedFeature.id._id);
								if (existInDrawPoint != -1) {
									addedBillboardMarkupTool.splice(existInDrawPoint, 1);
								}
								if (existInDrawText != -1) {
									addedLabelMarkupTool.splice(existInDrawText, 1);
								}
							}
						}
					}
				}
			}

		} else {
			var pickedFeature = viewer.scene.pick(movement.position);
			if (pickedFeature instanceof Cesium.Cesium3DTileFeature && pickedFeature._content._batchIdAttributeName == 'a_batchId') {
				silhouetteBlue.selected = [pickedFeature];
			
			}

			else if (!Cesium.defined(pickedFeature)) {
				//for querying wms 
				var pickRay = viewer.camera.getPickRay(movement.position);
				var featuresPromise = viewer.imageryLayers.pickImageryLayerFeatures(pickRay, viewer.scene);
				if (!Cesium.defined(featuresPromise)) {
				} else {
					Cesium.when(featuresPromise, function (features) {
						// This function is called asynchronously when the list if picked features is available.
						if (features.length > 0) {
							movePosition = movement.position
							floatboxTurnON(features[0].imageryLayer._imageryProvider._layers, features[0].description);

							//For land process (LA/LE/LI)
							if (flagLandBoth) {
								$("#floatbox-tabs").children().each(function () {
									if (!$(this).is(":contains('Info')")) {
										$(this).hide();
									};
								});

								$("#floatboxEditButton").css('display', 'none')
								$("#floatboxWorkorderButton").css('display', 'none')
								$("#tab1half").css('display', 'none')

								if (shpPickedLot) {
									ChangeWMSTile()
								}
								ChangeWMSTile(shpURL, features[0].data.id)
								shpPickedLot = features[0].data.id;
								let currentLong = features[0].position.longitude.toFixed(8);
								let currentLati = features[0].position.latitude.toFixed(8);
								jogetLotParcel.coordsArray.splice(0, jogetLotParcel.coordsArray.length);
								jogetLotParcel.coordsArray.push(currentLong);
								jogetLotParcel.coordsArray.push(currentLati);

								shpLotId = "";
								lot = "";
								chainage = "";
								struct = "";
								fileLandName = "";
								msgLand = "";

								var kmlFileName = features[0].imageryLayer._imageryProvider._layers.toString().split(":");
								var ShpFileName = kmlFileName[kmlFileName.length - 1];
								if (jogetProcessApp == "LI") {
									shpLotId = features[0].data.id
									lot = features[0].properties.LOT
									chainage = features[0].properties.CHAINAGE_D
									struct = features[0].properties.STRUCTURE_
									if (!lot || !chainage || !struct){
										msgLand = "Please upload correct data with " + ((!lot) ? "LOT" :"") + ((!chainage) ? " CHAINAGE_D" :"")
										+ ((!struct) ? " STRUCTURE_" :"") + " attribute";
									}
									fileLandName = ShpFileName;
								}
								else {
									shpLotId = features[0].data.id
									lot = features[0].properties.LOT
									if (!lot){
										msgLand = "Please upload correct data with " + ((!lot) ? "LOT" :"") + " attribute";
									}
									fileLandName = ShpFileName;
								}
								if(msgLand){
									$.confirm({
										boxWidth: "30%",
										useBootstrap: false,
										title: "Land Function",
										content: msgLand,
										buttons: {
										  Ok: function () {
											resetJogetConOpDraw();
											return;
										  }
										},
									});
								}
								else{
									jogetConOpDraw.flag = true;
								}
							}

						}
					});
				}

				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				if (modFlag) {

					if (Cesium.defined(selectedPrimitiveId)) {
						attributes = selectedPrimitive.getGeometryInstanceAttributes(selectedPrimitiveId);
						attributes.color = selectedPrimitveColor;
						attributes.show = selectedPrimitiveShow;
						selectedPrimitiveId = undefined;
						selectedPrimitive = undefined;
						selectedPrimitveColor = undefined;
						selectedPrimitiveShow = undefined;
					}
				};

				isEntityPicked = false;
				isModelPicked = false;
				entFlag = false;
				modFlag = false;
				flagEdit = false;
				clickHandler(movement);
				return;
			};

			try {
				if (pickedFeature.id._name) {
					if(pickedFeature.id._billboard._image._value != "Images/security-camera.png" && pickedFeature.id._billboard._image._value != "Images/camera_360.png"){
						getRequestBimAttr(pickedFeature.id._name, "road")
					}
				}
			}
			catch(err) { 
				console.log("not centreline")
			}

			let cartesian = viewer.camera.pickEllipsoid(movement.position);
			let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			let currentLong = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
			let currentLati = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);

			if (!pickedFeature.id) {
				//temp attribute retrieving for BIM (demo)
				movePosition = movement.position;
				var ElementId = pickedFeature.getProperty("assembly")
				getRequestBimAttr(ElementId, pickedFeature.tileset.url);

				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				if (modFlag) {

					if (!Cesium.defined(pickedFeature)) {
						clickHandler(movement);
						return;
					}
					if (Cesium.defined(selectedPrimitiveId)) {

						attributes = selectedPrimitive.getGeometryInstanceAttributes(selectedPrimitiveId);
						attributes.color = selectedPrimitveColor;
						attributes.show = selectedPrimitiveShow;
						selectedPrimitiveId = undefined;
						selectedPrimitive = undefined;
						selectedPrimitveColor = undefined;
						selectedPrimitiveShow = undefined;
					}
				};
				isEntityPicked = false;
				isModelPicked = false;
				entFlag = false;
				modFlag = false;
			} else {
				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				var stringName;
				var localFlag = false;
				var j = 0;
				while (j < videoPinData.length) {
					if (pickedFeature.id._name == videoPinData[j].videoPinName) {
						var urlVideo = "../" + videoPinData[j].videoURL;
						var videoContainer = document.getElementById("videoContainer");
						//compare #videoframe active or inactive 
						if (!$('#videoframe').hasClass('active')) {
							if (videoPinData[j].videoType == 0) {
								videoContainer.innerHTML = "\
								<video style='height:100%; width: 100%; object-fit: cover; z-index: -100;' controls>\
									<source id='source'  src=" + encodeURI(urlVideo) + " type ='video/mp4'>\
								</video>"
								$(videoContainer).attr("dataType", "0")
								var myVideo = $(videoContainer).find("video")[0]
								myVideo.load();
								myVideo.play();
							}else {
								$(videoContainer).attr("dataType", "1")
								$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
							}

							$("#videoframe").addClass('active');
							VideoFrame(true)
						} else {
							if ($(videoContainer).attr("dataType") == videoPinData[j].videoType) { //check if video format is same
								if (videoPinData[j].videoType == 0) {
									var videoSource = $(videoContainer).find("source")[0]
									var videoSrcArry = videoSource.src.toString().split("/");
									var videoSrc = videoSrcArry[videoSrcArry.length - 4] + "/" + videoSrcArry[videoSrcArry.length - 3] + "/" + videoSrcArry[videoSrcArry.length - 2] + "/" + videoSrcArry[videoSrcArry.length - 1]
									//if user intend to change video
									//this one no need to change because its read as Data/Project/ProjectIDNumber/FileName.mp4
									if (videoSrc !== videoPinData[j].videoURL) {
										//assign to the new one because it will load the new file
										videoSource.src = urlVideo
										var myVideo = $(videoContainer).find("video")[0]
										myVideo.load();
										myVideo.play();
									} else { //pause video and close frame
										$("#videoframe.active").removeClass('active');
										VideoFrame(false)
										var myVideo = $(videoContainer).find("video")[0]
										if (myVideo !== undefined) {
											myVideo.pause()
										}
									}
								} else {
									$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
									VideoFrame(true)
								}

							} else { //video format not same

								if ($(videoContainer).attr("dataType") == 0) { // if loaded is mp4 && user intend to change video
									$(videoContainer).attr("dataType", "1")
									$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
									VideoFrame(true)
								} else { //if loaded is embedded
									videoContainer.innerHTML = "\
										<video style='height:100%; width: 100%; object-fit: cover; z-index: -100;' controls>\
											<source id='source'  src=" + encodeURI(urlVideo) + " type ='video/mp4'>\
										</video>"
									$(videoContainer).attr("dataType", 0)
									var myVideo = $(videoContainer).find("video")[0]
									myVideo.load();
									myVideo.play();
									VideoFrame(true)
								}
							}
						}
						localFlag = true;
						return;
					};
					j++;

				}
				let z = 0;
				while (z < earthPinData.length) {
					if (pickedFeature.id._name == earthPinData[z].imagePinName) {
						jqwidgetBox("earthmine-jqx", 1);
						earth360(earthPinData[z].imageURL, earthPinData[z].longitude, earthPinData[z].latitude, earthPinData[z].height, earthPinData[z].initHeading);
						return;
					};
					z++;
				}
				if (!localFlag) {
					var i = 0;
					while (i < entitiesArray.length) {
						if (pickedFeature.id.id == entitiesArray[i].id) {
							if (modFlag && Cesium.defined(selectedPrimitiveId)) {
								attributes = selectedPrimitive.getGeometryInstanceAttributes(selectedPrimitiveId);
								attributes.color = selectedPrimitveColor;
								attributes.show = selectedPrimitiveShow;
								selectedPrimitiveId = undefined;
								selectedPrimitive = undefined;
								selectedPrimitveColor = undefined;
								selectedPrimitiveShow = undefined;
							};

							stringName = entitiesArray[i].name;
							isEntityPicked = true;
							entFlag = true;
							entityIndex = i;
							modFlag = false;
							isModelPicked = false;
							localFlag = true;

							$('#rootNode').jstree('select_node', stringName);
							//$('#infoRootNode').jstree('select_node', stringName);
							$('#rootNode').jstree(true).redraw();
							movePosition = movement.position;
							//var desc = "<table><tbody>";
							// for (var k = 0; k < filedata.length; k++) {
							// 	if (filedata[k].locationID == entitiesArray[i].id) {
							// 		if (filedata[k].files) {
							// 			var fileLength = filedata[k].files.length;
							// 			for (var l = 0; l < fileLength; l++) {
							// 				if (filedata[k].files[l].folder == false) {
							// 					var url = '';
							// 					let f = filedata[k].files[l];
							// 					if (f.fileMethod && f.fileMethod == 'sp') {
							// 						url = encodeURIComponent(f.url);
							// 						desc += '<tr><td><div data-url=' + url + ' data-method= ' + f.fileMethod + ' onClick="viewFile(this)"> ' + filedata[k].files[l].text + '</div></td></tr>';
							// 					} else {
							// 						url = PWDocURL + filedata[k].files[l].id + "/$file";
							// 						desc += '<tr><td><div id=' + url + ' onClick="viewFile(this)"> ' + filedata[k].files[l].text + '</div></td></tr>';
							// 					}
							// 				};
							// 			};
							// 		}
							// 		break;
							// 	};
							// };
							//desc += "</tbody></table>";
							//$('#page2').html(desc); //displaying the documents in tab 2
							$("#floatbox-tabs").children().each(function () {
								if($("#function9-34-jqx").parent().parent().parent().is(':visible')){
									//console.log("directory folder on display");
									if ($(this).is(":contains('Documents')")) {
										$(this).show();
									};
								}
							});
							floatboxTurnON(stringName, pickedFeature.id._description._value);
							return;
						};
						i++;
					};
				};
				if (!localFlag) {
					if (Cesium.defined(selectedPrimitiveId)) {
						attributes = selectedPrimitive.getGeometryInstanceAttributes(selectedPrimitiveId);
						attributes.color = selectedPrimitveColor;
						attributes.show = selectedPrimitiveShow;
						selectedPrimitiveId = undefined;
						selectedPrimitive = undefined;
						selectedPrimitveColor = undefined;
						selectedPrimitiveShow = undefined;
					}
					var i = 0;
					while (i < myModels.length) {
						if (pickedFeature.id == myModels[i].EntityID) {
							if (localStorage.p_name == "Gandaria Mall") {
								var myDesc = '<table ><tbody >';
								myDesc += '<tr><td>' + "Asset ID :" + myModels[i].AssetID + '</td></tr>';
								myDesc += '<tr><td>' + "Asset Name :" + myModels[i].AssetName + '</td></tr>';
								myDesc += '<tr><td>' + "Asset SLA :" + myModels[i].AssetSLA + '</td></tr>';
								var j = 0;
								while (j < pwAssetData.length) {
									if (pwAssetData[j].AssetID == myModels[i].AssetID) {
										myDesc += '<tr><td>' + "Floor :" + pwAssetData[j].Floor + '</td></tr>';
										myDesc += '<tr><td>' + "Inventory ID :" + pwAssetData[j].InventoryID + '</td></tr>';
										myDesc += '<tr><td>' + "Asset Category :" + pwAssetData[j].AssetCategory + '</td></tr>';
										myDesc += '<tr><td>' + "Asset Status :" + pwAssetData[j].AssetStatus + '</td></tr>';
										myDesc += '<tr><td>' + "Brand :" + pwAssetData[j].Brand + '</td></tr>';
										myDesc += '<tr><td>' + "Description :" + pwAssetData[j].Description + '</td></tr>';
										myDesc += '<tr><td>' + "Type :" + pwAssetData[j].Type + '</td></tr>';
										break;
									}
									j++;
								}
								myDesc += '</tbody></table>';
							} else {
								var myDesc = '<table ><tbody >';
								myDesc += '<tr><td>' + "Asset Type : " + myModels[i].BuildingType + '</td></tr>';
								myDesc += '<tr><td>' + "Asset Owner :" + myModels[i].BuildingOwner + '</td></tr>';
								myDesc += '<tr><td>' + "Asset ID :" + myModels[i].AssetID + '</td></tr>';
								myDesc += '<tr><td>' + "Asset Name :" + myModels[i].AssetName + '</td></tr>';
								myDesc += '<tr><td>' + "Asset SLA :" + myModels[i].AssetSLA + '</td></tr>';
								myDesc += '</tbody></table>';

								if (myModels[i].AssetID == "JBALB_FM_001") {
									var path = "Data/Others/nrwmanager_csv_export_2020_02_08_10_00_44.json";
									getAssetChartData(path);
									$("#floatbox-tabs").children().each(function () {
										if ($(this).is(":contains('Bar Chart')") || $(this).is(":contains('Line Chart')") || $(this).is(":contains('Data Table')") || $(this).is(":contains(Progress')") || $(this).is(":contains('Land')")) {
											$(this).hide();
										} else if ($(this).is(":contains('Chart')")) {
											$(this).show();
										}
									});


								} else if (myModels[i].AssetID == "JBALB_OFM_001") {
									var path = "Data/Others/nrwmanager_csv_export_2020_02_08_10_01_57.json";
									getAssetChartData(path);
									$("#floatbox-tabs").children().each(function () {
										if ($(this).is(":contains('Bar Chart')") || $(this).is(":contains('Line Chart')") || $(this).is(":contains('Data Table')") || $(this).is(":contains(Progress')") || $(this).is(":contains('Land')")) {
											$(this).hide();
										} else if ($(this).is(":contains('Chart')")) {
											$(this).show();
										}
									});
								} else {
									$("#floatbox-tabs").children().each(function () {
										if ($(this).is(":contains('Bar Chart')") || $(this).is(":contains('Line Chart')") || $(this).is(":contains('Data Table')") || $(this).is(":contains('Chart')") || $(this).is(":contains(Progress')") || $(this).is(":contains('Land')")) {
											$(this).hide();
										};
									});
								}

							};

							if (Cesium.defined(currentObjectId)) {
								attributes = currentPrimitive.getGeometryInstanceAttributes(currentObjectId);
								attributes.color = currentColor;
								attributes.show = currentShow;
								currentObjectId = undefined;
								currentPrimitive = undefined;
								currentColor = undefined;
								currentShow = undefined;
							}
							selectedPrimitiveId = pickedFeature.id;
							selectedPrimitive = pickedFeature.primitive;
							attributes = selectedPrimitive.getGeometryInstanceAttributes(selectedPrimitiveId);
							selectedPrimitveColor = attributes.color;
							selectedPrimitiveShow = attributes.show;
							attributes.color = [255, 0, 0, 128];
							attributes.show = [1];
							modFlag = true;
							isModelPicked = true;
							modelIndex = i;
							entFlag = false;
							isEntityPicked = false;
							localFlag = true;
							movePosition = movement.position
							floatboxTurnON(myModels[i].AssetName, myDesc);
							return;
						};
						i++;
					};
				};
				if (!localFlag) {
					movePosition = movement.position
					var selectedEntity = new Cesium.Entity();
					selectedEntity.name = pickedFeature.id._name;

					if (flagLandBoth) {
						if (pickedLot && pickedLot._polygon && pickedLot._polygon.material) {
							pickedLot._polygon.material = new Cesium.Color(polyLotRed, polyLotGreen, polyLotBlue, polyLotAlpha)
						}
						if (pickedFeature.id._polygon) {
							polyLotAlpha = pickedFeature.id._polygon.material._color._value.alpha;
							polyLotBlue = pickedFeature.id._polygon.material._color._value.blue;
							polyLotGreen = pickedFeature.id._polygon.material._color._value.green;
							polyLotRed = pickedFeature.id._polygon.material._color._value.red;
							pickedFeature.id._polygon.material = new Cesium.Color(0.86, 0.86, 0.86, 1);

						}
						pickedLot = pickedFeature.id;

						let cartesian = viewer.camera.pickEllipsoid(movement.position);
						let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
						let currentLong = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
						let currentLati = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);
						jogetLotParcel.coordsArray.splice(0, jogetLotParcel.coordsArray.length);
						jogetLotParcel.coordsArray.push(currentLong);
						jogetLotParcel.coordsArray.push(currentLati);

						shpLotId = "";
						lot = "";
						chainage = "";
						struct = "";
						fileLandName = "";
						$("#floatbox-tabs").children().each(function () {
							if (!$(this).is(":contains('Info')")) {
								$(this).hide();
							};
						});

						$("#floatboxEditButton").css('display', 'none')
						$("#floatboxWorkorderButton").css('display', 'none')
						$("#tab1half").css('display', 'none')

						floatboxTurnON(selectedEntity.name, pickedFeature.id._description._value)

						var kmlFileName = pickedFeature.id._parent.entityCollection._owner._name
						msgLand = "";
						if (jogetProcessApp == "LI") {
							var desiredLot1 = GetNextChildText('th', 'LOT');
							var desiredLot2 = GetNextChildText('th', 'CHAINAGE_D');
							var desiredLot3 = GetNextChildText('th', 'STRUCTURE_');
							lot = desiredLot1;
							chainage = desiredLot2;
							struct = desiredLot3;
							fileLandName = kmlFileName;
							if (!lot || !chainage || !struct){
								msgLand = "Please upload correct data with " + ((!lot) ? "LOT" :"") + ((!chainage) ? " CHAINAGE_D" :"")
								+ ((!struct) ? " STRUCTURE_" :"") + " attribute";
							}
							
						}
						else {
							var desiredLot = GetNextChildText('th', 'LOT');
							lot = desiredLot;
							if (!lot){
								msgLand = "Please upload correct data with " + ((!lot) ? "LOT" :"") + " attribute";
							}
							fileLandName = kmlFileName;
						}

						if(msgLand){
							$.confirm({
								boxWidth: "30%",
								useBootstrap: false,
								title: "Land Function",
								content: msgLand,
								buttons: {
								  Ok: function () {
									resetJogetConOpDraw();
									return;
								  }
								},
							});
						}
						else{
							jogetConOpDraw.flag = true;
						}

					} else {
						$("#floatbox-tabs").children().each(function () {
							if (!$(this).is(":contains('Info')")) {
								$(this).hide();
							};
						});

						if (!pickedFeature.id._description) {
							var myDesc = '<table ><tbody >';
							myDesc += '<tr><td>' + "No attributes found or data format is not supported" + '</td></tr>';
							myDesc += '</tbody></table>';
							$("#floatboxEditButton").css('display', 'none')
							floatboxTurnON(selectedEntity.name, myDesc)
						} else {
							$("#floatboxEditButton").css('display', 'none')
							floatboxTurnON(selectedEntity.name, pickedFeature.id._description._value)
						}

						if (pickedFeature.id._name == "DMZ") {
							getChartData("Data/Others/ZoneNRWReport.json")
							$("#floatbox-tabs").children().each(function () {
								if ($(this).is(":contains('Bar Chart')") || $(this).is(":contains('Line Chart')") || $(this).is(":contains('Data Table')") || $(this).is(":contains(Progress')") || $(this).is(":contains('Land')")) {
									$(this).show();
								}
							});
						} else if (pickedFeature.id._name == "CP101") {
							parseSheetLBUSCurve();
							parseSheetLBULand()
							$("#floatbox-tabs").children().each(function () {
								if ($(this).is(":contains('Progress')") || $(this).is(":contains('Land')")) {
									$(this).show();
								}
							});
						} else if (pickedFeature.id.filePathOriginal){
							if (pickedFeature.id.filePathOriginal.toLowerCase().includes("centerline") || pickedFeature.id.filePathOriginal.toLowerCase().includes("centreline")) {

								jogetConOpDraw.coordsArray = [];
								jogetConOpDraw.coordsArray.push(currentLong);
								jogetConOpDraw.coordsArray.push(currentLati);

								$("#floatboxBumiRegister").show()
								jogetConOpDraw.fileName = "";
								jogetConOpDraw.WPCId = "";
								$("#floatboxEditButton").css('display', 'none')
								$("#floatboxWorkorderButton").css('display', 'none')
								floatboxTurnON(selectedEntity.name, pickedFeature.id._description._value)
								var kmlFileName = pickedFeature.id.filePathOriginal
								var desiredEntityId = GetNextChildText('th', 'WPC_NO');
								jogetConOpDraw.fileName = kmlFileName;
								jogetConOpDraw.WPCId = desiredEntityId;
							}
						}
					}
				};
			};
		};

	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

	document.oncontextmenu = function (event) {
		event.preventDefault();
	};

	var canvas = viewer.canvas
	var ellipsoid = viewer.scene.globe.ellipsoid;
	var startMousePosition;
	var mousePosition;
	var handler = new Cesium.ScreenSpaceEventHandler(canvas);
	canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
	canvas.onclick = function () {
		canvas.focus();
	};

	flags = {
		looking: false,
		moveForward: false,
		moveBackward: false,
		moveUp: false,
		moveDown: false,
		moveLeft: false,
		moveRight: false
	};

	var camera = viewer.scene.camera;
	camera.percentageChanged = 0
	camera.changed.addEventListener(function (e) {
		if ($("#floatbox").css("display") == "block") {
			updateFloatBox();
		}
	});

	// handler when the left mouse button is pressed down
	handler.setInputAction(function (movement) {
		if (keycontrol_trigger == true) {
			flags.looking = false;
			mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

	// handler when the mouse is moved
	handler.setInputAction(function (movement) {
		mousePosition = movement.endPosition;
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	//handler when the left mouse button is released
	handler.setInputAction(function (position) {
		flags.looking = false;
	}, Cesium.ScreenSpaceEventType.LEFT_UP);


	viewer.clock.onTick.addEventListener(function (clock) {
		var camera = viewer.camera;

		if (flags.looking) {
			var width = canvas.clientWidth;
			var height = canvas.clientHeight;

			// Coordinate (0.0, 0.0) will be where the mouse was clicked.
			var x = (mousePosition.x - startMousePosition.x) / width;
			var y = -(mousePosition.y - startMousePosition.y) / height;

			var lookFactor = 0.05;
			camera.lookRight(x * lookFactor);
			camera.lookUp(y * lookFactor);
		}

		// Change movement speed based on the distance of the camera to the surface of the ellipsoid.
		var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
		var moveRate = cameraHeight / 100.0;
		if (moveRate < 0.6) {
			moveRate = 0.6
		}
		if (flags.moveForward) {
			camera.moveForward(moveRate);
		}
		if (flags.moveBackward) {
			camera.moveBackward(moveRate);
		}
		if (flags.moveUp) {
			camera.moveUp(moveRate);
		}
		if (flags.moveDown) {
			camera.moveDown(moveRate);
		}
		if (flags.moveLeft) {
			camera.moveLeft(moveRate);
		}
		if (flags.moveRight) {
			camera.moveRight(moveRate);
		}
	});

	document.addEventListener('keydown', function (e) {
		if (keycontrol_trigger == false) {
			return
		}
		flagName = getFlagForKeyCode(e.keyCode);
		if (typeof flagName !== 'undefined') {
			flags[flagName] = true;
		}
	}, false);

	document.addEventListener('keyup', function (e) {
		flagName = getFlagForKeyCode(e.keyCode);
		if (e.key === "Backspace") {
			if (jogetConOpDraw.flag && jogetConOpDraw.coordsArray.length >= 1) {
				jogetConOpDraw.coordsArray.pop()
				jogetConOpDraw.coordsArray.pop()
				viewer.entities.remove(jogetConOpDraw.entity)

				//remove last billboard
				viewer.entities.remove(jogetConOpDraw.billboardEntities[jogetConOpDraw.billboardEntities.length - 1])
				jogetConOpDraw.billboardEntities.pop()

				jogetConOpDraw.drawEntity();
			}
			//for mark up tools//
			if (flagMarkupTools) { //flag to indicate when markup tools is used
			}
		} else if (e.key === "Escape") { // escape key maps to keycode `27`
			if (flagMeasure) {
				hideinstruction()
				instructions("")
				// 	neutralAllMenu();
				$(".sidemenu .third-button .measure").removeClass('active');
				// to clear flags and arrays for measure

				for (var i = 0; i < 3; i++) {
					labelEntity[i].label.show = false;
				};
				MeasureTool = "";
				document.getElementsByTagName("body")[0].style.cursor = "default";
				for (var i = 0; i < distEntities.length; i++) {
					viewer.entities.remove(distEntities[i]);
				};
				distanceEntity = 0;
				distance = 0;
				flagPosEntities = false;

			} else if (jogetConOpDraw.flag == true) {
				hideinstruction()
				instructions("")
				resetJogetConOpDraw()
				jqwidgetBox("drawTool", false);
			} else if ($('#draw').hasClass('active')) {
				flagDraw = false;
				$("#draw.active").removeClass('active')
				closeAllWindow()
				document.getElementsByTagName("body")[0].style.cursor = "default";
				distEntities.splice(0, distEntities.length);
				//console.log(distEntities.length);
				viewer.scene.primitives.remove(tempModel);
				hideinstruction()
				instructions("")
			} else if ($('#addcamera').hasClass('active')) {
				flagCamera = false;
				OnClickAddCameraCancel()
				closeAllWindow()
				document.getElementsByTagName("body")[0].style.cursor = "default";
			} else if ($('#mark').hasClass('active')) {
				document.getElementById('newentityForm').style.display = "none";
				$("#mark").removeClass('active')
				closeAllWindow()
				$('#newentityForm').css('display', 'none');
				$(':input').val('');
				flagEntity = false;
				document.getElementsByTagName("body")[0].style.cursor = "default";
				hideinstruction()
				instructions("")
			} else if ($('#addimage').hasClass('active')) {
				OnClickAddImageCancel()
				closeAllWindow()
				flagAddImage = false;
				document.getElementsByTagName("body")[0].style.cursor = "default";
				hideinstruction()
				instructions("")
			} else if (flagMarkupTools) { //later change this to check for the class active
				$("body").css("cursor", "default")
				drawOnlyFlagMarkupTool = false;
				hideinstruction()
				instructions("")
				$("#input-text").css('display', "none");
				checkCompleteDraw = true;
				markupRemoveActive();
				$("#btn_undo").css("pointer-events", "auto");
				$("#btn_delete").css("pointer-events", "auto")
				// Redraw the shape so it's not dynamic and remove the dynamic shape.
				if (drawFlagMarkupTool) {
					if (drawFlagMarkupTool == 'line' && arrayOfCartesianMarkupTool.length > 1) {
						drawMarkupTool(drawFlagMarkupTool);
						let coorArr = [];
						arrayOfCartesianMarkupTool.forEach(function (ele, idx) {
							var s = [];
							let currentLong = Cesium.Math.toDegrees(ele.longitude).toFixed(8);
							let currentLati = Cesium.Math.toDegrees(ele.latitude).toFixed(8);
							s.push(currentLong);
							s.push(currentLati);
							coorArr.push(s);
						});
						arrayOfCartesianMarkupTool = [];
						checkCompleteDraw = true;
					}
					if (drawFlagMarkupTool == 'polygon' && arrayOfCartesianMarkupTool.length > 2) {
						drawMarkupTool(drawFlagMarkupTool);
						let coorArr = [];
						arrayOfCartesianMarkupTool.forEach(function (ele, idx) {
							var s = [];
							let currentLong = Cesium.Math.toDegrees(ele.longitude).toFixed(8);
							let currentLati = Cesium.Math.toDegrees(ele.latitude).toFixed(8);
							s.push(currentLong);
							s.push(currentLati);
							coorArr.push(s);
						});
						arrayOfCartesianMarkupTool = [];
						checkCompleteDraw = true;

					}
				}
			}
		} else if (typeof flagName !== 'undefined') {
			flags[flagName] = false;
		}
	}, false);

	///for clicking the item inside infobox
	/*	viewer.infoBox.frame.addEventListener('load', function() {
			//
			// Now that the description is loaded, register a click listener inside
			// the document of the iframe.
			//
			viewer.infoBox.frame.contentDocument.body.addEventListener('click', function(e) {
				//
				// The document body will be rewritten when the selectedEntity changes,
				// but this body listener will survive.  Now it must determine if it was
				// one of the clickable buttons.
				//
				if (e.target && e.target.id === 'tab1') {

					console.log("tab1")
					//e.target
					//viewer.infoBox.frame.contentDocument.getElementsById("kmlpage1").style.display="block"
					//console.log(viewer.infoBox.frame.contentDocument)
					$("#kmlpage1").css("display","block")
					$("#kmlpage1").addClass("active")
					$(".page.active").css("display","none")
					viewer.infoBox.frame.contentDocument.body.getElementsByClassName("page active").style.display="none"
					$(".page.active").removeClass("active")
				}
				else if (e.target && e.target.id === 'tab2'){

					console.log("tab2")
					$("#kmlpage2").css("disaplay","block")
					$("#kmlpage2").addClass("active")
					$(".page.active").css("disaplay","none")
					$(".page.active").removeClass("active")

				}
			}, false);
		}, false);
	*/

	// this is the eventlistener for right click to mark both the distance entity and the entity
	// the flag marker indicates entity and the flag distance the distance entity. Rest of the right clicks are ignored
	viewer.screenSpaceEventHandler.setInputAction(function onRightClick(click) {
		if (jogetConOpDraw.flag == true) {
			if (!jogetAppProcesses['app_' + jogetProcessApp]) {
				console.log("No App process name found")
				return
			}
			if (!jogetAppProcesses.constructPackage_name) {
				console.log("No constructPackage_name found")
				return
			}
			if (jogetConOpDraw.shape === "Polygon" && jogetConOpDraw.coordsArray.length <= 4) {
				$.alert({
					boxWidth: "30%",
					useBootstrap: false,
					title: "Insufficient points",
					content: "Please draw at least 3 points to form a polygon",
				});
				return
			}
			if (jogetConOpDraw.coordsArray.length >= 1) {
				var coordinateString = jogetConOpDraw.coordsArray.toString()
				if (coordinateString == "") {
					console.log("No coordinate captured, please try again.")
					return
				}
				if (jogetAppProcesses['app_'+jogetProcessApp] == 1 && !isParent && JOGETLINK['cons_issue_'+jogetProcessApp]) {
					url = JOGETLINK['cons_issue_'+jogetProcessApp]+"&coordinates="+coordinateString;
				}
				
				conOpData.loadedFreq = 0
				$("#appWindow iframe").attr("src", url)
					.css("height", "100%")
					.css("width", "100%")
					.css("border", "none")
				jqwidgetBox("appWindow", 1);
			}
			else {
				$(".floatbox#floatbox").hide();

				if (!lot){
					msgLand = "Please choose the lot parcel first";

					$.confirm({
						boxWidth: "30%",
						useBootstrap: false,
						title: "Land Function",
						content: msgLand,
						buttons: {
						  Ok: function () {
							resetJogetConOpDraw();
							return;
						  }
						},
					});
				}
				else{
					let url = "";
					var useLinkJoget = "";
					var coordinateString = jogetLotParcel.coordsArray.toString();
					if (shpLotId) {
						var shplotString = shpLotId;
					}
					else {
						var shplotString = "";
					}
					var lotIdString = lot;
					var chainageString = chainage;
					var structString = struct;
					if(!isParent){
						if (jogetProcessApp == "LR" || jogetProcessApp == "LI" || jogetProcessApp == "LE"){
							if(flagLinkLand){
								useLinkJoget = 'cons_linkLot_' + jogetProcessApp;
							}
							else{
								useLinkJoget = 'cons_issue_' + jogetProcessApp;
							}

							if (jogetProcessApp == "LI"){
								url = JOGETLINK[useLinkJoget] +  "&lotId=" + lotIdString + "&chainage=" + chainageString + "&structure=" + structString + "&coordinates=" + coordinateString + "&kmlFileName=" + 
										fileLandName + "&shpLotId=" + shplotString;
							}
							else{
								let params = "&lotId=" + lotIdString + "&coordinates=" + coordinateString + "&kmlFileName=" + fileLandName + "&shpLotId=" + shplotString;
								url = JOGETLINK[useLinkJoget] + params;
							}

							$("#appWindow iframe")
								.attr("src", url)
								.css("height", "100%")
								.css("width", "100%");
							changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
							jqwidgetBox("appWindow", 1);

						}
					}
				}
			}

			//to not allow click at cesium when already open the form
			resetJogetConOpDraw();

		} else if (flagEntity) {
			var position = viewer.camera.pickEllipsoid(click.position);
			var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
			currentLng = Cesium.Math.toDegrees(cartographicPosition.longitude);
			currentLat = Cesium.Math.toDegrees(cartographicPosition.latitude);
			jqwidgetBox("function9-1", false);
			$('#newentityForm').css('display', 'block');
			$(':input').val('');
			flagEntity = false;
			document.getElementsByTagName("body")[0].style.cursor = "default";
		} else if (flagMeasure && MeasureTool == "Area") {
			instructions('Press <kbd>Esc</kbd>  to exit.')
			var cartesian = viewer.scene.pickPosition(click.position);

			if (distanceEntity < 3) {
				return;
			}
			var mypos = [];
			mypos[0] = StartPoint;
			mypos[1] = EndPoint
			distancePolyLine(mypos);
			var mydistance = Math.sqrt(Math.pow((point1.x - StartPoint.x), 2) + Math.pow((point1.y - StartPoint.y), 2) + Math.pow((point1.z - StartPoint.z), 2));
			distance += mydistance;
			point1 = cartesian;

			flagArea = true;

			distEntities.push(viewer.entities.add({
				polygon: {
					hierarchy: areaPositions,
					material: Cesium.Color.BLUE.withAlpha(0.4),
				}
			}));
			var indices = Cesium.PolygonPipeline.triangulate(areaPositions);
			var area = 0; // In square kilometers
			//console.log(indices);
			for (var i = 0; i < indices.length; i += 3) {
				var vector1 = areaPositions[indices[i]];
				var vector2 = areaPositions[indices[i + 1]];
				var vector3 = areaPositions[indices[i + 2]];

				// These vectors define the sides of a parallelogram (double the size of the triangle)
				var vectorC = Cesium.Cartesian3.subtract(vector2, vector1, new Cesium.Cartesian3());
				var vectorD = Cesium.Cartesian3.subtract(vector3, vector1, new Cesium.Cartesian3());

				// Area of parallelogram is the cross product of the vectors defining its sides
				var areaVector = Cesium.Cartesian3.cross(vectorC, vectorD, new Cesium.Cartesian3());

				// Area of the triangle is just half the area of the parallelogram, add it to the sum.
				area += Cesium.Cartesian3.magnitude(areaVector) / 2.0;
			};
			var myarea = area / 1000;
			var perimeter = distance / 1000;
			var square = '2';
			square = square.sup();
			labelEntity[0].position = cartesian;
			labelEntity[0].label.show = true;
			labelEntity[0].label.backgroundColor = Cesium.Color.BLACK;
			labelEntity[0].label.text =
				'Area : ' + myarea.toFixed(3) + '  km2' +
				'\nPerimeter : ' + perimeter.toFixed(3) + '  km';

			//console.log(area);
		} else if (flagCamera) {
			instructions('Click  <kbd>Save</kbd>  button to save location.<br>Press  <kbd>Esc</kbd>  to exit.')
			jqwidgetBox("cameraheight", 1);
			var cartographicPosition, cartesian;
			//check if 3D or 2D
			var pickedFeature = viewer.scene.pick(click.position);
			console.log(pickedFeature);
			if (!Cesium.defined(pickedFeature)) {
				//no feature only cesium map
				cartesian = viewer.camera.pickEllipsoid(click.position);
				cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			} else {
				// either tileset or kml	
				if (pickedFeature._content) {
					console.log("tileset");
					cartesian = viewer.scene.pickPosition(click.position);
					console.log(cartesian);
					cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
				} else {
					console.log("2D");
					cartesian = viewer.camera.pickEllipsoid(click.position);
					cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
				}
			}
			//var position = viewer.camera.pickEllipsoid(click.position);
			//var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
			var lng = Cesium.Math.toDegrees(cartographicPosition.longitude);
			var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
			var height = cartographicPosition.height;
			//$('#addcameraModal').css('display', 'block');
			tempVideoPin = addVideoPin("untitled", lng, lat, height, true);
			$('#camName').val("");
			$('#camHeight').val(height.toFixed(2));
			$("#camLong").val(lng.toFixed(6));
			$("#camLat").val(lat.toFixed(6));
			// CameraHeight(true);
			jqwidgetBox("cameraheight", 1);
			//flagCamera = false;
			//document.getElementsByTagName("body")[0].style.cursor = "default";

		} else if (flagAddImage) {
			instructions('Click  <kbd>Save</kbd>  button to save location.<br>Press  <kbd>Esc</kbd>  to exit.')
			jqwidgetBox("addImage", 1);
			var cartographicPosition, cartesian;
			//check if 3D or 2D
			var pickedFeature = viewer.scene.pick(click.position);
			if (!Cesium.defined(pickedFeature)) {
				//no feature only cesium map
				cartesian = viewer.camera.pickEllipsoid(click.position);
				cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			} else {
				// either tileset or kml    
				if (pickedFeature._content) {
					console.log("tileset");
					cartesian = viewer.scene.pickPosition(click.position);
					console.log(cartesian);
					cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
				} else {
					console.log("2D");
					cartesian = viewer.camera.pickEllipsoid(click.position);
					cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
				}
			}
			//var position = viewer.camera.pickEllipsoid(click.position);
			//var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
			var lng = Cesium.Math.toDegrees(cartographicPosition.longitude);
			var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
			var height = cartographicPosition.height;

			tempImagePin = addEarthPin("untitled", lng, lat, height, true);
			$('#imgName').val("");
			$('#imgHeight').val(height.toFixed(2));
			$("#imgLong").val(lng.toFixed(6));
			$("#imgLat").val(lat.toFixed(6));

			jqwidgetBox("addImage", 1);
			flagAddImage = false;
			document.getElementsByTagName("body")[0].style.cursor = "default";

		} else if (flagMarkupTools) {
			if (drawFlagMarkupTool) {
				if (drawFlagMarkupTool == 'line' && arrayOfCartesianMarkupTool.length > 1) {
					drawMarkupTool(drawFlagMarkupTool);
					let coorArr = [];
					arrayOfCartesianMarkupTool.forEach(function (ele, idx) {
						var s = [];
						let currentLong = Cesium.Math.toDegrees(ele.longitude).toFixed(8);
						let currentLati = Cesium.Math.toDegrees(ele.latitude).toFixed(8);
						s.push(currentLong);
						s.push(currentLati);
						coorArr.push(s);
					});
					console.log(coorArr);
					arrayOfCartesianMarkupTool = [];
					checkCompleteDraw = true;
				}
				if (drawFlagMarkupTool == 'polygon' && arrayOfCartesianMarkupTool.length > 2) {
					drawMarkupTool(drawFlagMarkupTool);
					let coorArr = [];
					arrayOfCartesianMarkupTool.forEach(function (ele, idx) {
						var s = [];
						let currentLong = Cesium.Math.toDegrees(ele.longitude).toFixed(8);
						let currentLati = Cesium.Math.toDegrees(ele.latitude).toFixed(8);
						s.push(currentLong);
						s.push(currentLati);
						coorArr.push(s);
					});
					console.log(coorArr);
					arrayOfCartesianMarkupTool = [];
					checkCompleteDraw = true;

				}
			}
		} else {

			$("#rightclickMenu").addClass("active")
			$(".sub-rightclickMenu.active").removeClass("active")

			let menuHeight = $("#rightclickMenu").height()
			let menuWidth = $("#rightclickMenu").width()
			let posy = click.position.y
			let posx = click.position.x
			let windowHeight = $(window).height()
			let windowWidth = $(window).width()

			let remainY = windowHeight - posy;
			let differenceY = remainY - menuHeight;

			let remainX = windowWidth - posx;
			let differenceX = remainX - menuWidth;

			if (differenceY < 0){
				$("#rightclickMenu").offset({
					top: click.position.y + differenceY
				});
			}else{
				$("#rightclickMenu").offset({
					top: click.position.y
				});
			}

			if (differenceX < 0){
				$("#rightclickMenu").offset({
					left: click.position.x + differenceX
				});
			}else{
				$("#rightclickMenu").offset({
					left: click.position.x
				});
			}

			
		}
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

	Cesium.knockout.track(viewModel);
	// Bind the viewModel to the DOM elements of the UI that call for it.
	var toolbar = document.getElementById('ScreenSpaceTool');
	Cesium.knockout.applyBindings(viewModel, toolbar);

	Cesium.knockout.getObservable(viewModel, 'maximumScreenSpaceError').subscribe(
		function (newValue) {
			if (Cesium.defined(viewModelTileset)) {
				viewModelTileset.maximumScreenSpaceError = parseFloat(newValue);
			}
		}
	);

	// for globe brightness
	imageryLayers = viewer.imageryLayers;
	Cesium.knockout.getObservable(viewModel, 'brightness').subscribe(
		function (newValue) {
			if (imageryLayers.length > 0) {
				var layer = imageryLayers.get(0);
				layer['brightness'] = newValue;
			}
		}
	);
	imageryLayers.layerAdded.addEventListener(updateViewModel);
	imageryLayers.layerRemoved.addEventListener(updateViewModel);
	imageryLayers.layerMoved.addEventListener(updateViewModel);
	updateViewModel();

	$("#videoSourceRadio input").change(function () {

		if ($(this).attr("id") == 'localVideo') {
			$(".localVideo").show()
			$(".embedVideo").hide()

		} else if ($(this).attr("id") == 'EmbedLink') {
			$(".localVideo").hide()
			$(".embedVideo").show()
		}
	});

	$("#imageSourceRadio input[type=radio][name=image]").change(function () {
		if (this.value == 'localImage') {
			$(".localImage").show()
			$(".embedImage").hide()

		} else if (this.value == 'embedImage') {
			$(".localImage").hide()
			$(".embedImage").show()
		}
	});

	$('#rootNode').on("select_node.jstree", function (e, data) {
		//need this to remove all other tabs if clicked on it the first time
		$("#floatbox-tabs").children().each(function () {
			if (!$(this).is(":contains('Info')")) {
				$(this).hide();
			};
		});

		var nodeId = data.node.id;
		selectedNodeId = data.node.id;
		console.log(selectedNodeId);

		var i = 0;
		while (i < locations.length) {
			if (locations[i].locationName == nodeId) {
				entityIndex = i;

				isEntityPicked = true;
				var scene = viewer.scene;
				var p3d = entitiesArray[i]._position._value
				var p = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, p3d);
				p.y -= 50;
				if (!p) {
					return;
				}
				// var desc = "<table><tbody>";
				// for (var k = 0; k < filedata.length; k++) {
				// 	if (filedata[k].locationID == locations[i].locationID) {
				// 		var fileLength = filedata[k].files.length;
				// 		for (var l = 0; l < fileLength; l++) {
				// 			if (filedata[k].files[l].folder == false) {
				// 				var url = PWDocURL + filedata[k].files[l].id + "/$file";
				// 				//desc += '<tr><td><a href =' + url + ' target =_blank">' + filedata[k].files[l].text + '</a></td></tr>';
				// 				desc += '<tr><td><div id=' + url + ' onClick="viewFile(this)"> ' + filedata[k].files[l].text + '</div></td></tr>';
				// 			};
				// 		};
				// 		break;
				// 	};
				// };
				// desc += "</tbody></table>";
				// $('#page2').html(desc); //displaying the documents in tab 2

				$("#floatbox-tabs").children().each(function () {
					if($("#function9-34-jqx").parent().parent().parent().is(':visible')){
						//console.log("directory folder on display");
						if ($(this).is(":contains('Documents')")) {
							$(this).show();
						};
					};
				});

				$(".floatbox-body .scrollcontainer#page1").html(entitiesArray[i]._description._value);
				$(".floatbox-header h4").html(entitiesArray[i].name)
				$(".floatbox#floatbox").css("transform", "translate(-50%, -115%)")
				cameraClickPosition = {
					lon: locations[i].longitude,
					lat: locations[i].latitude,
					alt: 0
				};
				console.log(locations[i])
				viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(locations[i].longitude, locations[i].latitude, 2000.0),
					duration: 2,
					complete: function () {
						$(".floatbox#floatbox").css("top", "60%")
						$(".floatbox#floatbox").css("left", "50%")
						$(".floatbox#floatbox").fadeIn(150)
					}
				});
				break;
			};
			i++;
		};

		//};

	});

	function getProjectWiseData(nodeId, instanceID){
		$("div.loadingcontainer-mainadmin").css("display", "block");
		$("#loadingText").text("Fetching files ..");
		$.ajax({
			type: "POST",
			url: 'BackEnd/getProjectWiseFiles&Folders.php', 
			dataType: 'json', dataType: 'json',
			data: {
				instanceID: instanceID
			},
			success: function (obj, textstatus) {
				console.log(obj);
				if(obj['msg'] == "success"){
					console.log("inside");
					var pwdata  = obj['data'];
					console.log(pwdata);
					var desc = '<table ><tbody >';
					for (var j = 0; j < pwdata.length; j++) {
						console.log(pwdata[j].folder);
						if(pwdata[j].folder){
							$('#infoRootNode').jstree().create_node(nodeId, {
								"id": pwdata[j].id,
								"text": pwdata[j].text
							})
						}else{
							if(pwdata[j].ClassName == "Document"){
								url = PWDocURL + pwdata[j].id + "/$file";
								console.log(url);
								desc += '<tr><td><div id=' + url + ' onClick="viewFile(this)"> ' +pwdata[j].text + '</div></td></tr>';
							}else if(pwdata[j].ClassName == "LogicalSet"){
								url = PWLogURL + pwdata[j].id + "/$file";
								console.log(url);
								desc += '<tr><td><div id=' + url + ' onClick="viewFile(this)"> ' +pwdata[j].text + '</div></td></tr>';
							}
						}
					}
					desc += '</tbody></table>';
					$('#infoRootNode').jstree(true).get_node(nodeId).data = desc;
					var scene = viewer.scene;
					var p3d = entitiesArray[entityIndex]._position._value;
	
					//var p3d = Cesium.Cartesian3.fromDegrees(locations[i].longitude, locations[i].latitude, 0);
					console.log(p3d);
					var p = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, p3d);
					console.log(p);
					p.y -= 50;
					if (!p) {
						return;
					}
					movePosition = p
					$("#floatbox-tabs").children().each(function () {
						if ($(this).is(":contains('Documents')")) {
							$(this).show();
						};
					});
					$('#page2').html(desc); //to display documents in documents tab.
					$(".floatbox-body .scrollcontainer#page1").html(entitiesArray[entityIndex]._description._value);
					$(".floatbox-header h4").html(entitiesArray[entityIndex].name)
					$(".floatbox#floatbox").css("transform", "translate(-50%, -115%)")
					cameraClickPosition = {
						lon: locations[entityIndex].longitude,
						lat: locations[entityIndex].latitude,
						alt: 0
					};
					viewer.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(locations[entityIndex].longitude, locations[entityIndex].latitude, 2000.0),
						duration: 2,
						complete: function () {
							$(".floatbox#floatbox").css("top", "50%")
							$(".floatbox#floatbox").css("left", "50%")
							$(".floatbox#floatbox").fadeIn(150)
						}
					});

				}else{
					console.log("no success");
				}
				$("div.loadingcontainer-mainadmin").css("display", "none");
				$(".loader").css("animation-duration", "1000ms");
			},
			error: function (xhr, textStatus, errorThrown) {
				var str = textStatus + " " + errorThrown;
				console.log(str);
				$.alert({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Message',
					content: str
				});
				window.clearInterval(timer);
				timer = window.setInterval(completed, 1000);
				$('div.loadingcontainer-mainadmin').css('display', 'none')
				$('.loader').css("animation-duration", '1000ms');
			}
		});

	}

	$("#infoRootNode").on("select_node.jstree", function (e, data) {
		//alert("node_id: " + data.node.id);
		//need this to remove all other tabs if clicked on it the first time
		$("#floatbox-tabs").children().each(function () {
			if (!$(this).is(":contains('Info')")) {
				$(this).hide();
			};
		});
		var path = $('#infoRootNode').jstree().get_path(data.node, false, true);
		if(path.length <3) return;

		var flagFolder = false;
		var flagLoc = false;
		selectedNodeId = data.node.id;
		var locName = path[2];

		if (path.length > 3) {
			flagFolder = true;
		} else {
			flagLoc = true;
		};
		if (flagLoc) {
			var i = 0;
			while (i < locations.length) {
				if (locations[i].locationName == locName) {
					entityIndex = i;
					isEntityPicked = true;
					var parent = $('#infoRootNode').jstree().is_parent(data.node);
					if(locations[i].folderID == null){
						$.alert({
							boxWidth: "30%",
							useBootstrap: false,
							title: "Message",
							content: "Project Wise path is not set yet. Please set the path first",
						});
						return;
					}
					else{
						if(!parent){
							getProjectWiseData(data.node.id, locations[i].folderID);
						}else{
							var mydesc = $('#infoRootNode').jstree(true).get_node(data.node.id);
							$("#floatbox-tabs").children().each(function () {
								if ($(this).is(":contains('Documents')")) {
									$(this).show();
								};
							});
							$('#page2').html(mydesc); //to display documents in documents tab.
							$(".floatbox-body .scrollcontainer#page1").html(entitiesArray[entityIndex]._description._value);
							$(".floatbox-header h4").html(entitiesArray[entityIndex].name)
			
						}
					}
					
					break;	
				}
				i++;
			}

		}else if(flagFolder){
			var parent = $('#infoRootNode').jstree().is_parent(data.node);
			if(!parent){
				getProjectWiseData(data.node.id, data.node.id);
			}else{
				var mydesc = $('#infoRootNode').jstree(true).get_node(data.node.id).data;
				console.log(mydesc);
				$("#floatbox-tabs").children().each(function () {
					if ($(this).is(":contains('Documents')")) {
						$(this).show();
					};
				});
				$('#page2').html(mydesc); //to display documents in documents tab.
				$(".floatbox-body .scrollcontainer#page1").html(entitiesArray[entityIndex]._description._value);
				$(".floatbox-header h4").html(entitiesArray[entityIndex].name)

			}
			//console.log(desc);
		}
	});

	$("#SwitchSceneMod").click(function () {
		switch (viewer.scene.camera._mode) {
			case 3:
				viewer.scene.mode = Cesium.SceneMode.SCENE2D;
				if (jogetConOpDraw.flag) {
					thisentity = viewer.entities.add({
						polygon: {
							hierarchy: Cesium.Cartesian3.fromRadiansArray(jogetConOpDraw.coordsRad),
							outline: true,
							height: 0,
							extrudedHeight: 2,
							material: Cesium.Color.RED
						}
					});
				}
				break;
			case 2:
				viewer.scene.mode = Cesium.SceneMode.SCENE3D;
				break;
		}
	})

	$("#ConOpDrawType input").change(function () {
		jogetConOpDraw.shape = $(this).val();
		jogetConOpDraw.flag = true;
		if (!jogetAppProcesses['app_' + jogetProcessApp]) {
			console.log("No App process name found")
			return
		}
		if (jogetConOpDraw.shape == "Coordless") {
			jqwidgetBox("drawTool", false);
			InitiateCoordless(jogetProcessApp);
			hideinstruction();
			return;
		}
		jqwidgetBox("drawTool", false);
		document.getElementsByTagName("body")[0].style.cursor =
			"url('Images/ccrosshair.cur'),auto";
		jogetConOpDraw.flag = true;
		jogetConOpDraw.coordsArray = [];
		jogetConOpDraw.entity = null;

	});

	$("#landConfigureType input").change(function () {
		jogetLotParcel.configure = $(this).val();
		jqwidgetBox("landConfigure", false);
		if (jogetLotParcel.configure == "manualLotID") {
			InitiateCoordless(jogetProcessApp);
			return;
		}
		else{
  			flagLandBoth = true;
  			jogetConOpDraw.flag = true;
			showinstruction();
			instructions(
				'Select lot for register<br>\
				Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to lot parcel.<br>\
				Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to register the lot.<br>\
				Press  <kbd>Esc</kbd> to Escape.'
			);
		}

	});

	// trigger update notification on iframe loaded
	$("#appWindow iframe").on("load", function () {
		OnLoadNotiCount();
	});

	// to show asset general tab when there is data
	if($('#assetData').length > 0){
		if($('#assetData').html().replace(/\s/g, "") != ''){
			$('#assetTabGeneral').show();
		}
	}
	
})

$(document).on('click', '[name="shape"]', function () {
	var x, y, z;
	x = $('#inputx').val();
	y = $('#inputy').val();
	z = $('#inputz').val();
	if (!x || !y || !z) {
		$.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Message',
			content: 'Please select a center point to draw the geometry!',
		});
		return;
	}
	var myid = $('[name="shape"]:checked').prop('id');
	var width, length, height;
	width = $('#sizewidth').val();
	length = $('#sizelength').val();
	height = $('#sizeheight').val();
	var head, pitch, roll;
	head = $('#orientationhead').val();
	pitch = $('#orientationpitch').val();
	roll = $('#orientationroll').val();
	viewer.scene.primitives.remove(tempModel);
	var center = new Cesium.Cartesian3(x, y, z);
	var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
	var hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(head, pitch, roll));
	var hpr = Cesium.Matrix4.fromRotationTranslation(hprRotation, new Cesium.Cartesian3(0.0, 0.0, -2.0));
	Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
	if (myid == "radioelipsoid") {
		tempModel = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: new Cesium.EllipsoidGeometry({
					radii: new Cesium.Cartesian3(width, length, height)
				}),
				modelMatrix: modelMatrix,
				attributes: {
					color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
					show: new Cesium.ShowGeometryInstanceAttribute(true)
				},
				id: x
			}),
			classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
		}));

	} else if (myid == "radiobox") {
		tempModel = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: Cesium.BoxGeometry.fromDimensions({
					vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
					dimensions: new Cesium.Cartesian3(width, length, height)
				}),
				modelMatrix: modelMatrix,
				attributes: {
					color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
					show: new Cesium.ShowGeometryInstanceAttribute(true)
				},
				id: x

			}),
			classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
		}));
	}
});

function generalCheckBox(ele) {
	$(ele.parentNode).next('ul').each(function () {
		var check = $(this).children('li.layergroup')
		if(check.length > 0){
			check.children('input').prop("indeterminate", false);
			check.children('input').prop('checked', true)

			$(this).children('ul').each(function () {
				var check4 = $(this).children('li.layergroup');
				check4.children('input').prop("indeterminate", false);
				check4.children('input').prop('checked', true)
			})

			var trueExist = true
			//IF FROM FIRST GROUP, MAIN GROUP TICKBOX HAVE TO CHECK ALSO
			$(ele.parentNode).siblings(":not(.layergroup)").each(function () {
				var checkInput = $(this).children('input')
				if(checkInput.length > 0){
					if ($(this).children('input').prop('checked') == false) {
						trueExist = false
					}
				}
				else{
					$(this).children(":not(.layergroup)").each(function () {
						if ($(this).children('li').find('input').prop('checked') == false) {
							trueExist = false
						}
					})
				}
			})

			var check3 = $(this).parent().prev('li.layergroup')
			if(check3.length > 0){
				if(trueExist == false){
					check3.children('input').prop("indeterminate", true);
					
				}
				else{
					check3.children('input').prop("indeterminate", false);
					check3.children('input').prop("checked", true);
				}
			}
		}
		else{
			//IF FROM SECOND GROUP, IT WILL GO HERE

			//IF FROM SECOND GROUP, FIRST AND MAIN GROUP TICKBOX OF THE CURRENT GROUP ONLY HAVE TO BE INTERMEDIATE -
			$(ele.parentNode).parent().each(function () {
				var check2 = $(this).prev('li.layergroup')
				if(check2.length > 0){
					//BUT HAVE TO CHECK IS THERE ANY LI OR NOT BELOW FIRST GROUP 
					var trueExistFirst = true
					$(ele.parentNode).siblings(":not(.layergroup)").each(function () {
						var checkInput = $(this).children('input')
						if(checkInput.length > 0){
							if ($(this).children('input').prop('checked') == false) {
								trueExistFirst = false
							}
						}
						else{
							$(this).children(":not(.layergroup)").each(function () {
								if ($(this).find('input').prop('checked') == false) {
									trueExistFirst = false
								}
							})
						}
					})

					if(trueExistFirst == false){
						check2.children('input').prop("indeterminate", true);
					}
					else{
						check2.children('input').prop("indeterminate", false);
						check2.children('input').prop("checked", true);
					}

					var trueExist = true
					$(ele.parentNode).each(function () {
						$(this).parent().siblings(":not(.layergroup)").each(function () {
							var checkInput = $(this).children('input')
							if(checkInput.length > 0){
								if ($(this).children('input').prop('checked') == false) {
									trueExist = false
								}
							}
							else{
								$(this).children(":not(.layergroup)").each(function () {
									if ($(this).children().find('input').prop('checked') == false) {
										trueExist = false
									}
								})
							}
						})

						$(this).siblings(":not(.layergroup)").each(function () {
							var checkInput = $(this).children('input')
							if(checkInput.length > 0){
								if ($(this).children('input').prop('checked') == false) {
									trueExist = false
								}
							}
							else{
								$(this).children(":not(.layergroup)").each(function () {
									if ($(this).find('input').prop('checked') == false) {
										trueExist = false
									}
								})
							}
						})
					})

					var check3 = check2.parent().prev('li.layergroup')
					if(trueExist == false){
						check3.children('input').prop("indeterminate", true);
					}
					else{
						check3.children('input').prop("indeterminate", false);
						check3.children('input').prop("checked", true);
					}
				}
			})
		}
	})
}

function generalUnCheckBox(ele) {
	$(ele.parentNode).next('ul').each(function () {
		var check = $(this).children('li.layergroup')
		if(check.length > 0){
			check.children('input').prop("indeterminate", false);
			check.children('input').prop('checked', false)

			$(this).children('ul').each(function () {
				var check4 = $(this).children('li.layergroup');
				check4.children('input').prop("indeterminate", false);
				check4.children('input').prop('checked', false)
			})

			var trueExist = false
			//IF FROM FIRST GROUP, MAIN GROUP TICKBOX HAVE TO CHECK ALSO
			$(ele.parentNode).siblings(":not(.layergroup)").each(function () {
				var checkInput = $(this).children('input')
				if(checkInput.length > 0){
					if ($(this).children('input').prop('checked') == true) {
						trueExist = true
					}
				}
				else{
					$(this).children(":not(.layergroup)").each(function () {
						if ($(this).children('li').find('input').prop('checked') == true) {
							trueExist = true
						}
					})
				}
			})

			var check3 = $(this).parent().prev('li.layergroup')
			if(check3.length > 0){
				if(trueExist == true){
					check3.children('input').prop("indeterminate", true);
					
				}
				else{
					check3.children('input').prop("indeterminate", false);
					check3.children('input').prop("checked", false);
				}
			}
		}
		else{
			//IF FROM SECOND GROUP, FIRST AND MAIN GROUP TICKBOX HAVE TO BE INTERMEDIATE -
			$(ele.parentNode).parent().each(function () {
				var check2 = $(this).prev('li.layergroup')
				if(check2.length > 0){
					//BUT HAVE TO CHECK IS THERE ANY LI OR NOT BELOW THEM
					var trueExistFirst = false
					$(ele.parentNode).siblings(":not(.layergroup)").each(function () {
						var checkInput = $(this).children('input')
						if(checkInput.length > 0){
							if ($(this).children('input').prop('checked') == true) {
								trueExistFirst = true
							}
						}
						else{
							$(this).children(":not(.layergroup)").each(function () {
								if ($(this).children('input').prop('checked') == true) {
									trueExistFirst = true
								}
							})
						}
					})

					if(trueExistFirst == true){
						check2.children('input').prop("indeterminate", true);
						
					}
					else{
						check2.children('input').prop("indeterminate", false);
						check2.children('input').prop("checked", false);
					}

					//FOR MAIN GROUP 
					var trueExist = false
					$(ele.parentNode).each(function () {
						$(this).parent().siblings(":not(.layergroup)").each(function () {
							var checkInput = $(this).children('input')
							if(checkInput.length > 0){
								if ($(this).children('input').prop('checked') == true) {
									trueExist = true
								}
							}
							else{
								$(this).children(":not(.layergroup)").each(function () {
									if ($(this).children().find('input').prop('checked') == true) {
										trueExist = true
									}
								})
							}
						})

						$(this).siblings(":not(.layergroup)").each(function () {
							var checkInput = $(this).children('input')
							if(checkInput.length > 0){
								if ($(this).children('input').prop('checked') == true) {
									trueExist = true
								}
							}
							else{
								$(this).children(":not(.layergroup)").each(function () {
									if ($(this).find('input').prop('checked') == true) {
										trueExist = true
									}
								})
							}
						})
					})

					var check3 = check2.parent().prev('li.layergroup')
					if(check3.length > 0){
						if(trueExist == true){
							check3.children('input').prop("indeterminate", true);
						}
						else{
							check3.children('input').prop("indeterminate", false);
							check3.children('input').prop("checked", false);
						}
					}
				}
			})
		}
	})
}

function groupOnCheck(ele) {
	var targetId = $(ele).attr('data');
	if ($(ele).prop('checked') == true) {
		var i = 0;
		while (i < tilesetlist.length) {
			if(targetId == tilesetlist[i].secondGroupID){
				if (tilesetlist[i].tileset == undefined && (tilesetlist[i].type == "shp" || tilesetlist[i].type == "aerial")) {
					tilesetlist[i].tileset = LoadWMSTile(tilesetlist[i].ownerLayerID, tilesetlist[i].url, tilesetlist[i].style)
				}

				$("#dataChk_" + tilesetlist[i].id).prop('checked', true)
			}
			
			if(targetId == tilesetlist[i].firstGroupID){
				if (tilesetlist[i].tileset == undefined && (tilesetlist[i].type == "shp" || tilesetlist[i].type == "aerial")) {
					tilesetlist[i].tileset = LoadWMSTile(tilesetlist[i].ownerLayerID, tilesetlist[i].url, tilesetlist[i].style)
				}

				$("#dataChk_" + tilesetlist[i].id).prop('checked', true)
			}
			
			if (targetId == tilesetlist[i].groupID) {
				//load only after it is checked for the first time
				if (tilesetlist[i].tileset == undefined && tilesetlist[i].type == "tileset") {
					var longlat = 0;
					tilesetlist[i].tileset = LoadB3DMTileset(tilesetlist[i].url, tilesetlist[i].offset, true, longlat)
				}
				else if (tilesetlist[i].tileset == undefined && tilesetlist[i].type == "kml") {
					tilesetlist[i].tileset = LoadKMLData(tilesetlist[i].url)
				}
				else if (tilesetlist[i].tileset == undefined && (tilesetlist[i].type == "shp" || tilesetlist[i].type == "aerial")) {
					tilesetlist[i].tileset = LoadWMSTile(tilesetlist[i].ownerLayerID, tilesetlist[i].url, tilesetlist[i].style)
				}
				else if (tilesetlist[i].type == "kml"){
					if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
						tilesetlist[i].tileset.then((value) => {
							value.show = true;
						});
					}
				}
				else {	// .tileset is defined and .type is tileset
					tilesetlist[i].tileset.show = true;
				}

				$("#dataChk_" + tilesetlist[i].id).prop('checked', true)
			};
			i++;
		};

		generalCheckBox(ele);

	} else {
		var i = 0;
		while (i < tilesetlist.length) {
			if(targetId == tilesetlist[i].secondGroupID){
				if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
					tilesetlist[i].tileset.then((value) => {
						viewer.imageryLayers.remove(value)
					})
				} else {
					viewer.imageryLayers.remove(tilesetlist[i].tileset)
				}
				tilesetlist[i].tileset = null;

				$("#dataChk_" + tilesetlist[i].id).prop('checked', false)
			}
			
			if(targetId == tilesetlist[i].firstGroupID){
				if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
					tilesetlist[i].tileset.then((value) => {
						viewer.imageryLayers.remove(value)
					})
				} else {
					viewer.imageryLayers.remove(tilesetlist[i].tileset)
				}
				tilesetlist[i].tileset = null;
				
				$("#dataChk_" + tilesetlist[i].id).prop('checked', false)
			}

			if (targetId == tilesetlist[i].groupID) {
				if (tilesetlist[i].type == "shp" || tilesetlist[i].type == "aerial") {
					if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
						tilesetlist[i].tileset.then((value) => {
							viewer.imageryLayers.remove(value)
						})
					} else {
						viewer.imageryLayers.remove(tilesetlist[i].tileset)
					}
					tilesetlist[i].tileset = null;
				}
				else if (tilesetlist[i].type == "kml"){
					if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
						tilesetlist[i].tileset.then((value) => {
							value.show = false;
							
						})
					};
				}
				else {
					tilesetlist[i].tileset.show = false;
				}
				$("#dataChk_" + tilesetlist[i].id).prop('checked', false)
			};
			i++;
		};

		generalUnCheckBox(ele);
	}
}

function layerOnCheck(ele) {
	var targetId = $(ele).attr('id');
	var mycheck = document.getElementById(targetId);
	if (mycheck.checked) {
		var i = 0;
		while (i < tilesetlist.length) {
			if (targetId == "dataChk_" + tilesetlist[i].id) {
				//load only after it is checked for the first time
				if (tilesetlist[i].tileset == undefined) {
					if (tilesetlist[i].type == "tileset") {
						var longlat = 0;
						if (tilesetlist[i].name == "OCC Building") {
							longlat = 1;
						} else if (tilesetlist[i].name == "CP101 Mash Model") { //DOTr_BIM_IFC_Mesh2a.i
							longlat = 2;
						}
						tilesetlist[i].tileset = LoadB3DMTileset(tilesetlist[i].url, tilesetlist[i].offset, true, longlat)
					} else if (tilesetlist[i].type == "kml") {
						tilesetlist[i].tileset = LoadKMLData(tilesetlist[i].url)
						
						landThematic.push({
							id: tilesetlist[i].id,
							name: tilesetlist[i].name,
						});
					} else if(tilesetlist[i].type == "shp" || tilesetlist[i].type == "aerial"){
						tilesetlist[i].tileset = LoadWMSTile(tilesetlist[i].ownerLayerID, tilesetlist[i].url, tilesetlist[i].style)
					}

				} else if (tilesetlist[i].type == "kml") {
					if (landThematic.length > 0){
						for(let k = 0; k < landThematic.length; k++) {
							if(!(landThematic[k].id === tilesetlist[i].id)) {
								landThematic.push({
									id: tilesetlist[i].id,
									name: tilesetlist[i].name,
								});
							}
						}
					}
					else{
						landThematic.push({
							id: tilesetlist[i].id,
							name: tilesetlist[i].name,
						});
					}
					if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
						tilesetlist[i].tileset.then((value) => {
							value.show = true;
						});
					}
				} else { // .tileset is defined and .type is tileset
					tilesetlist[i].tileset.show = true;
				}

				//check for other siblings
				if (tilesetlist[i].groupID !== null) {
					if (tilesetlist[i].firstGroupID !== null) {
						if (tilesetlist[i].secondGroupID !== null) {
							var trueExistSecond = true;
							var trueExistFirst = true;
							var trueExist = true;

							//TO CHECK THE SECOND LAYER GROUP
							$(ele.parentNode).siblings().each(function () {
								if ($(this).children('input').prop('checked') == false) {
									trueExistSecond = false
								}
							})

							//TO CHECK THE FIRST LAYER GROUP
							$(ele.parentNode).parent().siblings(":not(.layergroup)").each(function () {
								$(this).children(":not(.layergroup)").each(function () {
									if ($(this).children('input').prop('checked') == false) {
										trueExistFirst = false
									}
								})
							})

							//TO CHECK FOR MAIN LAYER GROUP
							$(ele.parentNode).parent().parent().siblings(":not(.layergroup)").each(function () {
								var checkInput = $(this).children('input')
								if(checkInput.length > 0){
									if ($(this).children('input').prop('checked') == false) {
										trueExist = false
									}
								}
								else{
									$(this).children(":not(.layergroup)").each(function () {
										if ($(this).children('li').find('input').prop('checked') == false) {
											trueExist = false
										}
									})
								}
							})

							if (trueExistSecond == false) {
								$("#checkSubGroup_" + tilesetlist[i].secondGroupID).prop("indeterminate", true);
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", true);
								$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
							}
							else {
								$("#checkSubGroup_" + tilesetlist[i].secondGroupID).prop("indeterminate", false);
								$("#checkSubGroup_" + tilesetlist[i].secondGroupID).prop("checked", true);

								if (trueExistFirst == false) {
									$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", true);
									$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
								}
								else{
									$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", false);
									$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("checked", true);

									if (trueExist == false) {
										$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
									}
									else{
										$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", false);
										$("#checkGroup_" + tilesetlist[i].groupID).prop("checked", true);

									}

								}

							}
						}
						else{
							var trueExistFirst = true;
							var trueExist = true;

							//TO CHECK IF THERE IS SECOND LAYER GROUP
							$(ele.parentNode).siblings(":not(.layergroup)").each(function () {
								if ($(this).children().children('input').prop('checked') == false) {
									trueExistFirst = false
								}
							})

							//TO CHECK IF THERE IS ANY OTHER FIRST LAYER GROUP OR NOT
							//TO CHECK FOR MAIN GROUP, THE LAYER IS CHECKED OR NOT
							$(ele.parentNode).parent().siblings(":not(.layergroup)").each(function () {
								if ($(this).children('input').prop('checked') == false) {
									trueExist = false
								}
							})

							if (trueExistFirst == false) {
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", true);
								$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
							}
							else {
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", false);
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("checked", true);

								if(trueExist == false){
									$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
								}
								else{
									$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", false);
									$("#checkGroup_" + tilesetlist[i].groupID).prop("checked", true);
								}

							}
						}
					}
					else{
						var trueExist = true;
						$(ele.parentNode).siblings(":not(.layergroup)").each(function () {
							$(this).children(":not(.layergroup)").each(function () {
								$(this).children(":not(.layergroup)").each(function () {
									if ($(this).children('input').prop('checked') == false) {
										trueExist = false
									}
								})
							})
						})

						if (trueExist == false) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
							$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
						}
						else {	// no false
							$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", false);
							$("#checkGroup_" + tilesetlist[i].groupID).prop("checked", true);
						}
					}
				}
				break;
			}
			i++;
		};
	} else {
		var i = 0;
		while (i < tilesetlist.length) {
			if (targetId == "dataChk_" + tilesetlist[i].id) {
				switch (tilesetlist[i].type) {
					case "kml":
						if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
							tilesetlist[i].tileset.then((value) => {
								value.show = false;
							})

							if (landThematic){
								for(let k = 0; k < landThematic.length; k++) {
									if(landThematic[k].id === tilesetlist[i].id) {
										landThematic.splice(k, 1);
									}
								}
							}
						} else {
							tilesetlist[i].tileset.show = false;
						}
						break;
					case "tileset":
						tilesetlist[i].tileset.show = false;
						for (var j = 0; j < myModels.length; j++) {
							if (tilesetlist[i].layerID == myModels[j].layer_id) {

								$("#" + myModels[j].EntityID).prop('checked', false);
							}
						}
						break;
					case "shp":
						if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
							tilesetlist[i].tileset.then((value) => {
								viewer.imageryLayers.remove(value)
							})
						} else {
							viewer.imageryLayers.remove(tilesetlist[i].tileset)
						}
						tilesetlist[i].tileset = null;
						break;
					case "aerial":
						if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
							tilesetlist[i].tileset.then((value) => {
								viewer.imageryLayers.remove(value)
							})
						} else {
							viewer.imageryLayers.remove(tilesetlist[i].tileset)
						}
						tilesetlist[i].tileset = null;
						break;
				}
				if (tilesetlist[i].groupID !== null) {
					if (tilesetlist[i].firstGroupID !== null) {
						if (tilesetlist[i].secondGroupID !== null) {
							var trueExistSecond = false;
							var trueExistFirst = false;
							var trueExist = false;

							//TO CHECK THE SECOND LAYER GROUP
							$(ele.parentNode).siblings().each(function () {
								if ($(this).children('input').prop('checked') == true) {
									trueExistSecond = true
								}
							})

							//TO CHECK THE FIRST LAYER GROUP
							$(ele.parentNode).parent().siblings(":not(.layergroup)").each(function () {
								$(this).children(":not(.layergroup)").each(function () {
									if ($(this).children('input').prop('checked') == true) {
										trueExistFirst = true
									}
								})
							})

							//TO CHECK FOR MAIN LAYER GROUP
							$(ele.parentNode).parent().parent().siblings(":not(.layergroup)").each(function () {
								var checkInput = $(this).children('input')
								if(checkInput.length > 0){
									if ($(this).children('input').prop('checked') == true) {
										trueExist = true
									}
								}
								else{
									$(this).children(":not(.layergroup)").each(function () {
										if ($(this).children('li').find('input').prop('checked') == true) {
											trueExist = true
										}
									})
								}
							})

							if (trueExistSecond == true) {
								$("#checkSubGroup_" + tilesetlist[i].secondGroupID).prop("indeterminate", true);
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", true);
								$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
							}
							else {
								$("#checkSubGroup_" + tilesetlist[i].secondGroupID).prop("indeterminate", false);
								$("#checkSubGroup_" + tilesetlist[i].secondGroupID).prop("checked", false);

								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", true);
								$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);

								if (trueExistFirst == true) {
									$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", true);
									$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
								}
								else{
									$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", false);
									$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("checked", false);

									if (trueExist == true) {
										$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
									}
									else{
										$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", false);
										$("#checkGroup_" + tilesetlist[i].groupID).prop("checked", false);
									}

								}

							}
						}
						else{
							var trueExistFirst = false;
							var trueExist = false;

							//TO CHECK IF THERE IS SECOND LAYER GROUP AND IS IT CHECK OR NOT
							$(ele.parentNode).siblings(":not(.layergroup)").each(function () {
								if ($(this).children().children('input').prop('checked') == true) {
									trueExistFirst = true
								}
							})
							
							//TO CHECK IF THERE IS ANY OTHER FIRST LAYER GROUP OR NOT
							//TO CHECK FOR MAIN GROUP, THE LAYER IS CHECKED OR NOT
							$(ele.parentNode).parent().siblings(":not(.layergroup)").each(function () {
								if ($(this).children('input').prop('checked') == true) {
									trueExist = true
								}
							})

							if (trueExistFirst == true) {
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", true);
								$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
							}
							else {	// no false
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("indeterminate", false);
								$("#checkGroup_" + tilesetlist[i].firstGroupID).prop("checked", false);

								if(trueExist == true){
									$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
								}
								else{
									$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", false);
									$("#checkGroup_" + tilesetlist[i].groupID).prop("checked", false);
								}

							}
						}
					}
					else{
						var trueExist = false;
						$(ele.parentNode).parent().each(function () {
							$(this).children().each(function (idx, ele) {
								if ($(ele).children('input').prop('checked') == true) {
									trueExist = true
								}
							})

						})

						if (trueExist == true) {
							$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", true);
						}
						else {
							$("#checkGroup_" + tilesetlist[i].groupID).prop("indeterminate", false);
							$("#checkGroup_" + tilesetlist[i].groupID).prop("checked", false);
						}
					}
				}

				break;
			}
			i++;
		};
	}
}

function showMetadataInfo(metaid, layername){
	var msgHTML = "";
	$.ajax({
		type: "POST",
		dataType: "JSON",
		url: "BackEnd/DataFunctions.php",
		data: { 
			functionName: "fetchMetadata" ,
			metaid: metaid
		},
		beforeSend: function(){
			$("body").css('cursor', 'progress');
		},
		complete: function(){
			$("body").css('cursor', 'default');
		},
		success: function (res) {
			if (res.bool) {
				var metaInfo = res.data
				msgHTML += "<div class='meta-title'>"+metaInfo.md_mission_id+"</div>";
				msgHTML += "<hr>";
				msgHTML += "<table>";
				msgHTML += "<tr><th>Survey Date </th><td>"+metaInfo.md_date_created+"</td></tr>";
				msgHTML += "<tr><th>Survey Start Time </th><td>"+metaInfo.md_start_time+"</td></tr>";
				msgHTML += "<tr><th>Survey End Time </th><td>"+metaInfo.md_end_time+"</td></tr>";
				msgHTML += "</table>";
			}else{
				msgHTML += res.msg;
			}
			$.alert({
				boxWidth: '40%',
				useBootstrap: false,
				title: layername,
				content: msgHTML
			});
		}
	})

}
function flyToLayer(ele) {
	floatboxTurnOFF()
	$("#floatboxEditButton").css('display', 'block')
	var name = ele.parentNode.firstChild.id

	if (ele.parentNode.firstChild.checked == false) {
		return
	}
	var i = 0;
	while (i < tilesetlist.length) {
		if ("dataChk_" + tilesetlist[i].id == name) {
			if (localStorage.p_name == "Gandaria Mall") {
				viewer.camera.flyTo({
					destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
					orientation: {
						roll: (100 * (Math.PI / 180))
					}
				})
			}
			else if (tilesetlist[i].type == "shp" || tilesetlist[i].type == "aerial") {
				wmsFlyTo(tilesetlist[i].ownerLayerID, tilesetlist[i].url)
			}
			else {
				viewer.flyTo(tilesetlist[i].tileset);
			}
			flagAnnotateData = true;
			break;
		}
		i++;
	};
}

function flyToVideoPin(ele) {

	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);
	$("#videoframe.active").removeClass('active');
	VideoFrame(false)
	var videoContainer = document.getElementById("videoContainer");
	var myVideo = $(videoContainer).find("video")[0]
	if (myVideo !== undefined) {
		myVideo.pause()
	}
	var i = 0;
	while (i < videoPinData.length) {
		if (videoPinData[i].videoPinID == id) {
			viewer.flyTo(videoPinsArray[i]);
			break;
		}
		i++;
	};
}

function playVideoPin(ele) {
	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);
	var j = 0;
	while (j < videoPinData.length) {
		if (id == videoPinData[j].videoPinID) {
			var urlVideo = "../" + videoPinData[j].videoURL;
			var videoContainer = document.getElementById("videoContainer");
			//compare #videoframe active or inactive 
			if (!$('#videoframe').hasClass('active')) {
				if (videoPinData[j].videoType == 0) {
					$(videoContainer).html(
					`<video style='height:100%; width: 100%; object-fit: cover; z-index: -100;' controls>\
						<source id='source'  src='${encodeURI(urlVideo)}' type ='video/mp4'>\
					</video>`);
					$(videoContainer).attr("dataType", "0")
					var myVideo = $(videoContainer).find("video")[0]
					myVideo.load();
					myVideo.play();
				} else {
					$(videoContainer).attr("dataType", "1")
					$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
				}

				$("#videoframe").addClass('active');
				VideoFrame(true)
			} else {
				if ($(videoContainer).attr("dataType") == videoPinData[j].videoType) { //check if video format is same
					if (videoPinData[j].videoType == 0) {
						var videoSource = $(videoContainer).find("source")[0]
						var videoSrcArry = videoSource.src.toString().split("/");
						var videoSrc = videoSrcArry[videoSrcArry.length - 4] + "/" + videoSrcArry[videoSrcArry.length - 3] + "/" + videoSrcArry[videoSrcArry.length - 2] + "/" + videoSrcArry[videoSrcArry.length - 1]
						//if user intend to change video
						if (videoSrc !== urlVideo) {
							videoSource.src = urlVideo
							var myVideo = $(videoContainer).find("video")[0]
							VideoFrame(true)
							myVideo.load();
							myVideo.play();
						} else { //pause video and close frame
							$("#videoframe.active").removeClass('active');
							VideoFrame(false)
							var myVideo = $(videoContainer).find("video")[0]
							if (myVideo !== undefined) {
								myVideo.pause()
							}
						}
					} else {
						$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
						VideoFrame(true)
					}

				} else { //video format not same

					if ($(videoContainer).attr("dataType") == 0) { // if loaded is mp4 && user intend to change video

						$(videoContainer).attr("dataType", "1")
						$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
						VideoFrame(true)
					} else { //if loaded is embedded
						$(videoContainer).html(`<video style='height:100%; width: 100%; object-fit: cover; z-index: -100;' controls>\
							<source id='source'  src='${encodeURI(urlVideo)}' type ='video/mp4'>\
						</video>`);

						$(videoContainer).attr("dataType", 0)
						var myVideo = $(videoContainer).find("video")[0]
						myVideo.load();
						myVideo.play();
						VideoFrame(true)
					}
				}
			}

			break;
		};
		j++;
	}
}

function editVideoPinDetails(ele) {
	uploadType = "VIDEO";
	$('#embedLinkInput').val("")
	$(".video-statuscontainer").css('display', 'none')
	videoR.cancel();
	$("#videoFileName").text("")
	$("#videoStatus").text("")
	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);
	var j = 0;
	while (j < videoPinData.length) {
		if (id == videoPinData[j].videoPinID) {
			var urlVideo = "../" + videoPinData[j].videoURL;
			if (videoPinData[j].videoType == 1) {
				$(".localVideo").hide()
				$(".embedVideo").show()
				$("#embedLinkInput").val(videoPinData[j].videoURL)
				$("#EmbedLink").prop('checked', 'checked')
				$("#localVideo").removeAttr('checked')
			} else {
				$(".localVideo").show()
				$(".embedVideo").hide()
				let res = (urlVideo).split("/");
				let filename = res[res.length - 1];
				$('#videoFileName').html(filename)
				$("#localVideo").prop('checked', 'checked')
				$("#EmbedLink").removeAttr('checked')
			}
			videoPinEdit = true;
			videoPinIndex = j;
			$('#camName').val(videoPinData[j].videoPinName);
			$('#camHeight').val(videoPinData[j].height);
			$('#camLong').val(videoPinData[j].longitude);
			$('#camLat').val(videoPinData[j].latitude);
			jqwidgetBox("cameraheight", 1);
			viewer.flyTo(videoPinsArray[j]);
			break;
		}
		j++;
	}
}

function deleteVideoPin(ele) {
	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);
	var j = 0;
	var myindex;
	var pinname;
	while (j < videoPinData.length) {
		if (id == videoPinData[j].videoPinID) {
			myindex = j;
			pinname = videoPinData[j].videoPinName;
			break;
		}
		j++;
	};
	if (pinname) {
		$.confirm({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Confirm!',
			content: 'Are you sure you want to delete the VideoPin:' + pinname + '?',
			buttons: {
				confirm: function () {
					var id = videoPinData[myindex].videoPinID;
					$.ajax({
						type: "POST",
						url: 'BackEnd/DataFunctions.php',
						dataType: 'json',
						data: { id: id, functionName: 'deleteVideoCam' },
						success: function (obj, textstatus) {
							videoPinData.splice(myindex, 1);
							var billboard = videoPinsArray[myindex];
							viewer.entities.removeById(billboard._id);
							videoPinsArray.splice(myindex, 1);
							ele.parentNode.remove();
						},
						error: function (xhr, textStatus, errorThrown) {
							var str = textStatus + " " + errorThrown;
							console.log(str);
						}
					})
				},
				cancel: function () {
					return
				}
			}
		});
	}
}

function OnChangeAnnotateModel(ele) {
	if ($(ele).is(":checked")) {
		var id = $(ele).attr("id");
		var i = 0;
		console.log(id);
		while (i < myModels.length) {
			if (id == myModels[i].EntityID) {
				var primitive = modelsArray[i];
				var attributes = primitive.getGeometryInstanceAttributes(myModels[i].EntityID);
				attributes.show = Cesium.ShowGeometryInstanceAttribute.toValue(true, attributes.show);
				break;
			}
			i++;
		}

	} else {
		var id = $(ele).attr("id");
		var i = 0;
		console.log(id);
		while (i < myModels.length) {
			if (id == myModels[i].EntityID) {

				var primitive = modelsArray[i];
				var attributes = primitive.getGeometryInstanceAttributes(myModels[i].EntityID);
				attributes.show = Cesium.ShowGeometryInstanceAttribute.toValue(false, attributes.show);
				break;
			}
			i++;
		}
	}

}

//currently not in use
function kmlOrdering(eleID, start, end) {
	var layer = tilesetlist.find((item) => eleID == 'dataID_' + item.id);
	if (start < end) {
		let freq = end - start
		for (let i = 0; i < freq; i++) {
			viewer.dataSources.lower(layer.tileset);
		}
	} else if (end < start) {
		let freq = start - end
		for (let i = 0; i < freq; i++) {
			viewer.dataSources.raise(layer.tileset);
		}
	} else { //start = end
		return
	}
}

function getFlagForKeyCode(keyCode) {
	switch (keyCode) {
		case 'W'.charCodeAt(0):
			return 'moveForward';
		case 'S'.charCodeAt(0):
			return 'moveBackward';
		case 'Q'.charCodeAt(0):
			return 'moveUp';
		case 'E'.charCodeAt(0):
			return 'moveDown';
		case 'D'.charCodeAt(0):
			return 'moveRight';
		case 'A'.charCodeAt(0):
			return 'moveLeft';
		default:
			return undefined;
	}
}

function toggleBaseLayer() {

	if (baseMapLayer && Object.prototype.toString.call(baseMapLayer) === "[object Promise]") {
		baseMapLayer.then((value) => {
			viewer.imageryLayers.remove(value)
		})
	} else {
		viewer.imageryLayers.remove(baseMapLayer)
	}
	switch (baseMap) {
		case 0:
			baseMap = 1
			baseMapLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.BingMapsImageryProvider({
					url: 'https://dev.virtualearth.net',
					mapStyle: Cesium.BingMapsStyle.ROAD
				}), 1
			)
			break;
		case 1:
			baseMap = 2
			baseMapLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.BingMapsImageryProvider({
					url: 'https://dev.virtualearth.net',
					mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
				}), 1
			)
			break;
		case 2: //Bing Maps Road
			baseMap = 0
			baseMapLayer = viewer.imageryLayers.addImageryProvider(
				new Cesium.BingMapsImageryProvider({
					url: 'https://dev.virtualearth.net',
					mapStyle: Cesium.BingMapsStyle.AERIAL
				}), 1
			);
			break;
	}
}

function tilesetToViewModel(tileset) {
	viewModelTileset = tileset;
	viewModel.maximumScreenSpaceError = tileset.maximumScreenSpaceError;
}

function checkZero(newValue) {
	var newValueFloat = parseFloat(newValue);
	return (newValueFloat === 0.0) ? undefined : newValueFloat;
}

function updateViewModel() {
	if (imageryLayers.length > 0) {
		var layer = imageryLayers.get(0);
		viewModel.brightness = layer.brightness;
		viewModel.contrast = layer.contrast;
		viewModel.hue = layer.hue;
		viewModel.saturation = layer.saturation;
		viewModel.gamma = layer.gamma;
	}
}

function ControlMouseDown(button_id) {
	switch (button_id) {
		case 'moveForward':
			flagName = 'moveForward'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = true;
			}
			break;
		case 'moveBackward':
			flagName = 'moveBackward'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = true;
			}
			break;
		case 'moveUp':
			flagName = 'moveUp'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = true;
			}
			break;
		case 'moveDown':
			flagName = 'moveDown'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = true;
			}
			break;
		case 'moveRight':
			flagName = 'moveRight'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = true;
			}
			break;
		case 'moveLeft':
			flagName = 'moveLeft'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = true;
			}
			break;
		default:
			return undefined;
	}
}

async function LoadKMLData(URL) {
	var mykml = new Cesium.KmlDataSource();
	await mykml.load(URL, {
		//clampToGround: true
	}).then( function (dataSource){
			var entities = dataSource.entities.values;
			for (let entity of entities) {
				entity.filePathOriginal = URL;
			}

			console.log("loaded")
		}
	);
	viewer.dataSources.add(mykml);
	//temp for demo purpose
	if (URL == "../Data/KML/PIPE.kml") {
		thematicProps.pipeEntities = mykml.entities.values;
	}
	else if (URL == "../Data/KML/Building.kml") {
		thematicProps.cpEntities = mykml.entities.values;
	}
	else if (URL.includes("PLC_Building")) {
		thematicProps.plcEntities = mykml.entities.values;
	}
	
	thematicProps.landEntities = mykml.entities.values;

	
	return mykml
}




function ChangeWMSTile(layer, lotID){
	if (highlightLotParcel) {
        viewer.imageryLayers.remove(highlightLotParcel);
        highlightLotParcel = null;
		return;
    } else {
		if (lotID){
			highlightLotParcel = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
				url : wmsURL+"/wms",
				layers : localStorage.p_id_name+":"+layer,
				parameters: {
					FEATUREID: lotID,
					transparent: true,
					STYLES: "Highlight",
					format: "image/png",
				},
			}));
		}
    }
	return;
}

async function LoadWMSTile(ownerLayer, layer, style){
	var parameters = {}
	var ownerProjectId = (ownerLayer) ? ownerLayer : localStorage.p_id_name;
	if(!style || style ==="null"){
		parameters= {
			transparent: true,
			format: "image/png",
		}
	}else{
		parameters= {
			transparent: true,
			format: "image/png",
			STYLES: style
		}
	}
	let wms = new Cesium.WebMapServiceImageryProvider({
		url : wmsURL+"/wms",
		layers : ownerProjectId+":"+layer,
		parameters : parameters
	});

	return viewer.imageryLayers.addImageryProvider(wms);
}


function getECWList() {
	$('#aicLayerGroup').html('');
	arrAerialEdit = [];
	$.ajax({
		url: "BackEnd/aicRequests.php",
		data: { runFunction: "getECWList" },
		type: "POST",
		dataType: "JSON",
		success: (resp) => {
			if (resp.bool === true) {
				if (resp.data.length >= 1) {
					//add here
					var listDiv = document.getElementById('aicLayerGroup')
					var htmlBody = "";
					var groupListType;
					var groupListName = "";
					var groupLi;
					var groupUl;
					var nameUse = "";
					var groupLi1;
					var groupUl1;
					var groupSubLi1;
					var groupSubUl1;

					resp.data.forEach((aic) => {
						var firstidToUse = null;
						var secondidToUse = null;
						
						if (groupListType != aic.Routine_Type) {
							groupListType = aic.Routine_Type
							switch (aic.Routine_Type) {
								case "0":
									groupListName = "Weekly"
									break;
								case "1":
									groupListName = "Monthly"
									break;
								case "2":
									groupListName = "Quarterly"
									break;
							}

							groupLi = document.createElement("li")
							groupLi.setAttribute("class", "layergroup");
							groupLi.setAttribute("id", "aerial_Li_"+groupListName);
							groupLi.setAttribute("rel", `aerial_Ul_${groupListName}`);

							var groupCheck = document.createElement('input');
							groupCheck.setAttribute("type", "checkbox") 
							groupCheck.setAttribute("id", `checkGroup_id_${groupListName}`)
							groupCheck.setAttribute("onClick", "groupOnCheck(this)");
							groupCheck.setAttribute("data", "id_"+groupListName);							

							var groupLabel = document.createElement('label'); // CREATE LABEL.
							groupLabel.setAttribute('for', 'aerial_Li_' + groupListName);
							groupLabel.appendChild(document.createTextNode(groupListName));

							var groupDiv = document.createElement('div');
							groupDiv.setAttribute('class', 'clickContainer aerialEdit');
							groupDiv.setAttribute('onclick', 'togglelist(this)');

							groupDiv.appendChild(groupLabel);
							groupLi.appendChild(groupCheck);
							groupLi.appendChild(groupDiv);

							if(localStorage.signed_in_email == 'dionnald.manager@gmail.com' || localStorage.signed_in_email == 'pbh.support@reveronconsulting.com'){
								var groupEdit = document.createElement('img')
								groupEdit.setAttribute("id", `editGroup_id_${groupListName}`)
								groupEdit.setAttribute("onClick", `OnClickAerialEditButton(this)`);
								groupEdit.setAttribute("name", `${groupListName}`);
								groupEdit.setAttribute("src", 'Images/icons/imagefeed_window/edit.png')
								groupEdit.setAttribute("class", 'edit')

								groupLi.appendChild(groupEdit);
							}

							groupUl = document.createElement('ul');
							groupUl.setAttribute("id", "aerial_Ul_" + groupListName);

							listDiv.appendChild(groupLi)
							listDiv.appendChild(groupUl)
							
						}

						nameUse = (aic.Use_Name) ? new Date(aic.Image_Captured_Date).toDateString() + " (" + aic.Use_Name + ")": new Date(aic.Image_Captured_Date).toDateString();
							
						if(!aic.Image_Group || aic.Image_Group == ""){
							//append in layer divs
							htmlBody = ""
							htmlBody += `<li id="ecwID_${aic.AIC_Id}">`
							htmlBody += `<input type="checkbox" id="dataChk_ecw_${aic.AIC_Id}" onclick="layerOnCheck(this)" name="checkbox">`
							htmlBody += `<img height="20" width="20" class="fileicon" src="Images/icons/layer_window/ecw.png" title="ECW">`
							htmlBody += `<label>${nameUse}</label>`
							htmlBody += `<img height="20" width="20" src="Images/icons/layer_window/binoculars.png" onclick="flyToLayer(this)" class="flyto">`
							htmlBody += `</li>`
							$("#aerial_Ul_" + groupListName).prepend(htmlBody);
						}else{
							// buat group punya node
							var groupNameLabel = aic.groupName;
							var groupName = aic.groupName.replace(/ /g,'');

							if($("#"+"aerial_Group_Li_"+groupListName + "_Li_" +groupName).length == 0){
								//FOR LEVEL 1 GROUP
								groupLi1 = document.createElement("li")
								groupLi1.setAttribute("class", "layergroup");
								groupLi1.setAttribute("id", "aerial_Group_Li_"+groupListName + "_Li_" +groupName);
								groupLi1.setAttribute("rel", `aerial_Group_Ul_${groupListName}_Li_${groupName}`);

								var groupCheck1 = document.createElement('input');
								groupCheck1.setAttribute("type", "checkbox") 
								groupCheck1.setAttribute("id", `checkGroup_id_${groupListName}_${groupName}`)
								groupCheck1.setAttribute("onClick", "groupOnCheck(this)");
								groupCheck1.setAttribute("data", "id_" + groupListName + "_" + groupName);							

								var groupLabel1 = document.createElement('label'); // CREATE LABEL.
								groupLabel1.setAttribute('for', "aerial_Group_Li_"+groupListName + "_Li_" +groupName);
								groupLabel1.appendChild(document.createTextNode(groupNameLabel));

								var groupDiv1 = document.createElement('div');
								groupDiv1.setAttribute('class', 'clickContainer aerialEdit');
								groupDiv1.setAttribute('onclick', 'togglelist(this)');

								groupDiv1.appendChild(groupLabel1);
								groupLi1.appendChild(groupCheck1);
								groupLi1.appendChild(groupDiv1);

								groupUl1 = document.createElement('ul');
								groupUl1.setAttribute("id", "aerial_Group_Ul_" +groupListName + "_Li_" +groupName);

								$("#aerial_Ul_" + groupListName).append(groupLi1)
								$("#aerial_Ul_" + groupListName).append(groupUl1)
							}

							if(aic.subGroupName){
								var subGroupLabel = aic.subGroupName;
								var subGroupName = aic.subGroupName.replace(/ /g,'');

								if($("#"+"aerial_SubGroup_Li_" +groupListName + "_Li_" +groupName + "_Li_" +subGroupName).length == 0){
									//IF HAVE LEVEL 2
									//create level 2 directly
									groupSubLi1 = document.createElement("li")
									groupSubLi1.setAttribute("class", "layergroup");
									groupSubLi1.setAttribute("id", "aerial_SubGroup_Li_" +groupListName + "_Li_" +groupName + "_Li_" +subGroupName);
									groupSubLi1.setAttribute("rel", `aerial_SubGroup_Ul_${groupListName}_Li_${groupName}_Li_${subGroupName}`);

									var groupCheck1 = document.createElement('input');
									groupCheck1.setAttribute("type", "checkbox") 
									groupCheck1.setAttribute("id", `checkSubGroup_id_${groupListName}_${groupName}_${subGroupName}`)
									groupCheck1.setAttribute("onClick", "groupOnCheck(this)");
									groupCheck1.setAttribute("data", "id_" +groupListName + "_" + groupName + "_" + subGroupName);							

									var groupLabel1 = document.createElement('label'); // CREATE LABEL.
									groupLabel1.setAttribute('for', "aerial_SubGroup_Li_" +groupListName + "_Li_" +groupName + "_Li_" +subGroupName);
									groupLabel1.appendChild(document.createTextNode(subGroupLabel));

									var groupDiv1 = document.createElement('div');
									groupDiv1.setAttribute('class', 'clickContainer aerialEdit');
									groupDiv1.setAttribute('onclick', 'togglelist(this)');

									groupDiv1.appendChild(groupLabel1);
									groupSubLi1.appendChild(groupCheck1);
									groupSubLi1.appendChild(groupDiv1);

									groupSubUl1 = document.createElement('ul');
									groupSubUl1.setAttribute("id", "aerial_SubGroup_Ul_" +groupListName + "_Li_" +groupName + "_Li_" +subGroupName);

									$("#aerial_Group_Ul_" +groupListName + "_Li_" +groupName).append(groupSubLi1)
									$("#aerial_Group_Ul_" +groupListName + "_Li_" +groupName).append(groupSubUl1)
									
								}
							}

							//GENERAL
							htmlBody = ""
							htmlBody += `<li id="ecwID_${aic.AIC_Id}">`
							htmlBody += `<input type="checkbox" id="dataChk_ecw_${aic.AIC_Id}" onclick="layerOnCheck(this)" name="checkbox">`
							htmlBody += `<img height="20" width="20" class="fileicon" src="Images/icons/layer_window/ecw.png" title="ECW">`
							htmlBody += `<label>${nameUse}</label>`
							htmlBody += `<img height="20" width="20" src="Images/icons/layer_window/binoculars.png" onclick="flyToLayer(this)" class="flyto">`
							htmlBody += `</li>`

							if (aic.groupName && aic.subGroupName){
								$("#aerial_SubGroup_Ul_" +groupListName + "_Li_" +groupName + "_Li_" +subGroupName).prepend(htmlBody)

								firstidToUse = "id_" + groupListName + "_" + groupName;
								secondidToUse = "id_" + groupListName + "_" + groupName + "_" + subGroupName;

							}else if (aic.groupName) {
								$("#aerial_Group_Ul_" +groupListName + "_Li_" +groupName).prepend(htmlBody)	

								firstidToUse = "id_" + groupListName + "_" + groupName;
							}
							else{

							}

						}

						arrAerialEdit.push({
							id: aic.AIC_Id,
							groupType: groupListName,
							name: aic.Use_Name,
							fileName: aic.Image_URL,
							uploadDate: aic.Registered_Date,
							capturedDate: aic.Image_Captured_Date
						})

						tilesetlist.push({
							id: "ecw_" + aic.AIC_Id,
							name: aic.Image_Captured_Date,
							tileset: null,
							type: "aerial",
							defaultView: false,
							url: aic.Image_URL,
							groupID: "id_" + groupListName,
							firstGroupID: firstidToUse,
							secondGroupID: secondidToUse,
							ownerLayerID: aic.project_id
						});
					})

				} else {
					console.log("No AIC data")
				}
			} else {
				console.log(resp.msg)
			}
		}
	})
}

function wmsFlyTo(ownerLayer, wmsName) {
	var ownerProjectId = (ownerLayer) ? ownerLayer : localStorage.p_id_name;
	let layer = wmsCapabilities.Capability.Layer.Layer.find(
		(l) => l.Name === ownerProjectId + ":" + wmsName
	);
	let extent = layer.BoundingBox[0].extent
	var rect = Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]); // S.E.A. extent
	viewer.camera.flyTo({
		destination: rect
	});
}

//get WMS Properties for naming, projection, etc..
function getWMSCap() {
	var parser = new ol.format.WMSCapabilities();
	fetch(
		wmsURL + "/ows?service=wms&version=1.3.0&request=GetCapabilities"
	)
		.then(function (response) {
			return response.text();
		})
		.then(function (text) {
			wmsCapabilities = parser.read(text);
			console.log(wmsCapabilities)
		});
}

function LoadB3DMTileset(url, height, defaultview, longlat) {
	var mytileset;
	if (defaultview == true) {
		if (url.includes("FirstFloor") || url.includes("GF_Mech")) {
			mytileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
				url: url,
				dynamicScreenSpaceError: true,
				dynamicScreenSpaceErrorDensity: 0.00008,
				dynamicScreenSpaceErrorFactor: 64.0,
				dynamicScreenSpaceErrorHeightFalloff: 0.125,
				baseScreenSpaceError: 1024,
				progressiveResolutionHeightFraction: 0.5,
				maximumScreenSpaceError: 0,
				cullRequestsWhileMovingMultiplier: 200
			}));

		} else {
			mytileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
				url: url,
				dynamicScreenSpaceError: true,
				dynamicScreenSpaceErrorDensity: 0.00008,
				dynamicScreenSpaceErrorFactor: 64.0,
				dynamicScreenSpaceErrorHeightFalloff: 0.125,
				baseScreenSpaceError: 1024,
				progressiveResolutionHeightFraction: 0.5,
				maximumScreenSpaceError: 4,
				cullRequestsWhileMovingMultiplier: 200
			}));
		}

		if (longlat == 1) {
			mytileset.readyPromise.then(function () {
				var longitude = 121.02112508834009;
				var latitude = 14.696846470202738;
				var height = 15.5;
				var cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
				var transform = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(43), 0, 0));
				mytileset._root.transform = Cesium.Matrix4.IDENTITY;
				mytileset.modelMatrix = transform;
				//viewer.zoomTo(mytileset, new Cesium.HeadingPitchRange(0.0, -0.5, mytileset.boundingSphere.radius / 4.0));
			});

		} else if (longlat == 2) {
			mytileset.readyPromise.then(function () {
				var longitude = 121.02850327488727;
				var latitude = 14.67397369094447;
				var height = 0;
				var cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
				var transform = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, new Cesium.HeadingPitchRoll());
				mytileset._root.transform = Cesium.Matrix4.IDENTITY;
				mytileset.modelMatrix = transform;
				//viewer.zoomTo(mytileset, new Cesium.HeadingPitchRange(0.0, -0.5, mytileset.boundingSphere.radius / 4.0));
			});

		} else {
			mytileset.readyPromise.then(function (mytileset) {
				var heightOffset = height;
				var boundingSphere = mytileset.boundingSphere;
				var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
				var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
				var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
				var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
				mytileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
			});
		}


	};
	return (mytileset);
}

function LoadIONTileset(url, height, defaultview) {
	var mytileset;
	if (defaultview == false) {
		mytileset = viewer.scene.primitives.add(
			new Cesium.Cesium3DTileset({
				url: Cesium.IonResource.fromAssetId(url),
				show: false
			})
		);
		mytileset.readyPromise.then(function (mytileset) {
			var heightOffset = height;
			var boundingSphere = mytileset.boundingSphere;
			var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
			var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
			var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
			var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
			mytileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

		})
	} else {
		mytileset = viewer.scene.primitives.add(
			new Cesium.Cesium3DTileset({
				url: Cesium.IonResource.fromAssetId(url)
			})
		);
		mytileset.readyPromise.then(function (mytileset) {
			var heightOffset = height;
			var boundingSphere = mytileset.boundingSphere;
			var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
			var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
			var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
			var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
			mytileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

		})
	};
	return (mytileset);
}

function ControlMouseLeave(button_id) {
	switch (button_id) {
		case 'moveForward':
			flagName = 'moveForward'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = false;
			}
			break;
		case 'moveBackward':
			flagName = 'moveBackward'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = false;
			}
			break;
		case 'moveUp':
			flagName = 'moveUp'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = false;
			}
			break;
		case 'moveDown':
			flagName = 'moveDown'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = false;
			}
			break;
		case 'moveRight':
			flagName = 'moveRight'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = false;
			}
			break;
		case 'moveLeft':
			flagName = 'moveLeft'
			if (typeof flagName !== 'undefined') {
				flags[flagName] = false;
			}
			break;
		default:
			return undefined;
	}
}

// to load the asset data to the application
function LoadAnnotateData(callback) {
	var xhr = new XMLHttpRequest();
	let data = "project_id=" + localStorage.p_id;
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			callback(this.responseText);
		}
	});
	xhr.open("POST", "BackEnd/getAnnotateData.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	xhr.send(data);
}
// to load PW Asset data for Gandaria Mall demo
function loadPWAssetData() {
	var assetid = "";

	$("#assetData").find('tr').each(function () {

		assetid += "'" + ($(this).find('td').eq(1).text()) + "',";
	});
	var m = assetid.length;

	assetid = assetid.substr(0, (m - 1));
	$.ajax({
		type: "POST",
		url: 'BackEnd/getPWAssetData.php',
		dataType: 'json',
		data: {
			assetID: assetid
		},
		success: function (obj, textstatus) {
			console.log(obj);
			("#assetData").find('tr').each(function () {
				var id = $(this).find('td').eq(1).text();

			});



		},
		error: function (xhr, textStatus, errorThrown) {
			console.log(xhr);
			/* $.alert({
				 boxWidth: '30%',
				 useBootstrap: false,
				 title: 'Message',
				 content: 'Error in fetching the Projectwise folders!. Please click the browse again to fetch.'
			 });*/
		}
	});

}

function LoadLocationData(callback) {
	//used initially to load all the saved up data from the database
	var xhr = new XMLHttpRequest();
	let data = "project_id=" + localStorage.p_id;
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			callback(this.responseText);
		}
	});
	xhr.open("POST", "BackEnd/getLocationsData.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	xhr.send(data);
}

function LoadVideoPinData(callback) {
	$.ajax({
		type: "POST",
		url: 'BackEnd/DataFunctions.php',
		dataType: 'json',
		data: {
			functionName: "getVideoCam"
		},
		success: function (obj, textstatus) {
			callback(obj.data);
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log(xhr);
		}
	});
}

function LoadTilesets(callback) {
	$.ajax({
		type: "POST",
		dataType: "JSON",
		url: "BackEnd/DataFunctions.php",
		data: { functionName: "getGeoData" },
		success: function (obj) {
			if (obj.data)
				callback(obj.data);
			else console.log(obj.msg)
		}
	})
}

function addVideoPin(name, long, lat, height, show) {
	var myVideoPin = viewer.entities.add({
		name: name,
		position: Cesium.Cartesian3.fromDegrees(long, lat, height),
		billboard: {
			image: 'Images/security-camera.png',
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
			width: 50,
			height: 50
		},
		show: show,
		label: {
			text: name,
			font: '14pt monospace',
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			verticalOrigin: Cesium.VerticalOrigin.TOP,
			pixelOffset: new Cesium.Cartesian2(0, -9)
		}
	});
	return (myVideoPin);

}

function LoadProjectWiseFolders(callback) {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			callback(this.responseText);
		}
	});
	xhr.open("GET", "BackEnd/getProjectWiseFolders.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	xhr.send();
}

function getDefectAccessTokenPowerBi(callback) {
	//used initially to load all the saved up defect data from LBUDefects.json
	var myobj = new XMLHttpRequest();
	myobj.overrideMimeType("application/json");
	myobj.open('GET', 'BackEnd/powerbi_defect.php', true);
	myobj.onreadystatechange = function () {
		if (myobj.readyState == 4 && myobj.status == "200") {

			callback(myobj.responseText);
		}
	};
	myobj.send(null);
}

function viewFile(ele) {
	// check if file is sp or project wise
	var method = $(ele).data('method');
	method = (method) ? method : 'pw';
	if (method == 'sp') {
		fileUrl = $(ele).data('url');
		fileName = $(ele).text();
		var suppExtArr = ['docx', 'docx', 'pptx', 'xlsx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
		var fileExt = fileName.split('.').pop();
		if (!suppExtArr.includes(fileExt)) {
			window.open(fileUrl);
			return;
		}
	} else {
		fileUrl = ele.id;
		fileName = document.getElementById(ele.id).textContent;
		// console.log(fileUrl + " " + fileName);
		if (!pwloginCredentials) {
			$('#pwUserName').val("");
			$('#pwPassword').val("");
			document.getElementById('pwCredentials').style.display = 'block';
			return;
		}
	}

	
	$.ajax({
		type: "POST",
		url: 'BackEnd/doc_viewer.php',
		dataType: 'json',
		data: {
			fileUrl: fileUrl,
			fileName: fileName,
			fileMethod: method
		},
		success: function (obj, textstatus) {
			var message = obj['msg'];
			if (message == "success") {
				var url = obj['fileurl'];
				window.open(url);

			}  else  if("download".includes(message)){
                var url = obj['fileurl'];
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    //var url = URL.createObjectURL(data['d']);
                    link.setAttribute("href", url);
                    link.setAttribute("download", fileName);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
                pwloginCredentials = true;
            } else {
				$.alert({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Message',
					content: message
				});
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			$.alert({
				boxWidth: '30%',
				useBootstrap: false,
				title: 'Message',
				content: str
			});
		}
	});
	
}


function LoadEarthPinData(callback) {
	var xhr = new XMLHttpRequest();
	let data = "project_id=" + localStorage.p_id;
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			callback(this.responseText);
		}
	});
	xhr.open("POST", "BackEnd/getEarthPinsData.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	console.log(data);
	xhr.send(data);
}

function addEarthPin(name, long, lat, height, show) {
	var myEarthPin = viewer.entities.add({
		name: name,
		position: Cesium.Cartesian3.fromDegrees(long, lat, height),
		billboard: {
			image: 'Images/camera_360.png',
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
			width: 50,
			height: 50
		},
		show: show,
		label: {
			text: name,
			font: '14pt monospace',
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			verticalOrigin: Cesium.VerticalOrigin.TOP,
			pixelOffset: new Cesium.Cartesian2(0, -9)
		}
	});
	return (myEarthPin);
}

function openEarthImagePin(ele) {
	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);

	var i = 0;
	while (i < earthPinData.length) {
		if (earthPinData[i].imagePinID == id) {
			$("#earthmine-jqx.active").removeClass('active');
			jqwidgetBox("earthmine-jqx", false);
			viewer.flyTo(earthPinsArray[i]);
			jqwidgetBox("earthmine-jqx", 1);
			earth360(earthPinData[i].imageURL, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, earthPinData[i].initHeading);
			break;

		}
		i++;
	};
}

function deleteImagePin(ele) {
	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);
	var j = 0;
	var myindex;
	var pinname;
	while (j < earthPinData.length) {
		if (id == earthPinData[j].imagePinID) {
			myindex = j;
			pinname = earthPinData[j].imagePinName;
			break;
		}
		j++;
	};
	if (pinname) {
		$.confirm({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Confirm!',
			content: 'Are you sure you want to delete the image:' + pinname + '?',
			buttons: {
				confirm: function () {
					var id = earthPinData[myindex].imagePinID;
					var imageName = earthPinData[myindex].imagePinName;
					var headType = earthPinData[myindex].initChoice;
					console.log("Trying to delete this ->" + id);

					$.post("BackEnd/deleteImagePinData.php", {
						imagePinID: id,
						imagePinName: imageName,
						headType: headType
					})
					.done(function (data) {
						earthPinData.splice(myindex, 1);
						var billboard = earthPinsArray[myindex];
						viewer.entities.removeById(billboard._id);
						earthPinsArray.splice(myindex, 1);
						ele.parentNode.remove();
					});
				},
				cancel: function () {
					return
				}
			}
		});
	}
}

function editImagePinDetails(ele) {
	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);
	var j = 0;

	while (j < earthPinData.length) {
		if (id == earthPinData[j].imagePinID) {
			earthPinEdit = true;
			earthPinIndex = j;
			$('#imagePinID').val(earthPinData[j].imagePinID);
			$('#imgName').val(earthPinData[j].imagePinName);
			$('#imgHeight').val(earthPinData[j].height);
			$('#imgLong').val(earthPinData[j].longitude);
			$('#imgLat').val(earthPinData[j].latitude);
			var radioChosen = earthPinData[j].initChoice;
			fileURL = '../'+earthPinData[j].imageURL;
			var longHead = earthPinData[j].initClick;
			xx = earthPinData[j].initHeading;

			$("h5.localImage").html("Change File")

			$("#initImage").css('width', "100%");
			$("#initImage").css('height', "250px");
			$("#initImage").attr("src", fileURL);
			$("#initImage").addClass("active");

			$("#initImage").on("click", function (event) {
				clickX = event.offsetX; //longitude
				var width = this.offsetWidth;

				if (clickX < (width / 2)) {
					xx = 180 + ((clickX / width) * 360);
				} else {
					xx = (clickX - (width / 2)) * (360 / width);
				}

				if (!$("#initImage").hasClass("active")) {
					$("#initImage").addClass("active")
					$(".verticalLine").css("left", clickX)
					$("#northReset").css("display", "block")
					$(".instructionBox").html("Click <kbd>Reset</kbd> to reset the North position.")
				} else {
				}
			});
			$("#initImage").mousemove(function (event) {
				if (!$("#initImage").hasClass("active")) {
					var clickX = event.offsetX;
					var linePos = clickX - 8;
					$(".verticalLine").css("left", linePos)
				} else {
				}
			})
			$("#northReset").on("click", function () {
				$("#initImage").removeClass("active")
				$(".verticalLine").css("left", "13px")
				$("#northReset").css("display", "none")
				$(".instructionBox").html("Select center point (North) of image")
			})

			if (radioChosen == 1) {
				$("#fromImage").prop('checked', true);
				$(".initImageDiv").show();
				$("#northReset").css("display", "block")
				$(".verticalLine").css("left", longHead + "px");
				imgInitialSource = "chooseImage";
			}
			else {
				$("#fromPinDetails").prop('checked', true);
				$(".initImageDiv").hide();
				imgInitialSource = "choosePinDetails";
			}

			$("#imageFileName").on("click", function (event) {
				$("#initImage").removeClass("active");
				ChangeImage();
			});

			jqwidgetBox("addImage", 1);
			jqwidgetBox("earthmine-jqx", false);
			viewer.flyTo(earthPinsArray[j]);
			break;
		}
		j++;
	}
}

function searchForName(ele) {
	var input, filter, ul, ulGroup, li, label, i, txtValue;
	input = ele;
	filter = input.value.toUpperCase();
	ul = document.getElementById("layergrouplist");
	// li = ul.querySelectorAll("li");
	li = ul.getElementsByClassName("layerSearch");
	for (i = 0; i < li.length; i++) {
		label = li[i].getElementsByTagName("label")[0];
		if (label) {
			var labelVal = label.innerHTML
			if (labelVal.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	}
}

function GetNextChildText(tagToFind, valueToFind) {
	var nextText = "";
	$(tagToFind).each(function (i) {
		if ($(this).text() == valueToFind) {
			if ($(this).next() != null && $(this).next() != undefined) {
				nextText = $(this).next().text();
			}
		}
	});
	return (nextText);
}


function getRequestBimAttr(ElementId,url){
	var myDesc="", myTitle = "";
	var dpa ="", dak ="", id ="", name="", status="", culverttype="", lon="", lat="";
	var pavementtype ="", category ="", notes ="", cStart ="", cEnd ="", drainagetype ="";
	var position ="", furnituretype ="", guardrailtype  ="", slopetype ="", bridgetype="";
	var package_uuid = localStorage.p_id +"_"+ localStorage.p_id_name +"_"+ localStorage.p_id
	var eleCategory = "", itemName = "", elevationBottom = "", elevationTop = "", lengthPileCap = "", eleThickness = "", eleVolume = "", eleWidth = "", guid = "", material = "", bridgeName = "", brDPA = "", brDAK = "";
	var brType = "", heightOffset = "", thickness = "", volume = "", structureNo = "", length = "", depth = "", width = ""
	var dataCheck = true
	$.when(
		$.ajax({
			type: "POST",
			url: "BackEnd/bimAttrRequest.php",
			data:{url:url, element_id: ElementId, package_uuid: package_uuid},
			success: function(data){
				data = JSON.parse(data)
				assetDataAPI.splice(0, assetDataAPI.length, data)
				if(data.data != null){
					var ele = data.data
					 
					if (ele && ele[0]){
						Object.keys(ele[0]).forEach(function(key) {
							switch(key){
								case "dpa_id":
									dpa =  ele[0][key];
									break;
								case "dak_id":
									dak = ele[0][key];
									break;
								case "asset_name":
									name = ele[0][key]
									break;
								case "asset_id":
									id = ele[0][key]
									break;
								case "asset_status":
									status = ele[0][key];
									break;
								case "culvert_type":
									culverttype = ele[0][key];
									break;
								case "latitude":
									lat = ele[0][key]
									break;
								case "longitude":
									lon = ele[0][key];
									break;
								case "element_id":
									break;
								case "pavement_type":
									pavementtype = ele[0][key];
									break;
								case "asset_category":
									category = ele[0][key];
									break;
								case "notes":
									notes = ele[0][key];
									break;
								case "chainage_start":
									cStart = ele[0][key];
									break;
								case "chainage_end":
									cEnd = ele[0][key];
									break;
								case "drainage_type":
									drainagetype = ele[0][key];
									break;
								case "bridge_type":
									bridgetype = ele[0][key];
									break;
								case "asset_position":
									position = ele[0][key];
									break;
								case "road_furniture_type" :
									furnituretype = ele[0][key];
									break;
								case "guardrail_type":
									guardrailtype = ele[0][key];
									break;
								case "slope_type" :
									slopetype = ele[0][key];
									break;
									
								
								case "item_name" :
									itemName = ele[0][key];
									break;
								case "category" :
									eleCategory = ele[0][key];
									break;
								case "elevation_bottom" :
									elevationBottom = ele[0][key];
									break;
								case "elevation_top" :
									elevationTop = ele[0][key];
									break;
								case "length_pile_cap" :
									lengthPileCap = ele[0][key];
									break;
								case "ele_thickness" :
									eleThickness = ele[0][key];
									break;
								case "ele_volume" :
									eleVolume = ele[0][key];
									break;
								case "ele_width" :
									eleWidth = ele[0][key];
									break;
								case "guid" :
									guid = ele[0][key];
									break;
								case "item_material" :
									material = ele[0][key];
									break; 
								case "inv_bridge.asset_name" :
									bridgeName = ele[0][key];
									break;
								case "inv_bridge.dak_id" :
									brDAK = ele[0][key];
									break;
								case "inv_bridge.dpa_id" :
									brDPA = ele[0][key];
									break;

							
								case "type" :
									brType = ele[0][key];
									break;
								case "height_offset_from_level" :
									heightOffset = ele[0][key];
									break;
								case "thickness" :
									thickness = ele[0][key];
									break;
								case "volume" :
									volume = ele[0][key];
									break;
								case "structure_no" :
									structureNo = ele[0][key];
									break;
								case "material" :
									material = ele[0][key];
									break; 
								case "length" :
									length = ele[0][key];
									break; 

								case "depth" :
									depth = ele[0][key];
									break; 
								case "width" :
									width = ele[0][key];
									break; 

							}
							// if(ele[0][key] !== ""){
							// 	myDesc += '<tr><th>'+key+'</th><td>' + ele[0][key] + '</td></tr>' 
							// }
						});	
						
						if(category == "BRPC"){
							myTitle = bridgeName

							if(structureNo) myDesc += '<tr><th>STRUCTURE ID</th><td>' + structureNo  + '</td></tr>' ;
							if(itemName) myDesc += '<tr><th>NAME</th><td>' + itemName  + '</td></tr>' ;
							if(eleCategory) myDesc += '<tr><th>CATEGORY</th><td>' + eleCategory  + '</td></tr>' ;
							if(material) myDesc += '<tr><th>MATERIAL</th><td>' + material  + '</td></tr>' ;
							if(elevationBottom) myDesc += '<tr><th>ELEVATION BOTTOM</th><td>' + elevationBottom  + '</td></tr>' ;
							if(elevationTop) myDesc += '<tr><th>ELEVATION TOP</th><td>' + elevationTop  + '</td></tr>' ;
							if(lengthPileCap) myDesc += '<tr><th>LENGTH PILE CAP</th><td>' + lengthPileCap  + '</td></tr>' ;
							if(eleThickness) myDesc += '<tr><th>ELEMENT THICKNESS</th><td>' + eleThickness  + '</td></tr>' ;
							if(eleVolume) myDesc += '<tr><th>ELEMENT VOLUME</th><td>' + eleVolume  + '</td></tr>' ;
							if(eleWidth) myDesc += '<tr><th>ELEMENT WIDTH</th><td>' + eleWidth  + '</td></tr>' ;
							if(guid) myDesc += '<tr><th>GUID</th><td>' + guid  + '</td></tr>' ;
							myDesc += '<tr><th>DPA</th><td>' + brDPA+ '</td></tr>' ;
							myDesc += '<tr><th>DAK</th><td>' + brDAK + '</td></tr>' ;
							myDesc += '<tr><th>ASSET CATEGORY</th><td>' + category + '</td></tr>' ;
						}else if(category == "BRDS"){
							myTitle = bridgeName
							
							if(structureNo) myDesc += '<tr><th>STRUCTURE ID</th><td>' + structureNo  + '</td></tr>' ;
							if(itemName) myDesc += '<tr><th>NAME</th><td>' + itemName  + '</td></tr>' ;
							myDesc += '<tr><th>CATEGORY</th><td>' + eleCategory  + '</td></tr>' ;
							if(brType) myDesc += '<tr><th>Type</th><td>' + brType  + '</td></tr>' ;
							if(elevationBottom) myDesc += '<tr><th>ELEVATION BOTTOM</th><td>' + elevationBottom  + '</td></tr>' ;
							if(elevationTop) myDesc += '<tr><th>ELEVATION TOP</th><td>' + elevationTop  + '</td></tr>' ;
							if(heightOffset) myDesc += '<tr><th>HEIGHT OFFSET FROM LEVEL</th><td>' + heightOffset  + '</td></tr>' ;
							if(thickness) myDesc += '<tr><th>THICKNESS</th><td>' + thickness  + '</td></tr>' ;
							if(volume) myDesc += '<tr><th>VOLUME</th><td>' + volume  + '</td></tr>' ;
							if(guid) myDesc += '<tr><th>GUID</th><td>' + guid  + '</td></tr>' ;
							myDesc += '<tr><th>DPA</th><td>' + brDPA+ '</td></tr>' ;
							myDesc += '<tr><th>DAK</th><td>' + brDAK + '</td></tr>' ;
							myDesc += '<tr><th>ASSET CATEGORY</th><td>' + category + '</td></tr>' ;
						}else if(category == "BRA" || category == "BRParapet"){
							myTitle = bridgeName
							
							if(structureNo) myDesc += '<tr><th>STRUCTURE ID</th><td>' + structureNo  + '</td></tr>' ;
							if(itemName) myDesc += '<tr><th>NAME</th><td>' + itemName  + '</td></tr>' ;
							myDesc += '<tr><th>CATEGORY</th><td>' + eleCategory  + '</td></tr>' ;
							if(volume) myDesc += '<tr><th>VOLUME</th><td>' + volume  + '</td></tr>' ;
							if(length) myDesc += '<tr><th>LENGTH</th><td>' + length  + '</td></tr>' ;
							if(guid) myDesc += '<tr><th>GUID</th><td>' + guid  + '</td></tr>' ;
							myDesc += '<tr><th>DPA</th><td>' + brDPA+ '</td></tr>' ;
							myDesc += '<tr><th>DAK</th><td>' + brDAK + '</td></tr>' ;
							myDesc += '<tr><th>ASSET CATEGORY</th><td>' + category + '</td></tr>' ;
						}else if(category == "BRB"){
							myTitle = bridgeName
							
							if(itemName) myDesc += '<tr><th>NAME</th><td>' + itemName  + '</td></tr>' ;
							myDesc += '<tr><th>CATEGORY</th><td>' + eleCategory  + '</td></tr>' ;
							if(brType) myDesc += '<tr><th>Type</th><td>' + brType  + '</td></tr>' ;
							if(elevationBottom) myDesc += '<tr><th>ELEVATION BOTTOM</th><td>' + elevationBottom  + '</td></tr>' ;
							if(elevationTop) myDesc += '<tr><th>ELEVATION TOP</th><td>' + elevationTop  + '</td></tr>' ;
							if(volume) myDesc += '<tr><th>VOLUME</th><td>' + volume  + '</td></tr>' ;
							if(guid) myDesc += '<tr><th>GUID</th><td>' + guid  + '</td></tr>' ;
							myDesc += '<tr><th>DPA</th><td>' + brDPA+ '</td></tr>' ;
							myDesc += '<tr><th>DAK</th><td>' + brDAK + '</td></tr>' ;
							if(structureNo) myDesc += '<tr><th>STRUCTURE ID</th><td>' + structureNo  + '</td></tr>' ;
							myDesc += '<tr><th>ASSET CATEGORY</th><td>' + category + '</td></tr>' ;
						}else if(category == "BRBG" || category == "BRPier"){
							myTitle = bridgeName
							
							if(structureNo) myDesc += '<tr><th>STRUCTURE ID</th><td>' + structureNo  + '</td></tr>' ;
							if(itemName) myDesc += '<tr><th>NAME</th><td>' + itemName  + '</td></tr>' ;
							myDesc += '<tr><th>CATEGORY</th><td>' + eleCategory  + '</td></tr>' ;
							if(brType) myDesc += '<tr><th>Type</th><td>' + brType  + '</td></tr>' ;
							if(material) myDesc += '<tr><th>Structural Material Name</th><td>' + material  + '</td></tr>' ;
							if(length) myDesc += '<tr><th>LENGTH</th><td>' + length  + '</td></tr>' ;
							if(volume) myDesc += '<tr><th>VOLUME</th><td>' + volume  + '</td></tr>' ;
							if(guid) myDesc += '<tr><th>GUID</th><td>' + guid  + '</td></tr>' ;
							if(depth) myDesc += '<tr><th>DEPTH</th><td>' + depth  + '</td></tr>' ;
							if(width) myDesc += '<tr><th>WIDTH</th><td>' + width  + '</td></tr>' ;
							myDesc += '<tr><th>DPA</th><td>' + brDPA+ '</td></tr>' ;
							myDesc += '<tr><th>DAK</th><td>' + brDAK + '</td></tr>' ;
							myDesc += '<tr><th>ASSET CATEGORY</th><td>' + category + '</td></tr>' ;
						}else{
							console.log("Displaying Asset Info")
							myTitle = "Attribute"
							myDesc += '<tr><th>DPA</th><td>' + dpa+ '</td></tr>' ;
							myDesc += '<tr><th>DAK</th><td>' + dak + '</td></tr>' ;
							myDesc += '<tr><th>ASSET ID</th><td>' + id + '</td></tr>' ;
							if(name)myDesc += '<tr><th>ASSET NAME</th><td>' +name  + '</td></tr>' ;
							if(culverttype)	myDesc += '<tr><th>CULVERT TYPE</th><td>' + culverttype + '</td></tr>' ;
							if(pavementtype)	myDesc += '<tr><th>PAVEMENT TYPE</th><td>' + pavementtype + '</td></tr>' ;
							if(drainagetype)  myDesc += '<tr><th>DRAINAGE TYPE</th><td>' + drainagetype + '</td></tr>' ;
							if(furnituretype) myDesc += '<tr><th>ROAD FURNITURE TYPE</th><td>' + furnituretype + '</td></tr>' ;
							if(guardrailtype) myDesc += '<tr><th>GUARDRAIL TYPE</th><td>' + guardrailtype + '</td></tr>' ;
							if(slopetype) myDesc += '<tr><th>SLOPE TYPE</th><td>' + slopetype + '</td></tr>' ;
							if(bridgetype) myDesc += '<tr><th>BRIDGE TYPE</th><td>' + bridgetype + '</td></tr>' ;
							myDesc += '<tr><th>ASSET STATUS</th><td>' +  status+ '</td></tr>' ;
							if(position) myDesc += '<tr><th>ASSET POSITION</th><td>' +  position + '</td></tr>' ;
							if(category) myDesc += '<tr><th>ASSET CATEGORY</th><td>' +  category+ '</td></tr>' ;
							if(notes) myDesc += '<tr><th>NOTE</th><td>'+ notes + '</td></tr>';
							if(lat) myDesc += '<tr><th>LATITUDE</th><td>' + lat  + '</td></tr>' ;
							if(lon) myDesc += '<tr><th>LONGITUDE</th><td>' + lon + '</td></tr>'; 
							if(cStart ) myDesc += '<tr><th>CHAINAGE START</th><td>' + cStart  + '</td></tr>' ;
							if(cEnd) myDesc += '<tr><th>CHAINAGE END</th><td>' + cEnd  + '</td></tr>' ;

						}
							
					}else{
						myDesc += '<td><th>No data available</td></tr>' 
						dataCheck = false
						return
					}
 
				}
				else{
					myDesc += '<td><th>No data available</td></tr>' 
					dataCheck = false
					return
				}
			}
		})
	).then( function(){
		if( dataCheck == true ) floatboxTurnON(myTitle, myDesc);
	});		
}