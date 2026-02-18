

function floatBoxcompnentInfo(action, data_id, layer_name)
{
	openWizardModalContainer("claimListUpload", "page", "70", "");

	var link;
	var param = {};
	param['id'] = data_id;	
	param['layer_name'] = layer_name;	

	switch (action) {
		case 'ClaimAdd':
			link = "finance_list_ApprovedClaimsLinking_SSLR2";
			$(".modal-header a").html("Approved Claim List");
			$('#wizardClose').attr('data-layer-id', data_id);
			$('#wizardClose').attr('data-layer-name', layer_name);

			break;
		case 'ClaimUpdate':
			link = "finance_list_ApprovedClaimsLinking_SSLR2";
			$(".modal-header a").html("Update Claim Link");
			$('#wizardClose').attr('data-layer-name', layer_name);

			break;
		case 'AttachmentAdd':
			link = "finance_list_Additionalfile_SSLR2";
			$(".modal-header a").html("Upload Additional Attachments");
			$('#wizardClose').attr('data-layer-name', layer_name);

			break;
		case 'ClaimView':
			link = "finance_list_ClaimView_SSLR2";
			$(".modal-header a").html("Claim View");
			break;
		case 'ClaimAttachmentUpdate':
			link = "finance_list_ClaimViewAttachment_SSLR2";
			$(".modal-header a").html("Claim Attachment View");
			break;
		case 'AdditionalUploadUpdate':
			link = "finance_list_AdditionalfileView_SSLR2";
			$(".modal-header a").html("Additional Attachments Update");
			break;
		default:
			break;
	}
	var loading = $('.loader');
    loading.fadeIn();

	var frameId = "claimListUploadiFrame";
	openPFSDatalist(link, frameId, param);	
}

function floatBoxLinkOpen(layer_path)
{
	
	$.ajax({
		url: "../BackEnd/fetchDatav3.php",
		type: "post",
		dataType: 'json',
		data: {
			functionName: 'getLayerId',
			layerPath: layer_path
		},
		success: function (response) {
			if(response.data && response.data[0]){
				console.log(response.data);
				checkBimLayerLinking(response.data[0].Data_ID, response.data[0].Data_Name);
			}

		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
			console.log(str);
		}
	});
	
}

function checkBimLayerLinking(layer_id, layer_name=''){
    
    $("#floatBoxId").fadeIn(150)
    $("#floatBoxId").css("top", movePosition.y)
    $("#floatBoxId").css("left", movePosition.x)
    $(".floatBoxHeader .header").html("Component Info")
    $(".floatBoxBody").html("");
    
    $.ajax({
		url: '../BackEnd/jogetPFS.php',
		type: "POST",
		data: {
			functionName: "getLayerLinking",
			layer_id: layer_id
		},
		dataType: 'json',
		success: function (response) {
            console.log(response);

            if(response && response.data && response.data[0]){
				var data = response.data[0];
                
				var claim_id = data.id;
				var additional_id = data.additional_id;

                var content_body = "";

                if(claim_id){
                    content_body += `<tr><th><a onclick="floatBoxcompnentInfo('ClaimView', '`+layer_id+`', '`+layer_name+`')">Claim Details</a></tr>`;
                    // <tr><th><a onclick="floatBoxcompnentInfo('ClaimAttachmentUpdate', '`+claim_id+`')">Claim Suppporting Document</a></tr>`

                    $(".floatBoxActionLink").attr("onclick", "floatBoxcompnentInfo('ClaimUpdate', '"+layer_id+"', '"+layer_name+"')");
                }else{
                    content_body += `<tr><th>Claim Details</tr>`;
                    // <tr><th>Claim Suppporting Document</tr>`;

                    $(".floatBoxActionLink").attr("onclick", "floatBoxcompnentInfo('ClaimAdd', '"+layer_id+"', '"+layer_name+"')");
                }

                var actionAddtn = "";
                var actionAddtnId = "";
                var actionAddtnText = "";
                if(additional_id){
                    actionAddtn = "AdditionalUploadUpdate";
                    actionAddtnId = additional_id;
                    actionAddtnText = "Additional Document";
                }else{
                    actionAddtn = "AttachmentAdd";
                    actionAddtnId = layer_id;
                    actionAddtnText = "Upload Additional Document";
                }

                content_body += `<tr><th><a onclick="floatBoxcompnentInfo('`+actionAddtn+`', '`+actionAddtnId+`')">`+actionAddtnText+` </a></tr>`;

                var content = `<table><tbody >`+content_body+`</tbody></table>`;

                $(".floatBoxBody").html(content);

			}else{

                var content = `<table><tbody >
                			<tr><th>Claim Details</tr>
                            <tr><th><a onclick="floatBoxcompnentInfo('AttachmentAdd', '`+layer_id+`')">Upload Additional Document</a></tr>
                		</tbody></table>`;

			    $(".floatBoxActionLink").attr("onclick", "floatBoxcompnentInfo('ClaimAdd', '"+layer_id+"', '"+layer_name+"')");
                
                $(".floatBoxBody").html(content);
			}

		}
	});
}

