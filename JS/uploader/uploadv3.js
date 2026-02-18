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
var animate;
var completedUpload = false;

function defaultUploadLayer(){
	$('#shpchk').prop('checked', false)
	$('#shpsharechk').prop('checked', false)

	$('#b3dmchk').prop('checked', false)
	$('#b3dmsharechk').prop('checked', false)
}

function hidepage() {
	$("#kmldiv").hide()
	$("#shpdiv").hide()
	$("#b3dmdiv").hide()

	$("#filetb").hide()
	$("#exceltb").hide()
	$("#shpitem").hide()
	$("#b3dmitem").hide()
	$(".buttonTab.insidePage .hidden").hide()
	$(".indicatorContainer").hide()
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

function OnClickXML() {
	uploadType = "XML"
	geoDataClear()
	hidepage()
	$("#xmldiv").show()
	$("#R_input").removeAttr('webkitdirectory')
	$("#R_input").removeAttr('mozdirectory')
	$("#R_input").removeAttr('multiple')
	$("#R_input").attr('accept', '.xml');
	dataType = "XML"
	reg = /(.*?)\.(xml)$/;
}

function ProgressBar(ele) {
	this.thisEle = $(ele);
	this.fileAdded = function () {
	},
		this.uploading = function (progress) {
			$('.progress-bar').css('width', progress + '%');
			if(dataType == "SHP"){
				$("#shpstatus").text("Please do not close this window." + progress.toFixed(1) + "% uploaded.");
			}else{
				// d3dmstatus
				$(".b3dmstatus").text("Please do not close this window." + progress.toFixed(1) + "% uploaded.");
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
		url: '../JS/uploader/validateexistingfolder.php',
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
						RowID = $("#fileTBody .row.insight div").filter(function () {
							//set status to indicate this has been removed
							return $(this).html() == item;
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
						title: 'Alert',
						content: "File(s): " + kmlarray + " already exist in server. Please rename the file(s) on your local machine before uploading.",
						buttons: {
							OK: function () {
								if (KmlFileArray.length > 0) {
									$.confirm({
										boxWidth: '30%',
										useBootstrap: false,
										title: 'Alert',
										content: "Do you wish to upload the rest of the file(s)?",
										buttons: {
											confirm: function () {
												callback()
											},
											cancel: function () {
												RowID = $("#fileTBody .row.insight div").filter(function () {
													//set status to indicate this has been removed
													return $(this).html() == item;
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
				} else if (dataType == "XML") {
					kmlarray = obj.kmlarray

					kmlarray.forEach(function (item) {
						array_len = r.files.length;
						UID = $.grep(r.files, function (v) {
							return (item == v.fileName)
						})[0];
						r.removeFile(UID)	//remove file upload if no
						RowID = $("#xmlFileTBody .row.insight div").filter(function () {
							//set status to indicate this has been removed
							return $(this).html() == item;
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
						title: 'Alert',
						content: "File(s): " + kmlarray + " already exist in server. Please rename the file(s) on your local machine before uploading.",
						buttons: {
							OK: function () {
								if (KmlFileArray.length > 0) {
									$.confirm({
										boxWidth: '30%',
										useBootstrap: false,
										title: 'Alert',
										content: "Do you wish to upload the rest of the file(s)?",
										buttons: {
											confirm: function () {
												callback()
											},
											cancel: function () {
												RowID = $("#xmlFileTBody .row.insight div").filter(function () {
													//set status to indicate this has been removed
													return $(this).html() == item;
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
										title: 'Alert',
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
	defaultUploadLayer();
	$(".b3dmstatus").text("")
	$("#shpFolder").val("")
	$("#shpName").val("")
	$("#shpstatus").text("")

	$("#b3dmFolder").val("")
	$(".totalfiles").text("")
	$("#fileTBody").text("")
	$("#xmlFileTBody").text("")
	foldername = '';
	$('#upload-progress').val(0)
	KmlFileArray = [];
	KmlLayerArray = [];
	isRan = false;
	Row_No = 0;
	$("#filetb").hide()
	$("#xmlfiletb").hide()
	$("#bd3mName").val("")
	$(".indicatorContainer").css("display", "none")
	$("#jsonF_selection").empty();

	$(".buttonTab.insidePage .hidden").hide()
	$("#add-file-btn").show()
	$("#add-file-btn-xml").show()
}

function tempaddtolayerlist(layername, defDisplay) {
	//push to layer list for temporary list view 
	var layerDIV = document.getElementById('layer');
	var ul_li = document.createElement('div'); //CREATE li
	ul_li.setAttribute('id', "dataID_" + layername.replace(/ /g, "_"),)
	ul_li.setAttribute('class', "item layerSearch layerContainer")
	var chk = document.createElement('input'); // CREATE CHECK BOX.
	chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
	chk.setAttribute('id', "dataChk_" + layername.replace(/ /g, "_"),); // SET UNIQUE ID.
	chk.setAttribute('onclick', 'layerOnCheck(this)')
	chk.setAttribute('name', 'checkbox');
	
	if (defDisplay == true) {
		chk.setAttribute('checked', true);
	}

	var lyr_icon = document.createElement('img');
	lyr_icon.setAttribute('class', 'fileicon');
	lyr_icon.setAttribute('style', 'width: 18px;');

	var outerDiv = document.createElement('div');
	outerDiv.setAttribute('class', 'layerInput');

	switch (dataType) {
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
	var lbl = document.createElement('a'); // CREATE LABEL.
	lbl.setAttribute('for', "add_lyr_ckb" + upload_Counter);
	lbl.style.fontSize = 'small';

	// CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
	lbl.appendChild(document.createTextNode(layername));
	// APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
	ul_li.appendChild(outerDiv);
	outerDiv.appendChild(chk);
	outerDiv.appendChild(lyr_icon);
	outerDiv.appendChild(lbl);

	outerDiv.innerHTML += "<i class='fa-solid fa-binoculars' onclick='flyToLayer(this)'></i>";
	layerDIV.prepend(ul_li)

	upload_Counter++;
}

function ValidateJSON() {
	KmlLayer = JSON.stringify(KmlLayerArray)
	ionURL = "";
	$.ajax({// check record in db
		type: "POST",
		url: '../JS/uploader/validateDBrecord.php',
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
							title: 'Alert!',
							content: "'" + item + "' already exist in the database, please enter another name to proceed. Please rename the layer: <br><input type='text' id='layerRename_" + index + "' placeholder='Rename Here'/>",
							buttons: {
								confirm: function () {
									KmlLayerArray.push($("#layerRename_" + index).val())
									RowID = $("#fileTBody .row.insight div").filter(function () {
										//set status to indicate this has been removed
										return $(this).html() == item;
									}).attr("id")
									$("#" + RowID).html($("#layerRename_" + index).val())
									$("#" + RowID).val($("#layerRename_" + index).val())

									counter++
									if (kmlarray.length == counter && kmlarray.length > 0) {
										ValidateJSON()
									}
								},
								cancel: function () {
									$(".indicatorContainer").css("display", "none")
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
			else if (dataType == "XML") {
				KmlLayerArray = []
				if (obj.result == true) {
					var counter = 0;
					kmlarray = obj.LayerArr
					kmlarray.forEach(function (item, index) {
						console.log("indeeeeeeeeeeeeex: "+index);
						$.confirm({
							boxWidth: '30%',
							useBootstrap: false,
							title: 'Alert!',
							content: "'" + item + "' already exist in the database, please enter another name to proceed. Please rename the layer: <br><input type='text' id='layerRename_" + index + "' placeholder='Rename Here'/>",
							buttons: {
								confirm: function () {
									KmlLayerArray.push($("#layerRename_" + index).val())
									RowID = $("#xmlFileTBody .row.insight div").filter(function () {
										//set status to indicate this has been removed
										return $(this).html() == item;
									}).attr("id")
									$("#" + RowID).html($("#layerRename_" + index).val())
									$("#" + RowID).val($("#layerRename_" + index).val())

									counter++
									if (kmlarray.length == counter && kmlarray.length > 0) {
										ValidateJSON()
									}
								},
								cancel: function () {
									$(".indicatorContainer").css("display", "none")
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

			}
			else {
				if (obj.result == true) {
					$.confirm({
						boxWidth: '30%',
						useBootstrap: false,
						title: 'Alert!',
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
								$(".indicatorContainer").css("display", "none")
								return
							}
						}
					});
				}
				else {
					r.upload();
					KmlLayerArray = [];
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
		target: '../JS/uploader/upload.php',
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
	r.assignBrowse(document.getElementById('add-file-btn-xml'));
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
			$(".indicatorContainer").css("display", "block")
		} else if(dataType == "SHP") {
			layername = $("#shpName").val()
			r.opts.query.dataType = 'SHP';
			r.opts.query.foldername = foldername;
			KmlLayerArray.push(layername)
			$(".indicatorContainer").css("display", "block")
		} else if(dataType == "XML") {
			r.opts.query.dataType = 'XML';
			for (i = 0; i < r.files.length; i++) {
				inpVal = $("#layername"+i).val();
				KmlLayerArray.push(inpVal)
				$(".indicatorContainer").css("display", "block")
			}
		}
		else {
			r.opts.query.dataType = 'KML';
			for (i = 0; i < r.files.length; i++) {
				inpVal = $("#layername"+i).val();
				KmlLayerArray.push(inpVal)
				$(".indicatorContainer").css("display", "block")
			}
		}
		ValidateServerFiles(ValidateJSON)
	});

	$('#cancel-upload-btn').click(function () {
		KmlFileArray = [];
		KmlLayerArray = [];
		isRan = false;
		r.cancel();
		$("#add-file-btn").show()
	});

	r.on('fileAdded', function (file) {

		//if illegal file format found, whole operation will be canceled
		if (!((file.fileName).toLowerCase().match(reg))) {
			if (dataType == "B3DM" && isRan2 == false) {
				isRan2 = true
				var ext = file.fileName.substring(file.fileName.lastIndexOf('.') + 1).toLowerCase();
				if (file.fileName !== ext) {
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
			}else if (dataType == "XML") {
				$.alert({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Message',
					content: 'Unknown files!","Unsupported file format selected. Only .xml is supported. Please try again',
				});
				geoDataClear()
				return
			}else if(dataType == "SHP"){
				// $.alert({
				// 	boxWidth: '30%',
				// 	useBootstrap: false,
				// 	title: 'Message',
				// 	content: 'Unknown files!","Unsupported file format selected. Only .shp, .shx, .dbf and .prj are supported. Please try again',
				// });
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
			$(".buttonTab.insidePage .hidden").show()
			$("#bd3mName").val(foldername)
			$("#b3dmFolder").val(foldername)
		}
		else if (dataType == "SHP" && isRan == false) {	//need only run once
			pathname = file.file.webkitRelativePath
			sliceindex = pathname.indexOf('/');
			foldername = pathname.slice(0, sliceindex);
			KmlFileArray.push(foldername)
			isRan = true;
			$("#shpitem").show()
			$(".buttonTab.insidePage .hidden").show()
			$("#shpName").val(foldername)
			$("#shpFolder").val(foldername)
		}
		else if (dataType == "KML") {
			$(".totalfiles").html(r.files.length + " file(s)")
			KmlFileArray.push(file.fileName)
			$("div.panelImage").hide();
			$("#filetb").show();
			$(".buttonTab.insidePage .hidden").show()
			//add table contents
			let tableFileHTML = '';
			var row = $("#fileTBody").append('<div class="row insight" id="row'+Row_No+'"></div>') //create row

			var this_filename = file.fileName
			var this_layername = this_filename.split('.')[0];

			tableFileHTML += `
				<div id="col_`+Row_No+0+`" class="middleColumn textContainer">`+this_filename+`</div>
				<div id="col_`+Row_No+1+`" class="middleBigColumn textContainer"><input id="layername`+Row_No+`" type="text" value="`+this_filename+`"></div>
				<div id="col_`+Row_No+2+`" class="middleMediumColumn textContainer"><input type ="checkbox" id ="ckb`+Row_No+`" class = ""></div>
				<div id="col_`+Row_No+3+`" class="middleMediumColumn textContainer"><input type ="checkbox" id ="share`+Row_No+`" class = ""></div>
				<div id="col_`+Row_No+4+`" class="middleMediumColumn textContainer"><input type ="checkbox" id ="animate`+Row_No+`" class = ""></div>
				<div id="col_`+Row_No+5+`" class="middleColumn textContainer">Pending</div>`;

			$("#row"+Row_No).append(tableFileHTML);

			Row_No++;
		}
		else if (dataType == "XML") {
			$(".totalfiles").html(r.files.length + " file(s)")
			KmlFileArray.push(file.fileName)
			$("div.panelImage").hide();
			$("#xmlfiletb").show();
			$(".buttonTab.insidePage .hidden").show()
			//add table contents
			let tableFileHTML = '';
			var row = $("#xmlFileTBody").append('<div class="row insight" id="row'+Row_No+'"></div>') //create row

			var this_filename = file.fileName
			var this_layername = this_filename.split('.')[0];

			tableFileHTML += `
				<div id="col_`+Row_No+0+`" class="middleColumn textContainer">`+this_filename+`</div>
				<div id="col_`+Row_No+1+`" class="middleBigColumn textContainer"><input id="layername`+Row_No+`" type="text" value="`+this_layername+`" readonly></div>
				<div id="col_`+Row_No+2+`" class="middleColumn textContainer">Pending</div>`;

			$("#row"+Row_No).append(tableFileHTML);
			
			Row_No++;
		}
		$("#add-file-btn-xml").hide().hide()
		$("#add-file-btn").hide().hide()
		progressBar.fileAdded();
	});
	r.on('fileProgress', function (file) {
		if (dataType == "KML") {
			RowID = $("#fileTBody .row.insight").filter(function () {
				//compare filename with labeled
				return $("div", this).html() == file.fileName;
			}).attr("id")
			if (typeof RowID !== "undefined") {
				RowID = RowID.substring(3, 4)
				$("#col_" + RowID + 5).html((file.progress() * 100).toFixed(1) + '%')
			}
		}
		else if(dataType == "SHP"){
			let lastIndex = file.fileName.lastIndexOf('.')
			var ext = file.fileName.substring(lastIndex + 1).toLowerCase();
			if(ext == "shp"){
				foldername = file.fileName.substring(0, lastIndex)
			}
		}
	});

	r.on('fileSuccess', function (file) {
		if (dataType == "KML") {
			RowID = $("#fileTBody .row.insight").filter(function () {
				//compare filename with labeled 
				return $("div", this).html() == file.fileName;
			}).attr("id")
			RowID = RowID.substring(3, 4)

			$("#col_" + RowID + 5).html("Successful")
			layername = $("#layername"+RowID).val()
			Ckb = $("#ckb" + RowID).prop("checked")
			share = $("#share" + RowID).prop("checked")
			animate = $("#animate" + RowID).prop("checked")

			$.ajax({
				url: "../BackEnd/DataFunctions.php",
				data: {
					functionName: "addGeoData", 
					share: share,
					dataType: dataType,
					lyr_name: layername,
					url: "../Data/KML/" + file.fileName,
					defaultView: Ckb,
					offset: 0,
					animate: animate
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
		}else if (dataType == "XML") {
			RowID = $("#xmlFileTBody .row.insight").filter(function () {
				//compare filename with labeled 
				return $("div", this).html() == file.fileName;
			}).attr("id")
			RowID = RowID.substring(3, 4)
			$("#col_" + RowID + 2).html("Successful")
			layername = $("#layername"+RowID).val();
			Ckb = $("#ckb" + RowID).prop("checked")
			share = $("#share" + RowID).prop("checked")
			$.ajax({
				url: "../BackEnd/DataFunctions.php",
				data: {
					functionName: "addGeoData", 
					share: 0,
					dataType: dataType,
					lyr_name: layername,
					url: "../Data/Others/PLC/" + file.fileName,
					defaultView: Ckb,
					offset: 0
				},
				type: "POST",
				dataType: "JSON",
				success: function (obj){
					geoDataClear()
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
				url: "../BackEnd/DataFunctions.php",
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
				if (Ckb == false) {
					var useThis = "../";
					mytileset = viewer.scene.primitives.add(
					new Cesium.Cesium3DTileset({
						url: useThis + "../Data/3DTiles/" + foldername + "/" + jsonFname,
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
					var useThis = "../";
					mytileset = viewer.scene.primitives.add(
					new Cesium.Cesium3DTileset({
						url: useThis + "../Data/3DTiles/" + foldername + "/" + jsonFname,
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
				$('#reset-upload-btn').trigger('click');

				},
				error: function (xhr, textStatus, errorThrown) {
				var str = textStatus + " " + errorThrown;
				console.error(str);
				},
			});

		}else if (dataType == "SHP" && completedUpload == false && r.progress() == 1){
			completedUpload = true
			share = $("#shpsharechk").prop("checked")
			Ckb = $("#shpchk").prop("checked")
			layername = $("#shpName").val()
			$.ajax({
				url: "../BackEnd/DataFunctions.php",
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
					
					$('#reset-upload-btn').trigger('click');
					$("#shpstatus").text("Upload Complete!");
					
				},
				error: function (xhr, textStatus, errorThrown) {
					var str = textStatus + " " + errorThrown;
					console.error(str);
				}
			})
		}
	})

	$("#reset-upload-btn").click(geoDataClear)
})