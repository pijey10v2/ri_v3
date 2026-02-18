var procurement;

function conOpLink(process, ref_id, pro_id){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
   
    var cardName ;
    
    switch (process) {
        case 'Contract':
            linkWinTitle = 'CONTRACT DETAILS'
            linkName = 'finance_contract_dash_card_SSLR2'
            cardName = "Contract - " + pro_id;
            linkParamArr = processFilterParamArr([ ref_id])
          
            break;
        case 'Claim':
            linkWinTitle = 'INTERIM PAYMENT CLAIM'
            linkName = 'finance_dash_claim_card_SSLR2'

            cardName = pro_id;
            linkParamArr = processFilterParamArr([ ref_id ])
            break;
        case 'ContractClaim':
          linkWinTitle = 'INTERIM PAYMENT CLAIM'
          linkName = 'finance_dash_claim_card_SSLR2'

          cardName = "";
          linkParamArr = processFilterParamArr([ '', ref_id ])
          break;
        case 'VO':
            linkWinTitle = 'VO'
            linkName = 'finance_dash_vo_card_SSLR2'
    
            cardName = pro_id;
            linkParamArr = processFilterParamArr([ ref_id ])
            break;
        case 'Acs':
            linkWinTitle = 'ACS'
            linkName = 'finance_dash_acs_card_SSLR2'
    
            cardName = "" + pro_id;
            linkParamArr = processFilterParamArr([ ref_id ])
            break;
        case 'Eot':
            linkWinTitle = 'EOT'
            linkName = 'finance_dash_eot_card_SSLR2'
    
            cardName = "" + pro_id;
            linkParamArr = processFilterParamArr([ ref_id ])
            break;
            
    }

    if(localStorage.isParent == 'isParent'){
      var project_id = linkParamArr[0];
      project_id = project_id.substring(project_id.indexOf('_')+1);
      project_id = project_id.substring(0, project_id.lastIndexOf('_'));
      linkParamArr[0] = project_id;
    }
   
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function drawTableclaim(data){
    
    var currentIPCHtml = 'N/A';
    var workDoneFromHtml = 'N/A';
    var workDoneToHtml = 'N/A';
    var currentIPCAmtHtml = 'N/A';
    var totalCumulCertifieCHtml = 'N/A';
    var totalCumulbyClienCHtml = 'N/A';

    if(data.ipc_no){
        currentIPCHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '`+data.id+`', '`+data.ipc_no+`')">`+data.ipc_no+`</span>`;
    }

    if(data.work_done_from){
        workDoneFromHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '`+data.id+`', '`+data.ipc_no+`')">`+data.work_done_from+`</span>`;
    }

    if(data.work_done_to){
        workDoneToHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '`+data.id+`', '`+data.ipc_no+`')">`+data.work_done_to+`</span>`;
    }

    if(data.current_ipc_amount){
        currentIPCAmtHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '`+data.id+`', '`+data.ipc_no+`')">`+ formatCurrency(data.current_ipc_amount)+`</span>`;
    }

    if(data.cumulative_ipc_amount){
        totalCumulCertifieCHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '`+data.id+`', '`+data.ipc_no+`')">`+data.cumulative_ipc_amount+`</span>`;
    }

    if(data.payment_received_amount){
        totalCumulbyClienCHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '`+data.id+`', '`+data.ipc_no+`')">`+data.payment_received_amount+`</span>`;
    }

    $('#currentIPC').html(currentIPCHtml);
    $('#workDoneFrom').html(workDoneFromHtml);
    $('#workDoneTo').html(workDoneToHtml);
    $('#currentIPCAmt').html(currentIPCAmtHtml);
    // $('#totalCumulCertified').html(totalCumulCertifieCHtml);
    // $('#totalCumulbyClient').html(totalCumulbyClienCHtml);
}

