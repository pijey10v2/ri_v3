var docData;
var wpc = '';
var monthFulltext = {
    "01" :"JANUARY",
    "02" :"FEBRUARY",
    "03" :"MARCH",
    "04" :"APRIL",
    "05" :"MAY",
    "06" :"JUNE",
    "07" :"JULY",
    "08" :"AUGUST",
    "09" :"SEPTEMBER",
    "10" :"OCTOBER",
    "11" :"NOVEMBER",
    "12" :"DECEMBER",
};
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function getDocumentCutOff(){
    var dateFrom = '';
    var dateTo = '';
    var selYr = '';
    var selMth = '';
    
    window.parent.getFilterForDashboard(); 
    if(filterForListDashboard){
        selYr = filterForListDashboard.year;
        selMth = filterForListDashboard.month;
    }

    if(selYr != 'all'){
        var cutoffDay = parseInt($("#cutOff-day").text());
        if(selMth == 'all'){
            let docCutOff = parseInt(docData.packageCutOffDay[wpc]);
            dateFrom = (docCutOff+1)+'-12-'+(selYr-1);
            dateTo = docCutOff+'-12-'+selYr;
        }else{
            var selMthNo = textMonthtoNum[selMth]
            var dateFromM = selMthNo - 1;
            var dateFromD = cutoffDay + 1;
            dateFrom = dateFromD+'-'+dateFromM+'-'+selYr;
            dateTo = cutoffDay+'-'+selMthNo+'-'+selYr;
        }
    }

    return {dateFrom : dateFrom, dateTo: dateTo}
}

function conOpLink(process='', status='', receiver=''){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchilter = getDocumentCutOff();
    var cardName;

    var othr_status = '';
    if(status == 'Closed'){
        othr_status = 'Responded';
    }else if(status == 'Responded'){
        othr_status = 'Closed';
    }else if(status == 'Pending'){
        othr_status = 'To Respond';
    }

    linkWinTitle = 'Document'
    linkName = 'document_corr_list_card'
    linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, process, receiver, status, othr_status])
    cardName = process;

    if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
        window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
    }
    else{
        return;
    }

}

