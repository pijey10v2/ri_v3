var $jogetHost = JOGETHOST+'/jw';
var aicPackageID = "";
var isPackageChanged = false; // flag to indicate that package being changed at AIC compare dropdown
var bumiPackageUuid = '';
var bumiPackageWpcId = '';
var bumiPackageId = '';
var filterArr = {};

function onChangeSelYear(e){
    var id = $(e).attr("id");
    var targetMonthFilter = id.replace('Option', '');
    var val = $(e).find(':selected').val()

    if(val !== "default"){
        $(`#${targetMonthFilter}`).removeClass("disabled")
        $(`#${targetMonthFilter}`).addClass("active")
        $(`.${targetMonthFilter}`).slideDown(70, function(){
            $(this).addClass("active")
            $(this).css({
                display: "grid"
            })
        })
    }else{
        $(`#${targetMonthFilter}`).addClass("disabled")
        $(`#${targetMonthFilter}`).removeClass("active")
        $(`.${targetMonthFilter}`).slideUp(70, function(){
            $(this).removeClass("active")
            $(this).css({
                display: "none"
            })
        })
    }
    filterOnChange(e)
}

function filterOnChange(ele) {
    $('input[data-chk="routine"]:checked').each(function(idx, ele) {
        assetViewRoutineList(ele);
    });
    $('input[data-chk="defect"]:checked').each(function(idx, ele) {
        assetViewDefectList(ele);        
    });
}

function getIframeID(){
    var frameID = $(".mainAppButton.active").attr("rel");

    if(frameID == "myReporting"){
        frameID = 'digRepIframe';
    }
    refreshDash(frameID);
}

function refreshPackage (frm){
    var selWPC = $('.packFilter.'+frm).val();
    if(selWPC == 'overall'){
        var secHTML = '<option value="overall">Select Section</option>';
        $('.sectFilter').html(secHTML);
        $('.sectFilter.'+frm).prop('selectedIndex',0);
    }

    $('.sectFilter.'+frm).prop('selectedIndex',0);
    $('.yrFilter.'+frm).prop('selectedIndex',0);
    $('.mthFilter.'+frm).prop('selectedIndex',0);
    $('.mthFilter.'+frm).prop("disabled", "disabled");
    $('.categoryFilter.'+frm).prop('selectedIndex',0);
    $('.statusPubcFilter.'+frm).prop('selectedIndex',0);
    $('.statusPubcSbhFilter.'+frm).prop('selectedIndex',0);
    $('.statusLandFilter.'+frm).prop('selectedIndex',0);
    $('.sourceFilter.'+frm).prop('selectedIndex',0);
    $('.reportCategoryFilter.'+frm).prop('selectedIndex',0);
    $('.reportStatusFilter.'+frm).prop('selectedIndex',0);
    $('.categoryRiskFilter.'+frm).prop('selectedIndex',0);
    $('.riskRatingFilter.'+frm).prop('selectedIndex',0);
    $('.lcmNoFilter.'+frm).prop('selectedIndex',0);
    $('.issueStatus.'+frm).prop('selectedIndex',0);
    $('.catgGenMgmt.'+frm).prop('selectedIndex',0);
    $('.typeGenMgmt.'+frm).prop('selectedIndex',0);
    $('.districtFilter.'+frm).prop('selectedIndex',0);
    $('.assetDateFilter.'+frm).prop('selectedIndex',0);
    $('.assetLaneFilter.'+frm).prop('selectedIndex',0);
    $('.assetDirectionToFilter.'+frm).prop('selectedIndex',0);
    $('.assetChainFromFilter.'+frm).prop('selectedIndex',0);
    $('.assetChainToFilter.'+frm).prop('selectedIndex',0);
    $('.assetApjFilter.'+frm).prop('selectedIndex',0);
    $('.assetRoutineActivityFilter.'+frm).prop('selectedIndex',0);
    $('.subActivityFilter.'+frm).prop('selectedIndex',0);
    $('.assetTypeFilter.'+frm).prop('selectedIndex',0);
    $('.assetGroupFilter.'+frm).prop('selectedIndex',0);

    refreshDash(frm)
}

function refreshDash(idFrame){
    var selWPC = $('.packFilter.'+idFrame).val();
    var selWPCName = $('.packFilter.'+idFrame).find(':selected').text() // get package name for chart label
    var selSect = $('.sectFilter.'+idFrame).val();
    var selYear = $('.yrFilter.'+idFrame).val();

    if (selYear == 'all') {
    	$('.mthFilter').prop("disabled", "disabled");
		$('.mthFilter').val('all');
    }else{
    	$('.mthFilter').prop("disabled", false);
    }
	var selMonth = $('.mthFilter.'+idFrame).val();

    //FOR OTHER FILTER
    var selCategory = $('.categoryFilter.'+idFrame).val();
    var selStatusPubcSrwk = $('.statusPubcFilter.'+idFrame).val();
    var selStatusPubcSbhk = $('.statusPubcSbhFilter.'+idFrame).val();
    var selStatusLand = $('.statusLandFilter.'+idFrame).val();
    var selSource = $('.sourceFilter.'+idFrame).val();
    var selReportCat = $('.reportCategoryFilter.'+idFrame).val();
    var selReportStatus = $('.reportStatusFilter.'+idFrame).val();
    var selCatRisk = $('.categoryRiskFilter.'+idFrame).val();
    var selRiskRating = $('.riskRatingFilter.'+idFrame).val();
    var selLcmNo = $('.lcmNoFilter.'+idFrame).val();
    var selIssueStatus = $('.issueStatus.'+idFrame).val();
    var selCatgPubc = $('.catgGenMgmt.'+idFrame).val();
    var selTypePubc = $('.typeGenMgmt.'+idFrame).val();
    var selDistrict = $('.districtFilter.'+idFrame).val();
    var selAssetAPJ = $('.assetApjFilter.'+idFrame).val();
    var selAssetRoutine = $('.assetRoutineActivityFilter.'+idFrame).val();
    var selSubActivity = $('.subActivityFilter.'+idFrame).val();
    var selAssetType = $('.assetTypeFilter.'+idFrame).val();
    var selAssetGroup = $('.assetGroupFilter.'+idFrame).val();
    var selAssetDate = $('.assetDateFilter.'+idFrame).val();
    var selAssetLane = $('.assetLaneFilter.'+idFrame).val();
    var selAssetChainFrom = $('.assetChainFromFilter.'+idFrame).val();
    var selAssetChainTo = $('.assetChainToFilter.'+idFrame).val();
    var selAssetDirection = $('.assetDirectionToFilter.'+idFrame).val();

    selWPC = (selWPC) ? selWPC : 'overall';
    selWPCName = (selWPC != 'overall') ? selWPCName : 'all';

    filterArr = {
        wpc: selWPC, 
        wpcName: selWPCName, 
        section: selSect, 
        year: selYear,
        month: selMonth,
        category: selCategory,
        statusSrwk: selStatusPubcSrwk,
        statusSbh: selStatusPubcSbhk,
        statusLand: selStatusLand,
        sourceLand: selSource,
        reportCat: selReportCat,
        reportStat: selReportStatus,
        riskCat: selCatRisk,
        riskRating: selRiskRating,
        lcmLand: selLcmNo,
        districtLand: selDistrict,
        assetAPJ: selAssetAPJ,
        assetRoutine: selAssetRoutine,
        assetSubAct: selSubActivity,
        assetType: selAssetType,
        assetGroup: selAssetGroup,
        assetDate: selAssetDate,
        assetLane: selAssetLane,
        assetChainFrom: selAssetChainFrom,
        assetChainTo: selAssetChainTo,
        assetDirection: selAssetDirection,
        issueStatus: selIssueStatus,
        catgPubc: selCatgPubc,
        typePubc: selTypePubc
    };

    $("#" +idFrame)[0].contentWindow.refreshFromv3(filterArr);
}

