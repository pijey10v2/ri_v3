// var for markup tools
var coordsArrayMarkupTool;
var addedBillboardMarkupTool = [];
var addedLabelMarkupTool = [];
var addedDrawingMarkupTool = [];
var arrayOfCartesianMarkupTool = [];
var addedEntitiesIdArrMarkupTool = [];
var addedPointLine = [];
var undoArray = [];
var drawFlagMarkupTool = false;
var drawOnlyFlagMarkupTool = false;
var lastDrawAction = false;
var lastPoint;
var $jogetHost = JOGETHOST;
var billbrd;

$(document).ready(function () {
    $("#btn_stop").click(function () {
        drawOnlyFlagMarkupTool = false;
    });

    $(".closeButton").click(function () {
        drawOnlyFlagMarkupTool = false;
        $("#RIContainer").css("cursor", "default");
    });


    $("#btn_reset").click(function () {

            let markInstruct = $(this).attr('rel');

            $.confirm({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Reset!',
                content: 'Are you sure want to reset all the drawing? All drawing will be deleted. <br>',
                buttons: {
                    reset: function () {
                        resetDrawMarkupTool();
                        removeBillboardMarkupTool();
                        removeLabelMarkupTool();
                        $("#RIContainer").css("cursor", "default");
                        setInstruction('<div class="instruction"><label> Please choose any button to start drawing.</label></div>',markInstruct)
                        $(".header.edit").css('display', "none");
                        $(".tool.edit").css('display', "none");

                    },
                    cancel: function () {
                    }
                }
            });
            
    });

    $("#btn_print").click(function () {

        let markInstruct = $(this).attr('rel');

        $(".nav-bar.index").css("display", "none")
        $(".head.hideHeader").css("display", "none")
        $(".toolContainer").css("display", "none")
        $(".appButtonContainer").css("display", "none")
        $(".navBox").css("display", "none")
        $("#enlargeContainer").css("display", "none")
        $('#insightsToolContainer').css("display", "none")
        $('#RIContainer .cesium-viewer-toolbar').css("display", "none")

        window.print();

        $(".nav-bar.index").show()
        $(".head.hideHeader").show()
        $("#enlargeContainer").show()   
        $(".toolContainer").show()
        $(".appButtonContainer").show()
        $(".navBox.markupTool").show()
        $('#insightsToolContainer').show()
        $('#RIContainer .cesium-viewer-toolbar').show()

        $("#RIContainer").css("cursor", "default");
        setInstruction('<div class="instruction"><label> Please choose any button to start drawing.</label></div>',markInstruct)
        $(".header.edit").css('display', "none");
        $(".tool.edit").css('display', "none");
    
    });

    $(".icon.markup").click(function () {  
        $("#input-text").css("display", "none");
        $("#RIContainer").css("cursor", "default");

        drawOnlyFlagMarkupTool = $(this).attr('id');
        let markInstruct = $(this).attr('rel');
        markupRemoveActive();

        lastDrawAction = (drawOnlyFlagMarkupTool != "btn_undo") ? drawOnlyFlagMarkupTool : lastDrawAction;

        if (drawOnlyFlagMarkupTool == 'btn_point') {

            $("#" + drawOnlyFlagMarkupTool).addClass('active')
            $("#RIContainer").css("cursor", "url('../Images/ccrosshair.cur'),auto");
            $(".header.edit").css("display", "block");
            $(".tool.edit").css("display", "flex");
            $("#btn_delete").show();
            $("#btn_undo").hide();
            $(".sp-replacer").hide();
            setInstruction('<div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark point.</label></div>\
                            <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', markInstruct)
            $("#btn_undo").css("pointer-events", "none");
            $("#btn_delete").css("pointer-events", "auto");
            $('.sp-replacer').css("pointer-events", "none");
            $('#color-picker').parent().css("display", "none");

        } else if (drawOnlyFlagMarkupTool == 'btn_text') {

            $("#" + drawOnlyFlagMarkupTool).addClass('active')
            $("#RIContainer").css("cursor", "url('../Images/ccrosshair.cur'),auto");
            $(".header.edit").css("display", "block");
            $(".tool.edit").css("display", "flex");
            $("#btn_delete").show();
            $(".sp-replacer").show();
            $("#btn_undo").hide();
            setInstruction('<div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark text.</label></div>\
                            <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', markInstruct)
            $("#btn_undo").css("pointer-events", "none")
            $("#btn_delete").css("pointer-events", "auto");
            $('.sp-replacer').css("pointer-events", "auto");
            $('#color-picker').parent().css("display", "inline-flex");

        } else if (drawOnlyFlagMarkupTool == 'btn_line') {
            $("#" + drawOnlyFlagMarkupTool).addClass('active')
            $("#RIContainer").css("cursor", "url('../Images/ccrosshair.cur'),auto");
            $(".header.edit").css("display", "block");
            $(".tool.edit").css("display", "flex");
            $("#btn_undo").show();
            $(".sp-replacer").show();
            $("#btn_delete").hide();
            setInstruction('<div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark line.</label></div>\
                            <div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to complete.</label></div>\
                            <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', markInstruct)
            clearBeforeProceed();
            $("#btn_undo").css("pointer-events", "auto");
            $("#btn_delete").css("pointer-events", "none")
            $('.sp-replacer').css("pointer-events", "auto");
            $('#color-picker').parent().css("display", "inline-flex");

        } else if (drawOnlyFlagMarkupTool == 'btn_polygon') {
            $("#" + drawOnlyFlagMarkupTool).addClass('active')
            $("#RIContainer").css("cursor", "url('../Images/ccrosshair.cur'),auto");
            $(".header.edit").css("display", "block");
            $(".tool.edit").css("display", "flex");
            $("#btn_undo").show();
            $(".sp-replacer").show();
            $("#btn_delete").hide();
            setInstruction('<div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark polygon.</label></div>\
                            <div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to complete.</label></div>\
                            <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', markInstruct)
            clearBeforeProceed();
            $("#btn_undo").css("pointer-events", "auto");
            $("#btn_delete").css("pointer-events", "none")
            $('.sp-replacer').css("pointer-events", "auto");
            $('#color-picker').parent().css("display", "inline-flex");

        } else if (drawOnlyFlagMarkupTool == 'btn_undo') {

            $("#" + drawOnlyFlagMarkupTool).addClass('active')
            if (checkCompleteDraw) {
                alert("You already completed the drawing and it cannot be undo! Please click on reset button to delete all drawing.");
            }
            else {
                if (undoArray.length != 0) {
                    var action = undoArray[undoArray.length - 1].action;
                    if (action == "delete") {
                        viewer.entities.add(undoArray[undoArray.length - 1].details)
                        undoArray.pop();
                    } else if (action == "add") {
                        viewer.entities.remove(undoArray[undoArray.length - 1].details)
                        undoArray.pop();
                        arrayOfCartesianMarkupTool.pop();
                        addedEntitiesIdArrMarkupTool.splice(addedEntitiesIdArrMarkupTool.length - 1, 1)
                        addedDrawingMarkupTool.splice(addedDrawingMarkupTool.length - 1, 1)

                        if ((lastDrawAction == 'btn_line' && arrayOfCartesianMarkupTool.length == 1) || (lastDrawAction == 'btn_polygon' && arrayOfCartesianMarkupTool.length == 2)) {
                            arrayOfCartesianMarkupTool = [];
                        }
                    }
                }
            }
            drawOnlyFlagMarkupTool = (lastDrawAction) ? lastDrawAction : drawOnlyFlagMarkupTool;
            if (drawOnlyFlagMarkupTool == 'btn_line' || drawOnlyFlagMarkupTool == 'btn_polygon') {
                
                $("#" + drawOnlyFlagMarkupTool).addClass('active')
                $("#btn_undo").css("pointer-events", "auto");
                $("#btn_delete").css("pointer-events", "none")
                $('.sp-replacer').css("pointer-events", "auto");
                $("#RIContainer").css("cursor", "url('../Images/ccrosshair.cur'),auto");
                setInstruction('<div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to mark.</label></div>\
                                <div class="instruction rightClick"><i class="fa-solid fa-computer-mouse"></i><label>  Right click to complete.</label></div>\
                                <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', markInstruct)
            }
        }
        else if (drawOnlyFlagMarkupTool == 'btn_delete') {
            $("#" + drawOnlyFlagMarkupTool).addClass('active')
            $("#RIContainer").css("cursor", "url('../Images/double-sided-eraser.png') 4 12, auto");
            setInstruction('<div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to remove marking.<br>\
                            <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', markInstruct)
        }
    });


    $("#btn_text").click(function () {

        let markInstruct = $(this).attr('rel');

        setInstruction(
        'Write text in textbox.<br>\
        <div class="instruction leftClick"><i class="fa-solid fa-computer-mouse"></i><label>  Left click to place the text.<br>\
        <div class="instruction escape"><label>Press <kbd>Esc</kbd> to exit.</label></div>', markInstruct);

        $("#input-text").val("");
        $("#input-text").css("display", "block");
        $("#input-text").focus();
        $("#input-text").focusout(function () {
        $("#input-text").focus();
        });

        let currentMousePos = { x: -1, y: -1 };
        $(document).mousemove(function (event) {
        currentMousePos.x = event.pageX - 10;     //+10
        currentMousePos.y = event.pageY - 60;     //-30

        $("#input-text").css("top", currentMousePos.y);
        $("#input-text").css("left", currentMousePos.x);
        });
    });
    });

    $("#reviewToolFontSizeInput").change(() => {
    $("#reviewToolFontSize").val($("#reviewToolFontSizeInput").val());
    });
    $("#reviewToolFontSize").change(() => {
    $("#reviewToolFontSizeInput").val($("#reviewToolFontSize").val());
    });