function updateProcurementCard(data, voData){

    var contract_id = data.id;

    var conNoCard =  (data.contract_no)? data.contract_no : "N/A";
    var conClientCard =  (data.client_name)? data.client_name : "N/A";
    var conleadconsultCard =  (data.lead_consultant)? data.lead_consultant : "N/A";
    var concontractorCard =  (data.contractor_name)? data.contractor_name : "N/A";
    var concommencedateCard =  (data.commencement_date)? data.commencement_date : "N/A";
    var concompletiondateCard =  (data.original_completion_date)? data.original_completion_date : "N/A";
    var conorigsumCard =  (data.original_contract_sum)? data.original_contract_sum : "N/A";
    var conladCard =  (data.lad_per_day)? data.lad_per_day : "N/A";
    var conDuration = (data.orginal_contract_period)? data.orginal_contract_period : "N/A";
    
    if(conNoCard != "N/A"){
        conNoCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+data.contract_no+`</span>`;
    }

    if(conClientCard != "N/A"){
        conClientCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+data.client_name+`</span>`;
    }

    if(conleadconsultCard != "N/A"){
        conleadconsultCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+data.lead_consultant+`</span>`;
    }

    if(concontractorCard != "N/A"){
        concontractorCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+data.contractor_name+`</span>`;
    }

    if(concommencedateCard != "N/A"){
        concommencedateCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+data.commencement_date+`</span>`;
    }

    if(concompletiondateCard != "N/A"){
        concompletiondateCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+data.original_completion_date+`</span>`;
    }

    if(conorigsumCard != "N/A"){
        conorigsumCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+ formatCurrency(data.original_contract_sum) +`</span>`;
    }

    if(conladCard != "N/A"){
        conladCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+ formatCurrency(data.lad_per_day) +`</span>`;
    }

    if(conDuration != "N/A"){
        conDuration = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '`+data.contract_no+`')">`+ data.orginal_contract_period +`</span>`;
    }
    
    $('#conNoCard').html(conNoCard)
    $('#conClient').html(conClientCard)
    $('#conleadconsult').html(conleadconsultCard)
    $('#concontractor').html(concontractorCard)
    $('#concommencedate').html(concommencedateCard)
    $('#concompletiondate').html(concompletiondateCard)
    $('#conorigsum').html(conorigsumCard)
    $('#conlad').html(conladCard)
    $('#conOriDuration').html(conDuration);

    
    var totalCumulCertifieCHtml =  (data.cumulative_ipc_amount)? data.cumulative_ipc_amount : "N/A";
    var totalCumulbyClienCHtml =  (data.cumulative_payment_received)? data.cumulative_payment_received : "N/A";

    if(totalCumulCertifieCHtml != "N/A"){
      totalCumulCertifieCHtml = `<span class="clickableCard" onclick="conOpLink('ContractClaim', '`+contract_id+`', '')">`+ formatCurrency(data.cumulative_ipc_amount) +`</span>`;
    }

    if(totalCumulbyClienCHtml != "N/A"){
      totalCumulbyClienCHtml = `<span class="clickableCard" onclick="conOpLink('ContractClaim', '`+contract_id+`', '')">`+ formatCurrency(data.cumulative_payment_received) +`</span>`;
    }

    $('#totalCumulCertified').html(totalCumulCertifieCHtml);
    $('#totalCumulbyClient').html(totalCumulbyClienCHtml);
    
    var RevisedContractHtml =  (data.revised_contract_sum)? data.revised_contract_sum : "N/A";
    if(RevisedContractHtml != "N/A"){
      RevisedContractHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+ formatCurrency(data.revised_contract_sum) +`</span>`;
    }
    
    $('#revisedContractSum').html(RevisedContractHtml);

    var cumulVoAmt =  (data.cumulative_approved_vo_amount)? data.cumulative_approved_vo_amount : "N/A";
    if(cumulVoAmt != "N/A"){
      cumulVoAmt = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', '')">`+ formatCurrency(data.cumulative_approved_vo_amount) +`</span>`;
    }
    
    $('#DSApprovedVONet').html(cumulVoAmt);

    var revisedCompletionDateHtml =  (data.revised_completion_date)? data.revised_completion_date : "0";
    if(revisedCompletionDateHtml != "N/A"){
        revisedCompletionDateHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+ data.revised_completion_date +`</span>`;
    }
    $('#revisedCompletionDate').html(revisedCompletionDateHtml);
}

function updateVoCard(data){
    var data = data.calculateCard;
    if(data == undefined){
      return;
    }

    var voNothtml = '';
    var voAmthtml = '0.00';

    var voNo =  (data.voNo)? data.voNo : "N/A";
    var voAmt =  (data.total)? data.total : "0";
    var contract_id = data.contract_id;

    if(voNo != "N/A"){
        voNothtml = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', '')">`+voNo+`</span>`;
    }

    if(voAmt != "0"){
        voAmthtml = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', '')">`+formatCurrency(voAmt)+`</span>`;
    }

    $('#DSApprovedVo').html(voNothtml)
    $('#DSApprovedVONet').html(voAmthtml)
}

