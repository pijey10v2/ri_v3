var filterForListDashboard = {};
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function formatCurrency(val) {
    return parseFloat(val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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
    
    setTimeout(() => {
        window.parent.getIframeID();
    }, 200);
}

function exitHandler(){
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        hideLabel(document);

        setTimeout(() => {
            window.parent.getIframeID();
        }, 200);
    }
}

function printWindowDashboard(){
    window.print($('.myDashboard.active .contentContainer').html());
}

function printDashboard(){
    setTimeout(printWindowDashboard, 1000);
}

function getMthYrFromFilter(){
    var yr = '';
    var mth = '';
    var selYr = $("#yearFilter").val();
    var selMth = $("#monthFilter").val();

    //BECAUSE V3 used another id for Year & Month filter
    if(selYr == undefined && selMth == undefined){
        window.parent.getFilterForDashboard(); //to call parent filter because we used iframe

        if(filterForListDashboard){
            selYr = filterForListDashboard.year;
            selMth = filterForListDashboard.month;
        }
    }

    if(selYr != 'all') yr = selYr;
    if(selMth != 'all') mth = selMth;

    return {yr : yr, mth: mth}
}

function processFilterParamArr(data){
    var selWpc = "";

    if(localStorage.isParent && localStorage.isParent == 'isParent'){
        selWpc = $('#wpcFilter').val();
        if(selWpc == undefined){
            window.parent.getFilterForDashboard(); //to call parent filter because we used iframe
    
            if(filterForListDashboard){
                selWpc = filterForListDashboard.wpc;

                if (selWpc == 'overall' || selWpc == '---') selWpc = '';
                data.unshift(selWpc);
            }
        }
        else{
            if (selWpc == 'overall' || selWpc == '---') selWpc = '';
            data.unshift(selWpc);
        }
    }
    return data;
}

function postMessageParent(postParam){
    if (parent) parent.postMessage(postParam ,"*");
}

function getDateFromToFilter(){
    var dateFrom = '';
    var dateTo = '';

    var selYr = $("#yearFilter").val();
    var selMth = $("#monthFilter").val();

    //BECAUSE V3 used another id for Year & Month filter
    if(selYr == undefined && selMth == undefined){
        window.parent.getFilterForDashboard(); //to call parent filter because we used iframe

        if(filterForListDashboard){
            selYr = filterForListDashboard.year;
            selMth = filterForListDashboard.month;
            section = filterForListDashboard.section;

            if(section == 'overall') section = '';
        }
    }

    if(selYr != 'all'){
        if(selMth == 'all'){
            dateFrom = '01/01/'+selYr;
            dateTo = '31/12/'+selYr;
        }else{
            var d = new Date(selYr, parseInt(selMth), 0);
            dateFrom = '01/'+selMth+'/'+selYr;
            dateTo = d.getDate()+'/'+selMth+'/'+selYr;
        }
    }
    return {dateFrom : dateFrom, dateTo: dateTo, selYr: selYr, selMth: selMth, section : section}
}

function getDateFromToFilterClaim(){
    var dateFrom = '';
    var dateTo = '';

    var selYr = $("#yearFilter").val();
    var selMth = $("#monthFilter").val();

    //BECAUSE V3 used another id for Year & Month filter
    if(selYr == undefined && selMth == undefined){
        window.parent.getFilterForDashboard(); //to call parent filter because we used iframe

        if(filterForListDashboard){
            selYr = filterForListDashboard.year;
            selMth = filterForListDashboard.month;
            section = filterForListDashboard.section;

            if(section == 'overall') section = '';
        }
    }

    if(selYr != 'all'){
        if(selMth == 'all'){
            dateFrom = '01/01/'+selYr;
            dateTo = '31/12/'+selYr;
        }else{
            var selMthNo = textMonthtoNum[selMth];
            var d = new Date(selYr, parseInt(selMthNo), 0);
            dateFrom = '01/'+selMthNo+'/'+selYr;
            dateTo = d.getDate()+'/'+selMthNo+'/'+selYr;
        }
    }
    return {dateFrom : dateFrom, dateTo: dateTo, selYr: selYr, selMth: selMth, section : section}
}

function getMonthFilter(){
    var selMth = $("#monthFilter").val();
    if(selMth != 'all'){
        return true;
    }
    return false;
}

