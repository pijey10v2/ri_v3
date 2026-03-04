var landData;
var monthFulltext = {"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"};
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var monthHalftext = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"};
var inPackageUuid = initInPackageUuid()
 
function initInPackageUuid(){
    return localStorage.inPackageUuid ? localStorage.inPackageUuid : ''
}
 
function conOpLink(){
    var linkWinTitle = 'Land Summary'
    var linkName = 'dash_cons_LS_card'
    var linkParamArr = '';
    var searchilter = getSearchFilterSabah();
    var monthNo = '';
    var lcmNo = '';
    if(searchilter.dateMon != ''){
        var monthNo = textMonthtoNum[searchilter.dateMon];
        lcmNo =  searchilter.lcmNo
    }
    var addtlparam = '&inPackageUuid='+inPackageUuid;
 
    linkParamArr = processFilterParamArr([monthNo, searchilter.dateYr, lcmNo, searchilter.districtLand])
    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle, addtlparam);
}
 
var legendColorArr = [
                        '#183e65' ,'#1374a7','#64c9de','#188cbb', '#d5eaee',
                        '#ffd19e', '#dc793f', '#896a43', '#552710', '#811701',
                        '#fcc688', '#f1ebcb', '#f3e1ef', '#d9acc9', '#ae75a0',
                        '#633158', '#1a040e', '#456c35', '#778f51', '#acc38b',
                        '#c9c8b4', '#fbfdfc', '#f1d780', '#edcb5f', '#f5b901',
                        '#dc5d01', '#f59201'
                    ]
 
function drawLandChart(divId, data, monthYear){
	var catArr = [];
    var dataArr = [];
    var districtIdxArr = [];
 
	if (data) {
		for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);

            for (const [idx2, ele2] of Object.entries(ele)) {
                if(!districtIdxArr.includes(idx2)){
                    districtIdxArr.push(idx2)
                }
            }
        }

        var t = 0;
        districtIdxArr.forEach(ele => {
            var tempMthYrLand = [];
            var tempMthYrStruct = [];
            catArr.forEach(ele2 => {
                tempMthYrLand.push((data[ele2] && data[ele2][ele] && data[ele2][ele].land) ? parseInt(data[ele2][ele].land) : 0);
                tempMthYrStruct.push((data[ele2] && data[ele2][ele] && data[ele2][ele].structure) ? parseInt(data[ele2][ele].structure) : 0);
            });

            var addtlparam = '&inPackageUuid='+inPackageUuid;

            dataArr.push(
                {
                    name: ele,
                    data: tempMthYrLand,
                    stack: 'Land',
                    color: legendColorArr[t],
                    showInLegend : false,
                    events: {
                        click: function (event) {
                            var chartDate = event.point.category.name.split('-');
                            var month = chartDate[0];
                            var year = chartDate[1];

                            var linkParamArr = processFilterParamArr([month, year, '', ele]);                          
                            window.parent.widgetConopOpen("Land Summary", "dash_cons_LS_card", linkParamArr, "Land Summary - " + event.point.category.name, addtlparam);
                        }
                    }
                })
            dataArr.push(
                {
                    name: ele,
                    data: tempMthYrStruct,
                    stack: 'Structure',
                    color: legendColorArr[t],
                    events: {
                        click: function (event) {
                            var chartDate = event.point.category.name.split('-');
                            var month = chartDate[0];
                            var year = chartDate[1];

                            var linkParamArr = processFilterParamArr([month, year, '', ele]);                      
                            window.parent.widgetConopOpen("Land Summary", "dash_cons_LS_card", linkParamArr, "Land Summary - " + event.point.category.name, addtlparam);
                        }
                    }
                })
            t++;
        });
    }

    var landChart;

    if (typeof window.landCharts === 'undefined') {
        window.landCharts = {};
    }
 
    if(divId == "offerIssuedChart"){
        landChart = "Offer Issued"
    }else if(divId == "paymentChart"){
        landChart = "Payment Made"
    }else if(divId == "demolisedChart"){
        landChart = "Demolished"
    }
 
    /**
     * adjust as requested
     * requested to limit the bar graph to at least 12 only
     */
    const pointWidth = 70; // eto na inbetween talaga nung sa legendsss
	const minChartWidth = catArr.length * pointWidth;

	var chart = Highcharts.chart(divId, {
        chart: {
            type: 'column',
            marginRight: 150, // Reserve 100px on the right for the legend
            scrollablePlotArea: {
                minWidth: minChartWidth,
                scrollPositionX: 0
            },
        },
        events: {
                render() {
                    const chart = this;
                    
                    if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;

                        chart.update({
                            chart: {
                                marginTop: 30,
                                marginRight: 150
                            },
                            title: {
                                useHTML: true,
                                enabled: true,
                                text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">Land Summary Dashboard<br>'+localStorage.p_name+'<br>'+landChart+' ('+monthYear+')</span>'
                            },
                            // Fullscreen Update Block
                            legend: {
                                align: 'right',         
                                verticalAlign: 'top',   
                                layout: 'vertical',     
                                floating: true,
                                x: -40,                 
                                y: 100,
                                symbolHeight: 15,
                                symbolWidth: 15,
                                itemStyle: {
                                    fontSize: '15px',
                                },
                                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Add a slight background for definition
                                borderRadius: 5
                            }
                        })

                        chart.updateFlag = true;
                    } else if (chart.updateFlag) {
                        chart.updateFlag = false;
        
                        chart.update({
                            title: {
                                useHTML: true,
                                enabled: true,
                            },
                            legend: {
                                    align: 'right',          
                                    verticalAlign: 'top',           
                                    layout: 'vertical',
                                    x: 30,
                                    y: 35, 
                                    symbolHeight: 7,
                                    symbolWidth: 7,
                                    itemStyle: {
                                        fontSize: '9px',
                                    }
                                }
                            })

                            chart.updateFlag = true;
                    }
                }
            },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        subtitle: {
            text: ''
        },
        exporting: {
            menuItemDefinitions: {
            printChart: {
            text: 'Print chart',
                onclick: function () {
                        printChart(divId, monthYear, chart);
                    }
                }
            }
        },
        xAxis: {
            categories: catArr,
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
            x: 30,                // Nudge it slightly left from the right edge for spacing
            y: 35,                // Increase Y to push it down below the icon (Test 40-50)
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

    chart.updateFlag = true;

    // save the chart object globally
    window.landCharts[divId] = chart;
}

 
function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var selDist = $("#disFilter").val();
    var selYear = $('#yearFilter').val();
    var selLcmNo = $('#lcmNoFilter').val();
 
    if (selYear == 'all') {
        $('#monthFilter').prop("disabled", true);  
          $('#monthFilter').val('all');
    }else{
        $('#monthFilter').prop("disabled", false);
    }
    var selMonth = $('#monthFilter').val();
 
    refreshInformation(selWPC, selDist, selYear, selMonth, selLcmNo);
}
 
