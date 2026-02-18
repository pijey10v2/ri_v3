function refreshAllCharts(){
    if (typeof refreshDashboard === 'function') refreshDashboard();
}

function formatCurrency(val) {
    return parseFloat(val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function showLabel(context){
    var targetDivLabel = context.querySelectorAll('.showLabel, .highcharts-data-label-connector, .highcharts-data-label')
    var i;
    for (i = 0; i < targetDivLabel.length; i++){
        targetDivLabel[i].style.display = "block";
    }
}

function hideLabel(context){
    var targetDivLabel = context.querySelectorAll('.showLabel, .highcharts-data-label-connector, .highcharts-data-label')
    var i;
    for (i = 0; i < targetDivLabel.length; i++){
        targetDivLabel[i].style.display = "none";
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

function printDashboard(){
    tableWhole = $("#incidentTb").height();
    tableHeader1 = $(".interimHeader1").height();
    tableHeader2 = $(".interimHeader2").height();
    tableHeaderBelow = $(".otherInterimHeader").height();
    window.print($('#lOne').html());
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
        exporting: {
            menuItemDefinitions: {
                // Custom definition
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
                        var newWin = window.open();
                        newWin.document.write(divToPrint.innerHTML);
                        newWin.document.close();
                        newWin.focus();
                        newWin.print();
                        newWin.close();
                        hideLabel(divToPrint);
                    }
                }
            },
            buttons: {
                contextButton: {
                    menuItems: ['label', 'printChart', 'downloadPDF', 'downloadJPEG']
                }
            },
            sourceWidth: 1400,
            sourceHeight: 800,
            scale: 2,
        }
    });
    
    window.addEventListener("message", (event) => {
        if(event.origin != location.origin) return;
        if(event.data && event.data.functionName && event.data.functionName == 'print'){
            printDashboard();
        }
    })

    var beforePrint = function() {
        $('.tableCell').css({'display':'table-cell'});
        $('.tableHeaderGroup').css({'display':'table-header-group'});
        $('.inlineTable').css({'display': 'inline-table'});
        $('.positionRelative').css({'position': 'relative', 'display': 'table'});
        $('.tableHeader').css({'position': 'static'});
    };

    var afterPrint = function() {
        $('.tableCell').css({'display':''});
        $('.tableHeaderGroup').css({'display':''});
        $('.inlineTable').css({'display': ''});
        $('.positionRelative').css({'position': '', 'display': ''});
        $('.tableHeader').css({'position': 'sticky'});
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