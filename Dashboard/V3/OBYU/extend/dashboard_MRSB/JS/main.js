var mainData;
var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var fullMonthtoDigitArr = {"January":"01","February":"02","March":"03","April":"04","May":"05","June":"06","July":"07","August":"08","September":"09","October":"10","November":"11","December":"12"};
var monthPrev = {"Jan":"Dec","Feb":"Jan","Mar":"Feb","Apr":"Mar","May":"Apr","Jun":"May","Jul":"Jun","Aug":"Jul","Sep":"Aug","Oct":"Sep","Nov":"Oct","Dec":"Nov"};

function riskScoreCard(){
    $('#riskScore').html(0);
    $('#riskOpen').html(13);
    $('#riskClosed').html(8);

    Number.prototype.between = function(a, b) {
        var min = Math.min(a, b);
        var  max = Math.max(a, b);
      
        return this >= min && this < max;
    };

    $('.riskScoreBackground').each(function(){

        var riskCard = parseInt($(this).find('span').html());

        if (riskCard.between(1,4)){
            $(this).css({
                'background-color': '#ABEBC6', // light green
                'border-radius': '5px'
            });
        }else if (riskCard.between(4,8)){
            $(this).css({
                'background-color': '#2ECC71', // green
                'border-radius': '5px'
            })
        }else if (riskCard.between(8,13)){
            $(this).css({
                'background-color': '#F39C12', // orange
                'border-radius': '5px'
            });
        }else if (riskCard.between(13,16)){
            $(this).css({
                'background-color': 'red', // red
                'border-radius': '5px',
                'color': 'white'
            })
        }else if (riskCard >= 16){
            $(this).css({
                'background-color': '#C0392B', // dark red
                'border-radius': '5px',
                'color': 'white'
            })
        }
    });
}

