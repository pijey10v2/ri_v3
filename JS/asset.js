var $jogetAssetHost = JOGETASSETHOST;

function OnClickAssetInspection(asset){
    var appWindowName ="";
    switch(asset){
        case 'abutment':
            appWindowName = "Bridge Abutment Inspection";
            break;
        case 'beamgirder':
            appWindowName = "Bridge Beam/Girder Inspection";
            break;
        case 'bearing':
            appWindowName = "Bridge Bearing Inspection";
            break;
        case 'deckslab':
            appWindowName = "Bridge Deck Slab Inspection";
            break;
        case 'drainpipes':
            appWindowName = "Bridge Drainpipes Inspection";
            break;
        case 'expansionjoint':
            appWindowName = "Bridge Expansion Joint Inspection";
            break;
        case 'parapet':
            appWindowName = "Bridge Parapet Inspection";
            break;
        case 'pier':
            appWindowName = "Bridge Pier Inspection";
            break;
        case 'slopeprotectionriverbank':
            appWindowName = "Bridge Slope Protection / River Bank Inspection";
            break;
        case 'surfacing':
            appWindowName = "Bridge Surfacing Inspection";
            break;
        case 'hydrauliccapacity':
            appWindowName = "Bridge Hydraulic Capacity Inspection";
            break;
        case 'culvert':
            appWindowName = "Culvert Inspection";
            break;
        case 'drainage':
            appWindowName = "Drainage Inspection";
            break;
        case 'pavement':
            appWindowName = "Pavement Inspection";
            break;
        case 'roadfurniture':
            appWindowName = "Road Furniture Inspection";
            break;
        case 'slope':
            appWindowName = "Slope Inspection";
            break;
        case 'anticlimbfence':
            appWindowName = "Anti Climb Fence Inspection";
            break;
        case 'crashcushion':
            appWindowName = "Crash Cushion Inspection";
            break;
        case 'culvertmarker':
            appWindowName = "Culvert Marker Inspection";
            break;
        case 'flexisidepost':
            appWindowName = "Flexible Post/Side Poste Inspection";
            break;
        case 'guardrail':
            appWindowName = "Guardrail Inspection";
            break;
        case 'hectometermarker':
            appWindowName = "Hectometer Marker Inspection";
            break;
        case 'kilometermarker':
            appWindowName = "Kilometer Marker Inspection";
            break;
        case 'rightfence':
            appWindowName = "Right of Way Fence Inspection";
            break;
        case 'rivermarker':
            appWindowName = "River Marker Inspection";
            break;
        case 'roadmarking':
            appWindowName = "Road Marking Inspection";
            break;
        case 'roadstud':
            appWindowName = "Road Stud Inspection";
            break;
        case 'signboard':
            appWindowName = "Signboard Inspection";
            break;
        case 'steelbarricades':
            appWindowName = "Steel Barricades Inspection";
            break;
        case 'wirerope':
            appWindowName = "Wire Rope Inspection";
            break;
        case 'bridge':
            appWindowName = "Bridge Inspection";
            break;
        default:
            appWindowName = "Inspection";
            break;

    }

    var url;
    if (JOGETLINK['asset_insp_'+asset]) {
      url  = JOGETLINK['asset_insp_'+asset];
    }
    $("#appWindow iframe")
      .attr("src", url)
      .css("height", "100%")
      .css("width", "100%");
    changeAppWindowTitle("appWindow", appWindowName);
    jqwidgetBox("appWindow", 1);
}

