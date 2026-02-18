function openJogetForm(frameId, idActivity, appJoget, processSet, extraParam, projOwner = ''){
	if (!JOGETLINK) return
	var link = "";
	var urlInbox;
	var loading = $('.loader');
    loading.fadeIn();

	switch (appJoget) {
		case "financeInbox":
		switch (processSet) {
			case "Contract":
				urlInbox = JOGETLINK.finance_open_ContractActivityForm + idActivity + "&_mode=assignment";
				break
			case "Claim":
				urlInbox = JOGETLINK.finance_open_ClaimActivityForm + idActivity + "&_mode=assignment";
				break;
			case "VO":
				if(extraParam.includes("SSLR Downstream")){
					urlInbox = JOGETLINK.finance_open_VOActivityForm_SSLR2 + idActivity + "&_mode=assignment";
				}else{
					urlInbox = JOGETLINK.finance_open_VOActivityForm + idActivity + "&_mode=assignment";
				}
				break;
			case "EOT":
				if(extraParam.includes("SSLR Downstream")){
					urlInbox = JOGETLINK.finance_open_EOTActivityForm_SSLR2 + idActivity + "&_mode=assignment";
				}
				break;
			case "Contract_Amend":
				urlInbox = JOGETLINK.finance_list_ContractAmendForm + idActivity + "&_mode=assignment";
			break;
			case "ClaimReject":
			case "ClaimApproved":
				urlInbox = JOGETLINK.finance_list_ClaimApprovedRejected + idActivity + "&_mode=assignment";
			break;
			case "ContractReject":
			case "ContractApproved":
				urlInbox = JOGETLINK.finance_list_ContractApprovedRejected + idActivity + "&_mode=assignment";
			break;
			case "VOReject":
			case "VOApproved":
				urlInbox = JOGETLINK.finance_list_VOApprovedRejected + idActivity + "&_mode=assignment";
			break;
		}
		break;
		case "constructInbox":
			if(processSet == "emailView"){
				link = "email_view_sslr_"+extraParam;
				urlInbox = JOGETLINK[link] + idActivity;
			}else if(processSet == "emailView1A"){
				link = "email_view_sbh_"+extraParam;
				urlInbox = JOGETLINK[link] + idActivity;
			}else if(processSet == "emailView1B"){
				link = "email_view_sbh_1b_"+extraParam;
				urlInbox = JOGETLINK[link] + idActivity;
			}else if(processSet == "rfiEdit"){
				link = "cons_issue_verify_rfi";
				urlInbox = JOGETLINK[link] + idActivity;
			}else{
				urlInbox = JOGETLINK.cons_open_inboxv3 + "_mode=assignment&activityId=" + idActivity;
			}
		break;
		case "documentInbox":
			switch (processSet) {
				case "Acknowledge":
				case "acknowledge":
					if(SYSTEM == 'KKR' && !IS_DOWNSTREAM){
						urlInbox = (projOwner == "SSLR2") ? JOGETLINK.doc_open_corr_acknowldge_sslr +  idActivity + extraParam : JOGETLINK.doc_open_corr_acknowldge +  idActivity + extraParam;
					}else if(IS_DOWNSTREAM){
						urlInbox = JOGETLINK.doc_open_corr_acknowldge_sslr +  idActivity + extraParam ;
					}else{
						urlInbox = JOGETLINK.doc_open_corr_acknowldge +  idActivity + extraParam;
					}
					break;
				case "Respond/View":
					if(SYSTEM == 'KKR' && !IS_DOWNSTREAM){
						urlInbox = (projOwner == "SSLR2") ? JOGETLINK.doc_open_corr_respond_sslr +  idActivity + extraParam : JOGETLINK.doc_open_corr_respond +  idActivity + extraParam;
					}else if(IS_DOWNSTREAM){
						urlInbox = JOGETLINK.doc_open_corr_respond_sslr +  idActivity + extraParam ;
					}else{
						urlInbox = JOGETLINK.doc_open_corr_respond +  idActivity + extraParam;
					}
					break;
				case "markup":
					urlInbox = JOGETLINK.cons_open_inboxv3_markup + "_mode=assignment&activityId=" + idActivity;
					break;
				case "markupView":
					urlInbox = JOGETLINK.doc_markup_sabah_view + idActivity;
					break;
			}
		break;
		case "assetInbox":
			urlInbox = JOGETLINK.asset_json_open_inbox + "_mode=assignment&activityId=" + idActivity;
		break;
		case "FinanceAssetInbox":
			switch (processSet) {
				case "Contract":
					urlInbox = JOGETLINK.finance_list_ContractActivityFormAsset +  idActivity + "&_mode=assignment";
					break;
				case "Claim":
					urlInbox = JOGETLINK.finance_list_ClaimActivityFormAsset +  idActivity + "&_mode=assignment";
					break;
				case "Routine Claim": 
					urlInbox = JOGETLINK.finance_list_ClaimActivityFormRoutineAsset + idActivity + "&_mode=assignment";
					break;
				case "HQ Routine Claim":
					urlInbox = JOGETLINK.finance_list_ClaimActivityFormHqAsset + idActivity + "&_mode=assignment";
					break;
				case "HQ Periodic/Emergency Claim":
					urlInbox = JOGETLINK.finance_list_ClaimActivityFormPerHqAsset + idActivity + "&_mode=assignment";
					break;
			}
		break;
	}
	let url = urlInbox;
	iframe = $("iframe#"+frameId);

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

function openBumiList(){
	if (!JOGETLINK) return

	var url = (localStorage.project_owner == "SSLR2") ? JOGETLINK['cons_datalist_BP_SSLR2'] : JOGETLINK['cons_datalist_BP'];

	var inPackageUuid = localStorage.inPackageUuid ? localStorage.inPackageUuid : ''

	if(inPackageUuid != ''){
		url += '&inPackageUuid='+inPackageUuid
	}

	iframe = $("iframe.bumiDatalist");

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});

	zoomToGetData();
}