function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;
    var district = filterArr.districtLand;
    var lcm = filterArr.lcmLand;
 
    if(wpc != 'overall'){
        var data = (landData.filterLCM && landData.filterLCM[wpc] && landData.filterLCM[wpc][district]) ? landData.filterLCM[wpc][district] : [];
        var lcmData = (data && data[year] && data[year][month]) ? data[year][month] : [];
        if(lcm == 'allNo'){
            populateLCMNoFilter(lcmData);
        }
 
        var dataDistrict = (landData.filterDistrict && landData.filterDistrict[wpc]) ? landData.filterDistrict[wpc] : [];
        var districtData = (dataDistrict && dataDistrict.discFilter) ? dataDistrict.discFilter : [];
        if(district == 'allDistrict'){
            populateDistrictFilter(districtData);
        }
 
    }
    else{
        if($('.filterContainer .packFilter', window.parent.document).is(':visible')){
 
            var data = (landData.filterLCM && landData.filterLCM[wpc] && landData.filterLCM[wpc][district]) ? landData.filterLCM[wpc][district] : [];
            var lcmData = (data && data[year] && data[year][month]) ? data[year][month] : [];
            populateLCMNoFilter(lcmData);
 
            var dataDistrict = (landData.filterDistrict && landData.filterDistrict[wpc]) ? landData.filterDistrict[wpc] : [];
            var districtData = (dataDistrict && dataDistrict.discFilter) ? dataDistrict.discFilter : [];
            populateDistrictFilter(districtData);
 
        }
        else{
            if(district != 'allDistrict'){
                var data = (landData.filterLCM && landData.filterLCM[wpc] && landData.filterLCM[wpc][district]) ? landData.filterLCM[wpc][district] : [];
                var lcmData = (data && data[year] && data[year][month]) ? data[year][month] : [];
   
                if(lcm == 'allNo'){
                    populateLCMNoFilter(lcmData);
                }
   
                if(lcmData.length > 0){
                    if(year != 'all' && month != 'all'){
                        for (const [idx, ele] of Object.entries(lcmData)) {
                            $('.filterContainer #lcmNoFilter', window.parent.document).val(ele);
   
                        }
                    }
                }
            }
        }
    }
 
 
    if(lcm != 'allNo'){
        var dataChoose = (landData.filterLCM && landData.filterLCM['changeFilter']) ? landData.filterLCM['changeFilter'] : [];
 
        for (const [idx, ele] of Object.entries(dataChoose)) {
            if(idx == wpc){
                for (const [idx2, ele2] of Object.entries(ele)) {
               
                    for (const [idx3, ele3] of Object.entries(ele2)) {
                       
                        for (const [idx4, ele4] of Object.entries(ele3)) {
                           
                            for (const [idx5, ele5] of Object.entries(ele4)) {
                                if(lcm != ele5) continue;
                                $('.filterContainer .packFilter', window.parent.document).val(idx);
                                $('.filterContainer .yrFilter', window.parent.document).val(idx3);
                               
                                $('.filterContainer .mthFilter', window.parent.document).prop('disabled', false);
                                $('.filterContainer .mthFilter', window.parent.document).val(monthHalftext[idx4]);
 
                                wpc = idx;
                                year = idx3;
                                month = idx4;
                            }
                        }
                    }
                }
            }
           
        }
    }
    else{
        if(month != 'all'){
            month = textMonthtoNum[month];
        }
    }
 
    refreshInformation(wpc, district, year, month, lcm);
}
 
