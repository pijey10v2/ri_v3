var qaqcData;
var monthFulltext = {"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"}
var dayWeek = {0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function conOpLink(process, status, subcategory='', issuer='', receiver=''){
    var conOpTabId = '';
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var dateFilter = getDateFromToFilter();
    var cardName;

    switch (process) {
        case 'MOS':
            conOpTabId = 'conopTab4'
            linkName = 'construct_dash_conop_ms'
            linkWinTitle = 'Method Statement'
            if (status == 'Received'){
                linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, '', '', '', ''])
                cardName = status
            }else if(status=='Cumulative'){
                linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', '', '', ''])
                cardName = status
            }else{
                linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, status, '', '', ''])
                if(status == ''){
                    cardName = "Received"
                }else if(status == 'Rejected'){
                    cardName = "Rejected"
                }else{
                    cardName = status
                }
            }
            break;
        case 'MS':
            conOpTabId = 'conopTab5'
            linkName = 'construct_dash_conop_ma'
            linkWinTitle = 'Material Submission'
            if (status == 'Received'){
                linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, '', '', '', ''])
                cardName = status
            }else if(status=='Cumulative'){
                linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', '', '', ''])
                cardName = status
            }else{
                linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, status, '', '', ''])
                if(status == ''){
                    cardName = "Received"
                }else if(status == 'Rejected'){
                    cardName = "Rejected"
                }else{
                    cardName = status
                }
            }
            break;
        case 'WIR':
            conOpTabId = 'conopTab2'
            linkName = 'construct_dash_conop_qaqc_wir'
            linkWinTitle = 'Work Inspection Request'
            linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, status])
            if(status == ''){
                cardName = "Received"
            }else if(status == 'Unapproved'){
                cardName = "Rejected"
            }else if(status == 'Cancel'){
                cardName = "Cancelled"
            }else if(status == 'Close'){
                cardName = "Closed"
            }else{
                cardName = status
            }
            break;
        case 'NCR':
            conOpTabId = 'conopTab1'
            linkName = 'construct_dash_conop_qaqc_ncr_card'
            linkWinTitle = 'Non Conformance Report'
            
            var dateFrom = dateFilter.dateFrom;
            if(status=='Received'){
                cardName = status;
                status = '';
            }else if(status == 'Cumulative'){
                cardName = status;
                dateFrom = '';
                status = '';
            }else if(status == 'Pending'){
                cardName = status;
                status = 'Open';
            }else{
                if(subcategory == ''){
                    cardName = status
                }else{
                    cardName = subcategory
                }
            }

            linkParamArr = processFilterParamArr([dateFrom, dateFilter.dateTo, status, 'Quality', issuer, receiver, subcategory])
            break;
    }

    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:process, conOpTabId:conOpTabId, linkName:linkName, linkParam:linkParamArr, linkWinTitle: linkWinTitle};
        postMessageParent(postParam)
    }
}

function updateMSCard(data){ //Method Statement
    var msReceived = (data.total && data.total.submitted) ? data.total.submitted : 0;
    var msCumul = (data.total && data.total.cumulative) ? data.total.cumulative : 0;
    var msUnderReview = (data.byStatus && data.byStatus['Under Review']) ? data.byStatus['Under Review'] : 0;
    var msApproved = (data.byStatus && data.byStatus['Approved']) ? data.byStatus['Approved'] : 0;
    var msUnApproved = (data.byStatus && data.byStatus['Rejected']) ? data.byStatus['Rejected'] : 0;

    var msReceivedCard = `<span class="clickableCard" onclick="conOpLink('MOS','')">`+msReceived+`</span>`;
    var msCumulCard = `<span class="clickableCard" onclick="conOpLink('MOS','Cumulative')">`+msCumul+`</span>`;
    var msUnderReviewCard = `<span class="clickableCard" onclick="conOpLink('MOS','Under Review')">`+msUnderReview+`</span>`;
    var msApprovedCard = `<span class="clickableCard" onclick="conOpLink('MOS','Approved')">`+msApproved+`</span>`;
    var msUnApprovedCard = `<span class="clickableCard" onclick="conOpLink('MOS','Rejected')">`+msUnApproved+`</span>`;

    $('#msReceivedCard').html(msReceivedCard);
    $('#msCumulCard').html(msCumulCard);
    $('#msUnderReviewCard').html(msUnderReviewCard);
    $('#msApprovedCard').html(msApprovedCard);
    $('#msUnApprovedCard').html(msUnApprovedCard);
}

