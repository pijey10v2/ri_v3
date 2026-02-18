function conOpLink(process, status, thirdParty){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDocumentSarawak();
    var cardName;

    switch (process) {
        case 'DOC':
            linkWinTitle = 'Document'
            linkName = 'dash_doc_register_doc_card'
            linkParamArr = processFilterParamArr([status, searchfilter.dateFrom, searchfilter.dateTo])
			if(status == 'Active'){
				cardName = 'Total'
			}else{
			cardName = status
			}
            break;
		case 'COR':
            linkWinTitle = 'Document'
            linkName = 'dash_doc_register_corr_card'
            linkParamArr = processFilterParamArr([status, thirdParty, searchfilter.dateFrom, searchfilter.dateTo, '', searchfilter.section])
			if(status == ''){
				if(thirdParty == 'No'){
					cardName = 'Internal'
				}else{
					cardName = 'Total Correspondence'
				}
			}else if(status == 'Incoming'){
				cardName = 'Incoming Third Party'
			}else if(status == 'Outgoing'){
				cardName = 'Outgoing Third Party'
			}else{
				cardName = status
			}
            break;
    } 
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function drawDocDrawingTypeChart(data, monthYear){
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
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

				  if(localStorage.ui_pref == 'ri_v3'){
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
			}
        },
        title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>DOCUMENT TYPE ('+monthYear+')</span>'
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
                    enabled: false
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
					if(localStorage.ui_pref == 'ri_v3'){
						var searchfilter = getFilterDocumentSarawak();
						linkWinTitle = 'Document'
						linkName = 'dash_doc_register_doc_card'
	
						linkParamArr = processFilterParamArr(['Active', searchfilter.dateFrom, searchfilter.dateTo, event.point.name])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
					}
                }
            }
        }],
        credits: false
    });
	chart.updateFlag = true;
}