function getLinkJoget(formID,frameId){
	if (!JOGETLINK) return;
	var url;
	let title = "";
	var idBulkExp = formID;
	var process_1b = ["SA", "SMH", "PBC", "DCR", "RS", "SDL", "RFI"];
	var checkVisibility = $(".modal-header").parent().parent(':visible');
	if(checkVisibility.length > 0){
		title = $(".modal-header a").text()
	}
	else{
		title = "";
	}

	if(localStorage.project_phase == '1B'){
		if(process_1b.includes(formID)){
			formID = formID+"_1B";
		}else{
			formID = formID;
		}
	}

	if(SYSTEM == 'OBYU'){
		if(formID == "LAND"){formID = "LM"}
		if(frameId != ""){
			if (JOGETLINK.dataList[formID]) {
				url  = JOGETLINK.dataList[formID];
			}else if (JOGETLINK.form[formID]){
				url  = JOGETLINK.form[formID];
				
				if(formID == "document_project_info_edit"){
					url = url + recordId;
				}
			}
		}else{
			if(title == "New Construction Process" || title == "Process Project"){
				if(localStorage.project_owner == "SSLR2" && JOGETLINK['cons_issue_'+jogetProcessApp+"_SSLR2"]){
					url  = JOGETLINK['cons_issue_'+jogetProcessApp+"_SSLR2"];
				} else if (JOGETLINK.form['construct_issue_'+formID]) {
					url  = JOGETLINK.form['construct_issue_'+formID];
				}
			}else if(title == "Manage Construction Process" || title == "Manage Project"){
				if (JOGETLINK.form['construct_manage_'+formID]) {
					url  = JOGETLINK.form['construct_manage_'+formID];
				}
			}else if(title == "Setup"){
				if (JOGETLINK.form[formID]) {
					url  = JOGETLINK.form[formID];
				}
			}else if(title == "Bulk Register Process" || title == "Bulk Register"){
				if (JOGETLINK.dataList['construct_list_'+formID]) {
					url  = JOGETLINK.dataList['construct_list_'+formID];
				}
			}
			else{
				if (JOGETLINK.dataList[formID]) {
					url  = JOGETLINK.dataList[formID];
				}
			}
		}
	}else{
		if(frameId != ""){
			if (JOGETLINK[formID]) {
				url  = JOGETLINK[formID];
			}
		}else{
			if(title == "New Construction Process" || title == "Process Project"){
				if(localStorage.project_owner == "SSLR2" && JOGETLINK['cons_issue_'+formID+'_SSLR2']){ 
					url  = JOGETLINK['cons_issue_'+formID+'_SSLR2'];
				}else if (JOGETLINK['cons_issue_'+formID]) {
					url  = JOGETLINK['cons_issue_'+formID];
				}
			}else if(title == "Manage Construction Process" || title == "Manage Project"){
				if(localStorage.project_owner == "SSLR2" && JOGETLINK['cons_manage_'+formID+'_SSLR2']){ 
					url  = JOGETLINK['cons_manage_'+formID+'_SSLR2'];
				}else if (JOGETLINK['cons_manage_'+formID]) {
					url  = JOGETLINK['cons_manage_'+formID];
				}
			}else if(title == "Bulk Register Process" || title == "Bulk Register"){
				if(localStorage.project_owner == "SSLR2" && JOGETLINK['cons_datalist_'+idBulkExp+'_SSLR2']){
					if (JOGETLINK['cons_datalist_'+idBulkExp+'_SSLR2']) {
						url  = JOGETLINK['cons_datalist_'+idBulkExp+'_SSLR2'];
					}
				}else{
					if (JOGETLINK['cons_datalist_'+idBulkExp]) {
						url  = JOGETLINK['cons_datalist_'+idBulkExp];
					}
				}
			}else if(title == "New Asset Process" || title == "Asset Project"){
				if (JOGETLINK[formID]) {
					url  = JOGETLINK[formID];
				}
			}else{
				if (JOGETLINK[formID]) {
					url  = JOGETLINK[formID];
				}
			}
		}
	}

	return url;
}

