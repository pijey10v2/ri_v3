var docData;

function openListDocument(cardName){
    var linkParamArr = processFilterParamArr([]);
    if(localStorage.ui_pref == "ri_v3"){
        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
            window.parent.widgetConopOpen("DOC", 'document_dash_doc_all', linkParamArr, cardName);
        }
        else{
            return;
        }
    }
}

function openListCorr(cardName, type, purpose, category, status, id = ''){
    var linkParamArr = processFilterParamArr([type, purpose, category, status, id]);
    if(localStorage.ui_pref == "ri_v3"){
        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
            window.parent.widgetConopOpen("DOC", 'document_dash_corr_all', linkParamArr, cardName);
        }
        else{
            return;
        }

    }
}

function openListCorrResponded(cardName, type, purpose, category){
    var linkParamArr = processFilterParamArr([type, purpose, category]);
    if(localStorage.ui_pref == "ri_v3"){
        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
            window.parent.widgetConopOpen("DOC", 'document_dash_corr_all_not_pending', linkParamArr, cardName);
        }
        else{
            return;
        }

    }
}

function drawCorrTypeChart(divId ,data, ttl) {
    var total = (ttl) ? ttl : 0;
    var dataArr = [];
    var title;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == '') continue;
            var tempArr = {name: idx,y: (ele) ? ele.length : 0, allData: idx}
            dataArr.push(tempArr);
        }
    }

    (divId == "incCorrTypeChart") ? title = "INCOMING CORRESPONDENCE" : title = "OUTGOING CORRESPONDENCE"

    var typeFilter = (divId == "incCorrTypeChart") ? 'Incoming' : 'Outgoing';
    var cardNameFilter = (divId == "incCorrTypeChart") ? 'Incoming Correspondence' : 'Outgoing Correspondence';

    // incCorrTypeChart
    var chart = Highcharts.chart(divId, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>'+title+'</span>'
                          },
                          subtitle: {
                            y : 75,
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            },
                            width: 'auto',
                            labelFormatter: function () {
                                return this.name
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>'+title+'</span>'
                          },
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>'+title+'</span>'
        },
        subtitle: {
            floating : true,
            y : 4,
            text: 'Total : ' + total,
            style : {
                fontSize : '12px'
            }
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        legend: {
            width: 200,
            itemStyle: {
                fontSize: '9px',
                fontWeight : 'normal'
            },
            labelFormatter: function () {
                return this.name.length > 10 ? [...this.name].splice(0, 9).join('') + '...' : this.name
            }
        }
        ,
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'No. of Document',
            data: dataArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var correspondenceType = (event.point.allData) ? event.point.allData : '';
                    if(correspondenceType == 'If Else'){
                        correspondenceType = '';
                    }
                    var linkParamArr = processFilterParamArr([typeFilter, '', '', '', correspondenceType]);
                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DOC", 'document_dash_corr_all_pie', linkParamArr, cardNameFilter);
                        }
                        else{
                            return;
                        }
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawDocTypeChart(data){
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push(ele);
        }
    }

    // typeOfDocChart
    var chart = Highcharts.chart('typeOfDocChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>DOCUMENT TYPE</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DOCUMENT TYPE</span>'
                          },
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DOCUMENT TYPE</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Total',
            data: dataArr,
            showInLegend: false,
            color: Highcharts.getOptions().colors[0],
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var docType = (event.point.category) ? event.point.category : '';
                    var linkParamArr = processFilterParamArr([docType]);
                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DOC", 'document_dash_doc_all', linkParamArr, 'Document By Type');
                        }
                        else{
                            return;
                        }

                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function updateDocCard(val) {
    var useVal = (val != 0) ? '<span class="clickableCard" onclick="openListDocument(\'Total Document\');">'+val+'</span>' : 0;

    $("#totalDocCard").html(useVal);
}

