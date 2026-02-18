var progressSummaryData;
var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var chartFin;
var chartPhy;
var ui_pref;
var iframeDigitalReport;

function drawFinSCurve(data){
	var finEarly = [];
	var finPlan = [];
	var monthYear = [];
	var finEarlyLegend;
	var projectName;

	if(!iframeDigitalReport){
		if(localStorage.project_owner == "JKR_SABAH"){
			finEarlyLegend = 'Schedule';
		}else if(localStorage.project_owner == "JKR_SARAWAK"){
			finEarlyLegend = 'Scheduled';
		}else if(localStorage.project_owner == "SSLR2"){
			finEarlyLegend = 'Plan';
		}
	}else{
		if(iframeDigitalReport == "JKR_SABAH"){
			finEarlyLegend = 'Schedule';
		}else if(iframeDigitalReport == "JKR_SARAWAK"){
			finEarlyLegend = 'Scheduled';
		}else if(iframeDigitalReport == "SSLR2"){
			finEarlyLegend = 'Plan';
		}
	}


	if(data.monthYear){
		var tempValue = 0;
		var flagCheckValue = true;

		for (var i = 0; i < data.monthYear.length; i++) {
			var mydate = new Date(data.monthYear[i]);
			monthYear.push(mydate.getFullYear()+"-"+(mydate.getMonth() + 1));

	   		finEarly.push(parseFloat(data.finEarly[i]));

			tempValue = data.finPlan[i - 1];
			if((parseFloat(data.finPlan[i]) == 0.00) && parseFloat(data.finPlan[i]) < parseFloat(tempValue)) {
				flagCheckValue = false;
			}
			
			if(flagCheckValue){
				var variance = parseFloat(data.finPlan[i]) - parseFloat(data.finEarly[i]);
				var tempArr = { toolTipVar: parseFloat(variance).toFixed(2), y: (data.finPlan[i]) ? parseFloat((data.finPlan[i])) : 0 }
				finPlan.push(tempArr);
			}
		}
	}

	(localStorage.p_name == undefined) ? projectName = "" : projectName = localStorage.p_name;

	chart = Highcharts.chart('finScurve', {
    	chart: {
    	    type: 'line',
			events: {
				render() {
					var chart = this;

					if(ui_pref == 'ri_v3'){
						if (document.fullscreenElement && chart.updateFlag) {
						  chart.updateFlag = false;
						  
						  chart.update({
							chart:{
							  marginTop: 90
							},
							title: {
							  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Operational Dashboard<br>'+projectName+'<br>FINANCIAL S-CURVE</span>'
							},
							legend: {
							  symbolHeight: 15,
							  symbolWidth: 15,
							  itemStyle : {
								fontSize : '15px'
							  }
							},
							tooltip: {
								style: {
									fontSize: '24px'
								}
							}
						  })
			  
						  chart.updateFlag = true;
						}
						else if (chart.updateFlag) {
						  chart.updateFlag = false;
			  
						  chart.update({
							title: {
							  text: '<span class="showLabel">Operational Dashboard<br>'+projectName+'<br>FINANCIAL S-CURVE</span>'
							},
							legend: {
							  symbolHeight: 12,
							  symbolWidth: 12,
							  itemStyle: {
								fontSize: '12px',
							  },
							}
						  })
						  chart.updateFlag = true;
						}
					}else{
						if(localStorage.project_owner == 'JKR_SABAH'){
							if (document.fullscreenElement && chart.updateFlag) {
								chart.updateFlag = false;
								
								chart.update({
								  chart:{
									marginTop: 90
								  },
								  title: {
									text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Operational Dashboard<br>'+projectName+'<br>FINANCIAL S-CURVE</span>'
								  },
								  legend: {
									symbolHeight: 15,
									symbolWidth: 15,
									itemStyle : {
									  fontSize : '15px'
									}
								  },
								  tooltip: {
									style: {
										fontSize: '24px'
									}
								  }
								})
					
								chart.updateFlag = true;
							  }
							  else if (chart.updateFlag) {
								chart.updateFlag = false;
					
								chart.update({
									title: {
										text: '<span class="showLabel">Operational Dashboard<br>'+projectName+'<br>FINANCIAL S-CURVE</span>'
									},
									legend: {
										symbolHeight: 12,
										symbolWidth: 12,
										itemStyle: {
										fontSize: '12px',
										},
									},
									tooltip: {
										style: {
											fontSize: '10px'
										}
									},
								})
								chart.updateFlag = true;
							}
						}else{
							if (document.fullscreenElement && chart.updateFlag) {
								chart.updateFlag = false;
								
								chart.update({
									tooltip: {
										style: {
											fontSize: '24px'
										}
									},
								})
					
								chart.updateFlag = true;
							  }
							  else if (chart.updateFlag) {
								chart.updateFlag = false;
					
								chart.update({
									tooltip: {
										style: {
											fontSize: '10px'
										}
									}
								})
								chart.updateFlag = true;
							}
						}
					}
				  }
			},
    	},
    	title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Operational Dashboard<br>'+projectName+'<br>FINANCIAL S-CURVE</span>'
		},
    	xAxis: {
    	    categories: monthYear,
			crosshair: {
                width: 2,
                color: 'silver'
            }
    	},
    	yAxis: {
    		min: 0,
      		max: 100,
      		tickAmount: 5,
    	    title: {
    	        text: ''
    	    },
		    labels: {
  			  format: '{value}%'
  			}
    	},
		tooltip: {
			style: {
				fontSize: '10px'
			},
			formatter: function() {
				var seriesName = this.series.name;
				var html = this.x+'<br>'+seriesName+' : <b>'+this.y+'</b>';
				var seriesVariance = '<br>Variance : '+this.point.options.toolTipVar;

				if((localStorage.project_owner == "JKR_SABAH" && seriesName == 'Actual') || (iframeDigitalReport == "JKR_SABAH" && seriesName == 'Actual')){
					html += seriesVariance;
				}

				return html;
			}
		},
    	plotOptions: {
            series: {
            	label: {
            	    connectorAllowed: false
            	}
        	}
    	},
    	series: [{
    	    name: finEarlyLegend,
    	    data: finEarly,
    	    color: 'red'
    	}, {
    	    name: 'Actual',
    	    data: finPlan,
    	    color: 'blue'
    	}],
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
	    credits: false
	});
	chart.updateFlag = true;
}