function InitiateCoordless() {
	var url;
	url = getLinkJoget(jogetProcessApp,"")

	var loading = $('.loader');
    loading.fadeIn();
	
	if (flagProcessOutside){
		iframe = $("iframe#jogetPageOustide");
	}
	else{
		iframe = $("iframe#jogetPage");
	}

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});

}

function InitiateCoordinate() {
	var url;
	var root;
	var params = '';
	var coordinateString = jogetConOpDraw.coordsArray.toString();
	if (jogetProcessApp == "LR" || jogetProcessApp == "LI" || jogetProcessApp == "LE"){
		if (shpLotId) {
			var shplotString = shpLotId;
		}
		else {
			var shplotString = "";
		}

		var lotIdString = lot;
		var chainageString = chainage;
		var structString = struct;

		if(jogetProcessApp == "LI"){
			params = "&lotId=" + lotIdString + "&chainage=" + chainageString + "&structure=" + structString + "&kmlFileName=" + 
					fileLandName + "&shpLotId=" + shplotString
		}
		else{
			params = "&lotId=" + lotIdString + "&kmlFileName=" + 
					fileLandName + "&shpLotId=" + shplotString;
		}
	}
	else if(jogetProcessApp == "BP"){
		params = "&package_uuid=" + bumiPackageUuid + "&wpc=" + bumiPackageWpcId
		+ "&kmlFileName=" + jogetConOpDraw.fileName + "&entityId=" + jogetConOpDraw.WPCId 
		+ "&packageId=" + bumiPackageId		
	}	

	if(flagLinkLand){
		root  = JOGETLINK['cons_linkLot_'+jogetProcessApp];
	}else{
		root  = getLinkJoget(jogetProcessApp,"");
	}

	if (root) {
		url  = root + "&coordinates="+coordinateString + params;
	}else{
		return;
	}

	var loading = $('.loader');
    loading.fadeIn();

	if (flagProcessOutside){
		iframe = $("iframe#jogetPageOustide");
	}
	else{
		iframe = $("iframe#jogetPage");
	}

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});

}

