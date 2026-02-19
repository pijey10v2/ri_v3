//Cesium for defining area extent
Cesium.BingMapsApi.defaultKey = 'AgWzRGyO26urfR6O6qFMkOAvSW8TZxds6jR_yPiTvbO_Dx9t-s5sheKO0m9vL_SJ';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTg5ZWFlMS1jZGZiLTQ5OGUtYjY3Ni1mMDJmNGNmNWIwY2UiLCJpZCI6MzA1MjAzLCJpYXQiOjE3NDc5MDMzMzF9._AllgIQ2JG23BGarvbIRTv-ZNpkoDj-W0VMRlN1pTuQ';
var mapBoxAccessToken = MAPBOX_TOKEN;
var mapTilerAccessToken = MAPTILER_TOKEN;

var $jogetHost = JOGETHOST;

var stringName;
var pickedFeature;
var p_layers;
var flags;
var videoPinIndex; // index of the chosen video Pin
var positions; // used to draw a line between distance entities
var vid
var fileUrl;
var fileName;
var MeasureTool;
var earthPinIndex;
var tempImagePin;
var imgInitialSource;
var fileURL;
var modelIndex; // stores the index number of the model/asset picked to access the asset
var entityIndex; // stores the index number of the the enitity picked to access the enitiy from array
var tempModel; // a variable to hold the temp geometry instance for draw tool;
var currentLat;
var currentLng;
var selectedNodeId;
var selectedInfoEntity;
var assetTableCellPicked; // to select the model asset from table
var assetTableCellOldColor; //old colour of the model asset from table
var tempVideoPin;
var token;
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
var highlighted
var selected
var nameOverlay
var project_start;
var project_end;
var west
var east
var south
var north
var cameraClickPosition;
var silhouetteBlue
var highlightPoint
var highlightLabel
var pickedLot
var shpPickedLot
var polyLotAlpha
var polyLotBlue
var polyLotGreen
var polyLotRed
var viewer
var flagName
var flags
var viewModelTileset;
var imageryLayers;
var entity;
var viewerManageProcess;
var viewerUse;
var tempMarkAssetPin;

//------------ZERO 0---------------//
var positionCounter = 0;
var distance = 0;
var distanceEntity = 0; // keeps track of number of distance entities
var numClicks = 0;
var baseMap = 0; //my global variables
var camTiltLock = 0; //Enable
var countArray = 0;

//-------------EMPTY STRING------------//
var shpLotId = "";
var lot = "";
var chainage = "";
var struct = "";
var fileLandName = "";
var shpURL = "";
var msgLand = "";
var msgBumi = "";
var highlightLotParcel = "";
var PWDocURL = "";
var PWLogURL = "";
var PowerBIURL = "";

//------------FLAG---------------//
var keycontrol_trigger = false;
var flagDraw = false; // flag true if Draw button is chosen
var flagEntity = false; // flag true if Entity button is chosen
var flagEdit = false; // flag true if editing location details
var flagCamera = false; // flag true if camera button is chosen
var flagAddImage = false; // flag true if add image button is chosen
var flagIoT = false;
var flagIoTEdit = false;
var isEntityPicked = false; // true if enitiy is picked in the table
var isModelPicked = false; // flag true if asset model is picked
var flagAnnotateData = false;
var dashboardWindow = null;
var flagSearch = false;
var flagMarkupTools = false; //flags for Mark up tools
var assetDataAPI = [];
var flagMeasure = false; //flags and arrays for measure tools
var flagPosEntities = false;
var flagArea = false;
var videoPinEdit = false;
var folderTree = false;
var folderTreeSP = false;
var getPWFileData = false;
var getPWFolderData = false;
var pwloginCredentials = false;
var earthPinEdit = false;
var isGetFileUrl = false;
var arrangedView = false;
var entFlag = false
var modFlag = false;
var flagLoadedEarth = false;
var dashboardPowerBILoaded = false
var bentleyCredentialsflag = false; // to check if we have the credentials for the signed in user
var checkCompleteDraw = false;
var changePointColour = false;
var flagLandBoth = false;
var flagAICCompare = false;
var flagLayerProcess = false;
var flagPolyProcess = false;
var flagFolderDirectory = false;

//---------------CESIUM----------------//
var currentObjectId;
var movePosition;
var point1 = new Cesium.Cartesian3();
var StartPoint = new Cesium.Cartesian3();
var EndPoint = new Cesium.Cartesian3();

//---------------ASSET----------//
var dataTable = "";
var dataDate = "";
var dataChainage = "";
var dataTitle = "";
var dataTableDate = "";
var dataTitleDate = "";
var mlpDate = "";
var mlpChainage = "";
var mlpTitle = "";
var mlpTable = "";
var mlpTableDate = "";
var mlpTitleDate = "";

//------------ARRAY-------------//
var distEntities = []; // array of distance entities -Cesium bill boards to be removed if deleted
var labelEntity = [];
var pwAssetData = [];
var myModels = []; // array of models/assets for the current project
var locations = []; // array of locations for the current project
var filedata = []; // array of projectwise files associated with the locations
var areaPositions = [];
var entitiesArray = []; // array of Cesium billboard entities-- needed for delete purpose
var modelsArray = [];
var tempModelData = []; //array to hold values for temp Model before saving to database;
var videoPinsArray = []; //array to hold all the video pins
var videoPinData = []; //array to hold all the data for video pins
var earthPinData = [];
var earthPinsArray = [];
var folders = [];
var locationList = [];
var LocationSet = [];
var infoLocationList = [];
var tilesetlist = [];
var tilesetlistNewProcess = [];
var landThematic = [];
var measureDataArr = [];
var layerProcessArr = [];
var ecwFileName = [];
var trackData = []; //array to hold all the data for track animation

//------------Track Animation Variables---------------//
var positionProperty;
var arrayOfPositions = null;
var arrayHeadings = [];
var pointEntity = null;
var lastCurrentTime = null;
var polyEntity = null;

var animationStart;
var animationStop;
var entityAnimate;
var animationDuration;
var flagAnimate = false;

//---------------Asset Layer ----------------//
var jogetAssetEntities = { R01: [], R02: [], R04: [], R05Bridge: [], R05Culvert: [],R06: [], R07: [] };
var jogetAssetDefectEntities = { Pavement: [] };
//----------OBJECT ARRAY-----------//

function loadRiCesium (){
	viewer = new Cesium.Viewer('RIContainer', {
		baseLayerPicker: false,
		timeline: true,
		contextOptions: {
			webgl: { preserveDrawingBuffer: true }
		},
		animation: true,
		geocoder: new MapboxGeocoderService(mapBoxAccessToken),
		homeButton: true,
		sceneModePicker: false,
		imageryProvider: new Cesium.MapboxStyleImageryProvider({
			styleId: 'satellite-v9', 
        	accessToken: mapBoxAccessToken
		}),
		navigationHelpButton: false,
		infoBox: false,
		fullscreenButton: false,
		mapProjection: new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84),
		selectionIndicator: false


	});
	viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

	if(terrainEnabled){
		viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
			url: "https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key="+mapTilerAccessToken,
			credit: new Cesium.Credit(
				'<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> ' +
				'<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
			),
			requestVertexNormals: true
		});
        viewer.scene.globe.depthTestAgainstTerrain  = true;
	}

	viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
	viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
		400.0,
		0.0,
		800.0,
		1.0
	);

	silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
	silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
	silhouetteBlue.uniforms.length = 0.01;
	silhouetteBlue.selected = [];
	viewer.scene.postProcessStages.add(
		Cesium.PostProcessStageLibrary.createSilhouetteStage([
			silhouetteBlue
		])
	);

	//disable timeline & animation for track animation
	viewer.animation.container.style.display = 'none';
	viewer.timeline.container.style.display = 'none';

	viewer._cesiumWidget._creditContainer.style.display = "none";
	setLeftRightClickFunction(viewer); //set the left & right click

	// if(tilesetlist.length > 0){
	// 	for (var i = 0; i < tilesetlist.length; i++) {
	// 		if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
	// 			tilesetlist[i].tileset.then(async (value) => {
	// 				await viewer.dataSources.remove(value);

	// 			})
	// 		}
	// 	}
	// }
	//need to load the default layers here as it does not load if called later. so calling WMS and only loading of layers here and 
	// not from setInsight function.
	getWMSCap();

	//moved loadLayers from Load insight data function as the default b3dm are not able to load in cesium
	loadLayers(function (p_layers) {
		sortLayers(p_layers, "name", "asc", "asc");
		var parentClassName = {};
		tilesetlist = [];
		var modelOptions = document.getElementById('modelLayerName');
		var layerDiv
		var groupList = document.getElementById('layer');
		$("#layer").html("");
		for (var j = 0; j < p_layers.length; j++) {
			
			if ((p_layers[j].layerGroup || p_layers[j].layerGroup == 0 ) && ( p_layers[j].flagROS == null || p_layers[j].flagROS == 0 )) {
				// scene 2 - to load normal layer group
				if (!document.getElementById('layerUL_' + p_layers[j].layerGroup)) {
					var groupUl = document.createElement('div');
					groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
					groupUl.setAttribute('class', 'groupItem')
					groupUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
					
					var groupLi = document.createElement('div');
					groupLi.setAttribute('class', 'layergroup')
					groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
					
					var groupCheck = document.createElement('input')
					groupCheck.setAttribute('type', 'checkbox')
					groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
					groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
					groupCheck.setAttribute('data', p_layers[j].layerGroup)
					
					parentClassName[p_layers[j].layerGroup] = j;
					groupCheck.setAttribute('class', 'margin-right layerParent layerParent_'+ j);
					groupCheck.setAttribute('data-child', j);
					
					if (p_layers[j].groupView == "1") {
						groupCheck.setAttribute('checked', true)
					}

					var groupLabel = document.createElement('label'); // CREATE LABEL.
					var groupHead = document.createElement('div'); // CREATE DIV.

					var groupDiv = document.createElement('div'); // CREATE DIV.
					groupDiv.setAttribute('class', 'groupHead');
					groupDiv.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
					groupDiv.setAttribute('id', 'layerLi_' + p_layers[j].layerGroup)

					var groupIcon = document.createElement('img'); // CREATE ICON.
					groupIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
					groupIcon.setAttribute('class', 'fileicon');

					
					groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupLabel.setAttribute('class', 'label');
					groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));
					
					groupHead.setAttribute('class', 'group');

					groupDiv.setAttribute('onclick', 'togglelist(this)');
					
					var groupCaret = document.createElement('i'); // CREATE CARET.
					groupCaret.setAttribute('class', 'fa-solid fa-caret-right');

					var groupAsset = document.createElement('i'); // CREATE FLYTO.
					groupAsset.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupAsset.setAttribute('class', 'fa-solid fa-binoculars float');
					groupAsset.setAttribute('onclick', 'flyToGroup(this)');

					groupDiv.appendChild(groupCaret);
					groupDiv.appendChild(groupCheck);
					groupDiv.appendChild(groupLabel);
					groupHead.appendChild(groupDiv);
					groupHead.appendChild(groupUl);
					groupList.appendChild(groupHead);

				}
				layerDiv = groupUl
				flagSearch = true;
			} else if((p_layers[j].groupName )&& ( p_layers[j].subGroupID == null) && ( p_layers[j].flagROS == 1)) {
				// scene 5 - load normal group that have layer without sub group
				if (!document.getElementById('layerUL_' + p_layers[j].layerGroup)) {
					var groupUl = document.createElement('div');
					groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
					groupUl.setAttribute('class', 'groupItem')
					groupUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
					
					var groupLi = document.createElement('div');
					groupLi.setAttribute('class', 'layergroup')
					groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
					
					var groupCheck = document.createElement('input')
					groupCheck.setAttribute('type', 'checkbox')
					groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
					groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
					groupCheck.setAttribute('data', p_layers[j].layerGroup)
					
					parentClassName[p_layers[j].layerGroup] = j;
					groupCheck.setAttribute('class', 'margin-right layerParent layerParent_'+ j);
					groupCheck.setAttribute('data-child', j);
					
					if (p_layers[j].groupView == "1") {
						groupCheck.setAttribute('checked', true)
					}

					var groupLabel = document.createElement('label'); // CREATE LABEL.
					var groupHead = document.createElement('div'); // CREATE DIV.

					var groupDiv = document.createElement('div'); // CREATE DIV.
					groupDiv.setAttribute('class', 'groupHead');
					groupDiv.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
					groupDiv.setAttribute('id', 'layerLi_' + p_layers[j].layerGroup)

					var groupIcon = document.createElement('img'); // CREATE ICON.
					groupIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
					groupIcon.setAttribute('class', 'fileicon');

					 
					groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupLabel.setAttribute('class', 'label');
					groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));
					
					groupHead.setAttribute('class', 'group');

					groupDiv.setAttribute('onclick', 'togglelist(this)');
					
					var groupCaret = document.createElement('i'); // CREATE CARET.
					groupCaret.setAttribute('class', 'fa-solid fa-caret-right');

					var groupAsset = document.createElement('i'); // CREATE FLYTO.
					groupAsset.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupAsset.setAttribute('class', 'fa-solid fa-binoculars float');
					groupAsset.setAttribute('onclick', 'flyToGroup(this)');


					groupDiv.appendChild(groupCaret);
					groupDiv.appendChild(groupCheck);
					groupDiv.appendChild(groupLabel);
					groupHead.appendChild(groupDiv);
					groupHead.appendChild(groupUl);
					groupList.appendChild(groupHead);

				}
				layerDiv = groupUl
				flagSearch = true;			
			} else if((p_layers[j].groupName )&& ( p_layers[j].subGroupID) && ( p_layers[j].flagROS == 1)){
				//scene 4 - load normal group with layer and sub group that want to display as a layer
					if (!document.getElementById('layerUL_' + p_layers[j].layerGroup)) {
						var groupUl = document.createElement('div');
						groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
						groupUl.setAttribute('class', 'groupItem')
						groupUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
						
						var groupLi = document.createElement('div');
						groupLi.setAttribute('class', 'layergroup')
						groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
						
						var groupCheck = document.createElement('input')
						groupCheck.setAttribute('type', 'checkbox')
						groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
						groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
						groupCheck.setAttribute('data', p_layers[j].layerGroup)
						
						parentClassName[p_layers[j].layerGroup] = j;
						groupCheck.setAttribute('class', 'margin-right layerParent layerParent_'+ j);
						groupCheck.setAttribute('data-child', j);
						
						if (p_layers[j].groupView == "1") {
							groupCheck.setAttribute('checked', true)
						}

						var groupLabel = document.createElement('label'); // CREATE LABEL.
						var groupHead = document.createElement('div'); // CREATE DIV.

						var groupDiv = document.createElement('div'); // CREATE DIV.
						groupDiv.setAttribute('class', 'groupHead');
						groupDiv.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
						groupDiv.setAttribute('id', 'layerLi_' + p_layers[j].layerGroup)

						var groupIcon = document.createElement('img'); // CREATE ICON.
						groupIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						groupIcon.setAttribute('class', 'fileicon');

						
						groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
						groupLabel.setAttribute('class', 'label');
						groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));
						
						groupHead.setAttribute('class', 'group');

						groupDiv.setAttribute('onclick', 'togglelist(this)');
						
						var groupCaret = document.createElement('i'); // CREATE CARET.
						groupCaret.setAttribute('class', 'fa-solid fa-caret-right');

						var groupAsset = document.createElement('i'); // CREATE FLYTO.
						groupAsset.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
						groupAsset.setAttribute('class', 'fa-solid fa-binoculars float');
						groupAsset.setAttribute('onclick', 'flyToGroup(this)');


						groupDiv.appendChild(groupCaret);
						groupDiv.appendChild(groupCheck);
						groupDiv.appendChild(groupLabel);
						
						
						groupHead.appendChild(groupDiv);
						groupHead.appendChild(groupUl);
						groupList.appendChild(groupHead);
					}
					
					if (!document.getElementById('layerUL_' + p_layers[j].subGroupID)) {
						var groupSubUl = document.createElement('div');
						groupSubUl.setAttribute('id', 'layerUL_' + p_layers[j].subGroupID)
						groupSubUl.setAttribute('class', 'groupItem')
						groupSubUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
						
						var groupSubLi = document.createElement('div');
						groupSubLi.setAttribute('class', 'layergroup')
						groupSubLi.setAttribute('id', 'layerGroup_' + p_layers[j].subGroupID)
						
						var groupSubChk = document.createElement('input')
						groupSubChk.setAttribute('type', 'checkbox')
						groupSubChk.setAttribute('id', 'checkGroup_' + p_layers[j].subGroupID)
						groupSubChk.setAttribute('onclick', 'groupOnCheck(this)');
						groupSubChk.setAttribute('data', p_layers[j].subGroupID)
						
						parentClassName[p_layers[j].subGroupID] = j;
						groupSubChk.setAttribute('class', 'margin-right groupSub layerParent layerParent_'+ j);
						groupSubChk.setAttribute('data-child', j);
						
						if (p_layers[j].groupView == "1") {
							groupSubChk.setAttribute('checked', true)
						}
		
						var groupSubLabel = document.createElement('label'); // CREATE LABEL.
						var groupSubHead = document.createElement('div'); // CREATE DIV.
		
						var groupSubDiv = document.createElement('div'); // CREATE DIV.
						groupSubDiv.setAttribute('class', 'groupHead');
						groupSubDiv.setAttribute('rel', 'layerUL_' + p_layers[j].subGroupID)
						groupSubDiv.setAttribute('id', 'layerLi_' + p_layers[j].subGroupID)
		
						var groupSubIcon = document.createElement('img'); // CREATE ICON.
						groupSubIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						groupSubIcon.setAttribute('class', 'fileicon');
		
						groupSubLabel.setAttribute('for', 'layerGroup_' + p_layers[j].subGroupID);
						groupSubLabel.setAttribute('class', 'label debold');
						groupSubLabel.appendChild(document.createTextNode(p_layers[j].subLayerTitle));
		
						groupSubHead.setAttribute('class', 'group hiddenGroup');

						groupSubDiv.setAttribute('onclick', 'togglelist(this)');
		
						var groupSubAsset = document.createElement('i'); // CREATE FLYTO.
						groupSubAsset.setAttribute('for', 'layerGroup_' + p_layers[j].subGroupID);
						groupSubAsset.setAttribute('class', 'fa-solid fa-binoculars float fa-caret-right');
						groupSubAsset.setAttribute('onclick', 'flyToGroup(this)');
						
						groupSubDiv.appendChild(groupSubChk);
						groupSubDiv.appendChild(groupSubIcon);
						groupSubDiv.appendChild(groupSubLabel);
						groupSubDiv.appendChild(groupSubAsset);
						groupSubHead.appendChild(groupSubDiv);
						groupSubHead.appendChild(groupSubUl);
						var groupHeadStr = groupSubHead.outerHTML;
		
						$('#layerUL_'+p_layers[j].groupID).append(groupHeadStr)
					}
				
			}
			else {
				layerDiv = document.getElementById('layer');
			}

			if(p_layers[j].subGroupID == null){
				// scene 1 - to create normal layer without subgroupID
				var ul_li = document.createElement('div'); //CREATE li
				ul_li.setAttribute('id', 'dataID_' + p_layers[j].Data_ID)
				ul_li.setAttribute('class', 'item layerContainer')
				if (!flagSearch) {
					ul_li.setAttribute('class', 'layerSearch item layerContainer');
				}
				var chk = document.createElement('input'); // CREATE CHECK BOX.
				chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
				chk.setAttribute('id', "dataChk_" + p_layers[j].Data_ID); // SET UNIQUE ID.
				chk.setAttribute('onclick', 'layerOnCheck(this)')

				if(parentClassName[p_layers[j].layerGroup]) {
					chk.setAttribute('class', 'layerChild_'+ parentClassName[p_layers[j].layerGroup]);
					chk.setAttribute('data-parent', parentClassName[p_layers[j].layerGroup]);
				}else{
					chk.setAttribute('class', 'layerParent_'+ j);
				}

				if (p_layers[j].Default_View == true || p_layers[j].groupView == true) {
					chk.setAttribute('checked', true);
				}
				var lyr_icon = document.createElement('img');
				lyr_icon.setAttribute('class', 'fileicon');
				lyr_icon.setAttribute('style', 'width: 18px;');

				var outerDiv = document.createElement('div');
				outerDiv.setAttribute('class', 'layerInput');
		
				switch (p_layers[j].Data_Type) {
					case 'KML':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/kml.png');
						lyr_icon.setAttribute('title', 'KML/KMZ');
						break;
					case 'SHP':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/shp.png');
						lyr_icon.setAttribute('title', 'SHP');
						break;
					case 'B3DM': //b3dm
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						lyr_icon.setAttribute('title', 'B3DM');
						break;
				}
		
				chk.setAttribute('name', 'checkbox');
		
				var lbl = document.createElement('a'); // CREATE LABEL.
				lbl.setAttribute('for', p_layers[j].Layer_Name);
				lbl.style.fontSize = 'small';
				lbl.style.whiteSpace = 'nowrap';
		
				// // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
				lbl.appendChild(document.createTextNode(p_layers[j].Layer_Name));
				// //CREATE
				// // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
				ul_li.appendChild(outerDiv);
				outerDiv.appendChild(chk);
				outerDiv.appendChild(lyr_icon);
				outerDiv.appendChild(lbl);
				
				if (p_layers[j].show_metadata == 'true') {
					outerDiv.innerHTML += `<i class='fa-solid fa-circle-info margin-right' onclick='getMetadataDetails(event, "`+p_layers[j].meta_id+`", "`+p_layers[j].Layer_Name+`")'></i>`;
				}
				outerDiv.innerHTML += "<i class='fa-solid fa-binoculars' onclick='flyToLayer(this)'></i>";
				layerDiv.prepend(ul_li)

				// append one more folder level for V3 url
				v3URL = "../" + p_layers[j].Data_URL;

				if (p_layers[j].Data_Type == "KML") {
					var mykml = null
					if (p_layers[j].groupView) {
						if (p_layers[j].groupView == true || p_layers[j].Default_View == true) {
							mykml = LoadKMLData(v3URL)
						}
					} else if (p_layers[j].Default_View == true) {
						mykml = LoadKMLData(v3URL)
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
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
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
						ownerLayerID: p_layers[j].project_id,
						subGroupID: p_layers[j].subGroupID
					});
				} else {
					var mytileset;
					var myurl = p_layers[j].Data_URL;
					var height = p_layers[j].Offset;
					var xoffset = p_layers[j].X_Offset;
					var yoffset = p_layers[j].Y_Offset;
					var longlat = 0;

					var view = '';
					if(p_layers[j].groupView != '1'){
						view = p_layers[j].Default_View
					}
					else{
						view = p_layers[j].groupView
					}
					
					mytileset = LoadB3DMTileset(myurl, height, xoffset, yoffset, view, longlat);
					
					tilesetlist.push({
						id: p_layers[j].Data_ID,
						name: p_layers[j].Layer_Name,
						layerID: p_layers[j].Layer_ID,
						tileset: mytileset,
						type: "tileset",
						offset: p_layers[j].Offset,
						xoffset: p_layers[j].X_Offset,
						yoffset: p_layers[j].Y_Offset,
						defaultView: p_layers[j].groupView || p_layers[j].Default_View,
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
					});
				};

				//add the layers names as options to model form needed when saving models
				var option = document.createElement("option");
				option.text = p_layers[j].Layer_Name;
				option.value = p_layers[j].Layer_ID;
				modelOptions.add(option);
			}else{
				// to create layer with subgroup id
				var ul_li = document.createElement('div'); //CREATE li
				ul_li.setAttribute('id', 'dataID_' + p_layers[j].Data_ID)
				ul_li.setAttribute('class', 'item layerContainer')
				if (!flagSearch) {
					ul_li.setAttribute('class', 'layerSearch item layerContainer');
				}
				var chk = document.createElement('input'); // CREATE CHECK BOX.
				chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
				chk.setAttribute('id', "dataChk_" + p_layers[j].Data_ID); // SET UNIQUE ID.
				chk.setAttribute('onclick', 'layerOnCheck(this)')

				if(parentClassName[p_layers[j].subGroupID]) {
					chk.setAttribute('class', 'layerChild_'+ parentClassName[p_layers[j].subGroupID]);
					chk.setAttribute('data-parent', parentClassName[p_layers[j].subGroupID]);
				}else{
					chk.setAttribute('class', 'layerParent_'+ j);
				}

				if (p_layers[j].Default_View == true || p_layers[j].groupView == true) {
					chk.setAttribute('checked', true);
				}
				var lyr_icon = document.createElement('img');
				lyr_icon.setAttribute('class', 'fileicon');
				lyr_icon.setAttribute('style', 'width: 18px;');

				var outerDiv = document.createElement('div');
				outerDiv.setAttribute('class', 'layerInput');
		
				switch (p_layers[j].Data_Type) {
					case 'KML':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/kml.png');
						lyr_icon.setAttribute('title', 'KML/KMZ');
						break;
					case 'SHP':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/shp.png');
						lyr_icon.setAttribute('title', 'SHP');
						break;
					case 'B3DM': //b3dm
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						lyr_icon.setAttribute('title', 'B3DM');
						break;
				}
		
				chk.setAttribute('name', 'checkbox');
		
				var lbl = document.createElement('a'); // CREATE LABEL.
				lbl.setAttribute('for', p_layers[j].Layer_Name);
				lbl.style.fontSize = 'small';
				lbl.style.whiteSpace = 'nowrap';
		
				// // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
				lbl.appendChild(document.createTextNode(p_layers[j].Layer_Name));
				// //CREATE
				// // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
				ul_li.appendChild(outerDiv)
				outerDiv.appendChild(chk);
				outerDiv.appendChild(lyr_icon);
				outerDiv.appendChild(lbl);
				
				if (p_layers[j].show_metadata == 'true') {
					outerDiv.innerHTML += `<i class='fa-solid fa-circle-info margin-right' onclick='getMetadataDetails(event, "`+p_layers[j].meta_id+`", "`+p_layers[j].Layer_Name+`")'></i>`;
				}
				outerDiv.innerHTML += "<i class='fa-solid fa-binoculars' onclick='flyToLayer(this)'></i>";
				var outerDivLayer = ul_li.outerHTML;
				$('#layerUL_'+p_layers[j].subGroupID).prepend(outerDivLayer)

				// append one more folder level for V3 url
				v3URL = "../" + p_layers[j].Data_URL;

				if (p_layers[j].Data_Type == "KML") {
					var mykml = null
					if (p_layers[j].groupView) {
						if (p_layers[j].groupView == true || p_layers[j].Default_View == true) {
							mykml = LoadKMLData(v3URL)
						}
					} else if (p_layers[j].Default_View == true) {
						mykml = LoadKMLData(v3URL)
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
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
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
						ownerLayerID: p_layers[j].project_id,
						subGroupID: p_layers[j].subGroupID
					});
				} else {
					var mytileset;
					var myurl = p_layers[j].Data_URL;
					var height = p_layers[j].Offset;
					var xoffset = p_layers[j].X_Offset;
					var yoffset = p_layers[j].Y_Offset;
					var longlat = 0;

					var view = '';
					if(p_layers[j].groupView != '1'){
						view = p_layers[j].Default_View
					}
					else{
						view = p_layers[j].groupView
					}
					
					mytileset = LoadB3DMTileset(myurl, height, xoffset, yoffset, view, longlat);
					
					tilesetlist.push({
						id: p_layers[j].Data_ID,
						name: p_layers[j].Layer_Name,
						layerID: p_layers[j].Layer_ID,
						tileset: mytileset,
						type: "tileset",
						offset: p_layers[j].Offset,
						xoffset: p_layers[j].X_Offset,
						yoffset: p_layers[j].Y_Offset,
						defaultView: p_layers[j].groupView || p_layers[j].Default_View,
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
					});
				};

				//add the layers names as options to model form needed when saving models
				var option = document.createElement("option");
				option.text = p_layers[j].Layer_Name;
				option.value = p_layers[j].Layer_ID;
				modelOptions.add(option);
			}
			
		}

		// prevent parent event trigger on child
		$(".layerParent").click(function(e) {
			e.stopPropagation();
		});

	});
	// moved this from setInsight  data to here as the ticks and intermediates are not set properly on load.
	loadLayerTickGroup()

	return viewer;

}

function normalizeString(str) {
    return str.replace(/\s+/g, ' ')
              .replace(/(\s*-\s*)/g, ' - ')
              .trim();
}

function sortLayers(p_layers, sortType, sortInfoName, sortInfoDate) {
    p_layers.forEach(layer => {
        if (layer.Layer_Name) {
            layer.Layer_Name = normalizeString(layer.Layer_Name);
        }
        if (layer.groupName) {
            layer.groupName = normalizeString(layer.groupName);
        }	
    });
	
	p_layers.sort((a, b) => {
		const groupNameA = a.groupName ? a.groupName.toLowerCase() : null;
		const groupNameB = b.groupName ? b.groupName.toLowerCase() : null;
		const dateA = new Date(a.Attached_Date);
		const dateB = new Date(b.Attached_Date);

		const compare = (valA, valB, order = "asc") => {
			const multiplier = order === "desc" ? -1 : 1;
			if (valA < valB) return 1 * multiplier;
			if (valA > valB) return -1 * multiplier;
			return 0;
		};

		const compareGroupNames = (groupNameA, groupNameB, order) => {
			return groupNameA.localeCompare(groupNameB, 'en', { numeric: true }) * (order === "asc" ? 1 : -1);
		};

		if (sortType == "name") {
			var sortName = sortInfoName;
	
			if (!groupNameA && !groupNameB) {
				let result = compare(b.Data_Type, a.Data_Type);
				if (result !== 0) return result;
	
				return compare(a.Layer_Name, b.Layer_Name, sortName === "desc" ? "desc" : "asc");
			}
	
			if (groupNameA && groupNameB) {
				let result = compareGroupNames(groupNameA, groupNameB, sortName);
				if (result !== 0) return result;
	
				return compare(a.Layer_Name, b.Layer_Name, sortName === "desc" ? "desc" : "asc");
	
			}

			if (sortInfoDate) {
				if (groupNameA == groupNameB) {
					return compare(dateA, dateB, sortInfoDate === "desc" ? "desc" : "asc");
				} 
			}

			return groupNameA ? 1 : -1;
		}

		if (sortType == "date") {
			var sortName = sortInfoName;
	
			if (!groupNameA && !groupNameB) {
				let result = compare(b.Data_Type, a.Data_Type);
				if (result !== 0) return result;
			}
	
			if (groupNameA && groupNameB) {
				let result = compareGroupNames(groupNameA, groupNameB, sortName);
				if (result !== 0) return result;
			}

			if (sortInfoDate) {
				if (groupNameA == groupNameB) {
					return compare(dateA, dateB, sortInfoDate === "desc" ? "desc" : "asc");
				} 
			}
		}
	});  
}

var sortInfo = {
    name: 'asc', 
    date: 'asc'
};

