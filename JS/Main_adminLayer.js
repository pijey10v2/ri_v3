let lyrDetails;
let ecwDetails;
var flagEditAerial = false;

function OnClickLayerEdit(ele){
    let buttoncontainer = document.getElementById("buttoncontainer")
    if ($(ele).hasClass('active')){
        $(ele).removeClass('active', function(){
            $('#buttoncontainer').slideUp(100)
            $("br.spacer").remove()
        })
    }else{
        $(ele).addClass('active', function(){
            ele.insertAdjacentElement("afterend", buttoncontainer);
            $(ele).siblings().removeClass('active')
            $(ele).addClass('active')
            $("br.spacer").remove()
            $(buttoncontainer).after('<br class = "spacer">')
            $(buttoncontainer).after('<br class = "spacer">')
            $(buttoncontainer).after('<br class = "spacer">')
            $(buttoncontainer).after('<br class = "spacer">')
            $(buttoncontainer).after('<br class = "spacer">')
            $(buttoncontainer).after('<br class = "spacer">')
            $("#renameLayer").attr("disabled","");
            $("#saveLayerName").attr("disabled","");
            $('#buttoncontainer').slideDown(100)
            let data_id = ele.children[0].innerText;
            let lyr_name = ele.children[1].innerText;
            let data_owner = ele.children[5].innerText;
            let def_view = ele.children[3].innerText;
            if(def_view == "ON"){
                $("#layerDefDisplay").html("Turn off")
            }
            else{
                $("#layerDefDisplay").html("Turn on")
            }
            lyrDetails = {id: data_id, name: lyr_name, view: def_view, ele:ele };
            $("#data_Owner").html(data_owner);
            $("#renameLayer").val(lyr_name);
        })
    }
}

function editLayerName(){
    $("#renameLayer").removeAttr("disabled");
    $("#saveLayerName").removeAttr("disabled");
}

function saveLayerName(){
    let changedName = $("#renameLayer").val()
    let iniName = lyrDetails.ele.children[1].innerText;
    if(changedName == "" || changedName == iniName){
		$.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Message',
			content: 'Empty input or same value entered. Layer name not saved!',
		});
        $("#renameLayer").removeAttr("disabled");
        $("#saveLayerName").attr("disabled","");
        return
    }
    else{
        $.ajax({
            type: "POST"
            , url: 'BackEnd/DataFunctions.php'
            , dataType: 'json'
            , data: {
                functionName: "renameLayer", data_id: lyrDetails.id, layer_name:changedName
            }
            , success: function (obj, textstatus) {
                if(obj.bool === true){
                    let lyrlist_item = $("#dataID_"+lyrDetails.id).find("label")[0]
                    lyrlist_item.innerText = changedName
                    lyrDetails.name = changedName;
                    lyrDetails.ele.children[1].innerText = changedName;
                    $("#renameLayer").attr("disabled","");
                    $("#saveLayerName").attr("disabled","");
                }
                else{                   
                    $.alert({
						boxWidth: '30%',
						useBootstrap: false,
                        title: 'Message',
                        content: obj.msg,
                    });
                }
            }
            , error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        })
    }
}

function detachFromProject(){
    $.confirm({
		boxWidth: '30%',
		useBootstrap: false,
        title: 'Confirm!',
        content: 'Are you sure to detach this layer from the project?',
        buttons: {
            confirm: function () {
                $.ajax({
                    type: "POST"
                    , url: 'BackEnd/DataFunctions.php'
                    , dataType: 'json'
                    , data: {
                        data_id: lyrDetails.id,
                         functionName: "detachLayer"
                    }
                    , success: function (obj) {
                        if(obj.bool === true){
                            let lyrlist_item = $("#dataID_"+lyrDetails.id)[0]
                            let lyrlist_check = lyrlist_item.children[0]
                            let targetId = $(lyrlist_check).attr('id')
                            $("#buttoncontainer").css("display","none");
                            $("#buttoncontainer").removeClass("active");
                            $("br.spacer").remove()
                            //remove entity
                            var i=0;
                            while(i< tilesetlist.length){
                                if(targetId == tilesetlist[i].name){
                                    if(tilesetlist[i].type =="kml"){
                                        viewer.dataSources.remove(tilesetlist[i].tileset);
                                    }else{
                                        viewer.scene.primitives.remove(tilesetlist[i].tileset) 
                                    };
                                    break;
                                };
                                i++;
                            };
                            $(lyrlist_item).remove();
                            lyrDetails.ele.parentNode.removeChild(lyrDetails.ele);
                        }
                        else{
                            $.alert({
								boxWidth: '30%',
								useBootstrap: false,
                                title: 'Message',
                                content: 'Detach failed! Please try again.',
                            });
                        }
                        let tdEle = lyrDetails.ele.children[1]
                        let tdName = $(tdEle).text()
                        $('#modelLayerName option').filter(function () { return $(this).html() == tdName; }).remove();
                    }
                    , error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        console.log(str);
                    }
                })
            },
            cancel: function () {
               return
            }
        }
    });       
    
}