function updateMACard(data){//Method Submission
    var maReceived = (data.total && data.total.submitted) ? data.total.submitted : 0;
    var maCumul = (data.total && data.total.cumulative) ? data.total.cumulative : 0;
    var maUnderReview = (data.byStatus && data.byStatus['Under Review']) ? data.byStatus['Under Review'] : 0;
    var maApproved = (data.byStatus && data.byStatus['Approved']) ? data.byStatus['Approved'] : 0;
    var maUnApproved = (data.byStatus && data.byStatus['Rejected']) ? data.byStatus['Rejected'] : 0;

    var maReceivedCard = `<span class="clickableCard" onclick="conOpLink('MS','')">`+maReceived+`</span>`;
    var maCumulCard = `<span class="clickableCard" onclick="conOpLink('MS','Cumulative')">`+maCumul+`</span>`;
    var maUnderReviewCard = `<span class="clickableCard" onclick="conOpLink('MS','Under Review')">`+maUnderReview+`</span>`;
    var maApprovedCard = `<span class="clickableCard" onclick="conOpLink('MS','Approved')">`+maApproved+`</span>`;
    var maUnApprovedCard = `<span class="clickableCard" onclick="conOpLink('MS','Rejected')">`+maUnApproved+`</span>`;

    $('#maReceivedCard').html(maReceivedCard);
    $('#maCumulCard').html(maCumulCard);
    $('#maUnderReviewCard').html(maUnderReviewCard);
    $('#maApprovedCard').html(maApprovedCard);
    $('#maUnApprovedCard').html(maUnApprovedCard);
}

function updateWirCard(data){
    var wirSubmitted = (data.total && data.total.submitted) ? data.total.submitted : 0;
    var wirUnapproved = (data.byStatus && data.byStatus['Unapproved']) ? data.byStatus['Unapproved'] : 0;
    var wirCancelled = (data.byStatus && data.byStatus['Cancel']) ? data.byStatus['Cancel'] : 0;
    var wirApproved = (data.byStatus && data.byStatus['Approved']) ? data.byStatus['Approved'] : 0;
    var wirUnderReview = (data.byStatus && data.byStatus['Under Review']) ? data.byStatus['Under Review'] : 0;
    var wirClosed = (data.byStatus && data.byStatus['Close']) ? data.byStatus['Close'] : 0;

    var wirSubmittedCard = `<span class="clickableCard" onclick="conOpLink('WIR','')">`+wirSubmitted+`</span>`;
    var wirUnapprovedCard = `<span class="clickableCard" onclick="conOpLink('WIR','Unapproved')">`+wirUnapproved+`</span>`;
    var wirCancelledCard = `<span class="clickableCard" onclick="conOpLink('WIR','Cancel')">`+wirCancelled+`</span>`;
    var wirApprovedCard = `<span class="clickableCard" onclick="conOpLink('WIR','Approved')">`+wirApproved+`</span>`;
    var wirUnderReviewCard = `<span class="clickableCard" onclick="conOpLink('WIR','Under Review')">`+wirUnderReview+`</span>`;
    var wirClosedCard = `<span class="clickableCard" onclick="conOpLink('WIR','Close')">`+wirClosed+`</span>`;

    $('#wirSubmittedCard').html(wirSubmittedCard);
    $('#wirUnapprovedCard').html(wirUnapprovedCard);
    $('#wirCancelledCard').html(wirCancelledCard);
    $('#wirApprovedCard').html(wirApprovedCard);
    $('#wirUnderReviewCard').html(wirUnderReviewCard);
    $('#wirClosedCard').html(wirClosedCard);
}