function onClickAssetWorks(cat){
    var appWindowName ="";
    switch(cat){
        case 'manage_maint_work_activity':
            appWindowName = "Manage Work Activity";
            break;
        case 'manage_maint_work_instruction':
            appWindowName = "Manage Work Instruction";
            break;
        case 'submit_maint_work_program':
            appWindowName = "Work Program Submission";
            break;
        case 'inbox_maint_work_program':
            appWindowName = "Work Program Inbox";
            break;
        case 'inbox_maint_work_order':
            appWindowName = "Work Order Periodic Inbox";
            break;
        case 'submit_maint_noe':
            appWindowName = "Notice of Emergency Submission";
            break;
        case 'inbox_maint_noe':
            appWindowName = "Notice of Emergency Inbox";
            break;
        case 'submit_maint_work_daily_report':
            appWindowName = "Work Daily Report Submission";
            break;
        case 'inbox_maint_work_daily_report':
            appWindowName = "Work Daily Report Inbox";
            break;
        case 'work_order':
            appWindowName = "Manage Work Order";
            break;
        case 'manage_maint_equipment':
            appWindowName = "Manage Equipment";
            break;
        case 'manage_work_order_emergency':
            appWindowName = "Manage Work Order Emergency";
            break;
        case 'inbox_maint_work_order_emergency':
            appWindowName = "Work Order Emergency Inbox";
            break;
        case 'submit_work_order':
            appWindowName = "Work Order Periodic Submission";
            break;
        case 'submit_work_budget_approval':
            appWindowName = "Work Budget Approval Periodic Submission";
            break;
        case 'inbox_maint_work_budget_approval':
            appWindowName = "Work Budget Approval Periodic Inbox";
            break;
        case 'submit_work_budget_approval_emergency':
            appWindowName = "Work Budget Approval Emergency Submission";
            break;
        case 'inbox_maint_work_budget_approval_emergency':
            appWindowName = "Work Budget Approval Emergency Inbox";
            break;
        case 'submit_work_order_emergency':
            appWindowName = "Work Order Emergency Submission";
            break;
        case 'submit_defect_detection':
            appWindowName = "Defect Detection Submission";
            break;
        case 'inbox_maint_defect_detection':
            appWindowName = "Defect Detection Inbox";
            break;
    }

    var url;
    if (JOGETLINK['asset_'+cat]) {
      url  = JOGETLINK['asset_'+cat];
    }
    $("#appWindow iframe")
      .attr("src", url)
      .css("height", "100%")
      .css("width", "100%");
    changeAppWindowTitle("appWindow", appWindowName);
    jqwidgetBox("appWindow", 1);
}

function OnClickSubmitInspection(asset){
    var appWindowName ="";
    switch(asset){
        case 'bridge':
            appWindowName = "Bridge Assessment";
            break;
        case 'culvert':
            appWindowName = "Culvert Assessment";
            break;
        case 'drainage':
            appWindowName = "Drainage Assessment";
            break;
        case 'pavement':
            appWindowName = "Pavement Assessment";
            break;
        case 'roadfurniture':
            appWindowName = "Road Furniture Assessment";
            break;
        case 'slope':
            appWindowName = "Slope Assessment";
            break;
        default:
            appWindowName = "Inspection";
            break;
    
        }
    var url;
    if (JOGETLINK['asset_assess_'+asset]) {
        url  = JOGETLINK['asset_assess_'+asset];
    }
    $("#appWindow iframe")
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");
    changeAppWindowTitle("appWindow", appWindowName);
    jqwidgetBox("appWindow", 1);
}

function OnClickSubmitMaintain(asset){
    var appWindowName ="";
    switch(asset){
        case 'nod':
            appWindowName = "Notice of Defect - Periodic";
            break;
        case 'nod_emergency':
            appWindowName = "Notice of Defect - Emergency";
            break;
        case 'ncp':
            appWindowName = "Non Conformance Product";
            break;
        case 'rfi':
            appWindowName = "Request for Inspection";
            break;
        case 'schedule_inspection':
            appWindowName = "Routine Inspection";
            break;
        case 'site_routine':
            appWindowName = "Inspector Visit Report";
            break;
        default:
            appWindowName = "Maintenance";
            break;
    
        }
    var url;
    if (JOGETLINK['asset_maintain_'+asset]) {
        url  = JOGETLINK['asset_maintain_'+asset];
    }
    $("#appWindow iframe")
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");
    changeAppWindowTitle("appWindow", appWindowName);
    jqwidgetBox("appWindow", 1);
}

