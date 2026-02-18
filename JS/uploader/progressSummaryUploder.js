// handle the dahboard tab to load the table
// handle the button to populate the hidden 
// handle to button to upload

function OnClickDashboardUpload() {
    $("#progressUploadForm").show();
    $("#importExcel").hide();
    $('.progressFileName').text('');
    loadProgressSummaryTable();

}

function loadProgressSummaryTable(){
    $.ajax({
        url: 'JS/uploader/progressUpload.php',  
        type: 'POST',
        dataType: 'JSON',
        data: {functionName : "progressTableData"},
        success:function(data){
            console.log(data.data);
            let progHTML = '';
            if (data.data) {
                let progData = data.data;
                progData.forEach(function(ele,idx){
                    progHTML += '<tr>'
                    progHTML += '<td>'+ele.pps_month_year.split(" ")[0]+'</td>'
                    progHTML += '<td>'+parseFloat(ele.pps_financial_early).toFixed(2)+'</td>'
                    progHTML += '<td>'+parseFloat(ele.pps_financial_late).toFixed(2)+'</td>'
                    progHTML += '<td>'+parseFloat(ele.pps_physical_early).toFixed(2)+'</td>'
                    progHTML += '<td>'+parseFloat(ele.pps_physical_late).toFixed(2)+'</td>'
                    progHTML += '</tr>';
                })
            }
            $("#excelTBody").html(progHTML);   
        }
    });
}

$(document).ready(function(){
	$('#importExcel').on('click', function(e){ 
        e.preventDefault();

        var formData = new FormData();
        formData.append('file', $('#uploadExcelInput')[0].files[0]);
        formData.append('functionName', 'progressExcelUpload');
        $.ajax({
            url: 'JS/uploader/progressUpload.php',  
            type: 'POST',
            data: formData,
            dataType: 'JSON',
            success:function(data){
                if (data.status == "success") {
                    $.alert({
			            boxWidth: "30%",
			            useBootstrap: false,
			            title: "Success",
			            content: "Upload Success!",
			        });
                    loadProgressSummaryTable();
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