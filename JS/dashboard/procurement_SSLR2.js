var procurement;

function conOpLink(process, ref_id, other){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDocumentSarawak();
   
    var cardName ;
    
    switch (process) {
        case 'Contract':
            linkWinTitle = 'CONTRACT DETAILS'
            linkName = 'finance_contract_dash_card_SSLR2'
            cardName = "Contract -" + ref_id;
            linkParamArr = processFilterParamArr([ ref_id])
          
            break;
        case 'Claim':
            linkWinTitle = 'INTERIM PAYMENT CLAIM'
            linkName = 'finance_dash_claim_card_SSLR2'

            cardName = ref_id;
            linkParamArr = processFilterParamArr([ ref_id ])
            break;
        case 'VO':
            linkWinTitle = 'APK/PHK'
            linkName = 'finance_dash_vo_card_SSLR2'
    
            cardName = "APK/PHK -" + ref_id;
            linkParamArr = processFilterParamArr([ ref_id, other ])
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

    if(localStorage.contractLevel == 'UPSTREAM'){
        var claimTableHTML = "";
        var ttlRecomAmount = 0.00;
        var ttlRecedAmount = 0;
        if (data) {
            for (const [idx, ele] of Object.entries(data)) {
                claimTableHTML += '<tr class="clickableCard" onclick="conOpLink(\'Claim\', \'' + ele.claim_id + '\', \'' + ele.project_id + '\')">'
                claimTableHTML += '<td>' + ((ele.ipa_no) ? ele.ipa_no : 0) + '</td>'
                claimTableHTML += '<td>' + ((ele.pay_period_to) ? ele.pay_period_to : 0) + '</td>'
                claimTableHTML += '<td>' + ((ele.total_claim_value) ? formatCurrency(ele.total_claim_value) : 0) + '</td>' //Net Interim Amount Claim
                claimTableHTML += '<td>' + ((ele.ipc_no) ? ele.ipc_no : 0) + '</td>'
                claimTableHTML += '<td>' + ((ele.certified_claim_amount) ? formatCurrency(ele.certified_claim_amount) : 0) + '</td>' //IPC Recommended Amount
                claimTableHTML += '<td>' + ((ele.certifiedClaimDate) ? ele.certifiedClaimDate : 0) + '</td>' //Date of recommended
                claimTableHTML += '<td>' + ((ele.payment_received_amount) ? formatCurrency(ele.payment_received_amount) : 0) + '</td>' //Payment received amount
                claimTableHTML += '<td>' + ((ele.paymentReceivedDate) ? ele.paymentReceivedDate : 0) + '</td>' //Payment received date
                claimTableHTML += '</tr>'

                ttlRecomAmount += (ele.certified_claim_amount) ? parseFloat(ele.certified_claim_amount) : 0;
                ttlRecedAmount += (ele.payment_received_amount) ? parseFloat(ele.payment_received_amount) : 0;
            }
        }
        

        $("#claimTbBody").html(claimTableHTML); 

        var ttlRecomAmountHtml = '0';
        var ttlRecedAmountHtml = '0';
    
        if(ttlRecomAmount != 0){
            ttlRecomAmountHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '', '')">`+formatCurrency(ttlRecomAmount)+`</span>`;
        }
        if(ttlRecedAmount != 0){
            ttlRecedAmountHtml = `<span class="clickableCard" onclick="conOpLink('Claim', '', '')">`+formatCurrency(ttlRecedAmount)+`</span>`;
        }
    
        $('#ttlRecomAmount').html(ttlRecomAmountHtml);
        $('#ttlRecedAmount').html(ttlRecedAmountHtml);
        
    }else{

        if(data && data.lenght > 0){

            var claimData = data[0];
            // for downstream
            $currentIPCHtml = '';
            $workDoneFromHtml = '';
            $workDoneToHtml = '';
            $currentIPCAmtHtml = '';
            $totalCumulCertifieCHtml = '';
            $totalCumulbyClienCHtml = '';

            if(claimData.ipc_no){
                currentIPCHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '', '')">`+claimData.ipc_no+`</span>`;
            }

            if(claimData.work_done_from){
                workDoneFromHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '', '')">`+claimData.work_done_from+`</span>`;
            }

            if(claimData.work_done_to){
                workDoneToHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '', '')">`+claimData.work_done_to+`</span>`;
            }

            if(claimData.total_claim_value){
                currentIPCAmtHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '', '')">`+claimData.total_claim_value+`</span>`;
            }

            if(claimData.cumulative_certified_amount){
                totalCumulCertifieCHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '', '')">`+claimData.cumulative_certified_amount+`</span>`;
            }

            if(claimData.payment_received_amount){
                totalCumulbyClienCHtml = `<span class="clickableCard" onclick="conOpLink('Contract', '', '')">`+claimData.payment_received_amount+`</span>`;
            }

            $('#currentIPC').html(currentIPCHtml);
            $('#workDoneFrom').html(workDoneFromHtml);
            $('#workDoneTo').html(workDoneToHtml);
            $('#currentIPCAmt').html(currentIPCAmtHtml);
            $('#totalCumulCertified').html(totalCumulCertifieCHtml);
            $('#totalCumulbyClient').html(totalCumulbyClienCHtml);
        }

    }
}