function OnClickInbox(asset){
    var appWindowName ="";
    switch(asset){
        case 'bridge':
            appWindowName = "Bridge Inbox";
            break;
        case 'culvert':
            appWindowName = "Culvert Inbox";
            break;
        case 'drainage':
            appWindowName = "Drainage Inbox";
            break;
        case 'pavement':
            appWindowName = "Pavement Inbox";
            break;
        case 'roadfurniture':
            appWindowName = "Road Furniture Inbox";
            break;
        case 'slope':
            appWindowName = "Slope Inbox";
            break;
        case 'nod':
            appWindowName = "Notice of Defect - Periodic";
            break;
        case 'nod_emergency':
            appWindowName = "Notice of Defect - Emergency";
            break;
        case 'ncp':
            appWindowName = "Non Conformance Product";
            break;
        case 'rfi':
            appWindowName = "Request for Inspection";
            break;
        case 'nod_routine':
            appWindowName = "Notice of Damage";
            break;
        case 'schedule_inspection':
            appWindowName = "Routine Inspection";
            break;
        case 'site_routine':
            appWindowName = "Inspector Visit Report";
            break;
    }
    var url;
    if (JOGETLINK['asset_inbox_'+asset]) {
        url  = JOGETLINK['asset_inbox_'+asset];
    }
    $("#appWindow iframe")
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");
    changeAppWindowTitle("appWindow", appWindowName);
    jqwidgetBox("appWindow", 1);

}

