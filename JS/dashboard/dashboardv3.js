var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var fontVal;

function refreshAllCharts(){
    if (typeof refreshDashboard === 'function') refreshDashboard();
}

function formatCurrency(val) {
    return parseFloat(val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatThousand(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showLabel(context){
    var targetDivLabel = context.querySelectorAll('.showLabel, .highcharts-data-label-connector, .highcharts-data-label')
    var targetHiddenDivLabel = context.querySelectorAll('.hiddenLabel')
    var targetHiddenDivLabelSmall = context.querySelectorAll('.showLabelSmall')
    var i;
    var r;

    for (i = 0; i < targetDivLabel.length; i++){
        targetDivLabel[i].style.display = "block";
        targetDivLabel[i].style.fontSize = "12px";
        targetDivLabel[i].style.textAlign = "center";
        targetDivLabel[i].parentNode.style.width = "100%";
        targetDivLabel[i].parentNode.style.left = "0";
    }

    for (r = 0; r < targetHiddenDivLabel.length; r++){
        targetHiddenDivLabel[r].style.display = "none"
        targetHiddenDivLabel[r].parentNode.style.textAlign = "center";
    }

    for (j = 0; j < targetHiddenDivLabelSmall.length; j++){
        targetHiddenDivLabelSmall[j].style.display = "block";
        targetHiddenDivLabelSmall[j].style.fontSize = "7px";
    }
}

function hideLabel(context, highchartID){
    var targetDivLabel = context.querySelectorAll('.showLabel, .showLabelSmall, .highcharts-data-label-connector, .highcharts-data-label')
    var targetHiddenDivLabel = context.querySelectorAll('.hiddenLabel')
    var i;
    var r;
    if(localStorage.project_owner == "JKR_SARAWAK" && highchartID == "OverallIncidentsAndAccidentsRecord"){
        var targetTitle = context.querySelectorAll('.showLabel')
        var targetLabel = context.querySelectorAll('.highcharts-data-label-connector, .highcharts-data-label')
        for (i = 0; i < targetTitle.length; i++){
            targetTitle[i].style.display = "none";
        }
        for (i = 0; i < targetLabel.length; i++){
            targetLabel[i].style.display = "block";
        }
    }else{
        for (i = 0; i < targetDivLabel.length; i++){
            targetDivLabel[i].style.display = "none";
        }
    }

    for (r = 0; r < targetHiddenDivLabel.length; r++){
        targetHiddenDivLabel[r].style.display = "block"
    }
}

function launchFullscreen(context){
    if (context.requestFullscreen) { //fullscreen view for chrome
        showLabel(context);
        context.requestFullscreen();
    } else if (context.mozRequestFullScreen) { //fullscreen view for firefox
        showLabel(context);
        context.mozRequestFullScreen();
    } else if (context.webkitRequestFullscreen) { //fullscreen view for safari
        showLabel(context);
        context.webkitRequestFullscreen();
    } else if (context.msRequestFullscreen) { //fullscreen view for microsoft edge
        showLabel(context);
        context.msRequestFullscreen();
    } else {
        context.log("Fullscreen Unavailable");
    }
}

function launchExitFullscreen(context){
    document.exitFullscreen();
    hideLabel(context);
}

function exitHandler(){
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        hideLabel(document);

        window.parent.getIframeID();
    }
}

var monthToNumAr = {"Jan" : '01',"Feb" : '02',"Mar" : '03',"Apr" : '04',"May" : '05',"Jun" : '06',"Jul" : '07',"Aug" : '08',"Sep" : '09',"Oct" : '10',"Nov" : '11',"Dec" : '12'};
function getDateRange( yrId = 'yearFilter', mthId = 'monthFilter') {
    var ret = { dateFrom : '', dateTo : ''};
    if(!$("#"+yrId) || $("#"+yrId).val() == 'all') return ret;

    var yr = $("#"+yrId).val();
    ret.dateFrom = yr+"-01-01";
    ret.dateTo = yr+"-12-31";
    
    if(!$("#"+mthId) || $("#"+mthId).val() == 'all') return ret;

    var mth = $("#"+mthId).val();
    ret.dateFrom = yr+"-"+monthToNumAr[mth]+"-01";
    var t = new Date(yr, monthToNumAr[mth] + 1, 0).getDate();
    ret.dateTo = yr+"-"+monthToNumAr[mth]+"-"+t;

    return ret;
}

function processFilterParamArr(data){
    var selPackageUuid = "";

    if(localStorage.isParent && localStorage.isParent == 'isParent'){
        selPackageUuid = $('#wpcFilter').data('packageuuid');
        if(selPackageUuid == undefined){
            window.parent.getFilterForDashboard(); //to call parent filter because we used iframe
            if(filterForListDashboard){
                selPackageUuid = filterForListDashboard.packageuuid;
                if (selPackageUuid == 'overall' || selPackageUuid == '---' || selPackageUuid == undefined) selPackageUuid = '';
                data.unshift(selPackageUuid);
            }
        }
        else{
            if (selPackageUuid == 'overall' || selPackageUuid == '---' || selPackageUuid == undefined) selPackageUuid = '';
            data.unshift(selPackageUuid);
        }
    }
    return data;
}

var tableWhole;
var tableHeader1;
var tableHeader2;
var tableHeaderBelow;

function printWindowDashboard(){
    window.print($('.myDashboard.active .contentContainer').html());
}

function printDashboard(){
    var dashboardTitle = $('.dashboardHeader .title h4').html();

    tableWhole = $("#incidentTb").height();
    tableHeader1 = $(".interimHeader1").height();
    tableHeader2 = $(".interimHeader2").height();
    tableHeaderBelow = $(".otherInterimHeader").height();

    if(dashboardTitle == "Contract Management Dashboard" ){
        printWindowDashboard();
    }else{
        setTimeout(printWindowDashboard, 1000);
    }
}

$(function () {

    //disable dev tool
	var prodFlag = localStorage.inspectFlag;

    if(prodFlag == 'true'){
        document.addEventListener("contextmenu", function(event) {
            event.preventDefault();
        });
    
        document.addEventListener("keydown", function(event) {
            if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I") || (event.ctrlKey && event.shiftKey && event.key === "C") || (event.ctrlKey && event.shiftKey && event.key === "J")) {
                event.preventDefault();
            }
        });
    }

    $("#minimizeButton").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active")
            $(".sidebar").animate({ width: 'toggle' }, 150)

            $(".layout").css("width", "calc(80% - 25px)").animate({ width: '+=20%' }, 150, function () {}).promise().done(function () {refreshAllCharts()})
            $("#minimizeButton").animate({ left: '10px' }, 150)

        } else {
            $(this).addClass("active")
            $(".sidebar").animate({ width: 'toggle' }, 150)

            $(".layout").css("width", "calc(100% - 25px)").animate({ width: '-=20%' }, 150, function () {}).promise().done(function () {refreshAllCharts()})
            $("#minimizeButton").animate({ left: '20%' }, 150)
        }
    });

    if(localStorage.project_owner == 'SSLR2'){
        var colors =    ['#00DFCF', '#ff8555', '#4eff5d', '#decffd', '#921700', '#ddc300', '#20d2ff', '#e24000', '#00a00e', '#7b3cf9', '#ffcec5', '#ffef77', '#ff4f2c']
        var gradients = ['#00BAAD', '#ff5b1a', '#00eb14', '#ab83fb', '#570e00', '#8f7e00', '#00a7d1', '#802400', '#005207', '#4f07df', '#ff9d8a', '#ffe629', '#f02800'] 
    }else{
        var colors = ['#00DFCF', '#8FDAAE', '#C6E18F', '#F3E98E', '#FFDC6B', '#FFB265', '#FF7D61', '#D63C68', '#BC1052', '#7E2571', '#565697', '#6DB9D7']
        var gradients = ['#00BAAD', '#57C785', '#ADD45C', '#EDDD53', '#FFC300', '#FF8D1A', '#FF5733', '#C70039', '#900C3F', '#511849', '#3D3D6B', '#2A7B9B'] 
    }

    Highcharts.setOptions({
        exporting: {
            menuItemDefinitions: {
                //Custom definition
                label: {
                    onclick: function() {
                    var highchartID = this.renderTo.getAttribute('id');
                    var targetDiv = $('#'+highchartID)[0];
                    let chart = $(`#${highchartID}`).highcharts();
                    
                    if (targetDiv.addEventListener){
                        targetDiv.addEventListener('fullscreenchange', exitHandler);
                        targetDiv.addEventListener('webkitfullscreenchange', exitHandler);
                        targetDiv.addEventListener('mozfullscreenchange', exitHandler);
                        targetDiv.addEventListener('MSFullscreenChange', exitHandler);
                    }

                    if(!document.fullscreenElement){
                        launchFullscreen(targetDiv);
                    }
                    else{
                        launchExitFullscreen(targetDiv);
                    }
                    },
                    text: 'Toggle Screen View'
                },
                printChart: {
                    onclick: function() {
                        var highchartID = this.renderTo.getAttribute('id');
                        var divToPrint = $('#'+highchartID)[0];
                        let chart = $(`#${highchartID}`).highcharts();
                        chart.updateFlagPrint = true;

                        //before print
                        if(highchartID == "methodStatementChart" || highchartID == "matApprovalChart" || highchartID == "rfitAgeChart" || highchartID == "NCRChart"){
                            chart.update({
                                chart: {
                                    marginTop: 30
                                },
                                plotOptions: {
                                    series: {
                                      dataLabels: {
                                        enabled: true
                                      }
                                    },
                                    pie: {
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.y}'
                                      }
                                    }
                                  }
                            })
                        }else if(highchartID == "HSEActivityProgram"){
                            chart.update({
                                chart: {
                                    marginTop: 150
                                },
                                legend: {
                                    y: 60
                                },
                                plotOptions: {
                                    series: {
                                      dataLabels: {
                                        enabled: true
                                      }
                                    },
                                    pie: {
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.y}'
                                      }
                                    }
                                  }
                            })
                        }else if(highchartID == "weatherSDL"){
                            chart.update({
                                legend: {
                                    symbolHeight: 15,
                                    symbolWidth: 15,
                                    itemStyle : {
                                        fontSize : 15
                                    }
                                },
                                plotOptions: {
                                    series: {
                                      dataLabels: {
                                        enabled: true
                                      }
                                    },
                                    pie: {
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.y}'
                                      }
                                    }
                                  }
                            })
                        }else if(highchartID == "OverallIncidentsAndAccidentsRecord" || highchartID == "MAStatusCharts" || highchartID == "MSStatusCharts"){
                            chart.update({
                                chart: {
                                    marginTop: 90,
                                },
                                plotOptions: {
                                    series: {
                                      dataLabels: {
                                        enabled: true
                                      }
                                    },
                                    pie: {
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                      }
                                    }
                                  }
                            })
                        }else if(highchartID == "risk-pdp-crit-risk"){
                            chart.update({
                                xAxis: {
                                    labels: {
                                        style: {
                                            fontSize: '7px',
                                            color: 'black',
                                            textOverflow: 'clip',
                                            whiteSpace: 'wrap',
                                            width: 350,
                                        }
                                    }
                                }
                            })

                        }else if(highchartID == "risk-pdp-overall-dur"){
                            chart.update({
                                chart:{
                                  marginTop: 120,
                                }
                            })
                        }else if(highchartID == "rmIncChart" || highchartID == "rmDescChart"){
                            chart.update({
                                chart:{
                                  marginTop: 90,
                                  marginBottom: 80
                                },
                                xAxis: {
                                    labels: {
                                        rotation: -45
                                    }
                                },
                                legend: {
                                    enabled: true
                                }
                            })
                        }else if(highchartID == "mlpIncChart" || highchartID == "mlpDescChart"){
                            chart.update({
                                chart:{
                                  marginTop: 90,
                                  marginBottom: 80
                                },
                                legend: {
                                    enabled: true
                                }
                            })
                        }else if(highchartID == "cdIncChart" || highchartID == "cdDescChart"){
                            chart.update({
                                chart:{
                                  marginTop: 90,
                                  marginBottom: 50
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                        enabled: true,
                                            format: '<b>{point.name}</b>: {point.y}<br>{point.percentage:.1f} %'
                                        },
                                        showInLegend: true
                                    }
                                }
                            })
                        }else{
                            chart.update({
                                chart: {
                                    marginTop: 90,
                                },
                                plotOptions: {
                                    series: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    },
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.y}'
                                        }
                                    }
                                }
                            })
                        }

                        showLabel(divToPrint);

                        this.setSize(800, 600, false);

                        //write document to create highchart
                        var newWin = window.open();
                        newWin.document.write(divToPrint.innerHTML);
                        newWin.document.close();
                        newWin.focus();
                        newWin.print();
                        newWin.close();

                        //after print
                        hideLabel(divToPrint, highchartID);
                        this.setSize(null, null, false);
                        window.parent.getIframeID();
                        chart.updateFlagPrint = false;
                    }
                }
            },
            buttons: {
                contextButton: {
                    menuItems: ['label', 'printChart', 'downloadPDF', 'downloadJPEG']
                }
            },
            chartOptions: {
                chart: {
                    marginTop: 90,
                    events: {
                        load: function(){
                            $('.hiddenLabel').css("display", "none")

                            function showDonutLabel(){
                                $('.hiddenLabel').css("display", "block")
                            }

                            setTimeout(showDonutLabel, 150);
                        }
                    }
                },
                xAxis: {
                    labels: {
                        rotation: 0,
                        style: {
                            width: 350,
                            fontSize: '7px',
                            color: 'black',
                            textOverflow: 'clip',
                            whiteSpace: 'wrap',
                        }
                    },
                },
                title: {
                    style: {
                        fontSize: '10px' 
                    },
                    align: 'center',
                    verticalAlign: 'top',
                },
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    itemStyle: {
                        width: 200
                    }
                },
                plotOptions: {
                  series: {
                    dataLabels: {
                      enabled: true
                    }
                  },
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.y}<br>{point.percentage:.1f} %'
                    },
                    showInLegend: true
                  }
                }
            },
            sourceWidth: 900,
            sourceHeight: 700,
        },
        lang: {
            thousandsSep: ','
        },
        colors: Highcharts.map(colors, (color, i) => ({
            linearGradient: {
                x1: 1, x2: 0, y1: 0, y2: 1
            },
            stops: [
                [0, color],
                [1, gradients[i]]
            ]
            })),
        plotOptions: {
            line: {
                color: Highcharts.getOptions().colors[0]
            },
            spline: {
                color: Highcharts.getOptions().colors[1]
            },   	
            column: {
                color: Highcharts.getOptions().colors[2]
            }, 
            pie: {
                color: Highcharts.getOptions().colors[3]
            },
            bar : {
                color: Highcharts.getOptions().colors[4]
            }
        }
    });
    
    window.addEventListener("message", (event) => {
        if(event.origin != location.origin) return;

        if(event.data && event.data.functionName && event.data.functionName == 'print'){
            printDashboard();
        }

        if(event.data && event.data.functionName && event.data.functionName == 'refreshAllChart'){
            window.parent.getIframeID();
        }
    })

    var beforePrint = function() {
        $('.tableCell').css({'display':'table-cell'});
        $('.tableHeaderGroup').css({'display':'table-header-group'});
        $('.inlineTable').css({'display': 'inline-table'});
        $('.positionRelative').css({'position': 'relative', 'display': 'table'});
        $('.positionAbsolute').css({'position': 'absolute', 'display': 'table', 'height': '350px'});
        $('.tableHeader').css({'position': 'static'});
        $('.fitContent').css({'height': 'fit-content'});
        $('.flexColumn').css({'display': 'flex', 'flex-direction': 'column'});
        $('.marginTop').css({'margin-top': '270px'});
        $('.heightSmall').css({'height': '300px'});
        $('.noscrollPrint').css({'overflow': 'visible'});
        $('.tableFullWidth').css({'width': '1050px !important'});
        $('.tableHalfWidth').css({'width': '143mm'});
        $('.z-indexHight').css({'z-index': '5', 'position': 'relative'});
        $('.nonPaveHeightPrint').css({'height': '200px'});
        $('.widthFull').css({'width': '100%'});
        $('#KPJContainer').css({'height': '199.6px'})
        $('#APJContainer').css({'height': '199.6px'})
        $('#KPJPie').css({'height': 'calc((100% - 169.6px) - 40px)'})
        $('#APJPie').css({'height': 'calc((100% - 169.6px) - 40px)'})
    };

    var afterPrint = function() {
    $('.tableCell').css({'display':''});
        $('.tableHeaderGroup').css({'display':''});
        $('.inlineTable').css({'display': ''});
        $('.positionRelative').css({'position': '', 'display': ''});
        $('.positionAbsolute').css({'position': '', 'display': '', 'height': ''});
        $('.tableHeader').css({'position': 'sticky'});
        $('.fitContent').css({'height': ''});
        $('.flexColumn').css({'display': '', 'flex-direction': ''});
        $('.marginTop').css({'margin-top': ''});
        $('.heightSmall').css({'height': ''});
        $('.noscrollPrint').css({'overflow': ''});
        $('.tableStripMap').css({'width': ''});
        $('.tableFullWidth').css({'width': ''});
        $('.tableHalfWidth').css({'width': ''});
        $('.z-indexHight').css({'z-index': '', 'position': ''});
        $('.widthFull').css({'width': ''});
        $('.nonPaveHeightPrint').css({'height': ''});
        $('.columnToRow').css({'height': '', 'overflow': ''});
        $('#KPJContainer').css({'height': ''})
        $('#APJContainer').css({'height': ''})
        $('#KPJPie').css({'height': ''})
        $('#APJPie').css({'height': ''})

        var apjTable = $('#APJTable').height();
        var kpjTable = $('#KPJTable').height();

        if(apjTable == 0){
            apjTable = 178;
            kpjTable = 178;
        }else{
            apjTable = $('#APJTable').height();
            kpjTable = $('#KPJTable').height();
        }

        $('#APJContainer').css('height', `calc(${apjTable}px + 10px)`)
        $('#KPJContainer').css('height', `calc(${kpjTable}px + 10px)`)

        $('#APJPie').css('height', `calc(100% - ${apjTable}px - 10px)`)
        $('#KPJPie').css('height', `calc(100% - ${kpjTable}px - 10px)`)
        
        window.parent.postMessage({functionName: 'defaultWidth'})
    };

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
})

