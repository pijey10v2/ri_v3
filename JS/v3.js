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

var flagReviewTool = false;
var flagReviewToolMaximize = false;
var flagProcessOutside = false;
var flagProcess = '';
var homeLocation = "";
var flagLinkLand;
var mode;
var userData;
var tableType = "";
var newProjectFlag;
var flagEdit = false;
var themeJoget;

//system admin
var click_project_details;
var userProjectArr = [];
var userProjectGroupArr = [];
var newuserlist = [];
var constructPackages =[];
var assetPackages =[];
var contractorSelectizeOrg;
var consultantSelectizeOrg = [];
var sdText;

var nStart = 1;
var nLoad = true;
var nEnd = Math.round((($(window).height()-214)/168) + 1)
//var nEnd = 5;

let ajaxRequests = [];

getListofOrg();
$( document ).ready(function() { 
    setTimeout(function() {
        checkingJogetLoginOnLoad();
    }, 100); 
});

history.pushState(null, null, location.href);

function detectWrap() {
    var offset_top_prev;

    $(`#maintenanceList .tab`).each(function() {
       var offset_top = $(this).offset().top;

      if (offset_top > offset_top_prev) {
        $(this).addClass('wrapped');
        $(`#maintenanceList .tab`).css("max-width", "100px");
      }
      else if (offset_top == offset_top_prev) {
        $(this).removeClass('wrapped');

        if($(this).prev().hasClass('wrapped')){
            $(this).addClass('wrapped');
            $(`#maintenanceList .tab`).css("max-width", "100px");
        }
      }
      else{
        $(`#maintenanceList .tab`).removeClass('wrapped');
        $(`#maintenanceList .tab`).css("max-width", "unset");
      }

      offset_top_prev = offset_top;
    });
}

window.addEventListener("resize", e => {
    detectWrap();
});

/// function for clicking the add file button to the schedule page ///
newScheduleGantt = () => {
    if (!$("#scheduleListing li.active").hasClass("active")) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a schedule from the list to continue.',
        });
        return
    }
    $("#addscheduleForm").fadeIn(100)
    $("#addscheduleForm").addClass('active')
    $(".reviseContainer").show();
    $("#ganttView").hide();
    $(".formcontainerMainBody .revisioncontainer").css('display', 'none')
    $("#newScheduleContainer").show()
    $('.addscheduleFooter').show()
    $("#physicalContainer").hide()
    $(".addactualFooter").hide()
    $(".formHeader-addschedule h3").html("Upload Schedule")
    $("#schedulename").css({
        "background-color": "var(--background)",
        "cursor": "not-allowed"
    })
    $("#scheduletype").css({
        "background-color": "var(--background)",
        "cursor": "not-allowed"
    })
    $("#scheduledatestart").css({
        "background-color": "var(--background)",
        "cursor": "not-allowed"
    })
    $("#scheduledateend").css({
        "background-color": "var(--background)",
        "cursor": "not-allowed"
    })

    $("#schedulename").val($("#scheduleName").text())
    $("#scheduletype").val($("#scheduleType :selected").text())
    let scheduleStartDate = $(scheduleObj).attr("dataStart")
    let scheduleEndDate = $(scheduleObj).attr("data")
    let startDate = new Date(scheduleStartDate)
    offset = startDate.getTimezoneOffset();
    startDate = new Date(startDate.getTime() - (offset * 60 * 1000));
    startDate = startDate.toISOString().slice(0, 10)

    let endDate = new Date(scheduleEndDate)
    endDate = new Date(endDate.getTime() - (offset * 60 * 1000));
    endDate = endDate.toISOString().slice(0, 10)
    $("#scheduledatestart").val(startDate)
    $("#scheduledateend").val(endDate)
    let version = $("#revisionList li:first-child").attr("data")
    $("#revisionnumber").val("")
    $("#revisionremarks").val("")
}

$("#newactual").on('click', function () {
    if (!$("#scheduleListing li.active").hasClass("active")) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a schedule from the list to continue.',
        });
        return
    }
    $("#addactualForm").fadeIn(100)
    $("#addactualForm").addClass('active')
    $(".reviseContainer").show();
    $("#ganttView").hide();
    $(".formcontainerMainBody .revisioncontainer").hide()
    $('.addscheduleFooter').hide()
    $("#newScheduleContainer").hide()
    $("#physicalContainer").show()
    $(".addactualFooter").show()
})

$("#updateActualBtn").on('click', function () {
    if (!$("#scheduleListing li.active").hasClass("active")) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a schedule from the list to continue.',
        });
        return
    }
    $("#addactualForm").fadeIn(100)
    $("#addactualForm").addClass('active')
    $(".reviseContainer").show();
    $("#ganttView").hide();
    $(".formcontainerMainBody .revisioncontainer").hide()
    $('.addscheduleFooter').hide()
    $("#newScheduleContainer").hide()
    $("#physicalContainer").show()
    $(".addactualFooter").show()
})

$("#addactualcancel").on('click', function () {
    $("#ganttView").show();
    $(".reviseContainer").hide();
    $("#addactualForm").fadeOut(100)
    $("#addactualForm").removeClass('active')
    $(".formcontainerMainBody .revisioncontainer").hide()
    $("#physicalContainer").show()
    $(".addactualFooter").show()
})

//animation for clicking the cancel form button
cancelScheduleGantt = (ele) => {
    var id = $(ele).attr("id");
    if(id == "addschedulecancel"){
        $("#ganttView").hide();

        if($("#reviseschedule").is(":visible") || $("#updateActualBtn").is(":visible")){
            $("#ganttView").show();
        }
    }else{
        $("#ganttView").show();
    }
    $(".reviseContainer").hide();
    $("#addscheduleForm").fadeOut(100);
    $("#addscheduleForm").removeClass("active");
    $(".formcontainerMainBody .revisioncontainer").css("display", "none");
    $(".formHeader-addschedule span").html("Upload Schedule");
    $("#xmlInp").val("");
    $("#revisionnumber").val("");
    $("#revisionremarks").val("");
};


/// function for clicking the edit schedule button ///
reviseOnclick = () => {
    $(".reviseContainer").show();
    $("#ganttView").hide();
    $("#revisionremarks").val("");
    $("#addscheduleForm").fadeIn(100);
    $("#addscheduleForm").addClass("active");
    $(".formcontainerMainBody .revisioncontainer").show()
    $('.addscheduleFooter').css("display", "block");
    $("#newScheduleContainer").css("display", "block");
    $("#physicalContainer").hide()
    $(".addactualFooter").hide()
    $(".formHeader-addschedule span").html("Revise Schedule");
    $("#schedulename").css({
        "background-color": "var(--text-container)",
        cursor: "not-allowed",
    });
    $("#scheduletype").css({
        "background-color": "var(--text-container)",
        cursor: "not-allowed",
    });
    $("#scheduledatestart").css({
        "background-color": "var(--text-container)",
        cursor: "not-allowed",
    });
    $("#scheduledateend").css({
        "background-color": "var(--text-container)",
        cursor: "not-allowed",
    });
    $("#revisionnumber").css({
        "background-color": "var(--text-container)",
        cursor: "not-allowed",
    });
    $("#schedulename").val($("#scheduleName").text());
    $("#scheduletype").val($("#scheduleType :selected").text());

    let scheduleStartDate = $(scheduleObj).attr("dataStart");
    let scheduleEndDate = $(scheduleObj).attr("data");

    let startDate = new Date(scheduleStartDate);
    offset = startDate.getTimezoneOffset();
    startDate = new Date(startDate.getTime() - offset * 60 * 1000);
    startDate = startDate.toISOString().slice(0, 10);
    let endDate = new Date(scheduleEndDate);
    endDate = new Date(endDate.getTime() - offset * 60 * 1000);
    endDate = endDate.toISOString().slice(0, 10);
    $("#scheduledatestart").val(startDate);
    $("#scheduledateend").val(endDate);
    let version = $("#revisionList li:first-child").attr("data");
    if (isNaN(version)) {
        $("#revisionnumber").val(1);
    } else {
        $("#revisionnumber").val(Number(version) + 1);
    }
};

wizardOpenPageGantt = (pageOpen) => {
    $("#ganttList").fadeIn()
    $(".loader").fadeIn()

    $("#ganttList ").find(".modal-header a").html("Gantt Chart")

    if(pageOpen == 'insights'){
        $(".adminGantt").hide()
    }else{
        $(".adminGantt").show()
    }

    changeSchedule()
}

leftMenuButtonUnhightlight = () =>{
    $('.subButtonContainer .subButton').removeClass("active");
}

leftMenuButtonHightlight = (ele) =>{
    let linkid = $(ele).attr('id');

    leftMenuButtonUnhightlight();

    if(!$(ele).hasClass("active")){
        $(`.subButtonContainer #${linkid}`).addClass("active");
    }
}

//widget Gantt Chart
widgetGanttChartOpen = () =>{
    changeSchedule()

    $("#widgetGanttChart").addClass("show");
    $("#widgetGanttChart").find(".title").html('Gantt Chart');
}

//function to close & open widget conOp
widgetConopClose = () =>{
    $("#widgetConop").removeClass("show");
    $("#widgetGanttChart").removeClass("show");

    $("#widgetConop").find(".title").html("");
    $("#widgetConop").css({
        left: '',
        top: ''
    });
    $("#widgetConop #resizable").css({
        width: '',
        height: ''
    });

    $('#gdiv').html('')
}

widgetConopOpen = (processType, linkName, linkParam, linkWinTitle, addtlParam='') =>{
    if(linkName != ""){
        var linkUrl = processLinkParam(linkName, linkParam);
    }else{
        var linkUrl = linkParam
    }

    if(addtlParam != ''){
        linkUrl = linkUrl + addtlParam;
    }
    
    $("#widgetConop").addClass("show");
    $("#widgetConop").find(".title").html(linkWinTitle);

    $("iframe#widgetIframe").attr("src", linkUrl);
	$("iframe#widgetIframe").on("load", function () {
		$("iframe#widgetIframe").show();
		$($("iframe#widgetIframe"))[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
        localStorage.themeJoget = themeJoget
	});
}

detachWidgetToOpen = (listToOpen) =>{
    var title = "";

    switch(listToOpen){
        case "bumiList":
            title = "Bumi Participant List";
            $(".jogetList.bumiList").hide();
            $("#detachWidgetConopList").removeClass("show");
            $("#detachWidgetMaintenanceList").removeClass("show");
            $("#detachWidgetInventoryList").removeClass("show");
            break;
        case "allListConstruct":
            title = "ConOp List";
            $(".jogetList.conopList").hide();
            $("#detachWidgetConopList").addClass("show");
            $("#detachWidgetMaintenanceList").removeClass("show");
            $("#detachWidgetInventoryList").removeClass("show");
            break;
        case "allListInventory":
            title = "Asset Table";
            $(".jogetList.inventoryList").hide();
            $("#detachWidgetConopList").removeClass("show");
            $("#detachWidgetMaintenanceList").removeClass("show");
            $("#detachWidgetInventoryList").addClass("show");
            break;
        case "maintenanceBrowser":
            title = "Maintenance Browser";
            $(".jogetList.maintenanceBrowser").hide();
            $("#detachWidgetConopList").removeClass("show");
            $("#detachWidgetMaintenanceList").addClass("show");
            $("#detachWidgetInventoryList").removeClass("show");
            break;
    }

    $("#resizableDetach").find(".title").html(title);
}

detachWidgetOpen = (e) =>{
    var listToOpen = $(e).data("list");
    $("#detactedWidget").addClass("show");
    
    detachWidgetToOpen(listToOpen);
}

detachWidgetToClose = (currentWidget) =>{
    switch(currentWidget){
        case "bumiDatalist":
            $(".jogetList.bumiList").show();
            break;
        case "jogetDatalist":
            $(".jogetList.conopList").show();
            break;
        case "jogetInventorylist":
            $(".jogetList.inventoryList").show();
            break;
        case "maintenanceList":
            $(".jogetList.maintenanceBrowser").show();
            break;
    }
}

detachWidgetClose = () =>{
    var currentWidget = $("#detachWidgetIframe").attr('class');

    detachWidgetDefault();
    detachWidgetToClose(currentWidget);
}

detachWidgetDefault = () =>{
    $("#detactedWidget").removeClass("show");
    $("#detactedWidget").css({
        "left" : "",
        "top" : ""
    });
    $("#resizableDetach").css({
        "height" : "",
        "width" : ""
    });
}

defaultBulkImport = (currentPage) =>{
    $(`.modal-container.${currentPage}`).find(".buttonConfig").css("display", "none")
    $(`.modal-container.${currentPage}`).find(".bulkImportContainer").css("display", "none")
    $(`.modal-container.${currentPage}`).find(".buttonConfig button").removeClass("active")
    $(`.modal-container.${currentPage}`).find(`#importContentIframe${currentPage}`).attr("src", "")
    $(`.modal-container.${currentPage}`).find(`#exportContentIframe${currentPage}`).attr("src", "")
    $(`.modal-container.${currentPage} .modal-footer`).find(".savePage").css("display", "none")
    $(`.modal-container.${currentPage} .modal-footer`).find(".downloadPage").css("display", "none")
    $(`.modal-container.${currentPage} .modal-footer`).find(".downloadData").css("display", "none")
    $(`.modal-container.${currentPage} .modal-footer`).find(".nextPage").css("display", "none");
}

bulkTypeOnchangeBulkType = (ele, bulk_type) =>{
    var currentPage = $(ele).data("page");
    var bulkProcess = $(`.modal-container.${currentPage}`);
    var extendedBulkImport = ['LAKMRun', 'INCWitness', 'INCVictim'];

    bulkProcess.find(".bulkProcess").css("display", "block");

    if(bulk_type == "bulkImport"){
        bulkProcess.find(".buttonConfig .config").addClass("active");

        if(localStorage.project_owner == "SSLR2"){
            $.each(extendedBulkImport, function(idx, val){
                $('#processName'+currentPage+' option[value="'+val+'"]').show();
            })
        }
    }else if(bulk_type == "bulkExport"){
        bulkProcess.find(".buttonConfig .download").addClass("active");

        if(localStorage.project_owner == "SSLR2"){
            $.each(extendedBulkImport, function(idx, val){
                $('#processName'+currentPage+' option[value="'+val+'"]').hide();
            })
        }
    }else{
        bulkProcess.find(".bulkProcess").css("display", "none");
    }

    $(`#processName${currentPage}`).val("default");
    defaultBulkImport(currentPage);
}

processListOnchangeBulk = (ele, option_type) =>{
    var currentPage = $(ele).data("page");
    var bulkType = $(`#type${currentPage}`).val();
    var title = $(".modal-header a").text()
    var id;

    if(title == "Bulk Register"){
        id = $('#processNamebulkProj option:selected').val();
    }else if(title == "Bulk Register Process"){
        id = $('#processNamebulk option:selected').val();
    }

    if(option_type == 'default'){
        if(bulkType == "bulkImport"){
            $(`.modal-container.${currentPage} .buttonConfig`).css("display", "none");
            $(`.modal-container.${currentPage} .bulkImportContainer`).css("display", "none");
            defaultBulkImport(currentPage)
        }else{
            $(`.modal-container.${currentPage} .buttonConfig`).css("display", "none");
            $(`.modal-container.${currentPage} .bulkImportContainer`).css("display", "none");
            defaultBulkImport(currentPage);
        }
    }else{
        if(bulkType == "bulkImport"){
            $(`.modal-container.${currentPage} .buttonConfig`).css("display", "");
            $(`.modal-container.${currentPage} .bulkImportContainer`).css("display", "");
            $(`.modal-container.${currentPage} .buttonConfig .import`).removeClass("active");
            $(`.modal-container.${currentPage} .buttonConfig .config`).addClass("active");
            $(`.modal-container.${currentPage} .modal-footer .savePage`).css("display", "none");
            $(`.modal-container.${currentPage} .modal-footer .downloadPage`).css("display", "none");
            if(currentPage == "bulkProj"){
                $(`.modal-container.${currentPage} .modal-footer .backPage`).css("display", "unset");
            }
            bulkImportJogetLink(currentPage);
        }else{
            $(`.modal-container.${currentPage} .buttonConfig`).css("display", "");
            $(`.modal-container.${currentPage} .buttonConfig .datalist`).removeClass("active");
            $(`.modal-container.${currentPage} .buttonConfig .download`).addClass("active");
            $(`.modal-container.${currentPage} .modal-footer .nextPage`).css("display", "unset");
            if(currentPage == "bulkProj"){
                $(`.modal-container.${currentPage} .modal-footer .backPage`).css("display", "unset");
            }
        }
    }
}

onClickBulkConfig = (ele) =>{
    var currentPage = $(ele).data("page");
    var bulkType = $(`#type${currentPage}`).val();
    var bulkProcess = $(`.modal-container.${currentPage}`);
    var title = $(".modal-header a").text()
    var id;
    var urlDownload;

    if(title == "Bulk Register"){
        id = $('#processNamebulkProj option:selected').val();
    }else if(title == "Bulk Register Process"){
        id = $('#processNamebulk option:selected').val();
    }

    $(ele).removeClass("active")

    if(bulkType == "bulkImport"){
        if($(ele).hasClass("config")){
            var processName = $(`#processName${currentPage}`).val();
            
                if(processName == 'IR'){
                    if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2' || localStorage.project_owner == 'MRSB'){
                        processName = 'INC';
                    }
                }else if(processName == 'MOS'){
                    if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2' || localStorage.project_owner == 'MRSB'){
                        processName = 'MS';
                    }
                }else if(processName == 'LR'){
                    if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2'){
                        processName = 'LA';
                    }
                }else if(processName == 'EVNT'){
                    if(localStorage.project_owner == 'MRSB'){
                        processName = 'EVT';
                    }
                }else if(processName == 'MS'){
                    if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2'){
                        processName = 'MA';
                    }else if(localStorage.project_owner == 'MRSB'){
                        processName = 'MT';
                    }
                }else if(processName == 'PBC'){
                    if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2'){
                        processName = 'PUBC';
                    }
                }else if(processName == 'PUBC'){
                    if(localStorage.project_owner == 'MRSB'){
                        processName = 'PBC';
                    }
                }else if(processName == 'SD'){
                    if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'MRSB' || localStorage.project_owner == 'KACC'){
                        processName = 'SI';
                    }
                }else if(processName == 'SDL'){
                    if(localStorage.project_owner == 'MRSB'){
                        processName = 'SD';
                    }
                }else if(processName == 'WIR'){
                    if(localStorage.project_owner == 'JKR_SABAH'){
                        processName = 'RFI';
                    }
                }else if(processName == 'RFI'){
                    if(localStorage.project_owner == 'JKR_SABAH'){
                        processName = 'RFIT';
                    }
                }else{
                    processName = $(`#processName${currentPage}`).val();
                }
            
            var url = "../Components/bulkImport/V3/bulkImportConfig.php?processName="+processName;
            if(SYSTEM == 'OBYU'){
                urlDownload = "'../Templates/"+localStorage.project_owner+"/construct_"+processName+"_template.xlsx'";
            }else{
                urlDownload = "'../Templates/bulkImport/"+localStorage.project_owner+"/construct_"+processName+"_template.xlsx'";
            }
            $(`#importContentIframe${currentPage}`).attr("src", url);
            bulkProcess.find(".buttonConfig .import").addClass("active");
            bulkProcess.find(".modal-footer .savePage").css("display", "unset");
            bulkProcess.find(".modal-footer .downloadPage").css("display", "unset");
            $('.savePage').attr("data-process",processName);
            $('.downloadPage').attr("onclick","window.location.href="+urlDownload+"");
            // hide save page for KACC
            if(localStorage.project_owner == 'KACC'){
                bulkProcess.find(".modal-footer .savePage").css("display", "none");
            }
        }else if($(ele).hasClass("import")){
            bulkProcess.find(".buttonConfig .config").addClass("active");
            bulkProcess.find(".modal-footer .savePage").css("display", "none");
            bulkProcess.find(".modal-footer .downloadPage").css("display", "none");

            bulkImportJogetLink(currentPage);
        }
    }else if(bulkType == "bulkExport"){
        if($(ele).hasClass("download")){
            var url = "../Components/bulkImport/V3/bulkDownload.php";
            $(`#exportContentIframe${currentPage}`).attr("src", url);

            bulkProcess.find(".buttonConfig .datalist").addClass("active");
            bulkProcess.find(".modal-footer .downloadData").css("display", "unset");
        }else if($(ele).hasClass("datalist")){
            bulkProcess.find(".buttonConfig .download").addClass("active");
            bulkProcess.find(".modal-footer .downloadData").css("display", "none");

            bulkExportJogetLink(currentPage);
            bulkExportList(id);
        }
    }
}

bulkImportJogetLink = (currentPage) =>{

    var selVal = $(`#processName${currentPage}`).val();
    var landProcess = ['LS', 'LA', 'LI', 'LE', 'LAKMRun'];
    var extendedINCProcess = ['INCWitness', 'INCVictim'];
    var url;

    if(selVal == 'IR'){
        if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2' || localStorage.project_owner == 'MRSB'){
            selVal = 'INC';
        }
    }else if(selVal == 'MOS'){
        if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2' || localStorage.project_owner == 'MRSB'){
            selVal = 'MS';
        }
    }else if(selVal == 'LR'){
        if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2'){
            selVal = 'LA';
        }
    }else if(selVal == 'EVNT'){
        if(localStorage.project_owner == 'MRSB'){
            selVal = 'EVT';
        }
    }else if(selVal == 'MS'){
        if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2' || localStorage.project_owner == 'MRSB'){
            selVal = 'MA';
        }
    }else if(selVal == 'PBC'){
        if(localStorage.project_owner == 'JKR_SABAH' || localStorage.project_owner == 'JKR_SARAWAK' || localStorage.project_owner == 'SSLR2'){
            selVal = 'PUBC';
        }
    }else if(selVal == 'PUBC'){
        if(localStorage.project_owner == 'MRSB'){
            selVal = 'PBC';
        }
    }else if(selVal == 'SD'){
        if(localStorage.project_owner == 'MRSB'){
            selVal = 'SI';
        }
    }else{
        selVal = selVal;
    }

    if(selVal == "default"){
        url = "";
    }else{
        if (landProcess.includes(selVal)) {
            //check back this url with original php
            url = JOGETHOST+'jw/web/embed/userview/ri_construct/land/_/bulkImport'+selVal+JOGETLINK.cons_form_bulk;
        } else if(extendedINCProcess.includes(selVal)) {
            //check back this url with original php
            url = JOGETHOST+'jw/web/embed/userview/ri_construct/inc/_/bulkImport'+selVal+JOGETLINK.cons_form_bulk;
        } else {
            //check back this url with original php
            if(localStorage.project_owner == 'MRSB'){
                var process = (selVal.charAt(0).toUpperCase()) + selVal.toLowerCase().slice(1);
                url = JOGETHOST+'jw/web/embed/userview/conOp/'+localStorage.project_owner.toLowerCase()+'/_/bulkImport'+process;
            }else if(localStorage.project_owner == 'KACC'){
                var process = (selVal.charAt(0).toUpperCase()) + selVal.toLowerCase().slice(1);
                url = JOGETHOST+'jw/web/embed/userview/conOp/'+localStorage.project_owner.toLowerCase()+'/_/bulkImport'+process+JOGETLINK.kacc_form_bulk;
            }else{
                url = JOGETHOST+'jw/web/embed/userview/ri_construct/'+selVal.toLowerCase()+'/_/bulkImport'+selVal+JOGETLINK.cons_form_bulk;
            }
        }
    }

    $(`#importContentIframe${currentPage}`).attr("src", url)
}

bulkExportJogetLink = (currentPage) =>{
    var url;
    var id = $('#processNamebulkProj option:selected').val();
	url = getLinkJoget(id,"")

    $(`#exportContentIframe${currentPage}`).attr("src", url)
}

updateV3Chart = () =>{
    $('#mySysAdmin')[0].contentWindow.refreshInformation()
}

window.onpopstate = function () {
    history.go(1);
}

//mixitup sort and animate initiate and config
const config = {
    animation: {
        effects: 'fade stagger(100ms)',
        staggerSequence: function(i) {
            return i % 3;
        }
    },
    callbacks: {
        onMixBusy: function(state, originalEvent) {
            console.log('Mixer busy');
        }
    },
};

if(SYSTEM == "OBYU"){
    config.load = { sort: 'time:desc' }; // Sort descending by default (earliest to latest)
}

//Function for insight tool
openDrawTool = (e) =>{
    let pageToOpen = $(e).data("page")
    let title = $(e).attr("title")
    let typeOfTool = $(e).attr("rel")
    let pageContainer = $(".navBox."+typeOfTool).children()
    $(".pageContainer").removeClass("active")
    
    pageContainer.children(".header").html(title)
    pageContainer.children("."+pageToOpen).addClass("active")

    if(pageToOpen == 'pinPoint'){
        flagEdit = false;
        flagAddImage = false; //make the flag for camera false as both are on right click
        flagCamera = false; //make the flag for camera false as both are on right click
        flagEntity = false; //make the flag for entity false as it are on right click
        flagIoT = false; //make the flag for iot false as it are on right click

        if(!flagDraw){
            flagDraw = true
            $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
            setInstruction(`<div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark B3DM Model</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, typeOfTool)
        }else{
            flagDraw = false

            $('#RIContainer').css('cursor', "default");
        }
    }
    else if(pageToOpen == 'cameraItem'){
        flagDraw = false;
        flagEdit = false;
        flagAddImage = false; //make the flag for camera false as both are on right click
        flagEntity = false; //make the flag for entity false as it are on right click
        flagIoT = false; //make the flag for iot false as it are on right click
        uploadType = "VIDEO";

        if(!flagCamera){
            flagCamera = true;

            $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
            setInstruction(`<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, typeOfTool)
            for (var i = 0; i < videoPinsArray.length; i++) {
                videoPinsArray[i].show = true;
            }
        }else{
            flagCamera = false;

            $('#RIContainer').css('cursor', "default");
            for (var i = 0; i < videoPinsArray.length; i++) {
                videoPinsArray[i].show = false;
            }
        }

    }
    else if(pageToOpen == 'earthViewItem'){
        flagDraw = false;
        flagEdit = false;
        flagCamera = false; //make the flag for camera false as both are on right click
        flagEntity = false; //make the flag for entity false as it are on right click
        flagIoT = false; //make the flag for iot false as it are on right click

        if(!flagAddImage){
            flagAddImage = true;

            $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
            setInstruction(`<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, typeOfTool)
            OnClickEarthView();
        }else{
            flagAddImage = false;

            $('#RIContainer').css('cursor', "default");
        }
    }
    else if(pageToOpen == 'markEntity') {
        flagDraw = false;
        flagEdit = false;
        flagAddImage = false; //make the flag for camera false as both are on right click
        flagCamera = false; //make the flag for camera false as both are on right click
        flagIoT = false; //make the flag for iot false as it are on right click

        $('.navBox.drawTool').css('display', "none")
        typeOfTool = 'markEntity';
        if (!flagEntity) {
            flagEntity = true;
            setInstruction(`<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, typeOfTool)

            $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
        }
        else {
            flagEntity = false;

            $('#RIContainer').css('cursor', "default");
        }
        $(".modal-container.insight .pwCredentials").css("display", "none")
    }else if(pageToOpen == 'iotItem') {
        console.log("iot")
        flagDraw = false;
        flagEdit = false;
        flagAddImage = false; //make the flag for camera false as both are on right click
        flagCamera = false; //make the flag for camera false as both are on right click
        flagIoTEdit = false;
        

        $('.navBox.drawTool').css('display', "none")
        typeOfTool = 'markIoT';
        if (!flagIoT) {
            flagIoT = true;
            setInstruction(`<div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, typeOfTool)

            $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto");
        }
        else {
            flagIoT = false;

            $('#RIContainer').css('cursor', "default");
        }
        $(".modal-container.insight .pwCredentials").css("display", "none")
    }
}

openCameraFeedItem = (e) =>{
    let pageToOpen = $(e).data("page")
    let pageContainer = $(".navBox.cameraFeed").children()
    
    pageContainer.children(".groupItem").removeClass("ungroup")

    if(pageToOpen == 'cameraItem'){
        pageContainer.children(".header").html("Camera Feed")
    }else if(pageToOpen == 'earthViewItem'){
        pageContainer.children(".header").html("360 Image View")
    }

    pageContainer.children("."+pageToOpen).addClass("ungroup")
}

//Function to change profile pic and wallpaper
readURL = (input) =>{
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#profilePic").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#profilePic").attr("src", "../Images/defaultProfile.png");
    }
}

readURLWallpaper = (input) =>{
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            let image = e.target.result;
            $("#wallpaperPic").css('background-image', `url(${image})`);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#wallpaperPic").css('background-image', 'url()');
    }
}

//Function for radio button wizard (Pin Location) - Create new process using JOGET
selectOnlyThis = (e) =>{
    var myCheckbox = $("[name=project]");
    var className = $(e)[0].className;

    Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
    });
    e.checked = true;

    jogetConOpDraw.flag = true;
    jogetConOpDraw.coordsArray = [];
    jogetConOpDraw.entity = null;
	jogetConOpDraw.shape = $(e).val();

    $('.longLatVal').html('')

    if(className == 'chainageLocation'){
        $('.projectProcessMap').css('display', 'none')
        $('.processChainageInput').css('display', 'flex')
        $('.nextPage').css('display', 'unset')

    }else if(className == 'noLocation' || className == 'noLocationProj'){
        $('.projectProcessMap').css('display', 'none')
        $('.processChainageInput').css('display', 'none')
        $('.nextPage').css('display', 'unset')

    }else if(className == 'pointLocation' || className == 'polygonLocation'){
        flagPolyProcess = true;

        $('.projectProcessMap').css('display', 'block')
        $('.processChainageInput').css('display', 'none')
        $('.nextPage').css('display', 'unset')
        if(cesiumObjProcess){
            destroyCesium(cesiumObjProcess)
        }
        cesiumObjProcess = loadRiCesiumProcess(homeLocation);
    }else if(className == 'pointLocationProj' || className == 'polygonLocationProj'){
        flagPolyProcess = true;

        $('.projectProcessMap').css('display', 'block')
        $('.processChainageInput').css('display', 'none')
        $('.nextPage').css('display', 'unset')
        if(cesiumObjProcess){
            destroyCesium(cesiumObjProcess)
        }
        cesiumObjProcess = loadRiCesiumProcessProj(homeLocation);
    }
}

// land process to select manual input or select from lot parcel
selectOnlyThisLand = (e) =>{

    var value = '';
    var className = $(e)[0].className;
    myCheckboxLand = $("[name=land]");
    var modalTitle = $('.modal-header a').text();
    var projectProcessLand = $(e).parent().parent().parent();
    var projectProcessMap = $(e).parent().parent().parent().siblings(".projectProcessMap");

    jogetConOpDraw.flag = true;
    jogetConOpDraw.coordsArray = [];
    jogetConOpDraw.entity = null;
	jogetConOpDraw.shape = null;

    $('.longLatVal').html('')

    if(modalTitle == "Process Project"){
        value = $('#valueProceessConstruct1').find(":selected").val();
    }else if(modalTitle == "New Construction Process"){
        value = $('#valueProceessConstruct').find(":selected").val();
    }

    Array.prototype.forEach.call(myCheckboxLand,function(el){
        el.checked = false;
    });
    e.checked = true;

    if(className == 'lotParcel'){
        jogetConOpDraw.flag = false;
        if(value == 'LR' || value == 'LI' || value == 'LE'){
            flagLandBoth = true;
            jogetConOpDraw.shape = null;

            projectProcessLand.css('display', 'none')
            projectProcessMap.css('display', 'block')
            projectProcessMap.children().children('.RILandContainer').addClass('active')
            projectProcessMap.children('.RIwindowContainer').css('height', 'calc(100% - 27px)')
            projectProcessMap.find('.lotId').css('display', 'flex')
            $('.nextPage').css('display', 'none')

            if(value == 'LI'){
                $('.projectProcessCreateLand').css('display', 'none')
                $('.projectProcessMap .RIwindowContainer').css('height', 'calc(100% - 50px)')
                $('.structChain').css('display', 'flex')
            }

            if(modalTitle == "Process Project"){
                if(cesiumObjProcess){
                    destroyCesium(cesiumObjProcess)
                }
                cesiumObjProcess = loadRiCesiumProcessProj(homeLocation);
            }
        }

    }else if(className == 'manualInput'){
        $('.nextPage').css('display', 'unset')
        jogetConOpDraw.noCoordinate = true;
    }
}

//Function for radio button edit profile
selectLoginThis = (e) =>{
    var id = e.id;

    if(e.checked == true){
        if(id == 'checkresetlabelprofile'){
            $(".resetpasswordcontainer").css('display','block')
        }else if(id = 'checkresetbentleycredentials'){
            $(".resetbentleycredscontainer").css('display','block')
        }
    }else{
        if(id == 'checkresetlabelprofile'){
            $(".resetpasswordcontainer").css('display','none')
        }else if(id = 'checkresetbentleycredentials'){
            $(".resetbentleycredscontainer").css('display','none')
        }
    }
}

//Call add task method, hide loading container
dataTask = (type='') =>{
    $('button.control.unset').each(function(){
        $(this).css("display", "inline-block");
    })
    $('button.control').not(".unset").each(function(){
        $(this).css("display", "none");
    })

    var dateFrom = '';
    var dateTo = '';
    var divId = 'myTaskAll';

    if(type == 'all'){
        dateFrom = '';
        dateTo = '';
        divId = 'myTaskAll';
    }else{
        dateFrom = $('input[name="dfrom"]').val();
        dateTo = $('input[name="dto"]').val();
        divId = 'myTask';
    }

    //for multiple table to use mixitup
    var itemContainersMyTask;
    if(SYSTEM == 'OBYU'){
        itemContainersMyTask = Array.from(document.querySelectorAll('.tableBody'));
    }
    else{
        itemContainersMyTask = Array.from(document.querySelectorAll('.tableBody.datepickerList'));
    }
    itemContainersMyTask.map(container => mixitup(container, config).destroy());

    $.ajax({
        type: "POST",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: "getAllTaskList",
            dateFrom: dateFrom,
            dateTo: dateTo
        },
        beforeSend: function(jqXHR) {
            ajaxRequests.push(jqXHR); 
            $('.loadingRowContainer').show()
        },
        complete: function(jqXHR) {
            $('.loadingRowContainer').hide()
            //load swiper based on toggle view
            ajaxRequests = ajaxRequests.filter(req => req !== jqXHR); 
            breakpointChecker(localStorage.view_pref)
        },
        success : function(res){
            $('.tableBody.'+divId).html('');

            res = JSON.parse(res);
            var total = 0;
            for (const [key, val] of Object.entries(res)) {
                if(val.length > 0){
                    localStorage[key] = true;
                    if(key == "noti_finance"){
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.c_project_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.myid;
                            var process = val2.processApp;
                            var label = val2.label;
                            var activityId = val2.activityId;
                            var processtype = val2.processName;

                            var addTask = new AddTask(project, referenceNo, process, date, time, label, activityId, 'financeInbox', process, processtype, divId, '', section, '')
                            addTask.drawTask()

                            total++;
                        }
                    }
                    else if(key == "noti_construct"){
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.package_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.Ref;
                            var process = val2.processName;
                            var label = val2.label;
                            var activityId = val2.activityId;
                            var project_owner = val2.project_owner;
                            var section = val2.section;
                            var work_discipline = val2.work_discipline;
                            var createdByName = val2.createdByName;
                            var createdBy = val2.createdBy;

                            var addTask = new AddTask(project, referenceNo, process, date, time, label, activityId, 'constructInbox', '', '', divId, project_owner, section, work_discipline, createdByName, createdBy)
                            addTask.drawTask()

                            total++;
                        }
                    }
                    else if(key == "noti_asset"){
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.package_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.assetID;
                            var process = val2.processName;
                            var label = val2.label;
                            var activityId = val2.activityId;
                            var project_owner = val2.project_owner;

                            var addTask = new AddTask(project, referenceNo, process, date, time, label, activityId, 'assetInbox', '', '', divId, project_owner, '', '')
                            addTask.drawTask()

                            total++;
                        }
                    }
                    else if(key == "noti_finance_asset"){
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.c_project_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.myid;
                            var process = val2.processName;
                            var processLabel = val2.processApp;
                            var label = val2.label;
                            var activityId = val2.activityId;
                            var processtype = val2.processName;
                            if(processtype=='Claim Process' && val2.c_status_integration != 'info'){
                                processtype = 'Verify Claim';
                            }
                            
                            var addTask = new AddTask(project, referenceNo, process, date, time, label, activityId, 'FinanceAssetInbox', processLabel, processtype, divId, '', '', '')
                            addTask.drawTask()

                            total++;
                        }
                    }
                    else if(key == "noti_fm"){
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.package_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.ref_no;
                            var process = val2.processName;
                            var label = val2.label;
                            var activityId = val2.activityId;
 
                            var addTask = new AddTask(project, referenceNo, process, date, time, label, activityId, 'serviceRequestAssetInbox', '', '', divId, '', '', '')
                            addTask.drawTask()
 
                            total++;
                        }
                    }
                    else if(key == "noti_markup"){
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.package_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.subject;
                            var process = val2.processName;
                            var label = val2.label;
                            var activityId = val2.activityId;
 
                            var addTask = new AddTask(project, referenceNo, label, date, time, process, activityId, 'documentInbox', 'markup', extraParam, divId, project_owner, '', '')
                            addTask.drawTask()
 
                            total++;
                        }
                    }
                    else if(key == "noti_rfi"){
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.package_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.Ref;
                            var process = val2.processName;
                            var label = val2.label;
                            var activityId = val2.activityId;
                            var project_owner = val2.project_owner;
                            var section = val2.section;
                            var work_discipline = val2.work_discipline;
                            var createdByName = val2.createdByName;
                            var createdBy = val2.createdBy;

                            var addTask = new AddTask(project, referenceNo, process, date, time, label, activityId, 'constructInbox', 'rfiEdit', '', divId, project_owner, section, work_discipline, createdByName, createdBy)
                            addTask.drawTask()

                            total++;
                        }
                    }
                    else{
                        for (const [key2, val2] of Object.entries(val)) {
                            var project = val2.package_id;
                            var dateTime = val2.dateModified.split(" ");
                            var date = dateTime[0];
                            var time = dateTime[1];
                            var referenceNo = val2.doc_id;
                            var process = 'Correspondence';
                            var label = val2.doc_subtype + " " + process;
                            var project_owner = val2.project_owner;
                            var section = val2.section;
                            var createdByName = val2.createdByName;
                            var createdBy = val2.createdBy;
                            if(!val2["acknowledge_flag"] || val2["acknowledge_flag"] == "0" || val2["acknowledge_flag"] == ''){
                                var activityId = val2["user_id"];
                                var process = 'Acknowledge';
                                var extraParam = '&package_id='+val2["package_id"]+'&prevact='+val2["action"]+'&corr_id='+val2.id+'&package_uuid='+val2["package_uuid"];
                            }else{
                                var activityId = val2.id;
                                var process = 'Respond/View';
                                var extraParam = '&package_id='+val2["package_id"]+'&prevact='+val2["action"]+'&actuserid='+val2["user_id"]+'&package_uuid='+val2["package_uuid"]+'&project_id='+val2["project_id"];
                            }

                            var addTask = new AddTask(project, referenceNo, label, date, time, process, activityId, 'documentInbox', process, extraParam, divId, project_owner, section, '', createdByName, createdBy)
                            addTask.drawTask()

                            total++;
                        }
                    }
                }
                else{
                    localStorage[key] = false;
                    var addTask = new AddTask()
                    addTask.drawTask()
                }
                
            }

            if((localStorage.noti_construct != 'true') && (localStorage.noti_doc != 'true') && (localStorage.noti_finance != 'true') && (localStorage.noti_asset != 'true') && (localStorage.noti_finance_asset != 'true') && (localStorage.noti_markup != 'true')){
                $('.tableBody.'+divId).html(`
                    <div class="row noTaskDesc" rel="myTask" data-color="#ad5e2a">
                        <div class="textContainer" style="justify-content: center"><span>No pending task...</span><span class="fontSmall"></span></div>
                        <div class="columnSecond textContainer"><span></span><span class="fontSmall"></span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight"></span></div>
                    </div>
                `)
            }

            $("#myTaskModifiedAsc").trigger( "click" );

            if(type != 'all'){
                // update pending task count
                var totalTasks = res.noti_all_count;

                var otherPending = totalTasks - total;
                if(otherPending > 0){
                    $('#myTaskPendingCount').html('You have '+otherPending+' other pending tasks...');
                }
            }

            // remove filtered list from pending list
            if(type == 'all'){
                $('.myTask .homeTaskSearch').each(function(){
                    var row = $(this).attr('id');
                    $('.myTaskAll').find('#'+row).remove();
                });
            }

            itemContainersMyTask.map(container => mixitup(container, config));

            if(type == 'all'){
                $("#myTaskModifiedAscAll").trigger( "click" );
            }else{
                $("#myTaskModifiedAsc").trigger( "click" );
            }
        }
    });
}

//when user click my task
//Call add task method, hide loading container
dataForMyTask = () =>{
    //hide my task
    $("#noTask").css("display", "none")
    $("#constTask").css("display", "none")
    $("#docTask").css("display", "none")
    $("#pfsTask").css("display", "none")
    $("#assetTask").css("display", "none")

    $('.tableBody.taskConstruct').html('');
    $('.tableBody.taskDocument').html('');
    $('.tableBody.taskFinance').html('');
    $('.tableBody.taskAsset').html('');

    $('button.control.unset').each(function(){
        $(this).css("display", "inline-block");
    })
    $('button.control').not(".unset").each(function(){
        $(this).css("display", "none");
    })

    var itemContainers = Array.from(document.querySelectorAll('.sortTable'));

    $.ajax({
        type: "POST",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: "getTaskListBasedProject"
        },
        beforeSend: function() {
            $('.loadingRowContainer').show()
        },
        complete: function() {
            $('.loadingRowContainer').hide()
            //load swiper based on toggle view
            breakpointChecker(localStorage.view_pref, 'myTask')
        },
        success : function(res){
            itemContainers.map(container => mixitup(container, config).destroy());
            if(res){
                res = JSON.parse(res);
                for (const [key, val] of Object.entries(res)) {
                    if(val.total > 0){
                        localStorage[key] = true;
                        if(key == "noti_finance"){
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.myid;
                                var process = val2.processApp;
                                var label = val2.label;
                                var activityId = val2.activityId;
                                var processtype = val2.processName;
                                var section = val2.section;

                                var addTask = new AddTaskApp(referenceNo, process, date, time, label, activityId, 'financeInbox', process, processtype, '', section, '')
                                addTask.drawTaskApp()
                            }
                        }
                        else if(key == "noti_construct"){
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.Ref;
                                var process = val2.processName;
                                var label = val2.label;
                                var activityId = val2.activityId;
                                var project_owner = val2.project_owner;
                                var section = val2.section;
                                var work_discipline = val2.work_discipline;
                                var createdByName = val2.createdByName;
                                var createdBy = val2.createdBy;

                                var addTask = new AddTaskApp(referenceNo, process, date, time, label, activityId, 'constructInbox', '', '', project_owner, section, work_discipline, createdByName, createdBy)
                                addTask.drawTaskApp()
                            }
                        }
                        else if(key == "noti_asset"){
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.assetID;
                                var process = val2.processName;
                                var label = val2.label;
                                var activityId = val2.activityId;
                                var project_owner = val2.project_owner;
    
                                var addTask = new AddTaskApp(referenceNo, process, date, time, label, activityId, 'assetInbox', '', '', project_owner)
                                addTask.drawTaskApp()
                            }
                        }
                        else if(key == "noti_finance_asset"){
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var project = '';
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.myid;
                                var process = val2.processName;
                                var processLabel = val2.processApp;
                                var label = val2.label;
                                var activityId = val2.activityId;
                                var processtype = val2.processName;
                                if(processtype=='Claim Process' && val2.c_status_integration != 'info'){
                                    processtype = 'Verify Claim';
                                }

                                var addTask = new AddTaskApp(referenceNo, process, date, time, label, activityId, 'FinanceAssetInbox', processLabel, processtype)
                                addTask.drawTaskApp()
                            }
                        }
                        else if(key == "noti_fm"){
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.assetID;
                                var process = val2.processName;
                                var label = val2.label;
                                var activityId = val2.activityId;
   
                                var addTask = new AddTaskApp(referenceNo, process, date, time, label, activityId, 'fmInbox', '')
                                addTask.drawTaskApp()
                            }
                        }
                        else if(key == "noti_markup"){
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.subject;
                                var process = val2.processName;
                                var label = val2.label;
                                var activityId = val2.activityId;
     
                                var addTask = new AddTaskApp(referenceNo, process, date, time, label, activityId, 'documentInbox', 'markup')
                                addTask.drawTaskApp()
                            }
                        }
                        else if(key == "noti_rfi"){
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.Ref;
                                var process = val2.processName;
                                var label = val2.label;
                                var activityId = val2.activityId;
                                var project_owner = val2.project_owner;
                                var section = val2.section;
                                var work_discipline = val2.work_discipline;
                                var createdByName = val2.createdByName;
                                var createdBy = val2.createdBy;
                        
                                var addTask = new AddTaskApp(referenceNo, process, date, time, label, activityId, 'constructInbox', 'rfiEdit', '', project_owner, section, work_discipline, createdByName, createdBy)
                                addTask.drawTaskApp()
                            }
                        }
                        else{
                            for (const [key2, val2] of Object.entries(val.data)) {
                                var dateTime = val2.dateModified.split(" ");
                                var date = dateTime[0];
                                var time = dateTime[1];
                                var referenceNo = val2.doc_id;
                                var process = 'Correspondence';
                                var label = val2.doc_subtype + ' ' + process;
                                var project_owner = val2.project_owner;
                                var section = val2.section;
                                var createdByName = val2.createdByName;
                                var createdBy = val2.createdBy;
                                if(!val2["corr_act_user.acknowledge_flag"] || val2["corr_act_user.acknowledge_flag"] == "0" || val2["corr_act_user.acknowledge_flag"] == ''){
                                    var activityId = !IS_DOWNSTREAM ? val2["corr_act_user.id"] : val2.corr_act_id; //to handle if downstream
                                    var process = 'Acknowledge';
                                    var prevact = val2["corr_act_user.action"] ? val2["corr_act_user.action"] : val2.action;
                                    var extraParam = '&package_id='+val2["package_id"]+'&prevact='+prevact+'&corr_id='+val2.id+'&package_uuid='+val2["package_uuid"];
                                }else{
                                    var activityId = val2.id;
                                    var process = 'Respond/View';
                                    var prevact = val2["corr_act_user.action"] ? val2["corr_act_user.action"] : val2.action;
                                    var extraParam = '&package_id='+val2["package_id"]+'&prevact='+prevact+'&actuserid='+val2["corr_act_user.id"]+'&package_uuid='+val2["package_uuid"]+'&project_id='+val2["project_id"];
                                }
                                var addTask = new AddTaskApp(referenceNo, label, date, time, process, activityId, 'documentInbox', process, extraParam, project_owner, section, '', createdByName, createdBy)
                                addTask.drawTaskApp()
                            }
                        }
                    }
                    else{
                        localStorage[key] = false;
                        var addTask = new AddTaskApp()
                        addTask.drawTaskApp()
                    }
                    
                }

                if((localStorage.noti_construct != 'true') && (localStorage.noti_doc != 'true') && (localStorage.noti_finance != 'true') && (localStorage.noti_asset != 'true') && (localStorage.noti_finance_asset != 'true') && (localStorage.noti_markup != 'true')){
                    $('.tableBody.taskNo').html(`
                        <div class="row" rel="myTask" data-color="#ad5e2a">
                            <div class="columnFirst textContainer" style="justify-content: center"><span>No pending task...</span><span class="fontSmall"></span></div>
                            <div class="columnSecond textContainer"><span></span><span class="fontSmall"></span></div>
                            <div class="columnSecond textContainer"><span class="lineHeight"></span></div>
                        </div>
                    `)
        
                    $("#noTask").css("display", "block")
                }
            }

            itemContainers.map(container => mixitup(container, config));
        }
    });
}


//function for filling
function addAppList (data) {

    // Fill in data in view project
    var app_list = data.applist;
    if (app_list == null) return;

    // for process app (construct or asset)
    if (SYSTEM == 'OBYU'){
        var constructProcessApp = {
            "app_NCR": "Non Conformance Report (NCR)",
            "app_WIR": "Work Inspection Request (WIR)",
            "app_RFI": "Request For Information (RFI)",
            "app_MOS": "Method Statement (MS)",
            "app_MS": "Material Submission (MT)",
            "app_IR": "Incident (INC)",
            "app_SDL": "Site Diary (SD)",
            "app_SD": "Site Instruction (SI)", //change only for OBYU, because they called it as Site Instruction and not Site Direction
            "app_RS": "Report Submission (RS)",
            "app_SA": "Safety Activity (SA)",
            "app_SMH": "Total Man-Hour Works Without LTI (SMH)",
            "app_PTW": "Permit To Work",
            "app_CAR": "Corrective Action Request",
            "app_RR": "Risk Register",
            "app_NOI": "Notice of Improvement (NOI)",
            "app_PUBC": "Public Complaint (PUBC)",
            "app_EVNT": "Event (EVNT)",
            "app_LAND": "Land (LTD & LM)",
        };
    }else{
        var constructProcessApp = {
            "app_NOI":"Notice Of Improvement (NOI)",
            "app_NCR":"Non Conformance Report (NCR)",
            "app_WIR":"Work Inspection Request (WIR)",
            "app_DCR":"Design Change Request (DCR)",
            "app_RFI":"Request For Information (RFI)",
            "app_MOS":"Method Statement (MS)",
            "app_MS":"Material Acceptance (MT)",
            "app_IR":"Incident (INC)",
            "app_SDL":"Site Daily Log (SDL)",
            "app_SD":"Site Direction (SD)",
            "app_RS":"Report Submission (RS)",
            "app_SA":"Safety Activity (SA)",
            "app_SMH":"Total Man-Hours (SMH)",
            "app_RR":"Risk Register (RR)",
            "app_LR":"Land Registration (LR)",
            "app_LI":"Land Issue (LI)",
            "app_LE":"Land Encumbrances (LE)",
            "app_LS":"Land Summary (LS)",
            "app_PBC":"Public Complaint (PBC)",
            "app_DA":"Approved Design Drawing (DA)",
            "app_PU":"Progress Update (PU)",
            "app_RSDL":"RET’s Site Diary Log (RSDL)"
        };
    }

    var assetProcessApp = {
        "app_asset_insp":"Inspection",
        "app_asset_assess":"Assesment",
        "app_asset_rm":"Routine Maintainence",
        "app_asset_pm":"Periodic Maintainence",
        "app_asset_ew":"Emergency Works",
        "app_asset_rfi":"Request for Inspection",
        "app_asset_ncp":"Non Conformance Product",
        "app_asset_pca":"Pavement Analysis Upload",
        "app_asset_setup":"Setup"
    };
    
    var constructProcess = {
        ...constructProcessApp,
        ...assetProcessApp
    };

    var financeProcess = {
        "app_CP": "Contract Particular (CP)",
        "app_IC": "Interim Claim (IC)",
        "app_VO": "Variation Order (VO)",
    };
    var documentProcess = {
        "app_DR": "Document Registration (DR)",
        "app_CORR": "Correspondence (CORR)"
    };

    // handle the app
    var constructApp = { val: '', process: {} };
    var financeApp = { val: '', process: {} };
    var documentApp = { val: '', process: {} };

    Object.keys(app_list).forEach(function (key) {
        if (key == 'constructPackage_name') constructApp.val = app_list[key];
        if (key == 'financePackage_name') financeApp.val = app_list[key];
        if (key == 'documentPackage_name') documentApp.val = app_list[key];
        // process info
        if (constructProcess.hasOwnProperty(key)) constructApp.process[key] = app_list[key];
        if (financeProcess.hasOwnProperty(key)) financeApp.process[key] = app_list[key];
        if (documentProcess.hasOwnProperty(key)) documentApp.process[key] = app_list[key];
    });

    $('#constructProccess').html("");
    $('#financeProcess').html("");
    $('#documentProcess').html("");

    // consturct app
    if (constructApp.val != null) {
        var app = constructApp.val.split("::");
        var text = app[1];
        var appHTML = '';

        appHTML += `<div class="textWrap table">${text}</div>`

        $('#constructApp').html(appHTML);
    
        if (constructApp.process) {
            first = true;
            var conProcess = constructApp.process;
            var processHTML = '';
            Object.keys(conProcess).forEach(function (idx) {
                if (conProcess[idx] != null) {
                    let text = constructProcess[idx];
                    processHTML +=`<div class="textWrap table">${text}</div>`
                    $('#constructProccess').html(processHTML);
                }
            })
        }
    }

    // finance app
    if (financeApp.val != null) {
        var app = financeApp.val.split("::");
        var text = app[1];
        var appHTML = '';

        appHTML += `<div class="textWrap table">${text}</div>`

        $('#financeApp').html(appHTML);
    
        if (financeApp.process) {
            first = true;
            var conProcess = financeApp.process;
            var processHTML = '';
            Object.keys(conProcess).forEach(function (idx) {
                if (conProcess[idx] != null) {
                    let text = financeProcess[idx];
                    processHTML +=`<div class="textWrap table">${text}</div>`
                    $('#financeProcess').html(processHTML);
                }
            })
        }

        if(data.projectOwner == 'SSLR2'){
            $('.content-sub-contract-level').css("display", "flex");
        }else{
            $('.content-sub-contract-level').css("display", "none");
        }
    }

    // document app
    if (documentApp.val != null) {
        var app = documentApp.val.split("::");
        var text = app[1];
        var appHTML = '';

        appHTML += `<div class="textWrap table">${text}</div>`

        $('#documentApp').html(appHTML);
    
        if (documentApp.process) {
            first = true;
            var conProcess = documentApp.process;
            var processHTML = '';
            Object.keys(conProcess).forEach(function (idx) {
                if (conProcess[idx] != null) {
                    let text = documentProcess[idx];
                    processHTML +=`<div class="textWrap table">${text}</div>`
                    $('#documentProcess').html(processHTML);
                }
            })
        }
    }

    // Fill in data in page 2
    if (app_list.constructPackage_name != null) {
        let package = app_list.constructPackage_name
        let packageId = package.split("::")[0];
        $("#jogetPackage").val(packageId);
        $(".jogetApp_list").prop("disabled", false);
    }
    if (app_list.financePackage_name != null) {
        let package = app_list.financePackage_name
        let packageId = package.split("::")[0];
        $("#jogetFinancePackage").val(packageId);
        $('#app_CP').prop('disabled', true);
        $(".jogetPFS_App_list:not(#app_CP)").prop("disabled", false);
        
        $("#contract_level option[value="+app_list.app_CP_level+"]").attr('selected','selected');
        if(app_list.app_CP_level){
            $("#contract_level").prop("disabled", true);
        }else{
            $("#contract_level").prop("disabled", false);
        }    
    }

    if (app_list.documentPackage_name != null) {
        let package = app_list.documentPackage_name
        let packageId = package.split("::")[0];
        $("#jogetDocPackage").val(packageId);
        $('#app_DR').prop('disabled', true);
        $(".jogetDoc_App_list:not(#app_DR)").prop("disabled", false);
    }

    if(SYSTEM == 'OBYU'){
        var constructProcessArrOBYU = {
            KACC:['app_NCR','app_WIR','app_RFI','app_MOS','app_MS','app_IR','app_SDL','app_SD','app_RS','app_SA','app_SMH','app_PTW','app_CAR'],
            MRSB:['app_NCR','app_WIR','app_RFI','app_MOS','app_MS','app_IR','app_SDL','app_SD','app_RS','app_SA','app_SMH','app_RR','app_NOI','app_PUBC','app_EVNT', 'app_LAND']    
        };

        if(data.projectOwner == 'KACC' || data.projectOwner == 'MRSB'){
            // hide all process, only show related one based on the constructProcessArrOBYU
            $('.jogetApp_list').parent().parent().hide();
            $("#constructAppContainer").css("display", "flex");
            $("#financeAppContainer").css("display", "flex");
            if (constructProcessArrOBYU[data.projectOwner]) {
                for (const [idx, ele] of Object.entries(constructProcessArrOBYU[data.projectOwner])) {
                    if ($('#'+ele).length != 0) {
                        $('#'+ele).parent().parent().css("display", "flex");
                    }
                }
            }
        }else{
            //UTSB, KURW, Shorefield, OBYU Reality does not exist finance and document app
            $("#constructAppContainer").hide();
            $("#financeAppContainer").hide();
        }
    }

    Object.keys(app_list).forEach(function eachKey(key) {
        if (key != "constructPackage_name" && key != "project_id" && key != "financePackage_name" && key != "documentPackage_name") {
            if (app_list[key] == true) {
                if (document.getElementById(key)) document.getElementById(key).checked = true;
            } else {
                if (document.getElementById(key)) document.getElementById(key).checked = false;
            }
        }
    })
}

function setContractUsers() {
    $(`#addContractorUserTableBody .row div:first-child span input:checkbox`).each(function (idx) {
        for(var i = 0; i < click_project_details.users.length;) {
            if ($(this).data("userid") == click_project_details.users[i].user_id) {
                var orgSubType = click_project_details.users[i].org_sub_type;
                if(orgSubType == "owner" || orgSubType == "consultant"){
                    $(this).prop("checked", false);
                    $(`select#s`+click_project_details.users[i].user_id+`.addcontractuserselect`).css('display', 'none')
                }else{
                    $(this).prop("checked", true);
                    $(`select#s`+click_project_details.users[i].user_id+`.addcontractuserselect`).val(click_project_details.users[i].Pro_Role).prop('selected', true)
                    $(`select#s`+click_project_details.users[i].user_id+`.addcontractuserselect`).css('display', 'block')
                }

                // if users also in child project it will be disabled
                if (click_project_details.users[i].child_projects.length != 0) {
                    $(this).attr("disabled", true);

                    // also add info button to show which child project they in
                    var rowEmail = $(this).parent().parent().next()
                    if (rowEmail) {
                        rowEmail.append(`<span>&nbsp;<i class="fa-solid fa-circle-info" title="This user is also assigned in project(s):&#010;&#010;${click_project_details.users[i].child_projects.join("&#010;")}"></i></span>`);
                    };
                }
                break;
            }
            i++;
        }
    });

}

function setConsultantUsers() {
    $(`#addConsultantUserTableBody .row div:first-child span input:checkbox`).each(function (idx) {
        for(var i = 0; i < click_project_details.users.length;) {
            if ($(this).data("userid") == click_project_details.users[i].user_id) {
                var orgSubType = click_project_details.users[i].org_sub_type;
                if(orgSubType == "owner" || orgSubType == "contractor"){
                    $(this).prop("checked", false);
                    $(`select#s`+click_project_details.users[i].user_id+`.addconsultantuserselect`).css('display', 'none')
                }else{
                    $(this).prop("checked", true);
                    $(`select#s`+click_project_details.users[i].user_id+`.addconsultantuserselect`).val(click_project_details.users[i].Pro_Role).prop('selected', true)
                    $(`select#s`+click_project_details.users[i].user_id+`.addconsultantuserselect`).css('display', 'block')
                }

                // if users also in child project it will be disabled
                if (click_project_details.users[i].child_projects.length != 0) {
                    $(this).attr("disabled", true);

                    // also add info button to show which child project they in
                    var rowEmail = $(this).parent().parent().next()
                    if (rowEmail) {
                        rowEmail.append(`<span>&nbsp;<i class="fa-solid fa-circle-info" title="This user is also assigned in project(s):&#010;&#010;${click_project_details.users[i].child_projects.join("&#010;")}"></i></span>`);
                    };
                }
                break;
            }
            i++;
        }
    });
}

//get list of orgs from our DB(not joget) and load to drowpdown addNewUser
function getListofOrg() {
    $.ajax({
        url: '../BackEnd/getListofOrg.php', // changed getting list from joget to our db
        type: "GET",
        dataType: 'json',
        success: function (response) {
            document.querySelectorAll('#userOrg option').forEach(option => option.remove());
            var myselect = document.getElementById('userOrg');
            var myoption = document.createElement("option");
            
            myoption.value = "";
            myoption.text = "Please Select ...";
            myoption.disabled = true;
            myselect.appendChild(myoption);
            for (var i = 0; i < response.length; i++) {
                var myoption = document.createElement("option");

                myoption.value = response[i].orgID;
                if(SYSTEM == 'OBYU'){
                    myoption.text = response[i].orgName + " (" + response[i].orgType + ")";
                    myoption.setAttribute("data-orgType", response[i].orgType);
                }else{
                    myoption.text = response[i].orgName;
                }
                
                myselect.appendChild(myoption);
            }
            myselect.value = "";
        }
    });
}

loader = () =>{
    let loader = $(".loader").css("display", "none")
}

//always set default state for wizard
defaultStateWizard = (content) =>{
    if(cesiumObjProcess){
        destroyCesium(cesiumObjProcess);
    }

    if(content == "New Construction Process" || content == "Process Project" || content == "Link Lot Parcel"){
        //for process
        var myCheckbox = $("[name=project]");
        var myCheckboxLand = $("[name=land]");
        Array.prototype.forEach.call(myCheckbox,function(el){
            el.checked = false;
        });
        Array.prototype.forEach.call(myCheckboxLand,function(el){
            el.checked = false;
        });
        jogetConOpDraw.coordsArray = [];
        jogetConOpDraw.entity = null;
        jogetConOpDraw.shape = null;
        jogetConOpDraw.flag = false;
        jogetConOpDraw.shape = "";
        $(".processListOption").val("default")
        $("#layerOptionNewProcess1").val("default")
        $("#layerOptionNewProcess2").val("default")
        $(".projectProcessCreate").css('display', 'none')
        $(".projectProcessCreateLand").css('display', 'none')
        $(".processChainageInput").css('display', 'none')
        $(".projectProcessContainer").css('display', 'none')
        $(".projectProcessBumi").css('display', 'none')

        $("button[id^='importExcelProgressReport']").hide()
        $("input[id^='sectionCheckBox']").prop('checked', false)

        //Reset Risk Register
        $('#uploaded-dateInsight').val("")
        $('#uploaded-dateOutside').val("")
        
    }else if(content == "Manage Construction Process" || content == "Manage Project"){
        $(".manageListOption").val("default")
        $(".modal-container.manage").children().children().attr("src", "");
        $(".modal-container.manageProj").children().children().attr("src", "");
        $('.projectProcess .bottomContainer').css("display", "none");
        // $(`.modal-container.manage`).find('.handleManageProcess .RIwindowViewer').removeClass("inside")
        // $(`.modal-container.manage`).find('.handleManageProcess .bottom').removeClass("inside")
        $(`.modal-container.manageProj`).find('.handleManageProcess .RIwindowViewer').removeClass("inside")
        $(`.modal-container.manageProj`).find('.handleManageProcess .bottom').removeClass("inside")

    }else if(content == "Manage Asset Project" || content == "Manage Asset Process"){
        $(".manageAssetOption").val("default")
        $(".modal-container.manageAsset").children().children().attr("src", "");
        $(".modal-container.manageAssetProj").children().children().attr("src", "");
    }else if(content == "Setup"){
        $(".setupListOption").val("default")
        $(".modal-container.insight").children().children().attr("src", "");
        
    }else if(content == "Statistic"){
        $(".statisticListOption").val("default")
        $(".modal-container.insight").children().children().attr("src", "");
        
    }else if(content == "profile"){
        //for password
        var checkBoxPass = $("[name=password]");
        Array.prototype.forEach.call(checkBoxPass,function(el){
            el.checked = false;
        });
        $(".resetpasswordcontainer").css('display', 'none')

        //for bentley
        var checkBoxBentley = $("[name=bentley]");
        Array.prototype.forEach.call(checkBoxBentley,function(el){
            el.checked = false;
        });
        $('.resetbentleycredscontainer').css('display', 'none')

        $('button.password-show.profile').show()
        $('button.password-hide.profile').hide()
        $('button.password-show-confirm.profile').show()
        $('button.password-hide-confirm.profile').hide()
        $('#userPasswordprofile').attr("type", "password");
        $('#userConfirmPasswordprofile').attr("type", "password");
    }else if(content == "New Asset Process" || content == "Asset Project"){
        //for asset
        var myCheckbox = $("[name=asset]");
        Array.prototype.forEach.call(myCheckbox,function(el){
            el.checked = false;
        });

        $(".processListOption").val("default")
        $(".processListOption1").val("default")
        defaultProcessListOnchangeAsset(1)

        $(".projectProcessCreateAsset").css('display', 'none')
        $('.modal-container.asset').children().children('.projectProcessSelect.thirdProcess').css('display', 'none')
        $('.modal-container.asset').children().children('.projectProcessSelect.thirdRFProcess').css('display', 'none')

    }else if(content == "Pavement Analysis"){
        //for pavement analysis
        var myCheckbox = $("[name=pavement]");
        var pavementUpload = $('.pavementUpload');
        var pavementReport = $('.pavementReport');
        var modalContainer = $(`.modal-container.insight`).children().children().children('.projectPavementupload');

        Array.prototype.forEach.call(myCheckbox,function(el){
            el.checked = false;
        });

        $(".processListOption").val("default")
        $('#resilient').remove()
        $('.pavementUpload iframe').attr('src', '')
        modalContainer.css('display', 'none')
        pavementUpload.css('display', 'none')
        pavementReport.css('display', 'none')

    }else if(content == "Show Image"){
        $('.earthViewItem').children().removeClass("imageView")
        $(`.modal-container.insight .page.earthView`).css("display", "none");
    }else if(content == "Bulk Register" || content == "Bulk Register Process"){
        var bulkPage;
        
        if(content == "Bulk Register"){
            bulkPage = "bulkProj"
        }else{
            bulkPage = "bulk"
        }
        $(`#type${bulkPage}`).val("default")
        $(`#processName${bulkPage}`).val("default")
        $(`.modal-container`).find(".bulkProcess").css("display", "none")
        defaultBulkImport(bulkPage)
    }else if(content == "Bulk Export" || content == "Bulk Export Process"){
        $('.nextPage').css("display","none")
        //insight
        $('.processAssetBulk2').css("display", "none")
        $('#assetProcesssBulk1').val('default')
        $('#assetProcesssBulk1 ').removeClass("bulkChoosen")
        $('#assetProcesssBulk2').removeClass("bulkChoosen")
        $('#exportContentIframebulkAsset').attr('src','')

        //outside
        $('.processAsset2').css("display", "none")
        $('#assetProcesssBulkProj').val('default')
        $('#assetProcesssBulkProj ').removeClass("bulkChoosen")
        $('#assetProcesssBulkProj1').removeClass("bulkChoosen")
        $('#exportContentIframebulkAssetProj').attr('src','')
    }
}

//if process list on change construction
processListOnchange = (e) =>{
    var arrProcessSpecial;
    var value = $(e).val()
    let title = $(".modal-header a").text()
    var myCheckbox = $("[name=project]");
    var myCheckboxLand = $("[name=land]");

    jogetConOpDraw.coordsArray = [];
    Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
    });
    Array.prototype.forEach.call(myCheckboxLand,function(el){
        el.checked = false;
    });

    $('.RILandContainer').removeClass('active')
    $('.longLatVal').html('');
    $('.lotVal').html('');
    $('.lotId').css('display', 'none')
    $('.structChain').css('display', 'none')
    $('.projectProcessBumi').css('display', 'none')
    $('.projectProcessMap .RIwindowContainer').css('height', 'calc(100% - 98px)')
    $('.projectProcess').find('.projectProcessCreateLand').css('display', 'none');
    $("#layerOptionNewProcess1").val("default")
    $("#layerOptionNewProcess2").val("default")

    $('.nextPage').css('display', 'none')
    
    jogetConOpDraw.flag = false;
    jogetConOpDraw.coordsArray = [];
    jogetConOpDraw.entity = null;
	jogetConOpDraw.shape = null;
    flagPolyProcess = false;

    if(cesiumObjProcess){
        destroyCesium(cesiumObjProcess)
    }

    if(SYSTEM == 'OBYU'){
        if(localStorage.project_owner == 'MRSB'){
            arrProcessSpecial = ['LR', 'LI', 'LE', 'LS', 'RRU', 'PSU', 'SA', 'SMH', 'BP', 'MS', 'MOS', 'NCR', 'NOI', 'RFI', 'WIR','RROverall','RRSection','LAND','LTD']
        }else if(localStorage.project_owner == 'KACC'){
            arrProcessSpecial = ['LR', 'LI', 'LE', 'LS', 'RRU', 'PSU', 'SA', 'SMH', 'BP', 'MAU', 'NOI', 'WIR','RROverall','RRSection']
        }
    }else{
        arrProcessSpecial = ['LR', 'LI', 'LE', 'LS', 'RR', 'RRU', 'PSU', 'SA', 'SDL', 'SMH', 'BP', 'SD']
    }

    if(value == 'default'){
        $('.projectProcessMap').css('display', 'none')
        $('.nextPage').css('display', 'none')
        if(title == 'bulk' || title == 'asset' || title == 'Process Project'){
            $('.backPage').css('display', 'unset')
        }else if(title == 'New Construction Process' || title == 'Bulk Register Process'){
            $('.backPage').css('display', 'none')
        }

        defaultStateWizard(title)
    }
    else if(arrProcessSpecial.includes(value)){
        //FETCH LAYER DATA

        // Check if not outside
        if (title != "Process Project") {
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "../BackEnd/fetchDatav3.php",
                data:{ 
                    functionName: 'fetchAllDataPool',
                    package_id: localStorage.p_id,
                },
                success: ((resp)=>{
                    if(resp){
                        loadLayersNewProcess(resp);
                    }
                })
            })
        }

        if(value == 'LR' || value == 'LI' || value == 'LE'){
            cesiumObjProcess = loadRiCesiumProcess(homeLocation);
            $('.projectProcessCreate').css('display', 'none');
            $('.projectProcessMap .RIwindowContainer').css('height', 'calc(100% - 27px)');
            if(title == 'Link Lot Parcel'){
                $('.projectProcessCreateLand').css('display', 'none');
                $('.projectProcessMap').css('display', 'block');
                $('.RILandContainer').addClass('active');
                $('.lotId').css('display', 'flex');
                flagLinkLand = true;
            }else{
                if(value == 'LS'){
                    $('.projectProcessCreateLand').css('display', 'none');
                    $('.projectProcessMap').css('display', 'block');
                    $('.RILandContainer').addClass('active');
                    $('.lotId').css('display', 'flex');
                }else{
                    $('.projectProcess.active').find('.projectProcessCreateLand').css('display', 'block');
                    $('.projectProcessMap').css('display', 'none');
                    $('.lotId').css('display', 'flex');
                }
            }

            pickedLot = "";
            flagLandBoth = true;
            jogetProcessApp = value;
            jogetConOpDraw.noCoordinate = false;
        }else if(value == 'BP'){
            cesiumObjProcess = loadRiCesiumProcess(homeLocation);

            $('.projectProcessBumi').css('display', 'block')
            jogetProcessApp = value;

            $('#packageSelection').html('')
            var html = ` <option value="" disabled selected>Please Choose</option>`;
            var loading = $('.loader');
            loading.fadeIn();

            //prompt list of packages under this project
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "../BackEnd/fetchDatav3.php",
                data:{ functionName: 'getProjectPackages' },
                success: ((resp)=>{
                    resp.forEach((package)=>{
                        html +=  `<option data-wpc_id = "${package.wpc_id}" data-package_uuid = "${package.package_uuid_bumi}" value="${package.pid}">${package.pname}</option>`
                    })
                    $('#packageSelection1').html(html)
                    $('#packageSelection2').html(html)
                    loading.fadeOut();
                })
            })

        }else if(value == 'RRU'){
            loadRiskTable();
            if(title == 'Process Project'){
                $('.modal-container.processProj .page.active').removeClass("active")
                $('.modal-container.processProj .riskAnalysisUpload').addClass("active")
            }else{
                $('.modal-container.process .page.active').removeClass("active")
                $('.modal-container.process .riskAnalysisUpload').addClass("active")
            }
            if(SYSTEM == 'OBYU'){
                $("input[name='forOverall']").prop( "checked", false );
            }
        }else{
            $('.projectProcessCreate').css('display', 'none')
            $('.projectProcessCreateLand').css('display', 'none')
            $('.projectProcessMap').css('display', 'none')
            $('.RILandContainer').removeClass('active')
            $('.lotId').css('display', 'none')
            $('.structChain').css('display', 'none')
            $('.nextPage').css('display', 'unset')
            flagProcess = value;
            
            jogetConOpDraw.flag = true;
            jogetConOpDraw.noCoordinate = true;
            jogetProcessApp = value;
            changePointColour = "colour" +jogetProcessApp;
        }

        if(title == 'New Construction Process' || title == 'Bulk Register Process'){
            $(".backPage").css('display', 'none')
        }
    }
    else{
        jogetConOpDraw.flag = false;
        jogetConOpDraw.noCoordinate = false;
        jogetProcessApp = value;
        changePointColour = "colour" +jogetProcessApp;
        $(".projectProcessCreate").css('display', 'block')
        $('.projectProcessMap').css('display', 'none')
        if(title == 'bulk' || title == 'asset' || title == 'Process Project'){
            $(".backPage").css('display', 'unset')
        }else if(title == 'New Construction Process' || title == 'Bulk Register Process'){
            $(".backPage").css('display', 'none')
        }
    }
}

//clear search input filter
searchFilterClear = () =>{
    $('.searchInput').val('')
    $('.searchInput').keydown();
    $('.searchInput').keypress();
    $('.searchInput').keyup();
    $('.searchInput').blur();
}

//wizard cancel page
wizardCancelPage = (e) =>{
    //Reset the value of which user table (active or archived) is showing now
    let modalContainer = $(e).parent().parent()
    let title = $(".modal-header a").text()
    let currentPage = $(modalContainer).children(".active")
    let pageNumber = $(currentPage).data("page")
    tableType = '';
    flagReviewTool = false

    if((title == 'Process Project' && pageNumber == 3) || (title == 'New Construction Process' && pageNumber == 2)){
        $.confirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please confirm your action',
            buttons: {
                OK: function(){
                    $("#wizard").fadeOut(100);
                    $(`.modal-container`).css('display', 'none');
                    $(`.modal-container`).children().removeClass("active");
                    $(`.modal-container.insight .page`).removeClass("active");
                    $(`.modal .modal-content`).removeClass("active");
                    $(`#wizardMaximize`).removeClass("active");
                    $(`#wizardMaximize`).children().attr("src", "../Images/icons/form/maximize.png");
                    $(".processSearch").val("");
                    $(".manageSearch").val("");
                    $('.processProjSearch').show();

                    defaultStateWizard(title)
                    resetJogetConOpDraw()
                    resetReviewList()
                    resetAddUserForm()
                    resetprojectinputvalue()
                    searchFilterClear()
                    OnClickModelFormCancel()
                    myTaskReloadPage(title)

                    flagEdit = false

                    if (planePrimitive) {
                        viewer.scene.primitives.remove(planePrimitive);
                    }
                },
                Cancel: function(){
                    return;
                }
            }
        });
    }else{
        $("#wizard").fadeOut(100);
        $(`.modal-container`).css('display', 'none');
        $(`.modal-container`).children().removeClass("active");
        $(`.modal-container.insight .page`).removeClass("active");
        $(`.modal .modal-content`).removeClass("active");
        $(`#wizardMaximize`).removeClass("active");
        $(`#wizardMaximize`).children().attr("src", "../Images/icons/form/maximize.png");
        $("#folderRoot").css('display', 'none');
        $("#videoframe").removeClass("active");
        $("#videoframe").css('display', 'none');
        $(".modal-container.insight .pwCredentials").css('display', 'none');
        $(".modal-container.insight .metadataEdit").css('display', 'none');
        
        var videoContainer = document.getElementById("videoContainer");
        var myVideo = $(videoContainer).find("video")[0];
        if (myVideo !== undefined) {
            myVideo.pause()
        } else if ($(videoContainer).has("iframe")) {
            $(videoContainer).html("")
        }
    
        defaultStateWizard(title)
        resetJogetConOpDraw()
        resetReviewList()
        resetAddUserForm()
        resetprojectinputvalue()
        searchFilterClear()
        OnClickModelFormCancel()
        myTaskReloadPage(title)
        
        flagEdit = false
        click_project_details = {}
    
        selector.show = false;
        selector2.show = false;
    
        if (planePrimitive) {
            viewer.scene.primitives.remove(planePrimitive);
        } 

        $(".processSearch").val(""); 
        $(".projectSearchInput").val(""); 
        $(".manageSearch").val("");
        $('.processProjSearch').show();
    
    
        let id = $("#newsFeedModal").find(".likeBtn").data("nfid")
        let cardToAppend = $(`.newsCard#newsCard${id}`)
        let iColor = $(`.newsCard#newsCard${id}`).find(".timestamp").css('color')
        let likeBtn = $("#newsFeedModal").find(".likeBtn")
    
        $($(cardToAppend).find(".footer .likeBtn")).remove()
        $(likeBtn).clone().appendTo($(cardToAppend).find(".footer"))
        $(`.newsCard#newsCard${id}`).find('button:not(.liked) i').css('color', `${iColor}`)
        $(`.newsCard#newsCard${id}`).find('button:not(.liked) span').css('color', `${iColor}`)

        // for sslr2 bim linking
        var bimLayer_id = $('#wizardClose').attr('data-layer-id');
        if(bimLayer_id){
            var bimLayer_name = $('#wizardClose').attr('data-layer-name');
            checkBimLayerLinking(bimLayer_id, bimLayer_name);
            $('#wizardClose').removeAttr('data-layer-id');
        }
    }
}

//
wizardCancelPageGantt = () =>{
    $("#scheduleOwner").text("")
    $("#scheduleUploadedDate").text("")
    $('#scheduleRevision').text("")
    $("#scheduleName").text("")
    $("#revisionList").html("")
    $("#scheduleListing li.active").removeClass("active")
    $("#ganttList").fadeOut(100);
    $('#gdiv').html('')
}

//project label name position in wizard popup
projectLabelName = (title) =>{
    var labelWidth;
    var labelWidthEle;

    if(title == "pavementAnalysis"){
        labelWidthEle = $(`.modal-container.insight .${title}.page.active`).find(".labelWidth");
    }else{
        labelWidthEle = $(`.modal-container.${title} .page.active`).find(".labelWidth");
    }

    labelWidth = labelWidthEle.width();
    labelWidth = labelWidth + 24;
    labelWidthEle.next().css("margin-right", labelWidth+"px");
}

//checking joget login
function checkingJogetLogin(){
    var jogetHost = JOGETHOST+'jw';
    var currUsername = localStorage.userLoginName ? localStorage.userLoginName : '';
    var enc_pwd = localStorage.encPassword ? localStorage.encPassword : '';

    var temp_dec_pwd = atob(enc_pwd);
    var rev_pwd = temp_dec_pwd.split('').reverse().join('');
    var currUserPwd = atob(rev_pwd);

    var callback = {
        success : function(response){
            if((response.username != "roleAnonymous") && (response.username == currUsername)){
                console.log("joget already logged in")
            }else{
                var loginCallbackAsset = {
                    success : function(response){
                        async function logoutLogin(){
                            AssignmentManager.loginWithHash(jogetHost, currUsername, currUserPwd, loginCallback);
                        }
                        logoutLogin();
                    }
                }

                var loginCallback = {
                    success : function(response){
                        if(response.username == currUsername){
                            console.log("joget already logged in")
                        }else{
                        }
                    }
                };

                if(SYSTEM && SYSTEM == 'KKR'){
                    // skip joget asset login
                    if(IS_DOWNSTREAM){
                        async function logoutLogin(){
                            AssignmentManager.loginWithHash(jogetHost, currUsername, currUserPwd, loginCallback);
                        }
                        logoutLogin();
                    }else{
                        var jogetAssetHost = JOGETASSETHOST+'jw';
                        async function logoutLoginAsset(){
                            AssignmentManager.loginWithHash(jogetAssetHost, currUsername, currUserPwd, loginCallbackAsset);
                        }
                        logoutLoginAsset()
                    }
                    
                }else{
                    async function logoutLogin(){
                        AssignmentManager.loginWithHash(jogetHost, currUsername, currUserPwd, loginCallback);
                    }
                    logoutLogin();
                }	
            }
        }
    };

    AssignmentManager.getCurrentUsername(jogetHost, callback)
}

//Open wizard
//Calls when wizardOpenPage(e) open page
openWizardModalContainer =(title, modalInsight, modalWidth, modalHeight) =>{
    $("#wizard").fadeIn(100)
    $(`.modal-container.${title}`).css("display", "block")
    $(`.modal-content`).css("width", modalWidth+"vw").css("height", modalHeight+"vh")

    if(modalInsight == 'undefined'){
    }else{
        $(`.modal-container.${title} .${modalInsight}`).addClass("active")
    }
    var pageCurrent = $('.appButtonContainer .mainAppButton.active').attr("rel");

    if(title == "manage" || title == "manageProj"){
        $('.handleManageProcess .RIwindowViewer').removeClass("inside")
        $('.handleManageProcess .bottom').removeClass("inside")

        if(pageCurrent == "myInsights"){
            $(`.modal-container.${title}`).find('.handleManageProcess .RIwindowViewer').addClass("inside")
            $(`.modal-container.${title}`).find('.handleManageProcess .bottom').addClass("inside")
        }else{
            $(`.modal-container.${title}`).find('.handleManageProcess .RIwindowViewer').removeClass("inside")
            $(`.modal-container.${title}`).find('.handleManageProcess .bottom').removeClass("inside")
        }
    }
    else if(title == 'myTaskList'){
        dataTask('all');
    }
}

wizardOpenPage = (e) =>{
    let title = $(e).attr("rel")
    let modalWidth = $(e).data('width')
    let modalHeight = $(e).data('height')
    let modalContainer = $(`.modal-container.${title}`)
    let pageLength = $(modalContainer).children(".page").length
    let openPage1 = modalContainer.find("[data-page=1]")
    tableType = $(e).data('activearchived')
    let pageNumber = 1
    var modalInsight
    mode = 'process';

    if(title == "processProj" || title == "manageProj" || title == "bulkProj" || title == "bulkProjAsset" || title == "assetProj" || title == "manageAssetProj"){
        if(title == "processProj"){
            $(".modal-header a").html("Process Project")
        }else if(title == "manageProj"){
            $(".modal-header a").html("Manage Project")
        }else if(title == "bulkProj"){
            $(".modal-header a").html("Bulk Register")
            $('.projectProcessSelect.bulkProcess').hide()
            $('.projectProcessSelect.bulkProcessSelect').show()
        }else if(title == "bulkProjAsset"){
            $(".modal-header a").html("Bulk Export")

            if($(e).attr('id') == 'createBulkAsset'){
                bulkTypeOnchangeBulkType($('#typebulk'), 'bulkExport')
                $('.bulkProcessSelect').hide()
                $('.projectProcessSelect.bulkProcess').show()
            }else{
                $('.bulkProcessSelect').show()
                $('.projectProcessSelect.bulkProcess').hide()
            }
        }else if(title == "assetProj"){
            $(".modal-header a").html("Asset Project")
        }else if(title == "manageAssetProj"){
            $(".modal-header a").html("Manage Asset Project")
        }

        projectClick = (e) =>{
            mode = 'process'
            let projectPackage = $(e).find(".text").html();
            $(".processSearch").val("");
            $(".manageSearch").val("");
            $('.processProjSearch').show();
            $('.projectPackageName').html(projectPackage);
            $(`.modal-container.${title}`).find("[data-page=1]").removeClass("active");
            $(`.modal-container.${title}`).find("[data-page=2]").addClass("active");

            checkingJogetLogin()
            defaultStateWizard(title);
            openProcessOutside(e);
            projectLabelName(title);

            wizardButtonVisibility(2, mode, pageLength)
        }

        $(`.modal-container.${title}`).find("[data-page=1]").addClass("active")
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)


    }else if(title == "process" || title == "manage" || title == "bulk" || title == "asset" || title == "manageAsset"){
        mode = 'process'

        if(title == "process"){
            $(".modal-header a").html("New Construction Process")
        }else if(title == "manage"){
            $(".modal-header a").html("Manage Construction Process")
        }else if(title == "bulk"){
            $(".modal-header a").html("Bulk Register Process")
        }else if(title == "manageAsset"){
            $(".modal-header a").html("Manage Asset Process")
        }else if(title == "asset"){
            $(".modal-header a").html("New Asset Process")
        }
        $(`.modal-container.${title}`).find("[data-page=1]").addClass("active")
        $('.projectProcess #valueManageConstruct').val("default")
        wizardButtonVisibility(pageNumber, mode)
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
        projectLabelName(title)

    }else if(title == "profile"){
        $(".modal-header a").html(title)

        mode='edit'
        getProfileDetail()
        readonlyuserstate()
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

    }else if(title == "projectView"){
        var titleSpace = title.replace(/([A-Z])/g, ' $1').trim()
        $(".modal-header a").html(titleSpace)

        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

    }else if(title == "myTask"){
        let idProcess = $(e).attr("id");
        let appProcess = $(e).attr("data-appTask");
        let setProcess = $(e).attr("data-appSetTask");
        let extraParam = $(e).attr("data-extraParam");
        let projOwner = $(e).attr("data-projectowner");

        if($(e).parent().hasClass("myTask")){
            $(".modal-header a").html(title)
        }else if($(e).parent().hasClass("taskConstruct")){
            $(".modal-header a").html("Construction")
        }else if($(e).parent().hasClass("taskDocument")){
            $(".modal-header a").html("Document")
        }else if($(e).parent().hasClass("taskFinance")){
            $(".modal-header a").html("Finance")
        }else if($(e).parent().hasClass("taskAsset")){
            $(".modal-header a").html("Asset")
        }

        $(".modal-container.myTaskList").hide()

        $(".modal-header a").html("My Task")
        openPage1.addClass("active")
        openJogetForm('myTask', idProcess, appProcess, setProcess, extraParam, projOwner)
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

    }else if(title == "myTaskList"){
        var wizardTitle = $(e).data('title')

        $(".modal-header a").html(wizardTitle)

        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
    }else if(title == "insight"){
        let modalInsight = $(e).data("page")
        let formTitle = $(e).attr("title")
        $(".modal-header a").html(formTitle)
        $("#valueProceessConstruct option").show();

        if(modalInsight == "reviewPage"){
            let widthRI = $("#RIContainer").width()
            let heightRI = $("#RIContainer").height()

            $(".blinkDiv").fadeIn(200, function(){
                $(".blinkDiv").fadeOut(200, function(){
                })
            })
            setTimeout(function(){
                $("#wizard").fadeIn(100)
                $(`.modal-container.${title}`).css("display", "block")
                $(`.modal-container.${title} .${modalInsight}`).css("display", "block")
                $(`.modal-content`).css("width", widthRI).css("height", heightRI)
                setReviewTool(cesiumObj)
            }, 400)

            flagReviewTool = true;

        }else if(modalInsight == "openJogetForm"){
            let jogetToOpen = $(e).attr("id")
            $(`.modal-container.${title} .reviewPage`).css("display", "none")
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

            if (jogetToOpen == "reviewToolList"){
                openReviewToolList();
            }else if (jogetToOpen == "reviewcanvas"){
                submitReviewCanvas();
            }

        }else if(modalInsight == "viPage"){
            let valID = $(e).attr("value")

            playVideoPin(valID)
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

        }else if(modalInsight == "aicPage") {
            if (flagAICCompare) {
                let projectName = localStorage.parent_project_name;
                let packageName = localStorage.p_name;

                $("#aicProjectName").text(projectName)
                $("#aicPackageName").text(packageName)
                
                // Get the two checked AIC checkboxes dynamically
                const selectedAICIds = $("[id^='dataChk_ecw_']:checked").map(function() {
                    return this.id.split("_").pop(); // extract numeric part
                }).get();
                
                // Fetch the capture dates for both IDs
                if (selectedAICIds.length === 2) {

                    // Open modal first
                    openWizardModalContainer(title, modalInsight, modalWidth, modalHeight);

                    $.when(
                        fetchAICDetailsPromise(selectedAICIds[0]),
                        fetchAICDetailsPromise(selectedAICIds[1])
                    ).done(function(data1, data2) {
                        const res1 = data1[0];
                        const res2 = data2[0];
                        console.log(res1);
                        console.log(res2);

                        const record1 = Array.isArray(res1.data) ? res1.data[0] : res1.data;
                        const record2 = Array.isArray(res2.data) ? res2.data[0] : res2.data;
                        
                        const projectImageCaptureDate = new Date((record1 && record1.Image_Captured_Date ? record1.Image_Captured_Date : null)).toDateString();
                        $("#projectImageCaptureDate").text(projectImageCaptureDate || "Not found");
                        const packageImageCaptureDate = new Date((record2 && record2.Image_Captured_Date ? record2.Image_Captured_Date : null)).toDateString();
                        $("#packageImageCaptureDate").text(packageImageCaptureDate || "Not found");
                    });

                    // Delay for initializing the modal content
                    setTimeout(function() {
                        initiateAIC();
                        AICViewer();
                    }, 500);

                }

            }else{
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please select only two(2) data to compare',
                });

            }
        }else if(modalInsight == "aicEditPage") {
            let group = $(e).data("aicedit")
            flagEditAerial = true;
            $('#aicEditList').html('')
            var listHTML = ''
            
            arrAerialEdit.forEach(ecwEdit =>{
                if(ecwEdit.groupType == group) {
                    listHTML += `
                    <div class="row rowEcw wizard" rel="Kuching_Div" onclick="OnClickAerialEdit(this)">
                        <div class="columnIndex"><img style="width: 28px;" class="fileicon" src="../Images/icons/layer_window/ecw.png" title="ECW"></div>
                        <div class="columnFirst textContainer wizard"><span class="text">${new Date(ecwEdit.capturedDate).toDateString()}</span></div>
                        <div class="columnSecond textContainer wizard"><span class="fontSmall">`+ecwEdit.fileName+`</span></div>
                        <div class="columnThird textContainer wizard"><span class="fontSmall">`+ecwEdit.uploadDate+`</span></div>
                        <div class="columnThird textContainer wizard" style="display: none;"><span class="fontSmall id">`+ecwEdit.id+`</span></div>
                        <div class="columnThird textContainer wizard" style="display: none;"><span class="fontSmall name">`+ecwEdit.name+`</span></div>
                    </div>
                    `
                }
            })
            listHTML +=`<div id="aerialEditContainer"></div>`
            $('#aicEditList').html(listHTML)
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            
        }else if(modalInsight == "pinPointForm") {
            if (flagDraw) {
                openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)

            }else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please select only two(2) data to compare',
                });
            }

        }else if(modalInsight == "process" || modalInsight == "manage" || modalInsight == "asset" || modalInsight == "bulk"  || modalInsight == "bulkAsset" || modalInsight == "manageAsset"){
            var projOwner = localStorage.project_owner;
            flagLinkLand = false;
            mode = 'process';

            $("#wizard").fadeIn(100)
            $(`.modal-container.${modalInsight}`).css("display", "block")
            $(`.modal-container.${modalInsight}`).find('[data-page=1]').addClass("active")
            $(`.modal-content`).css("width", modalWidth+"vw").css("height", modalHeight+"vh")
            $(`.modal-container.${modalInsight}`).find('.handleManageProcess .RIwindowViewer').addClass("inside")
            $(`.modal-container.${modalInsight}`).find('.handleManageProcess .bottom').addClass("inside")

            if(projOwner == "SSLR2"){
                $('#progressUploadtemplateFile').find('a').attr('href', '../Templates/Progress_Summary_-_Template_sslr.xlsx');
            }else{
                $('#progressUploadtemplateFile').find('a').attr('href', '../Templates/Progress_Summary_-_Template.xlsx');
            }

            //change PSU table header
            $('#dashboarditemInside .tableHeader .M').each(function(i, e){
                checkPSUTableLabel(projOwner, i, e);
            });

            wizardButtonVisibility(pageNumber, mode)
            projectLabelName(modalInsight)
        }else if(modalInsight == "summaryPage"){
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            setProgressSummaryFunct()
        }else if(modalInsight == "setupPage"){
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            projectLabelName(title)
        }else if(modalInsight == "statisticPage"){
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            projectLabelName(title)
        }else if(modalInsight == "pavementAnalysis"){
            $('#pavementUploadTable').attr('src', '')
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            projectLabelName(modalInsight);
        }else if(modalInsight == "linkLotParcel"){
            mode = 'process'
            $("#wizard").fadeIn(100)
            $(`.modal-container.process`).css("display", "block")
            $(`.modal-container.process`).find('[data-page=1]').addClass("active")
            $(`.modal-content`).css("width", modalWidth+"vw").css("height", modalHeight+"vh")

            $("#valueProceessConstruct option").hide();
            $("#valueProceessConstruct option[value='default']").show();
            $("#valueProceessConstruct option[value='LR']").show();
            $("#valueProceessConstruct option[value='LI']").show();
            $("#valueProceessConstruct option[value='LE']").show();

            wizardButtonVisibility(pageNumber, mode)
            projectLabelName("process")

            flagLinkLand = true;
        }else if(modalInsight == "setupList"){
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            projectLabelName(title)
        }else if(modalInsight == "metadataEdit"){
            $(".modal-container.insight .metadataEdit").css('display', 'block')
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
        }else if(modalInsight == "iotGraph"){
            var iotAsset = $(e).data('id');
            var iotAssetType = $(e).data('type');
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            getAssetIoTData(iotAsset , iotAssetType);
        }else if(modalInsight == "iotTableList"){
            var iotAsset = $(e).data('id');
            var iotAssetType = $(e).data('type');
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            getIotNotiHistory(iotAsset, iotAssetType)
        }else if(modalInsight == "fmSetupList"){
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            projectLabelName(title)
        }else if(modalInsight == "fmNewAssetTable"){
            openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
            projectLabelName(title)
        }
    }else if(title == "newsFeed"){
        let id =$(e).data("id");
        let cardtitle = $(e).find(".title").html()
        let banner = $(e).find(".image").html()
        let desc = $(e).find(".desc").html()
        let likeBtn = $(e).find(".likeBtn")
        let time = $(e).find(".timeStamp")

        $("#newsFeedModal").find(".image").html(banner)
        $("#newsFeedModal").find(".title").html(cardtitle)
        $("#newsFeedModal").find("#desc").html(desc)
        $($("#newsFeedModal").find(".footer .timeStamp")).remove()
        $(time).clone().prependTo($("#newsFeedModal").find(".footer"))
        $($("#newsFeedModal").find(".footer .likeBtn")).remove()
        $(likeBtn).clone().appendTo($("#newsFeedModal").find(".footer"))
        
        $("#newsFeedModal").find(".footer div").css('color', '#6e6e6e')
        $("#newsFeedModal").find(".footer i").css('color', '#6e6e6e')
        $("#newsFeedModal").find(".footer span").css('color', '#6e6e6e')

        $("#newsFeedModal").fadeIn()

        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
    }else if(title == "addNewUser"){
        var wizardTitle = $(e).data('title')
        mode = 'new'
        $(".modal-header a").html(wizardTitle)
        modalContainer.find(`.page.active`).removeClass("active")
        modalContainer.find(`[data-page=${pageNumber}]`).addClass("active")
        userFormNewState(modalContainer)
        resetAddUserForm()
        wizardButtonVisibility(pageNumber, mode)
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
    }else if(title == "editUser"){
        //load user detail ajax
        if(tableType == 'archived'){
            $(`.modal-container.addNewUser > .modal-footer > .archivePage`).html('Delete')
        }else{
            $(`.modal-container.addNewUser > .modal-footer > .archivePage`).html('Archive')
        }
        userDetail(e)
        title = 'addNewUser';
        mode = 'view';
        pageNumber = 2;
        pageLength = 2;
        $(".modal-header a").html($(e).data('title'))
        modalContainer=$(`.modal-container.addNewUser`)
        modalContainer.find(`[data-page=${pageNumber}]`).addClass("active")
        userFormEditState(modalContainer)
        wizardButtonVisibility(pageNumber, mode)
        wizardButtonVisibility()
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
    }else if(title == "addNewProject"){
        flagEdit = false
        mode = 'new'
        var wizardTitle = $(e).data('title')
        $(".modal-header a").html(wizardTitle)

        modalContainer.find(`.addNewProject.upper-container`).css("display", "")
        modalContainer.find(`[data-page=${pageNumber}]`).addClass("active")

        $("#newProjectDetails").css("height", "");
        $("#projectCreationContainer").hide();
        $("#packagespecificCheck").prop("checked", false)
        $("#overallprojectCheck").prop("checked", true)

        $(".inputContent.package").hide()

        overallprojectState()
        wizardPageIndicator(pageNumber, title, pageLength)
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
        getListofPackages()
    }else if(title == "editProject"){
        if(tableType == 'archived'){
            $(`.modal-container.addNewProject > .modal-footer > .archivePage`).html('Delete')
        }else{
            $(`.modal-container.addNewProject > .modal-footer > .archivePage`).html('Archive')
        }
        mode = 'view';
        flagEdit = true
        title = 'addNewProject';
        modalContainer = $(`.modal-container.addNewProject`)
        pageNumber = $(modalContainer).children(".page").length;
        pageLength = pageNumber;
        
        $(".modal-header a").html($(e).data('title'))
        modalContainer.find(`.addNewProject.upper-container`).css("display", "")
        modalContainer.find(`[data-page=${pageNumber}]`).addClass("active")
        
        $(`.modal-container .upper-container.addNewProject`).hide()
        $(`.page.addNewProject[data-page='${pageLength}']`).addClass('readOnly')
        $("#newProjectDetails").css("height", "calc(100% - 50px)");
        $("#projectCreationContainer").css("display", "flex");

        getListofPackages()

        //create user list table
        if(SYSTEM == 'KKR'){
            var projectType =  $(e).attr("data-projecttype")
            var projectId =  $(e).attr("data-projectid")
            var projectOwner =  $(e).attr("data-projectowner")
            var parentId =  $(e).attr("data-parentid")
            var int = '';

            if(parentId){
                projectId = parentId
                int = 'int';
            }else{
                projectId = '';
            }
            refreshUserListProjectCreation(projectId, int, projectType, projectOwner);
        }else{
            var projectOwner = $(e).attr("data-projectowner")
            var parentId = $(e).attr("data-parentid")
            var projOwnerArr = [projectOwner, parentId];
            refreshUserListBasedOnOrg('', '', projOwnerArr, 'edit')
        }
        projectDetail(e)
        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
    }else if(title == "userProfile"){
        var wizardTitle = $(e).data('title')

        $(".modal-header a").html(wizardTitle)

        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
    }else if(title == "projectProfile"){
        var wizardTitle = $(e).data('title')

        $(".modal-header a").html(wizardTitle)

        openWizardModalContainer(title, modalInsight, modalWidth, modalHeight)
    }

    wizardButtonVisibility(pageNumber, mode, pageLength)
}

//wizard open next page
wizardNextPage = (e) =>{
    let modalContainer = $(e).parent().parent()
    let modal =  $(e).parent().parent().attr('rel')
    let currentPage = $(modalContainer).children(".active")
    let pageLength = $(modalContainer).children(".page").length
    let pageNumber = $(currentPage).data("page")
    let nextPage = pageNumber + 1
    let pageToOpen = $(".modal-container").find(`[data-page='${nextPage}']`)
    var assetChoosen = $(`.modal-container.${modal}`).find(".assetChoosen").val()

    // check which wizard
    if (modal == 'processProj' || modal == 'process' || modal == 'manage' || modal == 'manageProj'){
        mode = 'process'
        flagProcessOutside = (modal == 'processProj' || modal == 'manageProj') ? true : false;

        if($('.projectProcess').hasClass('active')){
            if(jogetConOpDraw.flag){
                if(jogetConOpDraw.noCoordinate){
                    InitiateCoordless();
                    if(flagProcess == 'PSU'){
                        pageToOpen = $(".modal-container").find(`[data-page='PSU']`)
                        wizardButtonVisibility(nextPage, mode, pageLength);
                        $('.modal-footer .backPage').hide()
                        loadProgressSummary();
                    }else if(flagProcess == 'RRU'){
                        pageToOpen = $(".modal-container").find(`[data-page='RRU']`)
                        wizardButtonVisibility(nextPage, mode, pageLength);
                        $('.modal-footer .backPage').hide()
                    }else{
                        wizardButtonVisibility(nextPage, mode, pageLength);
                    }
                }
                else{
                    if(jogetConOpDraw.shape == "Coordless"){
                        InitiateCoordless();
                        wizardButtonVisibility(nextPage, mode, pageLength);
                    }
                    else{
                        if(!(jogetConOpDraw.coordsArray.length > 0)){
                            $(".nextPage").css('display', 'unset')
                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: 'Message',
                                content: 'Please select the location',
                            });
                            return;
                        }
                        else if (jogetConOpDraw.shape === "Polygon" && jogetConOpDraw.coordsArray.length <= 4) {
                            $(".nextPage").css('display', 'unset')
                            $.alert({
                                boxWidth: "30%",
                                useBootstrap: false,
                                title: "Message",
                                content: "Please draw at least 3 points to form a polygon",
                            });
                            return
                        }
                        else{
                            InitiateCoordinate();
                            wizardButtonVisibility(nextPage, mode, pageLength);
                        }
                    }
                }
                
            }else if(!jogetConOpDraw.flag){
                $(".nextPage").css('display', 'unset')
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please select the location',
                });
                return;
            }else{
                wizardButtonVisibility(nextPage, mode, pageLength);
            }
        }else{
            wizardButtonVisibility(nextPage, mode)
        }

        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }else if(modal == "addNewUser"){
        copyinputvalue()
        wizardNextPageUserChecking(e)
    }else if(modal == "addNewProject"){
        wizardNextPageProjectChecking(e)
    }else if(modal == "asset" || modal == "assetProj"){
        mode = 'process'
        wizardButtonVisibility(nextPage, mode, pageLength)
        openAssetForm(assetChoosen);

        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }else if(modal == "bulkProj" || modal == "bulk"){
        var id = $(`#processName${modal} option:selected`).val();
        mode = 'process'

        bulkExportJogetLink('bulkExport');
        bulkExportList(id)
        wizardButtonVisibility(nextPage, mode, pageLength)

        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }else if(modal == "bulkAsset" || modal == "bulkProjAsset"){
        var id;
        var bulkChoosen = $(`.modal-container.${modal}`).find(".bulkChoosen").val()
        mode = 'process'

        if(modal == "bulkAsset"){
            if(bulkChoosen == 'rfi' || bulkChoosen == 'ncp'){
                id = $('#assetProcesssBulk1 option:selected').val();
            }else{
                id = $('#assetProcesssBulk2 option:selected').val();
            }
        }else{
            if(bulkChoosen == 'rfi' || bulkChoosen == 'ncp'){
                id = $('#assetProcesssBulkProj option:selected').val();
            }else{
                id = $('#assetProcesssBulkProj1 option:selected').val();
            }
        }

        bulkExportAssetList(id, modal)
        wizardButtonVisibility(nextPage, mode, pageLength)

        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }
}

//wizard open previous page
wizardPrevPage = (e) =>{
    let modalContainer = $(e).parent().parent()
    let title = $(e).parent().parent().parent().find(".modal-header a").text()
    let currentPage = $(modalContainer).children(".active")
    let pageLength = $(modalContainer).children(".page").length
    let pageNumber = $(currentPage).data("page")
    let prevPage = pageNumber - 1
    let pageToOpen = $(".modal-container").find(`[data-page='${prevPage}']`)
    let modal =  $(e).parent().parent().attr('rel')
    var arrProcessSpecial = ["Process Project", "Manage Project", "New Construction Process" , "Manage Construction Process", "New Asset Process", "Asset Project"]
    var arrProcessBulk = ["Bulk Register", "Bulk Export", "Bulk Register Process", "Bulk Export Process"]
    var arrProcessAll = arrProcessSpecial.concat(arrProcessBulk)

    if (modal == 'addNewProject'){
        //for process wizard in system admin. skip project app assignment
        if($('#packagespecificCheck').is(':checked') && pageNumber == 3){
            pageToOpen = $(".modal-container.addNewProject").find(`[data-page='${1}']`)

            defaultStateWizard(title)
            wizardBackPageProjectChecking(e)
        }else{
            defaultStateWizard(title)
            wizardBackPageProjectChecking(e)
        }
    }else if(arrProcessBulk.includes(title)){
        mode = 'new'

        if(modal == 'bulkAsset' || modal == 'bulk'){
            wizardButtonVisibility(prevPage, mode, pageLength)
        }else{
            if(prevPage == 1){
                wizardButtonVisibility(prevPage, mode, pageLength)
                defaultStateWizard(title)
            }else{
                wizardButtonVisibility(prevPage, mode, pageLength)
            }
        }
        
        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }else if(arrProcessSpecial.includes(title)){
        mode = 'process'

        //check if create new project will generate confirm message
        if((title == 'Process Project' && pageNumber == 3) || (title == 'New Construction Process' && pageNumber == 2)){
            $.confirm({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please confirm your action',
                buttons: {
                    OK: function(){
                        defaultStateWizard(title)
                        wizardButtonVisibility(prevPage, mode, pageLength)
                        
                        $(currentPage).removeClass('active')
                        $(pageToOpen).addClass('active')
                    },
                    Cancel: function(){
                        return;
                    }
                }
            });
        }else{
            defaultStateWizard(title)
            wizardButtonVisibility(prevPage, mode, pageLength)
            
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        }
    }else{
        defaultStateWizard(title)
        wizardButtonVisibility(prevPage, mode, pageLength)
        wizardPageIndicator(prevPage, modal, pageLength)
        
        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }
}

//wizard edit button click
wizardEditPage=(e)=>{
    let modalContainer = $(e).parent().parent()
    let modal =  $(e).parent().parent().attr('rel')
    mode = 'edit';
    let currentPage = $(modalContainer).children(".active")
    let pageLength = $(modalContainer).children(".page").length
    let nextPage = 1
    let pageToOpen = $(".modal-container").find(`[data-page='${nextPage}']`)

    if (modal == 'addNewUser'){
        wizardButtonVisibility(nextPage, mode, pageLength)

    }else if (modal == 'addNewProject'){
        $(`.modal-container .upper-container.addNewProject`).show()
        $('#newProjectDetails').css("height", "")
        $("#projectPhase").prop("disabled", true)

        wizardButtonVisibility(nextPage, mode, pageLength)
        wizardPageIndicator(nextPage, modal, pageLength)
    }

    $(currentPage).removeClass('active')
    $(pageToOpen).addClass('active')
}

//wizard button visibility
wizardButtonVisibility = (pageNumber, mode, pageLength) =>{
    if (mode == 'new' || mode == 'edit'){
        if(pageNumber == pageLength){
            $(".backPage").css('display', 'unset')
            $(".nextPage").css('display', 'none')
            $(".savePage").css('display', 'unset')
            $(".editPage").css('display', 'none')
            $(".restorePage").css('display', 'none')
            $(".archivePage").css('display', 'none')
            $(".cancelPage").css('display', 'unset')
        }else if(pageNumber > 1 && pageNumber < pageLength){
            $(".backPage").css('display', 'unset')
            $(".nextPage").css('display', 'unset')
            $(".savePage").css('display', 'none')
            $(".editPage").css('display', 'none')
            $(".restorePage").css('display', 'none')
            $(".archivePage").css('display', 'none')
            $(".cancelPage").css('display', 'unset')
        }else if(pageNumber == 1){
            $(".backPage").css('display', 'none')
            $(".nextPage").css('display', 'unset')
            $(".savePage").css('display', 'none')
            $(".editPage").css('display', 'none')
            $(".restorePage").css('display', 'none')
            $(".archivePage").css('display', 'none')
            $(".cancelPage").css('display', 'unset')
        } 
    }else if(mode == 'view'){
        if(tableType == 'archived'){
            if(pageNumber == pageLength){
                $(".backPage").css('display', 'none')
                $(".nextPage").css('display', 'none')
                $(".savePage").css('display', 'none')
                $(".editPage").css('display', 'none')
                $(".restorePage").css('display', 'unset')
                $(".archivePage").css('display', 'unset')
                $(".cancelPage").css('display', 'unset')
            }else if(pageNumber > 1 && pageNumber < pageLength){
                $(".backPage").css('display', 'unset')
                $(".nextPage").css('display', 'unset')
                $(".savePage").css('display', 'none')
                $(".editPage").css('display', 'none')
                $(".restorePage").css('display', 'none')
                $(".archivePage").css('display', 'none')
                $(".cancelPage").css('display', 'unset')
            }else if(pageNumber == 1){
                $(".backPage").css('display', 'none')
                $(".nextPage").css('display', 'unset')
                $(".savePage").css('display', 'none')
                $(".editPage").css('display', 'none')
                $(".restorePage").css('display', 'none')
                $(".archivePage").css('display', 'none')
                $(".cancelPage").css('display', 'unset')
            } 
        }else{
            if(pageNumber == pageLength){
                $(".backPage").css('display', 'none')
                $(".nextPage").css('display', 'none')
                $(".savePage").css('display', 'none')
                $(".editPage").css('display', 'unset')
                $(".restorePage").css('display', 'none')
                $(".archivePage").css('display', 'unset')
                $(".cancelPage").css('display', 'unset')
            }else if(pageNumber > 1 && pageNumber < pageLength){
                $(".backPage").css('display', 'unset')
                $(".nextPage").css('display', 'unset')
                $(".savePage").css('display', 'none')
                $(".editPage").css('display', 'none')
                $(".archivePage").css('display', 'none')
                $(".restorePage").css('display', 'none')
                $(".cancelPage").css('display', 'unset')
            }else if(pageNumber == 1){
                $(".backPage").css('display', 'none')
                $(".nextPage").css('display', 'unset')
                $(".savePage").css('display', 'none')
                $(".editPage").css('display', 'none')
                $(".restorePage").css('display', 'none')
                $(".archivePage").css('display', 'none')
                $(".cancelPage").css('display', 'unset')
            } 
        } 
    }else if(mode == 'process'){
        if(pageNumber > 1 && pageNumber < pageLength){
            $(".nextPage").css('display', 'none')
            $(".cancelPage").css('display', 'unset')
            $(".backPage").css('display', 'unset')
        }else if(pageNumber == pageLength){
            $(".nextPage").css('display', 'none')
            $(".cancelPage").css('display', 'unset')
            $(".backPage").css('display', 'unset')
        }else if(pageNumber == 1){
            $(".nextPage").css('display', 'none')
            $(".cancelPage").css('display', 'unset')
            $(".backPage").css('display', 'none')
        }
    }
}

//wizard button visibility
wizardPageIndicator = (pageNumber, modal, pageLength) =>{
    for (i = pageLength; i >= pageNumber; i--){
        $(`.upper-container.${modal} [data-pageButton="${i}"]`).removeClass('current').removeClass('complete')
        $(`.upper-container.${modal} [data-pageDivider="${i}"]`).removeClass('current').removeClass('complete')
    }

    $(`.upper-container.${modal} [data-pageButton="${pageNumber}"]`).addClass('current')
    $(`.upper-container.${modal} [data-pageDivider="${pageNumber-1}"]`).addClass('current')

    for (i  = pageNumber-1; i > 0; i--){
        if($('#packagespecificCheck').is(':checked') && i == 2){
            $(`.upper-container.${modal} [data-pageButton="${i}"]`).removeClass('current')
            $(`.upper-container.${modal} [data-pageDivider="${i-1}"]`).removeClass('current')

            for (r = pageLength; r >= 3; r--){
                $(`.upper-container.${modal} [data-pageButton="${r}"]`).find(`i`).removeClass(`fa-${r}`)
                $(`.upper-container.${modal} [data-pageButton="${r}"]`).find(`i`).addClass(`fa-${r-1}`)
            }
        }else{
            $(`.upper-container.${modal} [data-pageButton="${i}"]`).removeClass('current')
            $(`.upper-container.${modal} [data-pageButton="${i}"]`).addClass('complete')
            $(`.upper-container.${modal} [data-pageDivider="${i-1}"]`).removeClass('current')
            $(`.upper-container.${modal} [data-pageDivider="${i-1}"]`).addClass('complete')
        }
    }
}

//wizard button process in system admin
wizardNextPageProjectChecking = (e) =>{
    let modalContainer = $(e).parent().parent()
    let modal =  $(e).parent().parent().attr('rel')
    let currentPage = $(modalContainer).children(".active")
    let pageLength = $(modalContainer).children(".page").length
    let pageNumber = $(currentPage).data("page")
    let nextPage = pageNumber + 1
    let pageToOpen = $(`.modal-container.${modal}`).find(`[data-page='${nextPage}']`)

    if(pageNumber == 1){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        validateProjectDetails(function (response){
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if($('#packagespecificCheck').is(':checked')){
                pageToOpen = $(".modal-container").find(`[data-page='${3}']`)

                wizardButtonVisibility(3, mode, pageLength)
                wizardPageIndicator(3, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }else{
                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        });
    }else if(pageNumber == 5){
        var flagError = checkSelectedUsers(); //check if the users checked have role selections
        if (flagError == true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return;
        }

        if (flagEdit) {
            var userToDelListHtml = sysAdminFlagEditUserChecking();

            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to change role/remove the user(s) listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: function(){
                            wizardButtonVisibility(nextPage, mode, pageLength)
                            wizardPageIndicator(nextPage, modal, pageLength)
                            $(currentPage).removeClass('active')
                            $(pageToOpen).addClass('active')
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        } else {
            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        }
    }else if(pageNumber == 6 && SYSTEM == 'KKR'){
        var flagError = getSelectedProjectUsers(); //get all the users selected
        if (flagError === true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return false
        }

        displaySelectedUsersForGroupRole(userProjectArr); //display all the selected users with the group
        if (flagEdit) { //if editing a project then check for saved group roles
            var userToDelListHtml = sysAdminFlagEditUserChecking();

            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to change role/remove the user(s) listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: function(){
                            wizardButtonVisibility(nextPage, mode, pageLength)
                            wizardPageIndicator(nextPage, modal, pageLength)
                            $(currentPage).removeClass('active')
                            $(pageToOpen).addClass('active')
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                var obj = click_project_details.users;
                $('input:checkbox[class ="addusergrouptable"]').each(function () {
                    var i = 0;
                    while (i < obj.length) {
                        if ($(this).attr("id") == obj[i].user_id) {
                            var values = obj[i].project_group;
                            if (values.length > 0) {
                                $(this).prop("checked", true);
                                var id = "gs" + $(this).attr("id");
                                var element = document.getElementById(id);
                                for (var j = 0; j < element.options.length; j++) {
                                    element.options[j].selected = values.indexOf(element.options[j].value) >= 0;
                                }
                                element.style.display = "block";
                            }
                            break;
                        }
                        i++;
                    }
                });

                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        }else{
            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        }
    }else if(pageNumber == 6 && SYSTEM == 'OBYU'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            var flagError = OnClickAddUsersToProjectNext();
            if (flagError == false) {
                return
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
            copyprojectinputvalue();
        });
    }else if(pageNumber == 7 && SYSTEM == 'KKR'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            var flagError = OnClickAddUsersToProjectNext();
            if (flagError == false) {
                return
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
            copyprojectinputvalue();

            usersheaderhtml = ` <span class="columnMiddle">First Name</span>
                                <span class="columnMiddle">Project Name</span>
                                <span class="columnMiddle">System Role</span>
                                <span class="columnMiddle">Group</span>`;
    
            $('#projectUserListHeader').html(usersheaderhtml);
        });
    }else{
        wizardButtonVisibility(nextPage, mode, pageLength)
        wizardPageIndicator(nextPage, modal, pageLength)
        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }
}

wizardBackPageProjectChecking = (e) =>{
    let modalContainer = $(e).parent().parent()
    let modal =  $(e).parent().parent().attr('rel')
    let currentPage = $(modalContainer).children(".active")
    let pageLength = $(modalContainer).children(".page").length
    let pageNumber = $(currentPage).data("page")
    let nextPage = pageNumber - 1
    let pageToOpen = $(`.modal-container.${modal}`).find(`[data-page='${nextPage}']`)

    if(pageNumber == 1){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        validateProjectDetails(function (response){
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if($('#packagespecificCheck').is(':checked')){
                pageToOpen = $(".modal-container").find(`[data-page='${3}']`)

                wizardButtonVisibility(3, mode, pageLength)
                wizardPageIndicator(3, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }else{
                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        });
    }else if(pageNumber == 5){
        var flagError = checkSelectedUsers(); //check if the users checked have role selections
        if (flagError == true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return;
        }

        if (flagEdit) {
            var userToDelListHtml = sysAdminFlagEditUserChecking();

            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to change role/remove the user(s) listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: function(){
                            wizardButtonVisibility(nextPage, mode, pageLength)
                            wizardPageIndicator(nextPage, modal, pageLength)
                            $(currentPage).removeClass('active')
                            $(pageToOpen).addClass('active')
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        } else {
            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        }
    }else if(pageNumber == 6 && SYSTEM == 'KKR'){
        var flagError = getSelectedProjectUsers(); //get all the users selected
        if (flagError === true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return false
        }

        displaySelectedUsersForGroupRole(userProjectArr); //display all the selected users with the group
        if (flagEdit) { //if editing a project then check for saved group roles
            var userToDelListHtml = sysAdminFlagEditUserChecking();

            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to change role/remove the user(s) listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: function(){
                            wizardButtonVisibility(nextPage, mode, pageLength)
                            wizardPageIndicator(nextPage, modal, pageLength)
                            $(currentPage).removeClass('active')
                            $(pageToOpen).addClass('active')
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                var obj = click_project_details.users;
                $('input:checkbox[class ="addusergrouptable"]').each(function () {
                    var i = 0;
                    while (i < obj.length) {
                        if ($(this).attr("id") == obj[i].user_id) {
                            var values = obj[i].project_group;
                            if (values.length > 0) {
                                $(this).prop("checked", true);
                                var id = "gs" + $(this).attr("id");
                                var element = document.getElementById(id);
                                for (var j = 0; j < element.options.length; j++) {
                                    element.options[j].selected = values.indexOf(element.options[j].value) >= 0;
                                }
                                element.style.display = "block";
                            }
                            break;
                        }
                        i++;
                    }
                });

                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        }else{
            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        }
    }else if(pageNumber == 6 && SYSTEM == 'OBYU'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            var flagError = OnClickAddUsersToProjectNext();
            if (flagError == false) {
                return
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
            copyprojectinputvalue();
        });
    }else if(pageNumber == 7 && SYSTEM == 'KKR'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            var flagError = OnClickAddUsersToProjectNext();
            if (flagError == false) {
                return
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
            copyprojectinputvalue();

            usersheaderhtml = ` <span class="columnMiddle">First Name</span>
                                <span class="columnMiddle">Project Name</span>
                                <span class="columnMiddle">System Role</span>
                                <span class="columnMiddle">Group</span>`;
    
            $('#projectUserListHeader').html(usersheaderhtml);
        });
    }else{
        wizardButtonVisibility(nextPage, mode, pageLength)
        wizardPageIndicator(nextPage, modal, pageLength)
        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }
}

wizardIndicatorProjectChecking = (e) =>{
    let modalContainer = $(e).parent().parent().parent()
    let modal =  $(e).parent().parent().parent().attr('rel')
    let currentPage = $(modalContainer).children(".active")
    let pageLength = $(modalContainer).children(".page").length
    let pageNumber = $(currentPage).data("page")
    let nextPage = $(e).data("nextpage")
    let pageToOpen = $(`.modal-container.${modal}`).find(`[data-page='${nextPage}']`)

    if(pageNumber == 1){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        validateProjectDetails(function (response){
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if($('#packagespecificCheck').is(':checked')){
                pageToOpen = $(".modal-container").find(`[data-page='${nextPage}']`)

                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }else{
                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        });
    }else if(pageNumber == 5){
        var flagError = checkSelectedUsers(); //check if the users checked have role selections
        if (flagError == true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return;
        }

        displaySelectedUsersForGroupRole(userProjectArr); //display all the selected users with the group
        if (flagEdit) {
            var userToDelListHtml = sysAdminFlagEditUserChecking();

            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to change role/remove the user(s) listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: function(){
                            wizardButtonVisibility(nextPage, mode, pageLength)
                            wizardPageIndicator(nextPage, modal, pageLength)
                            $(currentPage).removeClass('active')
                            $(pageToOpen).addClass('active')
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                var obj = click_project_details.users;
                $('input:checkbox[class ="addusergrouptable"]').each(function () {
                    var i = 0;
                    while (i < obj.length) {
                        if ($(this).attr("id") == obj[i].user_id) {
                            var values = obj[i].project_group;
                            if (values.length > 0) {
                                $(this).prop("checked", true);
                                var id = "gs" + $(this).attr("id");
                                var element = document.getElementById(id);
                                for (var j = 0; j < element.options.length; j++) {
                                    element.options[j].selected = values.indexOf(element.options[j].value) >= 0;
                                }
                                element.style.display = "block";
                            }
                            break;
                        }
                        i++;
                    }
                });

                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        } else {
            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        }
    }else if(pageNumber == 6 && SYSTEM == 'KKR'){
        var flagError = getSelectedProjectUsers(); //get all the users selected
        if (flagError === true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return false
        }

        displaySelectedUsersForGroupRole(userProjectArr); //display all the selected users with the group
        if(flagEdit){
            var userToDelListHtml = sysAdminFlagEditUserChecking();

            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to change role/remove the user(s) listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: function(){
                            wizardButtonVisibility(nextPage, mode, pageLength)
                            wizardPageIndicator(nextPage, modal, pageLength)
                            $(currentPage).removeClass('active')
                            $(pageToOpen).addClass('active')
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                displaySelectedUsersForGroupRole(userProjectArr); //display all the selected users with the group
                var obj = click_project_details.users;
                $('input:checkbox[class ="addusergrouptable"]').each(function () {
                    var i = 0;
                    while (i < obj.length) {
                        if ($(this).attr("id") == obj[i].user_id) {
                            var values = obj[i].project_group;
                            if (values.length > 0) {
                                $(this).prop("checked", true);
                                var id = "gs" + $(this).attr("id");
                                var element = document.getElementById(id);
                                for (var j = 0; j < element.options.length; j++) {
                                    element.options[j].selected = values.indexOf(element.options[j].value) >= 0;
                                }
                                element.style.display = "block";
                            }
                            break;
                        }
                        i++;
                    }
                });

                wizardButtonVisibility(nextPage, mode, pageLength)
                wizardPageIndicator(nextPage, modal, pageLength)
                $(currentPage).removeClass('active')
                $(pageToOpen).addClass('active')
            }
        }else{
            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        }
    }else if(pageNumber == 6 && SYSTEM == 'OBYU'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        });
    }else if(pageNumber == 7 && SYSTEM == 'OBYU'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        });
    }else if(pageNumber == 7 && SYSTEM == 'KKR'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            var flagError = OnClickAddUsersToProjectNext();
            if (flagError == false) {
                return
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        });
    }else if(pageNumber == 8 && SYSTEM == 'KKR'){
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            //clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }

            wizardButtonVisibility(nextPage, mode, pageLength)
            wizardPageIndicator(nextPage, modal, pageLength)
            $(currentPage).removeClass('active')
            $(pageToOpen).addClass('active')
        });
    }else{
        wizardButtonVisibility(nextPage, mode, pageLength)
        wizardPageIndicator(nextPage, modal, pageLength)
        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
    }

    copyprojectinputvalue();
    var flagError = OnClickAddUsersToProjectNext();
    if (flagError == false) {
        return
    }

    usersheaderhtml = ` <span class="columnMiddle">First Name</span>
                        <span class="columnMiddle">Project Name</span>
                        <span class="columnMiddle">System Role</span>
                        <span class="columnMiddle">Group</span>`;
    
    $('#projectUserListHeader').html(usersheaderhtml);
}

sysAdminFlagEditUserChecking = () =>{
    // confirm delete box - check all not checked value if user exists in current project
    
    var userToDelListHtml = '';
    var projUser = click_project_details.users;

    var notSel = [];
    $('input:checkbox[class ="addusertable"]:not(:checked)').each(function (idx) {
        notSel.push($(this).attr('id'));
    });

    var notSelContractor = [];
    $('input:checkbox[class ="addcontractusertable"]:not(:checked)').each(function (idx) {
        notSelContractor.push($(this).attr('id'));
    });

    var notSelConsultant = [];
    $('input:checkbox[class ="addconsultantusertable"]:not(:checked)').each(function (idx) {
        notSelConsultant.push($(this).attr('id'));
    });

    projUser.forEach(function (ele, idx) {
        if (notSel.includes(ele.Usr_ID)) {
            if(ele.org_sub_type == "owner" || ele.org_sub_type == "" || ele.org_sub_type == null){
                userToDelListHtml += '<li>';
                userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ') - Owner';
                userToDelListHtml += '</li>';
            }
        }

        if (notSelContractor.includes(ele.Usr_ID)) {
            if(ele.org_sub_type == "contractor" || ele.org_sub_type == "" || ele.org_sub_type == null){
                userToDelListHtml += '<li>';
                userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ') - Contractor';
                userToDelListHtml += '</li>';
            }
        }

        if (notSelConsultant.includes(ele.Usr_ID)) {
            if(ele.org_sub_type == "consultant" || ele.org_sub_type == "" || ele.org_sub_type == null){
                userToDelListHtml += '<li>';
                userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ') - Consultant';
                userToDelListHtml += '</li>';
            }
        }
    })

    return userToDelListHtml;
}

wizardNextPageUserChecking = (e) =>{
    let modalContainer = $(e).parent().parent()
    let modal =  $(e).parent().parent().attr('rel')
    let currentPage = $(modalContainer).children(".active")
    let pageLength = $(modalContainer).children(".page").length
    let pageNumber = $(currentPage).data("page")
    let nextPage = pageNumber + 1
    let pageToOpen = $(`.modal-container.${modal}`).find(`[data-page='${nextPage}']`)

    if(mode == 'new'){
        var x = $("#userEmail").val();
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Not a valid e-mail address!",
            });
            return;
        }

        if($('#userPhoneNumber').val() !== ""){
            var x = $('#userPhoneNumber').val();
            var pattern = /^[0-9]{1,15}$/;
            var result = x.match(pattern);
            if(!result){
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Mobile phone must not contain alphabet, space and other special chars.",
                });
                return;
            }
        }

        if ($("#userFirstName").val() !== "") {
            var x = $("#userFirstName").val();
            var pattern = /[A-Za-z]\S.*/;
            var result = x.match(pattern);
            if (result) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "First Name must be a valid alphabet!",
                });
                return;
            }
        }

        if ($("#userLastName").val() !== "") {
            var x = $("#userLastName").val();
            var pattern = /[A-Za-z]\S.*/;
            var result = x.match(pattern);
            if (result) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Last Name must be a valid alphabet!",
                });
                return;
            }
        }

        if ($("#userNewOrgId").val() !== "") {
            var x = $("#userNewOrgId").val();
            var pattern = /[^A-Za-z0-9_]/g;
            var result = x.match(pattern);
            if (result) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Org Id must not contain space and other special chars except '_'.",
                });
                return;
            }
        }

        if (
            !$("#userEmail").val() ||
            !$("#userFirstName").val() ||
            !$("#userLastName").val() ||
            !$("#userPhoneNumber").val()
        ) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please enter values for email, first name, last name and mobile phone!",
            });
            return;
        }

        if (!$('#userPasswordSysAdmin').val()) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please enter your password!',
            });
            return;
        }

        if ($("#userPasswordSysAdmin").val() !== "") {
            var x = $("#userPasswordSysAdmin").val();
            var pattern = /.{5,}/;
            var result = x.match(pattern);
            if (result) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Password must be at least have 5 character!",
                });
                return;
            }
        }

        if (!$('#userConfirmPasswordSysAdmin').val()) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please confim your password!',
            });
            return;
        }

        if (!($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val())) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Password did not match!',
            });
            return;
        }

        //check for the password length and special characters
        var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        let $passfieldVal = $("#userPasswordSysAdmin").val()
        if ($passfieldVal.match(decimal)) {

        } else {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
            });
            return;
        }

        //check for details of org if checkbox checked
        if ($('#addNewOrg').is(':checked')) {
            if (!$("#addNewOrg").val() || !$("#userNewOrgName").val() || $("#userNewOrgType option:selected").val() == 'default') {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Please enter values for  new Organization!",
                });
                return;
            };
            //check if the orgID is already existing
            let orgID = $('#userNewOrgId').val();
            let idExists = $('#userOrg option').filter(function () { return $(this).val() == orgID; }).length;
            if (idExists) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "The organization ID already exists. Please give another ID to save this organization!",
                });
                return;
            }
        }else{
            if(!$('#userOrg').val()){
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Please select Organization!",
                });
                return;
            }
        }

        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
        wizardButtonVisibility(nextPage, mode, pageLength)
    }else if(mode == 'edit'){
        if (
            !$("#userEmail").val() ||
            !$("#userFirstName").val() ||
            !$("#userLastName").val() ||
            !$('#userPhoneNumber').val()
        ) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please enter values for email, first name, last name and mobile phone!",
            });
            return;
        }
        if ($("#resetPassCheck").prop("checked")) {
            if (!$("#userPasswordSysAdmin").val() || !$("#userConfirmPasswordSysAdmin").val()) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Please enter values for  password!",
                });
                return;
            }
            //check for the password length and special characters
            var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            let $passfieldVal = $("#userPasswordSysAdmin").val()
            if ($passfieldVal.match(decimal)) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
                });
                return;
            }
        }

        $(currentPage).removeClass('active')
        $(pageToOpen).addClass('active')
        wizardButtonVisibility(nextPage, mode, pageLength)
    }
}

function changeJogetPackageList(response){
    // construct or asset
    document.querySelectorAll('#jogetPackage option').forEach(option => option.remove());
    let myselect = document.getElementById('jogetPackage');
    let myoption = document.createElement("option");
    myoption.value = "";
    myoption.text = "Please Select ...";
    //myoption.disabled = true; //removed this as per Beh's suggestion. user need not select any apps either construct or finance GM//
    myselect.appendChild(myoption);

    //for finance package
    document.querySelectorAll('#jogetFinancePackage option').forEach(option => option.remove());// for finance package
    let myselectfinance = document.getElementById('jogetFinancePackage');
    let myoption1 = document.createElement("option");
    myoption1.value = "";
    myoption1.text = "Please Select ...";
    //myoption1.disabled = true;
    myselectfinance.appendChild(myoption1);

    // for doc package            
    document.querySelectorAll('#jogetDocPackage option').forEach(option => option.remove());
    let myselectdoc = document.getElementById('jogetDocPackage');
    let myoption2 = document.createElement("option");
    myoption2.value = "";
    myoption2.text = "Please Select ...";
    myselectdoc.appendChild(myoption2);

    for (let i = 0; i < response.length; i++) {
        //for construct package
        let myoption = document.createElement("option");
        myoption.value = response[i].packageId;
        myoption.text = response[i].packageName;
        myselect.appendChild(myoption);

        //for finance package
        let myoption1 = document.createElement("option");
        myoption1.value = response[i].packageId;
        myoption1.text = response[i].packageName;
        myselectfinance.appendChild(myoption1);

        //for finance package
        let myoption2 = document.createElement("option");
        myoption2.value = response[i].packageId;
        myoption2.text = response[i].packageName;
        myselectdoc.appendChild(myoption2);
    }
}

//function to refresh parentProjectIDList 
function refreshParentProjectIDList(name) {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = '../BackEnd/ProjectFunctionsV3.php';
    }
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: 'getParentProjectIDs'
        },
        success: function (response) {
            let mydata = JSON.parse(response);
            $('#parentId').empty();
            let mySelect = document.getElementById('parentId');
            var myOption = document.createElement("option");
            myOption.value = "";
            myOption.text = "Please Select ...";
            myOption.selected = true;
            mySelect.append(myOption);
            if(SYSTEM == 'OBYU'){
                for (var i = 0; i < mydata.length; i++) {
                    var myOption = document.createElement("option");
                    myOption.value = mydata[i].project_id_number;
                    myOption.text = mydata[i].project_id + "/" + mydata[i].project_name;
                    myOption.setAttribute("projectowner", mydata[i].owner_org_id);
                    myOption.setAttribute("industry", mydata[i].industry);
                    myOption.setAttribute("timevalue", mydata[i].time_zone_value);
                    mySelect.append(myOption);
                }
            }else{
                for (var i = 0; i < mydata.length; i++) {
                    var myOption = document.createElement("option");
                    myOption.value = mydata[i].project_id_number;
                    myOption.text = mydata[i].project_id + "/" + mydata[i].project_name;
                    myOption.setAttribute("projectowner", mydata[i].project_owner);
                    myOption.setAttribute("industry", mydata[i].industry);
                    myOption.setAttribute("timevalue", mydata[i].time_zone_value);
                    myOption.setAttribute("projecttype", mydata[i].project_type);
                    myOption.setAttribute("region", mydata[i].region);
                    mySelect.append(myOption);
                }
            }
            if (name) {//updating project list
                mySelect.value = name; //setting the parent id value
                $("select#parentId").addClass("readonly");
                $("select#parentId").prop("disabled", true);

            }

        }
    });
}

//function to refresh the contractors and consultants select list
function refreshContractOrgList(setValContractor = '') {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
        }else{
            ajaxUrl = '../BackEnd/UserFunctionsV3.php';
        }
    }

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: 'getContractorsConsultantsOrg'
        },
        success: function (response) {
            let mydata = JSON.parse(response);
            var selectizeContractor = contractorSelect[0].selectize;
            selectizeContractor.clearOptions();

            for (var i = 0; i < mydata.length; i++) {
                if(mydata[i].orgType == "contractor" || mydata[i].orgType == "DBC"){
                    selectizeContractor.addOption({text: mydata[i].orgName, value: mydata[i].orgID})
                }
            }

            if(setValContractor !== ""){
                selectizeContractor.setValue(setValContractor, false);
            }
        }
    });
}

function refreshConsultantOrgList(setValConsultant = '') {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
        }else{
            ajaxUrl = '../BackEnd/UserFunctionsV3.php';
        }
    }

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: 'getContractorsConsultantsOrg'
        },
        success: function (response) {
            let mydata = JSON.parse(response);
            var selectizeConsultant = consultantSelect[0].selectize;
            selectizeConsultant.clearOptions();

            for (var i = 0; i < mydata.length; i++) {
                if(mydata[i].orgType == "consultant" || mydata[i].orgType == "DBC"){
                    selectizeConsultant.addOption({text: mydata[i].orgName, value: mydata[i].orgID})
                }
            }

            if(setValConsultant !== ""){
                selectizeConsultant.setValue(setValConsultant, false);
            }
        }
    });
}

//get list of pacakges from joget
function getListofPackages() {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/jogetOBYU.php';
    }else{
        ajaxUrl = '../BackEnd/joget.php';
    }
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: {
            functionName: "getListofPackages"
        },
        dataType: 'json',
        success: function (response) {
            //we are getting two joget packages. store them in global variables to change the options based on assset or construc project
            
            if(SYSTEM == 'KKR'){
                constructPackages = response['construct'];
                assetPackages = response['asset'];
            }else{
                constructPackages = response;
            }

            changeJogetPackageList(constructPackages);
        }
    });
}

function checkProjectDetails() {
    if ($("#overallprojectCheck").is(":checked")) {
        if (!$("#projectId").val() || !$("#projectName").val() || !$("#projectOwner").val()) {
            msg = "Please enter values for Project Owner, Project ID and Project Name!";
            return (msg);
        }
    } else if ($("#packagespecificCheck").is(":checked")) {
        if (!$("#parentId :selected").val() || !$("#projectId").val() || !$("#projectName").val() || !$("#projectOwner").val() ) {
            msg = "Please enter values for Parent Package, Package ID and Package Name!";
            return (msg);
        }
        if($('#constructProject').is(":checked")){
           if( !$("#projectWpcId").val()){
            msg = "Please enter values for WPC ID!";
            return (msg);
           }
        }
    }
    var pid = $("#projectId").val();
    var pname = $("#projectName").val();
    var pattern = (SYSTEM == "KKR") ? /[^A-Za-z0-9_]/g : /[^A-Za-z0-9_\-/()]/g;
    var result = pid.match(pattern);
    if (result) {
        msg = (SYSTEM == "KKR") ? "Project ID must not contain space and other special chars except '_'." : "Project ID must not contain space and other special chars except '-' and '_'.";
        return (msg);
    }
    return true;
}

function validateProjectDetails(callback) {
    var msg = "";
    var pid = $("#projectId").val();
    var pname = $("#projectName").val();
    var pidnumber = null;
    if (flagEdit) {
        pid = null;
        pidnumber = click_project_details.projectIdNumber;
    }
    $.ajax({
        url: '../BackEnd/ProjectFunctionsV3.php', // to validate the project details
        type: "POST",
        dataType: "json",
        data: {
            functionName: "validateProjectDetails",
            project_id: pid,
            project_name: pname,
            project_id_number: pidnumber
        },
        success: function (res) {
            if (res.bool == false) {
                if (res.msg.pIdName) {
                    msg += res.msg.pIdName;
                    //errorProjectID();//function to  higlight the error field by css
                };
                if (res.msg.pName) {
                    msg += " " + res.msg.pName;
                    //errorProjectName();//function to  higlight the error field by css
                };

                callback(msg);
            } else {
                callback(true);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            msg = textStatus + " " + errorThrown;
            callback(msg);
        },
    });
}

//=============================== Need to merge with system admin user profile later ====================================//
//user profile start here
//wizard get user profile email
getProfileDetail = () =>{
    usr_email = $("#myprofileEmail").find("a").text()
    $('.picEdit').css({'visibility':'hidden', 'opacity':'0', 'transition':'opacity 0.2s, visibility 0.2s'});
    $('.infoPicture').css('pointer-events', 'none');
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
        }else{
            ajaxUrl = '../BackEnd/UserFunctionsV3.php';
        }
    }
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        dataType: 'json',
        data: {
            functionName: 'viewUser',
            usr_email: usr_email
        },
        success: function (obj, textstatus) {
            if (!('error' in obj)) {
                $("#h3_fullname_profileuser").text(obj.data.user_firstname + " " + obj.data.user_lastname)
                $("#h4_role").text(obj.project_role);
                $("#img_fullname").text(obj.data.user_firstname + " " + obj.data.user_lastname)
                $("#firstnameprofile").val(obj.data.user_firstname);
                $("#lastnameprofile").val(obj.data.user_lastname);
                $("#img_email").text(obj.data.user_email)
                $("#img_mobileno").text(obj.data.user_phone)
                $("#img_org").text(obj.data.orgName)
                $("#img_country").text(obj.data.user_country)
                if(IS_DOWNSTREAM){
                    $("#img_designation").text(obj.data.user_designation)
                }
                //hidden for the time being until fully utilized for sarawak
                var designation = (obj.data.user_designation !== null) ? obj.data.user_designation : '';
                $("#designationprofile").val(designation)

                function imageUrlExists(url, callback) {
                    var img = new Image();

                    img.onload = function () {
                        callback(true);
                    };

                    img.onerror = function () {
                        callback(false);
                    };

                    img.src = url + "?cache_bust=" + Date.now(); // avoid caching
                }

                var profileImg = `../../Data/users/`+obj.data.user_email+`/`+obj.data.profile_img;
                var profileImgHeader = `../../Data/users/`+obj.data.user_email+`/`+obj.data.profile_header;

                //Profile Pic
                imageUrlExists(profileImg, function(exists) {
                    if (exists) {
                        console.log("Image exists!");
                        $('#profilePic').attr('src', profileImg);
                    } else {
                        $('#profilePic').attr('src', '../Images/defaultProfile.png');
                    }
                });

                //Profile Header
                imageUrlExists(profileImgHeader, function(exists) {
                    if (exists) {
                        console.log("Image exists!");
                        $('#wallpaperPic').attr('src', profileImgHeader);
                    } else {
                        $('#wallpaperPic').css('background-image', `url("../Images/icons/ri_v3/wallpaper/default.jpg")`);
                    }
                });
             
                $('.profileUserView').show();
            } else {
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        }
    })
}

//user on key up password validator
onkeyupPassword = (e) =>{
    var currentOnkeyup = $(e).data("currentkeyup")

    if (!$(e).val().length == 0) {
        $(`.passindicator.${currentOnkeyup}`).css("display", "inline-block");
        passwordText(currentOnkeyup);
    } else {
        $(`.passindicator.${currentOnkeyup}`).css("display", "none");
    }
}

//showing password strength
passwordText = (type) =>{
    let $passfieldVal = $(`#userPassword${type}`).val()
    let $no = 0

    if ($passfieldVal != "") {
        if ($passfieldVal.length <= 4) $no = 1;
        if ($passfieldVal.length > 4) $no = 2;
        if ($passfieldVal.length > 6) $no = 3;
        if ($passfieldVal.length > 8) $no = 4;

        if ($no == 1) {
            $(`#passwordstrength${type}`).animate({
                width: '50px'
            }, 150)
            $(`#passwordstrength${type}`).css('background-color', 'red')
            $(`#passwordstrengthText${type}`).html('Very Weak')
        } else if ($no == 2) {
            $(`#passwordstrength${type}`).animate({
                width: '100px'
            }, 150)
            $(`#passwordstrength${type}`).css('background-color', 'orange')
            $(`#passwordstrengthText${type}`).html('Weak')
        } else if ($no == 3) {
            $(`#passwordstrength${type}`).animate({
                width: '150px'
            }, 150)
            $(`#passwordstrength${type}`).css('background-color', 'yellow')
            $(`#passwordstrengthText${type}`).html('Good')
        } else if ($no == 4) {
            $(`#passwordstrength${type}`).animate({
                width: '200px'
            }, 150)
            $(`#passwordstrength${type}`).css('background-color', 'green')
            $(`#passwordstrengthText${type}`).html('Strong')
        }
    }
}

//copy user info div value
copyuserinfodivvalue = () =>{
    let $email = $('#img_email').html()
    let $country = $('#img_country').html()
    let $role = $('#img_role').html()
    let $phone = $('#img_mobileno').html()
//fname and last name are updated to the div when you get the details (viewUser) as name can have spaces
    // let $str = $('#img_fullname').html()
    // let strs = $str.split(' ')

    // let $fname = strs[0]
    // let $lname = strs[1]

    // $('#firstnameprofile').val($fname)
    // $('#lastnameprofile').val($lname)
    $('#countryprofile').val($country)
    $('#phonenumberprofile').val($phone)
}

//copy user info input value
copyuserinfoinputvalue = () =>{
    event.preventDefault()
    let $country = $('#countryprofile').val()
    let $fname = $('#firstnameprofile').val()
    let $lname = $('#lastnameprofile').val()
    let $phone = $('#phonenumberprofile').val()
    let $designation = $('#designationprofile').val()

    $('#img_country').html($country)
    $('#img_fullname').html($fname + ' ' + $lname)
    $('#h3_fullname_profileuser').html($fname + ' ' + $lname)
    $('#img_mobileno').html($phone)
    $('#img_designation').html($designation)
}

//edit state function on user profile
edituserstate = () =>{

    event.preventDefault()

    //show & hide the main body container
    $("#profileUserViewID").children().children().children(".infoContainerBody-readonly").hide()
    $(".infoContainerBody-edit").fadeIn()

    //show & hide the footer of the form
    $(".profileuserFooter .readonly").css('display', 'none')
    $(".profileuserFooter .editPage").css('display', 'block')

    //hide password indicator
    $('#checkresetpasswordprofile').prop("checked", false);
    $("input#userConfirmPasswordprofile").css({
        "background": "none",
        "border-color": "transparent",
        "background-size": "20px",
        "background-repeat": "no-repeat",
        "background-position": "2px 4px",
        "width": "calc(100% - 45px)",
        "padding": "3px 0px",
        "border-radius": "3px",
        "padding-left": "10px",
        "background-color": "var(--top)",
    })
    $("input#userConfirmPasswordprofile").val("")
    $("input#userPasswordprofile").val("")
    $(".passindicator").css('display', 'none')
    $(".resetpasswordcontainer").css('display', 'none')
    $('#checkresetbentleycredentials').prop("checked", false);
    $("input#newbentleyusernameprofile").val("")
    $("input#newbentleypasswordprofile").val("")
    $('.infoContainerBody-edit .resetbentleycredscontainer').css('display', 'none')
}

//=============================== Need to merge with system admin user profile later ====================================//

//=============================== Add new user in System Admin profile ====================================//

/////for confirm password validation css
$("#userConfirmPasswordSysAdmin").on("keyup", function () {
    if ($(window).width() <= "1366") {
        if (!($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val())) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            });
            $("input#userPasswordSysAdmin").addClass("invalid");
            $("input#userPasswordSysAdmin").removeClass("valid");
        } else {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "hsl(120, 76%, 50%)",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            });
            $("input#userPasswordSysAdmin").addClass("valid");
            $("input#userPasswordSysAdmin").removeClass("invalid");
        }
    } else if (window.devicePixelRatio >= 1.25){
        if (!($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val())) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            });
            $("input#userPasswordSysAdmin").addClass("invalid");
            $("input#userPasswordSysAdmin").removeClass("valid");
        } else {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "hsl(120, 76%, 50%)",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            });
            $("input#userPasswordSysAdmin").addClass("valid");
            $("input#userPasswordSysAdmin").removeClass("invalid");
        }
    } else {
        if (!($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val())) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            });
            $("input#userPasswordSysAdmin").addClass("invalid");
            $("input#userPasswordSysAdmin").removeClass("valid");
        } else {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "hsl(120, 76%, 50%)",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            });
            $("input#userPasswordSysAdmin").addClass("valid");
            $("input#userPasswordSysAdmin").removeClass("invalid");
        }
    }
});
$("#userPasswordSysAdmin").on('keyup', function () {
    if ($(window).width() <= "1366") {
        if (!($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val())) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            })
            $("input#userPasswordSysAdmin").addClass("invalid")
            $("input#userPasswordSysAdmin").removeClass("valid")
        } else if ($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val()) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "hsl(120, 76%, 50%)",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            })
            $("input#userPasswordSysAdmin").addClass("valid")
            $("input#userPasswordSysAdmin").removeClass("invalid")
        }
    } else if (window.devicePixelRatio >= 1.25) {
        if (!($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val())) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            })
            $("input#userPasswordSysAdmin").addClass("invalid")
            $("input#userPasswordSysAdmin").removeClass("valid")
        } else if ($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val()) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "hsl(120, 76%, 50%)",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            })
            $("input#userPasswordSysAdmin").addClass("valid")
            $("input#userPasswordSysAdmin").removeClass("invalid")
        }
    } else {
        if (!($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val())) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            })
            $("input#userPasswordSysAdmin").addClass("invalid")
            $("input#userPasswordSysAdmin").removeClass("valid")
        } else if ($("#userConfirmPasswordSysAdmin").val() == $("#userPasswordSysAdmin").val()) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "hsl(120, 76%, 50%)",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px"
            })
            $("input#userPasswordSysAdmin").addClass("valid")
            $("input#userPasswordSysAdmin").removeClass("invalid")
        }
    }
})
$("#userConfirmPasswordSysAdmin").on("focusout", function () {
    if ($(window).width() <= "1366") {
        if ($("#userPasswordSysAdmin").hasClass("invalid")) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            });
        } else {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "#d1d1d1",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            });
        }
    } else if (window.devicePixelRatio >= 1.25) {
        if ($("#userPasswordSysAdmin").hasClass("invalid")) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            });
        } else {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "#d1d1d1",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            });
        }
    } else {
        if ($("#userPasswordSysAdmin").hasClass("invalid")) {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/cancel.svg)",
                "background-color": "var(--top)",
                "border-color": "red",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
                "width": "calc(100% - 0px)",
                "padding": "3px 0px",
                "border-radius": "3px",
                "padding-left": "28px",
            });
        } else {
            $("input#userConfirmPasswordSysAdmin").css({
                "background": "url(../Images/icons/gen_button/checked.svg)",
                "background-color": "var(--top)",
                "border-color": "#d1d1d1",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 5px",
            });
        }
    }
});

//=============================== End new user in System Admin profile ====================================//


//function when clicking the enlarge button
enlargeMainContainer =(e)=>{
    let container = $(".mainContainer")

    if ($(e).hasClass("active")) {
        $(e).removeClass("active")
        $(e).children().attr("src", "../Images/icons/form/maximize.png")
        $(container).removeClass("enlarge")
    } else {
        $(e).addClass("active")
        $(e).children().attr("src", "../Images/icons/form/minimizeLightv3.png")
        $(container).addClass("enlarge")
    }

}

//function when clicking the fullscreen button
fullMainContainer =(e)=>{
    let mainContainer = $(".mainContainer")[0]

    if($(e).hasClass("active")){
        $(e).removeClass("active");
        $(".enlargeButton").show();

        if(document.exitFullscreen){
            document.exitFullscreen();
        }
        else if(document.mozCancelFullScreen){
            document.mozCancelFullScreen();
        }
        else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }
        else if(document.msExitFullscreen){
            document.msExitFullscreen();
        }
    }else{
        $(e).addClass("active");
        $(".enlargeButton").hide();

        if(mainContainer.requestFullscreen){
            mainContainer.requestFullscreen();
        }
        else if(mainContainer.mozRequestFullScreen){
            mainContainer.mozRequestFullScreen();
        }
        else if(mainContainer.webkitRequestFullscreen){
            mainContainer.webkitRequestFullscreen();
        }
        else if(mainContainer.msRequestFullscreen){
            mainContainer.msRequestFullscreen();
        }
    }

}

//exit fullscreen using esc button
document.addEventListener('fullscreenchange', exitHandlerMainPage, false);
document.addEventListener('webkitfullscreenchange', exitHandlerMainPage, false);
document.addEventListener('mozfullscreenchange', exitHandlerMainPage, false);
document.addEventListener('MSFullscreenChange', exitHandlerMainPage, false);

function exitHandlerMainPage() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        $(".fullScreenButton").removeClass("active");
        $(".enlargeButton").show();
    }
}

//readonly state function on user profile
function readonlyuserstate() {

    event.preventDefault()

    //show & hide the main body container
    $(".infoContainerBody-readonly").fadeIn()
    $(".infoContainerBody-edit").hide()
    $("#jogetSignature").hide()

    //show & hide the footer of the form
    $(".profileuserFooter .readonly").css('display', 'block')
    $(".profileuserFooter .editPage").css('display', 'none')

    var checkBoxPass = $("[name=password]");

    Array.prototype.forEach.call(checkBoxPass,function(el){
        el.checked = false;
    });

    var checkBoxBentley = $("[name=bentley]");

    Array.prototype.forEach.call(checkBoxBentley,function(el){
        el.checked = false;
    });
}

//function when going to old user interface
oldUI = () =>{
    // update ui preference on db
    $.ajax({
        type: "POST",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: "setUIPreference",
            uipref: 'ri_v2'
        },
        success : function(res){
            if(res == 'true'){
                localStorage.prefix_loc = ""
                window.location.href = 'postlogin';
                
            }else{
                alert('Error updating user preference. Please try again.')
            }
        }
    });
}

//function to edit layer name in Manage Layer
const changeLayerNameHandler = (e) => {
    let inputToChange = $(e).parent().find('input')
    let iconToChange = $(e).children('i')
    let updatedLayerName = inputToChange.val();
    let defaultName = layerDetail.ele.children[0].innerText;
    
    if ($(inputToChange).hasClass('edit')) {
        if (updatedLayerName == "" || updatedLayerName == defaultName) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Empty input or same value entered. Layer name not saved!',
            });

            // need to debug later. when field is empty, it doesnt reset the value
            inputToChange[0].innerText = inputToChange[0].defaultValue;
            // inputToChange.html(inputToChange[0].defaultValue);
            $(inputToChange).css('background','var(--surface)').removeClass('edit').attr('disabled', 'disabled')
            $(iconToChange).removeClass('fa-floppy-disk').addClass('fa-pen-to-square')
            return;
        } else {
            $.ajax({
                type: "POST",
                url: '../BackEnd/fetchDatav3.php',
                dataType: 'json',
                data: {
                    functionName: "renameLayer", data_id: layerDetail.id, layer_name:updatedLayerName
                },
                success: function (obj, textstatus) {
                    if (obj.bool === true) {
                        let lyrlist_item = $("#dataID_"+layerDetail.id).find("a")[0];
                        lyrlist_item.innerText = updatedLayerName
                        layerDetail.ele.children[0].innerText = updatedLayerName;

                        $.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: 'Message',
                            content: 'Layer name updated',
                        });
                    } else {                   
                        $.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: 'Message',
                            content: obj.msg,
                        });
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    var str = textStatus + " " + errorThrown;
                }
            })
        }
        $(inputToChange).css('background','var(--surface)').removeClass('edit').attr('disabled', 'disabled')
        $(iconToChange).removeClass('fa-floppy-disk').addClass('fa-pen-to-square')
    } else {
        $(inputToChange).css('background','var(--top)').addClass('edit').removeAttr('disabled').focus().select()
        $(iconToChange).removeClass('fa-pen-to-square').addClass('fa-floppy-disk')
    }
}

// To ceate task in MyTask List
class AddTask {
    constructor(_project, _refno, _processname, _date, _time, _action, _activityId, _appInbox, _setAppInbox, _extraParam, _divId, _projectowner, _section, _workdiscipline, _createdByName, _createdBy){
        this.project = _project
        this.refno = _refno
        this.processname = _processname
        this.date = _date
        this.time = _time
        this.action = _action
        this.activityid = _activityId
        this.appInbox = _appInbox
        this.setAppInbox = _setAppInbox
        this.extraParam = _extraParam
        this.divId = _divId
        this.project_owner = _projectowner
        this.section = _section
        this.work_discipline = _workdiscipline
        this.createdByName = _createdByName
        this.createdBy = _createdBy
    }
    drawTask(){
        if((this.refno) == undefined) return true

        if((this.appInbox) == "FinanceAssetInbox" && (this.refno) == '') return true; 

        var refnoTask = this.refno;
        if(refnoTask == ""){
            refnoTask = " ";
        }else{
            refnoTask = this.refno;
        }

        var projectTask = this.project;
        if(projectTask == ""){
            projectTask = " ";
        }
        var processNameLabel = this.processname;
        if(this.appInbox == 'financeInbox' && this.extraParam  == 'Process 1a'){
            processNameLabel = 'Contract Amend'
            this.extraParam = '';
        }
        if(this.appInbox == 'FinanceAssetInbox'){
            if(this.extraParam  == 'Process 1'){
                processNameLabel = 'Approval Contract'
            }else if(this.extraParam  == 'Verify Claim'){
                processNameLabel = this.extraParam
            }
            this.extraParam = '';
        }

        var lowercasedivId = this.divId.toLowerCase();

        var dateReverse = this.date.split('-').reverse().join('-');

        $('.tableBody.'+this.divId).append(`
            <div class="row mix homeTaskSearch" id="`+this.activityid+`" rel="myTask" data-time="`+this.time+`" data-projectOwner="`+this.project_owner+`" data-appTask="`+this.appInbox+`" data-appSetTask="`+this.setAppInbox+`"  data-extraParam="`+this.extraParam+`" data-`+lowercasedivId+`-refno="`+refnoTask+`" data-`+lowercasedivId+`-project="`+projectTask+`" data-`+lowercasedivId+`-modifieddate="`+this.date+`" data-`+lowercasedivId+`-pending="`+this.action+`" data-`+lowercasedivId+`-section="`+this.section+`" data-`+lowercasedivId+`-workdiscipline="`+this.work_discipline+`" data-`+lowercasedivId+`-createdbyname="`+this.createdByName+`"  data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.refno+`</span><span class="fontSmall marginAuto lineClamp one">`+processNameLabel+`</span></div>
                <div class="columnFirst textContainer"><span>`+this.project+`</span></div>
                <div class="columnSecond textContainer"><span>`+dateReverse+`</span><span class="fontSmall">`+this.time+`</span></div>
                <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">`+this.action+`</span></div>
                <div class="columnSecond columnHidden textContainer"><span>`+this.section+`</span></div>
                <div class="columnFirst columnHidden textContainer"><span>`+this.work_discipline+`</span></div>
                <div class="columnFirst columnHidden textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.createdByName+`</span><span class="fontSmall marginAuto lineClamp one">`+this.createdBy+`</span></div>
                <div class="columnFilter">`+this.section+`;`+this.work_discipline+`;`+this.createdByName+`;`+this.createdBy+`</div>
            </div>
        `);
    }
}

// To ceate task in MyTask App List
class AddTaskApp {
    constructor(_refno, _processname, _date, _time, _action, _activityId, _appInbox, _setAppInbox, _extraParam, _projectowner, _section, _workdiscipline, _createdByName, _createdBy){
        this.refno = _refno
        this.processname = _processname
        this.date = _date
        this.time = _time
        this.action = _action
        this.activityid = _activityId
        this.appInbox = _appInbox
        this.setAppInbox = _setAppInbox
        this.extraParam = _extraParam
        this.project_owner = _projectowner
        this.section = _section
        this.work_discipline = _workdiscipline
        this.createdByName = _createdByName
        this.createdBy = _createdBy
    }
    drawTaskApp(){
        if((this.refno) == undefined) return true;

        if((this.appInbox) == "FinanceAssetInbox" && (this.refno) == '') return true; 

        var refnoTask = this.refno;
        if(refnoTask == ""){
            refnoTask = " ";
        }else{
            refnoTask = this.refno;
        }

        var dateReverse = this.date.split('-').reverse().join('-');

        if(localStorage.noti_construct == 'true'){
            if(this.appInbox == "constructInbox"){
                $('.tableBody.taskConstruct').append(`
                    <div class="row homeTaskSearch mix" id="${this.activityid}" rel="myTask" data-time="`+this.time+`" data-projectOwner=`+this.project_owner+` data-appTask="${this.appInbox}" data-appSetTask="${this.setAppInbox}" data-construct-refno="${refnoTask}" data-construct-modifieddate="${this.date}" data-construct-pending="${this.action}" data-construct-section="`+this.section+`" data-construct-workdiscipline="`+this.work_discipline+`" data-construct-createdbyname="`+this.createdByName+`" data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                        <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                        <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">${this.refno}</span><span class="fontSmall marginAuto lineClamp one">${this.processname}</span></div>
                        <div class="columnSecond textContainer"><span>${dateReverse}</span><span class="fontSmall">${this.time}</span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">${this.action}</span></div>
                        <div class="columnSecond columnHidden textContainer"><span>`+this.section+`</span></div>
                        <div class="columnFirst columnHidden textContainer"><span>`+this.work_discipline+`</span></div>
                        <div class="columnFirst columnHidden textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.createdByName+`</span><span class="fontSmall marginAuto lineClamp one">`+this.createdBy+`</span></div>
                        <div class="columnFilter">`+this.section+`;`+this.work_discipline+`;`+this.createdByName+`;`+this.createdBy+`</div>
                    </div>
                `)
                $("#constTask").css("display", "block")
            }
            
        }

        if(localStorage.noti_doc == 'true'){
            if(this.appInbox == "documentInbox"){
                $('.tableBody.taskDocument').append(`
                    <div class="row homeTaskSearch mix" id="${this.activityid}" rel="myTask" data-time="`+this.time+`" data-projectOwner=`+this.project_owner+` data-appTask="${this.appInbox}" data-appSetTask="${this.setAppInbox}" data-extraParam="${this.extraParam}" data-document-refno="${refnoTask}" data-document-modifieddate="${this.date}" data-document-pending="${this.action}" data-document-section="`+this.section+`" data-document-createdbyname="`+this.createdByName+`" data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                    <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                        <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">${this.refno}</span><span class="fontSmall marginAuto lineClamp one">${this.processname}</span></div>
                        <div class="columnSecond textContainer"><span>${dateReverse}</span><span class="fontSmall">${this.time}</span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">${this.action}</span></div>
                        <div class="columnSecond columnHidden textContainer"><span>`+this.section+`</span></div>
                        <div class="columnFirst columnHidden textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.createdByName+`</span><span class="fontSmall marginAuto lineClamp one">`+this.createdBy+`</span></div>
                        <div class="columnFilter">`+this.section+`;`+this.createdByName+`;`+this.createdBy+`</div>
                    </div>
                `)

                $("#docTask").css("display", "block")
            }

            
        }

        if(localStorage.noti_finance == 'true'){
            if(this.appInbox == "financeInbox"){
                var processNameLabel = this.processname;
                if(this.extraParam  == 'Process 1a'){
                    processNameLabel = 'Contract Amend'
                }
                $('.tableBody.taskFinance').append(`
                    <div class="row homeTaskSearch mix" id="${this.activityid}" rel="myTask" data-time="`+this.time+`" data-appTask="${this.appInbox}" data-appSetTask="${this.setAppInbox}" data-extraParam="`+this.extraParam+`" data-finance-refno="${refnoTask}" data-finance-modifieddate="${this.date}" data-finance-pending="${this.action}" data-finance-section="`+this.section+`" data-finance-createdbyname="`+this.createdByName+`" data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                        <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                        <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">${this.refno}</span><span class="fontSmall marginAuto lineClamp one">${processNameLabel}</span></div>
                        <div class="columnSecond textContainer"><span>${dateReverse}</span><span class="fontSmall">${this.time}</span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">${this.action}</span></div>
                        <div class="columnSecond columnHidden textContainer"><span>`+this.section+`</span></div>
                        <div class="columnFirst columnHidden textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.createdByName+`</span><span class="fontSmall marginAuto lineClamp one">`+this.createdBy+`</span></div>
                        <div class="columnFilter">`+this.section+`</div>
                    </div>
                `)

                $("#pfsTask").css("display", "block")
            }
            
        }
        if(localStorage.noti_asset == 'true'){
            if(this.appInbox == "assetInbox"){
                $('.tableBody.taskAsset').append(`
                    <div class="row homeTaskSearch mix" id="${this.activityid}" rel="myTask" data-time="`+this.time+`" data-appTask="${this.appInbox}" data-appSetTask="${this.setAppInbox}" data-asset-refno="${refnoTask}" data-asset-modifieddate="${this.date}" data-asset-pending="${this.action}" data-asset-workdiscipline="`+this.work_discipline+`" data-asset-createdbyname="`+this.createdByName+`" data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                        <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                        <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">${this.refno}</span><span class="fontSmall marginAuto lineClamp one">${this.processname}</span></div>
                        <div class="columnSecond textContainer"><span>${dateReverse}</span><span class="fontSmall">${this.time}</span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">${this.action}</span></div>
                        <div class="columnFirst columnHidden textContainer"><span>`+this.work_discipline+`</span></div>
                        <div class="columnFirst columnHidden textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.createdByName+`</span><span class="fontSmall marginAuto lineClamp one">`+this.createdBy+`</span></div>
                    </div>
                `)
                $("#assetTask").css("display", "block")
            }
            
        }

        if(localStorage.noti_finance_asset == 'true'){
            if(this.appInbox == 'FinanceAssetInbox'){
                var processNameLabel = this.processname;
                if(this.extraParam  == 'Process 1'){
                    processNameLabel = 'Approval Contract'
                }else if(this.extraParam  == 'Verify Claim'){
                    processNameLabel = this.extraParam
                }
                $('.tableBody.taskFinance').append(`
                    <div class="row homeTaskSearch mix" id="${this.activityid}" rel="myTask" data-time="`+this.time+`" data-appTask="${this.appInbox}" data-appSetTask="${this.setAppInbox}" data-extraParam="`+this.extraParam+`" data-finance-refno="${refnoTask}" data-finance-modifieddate="${this.date}" data-finance-pending="${this.action}" data-finance-section="`+this.section+`" data-finance-createdbyname="`+this.createdByName+`" data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                        <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                        <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">${this.refno}</span><span class="fontSmall marginAuto lineClamp one">${processNameLabel}</span></div>
                        <div class="columnSecond textContainer"><span>${dateReverse}</span><span class="fontSmall">${this.time}</span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">${this.action}</span></div>
                        <div class="columnSecond columnHidden textContainer"><span>`+this.section+`</span></div>
                        <div class="columnFirst columnHidden textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.createdByName+`</span><span class="fontSmall marginAuto lineClamp one">`+this.createdBy+`</span></div>
                    </div>
                `)

                $("#pfsTask").css("display", "block")
            }
        }

        if(localStorage.noti_fm == 'true'){
            if(this.appInbox == "fmInbox"){
                $('.tableBody.taskServiceRequest').append(`
                    <div class="row homeTaskSearch mix" id="${this.activityid}" rel="myTask" data-time="`+this.time+`" data-appTask="${this.appInbox}" data-appSetTask="${this.setAppInbox}" data-asset-refno="${refnoTask}" data-asset-modifieddate="${this.date}" data-asset-pending="${this.action}" data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                        <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                        <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">${this.refno}</span><span class="fontSmall marginAuto lineClamp one">${this.processname}</span></div>
                        <div class="columnSecond textContainer"><span>${dateReverse}</span><span class="fontSmall">${this.time}</span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">${this.action}</span></div>
                    </div>
                `)
                $("#fmTask").css("display", "block")
            }
        }

        if(localStorage.noti_markup == 'true'){
            if(this.appInbox == "documentInbox"){
                $('.tableBody.taskDocument').append(`
                    <div class="row homeTaskSearch mix" id="${this.activityid}" rel="myTask" data-time="`+this.time+`" data-projectOwner=`+this.project_owner+` data-appTask="${this.appInbox}" data-appSetTask="${this.setAppInbox}" data-extraParam="${this.extraParam}" data-document-refno="${refnoTask}" data-document-modifieddate="${this.date}" data-document-pending="${this.action}" data-document-section="`+this.section+`" data-document-createdbyname="`+this.createdByName+`" data-color="#ad5e2a" data-width="55" data-height="80" onclick="wizardOpenPage(this)">
                    <div class="columnIndex"><img src="../Images/icons/appsbar/document.png"></div>
                        <div class="columnFirst textContainer"><span class="lineHeight marginAuto lineClamp two">${this.refno}</span><span class="fontSmall marginAuto lineClamp one">${this.processname}</span></div>
                        <div class="columnSecond textContainer"><span>${dateReverse}</span><span class="fontSmall">${this.time}</span></div>
                        <div class="columnSecond textContainer"><span class="lineHeight lineClamp three">${this.action}</span></div>
                        <div class="columnSecond columnHidden textContainer"><span>`+this.section+`</span></div>
                        <div class="columnFirst columnHidden textContainer"><span class="lineHeight marginAuto lineClamp two">`+this.createdByName+`</span><span class="fontSmall marginAuto lineClamp one">`+this.createdBy+`</span></div>
                    </div>
                `)

                $("#docTask").css("display", "block")
            }

            
        }
    }
}

//Function for enter app button from homePage
function _enterApp (pageToOpen, appAccess){

    $('.projectName').html(localStorage.p_name);
    $('.projectID').html(localStorage.p_id_name);
    $('.projectIndustry').html(localStorage.industry);
    $('.projectLocation').html(localStorage.location);
    $('.projectCreatedBy').html(localStorage.created_by);
    $('.projectUpdatedBy').html(`${localStorage.updated_by} ${localStorage.last_update}`);
    $('.projectDuration').html(`${localStorage.start_date} - ${localStorage.end_date} (${localStorage.projectDuration}) Days`);
    $('.timeZone').html(localStorage.time_zone_text);
    let mainButton = $(`.mainAppButton[rel=${pageToOpen}]`)
    let title;

    // add financeInformationTable project view on modal container -- Finance Information
    $.ajax({
        type: "POST",
        url: '../BackEnd/jogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getContractDetails"
        },
        success: function (obj, textstatus) {
            let data = obj;
            let contractName;
            let contractAmt = 0;
            let contractID;
            let completionDate;
            let variationAmt = 0;
            let newAmt = 0;
            let loaRefNo;
            let loaDate;
            let oriDuration;
            let newDuration;
            let extOfTime;

            if (!data) { return };
            let myhtml = "";
            for (var i = 0; i < data.length; i++) {

                if(SYSTEM == 'KKR'){
                    contractName = data[i].contract_title;
                    contractAmt = data[i].original_amount;
                    contractID = data[i].contract_id;
                    completionDate = data[i].completion_date;
                    variationAmt = data[i].variation_amount;
                    newAmt = data[i].new_amount;
                    loaRefNo = data[i].loa_ref_no;
                    loaDate = data[i].loa_date;
                    oriDuration = data[i].original_duration;
                    newDuration = data[i].new_duration;
                    extOfTime = data[i].extension_of_time;
                }else{
                    if(localStorage.project_owner == 'KACC'){
                        contractName = data[i].contract_title;
                        contractAmt = data[i].original_amount;
                        contractID = data[i].contract_id;
                        completionDate = data[i].completion_date;
                        variationAmt = data[i].variation_amount;
                        newAmt = data[i].new_amount;
                        loaRefNo = data[i].loa_ref_no;
                        loaDate = data[i].loa_date;
                        oriDuration = data[i].original_duration;
                        newDuration = (parseInt(data[i].original_duration) + parseInt(data[i].extension_of_time)).toString();
                        extOfTime = data[i].extension_of_time;
                    }else if(localStorage.project_owner == 'MRSB'){
                        contractName = data[i].contract_no;
                        contractAmt = data[i].original_contract_sum;
                        contractID = data[i].contract_no;
                        completionDate = data[i].revised_completion_date;
                        variationAmt = data[i].cumulative_approved_vo_amount;
                        newAmt = data[i].revised_contract_sum;
                        loaRefNo = data[i].loa_ref_no;
                        loaDate = data[i].loa_date;
                        oriDuration = "N/A";
                        newDuration = "N/A";
                        extOfTime = data[i].cumulative_approved_eot_days;
                    }
                }

                myhtml += "\
                <div class='row wizard' rel='"+i+"' onclick='financeListOnClick(this)'>\
                    <div class='columnFirst textContainer wizard'><span class='text ellipsis'>"+contractName+"</span></div>\
                    <div class='columnSecond textContainer wizard'><span class='fontSmall'>RM "+formatCurrency(contractAmt)+"</span></div>\
                </div>\
                <div class = 'financeListContainer' id='"+i+"' style='display: none'>\
                    <div class='doublefield tableList'>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-puzzle-piece'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>Contract ID</span>\
                                <span class='textEllipsis contractID'>"+contractID+"</span>\
                            </div>\
                        </div>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-dice-d6'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>Completion Date</span>\
                                <span class='textEllipsis completionDate'>"+completionDate+"</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='doublefield tableList'>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-coins'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>Variation Amount</span>\
                                <span class='textEllipsis variationAmount'>RM "+formatCurrency(variationAmt)+"</span>\
                            </div>\
                        </div>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-coins'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>New Amount</span>\
                                <span class='textEllipsis newAmount'>RM "+formatCurrency(newAmt)+"</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='doublefield tableList'>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-file-invoice'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>LOA Ref No.</span>\
                                <span class='textEllipsis loaRef'>"+loaRefNo+"</span>\
                            </div>\
                        </div>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-file-invoice'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>LOA Date</span>\
                                <span class='textEllipsis loaDate'>"+loaDate+"</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='doublefield tableList'>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-calendar-days'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>Original Duration</span>\
                                <span class='textEllipsis originalDuration'>"+oriDuration+"</span>\
                            </div>\
                        </div>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-file-invoice'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>New Duration</span>\
                                <span class='textEllipsis newDuration'>"+newDuration+"</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='doublefield tableList'>\
                        <div class='readOnlyContainer flex margin-center'><i class='fa-solid fa-calendar-days'></i>\
                            <div class='twoLabel'>\
                                <span class='textEllipsis headerTitle'>Extension of Time</span>\
                                <span class='textEllipsis extensionTime'>"+extOfTime+"</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>";
            }
            $('#financeContractInfo').html(myhtml);
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        }
    });

    //minimize menu button (right side)
    if($(".buttonContainer.active").length > 0){
        $(".buttonContainer.active").animate({width:'-=210px'},200)
        $(".buttonContainer.active").parent().find('span').fadeOut(50)
        $(".buttonContainer.active").removeClass('active')
    }

    //hide noti bell
    $('.navbarButton.bell').css("display", "none")

    if(pageToOpen == 'myProject'){
        //show opacity for myProject container
        $('.mainPage.myProject').css('opacity', '1')

        $(".mainAppButton.active").removeClass('active')
        $(".mainAppButton.hs").removeClass('show')
        $(".subMenuButtonContainer").addClass('active')
        $(".mainContainer").addClass('subMenuOpened')

        //hide and show enlarge button
        $(".mainContainer .enlargeContainer").removeClass("active")
        $(".mainContainer .enlargeContainer").hide()
        $(".mainContainer .enlargeContainer .printButton").hide()

        //hide and show project details navbar
        $('.navbarButton.project').css("display", "none")
    }
    else if(pageToOpen == 'eLibrary' || pageToOpen == 'projectInformation'){
        $(".mainAppButton.active").removeClass('active')
        $(".mainAppButton.hs").removeClass('show')
        $(".subMenuButtonContainer").addClass('active')
        $(".mainContainer .enlargeContainer").addClass("active")
        $(".mainContainer .enlargeContainer").show()
        $(".mainContainer").addClass('subMenuOpened')

        //hide and show project details navbar
        $('.navbarButton.project').css("display", "block")

        //FOR OBYU
        $(`.mainAppButton.${pageToOpen}`).addClass('show')
    }
    else{
        if(pageToOpen == 'myInsights' || pageToOpen == 'myReporting'){
            $(".subMenuButtonContainer").removeClass('active')
            $(".mainContainer .enlargeContainer").addClass("active")
            $(".mainContainer .enlargeContainer").show()
            $(".mainContainer").removeClass('subMenuOpened')

            if(pageToOpen == 'myInsights'){
                setInsight();

                //hide and show project details navbar
                $('.navbarButton.project').css("display", "block")

                //show noti bell
                if(localStorage.Project_type == 'FM'){
                    $('.navbarButton.bell').css("display", "flex")
                }

                // only display power BI for project director
                $('.buttonContainer .toolButton.powerBI').hide();
                if(SYSTEM == 'KKR'){
                    if (localStorage.usr_role == "Project Director") {
                        $('.buttonContainer .toolButton.powerBI').show();
                    }
                }else{
                    $('.buttonContainer .toolButton.powerBI').show();
                }

                //Labelling for Asset Table
                var sectionAbb = (localStorage.project_owner == "JKR_SARAWAK") ? "DIV" : "DIS";
                var sectionLabel = (localStorage.project_owner == "JKR_SARAWAK") ? "Division" : "District";
                $('.inventoryJoget[rel="network_div"]').attr("title", sectionAbb);
                $('.inventoryJoget[rel="network_div"]').html(sectionLabel);
            }
        }else{
            $(".mainContainer .enlargeContainer").addClass("active")
            $(".mainContainer .enlargeContainer").show()
            $(".subMenuButtonContainer").addClass('active')
            $(".mainContainer").addClass('subMenuOpened')

            //hide and show project details navbar
            $('.navbarButton.project').css("display", "block")

            if(pageToOpen == 'myDashboard'){
                $(".mainContainer .enlargeContainer .printButton").show()
            }

            if(pageToOpen == 'myTask'){
                dataForMyTask();
            }

            $('.myFinance.claimsPer').hide();
            $('.myFinance.claimsInventory').hide();
            $('.myFinanceDownstream.acsSSLR').hide();
            $('.myFinanceDownstream.eotSSLR').hide();
            $('.myFinance.eotSabah').hide();

            if(pageToOpen == 'myDocument' || pageToOpen == 'myFinance'){
                title = pageToOpen.replace('my','')
                $(`.mainPage.${pageToOpen} .contentContainer .head h2`).html(`${title} - ${localStorage.p_name}`)
                
                if(localStorage.Project_type == 'ASSET' && pageToOpen == 'myFinance'){
                    $('.myFinance.claimsPer').show();
                    if(localStorage.project_owner == 'JKR_SARAWAK' && (localStorage.usr_role == "Contract Assistance" || localStorage.usr_role == "Head of Contract")){
                        $('.myFinance.claimsInventory').show();
                    }
                } 
                
                if(pageToOpen == 'myFinance' && localStorage.project_phase == '1B'){ 
                    $('.myFinance.eotSabah').show();
                }
            }
        }

        //for app access - to show button based on permission
        for (const [idx, ele] of Object.entries(appAccess)) {
        
            let apps = $(`.mainAppButton[rel=${idx}]`);
            if(ele == true){
                apps.addClass('show');
            }
            else{
                apps.removeClass('show');
            }
        
            //Make previous app button inactive and activate app button
            //wp = without permission
            $(".mainAppButton.hs.wp").addClass('show')
            $(".mainAppButton.active span.active").removeClass('active')
            $(".mainAppButton.active").removeClass('active')

        }

    } 

    //hide shown page
    $(".mainPage.active").hide()
    $(".mainPage.active").removeClass('active')

    //show page to be shown
    $(".mainPage." + pageToOpen).show()
    $(".mainPage." + pageToOpen).addClass('active')

    //hide opened buttonContainer (right button)
    $(".buttonContainer.show").removeClass('show')
    $(".buttonContainer." + pageToOpen).addClass('show')

    if(SYSTEM == "KKR"){
        $(".buttonContainer.obyu").removeClass('show')
    }
    else{
        $("#assetProcess").removeClass('show')
        if(localStorage.project_owner == "UTSB"){
            $("#constructionProcess").removeClass('show')
        }
    }

    // hide if no subButtonContainer
    $('.subButtonContainer').each(function(){
        if($(this).html() == ''){
            $(this).parent().removeClass("show");
        }
    })

    //hide and show enlarge button
    $(".mainContainer .enlargeContainer."  + pageToOpen).addClass("active")
    $(".mainContainer .enlargeContainer."  + pageToOpen).show()

    //hide and show print button
    $(".mainContainer .enlargeContainer .printButton.myDashboard").hide()
    if(pageToOpen == "myDashboard"){
        $(".mainContainer .enlargeContainer .printButton.myDashboard").show()
    }

    //Deactivate active button
    $(".mainAppButton.active span.active").removeClass('active')
    $(".mainAppButton.active").removeClass('active')

    //activate button
    $(mainButton).addClass('active')
    $(mainButton).children('span').addClass('active')

    //show opacity for submenu button
    $(".subMenuButtonContainer").css('opacity', '1')
}

/*
* Original printCntent function w/o modifcations
* commented this out first for reference
*/
// function printContent(){
//     var tabsActive = $('#dashboardSideMenu .subButton.active').attr("id")
//     if(tabsActive == "heavyMaintenanceDash"){
//         $('#myDashboard')[0].contentWindow.$('.columnToRow').css({'height': '500px', 'overflow': 'visible'})
//     }else if(tabsActive == "pcaStripmapDash" || tabsActive == "nodDash"){
//         $('#myDashboard')[0].contentWindow.$('.tableFullWidth').attr('style', 'width: 290mm !important')
//     }
//     $('#myDashboard')[0].contentWindow.postMessage({functionName:'print'})
//     $('#myDashboard')[0].contentWindow.$('body').css("height", "700px")
//     $('#myDashboard').css("height", "700px")
//     $('#myDashboard').css("width", "1020px")
// }


let currentRenderedCharts = {};
/**
 * modified printContent() with land and hset
 * land and hset modifications tailored for project_owner = JKR_SABAH
 * and project_phase != 1b only
 * @author Kimberly Umali
 */
function printContent(buttonElement) {
    const iframe = $('#myDashboard')[0];
    const iframeWindow = iframe.contentWindow;
    const iframe$ = iframeWindow.$;
    const tabsActive = $('#dashboardSideMenu .subButton.active').attr("id");

    var isGeneralPrint = buttonElement.dataset.generalPrint;

    // original sizesss
    const originalIframeWidth = $('#myDashboard').css('width');
    const originalIframeHeight = $('#myDashboard').css('height');
    const originalIframeBodyHeight = iframeWindow.$('body').css('height');

    // Safety check for DOM
    if (!iframe || !iframeWindow || !iframeWindow.document) {
        console.error("content not be accessed for printing.");
        $('#myDashboard').css({ width: '', height: '' }); // Revert sizing (original safe state)
        return;
    }
    
    const cleanupPrint = () => {
        // Restore iframe size
        $('#myDashboard').css({ 
            width: originalIframeWidth, 
            height: originalIframeHeight 
        });

        // Restore iframe body
        iframeWindow.$('body').css('height', originalIframeBodyHeight);
        
        // Restore body overflow inside the iframe if it was modified for printing
        iframeWindow.$('body').css('overflow', ''); 
        
        // Remove the listener to prevent it from firing multiple times unnecessarily
        iframeWindow.removeEventListener('afterprint', cleanupPrint);
    };

    /**
     * retain original code before the land and hset modif
     */ 
    if(tabsActive == "heavyMaintenanceDash"){
        $('#myDashboard')[0].contentWindow.$('.columnToRow').css({'height': '500px', 'overflow': 'visible'})
    } else if(tabsActive == "pcaStripmapDash" || tabsActive == "nodDash"){
        $('#myDashboard')[0].contentWindow.$('.tableFullWidth').attr('style', 'width: 290mm !important')
    } else if(['hsetDash', 'landDash'].includes(tabsActive) && isGeneralPrint == "true"
                && localStorage.project_owner == 'JKR_SABAH' && localStorage.project_phase != '1b') {

        const chartIds = ['offerIssuedChart', 'paymentChart', 'demolisedChart']; 

        document.getElementById('from-date-js').value = '';
        document.getElementById('to-date-js').value = '';
        
        // Destroy Highcharts Instances
        for (const id of chartIds) {
            const chart = currentRenderedCharts[id];
            if (chart && chart.destroy) {
                try {
                    chart.destroy();
                } catch (e) {
                    console.warn(`Error destroying chart`, e);
                }
            }
            const chartElement = document.getElementById(id);

            const printChartContentDiv = document.getElementById('print-chart-content');
            printChartContentDiv.style.visibility = "hidden";

            // const landSummaryCard = document.getElementById('land-summary-container');
            if (chartElement) {
                chartElement.innerHTML = '';
                // landSummaryCard.innerHTML = '';
            }
        }

        // card ids (Land, Structures)
        const cardDisplayIds = [
            'offerLand', 
            'offerStructure', 
            'paymentLand', 
            'paymentStructure', 
            'demolishedStructure' 
        ];

        cardDisplayIds.forEach(id => {
            const cardElement = document.getElementById(id);
            if (cardElement) {
                cardElement.textContent = '0/0'; 
            }
        });

        currentRenderedCharts = {};

        /**
         * temp only. will change this latur
         * after UI settled
         */
        const modal = document.getElementById('print-modal-overlay');

        const hsetDashContent = document.getElementById('hset-chart-content');
        const landDashContent = document.getElementById('land-chart-content');

        hsetDashContent.style.display = "none";
        landDashContent.style.visibility = "hidden";


        if (modal) {
            const modalDashContent = tabsActive === 'landDash' ? landDashContent : hsetDashContent;
            const fromDate = document.getElementById('from-date-js');
            const toDate = document.getElementById('to-date-js');
            const printNote = document.querySelector('#print-note small');

            printNote.innerHTML = tabsActive === 'hsetDash' ? '* This filter applies only to the Total Man Hours without LTI (HRS) and HSET Walkabout and Induction bar charts to improve data readability' : '* This filter applies only to vertical bar charts to improve data readability';
            printNote.style.fontSize = tabsActive === 'hsetDash' ? '7px' : '10px';

            fromDate.value = '';
            toDate.value = '';
            modal.style.display = "flex";

            modalDashContent.style.display = tabsActive === 'hsetDash' ? "grid" : "flex";

            iframeWindow.postMessage(
                { command: 'filterCharts' },
                '*'
            );
        }

    } else {
        /**
         * parts of original code
         */
        // resize iframe for printing
        $('#myDashboard')[0].contentWindow.$('body').css("height", "700px")
        $('#myDashboard').css("height", "700px")
        $('#myDashboard').css("width", "1020px")
        
        // Attach the cleanup function to the 'afterprint' event of the IFRAME window
        iframeWindow.addEventListener('afterprint', cleanupPrint);
        
        // postMessage from the original code
        $('#myDashboard')[0].contentWindow.postMessage({functionName:'print'})
    }
}



var legendColorArr = [
                        '#183e65' ,'#1374a7','#64c9de','#188cbb', '#d5eaee',
                        '#ffd19e', '#dc793f', '#896a43', '#552710', '#811701',
                        '#fcc688', '#f1ebcb', '#f3e1ef', '#d9acc9', '#ae75a0',
                        '#633158', '#1a040e', '#456c35', '#778f51', '#acc38b',
                        '#c9c8b4', '#fbfdfc', '#f1d780', '#edcb5f', '#f5b901',
                        '#dc5d01', '#f59201'
                    ]

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('print-modal-overlay');
    if (modal) {
        modal.style.display = "none";
    }
}

const CHART_CONTAINER_ID = 'print-chart-container'; 
const LOADING_OVERLAY_ID = 'chart-loading-overlay';

function manageChartLoading(show) {
    const container = document.getElementById(CHART_CONTAINER_ID);
    const button = document.getElementById('apply-filter'); 
    
    if (!container) {
        console.error(`Chart container with ID '${CHART_CONTAINER_ID}' not found.`);
        return;
    }

    if (show) {
        // Check if overlay already exists (to prevent duplicating it)
        let overlay = document.getElementById(LOADING_OVERLAY_ID);

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = LOADING_OVERLAY_ID;
            overlay.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading Charts... Please wait.';
            
            container.appendChild(overlay); 
        }

        // Disable the button
        if (button) {
            button.disabled = true;
        }

    } else {
        // HIDE LOADING STATE

        // Get the existing overlay element
        const overlay = document.getElementById(LOADING_OVERLAY_ID);
        
        // ⭐ REMOVE THE DIV FROM THE CONTAINER
        if (overlay) {
            container.removeChild(overlay); 
        }
        
        // Re-enable the button
        if (button) {
            button.disabled = false;
        }
    }
}

function setPrintFilterError(errorMessage) {
    const errorEl = document.getElementById('print-chart-error');

    errorEl.textContent = errorMessage;
    setTimeout(() => {
        errorEl.textContent = '';
    }, 1000);
}

// Function to handle the date selection and initiate printing
function applyDateRangeAndPrint(event) { 
    // Add this line at the very beginning to stop the form submission
    if (event) {
        event.preventDefault(); 
    }

    manageChartLoading(true);

    const chartConfigs = [
        { id: 'offerIssuedChart', dataKey: 'offerIssued', title: 'Offer Issued'},
        { id: 'paymentChart', dataKey: 'paymentMade', title: 'Payment Made'}, 
        { id: 'demolisedChart', dataKey: 'demolished', title: 'Demolished'}
    ];

    const fromDate = document.getElementById('from-date-js').value;
    const toDate = document.getElementById('to-date-js').value;

    if (!fromDate || !toDate) {
        setPrintFilterError("Please select both From and To dates.");
        manageChartLoading(false);
        return;
    }

    const renderedCharts = {};
    const dateKeys = getMonthsInRange(fromDate, toDate); 

    if (dateKeys.length === 0) {
        setPrintFilterError("No valid month range selected.");
        manageChartLoading(false);
        return;
    } else if(dateKeys.length > 12) {
        setPrintFilterError("Months limited to 12 Datapoints only");
        manageChartLoading(false);
        return;
    }

    setPrintFilterError("");

    const tabsActive = $('#dashboardSideMenu .subButton.active').attr("id");
    const landChartContent = document.getElementById('land-chart-content');
    const hsetDashContent = document.getElementById('hset-chart-content');

    const chartContent = document.getElementById('print-chart-content');
    const loader = document.getElementById('chart-loading-overlay');
    const chartContainer = document.getElementById(CHART_CONTAINER_ID);
    
    if (loader) {   

        chartContent.style.visibility = 'visible';
        hsetDashContent.style.display = 'none';
        landChartContent.style.visibility = 'visible';
        chartContainer.style.height = '55px';
        chartContainer.style.width = '700px';

        if(tabsActive === "hsetDash"){
            console.log("hset hereeeeee");
            manageChartLoading(false);
            hsetDashContent.style.display = 'grid' 
            landChartContent.style.visibility = 'hidden'
            chartContainer.style.height = '90%';
            chartContainer.style.width = '1020px';

            updateFilterCharts();
            return;
        } 
    }

    fetchChartData()
        .then(chartData => {
            const baseChartData = chartData.data.summary.overall.allDistrict.chart;

            const baseDataCard = (chartData.data.summary && chartData.data.summary['overall'] && chartData.data.summary['overall']['allDistrict']) ? chartData.data.summary['overall']['allDistrict'] : [];

            const renderChart = (divId, plotData, chartName) => {
                var catArr = []; //xAxis "month-year"
                var districtIdxArr = []; // ele == districtnames e.g "Tawau" and "Kota Kinabalu"
                var dataArr = [];
                
                if (plotData && Object.keys(plotData).length > 0) {
                    for (const [mthYr, districtDataObject] of Object.entries(plotData)) {

                        catArr.push(mthYr); 

                        const innerDistrictData = districtDataObject[mthYr];

                        if (innerDistrictData) {
                            for (const districtName in innerDistrictData) {
                                if(!districtIdxArr.includes(districtName)){
                                    districtIdxArr.push(districtName);
                                }
                            }
                        }
                    }

                    var t = 0;
                    districtIdxArr.forEach(ele => {
                        var tempMthYrLand = [];
                        var tempMthYrStruct = [];

                        const masterId = 'master-' + ele.replace(/\s/g, '');
                        const districtColor = legendColorArr[t];
                        
                        catArr.forEach(mthYr => {
                            // Get the specific district data block for this month/year
                            const districtData = plotData[mthYr] && plotData[mthYr][mthYr] ? plotData[mthYr][mthYr][ele] : (plotData[mthYr] ? plotData[mthYr][ele] : null);

                            // Safely extract 'land' and 'structure' for the current district and month
                            const landValue = (districtData && districtData.land) ? parseInt(districtData.land) : 0;
                            const structValue = (districtData && districtData.structure) ? parseInt(districtData.structure) : 0;
                            
                            // This is where you populate the arrays based on the existence of the data keys
                            tempMthYrLand.push(landValue);
                            tempMthYrStruct.push(structValue);

                        });

                        dataArr.push({ 
                            id: masterId,
                            name: ele, 
                            color: districtColor,
                            type: 'column',
                            data: [0], 
                            showInLegend: true, 
                            visible: true,
                            custom: { district: ele } 
                        });

                        if (tempMthYrLand.some(val => val > 0)) {
                            dataArr.push({ 
                                name: ele + ' - Land', 
                                data: tempMthYrLand, 
                                stack: 'Land', 
                                color: districtColor, 
                                linkedTo: masterId,
                                showInLegend : false,
                                visible: true,
                            });
                        }

                        // 3. STRUCTURE SERIES: (Conditional visibility fix)
                        if (tempMthYrStruct.some(val => val > 0)) {
                            dataArr.push({ 
                                name: ele + ' - Structure',
                                data: tempMthYrStruct, 
                                stack: 'Structure',
                                color: districtColor,
                                linkedTo: masterId,
                                showInLegend : false,
                                visible: true,
                            });
                        }
                        
                        t++;
                    });
                }

                if (window.Highcharts) {

                    const chartInstance = Highcharts.chart(divId, {
                            chart: {
                                type: 'column',
                                height: 242, 
                                width: 800, 
                                borderWidth: 0,
                            },
                            title: { 
                                text: chartName,
                                style: {
                                    fontSize: '9px',
                                    color: 'black'
                                }
                            },
                            xAxis: { 
                                categories: catArr,
                                lineWidth: 0,
                                labels: {
                                    rotation: -60,
                                    style: {
                                        fontSize: '10px'
                                    }
                                }
                            },
                            yAxis: {
                                allowDecimals: false,
                                tickInterval: 5,
                                min: 0,
                                title: {
                                    text: ''
                                },
                                lineWidth: 0,
                                tickLength: 0,          
                                stackLabels: {
                                    enabled: true,
                                    allowOverlap: true,
                                    rotation: -90,
                                    y: -50,
                                    verticalAlign: 'middle',
                                    style: {
                                        color: 'black',  
                                        fontSize: '8px',
                                        textOutline: 'none'
                                    },
                                    formatter: function () {
                                        return this.stack;     
                                    }
                                }
                            },
                            legend: {
                                align: 'right',         
                                verticalAlign: 'top',   
                                layout: 'vertical',     
                                x: 30,                 
                                y: 20,                  
                                width: 150,
                                symbolHeight: 7,        
                                symbolWidth: 7,         
                                itemStyle: {
                                    fontSize: '9px',
                                },
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal',
                                    grouping: true,
                                    pointPadding: 0.05,
                                    pointWidth: 12,
                                    groupPadding: 0.2,
                                    borderWidth: 0,
                                    allowPointSelect: true,
                                    cursor: 'pointer'
                                }
                            },
                            series: dataArr,
                            credits: false,
                    });
                        
                    return chartInstance;
                } else {
                    document.getElementById(divId).innerHTML = `No ${chartName} 
                        data available for this range.`;
                    return;
                }
            };

            chartConfigs.forEach(config => {
                const { id, dataKey, title } = config;
                
                const filteredPlotData = {};

                let processTotalsFINAL = {}; 

                dateKeys.forEach(({ year, month }) => {

                    if (baseChartData[year]) {
                        const monthData = baseChartData[year][month];
                        
                        if (monthData && monthData[dataKey]) {
                            var chartKey = month + '-' + year; 
                            filteredPlotData[chartKey] = monthData[dataKey];
                        }
                    }

                    if (baseDataCard) {
                        /**
                         * as per request data for cards 
                         * must not follow the filter range
                         * Keeping this commented for reference
                         */
                        // let monthAllNoData = baseDataCard.card 
                        //                 && baseDataCard.card[year] 
                        //                 && baseDataCard.card[year][month] 
                        //                 && baseDataCard.card[year][month].allNo;

                        /**
                         * defaulted to All
                         */
                        let monthAllNoData = baseDataCard.card 
                                            && baseDataCard.card.all 
                                            && baseDataCard.card.all.all 
                                            && baseDataCard.card.all.all.allNo;

                        if (monthAllNoData) {
                            processTotalsFINAL = monthAllNoData; 
                        }
                    }
                });

                updateCardDisplays(processTotalsFINAL);

                const chartInstance = renderChart(id, filteredPlotData, title);

                if (chartInstance) {
                    renderedCharts[id] = chartInstance;
                }

            });

            setTimeout(() => {
                closeModal(renderedCharts, chartConfigs.map(c => c.id));
                manageChartLoading(false);
                printDiv('print-chart-container');
            }, 500); 
        })
        .catch(error => {
            alert("Failed to load chart data. Please check your date range and connection.");
            manageChartLoading(false);
            console.error("Chart drawing failed:", error);
        });
}

/**
 * On print preview
 */
function updateCardDisplays(totals) {
    const keys = ['demolishedStructure', 'offerLand', 'offerStructure', 'paymentLand', 'paymentStructure'];

    keys.forEach(key => {
        const cardElement = document.getElementById(key); 

        const valueToDisplay = totals[key]; 

        if (cardElement) {
            // Check if the value exists
            if (valueToDisplay !== undefined && valueToDisplay !== null) {
                 cardElement.textContent = valueToDisplay;
            } else {
                 cardElement.textContent = "0/0";
            }
        }
    });
}


/**
 * from sir JP HSET Modifications related
 * modified by Ms Rayleen
 */
function updateFilterCharts() {
    const iframeWindow = $('#myDashboard')[0].contentWindow;
    var selWPC = $('.packFilter.myDashboard').val();
    var selYear = $('.yrFilter.myDashboard').val();
 
    var selMonth = $('.mthFilter.myDashboard').val();
    selWPC = (selWPC) ? selWPC : 'overall';
 
    iframeWindow.postMessage(
        { command: 'updateFilterCharts', wpc : selWPC, year : selYear,  month: selMonth},
        '*'
    )
}

function printDiv(divId) {
    const printChartFilter = document.getElementById('print-chart-filter');

    printChartFilter.style.display = 'none';

    const tabsActive = $('#dashboardSideMenu .subButton.active').attr("id");

    let content = document.getElementById(divId).innerHTML;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;

    iframeDoc.open();
    const bodyTag = document.getElementsByTagName('body')[0];
    const headerColors = {
        digile: '#2f3e5a',
        laser: '#301d78',
        darling: '#861a22',
        matcha: '#789048',
        dark: '#135ea0',
        light: '#1e88e5',
        default: '#1e88e5'
    }
    let headerColor = '';

    for (const cls of bodyTag.classList) {
        if (Object.hasOwn(headerColors, cls)) {
            headerColor = headerColors[cls];
            content = content.replace(/#2f3e5a/gi, headerColor);
            break;
        }
    }

    if(tabsActive === "hsetDash"){
        iframeDoc.write(
            '<html>' +
            '<head>' +
                '<title>HSET Dashboard Print Preview</title>' +
                '<style>' +
                    '* { box-sizing: border-box; }' +
                    
                    '@media print {' +
                        '@page {' +
                            'size: A4 landscape !important;' +
                            'margin: 0 !important;' + 
                        '}' +

                        'html, body {' +
                            'margin: 0 !important;' +
                            'padding: 0 !important;' +
                            'width: 100% !important;' +
                            'height: 100% !important;' +
                            'overflow: visible !important;' + 
                        '}' +

                        'body {' +
                            'position: relative !important;' +
                            'display: block !important;' +
                            'top: 0 !important;' +
                        '}' +

                        '#hset-chart-content {' +
                            'width: 100% !important;' +
                            'height: 100% !important;' +
                            'position: absolute !important;' +
                            'top: 0 !important;' +
                            'left: 0 !important;' +
                            'margin: 0 !important;' +
                            'padding: 10mm !important;' + /* Added safe padding */
                            'page-break-inside: avoid !important;' +
                        '}' +

                        /* Force images and charts to stay within 1 page */
                        'svg, img, .chart-container {' +
                            'max-height: 85vh !important;' + /* Leaves room for titles/headers */
                            'width: auto !important;' +
                            'display: block !important;' +
                            'margin: 0 auto !important;' +
                        '}' +
                        
                        /* Adjust scaling if content is still too big */
                        '.print-content-wrapper {' +
                            'zoom: 95% !important;' +
                        '}' +
                    '}' +

                    /* Header colors - Keeping your existing logic */
                    '[id^="hset-summ-"] > div:first-child,' +
                    '[id^="land-summ-"] > div:first-child {' +
                        'background-color: ' + headerColor + ' !important;' +
                        'color: white !important;' +
                    '}' +
                '</style>' +
            '</head>' +
            '<body>' +
                '<div class="print-content-wrapper">' + content + '</div>' +
            '</body>' +
            '</html>'
        );
    } else {
        iframeDoc.write(
            '<html>' +
                '<head>' +
                    '<title>Land Dashboard Print Preview</title>'+
                    '<style>' +
                    '[id^="land-summ-"] > div:first-child, ' +
                    '.structureHeader {' +
                    '    background-color: '+ headerColor +' !important;' +
                    '    color: white !important;' +
                    '}' +
                    '@media print {' +
                        '@page {' +
                            'size: A4 landscape !important;' +
                            'margin: 0mm;' +  /* this affects the margin in the printer settings */
                        '}' +
 
                        'body {' +
                            'margin: 0 !important;' +
                            'padding: 0 !important;' +
                        '}' +
 
                        '#land-chart-content {' +
                            'height: 100vh !important;' + /* Force it to fill the printed page exactly */
                            'padding: 5mm;' +             /* Control your own spacing here */
                            'page-break-after: avoid;' +
                            'page-break-before: avoid;' +
                        '}' +
 
                        /* Hide scrollbars just in case */
                        '* {' +
                            'overflow: hidden !important;'+
                        '}' +
 
                        '.charts,' +
                        '#charts-container {' +
                            'width: 100% !important;' +
                            'min-width: 800 !important;' +
                        '}' +
    
                        '.highcharts-stack-labels {' +
                            'opacity: 1 !important;' + /* Ensure visibility */
                        '}' + 
                    '}' +
                    '</style>' +
                '</head>' +
                '<body>' + content + '</body>' +
            '</html>'
        );
    }

   
    iframeDoc.close();

    iframe.contentWindow.focus();
    

    iframe.contentWindow.onafterprint = () => {
        printChartFilter.style.display = 'flex';
        const tabsActive = $('#dashboardSideMenu .subButton.active').attr("id");

        if(tabsActive === "hsetDash"){
            const hsetDashContent = document.getElementById('hset-chart-content');
            const chartContent = document.getElementById('print-chart-content');
            const chartContainer = document.getElementById(CHART_CONTAINER_ID);
        
            chartContent.style.visibility = 'hidden';
            hsetDashContent.style.display = 'none';
            chartContainer.style.height = '55px';
            chartContainer.style.width = '700px';
        }
    };
    iframe.contentWindow.print();

    setTimeout(() => document.body.removeChild(iframe), 1000);
}

function getMonthsInRange(start, end) {
    const [startMonth, startYear] = start.split('-').map(Number);
    const [endMonth, endYear] = end.split('-').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 1); 

    /**
     * Check for parsing failure
     */ 
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return [];
    }
    
    const dateArray = [];
    let currentDate = startDate;

    // Loop till currentDate moves past the endMonth and endYear
    // We compare Year, then Month, to ensure we include the final month's data.
    while (
        currentDate.getFullYear() < endDate.getFullYear() ||
        (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() <= endDate.getMonth())
    ) {
        const year = currentDate.getFullYear().toString();
        // Month is 0-indexed, so we add 1, then use padStart to get "03" format
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        
        dateArray.push({ 
            year: year, 
            month: month 
        });
        
        // Move to the next month (setMonth handles year rollover automatically)
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dateArray;
}

function fetchChartData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../Dashboard/chartData.json.php',
            type: 'POST', 
            dataType: 'json', 
            data: { page: "land" },
            success: function(data) {
                if (data && typeof data === 'object') {
                    resolve(data);
                } else {
                    reject(new Error("Server returned success but data format is invalid."));
                }
            },
            error: function(xhr, status, error) {
                console.error("Error during data fetch:", status, error);
                reject(error);
            }
        });

    });

}

//function to handle show loader (called in sysadminv3.js)
showLoaderHandler = () =>{
    $('.loader').fadeIn()
}

//function to handle hide loader (called in sysadminv3.js)
hideLoaderHandler = () =>{
    $('.loader').fadeOut()
}

const breakpointChecker = function(viewPref, pageOpen) {
    const screenSizeWidth = $(window).width();
    if(screenSizeWidth <= 1024){
        return enableSwiperTablet('', pageOpen);
    }else{
        var elem = $("#toggleView input[type=checkbox]");

        if(viewPref == 'on'){
            elem.prop( "checked", false);
        }

        enableSwiper(viewPref, pageOpen);
    }
};

enableSwiperTablet = (condition = '', pageOpen) =>{
    $(".columnHidden").removeClass("show");
    $(".columnHidden").siblings().removeClass("toggle-on");

    setTimeout(function(){
        if(pageOpen == "myTask"){
            var swiper2 = new Swiper(".mainPage.myTask", {
                slidesPerView: 1,
                spaceBetween: 30,
                slidesPerGroup: 1,
                grabCursor: true,
                allowTouchMove: true,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                breakpoints:{
                    1024:{
                        slidesPerView: 2,
                    },
                }
            });
            swiper2.slideTo(0);
        }else{
            var swiper = new Swiper(".mainPage.myProject", {
                slidesPerView: 1,
                spaceBetween: 30,
                slidesPerGroup: 1,
                grabCursor: true,
                allowTouchMove: true,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                breakpoints:{
                    1024:{
                        slidesPerView: 2,
                    },
                }
            });
            swiper.slideTo(0);
        }
    })

    $("#toggleView").hide()
}

enableSwiper = (condition = 'off', pageOpen) =>{
    var slideView;

    if(condition == 'on'){
        slideView = 1;

        $(".columnHidden").addClass("show");
        $(".columnHidden").siblings().addClass("toggle-on");

        $(".mainPage.myTask .column").not("#noTask").css('flex', 'none');
    }else{
        slideView = 2;

        $(".columnHidden").removeClass("show");
        $(".columnHidden").siblings().removeClass("toggle-on");

        $(".mainPage.myTask .column").not("#noTask").css('flex', '');
    }

    setTimeout(function(){
        if(pageOpen == "myTask"){
            var swiper2 = new Swiper(".mainPage.myTask", {
                slidesPerView: slideView,
                spaceBetween: 30,
                slidesPerGroup: 1,
                grabCursor: false,
                allowTouchMove: false,
                grabCursor: false,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
            });            
            swiper2.slideTo(0);
        }else{
            var swiper = new Swiper(".mainPage.myProject", {
                slidesPerView: slideView,
                spaceBetween: 30,
                slidesPerGroup: 1,
                grabCursor: false,
                allowTouchMove: false,
                grabCursor: false,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
            });
            swiper.slideTo(0);
        }

    }, 100)

    $("#toggleView").show()
}

jQuery(window).on("orientationchange resize", function(){
    breakpointChecker(localStorage.view_pref, localStorage.page_pageOpen)
})

$(function () {
    //.ico based on theme
    var themeIco = ($('.sysMode:checked').val()) ? $('.sysMode:checked').val() : 'default';

    if(themeIco == 'digile'){
        $('#titleIcon').attr('href', '../Images/theme_icon/Twinsights_brand_digile.png');
        $('#titleDesc').html('Twinsights');
    }else{
        $('#titleIcon').attr('href', '../revicons.ico');
        $('#titleDesc').html('Reveron Insights');
    }

    //for myProject break pages
    breakpointChecker(localStorage.view_pref, localStorage.page_pageOpen)

    //selectize for new project in system admin
    contractorSelect = $('#contractorSelector').selectize({
        placeholder: "Please Select ...",
        maxItems: 1,
        highlight: true,
        onChange: function (value) {
            OnChangeContractorSelection(value);
        }
    });

    if(SYSTEM == 'OBYU'){
        consultantSelect = $('#consultantSelector').selectize({
            placeholder: "Please Select ...",
            maxItems: 1,
            highlight: true,
            onChange: function (value) {
                OnChangeConsultantSelection(value);
            }
        });
    }else{
        consultantSelect = $('#consultantSelector').selectize({
            placeholder: "Please Select ...",
            maxOptions: 10,
            highlight: true,
            onChange: function (value) {
                OnChangeConsultantSelection(value);
            }
        });
    }

    //draggable window for conop dashboard link
    $("#resizable, #resizableDetach, #resizableGantt").resizable();
    $("#widgetConop, #detactedWidget, #widgetGanttChart").draggable({
        iframeFix: true,
        start: function(event, ui) {
            isDraggingMedia = true;
        },
        stop: function(event, ui) {
            isDraggingMedia = false;
        }
    });

    $("#resizable").mousedown(function(){
        $("#widgetIframe").css("pointer-events", "none");
        $("#myDashboard").css("pointer-events", "none");
        $("#myDocument").css("pointer-events", "none");
        $("#myFinance").css("pointer-events", "none");
    })

    $("#resizable").mouseup(function(){
        $("#widgetIframe").css("pointer-events", "auto");
        $("#myDashboard").css("pointer-events", "auto");
        $("#myDocument").css("pointer-events", "auto");
        $("#myFinance").css("pointer-events", "auto");
    })

    $("#resizableGantt").mousedown(function(){
        $("#ganttShow").css("pointer-events", "none");
    })

    $("#resizableGantt").mouseup(function(){
        $("#ganttShow").css("pointer-events", "auto");
    })

    $("#resizableDetach").mousedown(function(){
        $("#detachWidgetIframe").css("pointer-events", "none");
        $(".mainPage.myInsights").css("pointer-events", "none");
    })

    $("#resizableDetach").mouseup(function(){
        $("#detachWidgetIframe").css("pointer-events", "auto");
        $(".mainPage.myInsights").css("pointer-events", "auto");
    })

    //toggle filter for icon only
    $('.sortHandler span button.control').click(function(event){ 
        event.stopPropagation(); // Prevent parent handlers from triggering

        // Reset all other sort icons to "unset"
        $('.sortHandler span button.control').not(this).each(function() {
            $(this).css("display", "none"); 
            if ($(this).hasClass("unset")) {
                $(this).css("display", "inline-block"); 
            }
        });

        
        // Handle the clicked button
        const $currentButton = $(this);
        const $currentGroup = $currentButton.parent(); 

        
        $currentGroup.find('button.control').css("display", "none"); 

        if ($currentButton.hasClass("asc")) {
            $currentGroup.find('button.control.desc').css("display", "inline-block");
        } else if ($currentButton.hasClass("desc")) {
            $currentGroup.find('button.control.asc').css("display", "inline-block"); 
        } else if ($currentButton.hasClass("unset")) {
            $currentGroup.find('button.control.desc').css("display", "inline-block"); 
        }
    })

    //toggle filter for whole button
    $('.sortHandler span.sort').click(function(){
        
        $('.sortHandler span.sort').not(this).each(function() {
            $(this).find('.control').css("display", "none");  
            $(this).find('.control.unset').css("display", "inline-block"); 
        });
 
        var classesName = '.'+$(this).find('div:visible').attr('class').split(' ').join('.')

        if($(this).find('div:visible').hasClass("asc")){
            $(this).find('div:visible').css("display", "none")
            $(this).find(classesName).next(".control:first").css("display", "inline-block")
        }else if($(this).find('div:visible').hasClass("desc")){
            $(this).find('div:visible').css("display", "none")
            $(this).find(classesName).prev(".control:first").css("display", "inline-block")
        }else if($(this).find('div:visible').hasClass("unset")){
            $(this).find('div:visible').css("display", "none")
            $(this).find(classesName).siblings(".desc").css("display", "inline-block")
        }
    })

    //default width when print & dashboard loader
    window.addEventListener("message", (event) => {
        if(event.origin != location.origin) return;

        if (event.data && event.data.command && event.data.command === 'overallPrintChartUpdated') {
            setTimeout(() => {
                printDiv('print-chart-container');
            }, 980);
            return;
        }

        if(event.data && event.data.functionName && event.data.functionName == 'defaultWidth'){
            $('#myDashboard').css("width", "")
            $('#myDashboard').css("height", "")
            $('#myDashboard')[0].contentWindow.$('body').css("height", "")

            if(localStorage.isParent !== 'isParent' && localStorage.project_owner == 'MRSB'){
                $('#myDashboard')[0].contentWindow.$('#packageCost').css("display", "inline-flex")
            }
        }else if(event.data && event.data.functionName && event.data.functionName == 'loaderajaxStart'){
            $('.loader').fadeIn();
            
        }else if(event.data && event.data.functionName && event.data.functionName == 'loaderajaxEnd'){
            $('.loader').fadeOut();
        }
    })
    
    //from email url
	var url_string = window.location.href
	var url = new URL(url_string);

    //DOCUMENT EMAIL
    var action = url.searchParams.get("action");
    if (action == 'openCorrNoti') {
        // Add acknowledge flag, add package uuid
        var corrId = url.searchParams.get("id");
        var packId; 
        if (SYSTEM == "OBYU" && localStorage.user_org == 'MRSB') {
            packId = url.searchParams.get("package");
        } 
        else {
            packId = url.searchParams.get("pidName");
        }
        var prevact = url.searchParams.get("prevact");
        var packUuid = url.searchParams.get("package_uuid");
        var actuserid = url.searchParams.get("actuserid");
        var package = url.searchParams.get("package");
        var project_owner = url.searchParams.get("project_owner") || '';

        if(packUuid == null){
            packUuid = package
        }

        var extraParam = '&package_id=' + packId + '&prevact=' + prevact + '&corr_id=' + corrId + '&package_uuid=' + packUuid;

        checkingJogetLogin();
        
        setTimeout(function() {
            if (SYSTEM == 'KKR') {
                openFromEmail(actuserid, 'documentInbox', 'acknowledge', extraParam, project_owner);
            } else {
                extraParam += '&actuserid=' + actuserid;
                openFromEmail(corrId, 'documentInbox', 'Respond/View', extraParam);
            }
        }, 1000);
    }

    //FINANCE EMAIL
    var actid = url.searchParams.get("actid");
	var processname = url.searchParams.get("p");
	var is_pfs_asset = url.searchParams.has("pfs_asset");

    if(actid && processname){
        if(is_pfs_asset){
            // FINANCE EMAIL - ASSET
		    openFromEmail(actid, 'FinanceAssetInbox', processname);
        }else{
		    openFromEmail(actid, 'financeInbox', processname);
        }
    }

    //CONSTRUCT EMAIL
	var constructActID = url.searchParams.get("actid");
    var assetProcessID = url.searchParams.get("processid");
    
	//to open form for next activity
	if (constructActID && assetProcessID) {
        // ASSET EMAIL
        if(assetProcessID.includes('ri_asset')){
            openFromEmail(constructActID, 'assetInbox');
        }else{
		    openFromEmail(constructActID);
        }
	}

    //MARKUP EMAIL
	var markupId = url.searchParams.get("id");
    var markupView = url.searchParams.get("view");
    
	//to open form for next activity
	if (markupId && markupView) {
        openFromEmail(markupId, 'documentInbox', 'markupView');
	}

	//to open last form either complete/reject/closed
	var iniateConopBrowser = url.searchParams.get("initConop");
	var eleConopBrowser = url.searchParams.get("data");

	if (iniateConopBrowser && eleConopBrowser) {
		openCloseFormV3(iniateConopBrowser, eleConopBrowser);
	}

    //to open notified email without action on mytask
    var recId = url.searchParams.get("id");
    var recProcess = url.searchParams.get("process");
    var recView = url.searchParams.get("view");
    var recPhase = url.searchParams.get("phase");
    
    if (recId && recProcess && recView) {
        openFromEmail(recId, 'constructInbox', 'emailView', recProcess);
	}

    if (recId && recProcess && recView && recPhase) {
        setTimeout(function() {
            if(recPhase == '1B'){
                openFromEmail(recId, 'constructInbox', 'emailView1B', recProcess);
            }else{
                openFromEmail(recId, 'constructInbox', 'emailView1A', recProcess);
            }
        }, 1000);
	}

    //for signout when not active
    inactivityTime();
    
    if(localStorage.page_pageOpen != "myDashboard" && localStorage.page_pageOpen != "myReporting"){
        dataTask();
    }

    $( ".navBox" ).resizable({ handles: "w" })
    $( ".jogetList" ).resizable({ handles: "n" })

    //On window resize
    $(window).resize(function () {
        if($(window).width() <= 768){
            $(".row").find(".buttonContainer").css('display','none')

            $(".tableContainer .projectContainer").css("display","none")
            $(".tableContainer .projectContainer").removeClass('active')
            $(".tableContainer .projectContainerList").css("display","block")
            $(".tableContainer .projectContainerList").addClass('active')
        }
    })

    //When clicking other place in the page, close active:
    $(window).click(function() {
        //close profilebar  
        $(".profileBar.active").find("span.atag a").hide()
        $(".profileBar.active").animate({width: 'toggle'}, 150)
        $(".profileBar.active").removeClass('active');

        //close profilebar
        $(".appsbar.active").find("span.atag a").hide()
        $(".appsbar.active").animate({ width: 'toggle' }, 150, function () {
            $(".appsbar").css('display', 'none');
            $(".appsbar.active").removeClass('active');
        });

        // //close datepicker for myTask
        $('#ui-datepicker-div').hide()

        //close metadata details layer
        $("#metadataDetails.active").removeClass("moreInfo small")
        $("#metadataDetails.active").html("")
        $("#metadataDetails.active").removeClass("active")
    });

    //Stops appsbar from closing when click
    $('.appsbar').click(function(event){
        event.stopPropagation();
    });

    //Stops profilebar from closing when click
    $('.profileBar').click(function(event){
        event.stopPropagation();
    });

    //Stops datepicker from myTask closing when click
    $('input[name="dfrom"]').click(function(event){
        if($('#ui-datepicker-div').is(':hidden')){
            $('#ui-datepicker-div').show();
        }
        event.stopPropagation();
    });
    $('input[name="dto"]').click(function(event){
        if($('#ui-datepicker-div').is(':hidden')){
            $('#ui-datepicker-div').show();
        }
        event.stopPropagation();
    });
    $('#ui-datepicker-div').click(function(event){
        event.stopPropagation();
    });

    //Stops metadata details from closing when click
    $('#metadataDetails').click(function(event){
        event.stopPropagation();
    });

    //Hide mobile app button when click itself
    $('.mobileAppButton').click(function(event){
        $(this).hide()
    })

    //Stops metadata details from closing when click
    $('#metadataDetails').click(function(event){
        event.stopPropagation();
    });

    //call spectrum
    $("#color-picker").spectrum({
        showInput: true,
        showSelectionPalette: true,
        palette: [ ],
        localStorageKey: "spectrum.homepage",
        preferredFormat: "hex"
    });

    $("#reviewTool-color-picker").spectrum({
        showInput: true,
        showSelectionPalette: true,
        palette: [ ],
        localStorageKey: "spectrum.homepage",
    });

    //stop spin refresh icon
    $( '#lock-refresh' ).click(function() {
        $( this ).children().addClass( 'fa-spin' );
    
        var $el = $(this).children();
        setTimeout(function() { $el.removeClass( 'fa-spin' ); }, 1000);
    });

    //navbar left side menu
    $("#mainMenuButton").click(function(){
        $(".navbarSide").toggleClass('active')
    })

    //wUpdate Floatbox XY on RIContainer resize
    new ResizeObserver(updateFloatBoxV3).observe(RIContainer)

    // This function must live in the PARENT WINDOW's JavaScript environment.
    function reflowAllCharts() {
        const iframe = document.getElementById('myDashboard'); 
        
        if (!iframe || !iframe.contentWindow || !iframe.contentWindow.Highcharts) {
            console.warn("Highcharts not found in iframe or iframe not ready.");
            return;
        }

        const iframeWindow = iframe.contentWindow;

        console.log(`Executing reflow on charts in iframe: ${iframe.id}`);

        if (iframeWindow.Highcharts.charts && iframeWindow.Highcharts.charts.length > 0) {
            iframeWindow.Highcharts.charts.forEach(chart => {
                if (chart) {
                    chart.reflow();
                    console.log(`Reflowed chart: ${chart.renderTo.id}`);
                }
            });
        } else {
            console.warn("No Highcharts instances found in the iframe to reflow.");
        }
    }

    //when clicking close sub menu button 
    $(".closeSubMenu").on('click', function(){
        $(".subMenuButtonContainer").removeClass('active')
        $(".mainAppButton.active").addClass('subMenuOpened')
        $(".mainContainer").removeClass('subMenuOpened')

        setTimeout(reflowAllCharts, 100);
    })

    $(document).on('change', 'input:radio[name="aerialEditCat"]', function() {
        var column2 = $('#aerialEditContainer').children().children().children('.column2')
       
        column2.css('display', 'flex')
    });

    $(".tile").click(function(){
        let parentID = $(this).data("parentid")
        $(this).find(".buttonContainer").css("display","grid")
        if($(this).hasClass("package")){
            $(`.tile[data-parentid='${parentID}']`).removeClass('active')
            $(`.tile.active`).css("visibility","hidden")//("background", "var(--tile-disabled)")
        }else if($(this).hasClass("project")){
            $(`.tile[data-parentid='${parentID}']`).removeClass('active')
            $(`.tile.active`).css("visibility","hidden")//("background", "var(--tile-disabled)")
        }
    })

    $(".tile").on('mouseleave',function(){
        $(this).find(".buttonContainer").fadeOut()
        $(".tile").addClass('active')
        $(`.tile.active`).css("visibility","visible")//("background", "var(--top)")

    })

    $(".row").on('mouseenter',function(){
        if($(window).width() >= 768){
            $(this).find(".buttonContainer").css('display','inline-block')
        }
    })

    $(".row").on('mouseleave',function(){
        $(this).find(".buttonContainer").fadeOut(50)
    })

    //toggle button for display view by page myProject and myTask container
    $('#toggleView input[type=checkbox]').click(function(){
        var viewVal = '';

        if(this.checked == false){
            viewVal = 'on';
            localStorage.view_pref = 'on';
            enableSwiper('on')
        }else{
            viewVal = 'off';
            localStorage.view_pref = 'off';
            enableSwiper()
        }

        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: '../Login/postlogin_processingv3.php',
            data: {
                functionName: 'saveViewPref',
                viewVal: viewVal,
            },
            success: function(){
                console.log()
            }
        });
    })

    //toggle button for display project container
    $('#toggleContainer input[type=checkbox]').click(function(){
        if($('.projectContainer').hasClass('active')){
            $('.projectContainer').removeClass('active')
            $('.projectContainerList').addClass('active')
            $('.projectContainerList').fadeIn()
            $('.projectContainerList').css('display', 'block')
            $('.projectContainer').css('display', 'none')
        }
        else{
            $('.projectContainerList').removeClass('active')
            $('.projectContainer').addClass('active')
            $('.projectContainerList').css('display', 'none')
            $('.projectContainer').fadeIn()
            $('.projectContainer').css('display', 'block')
        }
    })

    $(".row.project").click(function(event){
        let rel = $(this).attr('rel')
        if(event.target.nodeName == "BUTTON"){

        }else{
            if(!$('[id='+rel+']').hasClass('show')){
                $('[id='+rel+']').addClass('show')
                $('[id='+rel+']').find('.row.package').slideDown(200)

                $('[id='+rel+']').find('.row.package').css('display','flex')
            }else{
                $('[id='+rel+']').removeClass('show')
                $('[id='+rel+']').find('.row.package').slideUp(200)
            }
        }
    })

    //display maximize screen for wizard window
    $(".maximizebutton").on("click", function () {
        var title = $('.modal-header').html()
        var initHeading = 20;
        if ($(this).hasClass("active")) {
            $(this).removeClass("active")
            $(this).children().attr("src", "../Images/icons/form/maximize.png")
            $(this).parent().removeClass("active")

            if(flagReviewTool){
                flagReviewTool = false;
                setReviewTool(cesiumObj)
            }

            if(title == "Show Image"){
                document.querySelector('#viewer').innerHTML = "";
                var addInit = initHeading * (Math.PI / 180);
                earthPhotosphere = new PhotoSphereViewer.Viewer({
                    container: document.querySelector('#viewer'),
                    panorama: url,
                    defaultYaw: addInit
                });
            }
        } else {
            $(this).addClass("active")
            $(this).children().attr("src", "../Images/icons/form/minimizeLightv3.png")
            $(this).parent().addClass("active")

            if(flagReviewTool){
                setReviewTool(cesiumObj)
            }else{
                flagReviewToolMaximize = true;
            }

            if(title == "Show Image"){
                document.querySelector('#viewer').innerHTML = "";
                var addInit = initHeading * (Math.PI / 180);
                earthPhotosphere = new PhotoSphereViewer.Viewer({
                    container: document.querySelector('#viewer'),
                    panorama: url,
                    defaultYaw: addInit
                });
            }
        }
    })

    //Open AppsBar or ProfileBar
    $(".nav-bar .navbarButton").on("click", function (event) {
        let barToOpen = $(this).attr('rel')

        if (!$(`#${barToOpen}`).hasClass('active')) {
            $(`#${barToOpen}`).addClass('active');
            $(`#${barToOpen}`).animate({
                width: 'toggle'
            }, 150, function () {
                $(`#${barToOpen}`).find("span.atag.line-clamp a").fadeIn("150", function(){
                    $(this).css("display", "-webkit-box")
                })
                $(`#${barToOpen}`).find("span.atag a").fadeIn("150")

                if($('#appsBar').hasClass("active")){
                    var height = $(this).children().children().find("#sideBarButtonLink").height();
                    var totalHeight = 200 + height;
                    
                    $('#projectListContainer').css("height", `calc(100vh - ${totalHeight}px)`)
                }
            })
        }else{
            $(`#${barToOpen}`).find("span.atag a").hide()
            $(`#${barToOpen}`).removeClass('active');
            $(`#${barToOpen}`).animate({width: 'toggle'}, 150)
        }

        event.stopPropagation();
    })

    //theme changing
    $("input.sysMode[type=radio]").change(function(){
        let mode = $(this).val()
        let theme
        if(mode == 'default'){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                $("body").removeClass()
                $("body").addClass("dark")
                themeJoget = 'dark'
            }else{
                $("body").removeClass()
                $("body").addClass("light")
                themeJoget = 'light'
            }
            theme = themeJoget
        }else{
            $("body").removeClass()
            $("body").addClass(mode)
            themeJoget = mode;
            theme = mode
        }

        if(theme == 'digile'){
            $('#titleIcon').attr('href', '../Images/theme_icon/Twinsights_brand_digile.png');
            $('#titleDesc').html('Twinsights');
            $('#appWebsite').attr("onclick", "window.open(\'https://digile.com/\')");
        }else{
            $('#titleIcon').attr('href', '../revicons.ico');
            $('#titleDesc').html('Reveron Insights');
            $('#appWebsite').attr("onclick", "window.open(\'https://www.reveronconsulting.com/\')");
        }

        localStorage.themeJoget = themeJoget

        if(localStorage.page_pageOpen) {
            try {
                $('#'+localStorage.page_pageOpen)[0].contentWindow.$('body').removeClass().addClass(themeJoget)
            }
            catch(e){
                $(`iframe#${localStorage.jogetIfame}`)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
            }

            try {
                $('#pavementUploadTable')[0].contentWindow.$('body').removeClass().addClass(themeJoget)
            }
            catch(e){
                console.log('joget iframe inside analysisUpl.php is not set')
            }
        }

        if(localStorage.page_pageOpen == 'myAdmin') {
            try {
                $(`iframe#myAdmin`)[0].contentWindow.$('body').removeClass().addClass(themeJoget)
            }
            catch(e){
                console.log('ifrmae theme not set')
            }

            try {
                $(`iframe#myAdmin`)[0].contentWindow.$('iframe#myAdminInnerFrame')[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
            }
            catch(e){
                console.log('joget iframe inside adminPage.php is not set')
            }
        }

        if($('#resizable').is(":visible")){
            try {
                $('#widgetIframe')[0].contentWindow.$('body').removeClass().addClass(themeJoget)
            }
            catch(e){
                $(`iframe#widgetIframe`)[0].contentWindow.postMessage(themeJoget + '|' + localStorage.inspectFlag, '*');
            }
        }

        theme_mode = themeJoget;

        // to set session for theme and save to db
        $.ajax({
            type: "POST",
            url: '../Login/postlogin_processingv3.php',
            data: {
                functionName: "setThemeMode",
                mode: mode
            }
        });
    })

    //user profile start here
    //edit user profile onclick
    $(".profileuserFooter .readonly #profileuserEdit").on('click', function () {
        $('.picEdit').css({'visibility':'visible', 'opacity':'1', 'transition':'opacity 0.2s, visibility 0.2s'});
        $('.infoPicture').css('pointer-events', 'all');
        edituserstate()
        copyuserinfodivvalue()
    })

    //cancel user profile onclick
    $(".profileuserFooter .editPage #profileuserCancel").on('click', function () {
        $('.picEdit').css({'visibility':'hidden', 'opacity':'0', 'transition':'opacity 0.2s, visibility 0.2s'});
        $('.infoPicture').css('pointer-events', 'none');
        $("#postlogin-profileuserSave").css('display', 'inline-block')
        readonlyuserstate()
    })

    //save user profile onclick
    $(".profileuserFooter .editPage #postlogin-profileuserSave").on('click', function () {
        $('.picEdit').css({'visibility':'hidden', 'opacity':'0', 'transition':'opacity 0.2s, visibility 0.2s'});
        $('.infoPicture').css('pointer-events', 'none');
        event.preventDefault()

        var fname = $('#firstnameprofile').val();
        var lname = $('#lastnameprofile').val();
        var country = $('#countryprofile').val();
        var phone = $('#phonenumberprofile').val();
        //the designation will be hidden until available across sarawak
        var designation = $('#designationprofile').val();

        if(!fname.match(/^[ a-zA-z'.]*$/) || !lname.match(/^[ a-zA-z'.]*$/)) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Invalid Name. Only alphabets, space and \' are allowed. No other special characters are allowed',
            });
            return;
        }

        if ($('#checkresetlabelprofile').prop('checked')) {
            if (!$('#userPasswordprofile').val() || !$('#userConfirmPasswordprofile').val()) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please enter your password!',
                });
                return;
            }
    
            var decimal= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            let $passfieldVal = $("#userPasswordprofile").val()
            if($passfieldVal.match(decimal)){
               
            }else{
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
                });
                return;
            }
        };
        if ($('#checkresetbentleycredentials').prop('checked')) {
            if (!$('#newbentleyusernameprofile').val() || !$('#newbentleypasswordprofile').val()) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please enter your username and password!',
                });
                return;
            }
        };
    
        var formdata = new FormData();
        formdata.append('fname', fname);
        formdata.append('lname', lname);
        formdata.append('country', country); 
        formdata.append('phone', phone);
        formdata.append('designation', designation);
    
        if ($('#checkresetlabelprofile').prop('checked')) {
            var upassword = $('#userPasswordprofile').val();
            formdata.append('password', upassword);
        };
    
        if ($('#checkresetbentleycredentials').prop('checked')) {
            var bentleyuser = $('#newbentleyusernameprofile').val();
            var bentleypass = $('#newbentleypasswordprofile').val();
            formdata.append('bentleyusername', bentleyuser);
            formdata.append('bentleypassword', bentleypass);
        };
        formdata.append('functionName', 'updateUserProfileV3');
    
        // form data for images
        formdata.append('userProfileHeader', $('input#imgWallpaper')[0].files[0]);
        formdata.append('userProfilePic', $('input#imgProfile')[0].files[0]);

        if(SYSTEM == 'OBYU'){
            ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
        }else{
            if(IS_DOWNSTREAM){
                ajaxUrl = '../BackEnd/UserFunctionsSSLR_DS.php';
            }else{
                ajaxUrl = '../BackEnd/UserFunctionsV3.php';
            }
        }

        $.ajax({
            url: ajaxUrl,
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (obj) {
                var response = JSON.parse(obj)
                // update img src
                if (response.updatedHeaderSrc){

                }
                if (response.updatedProfileSrc){
                    $('img.userImage').attr('src', response.updatedProfileSrc);
                }

                if ($('#checkresetlabelprofile').prop('checked')) {
                    $.confirm({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Confirm!',
                        content: 'You\'ll be logged out for the changes to take effect. Please sign in back with your new password.',
                        buttons: {
                            OK: function () {
                                window.open("../signin.php", '_self')
                            }
                        }
                    });
                } else {
                    $("#span_initial").text(fname.substring(0, 1) + lname.substring(0, 1))
                    $("#usernameEmail strong").text("Hi, " + fname)
                    $("#navbar_initial").text(fname.substring(0, 1) + lname.substring(0, 1))
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: response.msg,
                    });
                    readonlyuserstate()
                    copyuserinfoinputvalue()
                }
            }
        })
    })

    //check password onchange
    $('.infoContainerBody-edit #checkresetpasswordprofile').change(function () {
        event.preventDefault()
        if (this.checked) {
            $("input#newbentleyusernameprofile").val("")
            $("input#newbentleypasswordprofile").val("")
            $('.infoContainerBody-edit .resetpasswordcontainer').css('display', 'block')
        } else {
            $('.infoContainerBody-edit .resetpasswordcontainer').css('display', 'none')
        }
    })

    //check password bentley onchange
    $('.infoContainerBody-edit #checkresetbentleycredentials').change(function () {
        event.preventDefault()
        if (this.checked) {

            $('.infoContainerBody-edit .resetbentleycredscontainer').css('display', 'block')
        } else {
            $('.infoContainerBody-edit .resetbentleycredscontainer').css('display', 'none')
        }
    })

    //for confirm password validation css user profile
    $("#userConfirmPasswordprofile").on('keyup', function () {
        if ($(window).width() <= "1366") {
            if (!($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val())) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 45px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("invalid")
                $("input#userPasswordprofile").removeClass("valid")
            } else if ($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val()) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/checked.svg)",
                    "border-color": "#2ECC71",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("valid")
                $("input#userPasswordprofile").removeClass("invalid")
            }
        } else {
            if (!($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val())) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "width": "calc(100% - 45px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "28px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("invalid")
                $("input#userPasswordprofile").removeClass("valid")
            } else if ($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val()) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/checked.svg)",
                    "border-color": "#2ECC71",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("valid")
                $("input#userPasswordprofile").removeClass("invalid")
            }
        }
    })
    $("#userPasswordprofile").on('keyup', function () {
        if ($(window).width() <= "1366") {
            if (!($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val())) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "width": "calc(100% - 45px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("invalid")
                $("input#userPasswordprofile").removeClass("valid")
            } else if ($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val()) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/checked.svg)",
                    "border-color": "#2ECC71",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("valid")
                $("input#userPasswordprofile").removeClass("invalid")
            }
        } else {
            if (!($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val())) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "width": "calc(100% - 45px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "28px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("invalid")
                $("input#userPasswordprofile").removeClass("valid")
            } else if ($("#userConfirmPasswordprofile").val() == $("#userPasswordprofile").val()) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/checked.svg)",
                    "border-color": "#2ECC71",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
                $("input#userPasswordprofile").addClass("valid")
                $("input#userPasswordprofile").removeClass("invalid")
            }
        }
    })
    $("#userConfirmPasswordprofile").on('focusout', function () {
        if ($(window).width() <= "1366") {
            if ($("#userPasswordprofile").hasClass("invalid")) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/cancel.svg)",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "width": "calc(100% - 45px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                    "height": "32px",
                    "background-color": "var(--top)",
                    "border-color": "red",
                })
            } else if ($("#userPasswordprofile").hasClass("valid")) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/checked.svg)",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "height": "32px",
                    "background-color": "var(--top)",
                    "border-color": "transparent",
                })
            }
        } else {
            if ($("#userPasswordprofile").hasClass("invalid")) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "height": "32px",
                    "background-color": "var(--top)",
                })
            } else if ($("#userPasswordprofile").hasClass("valid")) {
                $("input#userConfirmPasswordprofile").css({
                    "background": "url(../Images/icons/gen_button/checked.svg)",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 5px",
                    "height": "32px",
                    "background-color": "var(--top)",
                    "border-color": "transparent",
                })
            }
        }
    })

    //show & hide password
    $("button.password-show").click(function () {
        let inputtochange = $(this).attr("rel")
        let inputConfirmType = $(this).data("confirm")

        $('#' + inputtochange).attr("type", "text");
        $(`button.password-show.${inputConfirmType}`).hide();
        $(`button.password-hide.${inputConfirmType}`).show();
        event.preventDefault();
    });

    $("button.password-hide").click(function () {
        let inputtochange = $(this).attr("rel")
        let inputConfirmType = $(this).data("confirm")

        $('#' + inputtochange).attr("type", "password");
        $(`button.password-hide.${inputConfirmType}`).hide();
        $(`button.password-show.${inputConfirmType}`).show();
        event.preventDefault();
    });

    $("button.password-show-confirm").click(function () {
        let inputtochange = $(this).attr("rel")
        let inputConfirmType = $(this).data("confirm")

        $('#' + inputtochange).attr("type", "text");
        $(`button.password-show-confirm.${inputConfirmType}`).hide();
        $(`button.password-hide-confirm.${inputConfirmType}`).show();
        event.preventDefault();
    });

    $("button.password-hide-confirm").click(function () {
        let inputtochange = $(this).attr("rel")
        let inputConfirmType = $(this).data("confirm")

        $('#' + inputtochange).attr("type", "password");
        $(`button.password-hide-confirm.${inputConfirmType}`).hide();
        $(`button.password-show-confirm.${inputConfirmType}`).show();
        event.preventDefault();
    });
    //userprofile stop here
    
    //Function to change profile picture directly
    $("#imgProfile").change(function () {
        imginp = document.getElementById("imgProfile");
        var pro_Inp = imginp.files[0];
        //filter extension
        var reg = /(.*?)\.(png|bmp|jpeg|jpg)$/;
        if (!pro_Inp.name.toLowerCase().match(reg)) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Input file format is not supported!",
            });
            imginp.value = "";
            $("#profilePic").attr("src", "../Images/defaultProfile.png");
            return;
        }
        //limit file size to 1mb
        if (pro_Inp.size > 524288000) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Maximum file size supported is 500MB!",
            });
            imginp.value = "";
            $("#profilePic").attr("src", "../Images/defaultProfile.png");
            return;
        }
        readURL(imginp);
    });

    //Function to change profile picture directly
    $("#imgWallpaper").change(function () {
        imginp = document.getElementById("imgWallpaper");
        var pro_Inp = imginp.files[0];
        //filter extension
        var reg = /(.*?)\.(png|bmp|jpeg|jpg)$/;
        if (!pro_Inp.name.toLowerCase().match(reg)) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Input file format is not supported!",
            });
            imginp.value = "";
            $("#wallpaperPic").css("background-image", 'url("../Images/icons/ri_v3/wallpaper/default.jpg")');
            return;
        }
        //limit file size to 1mb
        if (pro_Inp.size > 524288000) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Maximum file size supported is 500MB!",
            });
            imginp.value = "";
            $("#wallpaperPic").css('background-image', 'url("../Images/icons/ri_v3/wallpaper/default.jpg")');
            return;
        }
        readURLWallpaper(imginp);
    });


    /////// Function for insights page here ///////

    //function for minimize tool in Insights page
    $(".toggleButton").on('click', function(){
        
        if($(this).hasClass("active") && !$(".toggleText").hasClass("active")){
            $('.toggleText').fadeOut(50)
            $(this).removeClass("active")
            $(this).children().removeClass("fa-angle-up")
            $(this).children().addClass("fa-angle-down")
            $(".leftToggleContainer .tool").css("flex", "unset")
            $('.tool .buttonContainer').slideUp(100)
        }else if($(this).hasClass("active") && $(".toggleText").hasClass("active")){
            $('.toggleText').fadeOut(50)
            $(this).removeClass("active")
            $(this).children().removeClass("fa-angle-up")
            $(this).children().addClass("fa-angle-down")
            $(".leftToggleContainer .tool").css("flex", "unset")
            $('.tool .buttonContainer').slideUp(100)
        }
        else if(!$(this).hasClass("active") && !$(".toggleText").hasClass("active")){
            $('.toggleText').fadeIn(100)
            $(this).addClass("active")
            $(this).children().removeClass("fa-angle-down")
            $(this).children().addClass("fa-angle-up")
            $(".leftToggleContainer .tool").css("flex", "1 1 unset")
            $('.tool .buttonContainer').slideDown(100)
        }else if(!$(this).hasClass("active") && $(".toggleText").hasClass("active")){
            $('.toggleText').fadeIn(100)
            $(this).addClass("active")
            $(this).children().removeClass("fa-angle-down")
            $(this).children().addClass("fa-angle-up")
            $(".leftToggleContainer .tool").css("flex", "1 1 auto")
            $('.tool .buttonContainer').slideDown(100)
        }
        
    })

    $(".toggleText").on('click', function(){
        let child = $(this).children().children('i:last-child')
        
        if($(this).hasClass("active")){
            $(this).removeClass("active")
            child.hide()
            $(".leftToggleContainer .tool").css("flex", "unset")
            $('.tool .buttonContainer .label').fadeOut(100)
        }else{
            $(this).addClass("active")
            child.show()
            $(".leftToggleContainer .tool").css("flex", "1 1 auto")
            $('.tool .buttonContainer .label').fadeIn(100)
        }
        
    })

    //function for minimize tool in Insights page
    $(".closeButton").on('click', function(){
        $(this).parent().parent().hide()
        clearAllFlag();
    })

    //function for opening infoContainer in Insights page
    $(".toolButton").on('click', function(){
        let thingToOpen = $(this).attr('rel')
        let thingToPass = $(this)
        let pageDatalist = thingToPass.data("process")

        if(thingToOpen == 'list'){
            $("#detachWidgetIframe").removeClass().attr("src", "");

            if(pageDatalist == "allListConstruct"){
                $("#conopList").children().removeClass("active")
                $("#detachWidgetConopList").children().removeClass("active")
                $("iframe.jogetDatalist").attr("src", "");
                $(".navBox").css("display","none")
                $(`.jogetList.conopList`).css('display', 'block')
                //update iframe class for detach widget
                $("#detachWidgetIframe").addClass("jogetDatalist");
            }
            else if(pageDatalist == 'bumiList'){
                $(`.jogetList.bumiList`).css('display', 'block')
                //update iframe class for detach widget
                $("#detachWidgetIframe").addClass("bumiDatalist");
                openBumiList();
            }
            else if(pageDatalist == 'allListInventory'){
                $('.buttonTab.parentTab').children().removeClass('active')
                $('.buttonTab.parentTab').removeClass('parent')
                $('.buttonTab.childrenTab').css('display', 'none')
                $("iframe.jogetInventorylist").attr("src", "");
                $(`.jogetList.inventoryList`).css('display', 'block')
                //close maintenance browser list
                $(`.jogetList.maintenanceBrowser`).css('display', 'none')
                //update iframe class for detach widget
                $("#detachWidgetIframe").addClass("jogetInventorylist");
            }
            else if(pageDatalist == 'assetListInventory'){
                $(`.jogetList.assetList`).css('display', 'block')
                openAssetTable();
            }
            else if(pageDatalist == 'maintenanceBrowser'){
                $('.buttonTab.parentTab').children().removeClass('active')
                $('.buttonTab.parentTab').removeClass('parent')
                $('.buttonTab.childrenTab').css('display', 'none')
                $("iframe.maintenanceList").attr("src", "")
                $('.buttonTab.maintenanceList').css('display', '')
                $(".buttonTab.childrenTab").children().removeClass("active")
                $(`.jogetList.maintenanceBrowser`).css('display', 'block')
                //close asset list browser
                $(`.jogetList.inventoryList`).css('display', 'none')
                //update iframe class for detach widget
                $("#detachWidgetIframe").addClass("maintenanceList");
                detectWrap()
            }
            else if(pageDatalist == 'setupList'){
                wizardOpenPage(thingToPass)
            }
            else if(pageDatalist == 'bulkApprovals'){
                $("#bulkApprovalList").children().removeClass("active")
                $("iframe.jogetDatalist").attr("src", "");
                $(".navBox").css("display","none")
                $(`.jogetList.bulkApprovalList`).css('display', 'block')
            }
        }
        else if(thingToOpen == 'insight'){
            checkingJogetLogin()
            wizardOpenPage(thingToPass)
        }
        else if(thingToOpen == 'markupTool'){
            flagMarkupTools = true;
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
            setInstruction('<div class="instruction"><label> Please choose any button to start drawing.</label> <br></div>',thingToOpen)
        }
        else if(thingToOpen == 'drawTool'){
            let relatedPage = thingToPass.data("page")
            $(`.navBox.${thingToOpen}`).css('display', 'flex')

            //close Asset List as we doesnt want it to be conflict function
            $(`.navBox.markAsset`).css('display', 'none')

            openDrawTool(thingToPass)

            if(relatedPage == 'cameraItem' || relatedPage == 'earthViewItem' || relatedPage == 'cameraItem'){
                $(`.navBox.cameraFeed`).css('display', 'flex')
                openCameraFeedItem(thingToPass)
            }
        }
        else if(thingToOpen == 'cameraFeed'){
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
            openCameraFeedItem(thingToPass)
        }
        else if(thingToOpen == 'uploadTool'){
            if (localStorage.project_owner == "UEM_EDGENTA" && localStorage.Project_type == "FM") {
                $("#xmldiv").css("display", "block");
            }else{
                $("#xmldiv").css("display", "none");
            }
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
            $(`.navBox.${thingToOpen}`).find('.buttonTab .tab.active').removeClass('active')
            $(`.navBox.${thingToOpen}`).find('.multiPage .page.active').removeClass('active')

            $(`.navBox.${thingToOpen}`).find('.buttonTab .tab:first').addClass('active')
            $(`.navBox.${thingToOpen}`).find('.multiPage .page:first').addClass('active')

            OnClickKML();
            defaultUploadLayer();
        }
        else if(thingToOpen == 'thematic'){
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
        }
        else if(thingToOpen == 'folderDirectory') {
            flagFolderDirectory = true;
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
            getPWConfig();
        }
        else if(thingToOpen == 'aic'){
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
            $(`.navBox.${thingToOpen}`).find('.buttonTab .tab.active').removeClass('active')
            $(`.navBox.${thingToOpen}`).find('.multiPage .page').css("display", "none")

            $(`.navBox.${thingToOpen}`).find('.buttonTab .tab:first').addClass('active')
            $(`.navBox.${thingToOpen}`).find('.multiPage .page:first').css("display", "block")
        }
        else if(thingToOpen == 'markAsset'){
            clearAllFlag();
            
            $('.navBox.drawTool').css('display', "none")
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
        }
        else if(thingToOpen == 'addIoT'){
            clearAllFlag();
            openDrawTool(thingToPass)
            $('.navBox.addIoT .infoHeader .header').text("Add New IoT Sensor");
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
            OnClickManageIoT(); // to load the list of sensors
            $(`.navBox.manageIoT`).css('display', 'flex')
            OnClickIoTReset();
            
        }
        else if(thingToOpen == 'trackAnimation'){
            console.log("track")
            $(`.navBox.${thingToOpen}`).css('display', 'flex')

            OnClickAnimationFeed()
        }
        else {
            $(`.navBox.${thingToOpen}`).css('display', 'flex')
            if(thingToOpen == "measureTool" && $(this).attr('title') == "Point"){
                $(`.navBox.${thingToOpen}`).css('min-width', '300px')
            }
        }

        //close detach widget list when click insights tool button
        detachWidgetDefault()
    })

    //function to open more info panel from folder directory
    $(".folderMoreInfo").on('click', function() {
        let thingToOpen = $(this).attr('rel')
        
        $(`.navBox#${thingToOpen}`).css('display', 'flex')
    })

    $(".icon.expandLeft").on('mouseenter', function(){
        $(this).css({
            "width" : "110px",
            "display": "flex",
            "justify-content" : "space-evenly",
            "align-items": "center",
            "flex-direction" : "row-reverse"
        })
        $(this).children().addClass('active')
    })

    $(".icon.expandLeft").on('mouseleave', function(){
        $(this).children().removeClass('active')
        $(this).css({
            "width" : "",
            "display": "",
            "justify-content" : "",
            "align-items": "",
            "flex-direction" : ""
        })
    })

    //function for toggling group
    $(".groupHead").on('click', function(){
        let groupToOpen = $(this).attr('rel')
        let group = $(`#${groupToOpen}`)
        let groupParent = $(group).parent()
        let icon = $(this).children('i')

        if($(groupParent).hasClass('active')){
            $(groupParent).removeClass('active')
            $(icon).removeClass('fa-caret-down')
            $(icon).addClass('fa-caret-right')
            $(group).slideUp(70) 

        }else{
            $(groupParent).addClass('active')
            $(icon).removeClass('fa-caret-right')
            $(icon).addClass('fa-caret-down')
            $(group).slideDown(70) 
        }
    })

    //function for vertica line mouse move in image360
    $("#initImage").mousemove(function (event) {
        if (!$("#initImage").hasClass("active")) {
            var clickX = event.offsetX;
            var linePos = clickX - 5;
            $(".verticalLine").css({'left' : linePos})
        }
    })

    const myDiv = document.querySelector('#newsContentContainer')  
    myDiv.addEventListener('scroll', () => {  
      if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight && nLoad) {
        updateNewsFeed(nStart, nEnd)
      }  
    })
    updateNewsFeed(nStart, nEnd)
    //Navigation bar click item//
    //noti message button

    $('.notiContainer').mouseleave(function(){
        if($('#notiMessage').hasClass('active')){
            $('#notiMessage').removeClass('active')
            $('.notiContainer').fadeOut(300)
        }
    })

    $('#notiMessage').bind('hover mouseenter', function() {
        var idTimeout;
    
        if(!$('#notiMessage').hasClass('active')){
            $('#notiMessage').addClass('active')
            notiShow(this)
        }
    
        idTimeout = setTimeout(function() {
            $('.notiContainer').css('display', 'none');
            $('#notiMessage').removeClass('active')
        }, 3000);
    
        $('.notiContainer').on('mouseenter', function() {
            clearTimeout(idTimeout);
        });
    });

    new MutationObserver(function(mutations) {
        mutations.some(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            if(mutation.target && mutation.target.localName == 'iframe'){
                setTimeout(function(){
                    $(mutation.target)[0].contentWindow.postMessage(themeJoget, '*');
                    localStorage.themeJoget = themeJoget
                    localStorage.jogetIfame = $(mutation.target).attr('id')
                }, 800)
            }
            return true;
          }
      
          return false;
        });
    }).observe(document.body, {
        attributes: true,
        attributeFilter: ['src'],
        attributeOldValue: true,
        characterData: false,
        characterDataOldValue: false,
        childList: false,
        subtree: true
    });
})

navBoxTabClick = (p) =>{
    let pageToOpen = $(p).data('page')
    let group = $(p).attr('rel')
    let changeTab = $(p).attr('id')

    if (!$(p).hasClass('active')){
        if(changeTab === "conopJoget"){
            $(`.tab#conopJoget`).removeClass('active')
            openConstructJoget(p)
        }
        else if(changeTab === 'inventoryJoget'){
            $(`.tab.inventoryJoget`).removeClass('active')
            openInventoryJoget(p)
        }
        else if(changeTab === 'maintainJoget'){
            $(`.tab.maintainJoget`).removeClass('active')
            openMaintainJoget(p)
        }
        else if(changeTab === 'conopJogetBulk'){
            $(`.tab.maintainJoget`).removeClass('active')
            openConstructJogetBulkApproval(p)
        }

        if($(p).hasClass("children")){
            $(`.tab.children.active`).removeClass('active')
        }else{
            $(`.tab[rel=${group}]`).removeClass('active')
        }

        if($(p).hasClass('changeName')){
			$(`.tab[rel=${group}]`).addClass('active')
        }else{
            $(p).addClass('active')
        }

        $(`.page.${group}`).removeClass('active')
        $(`.page.${pageToOpen}`).addClass('active')

        if(pageToOpen === "kmldiv"){
			OnClickKML()
		}
		else if(pageToOpen === "shpdiv"){
			OnClickShapefile()
		}
		else if(pageToOpen === "b3dmdiv"){
			OnClickB3DM()
		}
        else if(pageToOpen === "xmldiv"){
			OnClickXML()
		}
        else if(pageToOpen === "finance"){
            $('.infoContainerMainBody.projectView').addClass("finance");
            $('.infoContainerMainBody.projectView').find(".projectView.finance.active").css("height", "100%");
        }else if(pageToOpen === "general"){
            $('.infoContainerMainBody.projectView').removeClass("finance");
            $('.infoContainerMainBody.projectView').find(".projectView.finance").css("height", "");
        }
    }
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
            content: "You'll be logged out in 30 seconds. ",
            autoClose: 'Logout|30000',
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
        time = setTimeout(logout, 1800000) //change this to 10mins - it will trigger when inactive for 10 minutes
        // 1000 milliseconds = 1 second
    }
};

//to set instruction
setInstruction =(t, i)=>{
    $(`.instructionContainer.${i}`).html(t)
}

openMeasureTool =(e)=>{
    flagMeasure = false;

    let type=$(e).data('measure')
    let instruct=$(e).attr('rel')
    //add measure Flag
    if (!flagMeasure) {
        flagMeasure = true;
    } else {
        flagMeasure = false;
    }
    //clear label entity
    for (var i = 0; i < 3; i++) {
        labelEntity[i].label.show = false;
    };

    //clear entity
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    distanceEntity = 0;
    distance = 0;
    distEntities = [];
    flagPosEntities = false;
    positionCounter = 0;

    //change cursor
    $('#RIContainer').css('cursor', "url('../Images/ccrosshair.cur'),auto")

    if (type == 'point'){
        MeasureTool = "Position";
        setInstruction(`<div class="instruction"><b>Point</b></div><div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, instruct)
    }else if (type == 'distance'){
        MeasureTool = "Distance";
        setInstruction(`<div class="instruction"><b>Distance</b></div><div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, instruct)
    }else if (type == 'area'){
        MeasureTool = "Area";
        setInstruction(`<div class="instruction"><b>Area</b></div><div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark</label></div><div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to finish</label></div><div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit tool</label></div>`, instruct)
    }
}

openRIContainerTool = (e) =>{
    let thingToOpen = $(e).attr("rel")
    if(thingToOpen == 'lastminutetool'){
        if($(e).hasClass('activate')){
            $(e).removeClass('activate')
            $(".lastminutetool#ControlDiv").css('display', 'none')
            $(".lastminutetool#ScreenSpaceTool").removeClass('active')
            $(".lastminutetool#ScreenSpaceTool").css('display', 'none')
        }else{
            $(e).addClass('activate')
            $(".lastminutetool#ControlDiv").addClass('activate')
            $(".lastminutetool#ControlDiv").css('display', 'flex')
            $(".lastminutetool#ScreenSpaceTool").addClass('active')
            $(".lastminutetool#ScreenSpaceTool").css('display', 'flex')
            controlBrightness();
        }
    }
}

// AIC Compare Viewer Functions //
function AICViewer() {
    if(SYSTEM == 'KKR'){
        if (!wmsCapabilities) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Aerial Image Function",
                content: "WMS Capabilities is not found",
            });
            wizardCancelPage()
            return
        }
    }

    beforeImageOnChange()
    afterImageOnChange()
}

function initiateAIC() {
    if(SYSTEM == 'OBYU') return 
    
    var packageIdFromSelect = $("#packageDropdown").find(':selected').data('2')
	if (packageIdFromSelect) {
	    aicObj.packageId = packageIdFromSelect
    }

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

	}
}

function beforeImageOnChange() {
    let selectedWMS = ecwFileName[0];

    if(SYSTEM == 'KKR'){
        if (aicObj.beforeWMS) {
            aicObj.beforeMap.removeLayer(aicObj.beforeWMS);
        }
        if (!wmsCapabilities) {
            return
        }

        let layer = wmsCapabilities.Capability.Layer.Layer.find(
            (l) => l.Title === selectedWMS
        );

        //change here l>name !== selectedWMS
        aicObj.projectedViewBefore = layer.BoundingBox[1].crs;
        if (aicObj.projectedViewAfter && aicObj.projectedViewBefore) {
            if (aicObj.projectedViewAfter !== aicObj.projectedViewBefore) {
                console.error("CRS not match");
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Aerial Image Function",
                    content: "Coordinate is not same",
                });
                wizardCancelPage()
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
    }else{
        $(".beforeImage").attr("src", selectedWMS);
    }
}

function afterImageOnChange() {
    let selectedWMS = ecwFileName[1];

    if(SYSTEM == 'KKR'){
        if (aicObj.afterWMS) {
            aicObj.afterMap.removeLayer(aicObj.afterWMS);
        }

        if (!wmsCapabilities) {
            return
        }
        
        let layer = wmsCapabilities.Capability.Layer.Layer.find(
            (l) => l.Title === selectedWMS
        );
        aicObj.projectedViewAfter = layer.BoundingBox[1].crs;
        if (aicObj.projectedViewAfter && aicObj.projectedViewBefore) {
            if (aicObj.projectedViewAfter !== aicObj.projectedViewBefore) {
                console.error("CRS not match");
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Aerial Image Function",
                    content: "Coordinate is not same",
                });
                wizardCancelPage()
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
    }else{
        $(".afterImage").attr("src", selectedWMS);
    }

}

//list out layers exposed as WMS
function getListOfWMS() {
	$.ajax({
		url: `${wmsURL}/rest/workspaces/${aicObj.packageId}/coveragestores`,
		type: "GET",
		beforeSend: function (xhr) {
			xhr.setRequestHeader(
				"Authorization",
				"Basic " + btoa("admin" + ":" + "insightGeo@23#")
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

function closeAllWindow() {
    var videoContainer = document.getElementById("videoContainer");
    var myVideo = $(videoContainer).find("video")[0];
    if ($(videoContainer).find("video")[0]) {
        myVideo.pause();
    }
    if (tempVideoPin) { // remove temp videoPin
        viewer.entities.removeById(tempVideoPin.id);
    }

    for (var i = 0; i < videoPinsArray.length; i++) {
        videoPinsArray[i].show = false;
    }
    if (Cesium.defined(tempVideoPin)) {
        viewer.entities.remove(tempVideoPin);
    };

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };

    if (tempImagePin) {
        viewer.entities.removeById(tempImagePin.id);
    }
    if (earthPinEdit) {
        var i = earthPinIndex;
        var mypin = addEarthPin(earthPinData[i].imagePinName, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, true);
        earthPinsArray.splice(earthPinIndex, 0, mypin);
    }

    $('#ControlDiv.active').css('display', 'none')
    $('#ControlDiv.active').removeClass('active')
    keycontrol_trigger = false;

    $("#ScreenSpaceTool.active").css("display", "none");
    $("#ScreenSpaceTool.active").removeClass("active");

    resetpinpointtoolValue();

    $(".rightclickMenu").removeClass("active")
}

function openProcessOutside(e) {
    let parentProjectId = $(e).data('parentprojectidnumber');
    let packageId = $(e).data('projectidnumber');
    let projectOwner = $(e).data('projectowner');
    let projectPhase = $(e).data('projectphase');

    if(projectOwner == 'SSLR2'){
        $('#progressUploadtemplateFileProj').find('a').attr('href', '../Templates/Progress_Summary_-_Template_sslr.xlsx');
    }else{
        $('#progressUploadtemplateFileProj').find('a').attr('href', '../Templates/Progress_Summary_-_Template.xlsx');
    }

    //change PSU table header
    $('#dashboarditemOutside .tableHeader .M').each(function(i, e){
        checkPSUTableLabel(projectOwner, i, e);
    });

    $.ajax({
        type: "POST",
        url: '../Backend/fetchDatav3.php',
        dataType: 'json',
        cache: false,
        data: {
            functionName: "getAppLink",
            project_id_number: parentProjectId,
            package_id: packageId,
            projectOwner : projectOwner,
            projectPhase : projectPhase
        },
        success: function (obj, textstatus) {
            if(obj.error) {
                alert(obj.error);
                return;
            }
            if (obj) {
                JOGETLINK = obj['jogetApp_link'];
                
                if (localStorage['p_id_name'] == "" || localStorage['p_id_name'] == 'undefined') {
                    loadLayers();
                }

                homeLocation = obj['getHomeLoc'];
                localStorage.user_org = obj['otherDetails'].currUserOrg;
                localStorage.project_owner = obj['otherDetails'].currProjectOwner;
                localStorage.project_phase = projectPhase;

                getProcessDownload(obj['project_data'], obj['getPreloadAccess']['compareArr'], obj['getPreloadAccess']['updateArr'],obj['otherDetails'].project_type);
                loadLayersNewProcess(obj['fetchGeoData']);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        },
    })
}

function readAccessFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

defaultProcessListOnchangeAsset = (currentTier, flagAssetModal) =>{
    var nextTier = currentTier + 1;

    for(let i = nextTier; i <= 3; i++){
        $(`.processListOption${i}`).val("default")
        $(`.processAsset${i}`).css("display", "none")
        $(`.processAsset${i}`).removeClass("assetChoosen")
    }

    if(currentTier == 1 && flagAssetModal == false){
        $(`.processListOption${currentTier}`).val("default")
        $(`.processListOption${currentTier}`).removeClass("assetChoosen")
    }

}

//process list on change asset
processListOnchangeAsset = (e) =>{
    var assetChoosen = $(e).val()
    var assetModal = $(e).data("modal")
    var currentTier = $(e).data("currenttier")
    var nextProcess = $(e).find(':selected').data("nextprocess")
    var createAsset = $(`.processAsset${nextProcess}`)
    var currentPage = $(`.modal-container.${assetModal}`).find(".projectProcess.active").data("page")
    var flagAssetModal = false;

    mode = "process";

    if(assetChoosen == 'RM'){
        var rightProcessAsset2 = '<option value="default">Please Choose</option>';
        secondAssetMenuRM.forEach(function(ele,idx){
            if(ele.y == 'AM'){
                rightProcessAsset2 +=   '<option value="'+ele.y+'" data-nextprocess="3">'+ele.z+'</option>'; 
            }else{
                rightProcessAsset2 +=   '<option value="'+ele.y+'" data-nextprocess="next">'+ele.z+'</option>'; 
            }
        })
    }else if(assetChoosen == 'PM'){
        var rightProcessAsset2 = '<option value="default">Please Choose</option>';
        secondAssetMenuPM.forEach(function(ele,idx){
            rightProcessAsset2 +=   '<option value="'+ele.y+'" data-nextprocess="next">'+ele.z+'</option>'; 
        })
    }else if(assetChoosen == 'EW'){
        var rightProcessAsset2 = '<option value="default">Please Choose</option>';
        secondAssetMenuEW.forEach(function(ele,idx){
            rightProcessAsset2 +=   '<option value="'+ele.y+'" data-nextprocess="next">'+ele.z+'</option>'; 
        })
    }

    $("#processAsset2").html(rightProcessAsset2);
    $("#processTypeAsset2").html(rightProcessAsset2);

    if(assetChoosen == "default"){
        $('.nextPage').css("display","none")
        defaultProcessListOnchangeAsset(currentTier)
    }else{
        if(nextProcess == "next"){
            flagAssetModal = true
            defaultProcessListOnchangeAsset(currentTier, flagAssetModal)
            wizardButtonVisibility(currentPage, mode)
            $('.nextPage').css("display","unset")
            $(e).addClass("assetChoosen")
            if(currentTier == 3){
                $(e).find("#processTypeAsset2").removeClass("assetChoosen")
                $(e).find("#processTypeAsset3").addClass("assetChoosen")
            }
        }else{
            if(currentTier == 1){
                flagAssetModal = true
                defaultProcessListOnchangeAsset(currentTier, flagAssetModal)
            }
            createAsset.css("display", "block")
            $('.nextPage').css("display","none")
        }
    }
}

//process list on change asset bulk export
processListOnchangeAssetBulk = (e) =>{
    var bulkChoosen = $(e).val()
    var nextProcess = $(e).find(':selected').data("nextprocess")
    var currentPage = $(`.modal-container.bulkAsset`).find(".projectProcess.active").data("page")
    var flagAssetModal = false;
    let assetExpList1;
    mode = "process";

    if(bulkChoosen == 'con'){
        assetExpList1 += '<option value="default">Please Choose</option>'
        assetExpList1 += '<option value="condition_bridge_component" data-nextprocess="next">Bridge (Component)</option>';
        assetExpList1 += '<option value="condition_bridge_overall" data-nextprocess="next">Bridge (Overall)</option>';
        assetExpList1 += '<option value="condition_culvert" data-nextprocess="next">Culvert</option>';
        assetExpList1 += '<option value="condition_drainage" data-nextprocess="next">Drainage</option>';
        assetExpList1 += '<option value="condition_pavement" data-nextprocess="next">Pavement</option>';
        assetExpList1 += '<option value="condition_roadfurniture" data-nextprocess="next">Road Furniture</option>';
        assetExpList1 += '<option value="condition_slope" data-nextprocess="next">Slope</option>';
    }else if(bulkChoosen == 'asses'){
        assetExpList1 += '<option value="default">Please Choose</option>'
        assetExpList1 += '<option value="assess_view_bridge" data-nextprocess="next">Bridge</option>';
        assetExpList1 += '<option value="assess_view_culvert" data-nextprocess="next">Culvert</option>';
        assetExpList1 += '<option value="assess_view_drainage" data-nextprocess="next">Drainage</option>';
        assetExpList1 += '<option value="assess_view_pavement" data-nextprocess="next">Pavement</option>';
        assetExpList1 += '<option value="assess_view_roadfurniture" data-nextprocess="next">Road Furniture</option>';
        assetExpList1 += '<option value="assess_view_slope" data-nextprocess="next">Slope</option>';
    }else if(bulkChoosen == 'routine'){
        assetExpList1 += '<option value="default">Please Choose</option>'
        assetExpList1 += '<option value="ScheduleInspection" data-nextprocess="next">Routine Inspection</option>';
        assetExpList1 += '<option value="PictorialReport" data-nextprocess="next">Pictorial Report</option>';
        assetExpList1 += '<option value="LPA" data-nextprocess="next">LPA</option>';
        assetExpList1 += '<option value="maint_view_work_program_annual" data-nextprocess="next">Work Program (Annual)</option>';
        assetExpList1 += '<option value="maint_view_work_program_monthly" data-nextprocess="next">Work Program (Monthly)</option>';
        assetExpList1 += '<option value="maint_view_work_instruction" data-nextprocess="next">Work Instruction</option>';
        assetExpList1 += '<option value="NotificationOfDamage" data-nextprocess="next">NOD Report (Monthly)</option>';
        assetExpList1 += '<option value="site_routine" data-nextprocess="next">Inspector Visit Report</option>';
        assetExpList1 += '<option value="defect_detection" data-nextprocess="next">Defect Register</option>';
        assetExpList1 += '<option value="NotificationOfDefect" data-nextprocess="next">Notification of Defect</option>';
    }else if(bulkChoosen == 'periodic'){
        assetExpList1 += '<option value="default">Please Choose</option>'
        assetExpList1 += '<option value="maint_view_apj" data-nextprocess="next">APJ</option>';
        assetExpList1 += '<option value="maint_view_apj_amendment" data-nextprocess="next">APJ (Ammendment)</option>';
        assetExpList1 += '<option value="maint_view_kpj" data-nextprocess="next">KPJ</option>';
        assetExpList1 += '<option value="maint_view_workorder" data-nextprocess="next">Work Order</option>';
    }else if(bulkChoosen == 'emergency'){
        assetExpList1 += '<option value="default">Please Choose</option>'
        assetExpList1 += '<option value="maint_view_notice_of_emergency" data-nextprocess="next">Notice of Emergency</option>';
        assetExpList1 += '<option value="maint_view_work_daily_report" data-nextprocess="next">Work Daily Report</option>';
        assetExpList1 += '<option value="maint_view_asset_handover" data-nextprocess="next">Asset Handover</option>';
    }

    $("#assetProcesssBulk2").html(assetExpList1);

    if(bulkChoosen == "default"){
        $('.nextPage').css("display","none")
        $('.processAssetBulk2').css("display", "none")
        $('#assetProcesssBulk1 ').removeClass("bulkChoosen")
        $('#assetProcesssBulk2').removeClass("bulkChoosen")
        $('.processAssetBulk2').css('display', 'none')
    }else if(nextProcess == "2"){
        flagAssetModal = true
        wizardButtonVisibility(currentPage, mode)
        $('.processAssetBulk2').css('display', 'flex')
        $('#assetProcesssBulk1').removeClass("bulkChoosen")
        $('#assetProcesssBulk2').addClass("bulkChoosen")
    }else if(nextProcess == 'next'){
        $('.nextPage').css("display","unset")

        if(bulkChoosen == "rfi" || bulkChoosen == "ncp"){
            $('.processAssetBulk2').css("display", "none")
            $('#assetProcesssBulk1').addClass("bulkChoosen")
        }
    }
}

//process list on change asset bulk export outside
processListOnchangeAssetBulkProj = (e) =>{
    var bulkChoosen = $(e).val()
    var nextProcess = $(e).find(':selected').data("nextprocess")
    var currentPage = $(`.modal-container.bulkAssetProj`).find(".projectProcess.active").data("page")
    var flagAssetModal = false;
    let assetExpListOut1;

    mode = "process";

    if(bulkChoosen == 'con'){
        assetExpListOut1 += '<option value="default">Please Choose</option>'
        assetExpListOut1 += '<option value="condition_bridge_component" data-nextprocess="next">Bridge (Component)</option>';
        assetExpListOut1 += '<option value="condition_bridge_overall" data-nextprocess="next">Bridge (Overall)</option>';
        assetExpListOut1 += '<option value="condition_culvert" data-nextprocess="next">Culvert</option>';
        assetExpListOut1 += '<option value="condition_drainage" data-nextprocess="next">Drainage</option>';
        assetExpListOut1 += '<option value="condition_pavement" data-nextprocess="next">Pavement</option>';
        assetExpListOut1 += '<option value="condition_roadfurniture" data-nextprocess="next">Road Furniture</option>';
        assetExpListOut1 += '<option value="condition_slope" data-nextprocess="next">Slope</option>';
    }else if(bulkChoosen == 'asses'){
        assetExpListOut1 += '<option value="default">Please Choose</option>'
        assetExpListOut1 += '<option value="assess_view_bridge" data-nextprocess="next">Bridge</option>';
        assetExpListOut1 += '<option value="assess_view_culvert" data-nextprocess="next">Culvert</option>';
        assetExpListOut1 += '<option value="assess_view_drainage" data-nextprocess="next">Drainage</option>';
        assetExpListOut1 += '<option value="assess_view_pavement" data-nextprocess="next">Pavement</option>';
        assetExpListOut1 += '<option value="assess_view_roadfurniture" data-nextprocess="next">Road Furniture</option>';
        assetExpListOut1 += '<option value="assess_view_slope" data-nextprocess="next">Slope</option>';
    }else if(bulkChoosen == 'routine'){
        assetExpListOut1 += '<option value="default">Please Choose</option>'
        assetExpListOut1 += '<option value="ScheduleInspection" data-nextprocess="next">Routine Inspection</option>';
        assetExpListOut1 += '<option value="PictorialReport" data-nextprocess="next">Pictorial Report</option>';
        assetExpListOut1 += '<option value="LPA" data-nextprocess="next">LPA</option>';
        assetExpListOut1 += '<option value="maint_view_work_program_annual" data-nextprocess="next">Work Program (Annual)</option>';
        assetExpListOut1 += '<option value="maint_view_work_program_monthly" data-nextprocess="next">Work Program (Monthly)</option>';
        assetExpListOut1 += '<option value="maint_view_work_instruction" data-nextprocess="next">Work Instruction</option>';
        assetExpListOut1 += '<option value="NotificationOfDamage" data-nextprocess="next">NOD Report (Monthly)</option>';
        assetExpListOut1 += '<option value="site_routine" data-nextprocess="next">Inspector Visit Report</option>';
        assetExpListOut1 += '<option value="defect_detection" data-nextprocess="next">Defect Register</option>';
        assetExpListOut1 += '<option value="NotificationOfDefect" data-nextprocess="next">Notification of Defect</option>';
    }else if(bulkChoosen == 'periodic'){
        assetExpListOut1 += '<option value="default">Please Choose</option>'
        assetExpListOut1 += '<option value="maint_view_apj" data-nextprocess="next">APJ</option>';
        assetExpListOut1 += '<option value="maint_view_apj_amendment" data-nextprocess="next">APJ (Ammendment)</option>';
        assetExpListOut1 += '<option value="maint_view_kpj" data-nextprocess="next">KPJ</option>';
        assetExpListOut1 += '<option value="maint_view_workorder" data-nextprocess="next">Work Order</option>';
    }else if(bulkChoosen == 'emergency'){
        assetExpListOut1 += '<option value="default">Please Choose</option>'
        assetExpListOut1 += '<option value="maint_view_notice_of_emergency" data-nextprocess="next">Notice of Emergency</option>';
        assetExpListOut1 += '<option value="maint_view_work_daily_report" data-nextprocess="next">Work Daily Report</option>';
        assetExpListOut1 += '<option value="maint_view_asset_handover" data-nextprocess="next">Asset Handover</option>';
    }

    $("#assetProcesssBulkProj1").html(assetExpListOut1);

    if(bulkChoosen == "default"){
        $('.nextPage').css("display","none")
        $('.processAsset2').css("display", "none")
        $('#assetProcesssBulkProj ').removeClass("bulkChoosen")
        $('#assetProcesssBulkProj1').removeClass("bulkChoosen")
        $('.processAsset2').css('display', 'none')
    }else if(nextProcess == "2"){
        flagAssetModal = true
        wizardButtonVisibility(currentPage, mode)
        $('.processAsset2').css('display', 'flex')
        $('#assetProcesssBulkProj').removeClass("bulkChoosen")
        $('#assetProcesssBulkProj1').addClass("bulkChoosen")
    }else if(nextProcess == 'next'){
        $('.nextPage').css("display","unset")

        if(bulkChoosen == "rfi" || bulkChoosen == "ncp"){
            $('.processAsset2').css("display", "none")
            $('#assetProcesssBulkProj').addClass("bulkChoosen")
        }
    }
}

//select only this asset
selectOnlyThisAsset = (e) =>{
    var myCheckbox = $("[name=asset]");
    var className = $(e)[0].className;
    var processType = $('#firstprocessTypeAsset').data('asset');

    Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
    });
    e.checked = true;

    if(processType == 'Inspection'){
            if(className == 'bridge'){
                $('.nextPage').css('display', 'none')
                $('.modal-container.asset').children().children('.projectProcessSelect.thirdProcess').css('display', 'block')
                $('.modal-container.asset').children().children('.projectProcessSelect.thirdRFProcess').css('display', 'none')
            }else if(className == 'roadFurniture'){
                $('.nextPage').css('display', 'none')
                $('.modal-container.asset').children().children('.projectProcessSelect.thirdProcess').css('display', 'none')
                $('.modal-container.asset').children().children('.projectProcessSelect.thirdRFProcess').css('display', 'block')
                $(".backPage").css('display', 'none')
            }else{
                $('.nextPage').css('display', 'unset')
                $('.modal-container.asset').children().children('.projectProcessSelect.thirdProcess').css('display', 'none')
                $('.modal-container.asset').children().children('.projectProcessSelect.thirdRFProcess').css('display', 'none')
                openJogetAssetInspection();
            }
    }else if(processType == 'Assessment'){
        $('.nextPage').css('display', 'unset')
        openJogetAssetInspection();
    }
}

//process list on change pavement analysis
processListOnchangePavement = (e) =>{
    var pageToOpen = $(e).data("page");
    var assetChoosen = $(e).val();
    var title = $(`.modal-header a`).text();
    var myCheckbox = $("[name=pavement]");
    var pavementUpload = $('.pavementUpload');
    var pavementReport = $('.pavementReport');
    var modalContainer = $(`.modal-container.${pageToOpen}`).children().children().children('.projectPavementupload');
    var resilientHTML;

    jogetConOpDraw.coordsArray = [];
    Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
    });

    $('#processTypePavement').data('pavement', assetChoosen)
    
    resilientHTML = '<label class="container" id="resilient">Resilient Modulus'+
                        '<input type="checkbox" class="resilient" name="pavement" value="assetRMT" onclick="selectOnlyThisPavement(this)"><span class="checkmark" for="pavement"></span>'+
                     '</label>';
    
    if(assetChoosen == 'default'){
        defaultStateWizard(title)
    }else if(assetChoosen == 'upload'){
        $('#pavementCheckBox').append(resilientHTML)
        $('.pavementUpload iframe').attr('src', '')
        modalContainer.css('display', 'block')
        pavementUpload.css('display', 'none')
        pavementReport.css('display', 'none')
        
    }else if(assetChoosen == 'report'){
        $('#resilient').remove()
        $('.pavementUpload iframe').attr('src', '')
        modalContainer.css('display', 'block')
        pavementUpload.css('display', 'none')
        pavementReport.css('display', 'none')
    }

}

//select only this pavement
selectOnlyThisPavement = (e) =>{
    var myCheckbox = $("[name=pavement]");
    var className = $(e)[0].className;
    var processType = $('#processTypePavement').data('pavement');
    var dateOpt = $('#dataDateOpt').val();
    var paveChoose = $('#paveType:checked').attr("class");
    var paveType = '';

    Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
    });
    e.checked = true;

    if(className == 'fwdAnalysis'){
        paveType = 'assetFWD';
    }else if(className == 'mlpAnalysis'){
        paveType = 'assetMLP';
    }else if(className == 'resilient'){
        paveType = 'assetRMT';
    }

    if(processType == 'upload'){
        $('.pavementUpload').css('display', 'block')

        if(paveType !== "") {
            $('.pavementUpload iframe').attr('src', '../Components/assetAnalysis/V3/analysisUpl?upload='+paveType);
        }
    }else if(processType == 'report'){
        $('.pavementUpload').css('display', 'block')

        if(paveChoose){
            $('.pavementUpload iframe').attr('src', `../Components/assetAnalysis/V3/${className}`)
        }
    }
}

//on click display children tab
navBoxTabParentClick = (e) =>{
    let pageToOpen = $(e).attr('rel');
    $('.tab.maintenance').removeClass('active')
    $('.tab.inventory').removeClass('active')
    $('.tab.asset').removeClass('active')
    $(`.tab.children`).removeClass('active')
    $('iframe.maintenanceList').attr('src', '')
    $('iframe.jogetInventorylist').attr('src', '')
    $('iframe.assetList').attr('src', '')
    
    //remove border bottom tab
    if(!$('.buttonTab.parentTab').hasClass('parent')){
        $('.buttonTab.parentTab').addClass('parent')
    }

    //add class active for parent tab
    if(!$(e).hasClass('active')){
        if($(e).hasClass("maintenance")){
            $(".tab.maintenance[rel="+pageToOpen+"]").addClass('active')
        }else if($(e).hasClass("inventory")){
            $(".tab.inventory[rel="+pageToOpen+"]").addClass('active')
        }else{
            $(e).addClass('active')
        }
    }

    //change children tab based on parent
    if(pageToOpen == 'con'){
        $('.buttonTab.conditionBrowser').css('display', 'flex');
        $('.buttonTab.assessmentBrowser').css('display', 'none');
        $('.buttonTab.routineBrowser').css('display', 'none');
        $('.buttonTab.periodicBrowser').css('display', 'none');
        $('.buttonTab.emergencyBrowser').css('display', 'none');
    }else if(pageToOpen == 'asses'){
        $('.buttonTab.assessmentBrowser').css('display', 'flex');
        $('.buttonTab.conditionBrowser').css('display', 'none');
        $('.buttonTab.routineBrowser').css('display', 'none');
        $('.buttonTab.periodicBrowser').css('display', 'none');
        $('.buttonTab.emergencyBrowser').css('display', 'none');
    }else if(pageToOpen == 'routine'){
        $('.buttonTab.assessmentBrowser').css('display', 'none');
        $('.buttonTab.conditionBrowser').css('display', 'none');
        $('.buttonTab.routineBrowser').css('display', 'flex');
        $('.buttonTab.periodicBrowser').css('display', 'none');
        $('.buttonTab.emergencyBrowser').css('display', 'none');
    }else if(pageToOpen == 'periodic'){
        $('.buttonTab.assessmentBrowser').css('display', 'none');
        $('.buttonTab.conditionBrowser').css('display', 'none');
        $('.buttonTab.routineBrowser').css('display', 'none');
        $('.buttonTab.periodicBrowser').css('display', 'flex');
        $('.buttonTab.emergencyBrowser').css('display', 'none');
    }else if(pageToOpen == 'emergency'){
        $('.buttonTab.assessmentBrowser').css('display', 'none');
        $('.buttonTab.conditionBrowser').css('display', 'none');
        $('.buttonTab.routineBrowser').css('display', 'none');
        $('.buttonTab.periodicBrowser').css('display', 'none');
        $('.buttonTab.emergencyBrowser').css('display', 'flex');
    }else if(pageToOpen == 'rfi'){
        $('.buttonTab.assessmentBrowser').css('display', 'none');
        $('.buttonTab.conditionBrowser').css('display', 'none');
        $('.buttonTab.routineBrowser').css('display', 'none');
        $('.buttonTab.periodicBrowser').css('display', 'none');
        $('.buttonTab.emergencyBrowser').css('display', 'none');
        openMaintainJoget(pageToOpen)
    }else if(pageToOpen == 'ncp'){
        $('.buttonTab.assessmentBrowser').css('display', 'none');
        $('.buttonTab.conditionBrowser').css('display', 'none');
        $('.buttonTab.routineBrowser').css('display', 'none');
        $('.buttonTab.periodicBrowser').css('display', 'none');
        $('.buttonTab.emergencyBrowser').css('display', 'none');
        openMaintainJoget(pageToOpen)
    }else if(pageToOpen == 'network'){
        $('.buttonTab.networkBrowser').css('display', 'flex');
    }else if(pageToOpen != 'network'){
        $('.buttonTab.networkBrowser').css('display', 'none');
        openInventoryJoget(pageToOpen)
    }
}

resetTaskList = () => {
    // update main page task
    $('.tableBody.myTask').html("")
    dataTask()

    // update at task page if current page is task
    if (localStorage.page_pageOpen == 'myTask'){
        $('.tableBody.taskConstruct').html("")
        $('.tableBody.taskDocument').html("")
        $('.tableBody.taskFinance').html("")
        $('.tableBody.taskAsset').html("")
        dataForMyTask()
    }
}

resetReviewList = () => {
    if(localStorage.page_pageOpen != 'myInsights') return
    // update main page task
    $('#reviewDataList').html("")
    getReviewv3()
}

openMobileAppBtn = (event) =>{
    $(".mobileAppButton").show()
    event.stopPropagation();
}

window.addEventListener("message", (event) => {

        // showAlert
    if (event.data.alert) {
        var alertObj = event.data.alert;
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: (alertObj.title) ? alertObj.title : 'Success!',
            content: (alertObj.message) ? alertObj.message : 'Success'
        });
    }

    // redirect to menu based on id - DOCUMENT
    if (event.data.redirectMenu) {
        var divId = event.data.redirectMenu;
        if(SYSTEM == "OBYU"){
            if (divId == 'listAll'){
                $("#document_all").trigger('click');
            }
            else if(divId == 'listDrawing'){
                $("#document_drawing").trigger('click');
            }
            else if (divId == 'myCorrespondenceAll'){
                $("#document_corr_list_all").trigger('click');
            }
        }
        else{
            if (divId == 'listAll'){
                $("#doc_list_doc_my").trigger('click');
            }
            else if (divId == 'myCorrespondence'){
                $("#doc_list_corr_my").trigger('click');
            }
        }
        
    }

    // event with reference id
    if (event.data.eventType && event.data.eventType == "submitForm" && event.data.processName && event.data.refId) {
        var contentMsg;
        if (event.data.processName == "Land Registration" || event.data.processName == "Land Issue Register" || event.data.processName == "Land Encumbrances Registration" || event.data.processName == "LA" || event.data.processName == "LI"){
            contentMsg = event.data.processName + " <b>" + event.data.refId + "</b> successfully submitted!";
        }else if (event.data.processName == "SA" ){
            contentMsg =  "You have submitted the Safety Activity data successfully (<b>" + event.data.refId + "</b>).";
        }else if (event.data.processName == "SMH" ){
            contentMsg =  "You have submitted the Total Man-Hour Works Without LTI data successfully (<b>" + event.data.refId + "</b>).";
        }
        else{
            contentMsg = event.data.processName + " process <b>" + event.data.refId + "</b> successfully submitted!";
        }
    
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Success!',
            content: contentMsg
        });
    }
    else{
        if (event.data.eventType && event.data.eventType == "submitForm") {
            contentMsg = (event.data.refId) ? "The record (<b>" + event.data.refId + "</b>) successfully submitted!" : "The record successfully submitted!";
                $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Success!',
                content: contentMsg
            });
        }
    }

    if (event.data.processName == "BP" && event.data.refId){
        var contentMsg;
        if(event.data.eventType == "new"){
            contentMsg =  "This consortium <b>" + event.data.refId + "</b> has been successfully registered";
        }else if(event.data.eventType == "update"){
            contentMsg =  "This consortium <b>" + event.data.refId + "</b> has been successfully updated";
        }
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Success!',
            content: contentMsg
        });
    }

    if (event.data.eventType && event.data.eventType == "approvalForm") {
        var contextMsg = (event.data.refId) ? "Process <b>" + event.data.refId + "</b> successfully updated!" : "Process successfully updated!";
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
                        myTaskReloadPage('My Task');
                    }
                }
            }
        });
    }

    if (event.data.eventType && event.data.eventType == "projectInfoSubmitted") {

        localStorage.projectDetailsFlag = "true";

        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Success!',
            content: "Project Information successfully submitted!",
            buttons: {
                triggerOK : {
                    text: 'Ok',
                    keys: ['enter', 'esc'],
                    action: function(){
                        $("#finance_list_ProjectUserInfo_SSLR2").trigger("click")
                    }
                }
            }
        });
    }

    if (event.data.eventType && event.data.eventType == "approvalForm_sslr") {
        var contextMsg = (event.data.refId) ? "Process <b>" + event.data.refId + "</b> successfully updated!" : "Process successfully updated!";
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
                        wizardCancelPage()
                    }
                }
            }
        });
    }

    if (event.data.eventType && event.data.eventType == "claimUpdate_sslr") {
        var contextMsg = (event.data.refId) ? "Process <b>" + event.data.refId + "</b> successfully updated!" : "Process successfully updated!";
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
                        $('#finance_list_ApprovedClaims_SSLR2').trigger('click');
                    }
                }
            }
        });
    }


    // for PFS Asset inbox redirect
    if (event.data.eventType && event.data.eventType == "PFSapprovalForm" && event.data.refId) {
        var divId = event.data.redirectMenu;
        var contextMsg = "Process <b>" + event.data.refId + "</b> successfully updated!";

        wizardCancelPage();
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Success!',
            content: contextMsg
        });
        
        if(divId == 'routineInbox'){
            $('#finance_list_ClaimInbox').trigger('click');
        }else if(divId == 'routineHQInbox'){
            $('#finance_list_ClaimInboxHq').trigger('click');
        }else if(divId == 'PeriodicHQInbox'){
            $('#finance_list_ClaimInboxPerHq').trigger('click');
        }
    }

    if(event.data.close){
        wizardCancelPage();
    }

    if(event.data.close){
        resetJogetConOpDraw(); 
    }

    if(event.data.process == "Bumi"){
        flyToEntity(event.data.kmlName, event.data.coord, event.data)
    }

    let currPageOpen = localStorage.page_pageOpen ?  localStorage.page_pageOpen : '';

    if(currPageOpen != 'myDashboard' && currPageOpen != 'myFinance' && currPageOpen != 'myDocument' && localStorage.page_pageOpen != "myReporting"){
        resetTaskList()
    }
    
}, false);

// function to handle close button for 360 earth view
// only closed and remove pins when click at the Earth View
$(".navbox.cameraFeed .infoHeader .closeButton").on('click', function() {
    //to remove earth360 pins
    for (var i = 0; i < earthPinsArray.length; i++) {
        earthPinsArray[i].show = false;
    }
})

//function to show back, edit, new button on PFS
checkActiveMainPage = (linkSet) =>{
    var subButton = $(`.subButtonContainer .subButton#${linkSet}`)

    $(`.subButtonContainer .subButton`).removeClass("active")
    $('.mainPage.active').children().children().children().children().removeClass("active");

    if(!subButton.hasClass("active")){
        subButton.addClass("active")
    }
}

linkToJogetPage = (ele, buttonVisibility) =>{
    var activePage = $(`.subButtonContainer .subButton.active`);
    var frameId = $(`.mainPage.active`).children().children("iframe").attr("id");
    var jogetLink = $(ele).data("jogetlink")

    $('.mainPage.active').find(`.${buttonVisibility}`).removeClass("active");

    if(buttonVisibility == "backButtonContainer"){
        linkJoget(activePage, frameId)
    }else if(buttonVisibility == "editButtonContainer" || buttonVisibility == "addButtonContainer"){
        linkJogetExtra(frameId, jogetLink)
    }else if(buttonVisibility == "newButtonContainer"){
        $('.mainPage.active').find(`.editButtonContainer`).removeClass("active");
        linkJogetExtra(frameId, jogetLink);
    }
}

showVisibilityButton = (buttonVisibility, jogetLink) =>{
    var targetButton = $('.mainPage.active').find(`.${buttonVisibility}`);

    targetButton.children().attr("data-jogetlink", "");

    targetButton.addClass("active");
    targetButton.children().attr("data-jogetlink", jogetLink);
}

defaultAddEditButton = () =>{
    $('.mainPage').find(`.editButtonContainer`).removeClass("active")
    $('.mainPage').find(`.addButtonContainer`).removeClass("active")
    $('.mainPage').find(`.newButtonContainer`).removeClass("active")
    $('.mainPage').find(`.backButtonContainer`).removeClass("active")
}

myTaskReloadPage = (title='') =>{
    if(title != 'My Task') return;

    //remove parameters from url and reset page to homepage.php
	var url_string = window.location.href
	var url = new URL(url_string);

    if (url.href.includes('?')) {
        if(url.searchParams.has("actid") || url.searchParams.has("corr_id")){
            window.open("../Login/homePage.php", '_self');
        }
    }else{
        resetTaskList();
    }
}

//News Feed funciton

var fadeInCard = function(elem){
    elem.fadeIn({
        'start':function() {
            $(elem).css('transform','scale(1)')
        },
        'done': function(){
            if($(".newsFeed").hasClass("active")){
                fadeInCard(elem.next("div.newsCard:hidden"));
            }else{
                return;
            }
        },
        'duration':150
    });
}

likeNewsFeed  = (ele) => {
    var nfId = $(ele).data('nfid');
    var likedFlg = (($(ele).hasClass('liked'))) ? false : true;
    if(likedFlg){
        $(ele).find("i").removeClass("fa-regular")
        $(ele).find("i").addClass("fa-solid")
    }else{
        $(ele).find("i").removeClass("fa-solid")
        $(ele).find("i").addClass("fa-regular")
        let iColor = $(ele).siblings(".timestamp").css('color')
        $(ele).find("span").css(`color`,`${iColor}`)
        $(ele).find("i").css(`color`,`${iColor}`)
    }
    $(ele).toggleClass('liked');
    $(ele).css('pointer-events' , 'none');
    $.ajax({
        type: "POST",
        url: "../BackEnd/news_feed.json.php",
        dataType: "json",
        data: {
            fn : "likeFeed",
            nfid : nfId,
            liked : likedFlg
        },
        success: function (res) {
            if(res.result && res.newcnt){
                $(".likeCnt"+nfId).html(res.newcnt)
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(textStatus + " " + errorThrown)
        },
        complete : function (){
            $(ele).css('pointer-events' , 'auto');
        }
    });
}

processNewsDescHTML = (obj) =>{
    var htmlString = obj.nf_desc_html
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    
    var allImg = doc.body.querySelectorAll('img')
    allImg.forEach(function(item){
        var src = item.getAttribute('src') || ''
        if(!src.includes("data:image")){
            var nsrc = "../../Data/images/news/"+obj.nf_id+"/"+src;
            item.setAttribute('src', nsrc)
        }
    })

    if($("#desc-"+obj.nf_id)) $("#desc-"+obj.nf_id).append(doc.body.innerHTML)
}

generateNewsCard = (obj) =>{
    var imgSrc = "../../Data/images/news/"+obj.nf_id+"/"+obj.nf_card_img;

    if (!obj.nf_card_img){
        imgSrc = "../images/newsDefault2.jpg";
    }else{
        //check file exist
        $.ajax({
            url:imgSrc,
            type:'HEAD',
            error: function()
            {
                imgSrc = "../images/newsDefault2.jpg";
            },
            success: function()
            {
                imgSrc = "../../Data/images/news/"+obj.nf_id+"/"+obj.nf_card_img;
            }
        });
    }
    
    var nHTML = `
    <div class="newsCard" id ="newsCard`+obj.nf_id+`" rel="newsFeed" style="display:block;" onclick="wizardOpenPage(this)">
        <div class="image">
            <img id="imgg`+obj.nf_id+`" src="`+imgSrc+`">
        </div>
        <div class="flexContainer">
            <div class="title">
            `+obj.nf_title+`
            </div>
            <p class="desc" id="desc-`+obj.nf_id+`"></p>
            <div class="footer">
                <div class="timeStamp"><i class="fa-regular fa-clock"></i> `+obj.elapsed+`</div>
                <button onclick="likeNewsFeed(this);event.stopPropagation()" class="likeBtn `+((obj.liked_flag == 1) ? `liked` : ``)+`" data-nfId ="`+obj.nf_id+`"><i class="fa-`+((obj.liked_flag == 1) ? `solid` : `regular`)+` fa-thumbs-up"></i>&nbsp;<span class="likeCnt`+obj.nf_id+`">  `+obj.like_cnt+`</button>
            </div>
        </div>
    </div>` 

    $("#newsContentContainer").append(nHTML)
    processNewsDescHTML(obj)

    function changeColor(){
        var rgb = averageColor(document.getElementById(`imgg${obj.nf_id}`))

        color = 'rgb(' + rgb.r + ',' + rgb.g + ','+ rgb.b + ')'

        const brightness = Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) / 1000);
        const textColour = (brightness > 125) ? 'rgb(30 30 30)' : 'rgb(223 223 223)';
        $(`#imgg${obj.nf_id}`).parent().siblings('.flexContainer').css(`background-image`, `linear-gradient(to bottom, transparent 0%, ${color} 75%)`)
        $(`#imgg${obj.nf_id}`).parent().siblings('.flexContainer').find('.title').css(`color`, `${textColour}`)
        $(`#imgg${obj.nf_id}`).parent().siblings('.flexContainer').find('div').css(`color`, `${textColour}`)
        $(`#imgg${obj.nf_id}`).parent().siblings('.flexContainer').find('div i').css(`color`, `${textColour}`)
        $(`#imgg${obj.nf_id}`).parent().siblings('.flexContainer').find('button:not(.liked) i').css(`color`, `${textColour}`)
        $(`#imgg${obj.nf_id}`).parent().siblings('.flexContainer').find('button:not(.liked) span').css(`color`, `${textColour}`)

    }

    setTimeout(changeColor, 2000)
}

updateNewsFeed = (ns, ne) => {
    $.ajax({
        type: "POST",
        url: "../BackEnd/news_feed.json.php",
        dataType: "json",
        data: {
            fn : "getnewsfeed",
            nstart : ns,
            nend : ne,
        },
        beforeSend: function() {
            nLoad = false;
        },
        success: function (res) {
            var data = res.data;
            if (data){
                data.forEach(ele => {
                    nStart++
                    nEnd++
                    generateNewsCard(ele);
                    fadeInCard($('div.newsCard:hidden').first())
                });
            }
            nLoad = true;
        },
        complete: function() {
            nLoad = true;
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(textStatus + " " + errorThrown)
        },
    });
}

averageColor = (imgEl) => {
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        
    if (!context) {
        return defaultRGB;
    }
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        ///* security error, img on diff domain */alert('x');
        return defaultRGB;
    }
    
    length = data.data.length;
    
    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }
    
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/(count/1.4));
    rgb.g = ~~(rgb.g/(count/1.4));
    rgb.b = ~~(rgb.b/(count/1.4));
    
    return rgb;
    
}

function OnLoadProjectWise365Link() {
    //#webserviceID
    $.ajax({
        type: "GET",
        url: '../backend/getPW365Link.php',
        dataType: 'json',
        success: function (obj, textstatus) {
            let existing_link = document.getElementById("sideBarButtonLink").innerHTML;
            document.getElementById("sideBarButtonLink").innerHTML = existing_link + obj.pwLink;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        }
    });

}
notiShow = (event) =>{
    var notiContainer;
    var x;
    var y;

    notiContainer = $('.notiContainer');
    notiPointer = $('.notiContainer::before');


    var position = $(event).position()

    x = position.left + 25
    y = position.top - 8

    notiContainer.css('left', x + 'px')
    notiContainer.css('top', y + 'px')
    notiContainer.fadeIn(200)
}

//edit code for displaying FinanceInfo Table project view on modal container -- Finance Information
financeListOnClick = (ele) =>{
    let $relId = $(ele).attr('rel')
    if (!$("#" + $relId).hasClass("active")) {
        $(".financeListContainer").removeClass("active")
        $(".financeListContainer").slideUp(100)
        $("#" + $relId).addClass('active')
        $("#" + $relId).slideDown(100)
    } else {
        $("#" + $relId).slideUp(100)
        $("#" + $relId).removeClass('active')
    }
}

openDropDown = (ele) =>{
    var icon = $(ele);

    if(icon.hasClass("opened")){
        icon.removeClass("opened")
        icon.addClass("closed")
        icon.removeClass("fa-minus")
        icon.addClass("fa-plus")

        if(icon.hasClass("closed")){
            icon.parent().siblings(".dropDown-body").slideUp(200)
        }
    }else{
        icon.removeClass("closed")
        icon.addClass("opened")
        icon.removeClass("fa-plus")
        icon.addClass("fa-minus")

        if(icon.hasClass("opened")){
            icon.parent().siblings(".dropDown-body").slideDown(200)
        }
    }
}

//-------------system admin function for wizard page------------------------------\\

//Temporary function to redirect to V2 System Admin Page
redirectFunction = (ele) =>{
    window.open('../systemadmin.php', '_self' )
}

//Function for addNewOrg checkbox
newOrgCheckbox = (e) =>{
    if(e.checked){
        $('.inputContent.newOrg').css('display','flex')
        $('#userOrg').prop("disabled", true).val("")
    }else{
        $('.inputContent.newOrg').hide()
        $('#userOrg').prop("disabled", false).val("")
    }
}

function toggleProjectType(type = 'CONSTRUCT'){
    if(type == 'CONSTRUCT'){
        $('#projectTypeTitle').html('Construction App')
        $('#projectTypePackageTitle').html('Construct Package')
        $('#reviewAppTitle').html('Construct')

        $('#constructAppProcess').css("display", "flex");
        $('#assetAppProcess').hide();

        $('#projectregiondisplaycont').hide();
        $('#projectwpciddisplaycont').css("display", "flex");

        $('#financeAppContainer').css("display", "flex");
        $('#documentAppContainer').css("display", "flex");
    }else if(type == 'ASSET'){
        $('#projectTypeTitle').html('Asset App')
        $('#projectTypePackageTitle').html('Asset Package')
        $('#reviewAppTitle').html('Asset')

        $('#constructAppProcess').hide();
        $('#assetAppProcess').css("display", "flex");

        $('#projectregiondisplaycont').css("display", "flex");
        $('#projectwpciddisplaycont').hide();

        $('#financeAppContainer').css("display", "flex");
        $('#documentAppContainer').css("display", "flex");
    }else if(type == 'FM'){
        $('#projectTypeTitle').html('FM App')
        $('#projectTypePackageTitle').html('FM Package')
        $('#reviewAppTitle').html('FM')

        $('#constructAppProcess').hide();
        $('#assetAppProcess').hide();

        $('#projectregiondisplaycont').css("display", "flex");
        $('#projectwpciddisplaycont').hide();

        $('#financeAppContainer').hide();
        $('#documentAppContainer').hide();
    }
}

resetPassCheckbox = (e) =>{
    if(e.checked){
        $('.inputContent.password').css('display','flex')
        $(e).val(1)
    }else{
        $('.inputContent.password').hide()
        $(e).val(0)
    }
}

userFormNewState = (modalContainer) =>{
    modalContainer.find($('.addNewUser-edit')).css('display','none')
    modalContainer.find($('.addNewUser-new')).css('display','flex')
    modalContainer.find($('.password')).css('display','flex')
    modalContainer.find($('.disable')).prop( "disabled", false )
    modalContainer.find($('#userOrg')).prop( "disabled", false )
}

userFormEditState = (modalContainer) =>{
    modalContainer.find($('.addNewUser-edit')).css('display','flex')
    modalContainer.find($('.addNewUser-new')).css('display','none')
    modalContainer.find($('.password')).css('display','none')
    modalContainer.find($('.disable')).prop( "disabled", true )
    modalContainer.find($('#userOrg')).prop( "disabled", true )
}

function readProjectURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#projectimage").parent().show();
            $("#projectimage").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#projectimage").parent().hide();
        $("#projectimage").attr("src", "");
    }
}

//change project icon in new project
$("#imgInp").change(function () {
    imginp = document.getElementById("imgInp");
    var pro_Inp = imginp.files[0];
    //filter extension
    var reg = /(.*?)\.(png|bmp|jpeg|jpg)$/;
    if (!pro_Inp.name.toLowerCase().match(reg)) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Input file format is not supported!",
        });
        imginp.value = "";
        $("#projectimage").attr("src", "");
        $("#projectimage").parent().hide();
        return;
    }
    //limit file size to 1mb
    if (pro_Inp.size > 1024000) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Maximum file size supported is 1MB!",
        });
        imginp.value = "";
        $("#projectimage").attr("src", "");
        $("#projectimage").parent().hide();
        return;
    }
    readProjectURL(imginp);
});

//------------Start User Related Function------------//
function OnClickExportUsers() {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
        }else{
            ajaxUrl = '../BackEnd/UserFunctionsV3.php';
        }
    }
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        dataType: 'json',
        data: {
            functionName: 'activeUsers'
        },
        success: function (res) {
            var users = res.data
            var csvFile = "FirstName,LastName,Email,Organization,Country,Type" + '\n';
            for (var i = 0; i < users.length; i++) {
                csvFile += users[i].user_firstname + ',';
                csvFile += users[i].user_lastname + ',';
                csvFile += users[i].user_email + ',';
                csvFile += users[i].user_org + ',';
                csvFile += users[i].user_country + ',';
                csvFile += users[i].user_type + '\n';

            }
            var blob = new Blob([csvFile], {
                type: 'text/csv;charset=utf-8;'
            });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, "activeUsers.csv");
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "activeUsers.csv");
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        }
    })
}

//copy value inside input field and put it on display
copyinputvalue = () => {
    let $email = $("#userEmail").val();
    let $fname = $("#userFirstName").val();
    let $lname = $("#userLastName").val();
    let $phone = $("#userPhoneNumber").val();
    let $designation = $("#userDesignation").val();
    let $org

    if ($('#addNewOrg').is(':checked')) {
        $org = $('#userNewOrgName').val();
    } else {
        if($("#userOrg option:first-child").is(':selected')){
            $org = ''
        }else{
            $org = $("#userOrg option:selected").text();
        }
    }
    let $country = $("#userCountry").val();
    let today = new Date().toDateString()

    userData = {
        firstName: $fname,
        lastName: $lname,
        userName: $fname + ' ' + $lname,
        email: $email,
        org: $org,
        country: $country,
        lastUpdate: today,
        phoneNumber: $phone,
        designation: $designation
    };

    Object.keys(userData).forEach(key => {
        if(userData[key] !== ''){
            if($(`.readOnlyContainer.${key}`)){
                $(`.readOnlyContainer.${key}`).children(`div`).children(`span:nth-child(2)`).html(`${userData[key]}`)
            }
        }else{
            if($(`.readOnlyContainer.${key}`)){
                $(`.readOnlyContainer.${key}`).children(`div`).children(`span:nth-child(2)`).html(`N/A`)
            }
        }
    })

}

//copy value inside div into input fields
fillUserForm = (userData) => {
    // insert into input for edit
    $(`#userId`).val(userData.id)
    $(`#userEmail`).val(userData.email)
    $(`#userEmail`).prop("disabled", true)
    $(`#userFirstName`).val(userData.firstName)
    $(`#userLastName`).val(userData.lastName)
    $(`#userPhoneNumber`).val(userData.phoneNumber)
    $(`#userOrg`).val(userData.org).prop('selected', true)
    $(`#userCountry`).val(userData.country).prop('selected', true)
    $(`#userType`).val(userData.userType).prop('selected', true)
    $(`#userDesignation`).val(userData.designation)
    if(userData.supportUser == '1'){
        $(`#supportUser`).val(userData.supportUser).prop('checked',true)
    }else{
        $(`#supportUser`).val(userData.supportUser).prop('checked',false)
    }
}

//reset all input fields and view page
resetAddUserForm = () => {
    $("#userEmail").val("");
    $(`#userEmail`).prop("disabled", false)
    $("#userPhoneNumber").val("");
    $("#userFirstName").val("");
    $("#userLastName").val("");
    $("#userDesignation").val("");
    $("#supportUser").val(0).prop("checked",false);
    $("#userOrg").val("");
    $("#userCountry").val("");
    $("#userPasswordSysAdmin").val("");
    $("#userConfirmPasswordSysAdmin").val("");
    $("#userNewOrgId").val("");
    $("#userNewOrgName").val("");
    $("#userNewOrgDesc").val("");
    $("#addNewOrg").prop("checked",false);
    $(".newOrg").css("display", "none");
    $("#userType").val("");
    $(`#resetPassCheck`).val(0).prop('checked',false)

    $('#userPasswordSysAdmin').attr("type", "password");
    $('#userConfirmPasswordSysAdmin').attr("type", "password");
    $("input#userConfirmPasswordSysAdmin").css({
        "background-repeat": "no-repeat",
        "background-image": ""
    });
    $('input#newOrgName').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#newOrgID').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#userConfirmPasswordSysAdmin').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('button.password-show.sysAdmin').css("display", "");
    $('button.password-hide.sysAdmin').css("display", "none");
    $('button.password-show-confirm.sysAdmin').css("display", "");
    $('button.password-hide-confirm.sysAdmin').css("display", "none");
    $(".passindicator").css("display", "none");

    $(".infoProfilePic.profilePic img").attr('src', "../Images/defaultProfile.png")
    $("#userProjectList").html(`
    <div class="row system-admin fourColumn searchv3" data-projectId="">
        <div class="columnMiddle textContainer">
            <span class="text">User not assign to any project yet</span>
        </div>
        <div class="columnMiddle textContainer">
            <span class="text"></span>
        </div>
        <div class="columnMiddle textContainer">
            <span class="text"></span>
        </div>
        <div class="columnMiddle textContainer">
            <span class="text"></span>
        </div>
    </div>
    `)


}

//Open user detail when click on list of active/inactive user
//Call when Wizard Open page
userDetail = (ele) => {
    rowclicked = ele;
    let email_col = rowclicked.children[1].children[0],
    usr_email = email_col.innerHTML.trim();

    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
        }else{
            ajaxUrl = '../BackEnd/UserFunctionsV3.php';
        }
    }
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        dataType: "json",
        data: {
            functionName: 'viewUser',
            usr_email: usr_email,
        },
        success: function (obj, textstatus) {
            if (!("bool" in obj)) {
                var created_datetime = obj.data.created_time;
                var last_logintime = obj.data.last_login;
                var update_datetime = obj.data.last_update;
                // Check if date is not null
                if (created_datetime != null) {
                    // Convert Date to string
                    created_datetime = new Date(created_datetime).toDateString();
                }
                if (last_logintime !== null) {
                    last_logintime = new Date(last_logintime).toDateString();
                }
                if (update_datetime !== null) {
                    update_datetime = new Date(update_datetime).toDateString();
                }

                userData = {
                    id: obj.data.user_id,
                    firstName: obj.data.user_firstname,
                    lastName: obj.data.user_lastname,
                    userName: obj.data.user_firstname + ' ' + obj.data.user_lastname,
                    email: obj.data.user_email,
                    phoneNumber: obj.data.user_phone,
                    org: obj.data.user_org,
                    orgName: obj.data.orgName,
                    orgType: obj.data.orgType,
                    country: obj.data.user_country,
                    userType: obj.data.user_type,
                    supportUser: obj.data.support_user,
                    createdBy: obj.data.created_by,
                    createdDate: created_datetime,
                    updatedBy: obj.data.updated_by,
                    lastUpdate: update_datetime,
                    lastLogin: last_logintime,
                    profilePic: obj.data.profile_img,
                    profileHeader: obj.data.profile_header,
                    designation: obj.data.user_designation
                };

                console.log(userData)

                // Loop user data and insert into Read-only view in wizard
                Object.keys(userData).forEach(key => {
                    if(userData[key] !== null){
                        if($(`.readOnlyContainer.${key}`)){
                            $(`.readOnlyContainer.${key}`).children(`div`).children(`span:nth-child(2)`).html(`${userData[key]}`)
                        }
                        if($(`.infoProfilePic.${key}`)){
                            $(`.infoProfilePic.${key}`).children(`img`).attr(`src`, `../../Data/users/${userData.email}/${userData[key]}`)
                        }
                    }else{
                        if($(`.readOnlyContainer.${key}`)){
                            $(`.readOnlyContainer.${key}`).children(`div`).children(`span:nth-child(2)`).html(`N/A`)
                        }
                        if($(`.infoProfilePic.${key}`)){
                            $(`.infoProfilePic.${key}`).children(`img`).attr(`src`, `../Images/defaultProfile.png`)
                        }
                    }
                });

                // insert into input for edit
                fillUserForm(userData)

                //populate projects table in user profile
                var projecthtml = '';
                obj.user_projects.forEach(iterateProjectsArray);

                function iterateProjectsArray(item, index) {
                    added_time = new Date(item.added_time).toDateString();
                    projecthtml +=
                        `<div class="row system-admin fourColumn searchv3" data-projectId="${item.Pro_ID}">
                            <div class="columnMiddle textContainer">
                                <span class="text wordWrap">${item.project_name}</span>
                            </div>
                            <div class="columnMiddle textContainer">
                                <span class="text wordWrap">${item.Pro_Role}</span>
                            </div>
                            <div class="columnMiddle textContainer">
                                <span class="text wordWrap">${item.added_by}</span>
                            </div>
                            <div class="columnMiddle textContainer">
                                <span class="text wordWrap">${added_time}</span>
                            </div>
                        </div>`;
                }
                $("#userProjectList").html("");
                $("#userProjectList").html(projecthtml);

            } else {
                console.log(obj.msg);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
}

onclickUserSaveButton = () => {
    var formdata = new FormData();
    if(mode == 'edit'){
        var ufname = $("#userFirstName").val();
        var ulname = $("#userLastName").val();
        var ucountry = $("#userCountry").val();
        var utype = $("#userType").val();
        var userid = $("#userId").val();
        var userphone = $("#userPhoneNumber").val();
        var udesignation = $("#userDesignation").val();

        var formdata = new FormData();
        formdata.append("userid", userid);
        formdata.append("fname", ufname);
        formdata.append("lname", ulname);
        formdata.append("country", ucountry);
        formdata.append("usertype", utype);
        formdata.append("phone", userphone);
        formdata.append("designation", udesignation);

        if ($("#resetPassCheck").prop("checked")) {
            var upassword = $("#userPasswordSysAdmin").val();
            formdata.append("password", upassword);
        }

        var supuser = $('#supportUser').is(':checked') ? true : false ;
        formdata.append("supuser", supuser);
        if(supuser !== userData['supportUser']){
            formdata.append("supuserChange", true);
        }

        formdata.append("functionName", "updateUser")
    }else{
        var uemail = $("#userEmail").val()
        var ufname = $("#userFirstName").val();
        var ulname = $("#userLastName").val();
        var ucountry = $("#userCountry").val();
        var utype = $("#userType").val();
        var userid = $("#userId").val();
        var ucountry = $("#userCountry").val();
        var userphone = $("#userPhoneNumber").val();
        var upassword = $("#userPasswordSysAdmin").val();
        var udesignation = $("#userDesignation").val();

        var supuser = $('#supportUser').is(':checked') ? true : false ;
        formdata.append("supuser", supuser);
        if(supuser !== userData['supportUser']){
            formdata.append("supuserChange", true);
        }

        formdata.append("fname", ufname);
        formdata.append("lname", ulname);
        formdata.append("email", uemail);
        formdata.append("country", ucountry);
        formdata.append("usertype", utype);
        formdata.append("password", upassword);
        formdata.append("phone", userphone);
        formdata.append("designation", udesignation);

        if ($('#addNewOrg').is(':checked')) {
            let orgid = $('#userNewOrgId').val();
            let orgname = $('#userNewOrgName').val();
            let orgdesc = $('#userNewOrgDesc').val();
            let orgtype = $('#userNewOrgType option:selected').val();
            formdata.append("orgid", orgid);
            formdata.append("orgname", orgname);
            formdata.append("orgdesc", orgdesc);
            formdata.append("orgtype", orgtype);

        } else {
            var uorg = $("#userOrg option:selected").val();
            var uorgname = $("#userOrg option:selected").text();
            formdata.append("orgid", uorg);
            formdata.append("orgname", uorgname);
        }
        formdata.append("functionName", "addUser")
    }
    
    let loggedInEmail = $('#myprofileEmai a').text()
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = '../BackEnd/UserFunctionsSSLR_DS.php';
        }else{
            ajaxUrl = '../BackEnd/UserFunctionsV3.php';
        }
    }
    
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: formdata,
        processData: false,
        contentType: false,
        success: function (obj) {
            var resp = JSON.parse(obj);
            if (loggedInEmail == userData.email && ($("#checkresetpassword").prop("checked") == true || userData.user_type !== utype)) {
                //prompt relogin
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: "You'll be logged out for the changes to take effect. Please sign in back with your newly changed credentials.",
                    buttons: {
                        OK: function () {
                            window.open("signin.php", "_self");
                        },
                    }
                });
            };
            if ($('#addNewOrg').is(':checked')) {
                getListofOrg()
            };
            if (resp.data == "close") {
                resetAddUserForm()
                wizardCancelPage()
                tableType = '';
                $('#input').removeClass('active');
                $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshUserTableBody();
            } else if (resp.data == "update fname") {
                resetAddUserForm()
                wizardCancelPage()
                tableType = '';
                $('#input').css('display', 'none')
                $('#input').removeClass('active');
                $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshUserTableBody();
                $("#profileNameTag").text(ufname)
            };
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: resp.msg,
            });
        }
    })
}

//Archive one particular user when clicking archive button in active user wizard V3 
//Also permanenetly delete user when clicking delete button in inactive user wizard V3
archiveOrDeleteUser = (e) => {
    //if button says archive
    if($(e).html() == 'Archive'){
        event.preventDefault();
        var userId = userData.id;
        var userName = userData.userName;
        var userEmail = userData.email;
        var message = "Are you sure you want to deactivate the User : " + userName + "? <br>";
        var userData_array = [];
        userData_array.push({ 'id': userId, 'name': userName });
        
        $(".loader").fadeIn();
        console.log(userEmail)
        if(SYSTEM == 'OBYU'){
            ajaxUrl = '../BackEnd/jogetOBYU.php';
        }else{
            ajaxUrl = '../BackEnd/joget.php';
        }
        $.ajax({
            type: "POST",
            url: ajaxUrl,
            data: {
                functionName: "getPendingProcessByUser",
                userData: userEmail
            },
            success: function (obj) {    
                $(".loader").fadeOut();
                var parsedObj = JSON.parse(obj);
                var constructProcessObj = parsedObj.construct;
                var pfsProcess = parsedObj.pfs;
                var documentProcess = parsedObj.document;
                var loadComplete = parsedObj.loadcomplete;
                if (loadComplete === "busy" || loadComplete === false) {
                    alert('Server Busy, Please try again later.');
                    return;
                }

                if (constructProcessObj) {
                    message += "Construct Process still active as below: <br>";
                    for (var i=0; i < constructProcessObj.length; i++) {
                        message += "  - Process ID " + constructProcessObj[i].processId + " in " + constructProcessObj[i].processName + "<br>";
                    }
                }
                
                if (pfsProcess) {
                    message += "<br>PFS Process still active as below: <br>";
                    for (var i=0; i < pfsProcess.length; i++) {
                        message += "  - Process ID " + pfsProcess[i].processId + " in " + pfsProcess[i].processName + "<br>";
                    }
                }

                if (documentProcess) {
                    message += "<br>Document Process still active as below: <br>";
                    for (var i=0; i < documentProcess.length; i++) {
                        message += "  - Correspondence Doc ID " + documentProcess[i]["correspondence.doc_id"] + " in " + documentProcess[i]["correspondence.doc_subject"] + "<br>";
                    }
                }

                message += "<br><font color='red'> WARNING: By deactivate user will REMOVE all the associate project that belong to this user. Please confirm. </font>";
                if(SYSTEM == 'OBYU'){
                    ajaxUrl = '../BackEnd/UserFunctionsOBYU.php';
                }else{
                    if(IS_DOWNSTREAM){
                        ajaxUrl = '../BackEnd/UserFunctionsSSLR_DS.php';
                    }
                    else {
                        ajaxUrl = '../BackEnd/UserFunctions.php';
                    }
                }
                $.confirm({
                    boxWidth: "40%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: function () {
                            $(".loader").fadeIn();
                            var arr = [];
                            arr[0] = userData.id;
                            var formdata = new FormData();
            
                            formdata.append("user_id", JSON.stringify(arr));
                            formdata.append("functionName", "inactivateUser")
                            var request = new XMLHttpRequest();
                            request.open("POST", ajaxUrl, true);
                            request.send(formdata);
                            request.onreadystatechange = function () {
                                if (request.readyState == 4 && request.status == "200") {
                                    $(".loader").fadeOut();
                                    jsonParse = JSON.parse(request.responseText);
                                    $.alert({
                                        boxWidth: "30%",
                                        useBootstrap: false,
                                        title: "Message",
                                        content: jsonParse.msg,
                                    });
                                    wizardCancelPage()
                                    tableType = '';
                                    $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshUserTableBody();
                                    $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshDeleteUserTableBody();
                                    updateV3Chart();
                                }
                            };
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
            }
        })

    }else{//if button says delete
        event.preventDefault();
        var userid = [];
        userid.push(userData.id);
        var name = userData.userName;
        var message =
            "Are you sure you want to delete this User permanently from the Database: " +
            name +
            "?";
        if(SYSTEM == 'OBYU'){
            ajaxUrl = '../BackEnd/UserFunctionsOBYU.php.php';
        }else{
            ajaxUrl = '../BackEnd/UserFunctionsV3.php';
        }
        $.confirm({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Confirm!",
            content: message,
            buttons: {
                confirm: function () {
                    $(".loader").fadeIn();
                    var formdata = new FormData();
                    formdata.append("user_id", JSON.stringify(userid));
                    formdata.append("functionName", 'deleteUser');
                    var request = new XMLHttpRequest();
                    request.open("POST", ajaxUrl, true);
                    request.send(formdata);
                    request.onreadystatechange = function () {
                        $(".loader").fadeOut();
                        if (request.readyState == 4 && request.status == "200") {
                            jsonParse = JSON.parse(request.responseText);
                            $.alert({
                                boxWidth: "30%",
                                useBootstrap: false,
                                title: "Message",
                                content: jsonParse.msg,
                            });
                            wizardCancelPage()
                            tableType = '';
                            $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshDeleteUserTableBody();
                            updateV3Chart();
                        }
                    };
                },
                cancel: function () {
                    return;
                },
            },
        });
    }
}

//Restore user from archived to active when clicking the restore button in archived user wizard V3
restoreUser = () => {
    console.log(userData)
    event.preventDefault();
    var userid = [];
    userid.push(userData.id);
    var name = userData.userName;
    var message = "Are you sure you want to recover this User : " + name + "?";
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/userFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = '../BackEnd/UserFunctionsSSLR_DS.php';
        }
        else {
            ajaxUrl = '../BackEnd/UserFunctions.php';
        }
    }
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                $('.loader').fadeIn()
                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(userid));
                formdata.append("functionName", "reactivateUser")
                var request = new XMLHttpRequest();
                request.open("POST", ajaxUrl, true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        $('.loader').fadeOut()
                        jsonParse = JSON.parse(request.responseText);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.msg,
                        });
                        wizardCancelPage()
                        tableType = '';
                        $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshUserTableBody();
                        $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshDeleteUserTableBody();
                        updateV3Chart();
                    }
                };
            },
            cancel: function () {
                return;
            },
        },
    });
}

//------------End User Related Function--------------//

//------------Start Project Related Function---------//

//Open project detail when click on list of active/inactive user
//Call when Wizard Open page for project view
projectDetail = (ele) =>{
    let projectId = $(ele).data('projectid');
    if(SYSTEM == 'OBYU'){
        //file for project functions obyu not created yet
        ajaxUrl = '../BackEnd/projectFunctionsOBYU.php';
    }else{
        ajaxUrl = '../BackEnd/projectFunctionsV3.php';
    }
    $('.loader').fadeIn(100)
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        dataType: "json",
        data: {
            functionName: "viewProject",
            project_id_number: projectId
        },
        success: function (obj, textstatus) {
            if (!("error" in obj)) {
                var created_datetime;
                if (obj.data.created_time != null) {
                    created_datetime = new Date(obj.data.created_time).toDateString();
                } else {
                    created_datetime = "NULL";
                }
                var update_datetime;
                if (obj.data.last_update != null) {
                    update_datetime = new Date(obj.data.last_update).toDateString();
                } else {
                    update_datetime = "NULL";
                }
                var startdate, enddate;
                if (obj.data.start_date != null) {
                    startdate = new Date(obj.data.start_date).toDateString();
                } else {
                    startdate = "";
                }
                if (obj.data.end_date != null) {
                    enddate = new Date(obj.data.end_date).toDateString();
                } else {
                    enddate = "";
                }

                lat1 = parseFloat(obj.data.latitude_1).toFixed(4);
                lat2 = parseFloat(obj.data.latitude_2).toFixed(4);
                long1 = parseFloat(obj.data.longitude_1).toFixed(4);
                long2 = parseFloat(obj.data.longitude_2).toFixed(4);
                let parentid;
                if (obj.data.parent_project_id_number == null) {
                    parentid = null;
                } else {
                    parentid = parseInt(obj.data.parent_project_id_number);
                }
                
                var consultantOrgDb = "";

                if(obj.data && obj.data.consultant_org_id){
                    consultantOrgDb = (obj.data.consultant_org_id).split(";");
                }

                if (SYSTEM == 'OBYU'){
                    click_project_details = {
                        projectName: obj.data.project_name,
                        projectIdNumber: obj.data.project_id_number,
                        projectId: obj.data.project_id,
                        parentId: parentid, //get parent id number if package project
                        projectIndustry: obj.data.industry,
                        projectIcon: obj.data.icon_url,
                        projectTimezoneValue: obj.data.time_zone_value,
                        projectTimezoneText: obj.data.time_zone_text,
                        projectLocation: obj.data.location,
                        createdBy: obj.data.created_by,
                        projectCreateTime: created_datetime,
                        projectUpdateBy: obj.data.updated_by,
                        projectUpdateTime: update_datetime,
                        projectStatus: obj.data.status,
                        projectOwner: obj.data.owner_org_id,
                        projectcontractor: obj.data.contractor_org_id,
                        projectconsultant: obj.data.consultant_org_id,
                        lat1: lat1,
                        lat2: lat2,
                        long1: long1,
                        long2: long2,
                        startDate: startdate,
                        endDate: enddate,
                        duration: obj.data.duration,
                        users: obj.project_users,
                        applist: obj.app_list,
                        cutoffflag: obj.data.cut_off_flag,
                        cutoffday: parseInt(obj.data.cut_off_day),
                        ownerorgid: obj.data.owner_org_id
                    }
                }else{
                    click_project_details = {
                        projectName: obj.data.project_name,
                        projectIdNumber: obj.data.project_id_number,
                        projectId: obj.data.project_id,
                        projectOwner: obj.data.project_owner,
                        projectWpcId: obj.data.project_wpc_id,
                        projectType: obj.data.project_type, //project type asset or construct
                        projectRegion: obj.data.region,//asset region
                        parentId: parentid, //get parent id number if package project
                        projectIndustry: obj.data.industry,
                        projectIcon: obj.data.icon_url,
                        projectTimezoneValue: obj.data.time_zone_value,
                        projectTimezoneText: obj.data.time_zone_text,
                        projectPhase: obj.data.project_phase,
                        projectWpcAbbr: obj.data.wpc_abbr,
                        projectLocation: obj.data.location,
                        createdBy: obj.data.created_by,
                        projectCreateTime: created_datetime,
                        projectUpdateBy: obj.data.updated_by,
                        projectUpdateTime: update_datetime,
                        projectStatus: obj.data.status,
                        projectContractor: obj.data.contractor_org_id,
                        projectConsultant: consultantOrgDb,
                        lat1: lat1,
                        lat2: lat2,
                        long1: long1,
                        long2: long2,
                        startDate: startdate,
                        endDate: enddate,
                        duration: obj.data.duration,
                        users: obj.project_users,
                        applist: obj.app_list,
                    }
                    if(obj.data.parent_region){
                        click_project_details.parent_region = obj.data.parent_region;
                    }
                }
                               
                //handle readonly view in project wizard
                // Loop user data and insert into Read-only view in wizard
                Object.keys(click_project_details).forEach(key => {
                    if(click_project_details[key] && click_project_details[key] !== undefined && click_project_details[key] !== ''){
                        if($(`.projectInfo.${key}`)){
                            $(`.projectInfo.${key}`).html(`${click_project_details[key]}`)
                        }
                        if(key == 'projectIcon'){
                            $.ajax({
                                url:`../../${click_project_details[key]}`,
                                type:'HEAD',
                                error: function()
                                {
                                    $(`.infoProfilePic.${key}`).children(`img`).attr(`src`, ``)
                                },
                                success: function()
                                {
                                    $(`.infoProfilePic.${key}`).children(`img`).attr(`src`, `../../${click_project_details[key]}`)
                                }
                            });                           
                        }
                    }else{
                        if($(`.projectInfo.${key}`)){
                            $(`.projectInfo.${key}`).html(`N/A`)
                        }
                        if(key == 'projectIcon'){
                            $(`.infoProfilePic.${key}`).children(`img`).attr(`src`, ``)
                        }
                    }
                });

                if (lat1 !== lat2) {
                    $("#lat1").html(lat1);
                    $("#long1").html(long1);
                    $("#lat2").html(lat2);
                    $("#long2").html(long2);
                } else {
                    $(".coordComma").hide();
                }

                if(click_project_details.projectType && click_project_details.projectType == 'CONSTRUCT'){
                    $("#constructProject").prop("checked", true);
                    $("#assetProject").prop("checked", false);
                    $("#fmProject").prop("checked", false);
                    $("#reviewAppTitle").html("Construct");
                }else if(click_project_details.projectType && click_project_details.projectType == 'ASSET'){
                    $("#constructProject").prop("checked", false);
                    $("#assetProject").prop("checked", true);
                    $("#fmProject").prop("checked", false);
                    $("#reviewAppTitle").html("Asset");
                }else if(click_project_details.projectType && click_project_details.projectType == 'FM'){
                    $("#constructProject").prop("checked", false);
                    $("#assetProject").prop("checked", false);
                    $("#fmProject").prop("checked", true);
                    $("#reviewAppTitle").html("FM");
                }

                //handle wizard button
                if ($("#projectstatusdisplay").html() == "archive") {
                    $("#newprojectEdit").css("display", "none");
                    $("#newprojectRestore").css("display", "inline-block");
                    $("#newprojectDelete").css("display", "none");
                    $("#newprojectDeletepermanent").css("display", "inline-block");
                } else {
                    $("#newprojectRestore").css("display", "none");
                    $("#newprojectEdit").css("display", "inline-block");
                    $("#newprojectDeletepermanent").css("display", "none");
                    $("#newprojectDelete").css("display", "inline-block");
                }
                $('.loader').fadeOut(100)
                OnClickOpenReadViewer()

                //fill in input field in project form for edit
                fillProjectForm(click_project_details)
            } else {
                console.log(obj.error);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
}

addRegion = () =>{
    var reg = $('#projectRegionInput').val();
    var region = $('#projectRegion').val()
    reg = $.trim(reg);
    reg = reg.toUpperCase();
    if(region !="") region += "," + reg;
    else region =reg;
    $('#projectRegion').val(region);
    $('#projectRegionInput').val("");
}

function onchangeProjectOnDate() {
    var enddate = $("#projectenddate").val();
    var startdate = $("#projectstartdate").val();
    var date1 = new Date(enddate);
    var date2 = new Date(startdate);
    var res = Math.abs(date1.getTime() - date2.getTime());
    var msecday = 1000 * 60 * 60 * 24;
    var duration = Math.ceil(res / msecday);
    $("#projectduration").val(duration);
}

function getSelectedGroupRoles() {
    userProjectGroupArr.splice(0, userProjectGroupArr.length);
    $("input.addusergrouptable:checkbox:checked").each(function () { //adds contractor users
        var sid = "gs" + $(this).attr("id");
        console.log(sid);
        var slt = document.getElementById(sid);
        if (!slt.options[slt.selectedIndex]) {
            flagError = true
            return false;
        }
        var selectedValues = [];
        for (var i = 0; i < slt.selectedOptions.length; i++) {
            selectedValues.push(slt.selectedOptions[i].value);
        }
        // var val = slt.options[slt.selectedIndex].value;
        console.log(selectedValues);
        var email = $(this).parent().parent().parent().find("div:nth-child(2) span").text();
        var name = $(this).parent().parent().parent().find("div:nth-child(3) span").text();

        userProjectGroupArr.push({
            user_id: parseInt($(this).attr("id")),
            user_group: selectedValues.join(),
            user_email: email.trim()
        });
        var ind = newuserlist.findIndex(item => item.email === email);
        console.log(ind);
        if (ind != -1) {
            newuserlist[ind]['group'] = selectedValues.join();
        }
    });
    // need to do the display here as we get the group role.. remove it from top page.
    var myhtml = "";
    for (var i = 0; i < newuserlist.length; i++) {
        myhtml += 
                `<div class="row system-admin fourColumn searchv3">
                    <div class="columnMiddle textContainer">
                        <span class="text wordWrap">`+newuserlist[i].firstname+`</span>
                    </div>
                    <div class="columnMiddle textContainer">
                        <span class="text wordWrap">`+newuserlist[i].email+`</span>
                    </div>
                    <div class="columnMiddle textContainer">
                        <span class="text wordWrap">`+newuserlist[i].role+`</span>
                    </div>
                    <div class="columnMiddle textContainer">
                        <span class="text wordWrap">`+newuserlist[i].group+`</span>
                    </div>
                </div>`;
    }
    $("#projectUserList").html(myhtml);
}

function addUserToProjectGroup(ele) {
    if ($(ele).is(":checked")) {
        var id = "gs" + $(ele).attr("id");
        var slt = document.getElementById(id);
        slt.value = "";
        slt.style.display = "block";
    } else {
        var id = "gs" + $(ele).attr("id");
        var slt = document.getElementById(id);
        slt.style.display = "none";
    }
}

//function to display the selected users in project group page for group selection -- KKR
function displaySelectedUsersForGroupRole(projectusers) {
    var addgrouphtml = "";
    for (var i = 0; i < projectusers.length; i++) {
        var role = projectusers[i].user_role;
        var email = projectusers[i].user_email;
        var id = projectusers[i].user_id;
        var option = "";
        switch (role) {
            case "Consultant RE":
            case "QAQC Engineer":
            case "Safety Officer":
                option = '<option value= "Technical Reviewer">Technical Reviewer</option>' +
                            '<option value= "MA Committee" >MA Committee</option>';
                break;
            case "Project Manager":
            case "Construction Engineer":
                    option = '<option value= "MA Committee" >MA Committee</option>';
                break;
            default:
                option = "";
                break;
        }

        addgrouphtml +=

            `<div class="row system-admin fiveColumn addUserGroupTableBody">
                <div class="columnSmall">
                    <span class="text"><input type="checkbox" onchange="addUserToProjectGroup(this)" class="addusergrouptable" data-userid= "`+projectusers[i].user_id+`" id="`+projectusers[i].user_id+`"></span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+projectusers[i].user_email+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+projectusers[i].user_name+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+projectusers[i].user_org+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+projectusers[i].user_role+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text">
                        <select data-userid='`+projectusers[i].user_id+`' id="gs`+projectusers[i].user_id+`" class = "addusergroupselect" style="display: none;" multiple ="multiple" size="2">
                            `+option+`
                        </select>
                    </span>
                </div>
            </div>`;
    };
    $('#addUserGroupTableBody').html(addgrouphtml);
    return true;
}

function getSelectedProjectUsers() {

    userProjectArr.splice(0, userProjectArr.length);
    newuserlist.splice(0, newuserlist.length);

    var flagError = false;
    var ownerNameFlag = false;
    
    ownerOrgName = "";

    $("input.addusertable:checkbox:checked").each(function () { //adds owner users
        var sid = "s" + $(this).attr("id");
        var slt = $("#"+sid+".adduserselect option:selected").val();
        if (!slt && slt == "") {
            flagError = true
            return;
        }
        var val = slt;
        var email = $(this).parent().parent().parent().find("div:nth-child(2) span").text();
        var name = $(this).parent().parent().parent().find("div:nth-child(3) span").text();
        var org = $(this).parent().parent().parent().find("div:nth-child(4) span").text();

        if (!ownerNameFlag) {
            ownerOrgName = $(this).closest("tr").find("td:eq(3)").text();
            if (ownerOrgName != "") {
                ownerNameFlag = true;
            }

        };

        var dbcUser = $(this).data('userdbc');
        var orgSubTypeStr = "";

        if(dbcUser == 1){
            orgSubTypeStr = "owner"
        }

        userProjectArr.push({
            user_id: parseInt($(this).attr("id")),
            user_role: val,
            user_email: email.trim(),
            user_name: name,
            user_org: org,
            user_orgSubType : orgSubTypeStr
        });

        newuserlist.push({
            email: email.trim(),
            firstname: name,
            role: val,
            group: ""
        });
    });

    $("input.addcontractusertable:checkbox:checked").each(function () { //adds contractor users
        var sid = "s" + $(this).attr("id");
        var slt = $("#"+sid+".addcontractuserselect option:selected").val();
        if (!slt && slt == "") {
            flagError = true
            return;
        }
        var val = slt;
        var email = $(this).parent().parent().parent().find("div:nth-child(2) span").text();
        var name = $(this).parent().parent().parent().find("div:nth-child(3) span").text();
        var org = $(this).parent().parent().parent().find("div:nth-child(4) span").text();

        var dbcUser = $(this).data('userdbc');
        var orgSubTypeStr = "";

        if(dbcUser == 1){
            orgSubTypeStr = "contractor"
        }

        userProjectArr.push({
            user_id: parseInt($(this).attr("id")),
            user_role: val,
            user_email: email.trim(),
            user_name: name,
            user_org: org,
            user_orgSubType : orgSubTypeStr
        });

        newuserlist.push({
            email: email.trim(),
            firstname: name,
            role: val,
            group: ""
        });
    });

    $("input.addconsultantusertable:checkbox:checked").each(function () { //adds consultant users
        var sid = "s" + $(this).attr("id");
        var slt = $("#"+sid+".addconsultantuserselect option:selected").val();
        if (!slt && slt == "") {
            flagError = true
            return;
        }
        var val = slt;
        var email = $(this).parent().parent().parent().find("div:nth-child(2) span").text();
        var name = $(this).parent().parent().parent().find("div:nth-child(3) span").text();
        var org = $(this).parent().parent().parent().find("div:nth-child(4) span").text();

        var dbcUser = $(this).data('userdbc');
        var orgSubTypeStr = "";

        if(dbcUser == 1){
            orgSubTypeStr = "consultant"
        }

        userProjectArr.push({
            user_id: parseInt($(this).attr("id")),
            user_role: val,
            user_email: email.trim(),
            user_name: name,
            user_org: org,
            user_orgSubType : orgSubTypeStr
        });

        newuserlist.push({
            email: email.trim(),
            firstname: name,
            role: val,
            group: ""
        });
    });

    if (flagError) {
        return true;
    } else {
        return false;
    }

}

function OnClickAddUsersToProjectNext() {
    // for process app (construct or asset)
    if (SYSTEM == 'OBYU'){
        var constructProcessApp = {
            "app_NCR": "Non Conformance Report (NCR)",
            "app_WIR": "Work Inspection Request (WIR)",
            "app_RFI": "Request For Information (RFI)",
            "app_MOS": "Method Statement (MS)",
            "app_MS": "Material Submission (MT)",
            "app_IR": "Incident (INC)",
            "app_SDL": "Site Diary (SD)",
            "app_SD": "Site Instruction (SI)", //change only for OBYU, because they called it as Site Instruction and not Site Direction
            "app_RS": "Report Submission (RS)",
            "app_SA": "Safety Activity (SA)",
            "app_SMH": "Total Man-Hour Works Without LTI (SMH)",
            "app_PTW": "Permit To Work",
            "app_CAR": "Corrective Action Request",
            "app_RR": "Risk Register",
            "app_NOI": "Notice of Improvement (NOI)",
            "app_PUBC": "Public Complaint (PUBC)",
            "app_EVNT": "Event (EVNT)",
            "app_LAND": "Land (LTD & LM)",
        };
    }else{
        var constructProcessApp = {
            "app_NOI":"Notice Of Improvement (NOI)",
            "app_NCR":"Non Conformance Report (NCR)",
            "app_WIR":"Work Inspection Request (WIR)",
            "app_DCR":"Design Change Request (DCR)",
            "app_RFI":"Request For Information (RFI)",
            "app_MOS":"Method Statement (MS)",
            "app_MS":"Material Acceptance (MT)",
            "app_IR":"Incident (INC)",
            "app_SDL":"Site Daily Log (SDL)",
            "app_SD":"Site Direction (SD)",
            "app_RS":"Report Submission (RS)",
            "app_SA":"Safety Activity (SA)",
            "app_SMH":"Total Man-Hours (SMH)",
            "app_RR":"Risk Register (RR)",
            "app_LR":"Land Registration (LR)",
            "app_LI":"Land Issue (LI)",
            "app_LE":"Land Encumbrances (LE)",
            "app_LS":"Land Summary (LS)",
            "app_PBC":"Public Complaint (PBC)",
            "app_DA":"Approved Design Drawing (DA)",
            "app_PU":"Progress Update (PU)",
            "app_RSDL":"RET’s Site Diary Log (RSDL)"
        };
    }

    var assetProcessApp = {
        "app_asset_insp":"Inspection",
        "app_asset_assess":"Assesment",
        "app_asset_rm":"Routine Maintainence",
        "app_asset_pm":"Periodic Maintainence",
        "app_asset_ew":"Emergency Works",
        "app_asset_rfi":"Request for Inspection",
        "app_asset_ncp":"Non Conformance Product",
        "app_asset_pca":"Pavement Analysis Upload",
        "app_asset_setup":"Setup"
    };
    
    var constructProcess = {
        ...constructProcessApp,
        ...assetProcessApp
    };

    var flagError = getSelectedProjectUsers();

    if (flagError === true) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Please ensure role for each user is assigned.",
        });
        return false
    }
    //remember need to uncomment back after setting project area
    OnClickOpenViewer2();

    getSelectedGroupRoles(); //add the group roles to the review list.

    //to add the app list selected if it is a package project.. check if overall project or package first
    if ($("#overallprojectCheck").is(":checked")) {
        $('#applicationContainerID').parent().show();
        $('#appAssignContainerID').show();
        $('#appAssignContainerID').parent().find('i').removeClass("disabled")
        $('#appAssignContainerID').parent().find('i').addClass("opened")

        $("#constructProccess").html("")
        $("#constructApp").html("")
        if ($("#jogetPackage").val() != "") {
            let packageName = $("#jogetPackage option:selected").text()
            let packageId = $("#jogetPackage option:selected").val()
            $('#constructApp').html(`<span class="textWrap conAppList" appValue="${packageId}::${packageName}" value="" name="constructPackage_name">${packageName}</span>`);

            let appflag = false;
            $(".jogetApp_list:checkbox:checked").each(function () {
                let id = this.id;
                let text = constructProcess[id];
                if (!appflag) {
                    $('#constructProccess').append(`<div class="textWrap table conAppList" appValue="${true}" value="" name="${this.id}">${text}</div>`);
                    appflag = true;
                } else {
                    $('#constructProccess').append(`<div class="textWrap table conAppList" appValue="${true}" value="" name="${this.id}">${text}</div>`);
                }
            });
        }


        $("#financeProcess").html("")
        $("#financeApp").html("")
        if ($("#jogetFinancePackage option:selected").val() != "") {
            let packageName = $("#jogetFinancePackage option:selected").text()
            let packageId = $("#jogetFinancePackage option:selected").val()
            $('#financeApp').html(`<span class="textWrap finAppList" appValue="${packageId}::${packageName}" value="" name="financePackage_name">${packageName}</span>`);
            let finAppFlag = false;
            $('#financeProcess').html("")
            $(".jogetPFS_App_list:checkbox:checked").each(function () {
                let id = this.id;
                let text;
                switch (id) {
                    case "app_CP":
                        text = "Contract Particular";
                        break;
                    case "app_IC":
                        text = "Interim Claim (IC)";
                        break;
                    case "app_VO":
                        text = "Variation Order (VO)";
                        break;
                }
                if (!finAppFlag) {
                    $('#financeProcess').append(`<div class="textWrap table finAppList" appValue="${true}" value="" name="${this.id}">${text}</div>`);
                    finAppFlag = true;
                } else {
                    $('#financeProcess').append(`<div class="textWrap table finAppList" appValue="${true}" value="" name="${this.id}">${text}</div>`);
                }
            });
        }

        // document app review page
        $("#documentProcess").html("")
        $("#documentApp").html("")
        if ($("#jogetDocPackage option:selected").val() != "") {
            let packageName = $("#jogetDocPackage option:selected").text()
            let packageId = $("#jogetDocPackage option:selected").val()
            $('#documentApp').html(`<span class="textWrap docAppList" appValue="${packageId}::${packageName}" value="" name="documentPackage_name">${packageName}</span>`);
            let docFirstProcessFlag = true;
            $("#documentProcess").html("")
            $(".jogetDoc_App_list:checkbox:checked").each(function () {
                let text;
                switch (this.id) {
                    case "app_DR":
                        text = "Document Registration (DR)";
                        break;
                    case "app_CORR":
                        text = "Correspondence (CORR)";
                        break;
                }
                if (docFirstProcessFlag) {
                    $('#documentProcess').append(`<div class="textWrap table docAppList" appValue="${true}" value="" name="${this.id}">${text}</div>`);
                    docFirstProcessFlag = false;
                } else {
                    $('#documentProcess').append(`<div class="textWrap table docAppList" appValue="${true}" value="" name="${this.id}">${text}</div>`);
                }
            });
        }
    } else {
        $('#applicationContainerID').parent().hide();//package project, no apps
        $('#appAssignContainerID').hide(); //package project, no apps
        $('#appAssignContainerID').parent().find('i').removeClass("opened")
        $('#appAssignContainerID').parent().find('i').addClass("disabled")
    };
}

function checkSelectedUsers() { //check if the checked users have a role selection
    var flagError = false;
    $("input.addusertable:checkbox:checked").each(function () { //adds owner users
        var sid = "s" + $(this).attr("id");
        var slt = document.getElementById(sid);
        if (!slt.options[slt.selectedIndex]) {
            flagError = true;
            return;
        }else if(slt.options[slt.selectedIndex].value == ""){
            flagError = true;
            return;
        }
    });
    if (flagError) {
        return true;
    } else {
        return false;
    }
}

function addUserToProject(ele) {
    usersUpdateflag = true;
    if ($(ele).is(":checked")) {
        var id = "s" + $(ele).attr("id");
        var dataId = $(ele).data('userid');
        var dbcuser = $(ele).data('userdbc');
        var inputClass = $(ele).attr("class");
        var targetClass = $(ele).data('userselect');
        var slt = document.querySelector('#'+id+'.'+targetClass);
        var currentClassArr = ['addusertable', 'addcontractusertable', 'addconsultantusertable']
        slt.style.display = "block";

        if(targetClass == "adduserselect"){
            slt.value = "";
        }

        if(dbcuser == 1){
            var inputContractor = $('input#'+dataId+'.'+inputClass);

            currentClassArr.forEach(function(idx){
                if(idx !== inputClass){
                    if(inputContractor){
                        var inputTarget = $('input#'+dataId+'.'+idx);
                        inputTarget.prop('checked', false);
                        inputTarget.parent().parent().parent().find('select').hide();
                    }
                }
            })
        }
    } else {
        var id = "s" + $(ele).attr("id");
        var targetClass = $(ele).data('userselect');
        var slt = document.querySelector ('#'+id+'.'+targetClass);
        slt.style.display = "none";
    }
}

function checkAllFormUsers(ele) {
    var groupTable = $(ele).data("tableclass")
    var checkboxes = document.getElementsByClassName(`${groupTable}`);
    var slt = document.getElementsByClassName("adduserselect");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (!slt[i].value) {
                slt[i].value = "Member"
                slt[i].checked = true
            }

            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
            slt[i].style.display = 'block';
            $(".appearoncheck").css('display', 'block');
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (!checkboxes[i].disabled) {
                if (checkboxes[i].type == "checkbox") {
                    checkboxes[i].checked = false;
                }
                slt[i].style.display = "none";
                slt[i].value = ""
                $(".appearoncheck").css("display", "none");
            }
        }
    }
}

function OnChangePackageSelection() {
    let package = $("#jogetPackage option:selected").val();
    $('input[name="newProjCheck"]').val();
    if (package != "") {
        $(".jogetApp_list").prop("disabled", false);
        
        var projType = ($('input[name="newProjCheck"]:checked').attr('id') == 'assetProject') ? 'ASSET' : 'CONSTRUCT';        
        if(projType == 'ASSET'){
            $('#assetAppProcess').find('.jogetApp_list').prop('checked', true)
            $('#constructAppProcess').find('.jogetApp_list').prop('checked', false);
        }else{
            $('#constructAppProcess').find('.jogetApp_list:visible').prop('checked', true)
            $('#assetAppProcess').find('.jogetApp_list').prop('checked', false);        
        }
    } else {
        $(".jogetApp_list").prop("disabled", true);
        $(".jogetApp_list").prop('checked', false);
    }
}

function OnChangeFinancePackageSelection() {
    let package = $("#jogetFinancePackage option:selected").val();
    // let myclass = ".jogetPFS_App_list";
    if (package != "") {
        // $('#app_CP').prop('checked', true);
        $(".jogetPFS_App_list:not(#app_CP)").prop("disabled", false);
        $(".jogetPFS_App_list").prop('checked', true);
    } else {
        $(".jogetPFS_App_list").prop("disabled", true);
        $(".jogetPFS_App_list").prop('checked', false);
    }
    //getJogetAppList(package, myclass);
}

function OnChangeDocPackageSelection() {
    let package = $("#jogetDocPackage option:selected").val();
    if (package != "") {
        $(".jogetDoc_App_list:not(#app_DR)").prop("disabled", false);
        $(".jogetDoc_App_list").prop('checked', true);
    } else {
        $(".jogetDoc_App_list").prop("disabled", true);
        $(".jogetDoc_App_list").prop('checked', false);
    }
}

//copy value inside input field and put it on display
function copyprojectinputvalue() {
    let projectid = $("#projectId").val();
    let projectname = $("#projectName").val();
    let projectowner = $('#projectOwner').val();
    let projectwpcid = $('#projectWpcId').val();
    let projectindustry = $("#projectIndustry").val();
    let projectphase = $("#projectPhase").val();
    let projectwpcabbr = $("#projectWpcAbbr").val();
    let projecttimezone = $("#projectTimezone option:selected").text();
    var projecttype = "";
    if($('#constructProject').is(" :checked")){
        projecttype = 'CONSTRUCT';
    }else if($('#assetProject').is(" :checked")){
        projecttype = 'ASSET';
    }else if($('#fmProject').is(" :checked")){
        projecttype = 'FM';
    }
    let projectregion;
    let projectPackage = $('#overallprojectCheck').is(":checked");

    if(projectPackage){
        projectregion = $('#projectRegion').val();
    }else{
        projectregion = $('#packageRegion').val();
    }

    let projectlocation = $("#projectLocation").val();
    let projectimage = $("#projectimage").attr("src");
    $("#projectiddisplay").html(projectid);
    $("#projectnamedisplay").html(projectname);
    $('#projectownerdisplay').html(projectowner);
    $('#projectwpciddisplay').html(projectwpcid);
    $("#projectindustrydisplay").html(projectindustry);
    $("#projecttimezonedisplay").html(projecttimezone);
    $("#projectlocationdisplay").html(projectlocation);
    $('#projecttypedisplay').html(projecttype);
    $('#projectregiondisplay').html(projectregion);
    if($('#projectPhase').is(':checked') && projectowner == 'JKR_SABAH'){
        $('#projectphasedisplay').html(projectphase);
        $('#projectwpcabbrdisplay').html(projectwpcabbr);
    }else{
        $('#projectphasedisplay').html('');
        $('#projectwpcabbrdisplay').html('');
    }
    if (projectimage !== "") {
        $('.infoProfilePic.projectIcon').children(`img`).attr(`src`, `${projectimage}`)
    }else{
        $('.infoProfilePic.projectIcon').children(`img`).attr(`src`, ``)
    }
    $("#newprojectheaderDisplay").html(projectname);
    $("#lat1").html($("#latit1").html());
    $("#lat2").html($("#latit2").html());
    $("#long1").html($("#longit1").html());
    $("#long2").html($("#longit2").html());
    $("#projectstartdatedisplay").html($("#projectstartdate").val());
    $("#projectenddatedisplay").html($("#projectenddate").val());
    $("#projectdurationdisplay").html($("#projectduration").val());
    $("#projectcutoffdisplay").html($("#projectcutoff").val());
    if(projecttype == "ASSET"){
        $('#projectregiondisplaycont').css("display", "flex");
        $('#projectwpciddisplaycont').hide();
    }else{
        $('#projectwpciddisplaycont').css("display", "flex");
        $('#projectregiondisplaycont').hide();
    }

    /// Yet to add function for copying the value from second page to the last page. ///
}

function OnChangeContractorSelection(selectVal) {
    contractorSelectizeOrg = selectVal.toString();
    let selectedOrgName = $('#contractorSelector option:selected').text();
    var kkrContractorOwnerRoles = ["Contractor DC", "Site Supervisor", "HSET Officer", "Contractor CM", "QAQC Officer", "Contractor QS"];
    if(IS_DOWNSTREAM){
        var kkrContractorOwnerRoles = ["Contractor DC", "Site Supervisor", "HSET Officer", "Contractor CM", "QAQC Officer", "Contractor QS", "Contractor FR",
                                        "Site Engineer", "Land Officer", "Bumi Officer", "Risk Engineer", "Planning Engineer", "QAQC Manager", "Project Engineer", "Project Director", "Assistant Construction Manager", "Head of Department"];
    }

    if (selectVal) {
        $.ajax({
            url: '../BackEnd/ProjectFunctions.php', // update admin dashboard card infomation
            type: "POST",
            dataType: "json",
            data: {
                functionName: "getOrgUsers",
                orgID: selectVal
            },
            success: function (res) {
                let response = res.org_users;
                let userhtml = "";
                if (response) {
                    for (var i = 0; i < response.length; i++) {

                        var dbcUserFlag = (response[i].orgType == 'DBC') ? 1 : 0;
                        userhtml += 
                            `<div class="row system-admin fiveColumn searchv3">
                                <div class="columnSmall">
                                    <span class="text"><input type="checkbox" onchange="addUserToProject(this)" class="addcontractusertable" data-userid= "`+response[i].user_id+`" data-userselect="addcontractuserselect" data-orgtype="contractor" data-userdbc="`+dbcUserFlag+`" id="`+response[i].user_id+`"></span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+response[i].user_email+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+response[i].user_firstname+` `+response[i].user_lastname+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+selectedOrgName+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+response[i].user_country+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`;
                        userhtml +=     `<select data-userid='`+response[i].user_id+`' id="s`+response[i].user_id+`" class = "addcontractuserselect" style="display: none;">
                                            <option value= "" >Please Select..</option>
                                            <option value= "Contractor PM" >Contractor PM</option>
                                            <option value= "Contractor Engineer">Contractor Engineer</option>`;
                                            if(SYSTEM == 'KKR'){
                                                kkrContractorOwnerRoles.forEach((ele)=>{
                                                    userhtml += `<option value= "`+ele+`">`+ele+`</option>`;
                                                })
                                            }
                        userhtml +=     `</select>`;
                        userhtml += `</span>
                                </div>
                            </div>`;
                    }
                };
                $('#addContractorUserTableBody').html(userhtml);
                $('input.addcontractusertable').removeAttr('checked');
                if (click_project_details && click_project_details.projectContractor) {
                    setContractUsers()
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
    } else {
        $('#addContractorUserTableBody').html("");

    }


}

function OnChangeConsultantSelection(selectVal) {
    consultantSelectizeOrg = selectVal;
    var kkrConsultantOwnerRoles = ["Consultant DC", "Sys Consultant", "Consultant QS"];

    if(selectVal.length > 1){
        $(".selectize-control.multi").css("width", "150%");
    }
    else{
        $(".selectize-control.multi").css("width", "100%");
    }

    if (selectVal) {
        $.ajax({
            url: '../BackEnd/ProjectFunctions.php', // update admin dashboard card infomation
            type: "POST",
            dataType: "json",
            data: {
                functionName: "getOrgUsers",
                orgID: selectVal
            },
            success: function (res) {
                let response = res.org_users;
                let userhtml = "";
                if (response) {
                    for (var i = 0; i < response.length; i++) {

                        var dbcUserFlag = (response[i].orgType == 'DBC') ? 1 : 0;
                        userhtml +=

                            `<div class="row system-admin fiveColumn searchv3">
                                <div class="columnSmall">
                                    <span class="text"><input type="checkbox" onchange="addUserToProject(this)" class="addconsultantusertable" data-userid= "`+response[i].user_id+`" data-userselect="addconsultantuserselect" data-orgtype="consultant" data-userdbc="`+dbcUserFlag+`" id="`+response[i].user_id+`"></span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+response[i].user_email+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+response[i].user_firstname+` `+response[i].user_lastname+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+response[i].orgName+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`+response[i].user_country+`</span>
                                </div>
                                <div class="columnMiddle textContainer">
                                    <span class="text">`;
                        userhtml +=     `<select data-userid='`+response[i].user_id+`' id="s`+response[i].user_id+`" class = "addconsultantuserselect" style="display: none;">
                                            <option value= "" >Please Select..</option>
                                            <option value= "Consultant CRE" >Consultant CRE</option>
                                            <option value= "Consultant RE">Consultant RE</option>`;
                                            if(SYSTEM == 'KKR'){
                                                kkrConsultantOwnerRoles.forEach((ele)=>{
                                                    userhtml += `<option value= "`+ele+`">`+ele+`</option>`;
                                                })
                                            }
                        userhtml +=     `</select>`;
                        userhtml += `</span>
                                </div>
                            </div>`;
                    }
                };
                $('#addConsultantUserTableBody').html(userhtml);
                $('input.addconsultantusertable').removeAttr('checked');
                if (click_project_details && click_project_details.projectConsultant) {
                    setConsultantUsers();
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
    } else {
        $('#addConsultantUserTableBody').html("");
    }


}

//copy value inside div into input fields for project
fillProjectForm = (data) => {
    // ----------------first page-----------------------//
    //check if ovarall project or package
    if (data.parentId == null) {//overall project
        //tick overall project in first page of project edit
        $("#overallprojectCheck").prop("checked", true);
        $("#packagespecificCheck").prop("checked", false);
        // add the app list
        if(data.projectType == 'ASSET'){
            changeJogetPackageList(assetPackages);
        }else if(data.projectType == 'FM'){
            changeJogetPackageList(assetPackages);
        }
        addAppList(data);
        overallprojectState();

    } else { //package project
        //tick package specific in first page of project edit
        $("#overallprojectCheck").prop("checked", false);
        $("#packagespecificCheck").prop("checked", true);
        removeAppList()
        packagespecificState()

        if(data.projectType && data.projectType == "ASSET"){
            $("#label-projectwpcid").hide() //hide wpcid for asset package
            $("#projectWpcId").hide() //hide wpcid asset package
        }
    };

    $("#overallprojectCheck").prop("disabled", true);
    $("#packagespecificCheck").prop("disabled", true);

    //refreshUserTableBody(); // to get all the users if added recently in the project team page.
    if(data.projectType && data.projectType == "CONSTRUCT"){
        $("#constructProject").prop("checked", true);
        $("#assetProject").prop("checked", false);
        $("#fmProject").prop("checked", false);
        $("#constructProject").prop("disabled", true);
        $("#assetProject").prop("disabled", true);
        $("#fmProject").prop("disabled", true);
        //$('#inv').hide();
        toggleProjectType()
        visibilityProjectPhase(data.projectOwner, data.parentId);
    }else if(data.projectType && data.projectType == "ASSET"){
        $("#constructProject").prop("checked", false);
        $("#assetProject").prop("checked", true);
        $("#fmProject").prop("checked", false);
        $("#constructProject").prop("disabled", true);
        $("#assetProject").prop("disabled", true);
        $("#fmProject").prop("disabled", true);
        //$('#inv').show();
        toggleProjectType('ASSET')
    }else if(data.projectType && data.projectType == "FM"){
        $("#constructProject").prop("checked", false);
        $("#assetProject").prop("checked", false);
        $("#fmProject").prop("checked", true);
        $("#constructProject").prop("disabled", true);
        $("#assetProject").prop("disabled", true);
        $("#fmProject").prop("disabled", false);
        //$('#inv').show();
        toggleProjectType('FM')
    }
    
    $('#projectIdNumber').val(data.projectIdNumber) 
    $('#projectId').val(data.projectId)
    $('#projectId').prop("disabled", true)
    $('#projectName').val(data.projectName)
    $('#projectOwner').val(data.projectOwner).prop('selected', true)
    $('#projectOwner').prop("disabled", true)
    if (data.projectWpcId){
        $('#projectWpcId').val(data.projectWpcId)
        $('#projectWpcId').prop("disabled", true)
        $("input#projectWpcId").addClass("readonly")
    }
    $('#projectIndustry').val(data.projectIndustry).prop('selected', true)
    $('#projectTimezone').val(data.projectTimezoneValue).prop('selected', true)

    if(data.projectPhase == '1B'){
        $('#projectPhase').prop('checked', true)
        $('#projectPhase').prop('disabled', true)
        wpcAbbrState('visible', data.projectWpcAbbr)
    }

    $('#projectLocation').val(data.projectLocation).prop('selected', true)
    if(data.projectIcon != "favicon.ico"){ // show only if icon is selected
        $('#projectimage').parent().show();
         $('#projectimage').attr('src',"../../" + data.projectIcon);
    }

    if(data.projectType && data.projectType == "ASSET"  && data.parentId == null){
        $('.assetProject').css("display", "flex");
        $('.regionCont').css("display", "flex");
        $('#projectRegion').val(data.projectRegion);
        $('.packageRegionCont').hide();
    }else  if(data.projectType && data.projectType == "ASSET" && data.parentId !== null) {
        $('.assetProject').css("display", "flex");
        $('.regionCont').hide();
        $('.packageRegionCont').css("display", "flex");
        document.querySelectorAll('#packageRegion option').forEach(option => option.remove());
        var regions = data.parent_region ? regions = data.parent_region.split(',') : '';
        let myselectdoc = document.getElementById('packageRegion');
        let myoption2 = document.createElement("option");
        myoption2.value = "";
        myoption2.text = "Please Select";
        myselectdoc.appendChild(myoption2);

        if(regions){
            regions.forEach((region) => {
                var myoption2 = document.createElement("option");
                myoption2.value = region;
                myoption2.text = region;
                myselectdoc.appendChild(myoption2);
                
            });
        }
        $("#packageRegion option[value= '" + data.projectRegion + "']").attr("selected", true);
        $("#label-projectwpcid").hide() //hide wpcid for overall
        $("#projectWpcId").hide() //hide wpcid for overall

    }else{
        $('.regionCont').hide();
        $('.packageRegionCont').hide();
        $('.assetProject').hide();
        $('#projectcutoff').val(data.cutoffday);
    }

    // ----------------second page-----------------------//
    let offset = new Date(data.startDate).getTimezoneOffset();
    let pStartDate = new Date(data.startDate)
    let pEndDate = new Date(data.endDate)
    pStartDate = new Date(pStartDate.getTime() - (offset * 60 * 1000))
    pEndDate = new Date(pEndDate.getTime() - (offset * 60 * 1000))
    document.getElementById("projectstartdate").valueAsDate = pStartDate
    document.getElementById("projectenddate").valueAsDate = pEndDate
    $('#projectduration').val(data.duration);

    if (data.lat1 !== data.lat2) {
        $("#latit1").html(data.lat1);
        $("#latit2").html(data.lat2);
        $("#longit1").html(data.long1);
        $("#longit2").html(data.long2);

        ReadEntity = viewer4.entities.add({
            selectable: false,
            show: true,
            rectangle: {
                coordinates: readRectangle,
                material: Cesium.Color.YELLOW.withAlpha(0.7),
            },
        });
        viewer4.camera.setView({
            destination: readRectangle,
        });
    } else {
        viewer4.camera.setView({
            destination: defaultview,
        });
    }

    var obj = click_project_details.users;
    //iterate to populate table with associate users on display project details
    var usershtml = "";
    var usersheaderhtml = "";

    usersheaderhtml = ` <span class="columnMiddle">First Name</span>
                        <span class="columnMiddle">Email</span>
                        <span class="columnMiddle">System Role</span>
                        <span class="columnMiddleSmall">Org</span>
                        <span class="columnMiddle">Added By</span>
                        <span class="columnMiddle">Added Date</span>`;
    
    $('#projectUserListHeader').html(usersheaderhtml);

    obj.forEach(iterateUsersArray);

    function iterateUsersArray(item, index) {
        if (item.added_time != null) {
            added_time = new Date(item.added_time).toDateString();
        } else {
            added_time = "NULL";
        }
        
        usershtml +=
            `<div class="row system-admin fourColumn">
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+item.user_firstname+` `+item.user_lastname+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+item.user_email+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+item.Pro_Role+`</span>
                </div>
                <div class="columnMiddleSmall textContainer">
                    <span class="text wordWrap">`+item.user_org+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+item.added_by+`</span>
                </div>
                <div class="columnMiddle textContainer">
                    <span class="text wordWrap">`+item.added_time+`</span>
                </div>
            </div>`;
    }

    $("#projectUserList").html(usershtml);
    //Select Contractor in multi select
    refreshContractOrgList(click_project_details.projectContractor)

    //Select consultant in multi select
    refreshConsultantOrgList(click_project_details.projectConsultant)

    //Fill in the selected/enrolled user to the project - Project user selection list (owner)
    $(`#addUserTable .row div:first-child span input:checkbox`).each(function (idx) {
        for(var i = 0; i < obj.length;) {
            if ($(this).data("userid") == obj[i].user_id) {
                //set users in contractor and consultant dbc table
                var orgSubType = obj[i].org_sub_type;
                if(orgSubType == "contractor" || orgSubType == "consultant"){
                    $(this).prop("checked", false);
                    $(`select#s`+obj[i].user_id+`.adduserselect`).css('display', 'none')
                }else{
                    $(this).prop("checked", true);
                    $(`select#s`+obj[i].user_id+`.adduserselect`).val(obj[i].Pro_Role).prop('selected', true)
                    $(`select#s`+obj[i].user_id+`.adduserselect`).css('display', 'block')
                }

                // if users also in child project it will be disabled
                if (obj[i].child_projects.length != 0) {
                    $(this).attr("disabled", true);

                    // also add info button to show which child project they in
                    var rowEmail = $(this).parent().parent().next()
                    if (rowEmail) {
                        rowEmail.append(`<span>&nbsp;<i class="fa-solid fa-circle-info" title="This user is also assigned in project(s):&#010;&#010;${obj[i].child_projects.join("&#010;")}"></i></span>`);
                    };
                }
                
                break;
            }
            i++;
        }
    });

    //display the users in group page and group roles
    if(SYSTEM == 'KKR'){
        var projectgroupusers = [];
        for (var i = 0; i < obj.length; i++) {
            var name = obj[i]['user_firstname'] + " " + obj[i]['user_lastname'];
            //var group = obj[i]['project_group'];
            projectgroupusers.push({
                user_id: obj[i]['Usr_ID'],
                user_role: obj[i]['Pro_Role'],
                user_email: obj[i]['user_email'].trim(),
                user_name: name,
                user_org: obj[i]['user_org']
            });
        }
        var flag = displaySelectedUsersForGroupRole(projectgroupusers);
        if (flag) {
            $('input:checkbox[class ="addusergrouptable"]').each(function () {
                var i = 0;
                while (i < obj.length) {
                    if ($(this).attr("id") == obj[i].user_id) {

                        var values = obj[i].project_group;
                        if (values.length > 0) {
                            $(this).prop("checked", true);
                            var id = "gs" + $(this).attr("id");
                            var element = document.getElementById(id);
                            for (var j = 0; j < element.options.length; j++) {
                                element.options[j].selected = values.indexOf(element.options[j].value) >= 0;
                            }
                            element.style.display = "block";
                        }

                        break;
                    }
                    i++;
                }
            });

        }
    }
    
    refreshParentProjectIDList(data.parentId);//populating the list and setting the value
}

//function for remove app list
function removeAppList() {
    $('#constructApp').html('');
    $('#financeApp').html('');
    $('#documentApp').html('');

    $('#constructProccess').html('');
    $('#financeProcess').html('');
    $('#documentProcess').html('');
}

//reset project app assignment joget packages
resetAppList = () =>{
    $(".jogetPFS_App_list:checkbox:checked").each(function () {
        document.getElementById(this.id).checked = false;
    });
    $(".jogetDoc_App_list:checkbox:checked").each(function () {
        document.getElementById(this.id).checked = false;
    });
    $('#app_CP').prop('disabled', false); // reset in case it was set to disable earlier (contract)
    $(".jogetApp_list:checkbox:checked").each(function () {
        document.getElementById(this.id).checked = false;
    })
    $(".jogetApp_list").prop("disabled", true);
    $(".jogetPFS_App_list").prop("disabled", true);
    $(".jogetDoc_App_list").prop("disabled", true);
}

//reset all input fields
resetprojectinputvalue = () => {

    $('#projectId').val("")
    $("#projectId").prop("disabled", false);
    $('#projectName').val("")
    $("#projectOwner").prop("disabled", false);
    $("#projectOwner").val("");
    $("#projectIndustry").prop("disabled", false);
    $("#projectIndustry").val("")
    $("#projectTimezone").prop("disabled", false);
    $("#projectTimezone").val("")
    $("#projectPhase").prop("disabled", false);
    $("#projectPhase").prop("checked", false);
    $('#projectRegion').val("")
    $('#parentId').val("");
    $('#parentId').prop('selectedIndex', 0);
    $("#parentId").prop("disabled", false);
    $('#projectLocation').val("")
    $('#projectWpcId').val("")
    $('#projectWpcId').prop("disabled", false);
    $('#overallprojectCheck').prop("checked", true)
    $('#overallprojectCheck').prop("disabled", false);
    $('#packagespecificCheck').prop("checked", false)
    $('#packagespecificCheck').prop("disabled", false);
    $('#constructProject').prop("checked", true)
    $('#constructProject').prop("disabled", false);
    $('#assetProject').prop("checked", false)
    $('#assetProject').prop("disabled", false);
    $(".packageType").hide();
    $('.assetProject').hide();
    $("#projectimage").attr("src", "");
    $("#projectimage").parent().hide();
    $("#imgInp").val("");
    $('input#projectId').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#projectName').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#projectWpcId').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('#projectstartdate').val("")
    $('#projectenddate').val("")
    $('#projectduration').val("")
    $('#projectcutoff').val(25)
    toggleProjectType()
    changeJogetPackageList(constructPackages)

    var selectContractor = $('#contractorSelector').selectize();
    selectContractor[0].selectize.clearOptions();
    var selectConsultant = $('#consultantSelector').selectize();
    selectConsultant[0].selectize.clearOptions();

    $("#users_in_project").html("");
    $("#projectimage").attr("src", "");
    $("#projectindustrydisplay").html("");
    $("#projecttimezonedisplay").html("");
    $("#projectphasedisplay").html("");
    $("#projectwpcabbrdisplay").html("");
    $(".hideoncreate").css("display", "flex");
    $("#lat1").html(" ");
    $("#lat2").html(" ");
    $("#long1").html(" ");
    $("#long2").html(" ");
    $("#latit1").html("");
    $("#latit2").html("");
    $("#longit1").html("");
    $("#longit2").html("");
    $(".jogetPFS_App_list:checkbox:checked").each(function () {
        document.getElementById(this.id).checked = false;
    });
    $(".jogetDoc_App_list:checkbox:checked").each(function () {
        document.getElementById(this.id).checked = false;
    });
    $('#app_CP').prop('disabled', false); // reset in case it was set to disable earlier (contract)
    $(".jogetApp_list:checkbox:checked").each(function () {
        document.getElementById(this.id).checked = false;
    })

    if(selector) selector.show = false;
    selector2.show = false;

    if (!(selector3 == null)) {
        selector3.show = false;
    }
    if (!(ReadEntity == null)) {
        ReadEntity.show = false;
    }
    $(".addusertable").attr("checked", false); // to clear all the checkboxes for add users
    $(".adduserselect").hide(); // to hide all the user role options till selected

    $('#addContractorUserTableBody').html(""); //clear the list of contract users
    $('#addConsultantUserTableBody').html(""); //clear the list of consultant users
    $(".addcontractusertable").attr("checked", false); // to clear all the checkboxes for add users
    $(".addcontractuserselect").hide(); // to hide all the user role options till selected
    $(".addconsultantusertable").attr("checked", false); // to clear all the checkboxes for add users
    $(".addconsultantuserselect").hide(); // to hide all the user role options till selected
    var selectizeConsultant = consultantSelect[0].selectize;
    selectizeConsultant.clearOptions();
    var selectizeContractor = contractorSelect[0].selectize;
    selectizeContractor.clearOptions();
    $(".jogetApp_list").prop("disabled", true);
    $(".jogetPFS_App_list").prop("disabled", true);
    $(".jogetDoc_App_list").prop("disabled", true);

    $('#appAssignContainerID').parent().find('i').removeClass("disabled")
    $('.dropDownList').each(function(){
        $(this).removeClass("closed")
        $(this).removeClass("fa-plus")
        $(this).addClass("opened")
        $(this).addClass("fa-minus")
        $(this).parent().siblings(".dropDown-body").show()
    })

    //reset page indicator
    $(`.upper-container.addNewProject [data-pageButton="2"]`).removeClass("disabled")
    $(`.upper-container.addNewProject [data-pagedivider="1"]`).removeClass("disabled")

    var pageLength = $('.modal-container.addNewProject').children(".page").length
    for (r = pageLength; r >= 3; r--){
        $(`.upper-container.addNewProject [data-pageButton="${r}"]`).find(`i`).removeClass(`fa-${r-1}`)
        $(`.upper-container.addNewProject [data-pageButton="${r}"]`).find(`i`).addClass(`fa-${r}`)
    }
}

// get the parent industry and time zone details to fill in for package
function updateIndustryTimezone() {
    let sel = document.getElementById('parentId');
    let selected = sel.options[sel.selectedIndex];
    let id = selected.value;
    let timezone = selected.getAttribute("timeValue");
    let industry = selected.getAttribute("industry");
    let projectowner = selected.getAttribute("projectowner");
    let projectregion = selected.getAttribute("region");
    let projecttype = selected.getAttribute("projecttype");

    if(projecttype && projecttype == "ASSET"){
        $('#constructProject').prop("checked", false);
        $('#assetProject').prop("checked", true);
        $('#fmProject').prop("checked", false);
        $('#constructProject').attr("disabled", true);
        $('#assetProject').attr("disabled", true);
        $('#fmProject').attr("disabled", true);
        $("#label-projectwpcid").hide() //hide wpcid for overall
        $("#projectWpcId").hide() //hide wpcid for overall
        $(".assetProject").css("display", "flex")
        if($('#assetProject').is(":checked")){
            $('.regionCont').hide();
            $('.packageRegionCont').show();
            toggleProjectType('ASSET')
        }else{
            $('.regionCont').hide();
            $('.packageRegionCont').hide();
            toggleProjectType()
        }

        var reg = projectregion.split(",");
        document.querySelectorAll('#packageRegion option').forEach(option => option.remove());
        let myselectdoc = document.getElementById('packageRegion');
        let myoption2 = document.createElement("option");
        myoption2.value = "";
        myoption2.text = "Please Select ...";
        myselectdoc.appendChild(myoption2);
        for (let i = 0; i < reg.length; i++) {
            let myoption = document.createElement("option");
            myoption.value = reg[i];
            myoption.text = reg[i];
            myselectdoc.appendChild(myoption);
        }
        $('.packageRegionCont').css("display", "flex");
        $('.regionCont').hide();
    }else if(projecttype == 'CONSTRUCT'){
        $('#constructProject').prop("checked", true);
        $('#assetProject').prop("checked", false);
        $('#fmProject').prop("checked", false);
        $('#constructProject').attr("disabled", true);
        $('#assetProject').attr("disabled", true);
        $('#fmProject').attr("disabled", true);
        $("#label-projectwpcid").show() //hide wpcid for overall
        $("#projectWpcId").show() //hide wpcid for overall
        $('#projectPhase').prop('checked', false)
        $('#projectWpcAbbr').val('')
        $(".assetProject").hide()
        $('.packageRegionCont').hide();
        $('.regionCont').hide();

        // project phase Sabah visibility
        visibilityProjectPhase(projectowner, id);
    }else if(projecttype == 'FM'){
        $('#constructProject').prop("checked", false);
        $('#assetProject').prop("checked", false);
        $('#fmProject').prop("checked", true);
        $('#constructProject').attr("disabled", true);
        $('#assetProject').attr("disabled", true);
        $("#label-projectwpcid").show() //hide wpcid for overall
        $("#projectWpcId").show() //hide wpcid for overall
        $(".assetProject").hide()
        $('#projectPhase').prop('checked', false)
        $('#projectWpcAbbr').val('')
        $('.packageRegionCont').hide();
        $('.regionCont').hide();
    }

    $("#projectTimezone")
        .val(timezone)
        .prop("selected", true);
    $("#projectIndustry").val(industry).prop("selected", true);
    $("#projectOwner").val(projectowner).prop("selected", true);
    $("#projectOwner").prop("disabled", true);
    $("select#projectOwner").addClass("readonly")
}

function updateRolesList(ptype){
    optHTML = "";
    // var ownerRoles = (ptype == 'asset') ? assetOwnerRoles : constructOwnerRoles;
    // var optHTML = "";
    // ownerRoles.forEach((ele)=>{
    //     optHTML += '<option value= "'+ele+'">'+ele+'</option>'
    // })
    $('.adduserselect').html(optHTML)
}

newProjTypeCheckbox = (e) =>{
    var myCheckbox = $("[name=newProjCheck]");

    Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
    });
    e.checked = true;
    resetAppList()
    changeJogetPackageList(constructPackages)
    updateRolesList(e.id)
    searchFilterClear()
    if(e.id == "constructProject"){
        $('.assetProject').css("display", "none");
        toggleProjectType()
        changeJogetPackageList(constructPackages);
        refreshUserListProjectCreation()
    }else if (e.id == "assetProject"){
        changeJogetPackageList(assetPackages);
        $('.assetProject').css("display", "flex");
        if($('#overallprojectCheck').is(":checked")){
            $('.regionCont').css("display", "flex");
            $('.packageRegionCont').hide();
        }else{
            $('.regionCont').hide();
            $('.packageRegionCont').css("display", "flex");
        }
        refreshUserListProjectCreation('', '', 'ASSET')
        toggleProjectType('ASSET')
    }else if (e.id == "fmProject"){
        // FM is in joget asset
        changeJogetPackageList(assetPackages);
        refreshUserListProjectCreation('', '', 'FM')
        toggleProjectType('FM')
    }
}

//used on project owner to disabled/hide visibility
OnchangeProjectOwner = (e) => {
    disableProjectType(e);
    var projOwner = $("option:selected", e).val();

    refreshUserListProjectCreation('', '', '', projOwner);
    refreshContractOrgList();
    refreshConsultantOrgList();

    $('#addContractorUserTableBody').html("");
    $('#addConsultantUserTableBody').html("");
}

//trigger when user click the checkbox for overall project or specific project
overallProjectCheckHandler = () => {
    overallprojectState()
    $('#constructProject').prop("checked", true)
    $('#constructProject').attr("disabled", false);
    $('#assetProject').prop("checked", false)
    $('#assetProject').attr("disabled", false);
    $("#projectOwner").prop("disabled", false);
    $("#jogetPackage").val("").trigger("change");
    $("#jogetFinancePackage").val("").trigger("change");
    $("#jogetDocPackage").val("").trigger("change");
    //refreshUserTableBody()

    if($('#assetProject').is(":checked")){
        $('.regionCont').css("display", "flex");
        $('.packageRegionCont').hide();
        toggleProjectType('ASSET')
    }else{
        $('.regionCont').hide();
        $('.packageRegionCont').hide();
        toggleProjectType()
    }
}

overallPackageCheckHandler = () => {
    parentID = []
    parentID.value = $("#parentId").val()
    let sel = document.getElementById('parentId');
    let selected = sel.options[sel.selectedIndex];
    let projecttype = selected.getAttribute("projecttype");
    let projectregion = selected.getAttribute("region");

    //refreshUserTableBody(parentID)
    packagespecificState()
    resetAppList()
    $('#constructProject').prop("checked", true)
    $('#constructProject').attr("disabled", false);
    $('#assetProject').prop("checked", false)
    $('#assetProject').attr("disabled", false);
    $("#projectOwner").prop("disabled", true);

    if(projecttype && projecttype == "ASSET"){
        $('#constructProject').prop("checked", false);
        $('#assetProject').prop("checked", true);
        $('#constructProject').attr("disabled", true);
        $('#assetProject').attr("disabled", true);
        $("#label-projectwpcid").hide() //hide wpcid for overall
        $("#projectWpcId").hide() //hide wpcid for overall
        $(".assetProject").css("display", "flex")

        var reg = projectregion.split(",");
        document.querySelectorAll('#packageRegion option').forEach(option => option.remove());
        let myselectdoc = document.getElementById('packageRegion');
        let myoption2 = document.createElement("option");
        myoption2.value = "";
        myoption2.text = "Please Select ...";
        myselectdoc.appendChild(myoption2);
        for (let i = 0; i < reg.length; i++) {
            let myoption = document.createElement("option");
            myoption.value = reg[i];
            myoption.text = reg[i];
            myselectdoc.appendChild(myoption);
        }
        $('.packageRegionCont').css("display", "flex");
        $('.regionCont').hide();
    }else{
        $('#constructProject').prop("checked", true);
        $('#assetProject').prop("checked", false);
        $('#constructProject').attr("disabled", true);
        $('#assetProject').attr("disabled", true);
        $("#label-projectwpcid").show() //hide wpcid for overall
        $("#projectWpcId").show() //hide wpcid for overall
        $(".assetProject").hide()
        $('.packageRegionCont').hide();
        $('.regionCont').hide();
    }
    
    if($('#assetProject').is(":checked")){
        $('.regionCont').hide();
        $('.packageRegionCont').show();

        $('#projectregiondisplaycont').css("display", "flex");
        $('#projectwpciddisplaycont').hide();

        toggleProjectType('ASSET')
    }else{
        $('.regionCont').hide();
        $('.packageRegionCont').hide();

        $('#projectwpciddisplaycont').css("display", "flex");
        $('#projectregiondisplaycont').hide();

        toggleProjectType()
    }
}

//used to switch to overall project in new project form (called in overallProjectCheckHandler())
overallprojectState = () => {
    $("select#projectOwner").prop("selectedIndex", 0)
    $("#packagespecificCheck").prop("checked", false)
    $("#overallprojectCheck").prop("checked", true)

    $(".inputContent.package").hide()

    $(".inputContent.package").removeClass("active")
    $("label#label-projectowner").html("Project Owner")
    $("label#label-projectid").html("Project ID")
    $("label#label-projectname").html("Project Name")

    if(SYSTEM == 'OBYU'){
        $("#projectOwner").parent().parent().css("display", "flex");
    }

    $("#label-projectwpcid").hide() //hide wpcid for overall
    $("#projectWpcId").hide() //hide wpcid for overall
    $(".packageType").hide()
    $("select#projectIndustry").removeClass("readonly")
    $("select#projectIndustry").attr("disabled", false)
    $("select#projectTimezone").removeClass("readonly")
    $("select#projectTimezone").attr("disabled", false)

    visibilityProjectPhase()

    $('input#projectId').val("")
    $('input#projectName').val("")
    $('input#projectRegion').val("")
    $('input#packageRegion').val("")
    $('input#parentId').val("")
    $('input#projectLocation').val("")
    $('input#projectWpcId').val("")
    $('input#projectId').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#projectName').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#projectWpcId').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })

    if($('#imgInp').val() == ''){
        $('#imgInp').val("")
        $('#projectimage').attr("src", "")
        $('#projectimage').parent().hide();
    }

    $(`.upper-container.addNewProject [data-pageButton="2"]`).removeClass("disabled")
    $(`.upper-container.addNewProject [data-pagedivider="1"]`).removeClass("disabled")

    var pageLength = $('.modal-container.addNewProject').children(".page").length
    for (r = pageLength; r >= 3; r--){
        $(`.upper-container.addNewProject [data-pageButton="${r}"]`).find(`i`).removeClass(`fa-${r-1}`)
        $(`.upper-container.addNewProject [data-pageButton="${r}"]`).find(`i`).addClass(`fa-${r}`)
    }
    $('#applicationContainerID').parent().show();
    $('#appAssignContainerID').show();
    $('#appAssignContainerID').parent().find('i').removeClass("disabled")
    $('#appAssignContainerID').parent().find('i').addClass("opened")
}

//used to switch to package project in new project form (called in overallProjectCheckHandler())
packagespecificState = () => {
    $("#overallprojectCheck").prop("checked", false)
    $("#packagespecificCheck").prop("checked", true)
    
    $(".inputContent.package").show()
    $(".inputContent.package").addClass("active")
    $(".hiddencontainer#packagedetail").addClass("active")
    $("label#label-projectid").html("Package ID")
    $("label#label-projectname").html("Package Name")
    $("label#label-projectowner").html("Package Owner")

    if(SYSTEM == 'OBYU'){
        $("#projectOwner").parent().parent().hide();
    }

    //showing and hiding in the function update industry when parent details are updated. if asset type package no wpc-id
    $("#label-projectwpcid").show() //display wpcid for package 
    $("#projectWpcId").show() //display wpcid for package
    $(".packageType").css("display", "flex")
    $("select#projectIndustry").addClass("readonly")  //package project
    $("select#projectIndustry").attr("disabled", true)
    $("select#projectTimezone").addClass("readonly")
    $("select#projectTimezone").attr("disabled", true)

    //reset value
    $('input#projectId').val("")
    $('input#projectName').val("")
    $('input#projectRegionInput').val("")
    $('input#projectRegion').val("")
    $('input#packageRegion').val("")
    $('input#projectLocation').val("")
    $('input#projectWpcId').val("")
    $('input#projectId').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#projectName').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })
    $('input#projectWpcId').css({
        "background-repeat": "no-repeat",
        "background-image": ""
    })

    if($('#imgInp').val() == ''){
        $('#imgInp').val("")
        $('#projectimage').attr("src", "")
        $('#projectimage').parent().hide();
    }

    $(".phaseType").css('display', 'flex')
    $("#projectPhase").prop('checked', false)
    $("#projectPhase").prop('disabled', false)
    wpcAbbrState('hidden')

    $(`.upper-container.addNewProject [data-pageButton="2"]`).addClass("disabled")
    $(`.upper-container.addNewProject [data-pagedivider="1"]`).addClass("disabled")

    var pageLength = $('.modal-container.addNewProject').children(".page").length
    for (r = pageLength; r >= 3; r--){
        $(`.upper-container.addNewProject [data-pageButton="${r}"]`).find(`i`).removeClass(`fa-${r}`)
        $(`.upper-container.addNewProject [data-pageButton="${r}"]`).find(`i`).addClass(`fa-${r-1}`)
    }
    $('#applicationContainerID').parent().hide();//package project, no apps
    $('#appAssignContainerID').hide();
    $('#appAssignContainerID').parent().find('i').removeClass("opened")
    $('#appAssignContainerID').parent().find('i').addClass("disabled")
}

//used to switch to project phase for new & edit project
wpcAbbrState = (visibility = 'hidden', abbr) => {
    $('.wpcAbbr').css('visibility', visibility)

    if(abbr !== ''){
        $('#projectWpcAbbr').val(abbr)
    }
}

onclickProjectPhase = (e) => {
    if($(e).is(':checked')){
        wpcAbbrState('visible')
    }else{
        wpcAbbrState('hidden')
    }
}

//Used in new/edit project wizard Save Button
onclickProjectSaveButton = () =>{
    var formdata = new FormData();
    var packageOverallCheck

    $('.loader').fadeIn()
    if($('#overallprojectCheck').prop('checked')){
        packageOverallCheck = 'Overall'
    }else if($('#packagespecificCheck').prop('checked')){
        packageOverallCheck = 'Package'
    }

    if(mode == 'edit'){
        if (ReadEntity) {
            ReadEntity.show = false;
        };
    
        var projectUsersUpdate = [];
        var projectGroupUsersUpdate = [];
        var msg =" Are you sure you want to update the roles for these users? <br>"
        for (var i = 0; i < click_project_details.users.length; i++) {
            var id = click_project_details.users[i].Usr_ID;
            let myuser = userProjectArr.find((o, j) => {
                if (o.user_id == id) {
                    if (click_project_details.users[i].Pro_Role != userProjectArr[j].user_role) {
                        projectUsersUpdate.push({
                            user_id: o.user_id,
                            user_role: o.user_role,
                            user_email: o.user_email,
                            user_old_role: click_project_details.users[i].Pro_Role,
                            user_orgSubType: o.user_orgSubType
                        });
                        msg +=  o.user_email + " - change role <br>";
                    }
                    if(click_project_details.users[i].org_sub_type && click_project_details.users[i].org_sub_type != userProjectArr[j].user_orgSubType){
                        projectUsersUpdate.push({
                            user_id: o.user_id,
                            user_role: o.user_role,
                            user_email: o.user_email,
                            user_old_role: click_project_details.users[i].Pro_Role,
                            user_orgSubType: o.user_orgSubType
                        });

                        msg +=  o.user_email + " - change org subtype to : <br>"+o.user_orgSubType+" <br>";
                    }
                    userProjectArr.splice(j, 1);
                    return true;
                } else {
                    return false;
                }
    
            });
            if (!myuser) {
                projectUsersUpdate.push({
                    user_id: click_project_details.users[i].Usr_ID,
                    user_role: "noRole",
                    user_email: click_project_details.users[i].user_email,
                    user_old_role: click_project_details.users[i].Pro_Role,
                    user_orgSubType: click_project_details.users[i].org_sub_type
                });
                msg +=  click_project_details.users[i].user_email + " - remove user <br>";
            }
    
        }
        for (var i = 0; i < userProjectArr.length; i++) {
            projectUsersUpdate.push({
                user_id: userProjectArr[i].user_id,
                user_role: userProjectArr[i].user_role,
                user_email: userProjectArr[i].user_email,
                user_old_role: "noOldRole",
                user_orgSubType: userProjectArr[i].user_orgSubType
            });
            msg +=   userProjectArr[i].user_email + " - add user <br>";
        }
    
        //project group users
        if (userProjectGroupArr.length > 0) {
            for (var i = 0; i < click_project_details.users.length; i++) {
                var groupIDs = "";
                if (click_project_details.users[i].project_group.length > 0) {
                    var groupIDs = click_project_details.users[i].project_group; // array
                }
                var id = click_project_details.users[i].Usr_ID;
                let mygroupuser = userProjectGroupArr.find((o, j) => {
                    if (o.user_id == id) {
                        let mygroup = userProjectGroupArr[j].user_group;
                        if (groupIDs == "") {
                            projectGroupUsersUpdate.push({
                                user_id: o.user_id,
                                user_group: o.user_group,
                                user_email: o.user_email,
                                user_old_group: "noOldGroup"
                            });
                        } else {
                            var removegroup = [];
    
                            groupIDs.forEach(function (value, index) {
                                let pos = mygroup.indexOf(value);
                                if (pos == -1) { //not part of current group need to remove
                                    removegroup.push(value);
    
                                } else {
                                    if (pos == 0) {
                                        mygroup = mygroup.substring(value.length + 1);
                                    } else {
                                        mygroup = mygroup.substring(0, pos - 1);
                                    }
                                }
                            })
                            if (removegroup.length > 0 || mygroup != "") {
                                var oldgroup = removegroup.join();
                                if (oldgroup == "") {
                                    oldgroup = "noOldGroup";
                                };
                                if (mygroup == "") {
                                    mygroup = "noGroup";
                                }
                                projectGroupUsersUpdate.push({
                                    user_id: o.user_id,
                                    user_group: mygroup,
                                    user_email: o.user_email,
                                    user_old_group: oldgroup
                                });
                            }
                        }
                        userProjectGroupArr.splice(j, 1);
                        return true;
                    } else {
                        return false;
                    }
    
                });
                if (!mygroupuser && groupIDs != "") {
                    projectGroupUsersUpdate.push({
                        user_id: click_project_details.users[i].Usr_ID,
                        user_group: "noGroup",
                        user_email: click_project_details.users[i].user_email,
                        user_old_group: click_project_details.users[i].project_group.join()
                    });
                }
            }
    
            for (var i = 0; i < userProjectGroupArr.length; i++) {
                projectGroupUsersUpdate.push({
                    user_id: userProjectGroupArr[i].user_id,
                    user_group: userProjectGroupArr[i].user_group,
                    user_email: userProjectGroupArr[i].user_email,
                    user_old_group: "noOldGroup"
                });
            }
        }

        var pid = $("#projectId").val();
        var pname = $("#projectName").val();
        // var pwpcid = $("#projectWpcId").val(); // not allowed to change
        var powner = $("#projectOwner").val();
        var pind = $("#projectIndustry").val();
        var ptz = $("#projectTimezone option:selected").text();
        var ptzvalue = $("#projectTimezone").val();
        var ploc = $("#projectLocation").val();
        var projectphase = $("#projectPhase").val();
        var wpcabbr = $("#projectWpcAbbr").val();

        var ptype = "";
        if($('#constructProject').is(" :checked")){
            ptype = 'CONSTRUCT';
        }else if($('#assetProject').is(" :checked")){
            ptype = 'ASSET';
        }else if($('#fmProject').is(" :checked")){
            ptype = 'FM';
        }
    
        var file = document.getElementById("imgInp").files[0];
        var startdate = $("#projectstartdate").val();
        var enddate = $("#projectenddate").val();
        var duration = $("#projectduration").val();
        var cutoffday = $("#projectcutoff").val();
        var contractorOrg = contractorSelectizeOrg;
        var consultantOrg = consultantSelectizeOrg.join(";");
    
        var formdata = new FormData();
        var lat1 = radians_to_degrees(firstPoint.latitude).toFixed(4);
        var lat2 = radians_to_degrees(tempCartographic.latitude).toFixed(4);
        var long1 = radians_to_degrees(firstPoint.longitude).toFixed(4);
        var long2 = radians_to_degrees(tempCartographic.longitude).toFixed(4);
    
        if (
            firstPoint.latitude == 0 &&
            tempCartographic.latitude == 0 &&
            $("#lat1").html() !== ""
        ) {
            lat1 = $("#lat1").html();
            lat2 = $("#lat2").html();
            long1 = $("#long1").html();
            long2 = $("#long2").html();
        }
    
        formdata.append("projectidnumber", click_project_details.projectIdNumber);
        formdata.append("projectid", pid);
        formdata.append("projectname", pname);
        //formdata.append("projectowner", powner); //not allowed to change
        //formdata.append("projectwpcid", pwpcid); //not allowed to change
    
        if (pind) {
            formdata.append("industry", pind);
        }
        if (ptzvalue) {
            formdata.append("timezoneval", ptzvalue);
        }
        if (ptz) {
            formdata.append("timezonetext", ptz);
        }
        if (ploc) {
            formdata.append("location", ploc);
        }
    
        if (contractorOrg){
            formdata.append("contractorOrg", contractorOrg); //to send to joget for adding contactor name in contracts
        }
        if(consultantOrg){
            formdata.append("consultantOrg", consultantOrg); //to send to joget for adding consultant name in contracts
        }
    
        formdata.append("contractee", click_project_details.projectOwner);
    
        formdata.append("lat1", lat1);
        formdata.append("lat2", lat2);
        formdata.append("long1", long1);
        formdata.append("long2", long2);
        if (startdate || startdate !== click_project_details.startdate) {
            formdata.append("startdate", startdate);
        }
        if (enddate || enddate !== click_project_details.enddate) {
            formdata.append("enddate", enddate);
        }
        if (duration) {
            formdata.append("duration", duration);
        }
        if (cutoffday){
            formdata.append("cutoffday", duration);
        }
        
        formdata.append("users", JSON.stringify(projectUsersUpdate));
        if (file) {
            formdata.append("imgInp", file);
        }
        var pregion;
        if (click_project_details.parentId == null) { //get the app links to update apps. apps are assigned to overall projects
    
            $(".conAppList").each(function () {
                let columnName = this.getAttribute("name");
                let appValue = this.getAttribute("appValue");
                formdata.append(columnName, appValue);
            });
            if ($('#jogetFinancePackage option:selected').val() != null) {
                $(".finAppList").each(function () {
                    let columnName = this.getAttribute("name");
                    let appValue = this.getAttribute("appValue");
                    formdata.append(columnName, appValue);
                });
                if(click_project_details.projectOwner == "SSLR2"){
                    formdata.append('contract_level', $("#contract_level").val());
                }
            }
            if ($('#jogetDocPackage option:selected').val() != null) {
                $(".docAppList").each(function () {
                    let columnName = this.getAttribute("name");
                    let appValue = this.getAttribute("appValue");
                    formdata.append(columnName, appValue);
                });
            }
            pregion = $('#projectRegion').val();
    
        } else {
            formdata.append("parentid", click_project_details.parentId);
            pregion = $('#packageRegion').val();

            //project phase Sabah
            if($('#projectPhase').is(':checked')){
                if(ptype == "CONSTRUCT" && powner == "JKR_SABAH"){
                    formdata.append("projectphase", projectphase);
                    formdata.append("wpcabbr", wpcabbr);
                }
            }
        }

        if(click_project_details.projectType){
            formdata.append("userGroup", JSON.stringify(projectGroupUsersUpdate));
            formdata.append("region", pregion);
        }else{
            formdata.append("cutoffday", cutoffday);
        }

        formdata.append("functionName", "updateProject");
    }else{
        var formdata = new FormData();

        var pid = $("#projectId").val();
        var pname = $("#projectName").val();
        var powner = $("#projectOwner").val();
        var pwpcid = $("#projectWpcId").val();

        //new fields for asset
        var pregion;
        // var ptype = ($('#assetProject').is(" :checked"))?"ASSET":"CONSTRUCT" ;
        var ptype = "";
        if($('#constructProject').is(" :checked")){
            ptype = 'CONSTRUCT';
        }else if($('#assetProject').is(" :checked")){
            ptype = 'ASSET';
        }else if($('#fmProject').is(" :checked")){
            ptype = 'FM';
        }
        
        //****//
        var pind = $("#projectIndustry").val();
        var ptz = $("#projectTimezone option:selected").text();
        var ptzvalue = $("#projectTimezone").val();
        var ploc = $("#projectLocation").val();
        var file = document.getElementById("imgInp").files[0];
        var startdate = $("#projectstartdate").val();
        var enddate = $("#projectenddate").val();
        var duration = $("#projectduration").val();
        var cutoffday = $("#projectcutoff").val();
        var projectphase = $("#projectPhase").val();
        var wpcabbr = $("#projectWpcAbbr").val();
        var contractorOrg = contractorSelectizeOrg;
        var consultantOrg = consultantSelectizeOrg.join(";");
        
        var lat1 = radians_to_degrees(firstPoint.latitude).toFixed(4);
        var lat2 = radians_to_degrees(tempCartographic.latitude).toFixed(4);
        var long1 = radians_to_degrees(firstPoint.longitude).toFixed(4);
        var long2 = radians_to_degrees(tempCartographic.longitude).toFixed(4);

        formdata.append("projectid", pid);
        formdata.append("projectname", pname);
        formdata.append("projectowner", powner);
        formdata.append("contractee", powner); //to send to joget for adding owner company name in contracts
        
        if(SYSTEM == 'KKR') {
            formdata.append("projectwpcid", pwpcid);
            formdata.append("projecttype", ptype);
        }

        if (pind) {
            formdata.append("industry", pind);
        }
        if (ptzvalue) {
            formdata.append("timezoneval", ptzvalue);
        }
        if (ptz) {
            formdata.append("timezonetext", ptz);
        }
        if (ploc) {
            formdata.append("location", ploc);
        }
        formdata.append("lat1", lat1);
        formdata.append("lat2", lat2);
        formdata.append("long1", long1);
        formdata.append("long2", long2);
        if (startdate) {
            formdata.append("startdate", startdate);
        }
        if (enddate) {
            formdata.append("enddate", enddate);
        }
        if (duration) {
            formdata.append("duration", duration);
        }
        if (cutoffday) {
            formdata.append("cutoffflag", 1);
            formdata.append("cutoffday", (cutoffday) ? cutoffday : '25');
        }

        formdata.append("users", JSON.stringify(userProjectArr));

        if (file) {
            formdata.append("imgInp", file);
        }
        if (contractorOrg){
            formdata.append("contractorOrg", contractorOrg); //to send to joget for adding contactor name in contracts
        }
        if (consultantOrg){
            formdata.append("consultantOrg", consultantOrg); //to send to joget for adding consultant name in contracts
        }

        if ($("#overallprojectCheck").is(":checked")) {
            var jogetPackageId = $("#jogetPackage option:selected").val()
            $(".conAppList").each(function () {
                let columnName = this.getAttribute("name");
                let appValue = this.getAttribute("appValue");
                formdata.append(columnName, appValue);
            });
            if ($('#jogetFinancePackage option:selected').val() != null) {
                $(".finAppList").each(function () {
                    let columnName = this.getAttribute("name");
                    let appValue = this.getAttribute("appValue");
                    formdata.append(columnName, appValue);
                });
                if(powner == "SSLR2"){
                    formdata.append('contract_level', $("#contract_level").val());
                }
            }
            if ($('#jogetDocPackage option:selected').val() != null) {
                $(".docAppList").each(function () {
                    let columnName = this.getAttribute("name");
                    let appValue = this.getAttribute("appValue");
                    formdata.append(columnName, appValue);
                });
            }
            pregion =  $('#projectRegion').val();
        } else {
            let parentId = $('#parentId :selected').val();
            formdata.append("parentid", parentId);
            pregion = $('#packageRegion option:selected').val();

            //project phase Sabah
            if($('#projectPhase').is(':checked')){
                if(ptype == "CONSTRUCT" && powner == "JKR_SABAH"){
                    formdata.append("projectphase", projectphase);
                    formdata.append("wpcabbr", wpcabbr);
                }
            }
        }

        if(SYSTEM == 'KKR') {
            if(pregion){
                formdata.append("region", pregion);
            }
            formdata.append("userGroup", JSON.stringify(userProjectGroupArr));
        }
        formdata.append("functionName", "createProject")
    }

    for (var pair of formdata.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    
    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = '../BackEnd/ProjectFunctionsV3.php'
    }

    if(mode == 'edit' && projectUsersUpdate.length> 0){
        $.confirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Confirm!',
            content: msg,
            buttons: {
                confirm: function () {
                    $.ajax({
                        url: ajaxUrl,
                        data: formdata,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (res) {
                            var data = JSON.parse(res)
                            $.alert({
                                boxWidth: "30%",
                                useBootstrap: false,
                                title: "Message",
                                content: data.msg,
                            });
                            if (data.data == "close") {
                                $('.loader').fadeOut()
                                wizardCancelPage()
                                $('#mySysAdmin')[0].contentWindow.refreshProjectTableBody()
                                $('#mySysAdmin')[0].contentWindow.refreshInformation()
                            }
                        }
                    })
                },
                cancel: function () {
                    $('.loader').fadeOut();
                    wizardCancelPage();
                    return;
                },
            },
        });
    }else{
        $.ajax({
            url: ajaxUrl,
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (res) {
                var data = JSON.parse(res)
                var message = "";
                if (data.msg.pIdName) {
                    message += data.msg.pIdName;
                };
                if (data.msg.pName) {
                    message += data.msg.pName;
                }
                if (message == "") {
                    message = data.msg;
                }
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: message,
                });
                if (data.data == "close") {
                    $('.loader').fadeOut()
                    wizardCancelPage()
                    $('#mySysAdmin')[0].contentWindow.refreshProjectTableBody();
                    $('#mySysAdmin')[0].contentWindow.refreshInformation()
                }
            }
        })
    }
}

//Used in archive project wizard Restore Button
onclickProjectRestoreButton = () =>{
    var projectid = [];
    projectid.push(click_project_details.projectIdNumber);
    var message = "Are you sure you want to recover this Project : " + document.getElementById("projectnamedisplay").innerText + "?";
    $.confirm({
        boxWidth: '30%',
        useBootstrap: false,
        title: 'Confirm!',
        content: message,
        buttons: {
            confirm: function () {
                $('.loader').fadeIn()
                var formdata = new FormData();
                formdata.append("functionName", "recoverProject");
                formdata.append("project_id_number", JSON.stringify(projectid));

                if(SYSTEM == 'OBYU'){
                    ajaxUrl = '../BackEnd/ProjectFunctionsOBYU.php';
                }else{
                    ajaxUrl = '../BackEnd/ProjectFunctionsV3.php';
                }

                $.ajax({
                    type: "POST",
                    url: ajaxUrl,
                    dataType: "json",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var obj = res
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: obj.message,
                        });
                        wizardCancelPage()
                        $('.loader').fadeOut()
                        $('#mySysAdmin')[0].contentWindow.refreshProjectTableBody();
                        $('#mySysAdmin')[0].contentWindow.refreshDeleteProjectTableBody();
                        $('#mySysAdmin')[0].contentWindow.refreshInformation()
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        console.log(str);
                    },
                });
            },
            cancel: function () {
                return;
            },
        },
    });
}

//Used in archive project wizard Archive or Delete Button
OnClickProjectArchiveOrDeletePermanentButton = (e) => {
    let funct = $(e).text()
    var projectid = [];

    if(SYSTEM == 'OBYU'){
        ajaxUrl = '../BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = '../BackEnd/ProjectFunctionsV3.php';
    }

    if (funct && funct == 'Archive'){
        event.preventDefault();
        var message = "Are you sure you want to archive the Project : " + document.getElementById("projectnamedisplay").innerText + "?";
        $.confirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Confirm!',
            content: message,
            buttons: {
                confirm: function () {
                    $('.loader').fadeIn()
                    var arr = [];
                    arr[0] = document.getElementById("projectIdNumber").value;
                    var formdata = new FormData();
                    formdata.append("functionName", "archiveProject");
                    formdata.append("project_id_number", JSON.stringify(arr));

                    $.ajax({
                        type: "POST",
                        url: ajaxUrl,
                        dataType: "json",
                        data: formdata,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            var obj = res
                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: "Message",
                                content: obj.msg,
                            });
                            wizardCancelPage()
                            $('.loader').fadeOut()
                            $('#mySysAdmin')[0].contentWindow.refreshProjectTableBody();
                            $('#mySysAdmin')[0].contentWindow.refreshDeleteProjectTableBody();
                            $('#mySysAdmin')[0].contentWindow.refreshInformation()
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            var str = textStatus + " " + errorThrown;
                            console.log(str);
                        }
                    })
                },
                cancel: function () {
                    return;
                },
            },
        });
    }else{
        projectid.push(click_project_details.projectIdNumber);
        var message = "Are you sure you want to delete this Project : " + document.getElementById("projectnamedisplay").innerText + " permanently from the Database ?";
        $.confirm({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Confirm!",
            content: message,
            buttons: {
                confirm: function () {
                    $('.loader').fadeIn()
                    var formdata = new FormData();
                    formdata.append("project_id_number", JSON.stringify(projectid));
                    formdata.append("functionName", "deleteProject");
                    var request = new XMLHttpRequest();
                    request.open("POST", ajaxUrl, true);
                    request.send(formdata);
                    request.onreadystatechange = function () {
                        if (request.readyState == 4 && request.status == "200") {
                            let jsonParse = JSON.parse(request.responseText);
                            $.alert({
                                boxWidth: "30%",
                                useBootstrap: false,
                                title: "Message",
                                content: jsonParse.message,
                            });
                            $('.loader').fadeOut()
                            wizardCancelPage()
                            $('#mySysAdmin')[0].contentWindow.refreshDeleteProjectTableBody();
                            $('#mySysAdmin')[0].contentWindow.refreshInformation()
                        }
                    };
                },
                cancel: function () {
                    return
                }
            }
        });
    }

    
}

function OnClickImportUsers() {
    var inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = ".csv,text/csv";
    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", handleFiles);
    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
}

function handleFiles(event) {
    [...this.files].forEach(file => {
        if (window.FileReader) {
            // FileReader are supported.
            getAsText(file);
        } else {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'FileReader are not supported in this browser!',
            });
        }
    });
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        var tarr = "";
        for (var j = 0; j < data.length; j++) {
            if (j != 0) {
                tarr += ",";
            }
            tarr += data[j];
        }
        lines.push(tarr);
    }
    console.log(lines);

    if(SYSTEM == 'OBYU'){
        if (lines[0] !== "First Name,Last Name,Email,Organization ID,Organization Name,Organization Description,Organization Type,Country,User Type,Phone Number,Support User") {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: "The data is not given in correct order. it should be in this order : First Name, Last Name, Email, Organization ID, Organization Name, Organization Description, Organization Type, Country, User Type, Phone Number, Support User"
            });
            return;
        }

        ajaxUrl = '../BackEnd/importUsersOBYU.php';
    }else{
        if (lines[0] !== "First Name,Last Name,Email,Organization ID,Organization Name,Organization Description,Organization Type,Country,User Type,Support User") {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: "The data is not given in correct order. it should be in this order : First Name,Last Name,Email,Organization ID,Organization Name,Organization Description,Organization Type,Country,User Type, Support User"
            });
            return;
        }

        ajaxUrl = '../BackEnd/importUsers.php';
    }

    var formdata = new FormData();
    formdata.append("users", JSON.stringify(lines));
    var request = new XMLHttpRequest();
    request.open("POST", ajaxUrl, true);
    request.send(formdata);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == "200") {
            var response = JSON.parse(request.responseText);
            console.log(response)
            var msg = `${response.msg}<br>`
            var count = 1
            if(response.data !== undefined){
                Array.prototype.forEach.call(response.data, function(index){
                    msg += `<br>${count}) ${index.email}: ${index.reason}`
                    count = count + 1;
                });
            }
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: msg
            });
            $('#'+localStorage.page_pageOpen)[0].contentWindow.refreshUserTableBody();
            updateV3Chart();
        };
    };
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Cannot read file!',
        });
    }
}

//----------End Project Related Function--------------//

function processLinkParam(urlName, varArr){
    if (!JOGETLINK) return false;

    var rawUrl =  getLinkJoget(urlName,'');
    if (varArr) {
        if(rawUrl){
            for (const [idx, ele] of Object.entries(varArr)) {
                rawUrl = rawUrl.replace("{?}", encodeURIComponent(ele));
             }
        }
    }
    // if still contain {?} replace all
    if(rawUrl.includes("{?}")) rawUrl = rawUrl.replaceAll("{?}", "");
    return rawUrl;
}

disableProjectType = (e) => {
    var val = $(e).val();

    if(val == 'UEM_EDGENTA'){
        $('#constructProject').prop('disabled', true);
        $('#assetProject').prop('disabled', true);

        $('#fmProject').prop('disabled', false);

        $('#constructProject').prop('checked', false);
        $('#assetProject').prop('checked', false);

        $('#fmProject').trigger('click');
    }else{
        $('#constructProject').prop('disabled', false);
        $('#fmProject').prop('disabled', true);

        $('#assetProject').prop('checked', false);
        $('#fmProject').prop('checked', false);

        $('#constructProject').trigger('click');

        if(val == 'SSLR2'){
            $('#assetProject').prop('disabled', true);
            $('.regionCont').hide();
            $('.packageRegionCont').hide();
        }else{
            $('#assetProject').prop('disabled', false);
        }
    }
}

function checkingJogetLoginOnLoad() {
    setTimeout(function() { checkingJogetLogin(); }, 500); 
    setTimeout(function() { checkingJogetLogin(); }, 5000); 
    setTimeout(function() { checkingJogetLogin(); }, 10000); 
}

checkPSUTableLabel = (projOwner, index, element) =>{
    if(projOwner == 'SSLR2'){
        switch(index){
            case 1:
                $(element).text('Financial Plan Curve');
                break;
            case 2:
                $(element).text('Financial Actual Curve');
                break;
            case 3:
                $(element).text('Physical Plan Curve');
                break;
            case 4:
                $(element).text('Physical Actual Curve');
                break;
            default:
                //do nothing
        }
    }else{
        switch(index){
            case 1:
                $(element).text('Financial Early Curve');
                break;
            case 2:
                $(element).text('Financial Late Curve');
                break;
            case 3:
                $(element).text('Physical Early Curve');
                break;
            case 4:
                $(element).text('Physical Late Curve');
                break;
            default:
                //do nothing
        }
    }
}

visibilityProjectPhase = (projOwner, parentid) =>{
    if(projOwner == "JKR_SABAH" && parentid !== null){
        $(".projectPhase").css('display', 'flex');
        $("#projectphasedisplaycont").css('display', 'flex');
        $("#projectwpcabbrdisplaycont").css('display', 'flex');
    }else{
        $(".projectPhase").hide();
        $("#projectphasedisplaycont").hide();
        $("#projectwpcabbrdisplaycont").hide();
    }
}
 
$('#signOut').on('click', function (e) {
    e.preventDefault();
    var loading = $('#loaderHome');
    loading.fadeIn();

    // // Abort all ongoing requests
    // ajaxRequests.forEach(req => req.abort());
 

    console.log(ajaxRequests);
    if (ajaxRequests.length === 0) { 
        window.location.href = "include/logout.php?signOut=signOut";
    } else {
        console.log('API requests are running. Waiting for them to finish...');
        
        // Use ajaxStop to handle what happens after all requests finish
        $(document).ajaxStop(function() {
            console.log('All requests finished. Proceeding with logout.');
            window.location.href = "include/logout.php?signOut=signOut";
        });
        
    }

    
});


// Modified: function now returns a Promise
function checkingJogetLogin_promise() {
    return new Promise((resolve, reject) => { // Added Promise wrapper
        const jogetHost = JOGETHOST + 'jw';
        const currUsername = localStorage.userLoginName || '';
        const enc_pwd = localStorage.encPassword || '';

        const temp_dec_pwd = atob(enc_pwd);
        const rev_pwd = temp_dec_pwd.split('').reverse().join('');
        const currUserPwd = atob(rev_pwd);

        // Modified: login callback now resolves or rejects the Promise
        const loginCallback = {
            success: function (response) {
                if (response.username === currUsername) {
                    console.log("joget login successful");
                    resolve(true); // resolve if login is successful
                } else {
                    console.log("login failed after attempting");
                    resolve(false); // resolve as false if login fails
                }
            },
            error: function () {
                console.log("error during login");
                reject(new Error("Joget login failed")); // reject on error
            }
        };

        // Modified: Asset login callback triggers login and flows to main loginCallback
        const loginCallbackAsset = {
            success: function () {
                AssignmentManager.loginWithHash(jogetHost, currUsername, currUserPwd, loginCallback);
            },
            error: function () {
                reject(new Error("Joget asset login failed")); // reject on error
            }
        };

        // Modified: success callback of getCurrentUsername resolves or triggers login
        const callback = {
            success: function (response) {
                if (response.username !== "roleAnonymous" && response.username === currUsername) {
                    console.log("joget already logged in");
                    resolve(true); // resolve if already logged in
                } else {
                    // These branches trigger further login attempts, final result handled in loginCallback
                    if (SYSTEM === 'KKR') {
                        if (IS_DOWNSTREAM) {
                            AssignmentManager.loginWithHash(jogetHost, currUsername, currUserPwd, loginCallback);
                        } else {
                            const jogetAssetHost = JOGETASSETHOST + 'jw';
                            AssignmentManager.loginWithHash(jogetAssetHost, currUsername, currUserPwd, loginCallbackAsset);
                        }
                    } else {
                        AssignmentManager.loginWithHash(jogetHost, currUsername, currUserPwd, loginCallback);
                    }
                }
            },
            error: function () {
                reject(new Error("Failed to get current Joget username")); // reject on error
            }
        };

        AssignmentManager.getCurrentUsername(jogetHost, callback); // first async call that starts the chain
    });
}

function fetchAICDetailsPromise(aicId) {
    return $.ajax({
        url: "../BackEnd/fetchDatav3.php", // replace with your PHP endpoint
        type: 'POST',
        dataType: 'json',
        data: {
            function_name: 'getAICDetailsById',
            AIC_Id: aicId
        }
    });
}
