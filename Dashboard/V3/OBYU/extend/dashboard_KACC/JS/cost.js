var costData;

function format_number(n, type){
    return Number(parseFloat(n).toFixed(2));
}

function conOpLink(process='', status='', param1='', param2=''){
    var searchilter = getDateFromToFilter();
    linkWinTitle = 'Contract'
    linkName = 'finance_list_contract_list_card'
    if(param1 == ''){
        param1 = '0';
    }
    linkParamArr = processFilterParamArr([searchilter.section, param1, param2])
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle);
}

function drawIndexChart(level, id, tooltip = false, subTitle) {
    var val;
    var title;
    switch (level) {
        case 1:
            val = 30;
            break;
        case 0:
            val = 90;
            break;
        case -1:
            val = 150;
            break;
        default:
            val = 0;
    }

    (id == "cashflowHeathIndexChart") ? title = 'CASHFLOW HEALTH' : title = 'PAYMENT AGING';

    var chart = Highcharts.chart(id, {
        chart: {
            type: 'gauge',
            height: '60%',
            events: {
                load: function () {
                    $('.gauge-chart').css('height', '80%');
                },
                render() {
                    var chart = this;

                    if(localStorage.ui_pref == 'ri_v3'){
                        if (document.fullscreenElement && chart.updateFlag) {
                          chart.updateFlag = false;
                          chart.update({
                            chart:{
                              marginTop: 100
                            },
                            title: {
                              text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Cost Management<br>'+localStorage.p_name+'<br>'+title+'<br>'+
                                    'Ratio = Inflow - outflow<br>Green: >=1, Yellow: 0, Red: <= -1</span>'
                            }
                          })
              
                          chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                          chart.updateFlag = false;
              
                          chart.update({
                            title: {
                              text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>'+title+'<br>'+
                                    'Ratio = Inflow - outflow<br>Green: >=1, Yellow: 0, Red: <= -1</span>'
                            }
                          })
                        }
                    }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>'+title+'<br>'+
                  'Ratio = Inflow - outflow<br>Green: >=1, Yellow: 0, Red: <= -1</span>'
        },
        subtitle: {
            useHTML : true,
            text: subTitle,
            verticalAlign: 'bottom',
            align: 'center'
        },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{
                // default background
                backgroundColor: '#fff',
                borderWidth: 0
            }]
        },
        // the value axis
        yAxis: {
            min: 0,
            max: 180,
            plotBands: [{
                from: 0,
                to: 60,
                color: '#55BF3B' // green
            }, {
                from: 60,
                to: 120,
                color: '#DDDF0D' // yellow
            }, {
                from: 120,
                to: 180,
                color: '#DF5353' // red
            }],
            labels: {
                enabled: false
            }
        },
        series: [{
            showInLegend: false,
            data: [val]
        }],
        tooltip: {
            formatter: function () {
                if (tooltip) {
                    return tooltip;
                } else {
                    return false;
                }
            }
        },
        credits: false,
        plotOptions: {
            gauge: {
                dataLabels: {
                    enabled: false
                }
            }
        }
    });
    chart.updateFlag = true;
}

function updateContractParticularCard(data, contract_id='') {    
    var contractNoCard = (data.contract_no) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ (data.contract_no) +`</span>` : 'N/A';
    var origCompDateCard = (data.completion_date) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ (data.completion_date) +`</span>`  : 'N/A';
    var commencementDateCard = (data.loa_date) ? `<span class="clickableCard" onclick="conOpLink('Contract','',  '`+contract_id+`', '`+data.contract_no+`')">`+ (data.loa_date) +`</span>`  : 'N/A';
    var extensionOfTimeCard = (data.extension_of_time) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ (data.extension_of_time) +`</span>`  : '0';
    var revisedCompletionDateCard = (data.revised_completion_date) ? `<span class="clickableCard" onclick="conOpLink('Contract', '',  '`+contract_id+`', '`+data.contract_no+`')">`+ (data.revised_completion_date) +`</span>`  : 'N/A';
    var subContractorValue = (data.total_subcontractor_amount) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ ('RM ' + formatCurrency(data.total_subcontractor_amount)) +`</span>`  : 'N/A';

    $("#contractNoCard").html(contractNoCard);
    $("#origCompDateCard").html(origCompDateCard);
    $("#commencementDateCard").html(commencementDateCard);
    $("#extensionOfTimeCard").html(extensionOfTimeCard);
    $("#revisedCompletionDateCard").html(revisedCompletionDateCard);
    $("#subConVal").html(subContractorValue);
}

function updateSumCard(orig, revised, nett, contract_id='') {
    var origCard = `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`')">`+orig+`</span>`;
    var revisedCard = `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`')">`+revised+`</span>`;
    var nettCard = `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`')">`+nett+`</span>`;

    $("#origContractSumCard").html(origCard);
    $("#revisedContractSumCard").html(revisedCard);
    $("#nettVariationSumCard").html(nettCard);
}