function drawPhySCurve(data){
	var phyEarly = [];
	var phyPlan = [];
	var monthYear = [];
	var phyEarlyLegend;
	var projectName;

	if(!iframeDigitalReport){
		if(localStorage.project_owner == "JKR_SABAH"){
			phyEarlyLegend = 'Schedule';
			projectName = localStorage.p_name;
		}else if(localStorage.project_owner == "JKR_SARAWAK"){
			phyEarlyLegend = 'Scheduled';
		}else if(localStorage.project_owner == "SSLR2"){
			phyEarlyLegend = 'Plan';
		}

	}else{
		if(iframeDigitalReport == "JKR_SABAH"){
			phyEarlyLegend = 'Schedule';
			projectName = iframeDigitalReport;
		}else if(iframeDigitalReport == "JKR_SARAWAK"){
			phyEarlyLegend = 'Scheduled';
		}else if(iframeDigitalReport == "SSLR2"){
			phyEarlyLegend = 'Plan';
		}
	}


	(localStorage.p_name == undefined) ? projectName = "" : projectName = localStorage.p_name;

	if(data.monthYear){
		var tempValue = 0;
		var flagCheckValue = true;

		for (var i = 0; i < data.monthYear.length; i++) {
			var mydate = new Date(data.monthYear[i]);
			monthYear.push(mydate.getFullYear()+"-"+(mydate.getMonth() + 1));

	   		phyEarly.push(parseFloat(data.phyEarly[i]));

			tempValue = data.phyPlan[i - 1];
			if((parseFloat(data.phyPlan[i]) == 0.00) && parseFloat(data.phyPlan[i]) < parseFloat(tempValue)) {
				flagCheckValue = false;
			}
			
			if(flagCheckValue){
				var variance = parseFloat(data.phyPlan[i]) - parseFloat(data.phyEarly[i]);
				var tempArr = { toolTipVar: parseFloat(variance).toFixed(2), y: (data.phyPlan[i]) ? parseFloat((data.phyPlan[i])) : 0 }
				phyPlan.push(tempArr);
			}
		}
	}

	var chart =  Highcharts.chart('phyScurve', {
    	chart: {
    	    type: 'line',
			events: {
				render() {
					var chart = this;
		  
					if(ui_pref == 'ri_v3'){
						if (document.fullscreenElement && chart.updateFlag) {
						  chart.updateFlag = false;
						  
						  chart.update({
							chart:{
							  marginTop: 90
							},
							title: {
							  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Operational Dashboard<br>'+projectName+'<br>PHYSICAL S-CURVE</span>'
							},
							legend: {
							  symbolHeight: 15,
							  symbolWidth: 15,
							  itemStyle : {
								fontSize : '15px'
							  }
							},
							tooltip: {
								style: {
									fontSize: '24px'
								}
							}
						  })
			  
						  chart.updateFlag = true;
						}
						else if (chart.updateFlag) {
						  chart.updateFlag = false;
			  
						  chart.update({
							title: {
							  text: '<span class="showLabel">Operational Dashboard<br>'+projectName+'<br>PHYSICAL S-CURVE</span>'
							},
							legend: {
							  symbolHeight: 12,
							  symbolWidth: 12,
							  itemStyle: {
								fontSize: '12px',
							  },
							}
						  })
						  chart.updateFlag = true;
						}
					}else{
						if(localStorage.project_owner == 'JKR_SABAH'){
							if (document.fullscreenElement && chart.updateFlag) {
								chart.updateFlag = false;
								
								chart.update({
									chart:{
										marginTop: 90
									},
									title: {
										text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Operational Dashboard<br>'+projectName+'<br>PHYSICAL S-CURVE</span>'
									},
									legend: {
										symbolHeight: 15,
										symbolWidth: 15,
										itemStyle : {
										fontSize : '15px'
										}
									},
									tooltip: {
										style: {
											fontSize: '24px'
										}
									}
								})
					
								chart.updateFlag = true;
							  }
							  else if (chart.updateFlag) {
								chart.updateFlag = false;
					
								chart.update({
								  title: {
									text: '<span class="showLabel">Operational Dashboard<br>'+projectName+'<br>PHYSICAL S-CURVE</span>'
								  },
								  legend: {
									symbolHeight: 12,
									symbolWidth: 12,
									itemStyle: {
									  fontSize: '12px',
									},
								  }
								})
								chart.updateFlag = true;
							}
						}
					}
				  }
			}
    	},
    	title: {
			useHTML: true,
			enabled: true,
			text: '<span class="showLabel">Operational Dashboard<br>'+projectName+'<br>PHYSICAL S-CURVE</span>'
		},
    	xAxis: {
    	    categories: monthYear,
			crosshair: {
                width: 2,
                color: 'silver'
            }
    	},
    	yAxis: {
    		min: 0,
      		max: 100,
      		tickAmount: 5,
    	    title: {
    	        text: ''
    	    },
		    labels: {
  			  format: '{value}%'
  			}
    	},
		tooltip: {
			style: {
				fontSize: '10px'
			},
			formatter: function() {
				var seriesName = this.series.name;
				var html = this.x+'<br>'+seriesName+' : <b>'+this.y+'</b>';
				var seriesVariance = '<br>Variance : '+this.point.options.toolTipVar;

				if((localStorage.project_owner == "JKR_SABAH" && seriesName == 'Actual') || (iframeDigitalReport == "JKR_SABAH" && seriesName == 'Actual')){
					html += seriesVariance;
				}

				return html;
			}
		},
    	plotOptions: {
            series: {
            	label: {
            	    connectorAllowed: false
            	}
        	}
    	},
    	series: [{
    	    name: phyEarlyLegend,
    	    data: phyEarly,
    	    color: 'red'
    	}, {
    	    name: 'Actual',
    	    data: phyPlan,
    	    color: 'blue'
    	}],
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
	    credits: false
	});
	chart.updateFlag = true;
}

