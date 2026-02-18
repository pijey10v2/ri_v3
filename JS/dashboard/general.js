var generalData;

function drawProjectSchedule(){
	var duration = parseFloat(350);
	var pastDays = parseFloat(150);
	var calcDuration = (pastDays / duration) * 100;
	
	var gaugeOptions = {
        chart: {
            type: 'solidgauge',
			marginTop: 10
        },
        tooltip: {
            enabled: true,
			pointFormat: (calcDuration).toFixed(2) + '%'
        },
		title: {
			text: 'Project Duration',
			align: 'center',
			verticalAlign: 'bottom',
			style:{
				color: "#1C4E80",
				fontSize: '15px',
				fontFamily: 'Arial, Helvetica, sans-serif',
			}
		},
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: {
				backgroundColor: '#a5dcdd',
				innerRadius: '88%',
				outerRadius: '101%',
				shape: 'arc',
				borderWidth: 0,
			},
        },
        plotOptions: {
            solidgauge: {
                linecap: 'round',
                stickyTracking: false,
                rounded: true,
                dataLabels: {
                    y: -17,
                    borderWidth: 0,
                    useHTML: true
                }
            },
        },
        credits: false
    };

    var dataLabelOptions = {
        format:
            '<div style = "opacity:1">' +
            '<span style="font-size:11.5px">'+duration+' Days</span>' +
            '</div>'
    };

    Highcharts.chart('projectDuration', Highcharts.merge(gaugeOptions, {
		
        yAxis: {
            min: 0,
            max: 100,
			tickInterval:500,
        },
        series: [{
            data: [{
                radius: '102%',
                innerRadius: '88%',
                y: calcDuration,
            }],
            dataLabels: dataLabelOptions,
        }]
    }));

}

function drawFinSCurve(data){
	var finEarly = [];
	var finPlan = [];
	var finActual = [];
	var monthYear = [];

    if (data.finEarly) {
	   data.finEarly.forEach(function(ele,idx){
	   	finEarly.push(parseFloat(ele));
	   })
    }
    if (data.finPlan) {
	   data.finPlan.forEach(function(ele,idx){
	   	finPlan.push(parseFloat(ele));
	   })
    }
    if (data.monthYear) {
	   data.monthYear.forEach(function(ele,idx){
	   	var mydate = new Date(ele);
	   	monthYear.push(mydate.getFullYear()+"-"+mydate.getMonth());
	   })
    }
    if (data.finActual) {
	   for (let i = 0; i < data.finActual.length; i++) {
            if (data.finActual[i] == null) break;
	   	   finActual.push(parseFloat(data.finActual[i]));
        }
	}
	Highcharts.chart('finScurve', {
    	chart: {
    	    type: 'line'
    	},
		title: {
			text: 'Financial S-Curve',
			align: 'center',
			verticalAlign: 'top',
			style:{
				color: "#1C4E80",
				fontSize: '15px',
				fontFamily: 'Arial, Helvetica, sans-serif',
			}
		},
    	xAxis: {
    	    categories: monthYear
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
    	plotOptions: {
            series: {
            	label: {
            	    connectorAllowed: false
            	}
        	}
    	},
    	series: [{
    	    name: 'Early',
    	    data: finEarly,
    	    color: '#EA6A47'
    	}, {
    	    name: 'Late',
    	    data: finPlan,
    	    color: '#0091D5'
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
}

function drawPhySCurve(data){
	var phyEarly = [];
	var phyPlan = [];
	var phyAct = [];
	var monthYear = [];

    if (data.phyEarly) {
    	data.phyEarly.forEach(function(ele,idx){
    		phyEarly.push(parseFloat(ele));
    	})
    }
    if (data.phyPlan) {
	   data.phyPlan.forEach(function(ele,idx){
	   	phyPlan.push(parseFloat(ele));
	   })
    }
    if (data.monthYear) {
	   data.monthYear.forEach(function(ele,idx){
	   	var mydate = new Date(ele);
	   	monthYear.push(mydate.getFullYear()+"-"+mydate.getMonth());
	   })
    }
    if (data.phyAct) {
       for (let i = 0; i < data.phyAct.length; i++) {
           if (data.phyAct[i] == null) break;
           phyAct.push(parseFloat(data.phyAct[i]));
        }
    }

	Highcharts.chart('phyScurve', {
    	chart: {
    	    type: 'line'
    	},
		title: {
			text: 'Physical S-Curve',
			align: 'center',
			verticalAlign: 'top',
			style:{
				color: "#1C4E80",
				fontSize: '15px',
				fontFamily: 'Arial, Helvetica, sans-serif',
			}
		},
    	xAxis: {
    	    categories: monthYear
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
    	plotOptions: {
            series: {
            	label: {
            	    connectorAllowed: false
            	}
        	}
    	},
    	series: [{
    	    name: 'Early',
    	    data: phyEarly,
    	    color: '#EA6A47'
    	}, {
    	    name: 'Planned',
    	    data: phyPlan,
    	    color: '#0091D5'
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
}

function updateContractDetails(){
    let projectTbHTML = '';
    $("#contractDetails").html("");
    // if (data) 
        projectTbHTML += '<tr>'
        projectTbHTML += '<td>Contract No.</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td>Original Completion Date</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td>Commencement Completion Date</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td>Extension of Time (EOT)</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td>Revised Completion Date</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td>Original Contract Sum</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<td>Nett Variation Sum</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<td>Revised Contract Sum</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<td>Total Cumulative Claim to Date</td>'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<td>Total Cumulative Claim Certified'
        projectTbHTML += '<td></td>'
        projectTbHTML += '</tr>';
    // }
    $("#contractDetails").html(projectTbHTML);
}

function refreshDashboard(){
	refreshInformation('overall', 'all', 'all');
}

function refreshInformation(packid = 'overall', year = 'all', month = 'all'){
	drawProjectSchedule(); //SCURVE
	updateContractDetails(); //CONTRACT
    var chartData = (generalData.projectSummaryData[packid]) ? generalData.projectSummaryData[packid] : [];
    drawFinSCurve(chartData);
    drawPhySCurve(chartData);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "general"
        },
        success: function (obj) {

        	if (obj.status && obj.status == 'ok') {
                var data = obj.data;
                generalData = data;
                refreshInformation();
        	}
        }
    });
})