$('.sortHandler span.sort').click(function() {
    // Get the visible div to extract the sort value
    var visibleDiv = $(this).find('div:visible');
    var dataSortValue = visibleDiv.attr('date-sort');
    
    if (dataSortValue) {
        var [sortType, sortOrder] = dataSortValue.replace('insightslayer-', '').split(':');
        sortInfo[sortType] = sortOrder;
    }

    var sortType = $(this).find('div:visible').attr('date-sort').split(':')[0].replace('insightslayer-', ''); 

	loadLayers(function (p_layers) {

		sortLayers(p_layers, sortType, sortInfo.name, sortInfo.date);
		
		var parentClassName = {};
		tilesetlist = [];
		var modelOptions = document.getElementById('modelLayerName');
		var layerDiv
		var groupList = document.getElementById('layer');
		$("#layer").html("");
		for (var j = 0; j < p_layers.length; j++) {
			
			if ((p_layers[j].layerGroup || p_layers[j].layerGroup == 0 ) && ( p_layers[j].flagROS == null || p_layers[j].flagROS == 0 )) {
				// scene 2 - to load normal layer group
				if (!document.getElementById('layerUL_' + p_layers[j].layerGroup)) {
					var groupUl = document.createElement('div');
					groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
					groupUl.setAttribute('class', 'groupItem')
					groupUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
					
					var groupLi = document.createElement('div');
					groupLi.setAttribute('class', 'layergroup')
					groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
					
					var groupCheck = document.createElement('input')
					groupCheck.setAttribute('type', 'checkbox')
					groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
					groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
					groupCheck.setAttribute('data', p_layers[j].layerGroup)
					
					parentClassName[p_layers[j].layerGroup] = j;
					groupCheck.setAttribute('class', 'margin-right layerParent layerParent_'+ j);
					groupCheck.setAttribute('data-child', j);
					
					if (p_layers[j].groupView == "1") {
						groupCheck.setAttribute('checked', true)
					}

					var groupLabel = document.createElement('label'); // CREATE LABEL.
					var groupHead = document.createElement('div'); // CREATE DIV.

					var groupDiv = document.createElement('div'); // CREATE DIV.
					groupDiv.setAttribute('class', 'groupHead');
					groupDiv.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
					groupDiv.setAttribute('id', 'layerLi_' + p_layers[j].layerGroup)

					var groupIcon = document.createElement('img'); // CREATE ICON.
					groupIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
					groupIcon.setAttribute('class', 'fileicon');

					
					groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupLabel.setAttribute('class', 'label');
					groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));
					
					groupHead.setAttribute('class', 'group');

					groupDiv.setAttribute('onclick', 'togglelist(this)');
					
					var groupCaret = document.createElement('i'); // CREATE CARET.
					groupCaret.setAttribute('class', 'fa-solid fa-caret-right');

					var groupAsset = document.createElement('i'); // CREATE FLYTO.
					groupAsset.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupAsset.setAttribute('class', 'fa-solid fa-binoculars float');
					groupAsset.setAttribute('onclick', 'flyToGroup(this)');

					groupDiv.appendChild(groupCaret);
					groupDiv.appendChild(groupCheck);
					groupDiv.appendChild(groupLabel);
					groupHead.appendChild(groupDiv);
					groupHead.appendChild(groupUl);
					groupList.appendChild(groupHead);

				}
				layerDiv = groupUl
				flagSearch = true;
			} else if((p_layers[j].groupName )&& ( p_layers[j].subGroupID == null) && ( p_layers[j].flagROS == 1)) {
				// scene 5 - load normal group that have layer without sub group
				if (!document.getElementById('layerUL_' + p_layers[j].layerGroup)) {
					var groupUl = document.createElement('div');
					groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
					groupUl.setAttribute('class', 'groupItem')
					groupUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
					
					var groupLi = document.createElement('div');
					groupLi.setAttribute('class', 'layergroup')
					groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
					
					var groupCheck = document.createElement('input')
					groupCheck.setAttribute('type', 'checkbox')
					groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
					groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
					groupCheck.setAttribute('data', p_layers[j].layerGroup)
					
					parentClassName[p_layers[j].layerGroup] = j;
					groupCheck.setAttribute('class', 'margin-right layerParent layerParent_'+ j);
					groupCheck.setAttribute('data-child', j);
					
					if (p_layers[j].groupView == "1") {
						groupCheck.setAttribute('checked', true)
					}

					var groupLabel = document.createElement('label'); // CREATE LABEL.
					var groupHead = document.createElement('div'); // CREATE DIV.

					var groupDiv = document.createElement('div'); // CREATE DIV.
					groupDiv.setAttribute('class', 'groupHead');
					groupDiv.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
					groupDiv.setAttribute('id', 'layerLi_' + p_layers[j].layerGroup)

					var groupIcon = document.createElement('img'); // CREATE ICON.
					groupIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
					groupIcon.setAttribute('class', 'fileicon');

					 
					groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupLabel.setAttribute('class', 'label');
					groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));
					
					groupHead.setAttribute('class', 'group');

					groupDiv.setAttribute('onclick', 'togglelist(this)');
					
					var groupCaret = document.createElement('i'); // CREATE CARET.
					groupCaret.setAttribute('class', 'fa-solid fa-caret-right');

					var groupAsset = document.createElement('i'); // CREATE FLYTO.
					groupAsset.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
					groupAsset.setAttribute('class', 'fa-solid fa-binoculars float');
					groupAsset.setAttribute('onclick', 'flyToGroup(this)');


					groupDiv.appendChild(groupCaret);
					groupDiv.appendChild(groupCheck);
					groupDiv.appendChild(groupLabel);
					groupHead.appendChild(groupDiv);
					groupHead.appendChild(groupUl);
					groupList.appendChild(groupHead);

				}
				layerDiv = groupUl
				flagSearch = true;			
			} else if((p_layers[j].groupName )&& ( p_layers[j].subGroupID) && ( p_layers[j].flagROS == 1)){
				//scene 4 - load normal group with layer and sub group that want to display as a layer
					if (!document.getElementById('layerUL_' + p_layers[j].layerGroup)) {
						var groupUl = document.createElement('div');
						groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
						groupUl.setAttribute('class', 'groupItem')
						groupUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
						
						var groupLi = document.createElement('div');
						groupLi.setAttribute('class', 'layergroup')
						groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
						
						var groupCheck = document.createElement('input')
						groupCheck.setAttribute('type', 'checkbox')
						groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
						groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
						groupCheck.setAttribute('data', p_layers[j].layerGroup)
						
						parentClassName[p_layers[j].layerGroup] = j;
						groupCheck.setAttribute('class', 'margin-right layerParent layerParent_'+ j);
						groupCheck.setAttribute('data-child', j);
						
						if (p_layers[j].groupView == "1") {
							groupCheck.setAttribute('checked', true)
						}

						var groupLabel = document.createElement('label'); // CREATE LABEL.
						var groupHead = document.createElement('div'); // CREATE DIV.

						var groupDiv = document.createElement('div'); // CREATE DIV.
						groupDiv.setAttribute('class', 'groupHead');
						groupDiv.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
						groupDiv.setAttribute('id', 'layerLi_' + p_layers[j].layerGroup)

						var groupIcon = document.createElement('img'); // CREATE ICON.
						groupIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						groupIcon.setAttribute('class', 'fileicon');

						
						groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
						groupLabel.setAttribute('class', 'label');
						groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));
						
						groupHead.setAttribute('class', 'group');

						groupDiv.setAttribute('onclick', 'togglelist(this)');
						
						var groupCaret = document.createElement('i'); // CREATE CARET.
						groupCaret.setAttribute('class', 'fa-solid fa-caret-right');

						var groupAsset = document.createElement('i'); // CREATE FLYTO.
						groupAsset.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
						groupAsset.setAttribute('class', 'fa-solid fa-binoculars float');
						groupAsset.setAttribute('onclick', 'flyToGroup(this)');


						groupDiv.appendChild(groupCaret);
						groupDiv.appendChild(groupCheck);
						groupDiv.appendChild(groupLabel);
						
						
						groupHead.appendChild(groupDiv);
						groupHead.appendChild(groupUl);
						groupList.appendChild(groupHead);
					}
					
					if (!document.getElementById('layerUL_' + p_layers[j].subGroupID)) {
						var groupSubUl = document.createElement('div');
						groupSubUl.setAttribute('id', 'layerUL_' + p_layers[j].subGroupID)
						groupSubUl.setAttribute('class', 'groupItem')
						groupSubUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
						
						var groupSubLi = document.createElement('div');
						groupSubLi.setAttribute('class', 'layergroup')
						groupSubLi.setAttribute('id', 'layerGroup_' + p_layers[j].subGroupID)
						
						var groupSubChk = document.createElement('input')
						groupSubChk.setAttribute('type', 'checkbox')
						groupSubChk.setAttribute('id', 'checkGroup_' + p_layers[j].subGroupID)
						groupSubChk.setAttribute('onclick', 'groupOnCheck(this)');
						groupSubChk.setAttribute('data', p_layers[j].subGroupID)
						
						parentClassName[p_layers[j].subGroupID] = j;
						groupSubChk.setAttribute('class', 'margin-right groupSub layerParent layerParent_'+ j);
						groupSubChk.setAttribute('data-child', j);
						
						if (p_layers[j].groupView == "1") {
							groupSubChk.setAttribute('checked', true)
						}
		
						var groupSubLabel = document.createElement('label'); // CREATE LABEL.
						var groupSubHead = document.createElement('div'); // CREATE DIV.
		
						var groupSubDiv = document.createElement('div'); // CREATE DIV.
						groupSubDiv.setAttribute('class', 'groupHead');
						groupSubDiv.setAttribute('rel', 'layerUL_' + p_layers[j].subGroupID)
						groupSubDiv.setAttribute('id', 'layerLi_' + p_layers[j].subGroupID)
		
						var groupSubIcon = document.createElement('img'); // CREATE ICON.
						groupSubIcon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						groupSubIcon.setAttribute('class', 'fileicon');
		
						groupSubLabel.setAttribute('for', 'layerGroup_' + p_layers[j].subGroupID);
						groupSubLabel.setAttribute('class', 'label debold');
						groupSubLabel.appendChild(document.createTextNode(p_layers[j].subLayerTitle));
		
						groupSubHead.setAttribute('class', 'group hiddenGroup');

						groupSubDiv.setAttribute('onclick', 'togglelist(this)');
		
						var groupSubAsset = document.createElement('i'); // CREATE FLYTO.
						groupSubAsset.setAttribute('for', 'layerGroup_' + p_layers[j].subGroupID);
						groupSubAsset.setAttribute('class', 'fa-solid fa-binoculars float fa-caret-right');
						groupSubAsset.setAttribute('onclick', 'flyToGroup(this)');
						
						groupSubDiv.appendChild(groupSubChk);
						groupSubDiv.appendChild(groupSubIcon);
						groupSubDiv.appendChild(groupSubLabel);
						groupSubDiv.appendChild(groupSubAsset);
						groupSubHead.appendChild(groupSubDiv);
						groupSubHead.appendChild(groupSubUl);
						var groupHeadStr = groupSubHead.outerHTML;
		
						$('#layerUL_'+p_layers[j].groupID).append(groupHeadStr)
					}
				
			}
			else {
				layerDiv = document.getElementById('layer');
			}
			
			if(p_layers[j].subGroupID == null){
				// scene 1 - to create normal layer without subgroupID
				var ul_li = document.createElement('div'); //CREATE li
				ul_li.setAttribute('id', 'dataID_' + p_layers[j].Data_ID)
				ul_li.setAttribute('class', 'item layerContainer')
				if (!flagSearch) {
					ul_li.setAttribute('class', 'layerSearch item layerContainer');
				}
				var chk = document.createElement('input'); // CREATE CHECK BOX.
				chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
				chk.setAttribute('id', "dataChk_" + p_layers[j].Data_ID); // SET UNIQUE ID.
				chk.setAttribute('onclick', 'layerOnCheck(this)')

				if(parentClassName[p_layers[j].layerGroup]) {
					chk.setAttribute('class', 'layerChild_'+ parentClassName[p_layers[j].layerGroup]);
					chk.setAttribute('data-parent', parentClassName[p_layers[j].layerGroup]);
				}else{
					chk.setAttribute('class', 'layerParent_'+ j);
				}

				if (p_layers[j].Default_View == true || p_layers[j].groupView == true) {
					chk.setAttribute('checked', true);
				}
				var lyr_icon = document.createElement('img');
				lyr_icon.setAttribute('class', 'fileicon');
				lyr_icon.setAttribute('style', 'width: 18px;');

				var outerDiv = document.createElement('div');
				outerDiv.setAttribute('class', 'layerInput');
		
				switch (p_layers[j].Data_Type) {
					case 'KML':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/kml.png');
						lyr_icon.setAttribute('title', 'KML/KMZ');
						break;
					case 'SHP':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/shp.png');
						lyr_icon.setAttribute('title', 'SHP');
						break;
					case 'B3DM': //b3dm
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						lyr_icon.setAttribute('title', 'B3DM');
						break;
				}
		
				chk.setAttribute('name', 'checkbox');
		
				var lbl = document.createElement('a'); // CREATE LABEL.
				lbl.setAttribute('for', p_layers[j].Layer_Name);
				lbl.style.fontSize = 'small';
				lbl.style.whiteSpace = 'nowrap';
		
				// // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
				lbl.appendChild(document.createTextNode(p_layers[j].Layer_Name));
				// //CREATE
				// // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
				ul_li.appendChild(outerDiv)
				outerDiv.appendChild(chk);
				outerDiv.appendChild(lyr_icon);
				outerDiv.appendChild(lbl);
				
				if (p_layers[j].show_metadata == 'true') {
					outerDiv.innerHTML += `<i class='fa-solid fa-circle-info margin-right' onclick='getMetadataDetails(event, "`+p_layers[j].meta_id+`", "`+p_layers[j].Layer_Name+`")'></i>`;
				}
				outerDiv.innerHTML += "<i class='fa-solid fa-binoculars' onclick='flyToLayer(this)'></i>";
				layerDiv.prepend(ul_li)

				// append one more folder level for V3 url
				v3URL = "../" + p_layers[j].Data_URL;

				if (p_layers[j].Data_Type == "KML") {
					var mykml = null
					if (p_layers[j].groupView) {
						if (p_layers[j].groupView == true || p_layers[j].Default_View == true) {
							mykml = LoadKMLData(v3URL)
						}
					} else if (p_layers[j].Default_View == true) {
						mykml = LoadKMLData(v3URL)
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
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
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
						ownerLayerID: p_layers[j].project_id,
						subGroupID: p_layers[j].subGroupID
					});
				} else {
					var mytileset;
					var myurl = p_layers[j].Data_URL;
					var height = p_layers[j].Offset;
					var xoffset = p_layers[j].X_Offset;
					var yoffset = p_layers[j].Y_Offset;
					var longlat = 0;

					var view = '';
					if(p_layers[j].groupView != '1'){
						view = p_layers[j].Default_View
					}
					else{
						view = p_layers[j].groupView
					}
					
					mytileset = LoadB3DMTileset(myurl, height, xoffset, yoffset, view, longlat);
					
					tilesetlist.push({
						id: p_layers[j].Data_ID,
						name: p_layers[j].Layer_Name,
						layerID: p_layers[j].Layer_ID,
						tileset: mytileset,
						type: "tileset",
						offset: p_layers[j].Offset,
						xoffset: p_layers[j].X_Offset,
						yoffset: p_layers[j].Y_Offset,
						defaultView: p_layers[j].groupView || p_layers[j].Default_View,
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
					});
				};

				//add the layers names as options to model form needed when saving models
				var option = document.createElement("option");
				option.text = p_layers[j].Layer_Name;
				option.value = p_layers[j].Layer_ID;
				modelOptions.add(option);
			}else{
				// to create layer with subgroup id
				var ul_li = document.createElement('div'); //CREATE li
				ul_li.setAttribute('id', 'dataID_' + p_layers[j].Data_ID)
				ul_li.setAttribute('class', 'item layerContainer')
				if (!flagSearch) {
					ul_li.setAttribute('class', 'layerSearch item layerContainer');
				}
				var chk = document.createElement('input'); // CREATE CHECK BOX.
				chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
				chk.setAttribute('id', "dataChk_" + p_layers[j].Data_ID); // SET UNIQUE ID.
				chk.setAttribute('onclick', 'layerOnCheck(this)')

				if(parentClassName[p_layers[j].subGroupID]) {
					chk.setAttribute('class', 'layerChild_'+ parentClassName[p_layers[j].subGroupID]);
					chk.setAttribute('data-parent', parentClassName[p_layers[j].subGroupID]);
				}else{
					chk.setAttribute('class', 'layerParent_'+ j);
				}

				if (p_layers[j].Default_View == true || p_layers[j].groupView == true) {
					chk.setAttribute('checked', true);
				}
				var lyr_icon = document.createElement('img');
				lyr_icon.setAttribute('class', 'fileicon');
				lyr_icon.setAttribute('style', 'width: 18px;');

				var outerDiv = document.createElement('div');
				outerDiv.setAttribute('class', 'layerInput');
		
				switch (p_layers[j].Data_Type) {
					case 'KML':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/kml.png');
						lyr_icon.setAttribute('title', 'KML/KMZ');
						break;
					case 'SHP':
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/shp.png');
						lyr_icon.setAttribute('title', 'SHP');
						break;
					case 'B3DM': //b3dm
						lyr_icon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
						lyr_icon.setAttribute('title', 'B3DM');
						break;
				}
		
				chk.setAttribute('name', 'checkbox');
		
				var lbl = document.createElement('a'); // CREATE LABEL.
				lbl.setAttribute('for', p_layers[j].Layer_Name);
				lbl.style.fontSize = 'small';
				lbl.style.whiteSpace = 'nowrap';
		
				// // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
				lbl.appendChild(document.createTextNode(p_layers[j].Layer_Name));
				// //CREATE
				// // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
				ul_li.appendChild(outerDiv);
				outerDiv.appendChild(chk);
				outerDiv.appendChild(lyr_icon);
				outerDiv.appendChild(lbl);
				
				if (p_layers[j].show_metadata == 'true') {
					outerDiv.innerHTML += `<i class='fa-solid fa-circle-info margin-right' onclick='getMetadataDetails(event, "`+p_layers[j].meta_id+`", "`+p_layers[j].Layer_Name+`")'></i>`;
				}
				outerDiv.innerHTML += "<i class='fa-solid fa-binoculars' onclick='flyToLayer(this)'></i>";
				var outerDivLayer = ul_li.outerHTML;
				$('#layerUL_'+p_layers[j].subGroupID).prepend(outerDivLayer)

				// append one more folder level for V3 url
				v3URL = "../" + p_layers[j].Data_URL;

				if (p_layers[j].Data_Type == "KML") {
					var mykml = null
					if (p_layers[j].groupView) {
						if (p_layers[j].groupView == true || p_layers[j].Default_View == true) {
							mykml = LoadKMLData(v3URL)
						}
					} else if (p_layers[j].Default_View == true) {
						mykml = LoadKMLData(v3URL)
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
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
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
						ownerLayerID: p_layers[j].project_id,
						subGroupID: p_layers[j].subGroupID
					});
				} else {
					var mytileset;
					var myurl = p_layers[j].Data_URL;
					var height = p_layers[j].Offset;
					var xoffset = p_layers[j].X_Offset;
					var yoffset = p_layers[j].Y_Offset;
					var longlat = 0;

					var view = '';
					if(p_layers[j].groupView != '1'){
						view = p_layers[j].Default_View
					}
					else{
						view = p_layers[j].groupView
					}
					
					mytileset = LoadB3DMTileset(myurl, height, xoffset, yoffset, view, longlat);
					
					tilesetlist.push({
						id: p_layers[j].Data_ID,
						name: p_layers[j].Layer_Name,
						layerID: p_layers[j].Layer_ID,
						tileset: mytileset,
						type: "tileset",
						offset: p_layers[j].Offset,
						xoffset: p_layers[j].X_Offset,
						yoffset: p_layers[j].Y_Offset,
						defaultView: p_layers[j].groupView || p_layers[j].Default_View,
						url: v3URL,
						groupID: p_layers[j].layerGroup,
						subGroupID: p_layers[j].subGroupID
					});
				};

				//add the layers names as options to model form needed when saving models
				var option = document.createElement("option");
				option.text = p_layers[j].Layer_Name;
				option.value = p_layers[j].Layer_ID;
				modelOptions.add(option);
			}
			
		}

		// prevent parent event trigger on child
		$(".layerParent").click(function(e) {
			e.stopPropagation();
		});

	});

	loadLayerTickGroup()

	return viewer;
})

function loadRiCesiumProcess (homeLocation){

	if(homeLocation !== ""){
		setCesiumLocationProcess(homeLocation);
	}else{
		setCesiumLocation();
	}
	
	viewerNewProcess = new Cesium.Viewer('RIContainerProcess', {
		baseLayerPicker: false,
		timeline: false,
		contextOptions: {
			webgl: { preserveDrawingBuffer: true }
		},
		animation: false,
		geocoder: new MapboxGeocoderService(mapBoxAccessToken),
		homeButton: true,
		sceneModePicker: false,
		imageryProvider: new Cesium.MapboxStyleImageryProvider({
			styleId: 'satellite-v9', 
        	accessToken: mapBoxAccessToken
		}),
		navigationHelpButton: false,
		infoBox: false,
		fullscreenButton: false,
		mapProjection: new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84),
		selectionIndicator: false


	});
	viewerNewProcess.extend(Cesium.viewerCesiumNavigationMixin, {});

	silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
	silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
	silhouetteBlue.uniforms.length = 0.01;
	silhouetteBlue.selected = [];
	viewerNewProcess.scene.postProcessStages.add(
		Cesium.PostProcessStageLibrary.createSilhouetteStage([
			silhouetteBlue
		])
	);

	viewerNewProcess._cesiumWidget._creditContainer.style.display = "none";

	setLeftRightClickFunctionNewProcess(viewerNewProcess); //set the left & right click
	return viewerNewProcess;
}

function loadRiCesiumProcessProj (homeLocation){

	if(homeLocation !== ""){
		setCesiumLocationProcess(homeLocation);
	}else{
		setCesiumLocation();
	}
	
	viewerNewProcess = new Cesium.Viewer('RIContainerProcessProj', {
		baseLayerPicker: false,
		timeline: false,
		contextOptions: {
			webgl: { preserveDrawingBuffer: true }
		},
		animation: false,
		geocoder: new MapboxGeocoderService(mapBoxAccessToken),
		homeButton: true,
		sceneModePicker: false,
		imageryProvider: new Cesium.MapboxStyleImageryProvider({
			styleId: 'satellite-v9', 
        	accessToken: mapBoxAccessToken
		}),
		navigationHelpButton: false,
		infoBox: false,
		fullscreenButton: false,
		mapProjection: new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84),
		selectionIndicator: false


	});
	viewerNewProcess.extend(Cesium.viewerCesiumNavigationMixin, {});

	silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
	silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
	silhouetteBlue.uniforms.length = 0.01;
	silhouetteBlue.selected = [];
	viewerNewProcess.scene.postProcessStages.add(
		Cesium.PostProcessStageLibrary.createSilhouetteStage([
			silhouetteBlue
		])
	);

	viewerNewProcess._cesiumWidget._creditContainer.style.display = "none";

	setLeftRightClickFunctionNewProcess(viewerNewProcess); //set the left & right click
	return viewerNewProcess;
}

function loadRiCesiumManageProj (homeLocation, id){

	if(homeLocation !== ""){
		setCesiumLocationProcess(homeLocation);
	}else{
		setCesiumLocation();
	}
	
	viewerManageProcess = new Cesium.Viewer(id, {
		baseLayerPicker: false,
		timeline: false,
		contextOptions: {
			webgl: { preserveDrawingBuffer: true }
		},
		animation: false,
		geocoder: new MapboxGeocoderService(mapBoxAccessToken),
		homeButton: true,
		sceneModePicker: false,
		imageryProvider: new Cesium.MapboxStyleImageryProvider({
			styleId: 'satellite-v9', 
        	accessToken: mapBoxAccessToken
		}),
		navigationHelpButton: false,
		infoBox: false,
		fullscreenButton: false,
		mapProjection: new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84),
		selectionIndicator: false


	});
	viewerManageProcess.extend(Cesium.viewerCesiumNavigationMixin, {});

	silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
	silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
	silhouetteBlue.uniforms.length = 0.01;
	silhouetteBlue.selected = [];
	viewerManageProcess.scene.postProcessStages.add(
		Cesium.PostProcessStageLibrary.createSilhouetteStage([
			silhouetteBlue
		])
	);

	viewerManageProcess._cesiumWidget._creditContainer.style.display = "none";

	setLeftRightClickFunctionNewProcess(viewerManageProcess); //set the left & right click
	return viewerManageProcess;
}

function destroyCesium(objCesium){
	objCesium.destroy();
    objCesium = null;

}

