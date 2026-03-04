var costData;

function drawCumulativeCertifiedPaymentContractSum(data){
    var contractAllData = (data.allData) ? data.allData : [];

    var dataArr = [];
    if (data) {
        var ipcAmount = (data && data.cumulative_ipc_amount) ? (data.cumulative_ipc_amount).replace(/,/g, "") : 0;
        var revisedAmount = (data && data.revised_contract_sum) ? (data.revised_contract_sum).replace(/,/g, "") : 0;

        dataArr = [{name: 'Total Cumulative Certified Amount', origY: data.cumulative_ipc_amount ? data.cumulative_ipc_amount : 0, y: (ipcAmount) ? parseFloat(ipcAmount) : 0, selected: true, allData : (contractAllData) ? contractAllData : []},
                    {name: 'Revised Contract Sum', origY: data.revised_contract_sum ? formatCurrency(data.revised_contract_sum) : 0, y: (revisedAmount) ? parseFloat(revisedAmount) : 0, selected: true, allData : (contractAllData) ? contractAllData : []}];
    }

    if(localStorage.ui_pref == "ri_v3"){
        color1 = Highcharts.getOptions().colors[0];
        color2 = Highcharts.getOptions().colors[1];
    }else{
        color1 = '#45B39D';
        color2 = '#A9DFBF';
    }

    var chart = Highcharts.chart('cumulativeCertifiedPaymentContractSum', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Cost Management<br>'+localStorage.p_name+'<br>TOTAL CUMULATIVE CERTIFIED AMOUNT VS REVISED CONTRACT SUM</span>'
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
                            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>TOTAL CUMULATIVE CERTIFIED AMOUNT VS REVISED CONTRACT SUM</span>'
                          },
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
            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>TOTAL CUMULATIVE CERTIFIED AMOUNT VS REVISED CONTRACT SUM</span>'
        },
        credits: {
            enabled: false
        },
        legend: {
            itemStyle: {
                fontSize: '11px',
                fontWeight : 'normal'
            },
            symbolHeight: 13,
            symbolWidth: 13,
            labelFormatter: function () {
                return this.name.length > 25 ? [...this.name].splice(0, 25).join('') + '...' : this.name
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> <b>RM{point.origY}</b>'
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
                colors: [color1, color2],
                dataLabels: {
                    enabled: true,
                    format: 'RM{point.origY} ({point.percentage:.1f}%)',
                    distance: 10,
                },
                showInLegend: true
            }
        },
        series: [{
            name: '',
            colorByPoint: true,
            data: dataArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var idData = (allDataArr.id) ? allDataArr.id : '';
                    var linkParamArr = processFilterParamArr([idData]);

                    if(localStorage.ui_pref == "ri_v3"){
                        if(localStorage.usr_role == 'Finance Head' || localStorage.usr_role == 'Director' || localStorage.usr_role == 'Finance Officer'){
                            window.parent.widgetConopOpen("COST", "finance_dash_list_contract", linkParamArr, "Total Cumulative Certified Amount VS Revised Contract Sum");
                        }
                        else{
                            return;
                        }
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function drawVariationOrderNettContractSum(data){
    var contractAllData = (data.allData) ? data.allData : [];
    var color1;
    var color2;

    var dataArr = [];
    if(localStorage.ui_pref == "ri_v3"){
        color1 = Highcharts.getOptions().colors[0];
        color2 = Highcharts.getOptions().colors[1];
    }else{
        color1 = '#45B39D';
        color2 = '#A9DFBF';
    }

    var onclickEvent = `events: {
        click: function (event) {
            console.log("+++")
            var allDataArr = (event.point.allData) ? event.point.allData : [];
            var idData = (allDataArr.id) ? allDataArr.id : '';
            var linkParamArr = processFilterParamArr([idData]);

            if(localStorage.ui_pref == "ri_v3"){
                window.parent.widgetConopOpen("COST", "finance_dash_list_contract", linkParamArr, "Approved VO VS Original Contract Sum (RM)");
            }
        }
    }`;

    if (data) {
        var voAmount = (data && data.cumulative_approved_vo_amount) ? (data.cumulative_approved_vo_amount).replace(/,/g, "") : 0;
        var checkVoAmount = (parseFloat(voAmount) < 0);

        var oriAmount = (data && data.original_contract_sum) ? (data.original_contract_sum).replace(/,/g, "") : 0;

        dataArr = [{ name: 'Approved VO', origY:data.cumulative_approved_vo_amount ? data.cumulative_approved_vo_amount : 0, data: [{y :(voAmount) ? parseFloat(voAmount) : 0, dataLabels: {className: 'costMRSBColor'}}], color: color1, dataLabels: {enabled:true} , allData : ((contractAllData) ? contractAllData : []), cursor : 'pointer', 
                        events: {
                            click: function (event) {
                                var allDataArr = (event.point.allData) ? event.point.allData : [];
                                var idData = (allDataArr.id) ? allDataArr.id : '';
                                var linkParamArr = processFilterParamArr([idData]);
                    
                                if(localStorage.ui_pref == "ri_v3"){
                                    if(localStorage.usr_role == 'Finance Head' || localStorage.usr_role == 'Director' || localStorage.usr_role == 'Finance Officer'){
                                        window.parent.widgetConopOpen("COST", "finance_dash_list_contract", linkParamArr, "Approved VO VS Original Contract Sum (RM)");
                                    }
                                    else{
                                        return;
                                    }
                                }
                            }
                        }
                    },
                    { name: 'Original Contract Sum', origY:data.original_contract_sum ? data.original_contract_sum : 0, data: [(oriAmount) ? parseFloat(oriAmount) : 0], color: color2, allData : ((contractAllData) ? contractAllData : []), cursor : 'pointer',
                        events: {
                            click: function (event) {
                                var allDataArr = (event.point.allData) ? event.point.allData : [];
                                var idData = (allDataArr.id) ? allDataArr.id : '';
                                var linkParamArr = processFilterParamArr([idData]);
                    
                                if(localStorage.ui_pref == "ri_v3"){
                                    if(localStorage.usr_role == 'Finance Head' || localStorage.usr_role == 'Director' || localStorage.usr_role == 'Finance Officer'){
                                        window.parent.widgetConopOpen("COST", "finance_dash_list_contract", linkParamArr, "Approved VO VS Original Contract Sum (RM)");
                                    }
                                    else{
                                        return;
                                    }
                                }
                            }
                        }
                    }];
    }

    var chart = Highcharts.chart('variationOrderNettContractSum', {
        chart: {
            type: 'column',
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
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Cost Management<br>'+localStorage.p_name+'<br>APPROVED VO VS ORIGINAL CONTRACT SUM (RN)</span>'
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
                        text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>APPROVED VO VS ORIGINAL CONTRACT SUM (RN)</span>'
                      },
                    })

                    chart.updateFlag = true;
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Cost Management<br>'+localStorage.p_name+'<br>APPROVED VO VS ORIGINAL CONTRACT SUM (RN)</span>'
        },
        xAxis: {
            categories: [""]
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            itemStyle: {
                fontSize: '11px',
                fontWeight : 'normal'
            },
            symbolHeight: 13,
            symbolWidth: 13,
            labelFormatter: function () {
                return this.name.length > 25 ? [...this.name].splice(0, 25).join('') + '...' : this.name
            }
        },
        colors: [color1, color2],
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: 'RM{series.options.origY}',
                    color: 'black'
                },
            }
        },
        credits: {
            enabled: false
        },
        series : dataArr,
    });
    chart.updateFlag = true;

    if(localStorage.ui_pref == "ri_v3"){
        var checkColor = (checkVoAmount) ? 'red' : 'var(--on-surface)';
    }else{
        var checkColor = (checkVoAmount) ? 'red' : 'black';
    }

    $('.costMRSBColor text').attr(`style`, `fill: ${checkColor} !important`);
}

