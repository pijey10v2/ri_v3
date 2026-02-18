var assetData;

function conOpLink(process, status){
  var linkName = '';
  var linkWinTitle = '';
  var linkParamArr = '';
  var cardName;
  
  switch (process) {
      case 'Bridge':
          linkWinTitle = 'Bridge'
          linkName = 'dash_asset_bridge_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
      case 'Drainage':
          linkWinTitle = 'Drainage'
          linkName = 'dash_asset_drainage_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
      case 'Slope':
          linkWinTitle = 'Slope'
          linkName = 'dash_asset_slope_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
      case 'Culvert':
          linkWinTitle = 'Culvert'
          linkName = 'dash_asset_culvert_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
      case 'Pavement':
          linkWinTitle = 'Pavement'
          linkName = 'dash_asset_pavement_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
      case 'Road':
          linkWinTitle = 'Road Furniture'
          linkName = 'dash_asset_road_furniture_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
      case 'Electrical':
          linkWinTitle = 'Electrical'
          linkName = 'dash_asset_electrical_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
      case 'Section':
          linkWinTitle = 'Total Length'
          linkName = 'dash_asset_section_card'
          linkParamArr = processFilterParamArr([status])
          if(status == ''){
            cardName = 'All'
          }
          break;
  }
  window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function updateCardType(br, cu, dr, pv, rf, sl, el){
  var sizeCU = 0;

  if(cu){
    sizeCU = Object.values(cu).reduce((sum, val) => sum + Number(val), 0);
  }

  var allBridgeCard = br;
  var allDrainageCard = dr;
  var allSlopeCard = sl;
  var allCulvertCard = sizeCU;
  var allPavementCard = pv;
  var allRoadCard = rf;
  var allElCard = el;
  
	if(allBridgeCard > 0){
    allBridgeCard = `<span class="clickableCard" onclick="conOpLink('Bridge', '')">`+br+`</span>`;
	}
  if(allDrainageCard > 0){
    allDrainageCard = `<span class="clickableCard" onclick="conOpLink('Drainage', '')">`+dr+`</span>`;
	}
  if(allSlopeCard > 0){
    allSlopeCard = `<span class="clickableCard" onclick="conOpLink('Slope', '')">`+sl+`</span>`;
	}
  if(allCulvertCard > 0){
    allCulvertCard = `<span class="clickableCard" onclick="conOpLink('Culvert', '')">`+sizeCU+`</span>`;
	}
  if(allPavementCard > 0){
    allPavementCard = `<span class="clickableCard" onclick="conOpLink('Pavement', '')">`+pv+`</span>`;
	}
  if(allRoadCard > 0){
    allRoadCard = `<span class="clickableCard" onclick="conOpLink('Road', '')">`+rf+`</span>`;
	}
  if(allElCard > 0){
		allElCard = `<span class="clickableCard" onclick="conOpLink('Electrical', '')">`+el+`</span>`;
	}

    $('#allBridge').html(allBridgeCard);
    $('#allCulvert').html(allCulvertCard);
    $('#allDrainage').html(allDrainageCard);
    $('#allPave').html(allPavementCard);
    $('#allRoad').html(allRoadCard);
    $('#allSlope').html(allSlopeCard);
    $('#allElectric').html(allElCard);
    

}

function drawChartAssetSection (dataBr, dataCu, dataDr, dataPv, dataRf, dataSl, dataEl, assetDivisions, parentFilter, totalAssetTitle){

    var catArr = [];
    var bridgeArr = [];
    var culvertArr = [];
    var drainArr = [];
    var pavementArr = [];
    var roadArr = [];
    var slopeArr = [];
    var electricalArr = [];
    var sizeCU = 0;
    var divisionPackageId = [];
    let isLogarithmic = false;
    
    if (dataBr) {

        // get packages that contains data
        for (const [idx, ele] of Object.entries(assetDivisions)) {
            if(dataBr[idx]){ divisionPackageId[idx] = ele; }
            if(dataCu[idx]){ divisionPackageId[idx] = ele; }
            if(dataDr[idx]){ divisionPackageId[idx] = ele; }
            if(dataPv[idx]){ divisionPackageId[idx] = ele; }
            if(dataRf[idx]){ divisionPackageId[idx] = ele; }
            if(dataSl[idx]){ divisionPackageId[idx] = ele; }
            if(dataEl[idx]){ divisionPackageId[idx] = ele; }
        }

        for (const [idx, ele] of Object.entries(divisionPackageId)) {   
            catArr.push(ele);
            if(dataBr[idx]){
                var col = dataBr[idx]['Bridge'];
                bridgeArr.push((col) ? parseInt(col) : 0);
                if(col > 50){
                  isLogarithmic = true;
                }
            }else{
                bridgeArr.push(0);
            }
        }

        for (const [idx, ele] of Object.entries(divisionPackageId)) {
            catArr.push(ele);
            if(dataCu[idx]){
                sizeCU = Object.keys(dataCu[idx]).length;
                culvertArr.push((sizeCU) ? parseInt(sizeCU) : 0);
                if(sizeCU > 50){
                  isLogarithmic = true;
                }
            }else{
                culvertArr.push(0);
            }
        }

        for (const [idx, ele] of Object.entries(divisionPackageId)) {
            catArr.push(ele);
            if(dataDr[idx]){
                var col = dataDr[idx]['Drainage'];
                drainArr.push((col) ? parseInt(col) : 0);
                if(col > 50){
                  isLogarithmic = true;
                }
            }else{
                drainArr.push(0);
            }
        }

        for (const [idx, ele] of Object.entries(divisionPackageId)) {
            catArr.push(ele);
            if(dataPv[idx]){
                var col = dataPv[idx]['Pavement'];
                pavementArr.push((col) ? parseInt(col) : 0);
                if(col > 50){
                  isLogarithmic = true;
                }
            }else{
                pavementArr.push(0);
            }
        }

        for (const [idx, ele] of Object.entries(divisionPackageId)) {
            catArr.push(ele);
            if(dataRf[idx]){
                var col = dataRf[idx]['Road Furniture'];
                roadArr.push((col) ? parseInt(col) : 0);
                if(col > 50){
                  isLogarithmic = true;
                }
            }else{
                roadArr.push(0);
            }
        }

        for (const [idx, ele] of Object.entries(divisionPackageId)) {
            catArr.push(ele);
            if(dataSl[idx]){
                var col = dataSl[idx]['Slope'];
                slopeArr.push((col) ? parseInt(col) : 0);
                if(col > 50){
                  isLogarithmic = true;
                }
            }else{
                slopeArr.push(0);
            }
        }

        for (const [idx, ele] of Object.entries(divisionPackageId)) {
            catArr.push(ele);
            if(dataEl[idx]){
                var col = dataEl[idx]['Electrical'];
                electricalArr.push((col) ? parseInt(col) : 0);
                if(col > 50){
                  isLogarithmic = true;
                }
            }else{
                electricalArr.push(0);
            }
        }
    }

    var chart = Highcharts.chart('barChartAsset', {
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
                                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Asset Statistic Dashboard<br>'+localStorage.p_name+'<br>'+totalAssetTitle+parentFilter+'</span>'
                            }
                        })
            
                        chart.updateFlag = true;
                    }
                    else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                            title: {
                                text: '<span class="showLabel">Asset Statistic Dashboard<br>'+localStorage.p_name+'<br>'+totalAssetTitle+parentFilter+'</span>'
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
          text: '<span class="showLabel">Asset Statistic Dashboard<br>'+localStorage.p_name+'<br>'+totalAssetTitle+parentFilter+'</span>'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: catArr,
          crosshair: true
        },
        yAxis: {
          allowDecimals: false,
          type: isLogarithmic ? 'logarithmic' : 'linear',
          minorTickInterval: isLogarithmic ? 0.1 : 0,
          startOnTick: false,
          title: {
            text: ''
          }
        },
        credits: false,
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
          followPointer: true,
          followTouchMove: true,
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          },
          series: {
            dataLabels: {
              formatter: function() {
                return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
              },
              enabled: true,
              useHTML: true,
            }
          }
        },
        series: [{
          name: 'Bridge',
          data: bridgeArr,
          color: Highcharts.getOptions().colors[0],
          cursor: 'pointer',
          dataLabels: {
            y: -10
          },
          events: {
            click: function (event) {
                linkWinTitle = 'Bridge'
                linkName = 'dash_asset_bridge_card'
                linkParamArr = processFilterParamArr([event.point.category.name])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Asset '+event.point.category.name);
            }
          }
      },
      {
          name: 'Culvert',
          data: culvertArr,
          color: Highcharts.getOptions().colors[1],
          cursor: 'pointer',
          dataLabels: {
            y: -10
          },
          events: {
            click: function (event) {
                linkWinTitle = 'Culvert'
                linkName = 'dash_asset_culvert_card'
                linkParamArr = processFilterParamArr([])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Asset');
            }
          }
      },
      {
          name: 'Drainage',
          data: drainArr,
          color: Highcharts.getOptions().colors[2],
          cursor: 'pointer',
          dataLabels: {
            y: -10
          },
          events: {
            click: function (event) {
                linkWinTitle = 'Drainage'
                linkName = 'dash_asset_drainage_card'
                linkParamArr = processFilterParamArr([])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Asset');
            }
          }
      },
      {
          name: 'Pavement',
          data: pavementArr,
          color: Highcharts.getOptions().colors[3],
          cursor: 'pointer',
          dataLabels: {
            y: -10
          },
          events: {
            click: function (event) {
                linkWinTitle = 'Pavement'
                linkName = 'dash_asset_pavement_card'
                linkParamArr = processFilterParamArr([])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Asset');
            }
          }
      },
      {
          name: 'Road Furniture',
          data: roadArr,
          color: Highcharts.getOptions().colors[4],
          cursor: 'pointer',
          dataLabels: {
            y: -10
          },
          events: {
            click: function (event) {
                linkWinTitle = 'Road Furniture'
                linkName = 'dash_asset_road_furniture_card'
                linkParamArr = processFilterParamArr([])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Asset');
            }
          }
      },
      {
          name: 'Slope',
          data: slopeArr,
          color: Highcharts.getOptions().colors[5],
          cursor: 'pointer',
          dataLabels: {
            y: -10
          },
          events: {
            click: function (event) {
                linkWinTitle = 'Slope'
                linkName = 'dash_asset_slope_card'
                linkParamArr = processFilterParamArr([])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Asset');
            }
          }
        },
        {
            name: 'Electrical',
            data: electricalArr,
            color: Highcharts.getOptions().colors[6],
            cursor: 'pointer',
            dataLabels: {
              y: -10
            },
            events: {
              click: function (event) {
                  linkWinTitle = 'Electrical'
                  linkName = 'dash_asset_electrical_card'
                  linkParamArr = processFilterParamArr([])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Asset');
              }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawRoadFurnitureType(data, parentFilter){
  var dataArr = [];
	if (data){
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
	}

	// Create the chart
	var chart = Highcharts.chart('rfByType', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Asset Statistic Dashboard<br>'+localStorage.p_name+'<br>ROAD FURNITURE BY TYPE'+parentFilter+'</span>'
                        }
                    })
        
                    chart.updateFlag = true;
                }
                else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                        title: {
                            text: '<span class="showLabel">Asset Statistic Dashboard<br>'+localStorage.p_name+'<br>ROAD FURNITURE BY TYPE'+parentFilter+'</span>'
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
      text: '<span class="showLabel">Asset Statistic Dashboard<br>'+localStorage.p_name+'<br>ROAD FURNITURE BY TYPE'+parentFilter+'</span>'
    },
		subtitle: {
		  text: ''
		},
		accessibility: {
		  announceNewData: {
			enabled: true
		  }
		},
		xAxis: {
		  type: 'category'
		},
		yAxis: {
      allowDecimals: false,
      type: 'linear',
      minorTickInterval: 0.1,
      startOnTick: false,
		  title: {
			text: ''
		  }
	  
		},
		legend: {
		  enabled: false
		},
		plotOptions: {
		  series: {
			  borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}'
        }
		  }
		},
	  
		tooltip: {
		  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y.0f}</b><br/>'
		},

		credits:false,
	  
		series: [
		  {
			name: "",
			colorByPoint: true,
			data: dataArr,
      cursor: 'pointer',
      events: {
        click: function (event) {
            linkWinTitle = 'Road Furniture'
            linkName = 'dash_asset_road_furniture_card'
            linkParamArr = processFilterParamArr([event.point.options.name])
            window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.options.name);
        }
      }
		}
		],
	});
  chart.updateFlag = true;
}