var loading = $('.loader');

if (loading) {
    $(document).ajaxStart(function () {
        window.parent.postMessage({functionName: 'loaderajaxStart'})
    }).ajaxComplete(function () {
        window.parent.postMessage({functionName: 'loaderajaxEnd'})
    });
}

function retrieveFilterFromMainWindows(filterArr){
    filterForListDashboard = filterArr;
}

function getSearchFilterSabah(){
    var selYr = '';
    var selMth = '';
    var status = '';
    var lastdayMnth = '';
    var dateFrom = '';
    var dateTo = '';
    var risk = '';
    var riskCat = '';
    var reportCat = '';
    var reportStat = '';
    var lcmLand = '';
    var districtLand = '';

    window.parent.getFilterForDashboard(); 

    if(filterForListDashboard){
        selYr = filterForListDashboard.year;
        selMth = filterForListDashboard.month;
        status = filterForListDashboard.statusSbh;
        risk = filterForListDashboard.riskRating;
        riskCat = filterForListDashboard.riskCat;
        reportCat = filterForListDashboard.reportCat;
        reportStat = filterForListDashboard.reportStat;
        lcmLand = filterForListDashboard.lcmLand;
        districtLand = filterForListDashboard.districtLand;
        category = filterForListDashboard.category;

        if(status=='allstatus') status = '';
        if(riskCat=='overall') riskCat = '';
        if(risk=='overall') risk = '';
        if(reportCat=='allcategory') reportCat = '';
        if(reportStat=='allstatus') reportStat = '';
        if(lcmLand=='allNo') lcmLand = '';
        if(districtLand=='allDistrict') districtLand = '';
        if(category=='overall') category = '';
    }

    if(selYr != 'all'){
        if(selMth == 'all'){
          lastdayMnth = new Date(selYr, 01, 0);
          dateFrom = '01-01-'+selYr;
          dateTo = lastdayMnth.getDate()+'-12-'+selYr;
        }else{
          var selMthNo = textMonthtoNum[selMth]
          lastdayMnth = new Date(selYr, selMthNo, 0);
          dateFrom = '01-'+selMthNo+'-'+selYr;
          dateTo = lastdayMnth.getDate()+'-'+selMthNo+'-'+selYr;
        }
    }

    return {
        selMth : selMth, 
        selYr : selYr, 
        dateMon: (selMth == 'all') ? '' : selMth,
        dateYr: (selYr == 'all') ? '' : selYr,
        dateFrom : dateFrom,
        dateTo: dateTo,
        status: status,
        risk: risk,
        riskCat: riskCat,
        reportCat: reportCat, 
        reportStat: reportStat,
        lcmNo : lcmLand,
        districtLand : districtLand,
        category : category
    }
}