function drawNcrCategoryChart (data, divId, monthYear) {
    var catArr = [];
    var devFromSpecDrawArr = [];
    var docDevArr = [];
    var insTestArr = [];
    var labCalibArr = [];
    var matManagementArr = [];
    var consultant = receiver = null;
    var title;

    (divId == 'bySorCatChart') ? title = 'NCR BY SO REPRESENTATIVE BY CATEGORIES' : title = 'NCR TO SUBCONTRACTOR BY CATEGORIES';

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            devFromSpecDrawArr.push((ele['DEVIATION FROM SPEC/DRAWING']) ? parseInt(ele['DEVIATION FROM SPEC/DRAWING']) : 0);
            docDevArr.push((ele['DOCUMENT AND DELIVERABLES']) ? parseInt(ele['DOCUMENT AND DELIVERABLES']) : 0);
            insTestArr.push((ele['INSPECTION AND TESTING']) ? parseInt(ele['INSPECTION AND TESTING']) : 0);
            labCalibArr.push((ele['LAB/CALIBRATION']) ? parseInt(ele['LAB/CALIBRATION']) : 0);
            matManagementArr.push((ele['MATERIAL MANAGEMENT']) ? parseInt(ele['MATERIAL MANAGEMENT']) : 0);
        }
    }

    var chart = Highcharts.chart(divId, {
        chart: {
            type: 'column',
            events: {
                render() {
                  var chart = this;
                  
                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">QAQC Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle: {
                              fontSize: '15px',
                            },
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">QAQC Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 9,
                            symbolWidth: 9,
                            itemStyle: {
                              fontSize: '9px',
                            },
                          }
                        })
                        chart.updateFlag = true;
                      }
                  }
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            itemStyle: {
                fontSize: '9px',
                fontWeight : 'normal'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px;font-weight:bold;">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'DEVIATION FROM SPEC & DRAW',
            data: devFromSpecDrawArr,
            showInLegend: false,
            color : '#376ef0',
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorCatChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }

                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, '', 'Quality', consultant,receiver, 'Deviation From Spec/Drawing'];
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Deviation From Spec/Drawing");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }, {
            name: 'DOCUMENT & DELIVERABLE',
            data: docDevArr,
            showInLegend: false,
            color : '#f1701a',
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorCatChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }

                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, '', 'Quality', consultant, receiver, 'Document and Deliverables'];
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Document and Deliverables");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                    
                }
            }
        }, {
            name: 'Inspection and Testing',
            data: insTestArr,
            showInLegend: false,
            color : '#FF0000',
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorCatChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }
                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, '', 'Quality', consultant, receiver, 'Inspection and Testing'];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Inspection and Testing");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }, {
            name: 'LAB & CALIBERATION',
            data: labCalibArr,
            showInLegend: false,
            color : '#e6e20cfa',
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorCatChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }
                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, '', 'Quality', consultant, receiver, 'Lab/Calibration'];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Lab/Calibration");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }, {
            name: 'MATERIAL MANAGEMENT',
            data: matManagementArr,
            showInLegend: false,
            color : '#002171',
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorCatChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }
                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, '', 'Quality', consultant, receiver, 'Material Management'];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Material Management");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: {
            enabled: false
        }
    });
    chart.updateFlag = true;
}

function drawStatusChart (data, divId, monthYear) {
    var catArr = [];
    var receivedArr = [];
    var pendingArr = [];
    var cumulativeArr = [];
    var closedArr = [];
    var consultant = receiver = null;
    var title;
    var colorReceived;
    var colorPending;
    var colorCumulative;
    var colorClosed;

    (divId == 'bySorStatusChart') ? title = 'NCR BY SOR' : title = 'NCR TO SUBCON';
    
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            receivedArr.push((ele['Received']) ? parseInt(ele['Received']) : 0);
            pendingArr.push((ele['Pending']) ? parseInt(ele['Pending']) : 0);
            cumulativeArr.push((ele['Cumulative']) ? parseInt(ele['Cumulative']) : 0);
            closedArr.push((ele['Closed']) ? parseInt(ele['Closed']) : 0);
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        colorReceived = '#3399FF';
        colorPending = '#002171';
        colorCumulative = 'rgb(114 195 97)';
        colorClosed = '#f1701a';
    }else{
        colorReceived = Highcharts.getOptions().colors[0];
        colorPending = Highcharts.getOptions().colors[1];
        colorCumulative = Highcharts.getOptions().colors[2];
        colorClosed = Highcharts.getOptions().colors[3];
    }

    var chart = Highcharts.chart(divId, {
        chart: {
            type: 'bar',
            events: {
                render() {
                  var chart = this;

                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">QAQC Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">QAQC Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 8,
                            symbolWidth: 8,
                            itemStyle: {
                              fontSize: '8px',
                            },
                          }
                        })
    
                        chart.updateFlag = true;
                      }
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">QAQC Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            floating : false,
            y : -5,
            itemStyle : {
                fontSize : 8
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px;font-weight:bold;">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Received',
            data: receivedArr,
            cursor: 'pointer',
            color: colorReceived,
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorStatusChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }
                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, '', 'Quality', consultant, receiver, ''];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Received");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }, {
            name: 'Pending',
            data: pendingArr,
            cursor: 'pointer',
            color: colorPending,
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorStatusChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }
                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, 'Open', 'Quality', consultant, receiver, ''];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Pending");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }, {
            name: 'Cumulative',
            data: cumulativeArr,
            cursor: 'pointer',
            color: colorCumulative,
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorStatusChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }
                    var linkParamArr = [event.point.category, '', dateFilter.dateTo, '', 'Quality', consultant, receiver, ''];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Cumulative");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }, {
            name: 'Closed',
            data: closedArr,
            cursor: 'pointer',
            color: colorClosed,
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    if(divId=='bySorStatusChart'){
                        consultant = 'Consultant';
                        receiver = '';
                    }else{
                        consultant = '';
                        receiver = 'SubCon';
                    }
                    var linkParamArr = [event.point.category, dateFilter.dateFrom, dateFilter.dateTo, 'Closed', 'Quality', consultant, receiver, ''];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - Closed");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: {
            enabled: false
        }
    });
    chart.updateFlag = true
}

