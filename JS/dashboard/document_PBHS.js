var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

var inPackageUuid = initInPackageUuid()

function initInPackageUuid(){
	return localStorage.inPackageUuid ? localStorage.inPackageUuid : ''
}

function conOpLink(process, type){
	if(localStorage.ui_pref != "ri_v3") return;

    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchilter = getSearchFilterSabah();
	var cardname;


    switch (process) {
        case 'Doc':
            linkWinTitle = 'Document'
            linkName = 'dash_doc_register_doc_card'
            linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, '', '', '', inPackageUuid])
            break;
		case 'Corr':
			linkWinTitle = 'Correspondence'
			linkName = 'dash_doc_register_corr_card'
			linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, '', '', '', '', '', '', inPackageUuid])
			cardname = ' - ' + type;
			break;
		case 'CorrInc':
			linkWinTitle = 'Correspondence'

			if(localStorage.isParent && localStorage.isParent == 'isParent'){
				linkName = 'dash_doc_register_corr_cardIncParent'
				linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, 'Incoming', inPackageUuid])
			}else{
				linkName = 'dash_doc_register_corr_cardInc'
				linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, 'Incoming'])
			}
			cardname = ' - ' + type;
			break;
		case 'CorrOut':
			linkWinTitle = 'Correspondence'
			if(localStorage.isParent && localStorage.isParent == 'isParent'){
				linkName = 'dash_doc_register_corr_cardOutParent'
				linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, 'Outgoing', inPackageUuid])
			}else{
				linkName = 'dash_doc_register_corr_cardOut'
				linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, 'Outgoing'])
			}
			cardname = ' - ' + type;
			break;
    }
    
	cardname = ' - ' + type;
	window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle+""+cardname);
}

function drawDocDrawingTypeChart(data, monthYear){
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
			if(idx == "") continue;
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
    }

    // cumNcrSafetyChart
    var chart = Highcharts.chart('numOfDocumentByType', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
						text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>DOCUMENT TYPE ('+monthYear+')</span>'
					  }
					})
		
					chart.updateFlag = true;
				  } else if (chart.updateFlag) {
					chart.updateFlag = false;
		
					chart.update({
					  title: {
						useHTML: true,
						enabled: true,
						text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DOCUMENT TYPE ('+monthYear+')</span>'
					  }
					})
					chart.updateFlag = true;
				  }
				}
			}
        },
        title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel" style="font-size: 12px">Document Management Dashboard<br>'+localStorage.p_name+'<br>DOCUMENT TYPE ('+monthYear+')</span>'
		},
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        legend: {
            itemStyle: {
                fontSize: '10px',
                fontWeight: 'normal'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
					format: '{series.name}: {point.y}',
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            data: dataArr,
			events: {
                click: function (event) {
					if(localStorage.ui_pref != "ri_v3") return;

                    var dateFilter = getSearchFilterSabah();
                    var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, event.point.name, '', '', inPackageUuid]);
                    
                    window.parent.widgetConopOpen("Document", "dash_doc_register_doc_card", linkParamArr, "Document - " + event.point.name);
                }
            }
        }],
        credits: false
    });
	chart.updateFlag = true;
}

function updateDocumentCard(total = 0) {
    var totalCard = `<span class="clickableCard" onclick="conOpLink('Doc','', '')">`+total+`</span>`;

    $('#DocumentCard').html(formatThousand(totalCard));
}