function OnClickFloatBoxAssetInspection(){
    var assetid = GetFloatBoxHeaderAndText('th', 'ASSET ID');
    var type = GetFloatBoxHeaderAndText('th', 'ASSET CATEGORY');
    var asset = "";
    var appWindowName ="";
    var inv_id, type, asset_id, position, chainageStart, chainageEnd;
    var addUrl ="";
    switch(type.nextText){
        case 'CL':
            asset = 'culvert';
            inv_id = assetDataAPI[0].data[0].id;
            type = assetDataAPI[0].data[0].culvert_type;
            asset_id = assetDataAPI[0].data[0].asset_name;
            addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
            appWindowName = "Culvert Inspection";
            break;
        case 'PV':
            asset = 'pavement';
            inv_id = assetDataAPI[0].data[0].id;
            position = assetDataAPI[0].data[0].asset_position;
            asset_id = assetDataAPI[0].data[0].asset_id;
            chainageStart = assetDataAPI[0].data[0].chainage_start;
            chainageEnd = assetDataAPI[0].data[0].chainage_end;
            addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&asset_position="+position+ "&chainage_start="+chainageStart+"&chainage_end="+chainageEnd;
            appWindowName = "Pavement Inspection";
            break;
        case 'DR':
            asset = 'drainage';
            inv_id = assetDataAPI[0].data[0].id;
            type = assetDataAPI[0].data[0].drainage_type;
            asset_id = assetDataAPI[0].data[0].asset_id;
            addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
            appWindowName = "Drainage Inspection";
            break;
        case 'SL':
            asset = 'slope';
            inv_id = assetDataAPI[0].data[0].id;
            asset_id = assetDataAPI[0].data[0].asset_id;
            addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id;
            appWindowName = "Slope Inspection";
            break;
        case 'RF':
            var rf_type = GetFloatBoxHeaderAndText('th', 'ROAD FURNITURE TYPE');
            switch (rf_type.nextText){
                case 'GR':
                case 'Guardrail':
                    //guardrail
                    asset = 'guardrail';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Gurardrail Inspection";
                    break;
                case 'SB':
                case 'Signboard':
                    //signboard
                    asset = 'signboard';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Signboard Inspection";
                    break;
                case 'Anti Climb Fence':
                    //Anti Climb Fence
                    asset = 'anticlimbfence';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Anti Climb Fence Inspection";
                    break;
                case 'Crash Cushion':
                    //Crash Cushion
                    asset = 'crashcushion';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Crash Cushion Inspection";
                    break;
                case 'Culvert Marker':
                    //Culvert Marker
                    asset = 'culvertmarker';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Culvert Marker Inspection";
                    break;
                case 'Flexible Post / Side Post':
                    //Flexible Post / Side Post
                    asset = 'flexisidepost';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Flexible Post / Side Post Inspection";
                    break;
                case 'Hectometer Marker':
                    //Hectometer Marker
                    asset = 'hectometermarker';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Hectometer Marker Inspection";
                    break;
                case 'Kilometer Marker':
                    //Kilometer Marker
                    asset = 'kilometermarker';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Kilometer Marker Inspection";
                    break;
                case 'Right of Way (R.O.W.) Fence':
                    //Right of Way (R.O.W.) Fence
                    asset = 'rightfence';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Right of Way (R.O.W.) Fence Inspection";
                    break;
                case 'River Marker':
                    //River Marker
                    asset = 'rivermarker';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "River Marker Inspection";
                    break;
                case 'Road Marking':
                    //Road Marking
                    asset = 'roadmarking';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Road Marking Inspection";
                    break;
                case 'Road Stud':
                    //Road Stud
                    asset = 'roadstud';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Road Stud Inspection";
                    break;
                case 'Steel Barricades':
                    //Steel Barricades
                    asset = 'steelbarricades';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Steel Barricades Inspection";
                    break;
                case 'Wire Rope':
                    //Wire Rope
                    asset = 'wirerope';
                    inv_id = assetDataAPI[0].data[0].id;
                    asset_id = assetDataAPI[0].data[0].asset_id;
                    type = assetDataAPI[0].data[0].road_furniture_type;
                    addUrl = "&inv_id="+inv_id+"&asset_id="+asset_id+"&type="+type;
                    appWindowName = "Wire Rope Inspection";
                    break;
           
            }
            
            break;
        case 'BRB':
        case 'BRBG':
        case 'BRPier':
        case 'BRA':
        case 'BRParapet':
        case 'BRDS':
        case 'BRPC':
        case 'BR':
            asset = 'bridge';
            inv_id = assetDataAPI[0].data[0].id;
            type = assetDataAPI[0].data[0].bridge_type;
            asset_name = assetDataAPI[0].data[0]['inv_bridge.asset_name'];
            addUrl = "&d-6596122-fn_asset_name="+asset_name;
            appWindowName = "Bridge Inspection";
            break;
    }

    var url;
    if (JOGETLINK['asset_insp_form_'+asset]) {
        url  = JOGETLINK['asset_insp_form_'+asset] + addUrl;
      
    }
    $("#appWindow iframe")
      .attr("src", url)
      .css("height", "100%")
      .css("width", "100%");
    changeAppWindowTitle("appWindow", appWindowName);
    jqwidgetBox("appWindow", 1);
};

function GetFloatBoxHeaderAndText(tagToFind, valueToFind) {
	var text =[];
	$(tagToFind).each(function (i) {
		if ($(this).text().includes(valueToFind) ) {
            text.caption = $(this).text();
			if ($(this).next() != null && $(this).next() != undefined) {
				text.nextText = $(this).next().text();
			}
		}
	});
	return (text);
}