function updateBySorCategoryCard (data) {
    var document_frm_num_sor = (data['DEVIATION FROM SPEC/DRAWING']) ? parseInt(data['DEVIATION FROM SPEC/DRAWING']) : 0;
    var document_deliv_num_sor= (data['DOCUMENT AND DELIVERABLES']) ? parseInt(data['DOCUMENT AND DELIVERABLES']) : 0;
    var inspect_test_sor = (data['INSPECTION AND TESTING']) ? parseInt(data['INSPECTION AND TESTING']) : 0;
    var lab_colab_sor = (data['LAB/CALIBRATION']) ? parseInt(data['LAB/CALIBRATION']) : 0;
    var material_manage_sor = (data['MATERIAL MANAGEMENT']) ? parseInt(data['MATERIAL MANAGEMENT']) : 0;

    var document_frm_num_sor_card = `<span class="clickableCard" onclick="conOpLink('NCR', '', 'Deviation From Spec/Drawing', 'Consultant')">`+document_frm_num_sor+`</span>`;
    var document_deliv_num_sor_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Document and Deliverables', 'Consultant')">`+document_deliv_num_sor+`</span>`;
    var inspect_test_sor_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Inspection and Testing', 'Consultant')">`+inspect_test_sor+`</span>`;
    var lab_colab_sor_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Lab/Calibration', 'Consultant')">`+lab_colab_sor+`</span>`;
    var material_manage_sor_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Material Management', 'Consultant')">`+material_manage_sor+`</span>`;
    
    $("#document_frm_num_sor_card").html(document_frm_num_sor_card);
    $("#document_deliv_num_sor_card").html(document_deliv_num_sor_card);
    $("#inspect_test_sor_card").html(inspect_test_sor_card);
    $("#lab_colab_sor_card").html(lab_colab_sor_card);
    $("#material_manage_sor_card").html(material_manage_sor_card);
}

function updateToSubConCategoryCard (data) {
    var document_frm_num_subcon = (data['DEVIATION FROM SPEC/DRAWING']) ? parseInt(data['DEVIATION FROM SPEC/DRAWING']) : 0;
    var document_deliv_num_subcon = (data['DOCUMENT AND DELIVERABLES']) ? parseInt(data['DOCUMENT AND DELIVERABLES']) : 0;
    var inspect_test_subcon = (data['INSPECTION AND TESTING']) ? parseInt(data['INSPECTION AND TESTING']) : 0;
    var lab_colab_subcon = (data['LAB/CALIBRATION']) ? parseInt(data['LAB/CALIBRATION']) : 0;
    var material_manage_subcon = (data['MATERIAL MANAGEMENT']) ? parseInt(data['MATERIAL MANAGEMENT']) : 0;

    var document_frm_num_subcon_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Deviation From Spec/Drawing', '', 'SubCon')">`+document_frm_num_subcon+`</span>`;
    var document_deliv_num_subcon_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Document and Deliverables', '', 'SubCon')">`+document_deliv_num_subcon+`</span>`;
    var inspect_test_subcon_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Inspection and Testing', '', 'SubCon')">`+inspect_test_subcon+`</span>`;
    var lab_colab_subcon_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Lab/Calibration', '', 'SubCon')">`+lab_colab_subcon+`</span>`;
    var material_manage_subcon_card = `<span class="clickableCard" onclick="conOpLink('NCR','', 'Material Management', '', 'SubCon')">`+material_manage_subcon+`</span>`;

    $("#document_frm_num_subcon_card").html(document_frm_num_subcon_card);
    $("#document_deliv_num_subcon_card").html(document_deliv_num_subcon_card);
    $("#inspect_test_subcon_card").html(inspect_test_subcon_card);
    $("#lab_colab_subcon_card").html(lab_colab_subcon_card);
    $("#material_manage_subcon_card").html(material_manage_subcon_card);
}

