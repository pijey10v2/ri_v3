var landData;
var monthFulltext = {"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"};
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var monthHalftext = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"};

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

	linkParamArr = processFilterParamArr([monthNo, searchilter.dateYr, lcmNo, searchilter.districtLand])
    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
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
							window.parent.widgetConopOpen("Land Summary", "dash_cons_LS_card", linkParamArr, "Land Summary - " + event.point.category.name);
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
							window.parent.widgetConopOpen("Land Summary", "dash_cons_LS_card", linkParamArr, "Land Summary - " + event.point.category.name);
						}
					}
				})
			t++;
		});
	}

	var landChart;

	if(divId == "offerIssuedChart"){
		landChart = "Offer Issued"
	}else if(divId == "paymentChart"){
		landChart = "Payment Made"
	}else if(divId == "demolisedChart"){
		landChart = "Demolished"
	}

	var chart = Highcharts.chart(divId, {
	title: {
		text: ''
	},
	title: {
		useHTML: true,
		enabled: true,
		text: '<span class="showLabel">Land Summary Dashboard<br>'+localStorage.p_name+'<br>'+landChart+' : Offer Issued ('+monthYear+')</span>'
	},
	yAxis: {
		title: {
		text: ''
		},
		allowDecimals: false,
		tickInterval: 5,
		min: 0,
		stackLabels: {
			enabled: true,
			formatter: function() {
				return  this.stack;
			}
		}
	},
	chart: {
		type: 'column',
		events: {
			render() {
			  const chart = this;
				
			  if (document.fullscreenElement && chart.updateFlag) {
				chart.updateFlag = false;
				chart.update({
				  chart: {
					marginTop: 90
				  },
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">Land Summary Dashboard<br>'+localStorage.p_name+'<br>'+landChart+' ('+monthYear+')</span>'
				  },
				  legend: {
					symbolHeight: 15,
					symbolWidth: 15,
					itemStyle: {
					  fontSize: '15px',
					}
				  }
				})
	
				chart.updateFlag = true;
			  } else if (chart.updateFlag) {
				chart.updateFlag = false;
	
				chart.update({
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel">Land Summary Dashboard<br>'+localStorage.p_name+'<br>'+landChart+' ('+monthYear+')</span>'
				  },
				  legend: {
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
		}
	},
	xAxis: {
		categories: catArr
	},
	legend: {
		layout: 'vertical',
		align: 'right',
		verticalAlign: 'middle',
		y: 10
	},
	plotOptions: {
		column: {
			stacking: 'normal',
			pointPadding: 0.2,
			borderWidth: 0,
			allowPointSelect: true,
			cursor: 'pointer'
		}
	},
	series: dataArr,
	credits: false,
	responsive: {
		rules: [{
		condition: {
			maxWidth: 500
		},
		chartOptions: {
			legend: {
				layout: 'horizontal',
				align: 'center',
				verticalAlign: 'bottom'
			}
		}
		}]
	},
	navigation: {
        buttonOptions: {
            verticalAlign: 'top',
            y: -11
        }
    }
	});
	chart.updateFlag = true;
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

})