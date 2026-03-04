var stripMapData;
var chart1;
var chart2;
var chart3;
var maxChg;
var maxChgOrig;

//catch mousemove event and have all 3 charts' crosshairs move along indicated values on x axis
function syncronizeCrossHairs(chart) {
  var container = $(chart.container),
      offset = container.offset(),
      x, y, isInside, report;

  container.mousemove(function(evt) {

    x = evt.clientX - chart.plotLeft - offset.left;
    y = evt.clientY - chart.plotTop - offset.top;
    var xAxis = chart.xAxis[0];
    //remove old plot line and draw new plot line (crosshair) for this chart
    var xAxis1 = chart1.xAxis[0];
    xAxis1.removePlotLine("myPlotLineId");
    xAxis1.addPlotLine({
        value: chart.xAxis[0].translate(x, true),
        width: 2,
        zIndex: 10,
        color: 'blue',
        //dashStyle: 'dash',                   
        id: "myPlotLineId"
    });
    //remove old crosshair and draw new crosshair on chart2
    var xAxis2 = chart2.xAxis[0];
    xAxis2.removePlotLine("myPlotLineId");
    xAxis2.addPlotLine({
        value: chart.xAxis[0].translate(x, true),
        width: 2,
        zIndex: 10,
        color: 'blue',
        //dashStyle: 'dash',                   
        id: "myPlotLineId"
    });

    var xAxis3 = chart3.xAxis[0];
    xAxis3.removePlotLine("myPlotLineId");
    xAxis3.addPlotLine({
        value: chart.xAxis[0].translate(x, true),
        width: 2,
        zIndex: 10,
        color: 'blue',
        //dashStyle: 'dash',                   
        id: "myPlotLineId"
    });

    //if you have other charts that need to be syncronized - update their crosshair (plot line) in the same way in this function.                   
  });
}

function getLegendColor(cat, val){
  var color = '#FEFEFE';
  switch (cat) {
    case 'e1':
      if(val <= 2500){
        color = 'red';
      }else if(val <= 3500){
        color = 'yellow';
      }else{
        color = 'green';
      }
      break;

    case 'e2':
      if(val < 1){
        color = 'red';
      }else if(val <= 2){
        color = 'yellow';
      }else{
        color = 'green';
      }
      break;

    case 'e3':
      if(val < 1){
        color = 'red';
      }else if(val <= 1.5){
        color = 'yellow';
      }else{
        color = 'green';
      }
      break;

    case 'es':
      if(val < 50){
        color = 'red';
      }else if(val <= 100){
        color = 'yellow';
      }else{
        color = 'green';
      }
      break;
        
    case 'iri':
      if(val <= 2.5){
        color = 'green';
      }else if(val <= 3.5){
        color = 'yellow';
      }else if(val <= 4.5){
        color = 'orange';
      }else{
        color = 'red';
      }
      break;

    case 'rutting':
      if(val <= 10){
        color = 'green';
      }else if(val <= 15){
        color = 'yellow';
      }else if(val <= 25){
        color = 'orange';
      }else{
        color = 'red';
      }
      break;

    case 'crack':
      if(val <= 5.1){
        color = 'green';
      }else if(val <= 10.1){
        color = 'yellow';
      }else if(val <= 15.1){
        color = 'orange';
      }else{
        color = 'red';
      }
      break;
  }
  return color;
}