function markupRemoveActive() {
    $(".icon").removeClass('active')
    $(".icon").css("pointer-events", "auto");
    $('.sp-replacer').css("pointer-events", "auto");

}
function addBillboardMarkupTool(coordsArrayMarkupTool) {
    lon = coordsArrayMarkupTool[0];
    lat = coordsArrayMarkupTool[1];
    hei = 0;
    billbrd = viewer.entities.add({
        name: "Pin",
        position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
        billboard: {
            image: '../Images/markupTools/hollow-red-circle.png',
            width: 20,
            height: 20,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
    });
    addedBillboardMarkupTool.push(billbrd);
    addedEntitiesIdArrMarkupTool.push(billbrd._id);
    undoArray.push({ "action": "add", "details": billbrd });
}

function addLabelMarkupTool(coordsArrayMarkupTool) {
    lon = coordsArrayMarkupTool[0];
    lat = coordsArrayMarkupTool[1];
    hei = 0.2;

    var insertedText = $("#input-text").val();
    var pickedColor = $("#color-picker").val();
    var cesiumCustColor = Cesium.Color.fromCssColorString(pickedColor);

    var label = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
        label: {
            text: insertedText,
            fillColor: cesiumCustColor,
            font: "18px sans-serif"
        },
    });
    addedLabelMarkupTool.push(label);
    addedEntitiesIdArrMarkupTool.push(label._id);
    undoArray.push({ "action": "add", "details": label });
}