var monthArr = {0:'01',1:'02',2:'03',3:'04',4:'05',5:'06',6:'07',7:'08',8:'09',9:'10',10:'11',11:'12'}
var d = new Date();
var currMth = monthArr[d.getMonth()];
var currYr = d.getFullYear();
 
function updateCard(data){
    var offerLand = `<span class="clickableCard" onclick="conOpLink()">`+((data.offerLand) ? data.offerLand : '0/0')+`</span>`;
    var offerStructure = `<span class="clickableCard" onclick="conOpLink()">`+((data.offerStructure) ? data.offerStructure : '0/0')+`</span>`;
    var paymentLand = `<span class="clickableCard" onclick="conOpLink()">`+((data.paymentLand) ? data.paymentLand : '0/0')+`</span>`;
    var paymentStructure = `<span class="clickableCard" onclick="conOpLink()">`+((data.paymentStructure) ? data.paymentStructure : '0/0')+`</span>`;
    var demolishStructure = `<span class="clickableCard" onclick="conOpLink()">`+((data.demolishedStructure) ? data.demolishedStructure : '0/0')+`</span>`;
 
    $("#offerLand").html(offerLand);
    $("#offerStructure").html(offerStructure);
    $("#paymentLand").html(paymentLand);
    $("#paymentStructure").html(paymentStructure);
    $("#demolishStructure").html(demolishStructure);
}
 
function refreshInformation(packid = 'overall', dist = 'allDistrict', year = 'all', month = 'all', lcmNo = 'allNo'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year+ " - LCM NO:" +lcmNo+ " - District:" +dist;
 
    var dataForChart = (landData.summary && landData.summary[packid] && landData.summary[packid][dist] && landData.summary[packid][dist].chart) ? landData.summary[packid][dist].chart : [];
 
    var offerChart = (dataForChart[year] && dataForChart[year][month] && dataForChart[year][month].offerIssued) ? dataForChart[year][month].offerIssued : [];
    drawLandChart("offerIssuedChart", offerChart, dataYearMonth);
    var paymentChart = (dataForChart[year] && dataForChart[year][month] && dataForChart[year][month].paymentMade) ? dataForChart[year][month].paymentMade : [];
    drawLandChart("paymentChart", paymentChart, dataYearMonth);
    var demolisedChart = (dataForChart[year] && dataForChart[year][month] && dataForChart[year][month].demolished) ? dataForChart[year][month].demolished : [];
    drawLandChart("demolisedChart", demolisedChart, dataYearMonth);
 
    var dataBefore = (landData.summary && landData.summary[packid] && landData.summary[packid][dist]) ? landData.summary[packid][dist] : [];
    var cardInfo = (dataBefore && dataBefore.card && dataBefore.card[year] && dataBefore.card[year][month] && dataBefore.card[year][month][lcmNo]) ? dataBefore.card[year][month][lcmNo] : [];
    updateCard(cardInfo);
}
 