function updateAcsCard(data, contract){
   
    var data = data.calculateCard;
    if(data == undefined){
      return;
    }
    if(contract == undefined){
        return;
    }
    var noHtml = '';
    var Amthtml = '';

    var acsNo =  (data.acsNo)? data.acsNo : "N/A";
    var total =  (data.acsNet)? data.acsNet : "0";

    if(acsNo != "N/A"){
        noHtml = `<span class="clickableCard" onclick="conOpLink('Acs', '`+contract.contract_id+`', '`+acsNo+`')">`+acsNo+`</span>`;
    }

    if(total != "0"){
        Amthtml = `<span class="clickableCard" onclick="conOpLink('Acs', '`+contract.contract_id+`', '`+acsNo+`')">`+formatCurrency(total)+`</span>`;
    }
    
    $('#DSApprovedACS').html(noHtml)
    $('#DSApprovedNetAdj').html(Amthtml)
}

function updateEotCard(data, vo){

    var data = data.calculateCard;
    var total = "0";
    
    if(data != undefined){
      var noHtml = '';
      var Amthtml = '';

      var num =  (data.eotNo)? data.eotNo : "N/A";
      total =  (data.eotDays)? data.eotDays : "0";

      if(num != "N/A"){
          noHtml = `<span class="clickableCard" onclick="conOpLink('Eot', '`+data.id+`', '`+num+`')">`+num+`</span>`;
      }

      if(total != "0"){
          Amthtml = `<span class="clickableCard" onclick="conOpLink('Eot', '`+data.id+`', '`+num+`')">`+total+`</span>`;
      }
      
      $('#ApprovedEOT').html(noHtml)
      $('#ApprovedEOTDays').html(Amthtml)
    }

    var vo = vo.calculateCard;

    if(vo != undefined){
      var totalEot = parseInt(total) + parseInt(vo.totalEot);
      $('#totalApprovedEOTDays').html(totalEot)

      var contract_id = vo.contract_id;

      var voeot = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', '')">`+vo.totalEot+`</span>`;

      $('#ApprovedEOTfromVO').html(voeot)
    }
    
}

