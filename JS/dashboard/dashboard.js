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
}

function hideLabel(context){
    var targetDivLabel = context.querySelectorAll('.showLabel, .highcharts-data-label-connector, .highcharts-data-label')
    var targetHiddenDivLabel = context.querySelectorAll('.hiddenLabel')
    var i;
    var r;
    for (i = 0; i < targetDivLabel.length; i++){
        targetDivLabel[i].style.display = "none";
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
        refreshAllCharts();
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
    if(localStorage.isParent && localStorage.isParent == 'isParent'){
        var selWpc = $('#wpcFilter').val();
        if (selWpc == 'overall') selWpc = '';
        data.unshift(selWpc);
    }
    return data;
}

var tableWhole;
var tableHeader1;
var tableHeader2;
var tableHeaderBelow;

function printWindowDashboard(){
    window.print($('#lOne').html());
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
    $("#minimizeButton").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active")
            $(".sidebar").animate({ width: 'toggle' }, 150)

            $(".layout").css("width", "calc(80% - 15px)").animate({ width: '+=20%' }, 150, function () {}).promise().done(function () {refreshAllCharts()})
            $("#minimizeButton").animate({ left: '10px' }, 150)

        } else {
            $(this).addClass("active")
            $(".sidebar").animate({ width: 'toggle' }, 150)

            $(".layout").css("width", "calc(100% - 15px)").animate({ width: '-=20%' }, 150, function () {}).promise().done(function () {refreshAllCharts()})
            $("#minimizeButton").animate({ left: '20%' }, 150)
        }
    });

    Highcharts.setOptions({
        colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
    });

    if(localStorage.project_owner == "JKR_SABAH"){
        Highcharts.setOptions({
            exporting: {
                menuItemDefinitions: {
                    //Custom definition
                    label: {
                      onclick: function() {
                        var highchartID = this.renderTo.getAttribute('id');
                        var targetDiv = $('#'+highchartID)[0];
                        
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

                            //before print
                            if(highchartID == "methodStatementChart" || highchartID == "matApprovalChart" || highchartID == "rfitAgeChart" || highchartID == "NCRChart"){
                                chart.update({
                                    chart: {
                                      marginTop: 30
                                    }
                                })
                            }else if(highchartID == "HSEActivityProgram"){
                                chart.update({
                                    chart: {
                                        marginTop: 150
                                    },
                                    legend: {
                                        y: 60
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
                                      }
                                })
                            }else{
                                chart.update({
                                    chart: {
                                        marginTop: 90,
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
                            hideLabel(divToPrint);
                            this.setSize(null, null, false);
                            if(highchartID == "HSEActivityProgram"){
                                if(document.fullscreenElement){
                                }else{
                                    chart.update({
                                        chart: {
                                            marginTop: 50
                                        },
                                        legend: {
                                            verticalAlign: 'top',
                                            y: 10
                                        }
                                    })
                                }
                            }else if(highchartID == "weatherSDL"){
                                chart.update({
                                    legend: {
                                        symbolHeight: 10,
                                        symbolWidth: 10,
                                        itemStyle : {
                                          fontSize : 10
                                        }
                                    }
                                })
                            }else{
                                chart.update({
                                    chart: {
                                      marginTop: 10
                                    }
                                })
                            }
                            for(let i = 0; i <= Highcharts.charts.length; i++){
                                Highcharts.charts[i] && Highcharts.charts[i].reflow();
                            }
                        }
                    }
                },
                buttons: {
                    contextButton: {
                        menuItems: ['label', 'printChart', 'downloadPDF', 'downloadJPEG']
                    }
                },
            },
            lang: {
                thousandsSep: ','
            }
        });
    }
    else{
        Highcharts.setOptions({
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ['viewFullscreen']
                    }
                }
            }
        });
    }
    
    window.addEventListener("message", (event) => {
        if(event.origin != location.origin) return;
        if(event.data && event.data.functionName && event.data.functionName == 'print'){
            printDashboard();
        }
    })
    // let allHeight = tableHeaderTop + tableHeaderBelow

    var beforePrint = function() {
        if(tableWhole){
            // $('#incidentTb').css("height", tableWhole)
        }
        $('.tableCell').css({'display':'table-cell'});
        $('.tableHeaderGroup').css({'display':'table-header-group'});
        $('.inlineTable').css({'display': 'inline-table'});
        $('.positionRelative').css({'position': 'relative', 'display': 'table'});
        $('.tableHeader').css({'position': 'static'});
    };

    var afterPrint = function() {
        if(tableWhole){
        }
        $('.tableCell').css({'display':''});
        $('.tableHeaderGroup').css({'display':''});
        $('.inlineTable').css({'display': ''});
        $('.positionRelative').css({'position': '', 'display': ''});
        $('.tableHeader').css({'position': 'sticky'});

        window.parent.postMessage({functionName: 'defaultWidth'})
    };

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
})

var loading = $('#loadingContainer_dashboard');
if (loading) {
    $(document).ajaxStart(function () {
        loading.fadeIn();
    }).ajaxStop(function () {
        loading.fadeOut();
    });
}