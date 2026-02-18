// will load data for 3 table
function loadRiskTable(){
    $.ajax({
        url: './../JS/uploader/riskUploader.php',  
        type: 'POST',
        dataType: 'JSON',
        data: {functionName : "riskTableData"},
        success:function(data){
            if (!data.data) return;
            let riskHistDataHTML = '';
            if (data.data.projRiskHistInfo) {
                let riskData = data.data.projRiskHistInfo;
                if(riskData[0]?.rhd_month_year) {
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
                    var fileLink = '<a target="_blank" download href="../'+ele.ruf_file_path+'">'+ele.ruf_file_name+'</a>';
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
                $("#remainDurVal").html((riskProbData.rpd_project_remain_dur) ? riskProbData.rpd_project_remain_dur : 0);
                $("#schImpUncerVal").html((riskProbData.rpd_overall_schedule_impact_uncer) ? riskProbData.rpd_overall_schedule_impact_uncer : 0);
                $("#compPerSchVal").html((riskProbData.rpd_project_prob_complete) ? riskProbData.rpd_project_prob_complete : 0);
                $("#timeCompProbVal").html((riskProbData.rpd_timely_completion_prob) ? riskProbData.rpd_timely_completion_prob : 0);
            }

            $("#uploadedDataTable").html(riskHistDataHTML); 
            $("#uploadedFileTable").html(riskFileHTML); 
        }
    });
}

$(document).ready(function(){
    var currDate = new Date().toJSON().slice(0,10);
    $('#uploaded-date').val(currDate)

    // loadRiskTable();
	$('#importExcel').on('click', function(e){ 
        e.preventDefault();
        $('#importExcel').attr('disabled', true);
        var formData = new FormData();
        formData.append('file', $('#uploadExcelInput')[0].files[0]);
        formData.append('functionName', 'riskExcelUpload');
        formData.append('date', $('#uploaded-date').val());
        $.ajax({
            url: './../JS/uploader/riskUploader.php',  
            type: 'POST',
            data: formData,
            dataType: 'JSON',
            beforeSend: function() {
                $("#loadingContainer_dashboard").show();
            },
            success:function(data){
                $('#importExcel').attr('disabled', false);

                $("#importExcel").hide();
                $('.progressFileName').text('');
                if (data.status == "success") {
                    $.alert({
			            boxWidth: "30%",
			            useBootstrap: false,
			            title: "Success",
			            content: "Upload Success!",
			        });
                    loadRiskTable();
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
                $("#loadingContainer_dashboard").hide();
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    $("#add-file-btn-dash").click(function(e){
    	e.preventDefault();
    	$('#uploadExcelInput').trigger('click');
    })

    $('#uploadExcelInput').change(function() {
  		$('.progressFileName').text($('#uploadExcelInput')[0].files[0].name);
  		$("#importExcel").show();
	});

});