function OnLoadAssetNotiCount() {
    if(localStorage.Project_type == 'CONSTRUCT')  return;
    $.ajax({
      type: "POST",
      url: "BackEnd/jogetAsset.php",
      dataType: "json",
      data: {
        functionName: "getListOfAssetNotification",
      },
      success: function (obj, textstatus) {
        $("#notiCount").text(obj["total"]);
        document.getElementById("notiDrop").innerHTML = "";
        let i = 0;
        while (i < 5) {
          if (i < obj["total"]) {
            let concat =
              '<button class="notiitems" rel="rfi" onclick="openFormAssetNoti(`' +
              obj.data[i]["processId"] +
              "`,`" +
              obj.data[i]["activityId"] +
              "`,`" +
              obj.data[i]["processName"] +
              '`);"><b>' +
              obj.data[i]["label"] +
              "</b><br>" +
              obj.data[i]["processApp"] + ": " + obj.data[i]["assetID"] +
              "</button><br>";
            document.getElementById("notiDrop").innerHTML =
              document.getElementById("notiDrop").innerHTML + concat;
          } else {
            break;
          }
          i++;
        }
        document.getElementById("notiDrop").innerHTML =
          document.getElementById("notiDrop").innerHTML + '<button class="notiitems"  onclick="InitAssetAsgnmtBox(\'assInboxTab1\');" ><br>View all assignments</button><br>';
      },
    });
}

if (localStorage.isParent !== undefined && localStorage.Project_type == 'ASSET') {
    //|| no project links
    OnLoadAssetNotiCount();
}

InitAssetAsgnmtBox = (tabToActive) => {
    if($("#"+tabToActive)) $("#"+tabToActive).click()
    hideAllWindow()
    $("#notiDrop").removeClass("active");
    $("#notiDrop").css("display", "none");
    jqwidgetBox("AssetInboxBrowser", true);
}
function openFormAssetNoti(processId, activityId, processName) {
    floatboxTurnOFF();
    changeAppWindowTitle("appWindow", processName);
    jqwidgetBox("appWindow", 1);
    $("#notiDrop").removeClass("active");
    $("#notiDrop").css("display", "none");
    if (!JOGETLINK) return
  
    //need update
    conOpData.loadedFreq = 0;
    var urlInbox;
    if(JOGETLINK['asset_json_open_inbox']){
      urlInbox = JOGETLINK['asset_json_open_inbox'];
    }
    let url = urlInbox + "_mode=assignment&activityId=" + activityId;
    $("#appWindow iframe")
      .attr("src", url)
      .css("height", "100%")
      .css("width", "100%");
    $("#appWindow iframe").unbind("load");
    $("#appWindow iframe").on("load", function () {
      //#### reset jogetConOpDraw
      conOpData.loadedFreq++;
      if (conOpData.loadedFreq > 1) {
        OnLoadAssetNotiCount();
        conOpData.loadedFreq = 0;
      }
    });
  }

  function IniatiateAssetMtnOp(ele, noSubTab = 0) {  //where overall list is loaded
    var url;
    var processType = $(ele).attr("data");
    var page =  $(ele).attr("rel");

    if(noSubTab) assetMtnTabToggle(ele);

    $(ele).parent().find(".active").removeClass("active");
    $(ele).addClass("active");
    
    if (!JOGETLINK) return;
    if (!jogetAppProcesses["app_INV"]) return;

    jqwidgetBox("appWindow", false);
    $("#appWindow iframe").unbind("load");
    if(jogetAppProcesses["app_INV"] === 1 && JOGETLINK['asset_'+processType]) url = JOGETLINK['asset_'+processType];
    if($("#"+page).length != 0) $("#"+page+" iframe").attr("src", url);
  }

  function onClickListNetwork(ele){

    var url;
    var processType = $(ele).attr("data");
    var page =  $(ele).attr("rel");

   
    $(ele).parent().find(".active").removeClass("active");
    $(ele).addClass("active");
    
    if (!JOGETLINK) return;
    if (!jogetAppProcesses["app_INV"]) return;

    // jqwidgetBox("appWindow", false);
    // $("#appWindow iframe").unbind("load");
     if(jogetAppProcesses["app_INV"] === 1 && JOGETLINK['asset_'+processType]) url = JOGETLINK['asset_'+processType];
    if($("#"+page).length != 0) $("#"+page+" iframe").attr("src", url);

  }
  