function populateTableData(data){
    let progHTML = '';
	data.forEach(function(ele,idx){
        progHTML += '<tr>'
        progHTML += '<td>'+ele.pps_month_year.split(" ")[0]+'</td>'
        progHTML += '<td>'+parseFloat(ele.pps_financial_early_cm).toFixed(2)+'</td>'
        progHTML += '<td>'+parseFloat(ele.pps_financial_late_cm).toFixed(2)+'</td>'

		if(localStorage.project_owner == 'JKR_SABAH'  || iframeDigitalReport == 'JKR_SABAH'){
			progHTML += '<td>'+parseFloat(ele.pps_financial_var).toFixed(2)+'</td>'
		}


        progHTML += '<td>'+parseFloat(ele.pps_physical_early).toFixed(2)+'</td>'
        progHTML += '<td>'+parseFloat(ele.pps_physical_late).toFixed(2)+'</td>'

		if(localStorage.project_owner == 'JKR_SABAH' || iframeDigitalReport == 'JKR_SABAH'){
			progHTML += '<td>'+parseFloat(ele.pps_physical_var).toFixed(2)+'</td>'
		}

        progHTML += '</tr>';
    })
    $("#progressSummaryTBody").html(progHTML);   
}

function calcTimeElapse(packid = 'overall'){

	var endDateFormat;
    var endDateProject = (progressSummaryData.projInfo && progressSummaryData.projInfo[packid] && progressSummaryData.projInfo[packid]['end_date']) ? progressSummaryData.projInfo[packid]['end_date'] : 0;
	if(endDateProject == 0){
		endDateFormat = "N/A";
	}
	else{
		var endDateFormatObj = new Date(endDateProject);
		endDateFormat = endDateFormatObj.getDate()+" "+ monthHalftext[endDateFormatObj.getMonth() +1]+" "+ endDateFormatObj.getFullYear();
	}
    $("#endDateProj").text(endDateFormat);

    var durationDay = (progressSummaryData.projInfo && progressSummaryData.projInfo[packid] && progressSummaryData.projInfo[packid]['duration']) ? progressSummaryData.projInfo[packid]['duration'] : 0;
    $("#projDur").text(formatThousand(durationDay));

	var startDateFormat;
	var setValTimeElapse;

	var startDateProject = (progressSummaryData.projInfo && progressSummaryData.projInfo[packid] && progressSummaryData.projInfo[packid]['start_date']) ? progressSummaryData.projInfo[packid]['start_date'] : 0;
	if(startDateProject == 0){
		startDateFormat = "N/A";
		setValTimeElapse = "N/A";
	}
	else{
		var startDateFormatObj = new Date(startDateProject);
		startDateFormat = startDateFormatObj.getDate()+" "+ monthHalftext[startDateFormatObj.getMonth() +1]+" "+ startDateFormatObj.getFullYear();
		
		//for Time Elapse
		var currentDate = new Date();
		var diffDay = currentDate - startDateFormatObj;
		var jsCutOffDate = diffDay / (1000 * 60 * 60 * 24);

		var timeElapse = (durationDay && durationDay != 0) ? ((jsCutOffDate / durationDay) * 100) : 'N/A';
		
		var roundTimeElapse = (typeof timeElapse == 'number') ? timeElapse.toFixed(2): 'N/A';
		setValTimeElapse = (roundTimeElapse > 0 ) ? roundTimeElapse : 'N/A';
	}
    $("#startDateProj").text(startDateFormat);
	$("#timeElapse").text(setValTimeElapse);
	
}