function loadLayers(callback) {
	$.ajax({
		type: "POST",
		dataType: "JSON",
		async: false,
		url: "../BackEnd/fetchDatav3.php",
		data: { functionName: "getLayersData" },
		success: function (obj) {
			if (obj.data) {
				callback(obj.data);
				loadLayersNewProcess(obj.data);
			}
			else {
				console.log(obj.msg)
			}
		}
	})
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
	xhr.open("POST", "../BackEnd/getLocationsData.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	xhr.send(data);
}

function initializeECW() {
	$("#uploadData_Weekly").html("");
	$("#uploadData_Monthly").html("");
	$("#uploadData_Quarterly").html("");
	var packageOptionsHTML = "";

	if (localStorage.isParent != 'isParent') {
		$("#packageDropdown").html("");
		$("#packageDropdown").prop("disabled", true);
		packageOptionsHTML += `<option data ="${localStorage.p_name}" data-2 ="${localStorage.p_id_name}" value="">${localStorage.p_name}</option>`
		$("#packageDropdown").html(packageOptionsHTML);
		loadECW();
	} else {
		$("#packageDropdown").prop("disabled", false);
		$.ajax({
			url: "../BackEnd/fetchDatav3.php",
			data: { functionName: "getPackageList" },
			type: "POST",
			dataType: "JSON",
			success: function (resp) {
				if (resp.bool === true) {
					packageOptionsHTML += `<option data ="" data-2 ="" value="">Please select</option>`
					if (resp.data.length >= 1) {
						resp.data.forEach((packageData) => {
							packageOptionsHTML += `<option data ="${packageData.project_name}" data-2 ="${packageData.project_id}" value="${packageData.project_id_number}">${packageData.project_name}</option>`
						})
						$("#packageDropdown").html(packageOptionsHTML);
					}
				}
			}
		})
	}
}

function aicNodeHTML(divID, inputID, label, groupFlag = false, parID = '', chdId = '', imgUrl = false){
	var ret = '';
	var dId = (groupFlag) ? divID : divID+'_li';
	var inpClass = '';
	if(parID) inpClass += `layerParent layerParent_${parID}`;
	if(chdId) inpClass += ` layerChild layerChild_${chdId}`;

	var extInputProp = `class="${inpClass}"`;
	if(parID) extInputProp += ` data-child="${parID}"`;
	if(chdId) extInputProp += ` data-parent="${chdId}"`;

	if(groupFlag) {
		ret += `<div class="group">`;
		ret += `<div class="item groupHead" id="${dId}" rel="${divID}_ul" onclick="togglelist(this)">`
		ret += `<i class="fa-solid fa-caret-down"></i>`
		ret += `<input type="checkbox" id="${inputID}" onclick="groupOnCheck(this)" ${extInputProp} name="checkbox" data="${divID}">`
		ret += (SYSTEM == 'KKR') ? `<img class="fileicon" src="../Images/icons/layer_window/ecw.png" title="ECW">` : `<img class="fileicon" src="../Images/icons/layer_window/img.png" title="IMG">`
		ret += `<a class="label">${label}</a>`
		ret += `</div>`
		
		// if group create another ul to append all child
		ret += `<div class="item groupItem" id="${divID}_ul" style="display:block;"></div></div>`
	}else{
		ret += `<div class="item" id="${dId}" data-fileName = "${imgUrl}">`
		ret += `<input type="checkbox" id="${inputID}" onclick="layerOnCheck(this)" ${extInputProp} name="ecwCheckbox">`
		ret += (SYSTEM == 'KKR') ? `<img class="fileicon" src="../Images/icons/layer_window/ecw.png" title="ECW">` : `<img class="fileicon" src="../Images/icons/layer_window/img.png" title="IMG">`
		ret += `<a class="label">${label}</a>`
		ret += (SYSTEM == 'KKR') ? `<i class="fa-solid fa-binoculars" onclick="flyToLayer(this)"></i>` : ``;
		ret += `</div>`
	}

	return ret;
}

function loadECW(aicPackageID, isPackageChanged) {
	$("#uploadData_Weekly").html("");
	$("#uploadData_Monthly").html("");
	$("#uploadData_Quarterly").html("");
	arrAerialEdit = [];
	var parChildLink = {};
	var parChildSubLink = {};
	$.ajax({
		url: "../BackEnd/fetchDatav3.php",
		data: { functionName: "getECWList", packageID: aicPackageID, isPackageChanged: isPackageChanged },
		type: "POST",
		dataType: "JSON",
		success: function (resp) {
			if (resp.bool === true) {
				if (resp.data.length >= 1) {
					var groupListType;
					var groupListName = "";

					var groupHTMLLArr = {};
					var subGroupHTMLLArr = {};

					var aicGLN = ['Weekly', 'Monthly', 'Quarterly'];
					var aicHTMLObj = {
						Weekly:'<div class="groupItem" style="display: block;margin-left: 0px;">',
						Monthly: '<div class="groupItem" style="display: block;margin-left: 0px;">',
						Quarterly:'<div class="groupItem" style="display: block;margin-left: 0px;">'
					};

					var cnt = 1;
					resp.data.forEach((aic) => {
						if (!groupListType || groupListType !== aic.Routine_Type) {
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
						}

						nameUse = (aic.Use_Name) ? new Date(aic.Image_Captured_Date).toDateString() + " (" + aic.Use_Name + ")": new Date(aic.Image_Captured_Date).toDateString();
						imgGroup = aic.Image_Group;
						imgGroupName = aic.groupName;
						var subGrpDivId = '';
						var groupId = "id_" + groupListName;
						if(!imgGroup || imgGroup == ""){
							aicHTMLObj[groupListName] += aicNodeHTML(`ecwID_${aic.AIC_Id}`, `dataChk_ecw_${aic.AIC_Id}`, nameUse, false, cnt, '', aic.Image_URL);
						}else{
							// create group node
							var dvPrepend = `${imgGroup}_${groupListName}`;
							var dvID = `ecwID_${dvPrepend}`;
							if (!parChildLink[imgGroupName]) parChildLink[imgGroupName] = cnt;
							
							if(!groupHTMLLArr[dvID+"_ul"]) {
								parChildLink[imgGroupName] = cnt;

								aicHTMLObj[groupListName] += aicNodeHTML(dvID, `dataChk_ecw_${dvPrepend}`, imgGroupName, true, cnt, '', false);
								groupHTMLLArr[dvID+"_ul"] = [];
							}
							// if has subgroup 
							if(aic.subGroupName){
								subGrpDivId = dvID + `_${aic.subGroupID}`;

								if(!subGroupHTMLLArr[subGrpDivId+"_ul"]){
									cnt++
									if (!parChildSubLink[imgGroupName + aic.subGroupName]) parChildSubLink[imgGroupName + aic.subGroupName] = cnt;
									groupHTMLLArr[dvID+"_ul"].push(aicNodeHTML(subGrpDivId, `dataChk_ecw_${dvPrepend}_${aic.subGroupID}`, aic.subGroupName, true, parChildSubLink[imgGroupName + aic.subGroupName], parChildLink[imgGroupName], false));
									subGroupHTMLLArr[subGrpDivId+"_ul"] = [];
								}

								subGroupHTMLLArr[subGrpDivId+"_ul"].push(aicNodeHTML(`ecwID_${aic.AIC_Id}`, `dataChk_ecw_${aic.AIC_Id}`, nameUse, false, '', parChildSubLink[imgGroupName + aic.subGroupName], aic.Image_URL));

							}else{
								groupHTMLLArr[dvID+"_ul"].push(aicNodeHTML(`ecwID_${aic.AIC_Id}`, `dataChk_ecw_${aic.AIC_Id}`, nameUse, false, '', parChildLink[imgGroupName], aic.Image_URL));
							}
							if(dvID != undefined){
								groupId = dvID;
							}
						}

						tilesetlist.push({
							id: "ecw_" + aic.AIC_Id,
							name: aic.Image_Captured_Date,
							tileset: null,
							type: "aerial",
							defaultView: false,
							url: aic.Image_URL,
							groupID: groupId,
							subGroupID: subGrpDivId,
							ownerLayerID: aic.project_id
						});

						arrAerialEdit.push({
							id: aic.AIC_Id,
							groupType: groupListName,
							name: aic.Use_Name,
							fileName: aic.Image_URL,
							uploadDate: aic.Registered_Date,
							capturedDate: aic.Image_Captured_Date
						})

						cnt++;
					})

					aicGLN.forEach(el => {
						aicHTMLObj[el] += "</div>";
						$("#uploadData_"+el).html(aicHTMLObj[el])
					});

					for (const k in groupHTMLLArr) {
						groupHTMLLArr[k].forEach(function(ele, idx){
							$("#"+k).append(ele)
						})
					}

					for (const j in subGroupHTMLLArr) {
						subGroupHTMLLArr[j].forEach(function(e, i){
							$("#"+j).append(e)
						})
					}

					$(".layerParent").click(function(e) {
						e.stopPropagation();
					});
					
				} else {
					console.log("No AIC data")
				}
			} else {
				$("#uploadData_Weekly").html("");
				$("#uploadData_Monthly").html("");
				$("#uploadData_Quarterly").html("");
				$.alert({
					boxWidth: "30%",
					useBootstrap: false,
					title: "Alert",
					content: "No AIC Image Records Found",
				});
				console.log(resp.msg)
			}
		}
	})
}

function setInsight(){
	//getWMSCap()

	setCesiumLocation(); //set the position of the cesium based on the longitude and latitude
	loadInsightData();
	//loadLayerTickGroup()
	if(localStorage.Project_type == 'FM'){
		loadAndCheckIoTData();
	}
}

function loadInsightData() {
	//load layers loads all the layers for the project. moving this to loadRICesium as the default layers 
	//are not loaded as there seems to be a diconnect of the viewer to load the layers to the viewer initiated in loadRI Cesium.
	// loadLayers(function (p_layers) {
	// 	var parentClassName = {};
	// 	tilesetlist = [];
	// 	var modelOptions = document.getElementById('modelLayerName');
	// 	var layerDiv
	// 	var groupList = document.getElementById('layer');
	// 	$("#layer").html("");
	// 	for (var j = 0; j < p_layers.length; j++) {
	// 		if (p_layers[j].layerGroup || p_layers[j].layerGroup == 0) {
	// 			if (!document.getElementById('layerUL_' + p_layers[j].layerGroup)) {
	// 				var groupUl = document.createElement('div');
	// 				groupUl.setAttribute('id', 'layerUL_' + p_layers[j].layerGroup)
	// 				groupUl.setAttribute('class', 'groupItem')
	// 				groupUl.setAttribute('style', 'margin-top: 0px;margin-bottom: 0px;');
					
	// 				var groupLi = document.createElement('div');
	// 				groupLi.setAttribute('class', 'layergroup')
	// 				groupLi.setAttribute('id', 'layerGroup_' + p_layers[j].layerGroup)
					
	// 				var groupCheck = document.createElement('input')
	// 				groupCheck.setAttribute('type', 'checkbox')
	// 				groupCheck.setAttribute('id', 'checkGroup_' + p_layers[j].layerGroup)
	// 				groupCheck.setAttribute('onclick', 'groupOnCheck(this)');
	// 				groupCheck.setAttribute('data', p_layers[j].layerGroup)
					
	// 				parentClassName[p_layers[j].layerGroup] = j;
	// 				groupCheck.setAttribute('class', 'layerParent layerParent_'+ j);
	// 				groupCheck.setAttribute('data-child', j);
					
	// 				if (p_layers[j].groupView == "1") {
	// 					groupCheck.setAttribute('checked', true)
	// 				}
	// 				var groupLabel = document.createElement('label'); // CREATE LABEL.
	// 				groupLabel.setAttribute('for', 'layerGroup_' + p_layers[j].layerGroup);
	// 				groupLabel.setAttribute('class', 'label');
	// 				groupLabel.appendChild(document.createTextNode(p_layers[j].groupName));

	// 				var groupHead = document.createElement('div'); // CREATE DIV.
	// 				groupHead.setAttribute('class', 'group');

	// 				var groupDiv = document.createElement('div'); // CREATE DIV.
	// 				groupDiv.setAttribute('class', 'groupHead');
	// 				groupDiv.setAttribute('rel', 'layerUL_' + p_layers[j].layerGroup)
	// 				groupDiv.setAttribute('id', 'layerLi_' + p_layers[j].layerGroup)
	// 				groupDiv.setAttribute('onclick', 'togglelist(this)');
					
	// 				var groupCaret = document.createElement('i');
	// 				groupCaret.setAttribute('class', 'fa-solid fa-caret-right');
					
	// 				groupDiv.appendChild(groupCaret);
	// 				groupDiv.appendChild(groupCheck);
	// 				groupDiv.appendChild(groupLabel);
	// 				groupHead.appendChild(groupDiv)
	// 				groupHead.appendChild(groupUl)
	// 				groupList.appendChild(groupHead)

	// 			}
	// 			layerDiv = groupUl
	// 			flagSearch = true;
	// 		}
	// 		else {
	// 			layerDiv = document.getElementById('layer');
	// 		}
	
	// 		var ul_li = document.createElement('div'); //CREATE li
	// 		ul_li.setAttribute('id', 'dataID_' + p_layers[j].Data_ID)
	// 		ul_li.setAttribute('class', 'item layerContainer')
	// 		if (!flagSearch) {
	// 			ul_li.setAttribute('class', 'layerSearch item layerContainer');
	// 		}
	// 		var chk = document.createElement('input'); // CREATE CHECK BOX.
	// 		chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
	// 		chk.setAttribute('id', "dataChk_" + p_layers[j].Data_ID); // SET UNIQUE ID.
	// 		chk.setAttribute('onclick', 'layerOnCheck(this)')

	// 		if(parentClassName[p_layers[j].layerGroup]) {
	// 			chk.setAttribute('class', 'layerChild_'+ parentClassName[p_layers[j].layerGroup]);
	// 			chk.setAttribute('data-parent', parentClassName[p_layers[j].layerGroup]);
	// 		}else{
	// 			chk.setAttribute('class', 'layerParent_'+ j);
	// 		}

	// 		if (p_layers[j].Default_View == true || p_layers[j].groupView == true) {
	// 			chk.setAttribute('checked', true);
	// 		}
	// 		var lyr_icon = document.createElement('img');
	// 		lyr_icon.setAttribute('class', 'fileicon');
	// 		lyr_icon.setAttribute('style', 'width: 18px;');

	// 		var outerDiv = document.createElement('div');
	// 		outerDiv.setAttribute('class', 'layerInput');
	
	// 		switch (p_layers[j].Data_Type) {
	// 			case 'KML':
	// 				lyr_icon.setAttribute('src', '../Images/icons/layer_window/kml.png');
	// 				lyr_icon.setAttribute('title', 'KML/KMZ');
	// 				break;
	// 			case 'SHP':
	// 				lyr_icon.setAttribute('src', '../Images/icons/layer_window/shp.png');
	// 				lyr_icon.setAttribute('title', 'SHP');
	// 				break;
	// 			case 'B3DM': //b3dm
	// 				lyr_icon.setAttribute('src', '../Images/icons/layer_window/b3dm.png');
	// 				lyr_icon.setAttribute('title', 'B3DM');
	// 				break;
	// 		}
	
	// 		chk.setAttribute('name', 'checkbox');
	
	// 		var lbl = document.createElement('a'); // CREATE LABEL.
	// 		lbl.setAttribute('for', p_layers[j].Layer_Name);
	// 		lbl.style.fontSize = 'small';
	// 		lbl.style.whiteSpace = 'nowrap';
	
	// 		// // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
	// 		lbl.appendChild(document.createTextNode(p_layers[j].Layer_Name));
	// 		// //CREATE
	// 		// // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
	// 		ul_li.appendChild(outerDiv)
	// 		outerDiv.appendChild(chk);
	// 		outerDiv.appendChild(lyr_icon);
	// 		outerDiv.appendChild(lbl);
			
	// 		if (p_layers[j].show_metadata == 'true') {
	// 			outerDiv.innerHTML += `<i class='fa-solid fa-circle-info margin-right' onclick='getMetadataDetails(event, "`+p_layers[j].meta_id+`", "`+p_layers[j].Layer_Name+`")'></i>`;
	// 		}
	// 		outerDiv.innerHTML += "<i class='fa-solid fa-binoculars' onclick='flyToLayer(this)'></i>";
	// 		layerDiv.prepend(ul_li)

	// 		// append one more folder level for V3 url
	// 		v3URL = "../" + p_layers[j].Data_URL;

	// 		if (p_layers[j].Data_Type == "KML") {
	// 			var mykml = null
	// 			//******* not loading the KML here as it is not getting loaded correctly. so if default view and user clicks for 
	// 			//fly to then we load the KML and fly******** Line 4202 */


	// 			// if (p_layers[j].groupView) {
	// 			// 	if (p_layers[j].groupView == true || p_layers[j].Default_View == true) {
	// 			// 		mykml = LoadKMLData(v3URL)
	// 			// 	}
	// 			// } else if (p_layers[j].Default_View == true) {
	// 			// 	mykml = LoadKMLData(v3URL)
	// 			// 	landThematic.push({
	// 			// 		id: p_layers[j].Data_ID,
	// 			// 		name: p_layers[j].Layer_Name,
	// 			// 	});
	// 			// }
	
	// 			tilesetlist.push({
	// 				id: p_layers[j].Data_ID,
	// 				name: p_layers[j].Layer_Name,
	// 				layerID: p_layers[j].Layer_ID,
	// 				tileset: mykml,
	// 				type: "kml",
	// 				offset: p_layers[j].Offset,
	// 				defaultView: p_layers[j].groupView || p_layers[j].Default_View,
	// 				url: v3URL,
	// 				groupID: p_layers[j].layerGroup
	// 			});
	
	// 		} else if (p_layers[j].Data_Type == "SHP") {
	// 			var wms = null;
	// 			if (p_layers[j].Default_View == true) {
	// 				wms = LoadWMSTile(p_layers[j].project_id, p_layers[j].Data_URL, p_layers[j].Style)
	// 			}
	
	// 			tilesetlist.push({
	// 				id: p_layers[j].Data_ID,
	// 				name: p_layers[j].Layer_Name,
	// 				layerID: p_layers[j].Layer_ID,
	// 				tileset: wms,
	// 				style: p_layers[j].Style,
	// 				type: "shp",
	// 				offset: p_layers[j].Offset,
	// 				defaultView: p_layers[j].groupView || p_layers[j].Default_View,
	// 				url: p_layers[j].Data_URL,
	// 				groupID: p_layers[j].layerGroup,
	// 				ownerLayerID: p_layers[j].project_id
	// 			});
	// 		} else {
	// 			var mytileset;
	// 			var myurl = p_layers[j].Data_URL;
	// 			var height = p_layers[j].Offset;
	// 			var longlat = 0;

	// 			var view = '';
	// 			if(p_layers[j].groupView != '1'){
	// 				view = p_layers[j].Default_View
	// 			}
	// 			else{
	// 				view = p_layers[j].groupView
	// 			}
				
	// 			mytileset = LoadB3DMTileset(myurl, height, view, longlat);
				
	// 			tilesetlist.push({
	// 				id: p_layers[j].Data_ID,
	// 				name: p_layers[j].Layer_Name,
	// 				layerID: p_layers[j].Layer_ID,
	// 				tileset: mytileset,
	// 				type: "tileset",
	// 				offset: p_layers[j].Offset,
	// 				defaultView: p_layers[j].groupView || p_layers[j].Default_View,
	// 				url: v3URL,
	// 				groupID: p_layers[j].layerGroup
	// 			});
	// 		};

	// 		//add the layers names as options to model form needed when saving models
	// 		var option = document.createElement("option");
	// 		option.text = p_layers[j].Layer_Name;
	// 		option.value = p_layers[j].Layer_ID;
	// 		modelOptions.add(option);
	// 	}

	// 	// prevent parent event trigger on child
	// 	$(".layerParent").click(function(e) {
	// 		e.stopPropagation();
	// 	});

	// });

	LoadLocationData(function (response) {
		// all the saved data is loaded at the start of the application
		var data = JSON.parse(response);
		locations = data.locations;
		locationList.push({
			id: "regions",
			parent: "#",
			text: "Regions"
		});	
		infoLocationList = [];
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
			desc += '<tr><th>' + "Longitude : </th><td>" + lon + '</td></tr>';
			desc += '<tr><th>' + "Latitude : </th><td>" + lat + '</td></tr>';
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
				'cache': false,
				'check_callback': true
			},
			'plugins': ["sort"]
		});
		getInfoRootNode();
	});

	LoadAnnotateData(function (myResponse) {
		// all the saved Annotate data for the current project is loaded at the start of the application
		var actual_JSON = JSON.parse(myResponse);
		myModels = actual_JSON.data;
		var markAssetListHTML = ''
		
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

			markAssetListHTML += `<div class="list" onclick="OnClickAssetDataTable(this, event)" data-index="${i}" data-name="${myModels[i].AssetName}" data-id="${myModels[i].AssetID}" data-type="${myModels[i].BuildingType}" data-owner="${myModels[i].BuildingOwner}">`
			markAssetListHTML += `<div class="column1" rel="id-layer_${myModels[i].AssetID}"><a class="label">${myModels[i].AssetName}</a></div>`
			markAssetListHTML += `<div class="column2 width"><a class="label">${myModels[i].BuildingType}</a></div>`
			markAssetListHTML += `<div class="column2 width"><a class="label">Default: ${myModels[i].AssetSLA}</a></div>`
			markAssetListHTML += `</div>`
		}
		
		$("#markAssetList").html(markAssetListHTML);
	
	});

	$('#rootNode').on("select_node.jstree", function (e, data) {
		//need this to remove all other tabs if clicked on it the first time

		var nodeId = data.node.id;
		selectedNodeId = data.node.id;

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
                movePosition = p
				cameraClickPosition = {
					lon: locations[i].longitude,
					lat: locations[i].latitude,
					alt: 0
				};

				viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(locations[i].longitude, locations[i].latitude, 2000.0),
					duration: 2
				});

				if(pickedFeature){
					floatboxV3TurnON(stringName, pickedFeature.id._description._value);
				}
				break;
			};
			i++;
		};
	});
}

function loadLayerTickGroup(){

	var flagCheck;
	var flagUnCheck;

	$('#navBoxLayer .layer .groupItem#layer').find('.group').each(function (){
		if($(this).children('.groupItem')){
			$(this).children('.groupItem').each(function (){
				flagCheck = false;
				flagUnCheck = false;
				$(this).children().each(function (){
					if(!flagCheck){
						if($(this).find('input').prop('checked') == true){
							flagCheck = true;
						}
					}

					if(!flagUnCheck){
						if($(this).find('input').prop('checked') == false){
							flagUnCheck = true;
						}
					}
				})
			})
		}

		if(flagCheck == true){
			if(flagUnCheck == true){
				$(this).children('.groupHead').find('input').prop("indeterminate", true)
				$(this).children('.groupHead').find('input').prop("checked", false)
			}else{
				$(this).children('.groupHead').find('input').prop("indeterminate", false)
				$(this).children('.groupHead').find('input').prop("checked", true)
			}
		}else{
			$(this).children('.groupHead').find('input').prop("indeterminate", false)
			$(this).children('.groupHead').find('input').prop("checked", false)
		}
	})
};