function getFilterForDashboard(){
    var frameID = $(".mainAppButton.active").attr("rel");

    var selWPC = $('.packFilter.'+frameID).val();
    var selPackageUuid = $('.packFilter.'+frameID).find(':selected').data('packageuuid');

    var selSect = $('.sectFilter.'+frameID).val();
    var selYear = $('.yrFilter.'+frameID).val();

    //FOR OTHER FILTER
    var selCategory = $('.categoryFilter.'+frameID).val();
    var selStatusPubcSrwk = $('.statusPubcFilter.'+frameID).val();
    var selStatusPubcSbhk = $('.statusPubcSbhFilter.'+frameID).val();
    var selStatusLand = $('.statusLandFilter.'+frameID).val();
    var selSource = $('.sourceFilter.'+frameID).val();
    var selReportCat = $('.reportCategoryFilter.'+frameID).val();
    var selReportStatus = $('.reportStatusFilter.'+frameID).val();
    var selCatRisk = $('.categoryRiskFilter.'+frameID).val();
    var selRiskRating = $('.riskRatingFilter.'+frameID).val();
    var selLcmNo = $('.lcmNoFilter.'+frameID).val();
    var selIssueStatus = $('.issueStatus.'+frameID).val();
    var selCatgPubc = $('.catgGenMgmt.'+frameID).val();
    var selTypePubc = $('.typeGenMgmt.'+frameID).val();
    var selDistrict = $('.districtFilter.'+frameID).val();
    var selAssetActivity = $('.assetRoutineActivityFilter.'+frameID).val();
    var selAssetGroup = $('.assetGroupFilter.'+frameID).val();

    if (selYear == 'all') {
    	$('.mthFilter').prop("disabled", "disabled");
		$('.mthFilter').val('all');
    }else{
    	$('.mthFilter').prop("disabled", false);
    }
	var selMonth = $('.mthFilter.'+frameID).val();

    selWPC = (selWPC) ? selWPC : 'overall';

    filterArr = {
        wpc: selWPC,
        packageuuid: selPackageUuid, 
        section: selSect, 
        year: selYear,
        month: selMonth,
        category: selCategory,
        statusSrwk: selStatusPubcSrwk,
        statusSbh: selStatusPubcSbhk,
        statusLand: selStatusLand,
        sourceLand: selSource,
        reportCat: selReportCat,
        reportStat: selReportStatus,
        riskCat: selCatRisk,
        riskRating: selRiskRating,
        lcmLand: selLcmNo,
        districtLand: selDistrict,
        assetActivity: selAssetActivity,
        assetGroup: selAssetGroup,
    };

    $("#" +frameID)[0].contentWindow.retrieveFilterFromMainWindows(filterArr);
}

$(".packFilter").change(function () {
    $('.sectFilter').html('');
    var optHTML = '<option value="overall">Select Section</option>';
    $('.sectFilter').html(optHTML);
    for (const [idx, ele] of Object.entries(sectionForProject)) {
        if(ele.packageID == $(this).val()){
            populateSectionFilter(ele.sectionID);
        }
    }

    $('.yrFilter').html('');
    var yearHTML = '<option value="all">Select Year</option>';
    $('.yrFilter').html(yearHTML);
    for (const [idx, ele] of Object.entries(yearForProject)) {
        if(ele.packageID == $(this).val()){
            populateYearFilter(ele.year);
        }
    }

})

function populateSectionFilter(data) {
    $('.sectFilter').html('');

    var optHTML = '<option value="overall">Select Section</option>';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('.sectFilter').html(optHTML);
}

function populateYearFilter(data) {
    $('.yrFilter').html('');

    var yearHTML = '<option value="all">Select Year</option>';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            yearHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('.yrFilter').html(yearHTML);
}