function updateIncCorrTable (data){
    var tableHTML = '';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            tableHTML += '<tr onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'\', \'\', \'' + ele.id + '\');">' +
                            "<td>"+((ele.subject) ? ele.subject : "")+"</td>" +
                            "<td>"+((ele.dateCreated) ? ele.dateCreated : "")+"</td>" +
                            "<td>"+((ele.due_date) ? ele.due_date : "")+"</td>" +
                            "<td>"+((ele.aging) ? ele.aging : 0)+"</td>" +
                            "<td class='overdueTd' "+((ele.overdueFlag == 1) ? "style='background-color:red;'" : "")+"></td>" +
                        "</tr>";
        }
    }
    $('#incomingCorrTbBody').html(tableHTML);
}

function updateOutCorrTable (data){
    var tableHTML = '';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            tableHTML += '<tr onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'\', \'\', \'' + ele.id + '\');">' +
                            "<td>"+((ele.subject) ? ele.subject : "")+"</td>" +
                            "<td>"+((ele.document_date) ? ele.document_date : "")+"</td>" +
                            "<td>"+((ele.due_date) ? ele.due_date : "")+"</td>" +
                            "<td>"+((ele.aging) ? ele.aging : 0)+"</td>" +
                            "<td class='overdueTd' "+((ele.overdueFlag == 1) ? "style='background-color:red;'" : "")+"></td>" +
                        "</tr>";
        }
    }
    $('#outgoingCorrTbBody').html(tableHTML);
}