function loadLayersNewProcess(p_layers) {
	tilesetlistNewProcess = [];
	$("#layerOptionNewProcess1").html("");
	$("#layerOptionNewProcess").html("");

	var layerDivNewProcess =
        `<option value="default">Please Choose</option>`

	for (var j = 0; j < p_layers.length; j++) {
		if(!((p_layers[j].Data_Type == "KML") || (p_layers[j].Data_Type == "SHP"))) continue;

		layerDivNewProcess +=
		`<option value = "dataChk_`+p_layers[j].Data_ID+`">`+p_layers[j].Layer_Name+`</option>`

		// append one more folder level for V3 url
		v3URL = "../" + p_layers[j].Data_URL;

		if (p_layers[j].Data_Type == "KML") {
			var mykml = null
			tilesetlistNewProcess.push({
				id: p_layers[j].Data_ID,
				name: p_layers[j].Layer_Name,
				layerID: p_layers[j].Layer_ID,
				tileset: mykml,
				type: "kml",
				offset: p_layers[j].Offset,
				defaultView: p_layers[j].groupView || p_layers[j].Default_View,
				url: v3URL,
				groupID: p_layers[j].layerGroup
			});

		} else if (p_layers[j].Data_Type == "SHP") {
			var wms = null;
			tilesetlistNewProcess.push({
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
		};
	}


	$('.projectProcessContainer #layerOptionNewProcess1').html(layerDivNewProcess);
	$('.projectProcessContainer #layerOptionNewProcess').html(layerDivNewProcess);

};

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


var activeShapePoints = [];
var activeShape;
var floatingPoint;
var point;

function createPoint(worldPosition) {
	var point = viewer.entities.add({
	  position: worldPosition,
	  point: {
		color: Cesium.Color.WHITE,
		pixelSize: 5,
		heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
	  },
	});
	return point;
}

let drawingMode = "line";
function drawShape(positionData) {
	let shape;
	if (drawOnlyFlagMarkupTool === "btn_line") {
		shape = viewer.entities.add({
			polyline: {
				positions: positionData,
				clampToGround: true,
				width: 3,
				material: new Cesium.ColorMaterialProperty(
				Cesium.Color.WHITE.withAlpha(0.2)
				),
			},
		});
	} else if (drawOnlyFlagMarkupTool === "btn_polygon") {
		shape = viewer.entities.add({
			polygon: {
				hierarchy: positionData,
				material: new Cesium.ColorMaterialProperty(
				Cesium.Color.WHITE.withAlpha(0.2)
				),
			},
		});
	}
	return shape;
}

function drawTempLine(cartesian, type){
	if (Cesium.defined(cartesian)) {
		if (activeShapePoints.length === 0) {
			floatingPoint = createPoint(cartesian);
		  	activeShapePoints.push(cartesian);
		  	const dynamicPositions = new Cesium.CallbackProperty(function () {
				if (type === "btn_polygon") {
					return new Cesium.PolygonHierarchy(activeShapePoints);
				}
			
				return activeShapePoints;
		  }, false);
		  activeShape = drawShape(dynamicPositions);
		}
		activeShapePoints.push(cartesian);
		createPoint(cartesian);
	}
}

function setLeftRightClickFunction(viewer){
	floatboxV3TurnOFF()

	// Information about the currently selected feature
	selected = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	let theme = localStorage.themeJoget
	let bgColor, textColor

	if(theme == 'matcha'){
		bgColor = Cesium.Color.LIGHTYELLOW,
		textColor = Cesium.Color.BLACK;
	}else if(theme == 'darling'){
		bgColor = Cesium.Color.ANTIQUEWHITE,
		textColor = Cesium.Color.DARKRED ;
	}else if(theme == 'laser'){
		bgColor = Cesium.Color.MIDNIGHTBLUE ,
		textColor = Cesium.Color.MEDIUMVIOLETRED  ;
	}else{
		bgColor = Cesium.Color.WHITE ,
		textColor = Cesium.Color.BLACK ;
	}

	//for point, area & distance
	for (var i = 0; i < 3; i++) {
		labelEntity.push(viewer.entities.add({
			label: {
				show: false,
				showBackground: true,
				backgroundColor: bgColor,
				font: '16px Helvetica',
				fillColor: textColor,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
				verticalOrigin: Cesium.VerticalOrigin.TOP,
				pixelOffset: new Cesium.Cartesian2(15, 0),
				outlineColor : textColor,
				outlineWidth : 1,
				style : Cesium.LabelStyle.FILL_AND_OUTLINE
			}
		}));
	};

	document.oncontextmenu = function (event) {
		event.preventDefault();
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
		} else if(flagMeasure){
			
		}else if (flagMarkupTools) {

			
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

			if (Cesium.defined(floatingPoint)) {
				const newPosition = viewer.camera.pickEllipsoid(movement.endPosition);
				if (Cesium.defined(newPosition)) {
				  floatingPoint.position.setValue(newPosition);
				  activeShapePoints.pop();
				  activeShapePoints.push(newPosition);
				}
			}
		}

	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
		silhouetteBlue.selected = [];
		floatboxV3TurnOFF()

		if (flagDraw) {

			var cartesian = viewer.scene.pickPosition(movement.position);
			pickedFeature = viewer.scene.pick(movement.position);

			if (Cesium.defined(cartesian)) {
				
				//TO NOT ALLOW WHEN USER CLICK OTHER THAN B3DM
				var b3dmFile = (pickedFeature && pickedFeature.tileset && pickedFeature.tileset.url) ? pickedFeature.tileset.url.includes('3DTiles') : false;

				if(b3dmFile){

					//REMOVING THUMBTACK AND BLUE DRAWING FROM MARK ASSET
					if(tempMarkAssetPin){
						viewer.scene.primitives.remove(tempModel); //remove the drawing
						viewer.entities.removeById(tempMarkAssetPin.id);
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
					var cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
					var lon = Cesium.Math.toDegrees(cartographicPosition.longitude);
					var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
					var hei = cartographicPosition.height;

					tempMarkAssetPin = addBillboard(lon, lat, hei);
					var x = cartesian.x;
					var y = cartesian.y;
					var z = cartesian.z;

					var myid = $('[name="shape"]:checked').prop('id');
	
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

					if (myid == "radioelipsoid") {
						tempModel = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
							geometryInstances: new Cesium.GeometryInstance({
								geometry: new Cesium.EllipsoidGeometry({
									radii: new Cesium.Cartesian3(2.5, 2.8, 2.9)
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
					}
				}
				
			};
		} else if (flagMeasure) {

			//for 2D positioning
			var cartographicPosition, cartesian;
			pickedFeature = viewer.scene.pick(movement.position);
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

				countArray++;
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
					var terrainProvider = new Cesium.CesiumTerrainProvider({
						url: "https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=Qof37tl3Ljtd3tH2VgbV",
						credit: new Cesium.Credit(
							'<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> ' +
							'<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
						),
						requestVertexNormals: true
					});

					var positions = [
						Cesium.Cartographic.fromDegrees(lon, lat)
					];
					var promise = Cesium.sampleTerrain(terrainProvider, 11, positions);
					Cesium.when(promise, function (updatedPositions) {
						pickedFeature = viewer.scene.pick(movement.position);
						if (Cesium.defined(pickedFeature)) {
							labelEntity[positionCounter - 1].position = cartesian;
							labelEntity[positionCounter - 1].label.show = true;
							labelEntity[positionCounter - 1].label.text =
								'Lon: ' + lon + '\u00B0' +
								'\nLat: ' + lat + '\u00B0' +
								'\nHeight: ' + hei.toFixed(3) + ' m' +
								'\nTerrain Height :' + positions[0].height.toFixed(3) + 'm';

							measureDataArr.push({
								no: countArray,
								tag: 'Point',
								Lon: lon + '\u00B0',
								Lat: lat + '\u00B0',
								Height: hei.toFixed(3) + ' m',
								Terrain: + positions[0].height.toFixed(3) + ' m'
							});

						} else {
							labelEntity[positionCounter - 1].position = cartesian;
							labelEntity[positionCounter - 1].label.show = true;
							labelEntity[positionCounter - 1].label.disableDepthTestDistance = Number.POSITIVE_INFINITY
							labelEntity[positionCounter - 1].label.text =
								'Lon: ' + lon + '\u00B0' +
								'\nLat: ' + lat + '\u00B0' +
								'\nTerrain Height :' + positions[0].height.toFixed(3) + ' m';

							measureDataArr.push({
								no: countArray,
								tag: 'Point',
								Lon: lon + '\u00B0',
								Lat: lat + '\u00B0',
								Height: '-',
								Terrain: + positions[0].height.toFixed(3) + ' m'
							});
						};
						addMeasureDataList();
					});
				} else if (MeasureTool == "Distance") {
					distanceEntity += 1;
					addmeasureBillboard(lon, lat, hei);
					if (distanceEntity == 1) {
						point1 = cartesian;
					} else {
						var mydistance = Math.sqrt(Math.pow((point1.x - cartesian.x), 2) + Math.pow((point1.y - cartesian.y), 2) + Math.pow((point1.z - cartesian.z), 2));
						distance += mydistance;
						var heiDiff = Math.abs(point1.y - cartesian.y);
						labelEntity[0].position = cartesian;
						labelEntity[0].label.show = true;
						labelEntity[0].label.text =
							'Distance : ' + mydistance.toFixed(3) + ' m' +
							'\nHeight difference : ' + heiDiff.toFixed(3) + ' m' +
							'\nTotal Distance : ' + distance.toFixed(3) + ' m';

						measureDataArr.push({
							no: countArray,
							tag: 'Distance',
							Distance: mydistance.toFixed(3) + ' m',
							diffHeight: heiDiff.toFixed(3) + ' m',
							ttlDistance: distance.toFixed(3) + ' m'
						});
						var mypos = [];
						mypos[0] = point1;
						mypos[1] = cartesian;
						distancePolyLine(mypos);
						point1 = cartesian;
						addMeasureDataList();
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
					addBillboardMarkupTool(coordsArrayMarkupTool);
				} else if (drawOnlyFlagMarkupTool == 'btn_line') {
					if (checkCompleteDraw) {
						checkCompleteDraw = false;
					}
					arrayOfCartesianMarkupTool.push(cartographic);
					drawFlagMarkupTool = 'line';
					drawMarkupTool(drawFlagMarkupTool, cartesian)
				} else if (drawOnlyFlagMarkupTool == 'btn_polygon') {
					if (checkCompleteDraw) {
						checkCompleteDraw = false;
					}
					arrayOfCartesianMarkupTool.push(cartographic);
					drawFlagMarkupTool = 'polygon';
					drawMarkupTool(drawFlagMarkupTool, cartesian)
				} else if (drawOnlyFlagMarkupTool == 'btn_text') {
					addLabelMarkupTool(coordsArrayMarkupTool);
				} else if (drawOnlyFlagMarkupTool == 'btn_delete') {
					pickedFeature = viewer.scene.pick(movement.position);
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

			pickedFeature = viewer.scene.pick(movement.position);

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
							floatboxV3TurnON(features[0].imageryLayer._imageryProvider._layers, features[0].description);
						}
					});
				}

				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				if (modFlag) { //in B3DM (asset table in general)
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
					if(!pickedFeature.id._billboard._image._value.includes("Images/" )){
						getRequestBimAttr(pickedFeature.id._name, "road")
					}
				}
			}
			catch(err) { 
				console.log("not centreline")
			}

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
			}
			else {
				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				stringName;
				var localFlag = false;
				var j = 0;
				while (j < videoPinData.length) { //check for video PIN
					if (pickedFeature.id._name == videoPinData[j].videoPinName) {
						var videoContainer = document.getElementById("videoContainer");
						//compare #videoframe active or inactive 
						if (!$('#videoframe').hasClass('active')) {
							if (videoPinData[j].videoType == 0) {
								videoContainer.innerHTML = "\
						<video style='height:100%; width: 100%; object-fit: cover; z-index: -100;' controls>\
							<source id='source'  src='../../" + encodeURI(videoPinData[j].videoURL) + "' type ='video/mp4'>\
						</video>"
								$(videoContainer).attr("dataType", "0")
								var myVideo = $(videoContainer).find("video")[0]
								myVideo.load();
								myVideo.play();
							} else {	//embed link
								$(videoContainer).attr("dataType", "1")
								$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
							}
							
							openWizardModalContainer('insight', 'viPage', 70, 75);
							$(".viPage").addClass('active');
							$(".modal-header a").html("Play Video");
							$("#videoframe").addClass('active').attr("style", "display:block");
							playVideoPin(true)
						} else {
							if ($(videoContainer).attr("dataType") == videoPinData[j].videoType) { //check if video format is same
								if (videoPinData[j].videoType == 0) {
									var videoSource = $(videoContainer).find("source")[0]
									var videoSrcArry = videoSource.src.toString().split("/");
									var videoSrc = videoSrcArry[videoSrcArry.length - 4] + "/" + videoSrcArry[videoSrcArry.length - 3] + "/" + videoSrcArry[videoSrcArry.length - 2] + "/" + videoSrcArry[videoSrcArry.length - 1]
									//if user intend to change video
									if (videoSrc !== videoPinData[j].videoURL) {
										videoSource.src = '../../'+videoPinData[j].videoURL
										var myVideo = $(videoContainer).find("video")[0]
										myVideo.load();
										myVideo.play();

										//open wizard
										openWizardModalContainer('insight', 'viPage', 70, 75)
										$(".viPage").addClass('active');
										$("#videoframe").addClass('active');
										playVideoPin(true)
									} else { //pause video and close frame
										$("#videoframe.active").removeClass('active');
										playVideoPin(false)
										var myVideo = $(videoContainer).find("video")[0]
										if (myVideo !== undefined) {
											myVideo.pause()
										}
									}
								} else {
									$(videoContainer).attr("dataType", "1")
									$(videoContainer).html(`<iframe style="width:100%; height:100%;" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
							
									//open wizard
									openWizardModalContainer('insight', 'viPage', 70, 75)
									$(".viPage").addClass('active');
									$("#videoframe").addClass('active').attr("style", "display:block");
									playVideoPin(true)
								}

							} else { //video format not same

								if ($(videoContainer).attr("dataType") == 0) { // if loaded is mp4 && user intend to change video
									videoContainer.innerHTML = videoPinData[j].videoURL
									$(videoContainer).attr("dataType", "1")
								} else { //if loaded is embedded
									videoContainer.innerHTML = "\
									<video style='height:100%; width: 100%; object-fit: cover; z-index: -100;' controls>\
										<source id='source'  src=" + encodeURI(videoPinData[j].videoURL) + " type ='video/mp4'>\
									</video>"
									$(videoContainer).attr("dataType", 0)
									var myVideo = $(videoContainer).find("video")[0]
									myVideo.load();
									myVideo.play();
								}
							}
						}
						localFlag = true;
						return;
					};
					j++;

				}
				let z = 0;
				while (z < earthPinData.length) { //check for video PIN
					if (pickedFeature.id._name == earthPinData[z].imagePinName) {
						earth360(earthPinData[z].imageURL, earthPinData[z].longitude, earthPinData[z].latitude, earthPinData[z].height, earthPinData[z].initHeading);
						return;
					};
					z++;
				}
				if (!localFlag) { //check for locations
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

							movePosition = movement.position;

							$('#rootNode').jstree('select_node', stringName);
							$('#rootNode').jstree(true).redraw();

							var scene = viewer.scene;
							var p3d = Cesium.Cartesian3.fromDegrees(locations[i].longitude, locations[i].latitude, 100);
							var p = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, p3d);
							if (!p) {
								return;
							}
							movePosition = p;
							
							floatboxV3TurnON(stringName, pickedFeature.id._description._value);
							
							return;
						};
						i++;
					};
				};
				if (!localFlag) { //check for model data
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
							var myDesc = '<table ><tbody >';
							myDesc += '<tr><th>' + "Asset Type : </th><td>" + myModels[i].BuildingType + '</td></tr>';
							myDesc += '<tr><th>' + "Asset Owner : </th><td>" + myModels[i].BuildingOwner + '</td></tr>';
							myDesc += '<tr><th>' + "Asset ID : </th><td>" + myModels[i].AssetID + '</td></tr>';
							myDesc += '<tr><th>' + "Asset Name : </th><td>" + myModels[i].AssetName + '</td></tr>';
							myDesc += '<tr><th>' + "Asset SLA : </th><td>" + myModels[i].AssetSLA + '</td></tr>';
							myDesc += '</tbody></table>';

							$("#floatbox-tabs").children().each(function () {
								if ($(this).is(":contains('Bar Chart')") || $(this).is(":contains('Line Chart')") || $(this).is(":contains('Data Table')") || $(this).is(":contains('Chart')") || $(this).is(":contains(Progress')") || $(this).is(":contains('Land')")) {
									$(this).hide();
								};
							});

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

							floatboxV3TurnON(myModels[i].AssetName, myDesc);
							return;
						};
						i++;
					};
				};
				if (!localFlag) { //KML or B3DM data
					movePosition = movement.position
					var selectedEntity = new Cesium.Entity();
					selectedEntity.name = pickedFeature.id._name;

					$("#floatbox-tabs").children().each(function () {
						if (!$(this).is(":contains('Info')")) {
							$(this).hide();
						};
					});

					if (!pickedFeature.id._description) {
						var myDesc = '<table ><tbody >';
						myDesc += '<tr><th>' + "No attributes found or data format is not supported" + '</th></tr>';
						myDesc += '</tbody></table>';
						$("#floatboxEditButton").css('display', 'none')

						floatboxV3TurnON(selectedEntity.name, myDesc)
					} else {
						$("#floatboxEditButton").css('display', 'none')
						floatboxV3TurnON(selectedEntity.name, pickedFeature.id._description._value)
					}

					if (pickedFeature.id.filePathOriginal){
						if (pickedFeature.id.filePathOriginal.toLowerCase().includes("centerline") || pickedFeature.id.filePathOriginal.toLowerCase().includes("centreline")) {
							$("#floatboxBumiRegister").show()
							$("#floatboxEditButton").css('display', 'none')
							$("#floatboxWorkorderButton").css('display', 'none')

							jogetConOpDraw.fileName = "";
							jogetConOpDraw.WPCId = "";
							
							floatboxV3TurnON(selectedEntity.name, pickedFeature.id._description._value)

							var kmlFileName = pickedFeature.id.filePathOriginal
							var desiredEntityId = GetNextChildText('th', 'WPC_NO');

							jogetConOpDraw.fileName = kmlFileName;
							jogetConOpDraw.WPCId = desiredEntityId;
						}
					}
				};
			};
		};

	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

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
		if ($(".floatBox").css("display") == "block") {
			updateFloatBoxV3();
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
			//--for mark up tools--//
			if (flagMarkupTools) { //flag to indicate when markup tools is used
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
						undoArray = [];
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
						undoArray = [];
					}
				}
			}
		} else if (e.key === "Escape") { // escape key maps to keycode `27`
			if (flagMeasure) {
				// to clear flags and arrays for measure
				for (var i = 0; i < 3; i++) {
					labelEntity[i].label.show = false;
				};
				flagMeasure = false;
				MeasureTool = "";
				$('#RIContainer').css('cursor', "default");
				for (var i = 0; i < distEntities.length; i++) {
					viewer.entities.remove(distEntities[i]);
				};
				distanceEntity = 0;
				distance = 0;
				flagPosEntities = false;
				setInstruction(`<div class="instruction"><label>Please choose measure tool</label></div>`, 'measureTool')
			}
			else if ($('#draw').hasClass('active') || flagDraw) {
				flagDraw = false;
				$(".navBox.drawTool").css("display", "none");
				OnClickPinpointToolReset()
				distEntities.splice(0, distEntities.length);
				viewer.scene.primitives.remove(tempModel);
				$('#RIContainer').css('cursor', "default");
			} 
			else if ($('#addvideocam').hasClass('active') || flagCamera) {
				$(".navBox.cameraFeed").css("display", "none");
				OnClickAddCameraCancel();
				flagCamera = false; // have to false back to not allow right click after escape
				$(".navBox.drawTool").css("display", "none");
				$('#RIContainer').css('cursor', "default");
			}
			else if ($('#mark').hasClass('active') || flagEntity) {
				$("#mark").removeClass('active')
				$(".navBox.locationDirectory").css("display", "none");
				$('#newentityForm').css('display', 'none');
				$(':input').val('');
				flagEntity = false;
				document.getElementsByTagName("body")[0].style.cursor = "default";
				$('#RIContainer').css('cursor', "default");
			} 
			else if ($('#addimage').hasClass('active') || flagAddImage) {
				OnClickAddImageCancel()
				flagAddImage = false;
				$(".navBox.drawTool").css("display", "none");
				document.getElementsByTagName("body")[0].style.cursor = "default";
				$('#RIContainer').css('cursor', "default");
				let typeOfTool = 'drawTool'
				setInstruction(`<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, typeOfTool)
			} 
			else if (flagMarkupTools) { //later change this to check for the class active
				$("#RIContainer").css("cursor", "default")
				drawOnlyFlagMarkupTool = false;
				setInstruction('<div class="instruction"><label> Please choose any button to start drawing.</label></div>','markupTool')
				$(".header.edit").css('display', "none");
				$(".tool.edit").css('display', "none");
				$("#input-text").css('display', "none");
				checkCompleteDraw = true;
				markupRemoveActive();
				$("#btn_undo").css("pointer-events", "none");
				$("#btn_delete").css("pointer-events", "none")

				if (drawFlagMarkupTool) {
					if (drawFlagMarkupTool == 'line' && arrayOfCartesianMarkupTool.length > 0) {
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
						undoArray = [];
					}
					if (drawFlagMarkupTool == 'polygon' && arrayOfCartesianMarkupTool.length > 1) {
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
						undoArray = [];
					}
				}
			}
		} else if (typeof flagName !== 'undefined') {
			flags[flagName] = false;
		}
	}, false);

	// this is the eventlistener for right click to mark both the distance entity and the entity
	// the flag marker indicates entity and the flag distance the distance entity. Rest of the right clicks are ignored
	viewer.screenSpaceEventHandler.setInputAction(function onRightClick(click) {
		if (flagEntity) {
			var position = viewer.camera.pickEllipsoid(click.position);
			var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
			currentLng = Cesium.Math.toDegrees(cartographicPosition.longitude);
			currentLat = Cesium.Math.toDegrees(cartographicPosition.latitude);

			$("#wizard").fadeIn(100)
			$(".modal-container.insight").css("display", "block")
			$(".modal-container.insight .newEntityForm").css("display", "block")
			$(".modal-container.insight .editentityForm").css("display", "none")
			$(`.modal-content`).css("width", "30vw").css("height", "80vh")
			$(".modal-header a").text("New Location")
		} else if (flagMeasure && MeasureTool == "Area") {
			var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);

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
			labelEntity[0].label.text =
				'Area : ' + myarea.toFixed(3) + ' km2' +
				'\nPerimeter : ' + perimeter.toFixed(3) + ' km';

			measureDataArr.push({
				no: countArray,
				tag: 'Area',
				Area: myarea.toFixed(3) + ' km2',
				Perimeter: perimeter.toFixed(3) + ' km'
			});

			addMeasureDataList();

		} else if (flagCamera) {
			$(".pageContainer.cameraItem");
			var cartographicPosition, cartesian;
			//check if 3D or 2D
			pickedFeature = viewer.scene.pick(click.position);
			if (!Cesium.defined(pickedFeature)) {
				//no feature only cesium map
				cartesian = viewer.camera.pickEllipsoid(click.position);
				cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			} else {
				// either tileset or kml	
				if (pickedFeature._content) {
					cartesian = viewer.scene.pickPosition(click.position);
					cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
				} else {
					cartesian = viewer.camera.pickEllipsoid(click.position);
					cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
				}
			}
			var lng = Cesium.Math.toDegrees(cartographicPosition.longitude);
			var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
			var height = cartographicPosition.height;

			if(!lng || !lat){
				flagCamera = true;
			}else{
				flagCamera = false;
			}

			tempVideoPin = addVideoPin("untitled", lng, lat, height, true);
			$('#camName').val("");
			$('#camHeight').val(height.toFixed(2));
			$("#camLong").val(lng.toFixed(6));
			$("#camLat").val(lat.toFixed(6));
			$(".pageContainer.cameraItem");

		} else if (flagAddImage) {
			var cartographicPosition, cartesian;
			//check if 3D or 2D
			pickedFeature = viewer.scene.pick(click.position);
			if (!Cesium.defined(pickedFeature)) {
				//no feature only cesium map
				cartesian = viewer.camera.pickEllipsoid(click.position);
				cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
			} else {
				// either tileset or kml    
				if (pickedFeature._content) {
					cartesian = viewer.scene.pickPosition(click.position);
					cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
				} else {
					cartesian = viewer.camera.pickEllipsoid(click.position);
					cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
				}
			}
			var lng = Cesium.Math.toDegrees(cartographicPosition.longitude);
			var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
			var height = cartographicPosition.height;

			if(!lng || !lat){
				flagAddImage = true;
			}else{
				flagAddImage = false;
			}

			tempImagePin = addEarthPin("untitled", lng, lat, height, true);
			$('#imgName').val("");
			$('#imgHeight').val(height.toFixed(2));
			$("#imgLong").val(lng.toFixed(6));
			$("#imgLat").val(lat.toFixed(6));
			$('#RIContainer').css('cursor', "default");
			let typeOfTool = 'drawTool'
            setInstruction(`<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark</label></div><div class="instruction escape"><label>Click <kbd>Reset</kbd> to reset tool</label></div>`, typeOfTool)
		} else if (flagMarkupTools) {
			if (drawFlagMarkupTool) {
				viewer.entities.remove(floatingPoint);
				if (drawFlagMarkupTool == 'line' && arrayOfCartesianMarkupTool.length > 0) {
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
					undoArray = [];
				}
				if (drawFlagMarkupTool == 'polygon' && arrayOfCartesianMarkupTool.length > 1) {
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
					undoArray = [];
				}
			}
		}
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}

function setLeftRightClickFunctionNewProcess(viewer){
	// Information about the currently selected feature
	selected = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	document.oncontextmenu = function (event) {
		event.preventDefault();
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
		}

	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
		silhouetteBlue.selected = [];
		var colourProcess = "";
		
		switch (changePointColour) {
			case "colourNCR":
				colourProcess = "../Images/dotNCR.png"
				break;
			case "colourWIR":
				colourProcess = "../Images/dotWIR.png"
				break;
			case "colourMS":
				colourProcess = "../Images/dotMS.png"
				break;
			case "colourRS":
				colourProcess = "../Images/dotRS.png"
				break;
			case "colourRFI":
				colourProcess = "../Images/dotRFI.png"
				break;
			case "colourIR":
				colourProcess = "../Images/dotIR.png"
				break;
			case "colourMOS":
				colourProcess = "../Images/dotMOS.png"
				break;
			case "colourSD":
				colourProcess = "../Images/dotSD.png"
				break;
			case "colourSDL":
				colourProcess = "../Images/dotSDL.png"
				break;
			case "colourDCR":
				colourProcess = "../Images/dotSDL.png"
				break;
			case "colourNOI":
				colourProcess = "../Images/dot.png"
				break;
			case "colourPBC":
				colourProcess = "../Images/dotNCR.png"
				break;
			case "colourDA":
				colourProcess = "../Images/dotSDL.png"
				break;
			default:
				colourProcess = "../Images/dot.png"
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
				updateLongLat();
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
			jogetConOpDraw.drawEntity()
			updateLongLat();
		}
		else {
			pickedFeature = viewer.scene.pick(movement.position);
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
								jogetConOpDraw.coordsArray.splice(0, jogetConOpDraw.coordsArray.length);
								jogetConOpDraw.coordsArray.push(currentLong);
								jogetConOpDraw.coordsArray.push(currentLati);

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
											$(".nextPage").css('display', 'none')
											clearAllFlag();
											return;
										  }
										},
									});
								}
								else{
									$('.nextPage').css('display', 'unset')
									jogetConOpDraw.flag = true;
									updateLotStructChain();
								}
							}
						}
					});
				}
				return;
			};
			try {
				if (pickedFeature.id._name) {
					getRequestBimAttr(pickedFeature.id._name, "road")
				}
			}
			catch(err) { 
				console.log("not centreline")
			}

			if (pickedFeature.id) {
				$('#rootNode').jstree('deselect_all');
				$('#infoRootNode').jstree('deselect_all');
				stringName;
				var localFlag = false;
				var j = 0;
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
						jogetConOpDraw.coordsArray.splice(0, jogetConOpDraw.coordsArray.length);
						jogetConOpDraw.coordsArray.push(currentLong);
						jogetConOpDraw.coordsArray.push(currentLati);

						shpLotId = "";
						lot = "";
						chainage = "";
						struct = "";
						fileLandName = "";

						var kmlFileName = pickedFeature.id._parent.entityCollection._owner._name
						msgLand = "";
						if (jogetProcessApp == "LI") {
							var desiredLot1 = (pickedFeature.id._kml.extendedData.LOT) ? pickedFeature.id._kml.extendedData.LOT.value : false;
							var desiredLot2 = (pickedFeature.id._kml.extendedData.CHAINAGE_D) ? pickedFeature.id._kml.extendedData.CHAINAGE_D.value : false;
							var desiredLot3 = (pickedFeature.id._kml.extendedData.STRUCTURE_) ? pickedFeature.id._kml.extendedData.STRUCTURE_.value : false;
							lot = desiredLot1;
							chainage = desiredLot2;
							struct = desiredLot3;
							fileLandName = kmlFileName;
							if (!lot || !chainage || !struct){
								msgLand = "Please upload correct data with " + ((!lot) ? "LOT" :"") + ((!chainage) ? " CHAINAGE_D" :"")
								+ ((!struct) ? " STRUCTURE_" :"") + " attribute";
							}
							
						}
						else if(jogetProcessApp == 'BP'){
							if (pickedFeature.id._parent){
								jogetConOpDraw.fileName = "";
								jogetConOpDraw.WPCId = "";
	
								let cartesian = viewer.camera.pickEllipsoid(movement.position);
								let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
								let currentLong = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
								let currentLati = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);
	
								jogetConOpDraw.coordsArray.splice(0, jogetConOpDraw.coordsArray.length);
								jogetConOpDraw.coordsArray.push(currentLong);
								jogetConOpDraw.coordsArray.push(currentLati);
	
								var kmlFileName = pickedFeature.id._parent.entityCollection._owner._name
								const extendedData = pickedFeature.id._kml.extendedData;

								let WPCValue;
								if (extendedData) {
									if ('WPC_NO' in extendedData) {
										WPCValue = extendedData.WPC_NO.value;
									} else if ('WPC_No' in extendedData) {
										WPCValue = extendedData.WPC_No.value;
									} else {
										WPCValue = null; // Default if neither key exists
									}
								} else {
									WPCValue = null; // Handle case where extendedData is undefined
								}

								var desiredEntityId = WPCValue;
	
								jogetConOpDraw.fileName = kmlFileName;
								jogetConOpDraw.WPCId = desiredEntityId;
	
								msgBumi = "";
	
								if(!kmlFileName || !desiredEntityId){
									msgBumi = "Please use correct data to initiate Bumi Process."
								}
	
								if(msgBumi){
									$.confirm({
										boxWidth: "30%",
										useBootstrap: false,
										title: "Bumi Function",
										content: msgLand,
										buttons: {
											Ok: function () {
												$(".nextPage").css('display', 'none')
												clearAllFlag();
												return;
											}
										},
									});
								}
								else{
									$('.nextPage').css('display', 'unset')
									jogetConOpDraw.flag = true;
									updateLongLat();
								}
							}
						}
						else {
							var desiredLot = (pickedFeature.id._kml.extendedData.LOT) ? pickedFeature.id._kml.extendedData.LOT.value : false;
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
										$(".nextPage").css('display', 'none')
										clearAllFlag();
										return;
									}
								},
							});
						}
						else{
							$('.nextPage').css('display', 'unset')
							jogetConOpDraw.flag = true;
							updateLotStructChain();
						}

					} else {
						if (pickedFeature.id._parent){
							jogetConOpDraw.fileName = "";
							jogetConOpDraw.WPCId = "";

							let cartesian = viewer.camera.pickEllipsoid(movement.position);
							let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
							let currentLong = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
							let currentLati = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);

							jogetConOpDraw.coordsArray.splice(0, jogetConOpDraw.coordsArray.length);
							jogetConOpDraw.coordsArray.push(currentLong);
							jogetConOpDraw.coordsArray.push(currentLati);

							var kmlFileName = pickedFeature.id._parent.entityCollection._owner._name
							const extendedData = pickedFeature.id._kml.extendedData;

							let WPCValue;
							if (extendedData) {
								if ('WPC_NO' in extendedData) {
									WPCValue = extendedData.WPC_NO.value;
								} else if ('WPC_No' in extendedData) {
									WPCValue = extendedData.WPC_No.value;
								} else {
									WPCValue = null; // Default if neither key exists
								}
							} else {
								WPCValue = null; // Handle case where extendedData is undefined
							}

							var desiredEntityId = WPCValue;

							jogetConOpDraw.fileName = kmlFileName;
							jogetConOpDraw.WPCId = desiredEntityId;

							msgBumi = "";

							if(!kmlFileName || !desiredEntityId){
								msgBumi = "Please use correct data to initiate Bumi Process."
							}

							if(msgBumi){
								$.confirm({
									boxWidth: "30%",
									useBootstrap: false,
									title: "Bumi Function",
									content: msgLand,
									buttons: {
										Ok: function () {
											$(".nextPage").css('display', 'none')
											clearAllFlag();
											return;
										}
									},
								});
							}
							else{
								$('.nextPage').css('display', 'unset')
								jogetConOpDraw.flag = true;
								updateLongLat();
							}
						}
					}
				};
			};
		};

	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

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
				viewer.entities.remove(jogetConOpDraw.billboardEntities[jogetConOpDraw.billboardEntities.length - 1]) //remove last billboard
				jogetConOpDraw.billboardEntities.pop()

				jogetConOpDraw.drawEntity();
			}
		} else if (e.key === "Escape") { // escape key maps to keycode `27`
			if (jogetConOpDraw.flag == true) {
				resetJogetConOpDraw()
			}
		} else if (typeof flagName !== 'undefined') {
			flags[flagName] = false;
		}
	}, false);

	// this is the eventlistener for right click to mark both the distance entity and the entity
	// the flag marker indicates entity and the flag distance the distance entity. Rest of the right clicks are ignored
	viewer.screenSpaceEventHandler.setInputAction(function onRightClick(click) {
		
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

function LoadEarthPinData(callback) {
	var xhr = new XMLHttpRequest();
	let data = "project_id=" + localStorage.p_id;
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			callback(this.responseText);
		}
	});
	xhr.open("POST", "../BackEnd/getEarthPinsData.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	xhr.send(data);
}

function addEarthPin(name, long, lat, height, show) {
	var myEarthPin = viewer.entities.add({
		name: name,
		position: Cesium.Cartesian3.fromDegrees(long, lat, height),
		billboard: {
			image: '../Images/camera_360.png',
			eyeOffset: Cesium.Cartesian3(0.0, 0.0, -10.0),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
			width: 50,
			width: 50,
			height: 50
		},
		show: show,
		label: {
			text: name,
			font: '14pt monospace',
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			eyeOffset: Cesium.Cartesian3(0.0, 0.0, -10.0),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
			pixelOffset: new Cesium.Cartesian2(0, 5)
		}
	});
	return (myEarthPin);
}

function addMeasureDataList(){
	let measureListHTML = "";
	measureDataArr.sort((a, b) => a.no - b.no)
	measureDataArr.reverse();

	for (const [idx, ele] of Object.entries(measureDataArr)) {
		if(ele.tag == "Point"){
			measureListHTML += `<div class="list">
									<div class="column1"><a class="label">Point</a></div>
									<div class="column2 flexGrow">
										<div class="marginRight">
											<span class="flex" title="Height"><i class="fa-solid fa-ruler-vertical"></i><a class="label">`+ele.Height+`</a></span>
											<span class="flex" title="Terrain Height"><i class="fa-solid fa-ruler-combined"></i><a class="label">`+ele.Terrain+`</a></span>
										</div>
										<div>
											<span class="flex" title="Longitude"><i class="fa-solid fa-globe"></i></i><a class="label">`+ele.Lon+`</a></span>
											<span class="flex" title="Latittude"><i class="fa-solid fa-globe"></i><a class="label">`+ele.Lat+`</a></span>
										</div>
									</div>
								</div>`
		}
		else if(ele.tag == "Distance"){
			measureListHTML += `<div class="list">
									<div class="column1"><a class="label">Distance</a></div>
									<div class="column2 flexGrow">
										<div class="marginRight">
											<span class="flex" title="Height Difference"><i class="fa-solid fa-ruler-vertical"></i><a class="label">`+ele.diffHeight+`</a></span>
										</div>
										<div>
											<span class="flex" title="Distance"><i class="fa-solid fa-ruler-horizontal"></i><a class="label">`+ele.Distance+`</a></span>
											<span class="flex" title="Total Distance"><i class="fa-solid fa-ruler-combined"></i><a class="label">`+ele.ttlDistance+`</a></span>
										</div>
									</div>
								</div>`
		}
		else if(ele.tag == "Area"){
			measureListHTML += `<div class="list">
									<div class="column1"><a class="label">Area</a></div>
									<div class="column2 flexGrow">
										<div>
											<span class="flex" title="Area"><i class="fa-solid fa-draw-polygon"></i><a class="label">`+ele.Area+`</a></span>
											<span class="flex" title="Perimeter"><i class="fa-solid fa-ruler-combined"></i><a class="label">`+ele.Perimeter+`</a></span>
										</div>
									</div>
								</div>`
		}
	};

    $("#historyMeasure").html(measureListHTML)

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

function setCesiumLocation(){
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
}

function setCesiumLocationProcess(homeLocation){

	var lat1 = homeLocation[0].split(',');
	var lat2 = homeLocation[1].split(',');
	var long1 = homeLocation[2].split(',');
	var long2 = homeLocation[3].split(',');
	
	if (lat1 !== lat2) {
		latitude1 = parseFloat(lat1);
		latitude2 = parseFloat(lat2);
		longitude1 = parseFloat(long1);
		longitude2 = parseFloat(long2);

		west = Math.min(longitude1, longitude2)
		east = Math.max(longitude1, longitude2)
		south = Math.min(latitude1, latitude2)
		north = Math.max(latitude1, latitude2)
	} else {
		west = 93.0;
		south = -15.0;
		east = 133.0;
		north = 30.0;
	}
	Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(west, south, east, north);
}

function setReviewTool(viewer){
	reviewTools.orientationObj = {
		heading: viewer.camera.heading,
		pitch: viewer.camera.pitch,
		roll: viewer.camera.roll,
	};
	reviewTools.camPosition = viewer.camera.position; //in cartesian 3
	var sourceImageData = viewer.canvas.toDataURL("image/png");
	var canvasBase = document.getElementById("reviewCanvasImgBase");
	var canvasTop = document.getElementById("reviewCanvasImgTop");

	$("#reviewCanvasImgTop").css("cursor", "crosshair");

	var contextBase = canvasBase.getContext("2d");
	var contextTop = canvasTop.getContext("2d");

	var destinationImage = new Image();

	if(flagReviewToolMaximize){
		canvasBase.width = $("#reviewContainerID").width()
		canvasBase.height = $("#reviewContainerID").height()
		canvasTop.width = $("#reviewContainerID").width()
		canvasTop.height = $("#reviewContainerID").height()
	}else{
		canvasBase.width = $("#RIContainer").width() - 10
		canvasBase.height = $("#RIContainer").height() - 10
		canvasTop.width = $("#RIContainer").width() - 10
		canvasTop.height = $("#RIContainer").height() - 10

	}

	destinationImage.onload = function () {
		contextBase.drawImage(
		  destinationImage,
		  0,
		  0,
		  $("#RIContainer").width() - 10,
		  $("#RIContainer").height() - 10,
		  0,
		  0,
		  $("#RIContainer").width() - 10,
		  $("#RIContainer").height() - 10
		);
	};

	destinationImage.src = sourceImageData;

	$("#reviewTool-color-picker").spectrum({
		preferredFormat: "hex",
		showInput: true,
	});
  
	var clickX = [];
	var clickY = [];
	var clickDrag = [];
	var paint;
  
	function addClick(x, y, dragging) {
	  	clickX.push(x);
	  	clickY.push(y);
	  	clickDrag.push(dragging);
	}

	function drawNew() {
		var i = clickX.length - 1;
		if (!clickDrag[i]) {
			if (clickX.length == 0) {
				contextTop.beginPath();
				contextTop.moveTo(clickX[i], clickY[i]);
				contextTop.stroke();
			} else {
				contextTop.closePath();
		
				contextTop.beginPath();
				contextTop.moveTo(clickX[i], clickY[i]);
				contextTop.stroke();
			}
		} else {
				contextTop.lineTo(clickX[i], clickY[i]);
				contextTop.stroke();
		}
	}
  
	function mouseDownEventHandler(e) {
		var drawSize = $("#reviewToolFontSize").val();
		var BB = canvasTop.getBoundingClientRect();
		var offsetX = BB.left;
		var offsetY = BB.top;

		var mouseX = parseInt((e.clientX - offsetX) / (BB.right - BB.left) * canvasTop.width);
		var mouseY = parseInt((e.clientY - offsetY)  / (BB.bottom - BB.top) * canvasTop.height);

		var pickedColor = $("#reviewTool-color-picker").val();

		if (reviewTools.drawMode == "draw") {
			contextTop.strokeStyle = pickedColor;
			contextTop.globalCompositeOperation = "source-over";
			contextTop.lineJoin = "round";
			contextTop.lineWidth = drawSize;
		} else if (reviewTools.drawMode == "erase") {
			contextTop.globalCompositeOperation = "destination-out";
			contextTop.lineWidth = drawSize;
		} else {
			//text mode
			//get point coordinate
			contextTop.globalCompositeOperation = "source-over";
			contextTop.fillStyle = pickedColor;
			placeText(mouseX, mouseY, drawSize);
			return;
		}
	
		paint = true;
		if (paint) {
			addClick(mouseX, mouseY, false);
			drawNew();
		}
	}
  
	function placeText(x, y, drawSize) {
	  contextTop.textAlign = "center";
	  contextTop.font = drawSize + "px Georgia";
	  var text = $("#reviewToolText").val();
	  contextTop.fillText(text, x, y);
	}
  
	function mouseUpEventHandler(e) {
	  contextTop.closePath();
	  paint = false;
	}
  
	function mouseMoveEventHandler(e) {
		var BB = canvasTop.getBoundingClientRect();
		var offsetX = BB.left;
		var offsetY = BB.top;
		var mouseX = parseInt((e.clientX - offsetX) / (BB.right - BB.left) * canvasTop.width);
		var mouseY = parseInt((e.clientY - offsetY)  / (BB.bottom - BB.top) * canvasTop.height);
		if (paint) {
			addClick(mouseX, mouseY, true);
			drawNew();
		}
	}
  
	function setUpHandler(detectEvent) {
		canvasTop.removeEventListener("mousedown", setUpHandler);
		canvasTop.addEventListener("mouseup", mouseUpEventHandler);
		canvasTop.addEventListener("mousemove", mouseMoveEventHandler);
		canvasTop.addEventListener("mousedown", mouseDownEventHandler);
		mouseDownEventHandler(detectEvent);
	}
	canvasTop.addEventListener("mousedown", setUpHandler);
}

function reviewToolSwitchMode(mode){
	reviewTools.drawMode = mode

	$(".button-ok.review").removeClass('active');
	$("#review" +mode).addClass('active');
  
	var thingsToShow = "review" +mode;
	if(thingsToShow == "reviewdraw"){
		$("#sizeReview").css("display", "flex");
		$("#colourReview").css("display", "flex");
		$("#textReview").css("display", "none");
	}
  
	if(thingsToShow == "reviewerase"){
		$("#sizeReview").css("display", "flex");
		$("#colourReview").css("display", "none");
		$("#textReview").css("display", "none");
	}
  
	if(thingsToShow == "reviewtext"){
		$("#sizeReview").css("display", "flex");
		$("#colourReview").css("display", "flex");
		$("#textReview").css("display", "flex");
	}
  
	if (mode == "erase"){
		$("#reviewCanvasImgTop").css("cursor", "url('../Images/double-sided-eraser.png') 4 12, auto");
	}
	else{
		$("#reviewCanvasImgTop").css("cursor", "crosshair");
  
	}
}

function submitReviewCanvas() {
	if (!JOGETLINK) return
	var canvasMerge = document.createElement("CANVAS");
	var parentDiv = $(".reviewPage .reviewContainer");
	canvasMerge.width = $("#RIContainer").width()
	canvasMerge.height = $("#RIContainer").height()
  
	var contextMerge = canvasMerge.getContext("2d");
	var canvasBase = document.getElementById("reviewCanvasImgBase");
	var canvasTop = document.getElementById("reviewCanvasImgTop");

	contextMerge.drawImage(canvasBase, 0, 0);
	contextMerge.drawImage(canvasTop, 0, 0);
	
	var dataURL = canvasMerge.toDataURL("image/png");
	var resURL = null;
	$.ajax({
	  type: "POST",
	  url: "../BackEnd/fetchDatav3.php",
	  dataType: "JSON",
	  data: {
		functionName: "uploadScreenshot",
		imgBase64: dataURL,
	  },
	  success: function (obj) {
		resURL = obj.data;
		$("#previewcanvas iframe").unbind("load");
		  	var url;
		  	var urlParam =
			"&orientation=" +
			reviewTools.orientationObj["heading"] +
			"," +
			reviewTools.orientationObj["pitch"] +
			"," +
			reviewTools.orientationObj["roll"] +
			"&coordinate=" +
			reviewTools.camPosition["x"] +
			"," +
			reviewTools.camPosition["y"] +
			"," +
			+reviewTools.camPosition["z"] +
			"&ImageFileName=" +
			resURL;

			if(SYSTEM == 'OBYU'){
				if(JOGETLINK.form['markup_review_form']){
					url = JOGETLINK.form['markup_review_form'] + urlParam;
				}
			}else{
				if(localStorage.project_owner == 'JKR_SABAH'){
					if(JOGETLINK['cons_issue_markupv3_sbh']){
						url = JOGETLINK['cons_issue_markupv3_sbh'] + urlParam;
					}
				}else{
					if(JOGETLINK['cons_issue_markupv3']){
						url = JOGETLINK['cons_issue_markupv3'] + urlParam;
					}
				}
			}

			$("iframe#previewcanvas")
				.attr("src", encodeURI(url))
				.css("border", "none");
			$('#previewcanvas').css('display', 'block')
	  },
	});
}

function getReviewv3() {
    if (!JOGETLINK) return

	var url;
	if(SYSTEM == 'OBYU'){
		url = JOGETLINK.dataList['markup_list_review'];
	}else{
		url = JOGETLINK.cons_datalist_markupv3;
	}

	$.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
		dataType: "JSON",
        data: {
			functionName: "getReviewList",
			urlID : url
        },
        beforeSend: function() {
        },
        complete: function() {
        },
        success : function(res){
			let myhtml = '';

			if(res){
				res = JSON.parse(res);
				if(res.data.length > 0){
					for (const [idx, ele] of Object.entries(res.data)) {
						localStorage[idx] = true;
						var imgLink;

						if(SYSTEM == 'OBYU'){
							var xmlString = ele.image;
							var doc = new DOMParser().parseFromString(xmlString, "text/xml");
							var imgURL = String(doc.firstChild.innerHTML);
							var tmp = document.createElement('div');
							tmp.innerHTML = imgURL;
							var src = tmp.querySelector('img').getAttribute('src');
							imgLink = src;
						}else{
							imgLink = ele.image_link;
						}

						myhtml += 
								'<div class="list">'+
								'<div class="column1"><a class="label" id="subject">' + ele.subject + '</a><a class="label" id="description">' + ele.description + '</a></div>'+
								'<div class="column2"><a class="label" id="dateCreated">'+ ele.dateCreated +'</a><a class="label" id="createdName">'+ ele.createdByName +'</a></div>'+
								'<div class="column3 buttonContainer"><a href="'+ imgLink +'" target="_blank"><i class="fa-solid fa-camera fixWidth"></i></a>\
								<a onclick="setCameraPosOrientv3(\''+ ele.coordinate + '\',\'' + ele.orientation + '\',\'' + imgLink + '\')" ><i class="fa-solid fa-binoculars fixWidth"></i></a></div>'+
								'</div>';
					}
	
				}
				else{
					myhtml +=	
							'<div class="item justifyBetween">There are no details stored for Review Tool</div>';
				}
			}
			else{
				myhtml +=	
						'<div class="item justifyBetween">There are no details stored for Review Tool</div>';
			}

			$('#reviewDataList').html(myhtml);
			
        }
    });
}