function setupListOnchange(ele){
    var link = '';
	let setupChoosen = $(ele).val();
    let title = $(".modal-header a").text();

    if(setupChoosen == 'default'){
        defaultStateWizard(title)

    }else{

        if(SYSTEM == 'OBYU'){
            switch (setupChoosen) {
                case 'ncrCatg':
                    link = 'construct_setup_NCR';
                    break;
                case 'incCatg':
                    link = 'construct_setup_INC_Category';
                    break;
                case 'pubcCatg':
                    link = 'construct_setup_PUBC';
                    break;
                case 'eventCatg':
                    link = 'construct_setup_EVNT';
                    break;
                case 'statisticSA':
                    link = 'construct_statistics_SA';
                    break;
                case 'statisticSMH':
                    link = 'construct_statistics_SMH';
                    break;
                case 'classification':
                    link = 'construct_setup_classif';
                    break;
                case 'discipline':
                    link = 'construct_setup_discipline';
                    break;
                case 'subDiscipline':
                    link = 'construct_setup_subdiscipline';
                    break;
                case 'entity':
                    link = 'construct_setup_entity';
                    break;
                case 'WPC':
                    link = 'construct_setup_WPC';
                    break;
                case 'section':
                    link = 'construct_setup_section_NCR';
                    break;
                case 'trade':
                    link = 'construct_setup_trade_NCR';
                    break;
                case 'areaSetup':
                    link = 'construct_setup_area_RR';
                    break;
                case 'ownerSetup':
                    link = 'construct_setup_owner_RR';
                    break;
                case 'projectImpactSetup':
                    link = 'construct_setup_projectimpact_RR';
                    break;
                case 'sourceSetup':
                    link = 'construct_source_RR';
                    break;
                case 'packageIDsetup':
                    link = 'construct_setup_packageid_RR';
                    break;
                case 'controlSetup':
                    link = 'construct_setup_control_RR';
                    break;
                case 'statusSetup':
                    link = 'construct_setup_status_RR';
                    break;
                case 'WTG':
                    link = 'construct_setup_section_LM';
                    break;
                case 'packageSection':
                    link = 'construct_setup_section_LTD';
                    break;
                case 'CTD':
                    link = 'construct_setup_section_CTD';
                    break;
                
            }
        }else{
            switch (setupChoosen) {
                case 'workDiscipline':
                    link = 'cons_issue_NOI_WD_Setup';
                    break;
                case 'riskCategory':
                    link = 'cons_issue_RR_Category_Setup';
                    break;
                case 'riskSubCategory':
                    link = 'cons_issue_RR_Sub_Category_Setup';
                    break;
                case 'riskDescription':
                    link = 'cons_issue_RR_Description_Setup';
                    break;
                case 'machinery':
                    link = 'cons_issue_SDL_Machinery_Setup';
                    break;
                case 'manpower':
                    link = 'cons_issue_SDL_Manpower_Setup';
                    break;
                case 'assignUser':
                    link = 'cons_issue_sdl_user_section_setup';
                    break;
                case 'district':
                    link = 'cons_issue_District_Setup';
                    break;
                case 'workDiscipline_SSLR2':
                    link = 'cons_issue_IR_WD_Setup';
                    break;
                case 'complaintCat':
                    link = 'cons_setup_PBC_Category';
                    break;
                case 'wirCode':
                    link = 'cons_issue_WIR_Code_Setup';
                    break;
                case 'ccPubc':
                    link = 'cons_issue_PBC_CC_Setup';
                    break;
            }
        }
    
        openSetupDatalist(link)

    }

}

function statisticListOnchange(ele){
    if (!JOGETLINK) return
    var link = '';
	let choosen = $(ele).val();
    let title = $(".modal-header a").text();

    if(choosen == 'default'){
        defaultStateWizard(title)
    }else{

        switch (choosen) {
            case 'SA':
                link = 'construct_statistics_SA';
                break;
            case 'SMH':
                link = 'construct_statistics_SMH';
                break;
        }
    
        if (JOGETLINK.form[link]) {
            url  = JOGETLINK.form[link];
        }

        var loading = $('.loader');
        loading.fadeIn();

        iframe = $("iframe#statisticIframe");
        iframe.hide();
        iframe.attr("src", "");
        iframe.attr("src", url);
        iframe.on("load", function () {
            loading.fadeOut();
            iframe.show();
        });

    }
}

function setupAssetOnchange(ele){
    if (!JOGETLINK) return
    var link = '';
	let setupChoosen = $(ele).val();
    let title = $(".modal-header a").text();
    var url;

    if(setupChoosen == 'default'){
        defaultStateWizard(title)
    }else{
        switch (setupChoosen) {
            case 'Equipment':
                link = 'asset_manage_maint_equipment';
                break;
        }

        if (JOGETLINK[link]) {
            url  = JOGETLINK[link];
        }

        var loading = $('.loader');
        loading.fadeIn();

        iframe = $("iframe#setupAssetIframe");
        iframe.hide();
        iframe.attr("src", "");
        iframe.attr("src", url);
        iframe.on("load", function () {
            loading.fadeOut();
            iframe.show();
        });
    }
}

function fmSetupAssetOnchange(ele){
    if (!JOGETLINK) return
    var link = '';
    let setupChoosen = $(ele).val();
    let title = $(".modal-header a").text();
    var url;
 
    if(setupChoosen == 'default'){
        defaultStateWizard(title)
    }else{
        switch (setupChoosen) {
            case 'SOR Management':
                link = 'fm_sor_management_setup';
                break;
        }
 
        if (JOGETLINK[link]) {
            url  = JOGETLINK[link];
        }
 
        var loading = $('.loader');
        loading.fadeIn();
 
        iframe = $("iframe#setupAssetIframe");
        iframe.hide();
        iframe.attr("src", url);
        iframe.on("load", function () {
            loading.fadeOut();
            iframe.show();
        });
    }
}

function fmAssetTableOptionOnchange(ele) {
    if (!JOGETLINK) return
 
    var link = '';
    let optonChoosen = $(ele).val();
    let title = $(".modal-header a").text();
    var url;
 
    var fm_asset_no = $('.fmNewAssetTable #fm_asset_no').val();
    var fm_asset_name = $('.fmNewAssetTable #fm_asset_name').val();
    var fm_asset_type = $('.fmNewAssetTable #fm_asset_type').val();
 
    if(optonChoosen == 'default'){
        defaultStateWizard(title)
    }else{
        switch (optonChoosen) {
            case 'Service Request':
                link = 'fm_new_service_request';
                break;
        }
 
        if (JOGETLINK[link]) {
            url  = JOGETLINK[link];
        }
 
        var separator = url.indexOf('?') !== -1 ? '&' : '?';
        url += separator +
                "asset_no=" + encodeURIComponent(fm_asset_no) +
                "&asset_name=" + encodeURIComponent(fm_asset_name) +
                "&asset_type=" + encodeURIComponent(fm_asset_type);
 
        var loading = $('.loader');
        loading.fadeIn();
 
        iframe = $("iframe#assetTableProcessIframe");
        iframe.hide();
        iframe.attr("src", url);
        iframe.on("load", function () {
            loading.fadeOut();
            iframe.show();
        });
    }
}