function updateIncCorrCard (catArr, purposeArr){
    var forInfoVal = (purposeArr['Issue for Information'] && purposeArr['Issue for Information'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'Issue for Information\', \'\', \'\');">'+purposeArr['Issue for Information'].total+'</span>' : 0;
    var forCommentVal = (purposeArr['Issue for Comment/Revision'] && purposeArr['Issue for Comment/Revision'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'Issue for Comment/Revision\', \'\', \'\');">'+purposeArr['Issue for Comment/Revision'].total+'</span>' : 0;
    var forApprovalVal = (purposeArr['Issue for Approval'] && purposeArr['Issue for Approval'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'Issue for Approval\', \'\', \'\');">'+purposeArr['Issue for Approval'].total+'</span>' : 0;
    var forOtherReqVal = (purposeArr['Other Request'] && purposeArr['Other Request'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'Other Request\', \'\', \'\');">'+purposeArr['Other Request'].total+'</span>' : 0;

    $("#incForInfoCard").html(forInfoVal);
    $("#incCommentRevCard").html(forCommentVal);
    $("#incForApprovalCard").html(forApprovalVal);
    $("#incOtherReqCard").html(forOtherReqVal);

    // total
    var clientTotalCard = (catArr.Client && catArr.Client.total) ? catArr.Client.total : 0;
    var consultantTotalCard = (catArr.Consultant && catArr.Consultant.total) ? catArr.Consultant.total : 0;
    var contractTotalCard = (catArr.Subcontractor && catArr.Subcontractor.total) ? catArr.Subcontractor.total : 0;
    var thirdTotalCard = (catArr['Third Party'] && catArr['Third Party'].total) ? catArr['Third Party'].total : 0;    

    $("#incPurposeClientTotalCard").html((clientTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Client\', \'\');">'+catArr.Client.total+'</span>' : 0);
    $("#incPurposeConsultantTotalCard").html((consultantTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Consultant\', \'\');">'+catArr.Consultant.total+'</span>' : 0);
    $("#incPurposeContractTotalCard").html((contractTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Subcontractor\', \'\');">'+catArr.Subcontractor.total+'</span>' : 0);
    $("#incPurposeThirdTotalCard").html((thirdTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Third Party\', \'\');">'+catArr['Third Party'].total+'</span>' : 0);
    
    // responded
    var clientRespondedCard = (catArr.Client && catArr.Client.Responded) ? catArr.Client.Responded : 0;
    var consultantRespondedCard = (catArr.Consultant && catArr.Consultant.Responded) ? catArr.Consultant.Responded : 0;
    var contractRespondedCard = (catArr.Subcontractor && catArr.Subcontractor.Responded) ? catArr.Subcontractor.Responded : 0;
    var thirdRespondedCard = (catArr['Third Party'] && catArr['Third Party'].Responded) ? catArr['Third Party'].Responded : 0;

    $("#incPurposeClientRespondedCard").html((clientRespondedCard != 0) ? '<span class="clickableCard" onclick="openListCorrResponded(\'Incoming Correspondence\', \'Incoming\', \'\', \'Client\');">'+catArr.Client.Responded+'</span>' : 0);
    $("#incPurposeConsultantRespondedCard").html((consultantRespondedCard != 0) ? '<span class="clickableCard" onclick="openListCorrResponded(\'Incoming Correspondence\', \'Incoming\', \'\', \'Consultant\');">'+catArr.Consultant.Responded+'</span>' : 0);
    $("#incPurposeContractRespondedCard").html((contractRespondedCard != 0) ? '<span class="clickableCard" onclick="openListCorrResponded(\'Incoming Correspondence\', \'Incoming\', \'\', \'Subcontractor\');">'+catArr.Subcontractor.Responded+'</span>' : 0);
    $("#incPurposeThirdRespondedCard").html((thirdRespondedCard != 0) ? '<span class="clickableCard" onclick="openListCorrResponded(\'Incoming Correspondence\', \'Incoming\', \'\', \'Third Party\');">'+catArr['Third Party'].Responded+'</span>' : 0);

    // pending
    $("#incPurposeClientPendingCard").html((catArr.Client && catArr.Client.Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Client\', \'Pending\');">'+catArr.Client.Pending+'</span>' : 0);
    $("#incPurposeConsultantPendingCard").html((catArr.Consultant && catArr.Consultant.Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Consultant\', \'Pending\');">'+catArr.Consultant.Pending+'</span>' : 0);
    $("#incPurposeContractPendingCard").html((catArr.Subcontractor && catArr.Subcontractor.Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Subcontractor\', \'Pending\');">'+catArr.Subcontractor.Pending+'</span>' : 0);
    $("#incPurposeThirdPendingCard").html((catArr['Third Party'] && catArr['Third Party'].Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Incoming Correspondence\', \'Incoming\', \'\', \'Third Party\', \'Pending\');">'+catArr['Third Party'].Pending+'</span>' : 0);

    // percentage bar
    $('.incPurposeClientPerc').css("width", ((clientRespondedCard/clientTotalCard) * 100) + "%");
    $('.incPurposeConsultantPerc').css("width", ((consultantRespondedCard/consultantTotalCard) * 100) + "%");
    $('.incPurposeContractPerc').css("width", ((contractRespondedCard/contractTotalCard) * 100) + "%");
    $('.incPurposeThirdPerc').css("width", ((thirdRespondedCard/thirdTotalCard) * 100) + "%");

    // to handle if no data
    $('.incPurposeClientPerc').parent().css("opacity", ((clientTotalCard == 0) ? "40%" : "100%"));
    $('.incPurposeConsultantPerc').parent().css("opacity", ((consultantTotalCard == 0) ? "40%" : "100%"));
    $('.incPurposeContractPerc').parent().css("opacity", ((contractTotalCard == 0) ? "40%" : "100%"));
    $('.incPurposeThirdPerc').parent().css("opacity", ((thirdTotalCard == 0) ? "40%" : "100%"));
}

function updateOutCorrCard (catArr, purposeArr){
    var forInfoVal = (purposeArr['Issue for Information'] && purposeArr['Issue for Information'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'Issue for Information\', \'\', \'\');">'+purposeArr['Issue for Information'].total+'</span>' : 0;
    var forCommentVal = (purposeArr['Issue for Comment/Revision'] && purposeArr['Issue for Comment/Revision'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'Issue for Comment/Revision\', \'\', \'\');">'+purposeArr['Issue for Comment/Revision'].total+'</span>' : 0;
    var forApprovalVal = (purposeArr['Issue for Approval'] && purposeArr['Issue for Approval'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'Issue for Approval\', \'\', \'\');">'+purposeArr['Issue for Approval'].total+'</span>' : 0;
    var forOtherReqVal = (purposeArr['Other Request'] && purposeArr['Other Request'].total) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'Other Request\', \'\', \'\');">'+purposeArr['Other Request'].total+'</span>' : 0;

    $("#outForInfoCard").html(forInfoVal);
    $("#outCommentRevCard").html(forCommentVal);
    $("#outForApprovalCard").html(forApprovalVal);
    $("#outOtherReqCard").html(forOtherReqVal);
    
    // total
    var clientTotalCard = (catArr.Client && catArr.Client.total) ? catArr.Client.total : 0;
    var consultantTotalCard = (catArr.Consultant && catArr.Consultant.total) ? catArr.Consultant.total : 0;
    var contractTotalCard = (catArr.Subcontractor && catArr.Subcontractor.total) ? catArr.Subcontractor.total: 0;
    var thirdTotalCard = (catArr['Third Party'] && catArr['Third Party'].total) ? catArr['Third Party'].total : 0;    

    $("#outPurposeClientTotalCard").html((clientTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Client\', \'\');">'+catArr.Client.total+'</span>' : 0);
    $("#outPurposeConsultantTotalCard").html((consultantTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Consultant\', \'\');">'+catArr.Consultant.total+'</span>' : 0);
    $("#outPurposeContractTotalCard").html((contractTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Subcontractor\', \'\');">'+catArr.Subcontractor.total+'</span>' : 0);
    $("#outPurposeThirdTotalCard").html((thirdTotalCard != 0) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Third Party\', \'\');">'+catArr['Third Party'].total+'</span>' : 0);
    
    // responded
    var clientRespondedCard = (catArr.Client && catArr.Client.Responded) ? catArr.Client.Responded : 0;
    var consultantRespondedCard = (catArr.Consultant && catArr.Consultant.Responded) ? catArr.Consultant.Responded : 0;
    var contractRespondedCard = (catArr.Subcontractor && catArr.Subcontractor.Responded) ? catArr.Subcontractor.Responded : 0;
    var thirdRespondedCard = (catArr['Third Party'] && catArr['Third Party'].Responded) ? catArr['Third Party'].Responded : 0;

    $("#outPurposeClientRespondedCard").html((clientRespondedCard != 0) ? '<span class="clickableCard" onclick="openListCorrResponded(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Client\');">'+catArr.Client.Responded+'</span>' : 0);
    $("#outPurposeConsultantRespondedCard").html((consultantRespondedCard != 0)? '<span class="clickableCard" onclick="openListCorrResponded(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Consultant\');">'+catArr.Consultant.Responded+'</span>' : 0);
    $("#outPurposeContractRespondedCard").html((contractRespondedCard != 0 ) ? '<span class="clickableCard" onclick="openListCorrResponded(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Subcontractor\');">'+catArr.Subcontractor.Responded+'</span>' : 0);
    $("#outPurposeThirdRespondedCard").html((thirdRespondedCard != 0) ? '<span class="clickableCard" onclick="openListCorrResponded(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Third Party\');">'+catArr['Third Party'].Responded+'</span>' : 0);

    //pending
    $("#outPurposeClientPendingCard").html((catArr.Client && catArr.Client.Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Client\', \'Pending\');">'+catArr.Client.Pending+'</span>' : 0);
    $("#outPurposeConsultantPendingCard").html((catArr.Consultant && catArr.Consultant.Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Consultant\', \'Pending\');">'+catArr.Consultant.Pending+'</span>' : 0);
    $("#outPurposeContractPendingCard").html((catArr.Subcontractor && catArr.Subcontractor.Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Subcontractor\', \'Pending\');">'+catArr.Subcontractor.Pending+'</span>' : 0);
    $("#outPurposeThirdPendingCard").html((catArr['Third Party'] && catArr['Third Party'].Pending) ? '<span class="clickableCard" onclick="openListCorr(\'Outgoing Correspondence\', \'Outgoing\', \'\', \'Third Party\', \'Pending\');">'+catArr['Third Party'].Pending+'</span>' : 0);
   
    // percentage bar
    $('.outPurposeClientPerc').css("width", ((clientRespondedCard/clientTotalCard) * 100) + "%");
    $('.outPurposeConsultantPerc').css("width", ((consultantRespondedCard/consultantTotalCard) * 100) + "%");
    $('.outPurposeContractPerc').css("width", ((contractRespondedCard/contractTotalCard) * 100) + "%");
    $('.outPurposeThirdPerc').css("width", ((thirdRespondedCard/thirdTotalCard) * 100) + "%");

    // to handle if no data
    $('.outPurposeClientPerc').parent().css("opacity", ((clientTotalCard == 0) ? "40%" : "100%"));
    $('.outPurposeConsultantPerc').parent().css("opacity", ((consultantTotalCard == 0) ? "40%" : "100%"));
    $('.outPurposeContractPerc').parent().css("opacity", ((contractTotalCard == 0) ? "40%" : "100%"));
    $('.outPurposeThirdPerc').parent().css("opacity", ((thirdTotalCard == 0) ? "40%" : "100%"));
}

function updateDocProjectInfoCard(data){
    $('#clientCard').html((data.client) ? data.client : 'N/A');
    $('#smeCard').html((data.sme) ? data.sme : 'N/A');
}

function refreshInformation(selWPC = 'overall'){
    // incoming
    var incData = (docData.corr && docData.corr[selWPC] && docData.corr[selWPC].Incoming) ? docData.corr[selWPC].Incoming : [];

    var incDataType = (incData.byType) ? incData.byType : [];
    var incDataTotal = (incData.raw) ? incData.raw.length : 0;
    
    drawCorrTypeChart('incCorrTypeChart', incDataType, incDataTotal);
    
    var incTable = (incData.table);
    updateIncCorrTable(incTable);
    
    var incDataCat = (incData.byCategory) ? incData.byCategory : [];
    var incDataPurpose = (incData.byPurpose) ? incData.byPurpose : [];
    updateIncCorrCard(incDataCat, incDataPurpose);

    // outgoing
    var outData = (docData.corr && docData.corr[selWPC] && docData.corr[selWPC].Outgoing) ? docData.corr[selWPC].Outgoing : [];

    var outDataType = (outData.byType) ? outData.byType : [];
    var outDataTotal = (outData.raw) ? outData.raw.length : 0;
    
    drawCorrTypeChart('outCorrTypeChart', outDataType, outDataTotal);
    
    var outTable = (outData.table);
    updateOutCorrTable(outTable);
    
    var outDataCat = (outData.byCategory) ? outData.byCategory : [];
    var outDataPurpose = (outData.byPurpose) ? outData.byPurpose : [];
    updateOutCorrCard(outDataCat, outDataPurpose);

    // document
    var docTypeChart = (docData.doc && docData.doc[selWPC] && docData.doc[selWPC].byType) ?  docData.doc[selWPC].byType : [];
    drawDocTypeChart(docTypeChart)
    
    var docTotal = (docData.doc && docData.doc[selWPC] && docData.doc[selWPC].total) ?  docData.doc[selWPC].total : 0;
    updateDocCard(docTotal);

    var docProjInfo = (docData.docProjInfo && docData.docProjInfo[selWPC]) ? docData.docProjInfo[selWPC] : [];
    updateDocProjectInfoCard(docProjInfo);
}

function refreshDashboard (){
    var selWPC = $('#wpcFilter').val();
    refreshInformation(selWPC);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    refreshInformation(wpc);
}

$(function (){
	// load all the chart
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "document"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                docData = obj.data;
                refreshInformation();                
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})