function populateLCMNoFilter(data) {
    var optHTML = '<option selected="true" value="allNo">- Choose LCM No -</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('#lcmNoFilter').html(optHTML);
 
    //POPULATE FILTER OUTSIDE IFRAME (V3)
    var optHTMLV3 = '<option selected="true" value="allNo">Select LCM No</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTMLV3 += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('#lcmNoFilterId', window.parent.document).html(optHTMLV3);
}
 
function populateDistrictFilter(data) {
    var optHTML = '<option selected="true" value="allDistrict">- Choose District -</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('#disFilter').html(optHTML);
 
    //POPULATE FILTER OUTSIDE IFRAME (V3)
    var optHTMLV3 = '<option selected="true" value="allDistrict">Select District</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTMLV3 += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('#districtFilterId', window.parent.document).html(optHTMLV3);
}
 
$(document).ready(function(){
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "land"
        },
        success: function (obj) {
 
            if (obj.status && obj.status == 'ok') {
                var data = obj.data;
                landData = data;
 
                var LCMData = (landData.filterLCM && landData.filterLCM['overall'] && landData.filterLCM['overall']['allDistrict'] && landData.filterLCM['overall']['allDistrict']['all'] && landData.filterLCM['overall']['allDistrict']['all']['all']) ? landData.filterLCM['overall']['allDistrict']['all']['all'] : [];
                populateLCMNoFilter(LCMData);
 
                var districtData = (landData.filterDistrict && landData.filterDistrict['overall'] && landData.filterDistrict['overall']['discFilter']) ? landData.filterDistrict['overall']['discFilter'] : [];
                populateDistrictFilter(districtData);
 
                refreshInformation();
            }
        }
    });
 
    $("#wpcFilter").change(function () {
        var selDis = $("#disFilter").val();
        var selYear = $('#yearFilter').val();
        var selMonth = $('#monthFilter').val();
 
        var data = (landData.filterLCM && landData.filterLCM[$(this).val()] && landData.filterLCM[$(this).val()][selDis]) ? landData.filterLCM[$(this).val()][selDis] : [];
        var lcmData = (data && data[selYear] && data[selYear][selMonth]) ? data[selYear][selMonth] : [];
        populateLCMNoFilter(lcmData);
 
        var dataDistrict = (landData.filterDistrict && landData.filterDistrict[$(this).val()]) ? landData.filterDistrict[$(this).val()] : [];
        var districtData = (dataDistrict && dataDistrict.discFilter) ? dataDistrict.discFilter : [];
        populateDistrictFilter(districtData);
 
        refreshDashboard()
 
    })
 
    $("#yearFilter").change(function () {
        var selWPC = $("#wpcFilter").val();
        var selDis = $("#disFilter").val();
        var selMonth = $('#monthFilter').val();
 
        var data = (landData.filterLCM && landData.filterLCM[selWPC] && landData.filterLCM[selWPC][selDis]) ? landData.filterLCM[selWPC][selDis] : [];
        var thisVal = $(this).val();
        if(thisVal == 'all') selMonth = 'all';
        var lcmData = (data && data[$(this).val()] && data[$(this).val()][selMonth]) ? data[$(this).val()][selMonth] : [];
        populateLCMNoFilter(lcmData);
        refreshDashboard()
 
    })
 
    $("#monthFilter").change(function () {
        var selWPC = $("#wpcFilter").val();
        var selDis = $("#disFilter").val();
        var selYear = $('#yearFilter').val();
 
        var data = (landData.filterLCM && landData.filterLCM[selWPC] && landData.filterLCM[selWPC][selDis]) ? landData.filterLCM[selWPC][selDis] : [];
 
        var lcmData = (data && data[selYear] && data[selYear][$(this).val()] && data[selYear][$(this).val()]) ? data[selYear][$(this).val()] : [];
        populateLCMNoFilter(lcmData);
        refreshDashboard()
 
    })
 
    $("#lcmNoFilter").change(function () {
        var selLCM = $("#lcmNoFilter").val();
        var selWPC = $("#wpcFilter").val();
 
        var dataChoose = (landData.filterLCM && landData.filterLCM['changeFilter']) ? landData.filterLCM['changeFilter'] : [];
 
        for (const [idx, ele] of Object.entries(dataChoose)) {
            if(idx == selWPC){
                for (const [idx2, ele2] of Object.entries(ele)) {
               
                    for (const [idx3, ele3] of Object.entries(ele2)) {
                       
                        for (const [idx4, ele4] of Object.entries(ele3)) {
                           
                            for (const [idx5, ele5] of Object.entries(ele4)) {
                                if(selLCM != ele5) continue;
                                $("#wpcFilter").val(idx);
                                $('#yearFilter').val(idx3);
                                $('#monthFilter').val(idx4);
                            }
                        }
                    }
                }
            }
           
        }
        refreshDashboard()
    })
 
    $("#disFilter").change(function () {
        var selWPC = $("#wpcFilter").val();
        var selYear = $('#yearFilter').val();
        var selMonth = $('#monthFilter').val();
 
        var data = (landData.filterLCM && landData.filterLCM[selWPC] && landData.filterLCM[selWPC][$(this).val()]) ? landData.filterLCM[selWPC][$(this).val()] : [];
        var lcmData = (data && data[selYear] && data[selYear][selMonth]) ? data[selYear][selMonth] : [];
 
        populateLCMNoFilter(lcmData);
        if(lcmData.length > 0){
            if(selYear != 'all' && selMonth != 'all'){
                for (const [idx, ele] of Object.entries(lcmData)) {
                    $('#lcmNoFilter').val(ele);
                }
            }
        }
 
        refreshDashboard()
 
    })
 
    window.addEventListener('message', function(event) {
        const data = event.data;
        if (data.command === 'printAllCharts') {
            const chartIdsToPrint = ['offerIssuedChart', 'paymentChart', 'demolisedChart'];
            const monthYear = "all"; 
            printMultipleCharts(chartIdsToPrint, monthYear);
        }
    });
})
 