function manageListOnchange(ele){
	let manageChoosen = $(ele).val();
	let selectId = $(ele).attr('id');
    let title = $(".modal-header a").text();
    var cesiumFrame = (localStorage.page_pageOpen == "myInsights") ? 'Manage Insights' : title;
    switch (cesiumFrame) {
        case "Manage Project":
        case "Manage Construction Process":
            viewerUse = viewerManageProcess;
            if(cesiumObjProcess){
                if (jogetConOpDraw.entity) {
                    jogetConOpDraw.entity = null;
                }
                destroyCesium(cesiumObjProcess)
            }
            break;
        case "Manage Insights":
            viewerUse = viewer;
            if (jogetConOpDraw.entity) {
                jogetConOpDraw.entity = null;
            }
            break;
    }

    if(manageChoosen == 'default'){
        defaultStateWizard(title)
    }else{
        if(selectId == "valueManageConstruct1"){
            cesiumObjProcess = loadRiCesiumManageProj(homeLocation, 'RIContainerManageProj');
        }
        if(selectId == "valueManageConstruct"){
            cesiumObjProcess = loadRiCesiumManageProj(homeLocation, 'RIContainerManageProj1');
        }
        openManageDatalist(manageChoosen)
        zoomToGetData()
    }
}

function manageAssetOnchange(ele){
	if (!JOGETLINK) return
    var link = '';
	let setupChoosen = $(ele).val();
    let title = $(".modal-header a").text();
    var url;

    if(setupChoosen == 'default'){
        defaultStateWizard(title)
    }else{
        switch (setupChoosen) {
            case 'WA':
                if(localStorage.project_owner == 'JKR_SABAH'){
					link = 'asset_manage_maint_work_activity_sabah';
				}else{
                    link = 'asset_manage_maint_work_activity';
                }
                
                break;
            case 'WI':
                if(localStorage.project_owner == 'JKR_SABAH'){
					link = 'asset_manage_maint_work_instruction_sabah';
				}else{
                    link = 'asset_manage_maint_work_instruction';
                }
                
                break;
            case 'DR':
                if(localStorage.project_owner == 'JKR_SABAH'){
					link = 'asset_manage_defect_detection_sabah';
				}else{
                    link = 'asset_manage_defect_detection';
                }
                break;
            case 'NOD':
                link = 'asset_manage_NODefect';
                break;
            case 'NOE':
                link = 'asset_manage_NOE';
                break;
        }

        if (JOGETLINK[link]) {
            url  = JOGETLINK[link];
        }

        var loading = $('.loader');
        loading.fadeIn();

        iframe = $("iframe#manageAssetIframe");
        iframe.hide();
        iframe.attr("src", "");
        iframe.attr("src", url);
        iframe.on("load", function () {
            loading.fadeOut();
            iframe.show();
        });
    }
}

//bumi package on change
function bumiPackageOnchange(ele){
    let bumiChoosen = $(ele).val();

    bumiPackageUuid = $(ele).find(':selected').data('package_uuid');
    bumiPackageWpcId = $(ele).find(':selected').data('wpc_id');
    bumiPackageId = $(ele).find(':selected').val();

    let title = $(".modal-header a").text();

    if(bumiChoosen == 'default'){
        defaultStateWizard(title)

    }else{
        $('.projectProcessMap').css('display', 'block')
        $('.projectProcessCreate').css('display', 'none')
        $('.RILandContainer').addClass('active')
        $('.projectProcessMap .RIwindowContainer').css('height', 'calc(100% - 73px)')
    }
}

$(document).ready(function(){

})

