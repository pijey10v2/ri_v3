var processName;

    if($('#process_name').val()!=""){
        $('#'+$('#process_name').val()+'_checkbox').show();
    }


saveImportConfig = (ele) =>{
        var currentPage = $(ele).data("page");
        var frameId = "";
        if(currentPage == "bulkProj"){
            frameId = "importContentIframebulkProj";
        }else{
            frameId = "importContentIframebulk";
        }
        var process = $("#"+frameId+"").contents().find("#process_name").val();       
        var columns = new Array() ;
        var formdata = new FormData();
        formdata.append('process', process);
        $("#"+frameId+"").contents().find('#'+process+'_checkbox input[type=checkbox]').each(function() {
            columns[$(this).attr('id')] = $(this).prop('checked')
            formdata.append('columns['+$(this).attr('id')+']', $(this).prop('checked'));
        });
    
        $.ajax({
            type: "POST", 
            url: "../Components/bulkImport/V3/saveImportConfig.php",
            dataType: "JSON",
            processData: false,
            contentType: false,
            data: formdata,
            success: function(msg){
                console.log("Success");
                if(msg.success){
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Success',
                        content: 'Saved!',
                    });
                }else{
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Error',
                        content: 'Not Saved.',
                    });
                }
                
            }
        });
    }