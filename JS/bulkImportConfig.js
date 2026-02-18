$(document).ready(function () {
    
    var processName;
    
    $("#process_name").change(function () { 

        if($('#process_name').val() == 'SD'){
            if(localStorage.project_owner == 'JKR_SABAH'){
                processName = 'SI';
            }else{
                processName = $('#process_name').val();
            }
        }else{
            processName = $('#process_name').val();
        }

        if($('#process_name').val()!=""){
            $('.construct_checkbox').hide();
            $('#'+$('#process_name').val()+'_checkbox').show();
            $('#download_template').attr("href","../../Templates/bulkImport/"+localStorage.project_owner+"/construct_"+processName+"_template.xlsx");
            $('#download_template').show();
            $('#save_button').show();
        } else{
            $('#download_template').hide();
            $('#save_button').hide();
        }
    }); 
    
});


function saveImportConfig(){
    let process = $('#process_name').val();
    var columns = new Array() ;
    var formdata = new FormData();
    formdata.append('process', process);
    $('div#'+$('#process_name').val()+'_checkbox input[type=checkbox]').each(function(){
        console.log($(this).attr('id') + " : " + $(this).prop('checked'));
        columns[$(this).attr('id')] = $(this).prop('checked')
        formdata.append('columns['+$(this).attr('id')+']', $(this).prop('checked'));
    });

    $.ajax({
        type: "POST", 
        url: "saveImportConfig.php",
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