function drawSubTypeOfDocumentChart(data, monthYear){
	var dataArr = [];
	if (data){
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;

            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }

	}

	// Create the chart
	var chart = Highcharts.chart('typeOfdocument', {
		chart: {
		  type: 'bar',
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
					text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>DOCUMENT SUBTYPE ('+monthYear+')</span>'
				  }
				})
	
				chart.updateFlag = true;
			  } else if (chart.updateFlag) {
				chart.updateFlag = false;
	
				chart.update({
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DOCUMENT SUBTYPE ('+monthYear+')</span>'
				  }
				})
				chart.updateFlag = true;
			  }
			}
		  }
		},
		title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DOCUMENT SUBTYPE ('+monthYear+')</span>'
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
			  format: '{point.y}'
			}
		  },
		  size: '90%'
		},
	  
		tooltip: {
		  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
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
					if(localStorage.ui_pref != "ri_v3") return;

                    var dateFilter = getSearchFilterSabah();
                    var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, '', event.point.name, '', inPackageUuid]);
                    
                    window.parent.widgetConopOpen("Document", "dash_doc_register_doc_card", linkParamArr, "Document - " + event.point.name);
                }
            }
		  }
		],
	  });
	  chart.updateFlag = true;
}

function drawDrawingTypeChart(data, monthYear){
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);

			dataArr.sort(function(a,b){
				if(a.name == 'Tender Drawing' && b.name == 'Shop Drawing') return -1;
				if(a.name == 'Tender Drawing' && b.name == 'Construction Drawing') return -1;
				if(a.name == 'Tender Drawing' && b.name == 'As-Built Drawing') return -1;

				if(a.name == 'Shop Drawing' && b.name == 'Construction Drawing') return -1;
				if(a.name == 'Shop Drawing' && b.name == 'As-Built Drawing') return -1;

				if(a.name == 'Construction Drawing' && b.name == 'As-Built Drawing') return -1;
				
				if(b.name == 'Tender Drawing' && a.name == 'Shop Drawing') return 1;
				if(b.name == 'Tender Drawing' && a.name == 'Construction Drawing') return 1;
				if(b.name == 'Tender Drawing' && a.name == 'As-Built Drawing') return 1;
				
				if(b.name == 'Shop Drawing' && a.name == 'Construction Drawing') return 1;
				if(b.name == 'Shop Drawing' && a.name == 'As-Built Drawing') return 1;

				if(b.name == 'Construction Drawing' && a.name == 'As-Built Drawing') return 1;

				return 0;
			});
        }
    }

	// Create the chart
  var chart = Highcharts.chart('drawingTypeChart', {
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
				text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>DRAWING TYPE ('+monthYear+')</span>'
			  }
			})

			chart.updateFlag = true;
		  } else if (chart.updateFlag) {
			chart.updateFlag = false;

			chart.update({
			  title: {
				useHTML: true,
				enabled: true,
				text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DRAWING TYPE ('+monthYear+')</span>'
			  }
			})
			chart.updateFlag = true;
		  }
		}
	  }
	},
	title: {
		useHTML: true,
		enabled: true,
		text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DRAWING TYPE ('+monthYear+')</span>'
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
		  format: '{point.y}'
		}
	  }
	},
  
	tooltip: {
	  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
	},
  
	series: [
	  {
		name: "",
		colorByPoint: true,
		data: dataArr,
		cursor: 'pointer',
		events: {
			click: function (event) {
				if(localStorage.ui_pref != "ri_v3") return;

				var dateFilter = getSearchFilterSabah();
				var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, 'Drawing', event.point.name, '', inPackageUuid]);
				
				window.parent.widgetConopOpen("Document", "dash_doc_register_doc_card", linkParamArr, "Drawing - "+ event.point.name);
			}
		}
	  }
	],
	credits:false
  });
  chart.updateFlag = true;
}