function updateCardLength(data){
  var searchfilter;
  var ttlLength = (data && data.allSectionLength) ? parseFloat(data.allSectionLength) : 0;

  if(localStorage.ui_pref == 'ri_v3'){
    searchfilter = getFilterDashboardAsset();
  }
  
  if(ttlLength > 0){
    $('#ttlLength').attr('onclick', "conOpLink('Section', '')").attr('class', "clickableCard").html(ttlLength);
  }else{
    $('#ttlLength').html(ttlLength);
  }

    let lengthSectionHTML = '';

    if(data.length > 0){
        $('#ttlLengthBySec').html('');
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == 'allSectionLength') continue;
            lengthSectionHTML += `<div class="infoContainerSection shadow">
                                        <div class="head">`+idx+`</div>
                                        <span id="">`+ele+`</span> KM
                                    </div>`
        }
        $('#ttlLengthBySec').html(lengthSectionHTML);
    }
}

function refreshInformation(packId = 'overall', wpcName = 'all'){
    var parentFilter = "";
    var totalAssetTitle = "";
    var sectionTitle = "";

    if(localStorage.project_owner == 'JKR_SARAWAK'){
      sectionTitle = "DIVISION";
    }else{
      sectionTitle = "DISTRICT";
    }

    if(localStorage.isParent == 'isParent'){
      parentFilter = " (Division:" +wpcName+ ")";
    }

    if(localStorage.isParent == 'isParent'){
      if(packId == "overall"){
        totalAssetTitle = "TOTAL ASSET WITH TYPE FOR OVERALL"
        $('#titleBarChartAsset').html(totalAssetTitle)
        $('#divTitle').html('OVERALL')
      }else{
        totalAssetTitle = "TOTAL ASSET WITH TYPE BY "+sectionTitle;
        $('#titleBarChartAsset').html(totalAssetTitle)
        $('#divTitle').html(sectionTitle)
      }
    }else{
      totalAssetTitle = "TOTAL ASSET WITH TYPE BY "+sectionTitle;
      $('#titleBarChartAsset').html(totalAssetTitle)
      $('#divTitle').html(sectionTitle)
    }

    var bridgeData = (assetData && assetData.bridge && assetData.bridge[packId]) ? assetData.bridge[packId] : [];
    var bridgeAllCount = (bridgeData && bridgeData.card && bridgeData.card.bridgeAll && bridgeData.card.bridgeAll.total) ? bridgeData.card.bridgeAll.total : 0;

    var culvertData = (assetData && assetData.culvert && assetData.culvert[packId]) ? assetData.culvert[packId] : [];
    var culvertAllCount = (culvertData && culvertData.card && culvertData.card.culvertAll) ? culvertData.card.culvertAll : 0;

    var drainData = (assetData && assetData.drainage && assetData.drainage[packId]) ? assetData.drainage[packId] : [];
    var drainAllCount = (drainData && drainData.card && drainData.card.drainAll && drainData.card.drainAll.total) ? drainData.card.drainAll.total : 0;

    var pavementData = (assetData && assetData.pavement && assetData.pavement[packId]) ? assetData.pavement[packId] : [];
    var pavementAllCount = (pavementData && pavementData.card && pavementData.card.pavementAll && pavementData.card.pavementAll.total) ? pavementData.card.pavementAll.total : 0;

    var roadFurnitData = (assetData && assetData.roadFurniture && assetData.roadFurniture[packId]) ? assetData.roadFurniture[packId] : [];
    var roadFurnitAllCount = (roadFurnitData && roadFurnitData.card && roadFurnitData.card.roadFurnitureAll && roadFurnitData.card.roadFurnitureAll.total) ? roadFurnitData.card.roadFurnitureAll.total : 0;
    
    var slopeData = (assetData && assetData.slope && assetData.slope[packId]) ? assetData.slope[packId] : [];
    var slopeAllCount = (slopeData && slopeData.card && slopeData.card.slopeAll && slopeData.card.slopeAll.total) ? slopeData.card.slopeAll.total : 0;

    var electricData = (assetData && assetData.electrical && assetData.electrical[packId]) ? assetData.electrical[packId] : [];
    var electricAllCount = (electricData && electricData.card && electricData.card.electricalAll && electricData.card.electricalAll.total) ? electricData.card.electricalAll.total : 0;

    updateCardType(bridgeAllCount, culvertAllCount, drainAllCount, pavementAllCount, roadFurnitAllCount, slopeAllCount, electricAllCount);

    var bridgeBySection = (bridgeData && bridgeData.chart && bridgeData.chart.bridgeSection) ? bridgeData.chart.bridgeSection : [];
    var culvertBySection = (culvertData && culvertData.chart && culvertData.chart.culvertSection) ? culvertData.chart.culvertSection : [];
    var drainBySection = (drainData && drainData.chart && drainData.chart.drainSection) ? drainData.chart.drainSection : [];
    var pavementBySection = (pavementData && pavementData.chart && pavementData.chart.pavementSection) ? pavementData.chart.pavementSection : [];
    var roadBySection = (roadFurnitData && roadFurnitData.chart && roadFurnitData.chart.roadFurnitureSection) ? roadFurnitData.chart.roadFurnitureSection : [];
    var slopeBySection = (slopeData && slopeData.chart && slopeData.chart.slopeSection) ? slopeData.chart.slopeSection : [];
    var electricSection = (electricData && electricData.chart && electricData.chart.electricalSection) ? electricData.chart.electricalSection : [];
    var divisionAsset = (assetData && assetData.sectionAsset && assetData.sectionAsset[packId] && assetData.sectionAsset[packId].card && assetData.sectionAsset[packId].chart.division) ? assetData.sectionAsset[packId].chart.division : [];
    
    drawChartAssetSection(bridgeBySection, culvertBySection, drainBySection, pavementBySection, roadBySection, slopeBySection, electricSection, divisionAsset, parentFilter, totalAssetTitle);

    var lenghtAsset = (assetData && assetData.sectionAsset && assetData.sectionAsset[packId] && assetData.sectionAsset[packId].card && assetData.sectionAsset[packId].card.length) ? assetData.sectionAsset[packId].card.length : [];
    updateCardLength(lenghtAsset)

    var roadByType = (roadFurnitData && roadFurnitData.chart && roadFurnitData.chart.roadType) ? roadFurnitData.chart.roadType : [];
    drawRoadFurnitureType(roadByType, parentFilter)
}

function refreshDashboard(){
  var selWPC = $('#wpcFilter').val();
  refreshInformation(selWPC);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
  var wpcName = filterArr.wpcName;
	refreshInformation(wpc, wpcName);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "statistic"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                assetData = obj.data;
                refreshInformation();

        	}
        }
    });
})