/**
 * Print chart modified functions
 * per charts
 * @author Kimberly Umali
 */
function printChart(divId, monthYear, chart) {
  try {

    const xAxis = chart.xAxis[0];
    const extremes = xAxis.getExtremes();
    const totalRange = (extremes.max - extremes.min) || 1;
 
    // Locate scrollable container
    let scrollEl =
    chart.container.closest('.highcharts-scrolling') ||
    (chart.container.parentElement &&
     chart.container.parentElement.querySelector('.highcharts-scrolling'));
     
    // compute scrollPx, visibleWidthPx, fullWidthPx (fall back to helper)
    let scrollPx = 0;
    let visibleWidthPx = chart.plotWidth;
    let fullWidthPx = chart.plotWidth;
 
    if (scrollEl) {
      scrollPx = scrollEl.scrollLeft;
      visibleWidthPx = scrollEl.clientWidth;
      fullWidthPx = scrollEl.scrollWidth;
    } else {
      // use your helper if container isn't found
      const helperOffset = (typeof getHighchartsScrollOffset === 'function')
        ? getHighchartsScrollOffset(chart) || 0
        : 0;
      scrollPx = helperOffset;
 
      if (typeof chart.scrollablePixelsX === 'number' && chart.scrollablePixelsX > 0) {
        fullWidthPx = chart.plotWidth + chart.scrollablePixelsX;
      } else {
        try {
          let maxBBoxWidth = 0;
          chart.series.forEach(s => {
            if (s.group && typeof s.group.getBBox === 'function') {
              const bb = s.group.getBBox();
              if (bb && bb.width) maxBBoxWidth = Math.max(maxBBoxWidth, (bb.x || 0) + bb.width);
            }
          });
          if (maxBBoxWidth > 0) fullWidthPx = Math.max(fullWidthPx, maxBBoxWidth);
        } catch (e) { }
      }
      visibleWidthPx = chart.plotWidth;
    }
 
    if (!fullWidthPx || isNaN(fullWidthPx) || fullWidthPx <= 0) fullWidthPx = visibleWidthPx;

    // exact pixels no rounding
    const visibleFraction = visibleWidthPx / fullWidthPx;
    let visibleMin = extremes.min + (scrollPx / fullWidthPx) * totalRange;
    let visibleMax = visibleMin + (totalRange * visibleFraction);
 
    // Clamp to bounds
    visibleMin = Math.max(extremes.min, Math.min(extremes.max, visibleMin));
    visibleMax = Math.max(extremes.min, Math.min(extremes.max, visibleMax));
 
    // export dimensions
    // const svgWidth = Math.max(600, Math.round(visibleWidthPx)); // fallback min ORII
    const svgWidth = Math.max(600, visibleWidthPx);
    const svgHeight = 500;
 
    // clone light weight
    const baseOpts = Highcharts.merge({}, chart.options);
 
    if (baseOpts.chart) {
      baseOpts.chart = Highcharts.merge({}, baseOpts.chart);
      delete baseOpts.chart.events;
 
      delete baseOpts.chart.renderTo;
 
      baseOpts.chart.animation = false;
    } else {
      baseOpts.chart = { animation: false };
    }
 
    baseOpts.series = (chart.series || []).map(s => Highcharts.merge({}, s.options || {}));
 
    // print specific layout into the clone options
    baseOpts.chart.width = svgWidth;
    baseOpts.chart.height = svgHeight;
    baseOpts.chart.spacingBottom = 80; // reserve space for legendssss
 
    baseOpts.title = Highcharts.merge({}, baseOpts.title || {});
    baseOpts.title.text = null;
 
    baseOpts.legend = Highcharts.merge({}, baseOpts.legend || {}, {
        align: 'center',            // Centers the legend block horizontally
        verticalAlign: 'bottom',    // Places it below the chart
        layout: 'horizontal',       // Allows items to flow left-to-right
        floating: false,            // Keeps it in the reserved space (no overlapping)
        // --- FIXES ---
        x: 0,                       // RESET THIS TO 0. 'center' handles the math for you.
        width: null,                // Setting to null allows it to calculate based on chart width
        maxHeight: 100,             // Prevents legend from eating the whole chart if items are huge
        navigation: {
            enabled: true           // Adds "Next/Prev" arrows if the legend still exceeds maxHeight
        },
        // --------------
        useHTML: false, 
        margin: 20, 
        padding: 5,
        symbolPadding: 8,
        itemMarginTop: 5,
        itemMarginBottom: 5,
        itemStyle: {
            fontSize: '9px',       
            fontWeight: 'normal',
            textOverflow: 'ellipsis'
        }
    });
    // temp container
    const tmpDiv = document.createElement('div');
    tmpDiv.style.position = 'absolute';
    tmpDiv.style.left = '-9999px';
    tmpDiv.style.top = '-9999px';
    tmpDiv.style.width = svgWidth + 'px';
    tmpDiv.style.height = svgHeight + 'px';
    document.body.appendChild(tmpDiv);
 
    const cloneChart = Highcharts.chart(tmpDiv, baseOpts);
 
    if (cloneChart && cloneChart.xAxis && cloneChart.xAxis[0]) {
      try {
        cloneChart.xAxis[0].setExtremes(visibleMin, visibleMax, false, false);
        cloneChart.redraw(false);
      } catch (e) {}
    }
 
    const svg = cloneChart.getSVG({
      exporting: { sourceWidth: svgWidth, sourceHeight: svgHeight },
      chart: { width: svgWidth, height: svgHeight }
    });
 
    try { cloneChart.destroy(); } catch (e) { /* ignore */ }
    try { tmpDiv.parentNode && tmpDiv.parentNode.removeChild(tmpDiv); } catch (e) { /* ignore */ }
 
    //  print window with styling
    const printWindow = window.open('', '_blank');
    printWindow.document.write(
        '<html>' +
        '  <head>' +
        '    <title>Chart Preview</title>' +
        '    <style>' +
        '      @media print {' +
        '        @page { size: landscape; margin: 10mm; }' +
        '        body { margin: 0; padding: 0; }' +
        '        svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }' +
        '        .highcharts-root { overflow: visible !important; }' +
        '        .highcharts-root text,' +
        '        .highcharts-label text,' +
        '        .highcharts-data-label text {' +
        '          fill: black !important;' +
        '        }' +
        '      }' +
        '      body { margin: 0; padding: 10px; text-align: center; font-family: sans-serif; }' +
        '      .chart-title {' +
        '        font-size: 12px;' +
        '        line-height: 1.2;' +
        '        margin-bottom: 6px;' +
        '      }' +
        '      .chart-container {' +
        '        width: 100%;' +
        '        height: auto;' +
        '        display: flex;' +
        '        justify-content: center;' +
        '        align-items: center;' +
        '        padding-bottom: 20px;' +
        '      }' +
        '      .highcharts-root text,' +
        '      .highcharts-label text,' +
        '      .highcharts-data-label text {' +
        '        fill: black !important;' +
        '      }' +
        '    </style>' +
        '  </head>' +
        '  <body>' +
        '    <div class="chart-title">' +
        '      <strong>Land Summary Dashboard</strong><br>' + localStorage.p_name + '<br>' +
        '      (' + divId + ' - ' + monthYear + ')' +
        '    </div>' +
        '    <div class="chart-container">' + svg + '</div>' +
        '  </body>' +
        '</html>'
    );
    printWindow.document.close();
 
    printWindow.onload = function () {
      printWindow.focus();
 
      const beforeUnloadHandler = () => printWindow.close();
      printWindow.addEventListener('beforeunload', beforeUnloadHandler);
 
      const closeIfCanceled = setTimeout(() => {
        try { if (!printWindow.closed) printWindow.close(); } catch (e) {}
      }, 1200);
 
      printWindow.print();
 
      printWindow.onafterprint = function () {
        clearTimeout(closeIfCanceled);
        try { printWindow.close(); } catch (e) {}
        printWindow.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    };
 
  } catch (err) {
    console.error('printChart (clone) failed, falling back to original approach:', err);
    try {
      const svg = chart.getSVG();
      const w = window.open('', '_blank');
      w.document.write(`<html><body>${svg}</body></html>`);
      w.document.close();
      w.onload = function () { w.print(); w.onafterprint = () => w.close(); };
    } catch (err2) {
      console.error('fallback export failed:', err2);
      alert('Export failed: ' + (err2 && err2.message));
    }
  }
}

function getChartSVG(divId, monthYear, chart) {
  try {

    const xAxis = chart.xAxis[0];
    const extremes = xAxis.getExtremes();
    const totalRange = (extremes.max - extremes.min) || 1;
 
    // Locate scrollable container
    let scrollEl =
    chart.container.closest('.highcharts-scrolling') ||
    (chart.container.parentElement &&
     chart.container.parentElement.querySelector('.highcharts-scrolling'));
 
    // compute scrollPx, visibleWidthPx, fullWidthPx (fall back to helper)
    let scrollPx = 0;
    let visibleWidthPx = chart.plotWidth;
    let fullWidthPx = chart.plotWidth;
 
    if (scrollEl) {
      scrollPx = scrollEl.scrollLeft;
      visibleWidthPx = scrollEl.clientWidth;
      fullWidthPx = scrollEl.scrollWidth;
    } else {
      // use your helper if container isn't found
      const helperOffset = (typeof getHighchartsScrollOffset === 'function')
        ? getHighchartsScrollOffset(chart) || 0
        : 0;
      scrollPx = helperOffset;
 
      if (typeof chart.scrollablePixelsX === 'number' && chart.scrollablePixelsX > 0) {
        fullWidthPx = chart.plotWidth + chart.scrollablePixelsX;
      } else {
        try {
          let maxBBoxWidth = 0;
          chart.series.forEach(s => {
            if (s.group && typeof s.group.getBBox === 'function') {
              const bb = s.group.getBBox();
              if (bb && bb.width) maxBBoxWidth = Math.max(maxBBoxWidth, (bb.x || 0) + bb.width);
            }
          });
          if (maxBBoxWidth > 0) fullWidthPx = Math.max(fullWidthPx, maxBBoxWidth);
        } catch (e) { }
      }
      visibleWidthPx = chart.plotWidth;
    }
 
    if (!fullWidthPx || isNaN(fullWidthPx) || fullWidthPx <= 0) fullWidthPx = visibleWidthPx;

    // exact pixels no rounding
    const visibleFraction = visibleWidthPx / fullWidthPx;
    let visibleMin = extremes.min + (scrollPx / fullWidthPx) * totalRange;
    let visibleMax = visibleMin + (totalRange * visibleFraction);
 
    // Clamp to bounds
    visibleMin = Math.max(extremes.min, Math.min(extremes.max, visibleMin));
    visibleMax = Math.max(extremes.min, Math.min(extremes.max, visibleMax));
 
    // export dimensions
    // const svgWidth = Math.max(600, Math.round(visibleWidthPx)); // fallback min ORII
    const svgWidth = Math.max(600, visibleWidthPx);
    const svgHeight = 500;
 
    // clone light weight
    const baseOpts = Highcharts.merge({}, chart.options);
 
    if (baseOpts.chart) {
      baseOpts.chart = Highcharts.merge({}, baseOpts.chart);
      delete baseOpts.chart.events;
 
      delete baseOpts.chart.renderTo;
 
      baseOpts.chart.animation = false;
    } else {
      baseOpts.chart = { animation: false };
    }
 
    baseOpts.series = (chart.series || []).map(s => Highcharts.merge({}, s.options || {}));
 
    // print specific layout into the clone options
    baseOpts.chart.width = svgWidth;
    baseOpts.chart.height = svgHeight;
    baseOpts.chart.spacingBottom = 80; // reserve space for legendssss
 
    baseOpts.title = Highcharts.merge({}, baseOpts.title || {});
    baseOpts.title.text = null;
 
    baseOpts.legend = Highcharts.merge({}, baseOpts.legend || {}, {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      floating: false,
      width: '100%', 
      itemWidth: null, // Essential: tells Highcharts not to restrict item width
      useHTML: false, // This is often used to ensure proper rendering in the SVG export process
      x: 225, // centered legends | per chart
      margin: 10,
      y: 10,
      symbolPadding: 8,
      itemMarginTop: 4,
      itemMarginBottom: 4,
      itemStyle: {
          fontSize: '12px'
      }
    });
 
    // temp container
    const tmpDiv = document.createElement('div');
    tmpDiv.style.position = 'absolute';
    tmpDiv.style.left = '-9999px';
    tmpDiv.style.top = '-9999px';
    tmpDiv.style.width = svgWidth + 'px';
    tmpDiv.style.height = svgHeight + 'px';
    document.body.appendChild(tmpDiv);
 
    const cloneChart = Highcharts.chart(tmpDiv, baseOpts);
 
    if (cloneChart && cloneChart.xAxis && cloneChart.xAxis[0]) {
      try {
        cloneChart.xAxis[0].setExtremes(visibleMin, visibleMax, false, false);
        cloneChart.redraw(false);
      } catch (e) {}
    }
 
    // At the end of the cloning and SVG generation:
    const svg = cloneChart.getSVG({
        exporting: { sourceWidth: svgWidth, sourceHeight: svgHeight },
        chart: { width: svgWidth, height: svgHeight }
    });

    try { cloneChart.destroy(); } catch (e) { /* ignore */ }
    try { tmpDiv.parentNode && tmpDiv.parentNode.removeChild(tmpDiv); } catch (e) { /* ignore */ }
    
    // Construct the title HTML that was being used in the print window:
    const titleHtml = `
        <div class="chart-title">
            <strong>Land Summary Dashboard</strong><br>
            ${localStorage.p_name}<br>
            (${divId} - ${monthYear})
        </div>
    `;

    return { 
        titleHtml: titleHtml, 
        svg: svg 
    };
 
  } catch (err) {
    console.error('printChart (clone) failed, falling back to original approach:', err);
    try {
      const svg = chart.getSVG();
      const w = window.open('', '_blank');
      w.document.write(`<html><body>${svg}</body></html>`);
      w.document.close();
      w.onload = function () { w.print(); w.onafterprint = () => w.close(); };
    } catch (err2) {
      console.error('fallback export failed:', err2);
      alert('Export failed: ' + (err2 && err2.message));
    }
  }
}
 
// Helper function for fallback scroll detection ORIII
function getHighchartsScrollOffset(chart) {
  const scrollEl =
    chart.container.closest('.highcharts-scrolling') ||
    (chart.container.parentElement &&
     chart.container.parentElement.querySelector('.highcharts-scrolling'));
  if (scrollEl) return scrollEl.scrollLeft || 0;
 
  const inner = chart.container.querySelector('.highcharts-inner-container');
  if (inner && inner.style.transform) {
    const m = inner.style.transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
    if (m) return Math.abs(parseFloat(m[1]));
  }
 
  const groups = chart.container.querySelectorAll('svg g');
  for (const g of groups) {
    const t = g.getAttribute('transform');
    if (t) {
      const m = t.match(/translate\(\s*(-?\d+(?:\.\d+)?)/);
      if (m) return Math.abs(parseFloat(m[1]));
    }
  }
 
  return 0;
}

/**
 * fullscreen Exit Handler
 * forces to reflow
 */
function handleFullscreenExit() {
    if (!document.fullscreenElement) {
        if (window.landCharts) {
            Object.values(window.landCharts).forEach(chartInstance => {
                if (chartInstance && typeof chartInstance.reflow === 'function') {
                    chartInstance.reflow();
                }
            });
        }
    }
}

// listener for use of multiple browser
document.addEventListener('fullscreenchange', handleFullscreenExit);
document.addEventListener('webkitfullscreenchange', handleFullscreenExit);
document.addEventListener('mozfullscreenchange', handleFullscreenExit);
document.addEventListener('msfullscreenchange', handleFullscreenExit);