function drawArchStorageChart(data, monthYear){
    var threeY = 0;
    var sevenY = 0;
    var blue;
    var orange;
    if (data) {
        threeY = (data['3']) ? data['3'] : 0;
        sevenY = (data['7']) ? data['7'] : 0;
    }

    if(localStorage.ui_pref == "ri_v3"){
        blue = Highcharts.getOptions().colors[11];
        orange = Highcharts.getOptions().colors[5];
    }else{
        blue = '#7cb5ec';
        orange = 'orange';
    }

    var chart = Highcharts.chart('archStorageChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>DOCUMENT ARCHIVING AND STORAGE ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DOCUMENT ARCHIVING AND STORAGE ('+monthYear+')</span>'
                          }
                        })
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DOCUMENT ARCHIVING AND STORAGE ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
                colors : [blue, orange]
            }
        },
        series: [{
            colorByPoint: true,
            name: 'No. of Document',
            innerSize: '75%',
            data: [{
                name: '3 Years',
                y: threeY
            }, {
                name: '7 Years',
                y: sevenY
            }],
            events: {
                click: function (event) {
                    if(localStorage.ui_pref == 'ri_v3'){
                        var dateFilter = getDocumentCutOff();
    
                        var years = event.point.name.replace(' Years','');
                        var dateFrom = '';
                        var dateTo = '';
                        if(dateFilter.dateFrom){
                            dateFrom = dateFilter.dateFrom.replaceAll('-', '/');
                            dateTo = dateFilter.dateTo.replaceAll('-', '/');
                        }
    
                        var linkParamArr = processFilterParamArr([dateFrom, dateTo, years]);

                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("NCR", "document_archived_card", linkParamArr, "Document Archiving and Storage");
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

function drawDrawingCharts(data, divID, monthYear){
    var rev = 0;
    var total = 0;
    var catArr = [];
    var origDataArr = [];
    var revDataArr = [];
    var title;
    var type;
    var color1;
    var color2;

    if (data) {
        if (data.total) {
            rev = (data.total.revised) ? data.total.revised : 0; 
            total = (data.total.all) ? data.total.all : 0; 
        }
        if (data.byTrait) {
            for (const [idx, ele] of Object.entries(data.byTrait)) {
                catArr.push(idx);
                origDataArr.push((ele.original) ? ele.original : 0);
                revDataArr.push((ele.revised) ? ele.revised : 0);
            }
        }
    } 

    if(divID == "asBuiltDrawingChart"){
        title = "AS-BUILT DRAWING"
        type = "As-Built Drawing"
    }else if(divID == "constructDrawingChart"){
        title = "CONSTRUCTION DRAWING"
        type = "Construction Drawing"
    }else if(divID == "redLineDrawingChart"){
        title = "RED LINE MARK-UP"
        type = "Red Line Mark-Up"
    }else if(divID == "shopDrawingChart"){
        title = "SHOP DRAWING"
        type = "Shop Drawing"
    }

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[0];
        color2 = Highcharts.getOptions().colors[5];
    }else{
        color1 = Highcharts.getOptions().colors[0];
        color2 = Highcharts.getOptions().colors[1];
    }

    // asBuiltDrawingChart
    var chart = Highcharts.chart(divID, {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>'+title+' ('+monthYear+')</span>'
        },
        subtitle: {
            text: '<div style="font-size: 9.5px;">REVISION : '+rev+' SHEETS</div><div style="font-size: 9.5px;">RECEIVED FROM CLIENT: '+total+' SHEETS</div>',
            useHTML : true
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
        tooltip: {
            valueSuffix: ' '
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            itemStyle: {
                fontSize: '11px',
                fontWeight : 'bold'
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Original',
            data: origDataArr,
            color: color1,
            events: {
                click: function (event) {
                    if(localStorage.ui_pref == 'ri_v3'){
                        var dateFilter = getDocumentCutOff();
                        var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, 'original', type, event.point.category]);
                        
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DRAWING", "document_drawing_card", linkParamArr, title);
                        }
                        else{
                            return;
                        }

                    }
                }
            }
        },
        {
            name: 'Revised',
            data: revDataArr,
            color: color2,
            events: {
                click: function (event) {
                    if(localStorage.ui_pref == 'ri_v3'){
                        var dateFilter = getDocumentCutOff();
                        var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, 'revised', type, event.point.category]);

                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DRAWING", "document_drawing_card", linkParamArr, title);
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

function updateIncomingCard(data){
    var total = (data.total) ? data.total : 0;

    var totalCard = `<span class="clickableCard" onclick="conOpLink('Incoming')">`+total+`</span>`;
    $("#incTotal").html(totalCard); 

    var clientTotal = (data.byRecieverSender && data.byRecieverSender.Client && data.byRecieverSender.Client.total) ? data.byRecieverSender.Client.total : 0;
    var clientResponded = (data.byRecieverSender && data.byRecieverSender.Client && data.byRecieverSender.Client.Responded) ? data.byRecieverSender.Client.Responded : 0;
    var clientPending = (data.byRecieverSender && data.byRecieverSender.Client && data.byRecieverSender.Client.Pending) ? data.byRecieverSender.Client.Pending : 0;

    var clientTotalCard = `<span class="clickableCard" onclick="conOpLink('Incoming','', 'Client')">`+clientTotal+`</span>`;
    var clientRespondedCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Closed', 'Client')">`+clientResponded+`</span>`;
    var clientPendingCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Pending', 'Client')">`+clientPending+`</span>`;

    $("#incClientTotal").html(clientTotalCard);
    $("#incClientResponded").html(clientRespondedCard);
    $("#incClientPending").html(clientPendingCard);

    var consultantTotal = (data.byRecieverSender && data.byRecieverSender.Consultant && data.byRecieverSender.Consultant.total) ? data.byRecieverSender.Consultant.total : 0;
    var consultantResponded = (data.byRecieverSender && data.byRecieverSender.Consultant && data.byRecieverSender.Consultant.Responded) ? data.byRecieverSender.Consultant.Responded : 0;
    var consultantPending = (data.byRecieverSender && data.byRecieverSender.Consultant && data.byRecieverSender.Consultant.Pending) ? data.byRecieverSender.Consultant.Pending : 0;

    var consultantTotalCard = `<span class="clickableCard" onclick="conOpLink('Incoming','', 'Consultant')">`+consultantTotal+`</span>`;
    var consultantRespondedCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Closed', 'Consultant')">`+consultantResponded+`</span>`;
    var consultantPendingCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Pending', 'Consultant')">`+consultantPending+`</span>`;
    
    $("#incConsultantTotal").html(consultantTotalCard);
    $("#incConsultantResponded").html(consultantRespondedCard);
    $("#incConsultantPending").html(consultantPendingCard);

    var contractorTotal = (data.byRecieverSender && data.byRecieverSender['Sub-Contractor'] && data.byRecieverSender['Sub-Contractor'].total) ? data.byRecieverSender['Sub-Contractor'].total : 0;
    var contractorResponded = (data.byRecieverSender && data.byRecieverSender['Sub-Contractor'] && data.byRecieverSender['Sub-Contractor'].Responded) ? data.byRecieverSender['Sub-Contractor'].Responded : 0;
    var contractorPending = (data.byRecieverSender && data.byRecieverSender['Sub-Contractor'] && data.byRecieverSender['Sub-Contractor'].Pending) ? data.byRecieverSender['Sub-Contractor'].Pending : 0;
    
    var contractorTotalCard = `<span class="clickableCard" onclick="conOpLink('Incoming','', 'Sub-Contractor')">`+contractorTotal+`</span>`;
    var contractorRespondedCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Closed', 'Sub-Contractor')">`+contractorResponded+`</span>`;
    var contractorPendingCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Pending', 'Sub-Contractor')">`+contractorPending+`</span>`;

    $("#incContractorTotal").html(contractorTotalCard);
    $("#incContractorResponded").html(contractorRespondedCard);
    $("#incContractorPending").html(contractorPendingCard);

    var thirdPartyTotal = (data.byRecieverSender && data.byRecieverSender['Third Party'] && data.byRecieverSender['Third Party'].total) ? data.byRecieverSender['Third Party'].total : 0;
    var thirdPartyResponded = (data.byRecieverSender && data.byRecieverSender['Third Party'] && data.byRecieverSender['Third Party'].Responded) ? data.byRecieverSender['Third Party'].Responded : 0;
    var thirdPartyPending = (data.byRecieverSender && data.byRecieverSender['Third Party'] && data.byRecieverSender['Third Party'].Pending) ? data.byRecieverSender['Third Party'].Pending : 0;
       
    var thirdPartyTotalCard = `<span class="clickableCard" onclick="conOpLink('Incoming','', 'Third Party')">`+thirdPartyTotal+`</span>`;
    var thirdPartyRespondedCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Closed', 'Third Party')">`+thirdPartyResponded+`</span>`;
    var thirdPartyPendingCard = `<span class="clickableCard" onclick="conOpLink('Incoming','Pending', 'Third Party')">`+thirdPartyPending+`</span>`;

    $("#incThirdPartyTotal").html(thirdPartyTotalCard);
    $("#incThirdPartyResponded").html(thirdPartyRespondedCard);
    $("#incThirdPartyPending").html(thirdPartyPendingCard);

    // percentage bar
    $('.clients-perc').css('width', ((clientTotal) ? (clientResponded/clientTotal)*100 : "0") + "%");
    $('.consultants-perc').css('width', ((consultantTotal) ? (consultantResponded/consultantTotal)*100 : "0") + "%");
    $('.contractors-perc').css('width', ((contractorTotal) ? (contractorResponded/contractorTotal)*100 : "0") + "%");
    $('.thirdparty-perc').css('width', ((thirdPartyTotal) ? (thirdPartyResponded/thirdPartyTotal)*100 : "0") + "%");

    // to handle if not data
    $('.clients-perc').parent().css("opacity", ((clientTotal == 0) ? "40%" : "100%"));
    $('.consultants-perc').parent().css("opacity", ((consultantTotal == 0) ? "40%" : "100%"));
    $('.contractors-perc').parent().css("opacity", ((contractorTotal == 0) ? "40%" : "100%"));
    $('.thirdparty-perc').parent().css("opacity", ((thirdPartyTotal == 0) ? "40%" : "100%"));

}

function updateOutgoingCard (data){
    var total = (data.total) ? data.total : 0;

    var totalCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','')">`+total+`</span>`;

    $("#outTotal").html(totalCard); 

    var clientTotal = (data.byRecieverSender && data.byRecieverSender.Client && data.byRecieverSender.Client.total) ? data.byRecieverSender.Client.total : 0;
    var clientResponded = (data.byRecieverSender && data.byRecieverSender.Client && data.byRecieverSender.Client.Responded) ? data.byRecieverSender.Client.Responded : 0;
    var clientPending = (data.byRecieverSender && data.byRecieverSender.Client && data.byRecieverSender.Client.Pending) ? data.byRecieverSender.Client.Pending : 0;

    var clientTotalCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','', 'Client')">`+clientTotal+`</span>`;
    var clientRespondedCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Responded', 'Client')">`+clientResponded+`</span>`;
    var clientPendingCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Pending', 'Client')">`+clientPending+`</span>`;
    
    $("#outClientTotal").html(clientTotalCard);
    $("#outClientResponded").html(clientRespondedCard);
    $("#outClientPending").html(clientPendingCard);

    var consultantTotal = (data.byRecieverSender && data.byRecieverSender.Consultant && data.byRecieverSender.Consultant.total) ? data.byRecieverSender.Consultant.total : 0;
    var consultantResponded = (data.byRecieverSender && data.byRecieverSender.Consultant && data.byRecieverSender.Consultant.Responded) ? data.byRecieverSender.Consultant.Responded : 0;
    var consultantPending = (data.byRecieverSender && data.byRecieverSender.Consultant && data.byRecieverSender.Consultant.Pending) ? data.byRecieverSender.Consultant.Pending : 0;

    var consultantTotalCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','', 'Consultant')">`+consultantTotal+`</span>`;
    var consultantRespondedCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Responded', 'Consultant')">`+consultantResponded+`</span>`;
    var consultantPendingCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Pending', 'Consultant')">`+consultantPending+`</span>`;

    $("#outConsultantTotal").html(consultantTotalCard);
    $("#outConsultantResponded").html(consultantRespondedCard);
    $("#outConsultantPending").html(consultantPendingCard);

    var contractorTotal = (data.byRecieverSender && data.byRecieverSender['Sub-Contractor'] && data.byRecieverSender['Sub-Contractor'].total) ? data.byRecieverSender['Sub-Contractor'].total : 0;
    var contractorResponded = (data.byRecieverSender && data.byRecieverSender['Sub-Contractor'] && data.byRecieverSender['Sub-Contractor'].Responded) ? data.byRecieverSender['Sub-Contractor'].Responded : 0;
    var contractorPending = (data.byRecieverSender && data.byRecieverSender['Sub-Contractor'] && data.byRecieverSender['Sub-Contractor'].Pending) ? data.byRecieverSender['Sub-Contractor'].Pending : 0;
    
    var contractorTotalCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','', 'Sub-Contractor')">`+contractorTotal+`</span>`;
    var contractorRespondedCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Responded', 'Sub-Contractor')">`+contractorResponded+`</span>`;
    var contractorPendingCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Pending', 'Sub-Contractor')">`+contractorPending+`</span>`;

    $("#outContractorTotal").html(contractorTotalCard);
    $("#outContractorResponded").html(contractorRespondedCard);
    $("#outContractorPending").html(contractorPendingCard);

    var thirdPartyTotal = (data.byRecieverSender && data.byRecieverSender['Third Party'] && data.byRecieverSender['Third Party'].total) ? data.byRecieverSender['Third Party'].total : 0;
    var thirdPartyResponded = (data.byRecieverSender && data.byRecieverSender['Third Party'] && data.byRecieverSender['Third Party'].Responded) ? data.byRecieverSender['Third Party'].Responded : 0;
    var thirdPartyPending = (data.byRecieverSender && data.byRecieverSender['Third Party'] && data.byRecieverSender['Third Party'].Pending) ? data.byRecieverSender['Third Party'].Pending : 0;
    
    var thirdPartyTotalCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','', 'Third Party')">`+thirdPartyTotal+`</span>`;
    var thirdPartyRespondedCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Responded', 'Third Party')">`+thirdPartyResponded+`</span>`;
    var thirdPartyPendingCard = `<span class="clickableCard" onclick="conOpLink('Outgoing','Pending', 'Third Party')">`+thirdPartyPending+`</span>`;

    $("#outThirdPartyTotal").html(thirdPartyTotalCard);
    $("#outThirdPartyResponded").html(thirdPartyRespondedCard);
    $("#outThirdPartyPending").html(thirdPartyPendingCard);


    // percentage bar
    $('.out-clients-perc').css('width', ((clientTotal) ? (clientResponded/clientTotal)*100 : "0") + "%");
    $('.out-consultants-perc').css('width', ((consultantTotal) ? (consultantResponded/consultantTotal)*100 : "0") + "%");
    $('.out-contractors-perc').css('width', ((contractorTotal) ? (contractorResponded/contractorTotal)*100 : "0") + "%");
    $('.out-thirdparty-perc').css('width', ((thirdPartyTotal) ? (thirdPartyResponded/thirdPartyTotal)*100 : "0") + "%");

    // to handle if not data
    $('.out-clients-perc').parent().css("opacity", ((clientTotal == 0) ? "40%" : "100%"));
    $('.out-consultants-perc').parent().css("opacity", ((consultantTotal == 0) ? "40%" : "100%"));
    $('.out-contractors-perc').parent().css("opacity", ((contractorTotal == 0) ? "40%" : "100%"));
    $('.out-thirdparty-perc').parent().css("opacity", ((thirdPartyTotal == 0) ? "40%" : "100%"));

}

function updateMailCard(incTtl = 0, outTtl = 0){
    $("#ttlOutMailCard").html(outTtl);
    $("#ttlIncMailCard").html(incTtl);
}

function updateCutOffDateCard(cutOffDate){
    $("#cutOffDate").html(cutOffDate);
}

function refreshDashboard (){
    var selWPC = $('#wpcFilter').val();
    var selYr = $("#yearFilter").val();
    var selMonth = $("#monthFilter").val();
    
    refreshInformation(selWPC, selYr, selMonth);
}


function setCutOffDate(day, year, month){
    if(year == 'all' || month == 'all'){
        $("#cutOff-day").text('');
        $("#cutOff-month").text('');
        $("#cutOff-year").text('');
    }
    else{
        $("#cutOff-day").text(day);
        $("#cutOff-month").text(monthFulltext[month]);
        $("#cutOff-year").text(year);
    }
}

function refreshInformation (proj = 'overall', yr = 'all', mth = 'all'){
    var cutOffDay = parseInt(docData.packageCutOffDay[proj]);
    var dataYearMonth = "Month:" +mth+ " - " + "Year:" +yr;
    setCutOffDate(cutOffDay, yr, mth)

    var drawingDocData = (docData.doc && docData.doc[proj] && docData.doc[proj][yr] && docData.doc[proj][yr][mth] && docData.doc[proj][yr][mth].drawing) ? docData.doc[proj][yr][mth].drawing : [];
    
    // document four drawing charts
    var asBuiltData = (drawingDocData && drawingDocData['as-built drawing']) ? drawingDocData['as-built drawing'] : [];
    drawDrawingCharts(asBuiltData, 'asBuiltDrawingChart');
    var constructionData = (drawingDocData && drawingDocData['construction drawing']) ? drawingDocData['construction drawing'] : [];
    drawDrawingCharts(constructionData, 'constructDrawingChart', dataYearMonth);
    var redLineData = (drawingDocData && drawingDocData['red line mark-up']) ? drawingDocData['red line mark-up'] : [];
    drawDrawingCharts(redLineData, 'redLineDrawingChart');
    var shopData = (drawingDocData && drawingDocData['shop drawing']) ? drawingDocData['shop drawing'] : [];
    drawDrawingCharts(shopData, 'shopDrawingChart');
    var archStorageData = (docData.doc && docData.doc[proj] && docData.doc[proj][yr] && docData.doc[proj][yr][mth] && docData.doc[proj][yr][mth].archiving) ? docData.doc[proj][yr][mth].archiving : [];
    drawArchStorageChart(archStorageData, dataYearMonth);

    var corrData = (docData.corr && docData.corr[proj] && docData.corr[proj][yr] && docData.corr[proj][yr][mth] && docData.corr[proj][yr][mth]) ? docData.corr[proj][yr][mth] : [];
    // incoming and outgoing card
    var incData = (corrData && corrData.Incoming) ?  corrData.Incoming : [];
    updateIncomingCard(incData);
    var outData = (corrData && corrData.Outgoing) ?  corrData.Outgoing : [];
    updateOutgoingCard(outData);

    //card count responded & pending
    var pendingCard = (corrData && corrData.card && corrData.card.Pending) ?  corrData.card.Pending : 0;
    var pendDocCard = `<span class="clickableCard" onclick="conOpLink('','Pending')">`+pendingCard+`</span>`;
    $("#pendDoc").html(pendDocCard);

    var respondedCard = (corrData && corrData.card && corrData.card.Responded) ?  corrData.card.Responded : 0;
    var respDocCard = `<span class="clickableCard" onclick="conOpLink('','Closed')">`+respondedCard+`</span>`;
    $("#respDoc").html(respDocCard);
}

function refreshFromv3 (filterArr){
    wpc = filterArr.wpc;
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
            page: "document"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                docData = obj.data;
                refreshInformation();
                updateCutOffDateCard(docData.cutOffDate);
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });

    $("#yearFilter").change(function(){
        if($(this).val() == ''){
            $("#monthFilter").attr('disabled', true);
            $("#monthFilter").val('overall');
        }else{
            $("#monthFilter").attr('disabled', false);
            refreshDashboard('overall');
        }
    })
})