function getFilterDocumentSarawak(){
    var dateFrom = '';
    var dateTo = '';
    var selYr = '';
    var selMth = '';
	var lastdayMnth = '';
    var section = '';
    var year = '';
    var month = '';
    var status = '';
    window.parent.getFilterForDashboard();

    if(filterForListDashboard){
        selYr = filterForListDashboard.year;
        selMth = filterForListDashboard.month;
        section = filterForListDashboard.section;
        status = filterForListDashboard.statusSrwk;

        if(section == 'overall'){
            section = '';
        }

        if(status == 'allstatus'){
            status = '';
        }else if (status == 'OPEN'){
            status = 'Pending';
        }
    }

    if(selYr != 'all'){
        year = selYr;
        if(selMth == 'all'){
          month = '';
          lastdayMnth = new Date(selYr, 1, 0);
          dateFrom = '01-01-'+selYr;
          dateTo = lastdayMnth.getDate()+'-12-'+selYr;
        }else{
          var selMthNo = textMonthtoNum[selMth];
          lastdayMnth = new Date(selYr, selMthNo, 0);
          dateFrom = '01-'+selMthNo+'-'+selYr;
          dateTo = lastdayMnth.getDate()+'-'+selMthNo+'-'+selYr;
          month = selMthNo;
        }
      }else{
        year = '';
      }

    return {dateFrom : dateFrom, dateTo: dateTo, section: section, selYr: selYr, year:year, month:month, status: status}
}