function drawDrawingRevisionChart(data, monthYear){
    var total = (data.Total) ? parseInt(data.Total) :0;
    var revised = (data.Revised) ? parseInt(data.Revised) :0;

	// Create the chart
	var chart = Highcharts.chart('drawingRevisionChart', {
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
					text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>DRAWING STATUS ('+monthYear+')</span>'
				  }
				})
	
				chart.updateFlag = true;
			  } else if (chart.updateFlag) {
				chart.updateFlag = false;
	
				chart.update({
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DRAWING STATUS ('+monthYear+')</span>'
				  }
				})
				chart.updateFlag = true;
			  }
			}
		}
		},
		title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DRAWING STATUS ('+monthYear+')</span>'
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
			  format: '{point.y}'
			}
		  }
		},
		tooltip: {
		  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
		},
		credits:false,
		series: [
		  {
			name: "",
			colorByPoint: true,
			cursor: 'pointer',
			data: [
			  {
				name: "All Types of Drawing",
				y: total,
				color:'#AB91C5'
			  },
			  {
				name: "All Types of Revised Drawing",
				y: revised,
				color:'#F0CB69'
			  },
	
			], 
			events: {
				click: function (event) {
					if(localStorage.ui_pref != "ri_v3") return;
					
					var revised = '';
					if(event.point.name=='All Types of Revised Drawing'){
						revised = 'Yes';
					}
					var dateFilter = getSearchFilterSabah();
					var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, 'Drawing', '', revised, inPackageUuid]);
					
					window.parent.widgetConopOpen("Document", "dash_doc_register_doc_card", linkParamArr, event.point.name);
				}
			}
		  }
		]
	  });
	  chart.updateFlag = true;
}

function updateCoresspondenceCard(ttl = 0, inc = 0, out = 0, allDataArr) {

	var dataInc = (allDataArr.Incoming) ? allDataArr.Incoming : '';
	var dataOut = (allDataArr.Outgoing) ? allDataArr.Outgoing : '';

	var CorrespondenceTotalCard = `<span class="clickableCard" onclick="conOpLink('Corr','', '')">`+formatThousand(ttl)+`</span>`;
	var CorrespondenceIncCard = `<span class="clickableCard" onclick="conOpLink('CorrInc','Incoming', '')">`+formatThousand(inc)+`</span>`;
	var CorrespondenceOutCard = `<span class="clickableCard" onclick="conOpLink('CorrOut','Outgoing', '')">`+formatThousand(out)+`</span>`;

    $('#CorrespondenceTotalCard').html(CorrespondenceTotalCard);
	$('#CorrespondenceIncCard').html(CorrespondenceIncCard);
	$('#CorrespondenceOutCard').html(CorrespondenceOutCard);
}