function switchDefDisplay(){
    $.ajax({
        type: "POST"
        , url: 'BackEnd/DataFunctions.php'
        , dataType: 'json'
        , data: {
            functionName: 'switchDefaultDisplay', data_id: lyrDetails.id, defView: lyrDetails.view
        }
        , success: function (obj, textstatus) {
            if(obj.bool === true){
                let lyrlist_item = $("#dataID_"+lyrDetails.id).find("input")[0]
                if(lyrDetails.view == "ON"){
                    lyrlist_item.checked = false;
                    $("#layerDefDisplay").html("Turn on")
                    lyrDetails.view = "OFF"
                    lyrDetails.ele.children[3].innerText = "OFF"

                    layerOnCheck(lyrlist_item);
                }
                else{
                    lyrlist_item.checked = true;
                    $("#layerDefDisplay").html("Turn off")
                    lyrDetails.view = "ON"
                    lyrDetails.ele.children[3].innerText = "ON"

                    layerOnCheck(lyrlist_item);
                }
                if (obj.groupOff){
                    let grplist_item = $("#layerGroup_"+obj.groupOff).find("input")[0]
                    grplist_item.checked = false;

                    layerOnCheck(grplist_item);
                }
                else if(obj.groupOn){
                    let list_item = $("#layerGroup_"+obj.groupOn).find("input")[0]
                    list_item.checked = true;

                    layerOnCheck(list_item);
                }
            }
            else{
                $.alert({
					boxWidth: '30%',
					useBootstrap: false,
                    title: 'Message',
                    content: 'Update failed! Please try again',
                });
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function OnClickAerialEditButton(ele){
    flagEditAerial = true;
    var name = $(ele).attr('name');
    var column2 = $('#aerialEditContainer').children().children().children('.column2');

    $('#aerialEditTitle').html(name)
    $('#aerialImageEdit').children().removeClass('active');
    $('#aerialEditContainer').children().remove();
    $("input:radio[name='aerialEditCat']").prop('checked', false);
    
    jqwidgetBox("function14", 1);
    column2.css('display', 'none');
    var listHTML = '';

    
    arrAerialEdit.forEach(ecwEdit => {
        if(ecwEdit.groupType == name) {
            listHTML += `
            <tr class = 'rowEcw' onclick="OnClickAerialEdit(this)">
                <td>${new Date(ecwEdit.capturedDate).toDateString()}</td>
                <td>`+ecwEdit.fileName+`</td>
                <td>`+ecwEdit.uploadDate+`</td>
                <td style ="display: none">`+ecwEdit.id+`</td>
                <td style ="display: none">`+ecwEdit.name+`</td>
            </tr>
            `
        }
    });
    
    $('#aerialImageEdit').html(listHTML)
    $('#aerialImageEdit').append(`<div id="aerialEditContainer"></div>`)
}

$('input[id="startValue"]').keyup(function(e){
    if (/\D/g.test(this.value))
    {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
    }
});

$('input[id="endValue"]').keyup(function(e){
    if (/\D/g.test(this.value))
    {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
    }
});

function OnClickAerialEdit(ele){
    $('#aerialEditContainer').children().remove()
    let editcontainer = document.getElementById("aerialEditContainer")
    if ($(ele).hasClass('active')){
        $(ele).removeClass('active', function(){
            $('#aerialEditContainer').slideUp(100)
            $('#aerialEditContainer').children().remove()
        })
    }else{
        $(ele).addClass('active', function(){
            ele.insertAdjacentElement("afterend", editcontainer);
            $(ele).siblings().removeClass('active')
            $(ele).addClass('active')
            $('#aerialEditContainer').slideDown({
                start: function () {
                    $(this).css({
                      display: "table-row"
                    })
                }
            })

            $('#aerialEditContainer').append('<td colspan="3">'+
                '<div class="editColumn">'+
                    '<div class="column1">'+
                        '<span class="padding">Category :</span>'+
                        '<div class="padding flex">'+
                            '<div class="flex alignItem">'+
                                '<input type="radio" id="catRadio" name="aerialEditCat" value="KM">'+
                                '<label for="kmPost">KM Post</label>'+
                            '</div>'+
                            '<div class="flex alignItem">'+
                                '<input type="radio" id="catRadio" name="aerialEditCat" value="CH">'+
                                '<label for="chainage">Chainage</label>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="column2" style="display: none">'+
                        '<div class="innercolumn1">'+
                            '<div class="inputContainer">'+
                                '<label class="required">Start</label>'+
                                '<input type="number" id= "startValue">'+
                            '</div>'+
                            '<div class="inputContainer">'+
                                '<label class="required">End</label>'+
                                '<input type="number" id= "endValue">'+
                            '</div>'+
                        '</div>'+
                        '<div class="innercolumn2">'+
                            '<button onclick = "updateECW(this)">Update</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</td>')

            let ecw_id = ele.children[3].innerText;
            let ecw_currentName = ele.children[4].innerText;
            ecwDetails = {id: ecw_id, curr_name: ecw_currentName};

        })
    }
}

function updateECW (e){
    let ecw_cat = $('input[id="catRadio"]:checked').val();
    let start_val = $("#startValue").val()
    let end_val = $("#endValue").val()

    if(!start_val || !end_val){
        $.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Aerial Function',
			content: 'Empty input, data will not be saved',
		});
        return;
    }

    var ecwNewName = ecw_cat + ':' + start_val + ',' + end_val
    if(ecwNewName == ecwDetails.curr_name){
        $.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Aerial Function',
			content: 'Input same as current name, data will not be saved',
		});
        return;
    }

    $.ajax({
        type: "POST"
        , url: 'BackEnd/DataFunctions.php'
        , dataType: 'json'
        , data: {
            functionName: 'updateECWName', data_id: ecwDetails.id, set_name: ecwNewName
        }
        , success: function (obj, textstatus) {
            if(obj.bool === true){
                if ($('.rowEcw').hasClass('active')){
                    $('.rowEcw').removeClass('active', function(){
                        $('#aerialEditContainer').slideUp(100)
                        $('#aerialEditContainer').children().remove()
                    })
                }
            }
            else{
                $.alert({
					boxWidth: '30%',
					useBootstrap: false,
                    title: 'Message',
                    content: 'Update failed! Please try again',
                });
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })

}