function getFilterDashboardAsset(){
    var dateFrom = '';
    var dateTo = '';
    var selYr = '';
    var selMth = '';
	var lastdayMnth = '';
    var section = '';
    var year = '';
    var month = '';
    var activity = '';
    var group = '';
    var wpc = '';
    window.parent.getFilterForDashboard();

    if(filterForListDashboard){
        selYr = filterForListDashboard.year;
        selMth = filterForListDashboard.month;
        section = filterForListDashboard.section;
        activity = filterForListDashboard.assetActivity;
        group = filterForListDashboard.assetGroup;
        wpc = filterForListDashboard.wpc;

        if(section == 'overall'){
            section = '';
        }

        if(group == 'all'){
            group = '';
        }

        if(activity == 'default'){
            activity = '';
        }
    }

    if(selYr != 'all'){
        year = selYr;
        if(selMth == 'all'){
          month = '';
          lastdayMnth = new Date(selYr, 01, 0);
          dateFrom = selYr+'-01-01';
          dateTo = selYr+'-12-'+lastdayMnth.getDate();
        }else{
          var selMthNo = textMonthtoNum[selMth];
          lastdayMnth = new Date(selYr, selMthNo, 0);
          dateFrom = selYr+'-'+selMthNo+'-01';
          dateTo = selYr+'-'+selMthNo+'-'+lastdayMnth.getDate();
          month = selMthNo;
        }
      }else{
        year = '';
      }

    return {dateFrom : dateFrom, dateTo: dateTo, section: section, selYr: selYr, year:year, month:month, activity: activity, group: group, wpc: wpc}
}