function openReviewToolList() {
	let url;
	$("#previewcanvas iframe").unbind("load");

	if(SYSTEM == 'OBYU'){
		if(JOGETLINK.dataList['markup_review_list']){
			url = JOGETLINK.dataList['markup_review_list']
		}
	}else{
		if(localStorage.project_owner == 'JKR_SABAH'){
			if(JOGETLINK['cons_datalist_markup_sabah']){
				url = JOGETLINK['cons_datalist_markup_sabah']
			}
		}else{
			if(JOGETLINK['cons_datalist_markup']){
				url = JOGETLINK['cons_datalist_markup']
			}
		}
	}

	$("iframe#previewcanvas")
		.attr("src", encodeURI(url))
		.css("border", "none");
	$('#previewcanvas').css('display', 'block')
	zoomToGetData();
}

function setCameraPosOrientv3(coordinate,orientation,image_link) {
	if(coordinate && orientation){
		var coordinate = coordinate.split(",");
		var orientation = orientation.split(",");

		viewer.camera.flyTo({
			destination: {
			  x: parseFloat(coordinate[0]),
			  y: parseFloat(coordinate[1]),
			  z: parseFloat(coordinate[2]),
			},
			orientation: {
			  heading: parseFloat(orientation[0]),
			  pitch: parseFloat(orientation[1]),
			  roll: parseFloat(orientation[2]),
			},
		});

		wizardCancelPage()
	}else if (image_link) {
        var imageUrl = encodeURI(
          "../../Data/Projects/" +
            localStorage.p_id +
            "/" +
            image_link +
            ".png"
        );
        window.open(imageUrl);
    }

}

function LoadVideoPinData(callback) {

    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'JSON',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    	processData: true,

        cache: false, // prevent caching

        data: {
            functionName: "getVideoCam",
            project_id: localStorage.p_id, // send project id
            t: Date.now() // extra cache buster
        },

        success: function (obj) {

            console.log("Camera Feed Response:", obj);

            if (obj.data) {
                callback(obj.data);
            } else {
                callback([]);
                console.log(obj.msg);
            }
        },

        error: function (xhr) {
            console.log("AJAX Error:", xhr);
        }
    });
}


function addVideoPin(name, long, lat, height, show) {
	var myVideoPin = viewer.entities.add({
		name: name,
		position: Cesium.Cartesian3.fromDegrees(long, lat, height),
		billboard: {
			image: '../Images/security-camera.png',
			eyeOffset: Cesium.Cartesian3(0.0, 0.0, -10.0),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
			width: 50,
			height: 50
		},
		show: show,
		label: {
			text: name,
			font: '14pt monospace',
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			eyeOffset: Cesium.Cartesian3(0.0, 0.0, -10.0),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
			pixelOffset: new Cesium.Cartesian2(0, 5)
		}
	});
	return (myVideoPin);
}

// START TRACK ANIMATION //

// Function to load track data
function LoadTrackData(callback) {
	$.ajax({
		type: "POST",
		url: '../BackEnd/fetchDatav3.php',
		dataType: 'JSON',
		data: {
			functionName: "getTrackAnimation"
		},
		success: function (obj) {
			if (obj.data)
				callback(obj.data);
			else console.log(obj.msg)
		},
		error: function (xhr) {
			console.log(xhr);
		}
	});
}

async function addTrackData(URL) {
	var mykml = new Cesium.KmlDataSource();
	await mykml.load(URL, {
		clampToGround: false
	}).then( function (dataSource){
			var geoJsonObject;
			var entities = dataSource.entities.values;
			geoJsonObject = kmlToGeoJson(dataSource);
			mykml.geoJSON = geoJsonObject;

			for (let entity of entities) {
				entity.filePathOriginal = URL;

				if(entity.polyline && entity.polyline.material){
					entity.polyline.material.color = Cesium.Color.BLUE;
					entity.polyline.width = 2;
				}
			}
			console.log("loaded")
		}
	);

	viewer.dataSources.add(mykml);

	return mykml
}

// Function to add point indicator based on current track entity
function addPointEntity(arrayPos, animationDuration, animationDate){
	var animateionDateArr = animationDate.split('-');
	positionProperty = new Cesium.SampledPositionProperty();

	if(arrayPos !== undefined){
		//this feature require date to run. dummy date is sufficient as it wasnt used for animation purpose
		animationStart = Cesium.JulianDate.fromDate(new Date(2024, 10, 25, 23));
		animationStop = Cesium.JulianDate.addSeconds(
			animationStart,
			animationDuration,
			new Cesium.JulianDate()
		);
			
		var lastTime = null;
		var lastPos = null;
		var arrayPositionsNew = arrayPos.features[0]

		var lastPos2 = null;
		var totalDistance = 0;

		for (var j=0; j < arrayPositionsNew.length; j++){
			if (lastPos2){
				var d = Cesium.Cartesian3.distance(lastPos2, arrayPositionsNew[j]);

				totalDistance += d;
			}
			lastPos2 = arrayPositionsNew[j];
		}

		for (var i=0;i<arrayPositionsNew.length;i++){
			if (i === 0) {
				lastTime = animationStart;
				lastPos = arrayPositionsNew[0];
			}
			else {
				var d = Cesium.Cartesian3.distance(lastPos, arrayPositionsNew[i]);
				var stepTime = (d*animationDuration) / totalDistance;

				lastTime = Cesium.JulianDate.addSeconds(
					lastTime,
					stepTime,
					new Cesium.JulianDate()
				);

				lastPos = arrayPositionsNew[i];
			}

			positionProperty.addSample(lastTime, lastPos);
		}

		pointEntity = viewer.entities.add({
			name: 'indicator',
			availability: new Cesium.TimeIntervalCollection([
				new Cesium.TimeInterval({
					start: animationStart,
					stop: animationStop,
				}),
			]),          
			position: positionProperty,
			orientation : new Cesium.VelocityOrientationProperty(positionProperty),
			point: {
				pixelSize : 10,
				color : Cesium.Color.RED.withAlpha(0),
				heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
			}
		});

		pointEntity.position.setInterpolationOptions({
			interpolationDegree: 2,
			interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
		});
	}
}

// Function to convert KML data to GeoJSON format
function kmlToGeoJson(dataSource) {
	var kmlArr = []
	const geoJson = {
		type: "FeatureCollection",
		features: []
	};

	// Iterate over each entity in the KML DataSource
	dataSource.entities.values.forEach(entity => {
		
		// Convert KML geometries to GeoJSON geometries
		if (entity.polyline) {
			kmlArr = kmlArr.concat(entity.polyline.positions.getValue());
		}
	});

	geoJson.features.push(kmlArr);

	return geoJson;
}

// Function to set camera angle on ground level
function setCameraAngle(){
	var secs = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
	var slightlyBefore = Cesium.JulianDate.addSeconds(animationStart, secs-0.2, new Cesium.JulianDate());
	var now = Cesium.JulianDate.addSeconds(animationStart, secs, new Cesium.JulianDate());

	var prevPos=new Cesium.Cartesian3();
	var currPos=new Cesium.Cartesian3();


	prevPos = positionProperty.getValue(slightlyBefore);
	currPos = positionProperty.getValue(now);

	if(currPos==undefined||prevPos==undefined){console.log("a position is missing");return;}
	
	//vectors have to have magnitude, so these can't be equal  
	if(currPos.x===prevPos.x && currPos.y===prevPos.y && currPos.z===prevPos.z)
	{console.log("equal, can't get heading");return;}

	//make a rot mat
	var CC3=Cesium.Cartesian3;
	var mydir = new CC3();
	mydir = CC3.subtract(currPos,prevPos,new CC3());
	CC3.normalize(mydir,mydir);
	var GC_UP = new CC3();
	CC3.normalize(viewer.scene.camera.position,GC_UP); //GC_UP
	var myrig = new CC3();
	var myup = new CC3();
	myrig = CC3.cross(mydir,GC_UP,new CC3());
	myup = CC3.cross(myrig,mydir,new CC3()); 
	
	//set camera level
	var cameraLevel = Number($('#trackLevel').val());
	cameraLevel = (cameraLevel == 0) ? 5 : cameraLevel;

	//raise camera up 333 meters, put back 333 meters
	CC3.multiplyByScalar(GC_UP, cameraLevel, GC_UP);
	CC3.add(GC_UP,currPos,currPos);
	CC3.subtract(currPos,CC3.multiplyByScalar(mydir, cameraLevel,new CC3()),currPos);
	viewer.scene.camera.position=currPos;
	
	mydir = rotateVector(mydir,myrig,-10*Math.PI/180);
	myup = rotateVector(myup,myrig,-10*Math.PI/180);

	//orient camera using rot mat
	viewer.scene.camera.direction=mydir;
	viewer.scene.camera.right=myrig;
	viewer.scene.camera.up=myup;
}

function rotateVector(rotatee,rotater,angleRad){
	var CC3 = Cesium.Cartesian3;var rotated=new CC3();
	var dotS = CC3.dot(rotatee,rotater);
	var base = CC3.multiplyByScalar(rotater,dotS,new CC3());
	var vpa = CC3.subtract(rotatee,base,new CC3());
	var cx = CC3.multiplyByScalar(vpa,Math.cos(angleRad),new CC3());
	var vppa = CC3.cross(rotater,vpa,new CC3());
	var cy = CC3.multiplyByScalar(vppa,Math.sin(angleRad),new CC3());
	var temp = CC3.add(base,cx,new CC3());
	var rotated = CC3.add(temp,cy,new CC3());

	return rotated;
}

function OnClickPowerBi() {
	$('.loader').fadeIn(100)
    if (dashboardPowerBILoaded == false) {
        $.ajax({
            type: "POST",
            url: '../BackEnd/getConfigDetailsPWPBiV3.php',
            dataType: 'json',
            data: {
                functionName: "getSpecificConfig"
            },
            success: function (obj, textstatus) {
                if (obj == null) {
					$('.loader').fadeOut(100)
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: "Power BI config not found",
                    });
                    return
                } else {
					PowerBIURL = obj
					dashboardWindow = window.open('../backend/pbi_login.php?url=' + encodeURIComponent(obj), "_blank", "height=450px,top=230px,location=no,width=750px, directories=no, menubar=no,titlebar=no,toolbar=no,dependent=on");
					dashboardPowerBILoaded = true;
					dashboardWindow.focus()
					$('.loader').fadeOut(100)
				}
                
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
				console.log(str)
				$('.loader').fadeOut(100)
            }

        });
    } else {
        if (dashboardWindow.closed) {
            dashboardWindow = window.open(PowerBIURL, "_blank", "height=450px,top=230px,location=no,width=750px, directories=no, menubar=no,titlebar=no,toolbar=no,dependent=on");
        }
        dashboardWindow.focus();
		$('.loader').fadeOut(100)
    }
}

function OnClickCameraFeedv3() {

    console.log("Camera Feed button clicked");
    console.log("Current Project ID:", localStorage.p_id);

    
    // clear old data + pins
    videoPinData = [];

    if (videoPinsArray.length > 0) {
        videoPinsArray.forEach(function (pin) {
            if (pin) viewer.entities.remove(pin); // remove from cesium
        });
    }

    videoPinsArray = [];
    $('#cameraPinList').empty();


    
    // always load from backend
    LoadVideoPinData(function (data) {

        console.log("Returned Camera Data:", data);

        if (!data || data.length === 0) {

            $('#cameraPinList').html(
                '<div class="item justifyBetween videoNoDetails">There are no details stored for Video</div>'
            );
            return;
        }

        videoPinData = data;

        let myhtml = '';

        for (var i = 0; i < data.length; i++) {

            myhtml +=
                '<div class="item justifyBetween" id="videoID_' + data[i].videoPinID + '">' +
                    '<div id="video_name">' + data[i].videoPinName + '</div>' +
                    '<div>' +

                        '<a onclick="flyToVideoPin(' + data[i].videoPinID + ')" title="Fly To">' +
                            '<i class="fa-solid fa-binoculars"></i>' +
                        '</a>' +

                        '<a onclick="wizardOpenPage(this)" ' +
                            'value="' + data[i].videoPinID + '" ' +
                            'rel="insight" ' +
                            'data-page="viPage" ' +
                            'data-width="70" ' +
                            'data-height="75" ' +
                            'class="toolButton videoPlay" ' +
                            'title="Play Video">' +
                            '<i class="fa-solid fa-play"></i>' +
                        '</a>';

            if (
                localStorage.usr_role == 'Project Manager' ||
                localStorage.usr_role == 'Senior Civil Engineer (Road Asset)'
            ) {
                myhtml +=
                    '<a onclick="editVideoPinDetails(' + data[i].videoPinID + ')" title="Edit">' +
                        '<i class="fa-solid fa-pencil"></i>' +
                    '</a>' +

                    '<a onclick="deleteVideoPin(' + data[i].videoPinID + ')" title="Remove">' +
                        '<i class="fa-solid fa-trash"></i>' +
                    '</a>';
            }

            myhtml += '</div></div>';


            // Add Cesium pin
            var myvideoPin = addVideoPin(
                data[i].videoPinName,
                data[i].longitude,
                data[i].latitude,
                data[i].height,
                true
            );

            videoPinsArray.push(myvideoPin);
        }

        $('#cameraPinList').html(myhtml);
    });
}


function OnClickAssetDataTable(e, event) {
    floatboxV3TurnOFF()
	let idx = $(e).data('index')
    
	var myDesc = '<table ><tbody >';
	myDesc += '<tr><th>' + "Asset Type :</th><td>" + myModels[idx].BuildingType + '</td></tr>';
	//myDesc += '<tr><th>' + "Building Name : " + myModels[i].BuildingName + '</td></tr>';
	myDesc += '<tr><th>' + "Asset Owner :</th><td>" + myModels[idx].BuildingOwner + '</td></tr>';
	myDesc += '<tr><th>' + "Asset ID :</th><td>" + myModels[idx].AssetID + '</td></tr>';
	myDesc += '<tr><th>' + "Asset Name :</th><td>" + myModels[idx].AssetName + '</td></tr>';
	myDesc += '<tr><th>' + "Asset SLA :</th><td>" + myModels[idx].AssetSLA + '</td></tr>';
	myDesc += '</tbody></table>';
	
	var cartesian = new Cesium.Cartesian3(myModels[idx].X, myModels[idx].Y, myModels[idx].Z);
	var cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
	var lon = Cesium.Math.toDegrees(cartographicPosition.longitude).toFixed(6);
	var lat = Cesium.Math.toDegrees(cartographicPosition.latitude).toFixed(6);
	


	movePosition = {
		y: $('#RIContainer').height() / 2,
		x: $('#RIContainer').width() / 2,
		z: myModels[idx].z
	}

	viewer.camera.flyTo({
		destination: cartesian,
		complete: function () {
			floatboxV3TurnON(myModels[idx].AssetName, myDesc)
		}
	});

	event.stopPropagation()
	event.preventDefault()
}

function OnClickAnimationFeed() {
    if (trackData.length == 0) {
        LoadTrackData(function (data) {
            if (!data) {
                return
            }
            trackData = data
            if (!data) {
                return
            }
			
			let myhtml = '';
			if(data.length > 0){
				for (var i = 0; i < data.length; i++) {
					myhtml += 
							'<div class="item justifyBetween" id="trackID_'+ data[i].Data_ID +'">'+
							'<div class="ellipsis">'+ data[i].Layer_name +'</div>'+
							'<div>'+
								'<a class="fly" onclick="flyToTrackAnimation(this)" title="Fly To"><i class="fa-solid fa-binoculars"></i></a>'+
								'<a class="play" onclick="playTrackAnimation(this)" title="Play Track"><i class="fa-solid fa-play"></i></a>'+
								'<a class="pause" onclick="pauseTrackAnimation(this)" title="Pause Track" style="display: none"><i class="fa-solid fa-pause"></i></a>'+
								'<a class="stop" onclick="stopTrackAnimation()" title="Stop Track"><i class="fa-solid fa-rotate-right"></i></a>';
					myhtml  +=	'</div>'+
								'</div>';
				}

			}else{
				myhtml += '<div class="item justifyBetween">There are no details stored for Track Animation.</div>';
			}

			$('#trackList').html(myhtml);
        });
    }
}

function groupOnCheck(ele) {
	var targetId = $(ele).attr('data');
	var mainDivId = $(ele).closest('.navbox').attr('id'); // check based in either layer or aic
	var flagLayer = false;

	if ($(ele).prop('checked') == true) {
		var i = 0;
		while (i < tilesetlist.length) {
			if (targetId == tilesetlist[i].subGroupID) {
				//load only after it is checked for the first time
				if (tilesetlist[i].tileset == undefined && tilesetlist[i].type == "tileset") {
					var longlat = 0;
					tilesetlist[i].tileset = LoadB3DMTileset(tilesetlist[i].url, tilesetlist[i].offset, tilesetlist[i].xoffset, tilesetlist[i].yoffset, true, longlat)
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
				$("#"+mainDivId+" #dataChk_" + tilesetlist[i].id).prop('checked', true)
			};

			if (targetId == tilesetlist[i].groupID) {

				//load only after it is checked for the first time
				if (tilesetlist[i].tileset == undefined && tilesetlist[i].type == "tileset") {
					var longlat = 0;
					tilesetlist[i].tileset = LoadB3DMTileset(tilesetlist[i].url, tilesetlist[i].offset, tilesetlist[i].xoffset, tilesetlist[i].yoffset, true, longlat)
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
				$("#"+mainDivId+" #dataChk_" + tilesetlist[i].id).prop('checked', true)
			};

			
			
			i++;
		};

	} else {
		var i = 0;
		while (i < tilesetlist.length) {
			if (targetId == tilesetlist[i].subGroupID) {
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
				$("#"+mainDivId+" #dataChk_" + tilesetlist[i].id).prop('checked', false)
			};

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
				$("#"+mainDivId+" #dataChk_" + tilesetlist[i].id).prop('checked', false)
			};
			i++;
		};
	}
	checkSiblings(ele, flagLayer)
}

function groupOnCheckNewProcess(ele) {
	var targetId = $(ele).attr('data');
	if ($(ele).prop('checked') == true) {
		var i = 0;
		while (i < tilesetlist.length) {
			if (targetId == tilesetlist[i].groupID) {
				//load only after it is checked for the first time
				if (tilesetlist[i].tileset == undefined && tilesetlist[i].type == "tileset") {
					var longlat = 0;
					tilesetlist[i].tileset = LoadB3DMTileset(tilesetlist[i].url, tilesetlist[i].offset, tilesetlist[i].xoffset, tilesetlist[i].yoffset, true, longlat)
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
	} else {
		var i = 0;
		while (i < tilesetlist.length) {
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
	}
}

function checkSiblings(ele, flagLayer, recursiveFlag = false){
	$(document.body).css({'cursor' : 'wait'});
	var n = $(ele).data('parent');
	var mainDivId = $(ele).closest('.navbox').attr('id'); // check based in either layer or aic

	if(n != undefined){

		if($('#' +mainDivId+ ' input.layerChild_' +n+ ':visible')){
	
			if($("#" +mainDivId+ " input.layerChild_" +n+ ":not(:checked):visible").length > 0){
				if($("#" +mainDivId+ " input.layerChild_" +n+ ":visible").prop("indeterminate") == true){
					if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')){
						$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("indeterminate", true)
					}
				}else{
					if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')){
						if($("#" +mainDivId+ " input.layerChild_" +n+":not(:checked):visible").length > 0){
							if($("#" +mainDivId+ " input.layerChild_" +n+ ":visible").prop("indeterminate") == true){
								if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')){
									$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("indeterminate", true)
								}
							}
							else{
								if($("#" +mainDivId+ " input.layerChild_" +n+ ":checked:visible").length > 0){
									if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')){
										$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("indeterminate", true)
									}
								}
								else{
									if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')){
										$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("indeterminate", false)
										$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("checked", false);
									}
								}
							}
							
						}
						else{
							$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("indeterminate", false)
							$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("checked", true);
						}
					}
				}
	
			}else{
				if($("#" +mainDivId+ " input.layerChild_" +n+ ":visible").prop("indeterminate") == true){
					if ($('#' +mainDivId+ ' input.layerParent_' +n+ ":visible")){
						$('#' +mainDivId+ ' input.layerParent_' +n+ ":visible").prop("indeterminate", true)
					}
				}else{
					if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')){
						if($("#" +mainDivId+ " input.layerChild_" +n+":not(:checked):visible").length > 0){
							if ($('#' +mainDivId+ ' input.layerParent_' +n+ ":visible")){
								$('#' +mainDivId+ ' input.layerParent_' +n+ ":visible").prop("indeterminate", true)
							}
						}
						else{
							if(flagLayer == true){
								if ($('#' +mainDivId+ ' input.layerParent_' +n+ ":visible")){
									$('#' +mainDivId+ ' input.layerParent_' +n+ ":visible").prop("indeterminate", true)
									$('#' +mainDivId+ ' input.layerParent_' +n+ ":visible").prop("checked", false)
									$('#' +mainDivId+ ' input.groupSub.layerParent_' +n+ ":visible").prop("checked", false)
									$('#' +mainDivId+ ' input.groupSub.layerParent_' +n+ ":visible").prop("indeterminate", false)
								}
							}
						}
					}
				}
			}
	
			if($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').hasClass('layerChild')){
				if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')) {
					checkSiblings($('#' +mainDivId+ ' input.layerParent_' +n)[0], true, true);
				}
			}
	
			if(!recursiveFlag){
				if($(ele).hasClass('layerChild')){
					$(ele).each(function(idx, el){
						var h = $(el).data('child');
						if($('#' +mainDivId+ ' input.layerChild_' +h+ ':visible')){
							$('#' +mainDivId+ ' input.layerChild_' +h+ ':visible').prop("checked", true);
						}
					})
				}
			}
		}
	
		// if current indeterminate parent should be as well
		if($(ele).prop("indeterminate") == true){
			if ($('#' +mainDivId+ ' input.layerParent_' +n+ ':visible')){
				$('#' +mainDivId+ ' input.layerParent_' +n+ ':visible').prop("indeterminate", true);
			}
				
		}
	
		if(!recursiveFlag){
			var m = $(ele).data('child');
			if($('#' +mainDivId+ ' input.layerChild_' +m+ ':visible')){
				$('#' +mainDivId+ ' input.layerChild_' +m+ ':visible').prop("checked", $(ele).is(":checked"));
			}
			if($('#' +mainDivId+ ' input.layerChild_' +m+ ':visible').hasClass('layerParent')){
				if ($('#' +mainDivId+ ' input.layerChild_' +m+ ':visible')[0]){
					checkSiblings($('#' +mainDivId+ ' input.layerChild_' +m)[0], true);
				} 
			}
		}
	}

	$(document.body).css({'cursor' : 'default'});
}

function layerOnCheck(ele) {
	var targetId = $(ele).attr('id');
	var mycheck = document.getElementById(targetId);
	var flagLayer = true;
	var checkedBoxes = $('input[name=ecwCheckbox]:checked');

	if (checkedBoxes.length > 1 && checkedBoxes.length <= 2) {
		flagAICCompare = true;
		ecwFileName = [];
		$(checkedBoxes).each(function() {
			var ecwFile = $(this.parentNode).data('filename');
			ecwFileName.push(ecwFile)
		});
	} else {
		flagAICCompare = false;
	}

	if (mycheck.checked) {

		var i = 0;
		while (i < tilesetlist.length) {
			if (targetId == "dataChk_" + tilesetlist[i].id) {

				//load only after it is checked for the first time
				if (tilesetlist[i].tileset == undefined) {
					if (tilesetlist[i].type == "tileset") {
						var longlat = 0;
						tilesetlist[i].tileset = LoadB3DMTileset(tilesetlist[i].url, tilesetlist[i].offset, tilesetlist[i].xoffset, tilesetlist[i].yoffset, true, longlat)
					} else if (tilesetlist[i].type == "kml") {
						tilesetlist[i].tileset = LoadKMLData(tilesetlist[i].url)
						landThematic.push({
							id: tilesetlist[i].id,
							name: tilesetlist[i].name,
						});
						$('#thematicLayer').append($('<option>',
							{
								value: tilesetlist[i].id,
								text : tilesetlist[i].name
							}
						));
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
						$('#thematicLayer').append($('<option>',
							{
								value: tilesetlist[i].id,
								text : tilesetlist[i].name
							}
						));
					}
					else{
						landThematic.push({
							id: tilesetlist[i].id,
							name: tilesetlist[i].name,
						});
						$('#thematicLayer').append($('<option>',
							{
								value: tilesetlist[i].id,
								text : tilesetlist[i].name
							}
						));
					}
					if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
						tilesetlist[i].tileset.then((value) => {
							value.show = true;
						});
					}
				} else { // .tileset is defined and .type is tileset
					tilesetlist[i].tileset.show = true;
				}

				checkSiblings(ele, flagLayer);

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
										$("#thematicLayer").find('option[value='+tilesetlist[i].id+']').remove();
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

				checkSiblings(ele, flagLayer);

				break;
			}
			i++;
		};
	}
}

function layerOnChangeNewProcess(ele) {
    var selectLayer = $(ele).val();
	flagLayerProcess = true;
	flagLandBoth = true;

	if(selectLayer == 'default'){
		resetJogetConOpDraw();
	}
	else{
		var j = 0;
		while (j < layerProcessArr.length) {
			switch (layerProcessArr[j].type) {
				case "kml":
					if (layerProcessArr[j].tileset && Object.prototype.toString.call(layerProcessArr[j].tileset) === "[object Promise]") {
						layerProcessArr[j].tileset.then((value) => {
							viewerNewProcess.dataSources.remove(value);
						})
					}
					else{
						viewerNewProcess.dataSources.remove(layerProcessArr[j].tileset);
					}
					layerProcessArr[j].tileset = null;
					break;
				case "shp":
					if (layerProcessArr[j].tileset && Object.prototype.toString.call(layerProcessArr[j].tileset) === "[object Promise]") {
						layerProcessArr[j].tileset.then((value) => {
							viewerNewProcess.imageryLayers.remove(value)
						})
					} else {
						viewerNewProcess.imageryLayers.remove(layerProcessArr[j].tileset)
					}
					layerProcessArr[j].tileset = null;
					break;
			}
			j++;
		};

		layerProcessArr = [];

		var i = 0;
		while (i < tilesetlistNewProcess.length) {
			if (selectLayer == "dataChk_" + tilesetlistNewProcess[i].id) {
				//load only after it is choose for first time
				if (tilesetlistNewProcess[i].tileset == undefined) {
					if (tilesetlistNewProcess[i].type == "kml") {
						tilesetlistNewProcess[i].tileset = LoadKMLData(tilesetlistNewProcess[i].url)
					} else if(tilesetlistNewProcess[i].type == "shp" || tilesetlistNewProcess[i].type == "aerial"){
						var flagTileSet = true;
						tilesetlistNewProcess[i].tileset = LoadWMSTile(tilesetlistNewProcess[i].ownerLayerID, tilesetlistNewProcess[i].url, tilesetlistNewProcess[i].style, flagTileSet)
					}

				}

				layerProcessArr.push(tilesetlistNewProcess[i]);
				flyToLayerNewProcess(selectLayer)
				break;
			}
			i++;
		};
	}
	$(".nextPage").css('display', 'unset')
}