function updateTableCount(data, contractData){
    var tNetInterim = (data.totalInterimAmount) ? data.totalInterimAmount : 0;
    var tIpcRecommentAmount = (data.totalIpcRecAmount) ? data.totalIpcRecAmount : 0;
    var tNetAmountRec = (data.totalNetAmountRec) ? data.totalNetAmountRec : 0;

    $('#totalCumulClaim').html(formatCurrency(tNetInterim)); //Total IPA Amount
    $('#totalRecommendAmount').html(formatCurrency(tIpcRecommentAmount));
    $('#totalReceivedClaimAmount').html(formatCurrency(tNetAmountRec));

    var originalContractAmount = (contractData.original_amount) ? contractData.original_amount : 0;

    var percenCumul = ((tNetInterim / originalContractAmount) * 100).toFixed(2);
    var percenRecAmount = ((tIpcRecommentAmount / originalContractAmount) * 100).toFixed(2);
    var percenRecClaimAmount = ((tNetAmountRec / originalContractAmount) * 100).toFixed(2);

    if(originalContractAmount){
        $('#percentCumulClaim').html(percenCumul); //Total IPA Amount
        $('#percentRecommendAmount').html(percenRecAmount);
        $('#percentReceivedClaimAmount').html(percenRecClaimAmount);
    }

}