function updateContractDetails(data){
    var contractAllData = (data.allData) ? data.allData : [];
    var idData = (contractAllData.id) ? contractAllData.id : '';

    let projectTbHTML = '';
    $("#contractDetails").html("");
    if (data) {
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Contract No.</td>'
        projectTbHTML += '<td>' + ((data.contract_no) ? (data.contract_no):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Commencement Date</td>'
        projectTbHTML += '<td>' + ((data.commencement_date) ? (data.commencement_date):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Original Completion date</td>'
        projectTbHTML += '<td>' + ((data.original_completion_date) ? (data.original_completion_date):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Total Approved EOT (Days)</td>'
        projectTbHTML += '<td>' + ((data.cumulative_approved_eot_days) ? (data.cumulative_approved_eot_days):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Revised Completion Date</td>'
        projectTbHTML += '<td>' + ((data.revised_completion_date) ? (data.revised_completion_date):'') + '</td>'
        projectTbHTML += '</tr>';
    }
    $("#contractDetails").html(projectTbHTML);
}

function updateCostDetails(dataContract){
    var contractAllData = (dataContract.allData) ? dataContract.allData : [];
    var idData = (contractAllData.id) ? contractAllData.id : '';

    let projectTbHTML = '';
    $("#costDetails").html("");
    if (dataContract) {
        var acsAmount = (dataContract.cumulative_approved_acs_amount) ? parseFloat(dataContract.cumulative_approved_acs_amount.replace(/,/g, "")) : 0;
        var voAmount = (dataContract.cumulative_approved_vo_amount) ? parseFloat(dataContract.cumulative_approved_vo_amount.replace(/,/g, "")) : 0;

        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Original Contract Sum</td>'
        projectTbHTML += '<td>RM' + ((dataContract.original_contract_sum) ? (dataContract.original_contract_sum):0) + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Approved Adjustment to Contract Sum (ACS)</td>' //ACS FORM
        projectTbHTML += '<td class = "fontRedAcs">RM' + formatCurrency(acsAmount) + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Approved Variation Order (VO)</td>' //VO FORM
        projectTbHTML += '<td class = "fontRedVo">RM' + formatCurrency(voAmount) + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Revised Contract Sum</td>'
        projectTbHTML += '<td>RM' + ((dataContract.revised_contract_sum) ? formatCurrency(dataContract.revised_contract_sum) :0) + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Total Cumulative Certified Payment</td>' //IPC FORM
        projectTbHTML += '<td>RM' + ((dataContract.cumulative_ipc_amount) ? (dataContract.cumulative_ipc_amount):0) + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Total Cumulative Amount Paid by Client</td>' //IPC FORM
        projectTbHTML += '<td>RM' + ((dataContract.total_cumulative_amount_paid) ? (dataContract.total_cumulative_amount_paid):0) + '</td>'
        projectTbHTML += '</tr>';
    }
    $("#costDetails").html(projectTbHTML);

    if(acsAmount < 0){
        $('.fontRedAcs').css("color", "red");
    }
    else{
        $('.fontRedAcs').css("color", "black");
    }

    if(voAmount < 0){
        $('.fontRedVo').css("color", "red");
    }
    else{
        $('.fontRedVo').css("color", "black");
    }
}

function openList(id, cardName, urlToUse){
    var linkParamArr = processFilterParamArr([id]);
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("COST", urlToUse, linkParamArr, cardName);
    }
}

function openConOpDashboardMT(mtFilterDtFrom, mtFilterDtTo, mtFilterApprovalStatus, mtFilterApprovalFlag = 'no', cardName){
    var linkParamArr = processFilterParamArr([mtFilterDtFrom, mtFilterDtTo, mtFilterApprovalStatus, mtFilterApprovalFlag]);
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("MS", "construct_dash_conop_qaqc_ms", linkParamArr, "Material Submission : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"MS", conOpTabId:"conopTab5", linkName:"construct_dash_conop_qaqc_ms", linkParam:linkParamArr, linkWinTitle: 'MT'};
        parent.postMessage(postParam ,"*");
    }
}

function openConOpDashboardMS(msFilterDtFrom, msFilterDtTo, msFilterApprovalCode, msFilterApprovalStatusFlag = 'no', cardName){
    var linkParamArr = processFilterParamArr([msFilterDtFrom, msFilterDtTo, msFilterApprovalCode, msFilterApprovalStatusFlag]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("MOS", "construct_dash_conop_qaqc_mos", linkParamArr, "Method Statement : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"MOS", conOpTabId:"conopTab4", linkName:"construct_dash_conop_qaqc_mos", linkParam:linkParamArr, linkWinTitle: 'MS'};
        parent.postMessage(postParam ,"*");
    }
}

function openConOpDashboardNCR(paramStatus, paramFromDt, paramToDt, cardName){
    var linkParamArr = processFilterParamArr(["", "Quality", "", paramFromDt, paramToDt, paramStatus, ""]);
    console.log(linkParamArr)
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
        parent.postMessage(postParam ,"*");
    }
}

function openConOpDashboardLand(year, month){
    if(year == '' || month == '') return 

    var linkParamArr = [year, month];
    var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab18", linkName:"construct_dash_conop_land_management", linkParam:linkParamArr, linkWinTitle: 'Land Management'};
    if(localStorage.ui_pref == 'ri_v3'){
        window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_management", linkParamArr, "Land Management");
    }else{
        parent.postMessage(postParam ,"*");
    }
}

function updateCardNCR(data){
    // as cumulative is for Open and Closed as well so all data Will shared
    var cumulNCRVal = (data.cumulative && data.cumulative.val) ? data.cumulative.val : 0;
    var cumulNCRAllData = (data.cumulative && data.cumulative.allData) ? data.cumulative.allData : [];
    var cumulNCRFilterStatus = (cumulNCRAllData.status) ? cumulNCRAllData.status : '';
    var cumulNCRFilterToDt = (cumulNCRAllData.dateTo) ? cumulNCRAllData.dateTo : '';
    var cumulNCRHtml = cumulNCRVal;
    if(cumulNCRVal != 0){
        cumulNCRHtml = "<span onclick='openConOpDashboardNCR(\""+cumulNCRFilterStatus+"\",\"\",\""+cumulNCRFilterToDt+"\", \"Cumulative\");'>"+cumulNCRVal+"<span/>";
    }
    $("#cumulNCR").html(cumulNCRHtml);

    var pendNCRVal = (data.Pending && data.Pending.val) ? data.Pending.val : 0;
    var pendNCRAllData = (data.Pending && data.Pending.allData) ? data.Pending.allData : [];
    var pendNCRFilterStatus = (pendNCRAllData.status) ? pendNCRAllData.status : '';
    var pendNCRHtml = pendNCRVal;
    if(pendNCRVal != 0){
        pendNCRHtml = "<span onclick='openConOpDashboardNCR(\"Pending\",\"\",\""+cumulNCRFilterToDt+"\", \"Pending\");'>"+pendNCRVal+"<span/>";
    }
    $("#pendNCR").html(pendNCRHtml);

    var closeNCRVal = (data.Closed && data.Closed.val) ? data.Closed.val : 0;
    var closeNCRAllData = (data.Closed && data.Closed.allData) ? data.Closed.allData : [];
    var closeNCRFilterStatus = (closeNCRAllData.status) ? closeNCRAllData.status : '';
    var closeNCRHtml = closeNCRVal;
    if(closeNCRVal != 0){
        closeNCRHtml = "<span onclick='openConOpDashboardNCR(\"Closed\",\"\",\""+cumulNCRFilterToDt+"\", \"Closed\");'>"+closeNCRVal+"<span/>";
    }
    $("#closeNCR").html(closeNCRHtml);
}

function openConOpDashboardNOI(paramStatus, paramFromDt, paramToDt, cardName){
    var linkParamArr = processFilterParamArr(["", paramFromDt, paramToDt, paramStatus]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("NOI", "construct_dash_conop_qaqc_noi", linkParamArr, "Notice of Improvement : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"NOI", conOpTabId:"conopTab14", linkName:"construct_dash_conop_qaqc_noi", linkParam:linkParamArr, linkWinTitle: 'NOI'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardNOI(data){
    var cumulNOIVal = (data.cumulative && data.cumulative.val) ? data.cumulative.val : 0;
    var cumulNOIAllData = (data.cumulative && data.cumulative.allData) ? data.cumulative.allData : [];
    var cumulNOIFilterStatus = (cumulNOIAllData.status) ? cumulNOIAllData.status : '';
    var cumulNOIFilterToDt = (cumulNOIAllData.dateTo) ? cumulNOIAllData.dateTo : '';
    var cumulNOIHtml = cumulNOIVal;
    if(cumulNOIVal != 0){
        cumulNOIHtml = "<span onclick='openConOpDashboardNOI(\""+cumulNOIFilterStatus+"\",\"\",\""+cumulNOIFilterToDt+"\", \"Cumulative\");'>"+cumulNOIVal+"<span/>";
    }
    $("#cumulNOI").html(cumulNOIHtml);

    var pendNOIVal = (data.Pending && data.Pending.val) ? data.Pending.val : 0;
    var pendNOIAllData = (data.Pending && data.Pending.allData) ? data.Pending.allData : [];
    var pendNOIFilterStatus = (pendNOIAllData.status) ? pendNOIAllData.status : '';
    var pendNOIHtml = pendNOIVal;
    if(pendNOIVal != 0){
        pendNOIHtml = "<span onclick='openConOpDashboardNOI(\"Pending\",\"\",\""+cumulNOIFilterToDt+"\", \"Pending\");'>"+pendNOIVal+"<span/>";
    }
    $("#pendNOI").html(pendNOIHtml);

    var closeNOIVal = (data.Closed && data.Closed.val) ? data.Closed.val : 0;
    var closeNOIAllData = (data.Closed && data.Closed.allData) ? data.Closed.allData : [];
    var closeNOIHtml = closeNOIVal;
    if(closeNOIVal != 0){
        closeNOIHtml = "<span onclick='openConOpDashboardNOI(\"Closed\",\"\",\""+cumulNOIFilterToDt+"\", \"Closed\");'>"+closeNOIVal+"<span/>";
    }
    
    $("#closeNOI").html(closeNOIHtml);
}

function openConOpDashboardRFI(paramMth, paramYr, cardName){
    var linkParamArr = processFilterParamArr([paramYr, paramMth]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("RFI", "construct_dash_conop_qaqc_rfi", linkParamArr, "Request For Information : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"RFI", conOpTabId:"conopTab3", linkName:"construct_dash_conop_qaqc_rfi", linkParam:linkParamArr, linkWinTitle: 'RFI'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardRFI(data){

    var RFIAllData = (data.allData) ? data.allData : [];
    var RFIFilterMonth = (RFIAllData.month) ? RFIAllData.month : '';
    var RFIFilterYear = (RFIAllData.year) ? RFIAllData.year : '';

    var cumulRFIVal = (data.ttlSubmit) ? data.ttlSubmit : 0;
    var cumulRFIHtml = cumulRFIVal;
    if(cumulRFIVal != 0){
        cumulRFIHtml = "<span onclick='openConOpDashboardRFI(\""+RFIFilterMonth+"\",\""+RFIFilterYear+"\", \"Submitted\");'>"+cumulRFIVal+"<span/>";
    }
    $("#cumulRFI").html(cumulRFIHtml);

    var openRFIVal = (data.ttlOpen) ? data.ttlOpen : 0;
    var openRFIHtml = openRFIVal;
    if(openRFIVal != 0){
        openRFIHtml = "<span onclick='openConOpDashboardRFI(\""+RFIFilterMonth+"\",\""+RFIFilterYear+"\" , \"Pending\");'>"+openRFIVal+"<span/>";
    }
    $("#openRFI").html(openRFIHtml);
    
    var closeRFIVal = (data.ttlClose) ? data.ttlClose : 0;
    var closeRFIHtml = closeRFIVal;
    if(closeRFIVal != 0){
        closeRFIHtml = "<span onclick='openConOpDashboardRFI(\""+RFIFilterMonth+"\",\""+RFIFilterYear+"\", \"Closed\");'>"+closeRFIVal+"<span/>";
    }
    $("#closeRFI").html(closeRFIHtml);
}

function openConOpDashboardWIR(mtFilterMth, mtFilterYear, cardName){
    var linkParamArr = processFilterParamArr([mtFilterYear, mtFilterMth]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("WIR", "construct_dash_conop_qaqc_wir", linkParamArr, "Work Inspection Request : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"WIR", conOpTabId:"conopTab2", linkName:"construct_dash_conop_qaqc_wir", linkParam:linkParamArr, linkWinTitle: 'WIR'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardWIR(data){
    var WIRAllData = (data.allData) ? data.allData : [];
    var WIRFilterMonth = (WIRAllData.month) ? WIRAllData.month : '';
    var WIRFilterYear = (WIRAllData.year) ? WIRAllData.year : '';

    var submitWIRVal = (data.ttlSubmit) ? data.ttlSubmit : 0;
    var submitWIRHtml = submitWIRVal;
    if(submitWIRVal != 0){
        submitWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Submitted\");'>"+submitWIRVal+"<span/>";
    }
    $("#submitWIR").html(submitWIRHtml);
    
    var approvedWIRVal = (data.ttlApproved) ? data.ttlApproved : 0;
    var approvedWIRHtml = approvedWIRVal;
    if(approvedWIRVal != 0){
        approvedWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Approved\");'>"+approvedWIRVal+"<span/>";
    }
    $("#approvedWIR").html(approvedWIRHtml);

    var unapprovedWIRVal = (data.ttlUnApproved) ? data.ttlUnApproved : 0;
    var unapprovedWIRHtml = unapprovedWIRVal;
    if(unapprovedWIRVal != 0){
        unapprovedWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Unapproved\");'>"+unapprovedWIRVal+"<span/>";
    }
    $("#unapprovedWIR").html(unapprovedWIRHtml);

    var cancelWIRVal = (data.ttlCancel) ? data.ttlCancel : 0;
    var cancelWIRHtml = cancelWIRVal;
    if(cancelWIRVal != 0){
        cancelWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Cancelled\");'>"+cancelWIRVal+"<span/>";
    }
    $("#cancelWIR").html(cancelWIRHtml);

    var pendWIRVal = (data.ttlPending) ? data.ttlPending : 0;
    var pendWIRHtml = pendWIRVal;
    if(pendWIRVal != 0){
        pendWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Pending\");'>"+pendWIRVal+"<span/>";
    }
    $("#pendWIR").html(pendWIRHtml);

    var closedWIRVal = (data.ttlClose) ? data.ttlClose : 0;
    var closedWIRHtml = closedWIRVal;
    if(closedWIRVal != 0){
        closedWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Closed\");'>"+closedWIRVal+"<span/>";
    }
    $("#closedWIR").html(closedWIRHtml);
}

function openConOpDashboardSMH(paramYr, paramMonth){
    var linkParamArr = processFilterParamArr([paramMonth, paramYr]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("SMH", "construct_dash_conop_smh", linkParamArr, "Total Man-Hour");
    }else{
        var postParam = {function:"openConOpDashboard",processType:"SMH", conOpTabId:"conopTab10", linkName:"construct_dash_conop_smh", linkParam:linkParamArr, linkWinTitle: 'Total Safe Man-Hour Works Without LTI'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardSMH(data){
    var allDataArr = data.allData ?  data.allData : [];
    var paramYr = (allDataArr.year) ? allDataArr.year : [];
    var paramMonth = (allDataArr.month) ? allDataArr.month : [];

    if(localStorage.ui_pref == "ri_v3"){
        if(window.parent.$(".packFilter.myDashboard").is(":visible")){
            var selWpc = window.parent.$(".packFilter.myDashboard").val();
            if(selWpc == 'overall'){
                $("#cumulWork").html((data.cardCumulWithoutLti) ? data.cardCumulWithoutLti : 0);
            }
            else{
                $("#cumulWork").html((data.cardCumulWithoutLti) ?  '<span style="cursor:pointer;" onclick="openConOpDashboardSMH(\''+paramYr+'\',\''+paramMonth+'\')">'+data.cardCumulWithoutLti+'</span>' : 0);
            }
        }
        else{
            $("#cumulWork").html((data.cardCumulWithoutLti) ?  '<span style="cursor:pointer;" onclick="openConOpDashboardSMH(\''+paramYr+'\',\''+paramMonth+'\')">'+data.cardCumulWithoutLti+'</span>' : 0);
        }
    }
    else{
        if($("#wpcFilter").is(":visible")){
            var selWpc = $('#wpcFilter').val();
            if(selWpc == 'overall'){
                $("#cumulWork").html((data.cardCumulWithoutLti) ? data.cardCumulWithoutLti : 0);
            }
            else{
                $("#cumulWork").html((data.cardCumulWithoutLti) ?  '<span style="cursor:pointer;" onclick="openConOpDashboardSMH(\''+paramYr+'\',\''+paramMonth+'\')">'+data.cardCumulWithoutLti+'</span>' : 0);
            }
        }
        else{
            $("#cumulWork").html((data.cardCumulWithoutLti) ?  '<span style="cursor:pointer;" onclick="openConOpDashboardSMH(\''+paramYr+'\',\''+paramMonth+'\')">'+data.cardCumulWithoutLti+'</span>' : 0);
        }
    }
    

}

function openProgressSummaryUpload(plannedVal, e){

    if(localStorage.ui_pref == "ri_v3"){
        $('#valueProceessConstruct', window.parent.document).change(function(){
            window.parent.wizardOpenPage(e);
        });

        $('#valueProceessConstruct', window.parent.document).val("PSU").trigger('change');

    }else{
        var postParam = {function:"openProgressSummaryUpload",plannedVal:plannedVal};
        if(localStorage.isParent && localStorage.isParent == 'isParent'){
            var selWpc = $('#wpcFilter').val();
            if (selWpc == 'overall') selWpc = '';
            var postParam = {function:"openProgressSummaryUpload",plannedVal:plannedVal, selectedWPC : selWpc};
        }
        parent.postMessage(postParam ,"*");
    }
}

function populatePhysicalTable(data){
    var afteractPlan = (data.phyAct) ? parseFloat(data.phyAct).toFixed(2) : 0;
    var afterphyPlan = (data.phyPlan) ? parseFloat(data.phyPlan).toFixed(2) : 0;

    var varData = parseFloat(data.phyAct - data.phyPlan);
    varData = (varData) ? varData.toFixed(2) : 0;

    var spiValue = afteractPlan / afterphyPlan;
    var classSPI = '';
    if(spiValue > -10){
        classSPI = 'green';
    }
    else if(spiValue >= -10 || spiValue > -20){
        classSPI = 'yellow';
    }
    else if(spiValue >= -20 || spiValue > -100){
        classSPI = 'red';
    }
    $('#SPITime').addClass(classSPI)
    
    let projectTbHTML = '';
    $("#phyMainTable").html("");
    if (data) {
        projectTbHTML += '<tr data-width="70" rel="process" onclick="openProgressSummaryUpload(\''+afterphyPlan+'\', this);">'
        projectTbHTML += '<td>Planned</td>'
        projectTbHTML += '<td class="clickable">' + afterphyPlan + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td>Actual</td>'
        projectTbHTML += '<td>' + afteractPlan + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr data-width="70" rel="process" onclick="openProgressSummaryUpload(\''+afterphyPlan+'\', this);">'
        projectTbHTML += '<td>Variances</td>'
        projectTbHTML += '<td class="clickable">' + varData + '</td>'
        projectTbHTML += '</tr>';
    }
    $("#phyMainTable").html(projectTbHTML);

    var afteractFinance = (data.finActual) ? parseFloat(data.finActual).toFixed(2) : 0;
    var afterphyFinance = (data.finPlan) ? parseFloat(data.finPlan).toFixed(2) : 0;
    var varFinanceData = parseFloat(data.finActual - data.finPlan);
    varFinanceData = (varFinanceData) ? varFinanceData.toFixed(2) : 0;

    let financeTbHTML = '';
    $("#financeMainTable").html("");
    if (data) {
        financeTbHTML += '<tr data-width="70" rel="process" onclick="openProgressSummaryUpload(\''+afterphyPlan+'\', this);">'
        financeTbHTML += '<td>Planned</td>'
        financeTbHTML += '<td class="clickable">' + afterphyFinance + '</td>'
        financeTbHTML += '</tr>'
        financeTbHTML += '<tr>'
        financeTbHTML += '<td>Actual</td>'
        financeTbHTML += '<td>' + afteractFinance + '</td>'
        financeTbHTML += '</tr>'
        financeTbHTML += '<tr data-width="70" rel="process" onclick="openProgressSummaryUpload(\''+afterphyPlan+'\', this);">'
        financeTbHTML += '<td>Variances</td>'
        financeTbHTML += '<td class="clickable">' + varFinanceData + '</td>'
        financeTbHTML += '</tr>';
    }
    $("#financeMainTable").html(financeTbHTML);
}
function openConOpDashboardPUBC(paramFrom, paramTo, paramStatus){
    var cardName; 
    var paramType = '';
    var linkParamArr = processFilterParamArr([paramFrom, paramTo, paramType, paramStatus, '', '']);
    
    if(localStorage.ui_pref == "ri_v3"){
        if(paramStatus == "In Progress"){
            cardName = 'Open'
        }else if(paramStatus == "Closed"){
            cardName = paramStatus
        }else{
            cardName = 'Total'
        }
        window.parent.widgetConopOpen("PUBC", "construct_dash_conop_pubc", linkParamArr, "Public Complaint : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"PUBC", conOpTabId:"conopTab15", linkName:"construct_dash_conop_pubc", linkParam:linkParamArr, linkWinTitle: 'Public Complaint'};
        parent.postMessage(postParam ,"*");
    }
}

function updatePUBC(data, allDataArr){
    var paramFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : [];
    var paramTo = (allDataArr.dateTo) ? allDataArr.dateTo : [];

    $("#totalComplaint").html((data.cumulative) ? '<span style="cursor:pointer;" onclick="openConOpDashboardPUBC(\''+paramFrom+'\',\''+paramTo+'\',\'\')">'+data.cumulative+'</span>' : 0);
    $("#openComplaint").html((data.Open) ? '<span style="cursor:pointer;" onclick="openConOpDashboardPUBC(\''+paramFrom+'\',\''+paramTo+'\',\'In Progress\',\'\')">'+data.Open+'</span>' : 0);
    $("#closedComplaint").html((data.Close) ? '<span style="cursor:pointer;" onclick="openConOpDashboardPUBC(\''+paramFrom+'\',\''+paramTo+'\',\'Closed\',\'\')">'+data.Close+'</span>' : 0);
}

function openConOpDashboardRR(paramFrom, paramTo, paramStatus){
    var linkParamArr = processFilterParamArr([paramFrom, paramTo, paramStatus]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("RR", "construct_dash_conop_rr", linkParamArr, "Risk Register : " + paramStatus);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"conopTab13", linkName:"construct_dash_conop_rr", linkParam:linkParamArr, linkWinTitle: 'Risk Register'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardRR(data, dataoverall){
    var allDataArr = data.allData ?  data.allData : [];
    var paramFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : [];
    var paramTo = (allDataArr.dateTo) ? allDataArr.dateTo : [];

    $("#riskOpen").html((data.Open) ? '<span style="cursor:pointer;" onclick="openConOpDashboardRR(\''+paramFrom+'\',\''+paramTo+'\',\'Open\')">'+data.Open+'</span>' : 0);
    $("#riskClosed").html((data.Closed) ? '<span style="cursor:pointer;" onclick="openConOpDashboardRR(\''+paramFrom+'\',\''+paramTo+'\',\'Closed\')">'+data.Closed+'</span>' : 0);

    if(dataoverall){
        $("#riskScore").html((dataoverall.riskScore) ? dataoverall.riskScore : 0);
    }

}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function updateCardTime(data){
    var getCurrentDate = new Date();
    var elapsedMonth = 0;
    var remainingMonth = 0;

    if(data){
        var packageStartDate = (data.start_date) ? new Date(data.start_date) : 'NA';
        if(packageStartDate != 'NA'){
            elapsedMonth = monthDiff(packageStartDate, getCurrentDate)
        }

        var packageEndDate = (data.end_date) ? new Date(data.end_date) : 'NA';
        if(packageEndDate != 'NA'){
            remainingMonth = monthDiff(getCurrentDate, packageEndDate)
        }
    }

    $("#elapseTime").html(elapsedMonth + ' MTH(s)');
    $("#remainingTime").html(remainingMonth + ' MTH(s)');
}

function updateCardMS(data, dataRec, dataAging, dataAgingCode2){
    var msAllData = (data.allData) ? data.allData : [];
    var msFilterDtFrom = (msAllData.dateFrom) ? msAllData.dateFrom : '';
    var msFilterDtTo = (msAllData.dateTo) ? msAllData.dateTo : '';

    var msAllDataCurr = (dataRec.allDataCurr) ? dataRec.allDataCurr : [];
    var msFilterDtFromCurr = (msAllDataCurr.dateFrom) ? msAllDataCurr.dateFrom : '';
    var msFilterDtToCurr = (msAllDataCurr.dateTo) ? msAllDataCurr.dateTo : '';

    var msAllDataCumul = (data.allDataCumul) ? data.allDataCumul : [];
    var msFilterDtToCumul = (msAllDataCumul.dateTo) ? msAllDataCumul.dateTo : '';

    var receivedMSVal = (dataRec.ttlSubmit) ? dataRec.ttlSubmit : 0;
    var receivedMSHtml = receivedMSVal;
    if(receivedMSVal != 0){
        receivedMSHtml = "<span onclick='openConOpDashboardMS(\""+msFilterDtFromCurr+"\",\""+msFilterDtToCurr+"\", \"\", \"Received\");'>"+receivedMSVal+"<span/>";
    }
    $("#receivedMS").html(receivedMSHtml);

    var cumulMSVal = (data.cumul) ? data.cumul : 0;
    var cumulMSHtml = cumulMSVal;
    if(cumulMSVal != 0){
        cumulMSHtml = "<span onclick='openConOpDashboardMS(\"\",\""+msFilterDtToCumul+"\", \"\", \"Cumulative\");'>"+cumulMSVal+"<span/>";
    }
    $("#cumulMS").html(cumulMSHtml);

    var reviewMSVal = (data.totalNoCode) ? data.totalNoCode : 0;
    var reviewMSHtml = reviewMSVal;
    if(reviewMSVal != 0){
        reviewMSHtml = "<span onclick='openConOpDashboardMS(\""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"\", \"yes\", \"Under Review\");'>"+reviewMSVal+"<span/>";
    }
    $("#reviewMS").html(reviewMSHtml);

    var code1MSVal = (data['Code 1: Approved']) ? data['Code 1: Approved'] : 0;
    var code1MSHtml = code1MSVal;
    if(code1MSVal != 0){
        code1MSHtml = "<span onclick='openConOpDashboardMS(\""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"Code 1: Approved\", \"Code 1\");'>"+code1MSVal+"<span/>";
    }
    $("#code1MS").html(code1MSHtml);

    var code2MSVal = (data['Code 2: Approved with Comment']) ? data['Code 2: Approved with Comment'] : 0;
    var code2MSHtml = code2MSVal;
    if(code2MSVal != 0){
        code2MSHtml = "<span onclick='openConOpDashboardMS(\""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"Code 2: Approved with Comment\", \"Code 2\");'>"+code2MSVal+"<span/>";
    }
    $("#code2MS").html(code2MSHtml);

    var code3MSVal = (data['Code 3: Rejected']) ? data['Code 3: Rejected'] : 0;
    var code3MSHtml = code3MSVal;
    if(code3MSVal != 0){
        code3MSHtml = "<span onclick='openConOpDashboardMS(\""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"Code 3: Rejected\", \"Code 3\");'>"+code3MSVal+"<span/>";
    }
    $("#code3MS").html(code3MSHtml);

    if(dataAging.length != 0){
        var aging = Object.keys(dataAging).reduce((a, b) => dataAging[a] > dataAging[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMSBackground').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMSBackground').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMSBackground').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMSBackground').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMSBackground').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMSBackground').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }

    if(dataAgingCode2.length != 0){
        var aging = Object.keys(dataAgingCode2).reduce((a, b) => dataAgingCode2[a] > dataAgingCode2[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMSCode2Background').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMSCode2Background').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMSCode2Background').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMSCode2Background').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMSCode2Background').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMSCode2Background').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }
    
}

function updateCardMT(data, dataRec, dataAging, dataAgingCode2){
    var MTAllData = (data.allData) ? data.allData : [];
    var MTFilterDtFrom = (MTAllData.dateFrom) ? MTAllData.dateFrom : '';
    var MTFilterDtTo = (MTAllData.dateTo) ? MTAllData.dateTo : '';

    var mtAllDataCurr = (dataRec.allDataCurr) ? dataRec.allDataCurr : [];
    var mtFilterDtFromCurr = (mtAllDataCurr.dateFrom) ? mtAllDataCurr.dateFrom : '';
    var mtFilterDtToCurr = (mtAllDataCurr.dateTo) ? mtAllDataCurr.dateTo : '';

    var msAllDataCumul = (data.allDataCumul) ? data.allDataCumul : [];
    var msFilterDtToCumul = (msAllDataCumul.dateTo) ? msAllDataCumul.dateTo : '';

    var receivedMTVal = (dataRec.ttlSubmit) ? dataRec.ttlSubmit : 0;
    var receivedMTHtml = receivedMTVal;
    if(receivedMTVal != 0){
        receivedMTHtml = "<span onclick='openConOpDashboardMT(\""+mtFilterDtFromCurr+"\",\""+mtFilterDtToCurr+"\", \"\", \"Received\");'>"+receivedMTVal+"<span/>";
    }
    $("#receivedMT").html(receivedMTHtml);

    var cumulMTVal = (data.cumul) ? data.cumul : 0;
    var cumulMTHtml = cumulMTVal;
    if(cumulMTVal != 0){
        cumulMTHtml = "<span onclick='openConOpDashboardMT(\"\",\""+msFilterDtToCumul+"\", \"\", \"Cumulative\");'>"+cumulMTVal+"<span/>";
    }
    $("#cumulMT").html(cumulMTHtml);

    var reviewMTVal = (data.totalNoCode) ? data.totalNoCode : 0;
    var reviewMTHtml = reviewMTVal;
    if(reviewMTVal != 0){
        reviewMTHtml = "<span onclick='openConOpDashboardMT(\""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"\", \"yes\", \"Under Review\");'>"+reviewMTVal+"<span/>";
    }
    $("#reviewMT").html(reviewMTHtml);

    var code1MTVal = (data['Code 1: Approved']) ? data['Code 1: Approved'] : 0;
    var code1MTHtml = code1MTVal;
    if(code1MTVal != 0){
        code1MTHtml = "<span onclick='openConOpDashboardMT(\""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"Code 1: Approved\", \"Code 1\");'>"+code1MTVal+"<span/>";
    }
    $("#code1MT").html(code1MTHtml);

    var code2MTVal = (data['Code 2: Approved with Comment']) ? data['Code 2: Approved with Comment'] : 0;
    var code2MTHtml = code2MTVal;
    if(code2MTVal != 0){
        code2MTHtml = "<span onclick='openConOpDashboardMT(\""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"Code 2: Approved with Comment\", \"Code 2\");'>"+code2MTVal+"<span/>";
    }
    $("#code2MT").html(code2MTHtml);

    var code3MTVal = (data['Code 3: Rejected']) ? data['Code 3: Rejected'] : 0;
    var code3MTHtml = code3MTVal;
    if(code3MTVal != 0){
        code3MTHtml = "<span onclick='openConOpDashboardMT(\""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"Code 3: Rejected\", \"Code 3\");'>"+code3MTVal+"<span/>";
    }
    $("#code3MT").html(code3MTHtml);

    if(dataAging.length != 0){
        var aging = Object.keys(dataAging).reduce((a, b) => dataAging[a] > dataAging[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMTBackground').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMTBackground').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMTBackground').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMTBackground').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMTBackground').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMTBackground').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }

    if(dataAgingCode2.length != 0){
        var aging = Object.keys(dataAgingCode2).reduce((a, b) => dataAgingCode2[a] > dataAgingCode2[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMTCode2Background').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMTCode2Background').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMTCode2Background').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMTCode2Background').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMTCode2Background').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMTCode2Background').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }
    
}

function updateLandPart(data, allData, dataMain){
    var cumulIssueAll = (data.ttlCumulIssueAll) ? data.ttlCumulIssueAll : 0;
    var cumulIssueBal = (data.ttlIssueBalance) ? data.ttlIssueBalance : 0;
    var closeData = cumulIssueAll - cumulIssueBal;

    var accumulIssue = (dataMain.issueAccumul) ? dataMain.issueAccumul : 0;
    var solvedIssue = (dataMain.issueSolved) ? dataMain.issueSolved : 0;
    var balIssue = (dataMain.issueBal) ? dataMain.issueBal : 0;

    var accumulKM = (dataMain.kmAccumul) ? dataMain.kmAccumul : 0;
    var solvedKM = (dataMain.kmSolved) ? dataMain.kmSolved : 0;
    var balKM = (dataMain.kmBal) ? dataMain.kmBal : 0;

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    var cumulSolvedIssue = (dataMain.cumulativeSolvedIssue) ? dataMain.cumulativeSolvedIssue : 0;
    var cumulSolvedIssueKM = (dataMain.cumulativeSolvedIssueKM) ? dataMain.cumulativeSolvedIssueKM : 0;

    var balIssueVal = accumulIssue - cumulSolvedIssue;
    var balKMVal = accumulKM - cumulSolvedIssueKM;

    $("#aiwiMain").html((data.aiwiMain) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+data.aiwiMain+'%' : 0);
    $("#foeMain").html((data.foeMain) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+data.foeMain+'%' : 0);
    $("#ttlCumulIssueAll").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+cumulIssueAll);
    $("#ttlIssueBalance").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+cumulIssueBal);
    $("#ttlIssueClosed").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+closeData);

    $("#aiwiComplete").html((dataMain.aiwiPercentComplete) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.aiwiPercentComplete+'%' : 0);
    $("#aiwiBal").html((dataMain.aiwiPercentBal) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.aiwiPercentBal+'%' : 0);
    $("#aiwiCompleteKM").html((dataMain.aiwiKMcomplete) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.aiwiKMcomplete+'' : 0);
    $("#aiwiBalKM").html((dataMain.aiwiKMbal) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.aiwiKMbal+'' : 0);

    $("#foeComplete").html((dataMain.foePercentComplete) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.foePercentComplete+'%' : 0);
    $("#foeBal").html((dataMain.foePercentBal) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.foePercentBal+'%' : 0);
    $("#foeCompleteKM").html((dataMain.foeKMcomplete) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.foeKMcomplete+'' : 0);
    $("#foeBalKM").html((dataMain.foeKMbal) ? '<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dataMain.foeKMbal+'' : 0);

    $("#accumulIssue").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+accumulIssue);
    $("#solveIssue").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+cumulSolvedIssue);
    $("#balIssue").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+balIssueVal);
    $("#accumulKM").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+accumulKM);
    $("#solveKM").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+cumulSolvedIssueKM);
    $("#balKM").html('<span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+balKMVal);

}

function refreshInformation(proj = 'overall', year = 'all', month = 'all'){

    if(proj == 'overall'){
        $('#qualityContainer').css('height', 'calc(100% - 5px)');
        $('.packageContainer').css('display', 'none');
        $('#riskContainer').css({
            'flex': '1 1 auto',
            'margin-right': 'unset',
        })
        $('#qualityContainerChild-1').css('display', 'block');
        $('#qualityContainerChild-2').css('height', '');
        $('#timeContainer').css('display', 'none');
        $('#landContainer').css({
            'flex': '1 1 auto',
            'margin-right': 'unset',
        });
    }else{
        $('.packageContainer').css('display', '');
        $('#qualityContainer').css('height', '');
        $('#qualityContainerChild-1').css('display', 'none');
        $('#qualityContainerChild-2').css('height', 'calc(100% - 5px)');
        $('#riskContainer').css({
            'flex': '1 1 auto',
            'margin-right': '',
        });
        $('#timeContainer').css('display', '');
        $('#landContainer').css({
            'flex': '1 1 auto',
            'margin-right': '',
        });
    }

    var contract = (mainData.contractInfo && mainData.contractInfo[proj]) ? mainData.contractInfo[proj] : [];
    updateContractDetails(contract);
    updateCostDetails(contract);

    var ncrData = (mainData.ncr && mainData.ncr[proj] && mainData.ncr[proj][year] && mainData.ncr[proj][year][month] && mainData.ncr[proj][year][month].card) ? mainData.ncr[proj][year][month].card : [];
    updateCardNCR(ncrData)

    var noiData = (mainData.noi && mainData.noi[proj] && mainData.noi[proj][year] && mainData.noi[proj][year][month] && mainData.noi[proj][year][month].card) ? mainData.noi[proj][year][month].card : [];
    updateCardNOI(noiData)

    var rfiData = (mainData.rfi && mainData.rfi[proj] && mainData.rfi[proj][year] && mainData.rfi[proj][year][month] && mainData.rfi[proj][year][month].card) ? mainData.rfi[proj][year][month].card : [];
    updateCardRFI(rfiData)

    var wirData = (mainData.wir && mainData.wir[proj] && mainData.wir[proj][year] && mainData.wir[proj][year][month] && mainData.wir[proj][year][month].card) ? mainData.wir[proj][year][month].card : [];
    updateCardWIR(wirData)

    var smhData = (mainData.smh && mainData.smh[proj] && mainData.smh[proj][year] && mainData.smh[proj][year][month]) ? mainData.smh[proj][year][month] : [];
    updateCardSMH(smhData)

    var pubcData = (mainData.pubc && mainData.pubc[proj] && mainData.pubc[proj][year] && mainData.pubc[proj][year][month]) ? mainData.pubc[proj][year][month] : [];
    var publicData = (pubcData && pubcData.card) ? pubcData.card : [];
    var filterArr = (pubcData && pubcData.allData) ? pubcData.allData : [];
    updatePUBC(publicData, filterArr)

    var rrData = (mainData.rr && mainData.rr[proj] && mainData.rr[proj][year] && mainData.rr[proj][year][month] && mainData.rr[proj][year][month].card) ? mainData.rr[proj][year][month].card : [];
    var cardRisk = (rrData && rrData.riskStatus) ? rrData.riskStatus : [];

    var rrDataOverall = (mainData.rr && mainData.rr[proj] && mainData.rr[proj][year] && mainData.rr[proj][year][month] && mainData.rr[proj][year][month].cardOverall) ? mainData.rr[proj][year][month].cardOverall : [];
    updateCardRR(cardRisk, rrDataOverall);

    var currentDate = new Date();
    var yearPSU;
    var monthPSU;
    if(year == 'all'){
        yearPSU = currentDate.getFullYear();
        monthPSU = monthHalftext[currentDate.getMonth() + 1];
    }
    else{
        yearPSU = year;
        if(month == 'all'){
            monthPSU = monthHalftext[currentDate.getMonth() + 1];

        }
        else{
            monthPSU = month;
        }
    }
    
    var psuData = (mainData.pSU && mainData.pSU[proj] && mainData.pSU[proj].overall && mainData.pSU[proj].overall.card[yearPSU] && mainData.pSU[proj].overall.card[yearPSU][monthPSU]) ? mainData.pSU[proj].overall.card[yearPSU][monthPSU] : [];
    populatePhysicalTable(psuData)

    var timeData = (mainData.time && mainData.time[proj]) ? mainData.time[proj] : [];
    updateCardTime(timeData)

    var msDetails = (mainData && mainData.ms && mainData.ms[proj] && mainData.ms[proj][year] && mainData.ms[proj][year][month]) ? mainData.ms[proj][year][month] : [];
    var mtDetails = (mainData && mainData.mt && mainData.mt[proj] && mainData.mt[proj][year] && mainData.mt[proj][year][month]) ? mainData.mt[proj][year][month] : [];

    var msCard = (msDetails && msDetails.card) ? msDetails.card : [];
    var msAging = (msDetails && msDetails.byAgingNull) ? msDetails.byAgingNull : [];
    var msCode2Aging = (msDetails && msDetails.byAgingWith) ? msDetails.byAgingWith : [];

    var mtCard = (mtDetails && mtDetails.card) ? mtDetails.card : [];
    var mtAging = (mtDetails && mtDetails.byAgingNull) ? mtDetails.byAgingNull : [];
    var mtCode2Aging = (mtDetails && mtDetails.byAgingWith) ? mtDetails.byAgingWith : [];

    var today = new Date();
    var todayYear;
    var todayMonth;
    var previousMonth;
    var yearPrev;

    if(year == 'all'){
        todayYear = today.getFullYear();
        todayMonth = monthHalftext[today.getMonth() + 1];
        previousMonth = monthHalftext[today.getMonth()];
        yearPrev = todayYear;
        if(todayMonth == 'Jan'){
            yearPrev = parseInt(todayYear) - 1;
            previousMonth = monthPrev[todayMonth];
        }
    }
    if(year != 'all'){
        todayYear = year;

        if(month != 'all'){
            todayMonth = month;
            previousMonth = monthPrev[month];
            yearPrev = year;

            if(month == "Jan"){
                yearPrev = parseInt(year) - 1;
            }
        }
    }

    var msCurrentCumul = (mainData && mainData.ms && mainData.ms[proj] && mainData.ms[proj][todayYear] && mainData.ms[proj][todayYear][todayMonth] && mainData.ms[proj][todayYear][todayMonth].card) ? mainData.ms[proj][todayYear][todayMonth].card : [];
    var mtCurrentCumul = (mainData && mainData.mt && mainData.mt[proj] && mainData.mt[proj][todayYear] && mainData.mt[proj][todayYear][todayMonth] && mainData.mt[proj][todayYear][todayMonth].card) ? mainData.mt[proj][todayYear][todayMonth].card : [];

    updateCardMS(msCard, msCurrentCumul, msAging, msCode2Aging);
    updateCardMT(mtCard, mtCurrentCumul, mtAging, mtCode2Aging);

    //ADD LAND THINGS
    var allDataLand = (mainData && mainData.landManagement['overall'] && mainData.landManagement['overall'][year] && mainData.landManagement['overall'][year][month] && mainData.landManagement['overall'][year][month]['allData']) ? mainData.landManagement['overall'][year][month]['allData'] : [];
    var landManagement = (mainData && mainData.landManagement['overall'] && mainData.landManagement['overall'][year] && mainData.landManagement['overall'][year][month]) ? mainData.landManagement['overall'][year][month] : [];
    var landMain = (mainData && mainData.landMain['overall'] && mainData.landMain['overall'][year] && mainData.landMain['overall'][year][month]) ? mainData.landMain['overall'][year][month] : [];
    updateLandPart(landManagement, allDataLand, landMain)
}

function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var selYear = $('#yearFilter').val();
    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
    
	var selMonth = $('#monthFilter').val();
    refreshInformation(selWPC, selYear, selMonth);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;
  
    refreshInformation(wpc, year, month);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "main"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                mainData = obj.data;
                refreshInformation();

                //FOR V3 ASSIGN BACK THE VALUE
                $('.filterContainer .yrFilter', window.parent.document).val('all');
								
                $('.filterContainer .mthFilter', window.parent.document).prop('disabled', true);
                $('.filterContainer .mthFilter', window.parent.document).val('all');
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });

    $("#wpcFilter").change(function () {
        var selWPC = $("#wpcFilter").val();
        refreshDashboard('overall');

        if(selWPC == 'overall'){
            $('#qualityContainer').css('height', 'calc(100% - 5px)');
            $('.packageContainer').css('display', 'none');
            $('#riskContainer').css({
                'flex': '1 1 auto',
                'margin-right': 'unset',
            })
            $('#qualityContainerChild-1').css('display', 'block');
            $('#qualityContainerChild-2').css('height', '');
            $('#timeContainer').css('display', 'none');
            $('#landContainer').css({
                'flex': '1 1 auto',
                'margin-right': 'unset',
            });
        }else{
            $('.packageContainer').css('display', '');
            $('#qualityContainer').css('height', '');
            $('#qualityContainerChild-1').css('display', 'none');
            $('#qualityContainerChild-2').css('height', 'calc(100% - 5px)');
            $('#riskContainer').css({
                'flex': '1 1 auto',
                'margin-right': '',
            });
            $('#timeContainer').css('display', '');
            $('#landContainer').css({
                'flex': '1 1 auto',
                'margin-right': '',
            });
        }
    })
})