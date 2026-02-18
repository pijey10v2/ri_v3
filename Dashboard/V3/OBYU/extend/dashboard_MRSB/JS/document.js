var docData;


function drawIncCorrTypeChart(data) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = {name: idx, y: ((ele.val) ? ele.val : 0), allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }
    // incCorrTypeChart
    var chart = Highcharts.chart('incCorrTypeChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>INCOMING CORRESPONDENCE</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            },
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
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>INCOMING CORRESPONDENCE</span>'
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>INCOMING CORRESPONDENCE</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        legend: {
            itemStyle: {
                fontSize: '9px',
                fontWeight : 'normal'
            },
            labelFormatter: function () {
                return this.name.length > 25 ? [...this.name].splice(0, 25).join('') + '...' : this.name
            }
        },
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
            name: 'Total',
            innerSize: '40%',
            data: dataArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var correspondence_type = (allDataArr.correspondence_type) ? allDataArr.correspondence_type : '';
                    var section = (allDataArr.section) ? allDataArr.section : '';
                    var type = (allDataArr.type) ? allDataArr.type : '';

                    var linkParamArr = processFilterParamArr([type, section, '', '', correspondence_type]);
                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DOC", 'document_dash_corr_all', linkParamArr, 'Incoming Correspondence');
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

function drawOutCorrTypeChart(data) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = {name: idx, y: ((ele.val) ? ele.val : 0), allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }
    // outCorrTypeChart
    var chart = Highcharts.chart('outCorrTypeChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>OUTGOING CORRESPONDENCE</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            },
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
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>OUTGOING CORRESPONDENCE</span>'
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>OUTGOING CORRESPONDENCE</span>'
        },
        legend: {
            itemStyle: {
                fontSize: '9px',
                fontWeight : 'normal'
            },
            labelFormatter: function () {
                return this.name.length > 25 ? [...this.name].splice(0, 25).join('') + '...' : this.name
            }
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
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '40%',
            data: dataArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var correspondence_type = (allDataArr.correspondence_type) ? allDataArr.correspondence_type : '';
                    var section = (allDataArr.section) ? allDataArr.section : '';
                    var type = (allDataArr.type) ? allDataArr.type : '';

                    var linkParamArr = processFilterParamArr([type, section, '', '', correspondence_type]);
                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DOC", 'document_dash_corr_all', linkParamArr, 'Outgoing Correspondence');
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
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = {name: idx, y: (ele.val) ? ele.val : 0, allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }
    // docTypeChart
    var chart = Highcharts.chart('docTypeChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>DOCUMENT TYPE</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            },
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
                showInLegend: true
            }
        },
        legend: {
            itemStyle: {
                fontSize: '9px',
                fontWeight : 'normal'
            },
            labelFormatter: function () {
                return this.name.length > 25 ? [...this.name].splice(0, 25).join('') + '...' : this.name
            }
        },
        series: [{
            colorByPoint: true,
            name: 'No. of Document',
            data: dataArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var docType = (allDataArr.document_type) ? allDataArr.document_type : '';
                    var docSection = (allDataArr.section) ? allDataArr.section : '';
                    var linkParamArr = processFilterParamArr([docType, docSection, '', '']);
                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DOC", 'document_dash_doc_all', linkParamArr, 'Document Type');
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

function drawDocDrawingRevChart(data, secId){
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            var tempArr = { name: idx, y: (ele.cnt) ? ele.cnt : 0, allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }

    var chart = Highcharts.chart('docDrawingRevChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>DRAWING REVISION</span>'
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
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DRAWING REVISION</span>'
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DRAWING REVISION</span>'
        },
        xAxis: {
            categories: catArr
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
            name: 'No of Document',
            data: dataArr,
            showInLegend: false,
            color: Highcharts.getOptions().colors[0],
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var drawingType = (allDataArr.drawing_type) ? allDataArr.drawing_type : '';
                    // var docSection = (allDataArr.section) ? allDataArr.section : '';
                    var docSection = (secId != 'overall') ? secId : '';
                    var linkParamArr = processFilterParamArr(['Drawing', docSection, drawingType, '']);

                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            if(event.point.category == 'Revised'){
                                window.parent.widgetConopOpen("DOC", 'document_dash_doc_rev', linkParamArr, 'Drawing Type');
                            }else{
                                window.parent.widgetConopOpen("DOC", 'document_dash_doc_all', linkParamArr, 'Drawing Type');
                            }
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

function drawDocDrawingTypeChart(data){
    var catArr = [];
    var dataArr = [];

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            var tempArr = {y: (ele.val) ? ele.val : 0, allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }

    var chart = Highcharts.chart('docDrawingTypeChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>DRAWING TYPE</span>'
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
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DRAWING TYPE</span>'
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DRAWING TYPE</span>'
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
            colorByPoint: true,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var drawingType = event.point.category;
                    var docSection = (allDataArr.section) ? allDataArr.section : '';
                    var linkParamArr = processFilterParamArr(['Drawing', docSection, drawingType, '']);
                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DOC", 'document_dash_doc_all', linkParamArr, 'Drawing Type');
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

function drawDocDrawingDisciplineChart(data){
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            var tempArr = {y: (ele.val) ? ele.val : 0, allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }

    var chart = Highcharts.chart('docDrawingDisChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Document Management<br>'+localStorage.p_name+'<br>DRAWING DISCIPLINE</span>'
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
                            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DRAWING DISCIPLINE</span>'
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
            text: '<span class="showLabel">Document Management<br>'+localStorage.p_name+'<br>DRAWING DISCIPLINE</span>'
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
            colorByPoint: true,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var docType = (allDataArr.document_type) ? allDataArr.document_type : '';
                    var docSection = (allDataArr.section) ? allDataArr.section : '';
                    var docDiscipline = (allDataArr.discipline) ? allDataArr.discipline : '';
                    var linkParamArr = processFilterParamArr([docType, docSection, '', docDiscipline]);
                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
                            window.parent.widgetConopOpen("DOC", 'document_dash_doc_all', linkParamArr, 'Drawing Discipline');
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

function updateCarNcrTable(data, divid, allData){
    var documentType = (allData.document_type) ? allData.document_type : '';
    var documentsection = (allData.section) ? allData.section : '';
    var cardName = '';

    if (!$("#"+divid)) return;

    if(divid == 'carTbBody'){
        cardName = 'CAR'
    }
    else{
        cardName = 'NCR'
    }

    let html = '';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            html += '<tr onclick="openListDocument(\'' + cardName + '\', \'' + documentType + '\', \'' + documentsection + '\', \'\', \'\', \'document_dash_doc_all\');">'
            html += '<td>'+((ele.ref_no) ? ele.ref_no : 'N/A')+'</td>'
            html += '<td>'+((ele.document_date) ? ele.document_date : 'N/A')+'</td>'
            html += '<td>'+((ele.due_date) ? ele.due_date : 'N/A')+'</td>'
            html += '<td>'+ele.aging+'</td>'
            html += '</tr>';

        }
    }
    $("#"+divid).html(html);   
}

function updateCardVal(val, divid, data) {
    if (!$("#"+divid)) return;

    var documentType = (data.document_type) ? data.document_type : '';
    var documentsection = (data.section) ? data.section : '';
    var cardName = '';

    switch (divid) {
        case 'corrTotalCard':
            cardName = 'Total Correspondence';
            val = (val) ? '<span class="clickableCard" onclick="openListCorrespondence(\'' + cardName + '\', \'' + documentType + '\', \'' + documentsection + '\', \'\', \'\', \'document_dash_corr_all\');">'+val+'</span>' : 0;
            break;
        case 'docTotalCard':
            cardName = 'Total Document';
            url = 'document_dash_doc_all';
            val = (val) ? '<span class="clickableCard" onclick="openListDocument(\'' + cardName + '\', \'' + documentType + '\', \'' + documentsection + '\', \'\', \'\', \'' + url + '\');">'+val+'</span>' : 0;
            break;
        case 'docTotalCarCard':
            cardName = 'Total CAR';
            url = 'document_dash_doc_all';
            val = (val) ? '<span class="clickableCard" onclick="openListDocument(\'' + cardName + '\', \'' + documentType + '\', \'' + documentsection + '\', \'\', \'\', \'' + url + '\');">'+val+'</span>' : 0;
            break;
        case 'docTotalNcrCard':
            cardName = 'Total NCR';
            url = 'document_dash_doc_all';
            val = (val) ? '<span class="clickableCard" onclick="openListDocument(\'' + cardName + '\', \'' + documentType + '\', \'' + documentsection + '\', \'\', \'\', \'' + url + '\');">'+val+'</span>' : 0;
            break;
        default:
            break;
    }
    
    $("#"+divid).html(val);   
}

function updateIncCorrCard (data){
    var allData = (data.allData) ? data.allData : [];
    var sectionCorr = (allData.section) ? allData.section : '';
    var incomingCorr = (allData.type) ? allData.type : '';

    var corrTtl = (data.total) ? '<span class="clickableCard" onclick="openListCorrespondence(\'Incoming Correspondence - Total\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'\', \'\', \'document_dash_corr_all\')">'+data.total+'</span>' : 0;
    $('#corrIncTtlCard').html(corrTtl);
    
    var corrInfo = (data["forInfo"]) ? data["forInfo"] : [];
    var allDataInfo = (corrInfo.allData) ? corrInfo.allData : [];
    var purposeInfo = (allDataInfo.purpose) ? allDataInfo.purpose : '';

    var corrRespond = (data["toRespond"]) ? data["toRespond"] : [];

    var corrInfoTotal = (corrInfo.total) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - For Info\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo\')">'+corrInfo.total+'</span>' : 0;
    var corrRespondTotal = (corrRespond.total) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - To Respond\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond\')">'+corrRespond.total+'</span>' : 0;
    $('#corrIncInfoCard').html(corrInfoTotal);
    $('#corrIncRespondCard').html(corrRespondTotal);

    var allDataForInfoResponded = (corrInfo.Responded && corrInfo.Responded.allData) ? corrInfo.Responded.allData : [];
    var statusRespondedInfo = (allDataForInfoResponded.status) ? allDataForInfoResponded.status : '';

    var corrInfoOpen = (corrInfo.Pending && corrInfo.Pending.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - Pending\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo_pending\')">'+corrInfo.Pending.val+'</span>' : 0;
    var corrInfoClosed = (corrInfo.Closed && corrInfo.Closed.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - Closed\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo_closed\')">'+corrInfo.Closed.val+'</span>' : 0;
    var corrInfoResponded = (corrInfo.Responded && corrInfo.Responded.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - Responded\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo_respond\')">'+corrInfo.Responded.val+'</span>' : 0;
    $('#corrIncInfoRespondedCard').html(corrInfoResponded);
    $('#corrIncInfoTotalCard').html(corrInfoTotal);
    $('#corrIncInfoPendingCard').html(corrInfoOpen);

    var allDataResponded = (corrRespond.Responded && corrRespond.Responded.allData) ? corrRespond.Responded.allData : [];
    var statusResponded = (allDataResponded.status) ? allDataResponded.status : '';

    var corrRespondOpen = (corrRespond.Pending && corrRespond.Pending.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - Pending\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond_pending\')">'+corrRespond.Pending.val+'</span>' : 0;
    var corrResponded = (corrRespond.Responded && corrRespond.Responded.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - Responded\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond_respond\')">'+corrRespond.Responded.val+'</span>' : 0;
    var corrRespondClosed = (corrRespond.Closed && corrRespond.Closed.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Incoming Correspondence - Closed\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond_closed\')">'+corrRespond.Closed.val+'</span>' : 0;
    $('#corrIncRespondCardResponded').html(corrResponded);
    $('#corrIncRespondTotalCard').html(corrRespondTotal);
    $('#corrIncRespondPendingCard').html(corrRespondOpen);

    // percentage bar
    var corrInfoTotal2 = (corrInfo.total) ? corrInfo.total : 0;
    var corrRespondTotal2 = (corrRespond.total) ? corrRespond.total : 0;
    
    var corrInfoClosed2 = (corrInfo.Pending && corrInfo.Pending.val) ? corrInfo.Pending.val : 0;
    var corrInfoOpen2 = (corrInfo.Responded && corrInfo.Responded.val) ? corrInfo.Responded.val : 0;
    //IF NO VALUE FOR PENDING, JUST USED RESPONDED VALUE
    // var valueUsedCorrInfo = (corrInfoClosed2 != 0) ? corrInfoClosed2 : corrInfoOpen2;
    var valueUsedCorrInfo = (corrInfoOpen2 != 0) ? corrInfoOpen2 : corrInfoClosed2;

    var corrRespondClosed2 = (corrRespond.Pending && corrRespond.Pending.val) ? corrRespond.Pending.val : 0;
    var corrRespondOpen2 = (corrRespond.Responded && corrRespond.Responded.val) ? corrRespond.Responded.val : 0;
    //IF NO VALUE FOR PENDING, JUST USED RESPONDED VALUE
    // var valueUsedCorrRespond = (corrRespondClosed2 != 0) ? corrRespondClosed2 : corrRespondOpen2;
    var valueUsedCorrRespond = (corrRespondOpen2 != 0) ? corrRespondOpen2 : corrRespondClosed2;

    $('.incForInfo').css("width", ((corrInfoTotal2) ? ((valueUsedCorrInfo/corrInfoTotal2) * 100) : 0) + "%");
    $('.incToRespond').css("width", ((corrRespondTotal2) ? ((valueUsedCorrRespond/corrRespondTotal2) * 100) : 0) + "%");

    // to handle if no data
    $('.incForInfo').parent().css("opacity", ((corrInfoTotal == 0) ? "40%" : "100%"));
    $('.incToRespond').parent().css("opacity", ((corrRespondTotal == 0) ? "40%" : "100%"));
}

function updateOutCorrCard (data){
    var allData = (data.allData) ? data.allData : [];
    var sectionCorr = (allData.section) ? allData.section : '';
    var incomingCorr = (allData.type) ? allData.type : '';

    var corrTtl = (data.total) ? '<span class="clickableCard" onclick="openListCorrespondence(\'Outgoing Correspondence - Total\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'\', \'\', \'document_dash_corr_all\')">'+data.total+'</span>' : 0;
    $('#corrOutTtlCard').html(corrTtl);
    
    var corrInfo = (data["forInfo"]) ? data["forInfo"] : [];
    var corrRespond = (data["toRespond"]) ? data["toRespond"] : [];

    var corrInfoTotal = (corrInfo.total) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - For Info\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo\')">'+corrInfo.total+'</span>' : 0;
    var corrRespondTotal = (corrRespond.total) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - To Respond\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond\')">'+corrRespond.total+'</span>' : 0;
    $('#corrOutInfoCard').html(corrInfoTotal);
    $('#corrOutRespondCard').html(corrRespondTotal);

    var corrInfoPending = (corrInfo.Pending && corrInfo.Pending.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - Pending\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo_pending\')">'+corrInfo.Pending.val+'</span>' : 0;
    var corrInfoRespond = (corrInfo.Responded && corrInfo.Responded.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - Responded\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo_respond\')">'+corrInfo.Responded.val+'</span>' : 0;
    var corrInfoClosed = (corrInfo.Closed && corrInfo.Closed.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - Closed\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_forInfo_closed\')">'+corrInfo.Closed.val+'</span>' : 0;
    $('#corrOutInfoRespondedCard').html(corrInfoRespond);
    $('#corrOutInfoClosedCard').html(corrInfoClosed);
    $('#corrOutInfoPendingCard').html(corrInfoPending);

    var corrRespondPending = (corrRespond.Pending && corrRespond.Pending.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - Pending\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond_pending\')">'+corrRespond.Pending.val+'</span>' : 0;
    var corrResponded = (corrRespond.Responded && corrRespond.Responded.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - Responded\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond_respond\')">'+corrRespond.Responded.val+'</span>' : 0;
    var corrRespondClosed = (corrRespond.Closed && corrRespond.Closed.val) ? '<span class="clickableCard" onclick="openListCorrespondencePurpose(\'Outgoing Correspondence - Closed\', \'' + incomingCorr + '\', \'' + sectionCorr + '\', \'document_dash_corr_all_toRespond_closed\')">'+corrRespond.Closed.val+'</span>' : 0;
    $('#corrOutRespondCardResponded').html(corrResponded);
    $('#corrOutRespondClosedCard').html(corrRespondClosed);
    $('#corrOutRespondPendingCard').html(corrRespondPending);

    // percentage bar
    var corrInfoTotal2 = (corrInfo.total) ? corrInfo.total : 0;
    var corrRespondTotal2 = (corrRespond.total) ? corrRespond.total : 0;

    var corrInfoClosed2 = (corrInfo.Pending && corrInfo.Pending.val) ? corrInfo.Pending.val : 0;
    var corrInfoOpen2 = (corrInfo.Responded && corrInfo.Responded.val) ? corrInfo.Responded.val : 0;
    //IF NO VALUE FOR PENDING, JUST USED RESPONDED VALUE
    var valueUsedCorrInfo = (corrInfoClosed2 != 0) ? corrInfoClosed2 : corrInfoOpen2;

    var corrRespondClosed2 = (corrRespond.Pending && corrRespond.Pending.val) ? corrRespond.Pending.val : 0;
    var corrRespondOpen2 = (corrRespond.Responded && corrRespond.Responded.val) ? corrRespond.Responded.val : 0;
    //IF NO VALUE FOR PENDING, JUST USED RESPONDED VALUE
    var valueUsedCorrRespond = (corrRespondClosed2 != 0) ? corrRespondClosed2 : corrRespondOpen2;

    $('.outForInfo').css("width", ((corrInfoTotal2) ? ((valueUsedCorrInfo/corrInfoTotal2) * 100) : 0) + "%");
    $('.outToRespond').css("width", ((corrRespondTotal2) ? ((valueUsedCorrRespond/corrRespondTotal2) * 100) : 0) + "%");

    // to handle if no data
    $('.outForInfo').parent().css("opacity", ((corrInfoTotal == 0) ? "40%" : "100%"));
    $('.outToRespond').parent().css("opacity", ((corrRespondTotal == 0) ? "40%" : "100%"));
}

function openListDocument(cardName, docType, docSection, drawingType, discipline, url){
    var linkParamArr = processFilterParamArr([docType, docSection, drawingType, discipline]);
    if(localStorage.ui_pref == "ri_v3"){
        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
            window.parent.widgetConopOpen("DOC", url, linkParamArr, cardName);
        }
        else{
            return;
        }
    }
}

function openListCorrespondence(cardName, corrType, corrSection, corrPurpose, corrStatus, url){
    var linkParamArr = processFilterParamArr([corrType, corrSection, corrPurpose, corrStatus, '']);
    if(localStorage.ui_pref == "ri_v3"){
        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
            window.parent.widgetConopOpen("DOC", url, linkParamArr, cardName);
        }
        else{
            return;
        }
    }
}

function openListCorrespondencePurpose(cardName, corrType, corrSection, url){
    var linkParamArr = processFilterParamArr([corrType, corrSection, '']);
    if(localStorage.ui_pref == "ri_v3"){
        if(localStorage.usr_role == 'Doc Controller' || localStorage.usr_role == 'Director'){
            window.parent.widgetConopOpen("DOC", url, linkParamArr, cardName);
        }
        else{
            return;
        }
    }
}

function refreshInformation (projid = 'overall', sectionid = 'overall'){
    
    var corrData = (docData.corr && docData.corr[projid] && docData.corr[projid][sectionid]) ? docData.corr[projid][sectionid] : [];
    var corrTtl = (corrData.cnt && corrData.cnt.total) ? corrData.cnt.total : 0;
    var corrTtlAllData = (corrData.cnt && corrData.cnt.allData) ? corrData.cnt.allData : [];
    updateCardVal(corrTtl, 'corrTotalCard', corrTtlAllData);

    var corrIncData = (corrData.Incoming) ? corrData.Incoming : [];
    var corrIncPurposeData = (corrIncData.byPurpose) ? corrIncData.byPurpose : [];
    updateIncCorrCard(corrIncPurposeData);
    var corrIncTypeData = (corrIncData.byType) ? corrIncData.byType : [];
    drawIncCorrTypeChart(corrIncTypeData);

    var corrOutData = (corrData.Outgoing) ? corrData.Outgoing : [];
    var corrOutPurposeData = (corrOutData.byPurpose) ? corrOutData.byPurpose : [];
    updateOutCorrCard(corrOutPurposeData);
    var corrOutTypeData = (corrOutData.byType) ? corrOutData.byType : [];
    drawOutCorrTypeChart(corrOutTypeData);
    
    var documentData = (docData.doc && docData.doc[projid] && docData.doc[projid][sectionid]) ? docData.doc[projid][sectionid] : [];
    var docTypeData = (documentData.byType) ? documentData.byType : [];
    drawDocTypeChart(docTypeData);

    var drawData = (documentData.drawing) ? documentData.drawing : [];
    var drawTypeData = (drawData.byType) ? drawData.byType : [];
    drawDocDrawingTypeChart(drawTypeData);
    var drawDisciplineData = (drawData.byDiscipline) ? drawData.byDiscipline : [];
    drawDocDrawingDisciplineChart(drawDisciplineData);
    var drawTtlData = (drawData.revisedTotal) ? drawData.revisedTotal : []; 
    drawDocDrawingRevChart(drawTtlData, sectionid);

    var docTtl = (documentData.count && documentData.count.all) ? documentData.count.all : 0;
    var docTtlAllData = (documentData.count && documentData.count.allData) ? documentData.count.allData : [];

    var carTtl = (documentData.car && documentData.car.cnt && documentData.car.cnt.total) ? documentData.car.cnt.total : 0;
    var carTtlAllData = (documentData.car && documentData.car.cnt && documentData.car.cnt.allData) ? documentData.car.cnt.allData : 0;

    var ncrTtl = (documentData.ncr && documentData.ncr.cnt && documentData.ncr.cnt.total) ? documentData.ncr.cnt.total : 0;
    var ncrTtlAllData = (documentData.ncr && documentData.ncr.cnt && documentData.ncr.cnt.allData) ? documentData.ncr.cnt.allData : 0;

    updateCardVal(docTtl, 'docTotalCard', docTtlAllData);
    updateCardVal(carTtl, 'docTotalCarCard', carTtlAllData);
    updateCardVal(ncrTtl, 'docTotalNcrCard', ncrTtlAllData);

    var carData = (documentData.car && documentData.car.raw) ? documentData.car.raw : [];
    var carDataAll = (documentData.car && documentData.car.allData) ? documentData.car.allData : [];
    updateCarNcrTable(carData, "carTbBody", carDataAll);
    var ncrData = (documentData.ncr && documentData.ncr.raw) ? documentData.ncr.raw : [];
    var ncrDataAll = (documentData.ncr && documentData.ncr.allData) ? documentData.ncr.allData : [];
    updateCarNcrTable(ncrData, "ncrTbBody", ncrDataAll);
}

function populateSectionFilter(data){
    var optHTML = '<option selected="true" value="overall">- Choose Section -</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="'+ele+'">'+ele+'</option>';
        }
    }
    $('#sectionFilter').html(optHTML);
}

function refreshDashboard (){
    var selWPC = $("#wpcFilter").val();
    var selSection = $("#sectionFilter").val();
    refreshInformation(selWPC, selSection);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var section = filterArr.section;
  
    refreshInformation(wpc, section);
}

$(function (){
    // setTimeout(function() { $("#minimizeButton").click(); }, 1000);
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

                var secData = (docData.sectionFilter && docData.sectionFilter['overall']) ?  docData.sectionFilter['overall'] : [];
                populateSectionFilter(secData);
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });

    $("#wpcFilter").change(function(){
        var secData = (docData.sectionFilter && docData.sectionFilter[$(this).val()]) ?  docData.sectionFilter[$(this).val()] : [];
        populateSectionFilter(secData);       
    })
})