function openSetupDatalist(setup){
	var url;
	url = getLinkJoget(setup,"")

	var loading = $('.loader');
    loading.fadeIn();

	iframe = $("iframe#setupIframe");
	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

function openManageDatalist(manage){
	var url;
	url = getLinkJoget(manage,"")

	$('.projectProcess .bottomContainer').css("display", "block");

	var loading = $('.loader');
    loading.fadeIn();

	iframe = $("iframe#manageIframe");
	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

function openAssetForm(id){

	var url;
	var formID;
	var owner = localStorage.project_owner ? localStorage.project_owner : '';

	if(id == 'RFI'){
		if(owner == 'JKR_SARAWAK'){
			formID = 'asset_maintain_rfi'
		}else if(owner == 'JKR_SABAH'){
			formID = 'asset_maintain_rfi_sabah'
		}
	}else if(id == 'NCP'){
		if(owner == 'JKR_SARAWAK'){
			formID = 'asset_maintain_ncp'
		}else if(owner == 'JKR_SABAH'){
			formID = 'asset_maintain_ncp_sabah'
		}
	}else if(id == 'RI'){
		if(owner == 'JKR_SARAWAK'){
			formID = 'asset_maintain_schedule_inspection'
		}else if(owner == 'JKR_SABAH'){
			formID = 'asset_maintain_schedule_inspection_sabah'
		}
	}else if(id == 'WP'){
		if(owner == 'JKR_SARAWAK'){
			formID = 'asset_submit_maint_work_program'
		}else{
			formID = 'asset_submit_maint_work_program_sabah'
		}
	}else if(id == 'DR'){
		formID = 'asset_create_defect_detection'
	}else if(id == 'NOD'){
		formID = 'asset_create_NODefect'
	}else if(id == 'IVR'){
		formID = 'asset_maintain_site_routine'
	}else if(id == 'WO'){
		if(owner == 'JKR_SARAWAK'){
			formID = 'asset_submit_work_order'
		}else if(owner == 'JKR_SABAH'){
			formID = 'asset_submit_work_order_sabah'
		}
	}else if(id == 'NOE'){
		if(owner == 'JKR_SARAWAK'){
			formID = 'asset_submit_maint_noe'
		}else if(owner == 'JKR_SABAH'){
			formID = 'asset_submit_maint_noe_sabah'
		}
	}else if(id == 'WDR'){
		formID = 'asset_submit_maint_work_daily_report'
	}else if(id == 'BRG'){
		formID = 'asset_insp_bridge'
	}else if(id == 'CVT'){
		formID = 'asset_insp_culvert'
	}else if(id == 'DRG'){
		formID = 'asset_insp_drainage'
	}else if(id == 'PAVE'){
		formID = 'asset_insp_pavement'
	}else if(id == 'RF'){
		formID = 'asset_insp_roadfurniture'
	}else if(id == 'SLP'){
		formID = 'asset_insp_slope'
	}else if(id == 'WB'){
		formID = 'asset_submit_work_budget_approval'
	}else if(id == 'DR'){
		formID = 'asset_create_defect_detection'
	}else if(id == 'GAR'){
		formID = 'asset_submit_maint_gar'
	}
	
	url = getLinkJoget(formID,"")

	$('.process .bottomContainer').css("display", "block");

	var loading = $('.loader');
    loading.fadeIn();

	iframe = $("iframe#assetPage");
	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

function bulkExportList(id){
	var url;
	var title = $(".modal-header a").text()
	url = getLinkJoget(id,"")

	// $('.projectProcessContainer .bulkImportContainer').css("display", "block");

	var loading = $('.loader');
    loading.fadeIn();

	if(title == "Bulk Register"){
        iframe = $("iframe#exportContentIframebulkProj");
    }else if(title == "Bulk Register Process"){
        iframe = $("iframe#exportContentIframebulk");
    }

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

function bulkExportAssetList(id, modal) {
    if (!JOGETLINK) return
    var processType;

    if(id == 'rfi'){
        processType = 'RequestForInspection';
    }else if(id == 'ncp'){
        processType = 'NonConformanceProduct';
    }else{
        processType = id;
    }

    if(JOGETLINK['asset_'+processType]){
        var url = JOGETLINK['asset_'+processType];
    }

	if(modal == "bulkProjAsset"){
        iframe = $("iframe#exportContentIframebulkAssetProj");
    }else if(modal == "bulkAsset"){
        iframe = $("iframe#exportContentIframebulkAsset");
    }

    iframe.attr("src", url).css("height", "100%").css("width", "100%");
}   

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitJogetLogin(callback) {
    let attempts = 0;
    const maxRetries = 5;
    let isLoggedIn = false;

    try {
        while (!isLoggedIn && attempts < maxRetries) {
            console.log(`Attempt ${attempts + 1} of ${maxRetries}...`);
            isLoggedIn = await checkingJogetLogin_promise();
            attempts++;

            if (!isLoggedIn && attempts < maxRetries) {
                console.warn("Login failed, retrying in 0.5s...");
                await sleep(500); // wait 0.5 second before next retry
            }
        }

        if (isLoggedIn) {
            await callback(); // only call if login successful
        } else {
            console.warn("Joget login failed after 5 attempts. Aborting.");
        }
    } catch (err) {
        console.error("Unexpected error during login:", err);
    }
}


function openFromEmail(activityId, appProcess = 'constructInbox', setProcess = '', extraParam = '', project_owner = '') {
	waitJogetLogin(async () => {

		if (!JOGETLINK) return
		let idProcess = activityId;

		let modalContainer = $(`.modal-container.myTask`)
		let openPage1 = modalContainer.find("[data-page=1]")

		$(".modal-header a").html('My Task')
		openPage1.addClass("active")
		openJogetForm('myTask', idProcess, appProcess, setProcess, extraParam, project_owner)
		openWizardModalContainer('myTask', undefined, 55, 80)
	});
}

function openCloseFormV3(idForm, ele) {
	if (!JOGETLINK) return
	var url = '';
	var processType = '';

	let modalContainer = $(`.modal-container.myTask`)
    let openPage1 = modalContainer.find("[data-page=1]")

	if (ele == 'MA'){
		processType = 'MS'
	}
	else if(ele == 'MS'){
		processType = "MOS";
	}
	else{
		processType = ele;
	}

	if(jogetAppProcesses["app_"+processType] === 1 && JOGETLINK['cons_form_'+processType]){
		url = JOGETLINK['cons_form_'+processType] + idForm;
	}
	else{
		return;
	}

	$(".modal-header").html('My Task')
	openPage1.addClass("active")

	iframe = $("iframe#myTask");

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		loading.fadeOut();
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});

	openWizardModalContainer('myTask', undefined, 55, 80)
}

function openAssetDatalist(asset){
	var url;
	if (JOGETLINK[asset]) {
		url  = JOGETLINK[asset];
	}
	else{
		return;
	}

	iframe = $("iframe#assetPage");

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

function openPavementDatalist(pavement){
	var url;
	if (JOGETLINK[pavement]) {
		url  = JOGETLINK[pavement];
	}
	else{
		return;
	}

	iframe = $("iframe#analysisIframe");

	iframe.hide();
	iframe.attr("src", "");
	iframe.attr("src", url);
	iframe.on("load", function () {
		iframe.show();
		$(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

$(document).ready(function(){

})