function flyToGroup(ele){

	var layerID = $(ele).parent().next().attr('id')
	var firstId = $('#'+layerID+' .item:first').attr('id')
	var firstIdDOM =  document.getElementById(firstId).querySelector(".layerInput i")

	flyToLayer(firstIdDOM)

}

function flyToLayer(ele) {
	floatboxV3TurnOFF()
	var name = ele.parentNode.firstChild.id

	if (ele.parentNode.firstChild.checked == false) {
		return
	}
	var i = 0;
	while (i < tilesetlist.length) {
		if ("dataChk_" + tilesetlist[i].id == name) {
			if (tilesetlist[i].type == "shp" || tilesetlist[i].type == "aerial") {
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

function flyToLayerNewProcess(layerID) {
	var i = 0;
	while (i < tilesetlistNewProcess.length) {
		if ("dataChk_" + tilesetlistNewProcess[i].id == layerID) {
			if (tilesetlistNewProcess[i].type == "shp" || tilesetlistNewProcess[i].type == "aerial") {
				var flagNewProcessViewer = true;
				wmsFlyTo(tilesetlistNewProcess[i].ownerLayerID, tilesetlistNewProcess[i].url, flagNewProcessViewer)
			}
			else {
				viewerNewProcess.flyTo(tilesetlistNewProcess[i].tileset);
			}
			flagAnnotateData = true;
			break;
		}
		i++;
	};
}

function togglelist(e) {
	let itemclicked = $(e).attr('id');
    let itemtoopen = $(e).attr('rel');
	var toggle = $(e).find('i.fa-caret-right').length;

    if (toggle) {
		$('#' + itemtoopen).attr('style', 'display: block;');
		$('#' + itemclicked).addClass('active')
		
		$(e).find('i.fa-solid').removeClass('fa-caret-right');
		$(e).find('i.fa-solid').addClass('fa-caret-down');
    } else {
		$('#' + itemtoopen).attr('style', 'display: none;');
        $('#' + itemclicked).removeClass('active')

		$(e).find('i.fa-solid').addClass('fa-caret-right');
		$(e).find('i.fa-solid').removeClass('fa-caret-down');
    }
}

function toggleTab(pageShow) {
	const callToActionBtns = document.querySelectorAll(".tab");

	callToActionBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			callToActionBtns.forEach(f => f.classList.remove('active'));
			e.target.classList.toggle("active");
			$('#' + pageShow).attr('style', 'display: block;');
		});
	});
}

async function LoadKMLData(URL) {
	var mykml = new Cesium.KmlDataSource();
	await mykml.load(URL, {
		clampToGround: true
	}).then( function (dataSource){
			var entities = dataSource.entities.values;
			for (let entity of entities) {
				entity.filePathOriginal = URL;
			}
			console.log("loaded")
		}
	);

	if(flagLayerProcess){
		viewerNewProcess.dataSources.add(mykml);
	}
	else{
		viewer.dataSources.add(mykml);
		thematicProps.landEntities = mykml.entities.values;
	}

	return mykml
}

async function LoadKMLDataTerrain(URL) {
	var mykml = new Cesium.KmlDataSource();
	await mykml.load(URL, {
		clampToGround: true
	}).then( function (dataSource){
			var entities = dataSource.entities.values;
			for (let entity of entities) {
				entity.filePathOriginal = URL;
			}
			console.log("loaded")
		}
	);

	viewer.dataSources.add(mykml);
	thematicProps.landEntities = mykml.entities.values;

	return mykml
}

async function LoadWMSTile(ownerLayer, layer, style, flagTileSet = false){
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

	if(flagTileSet){
		return viewerNewProcess.imageryLayers.addImageryProvider(wms);
	}else{
		return viewer.imageryLayers.addImageryProvider(wms);
	}

}

function wmsFlyTo(ownerLayer, wmsName, flagNewProcessViewer = false) {
	var ownerProjectId = (ownerLayer) ? ownerLayer : localStorage.p_id_name;
	let layer = wmsCapabilities.Capability.Layer.Layer.find(
		(l) => l.Name === ownerProjectId + ":" + wmsName
	);
	let extent = layer.BoundingBox[0].extent
	var rect = Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]); // S.E.A. extent
	if(flagNewProcessViewer){
		viewerNewProcess.camera.flyTo({
			destination: rect
		});
	}else{
		viewer.camera.flyTo({
			destination: rect
		});
	}
}

//get WMS Properties for naming, projection, etc..
function getWMSCap() {
	if(!GEOHOST) return; // if geo is not defined skip
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

function LoadB3DMTileset(url, height, xoffset, yoffset, defaultview, longlat) {
	var mytileset;
	url = "../" + url;
	if (defaultview == true) {
		// for OBYU optimization
		var skipLevelOfDetail = false;
		var preferLeaves = false;
		if(SYSTEM == "OBYU"){
			skipLevelOfDetail = true;
			preferLeaves = true;
		}
		mytileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
			url: url,
			dynamicScreenSpaceError: true,
			dynamicScreenSpaceErrorDensity: 0.00008,
			dynamicScreenSpaceErrorFactor: 64.0,
			dynamicScreenSpaceErrorHeightFalloff: 0.125,
			baseScreenSpaceError: 1024,
			progressiveResolutionHeightFraction: 0.5,
			maximumScreenSpaceError: 4,
			cullRequestsWhileMovingMultiplier: 200,
			skipLevelOfDetail: skipLevelOfDetail,
			preferLeaves: preferLeaves
		}));

		if (longlat == 1) {
			mytileset.readyPromise.then(function () {
				var longitude = 121.02112508834009;
				var latitude = 14.696846470202738;
				var height = 15.5;
				var cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
				var transform = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(43), 0, 0));
				mytileset._root.transform = Cesium.Matrix4.IDENTITY;
				mytileset.modelMatrix = transform;
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
			});

		} else {
			mytileset.readyPromise.then(function (mytileset) {
				
				var heightOffset = height;
				var xAxisOffset = xoffset;
				var yAxisOffset = yoffset;

				var boundingSphere = mytileset.boundingSphere;
				var cartographic = Cesium.Cartographic.fromCartesian(
					boundingSphere.center
				);

				var surface = Cesium.Cartesian3.fromRadians(
					cartographic.longitude,
					cartographic.latitude,
					0.0
				);

				var xInRadians = Cesium.Math.toRadians(xAxisOffset);
				var yInRadians = Cesium.Math.toRadians(yAxisOffset);

				var newLongitude = cartographic.longitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(xInRadians)));
				var newLatitude = cartographic.latitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(yInRadians)));
				var newHeight = heightOffset;
			
				var newPosition = Cesium.Cartesian3.fromRadians(
					newLongitude, 
					newLatitude, 
					newHeight
				);
			
				var translation = Cesium.Cartesian3.subtract(
					newPosition,
					surface,
					new Cesium.Cartesian3()
				);

				mytileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
			});
		}
	};
	return (mytileset);
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

function manageLayer() {

	var manageLayerListHTML = '';

	$.ajax({
		type: "POST",
		url: '../BackEnd/fetchDatav3.php',
		dataType: 'json',
		data: { functionName: "getProjectLayerList" },
		success: function (obj) {
			obj.data.forEach((row) => {
				let def_view;
				let animate;
				if (row.Default_View == 0) {
					def_view = "OFF"
				} else {
					def_view = "ON"
				}
				if(row.Animation == 0 || row.Animation == null || row.Animation == ''){
					animate = "Disable"
				}else{
					animate = "Enable"
				}
				upload_date = new Date(row.Added_Date);
				upload_date = upload_date.toDateString();
				
				manageLayerListHTML += `<div class="list" onclick="getLayerDetail(this)" data-name="`+row.Layer_Name+`" data-id="`+row.Data_ID+`" data-type="`+row.Data_Type+`" data-view="`+def_view+`" data-date="`+upload_date+`" data-owner="`+row.Data_Owner+`"  data-offset="`+ row.Offset +`" data-x-offset="`+ row.X_Offset +`" data-y-offset="`+ row.Y_Offset +`" data-animate="`+ animate +`">
											<div class="column1" rel="id-layer_`+row.Data_ID+`"><a class="label lineClamp">`+row.Layer_Name+`</a></div>
											<div class="column2 width"><a class="label">`+row.Data_Type+`</a></div>
											<div class="column2 width"><a class="label lineClamp">Default: `+def_view+`</a></div>
											<div class="column2 width">`+upload_date+`</div>
											<div class="column2 width"><i class="fa-solid fa-pencil" title="Edit Layer" data-name="`+row.Layer_Name+`" data-id="`+row.Data_ID+`" data-type="`+row.Data_Type+`" data-view="`+def_view+`" data-date="`+upload_date+`" data-owner="`+row.Data_Owner+`" data-missionId="`+row.md_mission_id+`" data-dateCreated="`+row.md_date_created+`" data-startTime="`+row.md_start_time+`" data-endTime="`+row.md_end_time+`" data-metaId="`+row.md_meta_id+`"  data-md_data_category="`+row.md_data_category+`"  data-projectLayerId="`+row.Layer_ID+`"  data-show_metadata="`+row.show_metadata+`" onclick="editLayerDetails(this)" class="edit"></i></div>
										</div>`
			})
			$("#manageLayerList").html(manageLayerListHTML);
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	})
}

function adjustLayer() {
	$("#adjustLayerDetail").html("");
	var adjustLayerListHTML = '';

	$.ajax({
		type: "POST",
		url: '../BackEnd/fetchDatav3.php',
		dataType: 'json',
		data: { functionName: "getProjectLayerList" },
		success: function (obj) {

			adjustLayerListHTML += `<div class="list select">
										<input type="checkbox" id="multipleUpdate" value="1" onclick="onSelectMultipleUpdate(this)"> Multiple Update
									</div>`;
			
			adjustLayerListHTML += `<div class="list noHover">
									<div class="column2 widthFitContent"><input style="visibility:hidden" type="checkbox"></input></div>
									<div class="column1 widthBig">Layer</div>
									<div class="column2 width">Height</div>
									<div class="column2 width">X</div>
									<div class="column2 width">Y</div>
									<div class="column2 width justifyStart">Date</div>
								</div>`;

			obj.data.forEach((row) => {
				upload_date = new Date(row.Added_Date);
				upload_date = upload_date.toDateString();
				var offset = row.Offset != null ? parseFloat(row.Offset).toFixed(3) : 0.000;
				var xoffset = row.X_Offset != null ? parseFloat(row.X_Offset).toFixed(3) : 0.000;
				var yoffset = row.Y_Offset != null ? parseFloat(row.Y_Offset).toFixed(3) : 0.000;

				if(row.Data_Type == 'B3DM'){
					adjustLayerListHTML += `
											<div class="list noHover">
												<div class="column2 widthFitContent">
													<input type="checkbox" name="selectAdjustLayer[]" class="selectAdjustLayer" id="adjustLayer_`+row.Data_ID+`" onclick="onSelectAdjustLayer(this)" data-name="`+row.Layer_Name+`" data-id="`+row.Data_ID+`" data-type="`+row.Data_Type+`" data-owner="`+row.Data_Owner+`" data-offset="`+ row.Offset +`" data-x-offset="`+ row.X_Offset +`" data-y-offset="`+ row.Y_Offset +`" value="`+row.Data_ID+`"></input>
												</div>
												<div class="column1 widthBig" rel="id-layer_`+row.Data_ID+`"><a class="label lineClamp">`+row.Layer_Name+`</a></div>
												<div class="column2 width" id="adjustLayer_offset_`+row.Data_ID+`">`+offset+`</div>
												<div class="column2 width" id="adjustLayer_xoffset_`+row.Data_ID+`">`+xoffset+`</div>
												<div class="column2 width" id="adjustLayer_yoffset_`+row.Data_ID+`">`+yoffset+`</div>
												<div class="column2 width">`+upload_date+`</div>
											</div>`;
											
											
											
				}
				
			})
			$("#adjustLayerList").html(adjustLayerListHTML);

			// var elavation = { offset: 0, x_offset: 0, y_offset: 0 };
			// adjustLayerFeature('260', elavation);
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	})
}

function getProjectWiseData(nodeId, instanceID) {
	$("div.loadingcontainer-mainadmin").css("display", "block");
	$("#loadingText").text("Fetching files ..");
	$.ajax({
		type: "POST",
		url: '../BackEnd/fetchDatav3.php', 
		dataType: 'json',
		data: {
			functionName: 'getPWDirectories',
			instanceID: instanceID
		},
		success: function (obj, textstatus) {
			if(obj['msg'] == "success"){
				var pwdata  = obj['data'];
				var desc = '';
				var floatboxBodyHTML = '';
				for (var j = 0; j < pwdata.length; j++) {
					if(pwdata[j].folder){
						$('#infoRootNode').jstree().create_node(nodeId, {
							"id": pwdata[j].id,
							"text": pwdata[j].text
						})
					}else{
						if(pwdata[j].ClassName == "Document"){
							url = PWDocURL + pwdata[j].id + "/$file";
							desc += '<div id=' + url + ' onClick="viewFile(this)" style="cursor: pointer"> ' +pwdata[j].text + '</div>';
						}else if(pwdata[j].ClassName == "LogicalSet"){
							url = PWLogURL + pwdata[j].id + "/$file";
							desc += '<div id=' + url + ' onClick="viewFile(this)" style="cursor: pointer"> ' +pwdata[j].text + '</div>';
						}
					}
				}
				$('#infoRootNode').jstree(true).get_node(nodeId).data = desc;
				var scene = viewer.scene;
				var p3d = entitiesArray[entityIndex]._position._value;

				var p = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, p3d);
				if (p.y !== undefined) {
					p.y -= 50;
				}
				
				if (!p) {
					return;
				}
				movePosition = p
				
				$('.column').html(desc); //to display documents in documents tab.

				$(".floatBoxBody").html(entitiesArray[entityIndex]._description._value);
				$(".floatBox#floatBoxId .header").html(entitiesArray[entityIndex].name)
				$(".floatbox#floatBoxId").css("transform", "translate(-50%, -115%)")
				cameraClickPosition = {
					lon: locations[entityIndex].longitude,
					lat: locations[entityIndex].latitude,
					alt: 0
				};
				viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(locations[entityIndex].longitude, locations[entityIndex].latitude, 2000.0),
					duration: 2,
					complete: function () {
						floatboxBodyHTML += '<div>Longitude: ' + locations[entityIndex].longitude + ' </div>';
						floatboxBodyHTML += '<div>Latitude: ' + locations[entityIndex].latitude + ' </div>';
						$(".floatBox#floatBoxId").css("display", "block")
						$(".floatBox#floatBoxId").css("top", "50%")
						$(".floatBox#floatBoxId").css("left", "50%")
						$(".floatBox#floatBoxId").fadeIn(150)
						$('.floatBoxBody').html(floatboxBodyHTML);

						if (flagFolderDirectory == true) {
							clearAllFlag();
							$('.floatBoxFooter .folderMoreInfo').css("display", "block")
						}
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

function viewFile(ele) {
	// check if file is sp or project wise
	var method = $(ele).data('method');
	method = (method) ? method : 'pw';
	if (method == 'sp') {
		fileUrl = $(ele).data('url');
		fileName = $(ele).text();
	} else {
		fileUrl = ele.id;
		fileName = document.getElementById(ele.id).textContent;
		if (!pwloginCredentials) {
			$("#wizard").fadeIn(100)
			$(".modal-container.insight").css("display", "block")
			$(".modal-container.insight .pwCredentials").css("display", "block")
			$(`.modal-content`).css("width", "30vw").css("height", "80vh")
			$(".modal-header a").text("Connecting to ProjectWise Server")


			$('#pwUserName').val("");
			$('#pwPassword').val("");
			$('#pwCredentials').css("display", "block");
			return;
		}
	}

	$.ajax({
		type: "POST",
		url: '../BackEnd/fetchDatav3.php',
		dataType: 'json',
		data: {
			functionName: 'docViewer',
			fileUrl: fileUrl,
			fileName: fileName,
			fileMethod: method
		},
		success: function (obj, textstatus) {
			console.log(obj);
			var message = obj['msg'];
			var url = '../'+obj['fileurl'];
			if (message == "success") {
				var open_url;
				if(obj['type'] == 'external'){
                    open_url = obj['fileurl'];
                }else{
                    open_url = url;
                }
                window.open(open_url);
				pwloginCredentials = true;
			}  else  if("download".includes(message)){
				var link = document.createElement("a");
				if (link.download !== undefined) {
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
					content: obj['msg']
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

$('#folderRoot').on("select_node.jstree", function (e, data) {
    // var children = $('#folderRoot').jstree().get_children_dom(data.node.id);
    $('#folderRoot').jstree().show_all();
    var children = $('#folderRoot').jstree().get_node(data.node.id).children;
    $('div.loadingcontainer-mainadmin').css('display', 'block')
    $('#loadingText').text("Getting PW subfolders");
    $('#entityFormSave').prop('disabled', true);
    $('#entityFormCancel').prop('disabled', true);
    $('#closebutton-editentityForm').css('display', 'none')
    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: {
			functionName: 'getProjectWiseFolders',
            instanceID: data.node.id
        },
        success: function (obj, textstatus) {
            if (obj['data']['errorId']) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Error in fetching the Projectwise folders!. Please click the folder again to fetch.'
                });
                $('div.loadingcontainer-mainadmin').css('display', 'none')
                $('.loader').css("animation-duration", '1000ms');
                $('#entityFormSave').prop('disabled', false);
                $('#entityFormCancel').prop('disabled', false);
                $('#closebutton-editentityForm').css('display', 'block');
                return;

            }
            var mydata = obj['data']['instances'];
            for (var i = 0; i < mydata.length; i++) {
                $('#folderRoot').jstree().create_node(data.node.id, {
                    "id": mydata[i].instanceId,
                    "text": mydata[i].properties.Label
                })
            }

            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
            $('#entityFormSave').prop('disabled', false);
            $('#entityFormCancel').prop('disabled', false);
            $('#closebutton-editentityForm').css('display', 'block')
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);

            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Error in fetching the Projectwise folders!. Please click the browse again to fetch.'
            });
            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
            $('#entityFormSave').prop('disabled', false);
            $('#entityFormCancel').prop('disabled', false);
            $('#closebutton-editentityForm').css('display', 'block')
        }
    });

});

function getInfoRootNode(){
	$("#infoRootNode").on("select_node.jstree", function (e, data) {
		flagFolderDirectory = true;

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
							
							$('.column').html(mydesc); //to display documents in documents tab.
							$(".floatBoxBody").html(entitiesArray[entityIndex]._description._value);
							$(".floatBox#floatBoxId .header").html(entitiesArray[entityIndex].name)
			
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
				$('.column').html(mydesc); //to display documents in documents tab.
				$(".floatBoxBody").html(entitiesArray[entityIndex]._description._value);
				$(".floatBox#floatBoxId .header").html(entitiesArray[entityIndex].name)
	
			}
		}
	});
}


function getProjectWiseFolders() {
    if (!getPWFolderData) {
        $('div.loadingcontainer-mainadmin').css('display', 'block')
        $('#loadingText').text("Getting PW folders");
        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            dataType: 'json',
			data: {
				functionName: 'getProjectWiseFolders',
			},
            success: function (obj, textstatus) {
                var data = [];
                if (obj['data']['errorID'] || obj['root']['errorID']) {
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: 'Error in fetching the Projectwise folders!. Please click the folder again to fetch.'
                    });
                    $('div.loadingcontainer-mainadmin').css('display', 'none')
                    $('.loader').css("animation-duration", '1000ms');
                    return;

                }

                if (obj['root']) {
                    var mydata = {
                        id: obj['root'].instanceId,
                        text: obj['root'].properties.DisplayLabel,
                        parent: "#"
                    }
                    data.push(mydata);
                };
                if (obj['data']) {
                    for (var i = 0; i < obj['data'].length; i++) {
                        var mydata = {
                            id: obj['data'][i].instanceId,
                            text: obj['data'][i]['properties']['Label'],
                            parent: obj['root'].instanceId
                        }
                        data.push(mydata);
                    }
                }

                if (folderTree) {
                    $('#folderRoot').jstree("destroy").empty();
                }
                $('#folderRoot').jstree({
                    'core': {
                        'data': data,
                        'check_callback': true
                    },
                    'plugins': ["sort"]
                });
                getPWFolderData = true;

                $('div.loadingcontainer-mainadmin').css('display', 'none')
                $('.loader').css("animation-duration", '1000ms');
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Error in getting the projectwise Folders. Please click the check box again to get the folders'
                });
                $('div.loadingcontainer-mainadmin').css('display', 'none')
                $('.loader').css("animation-duration", '1000ms');
            }
        });
    };
}

function LoadProjectWiseFolders(callback) {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			callback(this.responseText);
		}
	});
	xhr.open("GET", "../BackEnd/getProjectWiseFolders.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	xhr.send();
}

function updateLongLat(){
	var coordinateString = jogetConOpDraw.coordsArray.toString()
    $('.longLatVal').html(coordinateString)
}

function updateLotStructChain(){
	var coordinateString = jogetConOpDraw.coordsArray.toString()

    $('.longLatVal').html(coordinateString)

    $('.lotVal').html(lot)
	
	if(jogetProcessApp == "LI"){
		$('.structureVal').html(struct)
		$('.chainageVal').html(chainage)
	}
}

$("#clearCoord").click(function () {
    $('.longLatVal').html('')
    $('.lotVal').html('')
    $('.structureVal').html('')
	$('.chainageVal').html('')

	// $(".nextPage").css('display', 'none')

	jogetConOpDraw.billboardEntities.forEach(function (entity) {
		viewerNewProcess.entities.remove(entity)
	})

	if (jogetConOpDraw.entity !== null) {
		viewerNewProcess.entities.remove(jogetConOpDraw.entity)
	}

	if(pickedLot && pickedLot._polygon && pickedLot._polygon.material){
    	pickedLot._polygon.material = new Cesium.Color(polyLotRed, polyLotGreen, polyLotBlue, polyLotAlpha);
  	}

	jogetConOpDraw.billboardEntities = []
	jogetConOpDraw.coordsArray = [];
})

$("#clearCoords").click(function () {
    $('.longLatVal').html('')
    $('.lotVal').html('')
    $('.structureVal').html('')
	$('.chainageVal').html('')

	// $(".nextPage").css('display', 'none')

	jogetConOpDraw.billboardEntities.forEach(function (entity) {
		viewerNewProcess.entities.remove(entity)
	})

	if (jogetConOpDraw.entity !== null) {
		viewerNewProcess.entities.remove(jogetConOpDraw.entity)
	}

	if(pickedLot && pickedLot._polygon && pickedLot._polygon.material){
    	pickedLot._polygon.material = new Cesium.Color(polyLotRed, polyLotGreen, polyLotBlue, polyLotAlpha);
  	}

	jogetConOpDraw.billboardEntities = []
	jogetConOpDraw.coordsArray = [];
})

function setProgressSummaryFunct(){
	loadProgressSummary();
}

function loadProgressSummary(){
	$('.progressFileName').html('');

	if(SYSTEM == "KKR"){
		$.ajax({
			url: './../JS/uploader/progressUploadv3.php',  
			type: 'POST',
			dataType: 'JSON',
			data: {functionName : "progressTableData"},
			success:function(data){
				let progHTML = '';
				if (data.data) {
					let progData = data.data;
					progData.forEach(function(ele,idx){
						progHTML += '<div class="row summary fiveColumn">'
						progHTML += '<div class="M textContainer">'+ele.pps_month_year.split(" ")[0]+'</div>'
						progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_financial_early).toFixed(2)+'</div>'
						progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_financial_late).toFixed(2)+'</div>'
						progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_physical_early).toFixed(2)+'</div>'
						progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_physical_late).toFixed(2)+'</div>'
						progHTML += '</div>';
					})
				}
				if(localStorage.page_pageOpen == "" || localStorage.page_pageOpen == undefined){
					$("#excelTBodyOutside").html(progHTML);
				}else{
					$("#excelTBodyInside").html(progHTML);
				}
			}
		});
	}else{
		loadProgressSummaryTableOBYU('', plannedVal = '', plannedFinVal = '', selWPC = false);
    	populateSectionOption();

		$("#sectionCheckBoxInside").prop('checked', false);
		$("#sectionCheckBoxOutide").prop('checked', false);
		$("#progressUploadSectionDivInside").removeClass("active");
		$("#progressUploadSectionDivOutside").removeClass("active");
	}
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

function resetJogetConOpDraw() {
    $('#RIContainerProcess').css('cursor', "default");
	//$('#RIContainerProcessProj').css('cursor', "default");

	let title = $(".modal-header a").text();
	var cesiumFrame;

	if(!localStorage.page_pageOpen){
		cesiumFrame = title;
	}else{
		cesiumFrame = (localStorage.page_pageOpen == "myInsights") ? 'Manage Insights' : title;
	}

	switch (cesiumFrame) {
		case "Manage Project":
		case "Manage Construction Process":
			viewerUse = viewerManageProcess;
			break;
		case "Process Project":
			viewerUse = viewer;
			break;
		default:
			viewerUse = viewer;
			break;
	}

	if (jogetConOpDraw.entity) {
		jogetConOpDraw.entity = null;
	}

	if (jogetConOpDraw.billboardEntities) {
		jogetConOpDraw.billboardEntities.forEach(function (entity) {
			viewerUse.entities.remove(entity);
		});
		jogetConOpDraw.billboardEntities = [];
	}
  
	jogetConOpDraw.processName = null;
	jogetConOpDraw.flag = false;
	jogetConOpDraw.shape = null;
	jogetConOpDraw.coordsArray = [];
	jogetConOpDraw.hierarchyArray = [];
	jogetConOpDraw.coordsRad = [];
	jogetConOpDraw.loadedFreq = null;
	flagLandBoth = false;
	flagPolyProcess = false;

	if(pickedLot && pickedLot._polygon && pickedLot._polygon.material){
	  pickedLot._polygon.material = new Cesium.Color(polyLotRed, polyLotGreen, polyLotBlue, polyLotAlpha);
	}
	
	if(shpPickedLot){
	  ChangeWMSTile();
	}

	if(flagLayerProcess){
		$('.longLatVal').html('')
		$('.lotVal').html('')
		$('.structureVal').html('')
		$('.chainageVal').html('')

		var j = 0;
		for (j = 0; j < layerProcessArr.length; j++) {
			switch (layerProcessArr[j].type) {
				case "kml":
					if (layerProcessArr[j].tileset && Object.prototype.toString.call(layerProcessArr[j].tileset) === "[object Promise]") {
						viewerNewProcess.dataSources.remove(layerProcessArr[j].tileset);
					}
					else{
						viewerNewProcess.dataSources.remove(layerProcessArr[j].tileset);
					}
					layerProcessArr[j].tileset = null;
					break;
				case "shp":
					if (layerProcessArr[j].tileset && Object.prototype.toString.call(layerProcessArr[j].tileset) === "[object Promise]") {
						viewerNewProcess.imageryLayers.remove(value)
					} else {
						viewerNewProcess.imageryLayers.remove(layerProcessArr[j].tileset)
					}
					layerProcessArr[j].tileset = null;
					break;
			}
			j++;
		};

		layerProcessArr = [];
		flagLayerProcess = false;
	}
}

const viewModelTerrain = {
	translucencyEnabled: true,
	fadeByDistance: true,
	alpha: 1,
};

function updateTerrainTransparency() {
	viewer.scene.globe.translucency.enabled = viewModelTerrain.translucencyEnabled;
  
	let alpha = Number(viewModelTerrain.alpha);
	alpha = !isNaN(alpha) ? alpha : 1.0;
	alpha = Cesium.Math.clamp(alpha, 0.0, 1.0);
  
	viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = alpha;
	viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = viewModelTerrain.fadeByDistance? 1.0: alpha;
}

function controlTerrainTransparency(){
	Cesium.knockout.track(viewModelTerrain);
	const toolbar = document.getElementById("toolbarTransparency");
	Cesium.knockout.applyBindings(viewModelTerrain, toolbar);
	for (const name in viewModelTerrain) {
		if (viewModelTerrain.hasOwnProperty(name)) {
			Cesium.knockout.getObservable(viewModelTerrain, name).subscribe(updateTerrainTransparency);
		}
	}
}

function controlBrightness(){
	var viewermap = new Cesium.Camera(viewer.scene);
	var viewModel = {
		show: true,
		brightness: -0.3
	};

	Cesium.knockout.track(viewModel);
	const toolbar = document.getElementById("ScreenSpaceTool");
	Cesium.knockout.applyBindings(viewModel, toolbar);

	for (const name in viewModel) {
		if (viewModel.hasOwnProperty(name)) {
			Cesium.knockout
			.getObservable(viewModel, name)
			.subscribe(updatePostProcess);
		}
	}

	function updatePostProcess() {
		const bloom = viewer.scene.postProcessStages.bloom;
		bloom.enabled = Boolean(viewModel.show);
		bloom.uniforms.brightness = Number(viewModel.brightness);
	}

	updatePostProcess()
}