function getFilterDocumentSSLR2(){
    var dateFrom = '';
    var dateTo = '';
    var selYr = '';
    var selMth = '';
	var lastdayMnth = '';
    var section = '';
    var year = '';
    var month = '';
    var status = '';
    window.parent.getFilterForDashboard();

    if(filterForListDashboard){
        selYr = filterForListDashboard.year;
        selMth = filterForListDashboard.month;
        section = filterForListDashboard.section;
        status = filterForListDashboard.statusSrwk;

        if(section == 'overall'){
            section = '';
        }

        if(status == 'allstatus'){
            status = '';
        }else if (status == 'OPEN'){
            status = 'Pending';
        }
    }

    if(selYr != 'all'){
        year = selYr;
        if(selMth == 'all'){
          month = '';
          lastdayMnth = new Date(selYr, 01, 0);
          dateFrom = '01-01-'+selYr;
          dateTo = lastdayMnth.getDate()+'-12-'+selYr;
        }else{
          var selMthNo = textMonthtoNum[selMth];
          lastdayMnth = new Date(selYr, selMthNo, 0);
          dateFrom = '01-'+selMthNo+'-'+selYr;
          dateTo = lastdayMnth.getDate()+'-'+selMthNo+'-'+selYr;
          month = selMthNo;
        }
      }else{
        year = '';
      }

    return {dateFrom : dateFrom, dateTo: dateTo, section: section, selYr: selYr, year:year, month:month, status: status}
}