var $jogetHost = JOGETHOST+'/jw';
var v3_flag = true;
var projectDetailsFlag = false; //for PFS Project Information
var cesiumObj;
var cesiumObjProcess;
var sectionForProject = [];
var yearForProject = [];
var flagChangeDashboard = false;
var flagChangeJoget = false;
var aicRoutineType = "";
var layerDetail;
var planePrimitive;
var earthPhotosphere;
var flagFav = false;
var favProj = [];
var theme_mode;
var xx = "";
var projectInfoDocFlag = false; //for Doc Project Information OBYU
var recordId = "";
var secondAssetMenuRM = [];
var secondAssetMenuPM = [];
var secondAssetMenuEW = [];
var flagFromReporting = false;
var assetPfsBtnAccess = [];
var themeJoget;
var terrainEnabled = false;

var mapBoxAccessToken = MAPBOX_TOKEN;
var mapTilerAccessToken = MAPTILER_TOKEN;

//vertical position 360 aspect ratio
var aspectRatioVerticalLine;

var obyuOwnerRoles = ["Project Manager", "Finance Officer", "QAQC Engineer", "Director", "Construction Engineer", "Safety Officer", "Planning Engineer", "Doc Controller", "Finance Head", "Risk Engineer", "Corporate Comm Officer"];
var constructOwnerRoles = ["Bumi Officer","Construction Engineer", "Contract Executive", "Corporate Comm Officer","Director","Doc Controller","Finance Head","Finance Officer","Head of Department", "Land Officer","Planning Engineer","Project Director","Project Manager","Project Monitor","QAQC Engineer","Risk Engineer","Safety Officer","Zone Manager"];
var assetOwnerRoles = ["Assistant Director (Road Asset)","Assistant Engineer (Division)","Assistant Engineer (District)","Asset Engineer Section","Civil Engineer (Division)","Civil Engineer (District)","Civil Engineer (Road Asset)","Contract Assistance","Divisional Engineer","District Engineer",
                       "Facility Management Department","Head of Contract","Head of Finance","Head of Section", "KKR", "Quantity Surveyor","Senior Civil Engineer (Division)","Senior Civil Engineer (District)","Senior Civil Engineer (Road Asset)","Senior Quantity Surveyor","Technical Inspector Section"];
var fmOwnerRoles = ["Facilities User", "Facilities Management Team", "Facilities Service Provider", "Mechanical Team", "Senior Civil Engineer (Road Asset)", "Assistant Director (Road Asset)", "Civil Engineer (Road Asset)"];
var adminInsightsRoles = ['Project Monitor', 'Project Manager', "Senior Civil Engineer (Road Asset)", "Assistant Director (Road Asset)", "KKR", "Civil Engineer (Road Asset)"];
var sslr2OwnerRoles = ['Construction Manager', 'Finance Representative', 'HOD (Contract and Finance)', 'HOD (QSHET)', 'HSET Officer', 'Land Management Representative', 'PMO Representative', 'Project Engineer', 'QAQC Manager', 'Representative', 'Site Engineer', 'SMO Representative', 'Technical Engineer', 'Engineering Design Management']

var allOwnerRoles = constructOwnerRoles.concat(assetOwnerRoles)

var paramsArray = document.location.href.split('?');
if (paramsArray.length > 1 && paramsArray[1] !== '') {
    flagFromReporting = true;
}

var fullNameAPJKPJ = "Anggaran/Kelulusan Penyelenggaraan Jalan";

var flagCheckSysAdmin = false;

onClickSelMonth = (e, event) =>{
    let selId = $(e).attr('id')
    let group = $(`.${selId}`)

    if($(`#${selId}Option`).val() !== "default"){
        $(e).removeClass("disabled")

        if($(e).hasClass('active')){
            $(e).removeClass('active')
            $(group).slideUp(70, function(){
                $(this).removeClass("active")
                $(this).css({
                    display: "none"
                })
            })
        }else{
            $(e).addClass('active')
            $(group).slideDown(70, function(){
                $(this).addClass("active")
                $(this).css({
                    display: "grid"
                })
            })
        }
    }else{
        $(e).addClass("disabled")
        event.preventDefault()
    }
    filterOnChange(e)
}

$("#videoSourceRadio input").change(function () {
    if ($(this).attr("id") == 'localVideo') {
        $(".localVideo").show()
        $(".embedVideo").hide()

    } else if ($(this).attr("id") == 'EmbedLink') {
        $(".localVideo").hide()
        $(".embedVideo").show()
    }
});

//change src of iframe based on apps
function updateFrameSrc(data){
    letPageSrc = "";
    var financeTitle = "";
    let iframeFlag = false

    if(data == 'mySysAdmin'){
        letPageSrc = "../systemAdminv3.php";
        iframeFlag = true
        if(cesiumObj){
            destroyCesium(cesiumObj)
        }
    }else{
        if(localStorage.project_owner == "JKR_SABAH"){
            switch (data) {
                case "myDocument":
                    letPageSrc = "../Dashboard/v3/Document_PBHS.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myFinance":
                    if(localStorage.Project_type != 'ASSET'){
                        letPageSrc = "../Dashboard/v3/Procurement_PBHS.php";
                        financeTitle = "VO"
                        iframeFlag = true
                        if(cesiumObj){
                            destroyCesium(cesiumObj)
                        }
                    }else{
                        iframeFlag = false
                    }
                    break;
                case "myInsights":
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    cesiumObj = loadRiCesium();
                    loadAssetHierarchy();
                    break;
                case "myDashboard":
                    if(localStorage.Project_type == 'ASSET'){
                        letPageSrc = "../Dashboard/v3/statistic.php";
                    }else{
                        letPageSrc = "../Dashboard/v3/projectSummary.php";
                    }
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    
                    break;
                case "myAdmin":
                    letPageSrc = "../adminv3.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myTask":
                    letPageSrc = "";
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                default:
                    letPageSrc = "";
                    break;
            }
        }
        else if (localStorage.project_owner == "JKR_SARAWAK"){
            switch (data) {
                case "myDocument":
                    letPageSrc = "../Dashboard/v3/Document.php?noHeader=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myFinance":
                    if(localStorage.Project_type != 'ASSET'){
                        letPageSrc = "../Dashboard/v3/Procurement.php?noHeader=1";
                        financeTitle = "KPK"
                        iframeFlag = true
                        if(cesiumObj){
                            destroyCesium(cesiumObj)
                        }
                    }else{
                        iframeFlag = false
                    }
                    break;
                case "myInsights":
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    cesiumObj = loadRiCesium();
                    loadAssetHierarchy();
                    break;
                case "myDashboard":
                    if(localStorage.Project_type == 'ASSET'){
                        letPageSrc = "../Dashboard/v3/statistic.php";
                    }else{
                        letPageSrc = "../Dashboard/v3/projectSummary.php";
                    }
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myAdmin":
                    letPageSrc = "../adminv3.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                default:
                    letPageSrc = "";
                    break;
            }
        }
        else if (localStorage.project_owner == "KACC"){
            switch (data) {
                case "myDocument":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_KACC/Document.php?noHeader=1&noFilter=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myFinance":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_KACC/cost.php?noHeader=1&noFilter=1";
                    financeTitle = "Variation Order"
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myInsights":
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    cesiumObj = loadRiCesium();
                    break;
                case "myDashboard":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_KACC/summary.php?noHeader=1&noFilter=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myAdmin":
                    letPageSrc = "../adminv3.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                default:
                    letPageSrc = "";
                    break;
            }
        }
        else if (localStorage.project_owner == "MRSB"){
            switch (data) {
                case "myDocument":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_MRSB/Document.php?noHeader=1&noFilter=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myFinance":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_MRSB/cost.php?noHeader=1&noFilter=1";
                    financeTitle = "Variation Order"
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myInsights":
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    cesiumObj = loadRiCesium();
                    break;
                case "myDashboard":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_MRSB/main.php?noHeader=1&noFilter=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myAdmin":
                    letPageSrc = "../adminv3.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                default:
                    letPageSrc = "";
                    break;
            }
        }
        else if (localStorage.project_owner == "UTSB"){
            switch (data) {
                case "myDocument":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_UTSB/Document.php?noHeader=1&noFilter=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myInsights":
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    cesiumObj = loadRiCesium();
                    break;
                case "myDashboard":
                    letPageSrc = "../Dashboard/V3/OBYU/extend/dashboard_UTSB/Document.php?noHeader=1&noFilter=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myAdmin":
                    letPageSrc = "../adminv3.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                default:
                    letPageSrc = "";
                    break;
            }
        }
        else if (localStorage.project_owner == "UEM_EDGENTA"){
            switch (data) {
                case "myInsights":
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    cesiumObj = loadRiCesium();
                    break;
                case "myDashboard":
                    letPageSrc = "../Dashboard/v3/FM/uem_dashboard.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myAdmin":
                    letPageSrc = "../adminv3.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myTask":
                    letPageSrc = "";
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                default:
                    letPageSrc = "";
                    break;
            }
        }
        else if(localStorage.project_owner == "SSLR2"){
            switch (data) {
                case "myDocument":
                    letPageSrc = "../Dashboard/v3/document_SSLR2.php?noHeader=1";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myFinance":
                    letPageSrc = "";
                    if(localStorage.contractLevel == "UPSTREAM"){
                        letPageSrc = "../Dashboard/v3/procurement_SSLR2.php"
                        financeTitle = "APK/PHK"
                    }else if(localStorage.contractLevel == "DOWNSTREAM"){
                        letPageSrc = "../Dashboard/v3/procurement_SSLR2_DS.php"
                        financeTitle = "VO"
                    }
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myInsights":
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    cesiumObj = loadRiCesium();
                    break;
                case "myDashboard":
                    if(localStorage.Project_type == 'ASSET'){
                        letPageSrc = "../Dashboard/v3/statistic.php";
                    }else{
                        if(IS_DOWNSTREAM){
                            letPageSrc = "../Dashboard/v3/projectSummary.php";
                        }else{
                            letPageSrc = "../Dashboard/v3/procurement_SSLR2.php";
                        }
                    }
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                case "myAdmin":
                    letPageSrc = "../adminv3.php";
                    iframeFlag = true
                    if(cesiumObj){
                        destroyCesium(cesiumObj)
                    }
                    break;
                default:
                    letPageSrc = "";
                    break;
            }
        }
    }

    if(iframeFlag){
        if(data == 'myDashboard'){
            var title;
            if(localStorage.project_owner == "UTSB"){
                title = 'Document Management';
            }else{
                (localStorage.Project_type == "ASSET") ? title = 'Asset Statistic' : title = 'Project Summary';
            }

            $('.myDashboard > .contentContainer > .head > h2').html(`${title} - ${localStorage.p_name}`);
        }if(data == 'myFinance'){
            $('.myFinance.vo').find('.tagName').html(financeTitle)
            $('.myFinance.vo').children(".mainButton").attr("title", financeTitle)
            $('.myFinance .filterContainer').show();
        }
        $("iframe#" +data).attr("src", letPageSrc)
    }else{
        if(data == 'myFinance'){
            // load first menu in myFinance menu
            var firstFinance = $('.myFinance.show').not('#assetProcess, #constructionProcess').find('.subButtonContainer > .subButton')[0];
            $('.myFinance .filterContainer').hide();
            firstFinance.click();
        }
    }
}

//for access at right side button
function setAccessRightButton(rightMenu, accessProcess, accessSetup, accessManage, pageOpen, accessbulkApproval){

    if(SYSTEM == 'OBYU'){
        setAccessRightButtonOBYU(rightMenu, accessProcess, accessSetup, accessManage, pageOpen)
    }else{
        if(localStorage.project_owner == "SSLR2"){
            setAccessRightButtonSSLR2(rightMenu, accessProcess, accessSetup, accessManage, accessbulkApproval)
        }else{
            setAccessRightButtonKKR(rightMenu, accessProcess, accessSetup, accessManage, accessbulkApproval)
        }
    }

}

function setAccessRightButtonKKR(rightMenu, accessProcess, accessSetup, accessManage, accessbulkApproval){
    //FOR DOCUMENT
    let rightDocHTML = `<div class="subButton" id = "doc_form_doc_register" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">New Document</span>
                        </div>
                        <div class="subButton" id = "doc_bulk_doc_register" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">New Multiple Document</span>
                        </div>
                        <div class="subButton" id = "doc_list_doc_my" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">My Document</span>
                        </div>
                        <div class="subButton" id = "doc_list_doc_open" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">Document (Open)</span>
                        </div>
                        <div class="subButton" id = "doc_list_doc_arch" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">Document (Archived)</span>
                        </div>`;
    let rightCorrHTML = `<div class="subButton" id = "doc_list_corr_inbox" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">Inbox</span>
                        </div>`;
    let rightSetupHTML = '';

    //FOR FINANCE
    let rightPfsProjDetHTML = '';
    let rightPfsContHTML = '';
    let rightPfsClaimHTML = '';
    let rightPfsVoHTML = '';
    let rightPfsCAHTML = '';
    let rightPfsLUHTML = '';
    let rightPfsBudgetHTML = '';
    let rightPfsPerClaimHTML = '';
    let rightPfsPerInventoryClaimHTML = '';
    let rightPfsEOTHTML = '';
    var textVO = '';
    var flagIc = false
    var flagVo = false
    var flagVo = false

    //FOR PROJECT ADMIN
    let rightAdminProjDetHTML = '';
    let rightAdminUserHTML = '';
    let rightAdminDataHTML = '';
    let rightAdminScheduleHTML = '';
    let rightAdminConfigHTML = '';

    //FOR CONSTRUCT APP
    var arrConstruct = {};
    var arrConstruct = {};
    var flagCheckConstruct = false;
    var flagCheckAsset = false;
    var flagFM = false;
    let rightConopHTML = '';
    let rightTabList = '';
    let rightTabDetactList = '';
    let bulkApprovalTabList = '';
    let rightSetupChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightManageChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightConopChoice = `
                                <option value="default">Please Choose</option>
                            `
    let exportList = `
                        <option value="default">Please Choose</option>
                    `
    
    //FOR ASSET
    var arrAsset = {};
    var arrAsset2 = {};
    var arrAsset3 = {};
    var arrAssetRM = {};
    var arrAssetPM = {};
    var arrAssetEW = {};
    var arrMaintanceList = {};
    var arrMaintanceListFM = {};
    let rightTabInv = '';
    let rightTabMainList = '';
    let rightTabConList = '';
    let rightTabAssList = '';
    let rightTabRoutineList = '';
    let rightTabPeriodicList = '';
    let rightTabEmergencyList = '';
    let rightTabRFIList = '';
    let rightTabNCPList = '';
    let assetExpList = `
                            <option value="default">Please Choose</option>
                        `    
    let arrMaintanceConList = '';
    let arrMaintanceAssList = '';
    let arrMaintanceRoutineList = '';
    let arrMaintancePeriodicList = '';
    let arrMaintanceEmergencyList = '';
    let arrMaintanceRFIList = '';
    let arrMaintanceNCPList = '';
    secondAssetMenuRM = [];
    secondAssetMenuEW = [];
    secondAssetMenuPM = [];
    var defectRegItems = ''
    var routineMainItems = ''
    let rightProcessType = `
                                <option value="default">Please Choose</option>
                            `
    let rightProcessType3 = `
                                <option value="default">Please Choose</option>
                            `
    let rightManageAssetChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightChildAssetBridge = `
                                    <option value="default">Please Choose</option>
                                `
    let rightChildAssetRoadFurniture = `
                                    <option value="default">Please Choose</option>
                                `
    let rightPaveAnalysisUpload = `
                                            <option value="default">Please Choose</option>
                                            <option value="report">Report</option>
                                        `
    
    if(localStorage.project_owner == "JKR_SABAH"){
        if(localStorage.project_phase == '1B'){
            arrConstruct = {
                "app_DCR" : {
                    data : "DCR",
                    title : "DCR",
                    name :"Design Change Request"
                },
                "app_IR" : {
                    data : "IR",
                    title : "INC",
                    name :"Incident"
                },
                "app_LR" : {
                    data : "LR",
                    title : "LA",
                    name :"Land Acquisition"
                },
                "app_LI" : {
                    data : "LI",
                    title : "LI",
                    name :"Land Issue"
                },
                "app_LE" : {
                    data : "LE",
                    title : "LE",
                    name :"Land Encumbrances"
                },
                "app_LS" : {
                    data : "LS",
                    title : "LS",
                    name :"Land Summary"
                },
                "app_MOS" : {
                    data : "MOS",
                    title : "MS",
                    name :"Method Statement"
                },
                "app_MS" : {
                    data : "MS",
                    title : "MA",
                    name :"Material Acceptance"
                },
                "app_NCR" : {
                    data : "NCR",
                    title : "NCR",
                    name :"Non Conformance Report"
                },
                "app_PSU" : {
                    data : "PSU",
                    title : "PSU",
                    name :"Progress Summary Upload"
                },
                "app_PBC" : {
                    data : "PBC",
                    title : "PBC",
                    name :"Public Complaint"
                },
                "app_RS" : {
                    data : "RS",
                    title : "RS",
                    name :"Report Submission"
                },
                "app_RR" : {
                    data : "RR",
                    title : "RR",
                    name :"Risk Register"
                },
                "app_WIR" : {
                    data : "WIR",
                    title : "RFI",
                    name :"Request For Inspection"
                },
                "app_RFI" : {
                    data : "RFI",
                    title : "RFIT",
                    name :"Request For Information Technical"
                },
                "app_SA" : {
                    data : "SA",
                    title : "SA",
                    name :"Safety Activity And Response"
                },
                "app_SDL" : {
                    data : "SDL",
                    title : "SDL",
                    name :"Site Diary Log"
                },
                "app_SD" : {
                    data : "SD",
                    title : "SI",
                    name :"Site Instruction"
                },
                "app_NOI" : {
                    data : "NOI",
                    title : "SM / NOI",
                    name :"Site Memo / Notice Of Improvement"
                },
                "app_SMH" : {
                    data : "SMH",
                    title : "SMH",
                    name :"Total Man-Hours"
                },
                "app_PU" : {
                    data : "PU",
                    title : "PU",
                    name :"URW - Progress Update"
                }
            }
        }else{
            arrConstruct = {
                "app_DCR" : {
                    data : "DCR",
                    title : "DCR",
                    name :"Design Change Request"
                },
                "app_IR" : {
                    data : "IR",
                    title : "INC",
                    name :"Incident"
                },
                "app_LR" : {
                    data : "LR",
                    title : "LA",
                    name :"Land Acquisition"
                },
                "app_LI" : {
                    data : "LI",
                    title : "LI",
                    name :"Land Issue"
                },
                "app_LE" : {
                    data : "LE",
                    title : "LE",
                    name :"Land Encumbrances"
                },
                "app_LS" : {
                    data : "LS",
                    title : "LS",
                    name :"Land Summary"
                },
                "app_MOS" : {
                    data : "MOS",
                    title : "MS",
                    name :"Method Statement"
                },
                "app_MS" : {
                    data : "MS",
                    title : "MA",
                    name :"Material Acceptance"
                },
                "app_NCR" : {
                    data : "NCR",
                    title : "NCR",
                    name :"Non Conformance Report"
                },
                "app_PSU" : {
                    data : "PSU",
                    title : "PSU",
                    name :"Progress Summary Upload"
                },
                "app_PBC" : {
                    data : "PBC",
                    title : "PBC",
                    name :"Public Complaint"
                },
                "app_RS" : {
                    data : "RS",
                    title : "RS",
                    name :"Report Submission"
                },
                "app_RR" : {
                    data : "RR",
                    title : "RR",
                    name :"Risk Register"
                },
                "app_WIR" : {
                    data : "WIR",
                    title : "RFI",
                    name :"Request For Inspection"
                },
                "app_RFI" : {
                    data : "RFI",
                    title : "RFIT",
                    name :"Request For Information Technical"
                },
                "app_SA" : {
                    data : "SA",
                    title : "SA",
                    name :"Safety Activity And Response"
                },
                "app_SDL" : {
                    data : "SDL",
                    title : "SDL",
                    name :"Site Diary Log"
                },
                "app_SD" : {
                    data : "SD",
                    title : "SI",
                    name :"Site Instruction"
                },
                "app_NOI" : {
                    data : "NOI",
                    title : "SM / NOI",
                    name :"Site Memo / Notice Of Improvement"
                },
                "app_SMH" : {
                    data : "SMH",
                    title : "SMH",
                    name :"Total Man-Hours"
                },
                "app_DA" : {
                    data : "DA",
                    title : "DA",
                    name :"URW - Approved Design Drawing"
                },
                "app_PU" : {
                    data : "PU",
                    title : "PU",
                    name :"URW - Progress Update"
                }
            }
        }
    }
    else if(localStorage.project_owner == "JKR_SARAWAK"){
        arrConstruct = {
            "app_DCR" : {
                data : "DCR",
                title : "DCR",
                name :"Design Change Request"
            },
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_LR" : {
                data : "LR",
                title : "LA",
                name :"Land Acquisition"
            },
            "app_LI" : {
                data : "LI",
                title : "LI",
                name :"Land Issue"
            },
            "app_LE" : {
                data : "LE",
                title : "LE",
                name :"Land Encumbrances"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_MS" : {
                data : "MS",
                title : "MT",
                name :"Material Approval"
            },
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_NOI" : {
                data : "NOI",
                title : "NOI",
                name :"Notice Of Improvement"
            },
            "app_PBC" : {
                data : "PBC",
                title : "PBC",
                name :"Public Complaint"
            },
            "app_RS" : {
                data : "RS",
                title : "RS",
                name :"Report Submission"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request For Information"
            },
            "app_RSDL" : {
                data : "RSDL",
                title : "RSDL",
                name :"RET\'s Site Diary Log (RSDL)"
            },
            "app_RR" : {
                data : "RR",
                title : "RR",
                name :"Risk Register"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"Safety Activity"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SDL",
                name :"Site Diary Log"
            },
            "app_SD" : {
                data : "SD",
                title : "SD",
                name :"Site Direction"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Man-Hours"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            }
        }
    }else if(localStorage.project_owner == "SSLR2"){
        arrConstruct = {
            "app_DCR" : {
                data : "DCR",
                title : "DCR",
                name :"Design Change Request"
            },
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_LR" : {
                data : "LR",
                title : "LA",
                name :"Land Acquisition"
            },
            "app_LI" : {
                data : "LI",
                title : "LI",
                name :"Land Issue & Encumbrances"
            },
            "app_LE" : {
                data : "LE",
                title : "LE",
                name :"Land Encumbrances"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_MS" : {
                data : "MS",
                title : "MT",
                name :"Material Approval"
            },
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_NOI" : {
                data : "NOI",
                title : "NOI",
                name :"Notice Of Improvement"
            },
            "app_PBC" : {
                data : "PBC",
                title : "PBC",
                name :"Public Complaint"
            },
            "app_RS" : {
                data : "RS",
                title : "RS",
                name :"Report Submission"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request For Information"
            },
            "app_RSDL" : {
                data : "RSDL",
                title : "RSDL",
                name :"RET\'s Site Diary Log (RSDL)"
            },
            "app_RR" : {
                data : "RR",
                title : "RR",
                name :"Risk Register"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"Safety Activity"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SDL",
                name :"Site Diary Log"
            },
            "app_SD" : {
                data : "SD",
                title : "SD",
                name :"Site Direction"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Man-Hours"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            }
        }
    }

    if(localStorage.Project_type == 'ASSET'){
        if(localStorage.project_owner == 'JKR_SARAWAK'){
            arrAsset = {
                "RM" : {
                    data : "RM",
                    title : "RM",
                    name : "Routine Maintenance"
                },
                "PM" : {
                    data : "PM",
                    title : "PM",
                    name : "Periodic Maintenance"
                },
                "EW" : {
                    data : "EW",
                    title : "EW",
                    name : "Emergency Work"
                },
                "RFI" : {
                    data : "RFI",
                    title : "RFI",
                    name : "Request for Inspection"
                },
                "NCP" : {
                    data : "NCP",
                    title : "NCP",
                    name : "Non Conformance Product"
                },
                "PAU" : {
                    data : "PAU",
                    title : "PAU",
                    name : "Pavement Analysis Upload"
                }
            }
    
            arrAssetRM = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                }
            }
    
            arrAssetPM = {
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                }
            }
    
            arrAssetEW = {
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "GAR" : {
                    data : "GAR",
                    title : "GAR",
                    name : "Government Asset Return"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset2 = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                },
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                },
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset3 = {
                "BRG" : {
                    data : "BRG",
                    title : "BRG",
                    name :"Bridge"
                },
                "CVT" : {
                    data : "CVT",
                    title : "CVT",
                    name :"Culvert"
                },
                "DRG" : {
                    data : "DRG",
                    title : "DRG",
                    name :"Drainage"
                },
                "PAVE" : {
                    data : "PAVE",
                    title : "PAVE",
                    name :"Pavement"
                },
                "RF" : {
                    data : "RF",
                    title : "RF",
                    name :"Road Furniture"
                },
                "SLP" : {
                    data : "SLP",
                    title : "SLP",
                    name :"Slope"
                }
            };
            
            arrMaintanceList = {
                0 : {
                    data : "con",
                    title : "CON",
                    name :"Condition"
                },
                1 : {
                    data : "asses",
                    title : "AM",
                    name :"Asset Monitoring"
                },
                2 : {
                    data : "routine",
                    title : "RM",
                    name :"Routine Maintenance"
                },
                3 : {
                    data : "periodic",
                    title : "PM",
                    name :"Periodic Maintenance"
                },
                4 : {
                    data : "emergency",
                    title : "EW",
                    name :"Emergency Work"
                },
                5 : {
                    data : "rfi",
                    title : "RFI",
                    name :"Request for Inspection"
                },
                6 : {
                    data : "ncp",
                    title : "NCP",
                    name :"Non Conformance Product"
                }
            }
    
            arrMaintanceConList = {
                0 : {
                    data : "condition_bridge_component",
                    title : "BRG COMPONENT",
                    name :"Bridge (Component)"
                },
                1 : {
                    data : "condition_bridge_overall",
                    title : "BRG OVERALL",
                    name :"Bridge (Overall)"
                },
                2 : {
                    data : "condition_culvert",
                    title : "CVT",
                    name :"Culvert"
                },
                3 : {
                    data : "condition_drainage",
                    title : "DRG",
                    name :"Drainage"
                },
                4 : {
                    data : "condition_pavement",
                    title : "PAVE",
                    name :"Pavement"
                },
                5 : {
                    data : "condition_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                6 : {
                    data : "condition_slope",
                    title : "SLP",
                    name :"Slope"
                }
            }
    
            arrMaintanceAssList = {
                0 : {
                    data : "assess_view_bridge",
                    title : "BRG",
                    name :"Bridge"
                },
                1 : {
                    data : "assess_view_culvert",
                    title : "CVT",
                    name :"Culvert"
                },
                2 : {
                    data : "assess_view_drainage",
                    title : "DRG",
                    name :"Drainage"
                },
                3 : {
                    data : "assess_view_pavement",
                    title : "PAVE",
                    name :"Pavement"
                },
                4 : {
                    data : "assess_view_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                5 : {
                    data : "assess_view_slope",
                    title : "SLP",
                    name :"Slope"
                }
            }
    
            arrMaintanceRoutineList = {
                0 : {
                    data : "ScheduleInspection",
                    title : "RI",
                    name :"Routine Inspection"
                },
                1 : {
                    data : "PictorialReport",
                    title : "PR",
                    name :"Pictorial Report"
                },
                2 : {
                    data : "LPA",
                    title : "LPA",
                    name :"LPA"
                },
                3 : {
                    data : "maint_view_work_program_annual",
                    title : "WPA",
                    name :"Work Program (Annual)"
                },
                4 : {
                    data : "maint_view_work_program_monthly",
                    title : "WPM",
                    name :"Work Program (Monthly)"
                },
                5 : {
                    data : "maint_view_work_instruction",
                    title : "WI",
                    name :"Work Instruction"
                },
                6 : {
                    data : "NotificationOfDamage",
                    title : "NODa",
                    name :"NOD Report (Monthly)"
                },
                7 : {
                    data : "site_routine",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                8 : {
                    data : "defect_detection",
                    title : "DR",
                    name :"Defect Register"
                },
                9 : {
                    data : "NotificationOfDefect",
                    title : "NODe",
                    name :"Notification of Defect"
                }
            }
    
            arrMaintancePeriodicList = {
                0 : {
                    data : "maint_view_apj",
                    title : "APJ",
                    name :"APJ"
                },
                1 : {
                    data : "maint_view_apj_amendment",
                    title : "APJ(A)",
                    name :"APJ (Ammendment)"
                },
                2 : {
                    data : "maint_view_kpj",
                    title : "KPJ",
                    name :"KPJ"
                },
                3 : {
                    data : "maint_view_workorder",
                    title : "WO",
                    name :"Work Order"
                },
                4 : {
                    data : "maint_view_nod_periodic",
                    title : "NOD",
                    name :"Notice of Defect"
                }
            }
    
            arrMaintanceEmergencyList = {
                0  : {
                    data : "maint_view_notice_of_emergency",
                    title : "NOE",
                    name :"Notice of Emergency"
                },
                1 : {
                    data : "maint_view_work_daily_report",
                    title : "WDR",
                    name :"Work Daily Report"
                },
                2 : {
                    data : "maint_view_asset_handover",
                    title : "AH",
                    name :"Asset Handover"
                },
                3 : {
                    data : "maint_view_nod_emergency",
                    title : "NOD",
                    name :"Notice of Defect"
                }
            }
        }else{
            arrAsset = {
                "RM" : {
                    data : "RM",
                    title : "RMW",
                    name : "Routine Maintenance Work"
                },
                "PM" : {
                    data : "PM",
                    title : "PMM",
                    name : "Periodic Maintenance Work"
                },
                "EW" : {
                    data : "EW",
                    title : "EW",
                    name : "Emergency Work"
                },
                "RFI" : {
                    data : "RFI",
                    title : "RFI",
                    name : "Request for Inspection"
                },
                "NCP" : {
                    data : "NCP",
                    title : "NCP",
                    name : "Non Conformance Product"
                },
                "PAU" : {
                    data : "PAU",
                    title : "PAU",
                    name : "Pavement Analysis Upload"
                }
            }
    
            arrAssetRM = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                }
            }
    
            arrAssetPM = {
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                }
            }
    
            arrAssetEW = {
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset2 = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                },
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                },
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset3 = {
                "BRG" : {
                    data : "BRG",
                    title : "BR",
                    name :"Bridge"
                },
                "CVT" : {
                    data : "CVT",
                    title : "CV",
                    name :"Culvert"
                },
                "DRG" : {
                    data : "DRG",
                    title : "DR",
                    name :"Drainage"
                },
                "PAVE" : {
                    data : "PAVE",
                    title : "PV",
                    name :"Pavement"
                },
                "RF" : {
                    data : "RF",
                    title : "RF",
                    name :"Road Furniture"
                },
                "SLP" : {
                    data : "SLP",
                    title : "SL",
                    name :"Slope"
                }
            };
            
            arrMaintanceList = {
                0 : {
                    data : "con",
                    title : "CON",
                    name :"Condition"
                },
                1 : {
                    data : "asses",
                    title : "AM",
                    name :"Asset Monitoring"
                },
                2 : {
                    data : "routine",
                    title : "RMW",
                    name :"Routine Maintenance Work"
                },
                3 : {
                    data : "periodic",
                    title : "PMW",
                    name :"Periodic Maintenance Work"
                },
                4 : {
                    data : "emergency",
                    title : "EW",
                    name :"Emergency Work"
                },
                5 : {
                    data : "rfi",
                    title : "RFI",
                    name :"Request for Inspection"
                },
                6 : {
                    data : "ncp",
                    title : "NCP",
                    name :"Non Conformance Product"
                }
            }
    
            arrMaintanceConList = {
                0 : {
                    data : "condition_bridge_component",
                    title : "BR COMPONENT",
                    name :"Bridge (Component)"
                },
                1 : {
                    data : "condition_bridge_overall",
                    title : "BR OVERALL",
                    name :"Bridge (Overall)"
                },
                2 : {
                    data : "condition_culvert",
                    title : "CV",
                    name :"Culvert"
                },
                3 : {
                    data : "condition_drainage",
                    title : "DR",
                    name :"Drainage"
                },
                4 : {
                    data : "condition_pavement",
                    title : "PV",
                    name :"Pavement"
                },
                5 : {
                    data : "condition_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                6 : {
                    data : "condition_slope",
                    title : "SL",
                    name :"Slope"
                }
            }
    
            arrMaintanceAssList = {
                0 : {
                    data : "assess_view_bridge",
                    title : "BR",
                    name :"Bridge"
                },
                1 : {
                    data : "assess_view_culvert",
                    title : "CL",
                    name :"Culvert"
                },
                2 : {
                    data : "assess_view_drainage",
                    title : "DR",
                    name :"Drainage"
                },
                3 : {
                    data : "assess_view_pavement",
                    title : "PV",
                    name :"Pavement"
                },
                4 : {
                    data : "assess_view_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                5 : {
                    data : "assess_view_slope",
                    title : "SL",
                    name :"Slope"
                }
            }
    
            arrMaintanceRoutineList = {
                0 : {
                    data : "ScheduleInspection",
                    title : "RI",
                    name :"Routine Inspection"
                },
                1 : {
                    data : "PictorialReport",
                    title : "PR",
                    name :"Pictorial Report"
                },
                2 : {
                    data : "LPA",
                    title : "LPA",
                    name :"LPA"
                },
                3 : {
                    data : "maint_view_work_program_annual",
                    title : "WPA",
                    name :"Work Program (Annual)"
                },
                4 : {
                    data : "maint_view_work_program_monthly",
                    title : "WPM",
                    name :"Work Program (Monthly)"
                },
                5 : {
                    data : "maint_view_work_instruction",
                    title : "WI",
                    name :"Work Instruction"
                },
                6 : {
                    data : "NotificationOfDamage",
                    title : "NODa",
                    name :"NOD Report (Monthly)"
                },
                7 : {
                    data : "site_routine",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                8 : {
                    data : "defect_detection",
                    title : "DR",
                    name :"Defect Register"
                },
                9 : {
                    data : "NotificationOfDefect",
                    title : "NODe",
                    name :"Notification of Defect"
                }
            }
    
            arrMaintancePeriodicList = {
                0 : {
                    data : "maint_view_apj",
                    title : "APJ",
                    name :"APJ"
                },
                1 : {
                    data : "maint_view_apj_amendment",
                    title : "APJ(A)",
                    name :"APJ (Ammendment)"
                },
                2 : {
                    data : "maint_view_kpj",
                    title : "KPJ",
                    name :"KPJ"
                },
                3 : {
                    data : "maint_view_workorder",
                    title : "WO",
                    name :"Work Order"
                }
            }
    
            arrMaintanceEmergencyList = {
                0  : {
                    data : "maint_view_notice_of_emergency",
                    title : "NOE",
                    name :"Notice of Emergency"
                },
                1 : {
                    data : "maint_view_work_daily_report",
                    title : "WDR",
                    name :"Work Daily Report"
                },
                2 : {
                    data : "maint_view_asset_handover",
                    title : "AH",
                    name :"Asset Handover"
                }
            }
        }
    }

    if(localStorage.Project_type == 'FM'){
        if(localStorage.project_owner == 'UEM_EDGENTA') {
            flagFM = true;
            arrMaintanceListFM = {
                0 : {
                    data : "service_request",
                    title : "Service Request",
                    name :"Service Request"
                }
            }
        }
    }

    var appOthers = JSON.parse(localStorage.appsOtherApp);
    //for checking the app is set or not
    for (const [idx, ele] of Object.entries(appOthers)) {
        
        if((idx == "app_IC") && (ele != 0)){
            flagIc = true;
        }
        if((idx == "app_VO") && (ele != 0)){
            flagVo = true;
            textVO = ((localStorage.project_owner) && localStorage.project_owner == 'JKR_SABAH') ? "VO": "KPK";
            $('.myFinance.vo > .tagName').html(textVO);
        }
        if(localStorage.isParent !== "isParent"){
            if((idx == "constructPackage_name") && ele && (ele != '')){
                if(ele.includes('ri_construct') == true){
                    flagCheckConstruct = true;
                }else if(ele.includes('ri_asset') == true){
                    flagCheckAsset = true;
                }
            }
        }
    }

    if(flagCheckAsset){
        var currentOrg = localStorage.user_org;
        $('#nameInventoryList').html("Inventory List");

        for (const [idx, ele] of Object.entries(accessProcess)) {
            for (const [idx1, ele1] of Object.entries(arrAsset)) {
                if((ele != false) && (idx1 == idx)){
                    if(idx1 == 'RM' || idx1 == 'PM' || idx1 == 'EW'){
                        rightProcessType +=
                                        `
                                            <option value="`+ele1.data+`" data-nextprocess="2">`+ele1.name+`</option>
                                        `
                    }else if(idx1 == 'PAU'){
                        rightPaveAnalysisUpload += `
                                                        <option value="upload">Upload</option>
                                                    `
                    }else{
                        rightProcessType +=
                                        `
                                            <option value="`+ele1.data+`" data-nextprocess="next">`+ele1.name+`</option>
                                        `
                    }
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetRM)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuRM.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetPM)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuPM.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetEW)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuEW.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx3, ele3] of Object.entries(arrAsset3)) {
                if((ele3 != false) && (idx3 == idx)){
                    rightProcessType3 +=
                                    `
                                        <option value="`+ele3.data+`" data-nextprocess="next">`+ele3.name+`</option>
                                    `
                }
            }
        }

        if(accessManage){
            for (const [idx4, ele4] of Object.entries(accessManage)) {
                for (const [idx5, ele5] of Object.entries(arrAsset2)) {
                    if(idx5 == idx4){
                        rightManageAssetChoice +=
                            `
                                <option value="`+ele5.data+`">`+ele5.name+`</option>
                            `
                    }
                }
            }
        }

        //FOR MAINTENANCE BROWSER
        for (const [idx, ele] of Object.entries(arrMaintanceList)) {
            rightTabMainList += 
            `
                <div class="tab maintenance parent changeName" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabParentClick(this)">`+ele.name+`</div>
            `

            if(ele.data == 'rfi' || ele.data == 'ncp'){
                assetExpList +=
                    `
                        <option value="`+ele.data+`" data-nextprocess="next">`+ele.name+`</option>
                    `
            }else{
                assetExpList +=
                    `
                        <option value="`+ele.data+`" data-nextprocess="2">`+ele.name+`</option>
                    `
            }
        }

        for (const [idx, ele] of Object.entries(arrMaintanceConList)) {
            rightTabConList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
            `
        }

        for (const [idx, ele] of Object.entries(arrMaintanceAssList)) {
            rightTabAssList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>

            `
        }

        for (const [idx, ele] of Object.entries(arrMaintanceRoutineList)) {
            rightTabRoutineList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>

            `
        }

        for (const [idx, ele] of Object.entries(arrMaintancePeriodicList)) {
            rightTabPeriodicList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>

            `
        }

        for (const [idx, ele] of Object.entries(arrMaintanceEmergencyList)) {
            rightTabEmergencyList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
            `
        }
    }

    if(flagCheckConstruct){
        
        var currentOrg = localStorage.user_org;
        $('#nameDatalist').html("ConOp List");

        for (const [idx, ele] of Object.entries(arrConstruct)) {
            //Loop below for Conop list
            for (const [idx2, ele2] of Object.entries(appOthers)) {
                if((idx2 == idx) && (ele2 != 0)){
                    rightTabList += 
                    `
                        <div class="tab changeName" data-page = "`+ele.data+`" id="conopJoget" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
                    `

                    rightTabDetactList += 
                    `
                        <div class="tab changeName" data-page = "`+ele.data+`" id="conopJoget" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.title+`</div>
                    `

                    exportList +=
                    `
                        <option value="`+ele.data+`">`+ele.name+`</option>
                    `
                }
            }

            //Loop below for Process list based on accessProcess
            for (const [idx3, ele3] of Object.entries(accessProcess)) {
                if((ele3 != false) && (idx == "app_" + idx3)){
                    for (const [idxUse, eleUse] of Object.entries(ele3.ORG)) {
                        if(localStorage.project_phase == '1B'){
                            if(idx == "app_RR"){
                                if(localStorage.user_org == 'JKR' || localStorage.user_org == 'pmc_1b'){
                                    rightConopChoice +=
                                        `
                                            <option value="`+ele.data+`">`+ele.name+`</option>
                                        `
                                }else{
                                    continue;
                                }
                            }else{
                                if(idxUse == 'allOrg'){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
                                else if(idxUse == currentOrg){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
                            }
                        }else{
                            if(idxUse == 'allOrg'){
                                rightConopChoice +=
                                `
                                    <option value="`+ele.data+`">`+ele.name+`</option>
                                `
                                if(idx == "app_RR"){
                                    if(localStorage.project_owner == 'JKR_SARAWAK'){
                                            rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Upload</option>
                                        `
                                    }
                                }
                            }
                            else if(idxUse == currentOrg){
                                rightConopChoice +=
                                `
                                    <option value="`+ele.data+`">`+ele.name+`</option>
                                `
                            }
                        }
                    }
                }
            }
        }

        //Loop below for Manage Process based on accessManage
        if(accessManage){
            for (const [idx4, ele4] of Object.entries(accessManage)) {
                for (const [idx5, ele5] of Object.entries(arrConstruct)) {
                    if(idx5 == "app_" + idx4){
                        rightManageChoice +=
                            `
                                <option value="`+ele5.data+`">`+ele5.name+`</option>
                            `
                    }
                }
            }
        }

        if(accessSetup){
            for (const [idx, ele] of Object.entries(accessSetup)) {
                if((idx == 'workDiscipline') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Work Discipline</option>
                    `
                }
                else if((idx == 'riskCategory') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Category</option>
                    `
                }
                else if((idx == 'riskSubCategory') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Sub-Category</option>
                    `
                }
                else if((idx == 'riskDescription') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Description</option>
                    `
                }
                else if((idx == 'machinery') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Machinery</option>
                    `
                }
                else if((idx == 'manpower') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Manpower</option>
                    `
                }
                else if((idx == 'assignUser') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Assign User</option>
                    `
                }
                else if((idx == 'district') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">District</option>
                    `
                }
                else if((idx == 'ccPubc') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">PUBC CC Users</option>
                    `
                }
            }

        }
        else{
            $(".toolButton.setup").css("display", "none")
        }

        
        //Loop below for Bulk Approval list
        if(accessbulkApproval){
            for (const [idx6, ele6] of Object.entries(accessbulkApproval)) {
                for (const [idx7, ele7] of Object.entries(arrConstruct)) {
                    if('app_' + idx6 == idx7){
                        bulkApprovalTabList += 
                        `
                            <div class="tab changeName" data-page = "bulk_`+ele7.data+`" id="conopJogetBulk" rel = "bulk_`+ele7.data+`" style = "font-size;9px" title = "`+ele7.title+`" onclick="navBoxTabClick(this)">`+ele7.name+`</div>
                        `
                    }
                }
            }
        }
    }
    else{

        var currentOrg = localStorage.user_org;
        
        //Loop below for Process list based on accessProcess
        for (const [idx3, ele3] of Object.entries(accessProcess)) {
            if((ele3 != false) && (idx3 == "BR")){
                for (const [idxUse, eleUse] of Object.entries(ele3.ORG)) {
                    if(idxUse == 'allOrg'){
                        rightConopChoice +=
                        `
                            <option value="BP">Bumi Register</option>
                        `
                    }
                    else if(idxUse == currentOrg){
                        rightConopChoice +=
                        `
                            <option value="BP">Bumi Register</option>
                        `
                    }
                }
            }
        }
    }

    if(flagFM){
        //FOR MAINTENANCE BROWSER
        for (const [idx, ele] of Object.entries(arrMaintanceListFM)) {
            rightTabMainList +=
            `
            <div class="tab children changeName" rel = "`+ele.data+`" data-page = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>

            `
        }
    }

    for (const [idxApp, eleApp] of Object.entries(rightMenu)) {

        if (idxApp == "Doc_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                if(idxSubProcess == "Documents"){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if((idxAccess == "readRestricted") && (eleAccess == true)){
                            rightDocHTML += `
                                <div class="subButton" id = "doc_list_doc_restricted" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Document (Restricted)</span>
                                </div>` 

                            let signed_in_email = localStorage.signed_in_email ? localStorage.signed_in_email : ''
                            if( signed_in_email == "pbh.sabah@gmail.com" ){
                                console.log('Document Export')
                                rightDocHTML +=`
                                    <div class="subButton" id = "doc_list_doc_export" onclick = "linkJoget(this, \'myDocument\')">
                                        <span class="parentTagName">Document Export</span>
                                    </div>`
                            }
                        }
                        else if((idxAccess == "readConfidential") && (eleAccess == true)){
                            rightDocHTML += `
                                <div class="subButton" id = "doc_list_doc_confidental" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Document (Confidential)</span>
                                </div>`
                        }
                        

                        if((idxAccess == "setup") && (eleAccess == true)){
                            rightSetupHTML += `
                                        <div class="subButton" id = "doc_setup_lookup_docType" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Document Type</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_distribution_group" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Distribution Group</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_entity" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Entity</span>
                                        </div>
                                        <div class="subButton">
                                            <span class="parentTagName" id = "doc_setup_lookup_group" onclick = "linkJoget(this, \'myDocument\')">Group</span>
                                        </div> `
                                        if(localStorage.project_owner == "JKR_SARAWAK"){
                                            rightSetupHTML += `
                                                <div class="subButton" id = "doc_setup_lookup_section" onclick = "linkJoget(this, \'myDocument\')">
                                                    <span class="parentTagName">Section</span>
                                                </div>`;
                                        }
                        }           
                    }
                }
                else if(idxSubProcess == "Correspondence"){
                    if(localStorage.project_owner == 'JKR_SABAH' && localStorage.usr_role == 'Consultant CRE'){
                        rightCorrHTML += `
                            <div class="subButton" id = "doc_form_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                <span class="parentTagName">New Correspondence</span>
                            </div>
                            <div class="subButton" id = "doc_bulk_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                <span class="parentTagName">New Multiple Correspondence</span>
                            </div>
                            <div class="subButton" id = "doc_list_corr_my" onclick = "linkJoget(this, \'myDocument\')">
                                <span class="parentTagName">My Correspondence</span>
                            </div>` 
                    }
                    
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if((idxAccess == "create") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_form_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">New Correspondence</span>
                                </div>
                                <div class="subButton" id = "doc_bulk_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">New Multiple Correspondence</span>
                                </div>
                                <div class="subButton" id = "doc_list_corr_my" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">My Correspondence</span>
                                </div>` 
                        }
                        else if((idxAccess == "readAllInternal") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_int_all" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">All Correspondence</span>
                                </div>`
                        }
                        else if((idxAccess == "readIncoming") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_tp_incoming" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Incoming (Third Party)</span>
                                </div>`
                        }
                        else if((idxAccess == "readOutgoing") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_tp_outgoing" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Outgoing (Third Party)</span>
                                </div>`
                        }
                        else if((idxAccess == "readOpen") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_open" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Correspondence (Open)</span>
                                </div>`
                        }
                        else if((idxAccess == "readRestricted") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_restricted" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Correspondence (Restricted)</span>
                                </div>`

                            let signed_in_email = localStorage.signed_in_email ? localStorage.signed_in_email : ''
                            if( signed_in_email == "pbh.sabah@gmail.com" ){
                                console.log('Corr Export')
                                rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_export" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Correspondence Export</span>
                                </div>` 
                            }
                        }
                        else if((idxAccess == "readConfidential") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_conf" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Correspondence (Confidential)</span>
                                </div>`
                        }
                        
                    }
                }
            }
        }
        else if (idxApp == "PFS_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                if(idxSubProcess == "ProjectDetails"){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if((idxAccess == "projectDetails") && (eleAccess == true)){
                            rightPfsProjDetHTML += `
                                <div class="subButton" id = "finance_list_ProjectUserInfo" onclick = "linkJoget(this, \'myFinance\', \'projectDetailsCheck\')">
                                    <span class="parentTagName">Project Information</span>
                                </div>
                                <div class="subButton" id = "finance_list_WorkFlowApproval" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Workflow Approval</span>
                                </div>`;
                            if(localStorage.Project_type == "CONSTRUCT"){
                                rightPfsProjDetHTML += ` <div class="subButton" id = "finance_list_FundingInfo" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Funding</span>
                                </div>
                                <div class="subButton" id = "finance_list_BudgetInfo" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                <span class="parentTagName">Budget</span>
                                </div>`;
                            }
                            rightPfsProjDetHTML += `
                                <div class="subButton" id = "finance_list_AuditInfo" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Audit</span>
                                </div>`;
                        }
                        else if((idxAccess == "create") && (eleAccess == true)){
                            assetPfsBtnAccess['projectEdit'] = true;
                            if(localStorage.isParent == "isParent"){
                                rightPfsBudgetHTML += `
                                <div class="subButton" id = "finance_list_BudgetList" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Budget List</span>
                                </div>` 
                            }
                        }else if((idxAccess == "read") && (eleAccess == true)){
                            if(assetPfsBtnAccess['projectEdit'] == undefined && localStorage.isParent == "isParent"){
                                rightPfsBudgetHTML += `
                                <div class="subButton" id = "finance_list_BudgetListView" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Budget List</span>
                                </div>` 
                            }
                        }
                    }
                }
                else if (idxSubProcess == "Contract"){
                    if(localStorage.isParent !== "isParent"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {                     
                            if((idxAccess == "contractsInbox") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_ContractInbox" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Inbox</span>
                                    </div>` 
                            }
                            else if((idxAccess == "publishedContracts") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_PublishedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Published</span>
                                    </div>`
                            }
                            else if((idxAccess == "newContract") && (eleAccess == true)){
                                if(localStorage.project_owner == "JKR_SABAH" && localStorage.project_phase == '1B'){ 
                                    if(localStorage.userOrg == "JKR"){
                                        rightPfsContHTML += `
                                            <div class="subButton" id = "finance_list_NewContract" onclick = "linkJoget(this, \'myFinance\', \'contractApproval\')">
                                                <span class="parentTagName">New</span>
                                            </div>`
                                    }
                                }else{
                                    rightPfsContHTML += `
                                        <div class="subButton" id = "finance_list_NewContract" onclick = "linkJoget(this, \'myFinance\', \'contractApproval\')">
                                            <span class="parentTagName">New</span>
                                        </div>`
                                }
                            }
                            else if((idxAccess == "rejectedContracts") && (eleAccess == true)){
                                if(localStorage.project_owner == "JKR_SABAH" && localStorage.project_phase == '1B'){ 
                                    if(localStorage.userOrg == "JKR"){
                                        rightPfsContHTML += `
                                            <div class="subButton" id = "finance_list_RejectedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Draft</span>
                                            </div>`
                                    }
                                }else{
                                    rightPfsContHTML += `
                                            <div class="subButton" id = "finance_list_RejectedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Draft</span>
                                            </div>`
                                }
                            }
                            else if((idxAccess == "routineContractAmend") && (eleAccess == true)){
                                if(localStorage.isParent == "isParent" && localStorage.Project_type == "ASSET"){
                                    rightPfsContHTML += `
                                        <div class="subButton" id = "finance_list_AmendRoutineContracts" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Routine Contract Amend</span>
                                        </div>`
                                }
                            }
                            else if((idxAccess == "create") && (eleAccess == true)){
                                assetPfsBtnAccess['newContract'] = true;
                            }
                            else if((idxAccess == "bulkUploadContracts") && (eleAccess == true)){
                                if(localStorage.project_owner == 'JKR_SABAH'){
                                    rightPfsContHTML += `
                                        <div class="subButton" id = "finance_list_BulkUploadContracts" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Bulk Import</span>
                                        </div>`
                                }
                            }
 
                        }
                        let signed_in_email = localStorage.signed_in_email ? localStorage.signed_in_email : ''
                        if( signed_in_email == "pbh.sabah@gmail.com" ){ 
                            rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_ExportContracts" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Contracts Export</span>
                                    </div>`
                        }
                    }
                }
                else if (idxSubProcess == "CA"){
                    if(localStorage.Project_type == "CONSTRUCT"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "amendmentInbox") && (eleAccess == true)){
                                rightPfsCAHTML += `
                                    <div class="subButton" id = "finance_list_AmendmentInbox" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Inbox</span>
                                    </div>` 
                            }
                            else if((idxAccess == "newAmendment") && (eleAccess == true)){
                                if(localStorage.project_owner == "JKR_SABAH" && localStorage.project_phase == '1B'){ 
                                    if(localStorage.userOrg == "JKR"){
                                        rightPfsCAHTML += `
                                            <div class="subButton" id = "finance_list_NewAmendment" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">New</span>
                                            </div>`
                                    }
                                }else{
                                    rightPfsCAHTML += `
                                            <div class="subButton" id = "finance_list_NewAmendment" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">New</span>
                                            </div>`
                                }
                            }
                            else if((idxAccess == "amendments") && (eleAccess == true)){
                                rightPfsCAHTML += `
                                    <div class="subButton" id = "finance_list_CurrentAmendments" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Contract</span>
                                    </div>`
                            }
                            else if((idxAccess == "archivedContracts") && (eleAccess == true)){
                                rightPfsCAHTML += `
                                    <div class="subButton" id = "finance_list_ArchivedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Archived</span>
                                    </div>`
                            }
                        }
                    }
                }
                else if (idxSubProcess == "LU"){
                    rightPfsLUHTML += `
                    <div class="subButton" id = "finance_list_ScheduleData" onclick = "linkJoget(this, \'myFinance\')">
                        <span class="parentTagName">Schedule Data</span>
                    </div>
                    <div class="subButton" id = "finance_list_ImportUnit" onclick = "linkJoget(this, \'myFinance\')">
                        <span class="parentTagName">Import Units</span>
                    </div>`;
                    if(localStorage.project_owner == 'JKR_SABAH'){
                        rightPfsLUHTML += `
                        <div class="subButton" id = "finance_list_organization" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Organization List</span>
                        </div>`;
                    }

                }
                else if (idxSubProcess == "LURates"){
                    if(localStorage.isParent == "isParent"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {                     
                            if(idxAccess == "create"){
                                if(eleAccess == true){
                                    rightPfsLUHTML += 
                                    `<div class="subButton" id = "finance_list_RatesData" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Rates of Periodic Maintenance</span>
                                    </div>
                                    <div class="subButton" id = "finance_list_RatesDataImport" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Import Rates of Periodic Maintenance</span>
                                    </div>`;
                                }else{
                                    rightPfsLUHTML += 
                                    `<div class="subButton" id = "finance_list_RatesData_view" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Rates of Periodic Maintenance</span>
                                    </div>`;
                                }
                            }
                        }
                    }
                }
                else if (idxSubProcess == "LULocation"){
                    if(localStorage.isParent == "isParent"){                           
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {                     
                            if(idxAccess == "create"){
                                if(eleAccess == true){
                                    rightPfsLUHTML += 
                                    `<div class="subButton" id = "finance_list_LocationFactorData" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Location Factor</span>
                                    </div>
                                    <div class="subButton" id = "finance_list_LocationFactorDataImport" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Import Location Factor</span>
                                    </div>`;
                                }else{
                                    rightPfsLUHTML += 
                                    `<div class="subButton" id = "finance_list_LocationFactorData_view" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Location Factor</span>
                                    </div>`;
                                }
                            }
                        }
                    }
                }
                else if (idxSubProcess == "EOT"){
                    if(localStorage.project_owner == "JKR_SABAH" && localStorage.project_phase == '1B'){                           
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {                     
                            if((idxAccess == "create") && (eleAccess == true)){
                                rightPfsEOTHTML += 
                                `<div class="subButton" id = "finance_list_NewEOT_Sabah" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">New</span>
                                </div>`;
                            }
                            else if((idxAccess == "read") && (eleAccess == true)){
                                rightPfsEOTHTML += 
                                `<div class="subButton" id = "finance_list_EOTList_Sabah" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Approved</span>
                                </div>`;
                            }
                        }
                    }
                }
                

                if(flagIc){
                    if (idxSubProcess == "Claims"){
                        if(localStorage.isParent !== "isParent"){
                            for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                                if((idxAccess == "claimsInbox") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_ClaimInbox" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Inbox</span>
                                        </div>` 
                                    rightPfsPerClaimHTML += `
                                    <div class="subButton" id = "finance_list_ClaimInboxPeriodic" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Inbox</span>
                                    </div>` 
                                }
                                else if((idxAccess == "currentClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_CurrentClaims" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Draft</span>
                                        </div>` 
                                    rightPfsPerClaimHTML += `
                                    <div class="subButton" id = "finance_list_CurrentClaimsPeriodic" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Draft</span>
                                    </div>` 
                                }
                                else if((idxAccess == "newClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_NewClaim" onclick = "linkJoget(this, \'myFinance\', \'claimApproval\')">
                                            <span class="parentTagName">New</span>
                                        </div>` 
                                }
                                else if((idxAccess == "newClaimsP") && (eleAccess == true)){
                                    rightPfsPerClaimHTML += `
                                        <div class="subButton" id = "finance_list_NewClaimPeriodic" onclick = "linkJoget(this, \'myFinance\', \'claimApprovalPeriodic\')">
                                            <span class="parentTagName">New</span>
                                        </div>` 
                                }
                                else if((idxAccess == "rejectedClaims") && (eleAccess == true)){
                                    if(localStorage.Project_type !== "ASSET"){
                                        rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_RejectedClaims" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Rejected</span>
                                            </div>` 
                                    }
                                }
                                else if((idxAccess == "approvedClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedClaims" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Submitted</span>
                                        </div>` 
                                    rightPfsPerClaimHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedClaimsPeriodic" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Submitted</span>
                                        </div>` 
                                }
                                else if((idxAccess == "InventoryClaim") && (eleAccess == true)){
                                    rightPfsPerInventoryClaimHTML += `
                                        <div class="subButton" id = "finance_list_claimInventory_PBBKPR" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">JKRS.PK(SJ).01.03-PBBKPR</span>
                                        </div>
                                        <div class="subButton" id = "finance_list_claimInventory_SPPT" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">JKRS.PK(SJ).01.03-SPPT</span>
                                        </div>
                                        <div class="subButton" id = "finance_list_claimInventory_BRTB" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">JKRS.PK(SJ).01.03-BRTB</span>
                                        </div>`
                                }
                            }
                            let signed_in_email = localStorage.signed_in_email ? localStorage.signed_in_email : ''
                            if( signed_in_email == "pbh.sabah@gmail.com" ){ 
                                rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_ExportClaims" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Claims Export</span>
                                        </div>` 
                            }
                            
                        }else{
                            if(localStorage.Project_type == "ASSET"){
                                for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                                    if((idxAccess == "claimsInbox") && (eleAccess == true)){
                                        rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_ClaimInboxHq" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Inbox</span>
                                            </div>`
                                        rightPfsPerClaimHTML += `
                                            <div class="subButton" id = "finance_list_ClaimInboxPerHq" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Inbox</span>
                                            </div>` 
                                    }
                                    else if((idxAccess == "currentClaims") && (eleAccess == true)){
                                        rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_CurrentClaimsHq" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Consolidated Draft</span>
                                            </div>` 
                                        rightPfsPerClaimHTML += `
                                            <div class="subButton" id = "finance_list_CurrentClaimsPerHq" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Consolidated Draft</span>
                                            </div>` 
                                    }
                                    else if((idxAccess == "newClaimsHQ") && (eleAccess == true)){
                                        rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_NewClaimHq" onclick = "linkJoget(this, \'myFinance\', \'claimApprovalHq\')">
                                                <span class="parentTagName">Consolidated New</span>
                                            </div>` 
                                    }
                                    else if((idxAccess == "newClaimsPerHQ") && (eleAccess == true)){
                                        rightPfsPerClaimHTML += `
                                            <div class="subButton" id = "finance_list_NewClaimPerHq" onclick = "linkJoget(this, \'myFinance\', \'claimApprovalPerHq\')">
                                                <span class="parentTagName">Consolidated New</span>
                                            </div>` 
                                    }
                                    else if((idxAccess == "approvedClaims") && (eleAccess == true)){
                                        rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_ApprovedClaimsHq" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Submitted (Consolidate)</span>
                                            </div>` 
                                        rightPfsPerClaimHTML += `
                                            <div class="subButton" id = "finance_list_ApprovedClaimsPerHq" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Submitted (Consolidate)</span>
                                            </div>` 
                                    }
                                }
                            }
                        }
                    }
                }

                if(flagVo){
                    if (idxSubProcess == "VO" && localStorage.Project_type == "CONSTRUCT"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "VOInbox") && (eleAccess == true)){
                                rightPfsVoHTML += `
                                    <div class="subButton" id = "finance_list_VOInbox" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Inbox</span>
                                    </div>` 
                            }
                            else if((idxAccess == "currentVO") && (eleAccess == true)){
                                rightPfsVoHTML += `
                                    <div class="subButton" id = "finance_list_CurrentVOs" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Current</span>
                                    </div>` 
                            }
                            else if((idxAccess == "newVO") && (eleAccess == true)){
                                rightPfsVoHTML += `
                                    <div class="subButton" id = "finance_list_NewVO" onclick = "linkJoget(this, \'myFinance\', \'VoApproval\')">
                                        <span class="parentTagName">New</span>
                                    </div>` 
                            }
                            else if((idxAccess == "rejectedVO") && (eleAccess == true)){
                                rightPfsVoHTML += `
                                    <div class="subButton" id = "finance_list_RejectedVOs" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Rejected</span>
                                    </div>` 
                            }
                            else if((idxAccess == "approvedVO") && (eleAccess == true)){
                                rightPfsVoHTML += `
                                    <div class="subButton" id = "finance_list_ApprovedVOs" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Approved</span>
                                    </div>` 
                            }

                            
                        }
                        let signed_in_email = localStorage.signed_in_email ? localStorage.signed_in_email : ''
                        if( signed_in_email == "pbh.sabah@gmail.com" ){ 
                            rightPfsVoHTML += `
                                    <div class="subButton" id = "finance_list_ExportVOs" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">VOs Export</span>
                                    </div>` 
                        }
                        
                    }
                }

            }
            
        }
        else if (idxApp == "Admin_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)){
                if((idxSubProcess == "Project") && eleSubProcess == true){
                    rightAdminProjDetHTML += `
                        <div class="subButton" id = "editcurrProject" rel = "main-project" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Edit</span>
                        </div>
                    `
                    if(localStorage.Project_type != "ASSET"){
                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "cons_issue_PPU" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">New Progress</span>
                            </div>
                        `

                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "cons_datalist_PPU" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">List Progress</span>
                            </div>
                        `
                    }

                    if(localStorage.project_owner == "JKR_SABAH" && localStorage.Project_type != "ASSET"){
                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "cons_datalist_PF" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">List Feature</span>
                            </div>
                        `
                    }

                    if(localStorage.project_owner == "JKR_SABAH" && localStorage.isParent == "isParent" && localStorage.usr_role == "Project Monitor"){
                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "cons_issue_OPU" rel = "main-project-dashboard" data-title = "Overall Progress" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">New Overall Progress</span>
                            </div>
                            <div class="subButton" id = "cons_datalist_OPU" rel = "main-project-dashboard" data-title = "Overall Progress" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">List Overall Progress</span>
                            </div>
                        `
                    }
                }
                else if ((idxSubProcess == "UserDetails") && eleSubProcess == true){
                    rightAdminUserHTML += `
                        <div class="subButton" id = "listUsers" rel = "main-user" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">List User</span>
                        </div>
                        <div class="subButton" id = "addRemoveUsers" rel = "invitenewuserForm" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Add / Remove User</span>
                        </div>
                    `
                }
                else if ((idxSubProcess == "DataPool") && eleSubProcess == true){
                    rightAdminDataHTML += `
                        <div class="subButton" id = "otherData" rel = "main-layerdata" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">GIS, BIM & Reality Model</span>
                        </div>
                        <div class="subButton" id = "aerialData" rel = "main-aerial" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Aerial Image</span>
                        </div> ` 
                            
                        if(localStorage.isParent !== "isParent"){
                            rightAdminDataHTML += `
                            <div class="subButton" id = "aerialDataShare" rel = "main-shareAerial" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">Share Aerial Image</span>
                            </div>
                        `
                        }
                }
                else if ((idxSubProcess == "Schedule") && eleSubProcess == true){
                    rightAdminScheduleHTML += `
                        <div class="subButton" id = "addSchedule" rel = "main-schedule" onclick = "wizardOpenPageGantt(\'admin\')">
                            <span class="parentTagName">Add Schedule</span>
                        </div>
                        <div class="subButton" id = "mapSchedule" rel = "main-schedulemap" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Schedule Mapping</span>
                        </div>
                    `
                }
                else if ((idxSubProcess == "Config")){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if ((idxAccess == "Config") && eleAccess == true){
                            rightAdminConfigHTML += `
                                <div class="subButton" id = "configProjectWise365" rel = "main-projectwise365" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">ProjectWise 365</span>
                                </div>
                                <div class="subButton" id = "configProjectWise" rel = "main-projectwise" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">ProjectWise</span>
                                </div>
                                <div class="subButton" id = "configPowerBI" rel = "main-powerbi" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Power BI</span>
                                </div>
                                 <div class="subButton" id = "asset_hierarchy_crud" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Asset Table Hierarchy Setup</span>
                                </div>
                            `
                        }
                        if ((idxAccess == "Lookup") && eleAccess == true){
                            rightAdminConfigHTML += `
                                <div class="subButton" id = "fm_lookup_list_currency" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Currency</span>
                                </div>
                                <div class="subButton" id = "fm_lookup_list_division" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Division</span>
                                </div>
                                <div class="subButton" id = "fm_lookup_list_purchasingOrg" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Purchasing Org</span>
                                </div>
                                <div class="subButton" id = "fm_lookup_list_trades" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Trades</span>
                                </div>
                                `
                        }
                        if ((idxAccess == "AssetType") && eleAccess == true){
                            rightAdminConfigHTML += `
                                <div class="subButton" id = "fm_asset_type_manage" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Asset Types</span>
                                </div>
                                `
                        }
                        if((idxAccess == "CategoryType") && eleAccess == true){
                            rightAdminConfigHTML += `
                            <div class="subButton" id = "fm_category_manage" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">Category Types</span>
                            </div>
                            `
                        }
                    }
                }
            }
            let signed_in_email = localStorage.signed_in_email ? localStorage.signed_in_email : ''
            if( signed_in_email == "pbh.sabah@gmail.com" ){ 
                rightAdminProjDetHTML += `
                <div class="subButton" id = "cons_datalist_exportPP" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                    <span class="parentTagName">Export Project Progress</span>
                </div>
            ` 
            }
        }
        else if (idxApp == "Construct_Apps_Rights") {
            if(localStorage.Project_type == 'ASSET'){
                defectRegItems += 
                    `<div class="item"><input class="chk_defect" type="checkbox" onchange="assetViewDefectList(this)" value="Pavement" data-chk="defect"><label>Pavement/Access Road</label></div>`;

                routineMainItems += 
                    `<div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R01" data-chk="routine" id="chk_R01" class="chk_routine"><label>RO1 : Pavement</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R02" data-chk="routine" id="chk_R02"><label>RO2 : Road Shoulder</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R04" data-chk="routine" id="chk_R04"><label>RO4 : Maintenance of Road Furnitures</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R05Bridge" data-chk="routine" id="chk_R05_bridge"><label>RO5 : Maintenance of Bridges</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R05Culvert" data-chk="routine" id="chk_R05_culvert"><label>RO5 : Maintenance of Culvert</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R06" data-chk="routine" id="chk_R06"><label>RO6 : Painting of Road Marking</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R07" data-chk="routine" id="chk_R07"><label>RO7 : Cleaning of Drains</label></div>`;

            }else{
                for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                    if (localStorage.project_owner == 'JKR_SABAH') {
                        (idxSubProcess == 'app_NOI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="NOI"><label>Site Memo / Notice Of Improvement</label></div>` : '';
                        (idxSubProcess == 'app_WIR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="WIR"><label>Request For Inspection</label></div>` : '';
                        (idxSubProcess == 'app_RFI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="RFI"><label>Request For Information Technical</label></div>` : '';
                        (idxSubProcess == 'app_MS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="MS"><label>Material Acceptance</label></div>` : '';
                    } else {
                        (idxSubProcess == 'app_NOI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="NOI"><label>Notice Of Improvement</label></div>` : '';
                        (idxSubProcess == 'app_WIR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="WIR"><label>Work Inspection Request</label></div>` : '';
                        (idxSubProcess == 'app_RFI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="RFI"><label>Request For Information</label></div>` : '';
                        (idxSubProcess == 'app_MS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="MS"><label>Material Approval</label></div>` : '';
                    }
                    (idxSubProcess == 'app_NCR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="NCR"><label>Non Conformance Report</label></div>` : '';
                    (idxSubProcess == 'app_DCR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="DCR"><label>Design Change Request</label></div>` : '';
                    (idxSubProcess == 'app_MOS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="MOS"><label>Method Statement</label></div>` : '';
                    (idxSubProcess == 'app_IR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="IR"><label>Incident</label></div>` : '';
                    (idxSubProcess == 'app_RS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="RS"><label>Report Submission</label></div>` : '';
                    (idxSubProcess == 'app_PBC' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="PBC"><label>Public Complaint</label></div>` : '';
                    (idxSubProcess == 'app_DR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="SP"><label>Site Photo</label></div>` : '';
                    
                }
            }
        }
    }


    //FOR DOCUMENT
    $("#setupSideMenu").html(rightSetupHTML) //setup right click
    $("#docSideMenu").html(rightDocHTML) //document right click
    $("#corrSideMenu").html(rightCorrHTML) //correspondence right click

    //FOR FINANCE
    $("#projectDetailSideMenu").html(rightPfsProjDetHTML) //contract right click
    $("#contractSideMenu").html(rightPfsContHTML) //contract right click
    $("#claimSideMenu").html(rightPfsClaimHTML) //claim right click
    $("#voSideMenu").html(rightPfsVoHTML) //claim right click
    $("#amendmentSideMenu").html(rightPfsCAHTML) //contract amendment right click
    $("#lookupSideMenu").html(rightPfsLUHTML) //contract amendment right click
    $("#budgetSideMenu").html(rightPfsBudgetHTML) //budget right click
    $("#claimPeriodicSideMenu").html(rightPfsPerClaimHTML) //budget right click
    $("#eotSabahSideMenu").html(rightPfsEOTHTML) //budget right click
    $("#claimInventorySideMenu").html(rightPfsPerInventoryClaimHTML) //budget right click

    //FOR PROJECT ADMIN
    $("#editProjectSideMenu").html(rightAdminProjDetHTML) //edit the project information right click
    $("#userSideMenu").html(rightAdminUserHTML) //user list right click
    $("#dataSideMenu").html(rightAdminDataHTML) //data pool & aerial image right click
    $("#scheduleSideMenu").html(rightAdminScheduleHTML) //schedule right click
    $("#configSideMenu").html(rightAdminConfigHTML) //configuration project wise right click

    //FOR CONSTRUCT APP
    $("#conOp").html(rightConopHTML) //add ConOp list in Layer to respective div
    $("#conopList").html(rightTabList) //add conop tab for ConOp Browser
    $("#detachWidgetConopList").html(rightTabDetactList) //add conop tab for Detach ConOp Browser
    $("#valueProceessConstruct").html(rightConopChoice) //add process list
    $("#valueSetupConstruct").html(rightSetupChoice) //add setup list
    $("#valueManageConstruct").html(rightManageChoice) //add manage list
    $("#valueProceessConstruct1").html(rightConopChoice) //add process list for myProject left click menu
    $("#valueManageConstruct1").html(rightManageChoice) //add manage list for myProject left click menu
    $("#processNamebulk").html(exportList) //add manage list for myProject left click menu
    $("#bulkApprovalList").html(bulkApprovalTabList) //add conop tab for ConOp Browser

    //FOR ASSET
    // $("#inventoryList").html(rightTabInv) //add ConOp list in Layer to respective div
    $("#processTypeAsset1").html(rightProcessType) //add process asset list
    $("#processTypeAsset3").html(rightProcessType3) //add process asset list
    $("#childTypeAsset").html(rightChildAssetBridge) //add asset list bridge
    $("#childTypeAssetRF").html(rightChildAssetRoadFurniture) //add asset list road furniture
    $("#processTypePavement").html(rightPaveAnalysisUpload) //add asset list road furniture
    $(".buttonTab.maintenanceList").html(rightTabMainList)
    $(".buttonTab.conditionBrowser").html(rightTabConList)
    $(".buttonTab.assessmentBrowser").html(rightTabAssList)
    $(".buttonTab.routineBrowser").html(rightTabRoutineList)
    $(".buttonTab.periodicBrowser").html(rightTabPeriodicList)
    $(".buttonTab.emergencyBrowser").html(rightTabEmergencyList)

    $("#valueManageAsset").html(rightManageAssetChoice)
    //export menu asset
    $("#assetProcesssBulk1").html(assetExpList)
    $("#defectRegItems").html(defectRegItems)
    $("#routineMainItems").html(routineMainItems)

    // ASSET UPDATE MENU TITLE
    if(localStorage.Project_type == 'ASSET'){
        if(localStorage.isParent == 'isParent'){
            // myFinance claims
            $('.claims .mainButton').attr('title', 'Routine (HQ)');
            $('.claims .mainButton span').html('Routine (HQ)');

            $('.claimsPer .mainButton').attr('title', 'Periodic (HQ)');
            $('.claimsPer .mainButton span').html('Periodic (HQ)');
        }else{
            $('.claims .mainButton').attr('title', 'Routine');
            $('.claims .mainButton span').html('Routine');

            $('.claimsPer .mainButton').attr('title', 'Periodic');
            $('.claimsPer .mainButton span').html('Periodic');
        }
    }else{
        $('.myFinance.claimsPer').hide();
        $('.claims .mainButton').attr('title', 'Claims');
        $('.claims .mainButton span').html('Claims');
    }

    if(localStorage.project_owner == "JKR_SABAH" && localStorage.project_phase == '1B'){ 
        $('.myFinance.eotSabah').show();
    }else{
        $('.myFinance.eotSabah').hide();
    }

    //joget default iframe and toggle name
    $('.jogetList.bumiList').css('display', 'none');
    $('.jogetList.conopList').css('display', 'none');
    $('.jogetList.maintenanceBrowser').css('display', 'none');
    $('.jogetList.inventoryList').css('display', 'none');
    $('.jogetList.assetList').css('display', 'none');
    $('#changeNameMaintenance').removeClass('active');
    $('#toggleMaintain').removeClass('fa-toggle-off');
    $('#toggleMaintain').addClass('fa-toggle-on');
    $('#changeNameConop').removeClass('active');
    $('#changeNameInventory').removeClass('active');
    $('#toggleConop').removeClass('fa-toggle-off');
    $('#toggleConop').addClass('fa-toggle-on');
    $('.jogetList.bulkApprovalList').css('display', 'none');
    $('.jogetList.bulkApprovalList').css('display', 'none');
    $('#detactedWidget').removeClass('show');

    if(bulkApprovalTabList == ''){
        $('.toolbutton.bulkApproval').css('display', 'none');
    }else{
        $('.toolbutton.bulkApproval').css('display', 'flex');
    }
}

function setAccessRightButtonSSLR2(rightMenu, accessProcess, accessSetup, accessManage, accessbulkApproval){
    //FOR DOCUMENT
    let rightDocHTML = `<div class="subButton" id = "doc_form_doc_register" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">New Document</span>
                        </div>
                        <div class="subButton" id = "doc_bulk_doc_register" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">New Multiple Document</span>
                        </div>
                        <div class="subButton" id = "doc_list_doc_my" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">My Document</span>
                        </div>
                        <div class="subButton" id = "doc_list_doc_open" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">Document (Open)</span>
                        </div>
                        <div class="subButton" id = "doc_list_doc_arch" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">Document (Archived)</span>
                        </div>`;
    let rightCorrHTML = `<div class="subButton" id = "doc_list_corr_inbox" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">Inbox</span>
                        </div>`;
    let rightSetupHTML = '';

    //FOR FINANCE
    let rightPfsProjDetHTML = '';
    let rightPfsContHTML = '';
    let rightPfsContOthersHTML = '';
    let rightPfsClaimHTML = '';
    let rightPfsVoHTML = '';
    let rightPfsCAHTML = '';
    let rightPfsLUHTML = '';
    let rightPfsBudgetHTML = '';
    let rightPfsPerClaimHTML = '';
    let rightPfsAcs = '';
    let rightPfsEot = '';

    var textVO = '';
    var flagIc = false
    var flagVo = false
    var flagVo = false

    //FOR PROJECT ADMIN
    let rightAdminProjDetHTML = '';
    let rightAdminUserHTML = '';
    let rightAdminDataHTML = '';
    let rightAdminScheduleHTML = '';
    let rightAdminConfigHTML = '';

    //FOR CONSTRUCT APP
    var arrConstruct = {};
    var arrConstruct = {};
    var flagCheckConstruct = false;
    var flagCheckAsset = false;
    let rightConopHTML = '';
    let rightTabList = '';
    let rightTabDetactList = '';
    let bulkApprovalTabList = '';
    let rightSetupChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightManageChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightConopChoice = `
                                <option value="default">Please Choose</option>
                            `
    let exportList = `
                        <option value="default">Please Choose</option>
                    `
    
    //FOR ASSET
    var arrAsset = {};
    var arrAsset2 = {};
    var arrAsset3 = {};
    var arrAssetRM = {};
    var arrAssetPM = {};
    var arrAssetEW = {};
    var arrMaintanceList = {};
    let rightTabMainList = '';
    let rightTabConList = '';
    let rightTabAssList = '';
    let rightTabRoutineList = '';
    let rightTabPeriodicList = '';
    let rightTabEmergencyList = '';
    let assetExpList = `
                            <option value="default">Please Choose</option>
                        `    
    let arrMaintanceConList = '';
    let arrMaintanceAssList = '';
    let arrMaintanceRoutineList = '';
    let arrMaintancePeriodicList = '';
    let arrMaintanceEmergencyList = '';
    secondAssetMenuRM = [];
    secondAssetMenuEW = [];
    secondAssetMenuPM = [];
    var defectRegItems = ''
    var routineMainItems = ''
    let rightProcessType = `
                                <option value="default">Please Choose</option>
                            `
    let rightProcessType3 = `
                                <option value="default">Please Choose</option>
                            `
    let rightManageAssetChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightChildAssetBridge = `
                                    <option value="default">Please Choose</option>
                                `
    let rightChildAssetRoadFurniture = `
                                    <option value="default">Please Choose</option>
                                `
    let rightPaveAnalysisUpload = `
                                            <option value="default">Please Choose</option>
                                            <option value="report">Report</option>
                                        `
    if(IS_DOWNSTREAM){
        arrConstruct = {
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_LR" : {
                data : "LR",
                title : "LA",
                name :"Land Acquisition"
            },
            "app_LI" : {
                data : "LI",
                title : "LI",
                name :"Land Issue"
            },
            "app_LE" : {
                data : "LE",
                title : "LE",
                name :"Land Encumbrances"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_MS" : {
                data : "MS",
                title : "MA",
                name :"Material Approval"
            },
            "app_PBC" : {
                data : "PBC",
                title : "PBC",
                name :"Public Complaint"
            },
            "app_RS" : {
                data : "RS",
                title : "RS",
                name :"Report Submission"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request For Information"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"Safety Activity"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SDL",
                name :"Site Diary Log"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Man-Hours"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            }
        }
    }else{
        arrConstruct = {
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_NOI" : {
                data : "NOI",
                title : "NOI",
                name :"Notice Of Improvement"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            }
        }
    }

    if(localStorage.Project_type == 'ASSET'){
        arrAsset = {
            "RM" : {
                data : "RM",
                title : "RM",
                name : "Routine Maintenance"
            },
            "PM" : {
                data : "PM",
                title : "PM",
                name : "Periodic Maintenance"
            },
            "EW" : {
                data : "EW",
                title : "EW",
                name : "Emergency Work"
            },
            "RFI" : {
                data : "RFI",
                title : "RFI",
                name : "Request for Inspection"
            },
            "NCP" : {
                data : "NCP",
                title : "NCP",
                name : "Non Conformance Product"
            },
            "PAU" : {
                data : "PAU",
                title : "PAU",
                name : "Pavement Analysis Upload"
            }
        }

        arrAssetRM = {
            "RI" : {
                data : "RI",
                title : "RI",
                name : "Routine Inspection"
            },
            "AM" : {
                data : "AM",
                title : "AM",
                name : "Asset Monitoring"
            },
            "WP" : {
                data : "WP",
                title : "WP",
                name : "Work Program"
            },
            "WA" : {
                data : "WA",
                title : "WA",
                name : "Work Activity"
            },
            "WI" : {
                data : "WI",
                title : "WI",
                name : "Work Instruction"
            },
            "DR" : {
                data : "DR",
                title : "DR",
                name : "Defect Register"
            },
            "NOD" : {
                data : "NOD",
                title : "NOD",
                name : "Notification of Defect"
            },
            "IVR" : {
                data : "IVR",
                title : "IVR",
                name : "Inspector Visit Report"
            }
        }

        arrAssetPM = {
            "WO" : {
                data : "WO",
                title : "WO",
                name : "Work Order"
            },
            "WB" : {
                data : "WB",
                title : "WB",
                name : "Work Budget Approval"
            }
        }

        arrAssetEW = {
            "NOE" : {
                data : "NOE",
                title : "NOE",
                name : "Notice of Emergency"
            },
            "WDR" : {
                data : "WDR",
                title : "WDR",
                name : "Work Daily Report"
            }
        }

        arrAsset2 = {
            "RI" : {
                data : "RI",
                title : "RI",
                name : "Routine Inspection"
            },
            "AM" : {
                data : "AM",
                title : "AM",
                name : "Asset Monitoring"
            },
            "WP" : {
                data : "WP",
                title : "WP",
                name : "Work Program"
            },
            "WA" : {
                data : "WA",
                title : "WA",
                name : "Work Activity"
            },
            "WI" : {
                data : "WI",
                title : "WI",
                name : "Work Instruction"
            },
            "DR" : {
                data : "DR",
                title : "DR",
                name : "Defect Register"
            },
            "NOD" : {
                data : "NOD",
                title : "NOD",
                name : "Notification of Defect"
            },
            "IVR" : {
                data : "IVR",
                title : "IVR",
                name : "Inspector Visit Report"
            },
            "WO" : {
                data : "WO",
                title : "WO",
                name : "Work Order"
            },
            "WB" : {
                data : "WB",
                title : "WB",
                name : "Work Budget Approval"
            },
            "NOE" : {
                data : "NOE",
                title : "NOE",
                name : "Notice of Emergency"
            },
            "WDR" : {
                data : "WDR",
                title : "WDR",
                name : "Work Daily Report"
            }
        }

        arrAsset3 = {
            "BRG" : {
                data : "BRG",
                title : "BRG",
                name :"Bridge"
            },
            "CVT" : {
                data : "CVT",
                title : "CVT",
                name :"Culvert"
            },
            "DRG" : {
                data : "DRG",
                title : "DRG",
                name :"Drainage"
            },
            "PAVE" : {
                data : "PAVE",
                title : "PAVE",
                name :"Pavement"
            },
            "RF" : {
                data : "RF",
                title : "RF",
                name :"Road Furniture"
            },
            "SLP" : {
                data : "SLP",
                title : "SLP",
                name :"Slope"
            }
        };
        
        arrMaintanceList = {
            0 : {
                data : "con",
                title : "CON",
                name :"Condition"
            },
            1 : {
                data : "asses",
                title : "AM",
                name :"Asset Monitoring"
            },
            2 : {
                data : "routine",
                title : "RM",
                name :"Routine Maintenance"
            },
            3 : {
                data : "periodic",
                title : "PM",
                name :"Periodic Maintenance"
            },
            4 : {
                data : "emergency",
                title : "EW",
                name :"Emergency Work"
            },
            5 : {
                data : "rfi",
                title : "RFI",
                name :"Request for Inspection"
            },
            6 : {
                data : "ncp",
                title : "NCP",
                name :"Non Conformance Product"
            }
        }

        arrMaintanceConList = {
            0 : {
                data : "condition_bridge_component",
                title : "BRG COMPONENT",
                name :"Bridge (Component)"
            },
            1 : {
                data : "condition_bridge_overall",
                title : "BRG OVERALL",
                name :"Bridge (Overall)"
            },
            2 : {
                data : "condition_culvert",
                title : "CVT",
                name :"Culvert"
            },
            3 : {
                data : "condition_drainage",
                title : "DRG",
                name :"Drainage"
            },
            4 : {
                data : "condition_pavement",
                title : "PAVE",
                name :"Pavement"
            },
            5 : {
                data : "condition_roadfurniture",
                title : "RF",
                name :"Road Furniture"
            },
            6 : {
                data : "condition_slope",
                title : "SLP",
                name :"Slope"
            }
        }

        arrMaintanceAssList = {
            0 : {
                data : "assess_view_bridge",
                title : "BRG",
                name :"Bridge"
            },
            1 : {
                data : "assess_view_culvert",
                title : "CVT",
                name :"Culvert"
            },
            2 : {
                data : "assess_view_drainage",
                title : "DRG",
                name :"Drainage"
            },
            3 : {
                data : "assess_view_pavement",
                title : "PAVE",
                name :"Pavement"
            },
            4 : {
                data : "assess_view_roadfurniture",
                title : "RF",
                name :"Road Furniture"
            },
            5 : {
                data : "assess_view_slope",
                title : "SLP",
                name :"Slope"
            }
        }

        arrMaintanceRoutineList = {
            0 : {
                data : "ScheduleInspection",
                title : "RI",
                name :"Routine Inspection"
            },
            1 : {
                data : "PictorialReport",
                title : "PR",
                name :"Pictorial Report"
            },
            2 : {
                data : "LPA",
                title : "LPA",
                name :"LPA"
            },
            3 : {
                data : "maint_view_work_program_annual",
                title : "WPA",
                name :"Work Program (Annual)"
            },
            4 : {
                data : "maint_view_work_program_monthly",
                title : "WPM",
                name :"Work Program (Monthly)"
            },
            5 : {
                data : "maint_view_work_instruction",
                title : "WI",
                name :"Work Instruction"
            },
            6 : {
                data : "NotificationOfDamage",
                title : "NODa",
                name :"NOD Report (Monthly)"
            },
            7 : {
                data : "site_routine",
                title : "IVR",
                name :"Inspector Visit Report"
            },
            8 : {
                data : "defect_detection",
                title : "DR",
                name :"Defect Register"
            },
            9 : {
                data : "NotificationOfDefect",
                title : "NODe",
                name :"Notification of Defect"
            }
        }

        arrMaintancePeriodicList = {
            0 : {
                data : "maint_view_apj",
                title : "APJ",
                name :"APJ"
            },
            1 : {
                data : "maint_view_apj_amendment",
                title : "APJ(A)",
                name :"APJ (Ammendment)"
            },
            2 : {
                data : "maint_view_kpj",
                title : "KPJ",
                name :"KPJ"
            },
            3 : {
                data : "maint_view_workorder",
                title : "WO",
                name :"Work Order"
            }
        }

        arrMaintanceEmergencyList = {
            0  : {
                data : "maint_view_notice_of_emergency",
                title : "NOE",
                name :"Notice of Emergency"
            },
            1 : {
                data : "maint_view_work_daily_report",
                title : "WDR",
                name :"Work Daily Report"
            },
            2 : {
                data : "maint_view_asset_handover",
                title : "AH",
                name :"Asset Handover"
            }
        }
    }

    var appOthers = JSON.parse(localStorage.appsOtherApp);
    //for checking the app is set or not
    for (const [idx, ele] of Object.entries(appOthers)) {
        
        if((idx == "app_IC") && (ele != 0)){
            flagIc = true;
        }
        if((idx == "app_VO") && (ele != 0)){
            flagVo = true;
            textVO = "KPK";
            $('.myFinance.vo > .tagName').html(textVO);
        }
        if(localStorage.isParent !== "isParent"){
            if((idx == "constructPackage_name") && ele && (ele != '')){
                if(ele.includes('ri_construct') == true){
                    flagCheckConstruct = true;
                }else if(ele.includes('ri_asset') == true){
                    flagCheckAsset = true;
                }
            }
        }
    }

    if(flagCheckAsset){
        var currentOrg = localStorage.user_org;
        $('#nameInventoryList').html("Inventory List");

        for (const [idx, ele] of Object.entries(accessProcess)) {
            for (const [idx1, ele1] of Object.entries(arrAsset)) {
                if((ele != false) && (idx1 == idx)){
                    if(idx1 == 'RM' || idx1 == 'PM' || idx1 == 'EW'){
                        rightProcessType +=
                                        `
                                            <option value="`+ele1.data+`" data-nextprocess="2">`+ele1.name+`</option>
                                        `
                    }else if(idx1 == 'PAU'){
                        rightPaveAnalysisUpload += `
                                                        <option value="upload">Upload</option>
                                                    `
                    }else{
                        rightProcessType +=
                                        `
                                            <option value="`+ele1.data+`" data-nextprocess="next">`+ele1.name+`</option>
                                        `
                    }
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetRM)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuRM.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetPM)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuPM.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetEW)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuEW.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx3, ele3] of Object.entries(arrAsset3)) {
                if((ele3 != false) && (idx3 == idx)){
                    rightProcessType3 +=
                                    `
                                        <option value="`+ele3.data+`" data-nextprocess="next">`+ele3.name+`</option>
                                    `
                }
            }
        }

        if(accessManage){
            for (const [idx4, ele4] of Object.entries(accessManage)) {
                for (const [idx5, ele5] of Object.entries(arrAsset2)) {
                    if(idx5 == idx4){
                        rightManageAssetChoice +=
                            `
                                <option value="`+ele5.data+`">`+ele5.name+`</option>
                            `
                    }
                }
            }
        }

        //FOR MAINTENANCE BROWSER
        for (const [idx, ele] of Object.entries(arrMaintanceList)) {
            rightTabMainList += 
            `
                <div class="tab maintenance parent changeName" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabParentClick(this)">`+ele.name+`</div>
            `

            if(ele.data == 'rfi' || ele.data == 'ncp'){
                assetExpList +=
                    `
                        <option value="`+ele.data+`" data-nextprocess="next">`+ele.name+`</option>
                    `
            }else{
                assetExpList +=
                    `
                        <option value="`+ele.data+`" data-nextprocess="2">`+ele.name+`</option>
                    `
            }
        }

        for (const [idx, ele] of Object.entries(arrMaintanceConList)) {
            rightTabConList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
            `
        }

        for (const [idx, ele] of Object.entries(arrMaintanceAssList)) {
            rightTabAssList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>

            `
        }

        for (const [idx, ele] of Object.entries(arrMaintanceRoutineList)) {
            rightTabRoutineList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>

            `
        }

        for (const [idx, ele] of Object.entries(arrMaintancePeriodicList)) {
            rightTabPeriodicList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>

            `
        }

        for (const [idx, ele] of Object.entries(arrMaintanceEmergencyList)) {
            rightTabEmergencyList += 
            `
                <div class="tab children changeName" rel = "`+ele.data+`" id = "maintainJoget" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
            `
        }
    }

    if(flagCheckConstruct){
        
        var currentOrg = localStorage.user_org;
        $('#nameDatalist').html("ConOp List");

        for (const [idx, ele] of Object.entries(arrConstruct)) {
            //Loop below for Conop list
            for (const [idx2, ele2] of Object.entries(appOthers)) {
                if((idx2 == idx) && (ele2 != 0)){
                    rightTabList += 
                        `
                            <div class="tab changeName" data-page = "`+ele.data+`" id="conopJoget" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
                        `

                    rightTabDetactList += 
                        `
                            <div class="tab changeName" data-page = "`+ele.data+`" id="conopJoget" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.title+`</div>
                        `

                    if(localStorage.project_owner == "SSLR2" && ele.data == 'LI'){
                        exportList +=
                        `
                            <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                        `
                    }else if(localStorage.project_owner == "SSLR2" && ele.data == 'LE'){
                        //Skip LE as LI & LE combine
                    }else{
                        exportList +=
                        `
                            <option value="`+ele.data+`">`+ele.name+`</option>
                        `
                    }

                }
            }

            //Loop below for Process list based on accessProcess
            for (const [idx3, ele3] of Object.entries(accessProcess)) {
                if((ele3 != false) && (idx == "app_" + idx3)){
                    for (const [idxUse, eleUse] of Object.entries(ele3.ORG)) {
                        if(IS_DOWNSTREAM){
                            if(idxUse == 'allOrg' && localStorage.user_org != 'MAUJV'){
                                if(idx == "app_LI"){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                    `
                                }else{
                                    rightConopChoice +=
                                `
                                    <option value="`+ele.data+`">`+ele.name+`</option>
                                `
                                }    
                                if(idx == "app_RR"){
                                    rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Upload</option>
                                        `
                                }
                            }
                            else if(idxUse == currentOrg){
                                if(idx == "app_LI" && idxUse == "MAUJV"){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                    `
                                }else{
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
    
    
                                if(idx == "app_RR" && idxUse == "MAUJV"){
                                    rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Upload</option>
                                        `
                                }
                            }
                        }else{
                            if(idxUse == 'allOrg'){
                                if(IS_DOWNSTREAM){
                                    if(idx == "app_LI"){
                                        rightConopChoice +=
                                        `
                                            <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                        `
                                    }else{
                                        rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                    }
                                }else{
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
    
                                if(idx == "app_RR"){
                                    rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Upload</option>
                                        `
                                }
                            }
                            else if(idxUse == currentOrg){
                                if(idx == "app_LI" && idxUse == "MAUJV"){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                    `
                                }else{
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
    
    
                                if(idx == "app_RR" && idxUse == "MAUJV"){
                                    rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Upload</option>
                                        `
                                }
                            }
                        }
                    }
                }
            }
        }

        //Loop below for Manage Process based on accessManage
        if(accessManage){
            for (const [idx4, ele4] of Object.entries(accessManage)) {
                for (const [idx5, ele5] of Object.entries(arrConstruct)) {
                    if(idx5 == "app_" + idx4){
                        rightManageChoice +=
                            `
                                <option value="`+ele5.data+`">`+ele5.name+`</option>
                            `
                    }
                }
            }
        }

        if(accessSetup){
            for (const [idx, ele] of Object.entries(accessSetup)) {
                if((idx == 'workDiscipline_SSLR2') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Work Discipline</option>
                    `
                }
                else if((idx == 'machinery') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Machinery</option>
                    `
                }
                else if((idx == 'manpower') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Manpower</option>
                    `
                }
                else if((idx == 'assignUser') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Assign User</option>
                    `
                }
                else if((idx == 'district') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">District</option>
                    `
                }
                else if((idx == 'complaintCat') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Category & Type</option>
                    `
                }
                else if((idx == 'wirCode') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">WIR Code Level 1 & 2</option>
                    `
                }
            }

        }
        else{
            $(".toolButton.setup").css("display", "none")
        }

        
        //Loop below for Bulk Approval list
        if(accessbulkApproval){
            for (const [idx6, ele6] of Object.entries(accessbulkApproval)) {
                for (const [idx7, ele7] of Object.entries(arrConstruct)) {
                    if('app_' + idx6 == idx7){
                        bulkApprovalTabList += 
                        `
                            <div class="tab changeName" data-page = "bulk_`+ele7.data+`" id="conopJoget" rel = "bulk_`+ele7.data+`" style = "font-size;9px" title = "`+ele7.title+`" onclick="navBoxTabClick(this)">`+ele7.name+`</div>
                        `
                    }
                }
            }
        }
    }
    else{

        var currentOrg = localStorage.user_org;
        //Loop below for Process list based on accessProcess
        for (const [idx3, ele3] of Object.entries(accessProcess)) {
            if((ele3 != false) && (idx3 == "BR")){
                for (const [idxUse, eleUse] of Object.entries(ele3.ORG)) {
                    if(idxUse == 'allOrg'){
                        rightConopChoice +=
                        `
                            <option value="BP">Bumi Register</option>
                        `
                    }
                    else if(idxUse == currentOrg){
                        rightConopChoice +=
                        `
                            <option value="BP">Bumi Register</option>
                        `
                    }
                }
            }
        }
    }

    for (const [idxApp, eleApp] of Object.entries(rightMenu)) {

        if (idxApp == "Doc_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                if(idxSubProcess == "Documents"){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if((idxAccess == "readRestricted") && (eleAccess == true)){
                            rightDocHTML += `
                                <div class="subButton" id = "doc_list_doc_restricted" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Document (Restricted)</span>
                                </div>` 
                        }
                        else if((idxAccess == "readConfidential") && (eleAccess == true)){
                            rightDocHTML += `
                                <div class="subButton" id = "doc_list_doc_confidental" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Document (Confidential)</span>
                                </div>`
                        }

                        if((idxAccess == "setup") && (eleAccess == true)){
                            rightSetupHTML += `
                                        <div class="subButton" id = "doc_setup_lookup_docType" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Document Type</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_docSubType" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Document Sub Type</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_drawing" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Drawing</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_entity" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Entity</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_group" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Group</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_dist_group" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Distribution Group</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_location" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Location</span>
                                        </div>
                                        <div class="subButton" id = "doc_setup_lookup_section" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Section</span>
                                        </div>`;
                        }           
                    }
                }
                else if(idxSubProcess == "Correspondence"){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if((idxAccess == "create") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_form_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">New Correspondence</span>
                                </div>
                                <div class="subButton" id = "doc_bulk_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">New Multiple Correspondence</span>
                                </div>
                                <div class="subButton" id = "doc_list_corr_my" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">My Correspondence</span>
                                </div>` 
                        }
                        else if((idxAccess == "readAllInternal") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_int_all" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">All Correspondence</span>
                                </div>`
                        }
                        else if((idxAccess == "readIncoming") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_tp_incoming" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Incoming (Third Party)</span>
                                </div>`
                        }
                        else if((idxAccess == "readOutgoing") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_tp_outgoing" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Outgoing (Third Party)</span>
                                </div>`
                        }
                        else if((idxAccess == "readOpen") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_open" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Correspondence (Open)</span>
                                </div>`
                        }
                        else if((idxAccess == "readRestricted") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_restricted" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Correspondence (Restricted)</span>
                                </div>`
                        }
                        else if((idxAccess == "readConfidential") && (eleAccess == true)){
                            rightCorrHTML += `
                                <div class="subButton" id = "doc_list_corr_conf" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Correspondence (Confidential)</span>
                                </div>`
                        }
                        
                    }
                }
            }
        }
        else if (idxApp == "PFS_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                if(localStorage.contractLevel == "UPSTREAM"){
                    if(idxSubProcess == "ProjectDetails"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "projectDetails") && (eleAccess == true)){
                                rightPfsProjDetHTML += `
                                    <div class="subButton" id = "finance_list_ProjectUserInfo_SSLR2" onclick = "linkJoget(this, \'myFinance\', \'projectDetailsCheck\')">
                                        <span class="parentTagName">Project Information</span>
                                    </div>`;
                            }
                        }
                    }
                    else if (idxSubProcess == "Contract"){
                        if(localStorage.isParent !== "isParent"){
                            for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {                     
                                if((idxAccess == "newContract") && (eleAccess == true)){
                                    rightPfsContHTML += `
                                        <div class="subButton" id = "finance_list_NewContract_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">New</span>
                                        </div>`
                                }
                                else if((idxAccess == "publishedContracts") && (eleAccess == true)){
                                    rightPfsContOthersHTML += `
                                    <div class="subButton" id = "finance_list_RejectedContracts_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Draft</span>
                                    </div>`
                                    rightPfsContOthersHTML += `
                                    <div class="subButton" id = "finance_list_PublishedContracts_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Published</span>
                                    </div>`
                                }
                                else if((idxAccess == "bulkUploadContracts") && (eleAccess == true)){
                                    rightPfsContOthersHTML += `
                                        <div class="subButton" id = "finance_list_BulkUploadContracts_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Contract Upload</span>
                                        </div>`
                                }
                                else if((idxAccess == "create") && (eleAccess == true)){
                                    assetPfsBtnAccess['newContract'] = true;
                                }
                            }
                        }
                    }
                    else if (idxSubProcess == "LU"){
                        rightPfsLUHTML += `
                        <div class="subButton" id = "finance_list_ScheduleData" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Schedule Data</span>
                        </div>
                        <div class="subButton" id = "finance_list_ImportUnit" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Import Units</span>
                        </div>
                        <div class="subButton" id = "finance_list_leadConsultantList_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Lead Consultant List Units</span>
                        </div>`;

                    }
                    
                    if(flagIc){
                        if (idxSubProcess == "Claims"){
                            if(localStorage.isParent !== "isParent"){
                                for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                                    if((idxAccess == "newClaims") && (eleAccess == true)){
                                        if(localStorage.usr_role == "Contract Executive" ){
                                            rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_NewClaim_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">New</span>
                                            </div>` 
                                        }
                                    }
                                    else if((idxAccess == "approvedClaims") && (eleAccess == true)){
                                        rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_ApprovedClaims_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">Published</span>
                                            </div>` 
                                    }
                                }
                            }
                        }
                    }

                    if(flagVo){
                        if (idxSubProcess == "VO" && localStorage.Project_type == "CONSTRUCT"){
                            for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                                if((idxAccess == "newVO") && (eleAccess == true)){
                                    if(localStorage.usr_role == "Contract Executive"){
                                        rightPfsVoHTML += `
                                            <div class="subButton" id = "finance_list_NewVO_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                                <span class="parentTagName">New</span>
                                            </div>` 
                                    }
                                }
                                else if((idxAccess == "approvedVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedVOs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Published</span>
                                        </div>` 
                                }
                            }
                        }
                    }

                }else{
                    
                    if(idxSubProcess == "ProjectDetails"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "projectDetails") && (eleAccess == true)){
                                rightPfsProjDetHTML += `
                                    <div class="subButton" id = "finance_list_ProjectUserInfo_SSLR2" onclick = "linkJoget(this, \'myFinance\', \'projectDetailsCheck\')">
                                        <span class="parentTagName">Project Information</span>
                                    </div>`;
                                rightPfsProjDetHTML += `<div class="subButton" id = "finance_list_WorkFlowApproval_SSLR2" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Workflow Approval</span>
                                </div>`;
                                rightPfsProjDetHTML += ` <div class="subButton" id = "finance_list_FundingInfo_SSLR2" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Funding</span>
                                </div>
                                <div class="subButton" id = "finance_list_BudgetInfo_SSLR2" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                <span class="parentTagName">Budget</span>
                                </div>`;
                                rightPfsProjDetHTML += `
                                <div class="subButton" id = "finance_list_AuditInfo_SSLR2" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Audit</span>
                                </div>`;
                                
                            }
                            else if((idxAccess == "bulkUploadContracts") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_BulkUploadContracts_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Bulk Upload</span>
                                    </div>`
                            }
                            else if((idxAccess == "create") && (eleAccess == true)){
                                assetPfsBtnAccess['projectEdit'] = true;
                                if(localStorage.isParent == "isParent"){
                                    rightPfsBudgetHTML += `
                                    <div class="subButton" id = "finance_list_BudgetList_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Budget List</span>
                                    </div>` 
                                }
                            }else if((idxAccess == "read") && (eleAccess == true)){
                                if(assetPfsBtnAccess['projectEdit'] == undefined && localStorage.isParent == "isParent"){
                                    rightPfsBudgetHTML += `
                                    <div class="subButton" id = "finance_list_BudgetListView_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Budget List</span>
                                    </div>` 
                                }
                            }
                        }
                    }
                    else if (idxSubProcess == "Contract"){
                        if(localStorage.isParent !== "isParent"){
                            for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {                     
                                if((idxAccess == "publishedContracts") && (eleAccess == true)){
                                    rightPfsContHTML += `
                                        <div class="subButton" id = "finance_list_PublishedContracts_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Published</span>
                                        </div>`
                                }
                                else if((idxAccess == "newContract") && (eleAccess == true)){
                                    rightPfsContHTML += `
                                        <div class="subButton" id = "finance_list_NewContract_SSLR2" onclick = "linkJoget(this, \'myFinance\', \'contractApproval\')">
                                            <span class="parentTagName">New</span>
                                        </div>`
                                  
                                }else if((idxAccess == "create") && (eleAccess == true)){
                                    assetPfsBtnAccess['newContract'] = true;
                                }
                            }
                        }
                    }
                    else if (idxSubProcess == "LU"){
                        rightPfsLUHTML += `
                        <div class="subButton" id = "finance_list_ScheduleData" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Schedule Data</span>
                        </div>
                        <div class="subButton" id = "finance_list_ImportUnit" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Import Units</span>
                        </div>
                        <div class="subButton" id = "finance_list_leadConsultantList_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Lead Consultant List Units</span>
                        </div>`;
    
                    }
                    else if (idxSubProcess == "EOT"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {  
                            if((idxAccess == "EOTInbox") && (eleAccess == true)){   
                                rightPfsEot +=  `
                                    <div class="subButton" id = "finance_list_EOTInbox_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Inbox</span>
                                    </div>`      
                            }else if((idxAccess == "currentEOT") && (eleAccess == true)){
                                rightPfsEot +=  `
                                    <div class="subButton" id = "finance_list_CurrentEOTs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Current</span>
                                    </div>`
                            }else if((idxAccess == "newEOT") && (eleAccess == true)){
                                rightPfsEot +=  `
                                    <div class="subButton" id = "finance_list_NewEOT_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">New EOT</span>
                                    </div>`
                            }else if((idxAccess == "rejectedEOT") && (eleAccess == true)){
                                rightPfsEot += `
                                <div class="subButton" id = "finance_list_RejectedEOTs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Rejected EOT</span>
                                </div>`
                            }else if((idxAccess == "approvedEOT") && (eleAccess == true)){
                                rightPfsEot += `
                                <div class="subButton" id = "finance_list_ApprovedEOTs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Approved EOT</span>
                                </div>`;
                                rightPfsEot += `
                                <div class="subButton" id = "finance_list_ApprovedVOEOTs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                    <span class="parentTagName">Approved VO EOT</span>
                                </div>`;
                                
                            }
                        }
                    }
                    
                    if(flagIc){
                        if (idxSubProcess == "Claims"){
                            if(localStorage.isParent !== "isParent"){
                                for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                                    if((idxAccess == "approvedClaims") && (eleAccess == true)){
                                        rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedClaims_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Submitted</span>
                                        </div>`  
                                    }
                                    else if((idxAccess == "newClaims") && (eleAccess == true)){
                                        if(localStorage.usr_role == "Contractor FR"){
                                            rightPfsClaimHTML += `
                                            <div class="subButton" id = "finance_list_NewClaim_SSLR2" onclick = "linkJoget(this, \'myFinance\', \'claimApproval\')">
                                                <span class="parentTagName">New</span>
                                            </div>` 
                                        }
                                    }
                                }
                            }
                        }
                    }
    
                    if(flagVo){
                        if (idxSubProcess == "VO" && localStorage.Project_type == "CONSTRUCT"){
                            for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                                if((idxAccess == "VOInbox") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_VOInbox_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Inbox</span>
                                        </div>` 
                                }
                                else if((idxAccess == "currentVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_CurrentVOs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Current</span>
                                        </div>` 
                                }
                                else if((idxAccess == "newVO") && (eleAccess == true)){
                                    if(localStorage.usr_role == "Contractor FR"){
                                        rightPfsVoHTML += `
                                            <div class="subButton" id = "finance_list_NewVO_SSLR2" onclick = "linkJoget(this, \'myFinance\', \'VoApproval\')">
                                                <span class="parentTagName">New</span>
                                            </div>`  
                                    }
                                }
                                else if((idxAccess == "rejectedVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_RejectedVOs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Rejected</span>
                                        </div>` 
                                }
                                else if((idxAccess == "approvedVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedVOs_SSLR2" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Approved</span>
                                        </div>` 
                                }
                            }
                        }
                    }
                }

            }
            
        }
        else if (idxApp == "Admin_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)){
                if((idxSubProcess == "Project") && eleSubProcess == true){
                    rightAdminProjDetHTML += `
                        <div class="subButton" id = "editcurrProject" rel = "main-project" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Edit</span>
                        </div>
                    `
                    if(localStorage.Project_type != "ASSET"){
                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "cons_issue_PPU" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">New Progress</span>
                            </div>
                        `

                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "cons_datalist_PPU" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">List Progress</span>
                            </div>
                        `
                    }
                }
                else if ((idxSubProcess == "UserDetails") && eleSubProcess == true){
                    rightAdminUserHTML += `
                        <div class="subButton" id = "listUsers" rel = "main-user" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">List User</span>
                        </div>
                        <div class="subButton" id = "addRemoveUsers" rel = "invitenewuserForm" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Add / Remove User</span>
                        </div>
                    `
                }
                else if ((idxSubProcess == "DataPool") && eleSubProcess == true){
                    rightAdminDataHTML += `
                        <div class="subButton" id = "otherData" rel = "main-layerdata" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">GIS, BIM & Reality Model</span>
                        </div> 
                        <div class="subButton" id = "aerialData" rel = "main-aerial" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Aerial Image</span>
                        </div> ` 
                        
                        if(localStorage.isParent !== "isParent"){
                            rightAdminDataHTML += `
                            <div class="subButton" id = "aerialDataShare" rel = "main-shareAerial" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">Share Aerial Image</span>
                            </div>
                        `
                        }
                }
                else if ((idxSubProcess == "Schedule") && eleSubProcess == true){
                    rightAdminScheduleHTML += `
                        <div class="subButton" id = "addSchedule" rel = "main-schedule" onclick = "wizardOpenPageGantt(\'admin\')">
                            <span class="parentTagName">Add Schedule</span>
                        </div>
                        <div class="subButton" id = "mapSchedule" rel = "main-schedulemap" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Schedule Mapping</span>
                        </div>
                    `
                }
                else if ((idxSubProcess == "Config")){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if ((idxAccess == "Config") && eleAccess == true){
                            rightAdminConfigHTML += `
                                <div class="subButton" id = "configProjectWise365" rel = "main-projectwise365" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">ProjectWise 365</span>
                                </div>
                                <div class="subButton" id = "configProjectWise" rel = "main-projectwise" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">ProjectWise</span>
                                </div>
                                <div class="subButton" id = "configPowerBI" rel = "main-powerbi" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Power BI</span>
                                </div>
                            `
                        }
                    }
                }
            }
        }
        else if (idxApp == "Construct_Apps_Rights") {
            if(localStorage.Project_type == 'ASSET'){
                defectRegItems += 
                    `<div class="item"><input class="chk_defect" type="checkbox" onchange="assetViewDefectList(this)" value="Pavement" data-chk="defect"><label>Pavement/Access Road</label></div>`;

                routineMainItems += 
                    `<div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R01" data-chk="routine" id="chk_R01" class="chk_routine"><label>RO1 : Pavement</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R02" data-chk="routine" id="chk_R02"><label>RO2 : Road Shoulder</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R04" data-chk="routine" id="chk_R04"><label>RO4 : Maintenance of Road Furnitures</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R05Bridge" data-chk="routine" id="chk_R05_bridge"><label>RO5 : Maintenance of Bridges</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R05Culvert" data-chk="routine" id="chk_R05_culvert"><label>RO5 : Maintenance of Culvert</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R06" data-chk="routine" id="chk_R06"><label>RO6 : Painting of Road Marking</label></div>
                    <div class="item"><input type="checkbox" onchange="assetViewRoutineList(this)" value="R07" data-chk="routine" id="chk_R07"><label>RO7 : Cleaning of Drains</label></div>`;

            }else{
                for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                    (idxSubProcess == 'app_NOI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="NOI"><label>Notice Of Improvement</label></div>` : '';
                    (idxSubProcess == 'app_WIR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="WIR"><label>Work Inspection Request</label></div>` : '';
                    (idxSubProcess == 'app_RFI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="RFI"><label>Request For Information</label></div>` : '';
                    (idxSubProcess == 'app_MS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="MS"><label>Material Approval</label></div>` : '';
                    (idxSubProcess == 'app_NCR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="NCR"><label>Non Conformance Report</label></div>` : '';
                    (idxSubProcess == 'app_DCR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="DCR"><label>Design Change Request</label></div>` : '';
                    (idxSubProcess == 'app_MOS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="MOS"><label>Method Statement</label></div>` : '';
                    (idxSubProcess == 'app_IR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="IR"><label>Incident</label></div>` : '';
                    (idxSubProcess == 'app_RS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="RS"><label>Report Submission</label></div>` : '';
                    (idxSubProcess == 'app_PBC' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="PBC"><label>Public Complaint</label></div>` : '';
                    (idxSubProcess == 'app_DR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="SP"><label>Site Photo</label></div>` : '';
                    
                }
            }
        }
    }


    //FOR DOCUMENT
    $("#setupSideMenu").html(rightSetupHTML) //setup right click
    $("#docSideMenu").html(rightDocHTML) //document right click
    $("#corrSideMenu").html(rightCorrHTML) //correspondence right click

    //FOR FINANCE
    $("#projectDetailSideMenu").html(rightPfsProjDetHTML) //contract right click
    $("#contractSideMenu").html(rightPfsContHTML + rightPfsContOthersHTML) //contract right click
    $("#claimSideMenu").html(rightPfsClaimHTML) //claim right click
    $("#voSideMenu").html(rightPfsVoHTML) //claim right click
    $("#amendmentSideMenu").html(rightPfsCAHTML) //contract amendment right click
    $("#lookupSideMenu").html(rightPfsLUHTML) //contract amendment right click
    $("#budgetSideMenu").html(rightPfsBudgetHTML) //budget right click
    $("#claimPeriodicSideMenu").html(rightPfsPerClaimHTML) //budget right click

    //FOR PROJECT ADMIN
    $("#editProjectSideMenu").html(rightAdminProjDetHTML) //edit the project information right click
    $("#userSideMenu").html(rightAdminUserHTML) //user list right click
    $("#dataSideMenu").html(rightAdminDataHTML) //data pool & aerial image right click
    $("#scheduleSideMenu").html(rightAdminScheduleHTML) //schedule right click
    $("#configSideMenu").html(rightAdminConfigHTML) //configuration project wise right click

    //FOR CONSTRUCT APP
    $("#conOp").html(rightConopHTML) //add ConOp list in Layer to respective div
    $("#conopList").html(rightTabList) //add conop tab for ConOp Browser
    $("#detachWidgetConopList").html(rightTabDetactList) //add conop tab for ConOp Browser
    $("#valueProceessConstruct").html(rightConopChoice) //add process list
    $("#valueSetupConstruct").html(rightSetupChoice) //add setup list
    $("#valueManageConstruct").html(rightManageChoice) //add manage list
    $("#valueProceessConstruct1").html(rightConopChoice) //add process list for myProject left click menu
    $("#valueManageConstruct1").html(rightManageChoice) //add manage list for myProject left click menu
    $("#processNamebulk").html(exportList) //add manage list for myProject left click menu
    $("#bulkApprovalList").html(bulkApprovalTabList) //add conop tab for ConOp Browser

    //FOR ASSET
    $("#processTypeAsset1").html(rightProcessType) //add process asset list
    $("#processTypeAsset3").html(rightProcessType3) //add process asset list
    $("#childTypeAsset").html(rightChildAssetBridge) //add asset list bridge
    $("#childTypeAssetRF").html(rightChildAssetRoadFurniture) //add asset list road furniture
    $("#processTypePavement").html(rightPaveAnalysisUpload) //add asset list road furniture
    $("#maintenanceList").html(rightTabMainList)
    $("#conditionBrowser").html(rightTabConList)
    $("#assessmentBrowser").html(rightTabAssList)
    $("#routineBrowser").html(rightTabRoutineList)
    $("#periodicBrowser").html(rightTabPeriodicList)
    $("#emergencyBrowser").html(rightTabEmergencyList)
    $("#valueManageAsset").html(rightManageAssetChoice)
    //export menu asset
    $("#assetProcesssBulk1").html(assetExpList)
    $("#defectRegItems").html(defectRegItems)
    $("#routineMainItems").html(routineMainItems)

    // ASSET UPDATE MENU TITLE
    if(localStorage.Project_type == 'ASSET'){
        if(localStorage.isParent == 'isParent'){
            // myFinance claims
            $('.claims .mainButton').attr('title', 'Routine (HQ)');
            $('.claims .mainButton span').html('Routine (HQ)');

            $('.claimsPer .mainButton').attr('title', 'Periodic (HQ)');
            $('.claimsPer .mainButton span').html('Periodic (HQ)');
        }else{
            $('.claims .mainButton').attr('title', 'Routine');
            $('.claims .mainButton span').html('Routine');

            $('.claimsPer .mainButton').attr('title', 'Periodic');
            $('.claimsPer .mainButton span').html('Periodic');
        }
    }else{
        $('.myFinance.claimsPer').hide();
        $('.claims .mainButton').attr('title', 'Claims');
        $('.claims .mainButton span').html('Claims');
    }

    //joget default iframe and toggle name
    $('.jogetList.bumiList').css('display', 'none');
    $('.jogetList.conopList').css('display', 'none');
    $('.jogetList.maintenanceBrowser').css('display', 'none');
    $('.jogetList.inventoryList').css('display', 'none');
    $('#changeNameMaintenance').removeClass('active');
    $('#toggleMaintain').removeClass('fa-toggle-off');
    $('#toggleMaintain').addClass('fa-toggle-on');
    $('#changeNameConop').removeClass('active');
    $('#changeNameInventory').removeClass('active');
    $('#toggleConop').removeClass('fa-toggle-off');
    $('#toggleConop').addClass('fa-toggle-on');
    $('.jogetList.bulkApprovalList').css('display', 'none');
    $('#detactedWidget').removeClass('show');

    if(bulkApprovalTabList == ''){
        $('.toolbutton.bulkApproval').css('display', 'none');
    }else{
        $('.toolbutton.bulkApproval').css('display', 'flex');
    }
 
    // Finance Downstream
    if(localStorage.contractLevel == "DOWNSTREAM" && rightPfsEot != ""){

        $('.myFinanceDownstream.acsSSLR').show();
        $('.myFinanceDownstream.eotSSLR').show();

        $("#acsSSLRSideMenu").html(rightPfsAcs) //acs right click
        $("#eotSSLRSideMenu").html(rightPfsEot) //eos right click
    }else{
        $('.myFinanceDownstream.acsSSLR').hide();
        $('.myFinanceDownstream.eotSSLR').hide();
    }
}

function setAccessRightButtonOBYU(rightMenu, accessProcess, accessSetup, accessManage, pageOpen){
    //FOR DOCUMENT
    let rightDocHTML = '';
    let rightCorrHTML = `<div class="subButton" id = "document_corr_inbox" onclick = "linkJoget(this, \'${pageOpen}\')">
                            <span class="parentTagName">Inbox</span>
                        </div>`;
    let rightSetupHTML = '';
    let rightProjInfoHTML = '';

    //FOR FINANCE
    let rightPfsProjDetHTML = '';
    let rightPfsContHTML = '';
    let rightPfsClaimHTML = '';
    let rightPfsVoHTML = '';
    let rightPfsCAHTML = '';
    let rightPfsLUHTML = '';
    let rightPfsSetUpHTML = '';
    let rightPfsCFHTML = '';
    let rightPfsACSHTML = '';
    let rightPfsEOTHTML = '';
    var textVO = '';
    var flagIc = false
    var flagVo = false
    var flagVo = false

    var accessRoleMAU = ['Project Manager','Planning Engineer'];
    var proj_id_name = ['eLibrary','projectInformation'];

    //FOR PROJECT ADMIN
    let rightAdminProjDetHTML = '';
    let rightAdminUserHTML = '';
    let rightAdminDataHTML = '';
    let rightAdminScheduleHTML = '';
    let rightAdminConfigHTML = '';

    //FOR CONSTRUCT APP
    var arrConstruct = {};
    var flagCheckConstruct = false;
    let rightConopHTML = '';
    let rightTabList = '';
    let rightTabDetactList = '';
    let rightSetupChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightManageChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightConopChoice = `
                                <option value="default">Please Choose</option>
                            `
    let exportList = `
                        <option value="default">Please Choose</option>
                    `
    
    let flagDocumentNormal = false;
    let flagDrawing = false;
    let flagAfterReadRestricted = false;
    let flagAfterReadConfidential = false;

    if(localStorage.project_owner == "MRSB"){        
        arrConstruct = {
            "app_EVNT" : {
                data : "EVNT",
                title : "EVNT",
                name :"Event"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"HSET Activity"
            },
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_LAND" : {
                data : "LAND",
                title : "LM",
                name :"Land Management"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_MS" : {
                data : "MS",
                title : "MT",
                name :"Material Submission"
            },
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_NOI" : {
                data : "NOI",
                title : "NOI",
                name :"Notice of Improvement"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            },
            "app_PUBC" : {
                data : "PUBC",
                title : "PUBC",
                name :"Public Complaint"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request For Information"
            },
            "app_RR" : {
                data : "RR",
                title : "RR",
                name :"Risk Register"
            },
            "app_SD" : {
                data : "SD",
                title : "SI",
                name :"Site Instruction"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SD",
                name :"Site Diary"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Safe Man-Hour Works Without LTI"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            }
        }
    }else if(localStorage.project_owner == "KACC"){
        arrConstruct = {
            "app_CAR" : {
                data : "CAR",
                title : "CAR",
                name :"Corrective Action Request"
            },
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_MAU" : {
                data : "MAU",
                title : "MAU",
                name :"Monthly Attachment Upload"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_MS" : {
                data : "MS",
                title : "MT",
                name :"Material Submission"
            },
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            },
            "app_PTW" : {
                data : "PTW",
                title : "PTW",
                name :"Permit To Work"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request for Information"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"Safety Activity"
            },
            "app_SD" : {
                data : "SD",
                title : "SI",
                name :"Site Instruction"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SD",
                name :"Site Diary"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Safe Man-Hour Works Without LTI"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            },
        }
    }

    var appOthers = JSON.parse(localStorage.appsOtherApp);
    //for checking the app is set or not
    for (const [idx, ele] of Object.entries(appOthers)) {
        if(localStorage.isParent !== "isParent"){
            if((idx == "constructPackage_name") && ele && (ele != '')){
                if(ele.includes('conOp') == true){
                    flagCheckConstruct = true;
                }
            }
        }
        if((idx == "app_IC") && (ele != 0)){
            flagIc = true;
        }
        if((idx == "app_VO") && (ele != 0)){
            flagVo = true;
        }
    }

    if(flagCheckConstruct){
        
        var currentOrg = localStorage.user_org;
        $('#nameDatalist').html("ConOp List");

        for (const [idx, ele] of Object.entries(arrConstruct)) {

            //Loop below for Conop list
            for (const [idx2, ele2] of Object.entries(appOthers)) {
                if((idx2 == idx) && (ele2 != 0)){
                    rightTabList += 
                    `
                        <div class="tab changeName" data-page = "`+ele.data+`" id="conopJoget" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
                    `

                    rightTabDetactList +=
                    `
                        <div class="tab changeName" data-page = "`+ele.data+`" id="conopJoget" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.title+`</div>
                    `

                    if(idx2 == 'app_RR'){
                        rightTabList += 
                                    `
                                        <div class="tab changeName" data-page = "RROverall" id="conopJoget" rel = "RROverall" style = "font-size;9px" title = "RAO" onclick="navBoxTabClick(this)">Risk Analysis Overall</div>
                                        <div class="tab changeName" data-page = "RRSection" id="conopJoget" rel = "RRSection" style = "font-size;9px" title = "RAS" onclick="navBoxTabClick(this)">Risk Analysis Section</div>
                                    `
                        
                        rightTabDetactList += 
                                    `
                                        <div class="tab changeName" data-page = "RROverall" id="conopJoget" rel = "RROverall" style = "font-size;9px" title = "RAO" onclick="navBoxTabClick(this)">RAO</div>
                                        <div class="tab changeName" data-page = "RRSection" id="conopJoget" rel = "RRSection" style = "font-size;9px" title = "RAS" onclick="navBoxTabClick(this)">RAS</div>
                                    `
                    }

                    if(idx2 == 'app_LAND'){
                        rightTabList += 
                                    `
                                        <div class="tab changeName" data-page = "LTD" id="conopJoget" rel = "LTD" style = "font-size;9px" title = "LTD" onclick="navBoxTabClick(this)">Land Timeline & Dashboard</div>
                                    `
                        
                        rightTabDetactList += 
                                    `
                                        <div class="tab changeName" data-page = "LTD" id="conopJoget" rel = "LTD" style = "font-size;9px" title = "LTD" onclick="navBoxTabClick(this)">LTD</div>
                                    `
                    }

                    if(idx2 != 'app_LAND'){
                        exportList +=
                        `
                            <option value="`+ele.data+`">`+ele.name+`</option>
                        `
                    }
                }
            }

            //Loop below for Process list based on accessProcess
            for (const [idx3, ele3] of Object.entries(accessProcess)) {
                if((ele3 != false) && (idx == "app_" + idx3)){
                    for (const [idxUse, eleUse] of Object.entries(ele3.ORG)) {
                        if(idxUse == 'allOrg'){
                            rightConopChoice +=
                            `
                                <option value="`+ele.data+`">`+ele.name+`</option>
                            `
                            if(idx == "app_RR"){
                                rightConopChoice +=
                            `
                                <option value="RRU">Risk Upload</option>
                            `
                            }
                        }
                        else if(idxUse == currentOrg){
                            rightConopChoice +=
                            `
                                <option value="`+ele.data+`">`+ele.name+`</option>
                            `

                            if(idx == "app_RR"){
                                rightConopChoice +=
                            `
                                <option value="RRU">Risk Analysis Upload</option>
                                <option value="RROverall">Risk Analysis Overall</option>
                                <option value="RRSection">Risk Analysis Section</option>
                            `
                            }

                            if(idx == "app_LAND"){
                                rightConopChoice +=
                            `
                                <option value="LTD">Land Timeline & Database</option>
                            `
                            }
                        }
                    }
                }
            }
        }

        //Loop below for Manage Process based on accessManage
        if(accessManage){
            for (const [idx5, ele5] of Object.entries(arrConstruct)) {
                for (const [idx4, ele4] of Object.entries(accessManage)) {
                    if(idx5 == "app_" + idx4){
                        rightManageChoice +=
                            `
                                <option value="`+ele5.data+`">`+ele5.name+`</option>
                            `

                        if(idx4 == "RR"){
                            rightManageChoice +=
                                `
                                    <option value="RROverall">Risk Analysis Overall</option>
                                    <option value="RRSection">Risk Analysis Section</option>
                                `
                        }

                        if(idx5 == "app_LAND"){
                            rightManageChoice +=
                            `
                                <option value="LTD">Land Timeline & Database</option>
                            `
                        } 

                    }
                }
            }
        }

        if(accessSetup){
            for (const [idx, ele] of Object.entries(accessSetup)) {
                if((idx == 'ncrCatg') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">NCR Category</option>
                    `
                }
                else if((idx == 'incCatg') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Incident Category</option>
                    `
                }
                else if((idx == 'pubcCatg') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">PUBC Category</option>
                    `
                }
                else if((idx == 'eventCatg') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Event Category</option>
                    `
                }
                else if((idx == 'statisticSA') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Statistic SA</option>
                    `
                }
                else if((idx == 'statisticSMH') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Statistic SMH</option>
                    `
                }
                else if((idx == 'areaSetup') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Area</option>
                    `
                }
                else if((idx == 'ownerSetup') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Owner</option>
                    `
                }
                else if((idx == 'projectImpactSetup') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Project Impact</option>
                    `
                }
                else if((idx == 'sourceSetup') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Source</option>
                    `
                }
                else if((idx == 'packageIDsetup') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Package ID</option>
                    `
                }
                else if((idx == 'controlSetup') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Control</option>
                    `
                }
                else if((idx == 'statusSetup') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Risk Status</option>
                    `
                }
                else if((idx == 'classification') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Classification</option>
                    `
                }
                else if((idx == 'discipline') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Discipline</option>
                    `
                }
                else if((idx == 'subDiscipline') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Sub Discipline</option>
                    `
                }
                else if((idx == 'entity') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Entity</option>
                    `
                }
                else if((idx == 'section') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Section</option>
                    `
                }
                else if((idx == 'trade') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Trade/Service</option>
                    `
                }
                else if((idx == 'WPC') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">WPC</option>
                    `
                }else if((idx == 'packageSection') && (ele == true)){
                    rightSetupChoice += `
                        <option value="`+idx+`">Package & Section (LTD)</option>
                    `
                }
            }

        }
        else{
            $(".toolButton.setup").css("display", "none")
        }
    }
    else{
        //Loop below for Process list based on accessProcess
        for (const [idx3, ele3] of Object.entries(accessProcess)) {
            if((ele3 != false) && (idx3 == "BR")){
                for (const [idxUse, eleUse] of Object.entries(ele3.ORG)) {
                    if(idxUse == 'allOrg'){
                        rightConopChoice +=
                        `
                            <option value="BP">Bumi Register</option>
                        `
                    }
                    else if(idxUse == currentOrg){
                        rightConopChoice +=
                        `
                            <option value="BP">Bumi Register</option>
                        `
                    }
                }
            }
        }
    }
    
    for (const [idxApp, eleApp] of Object.entries(rightMenu)) {
        if (idxApp == "Doc_Rights"){
            
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                if(idxSubProcess == "Documents"){

                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if((idxAccess == "create") && (eleAccess == true)){
                            rightDocHTML += `
                                <div class="subButton" id = "document_register" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">New Document</span>
                                </div>
                                <div class="subButton" id = "document_bulk_upload" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">New Multiple Document</span>
                                </div>
                                <div class="subButton" id = "document_open" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">My Document</span>
                                </div>
                                <div class="subButton" id = "document_all" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Document (All)</span>
                                </div>` 
                        }
                        
                        if(!flagDocumentNormal){
                            rightDocHTML += `
                                    <div class="subButton" id = "document_open_normal" onclick = "linkJoget(this, \'myDocument\')">
                                        <span class="parentTagName">Document (Normal)</span>
                                    </div>`
                            
                            flagDocumentNormal = true;
                        }

                        if((idxAccess == "readRestricted") && (eleAccess == true)){
                            if(localStorage.project_owner == "MRSB"){
                                rightDocHTML += `
                                    <div class="subButton" id = "document_restricted" onclick = "linkJoget(this, \'myDocument\')">
                                        <span class="parentTagName">Document (Limited)</span>
                                    </div>` 
                            }else{
                                rightDocHTML += `
                                    <div class="subButton" id = "document_restricted" onclick = "linkJoget(this, \'myDocument\')">
                                        <span class="parentTagName">Document (Restricted)</span>
                                    </div>` 
                            }
                            
                            flagAfterReadRestricted = true;
                        }
                        else if((idxAccess == "readRestricted") && (eleAccess == false)){
                            flagAfterReadRestricted = true;
                        }
                        
                        if((idxAccess == "readConfidential") && (eleAccess == true)){
                            rightDocHTML += `
                                <div class="subButton" id = "document_confidential" onclick = "linkJoget(this, \'myDocument\')">
                                    <span class="parentTagName">Document (Confidential)</span>
                                </div>`

                            flagAfterReadConfidential = true;
                            
                        }
                        else if((idxAccess == "readConfidential") && (eleAccess == false)){
                            flagAfterReadConfidential = true;
                        }
                        
                        if(!flagDrawing && flagAfterReadRestricted && flagAfterReadConfidential){
                            if (['KACC', 'MRSB'].includes(localStorage.project_owner) && !proj_id_name.includes(localStorage.p_id_name)){
                                rightDocHTML += `
                                                <div class="subButton" id = "document_drawing" onclick = "linkJoget(this, \'myDocument\')">
                                                    <span class="parentTagName">Drawing</span>
                                                </div>` 
                            }

                            flagDrawing = true;
                        }

                        if((idxAccess == "archive") && (eleAccess == true)){
                            if(localStorage.project_owner != "UTSB" && !proj_id_name.includes(localStorage.p_id_name)){
                                //ONLY MRSB HAVE DRAWING ARCHIVED AS ON 20/3/2023 and this need to be added in V3 also
                                if(localStorage.project_owner == "MRSB"){
                                    rightDocHTML += `
                                        <div class="subButton" id = "document_archived" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Document (Archived)</span>
                                        </div>`
                                }
                            }
                        }

                        if((idxAccess == "setup") && (eleAccess == true)){
                            rightSetupHTML += `
                                        <div class="subButton" id = "document_setup_type" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Document Type</span>
                                        </div>`

                            if(!proj_id_name.includes(localStorage.p_id_name)){

                                rightSetupHTML += `
                                        <div class="subButton" id = "document_setup_work_discipline" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Work Discipline</span> 
                                        </div>`

                                if(localStorage.project_owner != "UTSB"){
                                    rightSetupHTML += `
                                        <div class="subButton" id = "document_setup_section" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Section</span>
                                        </div>`
                                }
                                if(localStorage.project_owner == "UTSB"){
                                    rightSetupHTML += `
                                        <div class="subButton" id = "document_setup_distribution_group_utsb" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Distribution Group</span>
                                        </div>
                                        <div class="subButton" id = "document_setup_distribution_matrix_utsb" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Distribution Matrix</span>
                                        </div>`
                                }
                                if(localStorage.project_owner == "MRSB"){
                                    rightSetupHTML += `
                                        <div class="subButton" id = "document_setup_entity" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Entity</span>
                                        </div>
                                        <div class="subButton" id = "document_setup_volume" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Drawing Volume</span>
                                        </div>
                                        <div class="subButton" id = "document_setup_distribution_group" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Distribution Group</span>
                                        </div>
                                        <div class="subButton" id = "document_setup_distribution_matrix" onclick = "linkJoget(this, \'myDocument\')">
                                            <span class="parentTagName">Distribution Matrix</span>
                                        </div>`
                                }
                            }
                        }           
                    }

                    
                }
                else if(idxSubProcess == "Correspondence"){
                    const projectIds = ["NCH", "B_NCH"];
                    const financeRoles = ["Finance Officer", "Finance Head"];

                    const isNCHFinance = projectIds.includes(localStorage.parent_project_id) && financeRoles.includes(localStorage.usr_role);

                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {

                        if(!proj_id_name.includes(localStorage.p_id_name)){
                            
                            if((idxAccess == "create") && (eleAccess == true)){
                                rightCorrHTML += `
                                    <div class="subButton" id = "document_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                        <span class="parentTagName">New Correspondence</span>
                                    </div>
                                    <div class="subButton" id = "document_bulk_corr_register" onclick = "linkJoget(this, \'myDocument\')">
                                        <span class="parentTagName">New Multiple Correspondence</span>
                                    </div>
                                    <div class="subButton" id = "document_corr_list_all" onclick = "linkJoget(this, \'myDocument\')">
                                        <span class="parentTagName">All Correspondence</span>
                                    </div>` 
                            }else if((idxAccess == "read") && (eleAccess == true)){
                                rightCorrHTML += `
                                                <div class="subButton" id = "document_corr_list_incoming" onclick = "linkJoget(this, \'myDocument\')">
                                                    <span class="parentTagName">Incoming</span>
                                                </div>                
                                                <div class="subButton" id = "document_corr_list_outgoing" onclick = "linkJoget(this, \'myDocument\')">
                                                    <span class="parentTagName">Outgoing</span>
                                                </div>`
                            }else if(((idxAccess == "confidential") && (eleAccess == true)) || isNCHFinance){
                                if(localStorage.project_owner == "MRSB"){
                                    rightCorrHTML += `
                                                <div class="subButton" id = "document_corr_list_incoming_conf" onclick = "linkJoget(this, \'myDocument\')">
                                                    <span class="parentTagName">Incoming Confidential</span>
                                                </div>                
                                                <div class="subButton" id = "document_corr_list_outgoing_conf" onclick = "linkJoget(this, \'myDocument\')">
                                                    <span class="parentTagName">Outgoing Confidential</span>
                                                </div>`
                                                    
                                }
                            }
                        }
                    }
                    if(localStorage.project_owner == "MRSB"){
                        rightCorrHTML += `
                        <div class="subButton" id = "document_corr_list_dismiss_notif" onclick = "linkJoget(this, \'myDocument\')">
                            <span class="parentTagName">Dismissed Notifications</span>
                        </div>`
                    }
                    else if(localStorage.project_owner == "UTSB"){
                        rightCorrHTML += `
                    <div class="subButton" id = "document_corr_list_dismiss_notif_utsb" onclick = "linkJoget(this, \'myDocument\')">
                        <span class="parentTagName">Dismissed Notifications</span>
                    </div>`
                    }
                }
                else if(idxSubProcess == "Project Information"){
                    
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if (['KACC', 'UTSB'].includes(localStorage.project_owner) && !proj_id_name.includes(localStorage.p_id_name)){
                            if((idxAccess == "create") && (eleAccess == true)){
                                rightProjInfoHTML += `
                                                <div class="subButton" id = "document_project_info_view" data-checkprojinfoset = "true" onclick = "linkJoget(this, \'projectInformation\')">
                                                    <span class="parentTagName">Project Information</span>
                                                </div>`
        
                            }
                        }
                        
                    }

                }
            }
        }
        else if (idxApp == "PFS_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                if(idxSubProcess == "ProjectDetails"){
                    if(localStorage.project_owner == "KACC"){ 
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "projectDetails") && (eleAccess == true)){
                                rightPfsProjDetHTML += `
                                    <div class="subButton" id = "finance_list_ProjectUserInfo" onclick = "linkJoget(this, \'myFinance\', \'projectDetailsCheck\')">
                                        <span class="parentTagName">Project Information</span>
                                    </div>
                                    <div class="subButton" id = "finance_list_WorkFlowApproval" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Workflow Approval</span>
                                    </div>
                                    <div class="subButton" id = "finance_list_FundingInfo" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Funding</span>
                                    </div>
                                    <div class="subButton" id = "finance_list_BudgetInfo" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Budget</span>
                                    </div>
                                    <div class="subButton" id = "finance_list_AuditInfo" data-checkworkflowset = "true" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Audit</span>
                                    </div>`;
                            }
                        }
                    }
                }
                else if (idxSubProcess == "Contract"){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if(localStorage.project_owner == "KACC"){ 
                            if((idxAccess == "contractsInbox") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_ContractInbox" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Inbox</span>
                                    </div>` 
                            }
                            else if((idxAccess == "publishedContracts") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_PublishedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Particulars</span>
                                    </div>`
                            }
                            else if((idxAccess == "newContract") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_NewContract" onclick = "linkJoget(this, \'myFinance\', \'contractApproval\')">
                                        <span class="parentTagName">New</span>
                                    </div>`
                            }
                            else if((idxAccess == "rejectedContracts") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_RejectedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Rejected</span>
                                    </div>`
                            }
                        }else if(localStorage.project_owner == "MRSB"){
                            if((idxAccess == "newContract") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_NewContract" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">New</span>
                                    </div>`
                            }else if((idxAccess == "publishedContracts") && (eleAccess == true)){
                                rightPfsContHTML += `
                                    <div class="subButton" id = "finance_list_PublishedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Published</span>
                                    </div>`
                            }
                        }
                    }
                }
                else if(idxSubProcess == "Claims"){
                    if(flagIc){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if(localStorage.project_owner == "KACC"){ 
                                if((idxAccess == "claimsInbox") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_ClaimInbox" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Inbox</span>
                                        </div>` 
                                }
                                else if((idxAccess == "currentClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_CurrentClaims" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Current</span>
                                        </div>` 
                                }
                                else if((idxAccess == "newClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_NewClaim" onclick = "linkJoget(this, \'myFinance\', \'claimApproval\')">
                                            <span class="parentTagName">New</span>
                                        </div>` 
                                }
                                else if((idxAccess == "rejectedClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_RejectedClaims" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Rejected</span>
                                        </div>` 
                                }
                                else if((idxAccess == "approvedClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedClaims" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName"> Approved</span>
                                        </div>` 
                                }
                            }else if(localStorage.project_owner == "MRSB"){
                                if((idxAccess == "newClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                        <div class="subButton" id = "finance_list_NewClaim" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">New</span>
                                        </div>` 
                                }
                                else if((idxAccess == "approvedClaims") && (eleAccess == true)){
                                    rightPfsClaimHTML += `
                                    <div class="subButton" id = "finance_list_ApprovedClaims" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName"> Summary</span>
                                    </div>`
                                }
                            }
                        }
                    }
                }
                else if(idxSubProcess == "VO"){
                    if(flagVo){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) { 
                            if(localStorage.project_owner == "KACC"){
                                if((idxAccess == "VOInbox") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_VOInbox" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Inbox</span>
                                        </div>` 
                                }
                                else if((idxAccess == "currentVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_CurrentVOs" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">PTIVO</span>
                                        </div>` 
                                }
                                else if((idxAccess == "newVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_NewVO" onclick = "linkJoget(this, \'myFinance\', \'VoApproval\')">
                                            <span class="parentTagName">New</span>
                                        </div>` 
                                }
                                else if((idxAccess == "rejectedVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_RejectedVOs" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Rejected PTIVO</span>
                                        </div>` 
                                }
                                else if((idxAccess == "approvedVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedVOs" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Approved</span>
                                        </div>` 
                                }
                            }else if(localStorage.project_owner == "MRSB"){
                                if((idxAccess == "newVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_NewVO" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">New</span>
                                        </div>` 
                                } else if((idxAccess == "approvedVO") && (eleAccess == true)){
                                    rightPfsVoHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedVOs" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Summary</span>
                                        </div>` 
                                }
                            }
                        }
                    }
                }
                else if (idxSubProcess == "ACS"){
                    if(localStorage.project_owner == "MRSB"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "newACS") && (eleAccess == true)){
                                rightPfsACSHTML += `
                                    <div class="subButton" id = "finance_list_NewACS" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">New</span>
                                    </div>` 
                            }
                            else if((idxAccess == "approvedACS") && (eleAccess == true)){
                                rightPfsACSHTML += `
                                    <div class="subButton" id = "finance_list_ApprovedACS" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Summary</span>
                                    </div>`
                            }
                        }
                    }
                }
                else if (idxSubProcess == "EOT"){
                    if(localStorage.project_owner == "MRSB"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "newEOT") && (eleAccess == true)){
                                rightPfsEOTHTML += `
                                    <div class="subButton" id = "finance_list_NewEOT" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">New</span>
                                    </div>` 
                            }
                            else if((idxAccess == "approvedEOT") && (eleAccess == true)){
                                rightPfsEOTHTML += `
                                    <div class="subButton" id = "finance_list_ApprovedEOT" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Summary</span>
                                    </div>`
                            }
                        }
                    }else if(localStorage.project_owner == "KACC"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if(localStorage.usr_role == "Planning Engineer"){
                                if((idxAccess == "newEOT") && (eleAccess == true)){
                                    rightPfsEOTHTML += `
                                        <div class="subButton" id = "finance_list_NewEOT" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">New</span>
                                        </div>` 
                                }else if((idxAccess == "approvedEOT") && (eleAccess == true)){
                                    rightPfsEOTHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedEOT" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Approved EOTs</span>
                                        </div>`
                                }
                            }else{
                                if((idxAccess == "approvedEOT") && (eleAccess == true)){
                                    rightPfsEOTHTML += `
                                        <div class="subButton" id = "finance_list_ApprovedEOT" onclick = "linkJoget(this, \'myFinance\')">
                                            <span class="parentTagName">Approved EOTs</span>
                                        </div>`
                                }
                            }
                        }
                    }
                }
                else if (idxSubProcess == "CA"){
                    if(localStorage.project_owner == "KACC"){
                        for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                            if((idxAccess == "amendmentInbox") && (eleAccess == true)){
                                rightPfsCAHTML += `
                                    <div class="subButton" id = "finance_list_AmendmentInbox" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Inbox</span>
                                    </div>` 
                            }
                            else if((idxAccess == "newAmendment") && (eleAccess == true)){
                                rightPfsCAHTML += `
                                    <div class="subButton" id = "finance_list_NewAmendment" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">New</span>
                                    </div>`
                            }
                            else if((idxAccess == "amendments") && (eleAccess == true)){
                                rightPfsCAHTML += `
                                    <div class="subButton" id = "finance_list_CurrentAmendments" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Contract</span>
                                    </div>`
                            }
                            else if((idxAccess == "archivedContracts") && (eleAccess == true)){
                                rightPfsCAHTML += `
                                    <div class="subButton" id = "finance_list_ArchivedContracts" onclick = "linkJoget(this, \'myFinance\')">
                                        <span class="parentTagName">Archived</span>
                                    </div>`
                            }
                        }
                    }
                }
                else if (idxSubProcess == "LU"){
                    if(localStorage.project_owner == "KACC"){
                        rightPfsLUHTML += `
                        <div class="subButton" id = "finance_list_ScheduleData" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Schedule Data</span>
                        </div>
                        <div class="subButton" id = "finance_list_ImportUnit" onclick = "linkJoget(this, \'myFinance\')">
                            <span class="parentTagName">Import Units</span>
                        </div>`;
                    }else if(localStorage.project_owner == "MRSB"){
                        rightPfsSetUpHTML += `
                        <div class="subButton" id = "finance_list_ConsultantList" onclick = "linkJoget(this, \'myFinance\')">
                        <span class="parentTagName">Consultants Set Up</span>
                    </div>`;
                    }
                }else if (idxSubProcess == "CF"){
                    if(localStorage.project_owner == "KACC"){
                        rightPfsCFHTML += `
                            <div class="subButton" id = "finance_list_NewCashOutflow" onclick = "linkJoget(this, \'myFinance\')">
                                <span class="parentTagName">Add</span>
                            </div>
                            <div class="subButton" id = "finance_list_CashOutflowList" onclick = "linkJoget(this, \'myFinance\')">
                                <span class="parentTagName">List</span>
                            </div>` ;
                    }
                }
            }
        }
        else if (idxApp == "Admin_Rights"){
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)){
                if((idxSubProcess == "Project") && eleSubProcess == true){
                    rightAdminProjDetHTML += `
                        <div class="subButton" id = "editcurrProject" rel = "main-project" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Edit</span>
                        </div>
                    `
                    
                    let constructPackage = JSON.parse(localStorage.appsLinks).constructPackage_name ? JSON.parse(localStorage.appsLinks).constructPackage_name : ''
                    if(constructPackage != ''){
                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "construct_issue_PPU" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">New Progress</span>
                            </div>
                        `

                        rightAdminProjDetHTML += `
                            <div class="subButton" id = "construct_list_PPU" rel = "main-project-dashboard" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">List Progress</span>
                            </div>
                        `
                    }
                }
                else if ((idxSubProcess == "UserDetails") && eleSubProcess == true){
                    rightAdminUserHTML += `
                        <div class="subButton" id = "listUsers" rel = "main-user" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">List User</span>
                        </div>
                        <div class="subButton" id = "addRemoveUsers" rel = "invitenewuserForm" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Add / Remove User</span>
                        </div>
                    `
                }
                else if ((idxSubProcess == "DataPool") && eleSubProcess == true){
                    rightAdminDataHTML += `
                        <div class="subButton" id = "otherData" rel = "main-layerdata" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">GIS, BIM & Reality Model</span>
                        </div>`
                    if(SYSTEM != 'OBYU'){
                        rightAdminDataHTML += `
                            <div class="subButton" id = "aerialData" rel = "main-aerial" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                <span class="parentTagName">Aerial Image</span>
                            </div>
                        `
                    }
                }
                else if ((idxSubProcess == "Schedule") && eleSubProcess == true){
                    rightAdminScheduleHTML += `
                        <div class="subButton" id = "addSchedule" rel = "main-schedule" onclick = "wizardOpenPageGantt(\'admin\')">
                            <span class="parentTagName">Add Schedule</span>
                        </div>
                        <div class="subButton" id = "mapSchedule" rel = "main-schedulemap" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                            <span class="parentTagName">Schedule Mapping</span>
                        </div>
                    `
                }
                else if ((idxSubProcess == "Config")){
                    for (const [idxAccess, eleAccess] of Object.entries(eleSubProcess)) {
                        if ((idxAccess == "Config") && eleAccess == true){
                            rightAdminConfigHTML += `
                                <div class="subButton" id = "configProjectWise365" rel = "main-projectwise365" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">ProjectWise 365</span>
                                </div>
                                <div class="subButton" id = "configProjectWise" rel = "main-projectwise" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">ProjectWise</span>
                                </div>
                                <div class="subButton" id = "configPowerBI" rel = "main-powerbi" onclick = "onFunctionProjAdmin(this, \'myAdmin\')">
                                    <span class="parentTagName">Power BI</span>
                                </div>
                            `
                        }
                    }
                    
                }
            }
        }
        else if (idxApp == "Construct_Apps_Rights") {
            for (const [idxSubProcess, eleSubProcess] of Object.entries(eleApp)) {
                (idxSubProcess == 'app_CAR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="CAR"><label>Corrective Action Request</label></div>` : '';
                (idxSubProcess == 'app_EVNT' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="EVNT"><label>Event</label></div>` : '';
                (idxSubProcess == 'app_IR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="IR"><label>Incident</label></div>` : '';
                (idxSubProcess == 'app_MS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="MS"><label>Material Submission</label></div>` : '';
                (idxSubProcess == 'app_MOS' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="MOS"><label>Method Statement</label></div>` : '';
                (idxSubProcess == 'app_NCR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="NCR"><label>Non Conformance Report</label></div>` : '';
                (idxSubProcess == 'app_NOI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="NOI"><label>Notice of Improvement</label></div>` : '';
                (idxSubProcess == 'app_PTW' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="PTW"><label>Permit To Work</label></div>` : '';
                (idxSubProcess == 'app_PUBC' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="PUBC"><label>Public Complaint</label></div>` : '';
                (idxSubProcess == 'app_RFI' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="RFI"><label>Request For Information</label></div>` : '';
                (idxSubProcess == 'app_RR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="RR"><label>Risk Register</label></div>` : '';
                (idxSubProcess == 'app_SDL' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="SDL"><label>Site Diary</label></div>` : '';
                (idxSubProcess == 'app_SD' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="SD"><label>Site Instruction</label></div>` : '';
                (idxSubProcess == 'app_WIR' && eleSubProcess == true) ? rightConopHTML += `<div class="item"><input type="checkbox" onchange="ConOpViewWholeList(this)" value="WIR"><label>Work Inspection Request</label></div>` : '';
            }
        }
    }

    //FOR DOCUMENT
    $("#setupSideMenu").html(rightSetupHTML) //setup right click
    $("#docSideMenu").html(rightDocHTML) //document right click
    $("#corrSideMenu").html(rightCorrHTML) //correspondence right click
    $("#projInfoSideMenu").html(rightProjInfoHTML) //project information right click - ONLY AT KACC & UTSB

    //FOR ELIBRARY
    $("#eLibDocSideMenu").html(rightDocHTML) //document right click

    //FOR PROJECT INFORMATION
    $("#projInfoDocSideMenu").html(rightDocHTML) //document right click

    if(SYSTEM == 'OBYU'){
        $('#projInfoDocSideMenu div').attr('onclick', 'linkJoget(this, \'projectInformation\')');
        $('#eLibDocSideMenu div').attr('onclick', 'linkJoget(this, \'eLibrary\')');
    }
    
    //FOR FINANCE
    $("#projectDetailSideMenu").html(rightPfsProjDetHTML) //contract right click
    $("#contractSideMenu").html(rightPfsContHTML) //contract right click
    $("#claimSideMenu").html(rightPfsClaimHTML) //claim right click
    $("#voSideMenu").html(rightPfsVoHTML) //claim right click
    $("#amendmentSideMenu").html(rightPfsCAHTML) //contract amendment right click
    $("#cashOutflowSideMenu").html(rightPfsCFHTML) //cash outflow right click
    $("#acsSideMenu").html(rightPfsACSHTML) //ACS right click
    $("#eotSideMenu").html(rightPfsEOTHTML) //EOT right click
    $("#lookupSideMenu").html(rightPfsLUHTML) //lookup right click
    $("#setUpFinanceSideMenu").html(rightPfsSetUpHTML) //setup right click
    
    //FOR PROJECT ADMIN
    $("#editProjectSideMenu").html(rightAdminProjDetHTML) //edit the project information right click
    $("#userSideMenu").html(rightAdminUserHTML) //user list right click
    $("#dataSideMenu").html(rightAdminDataHTML) //data pool & aerial image right click
    $("#scheduleSideMenu").html(rightAdminScheduleHTML) //schedule right click
    $("#configSideMenu").html(rightAdminConfigHTML) //configuration project wise right click

    //FOR CONSTRUCT APP
    $("#conOp").html(rightConopHTML) //add ConOp list in Layer to respective div
    $("#conopList").html(rightTabList) //add conop tab for ConOp Browser
    $("#detachWidgetConopList").html(rightTabDetactList) //add conop tab for ConOp Browser
    $("#valueProceessConstruct").html(rightConopChoice) //add process list
    $("#valueSetupConstruct").html(rightSetupChoice) //add setup list
    $("#valueManageConstruct").html(rightManageChoice) //add manage list
    $("#valueProceessConstruct1").html(rightConopChoice) //add process list for myProject left click menu
    $("#valueManageConstruct1").html(rightManageChoice) //add manage list for myProject left click menu
    $("#processNamebulk").html(exportList) //add manage list for myProject left click menu

    // For Finance Page
    $('.myFinance.claimsPer').hide();
    $('.myFinance.budget').hide();
}

function dashboardSetupLink(){
    let dashboard = '';
    let dashHTML = '';

    let dashbSabah = {
        "projSummary" : {
            "Project Summary" : "../Dashboard/v3/projectSummary.php",
        },
        "bumiDash" : {
            "Bumiputera" : "../Dashboard/v3/Bumi_PBHS.php",
        },
        "contractDash" : {
            "Contract" : "../Dashboard/v3/procurement_PBHS.php",
        },
        "docDash" : {
            "Document" : "../Dashboard/v3/Document_PBHS.php"
        },
        "pubcDash" : {
            "General Management" : "../Dashboard/v3/PublicComplaint_PBHS.php"
        },
        "hsetDash" : {
            "HSET" : "../Dashboard/v3/HSE_PBHS.php"
        },
        "landDash" : {
            "Land" : "../Dashboard/v3/Land_PBHS.php"
        },
        "reportSubmissionDash" : {
            "Planning Management" : "../Dashboard/v3/PlanningManagement_PBHS.php"
        },
        "qualityDash" : {
            "Quality" : "../Dashboard/v3/Quality_PBHS.php"
        },
        "riskDash" : {
            "Risk" : "../Dashboard/v3/Risk_PBHS.php"
        },
        "urwDash" : {
            "URW" : "../Dashboard/v3/Utilities_PBHS.php"
        }
        
    };

    let dashbSarawak = {
        "projSummary" : {
            "Project Summary" : "../Dashboard/v3/projectSummary.php",
        },
        "bumiDash" : {
            "Bumiputera" : "../Dashboard/v3/Bumi.php",
        },
        "contractDash" : {
            "Contract" : "../Dashboard/v3/procurement.php"
        },
        "docDash" : {
            "Document" : "../Dashboard/v3/Document.php"
        },
        "pubcDash" : {
            "General Management" : "../Dashboard/v3/PublicComplaint.php"
        },
        "hsetDash" : {
            "HSET" : "../Dashboard/v3/HSE.php"
        },
        "qualityDash" : {
            "Quality" : "../Dashboard/v3/Quality.php"
        },
        "riskDash" : {
            "Risk" : "../Dashboard/v3/Risk.php"
        }
    };

    let dashbAssetSabah = {
        "statisticDash" : {
            "Asset Statistic" : "../Dashboard/v3/statistic.php"
        },
        "nodDash" : {
            "APJ / KPJ" : "../Dashboard/v3/NOD.php"
        },
        "maintenanceProgressDash" : {
            "Maintenance Progress" : "../Dashboard/v3/maintenanceProgress.php"
        },
        "heavyMaintenanceDash" : {
            "Periodic Maintenance" : (localStorage.isParent == "isParent") ? "../Dashboard/v3/heavyMaintenance.php" : "../Dashboard/v3/heavyMaintenancePackage.php"
        }
    };

    let dashbAssetSarawak = {
        "statisticDash" : {
            "Asset Statistic" : "../Dashboard/v3/statistic.php"
        },
        "nodDash" : {
            "APJ / KPJ" : "../Dashboard/v3/NOD.php"
        },
        "maintenanceProgressDash" : {
            "Maintenance Progress" : "../Dashboard/v3/maintenanceProgress.php"
        },
        "heavyMaintenanceDash" : {
            "Periodic Maintenance" : (localStorage.isParent == "isParent") ? "../Dashboard/v3/heavyMaintenance.php" : "../Dashboard/v3/heavyMaintenancePackage.php"
        }
    };

    let dashKACC = {
        "projSummary" : {
            "Project Summary" : "../Dashboard/V3/OBYU/extend/dashboard_KACC/summary.php?noHeader=1&noFilter=1",
        },
        "costDash" : {
            "Cost Management" : "../Dashboard/V3/OBYU/extend/dashboard_KACC/cost.php?noHeader=1&noFilter=1"
        },
        "docDash" : {
            "Document Management" : "../Dashboard/V3/OBYU/extend/dashboard_KACC/Document.php?noHeader=1&noFilter=1"
        },
        "qualityQaqcDash" : {
            "QAQC Management" : "../Dashboard/V3/OBYU/extend/dashboard_KACC/qaqc.php?noHeader=1&noFilter=1"
        },
        "qualitySheDash" : {
            "SHE Management" : "../Dashboard/V3/OBYU/extend/dashboard_KACC/she.php?noHeader=1&noFilter=1"
        },
        "timeDash" : {
            "Time Management" : "../Dashboard/V3/OBYU/extend/dashboard_KACC/timeManagement.php?noHeader=1&noFilter=1",
        }
    };

    let dashMRSB = {
        "projSummary" : {
            "Project Summary" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/main.php?noHeader=1&noFilter=1",
        },
        "costDash" : {
            "Cost Management" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/cost.php?noHeader=1&noFilter=1"
        },
        "docDash" : {
            "Document Management" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/Document.php?noHeader=1&noFilter=1"
        },
        "hsetDash" : {
            "HSET Management" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/HSET.php?noHeader=1&noFilter=1"
        },
        "landDash" : {
            "Land Management" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/land.php?noHeader=1&noFilter=1"
        },
        "qualityDash" : {
            "Quality Management" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/qaqc.php?noHeader=1&noFilter=1"
        },
        "riskDash" : {
            "Risk Management" : (localStorage.isParent == "isParent") ? "../Dashboard/V3/OBYU/extend/dashboard_MRSB/Risk.php?noHeader=1&noFilter=1" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/RiskPackage.php?noHeader=1&noFilter=1"
        },
        "stakeDash" : {
            "Stakeholder Management" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/stakeholder.php?noHeader=1&noFilter=1"
        },
        "timeDash" : {
            "Time Management" : "../Dashboard/V3/OBYU/extend/dashboard_MRSB/time.php?noHeader=1&noFilter=1",
        }
        
    };

    let dashUTSB = {
        "docDash" : {
            "Document Management" : "../Dashboard/V3/OBYU/extend/dashboard_UTSB/Document.php?noHeader=1&noFilter=1"
        },
    };

    let procurement_dash = "";
    let quality_dash = "";
    if(localStorage.contractLevel == "UPSTREAM"){
        procurement_dash = "../Dashboard/v3/procurement_SSLR2.php"
        quality_dash = "../Dashboard/v3/Quality_SSLR2.php"
    }else if(localStorage.contractLevel == "DOWNSTREAM"){
        procurement_dash = "../Dashboard/v3/procurement_SSLR2_DS.php"
        quality_dash = "../Dashboard/v3/Quality_SSLR2_DS.php"
    }

    let dashbSSLR2 = {
        "projSummary" : {
            "Project Summary" : "../Dashboard/v3/projectSummary.php",
        },
        "bumiDash" : {
            "Bumiputera" : "../Dashboard/v3/Bumi_SSLR2.php",
        },
        "contractDash" : {
            "Contract" : procurement_dash
        },
        "docDash" : {
            "Document" : "../Dashboard/v3/Document_SSLR2.php"
        },
        "pubcDash" : {
            "General Management" : "../Dashboard/v3/PublicComplaint_SSLR2.php"
        },
        "hsetDash" : {
            "HSET" : "../Dashboard/v3/HSE_SSLR2.php"
        },
        "landDash" : {
            "Land" : "../Dashboard/v3/Land_SSLR2.php"
        },
        "qualityDash" : {
            "Quality" : quality_dash
        }
    };

    let dashbSSLR2_upstream = {
        "contractDash" : {
            "Contract" : procurement_dash
        },
        "docDash" : {
            "Document" : "../Dashboard/v3/Document_SSLR2.php"
        }
    };

    if(localStorage.Project_type == "ASSET"){
        if(localStorage.isParent !== "isParent"){
            let packageDashAsset = {
                    "pcaAnalysisDash" : {
                        "PCA Analysis" : "../Dashboard/v3/pca_Analysis.php"
                    },
                    "pcaStripmapDash" : {
                        "PCA Stripmap" : "../Dashboard/v3/PCA_Stripmap.php"
                    },
                }
    
            Object.assign(dashbAssetSarawak, packageDashAsset)
            Object.assign(dashbAssetSabah, packageDashAsset)
        }
    }

    if(localStorage.project_owner == "JKR_SABAH"){
        if(localStorage.Project_type == 'ASSET'){
            dashboard = dashbAssetSabah;
        }else{
            dashboard = dashbSabah;
        }
    }
    else if(localStorage.project_owner == "JKR_SARAWAK"){
        if(localStorage.Project_type == 'ASSET'){
            dashboard = dashbAssetSarawak;
        }else{
            dashboard = dashbSarawak;
        }
        
    }
    else if (localStorage.project_owner == "KACC"){
        dashboard = dashKACC;
    }
    else if (localStorage.project_owner == "MRSB"){
        dashboard = dashMRSB;
    }
    else if (localStorage.project_owner == "UTSB"){
        dashboard = dashUTSB;
    }
    else if(localStorage.project_owner == "SSLR2"){
        if(localStorage.Project_type == 'ASSET'){
            dashboard = dashbAssetSarawak;
        }else{
            if(IS_DOWNSTREAM){
                dashboard = dashbSSLR2;
            }else{
                dashboard = dashbSSLR2_upstream;
            }
        }
        
    }
    for (const [idx, ele] of Object.entries(dashboard)) {
        for (const [idx2, ele2] of Object.entries(ele)) {
            if(localStorage.isParent != "isParent" && idx == "bumiDash"){
                continue
            }
            dashHTML += `
                <div class="subButton" id = "`+idx+`" onclick = "linkDashboard(this, '`+ele2+`', 'myDashboard', '`+idx2+`')">
                    <span class="parentTagName">`+idx2+`</span>
                </div>`
        }
    }

    $("#dashboardSideMenu").html(dashHTML)
    $('#dashboardSideMenu').children().removeClass("active")
    $('#dashboardSideMenu').children(":first").addClass("active")

    setFilterDashboard();
}

function setAccessForInsight(){
    //FOR KKR
    var pageOpen = localStorage.page_pageOpen;

    if(localStorage.Project_type == "ASSET"){
        if(localStorage.isParent == "isParent"){
            $(".tool.asset").css("display", "none")
        }else{
            $(".tool.asset").css("display", "flex")
        }
        $(".tool.construct").css("display", "none")
        $(".tool.fm").css("display", "none")
        $("#assetProcess.buttonContainer." + pageOpen).addClass("show")
        $("#constructionProcess.buttonContainer." + pageOpen).removeClass("show")
        $(".group.asset").css("display", "block")
        $(".group.conOp").css("display", "none")
        $(".tool.iot").css("display", "none")

        if(localStorage.isParent !== "isParent"){
            $(".toolButton.inventory").css("display", "flex")
            $(".toolButton.assetlist").css("display", "none")
            $(".toolButton.asset").css("display", "flex")
            $(".toolButton.paveUpload").css("display", "flex")
            $(".toolButton.paveReport").css("display", "flex")
        }
        else{
            $(".toolButton.inventory").css("display", "none")
            $(".toolButton.assetlist").css("display", "none")
            $(".toolButton.asset").css("display", "none")
            $(".toolButton.paveUpload").css("display", "none")
            $(".toolButton.paveReport").css("display", "none")
        }

        $('button.toolButton[title="Asset List"]').css("display", "flex");
    }
    else if(localStorage.Project_type == "CONSTRUCT"){
        $(".tool.asset").css("display", "none")
        $(".tool.construct").css("display", "flex")
        $(".tool.fm").css("display", "none")
        $("#assetProcess.buttonContainer." + pageOpen).removeClass("show")
        $("#constructionProcess.buttonContainer." + pageOpen).addClass("show")
        $(".group.asset").css("display", "none")
        $(".group.conOp").css("display", "block")
        $(".tool.iot").css("display", "none")

        if(localStorage.isParent !== "isParent"){
            $(".toolButton.bumi").css("display", "none")
            $(".toolButton.conop").css("display", "flex")
            // $(".toolButton.setup").css("display", "flex")
            $(".toolButton.manage").css("display", "flex")
            $(".toolButton.bulk").css("display", "flex")

            $('.toolButton.bulk').css("display", "flex")
            $('#constructionProcess').find('#createBulkRegister').css("display", "flex")
        }
        else{
            $(".toolButton.conop").css("display", "none")
            $(".toolButton.setup").css("display", "none")
            $(".toolButton.manage").css("display", "none")
            $(".toolButton.bulk").css("display", "none")
            $(".toolButton.bumi").css("display", "flex")
        }
        $('button.toolButton[title="Asset List"]').css("display", "flex");

    }
    else if(localStorage.Project_type == "FM"){
        $(".tool.iot").css("display", "flex")

        $(".tool.asset").css("display", "none")
        $(".tool.construct").css("display", "none")
        $(".tool.fm").css("display", "flex")
        $("#assetProcess.buttonContainer." + pageOpen).addClass("show")
        $("#constructionProcess.buttonContainer." + pageOpen).removeClass("show")
        $(".group.asset").css("display", "block")
        $(".group.conOp").css("display", "none")

        $(".toolButton.assetlist").css("display", "flex")
        $(".toolButton.asset").css("display", "flex")
        $(".toolButton.paveUpload").css("display", "flex")
        $(".toolButton.paveReport").css("display", "flex")   
                
        $('button.toolButton[title="Asset List"]').css("display", "none");
    }

    //FOR OBYU
    if(localStorage.project_owner == "KACC" || localStorage.project_owner == "MRSB"){
        $(".tool.asset").css("display", "none")
        $(".tool.construct").css("display", "flex")
        $(".tool.fm").css("display", "none")
        $("#assetProcess.buttonContainer." + pageOpen).removeClass("show")
        $("#constructionProcess.buttonContainer." + pageOpen).addClass("show")
        $(".group.asset").css("display", "none")
        $(".group.conOp").css("display", "block")
        $(".tool.iot").css("display", "none")

        if(localStorage.isParent !== "isParent"){
            $(".toolButton.bumi").css("display", "none")
            $(".toolButton.conop").css("display", "flex")
            $(".toolButton.setup").css("display", "flex")
            $(".toolButton.manage").css("display", "flex")
            $(".toolButton.bulk").css("display", "flex")
        }
        else{
            $(".toolButton.conop").css("display", "none")
            $(".toolButton.setup").css("display", "none")
            $(".toolButton.manage").css("display", "none")
            $(".toolButton.bulk").css("display", "none")
            $(".toolButton.bumi").css("display", "flex")
        }

    }
    else if(localStorage.project_owner == "UTSB"){
        $(".tool.asset").css("display", "none")
        $(".tool.construct").css("display", "none")
        $(".tool.fm").css("display", "none")
        $(".group.asset").css("display", "none")
        $(".group.conOp").css("display", "none")
        $(".tool.iot").css("display", "none")
    }

    if(checkAdminAccess(localStorage.usr_role)){
        $(".tool.admin").css("display", "block")
    }
    else{
        $(".tool.admin").css("display", "none")
    }
}

function linkDashboard(ele, link, frameId, dashName){

    flagChangeDashboard = true;

    $('#dashboardSideMenu .subButton').removeClass("active")

    $('.packFilter.'+frameId).prop('selectedIndex',0);
    $('.sectFilter.'+frameId).prop('selectedIndex',0);
    $('.yrFilter.'+frameId).prop('selectedIndex',0);
    $('.mthFilter.'+frameId).prop('selectedIndex',0);
    $('.mthFilter.'+frameId).prop("disabled", "disabled");
    $('.categoryFilter.'+frameId).prop('selectedIndex',0);
    $('.statusPubcFilter.'+frameId).prop('selectedIndex',0);
    $('.statusPubcSbhFilter.'+frameId).prop('selectedIndex',0);
    $('.statusLandFilter.'+frameId).prop('selectedIndex',0);
    $('.sourceFilter.'+frameId).prop('selectedIndex',0);
    $('.reportCategoryFilter.'+frameId).prop('selectedIndex',0);
    $('.reportStatusFilter.'+frameId).prop('selectedIndex',0);
    $('.categoryRiskFilter.'+frameId).prop('selectedIndex',0);
    $('.riskRatingFilter.'+frameId).prop('selectedIndex',0);
    $('.lcmNoFilter.'+frameId).prop('selectedIndex',0);
    $('.districtFilter.'+frameId).prop('selectedIndex',0);
    $('.issueStatus.'+frameId).prop('selectedIndex',0);
    $('.catgGenMgmt.'+frameId).prop('selectedIndex',0);
    $('.typeGenMgmt.'+frameId).prop('selectedIndex',0);
    $('.assetDateFilter.'+frameId).prop('selectedIndex',0);
    $('.assetLaneFilter.'+frameId).prop('selectedIndex',0);
    $('.assetDirectionToFilter.'+frameId).prop('selectedIndex',0);
    $('.assetChainFromFilter.'+frameId).prop('selectedIndex',0);
    $('.assetChainToFilter.'+frameId).prop('selectedIndex',0);
    $('.assetApjFilter.'+frameId).prop('selectedIndex',0);
    $('.assetTypeFilter.'+frameId).prop('selectedIndex',0);
    $('.subActivityFilter.'+frameId).prop('selectedIndex',0);
    $('.assetRoutineActivityFilter.'+frameId).prop('selectedIndex',0);
    $('.assetGroupFilter.'+frameId).prop('selectedIndex',0);

    $('.packFilter.'+frameId).css("display", "none");
    $('.sectFilter.'+frameId).css("display", "none");
    $('.yrFilter.'+frameId).css("display", "none");
    $('.mthFilter.'+frameId).css("display", "none");
    $('.categoryFilter.'+frameId).css("display", "none");
    $('.statusPubcFilter.'+frameId).css("display", "none");
    $('.statusPubcSbhFilter.'+frameId).css("display", "none");
    $('.statusLandFilter.'+frameId).css("display", "none");
    $('.sourceFilter.'+frameId).css("display", "none");
    $('.reportCategoryFilter.'+frameId).css("display", "none");
    $('.reportStatusFilter.'+frameId).css("display", "none");
    $('.categoryRiskFilter.'+frameId).css("display", "none");
    $('.riskRatingFilter.'+frameId).css("display", "none");
    $('.lcmNoFilter.'+frameId).css("display", "none");
    $('.districtFilter.'+frameId).css("display", "none");
    $('.issueStatus.'+frameId).css("display", "none");
    $('.catgGenMgmt.'+frameId).css("display", "none");
    $('.typeGenMgmt.'+frameId).css("display", "none");
    $('.assetDateFilter.'+frameId).css("display", "none");
    $('.assetLaneFilter.'+frameId).css("display", "none");
    $('.assetDirectionToFilter.'+frameId).css("display", "none");
    $('.assetChainFromFilter.'+frameId).css("display", "none");
    $('.assetChainToFilter.'+frameId).css("display", "none");
    $('.assetApjFilter.'+frameId).css("display", "none");
    $('.assetTypeFilter.'+frameId).css("display", "none");
    $('.subActivityFilter.'+frameId).css("display", "none");
    $('.assetRoutineActivityFilter.'+frameId).css("display", "none");
    $('.assetGroupFilter.'+frameId).css("display", "none");
    
    //show filter when already change the dashboard 
    if(localStorage.isParent == "isParent"){
        $(".packFilter.myDashboard").css("display", "inline-block")
    }

    if(localStorage.project_owner == "JKR_SARAWAK"){
        if(localStorage.Project_type == "ASSET"){
            switch (dashName) {
                case 'APJ / KPJ':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".assetApjFilter.myDashboard").css("display", "inline-block")

                    dashName = fullNameAPJKPJ;
                break;
                case 'PCA Stripmap':
                    $(".assetDateFilter.myDashboard").css("display", "inline-block")
                    $(".assetLaneFilter.myDashboard").css("display", "inline-block")
                    $(".assetDirectionToFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainFromFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainToFilter.myDashboard").css("display", "inline-block")
                break;
                case 'PCA Analysis':
                    $(".assetDateFilter.myDashboard").css("display", "inline-block")
                    $(".assetLaneFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainFromFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainToFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Maintenance Progress':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".assetRoutineActivityFilter.myDashboard").css("display", "inline-block")
                    $(".subActivityFilter.myDashboard").css("display", "inline-block")
                    $(".assetTypeFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Periodic Maintenance':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    if(localStorage.isParent == "isParent"){
                        $(".assetGroupFilter.myDashboard").css("display", "none")
                    }else{
                        $(".assetGroupFilter.myDashboard").css("display", "inline-block")
                    }
                break;
            }
        }else{
            switch (dashName) {
                case 'Bumiputera':
                    $(".categoryFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Contract':
                    $(".sectFilter.myDashboard").css("display", "inline-block")
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Document':
                    $(".sectFilter.myDashboard").css("display", "inline-block")
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'General Management':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".statusPubcFilter.myDashboard").css("display", "inline-block")
                break;
                case 'HSET':
                    $(".sectFilter.myDashboard").css("display", "inline-block")
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Quality':
                    $(".sectFilter.myDashboard").css("display", "inline-block")
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Risk':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
            }
        }
    }
    else if (localStorage.project_owner == "JKR_SABAH"){
        if(localStorage.Project_type == "ASSET"){
            switch (dashName) {
                case 'APJ / KPJ':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".assetApjFilter.myDashboard").css("display", "inline-block")

                    dashName = fullNameAPJKPJ;
                break;
                case 'PCA Stripmap':
                    $(".assetDateFilter.myDashboard").css("display", "inline-block")
                    $(".assetLaneFilter.myDashboard").css("display", "inline-block")
                    $(".assetDirectionToFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainFromFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainToFilter.myDashboard").css("display", "inline-block")
                break;
                case 'PCA Analysis':
                    $(".assetDateFilter.myDashboard").css("display", "inline-block")
                    $(".assetLaneFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainFromFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainToFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Maintenance Progress':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".assetRoutineActivityFilter.myDashboard").css("display", "inline-block")
                    $(".assetTypeFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Periodic Maintenance':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".assetGroupFilter.myDashboard").css("display", "inline-block")
                break;
            }
        }else{
            switch (dashName) {
                case 'Bumiputera':
                    $(".categoryFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Contract':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Document':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'General Management':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".statusPubcSbhFilter.myDashboard").css("display", "inline-block")
                break;
                case 'HSET':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Land':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".lcmNoFilter.myDashboard").css("display", "inline-block")
                    $(".districtFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Planning Management':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".reportCategoryFilter.myDashboard").css("display", "inline-block")
                    $(".reportStatusFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Quality':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Risk':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".categoryRiskFilter.myDashboard").css("display", "inline-block")
                    $(".riskRatingFilter.myDashboard").css("display", "inline-block")
                break;
                case 'URW':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
            }
        }
    }
    else if(localStorage.project_owner == "KACC"){
        switch (dashName) {
            case 'Project Summary':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Cost Management':
                $(".sectFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Document Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'QAQC Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'SHE Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Time Management':
                $(".sectFilter.myDashboard").css("display", "inline-block")
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
        };
        widgetConopClose();
    }
    else if(localStorage.project_owner == "MRSB"){
        switch (dashName) {
            case 'Project Summary':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Document Management':
                $(".sectFilter.myDashboard").css("display", "inline-block")
            break;
            case 'QAQC Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'HSET Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Land Management':
                $(".packFilter.myDashboard").css("display", "none")
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Quality Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Stakeholder Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Time Management':
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
            case 'Risk Management':
                $(".packFilter.myDashboard").css("display", "none")
                $(".yrFilter.myDashboard").css("display", "inline-block")
                $(".mthFilter.myDashboard").css("display", "inline-block")
            break;
        };
        widgetConopClose();
    }else if(localStorage.project_owner == "SSLR2"){
        if(localStorage.Project_type == "ASSET"){
            switch (dashName) {
                case 'APJ / KPJ':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".assetApjFilter.myDashboard").css("display", "inline-block")

                    dashName = fullNameAPJKPJ;
                break;
                case 'PCA Stripmap':
                    $(".assetDateFilter.myDashboard").css("display", "inline-block")
                    $(".assetLaneFilter.myDashboard").css("display", "inline-block")
                    $(".assetDirectionToFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainFromFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainToFilter.myDashboard").css("display", "inline-block")
                break;
                case 'PCA Analysis':
                    $(".assetDateFilter.myDashboard").css("display", "inline-block")
                    $(".assetLaneFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainFromFilter.myDashboard").css("display", "inline-block")
                    $(".assetChainToFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Maintenance Progress':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".assetRoutineActivityFilter.myDashboard").css("display", "inline-block")
                    $(".subActivityFilter.myDashboard").css("display", "inline-block")
                    $(".assetTypeFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Periodic Maintenance':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    if(localStorage.isParent == "isParent"){
                        $(".assetGroupFilter.myDashboard").css("display", "none")
                    }else{
                        $(".assetGroupFilter.myDashboard").css("display", "inline-block")
                    }
                break;
            }
        }else{

            if(localStorage.contractLevel == "DOWNSTREAM"){
                $(".sectFilter.myDashboard").css("display", "none !important")
            } else {
                $(".sectFilter.myDashboard").css("display", "inline-block")
            }

            switch (dashName) {
                case 'Bumiputera':
                    $(".categoryFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Contract':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Document':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'General Management':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".statusPubcFilter.myDashboard").css("display", "inline-block")
                    $(".catgGenMgmt.myDashboard").css("display", "inline-block")
                    $(".typeGenMgmt.myDashboard").css("display", "none")
                break;
                case 'HSET':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Land':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                    $(".issueStatus.myDashboard").css("display", "inline-block")
                break;
                case 'Quality':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
                case 'Risk':
                    $(".yrFilter.myDashboard").css("display", "inline-block")
                    $(".mthFilter.myDashboard").css("display", "inline-block")
                break;
            }
        }
    }

    iframe = $("iframe#"+frameId);
    $(ele).addClass("active");
    $('.myDashboard > .contentContainer > .head > h2').html(`${dashName} - ${localStorage.p_name}`);
        
    const active = $("#dashboardSideMenu").children(".active").text().trim();
    const $option = $("select.packFilter.myDashboard option[value='PMO-NCH']");

    if (active === "Cost Management" && localStorage.project_owner === "MRSB") {
        $option.hide();
    } else {
        $option.show();
    }

    var loading = $('.loader');
    loading.fadeIn();

    iframe.hide();
    iframe.attr("src", "");
    iframe.attr("src", link);
    iframe.on("load", function () {
        
        iframe.show();
    });
}

function linkJoget(ele, frameId, checkAnotherSetup = false){

    var url;

    flagChangeJoget = true;
    if(frameId == "myDocument" || frameId == "myFinance"){
        $(".packFilter." +frameId).css("display", "none")
        $(".sectFilter." +frameId).css("display", "none")
        $(".yrFilter." +frameId).css("display", "none")
        $(".mthFilter." +frameId).css("display", "none")

        leftMenuButtonHightlight(ele)
    }

    let linkSet = $(ele).attr("id");
    let checkWorklow = $(ele).data("checkworkflowset");
    let checkProjectInfoDoc = $(ele).data("checkprojinfoset");

    let functionCheck = "";
    let messageAlert = "";
    let settextVO = ((localStorage.project_owner) && localStorage.project_owner == 'JKR_SABAH') ? "VO": "KPK";
    let runcheckPFS = false;

    var loading = $('#loaderHome');
    loading.fadeIn();

    checkActiveMainPage(linkSet,frameId)

    if(linkSet !== "" && linkSet == "doc_bulk_doc_register"){

        let docBulkUploadTemplatePath = "";
        let myhtml = "";

        if(localStorage.project_owner == "JKR_SARAWAK"){
            docBulkUploadTemplatePath = '../Templates/Document_Template_SRWK.xlsx';
        }else if(localStorage.project_owner == "SSLR2"){
            docBulkUploadTemplatePath = '../Templates/Document_Template_sslr.xlsx';
        }else{
            docBulkUploadTemplatePath = '../Templates/Document_Template.xlsx';
        }
        
        myhtml += "<a href='" + docBulkUploadTemplatePath + "' download> Bulk Document Register Template.xlsx</a><br></br>";
        $(".templateContainer").html(myhtml);
        $(".templateContainer").css("display", "block");

    }else if(linkSet !== "" && linkSet == "doc_bulk_corr_register"){

        let corrBulkUploadTemplatePath = "";
        let myhtml = "";
    
        if(localStorage.project_owner == "JKR_SARAWAK"){
            corrBulkUploadTemplatePath = '../Templates/Correspondence_Template_SRWK.xlsx';
        }else if(localStorage.project_owner == "SSLR2"){
            corrBulkUploadTemplatePath = '../Templates/Correspondence_Template_sslr.xlsx';
        }else{
            corrBulkUploadTemplatePath = '../Templates/Correspondence_Template.xlsx';
        }
    
        myhtml += "<a href='" + corrBulkUploadTemplatePath+ "' download> Bulk Correspondence Register Template.xlsx</a><br>";
        $(".templateContainer").html(myhtml);
        $(".templateContainer").css("display", "block");

    }else if(linkSet !== "" && linkSet == "document_bulk_upload"){

        let docBulkUploadTemplatePathMRSB = "";
        let docBulkUploadTemplatePathKACC = "";
        let docBulkUploadTemplatePathUTSB = "";
        let myhtml = "";
    
        if(localStorage.project_owner == "MRSB"){
            docBulkUploadTemplatePathMRSB = '../Templates/MRSB';
            myhtml += "<a href='" + docBulkUploadTemplatePathMRSB+ "/MRSB - Bulk Template (General).xlsx' download> MRSB - Bulk Template (General).xlsx</a><br>";
            myhtml += "<a href='" + docBulkUploadTemplatePathMRSB+ "/MRSB - Bulk Template (Drawing).xlsx' download> MRSB - Bulk Template (Drawing).xlsx</a><br>";
        }else if(localStorage.project_owner == "KACC"){
            docBulkUploadTemplatePathKACC = '../Templates/KACC';

            if(localStorage.p_id_name == "eLibrary"){
                myhtml += "<a href='" + docBulkUploadTemplatePathKACC+ "/KACC - Bulk Template (E-Library Project).xlsx' download> KACC - Bulk Template (E-Library Project).xlsx</a><br>";
            }else if(localStorage.p_id_name == "eLibrary"){
                myhtml += "<a href='" + docBulkUploadTemplatePathKACC+ "/KACC - Bulk Template (Project Information Project).xlsx' download> KACC - Bulk Template (Project Information Project).xlsx</a><br>";
            }else{
                myhtml += "<a href='" + docBulkUploadTemplatePathKACC+ "/KACC - Bulk Template (Drawing).xlsx' download> KACC - Bulk Template (Drawing).xlsx</a><br>";
                myhtml += "<a href='" + docBulkUploadTemplatePathKACC+ "/KACC - Bulk Template (General).xlsx' download> KACC - Bulk Template (General).xlsx</a><br>";
                myhtml += "<a href='" + docBulkUploadTemplatePathKACC+ "/KACC - Bulk Template (Other).xlsx' download> KACC - Bulk Template (Other).xlsx</a><br>";
                myhtml += "<a href='" + docBulkUploadTemplatePathKACC+ "/KACC - Bulk Template (Project Information).xlsx' download> KACC - Bulk Template (Project Information).xlsx</a><br>";
                myhtml += "<a href='" + docBulkUploadTemplatePathKACC+ "/KACC - Bulk Template (Report).xlsx' download> KACC - Bulk Template (Report).xlsx</a><br>";
            }
        }else if(localStorage.project_owner == "UTSB"){
            docBulkUploadTemplatePathUTSB = '../Templates/UTSB';
            myhtml += "<a href='" + docBulkUploadTemplatePathUTSB+ "/UTSB - Bulk Template (Drawing).xlsx' download> UTSB - Bulk Template (Drawing).xlsx</a><br>";
            myhtml += "<a href='" + docBulkUploadTemplatePathUTSB+ "/UTSB - Bulk Template (General).xlsx' download> UTSB - Bulk Template (General).xlsx</a><br>";
            myhtml += "<a href='" + docBulkUploadTemplatePathUTSB+ "/UTSB - Bulk Template (IPA).xlsx' download> UTSB - Bulk Template (IPA).xlsx</a><br>";
            myhtml += "<a href='" + docBulkUploadTemplatePathUTSB+ "/UTSB - Bulk Template (LOA).xlsx' download> UTSB - Bulk Template (LOA).xlsx</a><br>";
            myhtml += "<a href='" + docBulkUploadTemplatePathUTSB+ "/UTSB - Bulk Template (MOM).xlsx' download> UTSB - Bulk Template (MOM).xlsx</a><br>";
            myhtml += "<a href='" + docBulkUploadTemplatePathUTSB+ "/UTSB - Bulk Template (Others).xlsx' download> UTSB - Bulk Template (Others).xlsx</a><br>";
            myhtml += "<a href='" + docBulkUploadTemplatePathUTSB+ "/UTSB - Bulk Template (Report).xlsx' download> UTSB - Bulk Template (Report).xlsx</a><br>";
        }
    
        $(".templateContainer").html(myhtml);
        $(".templateContainer").css("display", "block");

    }else if(linkSet !== "" && linkSet == "document_bulk_corr_register"){

        let corrBulkUploadTemplatePathMRSB = "";
        let corrBulkUploadTemplatePathKACC = "";
        let corrBulkUploadTemplatePathUTSB = "";
        let myhtml = "";

        if(localStorage.project_owner == "MRSB"){
            corrBulkUploadTemplatePathMRSB = '../Templates/MRSB';
            if(localStorage.parent_project_id == "NCH"){
                myhtml += "<a href='" + corrBulkUploadTemplatePathMRSB+ "/MRSB -Bulk Correspondence Register Template - NCH.xlsx' download> MRSB -Bulk Correspondence Register Template.xlsx</a><br>";
            }else{
                myhtml += "<a href='" + corrBulkUploadTemplatePathMRSB+ "/MRSB -Bulk Correspondence Register Template.xlsx' download> MRSB -Bulk Correspondence Register Template.xlsx</a><br>";
            }
        }else if(localStorage.project_owner == "KACC"){
            corrBulkUploadTemplatePathKACC = '../Templates/KACC';
            myhtml += "<a href='" + corrBulkUploadTemplatePathKACC+ "/KACC - Bulk Correspondence Register Template (Incoming).xlsx' download> KACC - Bulk Correspondence Register Template (Incoming).xlsx</a><br>";
            myhtml += "<a href='" + corrBulkUploadTemplatePathKACC+ "/KACC - Bulk Correspondence Register Template (Outgoing).xlsx' download> KACC - Bulk Correspondence Register Template (Outgoing).xlsx</a><br>";
        }else if(localStorage.project_owner == "UTSB"){
            corrBulkUploadTemplatePathUTSB = '../Templates/UTSB';
            myhtml += "<a href='" + corrBulkUploadTemplatePathUTSB+ "/UTSB -Bulk Correspondece Register Template.xlsx' download> UTSB -Bulk Correspondece Register Template.xlsx</a><br>";
        }   
    
        $(".templateContainer").html(myhtml);
        $(".templateContainer").css("display", "block");

    }else if(linkSet !== "" && linkSet == "finance_list_BulkUploadContracts_SSLR2"){

        
        let myhtml = "";

        if(localStorage.project_owner == "SSLR2"){
            myhtml += "<a href='../Templates/pfs_CONTRACT_config_sslr.xlsx' download> pfs_CONTRACT_config_sslr.xlsx</a><br>";
        }
    
        $(".templateContainer").html(myhtml);
        $(".templateContainer").css("display", "block");

    }
    else if(linkSet !== "" && linkSet == "finance_list_BulkUploadContracts"){

        
        let myhtml = "";

        if(localStorage.project_owner == "JKR_SABAH"){
            myhtml += "<a href='../Templates/pfs_CONTRACT_config_sabah.xlsx' download> pfs_CONTRACT_config_sabah.xlsx</a><br>";
        }
    
        $(".templateContainer").html(myhtml);
        $(".templateContainer").css("display", "block");

    }else{
        $(".templateContainer").css("display", "none");
    }

    iframe = $("iframe#"+frameId);

    let role = localStorage.usr_role;
    var messageAlertFinance = "";
    var messageAlertDocument = "";

    url = getLinkJoget(linkSet,frameId);
    
    //FINANCE HAVE SPECIAL CASE, NEED TO CHECK THE SETUP OF WORKFLOW FIRST
    if(checkWorklow){
        projectDetailsFlag = false;
       
        if(localStorage.project_owner == "SSLR2"){
            if(localStorage.projectDetailsFlag == "true"){
                projectDetailsFlag = true;
            }else if(localStorage.projectDetailsFlag == "false"){
                projectDetailsFlag = false;
            }else{
                checkPfsDetails();
            }
        }else{
            checkPfsDetails();
        }
        
        if(!projectDetailsFlag){
            if(SYSTEM == 'OBYU'){
                if (role == "Finance Officer") {
                    messageAlertFinance = 'Project details have not been filled in for this project, do you want to add them now?';
    
                    $.confirm({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Confirm!",
                        content: messageAlertFinance,
                        buttons: {
                            ok: function () {
                                linkSet = 'finance_list_AddEditProjectDetails'
                                linkJogetExtra(frameId, linkSet)
                            },
                            cancel: function () {
                                $("#finance_list_ProjectUserInfo").trigger("click")
                                return;
                            },
                        },
                    });
                }else {
                    messageAlertFinance = 'Project details have not been filled in for this project. Please ask the Finance Officer to fill the details.';
    
                    $.confirm({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Confirm!",
                        content: messageAlertFinance,
                        buttons: {
                            ok: function () {
                                if(localStorage.project_owner == "SSLR2"){
                                    $("#finance_list_ProjectUserInfo_SSLR2").trigger("click")
                                }else{
                                    $("#finance_list_ProjectUserInfo").trigger("click")
                                }
                            }
                        },
                    });
                
                }
            }else{
                if ((role == "Finance Officer" && localStorage.Project_type == "CONSTRUCT") || (role == "Quantity Surveyor" && localStorage.Project_type == "ASSET") || (role == "Contract Executive" && localStorage.project_owner == "SSLR2")) {
                    messageAlertFinance = 'Project details have not been filled in for this project, do you want to add them now?';
                    console.log(messageAlertFinance);
                    $.confirm({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Confirm!",
                        content: messageAlertFinance,
                        buttons: {
                            ok: function () {
                                if(localStorage.project_owner == "SSLR2"){
                                    linkSet = "finance_list_AddEditProjectDetails_SSLR2";
                                }else{
                                    linkSet = "finance_list_AddEditProjectDetails";
                                }
                                linkJogetExtra(frameId, linkSet)
                            },
                            cancel: function () {
                                if(localStorage.project_owner == "SSLR2"){
                                    $("#finance_list_ProjectUserInfo_SSLR2").trigger("click")
                                }else{
                                    $("#finance_list_ProjectUserInfo").trigger("click")
                                }
                                return;
                            },
                        },
                    });
                }else {
                    messageAlertFinance = 'Project details have not been filled in for this project. Please ask the Finance Officer to fill the details.';
    
                    $.confirm({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Confirm!",
                        content: messageAlertFinance,
                        buttons: {
                            ok: function () {
                                if(localStorage.project_owner == "SSLR2"){
                                    $("#finance_list_ProjectUserInfo_SSLR2").trigger("click")
                                }else{
                                    $("#finance_list_ProjectUserInfo").trigger("click")
                                }
                            }
                        },
                    });
                
                }
            }
            
        }
    }

    //DOCUMENT OF OBYU HAVE PROJECT INFORMATION THAT NEED TO CHECK
    if(checkProjectInfoDoc){
        projectInfoDocFlag = false;
        recordId = checkDocDetails();

        if(recordId && projectInfoDocFlag){
            url = url + recordId
            if(role == "Project Manager" || role == "Doc Controller"){
                showVisibilityButton("editButtonContainer", "document_project_info_edit")
            }
        }
        else{
            if(role == "Project Manager" || role == "Doc Controller"){
                messageAlertDocument = 'Project details have not been filled in for this project, do you want to add them now?';

                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: messageAlertDocument,
                    buttons: {
                        ok: function () {
                            linkSet = 'document_project_info_register'
                            linkJogetExtra(frameId, linkSet)
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            }
            else{
                messageAlertDocument = 'Project details have not been filled yet. Please contact the Project Manager or the Doc Controller.';

                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: messageAlertDocument,
                    buttons: {
                        ok: function () {
                            return;
                        }
                    },
                });
            }
        }
    }
    if(checkAnotherSetup){
        switch(checkAnotherSetup){
            case "contractApproval":
                functionCheck = (SYSTEM == 'OBYU') ? "getContractApprovalFlowDetailsOBYU" : "getContractApprovalFlowDetails",
                messageAlert = "Contracts"
                if(!IS_DOWNSTREAM){
                    //no approval workflow for contract
                    runcheckPFS = true;
                }
            break
            case "claimApproval":
                functionCheck = (SYSTEM == 'OBYU') ? "getClaimApprovalFlowDetailsOBYU" : "getClaimApprovalFlowDetails",
                messageAlert = "Claims"
                if(!IS_DOWNSTREAM){
                    //no approval workflow for claim
                    runcheckPFS = true;
                }
            break
            case "claimApprovalPeriodic":
                functionCheck = "getClaimApprovalFlowDetailsPeriodic",
                messageAlert = "Claims"
                runcheckPFS = true;
            break
            case "claimApprovalHq":
                functionCheck = "getClaimApprovalFlowDetails",
                messageAlert = "Claims"
                runcheckPFS = true;
            break
            case "claimApprovalPerHq":
                functionCheck = "getClaimApprovalFlowDetailsPeriodic",
                messageAlert = "Claims"
                runcheckPFS = true;
            break
            case "VoApproval":
                functionCheck = (SYSTEM == 'OBYU') ? "getVOApprovalFlowDetailsOBYU" : "getVOApprovalFlowDetails",
                messageAlert = settextVO
                runcheckPFS = true;
            break
            case "eotApproval":
                functionCheck = (SYSTEM == 'OBYU') ? "getVOApprovalFlowDetailsOBYU" : "getVOApprovalFlowDetails",
                messageAlert = settextVO
                runcheckPFS = true;
            break
            case "projectDetailsCheck":
                if(localStorage.project_owner == "SSLR2"){
                    if(localStorage.projectDetailsFlag == "true"){
                        projectDetailsFlag = true;
                    }else if(localStorage.projectDetailsFlag == "false"){
                        projectDetailsFlag = false;
                    }else{
                        checkPfsDetails();
                    }
                }else{
                    projectDetailsFlag = false;
                    checkPfsDetails();
                }
                if(projectDetailsFlag){
                    if(localStorage.project_owner == "SSLR2"){
                        linkSet = "finance_list_ProjectInfo_SSLR2"
                    }else{
                        linkSet = "finance_list_ProjectInfo"
                    }
                }else{
                    if(localStorage.project_owner == "SSLR2"){
                        linkSet = "finance_list_ProjectUserInfo_SSLR2"
                    }else{
                        linkSet = "finance_list_ProjectUserInfo"
                    }
                }
                if(localStorage.Project_type !== 'ASSET'){
                    if(projectDetailsFlag){
                        if(role == "Finance Officer" || role == 'Contract Executive'){
                            if(localStorage.project_owner == "SSLR2"){
                                if(localStorage.contractLevel == 'DOWNSTREAM'){
                                    showVisibilityButton("editButtonContainer", "finance_list_AddEditProjectDetails_SSLR2")
                                }
                                showVisibilityButton("newButtonContainer", "finance_list_NewContract_SSLR2")
                            }else{
                                showVisibilityButton("editButtonContainer", "finance_list_AddEditProjectDetails")
                                showVisibilityButton("newButtonContainer", "finance_list_NewContract")
                            }
                        }
                    }
                    else{
                        if(role == "Finance Officer" || role == 'Contract Executive'){
                            if(localStorage.project_owner == "SSLR2"){
                                if(localStorage.contractLevel == 'DOWNSTREAM'){
                                    showVisibilityButton("addButtonContainer", "finance_list_AddEditProjectDetails_SSLR2")
                                }
                            }else{
                                showVisibilityButton("addButtonContainer", "finance_list_AddEditProjectDetails")
                            }
                        }
                    }
                }else{
                    if(assetPfsBtnAccess['projectEdit'] == true){
                        showVisibilityButton("editButtonContainer", "finance_list_AddEditProjectDetails")
                    }
                    if(assetPfsBtnAccess['newContract'] == true){
                        showVisibilityButton("newButtonContainer", "finance_list_NewContract")
                    }
                }
            break
        }
        if(runcheckPFS){
            $.ajax({
                type: "POST",
                url: '../BackEnd/JogetPFS.php',
                dataType: 'json',
                data: {
                    functionName: functionCheck
                },
                success: function (obj) {
                    let data = obj;
                    if (data.length > 0) {
                        console.log(url);
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
                    else{
                        $.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: 'Message',
                            content: 'Approval WorkFlow for ' +messageAlert+ ' has not been set for this Project. Please set the same to create ' +messageAlert
                        });
                        loading.fadeOut();
                    }
                }
            })
        }
        else{
            url = getLinkJoget(linkSet,frameId);

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
    }
    else{
        iframe.hide();
        iframe.attr("src", "");
        iframe.show(); 
        iframe.attr("src", url);
        iframe.on("load", function () {
            loading.fadeOut();
            iframe.show();
            $(iframe)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
            localStorage.themeJoget = themeJoget
        });
    }
}

function linkJogetExtra(frameId, linkSet){
    url = getLinkJoget(linkSet,frameId);

    var loading = $('.loader');
    loading.fadeIn();

    iframe = $("iframe#"+frameId);
    iframe.hide();
    iframe.attr("src", "");
    iframe.attr("src", url);
    iframe.on("load", function () {
        loading.fadeOut();
        iframe.show();
    });
}

function checkPfsDetails(){
    var functionToRun = '';

    if(SYSTEM == 'OBYU'){
        functionToRun = 'getProjectDataListOBYU';
    }else{
        functionToRun = 'getProjectDataList';
    }

    localStorage.projectDetailsFlag = false;

    $('.loader').fadeIn(0);
    
    $.ajax({
        type: "POST",
        url: '../BackEnd/JogetPFS.php',
        dataType: 'json',
        async: false,
        data: {
            functionName: functionToRun
        },
        success: function (obj) {
            if (obj.length > 0 && obj[0].status == "Update") {
                projectDetailsFlag = true;
                localStorage.projectDetailsFlag = true;

                // project details have already been added/ submitted
            }
        }
    }); 

    
}

function checkDocDetails(){
    let recordID;
    
    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchJogetv3.php',
        dataType: 'json',
        async: false,
        data: {
            functionName: "getProjectInfo"
        },
        success: function (obj) {

            if (obj.data.length > 0) {
                projectInfoDocFlag = true;
                if (obj.data[0].id != undefined) {
                    recordID = obj.data[0].id;
                }

            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }

    });

    return recordID;

}

function loadProjectListatAppsBar(){

    var projectlist = JSON.parse(localStorage.projectlist)

	projectlist.sort((a, b) => (a.project_name.toUpperCase() > b.project_name.toUpperCase()) ? 1 : -1)
	var projectlistChild = [];
	var projectlistOther = [];
    var accessApps = JSON.parse(localStorage.page_apps_access);

    if(!(localStorage.page_pageOpen == "eLibrary" || localStorage.page_pageOpen == "projectInformation")){
        for (i = 0; i < projectlist.length; i++) {
            if (localStorage.p_id == projectlist[i].project_id) {
                continue; //skip this round
            }
    
            if((localStorage.page_pageOpen == "myDocument" || localStorage.page_pageOpen == "myFinance" || localStorage.page_pageOpen == "myTask") && projectlist[i].project_par_id == null){
                continue;
            }
    
            if((localStorage.page_pageOpen == "myFinance") && projectlist[i].finance_app != true){
                continue;
            }
            else if((localStorage.page_pageOpen == "myDocument") && projectlist[i].document_app != true){
                continue;
            }
            else if((localStorage.page_pageOpen == "myAdmin") && projectlist[i].admin_app != true){
                continue;
            }
    
            if (projectlist[i].project_par_id == localStorage.p_id || (localStorage.isParent && (localStorage.isParent == projectlist[i].project_id || localStorage.isParent == projectlist[i].project_par_id))) {
                projectlistChild.push(projectlist[i]);
            } else {
                projectlistOther.push(projectlist[i]);
            }
    
        }
    }
	
    var projectHTML = "";
	projectHTML +=
		"<button class='activeProject'>\
		<span class='img'><img src='../" + localStorage.iconurl + "'></span><span class='atag line-clamp'><a style='display:-webkit-box'>" + localStorage.p_name + "</a></span>\
		</button>"

	for (i = 0; i < projectlistChild.length; i++) {
		projectHTML +=
			"<button data-projectid = "+ projectlistChild[i].project_id +" onclick=\'openAppProject(this)\'>\
			<span class='img'><img src='" + projectlistChild[i].icon_url + "'></span><span class='atag line-clamp'><a style='display:-webkit-box'>" + projectlistChild[i].project_name + "</a></span>\
            </button>"
	}

    var projectOtherHTML = "";
	for (i = 0; i < projectlistOther.length; i++) {
		projectOtherHTML +=
			"<button data-projectid = "+ projectlistOther[i].project_id +" onclick=\'openAppProject(this)\'>\
			<span class='img'><img src='" + projectlistOther[i].icon_url + "'></span><span class='atag line-clamp'><a style='display:-webkit-box'>" + projectlistOther[i].project_name + "</a></span>\
            </button>"
	}

    $(".projectContainerNav").css('display', 'block')
    $("#projectslist").html(projectHTML);
    $("#projectslistOther").html(projectOtherHTML);
    $('#projectViewImage').attr('src', '../' + localStorage.iconurl);
}

function setFilterDashboard(){
    var wpcType = '';
    if(localStorage.Project_type == "ASSET"){
        if(localStorage.Project_type == "ASSET" && localStorage.project_owner == "JKR_SARAWAK"){
            wpcType = 'Division';
        }else{
            wpcType = 'District';
        }
    }else{
        wpcType = 'Package';
    }

    var loading = $('.loader');
    var packHTML = '<option value="overall">Select '+wpcType+'</option>';
    var secHTML = '<option value="overall">Select Section</option>';
    var yearHTML = '<option value="all">Select Year</option>';
    var catgHTML = '<option value="all">Select Category</option>';

    if(localStorage.project_owner == "JKR_SABAH"){
        catgHTML += `<option value="Domestic">Domestic</option>
                    <option value="Nominated">Nominated</option>`;
    }else if(localStorage.project_owner == "SSLR2"){
        catgHTML += `<option value="Domestic">Domestic</option>`;
    }else{
        catgHTML += `<option value="Designated">Designated</option>
                    <option value="Domestic">Domestic</option>
                    <option value="Nominated">Nominated</option>`;
    }

    $('.categoryFilter').html(catgHTML);

    // asset activity routine filter
    var htmlOpt = '<option value="default">Select Routine Activity</option>';

    if(localStorage.project_owner == 'JKR_SARAWAK'){
        htmlOpt += '<option value="R01 : PAVEMENT">R01 : PAVEMENT</option>';
        htmlOpt += '<option value="R02 : ROAD SHOULDER">R02 : ROAD SHOULDER</option>';
        htmlOpt += '<option value="R03 : VEGETATION CONTROL & LITTER COLLECTION">R03 : VEGETATION CONTROL & LITTER COLLECTION</option>';
        htmlOpt += '<option value="R04 : MAINTENANCE OF ROAD FURNITURES">R04 : MAINTENANCE OF ROAD FURNITURES</option>';
        htmlOpt += '<option value="R05 : MAINTENANCE OF BRIDGES/CULVERT">R05 : MAINTENANCE OF BRIDGES/CULVERT</option>';
        htmlOpt += '<option value="R06: PAINTING OF ROAD MARKING">R06: PAINTING OF ROAD MARKING</option>';
        htmlOpt += '<option value="R07 : CLEANING OF DRAINS">R07 : CLEANING OF DRAINS</option>';
        htmlOpt += '<option value="B : ROUTINE INSPECTION">B : ROUTINE INSPECTION</option>';
    }else{
        htmlOpt += '<option value="R01 : PAVEMENT">R01 : PAVEMENT</option>';
        htmlOpt += '<option value="R02 : ROAD SHOULDER">R02 : ROAD SHOULDER</option>';
        htmlOpt += '<option value="R03 : GRASS CUTTING">R03 : GRASS CUTTING</option>';
        htmlOpt += '<option value="R04 : MAINTENANCE OF ROAD FURNITURES">R04 : MAINTENANCE OF ROAD FURNITURES</option>';
        htmlOpt += '<option value="R05 : MAINTENANCE OF BRIDGES/CULVERT">R05 : MAINTENANCE OF BRIDGES/CULVERT</option>';
        htmlOpt += '<option value="R06: PAINTING OF ROAD MARKING">R06: PAINTING OF ROAD MARKING</option>';
        htmlOpt += '<option value="R07 : CLEANING OF DRAINS">R07 : CLEANING OF DRAINS</option>';
        htmlOpt += '<option value="B : ROUTINE INSPECTION">B : ROUTINE INSPECTION</option>';
    }

    $('.assetRoutineActivityFilter').html(htmlOpt);

    //For Package, Section & Year Filter
    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: {
            functionName: "getFilterData",
        },
        beforeSend: function() {
            loading.fadeIn();
        },
        success: function (obj, textstatus) {
            if(localStorage.isParent == 'isParent'){
                var package_uuid_list = []
                for (const [idx, ele] of Object.entries(obj)) {
                    if(idx == 'wpcPackageFilter'){
                        for (const [idx2, ele2] of Object.entries(ele)) {
                            if(idx2 == 'overall') continue

                            if(SYSTEM == 'OBYU'){
                                if(localStorage.p_id_name === "NCH" && localStorage.project_owner ==="MRSB"){
                                    
                                    const optionsArray = Object.entries(ele)
                                        .filter(([key]) => key !== 'overall');

                                    // Custom Sorting logic for NCH project: PMO first, then LIM, then LAW, each by number
                                    optionsArray.sort(([aKey], [bKey]) => {
                                        if (aKey.startsWith("PMO")) return -1;
                                        if (bKey.startsWith("PMO")) return 1;

                                        const order = ["LIM", "LAW"];
                                        const typeA = order.findIndex(t => aKey.includes(t));
                                        const typeB = order.findIndex(t => bKey.includes(t));

                                        if (typeA !== typeB) return typeA - typeB;

                                        const numA = parseInt(aKey.match(/\d+/)) || 0;
                                        const numB = parseInt(bKey.match(/\d+/)) || 0;
                                        return numA - numB;
                                    });

                                    for (const [key, text] of optionsArray) {
                                        packHTML += `<option data-packageuuid="${key}" value="${key}">${text}</option>`;
                                    }

                                    break;
                                }
                                else {
                                    packHTML += '<option data-packageuuid = "' + idx2 + '" value="' + idx2 + '">' + ele2 + '</option>';
                                }
                            }else{
                                for (const [idx3, ele3] of Object.entries(ele2)) {
                                    package_uuid_list.push(idx3)
                                    packHTML += '<option data-packageuuid = "' + idx3 + '" value="' + idx2 + '">' + ele3 + '</option>';
                                }
                            }
                        }
                    }else if(idx == 'sectionFilter'){
                        for (const [idx2, ele2] of Object.entries(ele)) {
                            sectionForProject.push({ 
                                packageID: idx2,
                                sectionID: ele2
                            });
                        }
                    }
                    else if(idx == 'yearFilter'){
                        for (const [idx2, ele2] of Object.entries(ele)) {
                            yearForProject.push({ 
                                packageID: idx2,
                                year: ele2
                            });

                            if(idx2 == 'overall'){
                                for (const [idxYear, eleYear] of Object.entries(ele2)) {
                                    yearHTML += '<option value="' + eleYear + '">' + eleYear + '</option>';
                                }

                            }
                        }
                    }
                }
                
                if (localStorage.project_owner && localStorage.project_owner == 'JKR_SABAH'){
                    if (Array.isArray(package_uuid_list) && package_uuid_list.length > 0) { 
                        var inPackageUuid = package_uuid_list.join('","'); 
                        localStorage.setItem('inPackageUuid', inPackageUuid);
                        localStorage.inPackageUuid = inPackageUuid;
                    } else { 
                        localStorage.inPackageUuid = '';
                    }
                }


                $('.packFilter').html(packHTML);
                $('.sectFilter').html(secHTML);
                $('.yrFilter').html(yearHTML);
            }
            else{
                for (const [idx, ele] of Object.entries(obj)) {
                    if(idx == 'sectionFilter'){
                        for (const [idx2, ele2] of Object.entries(ele)) {
                            for (const [idx3, ele3] of Object.entries(ele2)) {
                                secHTML += '<option value="' + ele3 + '">' + ele3 + '</option>';
                            }
                        }
                    }
                    else if(idx == 'yearFilter'){
                        for (const [idx2, ele2] of Object.entries(ele)) {
                            if(idx2 == 'overall'){
                                for (const [idxYear, eleYear] of Object.entries(ele2)) {
                                    yearHTML += '<option value="' + eleYear + '">' + eleYear + '</option>';
                                }

                            }
                        }
                    }
                }

                $('.sectFilter').html(secHTML);
                $('.yrFilter').html(yearHTML);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
        complete: function() {
            loading.fadeOut();
        }
    })

}

//set the session & local storage
function openAppProject(e){
    event.stopPropagation()
    checkingJogetLogin()
    let pageOpen = (localStorage.page_pageOpen) ? localStorage.page_pageOpen : $(e).attr('rel');

    var loading = $('.loader');
    loading.fadeIn();

    if(pageOpen == "mySysAdmin"){
    }
    else{
        let idProject = $(e).data('projectid')
        $(".appsbar.active").find("span.atag a").hide()
        $(".appsbar.active").animate({ width: 'toggle' }, 150, function () {
            $(".appsbar").css('display', 'none');
            $(".appsbar.active").removeClass('active');
        });
        $.ajax({
            type: "POST",
            url: '../Login/postlogin_processingv3.php',
            dataType: 'json',
            data: {
                functionName: "getSession",
                idProject: idProject,
                pageOpen: pageOpen,
            },
            beforeSend: function() {
                loading.fadeIn();
            },
            success: function (obj, textstatus) {
                if(obj.error) {
                    alert(obj.error);
                    return;
                }

                if (obj){
                    localStorage.app_finance_set = obj.app_finance_set;
                    localStorage.app_doc_set = obj.app_doc_set;
                    localStorage.signed_in_email = obj.signed_In_Email;
                    localStorage.usr_name = obj.firstname + " " + obj.lastname
                    localStorage.usr_role = obj.project_role
                    localStorage.p_id = obj.project_id
                    localStorage.p_id_name = obj.projectID //example NH002/WP01/package_v3
                    localStorage.user_org = obj.user_org
                    localStorage.p_name = obj.project_name
                    localStorage.longitude1 = parseFloat(obj.longitude_1)
                    localStorage.longitude2 = parseFloat(obj.longitude_2)
                    localStorage.latitude1 = parseFloat(obj.latitude_1)
                    localStorage.latitude2 = parseFloat(obj.latitude_2)
                    localStorage.iconurl = (obj.icon_url!='favicon.ico')?'../../'+obj.icon_url:obj.icon_url;
                    localStorage.isParent = obj.is_Parent
                    localStorage.project_owner = obj.project_owner;
                    localStorage.prefix_loc = obj.prefix_loc
                    localStorage.Project_type = obj.Project_type
                    localStorage.parent_project_name = obj.parent_project_name
                    localStorage.ui_pref = obj.ui_pref
                    localStorage.accessRight = JSON.stringify(obj.fullAccess);
                    localStorage.accessSetup = JSON.stringify(obj.setupAccess);
                    localStorage.accessManage = JSON.stringify(obj.manageAccess);
                    localStorage.accessbulkApproval = JSON.stringify(obj.bulkArpprovalAccess);
                    localStorage.time_zone_text = obj.time_zone_text;
                    localStorage.industry = obj.industry;
                    localStorage.location = obj.location;
                    localStorage.created_by = obj.created_by;
                    localStorage.updated_by = obj.updated_by;
                    localStorage.last_update = obj.last_update;
                    localStorage.start_date = obj.start_date;
                    localStorage.end_date = obj.end_date;
                    localStorage.adminUsersList = obj['Admin Users'] ? obj['Admin Users'] : ''; 
                    renderAdminList();
                    if (SYSTEM == 'KKR' &&  obj.warranty_end_date !== undefined) {
                        localStorage.warranty_end_date = obj.warranty_end_date;
                    }
                    localStorage.projectDuration = obj.projectDuration;
                    localStorage.project_phase = obj.project_phase;
                   
                    JOGETLINK = obj.jogetAppLink;
                    
                    // this is parent project id not id number, for JOGET purpose
                    if (obj.parent_project_id) {
                        localStorage.parent_project_id = obj.parent_project_id
                    }
                    //need for both overall project and package project
                    if (obj.appsLinks) {	
                        localStorage.appsLinks = obj.appsLinks

                        jogetAppProcesses = JSON.parse(localStorage.appsLinks)
                        if (jogetAppProcesses['constructPackage_name']) {
                            constructPackageId = jogetAppProcesses['constructPackage_name'].split("::")[0]
                        }

                        localStorage.appsOtherApp = JSON.stringify(obj.appsOtherLink)

                        if (IS_DOWNSTREAM) {
                            localStorage.contractLevel = "DOWNSTREAM"
                        }else{
                            localStorage.contractLevel = "UPSTREAM";
                        }

                    }
                    if (obj.start_date !== undefined) {
                        localStorage.start_date = obj.start_date;
                        localStorage.end_date = obj.end_date;
                    }
                    localStorage.projectlist = JSON.stringify(obj.project_list)
                    localStorage.inPackageUuid = obj.inPackageUuid ? obj.inPackageUuid : '';
                    localStorage.page_apps_right = JSON.stringify(obj.apps_right);
                    localStorage.page_pageOpen = pageOpen;
                    saveLastAccess()
                    localStorage.page_apps_access = JSON.stringify(obj.apps_access);

                    if(pageOpen == 'myFinance'){
                        localStorage.projectDetailsFlag = "";
                        checkPfsDetails();
                    }

                    whatToSetup();
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        })
        defaultAddEditButton();
        dashboardPowerBILoaded = false;
    }
}

function renderAdminList(){
    let adminUsersList = localStorage.adminUsersList ? localStorage.adminUsersList : '';

    if (adminUsersList && adminUsersList.trim() !== '') {
        const pmEmails = adminUsersList.split(',');
        let htmlContent = '';

        pmEmails.forEach(function(email) {
            email = email.trim();
            htmlContent += '<div class="notiLabel"><a href="mailto:'+email+'" class="notiText">'+email+'</a></div>';
        });

        $('#adminUsersList').html(htmlContent);
    }

}
 
$( document ).ready(function() {
    renderAdminList();
});

function favProject(event, e){
    event.stopPropagation()
    var $projectId = $(e).data("projectid")
    
    $.ajax({
        type: "POST",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: 'addToFav',
            projId: $projectId
        },
        success: function(){
            if($(e).hasClass('fav')){
                if (flagFav == true){
                    $(e).removeClass('fav')
                    $(e).closest('.homeProjSearch').removeClass('fav')

                    $(`.homeProjSearch[data-projectid="${$projectId}"]`).hide()
                    $(`.homeProjSearch[data-projectid="${$projectId}"]`).children('.row.package').css('display','none');

                    $(`.tile[data-projectid="${$projectId}"]`).removeClass('fav')
                }else{
                    $(e).removeClass('fav')
                    $(e).closest('.homeProjSearch').removeClass('fav')
                    $(`.tile[data-projectid="${$projectId}"]`).removeClass('fav')
                }
            }else{
                $(e).addClass('fav')
                $(e).closest('.homeProjSearch').addClass('fav')
                $(`.tile[data-projectid="${$projectId}"]`).addClass('fav')
            }
        }
    });

}

function insightsVisibity(type){
    thematicHtml = '';
    if(type == 'CONSTRUCT'){
        thematicHtml += `
            <option value="Diameter" selected>Contract Package - Diameter</option>
            <option value="Material">Contract Package - Material</option>
            <option value="Type">CP101 - Type</option>
            <option value="PLC_Building">PLC - Building</option>
            <option value="LAA">Land Acquisition Availability</option>
            <option value="LT">Land Type</option>
            <option value="LS">Land Status</option>;
        `
        $('#pipeAttr').html(thematicHtml)

    }else if(type == 'ASSET'){
        thematicHtml += `
            <option value="IRI" selected>Map display based on IRI data</option>;
        `
        $('#pipeAttr').html(thematicHtml)
        $('#thematicLayer').children().remove().end();
        $('#thematicLayer').show()
        $('#thematicLayer').prev().show()
        $('.group.layer input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var firstCheck = $(this).next(".fileicon")[0];
                if(firstCheck){
                    var type = firstCheck.attributes.title.nodeValue;
                    var name = $(this).next().next()[0].innerHTML;
                    if (type == "KML/KMZ"){
                        var chkid = $(this).attr('id');
                        chkid = chkid.substring(chkid.indexOf('_')+1);
                        $('#thematicLayer').append($('<option>',
                            {
                                value: chkid,
                                text : name
                            }
                        ));
                    }
                }

            }
        })

        $('.chk_defect:checked').each(function() {
            $(this).prop('checked', false)
        });

        $('.chk_routine:checked').each(function() {
            $(this).prop('checked', false)
        });
        // start and end year selection filter for asset defect and routine maintenance
        // date validation - checking invalid date - 1/12/2026
        function dateValidation(dateStr) {
           
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split("T")[0];
            }
           
            const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (match) {
                const [, day, month, year] = match;
                const parsed = new Date(year, month - 1, day);
                if (!isNaN(parsed.getTime())) {
                    return year+'-'+month.padStart(2, "0")+'-'+day.padStart(2, "0");
                }
            }
           
            return null; // invalid date
        }
        var rawDate = localStorage.start_date;
        var converted = dateValidation(rawDate);
        var AssetstartDate =  new Date(converted);// set start date filter based on project start date
        var AssetstartDateYear =  AssetstartDate.getFullYear();
        var curYear = new Date().getFullYear();// set end date filter based on current year
        var yearDiff = curYear - AssetstartDateYear;
        var yearAssetOptions = '';
        for(i = 0; i <= yearDiff; i++){
            var yearOpt = AssetstartDateYear + i;
            var selectedCurrentYear = '';
            if (yearOpt == curYear) {
                selectedCurrentYear = "selected";
            }
            yearAssetOptions += '<option '+selectedCurrentYear+' value="'+yearOpt+'">'+yearOpt+'</option>'
        }
        $('.SelYearRoutineDefect').html(
            '<option value="default">Select Year</option>'+
            yearAssetOptions
        );
    }else{

    }
}

function saveLastAccess(){
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: 'setLastAccess',
        },
        beforeSend: function(jqXHR) {
            ajaxRequests.push(jqXHR); 
        },
        complete: function(jqXHR) { 
            //load swiper based on toggle view
            ajaxRequests = ajaxRequests.filter(req => req !== jqXHR); 
        },
        success: function(projId){
            $(`.homeProjSearch[data-projectid="${projId}"] .columnSecond .fontSmall`).html('1 second ago')
        }
    });
}

function changeApps(ele){
    checkingJogetLogin()
    let pageOpen = $(ele).attr('rel');
    let title;

    $(".mainAppButton").removeClass('active')

    //hide noti bell
    $('.navbarButton.bell').css("display", "none")

    if($(ele).hasClass('active')){
        $(".subMenuButtonContainer").addClass('active')
        $(ele).removeClass('subMenuOpened')
        $(".mainContainer").addClass('subMenuOpened')
    }else if(!$(ele).hasClass('active')){
        clearPage(pageOpen);
        leftMenuButtonUnhightlight();

        $(ele).removeClass('subMenuOpened')

        if(pageOpen == 'myProject'|| pageOpen == 'mySysAdmin' || pageOpen == 'myReporting'){
            //FOR OBYU
            $(".mainAppButton.eLibrary").removeClass('show')
            $(".mainAppButton.projectInformation").removeClass('show')
            localStorage.page_pageOpen = '';
            localStorage.p_name = '';

            if(pageOpen == 'myProject'){

                //TO RELOAD AGAIN IF WE ALREADY GOING TO SYSTEM ADMIN
                if(flagCheckSysAdmin){
                    console.log(window.location.href)
                    window.location.reload(window.location.href);
                }

                if(localStorage.project_owner == "UTSB"){
                    $(".mainAppButton.active").removeClass('active')
                    $(".mainAppButton.hs").removeClass('show')
                    $(".subMenuButtonContainer").removeClass('active')
                    $(".mainContainer").removeClass('subMenuOpened')
                    $("div[rel='"+pageOpen+"'].mainAppButton").addClass('noSubMenu')
                }else{
                    $(".mainAppButton.active").removeClass('active')
                    $(".mainAppButton.hs").removeClass('show')
                    $(".subMenuButtonContainer").addClass('active')
                    $(".mainContainer").addClass('subMenuOpened')
                    $("div[rel='"+pageOpen+"'].mainAppButton").removeClass('noSubMenu')
                }
                //hide and show enlarge button
                $(".mainContainer .enlargeContainer").removeClass("active")
                $(".mainContainer .enlargeContainer").hide()
                $(".mainContainer .enlargeContainer .printButton").hide()

                //hide project details navbar
                $('.navbarButton.project').css("display", "none")

                //show opacity for myProject container
                $('.mainPage.myProject').css('opacity', '1')

                //reset url when digital reporting filter submitted
                if (flagFromReporting){
                    
                    var url= document.location.href;
                    window.history.pushState({}, "", url.split("?")[0]);
                    window.location.reload(window.location.href);
                    flagFromReporting = false;
                }

                dashboardPowerBILoaded = false;
                // reload myTask List
                resetTaskList()
            }
            if(pageOpen == 'myReporting'){
                localStorage.page_pageOpen = pageOpen;
                $(".mainAppButton.active").removeClass('active')
                $(".mainAppButton.hs").removeClass('show')

                //hide and show enlarge button
                $(".subMenuButtonContainer").removeClass('active')
                $(".mainContainer .enlargeContainer").addClass("active")
                $(".mainContainer .enlargeContainer").show()
                $(".mainContainer").removeClass('subMenuOpened')
                $(".mainContainer .enlargeContainer .printButton").hide()
                flagFromReporting = true;

                //hide project details navbar
                $('.navbarButton.project').css("display", "none")
                DRonLoad()
            }
            if(pageOpen == 'mySysAdmin'){
                flagCheckSysAdmin = true;

                if(localStorage.project_owner == "UTSB"){
                    $(".mainAppButton.active").removeClass('active')
                    $(".mainAppButton.hs").removeClass('show')
                    $(".subMenuButtonContainer").removeClass('active')
                    $(".mainContainer").removeClass('subMenuOpened')
                    $("div[rel='"+pageOpen+"'].mainAppButton").addClass('noSubMenu')
                }else{
                    $(".mainAppButton.active").removeClass('active')
                    $(".mainAppButton.hs").removeClass('show')
                    $(".subMenuButtonContainer").addClass('active')
                    $(".mainContainer").addClass('subMenuOpened')
                    $("div[rel='"+pageOpen+"'].mainAppButton").removeClass('noSubMenu')
                }
                $(".mainContainer .enlargeContainer .printButton").hide()
                $('.loader').fadeIn()
                localStorage.page_pageOpen = 'mySysAdmin';

                //hide project details navbar
                $('.navbarButton.project').css("display", "none")

                //reset url when digital reporting filter submitted
                if (flagFromReporting){
                    
                    var url= document.location.href;
                    window.history.pushState({}, "", url.split("?")[0]);
                    window.location.reload(window.location.href);
                    flagFromReporting = false;
                }

                getListofOrg();
            }

            $(".buttonContainer.show").removeClass('show')
            $(".buttonContainer." + pageOpen).addClass('show')
            $('.myFinance.eotSabah').hide();
            $('.myFinance.claimsPer').hide();
            $('.myFinance.claimsInventory').hide();
            
            $(".projectName").html("");
            $(".projectContainerNav").css('display', 'none');
            saveLastAccess();
            
            //hide opened buttonContainer (right button)
            $(".buttonContainer.show").removeClass('show')
            $(".buttonContainer." + pageOpen).addClass('show')

            var appWebLink = '';
            if(themeJoget == 'digile'){
                appWebLink = 'https://digile.com/';
            }{
                appWebLink = 'https://www.reveronconsulting.com/';
            }

            if (localStorage.support_user == '1'){
                $('#sideBarButtonLink').html(`
                  <button onclick="window.open(\'https://wsg.reveronconsulting.com/ReveronInsights/Documentation/Home.php\')"><span class="img"><img src="../Images/icons/third_button/open-book.png"></span><span class="atag"><a>Product Documentation</a></span></button>
                  <button id="appWebsite" value="Open Window" onclick="window.open(\'`+appWebLink+`\')" ><span class="img"><img class="riLogoNavbar" src=""></span><span class="atag"><a class="appProperties"></a></span></button>
                  <button value="Open Window" onclick="window.open(\'https://ri.digile.com/support/login.html\')" ><span class="img"><img src="../Images/icons/appsbar/service_request.png"></span><span class="atag"><a>Support Request</a></span></button>
                  <!--<button value="Open Window" onclick = "window.open(\'https://wsg.reveronconsulting.com/imodelJS\')" ><span class="img"><img src="../Images/icons/appsbar/imodel.jpg"></span><span class="atag"><a>iModel.js</a></span></button>
                  <button value="Open Window" onclick = PwShareButton(this) ><span class="img"><img src="../Images/icons/appsbar/imodel.jpg"></span><span class="atag"><a>ProjectWise Share</a></span></button>
                  <button value="Open Window"><span class="img"><img src="../Images/icons/appsbar/imodel.jpg"></span><span class="atag"><a>ProjectWise Issue Resolution</a></span></button>-->
                `)
            }else{
                $('#sideBarButtonLink').html(`
                  <button onclick="window.open(\'https://wsg.reveronconsulting.com/ReveronInsights/Documentation/Home.php\')"><span class="img"><img src="../Images/icons/third_button/open-book.png"></span><span class="atag"><a>Product Documentation</a></span></button>
                  <button id="appWebsite" value="Open Window" onclick="window.open(\'`+appWebLink+`\')" ><span class="img"><img class="riLogoNavbar" src=""></span><span class="atag"><a class="appProperties"></a></span></button>
                  <!--<button value="Open Window" onclick = "window.open(\'https://wsg.reveronconsulting.com/imodelJS\')" ><span class="img"><img src="../Images/icons/appsbar/imodel.jpg"></span><span class="atag"><a>iModel.js</a></span></button>
                  <button value="Open Window" onclick = PwShareButton(this) ><span class="img"><img src="../Images/icons/appsbar/imodel.jpg"></span><span class="atag"><a>ProjectWise Share</a></span></button>
                  <button value="Open Window"><span class="img"><img src="../Images/icons/appsbar/imodel.jpg"></span><span class="atag"><a>ProjectWise Issue Resolution</a></span></button>-->
              `)
            }

            //Deactivate active page
            $(".mainPage.active").hide()
            $(".mainPage.active").removeClass('active')

            //Activate current page
            $(".mainPage." + pageOpen).show()
            $(".mainPage." + pageOpen).addClass('active')
            
        }else{
            if (pageOpen == 'myDocument'){
                if(localStorage.app_doc_set == 'false'){
                    alert('The app set for document is not correct.  Please contact the System Admin');
                    return;
                }
                title = pageOpen.replace('my','')
                $(`.mainPage.${pageOpen} .contentContainer .head h2`).html(`${title} - ${localStorage.p_name}`)
            }else if (pageOpen == 'myFinance'){
                $(`.mainPage.${pageOpen}`).children().children().children().children().removeClass("active");
                if(localStorage.app_finance_set == 'false'){
                    alert('The app set for finance is not correct.  Please contact the System Admin');
                    return;
                }
                title = pageOpen.replace('my','')
                $(`.mainPage.${pageOpen} .contentContainer .head h2`).html(`${title} - ${localStorage.p_name}`)

            }else if(pageOpen == 'myTask'){
                dataForMyTask();

                $(".subMenuButtonContainer").addClass('active')
                $(".mainContainer .enlargeContainer").removeClass("active")
                $(".mainContainer .enlargeContainer").hide()
                $(".mainContainer").addClass('subMenuOpened')

                $(".buttonContainer.show").removeClass('show')
                $(".buttonContainer." + pageOpen).addClass('show')

                if(SYSTEM == "OBYU"){
                    $("#assetProcess.buttonContainer." + pageOpen).removeClass('show')
                    if(localStorage.project_owner == "UTSB"){
                        $("#constructionProcess.buttonContainer." + pageOpen).removeClass('show')
                    }
                }

                //Deactivate active page
                $(".mainPage.active").hide()
                $(".mainPage.active").removeClass('active')

                //Activate current page
                $(".mainPage." + pageOpen).show()
                $(".mainPage." + pageOpen).addClass('active')
                
                $('.myFinance.claimsPer').hide();
                $('.myFinance.eotSabah').hide();
                $('.myFinance.claimsInventory').hide();                
            }else if(pageOpen == 'myDashboard'){
                $('.loader').fadeIn()
                $('#dashboardSideMenu').children().removeClass("active")
                $('#dashboardSideMenu').children(":first").addClass("active")
                title = pageOpen.replace('my','')
                $(`.mainPage.${pageOpen} .contentContainer .head h2`).html(`${title} - ${localStorage.p_name}`)
            }else if(pageOpen == 'myAdmin'){
                $('.loader').fadeIn(100)
            }else if(pageOpen == 'myInsights'){
                //hide noti bell
                if(localStorage.Project_type == 'FM'){
                    $('.navbarButton.bell').css("display", "flex")
                }
            }
            localStorage.page_pageOpen = pageOpen;
            saveLastAccess()

            loadProjectListatAppsBar();

            if(pageOpen != 'myTask'){
                _enterApp(localStorage.page_pageOpen, JSON.parse(localStorage.page_apps_access));
            }

            if(localStorage.Project_type == "ASSET"){
                $("#constructionProcess.buttonContainer." + pageOpen).removeClass("show")
            }else{
                $("#assetProcess.buttonContainer." + pageOpen).removeClass("show")
            }

            //Labelling for Asset Table
            var sectionAbb = (localStorage.project_owner == "JKR_SARAWAK") ? "DIV" : "DIS";
            var sectionLabel = (localStorage.project_owner == "JKR_SARAWAK") ? "Division" : "District";
            $('#inventoryJoget[rel="network_div"]').attr("title", sectionAbb);
            $('#inventoryJoget[rel="network_div"]').html(sectionLabel);

            $('.navbarButton.project').css("display", "block")
            visiblityFilterDashboard(pageOpen)
        }

        updateFrameSrc(pageOpen);
        $(".templateContainer").css('display', 'none');

        $(ele).addClass('active')
        $(ele).children('span').addClass('active')
    }

    widgetConopClose()
    detachWidgetDefault()
    defaultAddEditButton()
    //CLEAR FLAG FOR INSIGHT BUTTON
    clearAllFlag()
}

function clearPage (page){
    var dashTitle;

    //clear filter dashboard
    $('.packFilter.'+page).prop('selectedIndex',0);
    $('.sectFilter.'+page).prop('selectedIndex',0);
    $('.yrFilter.'+page).prop('selectedIndex',0);
    $('.mthFilter.'+page).prop('selectedIndex',0);
    $('.mthFilter.'+page).prop("disabled", "disabled");

    //clear dashboard
    if(flagChangeDashboard){
        $('.myDashboard > .contentContainer > .head > h2').html(`Project Summary - ${localStorage.p_name}`);
        if(localStorage.isParent == "isParent"){
            $(".packFilter.myDashboard").css("display", "inline-block")
        }
        if(localStorage.project_owner == "JKR_SARAWAK"){
            $(".sectFilter.myDashboard").css("display", "none")
        }
        $(".yrFilter.myDashboard").css("display", "none")
        $(".mthFilter.myDashboard").css("display", "none")
    }
    flagChangeDashboard = false;

    //for dashboard filter at document and finance
    if(flagChangeJoget){
        if(localStorage.isParent == "isParent"){
            $(".packFilter." +page).css("display", "inline-block")
        }
        if(localStorage.project_owner == "JKR_SARAWAK"){
            $(".sectFilter." +page).css("display", "inline-block")
        }
        $(".yrFilter." +page).css("display", "inline-block")
        $(".mthFilter." +page).css("display", "inline-block")
    }
    flagChangeJoget = false;

    //hide my task
    $("#noTask").css("display", "none")
    $("#constTask").css("display", "none")
    $("#docTask").css("display", "none")
    $("#pfsTask").css("display", "none")
    $("#assetTask").css("display", "none")

    //hide all opened navbox when app changes
    $(".navbox").css("display", "none")
}

// Search Task
function homeSearchTask (inpt){
    var existTableArr = [];
    var filter = inpt.value.toUpperCase();
    var tableArr = ['myTask', 'taskConstruct', 'taskDocument', 'taskFinance', 'taskAsset', 'taskServiceRequest'];
    var descHTML = `<div class="row noTaskDesc" rel="myTask" data-color="#ad5e2a">
                        <div class="columnFirst textContainer" style="justify-content: center"><span>No filter task...</span><span class="fontSmall"></span></div>
                        <div class="columnSecond textContainer"><span></span><span class="fontSmall"></span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight"></span></div>
                    </div>`;

    $('.myTask').find('.tableBody:visible').each(function(){
        var divEle = $(this);
        $.each(tableArr, function(){
            if(divEle.hasClass(this)){
                existTableArr.push(this.valueOf());
                $('.myTask .tableBody.'+this.valueOf()+' .noTaskDesc').remove();
            }
        })
    })

    $.each(existTableArr, function(){
        var currTask = this.valueOf();

        $('.myTask .tableBody.'+currTask+' .homeTaskSearch').hide();

        $('.myTask .tableBody.'+currTask+' .homeTaskSearch').each(function(){
            var listText = $(this).text()
            if (listText.toUpperCase().indexOf(filter) > -1) {
                $(this).show();
                $('.myTask .tableBody.'+currTask+' .noTaskDesc').remove();
            }else{
                var visibleInsideCount = $('.myTask .tableBody.'+currTask+' .homeTaskSearch:visible').length;

                $('.myTask .tableBody.'+currTask+' .noTaskDesc').remove();

                if(visibleInsideCount == 0){
                    $('.myTask .tableBody.'+currTask).append(descHTML);
                }
            }
        })
    })
}

var dateFormat = "dd-mm-yy";
var from = $( "input[name='dfrom']" )
    .datepicker({
        changeMonth: true,
        numberOfMonths: 2,
        dateFormat: dateFormat,
        autoclose: true
    }).on( "change", function() {
        to.datepicker( "option", "minDate", getDateMinMax( this ) );
        to.datepicker( "option", "maxDate", getDateMinMax( this, 'max' )  );
        homeSearchTaskDate();
    })
var to = $( "input[name='dto']" ).datepicker({
    changeMonth: true,
    numberOfMonths: 2,
    dateFormat: dateFormat,
    autoclose: true
}).on( "change", function() {
    from.datepicker( "option", "maxDate", getDateMinMax( this ) );
    from.datepicker( "option", "minDate", getDateMinMax( this, 'min')  );
    homeSearchTaskDate();
});

function getDateMinMax( element, type='') {
    var date;
    try {
        date = $.datepicker.parseDate( dateFormat, element.value );
        if(type=='max'){
            date.setDate(date.getDate() + 30);
        }else if(type=='min'){
            date.setDate(date.getDate() - 30);
        }
    } catch( error ) {
        date = null;
    }
    return date;
}

$( "input[name='dfrom']" ).datepicker("setDate", -30);
$( "input[name='dto']" ).datepicker("setDate", new Date);

$('#resetDateSearch').on('click', function(){
    $("input[name='dfrom']").datepicker("option", "maxDate", null);
    $("input[name='dfrom']").datepicker("option", "minDate", null);
    $("input[name='dfrom']").datepicker("setDate", null);
    $("input[name='dto']").datepicker("option", "maxDate", null);
    $("input[name='dto']").datepicker("option", "minDate", null);
    $("input[name='dto']").datepicker("setDate", null);
})

// Task Date Filter
function homeSearchTaskDate (){
    $('.tableBody.myTask').html("")
    var dfrom = $("input[name='dfrom']").val();
    var dto = $("input[name='dto']").val();

    if(dfrom != '' && dto != ''){
        dataTask();
    }
}

// Search Contract - project view on modal container -- Finance Information
function searchContract (inpt){
    var filter = inpt.value.toUpperCase();
    $('.row.wizard').hide();
    $('.row.wizard').each(function(){
        var listText = $(this).text()
        if (listText.toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        }
    })
}

// Search user in create project wizard
function userProjectSearch (inpt){
    var filter = inpt.value.toUpperCase();
    $('.userProjectSearch').hide();
    $('.userProjectSearch').each(function(){
        var listText = $(this).text()
        if (listText.toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        }
    })
}

// Search user in create project wizard
function groupProjectSearch (inpt){
    var filter = inpt.value.toUpperCase();
    $('.groupProjectSearch').hide();
    $('.groupProjectSearch').each(function(){
        var listText = $(this).text()
        if (listText.toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        }
    })
}
// ------ END Finance Information

// Search Project
function homeSearchProject(inpt){
    var filter = inpt.value.toUpperCase();
    var favProject = $('.homeProjSearch.fav')
    $('.homeProjSearch').hide();
    $('.row.package').css('display','none');
    
    if(flagFav ==  true){
        if(!filter) {
            $('.homeProjSearch.fav').show();
            $('.homeProjSearch.fav').find('.row.package').css('display','flex');
            $('.homeProjSearch.fav').children('.row.package').parent().show();
            return;
        }
        $(favProject).each(function(){
            let text= $(this).text()
            if (text.toUpperCase().indexOf(filter) > -1) {
                $(this).show();
                $(this).children('.row.package').css('display','flex');
                $(this).children('.row.package').parent().show();
                var projId = $(favProject).attr('id');
                if($('.project[rel="'+projId+'"]').length != 0) {
                    $('.project[rel="'+projId+'"]').show();
                }
            }
        })

    }else{
        if(!filter) {
            $('.homeProjSearch').show();
            return;
        }
        $('.homeProjSearch').each(function(){
            var listText = $(this).text()
            if (listText.toUpperCase().indexOf(filter) > -1) {
                $(this).show();
                $(this).children('.row.package').css('display','flex');
                $(this).children('.row.package').parent().show();
                var projId = $(this).attr('id');
                if($('.project[rel="'+projId+'"]').length != 0) {
                    $('.project[rel="'+projId+'"]').show();
                }
            }
        })
    }
    
}

//on click filter project list All or Favourite
const filterProjectList = (e) =>{
    let $function = $(e).attr('rel')
    $('.homeProjSearch').hide();
    $('.row.package').css('display','none');
    if($function == 'fav'){
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: '../Login/postlogin_processingv3.php',
            data: {
                functionName: 'getFav',
            },
            success: function(arr){
                for(var i=0; i<arr.length; i++){
                    var projid = arr[i]
                    $(`.homeProjSearch[data-projectid="${projid}"]`).show()
                    $(`.homeProjSearch[data-projectid="${projid}"]`).children('.row.package').css('display','flex');
                    $(`.homeProjSearch[data-projectid="${projid}"]`).children('.row.package').parent().addClass('show');
                    flagFav = true;
                    $(e).addClass('active')
                    $(e).siblings().removeClass('active')
                }
            }
        });
    }else{
        $(`.homeProjSearch`).show()
        $(`.homeProjSearch`).removeClass('show')
        flagFav = false;
        $(e).addClass('active')
        $(e).siblings().removeClass('active')
    }
}

function OnClickReviewTools() {
    $('#reviewTool').css('display', 'block')

    $(".button-ok.review").removeClass('active');
    $("#reviewdraw").addClass('active');

    $("#sizeReview").css("display", "flex");
    $("#colourReview").css("display", "flex");
    $("#textReview").css("display", "none");
}

function OnClickAddCamera() {
    flagDraw = false;
    flagEdit = false;
    flagAddImage = false; 
    flagEntity = false; 
    uploadType = "VIDEO";
    videoPinEdit = false;
    let vidInstruct = $(this).attr('rel');

    if ($('#addvideocam').hasClass('active')) {
        $(".toolButton.mid.active").removeClass("active")
        setInstruction('<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark text.</label></div>\
                        <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', vidInstruct)
        OnClickAddCameraCancel()
        $("#RIContainer").css("cursor", "url('../Images/ccrosshair.cur'),auto");
        $("#cameraPinList");
        for (var i = 0; i < videoPinsArray.length; i++) {
            videoPinsArray[i].show = false;
        }
        
    } else {
        $(".toolButton.mid.active").removeClass("active")
        $("#cameraPinList");
        $("#addvideocam").addClass("active")
        OnClickCameraFeedv3()
        openDrawTool()
        
    }
    $('.instructionContainer.drawTool').show();
}

function OnClickAddCameraSave() {   
    setInstruction('')
    event.preventDefault();
    var name = $('#camName').val();
    var height = $('#camHeight').val();
    var lng = $('#camLong').val();
    var lat = $('#camLat').val();
    var videoName = ""
    var videoType;
    if ($("#videoSourceRadio input[name=video]:checked").attr('id') == "localVideo") {
        if (videoR.files.length > 0) {
            videoName = videoR.files[0].fileName;
            $('#videoFileName').val(videoName);
        }
        videoType = 0
    } else {
        videoType = 1
        videoName = $("#embedLinkInput").val()
    }

    if (videoPinEdit == true) {
        var videoPinDetails = {
            id: videoPinData[videoPinIndex].videoPinID,
            name: name,
            height: height,
            vURL: videoName,
            vType: videoType,
            functionName: 'updateVideoCam'
        };

        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            dataType: 'json',
            data: videoPinDetails,
            success: function (obj, textstatus) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                var i = videoPinIndex;
                viewer.entities.removeById(videoPinsArray[i].id);
                videoPinsArray.splice(i, 1);
                var mypin = addVideoPin(name, videoPinData[i].longitude, videoPinData[i].latitude, height, true);
                videoPinsArray.splice(i, 0, mypin);
                videoPinData[i].videoPinName = name;
                videoPinData[i].height = height;
                videoPinData[i].videoURL = obj['videoPath'];
                videoPinData[i].videoType = videoType;
                $('#cameraPinList').find('div#video_name').eq(i).text(name);
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
        videoPinEdit = false;
    } else {
        var videoPinDetails = {
            name: name,
            longitude: lng,
            latitude: lat,
            height: height,
            vURL: videoName,
            vType: videoType,
            functionName: 'addVideoCam'
        };

        $('#startCamFile').attr('disabled',true);

        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            dataType: 'json',
            data: videoPinDetails,
            success: function (obj, textstatus) {

                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                
                var data = obj['data'];

                $('#camName').val("");
                $('#camLong').val("");
                $('#camLat').val("");
                $('#camHeight').val("");
                $('#videoFileName').val("");
                $('input[name="video"]').prop('checked', false);
                $('#browseCamFile').val("");
                $('#embedLinkInput').val("");
                $('#videoStatus').val("");
                $(".indicatorContainer").css("display", "none");
                viewer.entities.removeById(tempVideoPin.id);

                let myhtml = '';
				myhtml += 
						'<div class="item justifyBetween" id="videoID_'+ data.videoPinID +'">'+
						'<div id="video_name">'+ data.videoPinName +'</div>'+
						'<div>'+
                            '<a onclick="flyToVideoPin('+ data.videoPinID +')" id="flyTo" title="Fly To"><i class="fa-solid fa-binoculars"></i></a>'+
                            '<a class="toolButton videoPlay" onclick="wizardOpenPage(this)" value="'+ data.videoPinID +'" rel="insight" data-page="viPage" data-width="70" data-height="75" title="Play Video"><i class="fa-solid fa-play"></i></a>'+
                            '<a onclick="editVideoPinDetails('+ data.videoPinID +')" title="Edit"><i class="fa-solid fa-pencil"></i></a>'+
							'<a onclick="deleteVideoPin('+ data.videoPinID +')" title="Remove"><i class="fa-solid fa-trash"></i></a>';

				myhtml  +=	'</div>'+
							'</div>';
                videoPinsArray.push(addVideoPin(name, lng, lat, height, true));
                videoPinData.push(data);

                if($('.videoNoDetails')){
                    $('.videoNoDetails').remove()
                }

                $('#cameraPinList').append(myhtml);

                $('#startCamFile').attr('disabled',false);

                flagCamera = true;
                $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });

    }
}

function OnClickAddCameraCancel() {

    $('#addvideocam.active').removeClass('active')
    $('#camName').val("")
    $('#camLong').val("");
    $('#camLat').val("");
    $('#camHeight').val("");
    $('#videoFileName').val("");
    $('#embedLinkInput').val("");
    $('#videoStatus').val("");
    $("#RIContainer").css("cursor", "url('../Images/ccrosshair.cur'),auto");
    $('#videoFileName').html('');
    $('#embedLinkInput').val('');
    flagCamera = true;

    if(tempVideoPin){
        viewer.entities.remove(tempVideoPin); //remove pinned video loc
    }
}

function deleteVideoPin(videoID) {
    var j = 0;
	var myindex;
	var pinname;
	while (j < videoPinData.length) {
		if (videoID == videoPinData[j].videoPinID) {
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
					$.ajax({
						type: "POST",
						url: '../BackEnd/fetchDatav3.php',
						dataType: 'JSON',
						data: { id: videoID, functionName: 'deleteVideoCam' },
						success: function (obj, textstatus) {
                            
							videoPinData.splice(myindex, 1);
							var billboard = videoPinsArray[myindex];
							viewer.entities.removeById(billboard._id);
							videoPinsArray.splice(myindex, 1);
                            $(`#videoID_${videoID}`).remove();
                            $('#videoStatus').val("");

                            if($('#cameraPinList .item').length == 0){
                                $('#cameraPinList').html('<div class="item justifyBetween videoNoDetails">There are no details stored for Video</div>');
                            }
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

function playVideoPin(videoID) {
	var j = 0;
	while (j < videoPinData.length) {
		if (videoID == videoPinData[j].videoPinID) {
			var videoContainer = document.getElementById("videoContainer");
			if (!$('#videoframe').hasClass('active')) {
				if (videoPinData[j].videoType == 0) {
					$(videoContainer).html(`<video style='height:90%; width: 100%; object-fit: cover; z-index: -100; margin-top: 20px;' controls>\
					<source id='source' src="../../${encodeURI(videoPinData[j].videoURL)}" type ='video/mp4'>\
				</video>`);
                
					$(videoContainer).attr("dataType", "0")
					var myVideo = $(videoContainer).find("video")[0]
					myVideo.load();
					myVideo.play();
				} else {
					$(videoContainer).attr("dataType", "1")
					$(videoContainer).html(`<iframe style="width:100%; height:100%; padding: 0px 0px" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
				}

				$("#videoframe").addClass('active');
                $("#videoframe").css("display", "block");
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
                            $("#videoframe").css("display", "block");
							myVideo.load();
							myVideo.play();
						} else { //pause video and close frame
							$("#videoframe.active").removeClass('active');
                            $("#videoframe").css("display", "none");
							var myVideo = $(videoContainer).find("video")[0]
							if (myVideo !== undefined) {
								myVideo.pause()
							}
						}
					} else {
						$(videoContainer).html(`<iframe style="width:100%; height:100%; padding: 0px 0px" src="${videoPinData[j].videoURL}" allow="accelerometer; autoplay; picture-in-picture" allowfullscreen></iframe>`);
                        $("#videoframe").css("display", "block");
					}

				} else { //video format not same

					if ($(videoContainer).attr("dataType") == 0) { // if loaded is mp4 && user intend to change video
						$(videoContainer).attr("dataType", "1")
                        $("#videoframe").css("display", "block");
					} else { //if loaded is embedded
						$(videoContainer).html(`<video style='height:100%; width: 100%; object-fit: cover; z-index: -100;' controls>\
						<source id='source'  src='${encodeURI(videoPinData[j].videoURL)}' type ='video/mp4'>\
					</video>`);

						$(videoContainer).attr("dataType", 0)
						var myVideo = $(videoContainer).find("video")[0]
						myVideo.load();
						myVideo.play();
                        $("#videoframe").css("display", "block");
					}
				}
			}

			break;
		};
		j++;
	}
}

function editVideoPinDetails(videoID) {
	uploadType = "VIDEO";
	$('#embedLinkInput').val("")
    
	videoR.cancel();
	$("#videoFileName").text("")
	$("#videoStatus").text("")
	var j = 0;
	while (j < videoPinData.length) {
		if (videoID == videoPinData[j].videoPinID) {

            $('.navBox.drawTool').css("display", "flex");
			$('.navBox.drawTool .infoHeader .header').text("Edit video");
            $('.pageContainer.earthViewItem').removeClass("active");
            $('.pageContainer.LayerItem').removeClass("active");
			$('.pageContainer.cameraItem').addClass("active");
			$('.instructionContainer.drawTool').html("");

			if (videoPinData[j].videoType == 1) {
				$(".localVideo").hide()
				$(".embedVideo").show()
				$("#embedLinkInput").val(videoPinData[j].videoURL)
				$("#EmbedLink").prop('checked', 'checked')
				$("#localVideo").removeAttr('checked')
			} else {
				$(".localVideo").show()
				$(".embedVideo").hide()
				let res = (videoPinData[j].videoURL).split("/");
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
			viewer.flyTo(videoPinsArray[j]);
			break;
		}
		j++;
	}
    $(".navBox.cameraFeed").css('display', 'flex')
}

function flyToVideoPin(videoID) {

	$("#videoframe.active").removeClass('active');
	$("#videoframe").css("display", "none");
	var videoContainer = document.getElementById("videoContainer");
	var myVideo = $(videoContainer).find("video")[0]
	if (myVideo !== undefined) {
		myVideo.pause()
	}
	var i = 0;
	while (i < videoPinData.length) {
		if (videoPinData[i].videoPinID == videoID) {
			viewer.flyTo(videoPinsArray[i]);
			break;
		}
		i++;
	};
}

//-------------START FUNCTION FOR SYSTEM ADMIN--------------//
function onFunctionSysAdmin(ele, frameId){
    let linkid = $(ele).attr('id');
    
    $("#"+frameId)[0].contentWindow.closeAllMain();
    $("#"+frameId)[0].contentWindow.openDivSysAdmin(ele);

    switch(linkid){
        case 'activeUser':
            $("#"+frameId)[0].contentWindow;
            break;
        case 'inactiveUser':
            $("#"+frameId)[0].contentWindow;
            break;
        case 'activeProject':
            $("#"+frameId)[0].contentWindow;
            break;
        case 'archivedProject':
            $("#"+frameId)[0].contentWindow;
            break;
    }

    leftMenuButtonHightlight(ele)
}

// fucntion to refresh user list inside project creation/edit wizard
function refreshUserListProjectCreation(val = '', varType = '', typeCheck = '', projOwner = '') {

    if (!val)
        pid = "None";
    else if (varType == 'int') {
        pid = val;
        console.log("not array : " + pid)
    }
    else{
        pid = $(`#${val}`).val();
    }

    var ptype = "CONSTRUCT" ;
    var ownerRoles = "";

    if(val) ptype = $(`#${val}`).find(":selected").attr('projecttype'); // for new package
    if(typeCheck) ptype = typeCheck;
    
    if(!projOwner && val) projOwner = $(`#`+val).find(":selected").attr('projectOwner');
        
    if(projOwner == 'SSLR2'){
        ownerRoles = constructOwnerRoles.concat(sslr2OwnerRoles);
    }else{
        if(ptype == 'ASSET'){
            ownerRoles = assetOwnerRoles;
        }else if(ptype == 'CONSTRUCT'){
            ownerRoles = constructOwnerRoles
        }else if(ptype == 'FM'){
            ownerRoles = fmOwnerRoles;
        }
    }
    ownerRoles.sort();
    
    $.ajax({
        url: "../BackEnd/UserFunctionsV3.php",
        type: "POST",
        dataType: "json",
        async: false,
        data: {
            project_id: pid,
            functionName: 'getAllUsers'
        },
        success: function (response) {
            var adduserhtml = "";
            for (var i = 0; i < response.length; i++) {
                let UserType;
                switch (response[i].user_type) {
                    case "user":
                        UserType = "User";
                        break;
                    case "system_admin":
                        UserType = "System Admin";
                        break;
                }
                switch (response[i].orgType) {
                    case "owner":
                        adduserhtml += 
                            `<div class="row system-admin fiveColumn userProjectSearch">
                                <div class="columnSmall">
                                    <span class="text"><input type="checkbox" onchange="addUserToProject(this)" class="addusertable" data-userid= "`+response[i].user_id +`" data-userselect="adduserselect" data-userdbc="`+response[i].dbc_user+`" id="`+ response[i].user_id+`"></span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_email+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_firstname+` `+response[i].user_lastname+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].orgName+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_country+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`;
                    adduserhtml +=      `<select data-userid='`+response[i].user_id+`' id="s`+response[i].user_id+`" class = "adduserselect" style="display: none;">`;
                                            adduserhtml += '<option value= "">Please Select...</option>';
                                            ownerRoles.forEach((ele)=>{
                                                adduserhtml += '<option value= "'+ele+'">'+ele+'</option>';
                                            })
                    adduserhtml +=      `</select>`
                    adduserhtml += `</span>
                                </div>
                            </div>`;
                        break;
                    case "DBC":
                        adduserhtml += 
                            `<div class="row system-admin fiveColumn userProjectSearch">
                                <div class="columnSmall">
                                    <span class="text"><input type="checkbox" onchange="addUserToProject(this)" class="addusertable" data-userid= "`+response[i].user_id +`" data-userselect="adduserselect" data-userdbc="1" id="`+ response[i].user_id+`"></span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_email+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_firstname+` `+response[i].user_lastname+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].orgName+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_country+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`;
                    adduserhtml +=      `<select data-userid='`+response[i].user_id+`' id="s`+response[i].user_id+`" class = "adduserselect" style="display: none;">`;
                                            adduserhtml += '<option value= "">Please Select...</option>';
                                            ownerRoles.forEach((ele)=>{
                                                adduserhtml += '<option value= "'+ele+'">'+ele+'</option>';
                                            })
                    adduserhtml +=      `</select>`
                    adduserhtml += `</span>
                                </div>
                            </div>`;
                        break;
                }

            };
            $('#addUserTable').html(adduserhtml);
        },
        error: function (){
            $('#addUserTable').html("");
        }
    });

    if(projOwner == 'SSLR2'){
        $('.content-sub-contract-level').css("display", "flex");
    }else{
        $('.content-sub-contract-level').css("display", "none");
    }
}

// fucntion to refresh user list inside project creation/edit wizard obyu
function refreshUserListBasedOnOrg(parentIdVal, ownerVal, ownerOrgArr, mode = 'new') {
    ownerid = '';

    if (!parentIdVal){
        pid = '';
    }
    else{
        pid = $(`#${parentIdVal}`).val();
        ownerid = $(`#${parentIdVal}`).find(":selected").attr("projectowner");
    }

    if(ownerVal){
        ownerid = $(`#${ownerVal}`).val();
    }

    if(ownerOrgArr){
        ownerid = ownerOrgArr[0];
        pid = (ownerOrgArr[1]) ? ownerOrgArr[1] : '';
    }

    $.ajax({
        url: "../BackEnd/UserFunctionsOBYU.php",
        type: "POST",
        dataType: "json",
        async: false,
        data: {
            parentId: pid,
            ownerId: ownerid,
            functionName: 'getOrgOwnerMember'
        },
        success: function (response) {
            var adduserhtml = "";
            for (var i = 0; i < response.length; i++) {
                let UserType;
                switch (response[i].user_type) {
                    case "user":
                        UserType = "User";
                        break;
                    case "system_admin":
                        UserType = "System Admin";
                        break;
                }
                switch (response[i].orgType) {
                    case "owner":
                        adduserhtml += 
                            `<div class="row system-admin fiveColumn userProjectSearch">
                                <div class="columnSmall">
                                    <span class="text"><input type="checkbox" onchange="addUserToProject(this)" class="addusertable" data-userid= "`+response[i].user_id+`" data-userselect="adduserselect" data-userdbc="`+response[i].dbc_user+`" id="`+ response[i].user_id+`"></span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_email+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_firstname+` `+response[i].user_lastname+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].orgName+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text wordWrap">`+response[i].user_country+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">
                                        <select data-userid='`+response[i].user_id+`' id="s`+response[i].user_id+`" class = "adduserselect" style="display: none;">`;
                                            adduserhtml += '<option value= "">Please Select...</option>';
                                            obyuOwnerRoles.forEach((ele)=>{
                                                adduserhtml += '<option value= "'+ele+'">'+ele+'</option>';
                                            })
                                            if(ownerid == 'MRSB'){
                                                adduserhtml += '<option value= "Land Officer">Land Officer</option>';
                                            }
                                        adduserhtml += `</select>
                                    </span>
                                </div>
                            </div>`;

                        break;
                }

            };
            $('#addUserTable').html(adduserhtml);

            if(mode == 'new'){
                refreshJogetAppListBasedOnOrg()
            }
        }
    });
}

//function to refresh joget package app list in page 2 based on project owner
function refreshJogetAppListBasedOnOrg(){
    var selOwner = $("#projectOwner :selected");
    var selOwnerVal = selOwner.val();
    var check = selOwner.attr("data");   //constructs app config, 1 = with config, else no config

    var constructProcessArr = {
        KACC:['app_NCR','app_WIR','app_RFI','app_MOS','app_MS','app_IR','app_SDL','app_SD','app_RS','app_SA','app_SMH','app_PTW','app_CAR'],
        MRSB:['app_NCR','app_WIR','app_RFI','app_MOS','app_MS','app_IR','app_SDL','app_SD','app_RS','app_SA','app_SMH','app_RR','app_NOI','app_PUBC','app_EVNT', 'app_LAND']  
    };

    //reset construct value
    $("#jogetPackage").val("").trigger("change");
    $("#jogetFinancePackage").val("").trigger("change");
    $("#jogetDocPackage").val("").trigger("change");

    if (check == "1") {
        $("#constructAppContainer").css("display", "flex");
        $("#financeAppContainer").css("display", "flex");
        $(".jogetApp_list").parent().parent().hide();

        // hide all process, only show related one based on the constructProcessArr
        if (constructProcessArr[selOwnerVal]) {
            for (const [idx, ele] of Object.entries(constructProcessArr[selOwnerVal])) {
                if ($('#'+ele).length != 0) {
                    $('#'+ele).parent().parent().css("display", "flex");
                }
            }
        }
    }
    else {
        //UTSB, KURW, Shorefield, OBYU Reality does not exist finance and document app
        $("#constructAppContainer").hide();
        $("#financeAppContainer").hide();
        $(".jogetApp_list").prop('checked', false);
        $('.jogetPFS_App_list').prop('checked', false);
    }
}

//-------------END FUNCTION FOR SYSTEM ADMIN--------------//

//-------------START FUNCTION FOR PROJECT ADMIN--------------//
function onFunctionProjAdmin(ele, frameId){
    let linkid = $(ele).attr('id');
    let divOpen = $(ele).attr('rel');

    $("#"+frameId)[0].contentWindow.closeAllMain();
    $("#"+frameId)[0].contentWindow.openDivAdmin(divOpen);

    let parentTagNameText = "Project Progress";
   
    switch (linkid) {
        case 'editcurrProject':
            $("#"+frameId)[0].contentWindow.editProject();
            break;
        case 'listUsers':
            $("#"+frameId)[0].contentWindow.loadProjectUsers();
            break;
        case 'addRemoveUsers':
            $("#"+frameId)[0].contentWindow.refreshAdminUserTable();
            break;
        case 'otherData':
            $("#"+frameId)[0].contentWindow.DataPool_table();
            break;
        case 'aerialData':
            $("#"+frameId)[0].contentWindow.checkAic();
            break;
        case 'aerialDataShare':
                $("#"+frameId)[0].contentWindow.shareAic();
                break;
        case 'addSchedule':
            $("#"+frameId)[0].contentWindow.changeSchedule();
            break;
        case 'mapSchedule':
            $("#"+frameId)[0].contentWindow.mapSchedule();
            break;
        case 'configProjectWise365':
            $("#"+frameId)[0].contentWindow.getConfigDetails();
            break;
        case 'configProjectWise':
            $("#"+frameId)[0].contentWindow.getConfigDetails();
            break;
        case 'configPowerBI':
            $("#"+frameId)[0].contentWindow.getConfigDetails();
            break;
        case 'cons_issue_PPU':
        case 'cons_datalist_PPU':
        case 'cons_datalist_PF':
        case 'construct_list_PPU':
            $("#"+frameId)[0].contentWindow.openJogetFromProjAdmin(linkid, false, parentTagNameText);
            break;
        case 'cons_datalist_exportPP':
            $("#"+frameId)[0].contentWindow.openJogetFromProjAdmin(linkid, false, parentTagNameText);
            break;
        case 'cons_issue_OPU':
        case 'cons_datalist_OPU':
            parentTagNameText = $(ele).data('title');
            $("#"+frameId)[0].contentWindow.openJogetFromProjAdmin(linkid, false, parentTagNameText);
            break;
        case 'fm_lookup_list_currency':
        case 'fm_lookup_list_division':
        case 'fm_lookup_list_purchasingOrg':
        case 'fm_lookup_list_trades':  
        case 'fm_asset_type_manage':     
        case 'fm_category_manage': 
            parentTagNameText = $(ele).find('.parentTagName').text();
            $("#"+frameId)[0].contentWindow.openJogetFromProjAdmin(linkid, false, parentTagNameText);
            break;
        case 'construct_issue_PPU':
            $("#"+frameId)[0].contentWindow.openJogetFromProjAdmin(linkid, true, parentTagNameText);
            break;
        case 'asset_hierarchy_crud':  
            $("#"+frameId)[0].contentWindow.openJogetFromProjAdmin(linkid, true, 'Asset Hierarchy');
            break;
        default:
            break;
    }

    leftMenuButtonHightlight(ele)
}
//-------------END FUNCTION FOR PROJECT ADMIN--------------//


//-------------START FUNCTION FOR INSIGHT----------------//
function removeHistoryMeasure(){
    $("#historyMeasure").html("");
    measureDataArr.splice(0,measureDataArr.length)

    for (var i = 0; i < 3; i++) {
        labelEntity[i].label.show = false;
    };

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    distEntities = [];
    distanceEntity = 0;
    distance = 0;
    positionCounter = 0;
    flagPosEntities = false;
}

function clearAllFlag(){
    // to clear flags for identity button
    viewer.selectedEntity = undefined;

    // to clear flags
    flagMeasure = false;
    flagEntity = false;
    flagDraw = false;
    flagEdit = false;
    flagEditModel = false;
    flagCamera = false;
    flagIoT = false;
    flagAddImage = false;
    flagMarkupTools = false;
    flagPosEntities = false;
    flagFolderDirectory = false;

    $('.floatBoxFooter .folderMoreInfo').css("display", "none");
    
    MeasureTool = "";
    $('#RIContainer').css('cursor', "default");

    if(labelEntity.length > 1){
        for (var i = 0; i < 3; i++) {
            labelEntity[i].label.show = false;
        }
    }

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    distEntities.splice(0, distEntities.length);
    distanceEntity = 0;
    distance = 0;

    resetpinpointtoolValue();
    resetDrawMarkupTool();
    removeBillboardMarkupTool();
    removeLabelMarkupTool();
    resetTrackAnimation();

    //to remove video pins
    for (var i = 0; i < videoPinsArray.length; i++) {
        videoPinsArray[i].show = false;
    }
    $("#videoframe").removeClass("active");

    var videoContainer = document.getElementById("videoContainer");
    var myVideo = $(videoContainer).find("video")[0];
    if ($(videoContainer).find("video")[0]) {
        myVideo.pause();
    }

    if (tempVideoPin) {//remove tempVideoPin if not saved
        viewer.entities.removeById(tempVideoPin.id);
    }
 
    viewer.selectedEntity = undefined;
}

function resetpinpointtoolValue() {
    //REMOVING THUMBTACK AND BLUE DRAWING FROM MARK ASSET
    if(tempMarkAssetPin){
        viewer.scene.primitives.remove(tempModel); //remove the drawing
        viewer.entities.removeById(tempMarkAssetPin.id);
    }

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };

    distEntities.splice(0, distEntities.length);
    distanceEntity = 0;
    distance = 0;

    //reset all input fields
    $('.inputcontainer .column1').find('input').prop("checked", false);
    $('.inputcontainer .column2').find('input').prop("checked", false);
    $('.inputcontainer .column3').find('input').prop("checked", false);
}

function resetTrackAnimation(){
    arrayHeadings = [];
    arrayOfPositions = null;
    pointEntity = null;
    lastCurrentTime = null;
    polyEntity = null;
    flagAnimate = false;

    $('#trackDuration').val('');
    $('#trackDate').val('');
    $('#trackLevel').val('');

    let j = 0;
    var indicatorArr = viewer.entities.values
    while (j < indicatorArr.length) {
        var indName = indicatorArr[j].name
        if(indName == 'indicator'){
            viewer.entities.remove(indicatorArr[j])
        }
        j++;
    }

    if(trackData.length !== 0){
        for(var i = 0; i < trackData.length; i++){
            if(trackData[i].tileset){
                trackData[i].tileset.then((value) => {
                    value.show = false;
                });
            }
        }
    }

    stopTrackAnimation();
}

function tabAICData(ele) {
    let openTab = $(ele).attr('rel');
    let id = $(ele).attr('id');
    let category = $(ele).data('category')
    var d = document.getElementById(id);
    $(".icon#aerialEditBtn").data('aicedit', category)

    if ($(".tab").hasClass("active")) {
        if (openTab == 'uploadData_Weekly') {
            d.className += " active";
            aicRoutineType = 0;
            $("#" + openTab).css("display", "block");
            $('.ecwCheckbox').prop('checked', false);
            $("#uploadData_Monthly").css("display", "none");
            $("#uploadData_Quarterly").css("display", "none");
            $("#uploadTab_Monthly").removeClass("active");
            $("#uploadTab_Quarterly").removeClass("active");
        }
        if (openTab == 'uploadData_Monthly') {
            d.className += " active";
            aicRoutineType = 1;
            $("#" + openTab).css("display", "block");
            $('.ecwCheckbox').prop('checked', false);
            $("#uploadData_Weekly").css("display", "none");
            $("#uploadData_Quarterly").css("display", "none");
            $("#uploadTab_Weekly").removeClass("active");
            $("#uploadTab_Quarterly").removeClass("active");
        }
        if (openTab == 'uploadData_Quarterly') {
            d.className += " active";
            aicRoutineType = 2;
            $("#" + openTab).css("display", "block");
            $('.ecwCheckbox').prop('checked', false);
            $("#uploadData_Weekly").css("display", "none");
            $("#uploadData_Monthly").css("display", "none");
            $("#uploadTab_Weekly").removeClass("active");
            $("#uploadTab_Monthly").removeClass("active");
        }
    }
}

function OnClickAerialEdit(ele){
    $('#aerialEditContainer').children().remove()
    let editcontainer = document.getElementById("aerialEditContainer")
    if ($(ele).hasClass('active')){
        $(ele).removeClass('active', function(){
            $('#aerialEditContainer').slideUp(100)
            $('#aerialEditContainer').children().remove()
        })
    }else{
        $(ele).addClass('active', function(){
            ele.insertAdjacentElement("afterend", editcontainer);
            $(ele).siblings().removeClass('active')
            $(ele).addClass('active')
            $('#aerialEditContainer').slideDown({
                start: function () {
                    $(this).css({
                      display: "block"
                    })
                }
            })

            $('#aerialEditContainer').append('<td colspan="3">'+
                '<div class="editColumn">'+
                    '<div class="column1">'+
                        '<span class="padding">Category :</span>'+
                        '<div class="padding flex">'+
                            '<div class="flex alignItem">'+
                                '<input type="radio" id="catRadio" name="aerialEditCat" value="KM">'+
                                '<label for="kmPost">KM Post</label>'+
                            '</div>'+
                            '<div class="flex alignItem">'+
                                '<input type="radio" id="catRadio" name="aerialEditCat" value="CH">'+
                                '<label for="chainage">Chainage</label>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="column2" style="display: none">'+
                        '<div class="innercolumn1">'+
                            '<div class="inputContainer">'+
                                '<label class="required">Start</label>'+
                                '<input type="number" id= "startValue">'+
                            '</div>'+
                            '<div class="inputContainer">'+
                                '<label class="required">End</label>'+
                                '<input type="number" id= "endValue">'+
                            '</div>'+
                        '</div>'+
                        '<div class="innercolumn2">'+
                            '<button onclick = "updateECW(this)">Update</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</td>')

            let ecw_id = $(ele).find('.id').html();
            let ecw_currentName = $(ele).find('.name').html();
            ecwDetails = {id: ecw_id, curr_name: ecw_currentName};

        })
    }
}

function updateECW (e){
    let ecw_cat = $('input[id="catRadio"]:checked').val();
    let start_val = $("#startValue").val()
    let end_val = $("#endValue").val()

    if(!start_val || !end_val){
        $.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Aerial Function',
			content: 'Empty input, data will not be saved',
		});
        return;
    }

    var ecwNewName = ecw_cat + ':' + start_val + ',' + end_val

    if(ecwNewName == ecwDetails.curr_name){
        $.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Aerial Function',
			content: 'Input same as current name, data will not be saved',
		});
        return;
    }

    $.ajax({
        type: "POST"
        , url: '../BackEnd/DataFunctions.php'
        , dataType: 'json'
        , data: {
            functionName: 'updateECWName', data_id: ecwDetails.id, set_name: ecwNewName
        }
        , success: function (obj, textstatus) {
            if(obj.bool === true){
                if ($('.rowEcw').hasClass('active')){
                    $('.rowEcw').removeClass('active', function(){
                        $('#aerialEditContainer').slideUp(100)
                        $('#aerialEditContainer').children().remove()
                        loadECW()
                    })
                }
            }
            else{
                $.alert({
					boxWidth: '30%',
					useBootstrap: false,
                    title: 'Message',
                    content: 'Update failed! Please try again',
                });
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
            console.log('error saving ecw')
        }
    })

}

function getMetadataDetails(event, metaid, layername){
    $("#metadataDetails").addClass("moreInfo small active")
    
    $.ajax({
		type: "POST",
		dataType: "JSON",
		url: "../BackEnd/fetchDatav3.php",
		data: { 
			functionName: "fetchMetadata" ,
			metaid: metaid
		},
		success: function (obj) {
            var metadataDetailHTML = "";
            if (obj.bool) {
                var metaInfo = obj.data;
                
                metadataDetailHTML += `<div class="header">`;
                metadataDetailHTML += `<input disabled value="`+layername+`" id="" data-id=""/>`;
                metadataDetailHTML += `</div>`;
            
                metadataDetailHTML += `<div class="header">`;
                metadataDetailHTML += `<span class="title">`+metaInfo.md_mission_id+`</span>`;
                metadataDetailHTML += `</div>`;
            
                metadataDetailHTML += `<div class="content">`;
                metadataDetailHTML += `<div class="col1">`;
                metadataDetailHTML += `<div>Date</div><div>Start Time</div><div>End Time</div>`;
                metadataDetailHTML += `</div>`;
            
                metadataDetailHTML += `<div class="col2 no-col3">`;
                metadataDetailHTML += `<div class="no-col3">`+metaInfo.md_date_created+`</div><div class="no-col3">`+metaInfo.md_start_time+`</div><div class="no-col3">`+metaInfo.md_end_time+`</div>`;
                metadataDetailHTML += `</div>`;
            }else{
                metadataDetailHTML += `<div class="header">`;
                metadataDetailHTML += `<input disabled value="`+obj.msg+`" id="" data-id=""/>`;
                metadataDetailHTML += `</div>`;
			}
            $("#metadataDetails").html(metadataDetailHTML);
		}
	})

    event.stopPropagation();
}

function getLayerDetail(e) {

    var layerDetailHTML = '';
    var layerName = $(e).attr('data-name');
    var layerID = $(e).attr('data-id');
    var layerType = $(e).attr('data-type');
    var layerView = $(e).attr('data-view');
    var layerDate = $(e).attr('data-date');
    var layerOwner = $(e).attr('data-owner');
    var layerAnimation = $(e).attr('data-animate');

    var labelButton = "";
    var enableButton = "";
    
    layerDetail = {id: layerID, name: layerName, view: layerView, ele: e , animation: layerAnimation};
    
    if (layerView == "ON") {
        labelButton = "OFF";
    } else {
        labelButton = "ON";
    }

    if (layerAnimation == "Enable") {
        enableButton = "Disable"
    } else {
        enableButton = "Enable"
    }

    layerDetailHTML += `<div class="header">
                            <input disabled value="`+layerName+`" id="layerName" data-id="`+layerID+`"/><button onclick="changeLayerNameHandler(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                        </div>
                        <div class="content">
                            <div class="col1">
                            <div>Ref.ID</div><div>Owner</div><div>Type</div><div>Default</div><div>Uploaded Date</div>
                        </div>
                        <div class="col2">
                            <div>`+layerID+`</div><div>`+layerOwner+`</div><div>`+layerType+`</div><div id="layerDefaultView">`+layerView+`</div><div>`+layerDate+`</div>
                        </div>
                        <div class="col3">
                            <div><label>Detach from project</label><button onclick="detachFromProject()">Detach</button></div>
                            <div><label>Turn on by default</label><button onclick="switchDefDisplay()" id="switchDefaultDisplay">Turn `+labelButton+`</button></div>
                            <div><label>Enable Animation</label><button onclick="switchAnimation()" id="enableFlyThrough">`+enableButton+`</button></div>
                            </div>
                        </div>`;

    $("#manageLayerDetail").html(layerDetailHTML);
}

function editLayerDetails(ele) {
	var layerName = $(ele).attr('data-name');
	var layerId = $(ele).attr('data-id');
	var layerDataType = $(ele).attr('data-type');
	var layerDate = $(ele).attr('data-dateCreated');
	var layerStartTime = $(ele).attr('data-startTime') != 'null' ? $(ele).attr('data-startTime') : '';
	var layerEndTime = $(ele).attr('data-endTime') != 'null'  ? $(ele).attr('data-endTime') : ''; 
	var layerMissionId = $(ele).attr('data-missionId') != 'null'  ? $(ele).attr('data-missionId') : '';
	var layerMetaId= $(ele).attr('data-metaId') != 'null'  ? $(ele).attr('data-metaId') : '';
	var projectLayerId= $(ele).attr('data-projectLayerId');
	var show_metadata= $(ele).attr('data-show_metadata') == 'true' ? 'true' : 'false';

    $('#RIContainer').css('cursor', "default");
	$('.navBox.drawTool').css("display", "flex");
	$('.navBox.drawTool .infoHeader .header').text("Edit Layer");
    $('.pageContainer.cameraItem').removeClass("active");
	$('.pageContainer.earthViewItem').removeClass("active");
	$('.pageContainer.layerItem').addClass("active");
	$('.instructionContainer.drawTool').html("");

	$('#layerId').val(layerId);
	$('#layerName').val(layerName);
	$('#layerType').val(layerDataType);
    $('#folderName').val(layerName);
    $('#projectLayerId').val(projectLayerId);
    
    if(show_metadata == 'true'){
        $('#showMetadata').prop('checked', true);
        $('.metaDataEdit').css("display","block")
    }else{
        $('#showMetadata').prop('checked', false);
        $('.metaDataEdit').css("display","none")
    }

    $('#missionCycleId').val(layerMissionId);
    layerDateSplit = layerDate.split(" ");
    $('#layerDate').val(layerDateSplit[0]);
    
    $('#layerStartTime').val(layerStartTime);
    $('#layerEndTime').val(layerEndTime);
    $('#metaId').val(layerMetaId);

    // if (layerMetaId != "null" && layerMetaId != ""){
    //     $('.metaDataEdit').css("display","block")
        
    // }else{
    //     $('.metaDataEdit').css("display","none")
    // }
    

	if (layerDataType == 'KML'){
        $("#folderNameDiv").css("display","none")
		$("#layerFileName").removeAttr("webkitdirectory");
		$("#layerFileName").removeAttr("mozdirectory");
		$("#layerFileName").attr("accept", ".kml,.kmz");
	}else{
        $("#folderNameDiv").removeAttr("style");
		$("#layerFileName").removeAttr("accept");
		$("#layerFileName").attr('webkitdirectory','');
		$("#layerFileName").attr('mozdirectory','');
	}
}


function getIotDetail(e) {
    var IoTNotiDetailHTML = '';
    var IotCreatedAt = $(e).attr('data-created-at');
    var IoTDatetime = $(e).attr('data-datetime');
    var IotElementID = $(e).attr('data-element-id').substring(1);
    var IotID = $(e).attr('data-iot-id');
    var IoTName = $(e).attr('data-iot-name');
    var IoTType = $(e).attr('data-iot-type');
    var IoTSensor = $(e).attr('data-sensor-colour');
    var IoTValue = $(e).attr('data-value');

    IoTNotiDetailHTML += `<div class="header">
                            <input disabled value="IOT Name" id="layerName" data-id=""/>
                        </div>
                        <div class="content">
                            <div class="col1">
                                <div>Created At</div><div>Datetime</div><div>Element ID</div><div>IoT ID</div><div>IoT Name</div><div>IoT Type</div><div>Sensor Colour</div><div>Value</div>
                        </div>
                         <div class="col2">
                             <div>`+IotCreatedAt+`</div><div>`+IoTDatetime+`</div><div>`+IotElementID+`</div><div id="layerDefaultView">`+IotID+`</div><div>`+IoTName+`</div><div>`+IoTType+`</div><div>`+IoTSensor+`</div><div>`+IoTValue+`</div>
                         </div>
                         <div class="col3">
                            <div><label>Acknowledge Latest IoT List</label><button onclick="onClickIoTNotiUpdate()">Update</button></div>
                         </div>
                         </div>`;

    $("#IotNotiDetail").html(IoTNotiDetailHTML);
}

function onClickIoTNotiUpdate(){
    var list =[];
    $('#IoTNotiList input[type=checkbox]').each(function(idx, elem) {
        var is_checked = $(this).prop("checked");
        if(is_checked){
            list.push(Number($(this).val()));
        }
     });
     console.log(list);
     $.ajax({
        type: "POST",
        url: '../BackEnd/getIoTData.php',
        dataType: 'json',
        data: {
            functionName: 'updateIoTNotification', 
            rec_id: JSON.stringify(list)
        },
        success: function (obj) {
            console.log(obj)
            if(obj['bool'] = true){
                //if updated then remove them from the noti list and update bell number
                var count =   $('.bellContainer').attr('data-count');
                console.log(count);
                count = count - list.length;
                console.log(count);
                $('.bellContainer').attr('data-count', count);
                for(var i =0; i< list.length; i++){
                    $('#noti_'+list[i]).remove();
                 }

            }else{
                $.alert({
					boxWidth: '30%',
					useBootstrap: false,
                    title: 'Message',
                    content: obj.msg,
                });
            }
        }
    });
}

function switchAnimation() {

    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: {
            functionName: 'switchAnimation', data_id: layerDetail.id, animation: layerDetail.animation
        },
        success: function (obj, textstatus) {
        
            if (obj.bool === true) {

                $("#manageLayerDetail").show(); // important!

                let lyrlist_container = $("#trackList")
                let lyrlist_item = $("#trackID_"+layerDetail.id)
                var lyrlist_html = ""
                
                if (layerDetail.animation == "Enable") {
                    $("#enableFlyThrough").html("Enable")
                    layerDetail.animation = "Disable";
                    lyrlist_item.remove();
                } else {
                    $("#enableFlyThrough").html("Disable")
                    layerDetail.animation = "Enable";
                    lyrlist_html += '<div class="item justifyBetween" id="trackID_'+layerDetail.id+'">'+
                                        '<div class="ellipsis">'+layerDetail.name+'</div>'+
                                        '<div><a class="fly" onclick="flyToTrackAnimation(this)" title="Fly To"><i class="fa-solid fa-binoculars"></i></a>'+
                                        '<a class="play" onclick="playTrackAnimation(this)" title="Play Track" style="display: inline;"><i class="fa-solid fa-play"></i></a>'+
                                        '<a class="pause" onclick="pauseTrackAnimation(this)" title="Pause Track" style="display: none"><i class="fa-solid fa-pause"></i></a>'+
                                        '<a class="stop" onclick="stopTrackAnimation()" title="Stop Track"><i class="fa-solid fa-rotate-right"></i></a></div>'+
                                    '</div>';
                    lyrlist_container.append(lyrlist_html);
                }
            } else {
                $.alert({
					boxWidth: '30%',
					useBootstrap: false,
                    title: 'Message',
                    content: obj.msg,
                    // content: 'Update failed! Please try again',
                });
            }

            manageLayer(() => {
                // ensure the detail panel stays visible
                $("#manageLayerDetail").show();
            });

        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function switchDefDisplay() {
    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: {
            functionName: 'switchDefaultDisplay', data_id: layerDetail.id, defView: layerDetail.view
        },
        success: function (obj, textstatus) {
            if (obj.bool === true) {
                let lyrlist_item = $("#dataID_"+layerDetail.id).find("input")[0]
                
                if (layerDetail.view == "ON") {
                    lyrlist_item.checked = false;
                    $("#switchDefaultDisplay").html("Turn ON")
                    $('#layerDefaultView').html("OFF")
                    layerDetail.view = "OFF"
                    layerDetail.ele.children[2].innerHTML = `<a class="label">Default: OFF</a>`

                    layerOnCheck(lyrlist_item);
                } else {
                    lyrlist_item.checked = true;
                    $("#switchDefaultDisplay").html("Turn OFF")
                    $('#layerDefaultView').html("ON")
                    layerDetail.view = "ON"
                    layerDetail.ele.children[2].innerHTML = `<a class="label">Default: ON</a>`

                    layerOnCheck(lyrlist_item);
                } if (obj.groupOff) {
                    let grplist_item = $("#layerLi_"+obj.groupOff).find("input")[0]
                    grplist_item.checked = false;

                    layerOnCheck(grplist_item);
                } else if(obj.groupOn) {
                    let list_item = $("#layerLi_"+obj.groupOn).find("input")[0]
                    list_item.checked = true;

                    layerOnCheck(list_item);
                }
            } else {
                $.alert({
					boxWidth: '30%',
					useBootstrap: false,
                    title: 'Message',
                    content: obj.msg,
                    // content: 'Update failed! Please try again',
                });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function detachFromProject() {
    $.confirm({
		boxWidth: '30%',
		useBootstrap: false,
        title: 'Confirm!',
        content: 'Are you sure to detach this layer from the project?',
        buttons: {
            confirm: function () {
                $.ajax({
                    type: "POST",
                    url: '../BackEnd/fetchDatav3.php',
                    dataType: 'json',
                    data: {
                        functionName: "detachLayer",
                        data_id: layerDetail.id
                    },
                    success: function (obj) {
                        if (obj.bool === true) {
                            let lyrlist_item = $("#dataID_"+layerDetail.id)[0]
                            let lyrlist_check = lyrlist_item.children[0]
                            let targetId = $(lyrlist_check).attr('id')
                            $("#manageLayerDetail").html("");
                            //remove entity
                            var i=0;
                            while (i< tilesetlist.length) {
                                if (targetId == tilesetlist[i].name) {
                                    if (tilesetlist[i].type =="kml") {
                                        viewer.dataSources.remove(tilesetlist[i].tileset);
                                    } else {
                                        viewer.scene.primitives.remove(tilesetlist[i].tileset) 
                                    };
                                    break;
                                };
                                i++;
                            };
                            $(lyrlist_item).remove();
                            layerDetail.ele.parentNode.removeChild(layerDetail.ele);
                        } else {
                            $.alert({
								boxWidth: '30%',
								useBootstrap: false,
                                title: 'Message',
                                content: 'Detach failed! Please try again.',
                            });
                        }
                        let tdEle = layerDetail.ele.children[1]
                        let tdName = $(tdEle).text()
                        $('#modelLayerName option').filter(function () { return $(this).html() == tdName; }).remove();
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

//FOR MARK ASSET
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
	}
    else if (myid == "radiobox") {
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


function OnClickPinpointToolSave(e) {
    var x, y, z;
    x = $('#inputx').val();
    y = $('#inputy').val();
    z = $('#inputz').val();

    var width, length, height;
    width = $('#sizewidth').val();
    length = $('#sizelength').val();
    height = $('#sizeheight').val();

    var head, pitch, roll;
    head = $('#orientationhead').val();
    pitch = $('#orientationpitch').val();
    roll = $('#orientationroll').val();
    var myid = $('[name="shape"]:checked').prop('id');
    
    if (x == '' || y == '' || z == '') {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please mark the location',
        });
    } else {
        tempModelData.push({
            x: x,
            y: y,
            z: z,
            shape: myid,
            width: width,
            length: length,
            height: height,
            head: head,
            pitch: pitch,
            roll: roll
        });
        document.getElementsByTagName("body")[0].style.cursor = "default";
        
        wizardOpenPage(e);
        OnClickPinpointToolReset()
        refreshLayerList();
    }
}

function OnClickPinpointToolReset() {
    //REMOVING THUMBTACK AND BLUE DRAWING FROM MARK ASSET
    if(tempMarkAssetPin){
        viewer.scene.primitives.remove(tempModel); //remove the drawing
        viewer.entities.removeById(tempMarkAssetPin.id);
    }

    viewer.scene.primitives.remove(tempModel);

    $('.drawContainer').find('input').val("");
    $('.drawContainer').find('input#radiobox').prop("checked", true);
}

function OnClickAddImageCancel() {
    $("#addimage.active").removeClass('active')
    $('#imgName').val("")
    $('#imgLong').val("");
    $('#imgLat').val("");
    $('#imgHeight').val("");
    $('#imageFileName').val("");
    $("#initImage").val("src", "")
    $("#initImage").removeAttr("src")
    $(".initImageDiv").css("display", "none")
    $("#initImage").removeClass("active")
    $(".verticalLine").css("left", "13px")
    $("#northReset").css("display", "none")
    $(".instructionBox").html("Select center point (North) of image")
    setInstruction(`<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, 'drawTool')
    $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
    
    
    flagAddImage = true;
    
    if(tempImagePin){
        viewer.entities.remove(tempImagePin);
    }
}

function OnClickModelFormSave() {
    var e = document.getElementById('modelLayerName');
    var layerid = e.options[e.selectedIndex].value;
    var bldType = $('#modelBuildingType').val();
    var bldOwner = $('#modelBuildingOwner').val();
    var assetID = $('#modelAssetID').val();
    var assetName = $('#modelAssetName').val();
    var assetSLA = $('#modelAssetSLA').val();
    var markAssetListHTML = '';

    if (layerid == "" || assetName == "" || assetID == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Need Asset Name, Asset ID and Layer Name  to Save the Model!',
        });
        return;
    };
    
    if (isNaN(assetSLA)) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Asset SLA needs to be a number  to Save the Model!',
        });
        return;
    };

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };

    var model = tempModelData.pop();
    var modeldetails = {};
    modeldetails['layer_id'] = layerid;
    modeldetails['bldOwner'] = bldOwner;
    modeldetails['bldType'] = bldType;
    modeldetails['assetID'] = assetID;
    modeldetails['assetName'] = assetName;
    modeldetails['assetSLA'] = assetSLA;


    var formdata = new FormData();
    var tempData = [];
    if (flagEdit && modelIndex != -1) {
        myModels[modelIndex].Layer_id = layerid;
        myModels[modelIndex].BuildingType = bldType;
        myModels[modelIndex].BuildingOwner = bldOwner;
        myModels[modelIndex].AssetID = assetID;
        myModels[modelIndex].AssetName = assetName;
        myModels[modelIndex].AssetSLA = assetSLA;
        viewer.selectedEntity = undefined;
        var selectedEntity = new Cesium.Entity();
        selectedEntity.name = myModels[modelIndex].AssetName
        var myDesc = '<table ><tbody >';
        myDesc += '<tr><th>' + "Asset Type :</th><td>" + bldType + '</td></tr>';
        myDesc += '<tr><th>' + "Asset Owner :</th><td>" + bldOwner + '</td></tr>';
        myDesc += '<tr><th>' + "Asset ID :</th><td>" + assetID + '</td></tr>';
        myDesc += '<tr><th>' + "Asset Name :</th><td>" + assetName + '</td></tr>';
        myDesc += '<tr><th>' + "Asset SLA :</th><td>" + assetSLA + '</td></tr>';
        myDesc += '</tbody></table>';
        selectedEntity.description = myDesc;
        viewer.selectedEntity = selectedEntity;

        $('#floatBoxId .floatBoxBody table tbody').html(myDesc);
        
        modeldetails['entityid'] = myModels[modelIndex].EntityID;
        flagEdit = false;
        formdata.append('modeldetails', JSON.stringify(modeldetails));
        tempData['modeldetails'] = modeldetails;
    } else {
        if (model) {
            formdata.append('model', JSON.stringify(model));
            formdata.append('modeldetails', JSON.stringify(modeldetails));
            tempData['model'] = model;
            tempData['modeldetails'] = modeldetails;
        }
    };
    
    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: {
            functionName: "saveModelAssetData",
            model: tempData['model'],
            modelDetails: tempData['modeldetails'],
        },
        success: function (obj) {
            if (obj.bool === true) {
                $("#wizard").css("display", "none");
                $("#modelBuildingType").val("");
                $("#modelBuildingOwner").val("");
                $("#modelAssetID").val("");
                $("#modelAssetName").val("");
                $("#modelAssetSLA").val("");
                
                var msg = obj.msg;
                var data = obj.data;
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: msg,
                });
                
                if (data) {
                    myModels.push(data);
                    var center = new Cesium.Cartesian3(data.X, data.Y, data.Z);
                    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
                    var hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(data.Head, data.Pitch, data.Roll));
                    var hpr = Cesium.Matrix4.fromRotationTranslation(hprRotation, new Cesium.Cartesian3(0.0, 0.0, -2.0));
                    Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
                    var building1;
                    if (data.Shape == 1) {
                        building1 = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
                            geometryInstances: new Cesium.GeometryInstance({
                                geometry: new Cesium.EllipsoidGeometry({
                                    radii: new Cesium.Cartesian3(data.Width, data.Length, data.Height)
                                }),
                                modelMatrix: modelMatrix,
                                attributes: {
                                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
                                    show: new Cesium.ShowGeometryInstanceAttribute(true)
                                },
                                id: data.EntityID

                            }),
                            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                        }));

                    } else if (data.Shape == 0) {
                        building1 = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
                            geometryInstances: new Cesium.GeometryInstance({
                                geometry: Cesium.BoxGeometry.fromDimensions({
                                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                                    dimensions: new Cesium.Cartesian3(data.Width, data.Length, data.Height)
                                }),
                                modelMatrix: modelMatrix,
                                attributes: {
                                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
                                    show: new Cesium.ShowGeometryInstanceAttribute(true)
                                },
                                id: data.EntityID
                            }),
                            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                        }));

                    };
                    modelsArray.push(building1);

                };

                LoadAnnotateData(function (myResponse) {
                    // all the saved Annotate data for the current project is loaded at the start of the application
                    var actual_JSON = JSON.parse(myResponse);
                    myModels = actual_JSON.data;
                    var markAssetListHTML = ''
                    
                    for (var i = 0; i < myModels.length; i++) {
                        markAssetListHTML += `<div class="list" onclick="OnClickAssetDataTable(this, event)" data-index="${i}" data-name="${myModels[i].AssetName}" data-id="${myModels[i].AssetID}" data-type="${myModels[i].BuildingType}" data-owner="${myModels[i].BuildingOwner}">`
                        markAssetListHTML += `<div class="column1" rel="id-layer_${myModels[i].AssetID}"><a class="label">${myModels[i].AssetName}</a></div>`
                        markAssetListHTML += `<div class="column2 width"><a class="label">${myModels[i].BuildingType}</a></div>`
                        markAssetListHTML += `<div class="column2 width"><a class="label">Default: ${myModels[i].AssetSLA}</a></div>`
                        markAssetListHTML += `</div>`
                    }
                    
                    $("#markAssetList").html(markAssetListHTML);
                
                });

            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Error! Please try again.',
                });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function OnClickModelFormCancel() {
    document.getElementsByTagName("body")[0].style.cursor = "default";
    $("#wizard").css("display", "none");
    $("#modelBuildingType").val("");
    $("#modelBuildingOwner").val("");
    $("#modelAssetID").val("");
    $("#modelAssetName").val("");
    $("#modelAssetSLA").val("");
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    if (flagEdit) {
        flagEdit = false;
    }
}

function OnClickNewEntitySave() {
    var locationName = $('#lName').val();
    var regionName = $('#rName').val();
    if (locationName == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please enter a name for the location.',
        });
        return;
    } else if (regionName == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please enter a region for the location.',
        });
        return;
    };
    SaveMyData(locationName, regionName, currentLng, currentLat);
    //to update the locationList for the JStree...
    var isRegion = false;
    for (var j = 0; j < locationList.length; j++) {
        if (locationList[j].id == regionName) {
            isRegion = true;
        };
    };
    var name;
    if (!isRegion) {
        infoLocationList = [];
        locationList.push({
            id: regionName,
            parent: "regions",
            text: regionName
        });
        infoLocationList.push({
            id: regionName,
            parent: "regions",
            text: regionName
        });
        $('#rootNode').jstree().create_node('#regions', {
            "id": regionName,
            "text": regionName
        }, 'last');
        $('#infoRootNode').jstree().create_node('#regions', {
            "id": regionName,
            "text": regionName
        }, 'last');
    };
    locationList.push({
        id: locationName,
        parent: regionName,
        text: locationName
    });
    infoLocationList.push({
        id: locationName,
        parent: regionName,
        text: locationName
    });
    name = "#" + regionName
    $('#rootNode').jstree().create_node(name, {
        "id": locationName,
        "text": locationName
    }, 'last');
    $('#infoRootNode').jstree().create_node(name, {
        "id": locationName,
        "text": locationName
    }, 'last');
    $("#wizard").css("display", "none");
    $(".modal-container.insight").css("display", "none")
    $(".modal-container.insight .newEntityForm").css("display", "none")
    $('#lName').val("");
    $('#rName').val("");
}

function SaveMyData (locationName, regionName, lng, lat) {
	// this function is used to save the data to mydata.json
	$.post( "../BackEnd/fetchDatav3.php", 
	{
        functionName: 'saveLocationData',
		lName: locationName,
		rName: regionName,
		lng: lng,
		lat: lat,
		status: '0%'
	})
    .done(function( data ) {
        var response = JSON.parse(data);
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: response['msg'],
        });
        var location = response['data'];
        var desc = '<table class = "cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
        desc += '<tr><th>' + "Longitude" + '</th><td>' + lng +'</td></tr>';
        desc += '<tr><th>' + "Latitude" + '</th><td>' + lat +'</td></tr>';
        desc += '</tbody></table>';
        
        addPinEntity(location.locationID, locationName, lng,lat, desc, '0%');
        
        locations.push({
            locationID: location.locationID,
            locationName: locationName,
            longitude: lng,
            latitude: lat,
            region: regionName,
            project_id: location.project_id,
            status: '0%',
            projectwisePath: location.projectwisePath,
            folderID : location.folderID
        })
    });
}

function OnClickDelete() {
    if (isEntityPicked) {
        if (entityIndex != -1) {
            $.confirm({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Confirm!',
                content: 'Are you sure you want to delete the location?',
                buttons: {
                    confirm: function () {
                        var locationid = locations[entityIndex].locationID;
                        $.post("../BackEnd/fetchDatav3.php", {
                            functionName: 'deleteLocationData',
                            locationID: locationid
                        })
                        .done(function (data) {
                            var response = JSON.parse(data);
                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: 'Message',
                                content: response['msg'],
                            });
                            if (response['result']) {
                                locations.splice(entityIndex, 1);
                                var billboard = entitiesArray[entityIndex];
                                viewer.entities.removeById(billboard.id);
                                entitiesArray.splice(entityIndex, 1);
                                $('#rootNode').jstree().delete_node(selectedNodeId);
                                $('#infoRootNode').jstree().delete_node(selectedNodeId);
                                var i = 0;
                                while (i < locationList.length) {
                                    if (locationList[i].id == selectedNodeId) {
                                        locationList.splice(i, 1);
                                        break;
                                    };
                                    i++;
                                };
                                isEntityPicked = false;
                            }
                        });
                    },
                    cancel: function () {
                        return
                    }
                }
            });
        };
    } else if (isModelPicked) {
        if (modelIndex != -1) {
            $.confirm({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Confirm!',
                content: 'Are you sure you want to delete the Model?',
                buttons: {
                    confirm: function () {
                        var entityid = myModels[modelIndex].EntityID;
                        $.post("../BackEnd/fetchDatav3.php", {
                            functionName: 'deleteModelAssetData',
                            EntityID: entityid
                        })
                        .done(function (data) {
                            var response = JSON.parse(data);
                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: 'Message',
                                content: response['msg'],
                            });
                            if (response['bool'] == true) {
                                myModels.splice(modelIndex, 1);

                                var polygon = modelsArray[modelIndex];
                                viewer.scene.primitives.remove(polygon);
                                modelsArray.splice(modelIndex, 1);
                                
                                var markAssetListHTML = ''
                    
                                for (var i = 0; i < myModels.length; i++) {
                                    markAssetListHTML += `<div class="list" onclick="OnClickAssetDataTable(this, event)" data-index="${i}" data-name="${myModels[i].AssetName}" data-id="${myModels[i].AssetID}" data-type="${myModels[i].BuildingType}" data-owner="${myModels[i].BuildingOwner}">`
                                    markAssetListHTML += `<div class="column1" rel="id-layer_${myModels[i].AssetID}"><a class="label">${myModels[i].AssetName}</a></div>`
                                    markAssetListHTML += `<div class="column2 width"><a class="label">${myModels[i].BuildingType}</a></div>`
                                    markAssetListHTML += `<div class="column2 width"><a class="label">Default: ${myModels[i].AssetSLA}</a></div>`
                                    markAssetListHTML += `</div>`
                                }
                                
                                $("#markAssetList").html(markAssetListHTML);
                                
                                isModelPicked = false;
                                selectedPrimitiveId = undefined;
                            }
                        });
                    },
                    cancel: function () {
                        return
                    }
                }
            });
        };
    } else {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a location or a Model to delete!',
        });
        return;
    };
}

function OnClickEdit(ele) {
    flagDraw = false;
    flagCamera = false;
    flagAddImage = false; //make the flag for camera false as both are on right click
    flagEntity = false;

    $(".modal-container.insight .newEntityForm").css("display", "none")

    if (isEntityPicked) {
        flagEdit = true;

        let modalInsight = $(ele).data("page")
        let formTitle = $(ele).attr("title")
        let modalWidth = $(ele).data('width')
        let modalHeight = $(ele).data('height')
        let title = $(ele).attr("rel")

        $(".modal-header a").html(formTitle)
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

        $(':input').val('');
        $('#changePWPath').prop('checked', false);
        $(".modal-container#editentity .doublefield.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #folderRoot.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #refreshpwfolder.appearoncheck").css('display', 'none')
        var i = entityIndex;
        $('#locationName').val(locations[i].locationName);
        $('#locationName').prop('disabled', true);
        $('#regionName').prop('disabled', true);
        $('#regionName').val(locations[i].region);
        $('#locationstatus').val(locations[i].status).prop('selected', true);
        $('#PWPathDisplay').val(locations[i].projectwisePath);
        $('#folderRoot').jstree('deselect_all');
        $('#folderRoot').jstree('close_all');
        $('#folderRootSP').jstree('deselect_all');
        $('#folderRootSP').jstree('close_all');
        document.getElementById('editentityForm').style.display = 'block';
    } else if (isModelPicked) {
        flagEdit = true;
        flagEditModel = true;
        let modalInsight = 'pinPointForm'
        let formTitle = $(ele).attr("title")
        let modalWidth = $(ele).data('width')
        let modalHeight = $(ele).data('height')
        let title = $(ele).attr("rel")
        $(".modal-header a").html(formTitle)
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

        // document.getElementById('modelentityForm').style.display = "block";
        $(':input').val('');
        $('#modelLayerName').val(myModels[modelIndex].layer_id);
        $('#modelBuildingType').val(myModels[modelIndex].BuildingType);
        $('#modelBuildingOwner').val(myModels[modelIndex].BuildingOwner);
        $('#modelAssetID').val(myModels[modelIndex].AssetID);
        $('#modelAssetName').val(myModels[modelIndex].AssetName);
        $('#modelAssetSLA').val(myModels[modelIndex].AssetSLA);

    } else {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please pick a Location/Model to edit!',
        });
        return;
    };
}

function OnClickEntityFormSave() {
    flagEntity = false;
    document.getElementById('editentityForm').style.display = 'none';
    $("#wizard").css("display", "none");
    $(".modal-container.insight .editentityForm").css("display", "none")
    var i = entityIndex;
    var node = $('#folderRoot').jstree().get_selected(true)[0];
    if (node !== undefined) {
        locations[i].folderID = node.id;
        var path = $('#folderRoot').jstree().get_path(node, "/");
        locations[i].projectwisePath = path;
    } else {
        locations[i].folderID = "";
    }

    locations[i].status = $('#locationstatus').val();

    SaveFileData(i);
}

function SaveFileData(EntityIndex) {
	var i= EntityIndex;
	var status = locations[i].status;
	var fileMethod ="pw";
	var path = locations[i].projectwisePath;
	var id = locations[i].folderID;
	var locationid = locations[i].locationID;
	
	$.post("../BackEnd/fetchDatav3.php", 
	{
        functionName: 'saveProjectwiseFileData',
		lID: locationid,
		status: status,
		instanceId: id,
		fileMethod:fileMethod,
		filePath: path
	})
  	.done(function( data ) {
		var myJson = JSON.parse(data);
		$.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Message',
			content: myJson['msg'],
		});
		if(myJson['data'] ==true){
			var myurl;
			switch(status){
				case "10%":myurl = '../Images/pins/red-pin.png';
				break;
				case "25%" : myurl = '../Images/pins/orange-pin.png';
				break;
				case "50%" : myurl = '../Images/pins/yellow-pin.png';
				break;
				case "75%" : myurl = '../Images/pins/blue-pin.png';
				break;
				case "100%" : myurl = '../Images/pins/green-pin.png';
				break;
				default :myurl = '../Images/pins/red-pin.png';
				
			};
			entitiesArray[i].billboard.image = myurl;
		}
	});

}

function OnClickBrowse() {
    event.preventDefault();
    if (folderTree) {
        $('#folderRoot').jstree("destroy").empty();
        folderTree = false;
    }
    var folderid = $('#Path').val();
    var folderName = $('#Path :selected').text();
    $('div.loadingcontainer-mainadmin').css('display', 'block')
    $('#loadingText').text("Getting PW subfolders");
    $('#entityFormSave').prop('disabled', true);
    $('#entityFormCancel').prop('disabled', true);
    $('#closebutton-editentityForm').css('display', 'none')
    $.ajax({
        type: "POST",
        url: '../BackEnd/getProjectWiseFolders.php',
        dataType: 'json',
        data: {
            instanceID: folderid
        },
        success: function (obj, textstatus) {
            var data = obj;
            var mydata = {
                id: folderid,
                text: folderName,
                parent: "#"
            }
            data.splice(0, 0, mydata);
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
            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
            $('#entityFormSave').prop('disabled', false);
            $('#entityFormCancel').prop('disabled', false);
            $('#closebutton-editentityForm').css('display', 'block')
            folderTree = true;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Error in fetching the Projectwise folders!. Please click the browse again to fetch.'
            });
        }
    });
}

function OnClickEarthView() {
    // reset form
    earthPinEdit = false;
    $('#imgName').val("")
    $('#imgLong').val("");
    $('#imgLat').val("");
    $('#imgHeight').val("");
    $('#imageFileName').val("");
    $("#initImage").attr("src", "");
    $(".initImageDiv").css("display","none")
    $("#initImage").removeClass("active")
    $(".verticalLine").css("left", "13px")
    $("#northReset").css("display", "none")
    $(".instructionBox").html("Select center point (North) of image")
    
    var earthViewHTML = '';
    if (!flagLoadedEarth) {
        LoadEarthPinData(function (myResponse) {
            earthPinData = JSON.parse(myResponse);
            for (var i = 0; i < earthPinData.length; i++) {
                viewer.entities.remove(earthPinsArray[i]);
            }
            earthPinsArray.splice(0, earthPinsArray.length);
            $("#earthViewItem").html("")
            if (earthPinData == 0) {
                $("#earthViewItem").html("").append(
                    "<div class='item justifyBetween'>There are no details stored for Earth View</div>"
                )
            } else {
                for (var i = 0; i < earthPinData.length; i++) {
                    earthViewHTML += `<div class="item justifyBetween" id="imageID_${earthPinData[i].imagePinID}">`;
                    earthViewHTML += `<div class="flex alignItem"><div style="padding-right: 2px" class="fa-solid fa-image" title= "${earthPinData[i].imagePinName}" class="fileicon"></div>`;
                    earthViewHTML += `<div id="imageLabel_${earthPinData[i].imagePinID}">${earthPinData[i].imagePinName}</div></div>`;
                    earthViewHTML += `<div id="imageID_${earthPinData[i].imagePinID}">`;
                    if (localStorage.usr_role == "Project Manager") {
                        earthViewHTML += `<i class="fa-solid fa-pencil" title= "Edit Image" onclick="editImagePinDetails(this)" class="edit"></i>`;
                        earthViewHTML += `<i class="fa-solid fa-trash" title="Delete Image" onclick="deleteImagePin(this)" class="remove"></i>`;
                    }
                    earthViewHTML += `<i class="fa-solid fa-binoculars" title="View Image" onclick="openEarthImagePin(this)" class="play"></i></div></div>`;

                    var myEarthPin = addEarthPin(earthPinData[i].imagePinName, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, true);
                    earthPinsArray.push(myEarthPin);
                };
                $("#earthViewItem").html(earthViewHTML)
            }
        });
    } else {
        jqwidgetBox("earthFeed-jqx", 1);
        if (earthPinData == 0) {
            $("#imagePinList").html("").append(
                "<div class='item justifyBetween'>There are no details stored for Earth View</div>"
            )
        }
    }
}

function openEarthImagePin(ele) {
	var name = ele.parentNode.id
	var pos = name.indexOf("_");
	var id = name.substr(pos + 1);
	var i = 0;
    var recordActive = $(`#${name}`)

    $(".modal-container.insight .inputForm").css("display", "none");
    $('#earthViewItem').children().removeClass("imageView")
    recordActive.addClass("imageView")

	while (i < earthPinData.length) {
		if (earthPinData[i].imagePinID == id) {
			$("#earthmine-jqx.active").removeClass('active');
			viewer.flyTo(earthPinsArray[i]);
            var url = '../'+earthPinData[i].imageURL;
			earth360(url, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, earthPinData[i].initHeading);
			break;
		}
		i++;
	};
}

function earth360(url, long, lat, height, initHeading) {
    if(localStorage.ui_pref == 'ri_v3'){
        url = "../" +url;
        url = "../../" +url;
    }

    $(".modal-container.insight .inputForm").css("display", "none");

    viewer.scene.primitives.remove(planePrimitive);
    $("#wizard").fadeIn(100)
    $(`#wizard .modal-content`).css("width", "70vw")
    $(`.modal-container.insight`).css("display", "block")
    $(`.modal-container.insight .earthView`).css("display", "block")
    $(`.modal-header a`).html("Show Image")
    
    earthviewerDiv = document.getElementById('earthView');
    document.querySelector('#viewer').innerHTML = "";
    var addInit = initHeading * (Math.PI / 180);
    earthPhotosphere = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: url,
        defaultYaw: addInit
    });

    var position = Cesium.Cartesian3.fromDegrees(long, lat, height);
    var heading = Cesium.Math.toRadians(0.0);
    var pitch = Cesium.Math.toRadians(-20.0);
    var hpRoll = new Cesium.HeadingPitchRoll(heading);
    var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
        "north",
        "west"
    );

    //add model to cesium
    planePrimitive = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
            url: "../Images/Cesium_Man.glb",
            modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
                position,
                hpRoll,
                Cesium.Ellipsoid.WGS84,
                fixedFrameTransform
            ),
            minimumPixelSize: 128,
        })
    );

    var cacheHeading = initHeading; //if there's an initial heading set for the paranoma, replace this
    earthPhotosphere.addEventListener("position-updated", ({ position }) => {
        var diff = Math.abs(cacheHeading - position.yaw);
        if (position.yaw > cacheHeading) {
            hpRoll.heading += diff;
            if (hpRoll.heading > Cesium.Math.TWO_PI) {
                hpRoll.heading -= Cesium.Math.TWO_PI;
            }
        } else if (position.yaw < cacheHeading) {
            hpRoll.heading -= diff;
            if (hpRoll.heading < 0.0) {
                hpRoll.heading += Cesium.Math.TWO_PI;
            }
        }
        cacheHeading = position.yaw;
    });

    //this is where cesium updates the orientation of model
    viewer.scene.preUpdate.addEventListener(function (scene, time) {
        Cesium.Transforms.headingPitchRollToFixedFrame(
            position,
            hpRoll,
            Cesium.Ellipsoid.WGS84,
            fixedFrameTransform,
            planePrimitive.modelMatrix
        );
    });
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

					$.post("../BackEnd/fetchDatav3.php", {
						functionName: "deleteImagePinData",
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
                        $(`#imageID_${id}`).remove();

                        if($('#earthViewItem .item').length == 0){
                            $('#earthViewItem').html('<div class="item justifyBetween">There are no details stored for Earth View</div>');
                        }
					});
				},
				cancel: function () {
					return
				}
			}
		});
	}
}

function getImageSize(img, callback) {
	var $img = $(img);

	var wait = setInterval(function() {
		var w = $img[0].width,
		natWidth = $img[0].naturalWidth;
		if (w && natWidth) {
			clearInterval(wait);
			callback.apply(this, [w, natWidth]);
		}
	}, 30);
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
            flagAddImage = false;
            $('#RIContainer').css('cursor', "default");
			$('.navBox.drawTool').css("display", "flex");
			$('.navBox.drawTool .infoHeader .header').text("Edit 360 Image");
            $('.pageContainer.cameraItem').removeClass("active");
			$('.pageContainer.earthViewItem').addClass("active");
            $('.pageContainer.layerItem').removeClass("active");
			$('.instructionContainer.drawTool').html("");
			$('#imagePinID').val(earthPinData[j].imagePinID);
			$('#imgName').val(earthPinData[j].imagePinName);
			$('#imgHeight').val(earthPinData[j].height);
			$('#imgLong').val(earthPinData[j].longitude);
			$('#imgLat').val(earthPinData[j].latitude);
			var radioChosen = earthPinData[j].initChoice;
            var verticalPos = earthPinData[j].verticalPos;

			fileURL = earthPinData[j].imageURL;
            if (localStorage.ui_pref == 'ri_v3') {
                fileURL = "../../" +fileURL;
            }
			var longHead = earthPinData[j].initClick;
			xx = earthPinData[j].initHeading;

			$("h5.localImage").html("Change File")
			$("#initImage").css('width', "100%");
			$("#initImage").css('height', "auto");
			$("#initImage").attr("src", fileURL);
			$("#initImage").addClass("active");

			$("#initImage").on("click", function (event) {

				clickX = event.offsetX; //longitude
				var width = this.offsetWidth;

				if (!$("#initImage").hasClass("active")) {
                    if (clickX < (width / 2)) {
                        xx = 180 + ((clickX / width) * 360);
                    } else {
                        xx = (clickX - (width / 2)) * (360 / width);
                    }

					$("#initImage").addClass("active")
					$("#northReset").css("display", "block")
					$(".instructionBox").html("Click <kbd>Reset</kbd> to reset the North position.")

                    getImageSize($('#initImage'), function(width, natWidth) {
                        var aspectRatio = clickX / width;
                        aspectRatioVerticalLine = aspectRatio * 100
        
                        $(".verticalLine").css("left", aspectRatioVerticalLine + "%");
                    });
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
				$("#northReset").css("display", "block");

                if(verticalPos == null){
					$(".verticalLine").css("left", longHead + "px");
				}else{
					$('.verticalLine').css('left', verticalPos+'%');
				}

				imgInitialSource = "chooseImage";
			}
			else {
				$("#fromPinDetails").prop('checked', true);
				$(".initImageDiv").hide();
                $("#northReset").css("display", "none");
                $("#initImage").removeClass("active");
				imgInitialSource = "choosePinDetails";
			}

			$("#imageFileName").on("click", function (event) {
				$("#initImage").removeClass("active");
				ChangeImage();
			});

			viewer.flyTo(earthPinsArray[j]);
			break;
		}
		j++;
	}

}

function OnClickLayerEditUpdate() {
    var layerInfo = new FormData();
    var layerDataType = $('#layerType').val();

    if(layerDataType == "KML"){
        layerInfo.append('layerFile', $('#layerFileName')[0].files[0]);
    }else{
        var layers = [];
        $.each($("#layerFileName")[0].files, function(i, file) {
            var layerId = 'layerFile'+i;
            layerInfo.append(layerId, $('#layerFileName')[0].files[i]);
            layers.push(file);
        });
        
    }

    var name = $('#layerName').val();
    if(name == ""){
        $.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Need layer name to update',
        });
            return;
    };

    var layerID = $('#layerId').val();
    var layerName = $('#layerName').val();
    var folderName
    var layerFileName
    
    if($('#layerFileName')[0].files[0]){
        var updateLayerFile = !$('#layerFileName')[0].files[0]
        if ($('#layerFileName')[0].files[0]) {
            layerFileName = $('#layerFileName').prop("files")[0]['name'];
        }
        var lastIndex = layerFileName.lastIndexOf('.');
        folderName = layerFileName.substring(0, lastIndex);
    }
    
    var missionCycleId = $('#missionCycleId').val()
    var layerDate = $('#layerDate').val()
    var layerStartTime = $('#layerStartTime').val()
    var layerEndTime = $('#layerEndTime').val()
    var metaId = $('#metaId').val()
    var projectLayerId = $('#projectLayerId').val()
    var showMetadataFlag = $('#showMetadata').prop('checked') ? 'true' : 'false'
   
    var layerDetails = {
        layerFile : layers,
        layerName: layerName,
        layerID: layerID,
        layerFileName: layerFileName,
        layerDataType: layerDataType,
        folderName: folderName,
        missionCycleId: missionCycleId,
        layerDate: layerDate,
        layerStartTime: layerStartTime,
        layerEndTime: layerEndTime,
        updateLayerFile: updateLayerFile,
        metaId: metaId,
        projectLayerId: projectLayerId,
        showMetadataFlag : showMetadataFlag
    };

    layerInfo.append('LayerFileInfo', JSON.stringify(layerDetails));
    layerInfo.append('function_name', JSON.stringify('updateLayerInfo'));
        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            dataType: 'json',
            data: layerInfo,
            processData: false,
            contentType: false,
            success: function (obj, textstatus) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                $('#layerFileName').val(null);
                // $('#layerName').val(obj['layerName']);
                if(obj.newMetaId != 'undefined' && obj.newMetaId != ''){
                    $('#metaId').val(obj.newMetaId)
                }
                whatToSetup()
                manageLayer()
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
}

function OnClickAddImageSave() {
    var imageR = new FormData(); // you can consider this as 'data bag'
    imageR.append('imageFile', $('#imageFileName')[0].files[0]); // append selected file to the bag named 'file'
    var name = $('#imgName').val();
    
    if(name ==""){
        $.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Need image feed name to save the image pin and details',
        });
            return;
    };
	
	if(!$('#imageFileName')[0].files[0] && earthPinEdit == false){
		$.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a JPG/PNG image file',
        });
		return
    }

    var imageName;
    if ($('#imageFileName')[0].files[0]) {
        imageName = $('#imageFileName').prop("files")[0]['name'];
    } else if (!$('#imageFileName')[0].files[0] && earthPinEdit == true) {
        imageName = fileURL;
    }

    var editID = $('#imagePinID').val();
    var height = $('#imgHeight').val();
    var lng = $('#imgLong').val();
    var lat = $('#imgLat').val();
    var initHead = "";
    var headChoice = "";
    var earthViewHTML = "";
    initializeImage = imgInitialSource;

    if(lat == "" || lng == "" ){
        $.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Please mark a location for image pin',
        });
            return;
    };
	
    
    if (initializeImage == "choosePinDetails") {
        initHead = lng;
        headChoice = 0;
        clickX = 0;
    } else {
        initHead = xx;
        headChoice = 1;
    }

    if (earthPinEdit == true) {
        var imagePinDetails = {
            name: name,
            id: editID,
            longitude: lng,
            latitude: lat,
            height: height,
            imageName: imageName,
            initialHead: initHead,
            choice: headChoice,
            clickX: clickX,
        };

        imageR.append('fileInfo', JSON.stringify(imagePinDetails));
        imageR.append('function_name', JSON.stringify('updateImagePinData'));
        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            dataType: 'json',
            data: imageR,
            processData: false,
            contentType: false,
            success: function (obj, textstatus) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                var i = earthPinIndex;
                viewer.entities.removeById(earthPinsArray[i].id);
                earthPinData[i].imagePinName = name;
                earthPinData[i].height = height;
                earthPinData[i].imageURL = obj['imagePath'];
                earthPinData[i].initClick = obj['clickX'];
                var myEarthPin = addEarthPin(earthPinData[i].imagePinName, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, true);
                earthPinsArray.splice(i, 1, myEarthPin);
                $(`#imageLabel_${earthPinData[i].imagePinID}`).text(name);
                document.getElementsByTagName("body")[0].style.cursor = "default";
                LoadEarthPinData(function (myResponse) {
                    earthPinData = JSON.parse(myResponse);
                    for (var i = 0; i < earthPinData.length; i++) {
                        viewer.entities.remove(earthPinsArray[i]);
                    }
                    earthPinsArray.splice(0, earthPinsArray.length);
                    $("#earthViewItem").html("")
                    if (earthPinData == 0) {
                        $("#earthViewItem").html("").append(
                            "<div class='item justifyBetween'>There are no details stored for Earth View</div>"
                        )
                    } else {
                        for (var i = 0; i < earthPinData.length; i++) {
                            earthViewHTML += `<div class="item justifyBetween" id="imageID_${earthPinData[i].imagePinID}">`;
                            earthViewHTML += `<div class="flex alignItem"><div style="padding-right: 2px" class="fa-solid fa-image" title= "${earthPinData[i].imagePinName}" class="fileicon"></div>`;
                            earthViewHTML += `<div id="imageLabel_${earthPinData[i].imagePinID}">${earthPinData[i].imagePinName}</div></div>`;
                            earthViewHTML += `<div id="imageID_${earthPinData[i].imagePinID}">`;
                            if (localStorage.usr_role == "Project Manager") {
                                earthViewHTML += `<i class="fa-solid fa-pencil" title= "Edit Image" onclick="editImagePinDetails(this)" class="edit"></i>`;
                                earthViewHTML += `<i class="fa-solid fa-trash" title="Delete Image" onclick="deleteImagePin(this)" class="remove"></i>`;
                            }
                            earthViewHTML += `<i class="fa-solid fa-binoculars" title="View Image" onclick="openEarthImagePin(this)" class="play"></i></div></div>`;
        
                            var myEarthPin = addEarthPin(earthPinData[i].imagePinName, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, true);
                            earthPinsArray.push(myEarthPin);
                        };
                        $("#earthViewItem").html(earthViewHTML)
                    }
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
        earthPinEdit = false;
        flagAddImage = false;
        $('.navBox.drawTool').css("display", "none")
    } else {
        var imagePinDetails = {
            name: name,
            longitude: lng,
            latitude: lat,
            height: height,
            imageName: imageName,
            initialHead: initHead,
            choice: headChoice,
            clickX: clickX,
        };

        imageR.append('fileInfo', JSON.stringify(imagePinDetails));
        imageR.append('function_name', JSON.stringify('saveImagePinData'));

        $('#startImageFile').attr('disabled',true);

        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            data: imageR,
            processData: false,
            contentType: false,
            success: function (obj, textstatus) {
                obj = JSON.parse(obj);

                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                var data = obj['data'];
                $('#imgName').val("")
                $('#imgLong').val("");
                $('#imgLat').val("");
                $('#imgHeight').val("");
                $('#imageFileName').val("");
                $("#initImage").val("src","")
                $(".initImageDiv").css("display","none")
                $("#initImage").removeClass("active")
                $(".verticalLine").css("left", "13px")
                $("#northReset").css("display", "none")
                $(".instructionBox").html("Select center point (North) of image")
                viewer.entities.removeById(tempImagePin.id);
                earthPinsArray.push(addEarthPin(name, lng, lat, height, true));
                earthPinData.push(data);
                flagLoadedEarth = false;
                $(".admin-function.active").removeClass("active");
                OnClickEarthView();
                document.getElementsByTagName("body")[0].style.cursor = "default";

                $('#startImageFile').attr('disabled',false);

                flagAddImage = true;
                $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });

        
    }
}

function OnClickRefreshPWFolder() {
    getPWFileData = false;
    for (var i = 0; i < locations.length; i++) {
        var children = $('#infoRootNode').jstree(true).get_node(locations[i].locationName).children;
        $('#infoRootNode').jstree(true).delete_node(children);
    }
    $('#infoRootNode').jstree(true).redraw();
}

// Function flyTo track animation
function flyToTrackAnimation(ele){
    var trackID = $(ele).parent().parent().attr('id').split('_').slice(1);

    if(trackData.length !== 0){
        for(var i = 0; i < trackData.length; i++){
            if(trackData[i].Data_ID == trackID){
                if(trackData[i].tileset == undefined){
                    var myTrack = addTrackData('../' + trackData[i].Data_URL);
                    trackData[i].tileset = myTrack;
                }

                trackData[i].tileset.then((value) => {
                    value.show = true;
                })
                .catch(console.error);

                viewer.flyTo(trackData[i].tileset);
            }
        }
    }
}

// Function play track animation
function playTrackAnimation(ele){
    var trackID = $(ele).parent().parent().attr('id').split('_').slice(1);

    flagAnimate = true;

    //reset button
    stopTrackAnimation();

    let j = 0;
    var indicatorArr = viewer.entities.values

    while (j < indicatorArr.length) {
        var indName = indicatorArr[j].name
        if(indName == 'indicator'){
            viewer.entities.remove(indicatorArr[j])
        }
        j++;
    }

    var trackLevel = $('#trackLevel');
    var trackDuration = $('#trackDuration');
    var trackDateVal = $('#trackDate').val();
    var trackDurationVal = trackDuration.val();
    if(trackDurationVal == '' || trackDurationVal == 0){
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Please insert duration first before proceed!",
        });

        return;
    }

    var trackEle = $('#trackID_'+trackID);
    if(trackEle.find('.play').css('display') == 'inline'){
        trackEle.find('.play').hide();
        trackEle.find('.pause').css('display','inline');
        trackLevel.prop('disabled', true);
        trackDuration.prop('disabled', true);
    }

    if(trackData.length !== 0){
        for(var i = 0; i < trackData.length; i++){
            if(trackData[i].Data_ID == trackID){
                if(trackData[i].tileset == undefined){
                    var myTrack = addTrackData('../' + trackData[i].Data_URL);
                    trackData[i].tileset = myTrack;
                    viewer.flyTo(trackData[i].tileset);
                }

                trackData[i].tileset.then((value) => {
                    addPointEntity(value.geoJSON, trackDurationVal, trackDateVal)

                    viewer.clock.startTime = animationStart.clone();
                    viewer.clock.stopTime = animationStop.clone();
                    viewer.clock.currentTime = animationStart.clone();
                
                    viewer.clock.shouldAnimate = true;
                    value.show = false;
                })
                .catch(console.error);
                
                entityAnimate = setInterval(setCameraAngle, 50);
            }
        }
    }
}

// Function pause track animation
function pauseTrackAnimation(ele){
    var trackLevel = $('#trackLevel');
    var trackDuration = $('#trackDuration');
    var trackID = $(ele).parent().parent().attr('id').split('_').slice(1);
    viewer.animation.viewModel.pauseViewModel.command();

    var trackEle = $('#trackID_'+trackID);
    if(flagAnimate){
        trackEle.find('.pause i').removeClass('fa-pause');
        trackEle.find('.pause i').addClass('fa-play');
        trackLevel.prop('disabled', false);
        trackDuration.prop('disabled', false);
        clearInterval(entityAnimate)
        flagAnimate = false;
    }else{
        trackEle.find('.pause i').removeClass('fa-play');
        trackEle.find('.pause i').addClass('fa-pause');
        trackLevel.prop('disabled', true);
        trackDuration.prop('disabled', true);
        entityAnimate = setInterval(setCameraAngle, 50);
        flagAnimate = true;
    }
}

// Function stop track animation
function stopTrackAnimation(){
    clearInterval(entityAnimate)

    $('#trackLevel').prop('disabled', false);
    $('#trackDuration').prop('disabled', false);
    $('[id^="trackID_"]').each(function (){
        $(this).find('.play').css('display','inline');
        $(this).find('.pause').css('display','none');
        $(this).find('.pause i').removeClass('fa-play');
        $(this).find('.pause i').addClass('fa-pause');
    })
}

//Function for newsfeed
function openFeed(){
    let newsFeed = $(".newsFeed");
    newsFeed.addClass("active");

    if(newsFeed.hasClass("active")){
        newsFeed.show()
        $('.newsfeedOpen').css('display', 'none')
        $('.headerContainer a').show()
        newsFeed.css({"width": "380px"})
        fadeInCard($('div.newsCard').first())
    }
}

function closeFeed(){
    let newsFeed = $(".newsFeed");
    newsFeed.removeClass("active");

    if(!newsFeed.hasClass("active")){
        $("div.newsCard").hide();
        $("div.newsCard").css('transform','scale(.8)')
        newsFeed.css("width", "0px");
        newsFeed.css("transition", "width 0.2s ease-out")
        $('.newsfeedOpen').fadeIn(400)
        $('.headerContainer a').hide()
        newsFeed.hide()
    }

    $.ajax({
        type: "POST",
        url: "../BackEnd/news_feed.json.php",
        dataType: "json",
        data: {
            fn : "hideFeed"
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(textStatus + " " + errorThrown)
        }
    });
}

$("#switchTerrainMod").on("click", function () {
    if ($(this).hasClass("activate")) {
        $(this).removeClass("activate");
        $("#toolbarTransparency").removeClass("active");
        $(this).find('i').removeClass("fa-regular");
        $(this).find('i').addClass("fa-solid");
        $(this).find('span').text("TERRAIN OFF");
    }
    else{
        $(this).addClass("activate");
        $("#toolbarTransparency").addClass("active");
        $(this).find('i').removeClass("fa-solid");
        $(this).find('i').addClass("fa-regular");
        $(this).find('span').text("TERRAIN ON");
    }


    if (terrainEnabled) { 
        if (baseMapLayer && Object.prototype.toString.call(baseMapLayer) === "[object Promise]") {
            baseMapLayer.then((value) => {
                viewer.imageryLayers.remove(value)
            })
        } else {
            viewer.imageryLayers.remove(baseMapLayer)
        }
      
        baseMapLayer = viewer.imageryLayers.addImageryProvider(
                new Cesium.MapboxStyleImageryProvider({
                styleId: 'satellite-v9', 
                accessToken: mapBoxAccessToken
            }), 1
        )
        viewer.baseLayerPicker = false;
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        viewer.scene.globe.depthTestAgainstTerrain  = false;
        terrainEnabled = false;
        // var i = 0;
		// while (i < tilesetlist.length){
        //     if(tilesetlist[i].type == "kml"){
        //         if(tilesetlist[i].type == "kml"){
        //             if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
        //                 tilesetlist[i].tileset.then((value) => {
        //                     viewer.dataSources.remove(value);
        //                 })
        //             }
        //             else{
        //                 viewer.dataSources.remove(tilesetlist[i].tileset);
        //             }
        //             tilesetlist[i].tileset = null;
        //             tilesetlist[i].tileset = LoadKMLDataTerrain(tilesetlist[i].url, false)
        //             landThematic.push({
        //                 id: tilesetlist[i].id,
        //                 name: tilesetlist[i].name,
        //             });
        //             $('#thematicLayer').append($('<option>',
        //                 {
        //                     value: tilesetlist[i].id,
        //                     text : tilesetlist[i].name
        //                 }
        //             ));
        //         }
        //     }
        //     i++;
        // }
    } else { 
        viewer.terrainProvider =   new Cesium.CesiumTerrainProvider({
			url: "https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key="+mapTilerAccessToken,
			credit: new Cesium.Credit(
				'<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> ' +
				'<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
			),
			requestVertexNormals: true
		});
        viewer.baseLayerPicker = false;
        // viewer.scene.globe.depthTestAgainstTerrain  = true;
        terrainEnabled = true;

        // var i = 0;
		// while (i < tilesetlist.length){
        //     if(tilesetlist[i].type == "kml"){
        //         if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
        //             tilesetlist[i].tileset.then((value) => {
        //                 viewer.dataSources.remove(value);
        //             })
        //         }
        //         else{
        //             viewer.dataSources.remove(tilesetlist[i].tileset);
        //         }
        //         tilesetlist[i].tileset = null;
        //         tilesetlist[i].tileset = LoadKMLDataTerrain(tilesetlist[i].url, true)
        //         landThematic.push({
        //             id: tilesetlist[i].id,
        //             name: tilesetlist[i].name,
        //         });
        //         $('#thematicLayer').append($('<option>',
        //             {
        //                 value: tilesetlist[i].id,
        //                 text : tilesetlist[i].name
        //             }
        //         ));
        //     }
        //     i++;
        // }
    }
    
})

$("#SwitchSceneMod").on("click", function () {
    if ($(this).hasClass("activate")) {
        $(this).removeClass("activate");
        $(this).children().removeClass("fa-toggle-off");
        $(this).children().addClass("fa-toggle-on");
    }
    else{
        $(this).addClass("activate");
        $(this).children().removeClass("fa-toggle-on");
        $(this).children().addClass("fa-toggle-off");
    }

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

$("#flyToHome").click(function () {
	viewer.camera.flyHome(2)
})

$("#changeToGlobe").click(function () {
	var camera = new Cesium.Camera(viewer.scene);
    var vert = (north + south) / 2;
    var hori = (east + west) / 2;
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(hori, vert, 13000000.0),
        orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0
        }
    });
})

$("#changeBaseMap").click(function () {
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
                new Cesium.MapboxStyleImageryProvider({
                    styleId: 'streets-v12', 
                    accessToken: mapBoxAccessToken
                }), 1
			)
			break;
		case 1:
			baseMap = 2
			baseMapLayer = viewer.imageryLayers.addImageryProvider(
                new Cesium.MapboxStyleImageryProvider({
                    styleId: 'satellite-streets-v12', 
                    accessToken: mapBoxAccessToken
                }), 1
			)
			break;
		case 2: //Bing Maps Road
			baseMap = 0
			baseMapLayer = viewer.imageryLayers.addImageryProvider(
                new Cesium.MapboxStyleImageryProvider({
                    styleId: 'satellite-v9', 
                    accessToken: mapBoxAccessToken
                }), 1
			);
			break;
	}
})

function openConstructJoget(ele) {  //where overall list is loaded
    var processType = $(ele).attr("rel");
    var url = "";
    var process_1b = ["PBC", "RS", "SDL"];

    if(localStorage.project_phase == '1B'){
		if(process_1b.includes(processType)){
			processType = processType+"_1B";
		}else{
			processType = processType;
		}
	}

    if (!JOGETLINK) return
    
    if(SYSTEM == 'OBYU'){
        if(processType == 'LAND'){processType = 'LM'}
        url = JOGETLINK.dataList['construct_list_'+processType];
    }else{
        if(localStorage.project_owner == "SSLR2"){
            url = JOGETLINK['cons_datalist_'+processType+'_SSLR2'];
        }else{
            url = JOGETLINK['cons_datalist_'+processType];
        }
    }

    $("iframe.jogetDatalist")
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");

    zoomToGetData();
}

function openConstructJogetBulkApproval(ele) { 
    var processType = $(ele).attr("rel");
    var url = "";
    var varArr = [];
    var role = localStorage.usr_role;
    var org = localStorage.user_org;

    if (!JOGETLINK) return
    
    if(SYSTEM == 'KKR'){
        var link =  'cons_datalist_'+processType;
        if(role == 'Project Manager'){
            if(org == 'JKR'){
                varArr.push('Verify and Close');
            }else if(org == 'HSSI'){
                varArr.push('Provide Recommendation');
            }
        }else if(role == 'Safety Officer'){
            varArr.push('Task 6b Review Document');
        }else if(role == 'Consultant RE' || role == 'Consultant CRE'){
            varArr.push('');
        }else{
            varArr.push('-');
        }

        url = processLinkParam(link, varArr);
        console.log(url);
    }

    $("iframe.jogetDatalist")
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");

    zoomToGetData();
}


$("#conopButton #changeNameConop").on("click", function () {
    if ($(this).hasClass("active")) {
        $(".changeName").css("max-width", "100px");
        $("#changeNameConop").removeClass("active");
        $("#toggleConop").removeClass("fa-toggle-off");
        $("#toggleConop").addClass("fa-toggle-on");
    }
    else{
        $(".changeName").css("max-width", "50px");
        $("#changeNameConop").addClass("active");
        $("#toggleConop").removeClass("fa-toggle-on");
        $("#toggleConop").addClass("fa-toggle-off");
    }

    $('#conopList > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

})

function openInventoryJoget(ele) {
    if (!JOGETLINK) return

    var invType;
    var id;
    if(ele == 'bridge'){
        id = 'asset_list_bridge'
    }else if(ele == 'culvert'){
        id = 'asset_list_culvert'
    }else if(ele == 'drainage'){
        id = 'asset_list_drainage'
    }else if(ele == 'pavement'){
        id = 'asset_list_pavement'
    }else if(ele == 'roadFur'){
        id = 'asset_list_furniture'
    }else if(ele == 'slope'){
        id = 'asset_list_slope'
    }else if(ele == 'electrical'){
        id = 'asset_list_electrical'
    }else{
        invType = $(ele).attr("rel");
        if(invType == 'network_div'){
            id = 'asset_list_networkSite'
        }else if(invType == 'network_route'){
            id = 'asset_list_networkSection'
        }
    }
    
    var url = JOGETLINK[id];

    $("iframe.jogetInventorylist")
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");
    zoomToGetData()
}

function openAssetTable() { 
    $('iframe.assetList').attr('src', '')
    $("#assetDataTable").hide();
    $(".buttonTab.asset.parentTab").children().remove()
    $('#facilityBrowser').css('display', 'none');

    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: { functionName: "getAgileData" },
        success: function (obj) {
            let uniqueAssetTypes;

            uniqueAssetTypes = Array.from(new Set(obj.data.map(item => (item.Floor !== null && item.Floor !== undefined) ? item.Floor : 'Others')));

            const parentTab = document.querySelector('#assetList.buttonTab.parentTab');
            parentTab.textContent = uniqueAssetTypes[0];

            const assetList = document.getElementById('assetList');
            uniqueAssetTypes.slice(0).forEach((Floor, index) => {
            const parentTab = document.createElement('div');
            parentTab.className = 'tab asset changeName parent';
            if(Floor == "Others"){
                parentTab.setAttribute('rel', `Others`);
                parentTab.textContent = "Others";
                parentTab.style.fontSize = '12px';
                parentTab.title = "Others";
            }else{
                parentTab.setAttribute('rel', `Floor-${Floor}`);
                parentTab.textContent = "Floor "+Floor;
                parentTab.style.fontSize = '12px';
                parentTab.title = "Floor"+Floor;
            }
            
            parentTab.setAttribute('onclick' , "openFacilityJoget(this)");
            assetList.appendChild(parentTab);

            });
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function openFacilityJoget(ele) { 
    $("#facilityBrowser .tab.changeName.children").remove();
    $('iframe.assetList').attr('src', '')
    $('.tab.asset').removeClass('active')
    $("#assetDataTable").hide();

    if(!$(ele).hasClass('active')){
        $(ele).addClass('active')
    }

    var category = ele.getAttribute('rel');
    
    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        data: {
            functionName: "getAssetTypeDataList"
        },
        success: function (res) {
            try {
                res = JSON.parse(res.trim());

                const latestData = {};
                res.data.forEach(item => {
                    if ((!latestData[item.type]) || (latestData[item.type].dateCreated < item.dateCreated)) {
                        latestData[item.type] = {
                            Label: item.label,
                            Type: item.type,
                            Date: item.dateCreated
                        };
                    }
                });

                fetchAgileData(latestData);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("First AJAX error:", textStatus, errorThrown);
        }
    });

    function fetchAgileData(latestData) {
        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            dataType: 'json',
            data: { functionName: "getAgileData" },
            success: function (obj) {
                let uniqueAssetTypes;
                if (category.includes("Floor")) {
                    var parts = category.split("-");
                    var cat = parts[0];
                    var floor = parts[1];
                
                    uniqueAssetTypes = obj.data
                        .filter(item => item[cat] == floor)
                        .map(item => (item.Type !== null && item.Type !== undefined && item.Type !== "") ? item.Type : 'Others')
                        .reduce((uniqueTypes, type) => {
                            if (!uniqueTypes.includes(type)) {
                                uniqueTypes.push(type);
                            }
                            return uniqueTypes;
                        }, [])
                        .sort();
                }else{
                    
                    uniqueAssetTypes = obj.data
                    .filter(item => item.Floor === null)
                    .map(item => {
                        if (item.Type !== null && item.Type !== undefined && item.Type !== "") {
                            return item.Type;
                        } else {
                            return item["Family and Type"] ?? 'Others';
                        }
                    })
                    .reduce((uniqueTypes, type) => {
                    if (!uniqueTypes.includes(type)) {
                        uniqueTypes.push(type);
                    }
                    return uniqueTypes;
                    }, [])
                    .sort();
                }            

                const childTab = document.querySelector('.buttonTab');
                const defaultLabel = Object.values(latestData)[0] ? Object.values(latestData)[0].Label : '';
                childTab.textContent = defaultLabel;

                const facilityBrowser = document.getElementById('facilityBrowser');
                uniqueAssetTypes.forEach((assetType, index) => {
                    const childTab = document.createElement('div');
                    childTab.className = 'tab changeName children';
                    childTab.setAttribute('rel', category);
                    childTab.setAttribute('id', `facilityJoget`);
                    childTab.title = assetType;
                    const matchingData = latestData[assetType];
                    childTab.textContent = matchingData ? matchingData.Label : assetType;
                    childTab.style.maxWidth = '100px';
                    childTab.setAttribute('onclick', "openAssetList(this)");
                    facilityBrowser.appendChild(childTab);
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Second AJAX error:", textStatus, errorThrown);
            }
        });
    }

    $('#facilityBrowser').css('display', 'flex');
}

function openAssetList(ele) {
    $('.tab.changeName.children').removeClass('active')

    if(!$(ele).hasClass('active')){
        $(ele).addClass('active')
    }

    var category = ele.getAttribute('rel');
    var type = ele.getAttribute('title');

    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: { functionName: "getAgileData" },
        success: function (obj) {
            $("#assetDataTable").show();
            let htmlStr = '';
            obj.data.forEach(function (item) {

                if (category.includes("Floor")) {
                    var parts = category.split("-");
                    var cat = parts[0];
                    var floor = parts[1];
                    var actionBtn = '<button class="toolButton mid" rel="insight" title="New Asset Table Process" data-width="70" data-page="fmNewAssetTable" onclick="assetTableActionNewClick(this)"><div class="label">New</div></button>';

                    if(item.Floor !== null && item.Floor !== undefined && item.Floor !== ""){
                        if(item[cat] == floor){

                            if(item.Type !== null && item.Type !== undefined && item.Type !== ""){
                                if(item.Type == type){
                                    htmlStr += "<tr onclick='assetTableClick(this)' data-modelid = '" + item.ElementId + "'><td>" + item['Revit ID'] + "</td>\
                                    <td>"+ ((item.Item !== null) ? item.Item : '-') + "</td>\
                                    <td>"+ ((item['Family and Type'] !== null) ? item['Family and Type'] : '-') + "</td>\
                                    <td>"+ ((item.Mark !== null) ? item.Mark : '-') + "</td>\
                                    <td>"+ ((item.Floor !== null) ? item.Floor : '-') + "</td>\
                                    <td>"+ actionBtn + "</td>\
                                    </tr>"
                                }
                            }
                        }
                    }
                }
                
                if (category.includes("Others")) {
                    if(item.Floor === null){
                        htmlStr += "<tr onclick='assetTableClick(this)' data-modelid = '" + item.ElementId + "'><td>" + item['Revit ID'] + "</td>\
                        <td>"+ ((item.Item !== null) ? item.Item : '-') + "</td>\
                        <td>"+ ((item['Family and Type'] !== null) ? item['Family and Type'] : '-') + "</td>\
                        <td>"+ ((item.Mark !== null) ? item.Mark : '-') + "</td>\
                        <td>"+ ((item.Floor !== null) ? item.Floor : '-') + "</td>\
                        <td>"+ actionBtn + "</td>\
                        </tr>"
                    }
                }
                
            })
            $("#assetData").html(htmlStr);
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function assetTableActionNewClick(ele){
 
    var row = ele.parentNode.parentNode;
    var cells = row.getElementsByTagName("td");
    var rowData = [];
    for (var i = 0; i < cells.length; i++) {
        rowData.push(cells[i].textContent);
    }
 
    $('.fmNewAssetTable .fmAssetTableProcessOption').val('default');
 
    $('.fmNewAssetTable #fm_asset_no').val(rowData[0]);
    $('.fmNewAssetTable #fm_asset_name').val(rowData[1]);
    $('.fmNewAssetTable #fm_asset_type').val(rowData[2]);
 
    iframe = $("iframe#assetTableProcessIframe");
    iframe.hide();
    iframe.attr("src", "");
    iframe.on("load", function () {
        loading.fadeOut();
        iframe.show();
    });
   
    wizardOpenPage(ele);
 
}

function assetTableClick(ele) {
    // get the asset Info from table
    
    floatboxV3TurnOFF();
    modelID = $(ele).data('modelid'); // data attribute
    console.log(modelID)
    var infoContainerID, docContainerID;
    $("#floatbox-tabs").children().each(function () {
        if ($(this).is(":contains('Document')")) {
            $(this).show();
            docContainerID = $(this).attr('rel');
        }
        if ($(this).is(":contains('Info')")) {
            $(this).show();
            infoContainerID = "page1half";
        }
        if ($(this).is(":contains('Status')")) {
            $(this).show();
        }
        if ($(this).is(":contains('WO History')")) {
            $(this).show();
        }
    });

    silhouetteBlue.selected = [];
    assetDataFloatBox(infoContainerID, docContainerID, modelID, true);
}

function OnClickWorkorderfloatbox() {
    $(`.jogetList.workOrder`).css('display', 'block')

    if (agileWOFlag) {
        console.log(agileWOCache);
        let url = "https://joget.reveronconsulting.com/jw/web/embed/userview/RV_AMS/RV_AMS/_/workOrderFormFM?assetId=" + agileWOCache['Revit ID'] + "&assetName=" + agileWOCache.Floor + "&buildingType=" + agileWOCache['Type Name'] + "&assetSla=&buildingOwnerName=" + agileWOCache.Mark + "&username=" + localStorage.signed_in_email;
    
        // Open in iframe with id "workOrder"
        let iframe = document.getElementById('workOrderForm');
        iframe.src = encodeURI(url);
    
        console.log(encodeURI(url));
    }
}

$("#inventoryButton #changeNameInventory").on("click", function () {
    if ($(this).hasClass("active")) {
        $(".tab.inventory.changeName").css("max-width", "100px");
        $("#changeNameInventory").removeClass("active");
        $("#toggleInventory").removeClass("fa-toggle-off");
        $("#toggleInventory").addClass("fa-toggle-on");
    }
    else{
        $(".tab.inventory.changeName").css("max-width", "50px");
        $("#changeNameInventory").addClass("active");
        $("#toggleInventory").removeClass("fa-toggle-on");
        $("#toggleInventory").addClass("fa-toggle-off");
    }

    $('.inventoryList > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

})

function openMaintainJoget(ele) {
    if (!JOGETLINK) return
    var processType;
    var url;
 
    if(localStorage.Project_type == 'FM') {
        processType = $(ele).attr("rel");
 
        if(processType == 'service_request') {
            processType = "fm_view_list_service_request";
        }
   
        url = JOGETLINK[processType];
 
    } else {
 
        if(ele == 'rfi'){
            processType = 'RequestForInspection';
        }else if(ele == 'ncp'){
            processType = 'NonConformanceProduct';
        }else{
            processType = $(ele).attr("rel");
        }

        if(processType == 'defect_detection' || processType == 'PictorialReport' || processType == 'ScheduleInspection'){
            if(localStorage.project_owner == 'JKR_SABAH'){
                if(JOGETLINK['asset_'+processType+'_sbh']){
                    url = JOGETLINK['asset_'+processType+'_sbh'];
                }
            }else{
                if(JOGETLINK['asset_'+processType]){
                    url = JOGETLINK['asset_'+processType];
                }
            }
        }else{
            if(JOGETLINK['asset_'+processType]){
                url = JOGETLINK['asset_'+processType];
            }
        }
        
    }
    $("iframe.maintenanceList")
        .attr("src", url)
        .css("height", "100%")
        .css("width", "100%");
}

$("#maintainButton #changeNameMaintenance").on("click", function () {
    if ($(this).hasClass("active")) {
        $("#changeNameMaintenance").removeClass("active");
        $("#toggleMaintain").removeClass("fa-toggle-off");
        $("#toggleMaintain").addClass("fa-toggle-on");

        if(!$(`#maintenanceList .parent`).hasClass("wrapped")){
            $(`#maintenanceList .parent.changeName`).css("max-width", "unset");
            $(`.buttonTab .children.changeName`).css("max-width", "unset");
        }else{
            $(`#maintenanceList .parent.changeName`).css("max-width", "100px");
            $(`.buttonTab .children.changeName`).css("max-width", "unset");
        }
    }
    else{
        $("tab.maintenance.changeName").css("max-width", "50px");
        $("#changeNameMaintenance").addClass("active");
        $("#toggleMaintain").removeClass("fa-toggle-on");
        $("#toggleMaintain").addClass("fa-toggle-off");
    }

    $('.buttonTab.maintenanceList > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

    $('.buttonTab.conditionBrowser > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

    $('.buttonTab.assessmentBrowser > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

    $('.buttonTab.routineBrowser > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

    $('.buttonTab.periodicBrowser > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

    $('.buttonTab.emergencyBrowser > .changeName').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

})

//-------------START FUNCTION FOR UPLOAD PROGRESS SUMMARY UPDATE----------------//

function importPSUstart (){
    var formData = new FormData();
    var section;
    if(localStorage.page_pageOpen == "" || localStorage.page_pageOpen == undefined){
        formData.append('file', $('#uploadExcelInputProgressOutside')[0].files[0]);
        section = $("#progressUploadSectionOptionOutside").val();
        if(SYSTEM == "OBYU"){
            if ($("#sectionCheckBoxOutside").is(':checked')) {
                formData.append('section', section);
            }
        }
    }else{
        formData.append('file', $('#uploadExcelInputProgressInside')[0].files[0]);
        section = $("#progressUploadSectionOptionInside").val();
        if(SYSTEM == "OBYU"){
            if ($("#sectionCheckBoxInside").is(':checked')) {
                formData.append('section', section);
            }
        }
    }
    formData.append('functionName', 'progressExcelUpload');
    $.ajax({
        url: './../JS/uploader/progressUploadv3.php',  
        type: 'POST',
        data: formData,
        dataType: 'JSON',
        success:function(data){
            if (data.status == "success") {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Success",
                    content: "Upload Success!",
                });
                loadProgressSummary()
            }else{
                if(data.errorMessage){
                    $.alert({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Error!",
                        content: data.errorMessage,
                    });
                }
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function addFileButtonProgress (e){
    if(localStorage.page_pageOpen == "" || localStorage.page_pageOpen == undefined){
        $('#uploadExcelInputProgressOutside').trigger('click');
    }else{
        $('#uploadExcelInputProgressInside').trigger('click');
    }
    e.preventDefault();
}

$('.progressSummary #uploadExcelInputProgressInside').change(function() {
    $('.progressFileName').text($('#uploadExcelInputProgressInside')[0].files[0].name);
    $("#importExcelProgressReportInside").show();
});

$('.progressSummary #uploadExcelInputProgressOutside').change(function() {
    $('.progressFileName').text($('#uploadExcelInputProgressOutside')[0].files[0].name);
    $("#importExcelProgressReportOutside").show();
});

$("#sectionCheckBoxOutside").change(function() {
    if(this.checked) {
        $("#progressUploadSectionDivOutside").addClass("active");
        $("#add-file-btn-dash-outside").attr('disabled','true');
        clearSummaryTable();
    }else{
        $("#progressUploadSectionDivOutside").removeClass("active");
        $("#add-file-btn-dash-outside").removeAttr('disabled');
        loadProgressSummaryTableOBYU();
    }
});

$("#sectionCheckBoxInside").change(function() {
    if(this.checked) {
        $("#progressUploadSectionDivInside").addClass("active");
        $("#add-file-btn-dash-inside").attr('disabled','true');
        clearSummaryTable();
    }else{
        $("#progressUploadSectionDivInside").removeClass("active");
        $("#add-file-btn-dash-inside").removeAttr('disabled');
        loadProgressSummaryTableOBYU();
    }
});

$('#progressUploadSectionOptionOutside').change(function(){
    $("#add-file-btn-dash-outiside").removeAttr('disabled');
    
    var selVal = $(this).val();
    loadProgressSummaryTableOBYU(selVal);
})

$('#progressUploadSectionOptionInside').change(function(){
    $("#add-file-btn-dash-inside").removeAttr('disabled');
    
    var selVal = $(this).val();
    loadProgressSummaryTableOBYU(selVal);
})

//-------------END FUNCTION FOR UPLOAD PROGRESS SUMMARY UPDATE----------------//

function OnClickPwCredentialsSave() {
    var username = $('#pwUserName').val();
    var password = $('#pwPassword').val();
    if (username == "" || password == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please enter values for username and password!',
        });
        return;
    };

    $("#wizard").fadeOut(100)
    $(".modal-container.insight").css("display", "none")
    $(".modal-container.insight .pwCredentials").css("display", "none")

    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchDatav3.php',
        dataType: 'json',
        data: {
            functionName: 'docViewer',
            fileUrl: fileUrl,
            fileName: fileName,
            userName: username,
            passWord: password
        },
        success: function (obj, textstatus) {
            var message = obj['msg'];
            var url = '../'+ obj['fileurl'];
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

function getProcessDownload(apps_link, accessProcess, accessManage, project_type) {
    var accessRoleMAU = ['Project Manager','Planning Engineer'];
    var proj_id_name = ['eLibrary','projectInformation'];

    var arrConstruct = {};
    let rightTabList = '';
    let rightConopChoice = `
                                <option value="default">Please Choose</option>
                            `
    let rightManageChoice = `
                                <option value="default">Please Choose</option>
                            `
    let exportList = `
                                <option value="default">Please Choose</option>
                            `

    // ASSET
    var rightTabInv;
    var arrAsset = {};
    var arrAsset2 = {};
    var arrAssetRM = {};
    var arrAssetPM = {};
    var arrAssetEW = {};
    var arrAsset3 = {};
    secondAssetMenuRM = [];
    secondAssetMenuPM = [];
    secondAssetMenuEW = [];
    let rightProcessAsset = `
                            <option value="default">Please Choose</option>
                        `
    let rightProcessAsset3 = `
                                <option value="default">Please Choose</option>
                            `
    let rightManageAssetChoice = `
                                <option value="default">Please Choose</option>
                            `
    let assetExpListOut = `
                                <option value="default">Please Choose</option>
                            `

    if(localStorage.project_owner == "JKR_SABAH"){
        if(localStorage.project_phase == '1B'){
            arrConstruct = {
                "app_DCR" : {
                    data : "DCR",
                    title : "DCR",
                    name :"Design Change Request"
                },
                "app_IR" : {
                    data : "IR",
                    title : "INC",
                    name :"Incident"
                },
                "app_LR" : {
                    data : "LR",
                    title : "LA",
                    name :"Land Acquisition"
                },
                "app_LI" : {
                    data : "LI",
                    title : "LI",
                    name :"Land Issue"
                },
                "app_LE" : {
                    data : "LE",
                    title : "LE",
                    name :"Land Encumbrances"
                },
                "app_LS" : {
                    data : "LS",
                    title : "LS",
                    name :"Land Summary"
                },
                "app_MOS" : {
                    data : "MOS",
                    title : "MS",
                    name :"Method Statement"
                },
                "app_MS" : {
                    data : "MS",
                    title : "MA",
                    name :"Material Acceptance"
                },
                "app_NCR" : {
                    data : "NCR",
                    title : "NCR",
                    name :"Non Conformance Report"
                },
                "app_PSU" : {
                    data : "PSU",
                    title : "PSU",
                    name :"Progress Summary Upload"
                },
                "app_PBC" : {
                    data : "PBC",
                    title : "PBC",
                    name :"Public Complaint"
                },
                "app_RS" : {
                    data : "RS",
                    title : "RS",
                    name :"Report Submission"
                },
                "app_RR" : {
                    data : "RR",
                    title : "RR",
                    name :"Risk Register"
                },
                "app_WIR" : {
                    data : "WIR",
                    title : "RFI",
                    name :"Request For Inspection"
                },
                "app_RFI" : {
                    data : "RFI",
                    title : "RFIT",
                    name :"Request For Information Technical"
                },
                "app_SA" : {
                    data : "SA",
                    title : "SA",
                    name :"Safety Activity And Response"
                },
                "app_SDL" : {
                    data : "SDL",
                    title : "SDL",
                    name :"Site Diary Log"
                },
                "app_SD" : {
                    data : "SD",
                    title : "SI",
                    name :"Site Instruction"
                },
                "app_NOI" : {
                    data : "NOI",
                    title : "SM / NOI",
                    name :"Site Memo / Notice Of Improvement"
                },
                "app_SMH" : {
                    data : "SMH",
                    title : "SMH",
                    name :"Total Man-Hours"
                },
                "app_PU" : {
                    data : "PU",
                    title : "PU",
                    name :"URW - Progress Update"
                }
            }
        }else{
            arrConstruct = {
                "app_DCR" : {
                    data : "DCR",
                    title : "DCR",
                    name :"Design Change Request"
                },
                "app_IR" : {
                    data : "IR",
                    title : "INC",
                    name :"Incident"
                },
                "app_LR" : {
                    data : "LR",
                    title : "LA",
                    name :"Land Acquisition"
                },
                "app_LI" : {
                    data : "LI",
                    title : "LI",
                    name :"Land Issue"
                },
                "app_LE" : {
                    data : "LE",
                    title : "LE",
                    name :"Land Encumbrances"
                },
                "app_LS" : {
                    data : "LS",
                    title : "LS",
                    name :"Land Summary"
                },
                "app_MOS" : {
                    data : "MOS",
                    title : "MS",
                    name :"Method Statement"
                },
                "app_MS" : {
                    data : "MS",
                    title : "MA",
                    name :"Material Acceptance"
                },
                "app_NCR" : {
                    data : "NCR",
                    title : "NCR",
                    name :"Non Conformance Report"
                },
                "app_PSU" : {
                    data : "PSU",
                    title : "PSU",
                    name :"Progress Summary Upload"
                },
                "app_PBC" : {
                    data : "PBC",
                    title : "PBC",
                    name :"Public Complaint"
                },
                "app_RS" : {
                    data : "RS",
                    title : "RS",
                    name :"Report Submission"
                },
                "app_RR" : {
                    data : "RR",
                    title : "RR",
                    name :"Risk Register"
                },
                "app_WIR" : {
                    data : "WIR",
                    title : "RFI",
                    name :"Request For Inspection"
                },
                "app_RFI" : {
                    data : "RFI",
                    title : "RFIT",
                    name :"Request For Information Technical"
                },
                "app_SA" : {
                    data : "SA",
                    title : "SA",
                    name :"Safety Activity And Response"
                },
                "app_SDL" : {
                    data : "SDL",
                    title : "SDL",
                    name :"Site Diary Log"
                },
                "app_SD" : {
                    data : "SD",
                    title : "SI",
                    name :"Site Instruction"
                },
                "app_NOI" : {
                    data : "NOI",
                    title : "SM / NOI",
                    name :"Site Memo / Notice Of Improvement"
                },
                "app_SMH" : {
                    data : "SMH",
                    title : "SMH",
                    name :"Total Man-Hours"
                },
                "app_DA" : {
                    data : "DA",
                    title : "DA",
                    name :"URW - Approved Design Drawing"
                },
                "app_PU" : {
                    data : "PU",
                    title : "PU",
                    name :"URW - Progress Update"
                }
            }
        }
    }
    else if(localStorage.project_owner == "JKR_SARAWAK"){
        arrConstruct = {
            "app_DCR" : {
                data : "DCR",
                title : "DCR",
                name :"Design Change Request"
            },
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_LR" : {
                data : "LR",
                title : "LA",
                name :"Land Acquisition"
            },
            "app_LI" : {
                data : "LI",
                title : "LI",
                name :"Land Issue"
            },
            "app_LE" : {
                data : "LE",
                title : "LE",
                name :"Land Encumbrances"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_MS" : {
                data : "MS",
                title : "MT",
                name :"Material Approval"
            },
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_NOI" : {
                data : "NOI",
                title : "NOI",
                name :"Notice Of Improvement"
            },
            "app_PBC" : {
                data : "PBC",
                title : "PBC",
                name :"Public Complaint"
            },
            "app_RS" : {
                data : "RS",
                title : "RS",
                name :"Report Submission"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request For Information"
            },
            "app_RSDL" : {
                data : "RSDL",
                title : "RSDL",
                name :"RET\'s Site Diary Log (RSDL)"
            },
            "app_RR" : {
                data : "RR",
                title : "RR",
                name :"Risk Register"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"Safety Activity"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SDL",
                name :"Site Diary Log"
            },
            "app_SD" : {
                data : "SD",
                title : "SD",
                name :"Site Direction"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Man-Hours"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            }
        }
    }
    else if(localStorage.project_owner == "SSLR2"){
        if(IS_DOWNSTREAM){
            arrConstruct = {
                "app_IR" : {
                    data : "IR",
                    title : "INC",
                    name :"Incident"
                },
                "app_LR" : {
                    data : "LR",
                    title : "LA",
                    name :"Land Acquisition"
                },
                "app_LI" : {
                    data : "LI",
                    title : "LI",
                    name :"Land Issue"
                },
                "app_LE" : {
                    data : "LE",
                    title : "LE",
                    name :"Land Encumbrances"
                },
                "app_MOS" : {
                    data : "MOS",
                    title : "MS",
                    name :"Method Statement"
                },
                "app_MS" : {
                    data : "MS",
                    title : "MT",
                    name :"Material Approval"
                },
                "app_PBC" : {
                    data : "PBC",
                    title : "PBC",
                    name :"Public Complaint"
                },
                "app_RS" : {
                    data : "RS",
                    title : "RS",
                    name :"Report Submission"
                },
                "app_RFI" : {
                    data : "RFI",
                    title : "RFI",
                    name :"Request For Information"
                },
                "app_SA" : {
                    data : "SA",
                    title : "SA",
                    name :"Safety Activity"
                },
                "app_SDL" : {
                    data : "SDL",
                    title : "SDL",
                    name :"Site Diary Log"
                },
                "app_SMH" : {
                    data : "SMH",
                    title : "SMH",
                    name :"Total Man-Hours"
                },
                "app_WIR" : {
                    data : "WIR",
                    title : "WIR",
                    name :"Work Inspection Request"
                },
                "app_PSU" : {
                    data : "PSU",
                    title : "PSU",
                    name :"Progress Summary Upload"
                }
            }
        }else{
            arrConstruct = {
                "app_NCR" : {
                    data : "NCR",
                    title : "NCR",
                    name :"Non Conformance Report"
                },
                "app_NOI" : {
                    data : "NOI",
                    title : "NOI",
                    name :"Notice Of Improvement"
                },
                "app_PSU" : {
                    data : "PSU",
                    title : "PSU",
                    name :"Progress Summary Upload"
                }
            }
        }
    }
    else if(localStorage.project_owner == "MRSB"){        
        arrConstruct = {
            "app_EVNT" : {
                data : "EVNT",
                title : "EVNT",
                name :"Event"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"HSET Activity"
            },
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_LAND" : {
                data : "LAND",
                title : "LM",
                name :"Land Management"
            },
            "app_MS" : {
                data : "MS",
                title : "MT",
                name :"Material Submission"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_NOI" : {
                data : "NOI",
                title : "NOI",
                name :"Notice of Improvement"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            },
            "app_PUBC" : {
                data : "PUBC",
                title : "PUBC",
                name :"Public Complaint"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request For Information"
            },
            "app_RR" : {
                data : "RR",
                title : "RR",
                name :"Risk Register"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SD",
                name :"Site Diary"
            },
            "app_SD" : {
                data : "SD",
                title : "SI",
                name :"Site Instruction"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Safe Man-Hour Works Without LTI"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            }
        }
    }
    else if(localStorage.project_owner == "KACC"){
        arrConstruct = {
            "app_CAR" : {
                data : "CAR",
                title : "CAR",
                name :"Corrective Action Request"
            },
            "app_IR" : {
                data : "IR",
                title : "INC",
                name :"Incident"
            },
            "app_MS" : {
                data : "MS",
                title : "MT",
                name :"Material Submission"
            },
            "app_MOS" : {
                data : "MOS",
                title : "MS",
                name :"Method Statement"
            },
            "app_MAU" : {
                data : "MAU",
                title : "MAU",
                name :"Monthly Attachment Upload"
            },
            "app_NCR" : {
                data : "NCR",
                title : "NCR",
                name :"Non Conformance Report"
            },
            "app_PTW" : {
                data : "PTW",
                title : "PTW",
                name :"Permit To Work"
            },
            "app_PSU" : {
                data : "PSU",
                title : "PSU",
                name :"Progress Summary Upload"
            },
            "app_RFI" : {
                data : "RFI",
                title : "RFI",
                name :"Request for Information"
            },
            "app_SA" : {
                data : "SA",
                title : "SA",
                name :"Safety Activity"
            },
            "app_SDL" : {
                data : "SDL",
                title : "SD",
                name :"Site Diary"
            },
            "app_SD" : {
                data : "SD",
                title : "SI",
                name :"Site Instruction"
            },
            "app_SMH" : {
                data : "SMH",
                title : "SMH",
                name :"Total Safe Man-Hour Works Without LTI"
            },
            "app_WIR" : {
                data : "WIR",
                title : "WIR",
                name :"Work Inspection Request"
            }
        }
    }
    
    if(project_type == 'ASSET'){
        if(localStorage.project_owner == "JKR_SARAWAK"){
            arrAsset = {
                "RM" : {
                    data : "RM",
                    title : "RM",
                    name : "Routine Maintenance"
                },
                "PM" : {
                    data : "PM",
                    title : "PM",
                    name : "Periodic Maintenance"
                },
                "EW" : {
                    data : "EW",
                    title : "EW",
                    name : "Emergency Work"
                },
                "RFI" : {
                    data : "RFI",
                    title : "RFI",
                    name : "Request for Inspection"
                },
                "NCP" : {
                    data : "NCP",
                    title : "NCP",
                    name : "Non Conformance Product"
                }
            }
    
            arrAssetRM = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                }
            }
    
            arrAssetPM = {
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                }
            }
    
            arrAssetEW = {
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "GAR" : {
                    data : "GAR",
                    title : "GAR",
                    name : "Government Asset Return"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset2 = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                },
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                },
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset3 = {
                "BRG" : {
                    data : "BRG",
                    title : "BRG",
                    name :"Bridge"
                },
                "CVT" : {
                    data : "CVT",
                    title : "CVT",
                    name :"Culvert"
                },
                "DRG" : {
                    data : "DRG",
                    title : "DRG",
                    name :"Drainage"
                },
                "PAVE" : {
                    data : "PAVE",
                    title : "PAVE",
                    name :"Pavement"
                },
                "RF" : {
                    data : "RF",
                    title : "RF",
                    name :"Road Furniture"
                },
                "SLP" : {
                    data : "SLP",
                    title : "SLP",
                    name :"Slope"
                }
            };
            
            arrMaintanceList = {
                0 : {
                    data : "con",
                    title : "CON",
                    name :"Condition"
                },
                1 : {
                    data : "asses",
                    title : "AM",
                    name :"Asset Monitoring"
                },
                2 : {
                    data : "routine",
                    title : "RM",
                    name :"Routine Maintenance"
                },
                3 : {
                    data : "periodic",
                    title : "PM",
                    name :"Periodic Maintenance"
                },
                4 : {
                    data : "emergency",
                    title : "EW",
                    name :"Emergency Work"
                },
                5 : {
                    data : "rfi",
                    title : "RFI",
                    name :"Request for Inspection"
                },
                6 : {
                    data : "ncp",
                    title : "NCP",
                    name :"Non Conformance Product"
                }
            }
    
            arrMaintanceConList = {
                0 : {
                    data : "condition_bridge_component",
                    title : "BRG COMPONENT",
                    name :"Bridge (Component)"
                },
                1 : {
                    data : "condition_bridge_overall",
                    title : "BRG OVERALL",
                    name :"Bridge (Overall)"
                },
                2 : {
                    data : "condition_culvert",
                    title : "CVT",
                    name :"Culvert"
                },
                3 : {
                    data : "condition_drainage",
                    title : "DRG",
                    name :"Drainage"
                },
                4 : {
                    data : "condition_pavement",
                    title : "PAVE",
                    name :"Pavement"
                },
                5 : {
                    data : "condition_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                6 : {
                    data : "condition_slope",
                    title : "SLP",
                    name :"Slope"
                }
            }
    
            arrMaintanceAssList = {
                0 : {
                    data : "assess_view_bridge",
                    title : "BRG",
                    name :"Bridge"
                },
                1 : {
                    data : "assess_view_culvert",
                    title : "CVT",
                    name :"Culvert"
                },
                2 : {
                    data : "assess_view_drainage",
                    title : "DRG",
                    name :"Drainage"
                },
                3 : {
                    data : "assess_view_pavement",
                    title : "PAVE",
                    name :"Pavement"
                },
                4 : {
                    data : "assess_view_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                5 : {
                    data : "assess_view_slope",
                    title : "SLP",
                    name :"Slope"
                }
            }
    
            arrMaintanceRoutineList = {
                0 : {
                    data : "ScheduleInspection",
                    title : "RI",
                    name :"Routine Inspection"
                },
                1 : {
                    data : "PictorialReport",
                    title : "PR",
                    name :"Pictorial Report"
                },
                2 : {
                    data : "LPA",
                    title : "LPA",
                    name :"LPA"
                },
                3 : {
                    data : "maint_view_work_program_annual",
                    title : "WPA",
                    name :"Work Program (Annual)"
                },
                4 : {
                    data : "maint_view_work_program_monthly",
                    title : "WPM",
                    name :"Work Program (Monthly)"
                },
                5 : {
                    data : "maint_view_work_instruction",
                    title : "WI",
                    name :"Work Instruction"
                },
                6 : {
                    data : "NotificationOfDamage",
                    title : "NODa",
                    name :"NOD Report (Monthly)"
                },
                7 : {
                    data : "site_routine",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                8 : {
                    data : "defect_detection",
                    title : "DR",
                    name :"Defect Register"
                },
                9 : {
                    data : "NotificationOfDefect",
                    title : "NODe",
                    name :"Notification of Defect"
                }
            }
    
            arrMaintancePeriodicList = {
                0 : {
                    data : "maint_view_defect_detection",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                1 : {
                    data : "maint_view_apj",
                    title : "APJ",
                    name :"APJ"
                },
                2 : {
                    data : "maint_view_apj_amendment",
                    title : "APJ(A)",
                    name :"APJ (Ammendment)"
                },
                3 : {
                    data : "maint_view_kpj",
                    title : "KPJ",
                    name :"KPJ"
                },
                4 : {
                    data : "maint_view_workorder",
                    title : "WO",
                    name :"Work Order"
                }
            }
    
            arrMaintanceEmergencyList = {
                0 : {
                    data : "maint_view_defect_detection_emergency",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                1 : {
                    data : "maint_view_notice_of_emergency",
                    title : "NOE",
                    name :"Notice of Emergency"
                },
                2 : {
                    data : "maint_view_work_daily_report",
                    title : "WDR",
                    name :"Work Daily Report"
                },
                3 : {
                    data : "maint_view_asset_handover",
                    title : "AH",
                    name :"Asset Handover"
                },
                4 : {
                    data : "maint_view_apj_emergency",
                    title : "APJ",
                    name :"APJ"
                },
                5 : {
                    data : "maint_view_apj_amendment_emergency",
                    title : "APJ(A)",
                    name :"APJ (Ammendment)"
                },
                6 : {
                    data : "maint_view_kpj_emergency",
                    title : "KPJ",
                    name :"KPJ"
                },
                7 : {
                    data : "maint_view_workorder_emergency",
                    title : "WO",
                    name :"Work Order"
                }
            }
        }
        else{
            arrAsset = {
                "RM" : {
                    data : "RM",
                    title : "RMW",
                    name : "Routine Maintenance Work"
                },
                "PM" : {
                    data : "PM",
                    title : "PMW",
                    name : "Periodic Maintenance Work"
                },
                "EW" : {
                    data : "EW",
                    title : "EW",
                    name : "Emergency Work"
                },
                "RFI" : {
                    data : "RFI",
                    title : "RFI",
                    name : "Request for Inspection"
                },
                "NCP" : {
                    data : "NCP",
                    title : "NCP",
                    name : "Non Conformance Product"
                }
            }
    
            arrAssetRM = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                }
            }
    
            arrAssetPM = {
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                }
            }
    
            arrAssetEW = {
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset2 = {
                "RI" : {
                    data : "RI",
                    title : "RI",
                    name : "Routine Inspection"
                },
                "AM" : {
                    data : "AM",
                    title : "AM",
                    name : "Asset Monitoring"
                },
                "WP" : {
                    data : "WP",
                    title : "WP",
                    name : "Work Program"
                },
                "WA" : {
                    data : "WA",
                    title : "WA",
                    name : "Work Activity"
                },
                "WI" : {
                    data : "WI",
                    title : "WI",
                    name : "Work Instruction"
                },
                "DR" : {
                    data : "DR",
                    title : "DR",
                    name : "Defect Register"
                },
                "NOD" : {
                    data : "NOD",
                    title : "NOD",
                    name : "Notification of Defect"
                },
                "IVR" : {
                    data : "IVR",
                    title : "IVR",
                    name : "Inspector Visit Report"
                },
                "WO" : {
                    data : "WO",
                    title : "WO",
                    name : "Work Order"
                },
                "WB" : {
                    data : "WB",
                    title : "WB",
                    name : "Work Budget Approval"
                },
                "NOE" : {
                    data : "NOE",
                    title : "NOE",
                    name : "Notice of Emergency"
                },
                "WDR" : {
                    data : "WDR",
                    title : "WDR",
                    name : "Work Daily Report"
                }
            }
    
            arrAsset3 = {
                "BRG" : {
                    data : "BRG",
                    title : "BR",
                    name :"Bridge"
                },
                "CVT" : {
                    data : "CVT",
                    title : "CV",
                    name :"Culvert"
                },
                "DRG" : {
                    data : "DRG",
                    title : "DR",
                    name :"Drainage"
                },
                "PAVE" : {
                    data : "PAVE",
                    title : "PV",
                    name :"Pavement"
                },
                "RF" : {
                    data : "RF",
                    title : "RF",
                    name :"Road Furniture"
                },
                "SLP" : {
                    data : "SLP",
                    title : "SL",
                    name :"Slope"
                }
            };
            
            arrMaintanceList = {
                0 : {
                    data : "con",
                    title : "CON",
                    name :"Condition"
                },
                1 : {
                    data : "asses",
                    title : "AM",
                    name :"Asset Monitoring"
                },
                2 : {
                    data : "routine",
                    title : "RMW",
                    name :"Routine Maintenance Work"
                },
                3 : {
                    data : "periodic",
                    title : "PMW",
                    name :"Periodic Maintenance Work"
                },
                4 : {
                    data : "emergency",
                    title : "EW",
                    name :"Emergency Work"
                },
                5 : {
                    data : "rfi",
                    title : "RFI",
                    name :"Request for Inspection"
                },
                6 : {
                    data : "ncp",
                    title : "NCP",
                    name :"Non Conformance Product"
                }
            }
    
            arrMaintanceConList = {
                0 : {
                    data : "condition_bridge_component",
                    title : "BR COMPONENT",
                    name :"Bridge (Component)"
                },
                1 : {
                    data : "condition_bridge_overall",
                    title : "BR OVERALL",
                    name :"Bridge (Overall)"
                },
                2 : {
                    data : "condition_culvert",
                    title : "CV",
                    name :"Culvert"
                },
                3 : {
                    data : "condition_drainage",
                    title : "DR",
                    name :"Drainage"
                },
                4 : {
                    data : "condition_pavement",
                    title : "PV",
                    name :"Pavement"
                },
                5 : {
                    data : "condition_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                6 : {
                    data : "condition_slope",
                    title : "SL",
                    name :"Slope"
                }
            }
    
            arrMaintanceAssList = {
                0 : {
                    data : "assess_view_bridge",
                    title : "BR",
                    name :"Bridge"
                },
                1 : {
                    data : "assess_view_culvert",
                    title : "CV",
                    name :"Culvert"
                },
                2 : {
                    data : "assess_view_drainage",
                    title : "DR",
                    name :"Drainage"
                },
                3 : {
                    data : "assess_view_pavement",
                    title : "PV",
                    name :"Pavement"
                },
                4 : {
                    data : "assess_view_roadfurniture",
                    title : "RF",
                    name :"Road Furniture"
                },
                5 : {
                    data : "assess_view_slope",
                    title : "SL",
                    name :"Slope"
                }
            }
    
            arrMaintanceRoutineList = {
                0 : {
                    data : "ScheduleInspection",
                    title : "RI",
                    name :"Routine Inspection"
                },
                1 : {
                    data : "PictorialReport",
                    title : "PR",
                    name :"Pictorial Report"
                },
                2 : {
                    data : "LPA",
                    title : "LPA",
                    name :"LPA"
                },
                3 : {
                    data : "maint_view_work_program_annual",
                    title : "WPA",
                    name :"Work Program (Annual)"
                },
                4 : {
                    data : "maint_view_work_program_monthly",
                    title : "WPM",
                    name :"Work Program (Monthly)"
                },
                5 : {
                    data : "maint_view_work_instruction",
                    title : "WI",
                    name :"Work Instruction"
                },
                6 : {
                    data : "NotificationOfDamage",
                    title : "NODa",
                    name :"NOD Report (Monthly)"
                },
                7 : {
                    data : "site_routine",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                8 : {
                    data : "defect_detection",
                    title : "DR",
                    name :"Defect Register"
                },
                9 : {
                    data : "NotificationOfDefect",
                    title : "NODe",
                    name :"Notification of Defect"
                }
            }
    
            arrMaintancePeriodicList = {
                0 : {
                    data : "maint_view_defect_detection",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                1 : {
                    data : "maint_view_apj",
                    title : "APJ",
                    name :"APJ"
                },
                2 : {
                    data : "maint_view_apj_amendment",
                    title : "APJ(A)",
                    name :"APJ (Ammendment)"
                },
                3 : {
                    data : "maint_view_kpj",
                    title : "KPJ",
                    name :"KPJ"
                },
                4 : {
                    data : "maint_view_workorder",
                    title : "WO",
                    name :"Work Order"
                }
            }
    
            arrMaintanceEmergencyList = {
                0 : {
                    data : "maint_view_defect_detection_emergency",
                    title : "IVR",
                    name :"Inspector Visit Report"
                },
                1 : {
                    data : "maint_view_notice_of_emergency",
                    title : "NOE",
                    name :"Notice of Emergency"
                },
                2 : {
                    data : "maint_view_work_daily_report",
                    title : "WDR",
                    name :"Work Daily Report"
                },
                3 : {
                    data : "maint_view_asset_handover",
                    title : "AH",
                    name :"Asset Handover"
                },
                4 : {
                    data : "maint_view_apj_emergency",
                    title : "APJ",
                    name :"APJ"
                },
                5 : {
                    data : "maint_view_apj_amendment_emergency",
                    title : "APJ(A)",
                    name :"APJ (Ammendment)"
                },
                6 : {
                    data : "maint_view_kpj_emergency",
                    title : "KPJ",
                    name :"KPJ"
                },
                7 : {
                    data : "maint_view_workorder_emergency",
                    title : "WO",
                    name :"Work Order"
                }
            }
        }
    }

    var currentOrg = localStorage.user_org;
    $('#nameDatalist').html("ConOp List");

    if(project_type == 'ASSET'){
        for (const [idx, ele] of Object.entries(accessProcess)) {
            for (const [idx1, ele1] of Object.entries(arrAsset)) {
                if(ele != 0){
                    rightTabInv += 
                    `
                        <div class="tab changeName" data-page = "`+ele1.data+`" id="inventoryJoget" rel = "`+ele1.data+`" style = "font-size;9px" title = "`+ele1.title+`" onclick="navBoxTabClick(this)">`+ele1.name+`</div>
                    `
                }

                if((ele != false) && (idx1 == idx)){
                    if(idx1 == 'RM' || idx1 == 'PM' || idx1 == 'EW'){
                        rightProcessAsset +=
                                        `
                                            <option value="`+ele1.data+`" data-nextprocess="2">`+ele1.name+`</option>
                                        `
                    }else{
                        rightProcessAsset +=
                                        `
                                            <option value="`+ele1.data+`" data-nextprocess="next">`+ele1.name+`</option>
                                        `
                    }
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetRM)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuRM.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetPM)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuPM.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx2, ele2] of Object.entries(arrAssetEW)) {
                if((ele != false) && (idx2 == idx)){
                    secondAssetMenuEW.push({y:ele2.data, z:ele2.name})
                }
            }

            for (const [idx3, ele3] of Object.entries(arrAsset3)) {
                if((ele != false) && (idx3 == idx)){
                    rightProcessAsset3 +=
                                    `
                                        <option value="`+ele3.data+`" data-nextprocess="next">`+ele3.name+`</option>
                                    `
                }
            }
        }

        //for bulk export
        for (const [idx, ele] of Object.entries(arrMaintanceList)) {
            if(ele.data == 'rfi' || ele.data == 'ncp'){
                assetExpListOut +=
                    `
                        <option value="`+ele.data+`" data-nextprocess="next">`+ele.name+`</option>
                    `
            }else{
                assetExpListOut +=
                    `
                        <option value="`+ele.data+`" data-nextprocess="2">`+ele.name+`</option>
                    `
            }
        }

        if(accessManage){
            for (const [idx4, ele4] of Object.entries(accessManage)) {
                for (const [idx5, ele5] of Object.entries(arrAsset2)) {
                    if(idx5 == idx4){
                        rightManageAssetChoice +=
                            `
                                <option value="`+ele5.data+`">`+ele5.name+`</option>
                            `
                    }
                }
            }
        }
    }else{
        for (const [idx, ele] of Object.entries(arrConstruct)) {
            for (const [idx2, ele2] of Object.entries(apps_link)) {
                if((idx2 == idx) && (ele2 != 0)){
                    rightTabList += 
                    `
                        <div class="tab changeName" data-page = "`+ele.data+`" id="conopJoget" rel = "`+ele.data+`" style = "font-size;9px" title = "`+ele.title+`" onclick="navBoxTabClick(this)">`+ele.name+`</div>
                    `

                    if(SYSTEM == 'OBYU'){
                        if(idx2 != 'app_LAND'){
                            exportList +=
                        `
                            <option value="`+ele.data+`">`+ele.name+`</option>
                        `
                        }
                    }else{
                        if(localStorage.project_owner == "SSLR2" && ele.data == 'LI'){
                            exportList +=
                            `
                                <option value="`+ele.data+`">Land Issue & Land Encumbrances</option>
                            `
                        }else if(localStorage.project_owner == "SSLR2" && ele.data == 'LE'){
                            //Skip LE as LI & LE combine
                        }else{
                            exportList +=
                            `
                                <option value="`+ele.data+`">`+ele.name+`</option>
                            `
                        }
                    }
                }
            }
            //Loop below for Process list based on accessProcess
            for (const [idx3, ele3] of Object.entries(accessProcess)) {
                if((ele3 != false) && (idx == "app_" + idx3)){
                    for (const [idxUse, eleUse] of Object.entries(ele3.ORG)) {
                        if(IS_DOWNSTREAM){
                            if(idxUse == 'allOrg' && localStorage.user_org != 'MAUJV'){
                                if(idx3 == "LI"){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                    `
                                }else{
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
    
                                if(idx3 == "RR"){
                                    if(localStorage.project_owner != 'JKR_SABAH'){
                                            rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Upload</option>
                                        `
                                    }
                                }
                            }
                            else if(idxUse == currentOrg){
                                if(idx3 == "LI" && idxUse == "MAUJV"){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                    `
                                }else{
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
    
                                if(idx3 == "RR" && idxUse == "MAUJV"){
                                        rightConopChoice +=
                                        `
                                        <option value="RRU">Risk Upload</option>
                                        `
                                }
                            }
                        }else{

                            if(idxUse == 'allOrg'){
                                if(IS_DOWNSTREAM){
                                    if(idx3 == "LI"){
                                        rightConopChoice +=
                                        `
                                            <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                        `
                                    }else{
                                        rightConopChoice +=
                                        `
                                            <option value="`+ele.data+`">`+ele.name+`</option>
                                        `
                                    }
                                }else{
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
    
                                if(idx3 == "RR"){
                                    if(localStorage.project_owner != 'JKR_SABAH'){
                                            rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Upload</option>
                                        `
                                    }
                                }
                            }
                            else if(idxUse == currentOrg){
                                if(idx3 == "LI" && idxUse == "MAUJV"){
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">Land Issue & Encumbrances</option>
                                    `
                                }else{
                                    rightConopChoice +=
                                    `
                                        <option value="`+ele.data+`">`+ele.name+`</option>
                                    `
                                }
    
                                if(idx3 == "RR" && idxUse == "MAUJV"){
                                        rightConopChoice +=
                                        `
                                        <option value="RRU">Risk Upload</option>
                                        `
                                }
                            }
                        }
                    }
    
                    if (SYSTEM == 'OBYU'){
                        if(idx == "app_RR"){
                            rightConopChoice +=
                                        `
                                            <option value="RRU">Risk Analysis Upload</option>
                                            <option value="RROverall">Risk Analysis Overall</option>
                                            <option value="RRSection">Risk Analysis Section</option>
                                        `
                        }

                        if(idx == "app_LAND"){
                            rightConopChoice +=
                        `
                            <option value="LTD">Land Timeline & Database</option>
                        `
                        }
                    }
                }
            }
        }
    
        if(accessManage){
            for (const [idx5, ele5] of Object.entries(arrConstruct)) {
                for (const [idx4, ele4] of Object.entries(accessManage)) {
    
                    if(idx5 == "app_" + idx4){
                        rightManageChoice +=
                            `
                                <option value="`+ele5.data+`">`+ele5.name+`</option>
                            `
                        
                        if(SYSTEM == "OBYU"){

                            if(idx4 == "RR"){
                                rightManageChoice +=
                                    `
                                        <option value="RROverall">Risk Analysis Overall</option>
                                        <option value="RRSection">Risk Analysis Section</option>
                                    `
                            }
                            
                            if(idx5 == "app_LAND"){
                                rightManageChoice +=
                                `
                                    <option value="LTD">Land Timeline & Database</option>
                                `
                            } 
                        }
                    }
                    
                }
            }
        }
    }

    $("#valueProceessConstruct").html(rightConopChoice) //add process list
    $("#valueProceessConstruct1").html(rightConopChoice) //add process list
    $("#valueManageConstruct").html(rightManageChoice) //add manage list
    $("#valueManageConstruct1").html(rightManageChoice) //add manage list
    $("#processNamebulkProj").html(exportList) //add manage list
    $("#processAsset1").html(rightProcessAsset) //add manage list
    $("#processAsset3").html(rightProcessAsset3) //add manage list
    $("#valueManageAsset1").html(rightManageAssetChoice) //add manage list
    //export menu asset
    $("#assetProcesssBulkProj").html(assetExpListOut)
}

function pavementAnalysisUpload(ele){
    var paveType = $("#pavementAnalysisType").val();
    
    if(paveType !== "") {
        $("iframe#analysisIframe").attr("src", '../Components/assetAnalysis/analysisUpl?upload='+paveType).css("height", "100%").css("width", "100%").css("border","none");
    }
}

function processSearchProject(inpt){
    var filter = inpt.value.toUpperCase();
    $('.row.wizard').css('display','none');
    if(!filter) {
        $('.processProjSearch').show();
        return;
    }
    // hide all & show only related
    $('.processProjSearch').hide();
    $('.processProjSearch').each(function(){
        var listText = $(this).text()
        if (listText.toUpperCase().indexOf(filter) > -1) {
            $(this).show();
            $(this).children('.row.wizard').css('display','flex');
            var projId = $(this).attr('id');
            if($('.project[rel="'+projId+'"]').length != 0) {
                $('.project[rel="'+projId+'"]').show();
            }
        }
    })
}

function OnClickImodelJS() {
    if (!bentleyCredentialsflag) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.responseText == " ") {
                    document.getElementById('bentleyUserName').value = "";
                    document.getElementById('bentleyPassword').value = "";
                    document.getElementById('BentleyCredential').style.display = 'block';
                } else {
                    myWindow = window.open("BackEnd/jq.php", "_blank", "width=200, height=150");

                    setTimeout(() => { myWindow.close(); }, 4000);
                    setTimeout(() => { window.open("https://wsg.reveronconsulting.com/imodelJS"); }, 6000); //#demo

                }
            }
        });
        xhr.open("GET", "BackEnd/bentley_login.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send();
    } else {
        myWindow = window.open("BackEnd/jq.php", "_blank", "width=200, height=150");

        setTimeout(() => { myWindow.close(); }, 4000);
        setTimeout(() => { window.open("https://wsg.reveronconsulting.com/imodelJS"); }, 6000); //#demo
    }

}

function ImodelJsButton(e) {
    if ($(e).hasClass("active")) {
        // ImodelJs(false)
        jqwidgetBox("IModelJs", false);
        $(e).removeClass('active')
    } else {

        $(e).addClass('active')
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.responseText == "") {
                } else {
                    myWindow = window.open("BackEnd/jq.php", "_blank", "width=200, height=150");

                    setTimeout(() => {
                        myWindow.close();
                    }, 4000);
                    setTimeout(() => {
                        $('#pwsharepage').html('<object data="https://connect.bentley.com/SelectProject/Index" height="100%" width="100%"></object>');
                        // ImodelJs(true);
                        jqwidgetBox("IModelJs", 1);
                    }, 6000);
                    // setTimeout(() => {  window.open("https://connect.bentley.com/SelectProject/Index"); }, 6000); //#demo

                }
            }
        });
        xhr.open("GET", "BackEnd/bentley_login.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send();

    }
}

function PwShareButton(e) {
    if ($(e).hasClass("active")) {
        // PWShare(false)
        jqwidgetBox("PWShare", false);
        $(e).removeClass('active')
    } else {
        // PWShare(true)
        jqwidgetBox("PWShare", 1);
        $(e).addClass('active')
    }
}

function OnClickRaiseSupport(){
    window.open('../BackEnd/jogetloginSupport.php', '_blank');
   
}

function OnClickIoTSave() {
    var iotInfo = new FormData(); // you can consider this as 'data bag'
    var id = $('#iotID').val();
    var name = $('#iotName').val();
    var type = $('input[name="iotType"]:checked').prop(id);
    console.log(type);
    //check for basic details
    if(id =="" || name =="" || type ==""){
        $.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Please fill in the details for sensor ID, Name and Type',
        });
            return;
    };
	var red = `${$('#iotR1').val()},${$('#iotR2').val()}`
    var yellow = `${$('#iotY1').val()},${$('#iotY2').val()}`
    var green = `${$('#iotG1').val()},${$('#iotG2').val()}`
    //check for threshold details. if not given no need to save
    if(red =="" || yellow =="" || green ==""){
        $.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Please fill in the threshold range for the IoT Sensor',
        });
            return;
    };
    iotInfo.append("id", id)
    iotInfo.append("name", name)
    iotInfo.append("type", type)
    iotInfo.append("red",red);
    iotInfo.append("yellow",yellow);
    iotInfo.append("green", green);
    
    if($('#sensorElementID').val()!=""){
        var elementId = $('#sensorElementID').val();
        var lon = $('#sensorLong').val();
        var lat = $('#sensorLat').val();
        var height = $('#sensorHeight').val();
        console.log(elementId);
        iotInfo.append("elementID", elementId);
        iotInfo.append("longitude", lon);
        iotInfo.append("latitude", lat);
        iotInfo.append("height", height);
    }
    if (flagIoTEdit == true) {
        var dbID = parseInt($('#dbID').val());
        console.log(dbID);
        iotInfo.append('db_id', dbID);
        iotInfo.append('function_name', 'updateIoTSensorData');
        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            dataType: 'json',
            data: iotInfo,
            processData: false,
            contentType: false,
            success: function (obj, textstatus) {
                console.log(obj);
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
        flagIoTEdit = false;
        flagIoT = true;
        $('.navBox.drawTool').css("display", "none")
    } else {
             
        iotInfo.append('function_name', 'saveIoTSensorData');

        $.ajax({
            type: "POST",
            url: '../BackEnd/fetchDatav3.php',
            data: iotInfo,
            processData: false,
            contentType: false,
            success: function (obj, textstatus) {
                console.log(obj);
                obj = JSON.parse(obj);

                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                if(obj['bool'] == true){
                    OnClickManageIoT();
                    $('.drawContainer').find('input').val("");
                    $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });

        
    }
}

function OnClickIoTReset(){
    $('.drawContainer').find('input').val("");
    $('.drawContainer').find('input#temperature').prop("checked", true);
    $('.navBox.addIoT .infoHeader .header').text("Add New IoT Sensor");
    flagIoT = true;
    flagIoTEdit = false;

}

//-------------END FUNCTION FOR INSIGHT----------------//

function whatToSetup(){
    setAccessRightButton((JSON.parse(localStorage.page_apps_right)), (JSON.parse(localStorage.accessRight)), (JSON.parse(localStorage.accessSetup)), (JSON.parse(localStorage.accessManage)), localStorage.page_pageOpen, (JSON.parse(localStorage.accessbulkApproval)))
    _enterApp(localStorage.page_pageOpen, JSON.parse(localStorage.page_apps_access));
    updateFrameSrc(localStorage.page_pageOpen);
    dashboardSetupLink();
    loadProjectListatAppsBar();
    setAccessForInsight();
    getPWConfig();
    OnLoadProjectWise365Link();
    insightsVisibity(localStorage.Project_type);
    visiblityFilterDashboard(localStorage.page_pageOpen);
}

function visiblityFilterDashboard(pageOpen){
    $('.packFilter.'+pageOpen).css("display", "none");
    $('.sectFilter.'+pageOpen).css("display", "none");
    $('.yrFilter.'+pageOpen).css("display", "none");
    $('.mthFilter.'+pageOpen).css("display", "none");
    $('.categoryFilter.'+pageOpen).css("display", "none");
    $('.statusPubcFilter.'+pageOpen).css("display", "none");
    $('.statusPubcSbhFilter.'+pageOpen).css("display", "none");
    $('.statusLandFilter.'+pageOpen).css("display", "none");
    $('.sourceFilter.'+pageOpen).css("display", "none");
    $('.reportCategoryFilter.'+pageOpen).css("display", "none");
    $('.reportStatusFilter.'+pageOpen).css("display", "none");
    $('.categoryRiskFilter.'+pageOpen).css("display", "none");
    $('.riskRatingFilter.'+pageOpen).css("display", "none");
    $('.lcmNoFilter.'+pageOpen).css("display", "none");
    $('.districtFilter.'+pageOpen).css("display", "none");
    $('.issueStatus.'+pageOpen).css("display", "none");
    $('.catgGenMgmt.'+pageOpen).css("display", "none");
    $('.typeGenMgmt.'+pageOpen).css("display", "none");
    $('.assetDateFilter.'+pageOpen).css("display", "none");
    $('.assetLaneFilter.'+pageOpen).css("display", "none");
    $('.assetDirectionToFilter.'+pageOpen).css("display", "none");
    $('.assetChainFromFilter.'+pageOpen).css("display", "none");
    $('.assetChainToFilter.'+pageOpen).css("display", "none");
    $('.assetApjFilter.'+pageOpen).css("display", "none");
    $('.assetTypeFilter.'+pageOpen).css("display", "none");
    $('.subActivityFilter.'+pageOpen).css("display", "none");
    $('.assetRoutineActivityFilter.'+pageOpen).css("display", "none");
    $('.assetGroupFilter.'+pageOpen).css("display", "none");

    if(localStorage.isParent == "isParent"){
        //only show when access as Parent Project
        $(".packFilter." +pageOpen).css("display", "inline-block")
    }
    else{
        $(".packFilter").css("display", "none")
    }

    if(localStorage.project_owner == "JKR_SABAH"){
        $(".yrFilter." +pageOpen).css("display", "none")
        $(".mthFilter." +pageOpen).css("display", "none")

        if(pageOpen == 'myDocument' || pageOpen == 'myFinance'){
            $(".yrFilter." +pageOpen).css("display", "inline-block")
            $(".mthFilter." +pageOpen).css("display", "inline-block")
        }
    }
    else if(localStorage.project_owner == "JKR_SARAWAK"){
        $(".sectFilter." +pageOpen).css("display", "none")
        $(".yrFilter." +pageOpen).css("display", "none")
        $(".mthFilter." +pageOpen).css("display", "none")

        if(pageOpen == 'myDocument' || pageOpen == 'myFinance'){
            $(".sectFilter." +pageOpen).css("display", "inline-block")
            $(".yrFilter." +pageOpen).css("display", "inline-block")
            $(".mthFilter." +pageOpen).css("display", "inline-block")
        }
    }
    else if (localStorage.project_owner == "KACC"){
        $(".sectFilter." +pageOpen).css("display", "none")
        $(".yrFilter." +pageOpen).css("display", "none")
        $(".mthFilter." +pageOpen).css("display", "none")

        if(pageOpen == 'myDocument' || pageOpen == 'myDashboard'){
            $(".yrFilter." +pageOpen).css("display", "inline-block")
            $(".mthFilter." +pageOpen).css("display", "inline-block")
        }

        if(pageOpen == 'myFinance'){
            $(".sectFilter." +pageOpen).css("display", "inline-block")
        }
    }
    else if (localStorage.project_owner == "MRSB"){
        $(".sectFilter." +pageOpen).css("display", "none")
        $(".yrFilter." +pageOpen).css("display", "none")
        $(".mthFilter." +pageOpen).css("display", "none")

        if(pageOpen == 'myDocument'){
            $(".sectFilter." +pageOpen).css("display", "inline-block")
        }

        if(pageOpen == 'myDashboard'){
            $(".yrFilter." +pageOpen).css("display", "inline-block")
            $(".mthFilter." +pageOpen).css("display", "inline-block")
        }
    }
    else if (localStorage.project_owner == "UTSB"){
        $(".yrFilter." +pageOpen).css("display", "none")
        $(".mthFilter." +pageOpen).css("display", "none")
    }
}

$(window).on("beforeunload", function() {
    // var refreshed = true
    // if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    //     refreshed = false
    // } else {
    //     refreshed = true
    // }

    // if (refreshed) {
    //     saveLastAccess();
    // }
    
});

var eventMethod = window.addEventListener
? "addEventListener"
: "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
// Listen to message from child window

eventer(
    messageEvent,
    function (e) {
    console.log("EVENT FORM NAME: ", e.data.formName);
        switch (e.data.formName) {
            case "Asset Submitted":
                wizardCancelPage();
                break;
        }
    },
    false
);


function eventSuccessMsg(evenType){

    var contextMsg = evenType + " successfully submitted!";

    $.alert({
        boxWidth: '30%',
        useBootstrap: false,
        title: 'Success!',
        content: contextMsg,
        buttons: {
            triggerOK : {
                text: 'Ok',
                keys: ['enter', 'esc'],
                action: function(){
                    if(evenType == 'Contract'){
                        $("#finance_list_PublishedContracts_SSLR2").trigger("click")
                    }else if(evenType == 'Claim'){
                        $('#finance_list_ApprovedClaims_SSLR2').trigger('click');
                    }else{
                        $('#finance_list_ApprovedVOs_SSLR2').trigger('click');
                    }
                }
            }
        }
    });

}

$(document).ready(function(){
    //remove because afraid will effect other code
    if(localStorage.page_pageOpen == 'myProject' || localStorage.page_pageOpen == 'mySysAdmin'){
        localStorage.page_pageOpen = '';
    }

    // to retain the page when user refresh
    if(localStorage.page_pageOpen && localStorage.page_apps_access && localStorage.page_apps_right){
        whatToSetup();
    }else if(localStorage.page_pageOpen == 'myReporting'){
        $(".mainAppButton[rel='myReporting']").addClass("active");
        $(".mainAppButton[rel='myProject']").removeClass("active");
        $('.mainPage.myReporting').show();
        $('.mainPage.myReporting').addClass('active');
        $(".subMenuButtonContainer").removeClass('active');
        $(".subMenuButtonContainer").css('opacity', '1');
        $("#mainContainer").removeClass("subMenuOpened");
        $('.loader').fadeIn(100);
        setTimeout(() => {
            $('.loader').fadeOut(100);
        }, 3500);
    }else{
        //show opacity for submenu button and myProject container if first load
        $('.mainPage.myProject').css('opacity', '1');
        $(".subMenuButtonContainer").css('opacity', '1');
    }

    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: 'getFav',
        },
        success: function(arr){
            favProj = arr;
        }
    });

    //get theme_mode from db
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: "getThemeMode"
        },
        success:function (response){
            if(response[0] == 'default'){
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    themeJoget = 'dark'
                }else{
                    themeJoget = 'light'
                }
            }else{
                themeJoget = response[0];
            }

            theme_mode = themeJoget;
            localStorage.themeJoget = themeJoget;
            localStorage.prod_flag = response[1];
        }
    });

    // get user org
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: "getUserOrg"
        },
        success:function (response){
            localStorage.userOrg = response[0];
            localStorage.projOwnerSbh = response[1];
            localStorage.projOwnerSwk = response[2];
            localStorage.userLoginName = response[3];
            localStorage.encPassword = response[4];
        }
    });

    // get view pref
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: "getViewPref"
        },
        success:function (res){
            localStorage.view_pref = res[0];
        }
    });
    loadAssetHierarchy();
})

function refreshLayerList() {
    // for Administrative Tool
	$.ajax({
		type: "POST",
		dataType: "JSON",
		url: "../BackEnd/fetchDatav3.php",
		data: { functionName: "getLayersData" },
		success: function (obj) {
			if (obj.data) {
                var p_layers = obj.data;
                var modelOptions = document.getElementById('modelLayerName');
                
                while (modelOptions.length > 0) {
                    modelOptions.remove(0);
                }

                for (var j = 0; j < p_layers.length; j++) {
                    var option = document.createElement("option");
                    option.text = p_layers[j].Layer_Name;
                    option.value = p_layers[j].Layer_ID;
                    modelOptions.add(option);
                }
            } else {
                console.log(obj.msg);
            }
		}
	})
}

function checkAdminAccess(role){
    return adminInsightsRoles.includes(role);
}

function onClickOpenMetadataList(ele){ 
    refreshMetadataList()
    wizardOpenPage(ele)
}

function refreshMetadataList(){
    let metaId = $('#filterMetaID').val() ? $('#filterMetaID').val() : ''
    let md_mission_id = $('#filterMissionCycleID').val() ? $('#filterMissionCycleID').val() : ''
    $.ajax({
		type: "POST",
		dataType: "JSON",
		url: "../BackEnd/fetchDatav3.php",
		data: { 
            functionName: "getAllMetadataLayer",
            metaId: metaId,
            md_mission_id : md_mission_id
        },
		success: function (obj) {
			if (obj.data) {
                var metadata = obj.data;
                // var modelOptions = document.getElementById('metadataEditList');
                var html = "" 
                console.log(obj.data);
                for (var j = 0; j < metadata.length; j++) { 

                    html+='<tr style="cursor: pointer;" onclick="selectMetadata('+metadata[j].md_meta_id+')">'
                    html+='<td style="border-bottom: 1px solid; border-right: 1px solid" >'+metadata[j].md_meta_id+'</td>'
                    html+='<td style="border-bottom: 1px solid; border-right: 1px solid" >'+metadata[j].md_mission_id+'</td>'
                    html+='<td style="border-bottom: 1px solid; border-right: 1px solid" >'+metadata[j].md_date_created+'</td>'
                    html+='<td style="border-bottom: 1px solid; border-right: 1px solid" >'+metadata[j].md_start_time+'</td>'
                    html+='<td style="border-bottom: 1px solid; border-right: 1px solid" >'+metadata[j].md_end_time+'</td>'
                    html+='</tr>'
 
                }
                $('#metadataEditList').html(html)
            } else {
                console.log(obj.msg);
            }
		}
	})
}

function selectMetadata(ele){
    console.log("ele")
    console.log(ele)
    $.ajax({
		type: "POST",
		dataType: "JSON",
		url: "../BackEnd/fetchDatav3.php",
		data: { functionName: "getAllMetadataLayer" , metaId:ele, },
		success: function (obj) {
            var metadata = obj.data[0];
			if (obj.data) {
                console.log(metadata);
                $('#metaId').val(metadata.md_meta_id)
                $('#missionCycleId').val(metadata.md_mission_id)
                
                let layerDateSplit = metadata.md_date_created.split(" ");
                $('#layerDate').val(layerDateSplit[0]);
                // $('#layerDate').val(metadata.md_date_created)
                $('#layerStartTime').val(metadata.md_start_time)
                $('#layerEndTime').val(metadata.md_end_time)
            } else {
                console.log(obj.msg);
            }
		}
	})
    $('#filterMetaID').val()
    $('#filterMissionCycleID').val()
    wizardCancelPage()
}

function loadAssetHierarchy(){

    $.ajax({
        type: "POST",
        url: "../BackEnd/fetchAssetHierarchy.php",
        dataType: "json",
        data: {
            functionName: "getListOfOmniClass"
        },
        success: function(response){

            let treeData = [];
            let result = response.data;
            let parentSet = new Set(); // Detect parent nodes

            // Sort hierarchy properly
            result.sort((a,b)=> 
                (a.item_no || "").localeCompare(b.item_no || "", undefined, {numeric:true})
            );

            result.forEach(function(item){
                if(item.item_no.includes(".")){
                    parentSet.add(item.item_no.substring(0, item.item_no.lastIndexOf(".")));
                }
            });

            result.forEach(function(item){

                let parent = "#";

                if(item.item_no.includes(".")){
                    parent = item.item_no.substring(0, item.item_no.lastIndexOf("."));
                }

                let text = item.item_no + " " + item.asset_name;

                // // Make parent bold
                // if(parentSet.has(item.item_no)){
                //     text = "<b>" + text + "</b>";
                // }
                if(parentSet.has(item.item_no)){
                    text = text; // revert to not bold for now
                }

                treeData.push({
                    id: item.item_no,
                    parent: parent,
                    text: text,
                    data:{
                        asset_id: item.id
                    }
                });

            });

            // Destroy previous tree
            $('#assetHierarchyTree').jstree("destroy");

            // Create tree
            $('#assetHierarchyTree').jstree({
                core:{
                    data: treeData,
                    themes:{
                        icons:false
                    }
                },
                plugins:["search","wholerow","state"],
                search:{
                    case_sensitive:false,
                    show_only_matches:true
                }
            });

            // node click event
            $('#assetHierarchyTree')
            .off("select_node.jstree")
            .on("select_node.jstree", function (e, data) {

                let nodeID = data.node.data.asset_id;

                if(!nodeID) return;

                let url = JOGETLINK['asset_table_hierarchy_list'];

                url += "&asset_id=" + nodeID;

                $("#jogetAssetTableHierarchyList")
                    .attr("src", url)
                    .show();

            });


            // search filter
            let to = false;

            $('#treeSearch')
            .off('keyup')
            .on('keyup', function () {

                if (to) clearTimeout(to);

                to = setTimeout(function () {

                    let v = $('#treeSearch').val();

                    $('#assetHierarchyTree')
                        .jstree(true)
                        .search(v);

                }, 250);

            });

        },

        error:function(xhr,status,error){
            console.log("Hierarchy load error:", error);
        }

    });

}