function drawClaimVoChart(claim, data, contract){
  var dataArr = [];
  var percentArr = [];
  var nameArr = [];
  var color1;
  var color2;
  var color3;
  var color4;

  if (contract.revised_contract_sum && contract.cumulative_ipc_amount) {
    if (contract.cumulative_ipc_amount) {
      dataArr.push(parseFloat(contract.cumulative_ipc_amount));
      nameArr.push('Total Cumulative Certified Payment');
    }
    if (contract.revised_contract_sum) {
      dataArr.push(parseFloat(contract.revised_contract_sum));
      nameArr.push('Revised Contract Sum (RM)');
    }
  }

  if (data.calculateCard && contract) {
    if(data.calculateCard.total){
      dataArr.push(parseFloat(data.calculateCard.total));
      nameArr.push('Approved Variation Order Nett');
    }
    if (contract.revised_contract_sum) {
      dataArr.push(parseFloat(contract.original_contract_sum));
      nameArr.push('Original Contract Sum');
    }
  }

  let totalSum = 0;
  var dataArrLen = dataArr.length ? dataArr.length : 0;
  for (let i = 0; i < dataArrLen; i++) {
    totalSum += dataArr[i];
  }
  
  for (let i = 0; i < dataArrLen; i++) {
    var tempPercent = (dataArr[i] / totalSum) * 100;
    percentArr.push(tempPercent.toFixed(3))
  }

  color1 = Highcharts.getOptions().colors[0];
  color2 = Highcharts.getOptions().colors[1];
  color3 = Highcharts.getOptions().colors[2];
  color4 = Highcharts.getOptions().colors[3];

  var chart = Highcharts.chart('ipcChart', {
    chart: {
      type: 'bar',
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90
              },
              title: {
                text: '<span class="showLabel">Total Cumulative Certified Payment & Revised Contract Sum<br>'+localStorage.p_name+'</span>'
              }
            });

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              chart: {
                marginTop: 10
              },
              title: {
                text: '<span class="showLabel">Total Cumulative Certified Payment & Revised Contract Sum<br>'+localStorage.p_name+'</span>'
              }
            });
            chart.updateFlag = true;
          }
        }
      }
    },
    title: {
      useHTML: true,
      enabled: true,
      text: '<span class="showLabel">Total Cumulative Certified Payment & Revised Contract Sum<br>'+localStorage.p_name+'</span>'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b><br/>Percentage: <b>{point.percent}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    xAxis: {
      categories: ['']
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      itemStyle: {
        fontSize: '11px',
        fontWeight : 'bold'
      }
    },
    series: [{
      name: nameArr[3],
      color: color1,
      data: [{
        y: dataArr[3],
        percent: percentArr[3]
      }],
      events: {
            click: function (event) {
                var contract_id = contract.id;
                var pro_id = contract.contract_no;
                
                var linkWinTitle = 'Contract'
                var cardName = "" + pro_id;
                var linkParamArr = processFilterParamArr([ contract_id ])
            
                if(localStorage.isParent == 'isParent'){
                    var project_id = linkParamArr[0];
                    project_id = project_id.substring(project_id.indexOf('_')+1);
                    project_id = project_id.substring(0, project_id.lastIndexOf('_'));
                    linkParamArr[0] = project_id;
                }

                window.parent.widgetConopOpen(linkWinTitle, "finance_contract_dash_card_SSLR2", linkParamArr, nameArr[3]);
            }
        }
    }, {
      name: nameArr[1],
      color: color2,
      data: [{
        y: dataArr[1],
        percent: percentArr[1]
      }],
      events: {
			click: function (event) {
                var contract_id = contract.id;
                var pro_id = contract.contract_no;
                
                var linkWinTitle = 'Contract'
                var cardName = "" + pro_id;
                var linkParamArr = processFilterParamArr([ contract_id ])
            
                if(localStorage.isParent == 'isParent'){
                    var project_id = linkParamArr[0];
                    project_id = project_id.substring(project_id.indexOf('_')+1);
                    project_id = project_id.substring(0, project_id.lastIndexOf('_'));
                    linkParamArr[0] = project_id;
                }

                window.parent.widgetConopOpen(linkWinTitle, "finance_contract_dash_card_SSLR2", linkParamArr, nameArr[1]);
			}
		}
    }, {
      name: nameArr[2],
      color: color3,
      data: [{
        y: dataArr[2],
        percent: percentArr[2]
      }],
      events: {
                click: function (event) {
                    var contract_id = contract.id;
                    var pro_id = contract.contract_no;
                    
                    var linkWinTitle = 'VO'
                    var cardName = "" + pro_id;
                    var linkParamArr = processFilterParamArr([ contract_id ])
                
                    if(localStorage.isParent == 'isParent'){
                        var project_id = linkParamArr[0];
                        project_id = project_id.substring(project_id.indexOf('_')+1);
                        project_id = project_id.substring(0, project_id.lastIndexOf('_'));
                        linkParamArr[0] = project_id;
                    }

                    window.parent.widgetConopOpen(linkWinTitle, "finance_dash_vo_card_SSLR2", linkParamArr, nameArr[2]);
                }
			}
    }, {
      name: nameArr[0],
      color: color4,
      data: [{
        y: dataArr[0],
        percent: percentArr[0]
      }],
      events: {
                click: function (event) {              
                    var contract_id = contract.id;
                    var pro_id = contract.contract_no;
                    
                    var linkWinTitle = 'ContractClaim'
                    var cardName = "" + pro_id;
                    var linkParamArr = processFilterParamArr([ '', contract_id ])
                
                    if(localStorage.isParent == 'isParent'){
                        var project_id = linkParamArr[0];
                        project_id = project_id.substring(project_id.indexOf('_')+1);
                        project_id = project_id.substring(0, project_id.lastIndexOf('_'));
                        linkParamArr[0] = project_id;
                    }

                    window.parent.widgetConopOpen(linkWinTitle, "finance_dash_claim_card_SSLR2", linkParamArr, nameArr[0]);
                }
			}
    }]
  });
  chart.updateFlag = true;
}

function refreshInformation(projid = 'overall',  year = 'all') {
    var contractDetails = (procurement.contract_particular && procurement.contract_particular[projid]) ? procurement.contract_particular[projid] : [];
    updateProcurementCard(contractDetails);

    var voDetails = (procurement.vo_detail && procurement.vo_detail[projid] && procurement.vo_detail[projid][year]) ? procurement.vo_detail[projid][year] : [];
    updateVoCard(voDetails);

    var acsDetails = (procurement.acs_detail && procurement.acs_detail[projid] && procurement.acs_detail[projid][year]) ? procurement.acs_detail[projid][year] : [];
    updateAcsCard(acsDetails, contractDetails);

    var eotDetails = (procurement.eot_detail && procurement.eot_detail[projid] && procurement.eot_detail[projid][year]) ? procurement.eot_detail[projid][year] : [];
    updateEotCard(eotDetails, voDetails);

    var dataClaim = (procurement.claim_detail && procurement.claim_detail[projid]  && procurement.claim_detail[projid][year]) ? procurement.claim_detail[projid][year] : [];
    var claimDetails =  (dataClaim && dataClaim.raw) ? dataClaim.raw : [];
    drawTableclaim(claimDetails);


	drawClaimVoChart(claimDetails, voDetails, contractDetails);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    refreshInformation(wpc, year);
}

$(function () {
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "procurement"
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                procurement = obj.data;
                refreshInformation();
            }
        }
    });

})