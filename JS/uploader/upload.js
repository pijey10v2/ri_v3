var r
var reg
var dataType
var foldername;
var progressBar
var KmlFileArray
var KmlLayerArray
var isRan
var isRan2 = false
var myproject
var Row_No
var myObj;
var jsonFname;
var upload_Counter
var useremailid
var assetid_input = false;
var share;
var completedUpload = false;

function hidepage() {
	$("#kmldiv").hide()
	$("#shpdiv").hide()
	$("#b3dmdiv").hide()

	$("#filetb").hide()
	$("#exceltb").hide()
	$("#b3dmitem").hide()
	$(".buttoncontainer .hidden").hide()
	$(".statuscontainer").hide()
}

function OnClickKML() {
	geoDataClear()
	uploadType = "KML"
	hidepage()
	$("#kmldiv").show()
	$(".totalfiles").show();
	$("#R_input").removeAttr('webkitdirectory')
	$("#R_input").removeAttr('mozdirectory')
	$("#R_input").attr('accept', '.kml,.kmz');
	dataType = "KML"
	reg = /(.*?)\.(kml|kmz)$/;
}

function OnClickShapefile() {
	uploadType = "SHP"
	geoDataClear()
	hidepage()
	$("#shpdiv").show();
	$("#shpitem").show();
	$("#R_input").attr('webkitdirectory', 'webkitdirectory')
	$("#R_input").attr('mozdirectory', 'mozdirectory')
	$("#R_input").attr('accept', '.shp,.shx,.dbf,.sbn,.sbx,.fbn,.fbx,.ain,.aih,.atx,.ixs,.mxs,.prj,.xml,.cpg');
	$("#R_input").removeAttr('accept')
	dataType = "SHP"
	reg = /(.*?)\.(shp|shx|dbf|sbn|sbx|fbn|fbx|ain|aih|atx|ixs|mxs|prj|xml|cpg)$/;
}

function OnClickB3DM() {
	uploadType = "B3DM"
	geoDataClear()
	hidepage()
	$("#b3dmdiv").show();
	$("#R_input").attr('webkitdirectory', 'webkitdirectory')
	$("#R_input").attr('mozdirectory', 'mozdirectory')
	$("#R_input").attr('accept', '.b3dm,.cmpt,.json');
	$("#R_input").removeAttr('accept')
	dataType = "B3DM"
	reg = /(.*?)\.(b3dm|cmpt|json)$/;
}

$("#uploadTab .tabbutton").on("click", function () {
	if ($(this).hasClass("active")) {
	} else {
		$("#uploadTab .tabbutton.active").removeClass("active")
		$(".uploadtool .itemscontainer.active").removeClass("active")
		let $pagetoOpen = $(this).attr("rel")

		if($pagetoOpen === "kmldiv"){
			OnClickKML()
		}
		else if($pagetoOpen === "shpdiv"){
			OnClickShapefile()
		}
		else if($pagetoOpen === "b3dmdiv"){
			OnClickB3DM()
		}
		$(this).addClass("active")
		$("#" + $pagetoOpen + ".itemscontainer").addClass("active")
	}
})

function ProgressBar(ele) {
	this.thisEle = $(ele);
	this.fileAdded = function () {
	},
		this.uploading = function (progress) {
			$('.progress-bar-inner').css('width', progress + '%');
			if(dataType == "SHP"){
				$("#shpstatus").text("Please do not close this window. " + progress.toFixed(1) + "% uploaded.");
			}else{
				// d3dmstatus
				$(".b3dmstatus").text("Please do not close this window. " + progress.toFixed(1) + "% uploaded.");
			}
		
			KmlFileArray = [];
			if (progress == 0) {
				$(".b3dmstatus").text("")
			}
		}
}

