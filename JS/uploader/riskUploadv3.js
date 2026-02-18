// will load data for 3 table
function loadRiskTable(forOverall = false){
    $.ajax({
        url: './../JS/uploader/riskUploader.php',  
        type: 'POST',
        dataType: 'JSON',
        data: {
            functionName : "riskTableData",
            forOverall : forOverall
        },
        success:function(data){
            if (!data.data) return;
            let riskHistDataHTML = '';
            let idTable1;
            let idTable2;
            let idRow1;
            let idRow2;
            let idRow3;
            let idRow4;

            if(localStorage.page_pageOpen == 'myInsights'){
                idRow1 = $(".uploadContainer #remainDurValInsight");
                idRow2 = $(".uploadContainer #schImpUncerValInsight");
                idRow3 = $(".uploadContainer #compPerSchValInsight");
                idRow4 = $(".uploadContainer #timeCompProbValInsight");

                idTable1 = $(".uploadContainer #uploadedDataTableInsight");
                idTable2 = $(".uploadContainer #uploadedFileTableInsight");
            }else{
                idRow1 = $(".uploadContainer #remainDurValOutside");
                idRow2 = $(".uploadContainer #schImpUncerValOutside");
                idRow3 = $(".uploadContainer #compPerSchValOutside");
                idRow4 = $(".uploadContainer #timeCompProbValOutside");

                idTable1 = $(".uploadContainer #uploadedDataTableOutside");
                idTable2 = $(".uploadContainer #uploadedFileTableOutside");
            }

            if (data.data.projRiskHistInfo) {
                let riskData = data.data.projRiskHistInfo;
                if(riskData[0] && riskData[0].rhd_month_year) {
                    var dt = riskData[0].rhd_month_year.split(' ');
                    $(".dateAdded").html("("+dt[0]+")")
                }
                riskData.forEach(function(ele,idx){
                    riskHistDataHTML += '<tr>'
                    riskHistDataHTML += '<td>'+ele.rhd_bins+'</td>'
                    riskHistDataHTML += '<td>'+ele.rhd_count+'</td>'
                    riskHistDataHTML += '<td>'+ele.rhd_scaled+'</td>'
                    riskHistDataHTML += '<td>'+ele.rhd_cum+'</td>'
                    riskHistDataHTML += '</tr>';
                })
            }
            let riskFileHTML = '';
            if (data.data.uplodedFileInfo) {
                let riskFileData = data.data.uplodedFileInfo;
                riskFileData.forEach(function(ele,idx){
                    var fileLink = '<a target="_blank" download href="../../'+ele.ruf_file_path+'">'+ele.ruf_file_name+'</a>';
                    riskFileHTML += '<tr>'
                    riskFileHTML += '<td>'+ele.ruf_upload_date+'</td>'
                    riskFileHTML += '<td>'+ele.ruf_upload_by+'</td>'
                    riskFileHTML += '<td>'+fileLink+'</td>'
                    riskFileHTML += '</tr>';
                })
            }
            let riskProbData = '';
            if (data.data.riskProbData) {
                riskProbData = data.data.riskProbData;
                idRow1.html((riskProbData.rpd_project_remain_dur) ? riskProbData.rpd_project_remain_dur : 0);
                idRow2.html((riskProbData.rpd_overall_schedule_impact_uncer) ? riskProbData.rpd_overall_schedule_impact_uncer : 0);
                idRow3.html((riskProbData.rpd_project_prob_complete) ? riskProbData.rpd_project_prob_complete : 0);
                idRow4.html((riskProbData.rpd_timely_completion_prob) ? riskProbData.rpd_timely_completion_prob : 0);
            }else{
                idRow1.html('N/A');
                idRow2.html('N/A');
                idRow3.html('N/A');
                idRow4.html('N/A');
            }

            idTable1.html(riskHistDataHTML); 
            idTable2.html(riskFileHTML); 
        }
    });
}

$(document).ready(function(){
    let idInputDate;
    let idButton;
    let idInputFile;
    let idForOverallCheck; 
    var currDate = new Date().toJSON().slice(0,10);

    $('.uploadExcelRiskUpload').on('click', function(e){

        if(this.id == 'importExcelRiskUploadInsight'){
            $('#importExcelRiskUploadInsight').attr('disabled', true);

            idButton = $('#importExcelRiskUploadInsight');
            idInputDate = $('#uploaded-dateInsight');
            idInputFile = $('#uploadExcelRiskUploadInsight');
            idForOverallCheck = (SYSTEM == 'OBYU') ? $('#forOverallInsight') : null;
        }else if(this.id == 'importExcelRiskUploadOutside'){
            $('#importExcelRiskUploadOutside').attr('disabled', true);

            idButton = $('#importExcelRiskUploadOutside');
            idInputDate = $('#uploaded-dateOutside');
            idInputFile = $('#uploadExcelRiskUploadOutside');
            idForOverallCheck = (SYSTEM == 'OBYU') ? $('#forOverallOutside') : null;
        }

        if(idInputDate.val() == ""){
            idInputDate.val(currDate)
        }

        var formData = new FormData();
        formData.append('file', idInputFile[0].files[0]);
        formData.append('functionName', 'riskExcelUpload');
        formData.append('date', idInputDate.val());

        let idForOverallCheckValue = false
        if(SYSTEM == 'OBYU'){
            formData.append('forOverallFlag', ((idForOverallCheck.is(':checked')) ? 1 : 0));
            idForOverallCheckValue = idForOverallCheck.is(':checked') ? true : false
        }
        
        $.ajax({
            url: './../JS/uploader/riskUploader.php',  
            type: 'POST',
            data: formData,
            dataType: 'JSON',
            beforeSend: function() {
                $("#loaderHome").fadeIn();
            },
            success:function(data){
                idButton.attr('disabled', false);

                idButton.hide();
                $('.progressFileName').text('');
                if (data.status == "success") {
                    $.alert({
			            boxWidth: "30%",
			            useBootstrap: false,
			            title: "Success",
			            content: "Upload Success!",
			        });
                    loadRiskTable(idForOverallCheckValue);
                }else{
                	if(data.errorMessage){
	                    $.alert({
				            boxWidth: "30%",
				            useBootstrap: false,
				            title: "Error!",
				            content: data.errorMessage,
				        });
                	}
                }
            },
            error: function(xhr) {
                $.alert({
                        boxWidth: "30%",
                        useBootstrap: false,
                        title: "Error!",
                        content: "Error occured. Please try again.",
                });
            },
            complete: function() {
                idInputDate.val('')
                $("#loaderHome").fadeOut();
            },
            cache: false,
            contentType: false,
            processData: false
        });

        $('#uploadExcelRiskUploadOutside').val('')
        $('#uploadExcelRiskUploadInsight').val('')

    });

    $('#uploadExcelRiskUploadOutside').change(function(){ 
        if($('#uploadExcelRiskUploadOutside').val()!= '') {
            $('#importExcelRiskUploadOutside').show();
        }else{
            $('#importExcelRiskUploadOutside').hide();
        }
    })

    $('#uploadExcelRiskUploadInsight').change(function(){ 
        if($('#uploadExcelRiskUploadInsight').val()!= '') {
            $('#importExcelRiskUploadInsight').show();
        }else{
            $('#importExcelRiskUploadInsight').hide();
        }
    })

    if(SYSTEM == 'OBYU'){
        $("#forOverallInsight").change(function() {
            loadRiskTable(this.checked);
        });
    
        $("#forOverallOutside").change(function() {
            loadRiskTable(this.checked);
        });
    }
    
});