function drawMlpChart(data, date){
  var dataArr = [];

  // get values between key
  let firstKey = parseInt(Object.keys(data)[0]);
  let secondKey = parseInt(Object.keys(data)[1]);
  let tickInt = secondKey - firstKey;
  
  for (const [idx, ele] of Object.entries(data)) {
    dataArr.push({x:parseInt(idx), y:0, ttext: 'CH '+idx+ ', ' + parseFloat(ele.iri) + " m/km", color: getLegendColor('iri', ele.iri)});
    dataArr.push({x:parseInt(idx), y:1, ttext: 'CH '+idx+ ', ' + parseFloat(ele.rutting) + " mm", color: getLegendColor('rutting', ele.rutting)});
    dataArr.push({x:parseInt(idx), y:2, ttext: 'CH '+idx+ ', ' + parseFloat(ele.all_crack) + " %", color: getLegendColor('crack', ele.all_crack)});
  }  
  chart1 = new Highcharts.Chart({
    chart: {
      renderTo: 'mlpChart',
      type: 'heatmap',
      plotBorderWidth: 1
    },
    title: {
      text: ''
    },
    subtitle: {
      text: 'Date :' + date
    },
    credits:{enabled:false},
    yAxis: [
      {
        tickLength: 50,
        tickWidth: 2,
        title: null,
        categories: ['m/km', 'mm', '%'],
        labels:{
          style: {
            fontSize: 8
          }
        },
      },{
        //Border to close the axis
        linkedTo: 0,
        tickLength: 0,
        tickWidth: 2,
        opposite: false,
        title: null,
        lineWidth: 2,
        categories: [' ',' ',' '],
      },{
        linkedTo: 0,
        tickLength: 70,
        tickWidth: 2,
        title: null,
        categories: ['IRI', 'Rutting', 'All Cracks'],
        labels:{
          style: {
            fontSize: 8
          }
        },
      },{
        //Border to close the axis
        linkedTo: 0,
        tickLength: 0,
        tickWidth: 2,
        opposite: false,
        title: null,
        lineWidth: 2,
        categories: [' ',' ',' '],
      }
    ],
    xAxis: [
      {
        tickLength: 5,
        tickWidth: 2,
        min: firstKey,
        max: parseFloat(maxChg),
        startOnTick: true,
        endOnTick: false,
        showLastLabel: true,
        opposite: true,
        tickInterval: tickInt,
        labels:{
          rotation: 270,
          style: {
            fontSize: 8
          }
        }
      }
    ],
    plotOptions: {
      series: {},
      heatmap: {
        // shared options for all heatmap series
        borderColor: '#ffffff',
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    tooltip: {
      formatter: function () {
        return this.point.ttext;
    }
    },
    series: [{
      type: 'heatmap',
      colsize: tickInt,
      borderWidth: 1,
      name: '',
      borderColor: '#fff',
      data: dataArr
    }]

  }, function(chart) { syncronizeCrossHairs(chart);});
}

function drawRubiconChart(data, date){
  var dataArr = [];

  // get values between key
  let firstKey = parseInt(Object.keys(data)[0]);
  let secondKey = parseInt(Object.keys(data)[1]);
  let tickInt = secondKey - firstKey;

  for (const [idx, ele] of Object.entries(data)) {
    dataArr.push({x:parseInt(idx), y:0, ttext: 'CH '+idx+ ', ' + ele.rmt_asphalt_e1 + " MPa", color: getLegendColor('e1', ele.rmt_asphalt_e1)});  // rmt_asphalt_e1 (0)
    dataArr.push({x:parseInt(idx), y:1, ttext: 'CH '+idx+ ', ' + ele.e2_calc + " MPa", color: getLegendColor('e2', ele.e2_calc)});  // e2_calc (1)
    dataArr.push({x:parseInt(idx), y:2, ttext: 'CH '+idx+ ', ' + ele.e3_calc + " MPa", color: getLegendColor('e3', ele.e3_calc)});  // e3_calc (2)
    dataArr.push({x:parseInt(idx), y:3, ttext: 'CH '+idx+ ', ' + ele.rmt_subgrade_es + " MPa", color: getLegendColor('es', ele.rmt_subgrade_es)});  // rmt_subgrade_es (3)
  }  

  chart2 = new Highcharts.Chart({
    chart: {
      renderTo: 'rubiconChart',
      type: 'heatmap',
      plotBorderWidth: 1
    },
    title: {
      text: ''
    },
    subtitle: {
      text: 'Date :' + date
    },
    credits:{enabled:false},
    yAxis: [
      {
        tickLength: 120,
        tickWidth: 2,
        title: null,
        categories: ['Asphalt', 'Base Layer', 'Sub-base Layer', 'SubGrade'],
        labels:{
          style: {
            fontSize: 8
          }
        },
      },{
        //Border to close the axis
        linkedTo: 0,
        tickLength: 0,
        tickWidth: 2,
        opposite: false,
        title: null,
        lineWidth: 2,
        categories: [' ',' ',' ',' '],
      }
    ],
    xAxis: [
      {
        tickLength: 5,
        tickWidth: 2,
        min: firstKey,
        max: parseFloat(maxChg),
        startOnTick: true,
        endOnTick: false,
        showLastLabel: true,
        opposite: true,
        tickInterval: tickInt,
        labels:{
          style: {
            fontSize: 8
          }
        }
      }
    ],
    plotOptions: {
      series: {},
      heatmap: {
        // shared options for all heatmap series
        borderColor: '#ffffff',
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    tooltip: {
      formatter: function () {
        return this.point.ttext;
    }
    },
    series: [{
      type: 'heatmap',
      colsize: tickInt,
      borderWidth: 1,
      name: '',
      borderColor: '#fff',
      data: dataArr
    }]

  }, 
    function(chart) { //add this function to the chart definition to get synchronized crosshairs
      //this function needs to be added to each syncronized chart 
      syncronizeCrossHairs(chart);
    }
  );
}

function drawFwdChart(data, date){
  var dataArr = [];
  var catArr = [];
  var catArrBorder = [];

  // get values between key
  let firstKey = Object.keys(data)[0];
  let secondKey = Object.keys(data)[1];
  let tickInt = secondKey - firstKey;

  // var minVal = (typeof secondKey == "undefined") ? 0 : -1*secondKey/2;
  // var maxVal =  (typeof secondKey == "undefined") ? 0 : maxChg+(secondKey/2);
  var minVal = parseInt(firstKey) - 125;
  var maxVal =  (typeof secondKey == "undefined") ? 0 : maxChg+(tickInt/2);

  for (const [idx, ele] of Object.entries(data)) {
    catArr.push(parseFloat(idx)); 
    catArrBorder.push(''); 
    var tempArr = [parseFloat(idx), (ele.fwd_d1) ? parseFloat(ele.fwd_d1) : 0];
    dataArr.push(tempArr);
  }

  chart3 = new Highcharts.Chart({
    chart: {
      renderTo: 'fwdChart',
      type: 'line',
      zoomType: 'x',
      marginLeft: 130,
      events: {
        selection: function(event) { //this function should zoom chart1, chart2, chart3
            var xMin = event.xAxis[0].min;
            var xMax = event.xAxis[0].max;
            chart2.xAxis[0].setExtremes(xMin, xMax, true);
            chart3.xAxis[0].setExtremes(xMin, xMax, true);
        }
      }
    },
    title: {
      text: ''
    },
    subtitle: {
      text: 'Date :' + date
    },
    credits:{enabled:false},
    xAxis: {
      labels:{
        style: {
          fontSize: 8
        }
      },
      tickLength: 5,
      tickWidth: 2,
      tickInterval:tickInt,
      min: minVal,
      max: maxVal,
      startOnTick: false,
      endOnTick: false,
      showLastLabel: true,
      opposite: false,
      categories: catArr,
      tickMarkPlacement: 'between',
    }
  ,
    legend: {
      enabled : false
    },
    yAxis: {
      title: { text: ''}
    },
    tooltip: {
      formatter: function() {return 'CH ' + this.x + ', ' + this.y + ' µm';}
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          states: {
              hover: {enabled: true,lineColor: 'rgb(100,100,100)'}
          }
        },
        states: {
          hover: {
              marker: {enabled: false}
          }
        }
      }
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'FWD Central Deflection',
      // color: 'rgba(119, 152, 191, .5)',
      data: dataArr
    }]
  }, 
    function(chart) { //add this function to the chart definition to get synchronized crosshairs
    //this function needs to be added to each syncronized chart 
      syncronizeCrossHairs(chart);
    }
  ),{};
}

function refreshInformation(selDirection, selLane, max, min){
  selLane = (selLane == 'Fast Lane') ? 'Fast' : 'Slow';
  maxChg = (max) ? max : maxChgOrig;
  // get max value for chainage
  var fwdData = (stripMapData.fwd && stripMapData.fwd[selDirection] && stripMapData.fwd[selDirection][selLane]) ? stripMapData.fwd[selDirection][selLane] : [];
  var fwdDate = (stripMapData.currDate && stripMapData.currDate.fwd) ? stripMapData.currDate.fwd : stripMapData.currDate.fwd;
  var rmtData = (stripMapData.rmt && stripMapData.rmt[selDirection] && stripMapData.rmt[selDirection][selLane]) ? stripMapData.rmt[selDirection][selLane] : [];
  var rmtDate = (stripMapData.currDate && stripMapData.currDate.rmt) ? stripMapData.currDate.rmt : stripMapData.currDate.rmt;
  var mlpData = (stripMapData.mlp && stripMapData.mlp[selDirection] && stripMapData.mlp[selDirection][selLane]) ? stripMapData.mlp[selDirection][selLane] : [];
  var mlpDate = (stripMapData.currDate && stripMapData.currDate.mlp) ? stripMapData.currDate.mlp : stripMapData.currDate.mlp;

  // clone object
  var fwdChartData = Object.assign({}, fwdData);;
  var rmtChartData = Object.assign({}, rmtData);;
  var mlpChartData = Object.assign({}, mlpData);;
  
  // both value exist
  min = (min) ? parseFloat(min) : 0;
  max = (max) ? parseFloat(max) : parseFloat(maxChg);
  for (const [key, value] of Object.entries(fwdData)) { if (parseFloat(key) < min || parseFloat(key) > max) delete fwdChartData[key]}
  for (const [key, value] of Object.entries(rmtData)) { if (parseFloat(key) < min || parseFloat(key) > max) delete rmtChartData[key]}
  for (const [key, value] of Object.entries(mlpData)) { if (parseFloat(key) < min || parseFloat(key) > max) delete mlpChartData[key]}

  
  drawFwdChart(fwdChartData, fwdDate);
  drawRubiconChart(rmtChartData, rmtDate);
  drawMlpChart(mlpChartData, mlpDate);
}

function refreshDashboard(){
  var selDirection = $('#directionFilter').val();
  var selLane = $('#laneFilter').val();
  var minChg = $('#chgFromFilter').val();
  var maxChg = $('#chgToFilter').val();

  refreshInformation(selDirection, selLane, maxChg, minChg);
}

function refreshFromv3 (filterArr){
	var assetDate = filterArr.assetDate;
	var assetLane = filterArr.assetLane;
	var assetChainFrom = filterArr.assetChainFrom;
	var assetChainTo = filterArr.assetChainTo;
	var assetDirection = filterArr.assetDirection;
  
  updateDatav3(assetDate, assetDirection, assetLane, assetChainTo, assetChainFrom)
}

function populateDateOptions(data, currDate) {
  var optHTML = '<option value="" selected></option>';
  if (data) {
      for (const [idx, ele] of Object.entries(data)) {
            if(ele !== ""){
              optHTML += '<option value="' + ele + '">' + ele + '</option>';
            }
      }
  }

  $('#dateFilter').html(optHTML);
  $('#dateFilter').val(currDate);
  window.parent.$('.assetDateFilter').html(optHTML);
  window.parent.$('.assetDateFilter option[value=""]').text('Select Date');
}

function populateChgOptions(data) {
  var optHTML = '<option value="" selected></option>';
  if (data) {
      for (const [idx, ele] of Object.entries(data)) {
          optHTML += '<option value="' + ele + '">' + ele + '</option>';
      }
  }

  $('.chgFilter').html(optHTML);
  window.parent.$('.assetChainFromFilter').html(optHTML);
  window.parent.$('.assetChainToFilter').html(optHTML);
  window.parent.$('.assetChainFromFilter option[value=""]').text('Select Chainage From');
  window.parent.$('.assetChainToFilter option[value=""]').text('Select Chainage To');
}

function updateData(){
  $.ajax({
		type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
			page: "PCA_Stripmap",
			func: "updateData",
      selDate: $('#dateFilter').val()
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
				stripMapData = obj.data;
        maxChg = (stripMapData.maxChg) ? stripMapData.maxChg : 0;
        refreshDashboard();
			}
		}
	});
}

function updateDatav3(assetDate, assetDirection, assetLane, assetChainTo, assetChainFrom){
  $.ajax({
		type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
			page: "PCA_Stripmap",
			func: "updateData",
      selDate: assetDate
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
				stripMapData = obj.data;
        maxChg = (stripMapData.maxChg) ? stripMapData.maxChg : 0;
        refreshInformation(assetDirection, assetLane, assetChainTo, assetChainFrom);
			}
		}
	});
}

$(document).ready(function() {
  $.ajax({
		type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
			page: "PCA_Stripmap"
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
				stripMapData = obj.data;
        maxChgOrig = (stripMapData.maxChg) ? stripMapData.maxChg : 0;
        populateDateOptions((stripMapData.dateOptions) ? stripMapData.dateOptions : 0, stripMapData.currDate);
        (localStorage.ui_pref == 'ri_v3') ? window.parent.refreshDash('myDashboard') : refreshDashboard();
        if(stripMapData.chgOptions){ populateChgOptions(stripMapData.chgOptions) }
			}
		}
	});
});