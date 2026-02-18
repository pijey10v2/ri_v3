var reader = new FileReader();
var initializeImage
var xx = "";
var clickX;

$(document).ready(function () {
    imgInitialSource = "choosePinDetails";
    $("#imgSourceRadio input").change(function () {
        if ($(this).attr("id") == 'fromImage') {
            $("#initImage").attr('src', '');
            $("#initImage").css('width', 'unset');
            $("#initImage").css('height', 'unset');
            $(".verticalLine").css('left', 'unset');
            
            $(".initImageDiv").show();
            $("#initImage").removeClass("active")
            $("#northReset").css("display", "none")
            imgInitialSource = "chooseImage";
        } else if ($(this).attr("id") == 'fromPinDetails') {
            $(".initImageDiv").hide();
            imgInitialSource = "choosePinDetails";
        }
    });
    ChangeImage();

});

function ChangeImage(){
    let reader = new FileReader();
    reader.onload = function (e) {  
        $("#initImage").attr('src', e.target.result);
        $("#initImage").css('width', "100%");
        $("#initImage").css('height', "250px");
        $("#northReset").css("display", "none")
        $(".instructionBox").html("Select center point (North) of image")

        $("#initImage").on("click", function(event) {
            clickX = event.offsetX; //longitude
            var width = this.offsetWidth; 
 
            xx = ((clickX/width) * 360);

            if(!$("#initImage").hasClass("active")){
                var element = $("#initImage")
                clickX = event.offsetX;
                var width = this.offsetWidth;
                if(clickX < (width/2)){
                    xx = 180+((clickX/width)*360);
                }else{
                    xx = (clickX-(width/2))*(360/width);
                }

                $("#initImage").addClass("active")
                $(".verticalLine").css("left", clickX)
                $("#northReset").css("display", "block")
                $(".instructionBox").html("Click <kbd>Reset</kbd> to reset the North position.")
            }else{
            }
        });

        $("#initImage").mousemove(function(event){
            if(!$("#initImage").hasClass("active")){
                clickX = event.offsetX;
                var linePos = clickX - 8;
                $(".verticalLine").css("left", linePos)
            }else{
            }
        })

        $("#northReset").on("click", function(){
            $("#initImage").removeClass("active")
            $(".verticalLine").css("left", "13px")
            $("#northReset").css("display", "none")
            $(".instructionBox").html("Select center point (North) of image")
        })
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#imageFileName").change(function(){
        readURL(this);
    });
}


function OnClickAddImageSave() {
    var imageR = new FormData(); // you can consider this as 'data bag'
    imageR.append('imageFile', $('#imageFileName')[0].files[0]); // append selected file to the bag named 'file'
    var name = $('#imgName').val();
    
    if(name ==""){
        $.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Need image feed name to save the image pin and details',
        });
            return;
    };
	
	if(!$('#imageFileName')[0].files[0] && earthPinEdit == false){
		$.alert({
            boxWidth: '30%',		
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a JPG/PNG image file',
        });
		return
    }

    var imageName;
    if ($('#imageFileName')[0].files[0]){
        imageR.append('imageFile', $('#imageFileName')[0].files[0]); // append selected file to the bag named 'file'
        imageName = $('#imageFileName').prop("files")[0]['name'];
    }
    else if (!$('#imageFileName')[0].files[0] && earthPinEdit == true){
        imageName = fileURL;
    }

    hideinstruction()
    instructions('')
    event.preventDefault();
    var editID = $('#imagePinID').val();
    var height = $('#imgHeight').val();
    var lng = $('#imgLong').val();
    var lat = $('#imgLat').val();
    var initHead = "";
    var headChoice = "";
    initializeImage = imgInitialSource;
    
    if (initializeImage == "choosePinDetails"){
        initHead = lng;
        headChoice = 0;
        clickX = 0;
    }
    else{
        initHead = xx;
        headChoice = 1;
    }

    if (earthPinEdit == true) {
        var imagePinDetails = {
            name: name,
            id: editID,
            longitude: lng,
            latitude: lat,
            height: height,
            imageName: imageName,
            initialHead: initHead,
            choice: headChoice,
            clickX: clickX,
        };

        imageR.append('fileInfo', JSON.stringify(imagePinDetails));
        $.ajax({
            type: "POST",
            url: 'BackEnd/updateImagePinData.php',
            contentType: false,
            processData: false,
            data: imageR,
            success: function (obj, textstatus) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                jqwidgetBox("addImage", false);
                var i = earthPinIndex;
                viewer.entities.removeById(earthPinsArray[i].id);
                earthPinData[i].imagePinName = name;
                earthPinData[i].height = height;
                earthPinData[i].imageURL = obj['imagePath'];
                earthPinData[i].initClick = obj['clickX'];
                var myEarthPin = addEarthPin(earthPinData[i].imagePinName, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, true);
                earthPinsArray.splice(i, 1, myEarthPin);
                $('#imagePinList').find('label').eq(i).text(name);
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
        earthPinEdit = false;
    } else {
        var imagePinDetails = {
            name: name,
            longitude: lng,
            latitude: lat,
            height: height,
            imageName: imageName,
            initialHead: initHead,
            choice: headChoice,
            clickX: clickX,
        };

        imageR.append('fileInfo', JSON.stringify(imagePinDetails));
        $.ajax({
            type: "POST",
            url: 'BackEnd/saveImagePinData.php',
            contentType: false,
            processData: false,
            data: imageR,
            success: function (obj, textstatus) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                var data = obj['data'];
                jqwidgetBox("addImage", false);
                $('#imgName').val("")
                $('#imgLong').val("");
                $('#imgLat').val("");
                $('#imgHeight').val("");
                $('#imageFileName').val("");
                $("#initImage").val("src","")
                $(".initImageDiv").css("display","none")
                $("#initImage").removeClass("active")
                $(".verticalLine").css("left", "13px")
                $("#northReset").css("display", "none")
                $(".instructionBox").html("Select center point (North) of image")
                viewer.entities.removeById(tempImagePin.id);
                earthPinsArray.push(addEarthPin(name, lng, lat, height, true));
                earthPinData.push(data);
                flagLoadedEarth = false;
                $(".admin-function.active").removeClass("active");
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
    }
}