function updateDocumentCard(total = 0) {
	var totalDocumentCard = total;

	if(totalDocumentCard > 0){
		totalDocumentCard = `<span class="clickableCard" onclick="conOpLink('DOC','Active', '')">`+total+`</span>`;
	}

    $('#DocumentCard').html(totalDocumentCard);
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

			  if(localStorage.ui_pref == 'ri_v3'){
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
			events: {
                click: function (event) {
					if(localStorage.ui_pref == 'ri_v3'){
						var searchfilter = getFilterDocumentSarawak();
						linkWinTitle = 'Document'
						linkName = 'dash_doc_register_doc_card'
						linkParamArr = processFilterParamArr(['Active', searchfilter.dateFrom, searchfilter.dateTo, '', event.point.name])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
					}
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
        }
    }

	// Create the chart
  var chart = Highcharts.chart('drawingTypeChart', {
	chart: {
	  type: 'column',
	  events: {
		render() {
		  const chart = this;

		  if(localStorage.ui_pref == 'ri_v3'){
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
		events: {
			click: function (event) {
				if(localStorage.ui_pref == 'ri_v3'){
					var searchfilter = getFilterDocumentSarawak();
					linkWinTitle = 'Document'
					linkName = 'dash_doc_register_doc_card'
					linkParamArr = processFilterParamArr(['Active', searchfilter.dateFrom, searchfilter.dateTo, 'Drawing', event.point.name])
					window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
				}
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

			  if(localStorage.ui_pref == 'ri_v3'){
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
			data: [
			  {
				name: "Total Drawing",
				y: total,
				color:'#2981DA',
				events: {
					click: function (event) {
						if(localStorage.ui_pref == 'ri_v3'){
							var searchfilter = getFilterDocumentSarawak();		
							linkWinTitle = 'Document'
							linkName = 'dash_doc_register_doc_card'
							linkParamArr = processFilterParamArr(['Active', searchfilter.dateFrom, searchfilter.dateTo, 'Drawing'])
							window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Total Drawing');
						}
					}
				}
			  },
			  {
				name: "Revised Drawing",
				y: revised,
				color:'#2981DA',
				events: {
					click: function (event) {
						if(localStorage.ui_pref == 'ri_v3'){
							var searchfilter = getFilterDocumentSarawak();
	
							linkWinTitle = 'Document'
							linkName = 'dash_doc_register_doc_card'
							linkParamArr = processFilterParamArr(['Active', searchfilter.dateFrom, searchfilter.dateTo, 'Drawing', '', 'Yes'])
							window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Revised Drawing');
						}
					}
				}
			  },
	
			]
		  }
		]
	  });
	  chart.updateFlag = true;
}


function updateCoresspondenceCard(ttl = 0, inc = 0, out = 0, incInternal = 0) {
	var CorrespondenceTotalCard = ttl;
	var CorrespondenceIncCard = inc;
	var CorrespondenceOutCard = out;
	var InternalInCard = incInternal;

	if(CorrespondenceTotalCard > 0){
		CorrespondenceTotalCard = `<span class="clickableCard" onclick="conOpLink('COR','', '', '')">`+ttl+`</span>`;
	}

	if(CorrespondenceIncCard > 0){
		CorrespondenceIncCard = `<span class="clickableCard" onclick="conOpLink('COR','Incoming', 'Yes', '')">`+inc+`</span>`;
	}

	if(CorrespondenceOutCard > 0){
		CorrespondenceOutCard = `<span class="clickableCard" onclick="conOpLink('COR','Outgoing', 'Yes', '')">`+out+`</span>`;
	}

	if(InternalInCard > 0){
		InternalInCard = `<span class="clickableCard" onclick="conOpLink('COR','', 'No' ,'')">`+incInternal+`</span>`;
	}

    $('#CorrespondenceTotalCard').html(CorrespondenceTotalCard);
	$('#CorrespondenceIncCard').html(CorrespondenceIncCard);
	$('#CorrespondenceOutCard').html(CorrespondenceOutCard);
	$('#InternalInCard').html(InternalInCard);

}

function drawCorrByStatusChart(data, monthYear){
    var dataArr = [];
	if (data){
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);

			dataArr.sort(function(a,b){
				if(a.name == 'Submitted' && b.name == 'Responded') return -1;
				if(a.name == 'Submitted' && b.name == 'Closed') return -1;
				if(a.name == 'Submitted' && b.name == 'Store Only') return -1;
		
				if(a.name == 'Responded' && b.name == 'Closed') return -1;
				if(a.name == 'Responded' && b.name == 'Store Only') return -1;
		
				if(a.name == 'Closed' && b.name == 'Store Only') return -1;
				
				if(b.name == 'Submitted' && a.name == 'Responded') return 1;
				if(b.name == 'Submitted' && a.name == 'Closed') return 1;
				if(b.name == 'Submitted' && a.name == 'Store Only') return 1;
		
				if(b.name == 'Responded' && a.name == 'Closed') return 1;
				if(b.name == 'Responded' && a.name == 'Store Only') return 1;
		
				if(b.name == 'Closed' && a.name == 'Store Only') return 1;
				return 0;
			});
			  
        }

	}

	// Create the chart
	var chart = Highcharts.chart('statusInternal', {
		chart: {
		  type: 'bar',
		  events: {
			render() {
			  const chart = this;

			  if(localStorage.ui_pref == 'ri_v3'){
				  if (document.fullscreenElement && chart.updateFlag) {
					chart.updateFlag = false;
					chart.update({
					  chart: {
						marginTop: 90
					  },
					  title: {
						useHTML: true,
						enabled: true,
						text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>INTERNAL ('+monthYear+')</span>'
					  }
					})
		
					chart.updateFlag = true;
				  } else if (chart.updateFlag) {
					chart.updateFlag = false;
		
					chart.update({
					  title: {
						useHTML: true,
						enabled: true,
						text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>INTERNAL ('+monthYear+')</span>'
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
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>INTERNAL ('+monthYear+')</span>'
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
			  format: '{point.y}',
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
			events: {
				click: function (event) {
					if(localStorage.ui_pref == 'ri_v3'){
						var searchfilter = getFilterDocumentSarawak();
	
						linkWinTitle = 'Correspondence'
						linkName = 'dash_doc_register_corr_card'
						linkParamArr = processFilterParamArr(['Incoming', 'No', searchfilter.dateFrom, searchfilter.dateTo, event.point.name, searchfilter.section])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
					}
				}
			}
		  }
		],
	});
	chart.updateFlag = true;
}

function populateSectionFilter(data) {
    var optHTML = '<option selected="true" value="overall">- Choose Section -</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('#sectionFilter').html(optHTML);
}

function drawCorrByStatusThirdChart(data, monthYear){
    var catArr = [];
    var inDataArr = [];
    var outDataArr = [];

	if (data){
        for (const [idx, ele] of Object.entries(data)) {
			catArr.push(idx);

			var tempInDataArr = { name: idx, y: (ele.Incoming) ? parseInt((ele.Incoming)) : 0 };
			var tempOutDataArr = { name: idx, y: (ele.Outgoing) ? parseInt((ele.Outgoing)) : 0 };
			inDataArr.push(tempInDataArr);
			outDataArr.push(tempOutDataArr);

			inDataArr.sort(function(a,b){
				if(a.name == 'Submitted' && b.name == 'Responded') return -1;
				if(a.name == 'Submitted' && b.name == 'Closed') return -1;
				if(a.name == 'Submitted' && b.name == 'Store Only') return -1;
		
				if(a.name == 'Responded' && b.name == 'Closed') return -1;
				if(a.name == 'Responded' && b.name == 'Store Only') return -1;
		
				if(a.name == 'Closed' && b.name == 'Store Only') return -1;
				
				if(b.name == 'Submitted' && a.name == 'Responded') return 1;
				if(b.name == 'Submitted' && a.name == 'Closed') return 1;
				if(b.name == 'Submitted' && a.name == 'Store Only') return 1;
		
				if(b.name == 'Responded' && a.name == 'Closed') return 1;
				if(b.name == 'Responded' && a.name == 'Store Only') return 1;
		
				if(b.name == 'Closed' && a.name == 'Store Only') return 1;
				return 0;
			});
	
			outDataArr.sort(function(a,b){
				if(a.name == 'Submitted' && b.name == 'Responded') return -1;
				if(a.name == 'Submitted' && b.name == 'Closed') return -1;
				if(a.name == 'Submitted' && b.name == 'Store Only') return -1;
		
				if(a.name == 'Responded' && b.name == 'Closed') return -1;
				if(a.name == 'Responded' && b.name == 'Store Only') return -1;
		
				if(a.name == 'Closed' && b.name == 'Store Only') return -1;
				
				if(b.name == 'Submitted' && a.name == 'Responded') return 1;
				if(b.name == 'Submitted' && a.name == 'Closed') return 1;
				if(b.name == 'Submitted' && a.name == 'Store Only') return 1;
		
				if(b.name == 'Responded' && a.name == 'Closed') return 1;
				if(b.name == 'Responded' && a.name == 'Store Only') return 1;
		
				if(b.name == 'Closed' && a.name == 'Store Only') return 1;
				return 0;
			});
        }
	}

	if(catArr.length > 0){
		catArr.sort(function(a,b){
			if(a == 'Submitted' && b == 'Responded') return -1;
			if(a == 'Submitted' && b == 'Closed') return -1;
			if(a == 'Submitted' && b == 'Store Only') return -1;
	
			if(a == 'Responded' && b == 'Closed') return -1;
			if(a == 'Responded' && b == 'Store Only') return -1;
	
			if(a == 'Closed' && b == 'Store Only') return -1;
			
			if(b == 'Submitted' && a == 'Responded') return 1;
			if(b == 'Submitted' && a == 'Closed') return 1;
			if(b == 'Submitted' && a == 'Store Only') return 1;
	
			if(b == 'Responded' && a == 'Closed') return 1;
			if(b == 'Responded' && a == 'Store Only') return 1;
	
			if(b == 'Closed' && a == 'Store Only') return 1;
			return 0;
		});
	}
	
	// Create the chart
	var chart = Highcharts.chart('statusThird', {
		chart: {
			type: 'bar',
			events: {
				render() {
				  const chart = this;

				  if(localStorage.ui_pref == 'ri_v3'){
					  if (document.fullscreenElement && chart.updateFlag) {
						chart.updateFlag = false;
						chart.update({
						  chart: {
							marginTop: 90
						  },
						  title: {
							useHTML: true,
							enabled: true,
							text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>THIRD PARTY ('+monthYear+')</span>'
						  }
						})
			
						chart.updateFlag = true;
					  } else if (chart.updateFlag) {
						chart.updateFlag = false;
			
						chart.update({
						  title: {
							useHTML: true,
							enabled: true,
							text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>THIRD PARTY ('+monthYear+')</span>'
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
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>THIRD PARTY ('+monthYear+')</span>'
		},
		xAxis: {
			categories: catArr,
            title: {
                text: null
            }
		},
		credits:false,
		yAxis: {
			min: 0,
			title: {
				text: ''
			}
		},
		legend: {
            itemStyle: {
                fontSize: '10px',
                fontWeight: 'normal'
            }
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
		series: [{
            name: 'Incoming',
            data: inDataArr,
			color: Highcharts.getOptions().colors[0],
			events: {
				click: function (event) {
					if(localStorage.ui_pref == 'ri_v3'){
						var searchfilter = getFilterDocumentSarawak();
						linkWinTitle = 'Correspondence'
						linkName = 'dash_doc_register_corr_card'
						linkParamArr = processFilterParamArr([event.point.series.name, 'Yes', searchfilter.dateFrom, searchfilter.dateTo, event.point.category.name, searchfilter.section])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Incoming');
					}
				}
			}
        },
        {
            name: 'Outgoing',
            data: outDataArr,
			color: Highcharts.getOptions().colors[1],
			events: {
				click: function (event) {
					if(localStorage.ui_pref == 'ri_v3'){
						var searchfilter = getFilterDocumentSarawak();
						linkWinTitle = 'Correspondence'
						linkName = 'dash_doc_register_corr_card'
						linkParamArr = processFilterParamArr([event.point.series.name, 'Yes', searchfilter.dateFrom, searchfilter.dateTo, event.point.category.name, searchfilter.section])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Outgoing');
					}
				}
			}
        }]
	});
	chart.updateFlag = true;
}

function drawCorrespondanceThirdPartyChart(data, monthYear){
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
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

				  if(localStorage.ui_pref == 'ri_v3'){
					  if (document.fullscreenElement && chart.updateFlag) {
						chart.updateFlag = false;
						chart.update({
						  chart: {
							marginTop: 90
						  },
						  title: {
							useHTML: true,
							enabled: true,
							text: '<span class="showLabel" style="text-align: center; display: flex; font-size: 15px">Document Management Dashboard<br>'+localStorage.p_name+'<br>THIRD PATY ('+monthYear+')</span>'
						  },
						  legend: {
							symbolHeight: 15,
							symbolWidth: 15,
							itemStyle : {
							  fontSize : 15
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
							text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>THIRD PARTY ('+monthYear+')</span>'
						  },
						  legend: {
							symbolHeight: 12,
							symbolWidth: 12,
							itemStyle : {
							  fontSize : 12
							}
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
			text: '<span class="showLabel">Document Management Dashboard<br>'+localStorage.p_name+'<br>THIRD PARTY ('+monthYear+')</span>'
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
                    enabled: false
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
					if(localStorage.ui_pref == 'ri_v3'){
						var searchfilter = getFilterDocumentSarawak();
						linkWinTitle = 'Correspondence'
						linkName = 'dash_doc_register_corr_card'
						linkParamArr = processFilterParamArr([event.point.name, 'Yes', searchfilter.dateFrom, searchfilter.dateTo, '', searchfilter.section])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
					}
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
	var corrStatus;
	var statusThird;

	corrData = (docData.corr && docData.corr[packId] && docData.corr[packId][sectionId]) ? docData.corr[packId][sectionId] : [];
	corrType = (corrData.byType && corrData.byType[year] && corrData.byType[year][month]) ? corrData.byType[year][month] : [];
	drawCorrespondanceThirdPartyChart(corrType, dataYearMonth);

	//status for internal
	corrStatus = (corrData.byStatus && corrData.byStatus[year] && corrData.byStatus[year][month]) ? corrData.byStatus[year][month] : [];
	drawCorrByStatusChart(corrStatus, dataYearMonth);

	//status for third party
	statusThird = (corrData.byThirdStatus && corrData.byThirdStatus[year] && corrData.byThirdStatus[year][month]) ? corrData.byThirdStatus[year][month] : [];
	drawCorrByStatusThirdChart(statusThird, dataYearMonth);
	
	var docCardTtl = (corrData.card && corrData.card[year] && corrData.card[year][month] && corrData.card[year][month].total) ? corrData.card[year][month].total : 0;
	var docCardInc = (corrData.card && corrData.card[year] && corrData.card[year][month] && corrData.card[year][month]['Incoming']) ? corrData.card[year][month]['Incoming'] : 0;
	var docCardOut = (corrData.card && corrData.card[year] && corrData.card[year][month] && corrData.card[year][month]['Outgoing']) ? corrData.card[year][month]['Outgoing'] : 0;
	var InternalCardInc = (corrData.cardNoThirdParty && corrData.cardNoThirdParty[year] && corrData.cardNoThirdParty[year][month] && corrData.cardNoThirdParty[year][month]['Incoming']) ? corrData.cardNoThirdParty[year][month]['Incoming'] : 0;
	updateCoresspondenceCard(docCardTtl, docCardInc, docCardOut, InternalCardInc);

}


function refreshDashboard(){
    var selWPC = $('#wpcFilter').val();
    var selYear = $('#yearFilter').val();
	var selSection = $("#sectionFilter").val();
	if(selWPC == 'overall'){
		selSection == 'overall';
	}
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
				var sectionData = (docData.section && docData.section['overall']) ? docData.section['overall'] : [];
				populateSectionFilter(sectionData);
				refreshInformation();
			}
		}
	});

	// only update section filter when overall changed
    $("#wpcFilter").change(function () {
        var sectionData = (docData.section && docData.section[$(this).val()]) ? docData.section[$(this).val()] : [];
        populateSectionFilter(sectionData);
		refreshDashboard()
    })
})