function updateProcurementCard(data, voData){
    var totaltlIpaAmount;
    var uselRecommendAmount;

    var claimAmoutAfterRetain;
    var remainingClaimAmount;

    var contract_id = data.contract_id;
    
    var conNameCard = (data.contract_title)? data.contract_title : "N/A";
    var contractSumCard = (data.original_amount)? formatCurrency(data.original_amount) : 0;
    var conOriDurationCard = (data.original_duration)? data.original_duration : 0;
    var conRetainage = (data.vor_retainage)? parseInt(data.vor_retainage) : 0;

    if(conNameCard != "N/A"){
        conNameCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+((data.contract_title)? data.contract_title : "N/A")+`</span>`;
    }

    if(contractSumCard != 0){
        contractSumCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+((data.original_amount)? formatCurrency(data.original_amount) : 0)+`</span>`;
    }

    if(conOriDurationCard != 0){
        conOriDurationCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+((data.original_duration)? data.original_duration : 0)+`</span>`;
    }

    if(conRetainage != 0){
        conRetainage = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+((data.vor_retainage)? parseInt(data.vor_retainage) : 0)+`</span>`;
    }

    $('#conName').html(conNameCard);
	  $('#contractSum').html(contractSumCard);
    $('#conOriDuration').html(conOriDurationCard);
    $('#conRetainage').html(conRetainage); //Retainage %

    totaltlIpaAmount = (data.total_claim_vo_and_claim)? data.total_claim_vo_and_claim : 0;

    var ttlIpaAmount = formatCurrency(totaltlIpaAmount);

    if(ttlIpaAmount != 0){
        ttlIpaAmount = `<span class="clickableCard" onclick="conOpLink('Claim', '', '')">`+(formatCurrency(totaltlIpaAmount))+`</span>`;
    }
   
    $('#ttlIpaAmount').html(ttlIpaAmount); //Total IPA Amount

    if(data.new_amount_after_revised){
        var revConSum = (data.new_amount_after_revised)? formatCurrency(data.new_amount_after_revised) : 0;

        if(revConSum != 0){
            revConSum = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+((data.new_amount_after_revised)? formatCurrency(data.new_amount_after_revised) : 0)+`</span>`;
        }
        $('#revConSum').html(revConSum);
    }
    else{
        var revConSum = (data.new_amount)? formatCurrency(data.new_amount) : 0;

        if(revConSum != 0){
            revConSum = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+((data.new_amount)? formatCurrency(data.new_amount) : 0)+`</span>`;
        }

        $('#revConSum').html(revConSum);
    }
    var eotGrant = (data.extension_of_time)? data.extension_of_time : 0;

    if(eotGrant != 0){
        eotGrant = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', '')">`+((data.extension_of_time)? data.extension_of_time : 0)+`</span>`;
    }

    $('#eotGrant').html(eotGrant)

    if(data.contract_type){
        if(data.contract_type == "Retainage"){
            if (data.retainage_held_on == "Original Contract Amount"){
                var originalAmountRetain = (data.orignal_amount_retainage)? data.orignal_amount_retainage : 0;
                var voAmount = (data.variation_amount)? data.variation_amount : 0;

                claimAmoutAfterRetain = parseFloat(originalAmountRetain) + parseFloat(voAmount); //have to add VO amount also
                var claimAmountAfterRetainage = formatCurrency(claimAmoutAfterRetain);

                if(claimAmountAfterRetainage != 0){
                    claimAmountAfterRetainage = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+(formatCurrency(claimAmoutAfterRetain))+`</span>`;
                }

                $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
            }
            else{
                claimAmoutAfterRetain = (data.field62)? data.field62 : 0;
                var claimAmountAfterRetainage = formatCurrency(claimAmoutAfterRetain);

                if(claimAmountAfterRetainage != 0){
                    claimAmountAfterRetainage = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+(formatCurrency(claimAmoutAfterRetain))+`</span>`;
                }

                $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
            }
        }
        else{
            claimAmoutAfterRetain = (data.new_amount)? data.new_amount : 0;
            var claimAmountAfterRetainage = formatCurrency(claimAmoutAfterRetain);

            if(claimAmountAfterRetainage != 0){
                claimAmountAfterRetainage = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+(formatCurrency(claimAmoutAfterRetain))+`</span>`;

            }

            $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
        }
    }
    else{
        claimAmoutAfterRetain = (data.new_amount_after_revised)? data.new_amount_after_revised : 0;
        var claimAmountAfterRetainage = (0);

        $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
    }

    if(contract_id){
        if(data.remaining_claim_amount){
        
            var balClaimAmount = formatCurrency((data.remaining_claim_amount)? data.remaining_claim_amount : 0);

            if(balClaimAmount != 0){
                balClaimAmount = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+(formatCurrency((data.remaining_claim_amount)? data.remaining_claim_amount : 0))+`</span>`;
            }

            $('#balClaimAmount').html(balClaimAmount); //Remaining Claimable Amount
        }
        else{
            remainingClaimAmount = claimAmoutAfterRetain - uselRecommendAmount;
            var balClaimAmount = formatCurrency(remainingClaimAmount);
            
            if(balClaimAmount != 0){
                balClaimAmount = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+(formatCurrency(remainingClaimAmount))+`</span>`;
            }
            
            $('#balClaimAmount').html(balClaimAmount); //Remaining Claimable Amount
        }
    }

    var revDuration = (data.new_duration)? data.new_duration : 0;

    if(revDuration != 0){
        revDuration = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+((data.new_duration)? data.new_duration : 0)+`</span>`;
    }

    $('#revDuration').html(revDuration)

    // additional for Downstream Contract Type
    var conNoCard =  (data.contract_no)? data.contract_no : "N/A";
    var conClientCard =  (data.contractee)? data.contractee : "N/A";
    var conleadconsultCard =  (data.lead_consultant)? data.lead_consultant : "N/A";
    var concontractorCard =  (data.contractor)? data.contractor : "N/A";
    var concommencedateCard =  (data.contract_start)? data.contract_start : "N/A";
    var concompletiondateCard =  (data.completion_date)? data.completion_date : "N/A";
    var conorigsumCard =  (data.original_contract_sum)? data.original_contract_sum : "N/A";
    var conladCard =  (data.lad_per_day)? data.lad_per_day : "N/A";

    if(conNoCard != "N/A"){
        conNoCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.contract_no+`</span>`;
    }

    if(conClientCard != "N/A"){
        conClientCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.contractee+`</span>`;
    }

    if(conleadconsultCard != "N/A"){
        conleadconsultCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.lead_consultant+`</span>`;
    }

    if(concontractorCard != "N/A"){
        concontractorCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.contractor+`</span>`;
    }

    if(concommencedateCard != "N/A"){
        concommencedateCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.contract_start+`</span>`;
    }

    if(concompletiondateCard != "N/A"){
        concompletiondateCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.completion_date+`</span>`;
    }

    if(conorigsumCard != "N/A"){
        conorigsumCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.original_contract_sum+`</span>`;
    }

    if(conladCard != "N/A"){
        conladCard = `<span class="clickableCard" onclick="conOpLink('Contract', '`+contract_id+`', '')">`+data.lad_per_day+`</span>`;
    }
    
    $('#conNoCard').html(conNoCard)
    $('#conClient').html(conClientCard)
    $('#conleadconsult').html(conleadconsultCard)
    $('#concontractor').html(concontractorCard)
    $('#concommencedate').html(concommencedateCard)
    $('#concompletiondate').html(concompletiondateCard)
    $('#conorigsum').html(conorigsumCard)
    $('#conlad').html(conladCard)

    if(voData && voData.calculateCard){
        var apkTotalHtml =  "0"
        var phkTotalHtml =  "0"
        if(voData.calculateCard.APK && voData.calculateCard.APK.total){
            apkTotalHtml = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', 'APK')">`+ formatCurrency(voData.calculateCard.APK.total) +`</span>`;
        }
        if(voData.calculateCard.PHK && voData.calculateCard.PHK.total){
            phkTotalHtml = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', 'PHK')">`+ formatCurrency(voData.calculateCard.PHK.total) +`</span>`;
        }

        $('#approvedVo_apk').html(apkTotalHtml)
        $('#approvedVo_phk').html(phkTotalHtml)

        // for Downstream
        var DSVoApprovedNo = '';
        var DSVoApprovedNett = '';

        if(voData.calculateCard.voNo){
            DSVoApprovedNo = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', '')">`+ voData.calculateCard.voNo +`</span>`;
        }
        if(voData.calculateCard.approvedVo){
            DSVoApprovedNett = `<span class="clickableCard" onclick="conOpLink('VO', '`+contract_id+`', '')">`+ voData.calculateCard.approvedVo +`</span>`;
        }
        
        $('#DSVoApprovedNo').html(DSVoApprovedNo)
        $('#DSApprovedVONet').html(DSVoApprovedNett)
    }else{
        $('#approvedVo_apk').html('0')
        $('#approvedVo_phk').html('0')
    }   
}

