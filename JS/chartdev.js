var mepF1
	var mepF2
	var cvF1
	var cvF2
	var mepELC_F1
	var mepPLB_F1
	var mepELC_F2
	var mepPLB_F2
	var civilFloor1
	var civilDR_F1
	var civilDR_F2
	var civilFloor1
	var civilFloor2
	var lineChart1, lineChart2, lineChart3;
	var lineChart4, lineChart5, lineChart6;
	var lineChart7, lineChart8, lineChart9;

function getPWChartData(){
	
		$.when(
				$.ajax({
					type: "POST",
					url: 'BackEnd/pwGetData.php',
					dataType: 'json',
					success: function (obj) {
						console.log(obj);
						mepF1 = obj.mepF1;
						mepF2 = obj.mepF2;
						cvF1 = obj.cvF1;
						cvF2 = obj.cvF2;
						mepELC_F1 = obj.mepELC_F1
						mepPLB_F1 = obj.mepPLB_F1
						mepELC_F2 = obj.mepELC_F2
						mepPLB_F2 = obj.mepPLB_F2
						civilFloor1 = obj.civilFloor1
						civilDR_F1 = obj.civilDR_F1
						civilDR_F2 = obj.civilDR_F2
						civilFloor1 = obj.civilFloor1
						civilFloor2 = obj.civilFloor2
						plotChart()
						console.log(mepF1)
					},
					error:	function(xhr,textStatus,errorThrown){
						var str = textStatus + " " + errorThrown;
							console.log(str);
						}
				})
			).then( function(){
			
			});	

    }
	function plotChart(){
		if(lineChart1){
			console.log("update");
			lineChart1.data = {
				labels: ['Floor1', 'Floor2'],
				datasets: [{
					label: 'ME',
					backgroundColor: 'rgb(148, 0, 0)',
					borderColor: 'rgb(148, 0, 0)',
					data: [mepF1, mepF2],
				},
				{
					label: 'Civil',
					backgroundColor: 'rgb(61, 61, 61)',
					borderColor: 'rgb(61, 61, 61)',
					data: [cvF1, cvF2],
				},
				],
			};
		    lineChart1.update();

		}else{
			var ctx = document.getElementById('tab1Chart1').getContext('2d');
			lineChart1 = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: ['Floor1', 'Floor2'],
					datasets: [{
						label: 'ME',
						backgroundColor: 'rgb(148, 0, 0)',
						borderColor: 'rgb(148, 0, 0)',
						data: [mepF1, mepF2],
					},
					{
						label: 'Civil',
						backgroundColor: 'rgb(61, 61, 61)',
						borderColor: 'rgb(61, 61, 61)',
						data: [cvF1, cvF2],
					},
					],
				},
				options: {
					responsive: true,
					legend: {
						position: 'top',
					},
					scales: {
						xAxes: [{
							display: true,
							scaleLabel: {
								display: true,
								labelString: 'Improtant Graph'
							},
						}],
						yAxes: [{
							display: true,
							ticks: {
								beginAtZero: true
							},
							scaleLabel: {
								display: true,
								labelString: 'Value'
							},
						}]
					}
				}
			});
		//END of first graph 
		//##################
	
		}
 //##########################
        //Drawing TAB1 first graph 
		if(lineChart2){
			console.log("update");
			lineChart2.data =  {
				labels: ['ME', 'Civil'],
				datasets: [{
					label: 'ELC',
					backgroundColor: 'rgb(226, 100, 86)',
					borderColor: 'rgb(226, 100, 86)',
					data: [mepELC_F1, "0"],
				},
				{
					label: 'PLB',
					backgroundColor: 'rgb(72, 112, 134)',
					borderColor: 'rgb(72, 112, 134)',
					data: [mepPLB_F1, "0"],
				},
				{
					label: 'DR',
					backgroundColor: 'rgb(72, 134, 98)',
					borderColor: 'rgb(72, 134, 98)',
					data: ["0", civilDR_F1],
				}
		
				],
			};
		    lineChart2.update();

		}else{ 
	//##########################
	//Drawing TAB1 second graph 

        var ctx = document.getElementById('tab1Chart2').getContext('2d');
		lineChart2 = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['ME', 'Civil'],
				datasets: [{
					label: 'ELC',
					backgroundColor: 'rgb(226, 100, 86)',
					borderColor: 'rgb(226, 100, 86)',
					data: [mepELC_F1, "0"],
				},
				{
					label: 'PLB',
					backgroundColor: 'rgb(72, 112, 134)',
					borderColor: 'rgb(72, 112, 134)',
					data: [mepPLB_F1, "0"],
				},
				{
					label: 'DR',
					backgroundColor: 'rgb(72, 134, 98)',
					borderColor: 'rgb(72, 134, 98)',
					data: ["0", civilDR_F1],
				}
		
				],
			},
			options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Floor1'
						},
					}],
					yAxes: [{
						display: true,
						ticks: {
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: 'Value'
						},
					}]
				}
			}
		});
	};
    //END of second graph 
    //############ 
	if(lineChart3){
		console.log("update");
		lineChart3.data =  {
			labels: ['ME', 'Civil'],
			datasets: [{
				label: 'ELC',
				backgroundColor: 'rgb(226, 100, 86)',
				borderColor: 'rgb(226, 100, 86)',
				data: [mepELC_F2, "0"],
			},
			{
				label: 'PLB',
				backgroundColor: 'rgb(72, 112, 134)',
				borderColor: 'rgb(72, 112, 134)',
				data: [mepPLB_F2, "0"],
			},
			{
				label: 'DR',
				backgroundColor: 'rgb(72, 134, 98)',
				borderColor: 'rgb(72, 134, 98)',
				data: ["0", civilDR_F2],
			},
		
			],
		};
		lineChart3.update();

	}else{ 
     //##########################
    //Drawing TAB1 Third graph 
		var ctx = document.getElementById('tab1Chart3').getContext('2d');
		lineChart3 = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['ME', 'Civil'],
				datasets: [{
					label: 'ELC',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(0, 99, 132)',
					data: [mepELC_F2, "0"],
				},
				{
					label: 'PLB',
					backgroundColor: 'rgb(30, 0, 0)',
					borderColor: 'rgb(30, 0, 0)',
					data: [mepPLB_F2, "0"],
				},
				{
					label: 'DR',
					backgroundColor: 'rgb(0, 0, 200)',
					borderColor: 'rgb(30, 0, 0)',
					data: ["0", civilDR_F2],
				},
			
				],
			},
			options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Floor2'
						},
					}],
					yAxes: [{
						display: true,
						ticks: {
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: 'Value'
						},
					}]
				}
			}
		});
	};
    //END of Third graph 
    //############
	if(lineChart4){
		console.log("update");
		lineChart4.data =  {
			labels: ['Floor1'],
			datasets: [{
				label: 'ME',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(0, 99, 132)',
				data: [mepF1],
			},
			{
				label: 'Civil',
				backgroundColor: 'rgb(30, 0, 0)',
				borderColor: 'rgb(30, 0, 0)',
				data: [cvF1],
			},
			],
		};
		lineChart4.update();

	}else{ 

	//########################
	//#THIS IS TAB 2 CHART FOR FLOOR 1 INFO OF MEPS AND CIVIL ITEMS
	//########################
	//##########################
        //Drawing TAB2 first graph 
        var ctx = document.getElementById('tab2Chart1').getContext('2d');
        lineChart4 = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Floor1'],
			datasets: [{
				label: 'ME',
				backgroundColor: 'rgb(148, 0, 0)',
				borderColor: 'rgb(148, 0, 0)',
				data: [mepF1],
			},
			{
				label: 'Civil',
				backgroundColor: 'rgb(61, 61, 61)',
				borderColor: 'rgb(61, 61, 61)',
				data: [cvF1],
			},
			],
		},
		options: {
			responsive: true,
			legend: {
				position: 'top',
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Improtant Graph'
					},
				}],
				yAxes: [{
					display: true,
					ticks: {
						beginAtZero: true
					},
					scaleLabel: {
						display: true,
						labelString: 'Value'
					},
				}]
			}
		}
		});
	};
    //END of fourth graph 
    //##################
	if(lineChart5){
		console.log("update");
		lineChart5.data = {
			labels: ['ELC' , 'PLB'],
			datasets: [{
				backgroundColor: ['rgb(226, 100, 86)', 'rgb(72, 112, 134)'],
				data: [mepELC_F1,mepPLB_F1]
			}]
		};
		lineChart5.update();

	}else{ 
	//##########################
	//Drawing TAB2 second graph 

		var ctx = document.getElementById('tab2Chart2').getContext('2d');
		lineChart5 = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['ELC' , 'PLB'],
				datasets: [{
					backgroundColor: ['rgb(255, 99, 132)', 'rgb(60, 60, 60)'],
					data: [mepELC_F1,mepPLB_F1]
				}]
			},
			
			options: {
				title: {
					display: true,
					text: 'MEP FLOOR 1',
					position: 'top'
				}
			},
			
		});
	};
    //END of fifth graph 
	//############ 
	if(lineChart6){
		console.log("update");
		lineChart6.data = {
			labels: ['DR' ],
			datasets: [{
				backgroundColor: ['rgb(72, 134, 98)'],
				data: [civilDR_F1]
			}]
		};
		lineChart6.update();

	}else{ 
	//##########################
		//Drawing TAB2 THIRD graph 

		var ctx = document.getElementById('tab2Chart3').getContext('2d');
		lineChart6 = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['DR' ],
				datasets: [{
					backgroundColor: ['rgb(255, 99, 132)'],
					data: [civilDR_F1]
				}]
			},
			
			options: {
				title: {
					display: true,
					text: 'CIVIL FLOOR 1',
					position: 'top'
				}
			},
			
		});
	};
    //END of TAB2 THIRD graph 
	//############ 
	if(lineChart7){
		console.log("update");
		lineChart7.data = {
			labels: ['Floor2'],
			datasets: [{
				label: 'ME',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(0, 99, 132)',
				data: [mepF2],
			},
			{
				label: 'Civil',
				backgroundColor: 'rgb(30, 0, 0)',
				borderColor: 'rgb(30, 0, 0)',
				data: [cvF2],
			},
		],
		};
		lineChart7.update();

	}else{ 
	//########################
	//#THIS IS TAB 3 CHART FOR FLOOR 2 INFO OF MEPS AND CIVIL ITEMS
	//########################
	//##########################
        //Drawing TAB3 first graph 
       var ctx = document.getElementById('tab3Chart1').getContext('2d');
        lineChart7 = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Floor2'],
			datasets: [{
				label: 'ME',
				backgroundColor: 'rgb(148, 0, 0)',
				borderColor: 'rgb(148, 0, 0)',
				data: [mepF2],
			},
			{
				label: 'Civil',
				backgroundColor: 'rgb(61, 61, 61)',
				borderColor: 'rgb(61, 61, 61)',
				data: [cvF2],
			},
		],
		},
		options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Improtant Graph'
						},
					}],
					yAxes: [{
						display: true,
						ticks: {
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: 'Value'
						},
					}]
				}
			}
		 });
	}
    //END of first graph 
    //##################
	if(lineChart8){
		console.log("update");
		lineChart8.data ={
			labels: ['ELC' , 'PLB'],
			datasets: [{
				backgroundColor: ['rgb(226, 100, 86)', 'rgb(72, 112, 134)'],
				data: [mepELC_F2,mepPLB_F2]
			}]
		};
		lineChart8.update();

	}else{ 
	//##########################
	//Drawing TAB3 second graph 

		var ctx = document.getElementById('tab3Chart2').getContext('2d');
		lineChart8 = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['ELC' , 'PLB'],
				datasets: [{
					backgroundColor: ['rgb(255, 99, 132)', 'rgb(60, 60, 60)'],
					data: [mepELC_F2,mepPLB_F2]
				}]
			},
			
			options: {
				title: {
					display: true,
					text: 'MEP FLOOR 2',
					position: 'top'
				}
			},
			
		});
	};
    //END of second graph 
	//############ 
	if(lineChart9){
		console.log("update");
		lineChart9.data = {
			labels: ['DR' ],
			datasets: [{
				backgroundColor: ['rgb(72, 134, 98)'],
				data: [civilDR_F2]
			}]
		};
		lineChart9.update();

	}else{ 
	//##########################
	//Drawing TAB3 THIRD graph 

		var ctx = document.getElementById('tab3Chart3').getContext('2d');
		lineChart9 = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['DR' ],
				datasets: [{
					backgroundColor: ['rgb(255, 99, 132)'],
					data: [civilDR_F2]
				}]
			},
			
			options: {
				title: {
					display: true,
					text: 'CIVIL FLOOR 2',
					position: 'top'
				}
			},
			
		});
	};
    //END of TAB3 THIRD graph 
    //############ 
}
       