function updateBySorNcrStatusCard (data) {
    var bySorNcrCumulCount = (data['Cumulative']) ? parseInt(data['Cumulative']) : 0;
    var bySorNcrPendingCount = (data['Pending']) ? parseInt(data['Pending']) : 0
    var bySorNcrReceivedCount = (data['Received']) ? parseInt(data['Received']) : 0
    var bySorNcrClosedCount = (data['Closed']) ? parseInt(data['Closed']) : 0;

    var bySorNcrCumulCard = `<span class="clickableCard" onclick="conOpLink('NCR','Cumulative', '', 'Consultant')">`+bySorNcrCumulCount+`</span>`;
    var bySorNcrPendingCard = `<span class="clickableCard" onclick="conOpLink('NCR','Pending', '', 'Consultant')">`+bySorNcrPendingCount+`</span>`;
    var bySorNcrReceivedCard = `<span class="clickableCard" onclick="conOpLink('NCR','Received', '', 'Consultant')">`+bySorNcrReceivedCount+`</span>`;
    var bySorNcrClosedCard = `<span class="clickableCard" onclick="conOpLink('NCR','Closed', '', 'Consultant')">`+bySorNcrClosedCount+`</span>`;

    $("#bySorNcrCumul").html(bySorNcrCumulCard);
    $("#bySorNcrPending").html(bySorNcrPendingCard);
    $("#bySorNcrReceived").html(bySorNcrReceivedCard);
    $("#bySorNcrClosed").html(bySorNcrClosedCard);
}

function updateToSubConNcrStatusCard (data) {
    var toSubConNcrCumulCount = (data['Cumulative']) ? parseInt(data['Cumulative']) : 0;
    var toSubConNcrPendingCount = (data['Pending']) ? parseInt(data['Pending']) : 0;
    var toSubConNcrReceivedCount = (data['Received']) ? parseInt(data['Received']) : 0;
    var toSubConNcrClosedCount = (data['Closed']) ? parseInt(data['Closed']) : 0;

    var toSubConNcrCumul = `<span class="clickableCard" onclick="conOpLink('NCR','Cumulative', '', '', 'SubCon')">`+toSubConNcrCumulCount+`</span>`;
    var toSubConNcrPending = `<span class="clickableCard" onclick="conOpLink('NCR','Pending', '', '', 'SubCon')">`+toSubConNcrPendingCount+`</span>`;
    var toSubConNcrReceived = `<span class="clickableCard" onclick="conOpLink('NCR','Received', '', '', 'SubCon')">`+toSubConNcrReceivedCount+`</span>`;
    var toSubConNcrClosed = `<span class="clickableCard" onclick="conOpLink('NCR','Closed', '', '', 'SubCon')">`+toSubConNcrClosedCount+`</span>`;

    $("#toSubConNcrCumul").html(toSubConNcrCumul);
    $("#toSubConNcrPending").html(toSubConNcrPending);
    $("#toSubConNcrReceived").html(toSubConNcrReceived);
    $("#toSubConNcrClosed").html(toSubConNcrClosed);
}