function drawClaimChart(data, contract){
    var dataArr = [];
    if (data && data[0]) {
        claim = data[0];
        if(claim.certified_claim_amount){
            dataArr = {name: 'Total Cumulative Certified Payment', y : claim.cumulative_certified_amount};
        }
        if(contract.new_contract_amount){
            dataArr = {name: 'Revised Contract Sum (RM)', y : contract.new_contract_amount};
        }
    } 

    console.log(dataArr);
  
    var chart = Highcharts.chart('ipcChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        marginTop: 10,
        type: 'pie',
        events: {
          render() {
            var chart = this;
  
              if (document.fullscreenElement && chart.updateFlag) {
                chart.updateFlag = false;
                chart.update({
                  chart:{
                    marginTop: 90
                  },
                  title: {
                    text: '<span class="showLabel">Total Cumulative Certified Payment & Revised Contract Sum<br>'+localStorage.p_name+'</span>'
                  }
                })
    
                chart.updateFlag = true;
              }
              else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  chart:{
                    marginTop: 10
                  },
                  title: {
                    text: '<span class="showLabel">Total Cumulative Certified Payment & Revised Contract Sum<br>'+localStorage.p_name+'</span>'
                  }
                })
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
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          },
          size:'70%'
        }
      },
      credits: false,
      series: [{
        colorByPoint: true,
        cursor : 'pointer',
        data: dataArr
      }]
    });
    chart.updateFlag = true;
}