function updateContractDetails(data){
    let projectTbHTML = '';
    var contractAllData = (data.allData) ? data.allData : [];
    var idData = (contractAllData.id) ? contractAllData.id : '';

    $("#contractDetails").html("");
    if (data) {
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Project Title</td>'
        projectTbHTML += '<td>' + ((data.project_title) ? (data.project_title):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Contract No.</td>'
        projectTbHTML += '<td>' + ((data.contract_no) ? (data.contract_no):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Client Name</td>'
        projectTbHTML += '<td>' + ((data.client_name) ? (data.client_name):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Project Management Consultant</td>'
        projectTbHTML += '<td>' + ((data.project_management_consultant) ? (data.project_management_consultant):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Lead Consultant</td>'
        projectTbHTML += '<td>' + ((data.lead_consultant) ? (data.lead_consultant):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Contractor Name</td>'
        projectTbHTML += '<td>' + ((data.contractor_name) ? (data.contractor_name):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Commencement Date</td>'
        projectTbHTML += '<td>' + ((data.commencement_date) ? (data.commencement_date):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Original Completion Date</td>'
        projectTbHTML += '<td>' + ((data.original_completion_date) ? (data.original_completion_date):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Original Contract Period</td>'
        projectTbHTML += '<td>' + ((data.orginal_contract_period) ? (data.orginal_contract_period):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>Original Contract Sum (RM)</td>'
        projectTbHTML += '<td>' + ((data.original_contract_sum) ? (data.original_contract_sum):'') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr onclick="openList(\'' + idData + '\', \'Contract Details\', \'finance_dash_list_contract\');">'
        projectTbHTML += '<td>LAD/Day (RM/Day)'
        projectTbHTML += '<td>' + (data.lad_per_day ? Number(data.lad_per_day).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '') + '</td>'
        projectTbHTML += '</tr>';
    }
    $("#contractDetails").html(projectTbHTML);

    $('#ttlCumultPayment').html((data.cumulative_ipc_amount) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Contract\', \'finance_dash_list_contract\')">'+data.cumulative_ipc_amount+'</span>' : 0);
    $('#ttlCumultPaymentbyClient').html((data.total_cumulative_amount_paid) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Contract\', \'finance_dash_list_contract\')">'+data.total_cumulative_amount_paid+'</span>' : 0);

    $('#revisedDate').html((data.revised_completion_date) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Contract\', \'finance_dash_list_contract\')">'+data.revised_completion_date+'</span>' : 0);
    $('#revisedContractSum').html((data.revised_contract_sum) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Contract\', \'finance_dash_list_contract\')">'+formatCurrency(data.revised_contract_sum)+'</span>' : 0);

}

function updateIPCDetails(data){
    var allData = (data.allData) ? data.allData : [];
    var idData = (allData.id) ? allData.id : '';

    $('#ipcNo').html((data.IPCNo) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Interim Certified Payment\', \'finance_dash_list_ipc\')">'+data.IPCNo+'</span>' : 'N/A');
    $('#workDoneFrom').html((data.WorkFrom) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Interim Certified Payment\', \'finance_dash_list_ipc\')">'+data.WorkFrom+'</span>' : 'N/A');
    $('#workDoneTo').html((data.WorkTo) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Interim Certified Payment\', \'finance_dash_list_ipc\')">'+data.WorkTo+'</span>' : 'N/A');
    $('#currIPCAmount').html((data.IPCCurrentAmount) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Interim Certified Payment\', \'finance_dash_list_ipc\')">'+data.IPCCurrentAmount+'</span>' : 0);
    $('#retentionSum').html((data.RetentionSum) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Interim Certified Payment\', \'finance_dash_list_ipc\')">'+data.RetentionSum+'</span>' : 0);
    $('#ladAmount').html((data.LAD) ? '<span class="clickableCard" onclick="openList(\'' + idData + '\', \'Interim Certified Payment\', \'finance_dash_list_ipc\')">'+data.LAD+'</span>' : 0);
}

function updateEOTDetails(dataEOT, dataContract){
    var allData = (dataEOT.allData) ? dataEOT.allData : [];
    var idContractEOT = (allData.contract_id) ? allData.contract_id : '';

    var allDataContract = (dataContract.allData) ? dataContract.allData : [];
    var idContract = (allDataContract.id) ? allDataContract.id : '';

    $('#approvedEOTNo').html((dataEOT.eotNo) ? '<span class="clickableCard" onclick="openList(\'' + encodeURI(idContractEOT) + '\', \'Approved EOT (No)\', \'finance_dash_list_eot\')">'+dataEOT.eotNo+'</span>' : 'N/A');
    $('#approvedEOTDays').html((dataContract.cumulative_approved_eot_days) ? '<span class="clickableCard" onclick="openList(\'' + idContract + '\', \'Approved EOT (Days)\', \'finance_dash_list_contract\')">'+dataContract.cumulative_approved_eot_days+'</span>' : 0);
}

function updateVODetails(dataVO, dataContract){
    var allData = (dataVO.allData) ? dataVO.allData : [];
    var idContractVO = (allData.contract_id) ? allData.contract_id : '';

    var allDataContract = (dataContract.allData) ? dataContract.allData : [];
    var idContract = (allDataContract.id) ? allDataContract.id : '';

    let dataVoTbHTML = '';
    $("#approvedVONo").html("");
    if(dataVO && dataVO.voNo){
        for (const [idx, ele] of Object.entries(dataVO.voNo)){
            dataVoTbHTML += '<tr onclick="openList(\'' + encodeURI(idContractVO) + '\', \'Approved VO (No)\', \'finance_dash_list_vo\');">'
            dataVoTbHTML += '<td>'+ele+'</td>'
            dataVoTbHTML += '</tr>'
        }
        $("#approvedVONo").html(dataVoTbHTML);  
    }
    
    var valueVO = (dataContract && dataContract.cumulative_approved_vo_amount) ? (dataContract.cumulative_approved_vo_amount).replace(/,/g, "") : 0;
    if(valueVO < 0){
        $('#approvedVOAmount').css("color", "red");
    }
    else{
        $('#approvedVOAmount').css("color", "black");
    }
    $('#approvedVOAmount').html((dataContract.cumulative_approved_vo_amount) ? '<span class="clickableCard" onclick="openList(\'' + idContract + '\', \'Approved VO (RM)\', \'finance_dash_list_contract\')">'+dataContract.cumulative_approved_vo_amount+'</span>' : 0);
}

function updateACSDetails(dataACS, dataContract){
    var allData = (dataACS.allData) ? dataACS.allData : [];
    var idContractACS = (allData.contract_id) ? allData.contract_id : '';

    var allDataContract = (dataContract.allData) ? dataContract.allData : [];
    var idContract = (allDataContract.id) ? allDataContract.id : '';
    
    let dataAcsTbHTML = '';
    $("#approvedACSNo").html("");
    if(dataACS && dataACS.acsNo){
        for (const [idx, ele] of Object.entries(dataACS.acsNo)){
            dataAcsTbHTML += '<tr  onclick="openList(\'' + encodeURI(idContractACS) + '\', \'Approved ACS (No)\', \'finance_dash_list_acs\');">'
            dataAcsTbHTML += '<td>'+ele+'</td>'
            dataAcsTbHTML += '</tr>'
        }
        $("#approvedACSNo").html(dataAcsTbHTML);  
    }

    var valueACS = (dataContract && dataContract.cumulative_approved_acs_amount) ? (dataContract.cumulative_approved_acs_amount).replace(/,/g, "") : 0;
    if(valueACS < 0){
        $('#approvedACSAmount').css("color", "red");
    }
    else{
        $('#approvedACSAmount').css("color", "black");
    }
    $('#approvedACSAmount').html((dataContract.cumulative_approved_acs_amount) ? '<span class="clickableCard" onclick="openList(\'' + idContract + '\', \'Approved ACS (RM)\', \'finance_dash_list_contract\')">'+dataContract.cumulative_approved_acs_amount+'</span>' : 0);
}

function updateCardOverall(data){
    let dataOriTbHTML = '';
    let dataRevisedTbHTML = '';
    
    $("#dataOriginalContract").html("");
    $("#dataRevisedAmount").html("");

    if(data.ttlContractSum){
        for (const [idx, ele] of Object.entries(data.ttlContractSum)){
            if(idx == 'ttlAll'){
                $('#originalOverall').html((ele) ? 'RM '+formatCurrency(ele) : 0);
                if(ele < 0){
                    $('#originalOverall').css("color", "red");
                }
                else{
                    $('#originalOverall').css("color", "black");
                }
            }
            else{
                dataOriTbHTML += '<tr>'
                dataOriTbHTML += '<td>'+idx+'</td>'
                if(ele < 0){
                    dataOriTbHTML += '<td style = "color: red">RM '+formatCurrency(ele)+'</td>'
                }
                else{
                    dataOriTbHTML += '<td style = "color: black">RM '+formatCurrency(ele)+'</td>'
                }
                dataOriTbHTML += '</tr>'
            }
        }
    }

    if(data.ttlRevised){
        for (const [idx, ele] of Object.entries(data.ttlRevised)){
            if(idx == 'ttlAll'){
                $('#revisedOverall').html((ele) ? 'RM '+formatCurrency(ele) : 0);
                if(ele < 0){
                    $('#revisedOverall').css("color", "red");
                }
                else{
                    $('#revisedOverall').css("color", "black");
                }
            }
            else{
                dataRevisedTbHTML += '<tr>'
                dataRevisedTbHTML += '<td>'+idx+'</td>'
                if(ele < 0){
                    dataRevisedTbHTML += '<td style = "color: red">RM '+formatCurrency(ele)+'</td>'

                }
                else{
                    dataRevisedTbHTML += '<td style = "color: black">RM '+formatCurrency(ele)+'</td>'
                }
                dataRevisedTbHTML += '</tr>'
            }
        }
    }

    if(data.ttlVO){
        for (const [idx, ele] of Object.entries(data.ttlVO)){
            if(idx == 'ttlAll'){
                $('#voOverall').html((ele.totalAmountBasedOnAll) ? 'RM '+formatCurrency(ele.totalAmountBasedOnAll) : 0);

                if(ele.totalAmountBasedOnAll < 0){
                    $('#voOverall').css("color", "red");
                }
                else{
                    $('#voOverall').css("color", "black");
                }
            }
        }
    }

    if(data.ttlACS){
        for (const [idx, ele] of Object.entries(data.ttlACS)){
            if(idx == 'ttlAll'){
                $('#acsOverall').html((ele.totalAmountBasedOnAll) ? 'RM '+formatCurrency(ele.totalAmountBasedOnAll) : 0);

                if(ele.totalAmountBasedOnAll < 0){
                    $('#acsOverall').css("color", "red");
                }
                else{
                    $('#acsOverall').css("color", "black");
                }
            }
        }
    }

    if(data.ttlIPC){
        for (const [idx, ele] of Object.entries(data.ttlIPC)){
            if(idx == 'ttlAll'){
                $('#ipcOverall').html((ele.totalAmountBasedOnAll) ? 'RM '+formatCurrency(ele.totalAmountBasedOnAll) : 0);

                if(ele.totalAmountBasedOnAll < 0){
                    $('#ipcOverall').css("color", "red");
                }
                else{
                    $('#ipcOverall').css("color", "black");
                }
            }
        }
    }
    
    $("#dataOriginalContract").html(dataOriTbHTML);
    $("#dataRevisedAmount").html(dataRevisedTbHTML);  

}

function updateCardOverallPart2(data, data2, data3){
    let dataVOTbHTML = '';
    let dataACSTbHTML = '';
    let dataIPCTbHTML = '';


    if(data.ttlVO){
        for (const [idx, ele] of Object.entries(data.ttlVO)){
            if(idx == 'ttlAll'){
            }
            else{
                dataVOTbHTML += '<tr>'
                dataVOTbHTML += '<td>'+idx+'</td>'
                dataVOTbHTML += '<td>'+ele.count+'</td>'
                if(ele.totalAmountBasedOnPackage < 0){
                    dataVOTbHTML += '<td style = "color: red">RM '+formatCurrency(ele.totalAmountBasedOnPackage)+'</td>'

                }
                else{
                    dataVOTbHTML += '<td style = "color: black">RM '+formatCurrency(ele.totalAmountBasedOnPackage)+'</td>'
                }
                dataVOTbHTML += '</tr>'
            }
    
        }
    }

    if(data2.ttlIPC){
        for (const [idx, ele] of Object.entries(data2.ttlIPC)){
            if(idx == 'ttlAll'){
            }
            else{
                dataIPCTbHTML += '<tr>'
                dataIPCTbHTML += '<td>'+idx+'</td>'
                dataIPCTbHTML += '<td style="text-align: center;">'+ele.count+'</td>'
                if(ele.totalAmountBasedOnPackage < 0){
                    dataIPCTbHTML += '<td style = "color: red">RM '+formatCurrency(ele.totalAmountBasedOnPackage)+'</td>'

                }
                else{
                    dataIPCTbHTML += '<td style = "color: black">RM '+formatCurrency(ele.totalAmountBasedOnPackage)+'</td>'
                }
                dataIPCTbHTML += '</tr>'
            }
    
        }
    }

    if(data3.ttlACS){
        for (const [idx, ele] of Object.entries(data3.ttlACS)){
            if(idx == 'ttlAll'){
            }
            else{
                dataACSTbHTML += '<tr>'
                dataACSTbHTML += '<td>'+idx+'</td>'
                dataACSTbHTML += '<td>'+ele.count+'</td>'
                if(ele.totalAmountBasedOnPackage < 0){
                    dataACSTbHTML += '<td style = "color: red">RM '+formatCurrency(ele.totalAmountBasedOnPackage)+'</td>'
                }
                else{
                    dataACSTbHTML += '<td style = "color: black">RM '+formatCurrency(ele.totalAmountBasedOnPackage)+'</td>'
                }
                dataACSTbHTML += '</tr>'
            }
    
        }

    }

    $("#dataVO").html(dataVOTbHTML);
    $("#dataIPC").html(dataIPCTbHTML);
    $("#dataACS").html(dataACSTbHTML);

}

function refreshDashboard() {
    var selWPC = $('#wpcFilter').val();

    if(selWPC == 'overall'){
        $('#overallCost').css('display', 'block');
        $('#packageCost').css('display', 'none');

    }else{
        $('#overallCost').css('display', 'none');
        $('#packageCost').css({
            'display': '',
            'width': 'calc(100% - 10px)'
        });
    }
    refreshInformation(selWPC);
}

function refreshInformation (proj = 'overall'){
    var contract = (costData.contractInfo && costData.contractInfo[proj]) ? costData.contractInfo[proj] : [];
    updateContractDetails(contract);

    var claim = (costData.claimInfo && costData.claimInfo[proj] && costData.claimInfo[proj].card) ? costData.claimInfo[proj].card : [];
    updateIPCDetails(claim);

    var eot = (costData.eotInfo && costData.eotInfo[proj] && costData.eotInfo[proj].cardEOT) ? costData.eotInfo[proj].cardEOT : [];
    updateEOTDetails(eot, contract);

    var vo = (costData.voInfo && costData.voInfo[proj] && costData.voInfo[proj].cardVO) ? costData.voInfo[proj].cardVO : [];
    updateVODetails(vo, contract);

    var acs = (costData.acsInfo && costData.acsInfo[proj] && costData.acsInfo[proj].cardACS) ? costData.acsInfo[proj].cardACS : [];
    updateACSDetails(acs, contract);

    drawCumulativeCertifiedPaymentContractSum(contract);
    drawVariationOrderNettContractSum(contract);

    var contractOverall = (costData.contractInfo && costData.contractInfo['overallProject']) ? costData.contractInfo['overallProject'] : [];
    updateCardOverall(contractOverall);

    var voOverall = (costData.voInfo && costData.voInfo['overallProject']) ? costData.voInfo['overallProject'] : [];
    var ipcOverall = (costData.claimInfo && costData.claimInfo['overallProject']) ? costData.claimInfo['overallProject'] : [];
    var acsOverall = (costData.acsInfo && costData.acsInfo['overallProject']) ? costData.acsInfo['overallProject'] : [];

    updateCardOverallPart2(voOverall, ipcOverall, acsOverall);

    if(proj == 'overall'){
        $('#overallCost').css('display', 'block');
        $('#packageCost').css('display', 'none');

        if(localStorage.isParent !== 'isParent'){
            $('#overallCost').css('display', 'none');
            $('#packageCost').css({
                'display': '',
                'width': 'calc(100% - 10px)'
            });
        }
    }else{
        $('#overallCost').css('display', 'none');
        $('#packageCost').css({
            'display': '',
            'width': 'calc(100% - 10px)'
        });
    }
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    refreshInformation(wpc);
}

function openList(id, cardName, urlToUse){
    var linkParamArr = processFilterParamArr([id]);
    if(localStorage.ui_pref == "ri_v3"){
        if(localStorage.usr_role == 'Finance Head' || localStorage.usr_role == 'Director' || localStorage.usr_role == 'Finance Officer'){
            window.parent.widgetConopOpen("COST", urlToUse, linkParamArr, cardName);
        }
        else{
            return;
        }
    }
}

$(function () {
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
                refreshInformation("overall");
            }
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})