function drawMarkupTool(type) {
    var getSelectorLocation = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(arrayOfCartesianMarkupTool);
    var pickedColor = $("#color-picker").val();
    pickedColor = (pickedColor) ? pickedColor : "white";
    var cesiumCustColor = Cesium.Color.fromCssColorString(pickedColor);

    if (type == 'polygon') {
        var addedPolygon = viewer.entities.add({
            polygon: {
                hierarchy: getSelectorLocation,
                // outline : true,
                outlineColor: true,
                outlineWidth: 9,
                clampToGround: true,
                perPositionHeight: true,
                // extrudedHeight: 2,
                material: cesiumCustColor
            }
        });
        addedDrawingMarkupTool.push(addedPolygon);
        addedEntitiesIdArrMarkupTool.push(addedPolygon._id);
        undoArray.push({ "action": "add", "details": addedPolygon });
    }
    if (type == 'line') {
        var addedLine = viewer.entities.add({
            polyline: {
                outline: false,
                positions: getSelectorLocation,
                width: 2,
                material: cesiumCustColor,
            }
        });
        addedEntitiesIdArrMarkupTool.push(addedLine._id);
        addedDrawingMarkupTool.push(addedLine);
        undoArray.push({ "action": "add", "details": addedLine });
    }
}

function clearBeforeProceed() {

    if (drawFlagMarkupTool == 'line' && arrayOfCartesianMarkupTool.length > 1) {
        drawMarkupTool(drawFlagMarkupTool);
        let coorArr = [];
        arrayOfCartesianMarkupTool.forEach(function (ele, idx) {
            var s = [];
            let currentLong = Cesium.Math.toDegrees(ele.longitude).toFixed(8);
            let currentLati = Cesium.Math.toDegrees(ele.latitude).toFixed(8);
            s.push(currentLong);
            s.push(currentLati);
            coorArr.push(s);
        });
        if (lastDrawAction == 'btn_line') {
            lastPoint = arrayOfCartesianMarkupTool[arrayOfCartesianMarkupTool.length - 1]
            arrayOfCartesianMarkupTool = [];
            arrayOfCartesianMarkupTool.push(lastPoint);
            if (arrayOfCartesianMarkupTool.length == 1) {
                arrayOfCartesianMarkupTool = [];
            }
        }
        else {
            arrayOfCartesianMarkupTool = [];
        }
    }
    if (drawFlagMarkupTool == 'polygon' && arrayOfCartesianMarkupTool.length > 2) {
        drawMarkupTool(drawFlagMarkupTool);
        let coorArr = [];
        arrayOfCartesianMarkupTool.forEach(function (ele, idx) {
            var s = [];
            let currentLong = Cesium.Math.toDegrees(ele.longitude).toFixed(8);
            let currentLati = Cesium.Math.toDegrees(ele.latitude).toFixed(8);
            s.push(currentLong);
            s.push(currentLati);
            coorArr.push(s);
        });
        if (lastDrawAction == 'btn_polygon') {
        }
        else {
            arrayOfCartesianMarkupTool = [];
        }

    }
}

function removeBillboardMarkupTool() {
    addedBillboardMarkupTool.forEach(function (billboard, index) {
        viewer.entities.remove(billboard);
    });
    addedBillboardMarkupTool = [];
}

function removeLabelMarkupTool() {
    addedLabelMarkupTool.forEach(function (billboard, index) {
        viewer.entities.remove(billboard);
    });
    addedLabelMarkupTool = [];
}

function resetDrawMarkupTool() {
    arrayOfCartesianMarkupTool = [];
    addedDrawingMarkupTool.forEach(function (billboard, index) {
        viewer.entities.remove(billboard);
    });
    addedDrawingMarkupTool = [];
}