function drawVoChart(data, contract){
    var dataArr = [];
    if (data && data[0]) {
        vo = data[0];
        if(vo.total_approved_vo){
            dataArr = {name: 'Approved Variation Order Nett', y : vo.total_approved_vo};
        }
        if(contract.contracted_amount){
            dataArr = {name: 'Original Contract Sum', y : contract.contracted_amount};
        }
    }
  
    var chart = Highcharts.chart('voChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        marginTop: 10,
        type: 'pie',
        events: {
          render() {
            var chart = this;
  
              if (document.fullscreenElement && chart.updateFlag) {
                chart.updateFlag = false;
                chart.update({
                  chart:{
                    marginTop: 90
                  },
                  title: {
                    text: '<span class="showLabel">Approved Variation Order Nett & Original Contract Sum<br>'+localStorage.p_name+'</span>'
                  }
                })
    
                chart.updateFlag = true;
              }
              else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  chart:{
                    marginTop: 10
                  },
                  title: {
                    text: '<span class="showLabel">Approved Variation Order Nett & Original Contract Sum<br>'+localStorage.p_name+'</span>'
                  }
                })
              }

          }
        }
      },
      title: {
        useHTML: true,
        enabled: true,
        text: '<span class="showLabel">Approved Variation Order Nett & Original Contract Sum<br>'+localStorage.p_name+'</span>'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          },
          size:'70%'
        }
      },
      credits: false,
      series: [{
        colorByPoint: true,
        cursor : 'pointer',
        data: dataArr
      }]
    });
    chart.updateFlag = true;
}


function refreshInformation(projid = 'overall',  year = 'all') {
    var contractDetails = (procurement.contract_particular && procurement.contract_particular[projid]) ? procurement.contract_particular[projid] : [];
    var voDetails = (procurement.vo_detail && procurement.vo_detail[projid] && procurement.vo_detail[projid][year]) ? procurement.vo_detail[projid][year] : [];
    updateProcurementCard(contractDetails, voDetails);

    var dataClaim = (procurement.claim_detail && procurement.claim_detail[projid]  && procurement.claim_detail[projid][year]) ? procurement.claim_detail[projid][year] : [];
    var claimDetails =  (dataClaim && dataClaim.raw) ? dataClaim.raw : [];
    drawTableclaim(claimDetails);

    var totalCardDetails = (dataClaim && dataClaim.calculateCard) ? dataClaim.calculateCard : [];
    updateTableCount(totalCardDetails, contractDetails);

    if(localStorage.contract_level == 'DOWNSTREAM'){
        drawClaimChart(claimDetails, contractDetails);
        drawVoChart(voDetails, contractDetails);
    }
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