function drawIncomingStatus(data, monthYear){
	var dataArr = [];
	var clr;
	if (data){
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;
			if (idx == 'Ongoing'){
				clr='#EBF705';
			}else if(idx == "Pending"){
				clr='#5FB7E5'
			}else if(idx == "Urgent"){
				clr='#FF1F24'
			}else if(idx == "Closed"){
				clr='#47E835'
			}else if(idx == "For Info"){
				clr='#999999 '
			}
			var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0,  color: clr };
			dataArr.push(tempArr);

			dataArr.sort(function(a,b){
				if(a.name == 'Ongoing' && b.name == 'Pending') return -1;
				if(a.name == 'Ongoing' && b.name == 'Urgent') return -1;
				if(a.name == 'Ongoing' && b.name == 'Closed') return -1;
				if(a.name == 'Ongoing' && b.name == 'For Info') return -1;

				if(a.name == 'Pending' && b.name == 'Urgent') return -1;
				if(a.name == 'Pending' && b.name == 'Closed') return -1;
				if(a.name == 'Pending' && b.name == 'For Info') return -1;

				if(a.name == 'Urgent' && b.name == 'Closed') return -1;
				if(a.name == 'Urgent' && b.name == 'For Info') return -1;

				if(a.name == 'Closed' && b.name == 'For Info') return -1;
				
				if(b.name == 'Ongoing' && a.name == 'Pending') return 1;
				if(b.name == 'Ongoing' && a.name == 'Urgent') return 1;
				if(b.name == 'Ongoing' && a.name == 'Closed') return 1;
				if(b.name == 'Ongoing' && a.name == 'For Info') return 1;
				
				if(b.name == 'Pending' && a.name == 'Urgent') return 1;
				if(b.name == 'Pending' && a.name == 'Closed') return 1;
				if(b.name == 'Pending' && a.name == 'For Info') return 1;

				if(b.name == 'Urgent' && a.name == 'Closed') return 1;
				if(b.name == 'Urgent' && a.name == 'For Info') return 1;

				if(b.name == 'Closed' && a.name == 'For Info') return 1;

				return 0;
			});
        }

	}

	// Create the chart
	var chart = Highcharts.chart('statusInCorr', {
		chart: {
		  type: 'bar',
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
					text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>INCOMING ('+monthYear+')</span>'
				  }
				})
	
				chart.updateFlag = true;
			  } else if (chart.updateFlag) {
				chart.updateFlag = false;
	
				chart.update({
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>INCOMING ('+monthYear+')</span>'
				  }
				})
				chart.updateFlag = true;
			  }
			}
		}
		},
		title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>INCOMING ('+monthYear+')</span>'
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
			  format: '{point.y}'
			}
		  }
		},
	  
		tooltip: {
		  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
		},
		credits:false,
		series: [
			{
				name: "",
				colorByPoint: true,
				data: dataArr
				// events: {
				// 	click: function (event) {
				// 		var allDataArr = (event.point.allData) ? event.point.allData : [];
				// 		var docSubtype = (allDataArr.doc_subtype) ? allDataArr.doc_subtype : '';
				// 		var status = (allDataArr.status) ? allDataArr.status : '';
				// 		var dashPriority = (allDataArr.dash_priority) ? allDataArr.dash_priority : '';
				// 		var dashFlag = (allDataArr.dashboardFlag) ? allDataArr.dashboardFlag : '';
				// 		var createdBy = (allDataArr.created_by) ? allDataArr.created_by : '';
				// 		var thirdParty = (allDataArr.third_party) ? allDataArr.third_party : '';
				// 		var prior = (allDataArr.prior) ? allDataArr.prior : '';
				// 		var listID = (prior == 'Urgent') ? 'dash_doc_register_corr_cardUrgent' : 'dash_doc_register_corr_cardNotUrgent';
				// 		if(localStorage.ui_pref != "ri_v3") return;

				// 		var dateFilter = getSearchFilterSabah();

				// 		var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, 'Incoming', '', thirdParty, status])
				// 		window.parent.widgetConopOpen("Document", listID, linkParamArr, "Correspondence Type - " + status);
				// 	}
				// }
			}
		],
	  });
	  chart.updateFlag = true;
}