function openPFSDatalist(link, frameId, param) { 
    if (!JOGETLINK) return

	var url = processLinkParam(link, param);

    $('.loader').fadeOut();

    $("iframe#"+frameId)
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");
}

// openBimLinkingModal("a00cf248-0a3c-454a-8df8-7fb1e612d49b", "");

function openBimLinkingModal(claim_id, layer_name)
{
    $("#bimModelList").fadeIn();
    $("#bimModelList .modal-container").css("display", "block");
    $("#bimModelList .modal-container").css("overflow", "auto");

    $.ajax({
        type: "POST",
        url: "../BackEnd/DataFunctions.php",
        data: {functionName: 'getCompleteGeoDataSSLR'},
        dataType: "json",
        success: function (obj, textstatus) {
            $("#dataTable").html("");
            var currentModel = "";
            for (let row of obj.data) {

                var upload_date = new Date(row.Added_Date);
                upload_date = upload_date.toDateString();

                var layer_id = row.Data_ID;
                var layer = row.Data_Name;
                var btnLabel = "Link";
                if(layer_name == row.Data_Name){
                    currentModel = row.Data_URL;
                    layer_id = "";
                    layer = "";
                    btnLabel = "Unlink";
                }

                $("#dataTable").append(
                '<div class="row summary fiveColumn">\
                    <div class="M textContainer" style="display:none"><span class="text">' + row.Data_Name + '</span></div>\
                    <div class="M textContainer"><span class="text textClamp">' + row.Data_Name + '</span></div>\
                    <div class="M textContainer"><span class="text textClamp">' + row.Data_Type + '</span></div>\
                    <div class="M textContainer"><span class="text textClamp">' + decodeURI(row.Data_URL) + '</span></div>\
                    <div class="M textContainer"><span class="text textClamp">' + upload_date + '</span></div>\
                    <div class="M textContainer"><span class="text textClamp"><button type="button" onclick="viewBimLayer(`'+row.Data_URL+'`)">View</button> <button type="button" onclick="confirmLinkBim(`'+claim_id+'`,`' + layer_id + '`, `' + layer + '`)">'+btnLabel+'</button></span></div>\
                </div>'
                )

                
            }
            $('#bimModelHeader').text("Add Link to BIM Model");
            if(layer_name != "" && currentModel != ""){
                viewBimLayer(currentModel);
                $('#bimModelHeader').text("Update Link to BIM Model");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function confirmLinkBim(claim_id, layer_id, layer_name){
    var action = layer_id != "" ? "link" : "unlink";

    //project
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: "Are you sure to "+action+" to this model?",
        buttons: {
            confirm: function () {
                // send to joget to add/update linking
                $.ajax({
                    type: "POST",
                    url: "../BackEnd/jogetPFS.php",
                    data: {
                        functionName: 'updateLayerLinking',
                        claim_id : claim_id,
                        layer_id : layer_id,
                        layer_name : layer_name
                    },
                    dataType: "json",
                    success: function (obj) {
                        if(obj.id){
                            if(layer_id != ""){
                                var msg = "Linked successfully";
                            }else{
                                var msg = "Unlinked successfully";
                            }
                            wizardCancelPageBimModel();
                            $('#finance_list_ApprovedClaims_SSLR2').trigger("click");
                        }else{
                            var msg = "Failed. Please try again";
                            console.log(obj)
                        }

                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: msg,
                        });
                    }
                });
            },
            cancel: function () {
                return;
            },
        },
    });
}

var viewerBimModel = new Cesium.Viewer("datapreviewbimmodel", {
    baseLayerPicker: false,
    timeline: false,
    homeButton: false,
    animation: false,
    geocoder: false,
    fullscreenButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    infoBox: false,
});

viewerBimModel._cesiumWidget._creditContainer.style.display = "none";

var defaultviewbimModel = Cesium.Rectangle.fromDegrees(93.0, -15.0, 133.0, 30.0); // S.E.A. extent
viewerBimModel.camera.setView({
    destination: defaultviewbimModel,
});

var myData;

function viewBimLayer(url) {

    $('#datapreviewbimmodel').css("display", "");
    
    var data_url = "../" + url;

    if (viewerBimModel.imageryLayers.length >= 1) {
        viewerBimModel.imageryLayers.remove(myData);
    }
    if (myData){
        viewerBimModel.dataSources.remove(myData);
    }

    myData = viewerBimModel.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: data_url,
            dynamicScreenSpaceError: true,
            dynamicScreenSpaceErrorDensity: 0.00278,
            dynamicScreenSpaceErrorFactor: 64.0,
            dynamicScreenSpaceErrorHeightFalloff: 0.125,
            baseScreenSpaceError: 4,
            maximumScreenSpaceError: 8,
        })
    );

    viewerBimModel.flyTo(myData, {
        duration: 1,
    });
        
}

wizardCancelPageBimModel = () =>{
    $("#bimModelList").fadeOut(100);

    $('#datapreviewbimmodel').css("display", "none");
    console.log(myData);
    if (viewerBimModel.imageryLayers.length >= 1) {
        viewerBimModel.imageryLayers.remove(myData);
        viewerBimModel.dataSources.remove(myData);
    }
}