function refreshAllCharts() {
    if(Highcharts){
        if(Highcharts.charts && Highcharts.charts.length !=0){
            Highcharts.charts.forEach(function(ele,idx){
                if(typeof ele != "undefined"){
                    if(ele.reflow) ele.reflow();
                }
            })
        }
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

            $(".layout").css("width", "calc(80% - 15px)").animate({ width: '+=20%' }, 150, function () { }).promise().done(function () { refreshAllCharts() })
            $("#minimizeButton").animate({ left: '10px' }, 150)

        } else {
            $(this).addClass("active")
            $(".sidebar").animate({ width: 'toggle' }, 150)

            $(".layout").css("width", "calc(100% - 15px)").animate({ width: '-=20%' }, 150, function () { }).promise().done(function () { refreshAllCharts() })
            $("#minimizeButton").animate({ left: '20%' }, 150)
        }
    })

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
        $('.heightFill').css({'height': '-webkit-fill-available'});
        $('.heightFill100').css({'height': '100%'});
        $('.widthFill').css({'width': '100%'});
        $('.topRelativePrint').css({'top': '200px'});
        $('.displayNone').css({'display': 'none'});
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
        $('.heightFill').css({'height': ''});
        $('.heightFill100').css({'height': ''});
        $('.widthFill').css({'width': ''});
        $('.topRelativePrint').css({'top': '0'});
        $('.displayNone').css({'display': ''});
        window.parent.postMessage({functionName: 'defaultWidth'})
    };

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;

    if(localStorage.ui_pref == "ri_v3"){
        const colors = ['#00DFCF', '#8FDAAE', '#C6E18F', '#F3E98E', '#FFDC6B', '#FFB265', '#FF7D61', '#D63C68', '#BC1052', '#7E2571', '#565697', '#6DB9D7']
        const gradients = ['#00BAAD', '#57C785', '#ADD45C', '#EDDD53', '#FFC300', '#FF8D1A', '#FF5733', '#C70039', '#900C3F', '#511849', '#3D3D6B', '#2A7B9B'] 

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

                            //before print
                            if(highchartID == "phyScurve" || highchartID == "finScurve"){
                                chart.update({
                                    chart: {
                                        marginTop: 90,
                                    },
                                    plotOptions: {
                                        series: {
                                            dataLabels: {
                                            enabled: true
                                            }
                                        }
                                    },
                                    legend: {
                                        symbolHeight: 15,
                                        symbolWidth: 15,
                                        align: 'right',
                                        verticalAlign: 'middle',
                                        layout: 'vertical',
                                        floating: true,
                                        y: -60,
                                        x: 0,
                                        itemStyle : {
                                          fontSize : '15px'
                                        }
                                    }
                                })
                            }else if(highchartID == "incCorrTypeChart" || highchartID == "outCorrTypeChart" || highchartID == "variance"){
                                chart.update({
                                    chart:{
                                      marginTop: 90
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
                            }else if(highchartID == "landDatabase"){
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
                                        }
                                    }
                                })
                            }else if(highchartID == "overallChart" || highchartID == "lawas01Chart" || highchartID == "lawas02Chart" || highchartID == "limbang01Chart" || highchartID == "limbang02Chart" || highchartID == "limbang03Chart"){
                                chart.series.forEach(function (series) {

                                    series.update({
                                        dataLabels: {
                                            enabled: true,
                                            distance: 30,
                                            format: '{point.y}km',
                                            style: {
                                                fontSize: '20px'
                                            }
                                        }
                                    }, false); 
                                });
                        
                                chart.redraw();

                                chart.update({
                                    chart: {
                                        marginTop: -30,
                                        marginLeft: 270
                                    },
                                    legend: {
                                        layout: 'vertical',
                                        align: 'left',
                                        itemStyle: {
                                            fontSize: '20px',
                                            color: '#333',
                                            width: 'auto'
                                        }
                                    }
                                })
                            }else{
                                chart.update({
                                    chart: {
                                        marginTop: 90,
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
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
                            hideLabel(divToPrint);
                            this.setSize(null, null, false);
                            window.parent.getIframeID();
    
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
                        marginBottom: 60,
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
                            useHTML: true,
                            style: {
                                'word-break': 'break-all', //break-word
                                width: '200px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'black'
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
                        }
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
    }else{
        Highcharts.setOptions({
            colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
        });
        
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

})

if(localStorage.ui_pref == "ri_v3"){
    var loading = $('.loader');

    if (loading) {
        $(document).ajaxStart(function () {
            window.parent.postMessage({functionName: 'loaderajaxStart'})
        });
    }
}else{
    $(document).ajaxStart(function () {
        if ($('#loadingContainer_dashboard')) {
            $('#loadingContainer_dashboard').fadeIn();
        }
    }).ajaxStop(function () {
        if ($('#loadingContainer_dashboard')) {
            $('#loadingContainer_dashboard').fadeOut();
        }
    });
}

function retrieveFilterFromMainWindows(filterArr){
    filterForListDashboard = filterArr;
}