function ValidateServerFiles(callback) {
	KmlFileString = JSON.stringify(KmlFileArray)
	$.ajax({			// to check if the physical file already exist in server 
		type: "POST",
		url: 'JS/uploader/validateexistingfolder.php',
		dataType: 'json',
		data: {
			fileArray: KmlFileString, dataType: dataType
		},
		success: function (obj, textstatus) {
			if (obj.result == true) {	//if filename exist in the server
				if (dataType == "KML") {
					kmlarray = obj.kmlarray

					kmlarray.forEach(function (item) {
						array_len = r.files.length;
						UID = $.grep(r.files, function (v) {
							return (item == v.fileName)
						})[0];
						r.removeFile(UID)	//remove file upload if no					
						RowID = $("#fileTBody tr td").filter(function () {
							//set status to indicate this has been removed
							return $("p", this).html() == item;
						}).attr("id")
						RowID = (RowID.substring(0, 4)) + '4';
						$("#" + RowID).html("Canceled")
						var popArray = KmlFileArray.indexOf(item)
						KmlFileArray.splice(popArray, 1)
						KmlLayerArray.splice(popArray, 1)
					})

					$.confirm({
						boxWidth: '50%',
						useBootstrap: false,
						title: 'Message',
						content: "File(s): " + kmlarray + " already exist in server. Please rename the file(s) on your local machine before uploading.",
						buttons: {
							OK: function () {
								if (KmlFileArray.length > 0) {
									$.confirm({
										boxWidth: '30%',
										useBootstrap: false,
										title: 'Message',
										content: "Do you wish to upload the rest of the file(s)?",
										buttons: {
											confirm: function () {
												callback()
											},
											cancel: function () {
												RowID = $("#fileTBody tr td").filter(function () {
													//set status to indicate this has been removed
													return $("p", this).html() == item;
												}).attr("id")
												RowID = (RowID.substring(0, 4)) + '4';
												$("#" + RowID).html("Canceled")

											}
										}
									});
								}
							}
						}

					});
				}
				else {	//b3dm or shp
					$.confirm({
						boxWidth: '30%',
						useBootstrap: false,
						title: 'Confirm!',
						content: "Folder name already exist in server. Please rename the folder: <br><input type='text' id='folderRename' placeholder='Rename Here'/>",
						buttons: {
							confirm: function () {
								if ($("#folderRename").val() == "") {
									$.alert({
										boxWidth: '30%',
										useBootstrap: false,
										title: 'Message',
										content: 'No value found! Please try again.',
									});
									return
								}
								foldername = $("#folderRename").val()
								r.opts.query.foldername = foldername
								KmlFileArray = [$("#folderRename").val()]
								ValidateServerFiles(ValidateJSON)
							},
							cancel: function () {
								return
							}
						}
					});
				}
			}
			else {
				callback()
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	});
}

function geoDataClear() { //resetupload
	completedUpload = false
	r.cancel();
	$(".b3dmstatus").text("")
	$("#shpFolder").text("")
	$("#shpName").text("")
	$("#shpstatus").text("")

	// $("#ionassetid").val("")
	// $("#ionStatus").html("")
	//$("#ionmylayer").val("")
	$("#b3dmFolder").text("")
	$(".totalfiles").text("")
	$("#fileTBody").text("")
	foldername = '';
	$('#upload-progress').val(0)
	KmlFileArray = [];
	KmlLayerArray = [];
	isRan = false;
	Row_No = 0;
	$("#filetb").hide()
	$("#bd3mName").val("")

	$("#jsonF_selection").text("")
}

function tempaddtolayerlist(layername, defDisplay) {
	//push to layer list for temporary list view 
	var layerDIV = document.getElementById('layergrouplist');	//ul list
	var ul_li = document.createElement('li');			//CREATE li  
	ul_li.setAttribute('id', "dataID_" + layername.replace(/ /g, "_"),)
	var chk = document.createElement('input'); // CREATE CHECK BOX.
	chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
	chk.setAttribute('id', "dataChk_" + layername.replace(/ /g, "_"),); // SET UNIQUE ID.
	chk.setAttribute('onclick', 'layerOnCheck(this)');
	chk.setAttribute('name', 'checkbox');

	if (defDisplay == true) {
		chk.setAttribute('checked', true);
	}

	var lyr_icon = document.createElement('img');
	lyr_icon.setAttribute('class', 'fileicon');
	switch (dataType) {
		case 'KML':
			lyr_icon.setAttribute('src', 'Images/icons/layer_window/kml.png');
			lyr_icon.setAttribute('title', 'KML/KMZ');
			break;
		case 'SHP':
				lyr_icon.setAttribute('src', 'Images/icons/layer_window/shp.png');
				lyr_icon.setAttribute('title', 'SHP');
				break;
		case 'B3DM':	//b3dm
			lyr_icon.setAttribute('src', 'Images/icons/layer_window/b3dm.png');
			lyr_icon.setAttribute('title', 'B3DM');
			break;
		case 'ION':	//ion
			lyr_icon.setAttribute('src', 'Images/icons/layer_window/ion.png');
			lyr_icon.setAttribute('title', 'ION');
			break
	}
	var lbl = document.createElement('label'); // CREATE LABEL.
	lbl.setAttribute('for', "add_lyr_ckb" + upload_Counter);
	lbl.style.fontSize = '10px';

	// CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
	lbl.appendChild(document.createTextNode(layername));
	// APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
	ul_li.appendChild(chk);
	ul_li.appendChild(lyr_icon);
	ul_li.appendChild(lbl);
	//	ul_li.innerHTML += "<img src='Images/icons/layer_window/corner-handle.png' class='handle'>"
	ul_li.innerHTML += "<img src='Images/icons/layer_window/binoculars.png' onclick = 'flyToLayer(this)' class='flyto'>"
	layerDIV.prepend(ul_li)

	upload_Counter++;
}

function ValidateJSON() {
	KmlLayer = JSON.stringify(KmlLayerArray)
	ionassetID = $("#ionassetid").val()
	ionURL = "";// ionassetID.trim();
	$.ajax({			// check record in db
		type: "POST",
		url: 'JS/uploader/validateDBrecord.php',
		dataType: 'json',
		data: {
			LayerArray: KmlLayer, dataType: dataType, ionURL: ionURL
		},
		success: function (obj) {
			if (dataType == "KML") {
				KmlLayerArray = []
				if (obj.result == true) {
					var counter = 0;
					kmlarray = obj.LayerArr
					kmlarray.forEach(function (item, index) {
						$.confirm({
							boxWidth: '30%',
							useBootstrap: false,
							title: 'Confirm!',
							content: "'" + item + "' already exist in the database, please enter another name to proceed. Please rename the layer: <br><input type='text' id='layerRename_" + index + "' placeholder='Rename Here'/>",
							buttons: {
								confirm: function () {
									KmlLayerArray.push($("#layerRename_" + index).val())
									RowID = $("#fileTBody tr td").filter(function () {
										//set status to indicate this has been removed
										return $("input:text", this).val() == item;
									}).attr("id")
									$("#" + RowID + " input").val($("#layerRename_" + index).val())
									counter++
									if (kmlarray.length == counter && kmlarray.length > 0) {
										ValidateJSON()
									}
								},
								cancel: function () {
									counter++
									if (kmlarray.length == counter && kmlarray.length > 0) {
										ValidateJSON()
									}
									return
								}
							}
						});
					})
				}
				else {
					r.upload();
					KmlLayerArray = [];
				}

				$(".totalfiles").html(r.files.length + " file(s)")
			}
			else {
				if (obj.result == true) {
					$.confirm({
						boxWidth: '30%',
						useBootstrap: false,
						title: 'Confirm!',
						content: "'" + obj.LayerArr + "' already exist in the database, please enter another name to proceed. Please rename the layer: <br><input type='text' id='layerRename' placeholder='Rename Here'/>",
						buttons: {
							confirm: function () {
								KmlLayerArray = [$("#layerRename").val()]
								if (dataType == "B3DM"){
									$("#bd3mName").val($("#layerRename").val())
								} else{
									$("#shpName").val($("#layerRename").val())
								}
								ValidateJSON()
							},
							cancel: function () {
								return
							}
						}
					});
				}
				else {
					r.upload();
					KmlLayerArray = [];
					console.log(dataType);
				}
				$(".totalfiles").html(r.files.length + " file(s)");
				$(".b3dmstatus").text("Please wait..");
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	});
}

$(document).ready(function () {
	r = new Resumable({
		target: 'JS/uploader/upload.php',
		testChunks: true,
		simultaneousUploads: 10,
		query: { "foldername": "!@#$%^&*()", "dataType": "KML" }
	});
	if (!r.support) {
		$.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Message',
			content: 'Sorry, your browser does not support the uploader.'
		});
	}
	reg = /(.*?)\.(kml|kmz)$/;
	dataType = "KML"
	progressBar = new ProgressBar($('#progress-bar'))
	KmlFileArray = [];
	KmlLayerArray = [];
	isRan = false;
	Row_No = 0;
	upload_Counter = 0;
	useremailid = document.getElementById("myprofileEmail").innerHTML.trim()


	r.assignBrowse(document.getElementById('add-file-btn'));
	$('#start-upload-btn').click(function () {
		KmlLayerArray = [];
		if (r.files.length == 0) {
			return
		}
		if (dataType == "B3DM") {
			layername = $("#bd3mName").val()
			r.opts.query.dataType = 'B3DM';
			r.opts.query.foldername = foldername;
			KmlLayerArray.push(layername)
			$(".statuscontainer").css("display", "block")
		} else if(dataType == "SHP") {
			layername = $("#shpName").val()
			r.opts.query.dataType = 'SHP';
			r.opts.query.foldername = foldername;
			KmlLayerArray.push(layername)
		}
		else {
			r.opts.query.dataType = 'KML';
			for (i = 0; i < r.files.length; i++) {
				inpVal = $("#txt" + i).val()
				KmlLayerArray.push(inpVal)
				$(".statuscontainer").css("display", "block")
			}
		}

		ValidateServerFiles(ValidateJSON)
	});

	// $('#b3dm-pause-upload-btn').click(function(){
	//     if (r.files.length>0) {
	//         if (r.isUploading()) {
	//           return  r.pause();
	//         }
	//         return r.upload();
	//     }
	// });

	$('#cancel-upload-btn').click(function () {
		KmlFileArray = [];
		KmlLayerArray = [];
		isRan = false;
		r.cancel();
	});

	r.on('fileAdded', function (file) {

		//if illegal file format found, whole operation will be canceled
		if (!((file.fileName).toLowerCase().match(reg))) {
			if (dataType == "B3DM" && isRan2 == false) {
				isRan2 = true
				var ext = file.fileName.substring(file.fileName.lastIndexOf('.') + 1).toLowerCase();
				if (file.fileName !== ext) {
					console.log("adding")
					$.alert({
						boxWidth: '30%',
						useBootstrap: false,
						title: 'Message',
						content: 'Unknown files!","Unsupported file format exist in folder. Only .b3dm, .cmpt and .json are supported. Please try again',
					});
					geoDataClear()
					return
				}
			}
			else if (dataType == "KML") {
				$.alert({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Message',
					content: 'Unknown files!","Unsupported file format selected. Only .kml and .kmz are supported. Please try again',
				});
				geoDataClear()
				return
			}
		}
		if (dataType == "B3DM") {
			if (file.fileName.split('.')[1] == 'json') { // catch largest json file 
				$("#jsonF_selection").append("<option value =" + file.fileName + ">" + file.fileName + "</option>")
			};
		}
		if (dataType == "B3DM" && isRan == false) {	//need only run once
			pathname = file.file.webkitRelativePath
			sliceindex = pathname.indexOf('/');
			foldername = pathname.slice(0, sliceindex);
			KmlFileArray.push(foldername)
			isRan = true;
			$("#b3dmitem").show()
			$(".buttoncontainer .hidden").show()
			$("#bd3mName").val(foldername)
			$("#b3dmFolder").html(foldername)
		}
		else if (dataType == "SHP" && isRan == false) {	//need only run once
			pathname = file.file.webkitRelativePath
			sliceindex = pathname.indexOf('/');
			foldername = pathname.slice(0, sliceindex);
			KmlFileArray.push(foldername)
			isRan = true;
			$("#shpitem").show()
			$(".buttoncontainer .hidden").show()
			$("#shpName").val(foldername)
			$("#shpFolder").html(foldername)
		}
		else if (dataType == "KML") {
			$(".totalfiles").html(r.files.length + " file(s)")
			KmlFileArray.push(file.fileName)
			$("div.panelImage").hide();
			$("#filetb").show();
			$(".buttoncontainer .hidden").show()
			//add table contents
			var tbrow = document.createElement("tr"); //create row
			var rowID = 'tr' + Row_No;
			tbrow.setAttribute('id', rowID);
			document.getElementById("fileTBody").appendChild(tbrow);

			for (var j = 0; j < 5; j++) { //create td for each column 
				var tbcol = document.createElement("td");
				var colID = 'col' + Row_No + j;	//assign each cell with unique id
				tbcol.setAttribute('id', colID);
				tbcol.setAttribute('style', 'text-align:center');
				document.getElementById(rowID).appendChild(tbcol);
			}

			var fname = document.createElement("p");	//create element for fname
			fname.innerHTML = file.fileName;
			document.getElementById("col" + Row_No + 0).appendChild(fname);

			var this_filename = file.fileName
			var this_layername = this_filename.split('.')[0];
			var lyrname = document.createElement("INPUT");
			lyrname.setAttribute("type", "text");
			lyrname.setAttribute("value", this_layername);
			lyrname.setAttribute('id', "txt" + Row_No);
			document.getElementById("col" + Row_No + 1).appendChild(lyrname);

			//create checkbox for default display 
			var ckbDisplay = document.createElement("input")
			ckbDisplay.setAttribute('type', 'checkbox');
			ckbDisplay.setAttribute('id', "ckb" + Row_No);
			document.getElementById("col" + Row_No + 2).appendChild(ckbDisplay);

			var ckbShare = document.createElement("input")
			ckbShare.setAttribute('type', 'checkbox');
			ckbShare.setAttribute('id', "share" + Row_No);
			document.getElementById("col" + Row_No + 3).appendChild(ckbShare);

			Row_No++;
		}
		progressBar.fileAdded();
	});
	r.on('fileProgress', function (file) {
		if (dataType == "KML") {
			RowID = $("#fileTBody tr td").filter(function () {
				//compare filename with labeled 
				return $("p", this).html() == file.fileName;
			}).attr("id")
			if (typeof RowID !== "undefined") {
				RowID = RowID.substring(3, 4)
				$("#col" + RowID + '4').html((file.progress() * 100).toFixed(1) + '%')
			}
		}
		else if(dataType == "SHP"){
			let lastIndex = file.fileName.lastIndexOf('.')
			var ext = file.fileName.substring(lastIndex + 1).toLowerCase();
			if(ext == "shp"){
				console.log(file.fileName.substring(0, lastIndex));
				foldername = file.fileName.substring(0, lastIndex)
			}
		}
	});

	r.on('fileSuccess', function (file) {
		if (dataType == "KML") {
			RowID = $("#fileTBody tr td").filter(function () {
				//compare filename with labeled 
				return $("p", this).html() == file.fileName;
			}).attr("id")
			RowID = RowID.substring(3, 4)
			$("#col" + RowID + '4').html("Successful")
			layername = $("#txt" + RowID).val();
			Ckb = $("#ckb" + RowID).prop("checked")
			share = $("#share" + RowID).prop("checked")

			$.ajax({
				url: "BackEnd/DataFunctions.php",
				data: {
					functionName: "addGeoData", 
					share: share,
					dataType: dataType,
					lyr_name: layername,
					url: "../Data/KML/" + file.fileName,
					defaultView: Ckb,
					offset: 0
				},
				type: "POST",
				dataType: "JSON",
				success: function (obj){
					//add to cesium viewer
					var myKml = null;
					var urlKML = '../Data/KML/' + file.fileName;
					if (Ckb == true){
						myKml = LoadKMLData(urlKML)
					}
					tilesetlist.push({
						id: layername.replace(/ /g, "_"), 
						name: layername,
						tileset: myKml,
						type: "kml",
						offset: 0,
						defaultView: Ckb,
						url: urlKML
					});
					tempaddtolayerlist(layername, Ckb)
				},
				error: function (xhr, textStatus, errorThrown) {
					var str = textStatus + " " + errorThrown;
					console.error(str);
				}
			})

		
		}
	});

	r.on('progress', function () {
		progressBar.uploading(r.progress() * 100);
	});

	r.on('complete', function () {
		if (dataType == "B3DM" && completedUpload == false && r.progress() == 1) {
			completedUpload = true
			console.log(r.progress())
			share = $("#b3dmsharechk").prop("checked")
			jsonFname = $("#jsonF_selection").val();
			Ckb = $("#b3dmchk").prop("checked")
			$(".b3dmstatus").text("Upload Complete!")
			layername = $("#bd3mName").val()

			$.ajax({
				url: "BackEnd/DataFunctions.php",
				data: {
				functionName: "addGeoData",
				share: share,
				dataType: dataType,
				lyr_name: layername,
				url: "../Data/3DTiles/" + foldername + "/" + jsonFname,
				defaultView: Ckb,
				offset: 0,
				},
				type: "POST",
				dataType: "JSON",
				success: function (obj) {
				console.log(obj);
				if (Ckb == false) {
					mytileset = viewer.scene.primitives.add(
					new Cesium.Cesium3DTileset({
						url: "../Data/3DTiles/" + foldername + "/" + jsonFname,
						dynamicScreenSpaceError: true,
						dynamicScreenSpaceErrorDensity: 0.00278,
						dynamicScreenSpaceErrorFactor: 64.0,
						dynamicScreenSpaceErrorHeightFalloff: 0.125,
						baseScreenSpaceError: 4,
						maximumScreenSpaceError: 4,
						show: false,
					})
					);
				} else {
					mytileset = viewer.scene.primitives.add(
					new Cesium.Cesium3DTileset({
						url: "../Data/3DTiles/" + foldername + "/" + jsonFname,
						dynamicScreenSpaceError: true,
						dynamicScreenSpaceErrorDensity: 0.00278,
						dynamicScreenSpaceErrorFactor: 64.0,
						dynamicScreenSpaceErrorHeightFalloff: 0.125,
						baseScreenSpaceError: 4,
						maximumScreenSpaceError: 4,
					})
					);
				}
				tilesetlist.push({
					id: layername.replace(/ /g, "_"),
					name: layername,
					tileset: mytileset,
					type: "tileset",
					offset: 0,
				});
				tempaddtolayerlist(layername, Ckb);
				},
				error: function (xhr, textStatus, errorThrown) {
				var str = textStatus + " " + errorThrown;
				console.error(str);
				},
			});

		}else if (dataType == "SHP" && completedUpload == false && r.progress() == 1){
			completedUpload = true
			console.log(r.progress())
			share = $("#shpsharechk").prop("checked")
			Ckb = $("#shpchk").prop("checked")
			layername = $("#shpName").val()
			
			$.ajax({
				url: "BackEnd/DataFunctions.php",
				data: {
					functionName: "addGeoData", 
					share: share,
					dataType: dataType,
					lyr_name: layername,
					url: encodeURI(foldername),
					defaultView: Ckb,
					offset: 0
				},
				type: "POST",
				dataType: "JSON",
				success: function (obj){
					console.log(obj)
					var wms = null
					//add wms layer
					if (Ckb == true) {
						wms = LoadWMSTile(encodeURI(foldername))
					}
					getWMSCap(); // refetch wms props
					tilesetlist.push({
						id: layername.replace(/ /g, "_"),
						name: layername,
						tileset: wms,
						type: "shp",
						offset: 0,
						defaultView: Ckb,
						url: encodeURI(foldername),
					});
					tempaddtolayerlist(layername, Ckb);

					completedUpload = false
					r.cancel();
					foldername = '';
					$('#upload-progress').val(0)
					KmlFileArray = [];
					KmlLayerArray = [];
					isRan = false;
					$("#shpstatus").text("Upload Complete!")
				},
				error: function (xhr, textStatus, errorThrown) {
					var str = textStatus + " " + errorThrown;
					console.error(str);
				}
			})
		}
	})

	$("#reset-upload-btn").click(geoDataClear)

	$("#ionassetid").change(function () {
		assetid_input = true
		$("#ionStatus").html("");
	})

	$("#ionmylayer").change(function () {
		assetid_input = true
		$("#ionStatus").html("");
	})
})