function ControlMouseDownv3(button_id) {
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

function ControlMouseLeavev3(button_id) {
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

function getPWConfig() {
	$.ajax({
		type: "POST",
		url: '../BackEnd/fetchDatav3.php',
		data: {
			functionName: "getConfigDetailsPWPBi"
		},
		dataType: 'json',
		success: function (obj, textstatus) {
			if (obj) {
				var mydata = obj['data'];
				if (!mydata) {
					return
				}
				for (var i = 0; i < mydata.length; i++) {
					if (mydata[i].type == "PW") {
						PWDocURL = mydata[i].url + "PW_WSG/Document/";
						PWLogURL = mydata[i].url + "PW_WSG/LogicalSet/";
					}
				}
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	})
}

function fetchDataMLP(e){
    $.ajax({
		url: '../Components/assetAnalysis/mlpAnalysis.json',
		data: {func : 'fetchData', date : $(e).val()},
		type: 'POST',
		success: function (ret) {
			res = JSON.parse(ret);

			if(res.mlpDataHTML){ 
				mlpTableDate = res.mlpDataHTML;
				$('#pavementUploadTable').contents().find('#mplAnalysisData').html(res.mlpDataHTML);
			}
			if(res.dateTitle){
				mlpTitleDate = res.dateTitle;
				$('#pavementUploadTable').contents().find('#titleHeader').html(' : ' + res.dateTitle);
			}
		}
	});
}

function filterChgMLP(){
    var chgFromOpt = $('#chgFromMLP',parent.document).val(); 
    var chgToOpt = $('#chgToMLP',parent.document).val(); 
    var chgSearch = $('#pavementUploadTable').contents().find('.chainageSearch');

    if (chgFromOpt != '' && chgToOpt != ''){
        // both has value
        chgSearch.hide();
        var maxChg = parseFloat(chgToOpt);
        var minChg = parseFloat(chgFromOpt);
        chgSearch.each(function(){
            var chgTrMax = parseFloat($(this).data('max'));
            var chgTrMin = parseFloat($(this).data('min'));
            if(chgTrMin >= minChg && chgTrMax <= maxChg) $(this).show();
        })
    }else if (chgFromOpt != '' && chgToOpt == ''){
        // only from has value
        chgSearch.hide();
        var minChg = parseFloat(chgFromOpt);
        chgSearch.each(function(){
            var chgTrMin = parseFloat($(this).data('min'));
            if(chgTrMin >= minChg) $(this).show();
        })
    }else if (chgFromOpt == '' && chgToOpt != ''){
        // only to has value
        chgSearch.hide();
        var maxChg = parseFloat(chgToOpt);
        chgSearch.each(function(){
            var chgTrMax = parseFloat($(this).data('max'));
            if(chgTrMax <= maxChg) $(this).show();
        })
    }else{
        chgSearch.show();
    }
}

function drawConOpTempEntity(obj) {
	let title = $(".modal-header a").text();

	var cesiumFrame = (localStorage.page_pageOpen == "myInsights") ? 'Manage Insights' : title;
		switch (cesiumFrame) {
			case "Manage Project":
			case "Manage Construction Process":
				viewerUse = viewerManageProcess;
				break;
			case "Manage Insights":
				viewerUse = viewer;
				break;
		}

	if (!obj.coord) {
	  console.log("No coordinate found.");
	  return;
	}
	let coordArray = obj.coord.split(",");
	var drawnEntity;

	if(obj.coord_to){
		//line for NCR & NOI
		let coordToArray = obj.coord_to.split(",");
		console.log('LINE : '+coordToArray);
		drawnEntity = viewerUse.entities.add({
		  name: "Line",
		  polyline: {
			positions: Cesium.Cartesian3.fromDegreesArray([
			  coordArray[0],
			  coordArray[1],
			  coordToArray[0],
			  coordToArray[1],
			  
			]),
			width: 3.5,
			arcType: Cesium.ArcType.RHUMB,
			material: Cesium.Color.RED
			
		  }
		});
	
	}else if (coordArray.length == 2) {
	  //point
	  console.log('POINT: '+coordArray);
	  let floatBoxTitle = ""
	  if (localStorage.Project_type == "ASSET"){
		floatBoxTitle = obj['ASSET_NAME'] ?  obj['ASSET_NAME'] : ""
	  } else{
		floatBoxTitle = "Point"
	  }
	  
	  drawnEntity = viewerUse.entities.add({
		name: floatBoxTitle,
		position: Cesium.Cartesian3.fromDegrees(coordArray[0], coordArray[1], 0),
		billboard: {
		  image: "../Images/redPlaceholder.png",
		  horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
		  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
		  width: 30,
		  height: 30,
		},
	  });
	} else if (coordArray.length >= 6) {
	  //polygon
	  let hierarchyArray = Cesium.Cartesian3.fromDegreesArray(coordArray);
	  drawnEntity = viewerUse.entities.add({
		polygon: {
		  hierarchy: hierarchyArray,
		  outline: true,
		  height: 0,
		  extrudedHeight: 0,
		  material: Cesium.Color.BLUE,
		},
	  });
	}

	let head = ''
	let desc = '<div class="projectDesc">';
	desc += "<table ><tbody >";
	for (const [key, value] of Object.entries(obj)) {
		let k = key.replace(/_/g, " ")

		if (k == "Process") {
			head += obj[key]
		} else if (k == "Ref") {
			drawnEntity.name = obj[key];
			head += " - "+obj[key]
		} else if (k == "Coord" || k == "coord" ) {
			//skip
		} else if (typeof obj[key] == "object") {
			//skip
		} else if (k == "processId") {
			//skip
		} else if (k == "message") {
			//skip
		} else if (k == "function name") {
			//skip
		} else if (k == "ElementID") {
			//skip
		} else {
			desc += "<tr><th>" + k + ": </th><td>" + value + "</td></tr>";
		}
	};
	
	$(".floatBoxHeader.header").html(head)
	desc += "</tbody></table></div>";
	drawnEntity.description = desc;

	setTimeout(function () {
		movePosition = {
			y: null,
			x: null,
		};
		movePosition.x = window.innerWidth / 2;
		movePosition.y = window.innerHeight / 2;
	}, 3000);

	viewerUse.flyTo(drawnEntity);

	var activeTab = localStorage.page_pageOpen

	if(title != 'Manage Project' && activeTab == "myInsights"){

		wizardCancelPage()
	}

	return drawnEntity;
}
  
function zoomToGetData() {
	let title = $(".modal-header a").text();

	if(conOpEventListener){
	  return
	}

	conOpEventListener = true;
	var eventMethod = window.addEventListener
	  ? "addEventListener"
	  : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	// Listen to message from child window
	eventer(
	  messageEvent,
	  function (e) {
		var cesiumFrame = (localStorage.page_pageOpen == "myInsights") ? 'Manage Insights' : title;
		switch (cesiumFrame) {
			case "Manage Project":
			case "Manage Construction Process":
				viewerUse = viewerManageProcess;
				break;
			case "Manage Insights":
				viewerUse = viewer;
				break;
		}

		if (e.data.close){
		  return;
		}

		var parsedData = JSON.parse(JSON.stringify(e.data));

		if(cesiumObjProcess){
			if (jogetConOpDraw.entity) {
				jogetConOpDraw.entity = null;
			}
		}
		else if(cesiumObj){
			if (jogetConOpDraw.entity) {
				jogetConOpDraw.entity = null;
			}
		}

		if(title == "Review List"){
			jogetConOpDraw.entity = setCameraPosOrientv3(parsedData.coord,parsedData.orientation,parsedData.imageName);
		}else{
			jogetConOpDraw.entity = drawConOpTempEntity(parsedData);
		}

	  },
	  false
	);
}


$(document).ready(function () {
	let reviewToolView = $('#reviewTool')
    let reviewToolClose = $('#closebutton-reviewTool')
	let pavementView = $('.toolButton.pavement');

    $(reviewToolClose).on('click', function () {
        $(".sidemenu .third-button button.active").removeClass('active');
        reviewToolSwitchMode('draw');
        $(reviewToolView).fadeOut(150);
    });

	let reviewFormView = $('#reviewForm')
	let reviewFormClose = $('#closebutton-reviewForm')

	$(reviewFormClose).on('click', function () {
		$(".sidemenu .third-button button.active").removeClass('active');
		$(reviewFormView).fadeOut(150);
	});

	getWMSCap()

	controlTerrainTransparency();

	$(pavementView).on('click', function () {
		$.ajax({
			url: '../Components/assetAnalysis/fwdAnalysis.json',
			data: {func : 'firstLoad'},
			type: 'POST',
			success: function (ret) {
				res = JSON.parse(ret);

				if(res.chgOpt){ 
					dataChainage = res.chgOpt;
				}
				if(res.dateOpt){ 
					dataDate = res.dateOpt;
				}
				if(res.fwdDataHTML){
					dataTable = res.fwdDataHTML;
				}
				if(res.dateTitle){ 
					dataTitle = res.dateTitle;
				}
			}
		});

		// load the mlp data
		$.ajax({
			url: '../Components/assetAnalysis/mlpAnalysis.json',
			data: {func : 'firstLoad'},
			type: 'POST',
			success: function (ret) {
				res = JSON.parse(ret);
				if(res.chgOpt){ 
					mlpChainage = res.chgOpt;
				}
				if(res.dateOpt){ 
					mlpDate = res.dateOpt;
				}
				if(res.mlpDataHTML){
					mlpTable = res.mlpDataHTML;
				}
				if(res.dateTitle){
					mlpTitle = res.dateTitle;
				}
			}
		});
	});
})

var loading = $('.loader');
$(document).ajaxStart(function () {
	if (loading) {
		loading.fadeIn();
		$('.onPrimary.fa-solid.fa-refresh').addClass('fa-spin');
	}
	$(document.body).css({'cursor' : 'wait'});
}).ajaxComplete(function () {
	if (loading) {
		loading.fadeOut();
		$('.onPrimary.fa-solid.fa-refresh').removeClass('fa-spin');
	}
	$(document.body).css({'cursor' : 'default'});
});

function onClickUserSignature() {
	$(".infoContainerBody-readonly").css('display', 'none')
	$(".infoContainerBody-edit").css('display', 'none')
	$("#jogetSignature").css('display', 'block')
	$(".profileuserFooter .readonly").css('display', 'none')
    $(".profileuserFooter .editPage").css('display', 'block')
	$("#postlogin-profileuserSave").css('display', 'none')
    if(JOGETLINK.asset_user_signature){
        let url = JOGETLINK.asset_user_signature;
        $("#jogetSignature").css("display", "block");
        $("#signatureForm").attr("src", url)
    }
}

function disabledCheckbox(processName) {
    switch (processName) {
        case "R01":
            $("#chk_R02").attr("disabled", true)
            $("#chk_R04").attr("disabled", true)
            $("#chk_R05_bridge").attr("disabled", true)
            $("#chk_R05_culvert").attr("disabled", true)
            $("#chk_R06").attr("disabled", true)
            $("#chk_R07").attr("disabled", true)
        break;
        case "R02":
            $("#chk_R01").attr("disabled", true)
            $("#chk_R04").attr("disabled", true)
            $("#chk_R05_bridge").attr("disabled", true)
            $("#chk_R05_culvert").attr("disabled", true)
            $("#chk_R06").attr("disabled", true)
            $("#chk_R07").attr("disabled", true)
        break;
        case "R04":
            $("#chk_R01").attr("disabled", true)
            $("#chk_R02").attr("disabled", true)
            $("#chk_R05_bridge").attr("disabled", true)
            $("#chk_R05_culvert").attr("disabled", true)
            $("#chk_R06").attr("disabled", true)
            $("#chk_R07").attr("disabled", true)
        break;
        case "R05Bridge":
            $("#chk_R01").attr("disabled", true)
            $("#chk_R02").attr("disabled", true)
            $("#chk_R04").attr("disabled", true)
            $("#chk_R05_culvert").attr("disabled", true)
            $("#chk_R06").attr("disabled", true)
            $("#chk_R07").attr("disabled", true)
        break;
        case "R05Culvert":
            $("#chk_R01").attr("disabled", true)
            $("#chk_R02").attr("disabled", true)
            $("#chk_R04").attr("disabled", true)
            $("#chk_R05_bridge").attr("disabled", true)
            $("#chk_R06").attr("disabled", true)
            $("#chk_R07").attr("disabled", true)
        break;
        case "R06":
            $("#chk_R01").attr("disabled", true)
            $("#chk_R02").attr("disabled", true)
            $("#chk_R04").attr("disabled", true)
            $("#chk_R05_bridge").attr("disabled", true)
            $("#chk_R05_culvert").attr("disabled", true)
            $("#chk_R07").attr("disabled", true)
        break;
        case "R07":
            $("#chk_R01").attr("disabled", true)
            $("#chk_R02").attr("disabled", true)
            $("#chk_R04").attr("disabled", true)
            $("#chk_R05_bridge").attr("disabled", true)
            $("#chk_R05_culvert").attr("disabled", true)
            $("#chk_R06").attr("disabled", true)
        break;
    }
}

function assetViewRoutineList(ele) {
    let processName = $(ele).val();
    var colourProcess = "";
    var polygonProcess = "";
    var activityName = "";
    var asset_category = "";

    jogetAssetEntities[processName].forEach(function (entity) {
        viewer.entities.remove(entity);
    });
    jogetAssetEntities[processName] = [];

    switch (processName) {
        case "R01":
            activityName = "R01 : PAVEMENT"
            disabledCheckbox(processName);
        break;
        case "R02":
            activityName = "R02 : ROAD SHOULDER"
            disabledCheckbox(processName);
        break;
        case "R04":
            activityName = "R04 : MAINTENANCE OF ROAD FURNITURES"
            disabledCheckbox(processName);
        break;
        case "R05Bridge":
            activityName = "R05 : MAINTENANCE OF BRIDGES/CULVERT"
            asset_category = "BR";
            disabledCheckbox(processName);
        break;
        case "R05Culvert":
            activityName = "R05 : MAINTENANCE OF BRIDGES/CULVERT"
            asset_category = "CL";
            disabledCheckbox(processName);
        break;
        case "R06":
            activityName = "R06: PAINTING OF ROAD MARKING"
            disabledCheckbox(processName);
        break;
        case "R07":
            activityName = "R07 : CLEANING OF DRAINS"
            disabledCheckbox(processName);
        break;
    }
    
    if ($(ele).is(":checked")) {
        //get filter for year and months
        var filterYear = new Date().getFullYear(); // by default, get current year
        var filterMonths = [];
        
        if ($("#selMonthsRoutineOption").val() != "") {
            filterYear = $("#selMonthsRoutineOption").val();
        }
        
        $('input[data-layer="routine"]:checked').each(function() {
            filterMonths.push(this.value);
        });

        //load relevant data from api
        $.ajax({
            type: "POST",
            url: "../BackEnd/joget.php",
            dataType: "json",
            data: {
                functionName: "getJogetRoutineRecordsAsset",
                processName: processName,
                activityName: activityName,
                filterYear: filterYear,
                filterMonths: filterMonths,
                assetCategory: asset_category
            },
            success: function (obj) {
                if (obj.message) {
                    $.alert({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Message",
                        content: "No record found.",
                    });
                    return;
                }
                var maintenancePoints = [];
                obj.data.forEach(function (item) {
                    let coordsArray = item.i_Coordinates;
                    
                    // change pin colours based on status
                    var wiStatus = item.h_Status;
                    switch (wiStatus) {
                        case "Draft":
                            colourProcess = "../Images/pins/blue-pin.png"
                        break;
                        case "Instructed":
                            colourProcess = "../Images/pins/yellow-pin.png"
                        break;
                        case "Completed":
                            colourProcess = "../Images/pins/green-pin.png"
                        break;
                        case "Rectification":
                            colourProcess = "../Images/pins/red-pin.png"
                        break;
                    }
                    
                    // let coordsArray = item.coordinates;
                    if (coordsArray !== "") {
                        coordsArray = coordsArray.split(",");
                        let refID = item['c_Ref No'];
                        let drawnEntity;
                        
                        if (coordsArray.length == 2) {
                            //point
                            //check if pin dropped for same lat long
                            if (maintenancePoints.length > 0) {
                                var defectFlag = false;
                                var i = 0;

                                while (i < maintenancePoints.length && !defectFlag) {
                                    if (maintenancePoints[i].coord == item.i_Coordinates) { // already a pin
                                        var num = parseInt(maintenancePoints[i].num) + 1 ;
                                        maintenancePoints[i].num = num; // add + 1 to the point so the next pin can be in another location
                                        coordsArray[0] = parseFloat(coordsArray[0]) + parseFloat(0.00001 * num) ;
                                        coordsArray[1] = parseFloat(coordsArray[1])+  parseFloat(0.00001 * num) ;
                                        defectFlag = true;
                                    }
                                    i ++;
                                }
                                if(!defectFlag){
                                    maintenancePoints.push({
                                        coord: item.i_Coordinates,
                                        num : 0
                                    })
                                }
                            } else {
                                maintenancePoints.push({
                                    coord: item.i_Coordinates,
                                    num : 0
                                })
                            }

                            drawnEntity = viewer.entities.add({
                            name: refID,
                            position: Cesium.Cartesian3.fromDegrees(
                                coordsArray[0],
                                coordsArray[1],
                                0
                            ),
                            
                            billboard: {
                                image: colourProcess,
                                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                width: 30,
                                height: 30,
                            },
                            });
                        } else if (coordsArray.length >= 6) {
                            //polygon
                            let hierarchyArray = Cesium.Cartesian3.fromDegreesArray(
                                coordsArray
                            );
                            drawnEntity = viewer.entities.add({
                                name: processName + "-" + refID,
                                polygon: {
                                    hierarchy: hierarchyArray,
                                    outline: true,
                                    height: 0,
                                    extrudedHeight: 0,
                                    material: polygonProcess,
                                },
                            });
                        } else {
                            return;
                        }
            
                        let desc = '<div class="projectDesc">';
                        desc += "<table ><tbody >";
                        Object.keys(item).sort().forEach((key) => {
                            var name =[];
                            name =key.split("_");
                            var keyname = (name[1])? name[1]:name[0];
                            if (key == "id") {
                                // skip id, no need to display in the project description floatbox
                            } else if(key  == "a_Route No"  || key == "b_Route Name"){
                                if(item.asset_category != "BR" && item.asset_category != "CL"){
                                    desc += "<tr><th>" + keyname + "</th><td>" + item[key] + "</td></tr>";
                                }
                            }else{
                                desc += "<tr><th>" + keyname + "</th><td>" + item[key] + "</td></tr>";
                            }
                        });
                        desc += "</tbody></table></div>";
                        drawnEntity.description = desc;
                        jogetAssetEntities[processName].push(drawnEntity);
                    }
                });
            },
        });
    } else {
        $("#chk_R01").attr("disabled", false)
        $("#chk_R02").attr("disabled", false)
        $("#chk_R04").attr("disabled", false)
        $("#chk_R05_bridge").attr("disabled", false)
        $("#chk_R05_culvert").attr("disabled", false)
        $("#chk_R06").attr("disabled", false)
        $("#chk_R07").attr("disabled", false)
    }
}

function assetViewDefectList(ele) {
    let processName = $(ele).val();
    var colourProcess = "";
    var polygonProcess = "";
    var activityName = "";
    jogetAssetDefectEntities[processName].forEach(function (entity) {
        viewer.entities.remove(entity);
    });
    jogetAssetDefectEntities[processName] = [];
    switch (processName) {
        case "Pavement":
             activityName = "PAVEMENT/ACCESS ROAD"
        break;
        
    }
    
    if ($(ele).is(":checked")) {
        var filterYear = new Date().getFullYear(); // by default, get current year
        var filterMonths = [];
        
        if ($("#selMonthsDefectOption").val() != "") {
            filterYear = $("#selMonthsDefectOption").val();
        }
        
        $('input[data-layer="defect"]:checked').each(function() {
            filterMonths.push(this.value);
        });

        //load relevant data from api
        $.ajax({
            type: "POST",
            url: "../BackEnd/joget.php",
            dataType: "json",
            data: {
                functionName: "getJogetDefectRecordsAsset",
                activityName: activityName,
                filterYear: filterYear,
                filterMonths: filterMonths
               
            },
            success: function (obj) {
                if (obj.message) {
                    $.alert({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Message",
                        content: "No record found.",
                    });
                    return;
                }
                var defectPoints = [];
                obj.data.forEach(function (item) {
                    let coordsArray = item.q_Coordinate;
                    
                    // change pin colours based on status
                    switch (item.o_Status) {
                        case "Open":
                            colourProcess = "../Images/pins/blue-pin.png"
                        break;
                        case "Closed":
                            colourProcess = "../Images/pins/green-pin.png"
                        break;
                        
                    }
                    
                    // let coordsArray = item.coordinates;
                    if (coordsArray !== "") {
                        coordsArray = coordsArray.split(",");
                        let refID =   item['d_Defect ID'];
                        let drawnEntity;
                        
                        if (coordsArray.length == 2) {
                            //point
                            //check if pin dropped for same lat long
                            if(defectPoints.length >0){
                                var defectFlag = false;
                                var i =0;
                                while( i< defectPoints.length && !defectFlag){
                                    if(defectPoints[i].coord == item.q_Coordinate){ // already a pin
                                        var num = parseInt(defectPoints[i].num) + 1 ;
                                        defectPoints[i].num = num; // add + 1 to the point so the next pin can be in another location
                                        coordsArray[0] = parseFloat(coordsArray[0]) + parseFloat(0.00001 * num) ;
                                        coordsArray[1] = parseFloat(coordsArray[1])+  parseFloat(0.00001 * num) ;
                                        defectFlag = true
                                    }
                                    i++;
                                }
                                if(!defectFlag){
                                    defectPoints.push({
                                        coord: item.q_Coordinate,
                                        num : 0
                                    })
                                }

                            }else{
                                defectPoints.push({
                                    coord: item.q_Coordinate,
                                    num : 0
                                })
                            }
                            
                            drawnEntity = viewer.entities.add({
                            name:  refID,
                            position: Cesium.Cartesian3.fromDegrees(
                                coordsArray[0],
                                coordsArray[1],
                                0
                            ),
                            
                            billboard: {
                                image: colourProcess,
                                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                width: 30,
                                height: 30,
                            },
                            });
                        } else if (coordsArray.length >= 6) {
                            //polygon
                            let hierarchyArray = Cesium.Cartesian3.fromDegreesArray(
                                coordsArray
                            );
                            drawnEntity = viewer.entities.add({
                                name: processName + "-" + refID,
                                polygon: {
                                    hierarchy: hierarchyArray,
                                    outline: true,
                                    height: 0,
                                    extrudedHeight: 0,
                                    material: polygonProcess,
                                },
                            });
                        } else {
                            return;
                        }
            
                        let desc = '<div class="projectDesc">';
                        desc += "<table ><tbody >";
                        Object.keys(item).sort().forEach((key) => {
                            var name =[];
                            name =key.split("_");
                            var keyname = (name[1])? name[1]:name[0];
                            if (
                                key == "d_Defect_ID" ||
                                key == "RefNo" 
                            ) {
                            } else if (key == "c_coordinate") {
                            //skip
                            } else if (key == "processId") {
                            //skip
                            } else if (key == "processName") {
                            //skip
                            } else if (key == "message") {
                            //skip
                             } else if (key == "Year") {
                            } else if (key == "Month") {
                            } else {
                                desc += "<tr><th>" + keyname + "</th><td>" + item[key] + "</td></tr>";
                            }
                        });
                        desc += "</tbody></table></div>";
                        drawnEntity.description = desc;
                        jogetAssetDefectEntities[processName].push(drawnEntity);
                    }
                });
            },
        });
    } 
}

function getRequestBimAttr(ElementId,url){
	if(url != 'road'){
		var urlSplit = url.split("..");
		url = '..' + urlSplit[3];
	}
	
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
			url: "../BackEnd/bimAttrRequest.php",
			data:{url:url, element_id: ElementId, package_uuid: package_uuid},
			success: function(data){
				data = JSON.parse(data)
				assetDataAPI.splice(0, assetDataAPI.length, data)
				if(data && data.data != null){
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
						});	
						myDesc = '<table ><tbody >'
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
						myDesc += '</tbody></table>'
					}else{
						myTitle = "Asset"
						myDesc = '<table ><tbody >'
						myDesc += '<tr><th>No data available</tr>' 
						myDesc += '</tbody></table>' 
						dataCheck = false
						return
					}
 
				}
				else{
					myTitle = "Asset"
					myDesc = '<table ><tbody >'
					myDesc += '<tr><th>No data available</tr>' 
					myDesc += '</tbody></table>' 
					dataCheck = true
					return
				}
				
			}
		})
	).then( function(){
		if( dataCheck == true ){
			// check permission
			var bimLinkPermission = true;
			var allowed_roles = ["Contract Executive", "Finance Representative", "Head of Department"];
			if(!allowed_roles.includes(localStorage.usr_role)){
				bimLinkPermission = false;
			}
			if(url != "" && bimLinkPermission == true && !IS_DOWNSTREAM){
				$(".floatBoxActionLink").css("display", "inherit");
				$(".floatBoxActionLink").text("Link Claim");
				floatBoxLinkOpen(url);
			}else{
				floatboxV3TurnON(myTitle, myDesc);
			}
		}
	});		
}

function LoadAnnotateData(callback) {
	var xhr = new XMLHttpRequest();
	let data = "project_id=" + localStorage.p_id;
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			callback(this.responseText);
		}
	});
	xhr.open("POST", "../BackEnd/getAnnotateData.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
	xhr.send(data);
}

function adjustLayerFeature(layerID, layerData, multiple){

	console.log(layerID);

	if(multiple == false){
		// Fly Layer
		for (var l = 0; l < tilesetlist.length; l++) {
			if (tilesetlist[l].id == layerID) {
				viewer.flyTo(tilesetlist[l].tileset);
				break;
			}
		}
	}

	var offset = (layerData.offset) ? layerData.offset : 0;
	var x_offset = (layerData.x_offset) ? layerData.x_offset : 0;
	var y_offset = (layerData.y_offset) ? layerData.y_offset : 0;
	
    var adjustDetailHTML = '';

	$('.navBox.drawTool').css("display", "none");
	$("#adjustLayerDetail").html("");

	var type = 'adjust';
	var note;
	if(multiple == true){
		note = 'Please enter elevation adjustment for the selected layers';
	}else{
		note = 'Please enter elevation value for the selected layer';
	}

	adjustDetailHTML += `
						<div class="header">
							<input class="fontSmall" disabled value="`+note+`"></input>
						</div>
						<div class="content">
							<div class="col1">
								<div>Height</div>
								<div>X</div>
								<div>Y</div>
							</div>
							<div class="col2">
								<input type="number" id="heightadjustPosition" type="number" step="1.0" value="`+ offset +`"  onchange = "OnChangeHeightAdjustPositionValues(`+layerID+`, '`+type+`', `+multiple+`)">
								<input type="number" id="xadjustPosition" type="number" step="1.0" value="`+ x_offset +`"  onchange = "OnChangeHeightAdjustPositionValues(`+layerID+`, '`+type+`',`+multiple+`)">
								<input type="number" id="yadjustPosition" type="number" step="1.0" value="`+ y_offset +`"  onchange = "OnChangeHeightAdjustPositionValues(`+layerID+`, '`+type+`',`+multiple+`)">
							</div>
							<div class="col3">
								<div><button class="save" onclick="OnClickLayerElevationUpdate(`+layerID+`, `+multiple+`)">Save</button></div>
								<div><button class="cancel" onclick="cancelAdjustElevation(`+layerID+`)">Cancel</button></div>
							</div>
						</div>`;		
	
	$("#adjustLayerDetail").html(adjustDetailHTML);
}

function OnChangeHeightAdjustPositionValues(layerId, type, multiple) {
    if (typeof Cesium === 'undefined') {
        return;
    }

	if(multiple == true) return;
	
	var mytileset;
	var offset = 0;
	var x_offset = 0;
	var y_offset = 0;

	for (var l = 0; l < tilesetlist.length; l++) {
		if(layerId == tilesetlist[l].id){
			mytileset = tilesetlist[l].tileset;
			offset = tilesetlist[l].offset;
			x_offset = tilesetlist[l].xoffset;
			y_offset = tilesetlist[l].yoffset;
			console.log(tilesetlist[l]);
		}
	}
	console.log(mytileset);

	if(mytileset){

		mytileset.readyPromise.then(function () {
			if(type == 'adjust'){
				var heightOffset = parseFloat($("#heightadjustPosition").val()) || 0;
				var xAxisOffset = parseFloat($("#xadjustPosition").val()) || 0;
				var yAxisOffset = parseFloat($("#yadjustPosition").val()) || 0;
			}else{
				var heightOffset = parseFloat(offset) || 0;
				var xAxisOffset = parseFloat(x_offset) || 0;
				var yAxisOffset = parseFloat(y_offset) || 0;
			}
			
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}
			if (isNaN(xAxisOffset)) {
				xAxisOffset = 0;
			}
			if (isNaN(yAxisOffset)) {
				yAxisOffset = 0;
			}
	
			var boundingSphere = mytileset.boundingSphere;
			var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
	
			var surface = Cesium.Cartesian3.fromRadians(
				cartographic.longitude,
				cartographic.latitude,
				0.0
			);
	
			var xInRadians = Cesium.Math.toRadians(xAxisOffset);
			var yInRadians = Cesium.Math.toRadians(yAxisOffset);
	
			var newLongitude = cartographic.longitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(xInRadians)));
			var newLatitude = cartographic.latitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(yInRadians)));
			var newHeight = heightOffset;
		
			var newPosition = Cesium.Cartesian3.fromRadians(
				newLongitude, 
				newLatitude, 
				newHeight
			);
		   
			var translation = Cesium.Cartesian3.subtract(
				newPosition,
				surface,
				new Cesium.Cartesian3()
			);
			console.log(translation);
			mytileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		});
	}
}

function OnClickLayerElevationUpdate(layerID, multiple) {

	var multipleLayers = [];
	$('.adjust_layer_id').each(function(){
		if($(this).is(':checked')){
			multipleLayers.push($(this).val());
		}
	});
	console.log(multipleLayers);
    var offset = $("#heightadjustPosition").val();
    var xOffset = $("#xadjustPosition").val();
    var yOffset = $("#yadjustPosition").val();

    console.log(offset);

	var selectedLayers = [];
	var selectedLayerIds = [];

	$('#adjustLayerList').find('.selectAdjustLayer:checked').each(function(idx){
		var layerName = $(this).data('name');
		var layerId = $(this).data('id');

		selectedLayers.push({
			name : layerName,
		});
		selectedLayerIds.push(layerId);
	})

	if(selectedLayers.length == 0){
		title = `No layer selected!`;
		message = `Please select at least one layer`;
	}else{
		title = `Confirm!`;
		message = `Are you sure you want to update the layer(s) :<br>
		<ol style="padding-left: 20px;">`;
		$.each(selectedLayers, function(key, value){
		message += `<li style="word-break: break-all">`+value.name+`</li>`;
		})
		message += `</ol>`;
	}

	$.alert({
		boxWidth: "30%",
		useBootstrap: false,
		title: title,
		content: message,
		buttons: {
            confirm: function () {
				$.ajax({
					type: "POST",
					url: "../BackEnd/updateOffset.php",
					dataType: "json",
					data: {
						data_id: layerID,
						offset: offset,
						xOffset: xOffset,
						yOffset: yOffset,
						multiple_layers : selectedLayerIds,
						function_name : (multiple) ? 'multipleLayerUpdate' : ''
					},
					success: function (obj, textstatus) {
						if (obj.data == "Update successful") {
							$.alert({
								boxWidth: "30%",
								useBootstrap: false,
								title: "Message",
								content: "Layer saved successfully.",
							});
			
							adjustLayer()
							if(multiple == true){
								setTimeout(function () {
									whatToSetup()
								}, 1000);
							}
						}
						if (obj.data == "No Permission") {
							$.alert({
								boxWidth: "30%",
								useBootstrap: false,
								title: "Message",
								content: "You do not have permission to update this!",
							});
						}
					},
					error: function (xhr, textStatus, errorThrown) {
						var str = textStatus + " " + errorThrown;
						console.log(str);
					},
				});
			},
            cancel: function () {
               return
            }
        }
	});

}

function cancelAdjustElevation(layerID){
	OnChangeHeightAdjustPositionValues(layerID, 'clear', false)
	$('#adjustLayerList').find('input[type="checkbox"]').prop('checked', false)
	adjustLayer()
	$.alert({
		boxWidth: "30%",
		useBootstrap: false,
		title: "Cancel",
		content: "All changes has not been applied.",
	});
}