function drawOutgoingStatus(data, monthYear){
	var dataArr = [];
	var clr;

	if (data){
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;
			if (idx == 'Ongoing'){
				clr='#EBF705';
			}else if(idx == "Pending"){
				clr='#5FB7E5'
			}else if(idx == "Urgent"){
				clr='#FF1F24'
			}else if(idx == "Closed"){
				clr='#47E835'
			}else if(idx == "For Info"){
				clr='#999999 '
			}
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0,  color: clr };
            dataArr.push(tempArr);

			dataArr.sort(function(a,b){
				if(a.name == 'Ongoing' && b.name == 'Pending') return -1;
				if(a.name == 'Ongoing' && b.name == 'Urgent') return -1;
				if(a.name == 'Ongoing' && b.name == 'Closed') return -1;
				if(a.name == 'Ongoing' && b.name == 'For Info') return -1;

				if(a.name == 'Pending' && b.name == 'Urgent') return -1;
				if(a.name == 'Pending' && b.name == 'Closed') return -1;
				if(a.name == 'Pending' && b.name == 'For Info') return -1;

				if(a.name == 'Urgent' && b.name == 'Closed') return -1;
				if(a.name == 'Urgent' && b.name == 'For Info') return -1;

				if(a.name == 'Closed' && b.name == 'For Info') return -1;
				
				if(b.name == 'Ongoing' && a.name == 'Pending') return 1;
				if(b.name == 'Ongoing' && a.name == 'Urgent') return 1;
				if(b.name == 'Ongoing' && a.name == 'Closed') return 1;
				if(b.name == 'Ongoing' && a.name == 'For Info') return 1;
				
				if(b.name == 'Pending' && a.name == 'Urgent') return 1;
				if(b.name == 'Pending' && a.name == 'Closed') return 1;
				if(b.name == 'Pending' && a.name == 'For Info') return 1;

				if(b.name == 'Urgent' && a.name == 'Closed') return 1;
				if(b.name == 'Urgent' && a.name == 'For Info') return 1;

				if(b.name == 'Closed' && a.name == 'For Info') return 1;

				return 0;

			});
        }

	}

	// Create the chart
	var chart = Highcharts.chart('statusOutCorr', {
		chart: {
		  type: 'bar',
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
					text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>OUTGOING ('+monthYear+')</span>'
				  }
				})
	
				chart.updateFlag = true;
			  } else if (chart.updateFlag) {
				chart.updateFlag = false;
	
				chart.update({
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>OUTGOING ('+monthYear+')</span>'
				  }
				})
				chart.updateFlag = true;
			  }
			}
		}
		},
		title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>OUTGOING ('+monthYear+')</span>'
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
			  format: '{point.y}'
			}
		  }
		},
	  
		tooltip: {
		  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
		},

		credits:false,
	  
		series: [
		  {
			name: "",
			colorByPoint: true,
			data: dataArr,
			// events: {
			// 	click: function (event) {
			// 		if(localStorage.ui_pref != "ri_v3") return;

			// 		var dateFilter = getSearchFilterSabah();
			// 		var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, 'Outgoing', '', event.point.name])
					
			// 		window.parent.widgetConopOpen("Document", "dash_doc_register_corr_card", linkParamArr, "Correspondence Type - " + event.point.name);
			// 	}
			// }
		  }
		],
	  });
	  chart.updateFlag = true;
}

function drawCorrespondanceTypeChart(data, monthYear){
    var dataArr = [];
	var clr;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
			if (idx == 'Letter'){
				clr='#8EC3A7';
			}else if(idx == "Site Memo"){
				clr='#E54D24'
			}else if(idx == "Memo"){
				clr='#F0CB69'
			}else if(idx == "MOM"){
				clr='#5FB7E5'
			}else if(idx == "Transmittal"){
				clr='#AB91C5 '
			}
            var tempArr = { name: idx, y: ((ele.val) ? ele.val : 0), color : clr, allData : (ele.allData) ? ele.allData : [] };
            dataArr.push(tempArr);
        }
    }

    var chart = Highcharts.chart('corrTypeChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
						text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>CORRESPONDENCE TYPE ('+monthYear+')</span>'
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
						text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>CORRESPONDENCE TYPE ('+monthYear+')</span>'
					  }
					})
					chart.updateFlag = true;
				  }
				}
			}
        },
        title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>CORRESPONDENCE TYPE ('+monthYear+')</span>'
		},
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        legend: {
			itemStyle: {
                fontSize: '10px',
                fontWeight: 'normal'
            }
		},
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
					format: '<b>{point.name}:</b>{point.y}',
                },
                showInLegend: true
            },
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
			innerSize: '65%',
            data: dataArr,
			events: {
				click: function (event) {
					if(localStorage.ui_pref != "ri_v3") return;

					var allDataArr = (event.point.allData) ? event.point.allData : [];
					var corrType = (allDataArr.corr_type) ? allDataArr.corr_type : '';
					
					var dateFilter = getSearchFilterSabah();
					var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, corrType, inPackageUuid])
					
					window.parent.widgetConopOpen("Document", "dash_doc_register_corr_cardType", linkParamArr, "Correspondence Type - " + event.point.name);
				}
			}
        }],
        credits: false
    });
	chart.updateFlag = true;
}