function ConOpViewWholeList(ele) {
	let processName = $(ele).val();
	var polygonProcess = "";
	switch (processName) {
	    case "NOI":
            colourProcess = "../Images/icons/layerProcess/pointNCR.png"
            polygonProcess = Cesium.Color.ORANGERED
        break;
	    case "NCR":
            colourProcess = "../Images/icons/layerProcess/pointNCR.png"
            polygonProcess = Cesium.Color.ORANGERED
        break;
	    case "WIR":
            colourProcess = "../Images/icons/layerProcess/pointWIR.png"
            polygonProcess = Cesium.Color.LIME
        break;
	    case "MS":
            colourProcess = "../Images/icons/layerProcess/pointMS.png"
            polygonProcess = Cesium.Color.BLUE
        break;
	    case "RS":
            colourProcess = "../Images/icons/layerProcess/pointRS.png"
            polygonProcess = Cesium.Color.DARKGOLDENROD
        break;
	    case "DCR":
            colourProcess = "../Images/icons/layerProcess/pointRS.png"
            polygonProcess = Cesium.Color.DARKGOLDENROD
        break;
	    case "RFI":
            colourProcess = "../Images/icons/layerProcess/pointRFI.png"
            polygonProcess = Cesium.Color.GOLD
        break;
	    case "IR":
            colourProcess = "../Images/icons/layerProcess/pointIR.png"
            polygonProcess = Cesium.Color.HOTPINK
        break;
	    case "MOS":
            colourProcess = "../Images/icons/layerProcess/pointMOS.png"
            polygonProcess = Cesium.Color.AQUA
        break;
	    case "SD":
            colourProcess = "../Images/icons/layerProcess/pointSD.png"
            polygonProcess = Cesium.Color.DARKSALMON
        break;
	    case "SDL":
            colourProcess = "../Images/icons/layerProcess/pointSDL.png"
            polygonProcess = Cesium.Color.DARKORCHID
        break;
	    case "PBC":
            colourProcess = "../Images/icons/layerProcess/pointRS.png"
            polygonProcess = Cesium.Color.DARKGOLDENROD
        break;
	    case "SP" :
            colourProcess = "../Images/icons/layerProcess/pointIR.png"
            polygonProcess = Cesium.Color.HOTPINK
        break;
	    case "DA":
            colourProcess = "../Images/icons/layerProcess/pointSDL.png"
            polygonProcess = Cesium.Color.DARKORCHID
        break;
        case "PTW":
            colourProcess = "../Images/icons/layerProcess/pointSDL.png"
            polygonProcess = Cesium.Color.CHARTREUSE
        break;
        case "CAR":
            colourProcess = "../Images/icons/layerProcess/pointSDL.png"
            polygonProcess = Cesium.Color.CORAL 
        break;
	    default:
            colourProcess = "../Images/icons/layerProcess/pointMS.png"
            polygonProcess = Cesium.Color.BLUE
        break;
	}

	if ($(ele).is(":checked")) {

        if(SYSTEM == 'OBYU'){
            //load relevant data from api
            $.ajax({
                type: "POST",
                url: "../BackEnd/joget.php",
                dataType: "json",
                data: {
                    functionName: "getJogetProcessRecords",
                    processName: processName,
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
                    var processArray = ["NCR", "NOI", "RFI", "WIR", "MOS" , "MS"];
                    var chainageToProcess = ["NCR", "NOI"];
                    obj.data.forEach(function (item) {
                        if(processArray.includes(processName)){
                            if(item["longitude"] != "" || item["latitude"] !=""){
                                let long = parseFloat(item["longitude"]);
                                let lat = parseFloat( item["latitude"]);
                                let chainage = item["chainage"].split("+");
                                var lwr = (parseInt(chainage[1])- 49);
                                var llabel = (lwr != 951) ? chainage[0]+ "+": "CH" + parseInt(chainage[0].match(/(\d+)/)) -1 +"+";
                                var hgr = (parseInt(chainage[1])+ 50);
                                var hlabel = (hgr != 050) ? chainage[0]+ "+": "CH" + parseInt(chainage[0].match(/(\d+)/)) +1 +"+";
                                lwr = (lwr <0)? 0 :lwr;
                                var lch = String(lwr).padStart(3, '0');
                                var hch = String(hgr).padStart(3, '0');
                                let chainageString = llabel +lch+ " - " +hlabel+ hch;
                
                                if(item["chainage_type"] != undefined  &&  chainageToProcess.includes(processName)   && item["chainage_type"] == "Line" && item['longitude_to']!= null && item['latitude_to']!= null){
                                    drawnEntity = viewer.entities.add({
                                        name: "Line",
                                        polyline: {
                                        positions: Cesium.Cartesian3.fromDegreesArray([
                                            long,
                                            lat,
                                            item['longitude_to'],
                                            item['latitude_to'],
                                            
                                        ]),
                                        width: 3.5,
                                        arcType: Cesium.ArcType.RHUMB,
                                        material: polygonProcess
                                        
                                        }
                                    });
                                }else {
                                    //point
                                    drawnEntity = viewer.entities.add({
                                    name: "point",
                                    position: Cesium.Cartesian3.fromDegrees(
                                    long,
                                    lat,
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
                                }

                                let desc = '<div class="projectDesc">';
                                desc += "<table ><tbody >";
                                desc += "<tr><td> Longitude : " + long;
                                desc += "<tr><td> Latitude : " + lat;
                                let data = item.info.split(",");
                                let mystring = "";
                
                                switch(processName){
                                    case "NCR":
                                        for(var i=0; i <data.length; i++){
                                            let mydata = data[i].split("::");
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td> Ref No : " + mydata[0] + "</td></tr>";
                                            mystring += "<tr><td> Issued To : " + mydata[1] + "</td></tr>";
                                            mystring += "<tr><td> Date Issued : " + mydata[2] + "</td></tr>";
                                            mystring += "<tr><td> Discipline Code : " + mydata[3] + "</td></tr>";
                                            mystring += "<tr><td> Description : " + mydata[4] + "</td></tr>";
                                            mystring += "<tr><td> Discipline : " + mydata[8] + "</td></tr>";
                                            mystring += "<tr><td> NCR Status : " + mydata[9] + "</td></tr>";
                                            mystring += "<tr><td> Chainage From : " + mydata[12] + "</td></tr>";
                                            if( mydata.length > 13){
                                                mystring += "<tr><td> Chainage To : " + mydata[13] + "</td></tr>";
                                            }
                                            
                                            let string = $jogetHost+ "jw/web/client/app/conOp/latest/form/download/mrsbNcrEdit/"+mydata[11] +"/"+ encodeURI(mydata[10]) + ".";
                                            mystring += "<tr><td> File : <a target= _blank  href="+string+">"+ mydata[10] +"</a></td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                        }
                                        chainageString = "NCR at : "+ chainageString;
                                    break;
                                    case "NOI":
                                        for(var i=0; i <data.length; i++){
                                            let mydata = data[i].split("::");
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td> Ref No : " + mydata[0] + "</td></tr>";
                                            mystring += "<tr><td> Issued To : " + mydata[1] + "</td></tr>";
                                            mystring += "<tr><td> Date Issued : " + mydata[2] + "</td></tr>";
                                            mystring += "<tr><td> Issued By : " + mydata[3] + "</td></tr>";
                                            mystring += "<tr><td> Discipline : " + mydata[5] + "</td></tr>";
                                            mystring += "<tr><td> NOI Status : " + mydata[6] + "</td></tr>";
                                            mystring += "<tr><td> Chainage From : " + mydata[9] + "</td></tr>";
                                            if( mydata.length > 10){
                                                mystring += "<tr><td> Chainage To : " + mydata[10] + "</td></tr>";
                                            }
                                            
                                            let string = $jogetHost+ "jw/web/client/app/conOp/latest/form/download/mrsbNoiEdit/"+mydata[8] +"/"+ encodeURI(mydata[7]) + ".";
                                            mystring += "<tr><td> File : <a target= _blank  href="+string+">"+ mydata[7] +"</a></td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                            
                                        }
                                        chainageString = "NOI at : "+ chainageString;
                                    break;
                                    case "MOS":
                                        for(var i=0; i <data.length; i++){
                                            let mydata = data[i].split("::");
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td> Ref No : " + mydata[0] + "</td></tr>";
                                            mystring += "<tr><td> Submission Type : " + mydata[1] + "</td></tr>";
                                            mystring += "<tr><td> Revision No : " + mydata[2] + "</td></tr>";
                                            mystring += "<tr><td> Revision Date : " + mydata[3] + "</td></tr>";
                                            mystring += "<tr><td> Section: " + mydata[4] + "</td></tr>";
                                            mystring += "<tr><td> Trade : " + mydata[5] + "</td></tr>";
                                            mystring += "<tr><td> Description: " + mydata[6] + "</td></tr>";
                                            mystring += "<tr><td> Approval Status : " + mydata[7] + "</td></tr>";
                                            mystring += "<tr><td> Submission Date : " + mydata[8] + "</td></tr>";
                                            mystring += "<tr><td> Approval Date: " + mydata[9] + "</td></tr>";
                                            mystring += "<tr><td> Chainage : " + mydata[12] + "</td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                        
                                        }
                                        chainageString = "MS at : "+ chainageString;
                                    break;
                                    case "MS":
                                        for(var i=0; i <data.length; i++){
                                            let mydata = data[i].split("::");
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td> Ref No : " + mydata[0] + "</td></tr>";
                                            mystring += "<tr><td> Revision No : " + mydata[1] + "</td></tr>";
                                            mystring += "<tr><td> Submission Date : " + mydata[2] + "</td></tr>";
                                            mystring += "<tr><td> Section: " + mydata[3] + "</td></tr>";
                                            mystring += "<tr><td> Submission Type: " + mydata[4] + "</td></tr>";
                                            mystring += "<tr><td> Trade : " + mydata[5] + "</td></tr>";
                                            mystring += "<tr><td> Approval Status : " + mydata[6] + "</td></tr>";
                                            mystring += "<tr><td> Approval Date: " + mydata[7] + "</td></tr>";
                                            mystring += "<tr><td> Approval By: " + mydata[8] + "</td></tr>";
                                            mystring += "<tr><td> Chainage : " + mydata[11] + "</td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                        }
                                        chainageString = "MT at : "+ chainageString;
                                    break;
                                    case "WIR":
                                        for(var i=0; i <data.length; i++){
                                            let mydata = data[i].split("::");
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td> Section : " + mydata[1] + "</td></tr>";
                                            mystring += "<tr><td> Year: " + mydata[2] + "</td></tr>";
                                            mystring += "<tr><td> Month : " + mydata[3] + "</td></tr>";
                                            mystring += "<tr><td> Total Submitted : " + mydata[4] + "</td></tr>";
                                            mystring += "<tr><td> Total Approved : " + mydata[5] + "</td></tr>";
                                            mystring += "<tr><td> Total Unapproved : " + mydata[6] + "</td></tr>";
                                            mystring += "<tr><td> Total Cancelled : " + mydata[7] + "</td></tr>";
                                            mystring += "<tr><td> Total Pending : " + mydata[8] + "</td></tr>";
                                            mystring += "<tr><td> Total Closed: " + mydata[9] + "</td></tr>";
                                            mystring += "<tr><td> Chainage : " + mydata[11] + "</td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                        }
                                        chainageString = "WIR at : "+ chainageString;
                                    break;
                                    case "RFI":
                                        for(var i=0; i <data.length; i++){
                                            let mydata = data[i].split("::");
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td> Section : " + mydata[1] + "</td></tr>";
                                            mystring += "<tr><td> Year: " + mydata[2] + "</td></tr>";
                                            mystring += "<tr><td> Month : " + mydata[3] + "</td></tr>";
                                            mystring += "<tr><td> Total Submitted : " + mydata[4] + "</td></tr>";
                                            mystring += "<tr><td> Total Open : " + mydata[5] + "</td></tr>";
                                            mystring += "<tr><td> Total Closed : " + mydata[6] + "</td></tr>";
                                            mystring += "<tr><td> Chainage : " + mydata[8] + "</td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                            mystring += "<tr><td>  </td></tr>";
                                            
                                        }
                                        chainageString = "RFI at : "+ chainageString;
                                    break;
                                }
                                
                                desc += mystring;
                                desc += "</tbody></table></div>";
                                drawnEntity.description = desc;
                                drawnEntity.name = chainageString;
                                jogetConOpEntities[processName].push(drawnEntity);
                            }
                        }else{
                            let coordsArray = item.coordinates;
                            if (coordsArray !== "") {
                                coordsArray = coordsArray.split(",");
                                let refID =  item.ref_no ;
                                let drawnEntity;
                
                                if(processName == "SD"){
                                    processName = "SI";
                                }
                                else if (processName == "SDL"){
                                    processName = "SD";
                                }
                
                                if (coordsArray.length == 2) {
                                //point
                                drawnEntity = viewer.entities.add({
                                    name: processName + "-" + refID,
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
                                Object.keys(item).forEach((key) => {
                                    if (
                                        key == "ref_no" 
                                    ) {
                                    } else if (key == "coordinates") {
                                        //skip
                                    } else if (key == "processId") {
                                        //skip
                                    } else if (key == "processName") {
                                        //skip
                                    } else if (key == "message") {
                                        //skip
                                    } else {
                                        desc += "<tr><td>" + key + ": " + item[key] + "</td></tr>";
                                    }
                                });
                                desc += "</tbody></table></div>";
                                drawnEntity.description = desc;
                                if(processName == "SI"){
                                    processName = "SD";
                                }
                                else if (processName == "SD"){
                                    processName = "SDL";
                                }
                                jogetConOpEntities[processName].push(drawnEntity);
                            }
                        }
                    });
                },
            });
        }
        else{
            //load relevant data from api
            $.ajax({
                type: "POST",
                url: "../BackEnd/joget.php",
                dataType: "json",
                data: {
                    functionName: "getJogetProcessRecords",
                    processName: processName,
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
                    obj.data.forEach(function (item) {
                        if (processName == "SP") {
                            if (item["longitude"] != "" || item["latitude"] != "") {
                                let long = parseFloat(item["longitude"]);
                                let lat = parseFloat( item["latitude"]);
                                let chainage = item["chainage"].split(" ");
                                let chainageString = "CH "+ (parseInt(chainage[1])- 49)+ " - " + (parseInt(chainage[1]) + 50);
                                //point
                                drawnEntity = viewer.entities.add({
                                    name: "Site Photo at " + chainageString,
                                    position: Cesium.Cartesian3.fromDegrees(
                                        long,
                                        lat,
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

                                let desc = '<div class="projectDesc">';
                                desc += "<table ><tbody >";
                                desc += "<tr><td> Longitude : " + long;
                                desc += "<tr><td> Latitude : " + lat;

                                let data = item.info.split(",");
                            
                                let mystring = "";
                                for (var i=0; i <data.length; i++) {
                                    let mydata = data[i].split("::");
                                    mystring += "<tr><td> Ref No : " + mydata[0] + "</td></tr>";
                                    mystring += "<tr><td> Title : " + mydata[1] + "</td></tr>";
                                    mystring += "<tr><td> Chainage : " + mydata[4] + "</td></tr>";

                                    let string = $jogetHost+ "jw/web/client/app/document_mgmt/latest/form/download/sitePhoto/"+mydata[3] +"/"+ encodeURI(mydata[2]) + ".";
                                    mystring += "<tr><td> Photo : <a target= _blank  href="+string+">"+ mydata[2] +"</a></td></tr>";
                                    mystring += "<tr><td> </td></tr>";
                                }
                                desc += mystring;
                                desc += "</tbody></table></div>";
                                drawnEntity.description = desc;
                                jogetConOpEntities[processName].push(drawnEntity);
                            }
                        } else {
                            let coordsArray = item.coordinates;
                            if (coordsArray !== "") {
                                coordsArray = coordsArray.split(",");
                                let refID =
                                    item.c_ref_no ||
                                    item.ref_no ||
                                    item.ReferenceID ||
                                    item.RefNo ||
                                    item.ReferenceNo ||
                                    item.NCR ||
                                    item.WIRRefNo;
                                let drawnEntity;
                                if (coordsArray.length == 2) {
                                    //point
                                    drawnEntity = viewer.entities.add({
                                        name: processName + "-" + refID,
                                        position: Cesium.Cartesian3.fromDegrees(coordsArray[0], coordsArray[1], 0),
                                        billboard: {
                                            image: colourProcess,
                                            eyeOffset: Cesium.Cartesian3(0.0, 0.0, -10.0),
                                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                                            width: 30,
                                            height: 30,
                                        },
                                    });
                                } else if (coordsArray.length >= 6) {
                                    //polygon
                                    let hierarchyArray = Cesium.Cartesian3.fromDegreesArray(coordsArray);
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
                                Object.keys(item).forEach((key) => {
                                    if (key == "ReferenceID" || key == "RefNo" || key == "ReferenceNo" || key == "NCR" || key == "WIRRefNo") {
                                    
                                    } else if (key == "coordinates") {
                                        //skip
                                    } else if (key == "processId") {
                                        //skip
                                    } else if (key == "processName") {
                                        //skip
                                    } else if (key == "message") {
                                        //skip
                                    } else {
                                        desc += "<tr><td>" + key + ": " + item[key] + "</td></tr>";
                                    }
                                });
                                desc += "</tbody></table></div>";
                                drawnEntity.description = desc;
                                jogetConOpEntities[processName].push(drawnEntity);
                            }
                        }
                    });
                },
            });
        }
        
	} else {
        jogetConOpEntities[processName].forEach(function (entity) {
            viewer.entities.remove(entity);
	  });

      jogetConOpEntities[processName] = [];
	}
}

function aicPackageChanged(e) {
    let id = $(e).attr('id');
    var packageDropdown = document.getElementById(id);
    for (var i = 0; i < packageDropdown.options.length; i++) {
        packageDropdown.options[i].defaultSelected = i == packageDropdown.selectedIndex;
    }
    aicPackageID = packageDropdown.value;
    isPackageChanged = true

    loadECW(aicPackageID, isPackageChanged);
}

function assetListOnchange(ele){
    var link = '';
    
	let assetChoosen = $(ele).val();
    let title = $(".modal-header a").text();

    var processType = $('#firstprocessTypeAsset').data('asset');
    var assetType = $('#assetType:checked').val();

    if(assetChoosen == 'default'){
        defaultStateWizard(title)

    }else{

        if(processType == 'Inspection'){

            if(assetType == 'Bridge'){

                switch (assetChoosen) {
                    case 'Abutment':
                        link = 'asset_insp_abutment';
                        break;
                    case 'Beam':
                        link = 'asset_insp_beamgirder';
                        break;
                    case 'Bearing':
                        link = 'asset_insp_bearing';
                        break;
                    case 'Deck':
                        link = 'asset_insp_deckslab';
                        break;
                    case 'Drainpipes':
                        link = 'asset_insp_drainpipes';
                        break;
                    case 'Joint':
                        link = 'asset_insp_expansionjoint';
                        break;
                    case 'Parapet':
                        link = 'asset_insp_parapet';
                        break;
                    case 'Pier':
                        link = 'asset_insp_pier';
                        break;
                    case 'River':
                        link = 'asset_insp_slopeprotectionriverbank';
                        break;
                    case 'Surfacing':
                        link = 'asset_insp_surfacing';
                        break;
                    case 'Hydraulic':
                        link = 'asset_insp_hydrauliccapacity';
                        break;
                }

            }else if(assetType == 'Road Furniture'){

                switch (assetChoosen) {
                    case 'AntiClimb':
                        link = 'asset_insp_anticlimbfence';
                        break;
                    case 'CrashCushion':
                        link = 'asset_insp_crashcushion';
                        break;
                    case 'CulvertMarker':
                        link = 'asset_insp_culvertmarker';
                        break;
                    case 'SidePost':
                        link = 'asset_insp_flexisidepost';
                        break;
                    case 'Guardrail':
                        link = 'asset_insp_guardrail';
                        break;
                    case 'Hectometer':
                        link = 'asset_insp_hectometermarker';
                        break;
                    case 'Kilometer':
                        link = 'asset_insp_kilometermarker';
                        break;
                    case 'WayFence':
                        link = 'asset_insp_rightfence';
                        break;
                    case 'RiverMarker':
                        link = 'asset_insp_rivermarker';
                        break;
                    case 'RoadMarking':
                        link = 'asset_insp_roadmarking';
                        break;
                    case 'RoadStud':
                        link = 'asset_insp_roadstud';
                        break;
                    case 'Signboard':
                        link = 'asset_insp_signboard';
                        break;
                    case 'SteelBarricades':
                        link = 'asset_insp_steelbarricades';
                        break;
                    case 'WireRope':
                        link = 'asset_insp_wirerope';
                        break;
                }
            }
        }
    
        $('.nextPage').css('display', 'unset')
        openAssetDatalist(link);

    }

}

function openJogetAssetInspection(){
    var link = '';
    var processType = $('#firstprocessTypeAsset').data('asset');
    var assetType = $('#assetType:checked').val();


    if(processType == 'Inspection'){

        if(assetType == 'Culvert'){
            link = 'asset_insp_culvert';
        }else if(assetType == 'Drainage'){
            link = 'asset_insp_drainage';
        }else if(assetType == 'Pavement'){
            link = 'asset_insp_pavement';
        }else if(assetType == 'Slope'){
            link = 'asset_insp_slope';
        }

    }else if(processType == 'Assessment'){

            if(assetType == 'Bridge'){
                link = 'asset_assess_bridge';
            }else if(assetType == 'Culvert'){
                link = 'asset_assess_culvert';
            }else if(assetType == 'Drainage'){
                link = 'asset_assess_drainage';
            }else if(assetType == 'Road Furniture'){
                link = 'asset_assess_roadfurniture';
            }else if(assetType == 'Pavement'){
                link = 'asset_assess_pavement';
            }else if(assetType == 'Slope'){
                link = 'asset_insp_slope';
            }
    }
    openAssetDatalist(link);
}


/// function for clicking the checkbox button in the edit entitty form in index page///
$("#changePWPath").on("change", function () {
    if (!$("#changePWPath").is(':checked')) {
        $(".editentityForm#editentityForm .doublefield.appearoncheck").css('display', 'none')
        $(".editentityForm#editentityForm #folderRoot.appearoncheck").css('display', 'none')
        //  $(".modal-container#editentity #refreshpwfolder.appearoncheck").css('display','none')
    } else {
        //  $(".modal-container#editentity .doublefield.appearoncheck").css('display','flex')
        $(".editentityForm#editentityForm #folderRoot.appearoncheck").css('display', 'block')
        // $(".modal-container#editentity #refreshpwfolder.appearoncheck").css('display','block')
        getProjectWiseFolders();
    }
});

$("#changeSPPath").on("change", function () {
    if (!$("#changeSPPath").is(':checked')) {
        $(".editentityForm#editentityForm .doublefield.appearoncheck").css('display', 'none')
        $(".editentityForm#editentityForm #folderRootSP.appearoncheck").css('display', 'none')
    } else {
        $(".editentityForm#editentityForm #folderRootSP.appearoncheck").css('display', 'block')
        getSharePointFolders();
    }
});

// onchange function for 360 image set initial heading
imgInitialSource = "choosePinDetails";
$("#imgSourceRadio input").change(function () {
    if ($(this).attr("id") == 'fromImage') {
        imgInitialSource = "chooseImage";
        if ($("#initImage").attr("src")) {
            $(".initImageDiv").show();
        } else {
            $(".initImageDiv").hide();
        }
    } else if ($(this).attr("id") == 'fromPinDetails') {
        $(".initImageDiv").hide();
        imgInitialSource = "choosePinDetails";
    }
});
ChangeImage();

function ChangeImage(){
    let reader = new FileReader();
    reader.onload = function (e) {  
        $("#initImage").attr('src', e.target.result);
        $("#initImage").css('width', "100%");
        $("#initImage").css('height', "auto");
        $("#northReset").css("display", "none")
        $(".instructionBox").html("Select center point (North) of image")

        $("#initImage").unbind('click').bind("click", function(event) {
            clickX = event.offsetX; //longitude
            var width = this.offsetWidth;
 
            if(!$("#initImage").hasClass("active")){
                var element = $("#initImage")
                clickX = event.offsetX;
                var width = this.offsetWidth;
                if(clickX < (width/2)){
                    xx = 180+((clickX/width)*360);
                }else{
                    xx = (clickX-(width/2))*(360/width);
                }
                $("#initImage").addClass("active")
                $("#northReset").css("display", "block")
                $(".instructionBox").html("Click <kbd>Reset</kbd> to reset the North position.")
            }else{
            }

            getImageSize($('#initImage'), function(width, natWidth) {
                var aspectRatio = clickX / width;
                aspectRatioVerticalLine = aspectRatio * 100

                $(".verticalLine").css("left", aspectRatioVerticalLine + "%");
            });
        });

        $("#initImage").mousemove(function(event){
            if(!$("#initImage").hasClass("active")){
                clickX = event.offsetX;
                var linePos = clickX - 8;
                $(".verticalLine").css("left", linePos)
            }else{
            }
        })

        $("#northReset").on("click", function(){
            $("#initImage").removeClass("active")
            $(".verticalLine").css("left", "13px")
            $("#northReset").css("display", "none")
            $(".instructionBox").html("Select center point (North) of image")
        })
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#imageFileName").change(function(){
        readURL(this);
        if (imgInitialSource == "chooseImage") {
            $(".initImageDiv").show();
        } else {
            $(".initImageDiv").hide();
        }
    });
}

function OnChangeInputPinpointValues() {
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
}

function onChangeShowMetadata(ele){
    if($('#showMetadata').prop('checked') == true){
        $('.metaDataEdit').css("display","block")
    }else{
        $('.metaDataEdit').css("display","none")
    }
}