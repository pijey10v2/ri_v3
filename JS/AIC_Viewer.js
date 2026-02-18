var aicObj = {
	packageId: null,
	view: null,
	beforeMap: null,
	afterMap: null,
	beforeWMS: null,
	afterWMS: null,
	beforeCRS: null,
	afterCRS: null,
	projectedViewBefore: null,
	projectedViewAfter: null,
}

function initiateAIC(packageId) {
	aicObj.packageId = packageId

	if (!aicObj.view) {
		aicObj.view = new ol.View({});
		aicObj.beforeMap = new ol.Map({
			target: "beforeMap",
			view: aicObj.view,
		});
		aicObj.afterMap = new ol.Map({
			target: "afterMap",
			view: aicObj.view,
		});
		getWMSCap();
	}
}

function beforeImageOnChange() {
	if (aicObj.beforeWMS) {
		aicObj.beforeMap.removeLayer(aicObj.beforeWMS);
	}
	if (!wmsCapabilities) {
		$("#beforeImage").prop("selectedIndex", 0);
		return
	}
	let selectedWMS = $("#beforeImage").val().trim();
	let layer = wmsCapabilities.Capability.Layer.Layer.find(
		(l) => l.Title === selectedWMS
	);
	//change here l>name !== selectedWMS
	aicObj.projectedViewBefore = layer.BoundingBox[1].crs;
	if (aicObj.projectedViewAfter && aicObj.projectedViewBefore) {
		if (aicObj.projectedViewAfter !== aicObj.projectedViewBefore) {
			console.error("CRS not match");
			$("#beforeImage").prop("selectedIndex", 0);
			return;
		}
	}
	resetProjection(layer.BoundingBox[1].crs);
	let extent = layer.BoundingBox[1].extent;
	aicObj.beforeWMS = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: `${wmsURL}/${aicObj.packageId}/wms`,
			params: {
				LAYERS: [selectedWMS],
			},
		}),
	});
	aicObj.beforeMap.addLayer(aicObj.beforeWMS);
	aicObj.beforeMap.getView().fit(extent, aicObj.beforeMap.getSize());
}

function afterImageOnChange() {
	if (aicObj.afterWMS) {
		aicObj.afterMap.removeLayer(aicObj.afterWMS);
	}
	if (!wmsCapabilities) {
		$("#beforeImage").prop("selectedIndex", 0).change();
		return
	}
	let selectedWMS = $("#afterImage").val();
	let layer = wmsCapabilities.Capability.Layer.Layer.find(
		(l) => l.Title === selectedWMS
	);

	aicObj.projectedViewAfter = layer.BoundingBox[1].crs;
	if (aicObj.projectedViewAfter && aicObj.projectedViewBefore) {
		if (aicObj.projectedViewAfter !== aicObj.projectedViewBefore) {
			console.error("CRS not match");
			$("#afterImage").prop("selectedIndex", 0);
			return;
		}
	}
	resetProjection(layer.BoundingBox[1].crs);
	let extent = layer.BoundingBox[1].extent;
	aicObj.afterWMS = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: `${wmsURL}/${aicObj.packageId}/wms`,
			params: {
				LAYERS: [selectedWMS],
			},
		}),
	});
	aicObj.afterMap.addLayer(aicObj.afterWMS);
	//get extent
	aicObj.afterMap.getView().fit(extent, aicObj.afterMap.getSize());
}


//list out layers exposed as WMS
function getListOfWMS() {
	$.ajax({
		url: `${wmsURL}/rest/workspaces/${aicObj.packageId}/coveragestores`,
		type: "GET",
		beforeSend: function (xhr) {
			xhr.setRequestHeader(
				"Authorization",
				"Basic " + btoa("admin" + ":" + "rvgeo123")
			);
		},
		success: (resp) => {
			if (resp.coverageStores.coverageStore) {
				var htmlBody = "<option disabled selected>Please Select</option>";
				resp.coverageStores.coverageStore.forEach((layer) => {
					let option = `<option value="${aicObj.packageId}:${layer.name}">${layer.name}</option>`;
					htmlBody += option;
				});
				$("#aicSelection select").html(htmlBody);
			}
		},
	});
}

//get layer's projection and apply it to the map
function resetProjection(code) {
	let projection = new ol.proj.Projection({
		code: code,
		units: "m",
		global: false,
	});
	let view = new ol.View({
		projection: projection,
		maxZoom: 2000,
	});
	aicObj.beforeMap.setView(view);
	aicObj.afterMap.setView(view);
}

function clearLayers(){
	if (aicObj.beforeWMS) {
		aicObj.beforeMap.removeLayer(aicObj.beforeWMS);
	}
	if (aicObj.afterWMS) {
		aicObj.afterMap.removeLayer(aicObj.afterWMS);
	}
}

function aicWeeklyRoutine(e) {
	clearLayers()
	aicChangeRoutine("0")
	$(e).siblings().removeClass("active")
	$(e).addClass("active")
}

function aicMonthlyRoutine(e) {
	clearLayers()
	aicChangeRoutine("1")
	$(e).siblings().removeClass("active")
	$(e).addClass("active")
}

function aicQuarterlyRoutine(e) {
	clearLayers()
	aicChangeRoutine("2")
	$(e).siblings().removeClass("active")
	$(e).addClass("active")
}

function aicChangePackage() {
	clearLayers()
	$('#itemsContainer .buttoncontainer button').removeClass("active")
	$("#beforeImage").attr("disabled", "disabled")
	$("#afterImage").attr("disabled", "disabled")
}

function aicChangeRoutine(routineType) {
	$("#afterImage").attr("disabled", "disabled")
	$("#beforeImage").html("")
	$("#afterImage").html("")

	var data
	if ($("#aicFormPackageId").val()) {
		data = {
			runFunction: "getRoutinesWithType",
			routineType: routineType,
			packageId: $("#aicFormPackageId option:selected").val()
		}
		initiateAIC($("#aicFormPackageId option:selected").attr("data-2"))
	} else {
		data = {
			runFunction: "getRoutinesWithType",
			routineType: routineType
		}
		initiateAIC(localStorage.p_id_name)
	}

	$.ajax({
		url: 'BackEnd/aicRequests.php',
		type: "POST",
		dataType: 'json',
		data: data,
		success: function (response) {
			if (response.msg == "No Aic record found") {
				$.alert({
					boxWidth: "30%",
					useBootstrap: false,
					title: "Message",
					content: "No record found",
				});
				$(".buttoncontainer button").removeClass("active")
				return
			}
			if (response.data.length < 2) { //only one record available
				$.alert({
					boxWidth: "30%",
					useBootstrap: false,
					title: "Message",
					content: "Unable to do comparison. Only one record found. ",
				});
				return
			}

			$("#beforeImage").append("<option disabled selected value> -- select an option -- </option>")
			$("#afterImage").append("<option disabled selected value> -- select an option -- </option>")

			response.data.forEach(function (item) {
				let capturedDate = new Date(item.Image_Captured_Date.date).toDateString()
				$("#beforeImage").append("<option data=" + item.AIC_Id + " value=" + item.Image_URL + ">" + capturedDate + "</option>")
				$("#afterImage").append("<option data=" + item.AIC_Id + " value=" + item.Image_URL + ">" + capturedDate + "</option>")
			})
			$("#beforeImage").removeAttr("disabled")
			$("#afterImage").removeAttr("disabled")
		}
	});
}

function resetAicViewer(){
	aicChangePackage()	//reset html elements
	$("#beforeImage").html("");
	$("#afterImage").html("");
}