function refreshInformation(packId = 'overall', sectionId = 'overall', year = 'all', month = 'all'){

    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;

	var registeredDocData = (docData.doc && docData.doc[packId] && docData.doc[packId][sectionId]) ? docData.doc[packId][sectionId] : [];
	var docType = (registeredDocData.byType && registeredDocData.byType[year] && registeredDocData.byType[year][month]) ? registeredDocData.byType[year][month] : [];
	drawDocDrawingTypeChart(docType, dataYearMonth);
	var docCardTtl = (registeredDocData.card && registeredDocData.card[year] && registeredDocData.card[year][month] && registeredDocData.card[year][month].total) ? registeredDocData.card[year][month].total : [];
	updateDocumentCard(docCardTtl);

	var docSubType = (registeredDocData.bySubType && registeredDocData.bySubType[year] && registeredDocData.bySubType[year][month]) ? registeredDocData.bySubType[year][month] : [];
	drawSubTypeOfDocumentChart(docSubType, dataYearMonth);
	var drawingRevData = (registeredDocData.drawing && registeredDocData.drawing.byRevision && registeredDocData.drawing.byRevision[year] && registeredDocData.drawing.byRevision[year][month]) ? registeredDocData.drawing.byRevision[year][month] : [];
	drawDrawingRevisionChart(drawingRevData, dataYearMonth);
	var drawingTypeData = (registeredDocData.drawing && registeredDocData.drawing.bySubType && registeredDocData.drawing.bySubType[year] && registeredDocData.drawing.bySubType[year][month]) ? registeredDocData.drawing.bySubType[year][month] : [];
	drawDrawingTypeChart(drawingTypeData, dataYearMonth);

	var corrData;
	var corrType;
	var statusCardIn;
	var statusCardOut;

	corrData = (docData.corr && docData.corr[packId] && docData.corr[packId][sectionId]) ? docData.corr[packId][sectionId] : [];
	corrType = (corrData.corrType && corrData.corrType[year] && corrData.corrType[year][month]) ? corrData.corrType[year][month] : [];
	drawCorrespondanceTypeChart(corrType, dataYearMonth);

	statusCardIn = (corrData.byType && corrData.byType[year] && corrData.byType[year][month] && corrData.byType[year][month]['Incoming']) ? corrData.byType[year][month]['Incoming'] : [];
	statusCardOut = (corrData.byType && corrData.byType[year] && corrData.byType[year][month] && corrData.byType[year][month]['Outgoing']) ? corrData.byType[year][month]['Outgoing'] : [];
	var filterArrStatusInc = (corrData.byType && corrData.byType[year] && corrData.byType[year][month] && corrData.byType[year][month].allData && corrData.byType[year][month].allData['Incoming']) ? corrData.byType[year][month].allData['Incoming'] : [];
	
	drawIncomingStatus(statusCardIn, dataYearMonth,);
	drawOutgoingStatus(statusCardOut, dataYearMonth);

	var docCardTtl = (corrData.card && corrData.card[year] && corrData.card[year][month] && corrData.card[year][month].total) ? corrData.card[year][month].total : 0;
	var docCardInc = (corrData.card && corrData.card[year] && corrData.card[year][month] && corrData.card[year][month]['Incoming']) ? corrData.card[year][month]['Incoming'] : 0;
	var docCardOut = (corrData.card && corrData.card[year] && corrData.card[year][month] && corrData.card[year][month]['Outgoing']) ? corrData.card[year][month]['Outgoing'] : 0;
	
	var filterArr = (corrData.card && corrData.card[year] && corrData.card[year][month] && corrData.card[year][month].allData) ? corrData.card[year][month].allData : [];
	updateCoresspondenceCard(docCardTtl, docCardInc, docCardOut, filterArr);

}


function refreshDashboard(){
    var selWPC = $('#wpcFilter').val();
    var selYear = $('#yearFilter').val();
	var selSection = "overall";
    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
	var selMonth = $('#monthFilter').val();
    refreshInformation(selWPC, selSection, selYear, selMonth);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
    var section = filterArr.section;
    var year = filterArr.year;
    var month = filterArr.month;

    refreshInformation(wpc, section, year, month);
}

var docData;
$(document).ready(function(){
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
			}
		}
	});
})