function refreshInformation (projid = 'overall', yr = 'all', mth = 'all'){
    var dataYearMonth = "Month:" +mth+ " - " + "Year:" +yr;
    
    var msData = (qaqcData.ms && qaqcData.ms[projid] && qaqcData.ms[projid][yr] && qaqcData.ms[projid][yr][mth] && qaqcData.ms[projid][yr][mth].card) ? qaqcData.ms[projid][yr][mth].card : [];
    updateMSCard(msData);

    var maData = (qaqcData.ma && qaqcData.ma[projid] && qaqcData.ma[projid][yr] && qaqcData.ma[projid][yr][mth] && qaqcData.ma[projid][yr][mth].card) ? qaqcData.ma[projid][yr][mth].card : [];
    updateMACard(maData);

    var wirData = (qaqcData.wir && qaqcData.wir[projid] && qaqcData.wir[projid][yr] && qaqcData.wir[projid][yr][mth] && qaqcData.wir[projid][yr][mth].card) ? qaqcData.wir[projid][yr][mth].card : [];
    updateWirCard(wirData);

    var ncrData = (qaqcData.ncr && qaqcData.ncr[projid] && qaqcData.ncr[projid][yr] && qaqcData.ncr[projid][yr][mth]) ? qaqcData.ncr[projid][yr][mth] : [];
    
    var bySorData = (ncrData && ncrData.bySor) ? ncrData.bySor : [];
    var bySorNcrSubCatData = (bySorData.bySubCategory) ? bySorData.bySubCategory : [];
    var bySorNcrSubCatChartData = (bySorNcrSubCatData.byProject) ? bySorNcrSubCatData.byProject : [];
    drawNcrCategoryChart(bySorNcrSubCatChartData, 'bySorCatChart', dataYearMonth); // NCR BY SO REPRESENTATIVE BY CATEGORIES (CHART)
    var bySorNcrSubCatCardData = (bySorNcrSubCatData.card) ? bySorNcrSubCatData.card : [];
    updateBySorCategoryCard(bySorNcrSubCatCardData); // NCR BY SO REPRESENTATIVE BY CATEGORIES (CARD)

    var bySorNcrStatusData = (bySorData.byStatus) ? bySorData.byStatus : [];
    var bySorNcrStatusChartData = (bySorNcrStatusData.byProject) ? bySorNcrStatusData.byProject : [];
    drawStatusChart(bySorNcrStatusChartData, 'bySorStatusChart', dataYearMonth) // NCR BY SOR (Chart)
    var bySorNcrStatusCardData = (bySorNcrStatusData.card) ? bySorNcrStatusData.card : [];
    updateBySorNcrStatusCard(bySorNcrStatusCardData); // NCR BY SOR (4 Card)
    
    var toSubConNcrData = (ncrData && ncrData.toSubCon) ? ncrData.toSubCon : [];
    var toSubConNcrSubCatData = (toSubConNcrData.bySubCategory) ? toSubConNcrData.bySubCategory : [];
    var toSubConNcrSubCatChartData = (toSubConNcrSubCatData.byProject) ? toSubConNcrSubCatData.byProject : [];
    drawNcrCategoryChart(toSubConNcrSubCatChartData, 'toSubConCatChart', dataYearMonth); // NCR TO SUBCONTRACTORS BY CATEGORIES (CHART)
    var toSubConNcrSubCatCardData = (toSubConNcrSubCatData.card) ? toSubConNcrSubCatData.card : [];
    updateToSubConCategoryCard(toSubConNcrSubCatCardData); // NCR TO SUBCONTRACTORS BY CATEGORIES (CARD)

    var toSubConNcrStatusData = (toSubConNcrData.byStatus) ? toSubConNcrData.byStatus : [];
    var toSubConNcrStatusChartData = (toSubConNcrStatusData.byProject) ? toSubConNcrStatusData.byProject : [];
    drawStatusChart(toSubConNcrStatusChartData, 'toSubConStatusChart', dataYearMonth) // NCR TO SUBCON (Chart)
    var toSubConNcrStatusCardData = (toSubConNcrStatusData.card) ? toSubConNcrStatusData.card : [];
    updateToSubConNcrStatusCard(toSubConNcrStatusCardData); // NCR TO SUBCON (4 Card)

    
}

function refreshDashboard() {
    var selWPC = $("#wpcFilter").val();
    var selYr = $("#yearFilter").val();
    if (selYr == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
	var selMonth = $('#monthFilter').val();

    refreshInformation(selWPC, selYr, selMonth);

}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;
  
    refreshInformation(wpc, year, textMonthtoNum[month]);
}

$(function (){
	// load all the chart
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "qaqc"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                qaqcData = obj.data;
                refreshInformation();
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})