function onSelectAdjustLayer(_this)
{
	var multiple = false;
	var selectedId = 0;

	if($('#multipleUpdate').is(':checked')){
		multiple = true;
	}

	var selectedLayer = [];
	$('.selectAdjustLayer').each(function(){
		if($(this).is(':checked')){
			selectedLayer.push($(this).val());
		}
	});
	console.log(selectedLayer);
	console.log(multiple);

	var offset = 0;
	var x_offset = 0;
	var y_offset = 0;

	if(multiple == false ){

		if(selectedLayer.length > 1){
			if($(_this).is(':checked')){
				$(_this).prop('checked', false);

				$.alert({
					boxWidth: "30%",
					useBootstrap: false,
					title: "Note",
					content: 'You are updating for a single layer, click "Multiple Update" to update for multiple layers'
				});
			}
		}

		selectedId = selectedLayer[0];

		offset = $('#adjustLayer_offset_'+selectedId).text();
		x_offset = $('#adjustLayer_xoffset_'+selectedId).text();
		y_offset = $('#adjustLayer_yoffset_'+selectedId).text();
	}

	var elavation = { offset: offset, x_offset: x_offset, y_offset: y_offset };
	console.log(elavation);

	adjustLayerFeature(selectedId, elavation, multiple);
}

function onSelectMultipleUpdate(_this)
{
	if($(this).is(':checked')){
	}else{
		$('.selectAdjustLayer').prop('checked', false);
	}
}

function LoadIoTData(){
	//this is first load - so get the latest iot data to add divs to display
	console.log("load iot")
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			dataType: "JSON",
			async: false,
			url: "../BackEnd/getIoTData.php",
			dataType: 'json',
			data: {
				functionName: 'getCurrentIoTData'
			},
			success: function (obj) {
				if(obj['bool'] == true){
					var data = obj['data'];
					var trendData, notiData;
					if(obj['trend']){
						trendData = obj['trend'];
					}
					if(obj['noti']){
						// there are notifications
						notiData = obj['noti'];
						console.log(notiData.length);
						$('.bellContainer').attr('data-count', notiData.length);
					}
					console.log(data.length);
					var iotHtml = ``;
					$('#controlPanelAssetList').html('');
					for(var i=0; i<data.length; i++){
						//console.log("loop")
						var sensorColor ,colorOrder;
						var red, yellow, green;
						id = data[i].element_id+"list";
						id1 = data[i].element_id+"value";
						id2 = data[i].element_id+"color";
						id3 = data[i].element_id+"trend";
						if(data[i].red){
							red = data[i].red.split(",");
						} 
						if(data[i].yellow){
							yellow = data[i].yellow.split(",");
						} 
						if(data[i].green){
							green = data[i].green.split(",");
						} 
						
						switch(data[i].iot_type){
							case "temperature":
								// sensorColor = (data[i].sensorstate == null) ?"purple":(parseFloat(data[i].sensorstate) !=1)?"grey":(parseFloat(data[i].value)>= parseFloat(red[1]))? "red":(parseFloat(data[i].value)>= parseFloat(yellow[1]))? "yellow":"green";

								value = (data[i].value)? data[i].value+" &degC" :"No data";
								colorOrder =(data[i].sensorColour == "red")? 0: (data[i].sensorColour == "grey")? 1: (data[i].sensorColour =="yellow")? 2 :(data[i].sensorColour =="green")? 3: 4;
								iotHtml	+=`<div class="list"  id = ${id} data-type ="a" data-color = ${colorOrder}>
									<div class="column1" >
										<a class="label" style = "display: inline-flex;">${data[i].element_id}
										<i class= "fa-solid fa-temperature-half" title="Temperature sensor" style ="position: relative;
										top: 4px;
										margin-left: 5px;"></i>
										</a>
										
									</div>
									<div class="column2 width">
										<a class="label" id = ${id1}  style = "display: inline-flex;">${value}
											<i class="fa-sm fa-solid" id= ${id3} style ="position: relative;
											top: 10px;
											margin-left: 5px;"></i>
										 </a>
									</div>
									<div class="column2 width" style="justify-content: start">
									<section class="stage">
										<figure id = ${id2}" class="ball ${data[i].sensorColour}"><span class="shadow"></span></figure>
									</section>
									</div>
									<div class="column2 width">
										<i class="fa-solid fa-binoculars" data-id="${data[i].element_id}" title="Edit Layer" onclick="OnClickIoTAsset(${data[i].element_id})"></i>
										<i class="fa-solid fa-chart-line" title="IOT Graph" rel="insight" data-page="iotGraph" data-id = ${data[i].element_id} data-type = ${data[i].iot_type} data-width="70" onclick="wizardOpenPage(this)"></i>
										<i class="fa-solid fa-table" title="IOT Table List" rel="insight" data-page="iotTableList" data-id = ${data[i].element_id} data-type = ${data[i].iot_type} data-width="70" onclick="wizardOpenPage(this)"></i>
									</div>
								</div>`
								
							break;
							case "pressure":
								//sensorColor = (data[i].sensorstate == null)?"purple":(parseFloat(data[i].sensorstate) !=1)?"grey":(parseFloat(data[i].value)>= red[1])? "red":(parseFloat(data[i].value)>= yellow[1])? "yellow":"green";
								value = (data[i].value)? data[i].value+" bar" :"No data";
								colorOrder =(data[i].sensorColour == "red")? 0: (data[i].sensorColour == "grey")? 1: (data[i].sensorColour =="yellow")? 2 :(data[i].sensorColour =="green")? 3: 4;
								iotHtml	+=`<div class="list" id = ${id} data-type ="b" data-color = ${colorOrder}>
									<div class="column1" >
										<a class="label" style = "display: inline-flex;">${data[i].element_id}
										<i class= "fa-solid fa-gauge" title="Pressure sensor" style ="position: relative;
										top: 4px;
										margin-left: 5px;"></i>
										</a>
										
									</div>
									<div class="column2 width">
										<a class="label" id = ${id1}  style = "display: inline-flex;">${value}
										<i class="" id= ${id3} style ="position: relative;
										top: 10px;
										margin-left: 5px;"></i>
								 		</a>
									</div>
									<div class="column2 width" style="justify-content: start">
									<section class="stage">
										<figure id = ${id2}" class="ball ${data[i].sensorColour}"><span class="shadow"></span></figure>
									</section>
									</div>
									<div class="column2 width">
										<i class="fa-solid fa-binoculars" data-id="${data[i].element_id}" title="Edit Layer" onclick="OnClickIoTAsset(${data[i].element_id})"></i>
										<i class="fa-solid fa-chart-line" title="IOT Graph" rel="insight" data-page="iotGraph" data-id = ${data[i].element_id} data-type = ${data[i].iot_type} data-width="70" onclick="wizardOpenPage(this)"></i>
										<i class="fa-solid fa-table" title="IOT Table List" rel="insight" data-page="iotTableList" data-id = ${data[i].element_id} data-type = ${data[i].iot_type} data-width="70" onclick="wizardOpenPage(this)"></i>
									</div>
								</div>`
							break;
							case "humidity":
								//sensorColor = (data[i].sensorstate == null)?"purple":(parseFloat(data[i].sensorstate) !=1)?"grey":(parseFloat(data[i].value)>=red[1])? "red":(parseFloat(data[i].value)> yellow[1])? "yellow":"green";
								value = (data[i].value)? data[i].value+" %" :"No data";
								colorOrder =(data[i].sensorColour == "red")? 0: (data[i].sensorColour == "grey")? 1: (data[i].sensorColour =="yellow")? 2 :(data[i].sensorColour =="green")? 3: 4;
								iotHtml	+=`<div class="list" id = ${id} data-type ="c" data-color = ${colorOrder}>
									<div class="column1" >
										<a class="label" style = "display: inline-flex;">${data[i].element_id}
										<i class= "fa-solid fa-droplet-percent" title="Humidity sensor" style ="position: relative;
										top: 4px;
										margin-left: 5px;"></i>
										</a>
										
									</div>
									<div class="column2 width">
										<a class="label" id = ${id1}  style = "display: inline-flex;">${value}
										<i class="" id= ${id3} style ="position: relative;
										top: 10px;
										margin-left: 5px;"></i>
								 		</a>
									</div>
									<div class="column2 width" style="justify-content: start">
										<section class="stage">
											<figure id = ${id2}" class="ball ${data[i].sensorColour}"><span class="shadow"></span></figure>
										</section>
									</div>
									<div class="column2 width">
										<i class="fa-solid fa-binoculars" data-id="${data[i].element_id}" title="Edit Layer" onclick="OnClickIoTAsset(${data[i].element_id})"></i>
										<i class="fa-solid fa-chart-line" title="IOT Graph" rel="insight" data-page="iotGraph" data-id = ${data[i].element_id} data-type = ${data[i].iot_type} data-width="70" onclick="wizardOpenPage(this)"></i>
										<i class="fa-solid fa-table" title="IOT Table List" rel="insight" data-page="iotTableList" data-id = ${data[i].element_id} data-type = ${data[i].iot_type} data-width="70" onclick="wizardOpenPage(this)"></i>
									</div>
								</div>`
							break;
							
						}
					}
					
					$('#controlPanelAssetList').html(iotHtml);
					for (var k= 0; k< trendData.length; k++ ){
						var myid = trendData[k].asset_id+"trend";
						console.log(myid);
						switch(trendData[k].trend){
							case "same":
								$('#'+myid).addClass("fa-dash")
								$('#'+myid).removeClass("fa-arrow-trend-up")
								$('#'+myid).removeClass("fa-arrow-trend-down")
								break;
							case  "up":
								$('#'+myid).removeClass("fa-dash")
								$('#'+myid).addClass("fa-arrow-trend-up")
								$('#'+myid).removeClass("fa-arrow-trend-down")
								break;
							case "down":
								$('#'+myid).removeClass("fa-dash")
								$('#'+myid).removeClass("fa-arrow-trend-up")
								$('#'+myid).addClass("fa-arrow-trend-down")
								break;
						}
						
					}
					var $divList = $('#controlPanelAssetList .list');
					function sortOrder() {
						$divList.sort(function(a, b) {
						var $a = $(a), $b = $(b);
						
						if ($a.data('color') > $b.data('color')) {
							return 1;
						} else if ($a.data('color') < $b.data('color')) {
							return -1;
						}
						
						if ($a.data('type') < $b.data('type')) {
							return 1;
						} else if ($a.data('type') > $b.data('type')) {
							return -1;
						}
						
						return 0;
						});
					
						$("#controlPanelAssetList").append($divList);
					}
					
					var notiHtml ="";
					for(var p=0; p< notiData.length; p++){
						var value =(notiData[p].iot_type =="temperature")? notiData[p].value+" &degC":(notiData[p].iot_type =="pressure")? notiData[p].value+" bar":  notiData[p].value+" %";
						notiHtml += `<div class="list" id = "noti_`+ notiData[p].rec_no+ `" onclick="getIotDetail(this)" data-created-at="`+ notiData[p].created_at+ `" data-datetime="`+ notiData[p].datetime+ `" data-element-id="n`+ notiData[p].element_id+ `" data-iot-id="`+ notiData[p].iot_id+ `" data-iot-name="`+ notiData[p].iot_name+ `" data-iot-type="`+ notiData[p].iot_type+ `" data-sensor-colour="`+ notiData[p].sensor_colour+ `" data-value="`+ notiData[p].value+ `">
						<div class="column1" rel="id-layer_213">
							<a class="label">`+ notiData[p].element_id+ `</a>
						</div>
						<div class="column2 width"><a class="label">`+notiData[p].iot_type+`</a></div>
						<div class="column2 width"><a class="label">`+value+`</a></div>
						<div class="column2 width">
							<section class="stage">
								<figure  class="ball `+notiData[p].sensor_colour+`"><span class="shadow"></span></figure>
							</section>
						</div>
						<div class="column2 width"><input type="checkbox" id="" name="" value="`+notiData[p].rec_no+`"></div>
					</div>`
					}
					$('#IoTNotiList').html(notiHtml);
					sortOrder();
					resolve(true)
				}else{
					$.alert({
						boxWidth: "30%",
						useBootstrap: false,
						title: "Alert",
						content: "Error fetching IoT Data",
					});
					resolve(true)
				}
			}
		})
	});
}

function OnClickIoTAsset(id) {
    floatboxV3TurnOFF()
	let elementID = id
	console.log(elementID);
	var lon, lat, alt, nameHTML;
	var myDesc = 'Unable to get the data';
	$.ajax({
		url: "../BackEnd/fetchDatav3.php",
		type: "post",
		dataType: 'json',
		data: {
			functionName: 'getAssetInfo',
			elementId: elementID
		},
		success: function (response) {
			console.log(response);
			let myDesc = '';
			let nameHTML = '';
			
			if (response && response.CSV && response.CSV.bool && response.CSV.bool === true) {
				$('.floatBoxFooter .folderMoreInfo').css("display", "none")
				myDesc = '<table ><tbody >';
				if (response.CSV) {
					nameHTML = response.CSV.data.Item;
					lon = response.CSV.data.Coordinate.long;
					lat = response.CSV.data.Coordinate.lat;
					alt = response.CSV.data.Coordinate.alt;

					//agileWOCache = response.CSV.data
					myDesc += `<tr><th>Asset Name</th><td>` + ((response.CSV.data.Label === null) ? ` -` : response.CSV.data.Label) + `</td></tr>
						<tr><th>Floor</th><td>` + ((response.CSV.data.Level === null) ? ` -` : response.CSV.data.Level) + `</td></tr>
						<tr><th>Manufacturer</th><td>` + ((response.CSV.data.Mark === null) ? ` -` : response.CSV.data.Mark) + `</td></tr>
						<tr><th>Membermark</th><td>` + ((response.CSV.data.Membermark === null) ? ` -` : response.CSV.data.Membermark) + `</td></tr>
						<tr><th>Type</th><td>` + ((response.CSV.data.Type === null) ? ` -` : response.CSV.data.Type) + `</td></tr>
						<tr><th>Type Mark</th><td>` + ((response.CSV.data['Type Mark'] === null) ? ` -` : response.CSV.data['Type Mark']) + `</td></tr>`;

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
								myDesc += '<tr><th>' + key + '</th><td>' + ((val === null) ? ' -' : val) + '</td></tr>';
							}
						}
					}
				}
				// if (response.Agile) {
				// 	nameHTML = response.Agile.data.Name;
				// 	for (const [key, val] of Object.entries(response.Agile.data)) {
				// 		if (key && key != 'Docs' && key != 'Coordinate') {
				// 			infoHTML += '<tr><th>' + key + '</th><td>' + ((val === null) ? ' -' : val) + '</td></tr>';
				// 		}
				// 	}
				// populate doc tab
				if (response && response.Agile && response.Agile.data && response.Agile.data.Docs) {
					$('.floatBoxFooter .folderMoreInfo').css("display", "block")
					let docLinkPrefix = 'https://www.dropbox.com/home';
					var desc = `<div class ="doclist">
									<div class="doclistCol1"><b>Document</b></div>
									<div class ="doclistCol2"><b>Category</b></div>
								</div>`;
					//desc += '<div id=' + url + ' onClick="viewFile(this)" style="cursor: pointer"> ' +pwdata[j].text + '</div>';
										
					response.Agile.data.Docs.forEach(function (doc) {
						let docLink = (doc.link && doc.link.toUpperCase().includes("http")) ? doc.link : docLinkPrefix + doc.link;
						let docLinkHTML = '<a target = "_blank" href="' + docLink + '" title = "' + doc.file + '">' + doc.file + '</a>';
						desc += `<div class ="doclist">
									<div class="doclistCol1">${docLinkHTML} </div>
									<div class ="doclistCol2"> ${doc.category} </div>
									</div>`;
					});
					$('.column').css("width", "calc(100%- 20px)");
					$('.column').html(desc); //to display documents in documents tab.
				}
			
				// else {
				// 	docHTML += 'No document found.';
				// }
				var pos = [];
				pos.lon = lon;
				pos.lat = lat;
				pos.alt = alt;
				viewer.camera.flyTo({
					destination: new Cesium.Cartesian3.fromDegrees(lon, lat, alt+15),
					complete: function () {
						floatboxV3B3DMTurnON(nameHTML, myDesc, pos)
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

function UpdateIoTData(){
	console.log("update Data")
	//this is Update sensor data every 10 mins - so get the latest iot data and update the display
	$.ajax({
		type: "POST",
		dataType: "JSON",
		async: false,
		url: "../BackEnd/getIoTData.php",
		dataType: 'json',
		data: {
			functionName: 'getCurrentIoTData'
			
		},
		success: function (obj) {
			console.log((obj['data']));
			console.log((obj['trend']));
			console.log((obj['noti']));
			if(obj['bool'] == true){
				var data = obj['data'];
				console.log(data.length);
				var trendData;
				if(obj['trend']){
					trendData = obj['trend'];
				}
				if(obj['noti']){
					// there are notifications
					notiData = obj['noti'];
					console.log(notiData.length);
					$('.bellContainer').attr('data-count', notiData.length);
				}
				var iotHtml = ``;
				//$('#controlPanelAssetList').html('');
				for(var i=0; i<data.length; i++){
					//console.log("loop")
					var sensorColor ,colorOrder;
					id = data[i].element_id+"list";
					id1 = data[i].element_id+"value";
					id2 = data[i].element_id+"color";
					id3 = data[i].element_id+"trend";	
				
					switch(data[i].iot_type){
						case "temperature":
							//sensorColor = (data[i].sensorstate == null)?"purple":(parseFloat(data[i].sensorstate) !=1)?"grey":(parseFloat(data[i].value)> 60)? "red":(parseFloat(data[i].value)> 50)? "yellow":"green";
							value = (data[i].value)? data[i].value+" &degC" :"No data";
							colorOrder =(data[i].sensorColour == "red")? 0: (data[i].sensorColour == "grey")? 1: (data[i].sensorColour =="yellow")? 2 :(data[i].sensorColour =="green")? 3: 4;
							$('#'+id).data('color', colorOrder);
							$('#'+id1).textContent(value);
							$('#'+id2).css("background", data[i].sensorColour);
							$('#'+id3).removeClass("fa-dash fa-arrow-trend-up fa-arrow-trend-down")
						break;
						case "pressure":
							//sensorColor = (data[i].sensorstate == null)?"purple":(parseFloat(data[i].sensorstate) !=1)?"grey":(parseFloat(data[i].value)> 60)? "red":(parseFloat(data[i].value)> 50)? "yellow":"green";
							value = (data[i].value)? data[i].value+" bar" :"No data";
							colorOrder =(data[i].sensorColour == "red")? 0: (data[i].sensorColour == "grey")? 1: (data[i].sensorColour =="yellow")? 2 :(data[i].sensorColour =="green")? 3: 4;
							$('#'+id).data('color', colorOrder);
							$('#'+id1).textContent(value);
							$('#'+id2).css("background", data[i].sensorColour);
							$('#'+id3).removeClass("fa-dash fa-arrow-trend-up fa-arrow-trend-down")
						break;
						case "humidity":
							//sensorColor = (data[i].sensorstate == null)?"purple":(parseFloat(data[i].sensorstate) !=1)?"grey":(parseFloat(data[i].value)> 60)? "red":(parseFloat(data[i].value)> 50)? "yellow":"green";
							value = (data[i].value)? data[i].value+" %" :"No data";
							colorOrder =(data[i].sensorColour == "red")? 0: (data[i].sensorColour == "grey")? 1: (data[i].sensorColour =="yellow")? 2 :(data[i].sensorColour =="green")? 3: 4;
							$('#'+id).data('color', colorOrder);
							$('#'+id1).textContent(value);
							$('#'+id2).css("background", data[i].sensorColour);
							$('#'+id3).removeClass("fa-dash fa-arrow-trend-up fa-arrow-trend-down")
						break;
						
					}
					
					
				
				}
				
				// sort the list after updating the changed values
				var $divList = $('#controlPanelAssetList .list');
				console.log($divList)
				for (var k= 0; k< trendData.length; k++ ){
					var myid = trendData[k].asset_id+"trend";
					console.log(myid);
					switch(trendData[k].trend){
						case "same":
							$('#'+myid).addClass("fa-dash")
							break;
						case  "up":
							$('#'+myid).addClass("fa-arrow-trend-up")
							break;
						case "down":
							$('#'+myid).addClass("fa-arrow-trend-down")
							break;
					}
					
				}
				function sortOrder() {
					$divList.sort(function(a, b) {
					  var $a = $(a), $b = $(b);
					  
					  if ($a.data('color') > $b.data('color')) {
						return 1;
					  } else if ($a.data('color') < $b.data('color')) {
						return -1;
					  }
					  
					  if ($a.data('type') < $b.data('type')) {
						return 1;
					  } else if ($a.data('type') > $b.data('type')) {
						return -1;
					  }
					  
					  return 0;
					});
				  
					$("#controlPanelAssetList").append($divList);
				  }
				  
				  sortOrder();

				  var notiHtml ="";
					for(var p=0; p< notiData.length; p++){
						var value =(notiData[p].iot_type =="temperature")? notiData[p].value+" &degC":(notiData[p].iot_type =="pressure")? notiData[p].value+" bar":  notiData[p].value+" %";
						notiHtml += `<div class="list" id = "noti_`+ notiData[p].rec_no+ `" onclick="getIotDetail(this)" data-created-at="`+ notiData[p].created_at+ `" data-datetime="`+ notiData[p].datetime+ `" data-element-id="n`+ notiData[p].element_id+ `" data-iot-id="`+ notiData[p].iot_id+ `" data-iot-name="`+ notiData[p].iot_name+ `" data-iot-type="`+ notiData[p].iot_type+ `" data-sensor-colour="`+ notiData[p].sensor_colour+ `" data-value="`+ notiData[p].value+ `">
						<div class="column1" rel="id-layer_213">
							<a class="label">`+ notiData[p].element_id+ `</a>
						</div>
						<div class="column2 width"><a class="label">`+notiData[p].iot_type+`</a></div>
						<div class="column2 width"><a class="label">`+value+`</a></div>
						<div class="column2 width">
							<section class="stage">
								<figure  class="ball `+notiData[p].sensor_colour+`"><span class="shadow"></span></figure>
							</section>
						</div>
						<div class="column2 width"><input type="checkbox" id="" name="" value="`+notiData[p].rec_no+`"></div>
					</div>`
					}
					$('#IoTNotiList').html(notiHtml);
			}else{
				$.alert({
					boxWidth: "30%",
					useBootstrap: false,
					title: "Alert",
					content: "Error fetching IoT Data",
				});
			}
		}
	})
	
}


async function loadAndCheckIoTData() {
	console.log('Before promise call.')
	//3. Await for the first function to complete
	const result = await LoadIoTData()
	console.log('Promise resolved: ' + result)
	setInterval(UpdateIoTData, 300000);
}; 

function getAssetIoTData(asset_id, asset_type){
	console.log(asset_id)
	//this is Update sensor data every 10 mins - so get the latest iot data and update the display
	$.ajax({
		type: "POST",
		dataType: "JSON",
		async: false,
		url: "../BackEnd/getIoTData.php",
		dataType: 'json',
		data: {
			functionName: 'getAssetIoTData',
			asset_id : asset_id,
			asset_type : asset_type
			
		},
		success: function (obj) {
			console.log(obj);
			//if data then draw the chart
			if(obj.bool == true && obj.data){
				var datetime = obj.data.datetime;
				var value = obj.data.value
				var seriesData = value.map(function(datavl, index){
					return [new Date(datetime[index]).getTime(), datavl];
				});
				var serData = parseFloat(seriesData)
				var yaxisText = (asset_type == "temperature")? "Temperature (Celcius)":(asset_type == "pressure")? "Pressure (Bar)": "Humidity (%)";
				var seriesName = (asset_type == "temperature")? "Temperature":(asset_type == "pressure")? "Pressure": "Humidity";
				var htmlText = (asset_type == "temperature")? " &degC":(asset_type == "pressure")? " Bar": " %";
				Highcharts.chart('iotTimeSeries', {
					chart: {
						type: 'line'
					},
					time:{
						timezone:'Asia/Kuala Lumpur',
						useUTC: false
					},
					title: {
						useHTML: true,
						enabled: true,
						text: '<span class="showLabel">Time Series for '+asset_id+'<br>Data upto past 6 hrs</span>'
					},
					xAxis: {
						type: 'datetime',
						//dateTimeLabelFormats :{hour: '%H:%M'},
						title: {
							text: 'Time'
						},
    					labels: {
							format: '{value: %H:%M}'
						},
						crosshair: {
							width: 2,
							color: 'silver'
						}
					},
					yAxis: {
						min: 0,
						  max: 100,
						  tickAmount: 5,
						title: {
							text: yaxisText
						},
						labels: {
							format: '{value}'
						  }
					},
					tooltip: {
						style: {
							fontSize: '10px'
						},
						formatter: function() {
							var seriesName = this.series.name;
							var html = new Date(this.x, )+'<br>'+seriesName+' : <b>'+this.y+htmlText+'</b>';
									
							return html;
						}
					},
					plotOptions: {
						series: {
							label: {
								connectorAllowed: false
							}
						}
					},
					series: [{
						name: seriesName,
						data: serData,
						color: 'blue'
					}],
					responsive: {
						rules: [{
							condition: {
								maxWidth: 500
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								}
							}
						}]
					},
					credits: false
				});
			}
			
		}
	})
	

}

function LoadIoTSensorData(callback) {
	$.ajax({
		type: "POST",
		url: '../BackEnd/fetchDatav3.php',
		dataType: 'JSON',
		data: {
			functionName: "getIoTSensorData"
		},
		success: function (obj) {
			callback(obj);
			
		},
		error: function (xhr) {
			console.log(xhr);
		}
	});
}

function OnClickManageIoT(){
	console.log(localStorage.usr_role);
	LoadIoTSensorData(function (obj) {
		console.log(obj);
		if (!obj.data) {
			return
		}
		iotAssetDetailsData = obj.data;
		var data = obj.data;
		let myhtml = '';
		if(data.length > 0){
			for (var i = 0; i < data.length; i++) {
				myhtml +=  `<div class="item justifyBetween" id="sensorID_${ data[i].id}">
							<div id="iot_name">${data[i].iot_name }</div>
							<div>`;
							console.log(data[i].element_id);
							if(data[i].element_id != "" ){
								myhtml += `<a onclick="OnClickIoTAsset(${data[i].element_id})" id="flyTo" title="Fly To"><i class="fa-solid fa-binoculars"></i></a>`;
							}
							

				if(localStorage.usr_role == 'Project Manager' || localStorage.usr_role == 'Senior Civil Engineer (Road Asset)'){
					myhtml +=	`<a onclick="editSensorDetails(${data[i].id})" title="Edit"><i class="fa-solid fa-pencil"></i></a>
								 <a onclick="deleteIoTSensor(${data[i].id})" title="Remove"><i class="fa-solid fa-trash"></i></a>`;
				}
				myhtml  +=	`</div>
							 </div>`;
			}

		}else{
			myhtml += '<div class="item justifyBetween ">There are no IoT Sensors registered with the system</div>';
		}
		$('#iotSensorList').html(myhtml);
	});
}

function editSensorDetails(id){
	console.log(id);
	flagIoTEdit = true;
	let thingToPass = $('.toolButton.register');

	for(var i=0; i< iotAssetDetailsData.length; i++){
		if(iotAssetDetailsData[i].id == id){
			//match
			clearAllFlag();
			openDrawTool(thingToPass)

			$('.navBox.addIoT .infoHeader .header').text("Edit IoT Sensor Details");
			$('#dbID').val(id);
			$('#iotID').val(iotAssetDetailsData[i].iot_id);
			$('#iotName').val(iotAssetDetailsData[i].iot_name);
			$("input[name=iotType][value='"+iotAssetDetailsData[i].iot_id+"']").prop("checked",true);
			var green = iotAssetDetailsData[i].green.split(",");
			$('#iotG1').val(green[0]);
			$('#iotG2').val(green[1]);
			var yellow = iotAssetDetailsData[i].yellow.split(",");
			$('#iotY1').val(yellow[0]);
			$('#iotY2').val(yellow[1]);
			var red = iotAssetDetailsData[i].red.split(",");
			$('#iotR1').val(red[0]);
			$('#iotR2').val(red[1]);
			$('#sensorElementID').val(iotAssetDetailsData[i].element_id);
			$('#sensorLong').val(iotAssetDetailsData[i].longitude);
			$('#sensorLat').val(iotAssetDetailsData[i].latitude);
			$('#sensorHeight').val(iotAssetDetailsData[i].height);

			$(`.navBox.addIoT`).css('display', 'flex')
			return;

		}
	}

}

function deleteIoTSensor(id){
	console.log(id);
	for(var i=0; i< iotAssetDetailsData.length; i++){
		if(iotAssetDetailsData[i].id == id){
			$.confirm({
				boxWidth: "30%",
				useBootstrap: false,
				title: "Remove IoT Sensor",
				content: "Are you sure you want to remove this sensor? -" + iotAssetDetailsData[i].iot_name,
				buttons: {
				  Ok: function () {
					$.ajax({
						type: "POST",
						url: '../BackEnd/fetchDatav3.php',
						dataType: 'JSON',
						data: {
							functionName: "deleteIoTSensorData",
							id : id
						},
						success: function (obj) {
							console.log(obj);
							//remove the iot from the list, control panel and from the array .
							// list
							//$('#sensorID_'+id).remove();
							$('#sensorID_'+id).remove();
							
							if(iotAssetDetailsData[i].element_id){
								//control panel
								console.log("control panel")
								$('#'+iotAssetDetailsData[i].element_id).remove();
							}
							// remove from array.
							iotAssetDetailsData.splice(i, 1);
						},
						error :{

						}
					});
					return;
				  }
				},
			});
			
			return;
		}	
	}
}

function getIotNotiHistory(asset_id, asset_type){
	$.ajax({
		type: "POST",
		dataType: "JSON",
		async: false,
		url: "../BackEnd/getIoTData.php",
		dataType: 'json',
		data: {
			functionName: 'getNotificationHistory',
			asset_id : asset_id,
			asset_type : asset_type
			
		},
		success: function (obj) {
			var html = '';
			//if data then draw the chart
			if(obj.bool == true && obj.data){
				var data = obj.data;

				if(data){
					for (const [idx, ele] of Object.entries(data)) {

						if(ele.status == 'registered')

						html += '<tr>'
						html += '<td>'+ele.element_id+'</td>'
						html += '<td>'+ele.iot_name+'</td>'
						html += '<td>'+ele.iot_type.charAt(0).toUpperCase()+ele.iot_type.slice(1)+'</td>'
						html += '<td>'+ele.sensor_colour.charAt(0).toUpperCase()+ele.sensor_colour.slice(1)+'</td>'
						html += '<td>'+ele.created_at+'</td>'
						html += '<td>'+ele.status.charAt(0).toUpperCase()+ele.status.slice(1)+'</td>'
						html += '</tr>'
					}
				}

			}
			$("#historyTable").html(html);  
			
		}
	})
}

class MapboxGeocoderService {
	constructor(accessToken) {
		this.accessToken = accessToken;
	}

	geocode(input) {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${this.accessToken}`;

		return fetch(url)
			.then(response => response.json())
			.then(data => {
				if (!data.features) return [];

				return data.features.map(feature => {
					const [lon, lat] = feature.center;
					return {
						displayName: feature.place_name,
						destination: Cesium.Cartesian3.fromDegrees(lon, lat)
					};
				});
			});
	}
}