function updateCumulativeCard(claim, claimCertified, payment, contract_id='') {
    var claimCard = `<span class="clickableCard" onclick="conOpLink('Contract','', '`+contract_id+`')">`+claim+`</span>`;
    var claimCertifiedCard = `<span class="clickableCard" onclick="conOpLink('Contract','', '`+contract_id+`')">`+claimCertified+`</span>`;
    var paymentCard = `<span class="clickableCard" onclick="conOpLink('Contract','', '`+contract_id+`')">`+payment+`</span>`;

    $('#claimCumulCard').html(claimCard);
    $('#claimCumulCertifiedCard').html(claimCertifiedCard);
    $('#cumulPaymentCard').html(paymentCard);
}

function drawFinSCurve(data) {
    var finPlan = [];
    var finActual = [];
    var monthYear = [];

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            finPlan.push((ele.finEarly) ? format_number(ele.finEarly) : 0);
            finActual.push(format_number(ele.finActual));

            // if (ele.finActual == null) continue;
        }
    }
    var chart = Highcharts.chart('finScurve', {
        chart: {
            type: 'line',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Cost Management<br>'+localStorage.p_name+'<br>PROJECT FINANCIAL S-CURVE (PLANNED VS ACTUAL) (Month: all - Year: all)</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>PROJECT FINANCIAL S-CURVE (PLANNED VS ACTUAL) (Month: all - Year: all)</span>'
                          },
                          legend: {
                            symbolHeight: 12,
                            symbolWidth: 12,
                            itemStyle : {
                              fontSize : '12px'
                            }
                          }
                        })
                      }
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>PROJECT FINANCIAL S-CURVE (PLANNED VS ACTUAL) (Month: all - Year: all)</span>'
        },
        xAxis: {
            categories: monthYear,
            crosshair: {
                width: 0.5,
                color: 'gray',
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
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: [{
            name: 'Planned',
            data: finPlan,
            color: 'blue'
        }, {
            name: 'Actual',
            data: finActual,
            color: 'green'
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

function drawCostChart(data) {
    var paymentData = [];
    var claimData = [];
    var catArr = [];
    var colorPayment;
    var colorClaim;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            paymentData.push((ele && ele.payment) ? parseInt(ele.payment) : 0);
            claimData.push((ele && ele.claim) ? parseInt(ele.claim) : 0);
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        colorPayment = Highcharts.getOptions().colors[0];
        colorClaim = Highcharts.getOptions().colors[4];
    }else{
        colorPayment = '#7cb5ec';
        colorClaim = '#434348';
    }

    var chart = Highcharts.chart('costClaimPaymentChart', {
        chart: {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Cost Management<br>'+localStorage.p_name+'<br>COST</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>COST</span>'
                          },
                          legend: {
                            symbolHeight: 8,
                            symbolWidth: 8,
                            itemStyle : {
                              fontSize : '8px'
                            }
                          }
                        })
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>COST</span>'
        },
        credits: {
            enabled: false
        }, yAxis: {
            title: {
                text: ''
            }
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            itemStyle: {
                fontSize: 8
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
            name: 'Payment',
            data: paymentData,
            color: colorPayment
        }, {
            name: 'Claim',
            data: claimData,
            color: colorClaim
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
    });
    chart.updateFlag = true;
}

function updateLadChart(data) {
    // 1 - green, 0 - yellow, -1 - red
    var val = (typeof data.val != 'undefined') ? data.val : 'N/A';

    $('.trafficChart').css('opacity', '0.1');
    if (val == 1) {
        $('.trafficChart-green').css('opacity', '1');
    } else if (val == 0) {
        $('.trafficChart-yellow').css('opacity', '1');
    } else if (val == -1) {
        $('.trafficChart-red').css('opacity', '1');
    }

    var ladPlanPhyValCard = `<span class="clickableCard" onclick="conOpLink('Contract','')">`+(data.finEarly) ? parseFloat(data.finEarly).toFixed(2) : '0.00'+`</span>`;
    var ladActPhyValCard = `<span class="clickableCard" onclick="conOpLink('Contract','')">`+(data.finActual) ? parseFloat(data.finActual).toFixed(2) : '0.00'+`</span>`;
    var ladDiffPhyValCard = `<span class="clickableCard" onclick="conOpLink('Contract','')">`+(data.diff) ? parseFloat(data.diff).toFixed(2) : '0.00'+`</span>`;

    $("#ladPlanPhyVal").html(ladPlanPhyValCard);
    $("#ladActPhyVal").html(ladActPhyValCard);
    $("#ladDiffPhyVal").html(ladDiffPhyValCard);
}

function refreshInformation(projid = 'overall', section= 'overall') {
    // 13/2/2023 HAZIRAH comment as they asked to change to PAYMENT AND CLAIM GRAPH
    // Financial S Curve
    // var finScurveData = (costData.finSCurve && costData.finSCurve[projid] && costData.finSCurve[projid][section] && costData.finSCurve[projid][section].byMonYr) ? costData.finSCurve[projid][section].byMonYr : [];
    // drawFinSCurve(finScurveData);

    var paymentAndClaimDataOrig = (costData.paymentAndClaim && costData.paymentAndClaim[projid] && costData.paymentAndClaim[projid][section]) ? costData.paymentAndClaim[projid][section] : [];
    drawCostChart(paymentAndClaimDataOrig);
    
    // update card
    var sec = (section == 'overall') ? 'sum' : section;
    var contractData = (costData.contractInfo && costData.contractInfo[projid] && costData.contractInfo[projid][sec]) ? costData.contractInfo[projid][sec] : [];
    
    if(sec == 'sum'){
        var contractIDCost =  (contractData.contract_ids) ? contractData.contract_ids.join(',') : '';
    }else{
        var contractIDCost =  (contractData.contract_id) ? parseInt(contractData.contract_id) : '';
    }
    updateContractParticularCard(contractData, contractIDCost);

    var origContractSum = (contractData.original_amount) ? formatCurrency(contractData.original_amount) : '0.00';
    var revisedContractSum = (contractData.new_amount) ? formatCurrency(contractData.new_amount) : '0.00';
    var nettVarSum = (contractData.total_vo_amount_completed) ? formatCurrency(contractData.total_vo_amount_completed) : '0.00';
    updateSumCard(origContractSum, revisedContractSum, nettVarSum, contractIDCost) ;
    
    var cumulClaimToDate = (contractData.total_claim_vo_and_claim) ? formatCurrency(contractData.total_claim_vo_and_claim) : '0.00';
    var cumulPayReceived = (contractData.cumulative_payment_received) ? formatCurrency(contractData.cumulative_payment_received) : '0.00';
    var cumulCertAmt = (contractData.cumulative_certified_amount) ? formatCurrency(contractData.cumulative_certified_amount) : '0.00';
    updateCumulativeCard(cumulClaimToDate, cumulCertAmt, cumulPayReceived, contractIDCost);

    // index charts
    var cashData = (costData.indicator && costData.indicator.cashOutFlow) ? costData.indicator.cashOutFlow : [];
    var cashInOutIndicatorData = (cashData[projid] && cashData[projid][section]) ? cashData[projid][section] : [];
    var cashIndicator = cashInOutIndicatorData.val;
    var cashInFlow = cashInOutIndicatorData.inflow;
    var cashOutFlow = cashInOutIndicatorData.outflow;
    var cashtooltipText;
    if (cashInFlow != '' || cashOutFlow != '') {
        cashtooltipText = 'Total Claim <b> RM ' + formatCurrency(cashInFlow) + '</b><br/> Total Outflow <b>RM ' + formatCurrency(cashOutFlow) + '<b>';
    }
    drawIndexChart(cashIndicator, 'cashflowHeathIndexChart', cashtooltipText, '');

    var paymentAgingData = (costData.indicator && costData.indicator.paymentAging  && costData.indicator.paymentAging[projid] && costData.indicator.paymentAging[projid][section]) ? costData.indicator.paymentAging[projid][section] : 0;
    var paymentAgingLevel = (paymentAgingData.level) ? paymentAgingData.level : 0;
    paymentAgingtooltipText = 'Average <b>'+ ((paymentAgingData.value) ? paymentAgingData.value : 0) +'</b>';

    drawIndexChart(parseInt(paymentAgingLevel), 'paymentAgingChart', paymentAgingtooltipText, '');

    var ladData = (costData.indicator && costData.indicator.lad && costData.indicator.lad[projid] && costData.indicator.lad[projid][section]) ? costData.indicator.lad[projid][section] : [];
    updateLadChart(ladData);
}

function refreshDashboard() {
    var selWPC = $("#wpcFilter").val();
    var selSection = $("#sectionFilter").val();
    refreshInformation(selWPC, selSection);
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

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var section = filterArr.section;
  
    refreshInformation(wpc, section);
}

$(function () {
    // load all the chart
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "cost"
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                costData = obj.data;
                var sectionData = (costData.sectionList && costData.sectionList['overall']) ? costData.sectionList['overall'] : [];
                populateSectionFilter(sectionData);
                
                if(localStorage.isParent && localStorage.isParent == 'isParent'){
                    refreshInformation('---', 'overall');
                }else{
                    refreshInformation();
                }
            }
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });

    $(".outer").css("height", "100%");
    $(".outer").css("width", "100%");
    $(".outer").css("margin", '0');

    // only update section filter when overall changed
    $("#wpcFilter").change(function () {
        var sectionData = (costData && costData.sectionList && costData.sectionList[$(this).val()]) ? costData.sectionList[$(this).val()] : [];
        populateSectionFilter(sectionData);
        refreshDashboard();
    })

})