function refreshDashboard (projid = 'overall',){
    if (!progressSummaryData) return;
	
	if(localStorage.ui_pref == "ri_v2"){
		var selWPC = $("#wpcFilter").val();
		projid = (selWPC) ? selWPC : 'overall';
	}
	
	calcTimeElapse(projid);

    var tbData = (progressSummaryData.projectSummaryData[projid] && progressSummaryData.projectSummaryData[projid].raw && progressSummaryData.projectSummaryData[projid].raw) ? progressSummaryData.projectSummaryData[projid].raw : [];
    populateTableData(tbData);
    var chartData = (progressSummaryData.projectSummaryData[projid]) ? progressSummaryData.projectSummaryData[projid] : [];
    drawFinSCurve(chartData);
    drawPhySCurve(chartData);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	refreshDashboard(wpc)
}

$(function (){
	// load all the chart

	//get project owner if use org is KKR in Digital Reporting
	iframeDigitalReport = window.frameElement.getAttribute('data-owner');

    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "projectSummary"
        },
        success: function (obj) {
			if(obj.data.ui_pref){
				ui_pref = obj.data.ui_pref
			}

        	if (obj.status && obj.status == 'ok') {
            	progressSummaryData = obj.data;
				if(localStorage.ui_pref == "ri_v3"){
					var projid = '';
					if(localStorage.isParent == 'isParent'){
						$('.filterContainer .packFilter', window.parent.document).prop("selectedIndex", 1);
						projid =  $('.filterContainer .packFilter', window.parent.document).val();
					}else{
						projid = 'overall';
					}
					refreshDashboard(projid);
				}else{
					refreshDashboard();
				}
        	}
        }
    });
    $('.scrollbar-inner').scrollbar();
})