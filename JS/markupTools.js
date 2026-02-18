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
    console.log("stop");
    drawOnlyFlagMarkupTool = false;
  });


  $("#btn_reset").click(function () {
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

              },
              cancel: function () {
              }
          }
      });
  });


  $("#btn_print").click(function () {
    window.print();
  });

  $(".markupButton").click(function () {
    $("#input-text").css("display", "none");
    instructions("");
    hideinstruction();
    console.log("markup");
    $("body").css("cursor", "default");

    drawOnlyFlagMarkupTool = $(this).attr('id');
    markupRemoveActive();

    lastDrawAction = (drawOnlyFlagMarkupTool != "btn_undo") ? drawOnlyFlagMarkupTool : lastDrawAction;

    if (drawOnlyFlagMarkupTool == 'btn_point') {
        $("#" + drawOnlyFlagMarkupTool).addClass('active')
        $("body").css("cursor", "crosshair");
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to mark point(s).<br>\
        Press  <kbd>Esc</kbd> to save and Exit.')
        $("#btn_undo").css("pointer-events", "none");
        $("#btn_delete").css("pointer-events", "auto");
        $('.sp-replacer').css("pointer-events", "none");
   } else if (drawOnlyFlagMarkupTool == 'btn_text') {
        $("#" + drawOnlyFlagMarkupTool).addClass('active')
        $("body").css("cursor", "crosshair");
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to mark point(s).<br>\
        Press  <kbd>Esc</kbd> to save and Exit.')
        $("#btn_undo").css("pointer-events", "none")
        $("#btn_delete").css("pointer-events", "auto");
        $('.sp-replacer').css("pointer-events", "auto");
    } else if (drawOnlyFlagMarkupTool == 'btn_line') {
        $("#" + drawOnlyFlagMarkupTool).addClass('active')
        $("body").css("cursor", "crosshair");
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to mark points.<br>\
                    Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to complete.<br>\
                    Press  <kbd>Esc</kbd> to save and Exit.')
        clearBeforeProceed();
        $("#btn_undo").css("pointer-events", "auto");
        $("#btn_delete").css("pointer-events", "none")
        $('.sp-replacer').css("pointer-events", "auto");
    } else if (drawOnlyFlagMarkupTool == 'btn_polygon') {
        $("#" + drawOnlyFlagMarkupTool).addClass('active')
        $("body").css("cursor", "crosshair");
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to mark points.<br>\
                    Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to complete.<br>\
                    Press  <kbd>Esc</kbd> to save and Exit.')
        clearBeforeProceed();
        $("#btn_undo").css("pointer-events", "auto");
        $("#btn_delete").css("pointer-events", "none")
        $('.sp-replacer').css("pointer-events", "auto");
    }
    else if (drawOnlyFlagMarkupTool == 'btn_undo') {
        // $("#" + drawOnlyFlagMarkupTool).addClass('active')
        instructions("")
        hideinstruction()
        console.log(checkCompleteDraw);
        if (checkCompleteDraw) {
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
            $("body").css("cursor", "crosshair");
            showinstruction()
            instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to mark points.<br>\
                        Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to complete.<br>\
                        Press  <kbd>Esc</kbd> to Exit.')
        }
    }
    else if (drawOnlyFlagMarkupTool == 'btn_delete') {
        $("#" + drawOnlyFlagMarkupTool).addClass('active')
        $("body").css("cursor", "url('Images/double-sided-eraser.png') 4 12, auto");
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to remove marking.<br>\
        Press  <kbd>Esc</kbd> to Exit.')
    }
  });


  $("#btn_text").click(function () {
    showinstruction();
    instructions(
      'Write text in textbox.<br>\
                  Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to place the text.<br>\
                  Press  <kbd>Esc</kbd> to Exit.'
    );

    $("#input-text").val("");
    $("#input-text").css("display", "block");
    $("#input-text").focus();
    $("#input-text").focusout(function () {
      $("#input-text").focus();
    });

    let currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function (event) {
      currentMousePos.x = event.pageX + 10;
      currentMousePos.y = event.pageY - 30;

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
    $(".markupButton").removeClass('active')
    $(".markupButton").css("pointer-events", "auto");
    $('.sp-replacer').css("pointer-events", "auto");

}
function addBillboardMarkupTool(coordsArrayMarkupTool) {
    //var pinBuilder= new Cesium.PinBuilder();
    lon = coordsArrayMarkupTool[0];
    lat = coordsArrayMarkupTool[1];
    hei = 0;
    billbrd = viewer.entities.add({
        name: "Pin",
        position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
        billboard: {
            image: 'Images/markupTools/hollow-red-circle.png',
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
        console.log("Below");
        console.log(lastDrawAction);
        if (lastDrawAction == 'btn_line') {
            lastPoint = arrayOfCartesianMarkupTool[arrayOfCartesianMarkupTool.length - 1]
            console.log(lastPoint);
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
        console.log(coorArr);
        // arrayOfCartesianMarkupTool = [];
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
// end

//~~~~~3d markup tools

function initReviewTools() {
  //catch camera orientation in json, send to joget
  reviewTools.orientationObj = {
    heading: viewer.camera.heading,
    pitch: viewer.camera.pitch,
    roll: viewer.camera.roll,
  };
  reviewTools.camPosition = viewer.camera.position; //in cartesian 3
  var sourceImageData = viewer.canvas.toDataURL("image/png");
  var canvasBase = document.getElementById("reviewCanvasImgBase");
  var canvasTop = document.getElementById("reviewCanvasImgTop");
  var parentDiv = $("#reviewContent .modal-container2");
  $("#reviewCanvasImgTop").css("cursor", "crosshair");
  canvasBase.width = parentDiv.width();
  canvasBase.height = parentDiv.height();
  canvasTop.width = parentDiv.width();
  canvasTop.height = parentDiv.height();
  var contextBase = canvasBase.getContext("2d");
  var contextTop = canvasTop.getContext("2d");

  var destinationImage = new Image();
  destinationImage.onload = function () {
    contextBase.drawImage(
      destinationImage,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      0,
      0,
      parentDiv.width(),
      parentDiv.height()
    );
  };
  destinationImage.src = sourceImageData;

  //setup color palette
  $("#reviewTool-color-picker").spectrum({
    showInput: true,
  });

  var clickX = [];
  var clickY = [];
  var clickDrag = [];
  var paint;

  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }

  function drawNew() {
    var i = clickX.length - 1;
    if (!clickDrag[i]) {
      if (clickX.length == 0) {
        contextTop.beginPath();
        contextTop.moveTo(clickX[i], clickY[i]);
        contextTop.stroke();
      } else {
        contextTop.closePath();

        contextTop.beginPath();
        contextTop.moveTo(clickX[i], clickY[i]);
        contextTop.stroke();
      }
    } else {
      contextTop.lineTo(clickX[i], clickY[i]);
      contextTop.stroke();
    }
  }

  function mouseDownEventHandler(e) {
    var drawSize = $("#reviewToolFontSize").val();
    var BB = canvasBase.getBoundingClientRect();
    var offsetX = BB.left;
    var offsetY = BB.top;
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);
    var pickedColor = $("#reviewTool-color-picker").val();

    if (reviewTools.drawMode == "draw") {
      contextTop.strokeStyle = pickedColor;
      contextTop.globalCompositeOperation = "source-over";
      contextTop.lineJoin = "round";
      contextTop.lineWidth = drawSize;
    } else if (reviewTools.drawMode == "erase") {
      contextTop.globalCompositeOperation = "destination-out";
      contextTop.lineWidth = drawSize;
    } else {
      //text mode
      //get point coordinate
      contextTop.globalCompositeOperation = "source-over";
      contextTop.fillStyle = pickedColor;
      console.log(pickedColor);
      placeText(mouseX, mouseY, drawSize);
      return;
    }

    paint = true;
    if (paint) {
      addClick(mouseX, mouseY, false);
      drawNew();
    }
  }

  function placeText(x, y, drawSize) {
    contextTop.textAlign = "center";
    contextTop.font = drawSize + "px Georgia";
    var text = $("#reviewToolText").val();
    contextTop.fillText(text, x, y);
  }

  function mouseUpEventHandler(e) {
    contextTop.closePath();
    paint = false;
  }

  function mouseMoveEventHandler(e) {
    var BB = canvasTop.getBoundingClientRect();
    var offsetX = BB.left;
    var offsetY = BB.top;
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);
    if (paint) {
      addClick(mouseX, mouseY, true);
      drawNew();
    }
  }

  function setUpHandler(detectEvent) {
    canvasTop.removeEventListener("mousedown", setUpHandler);
    canvasTop.addEventListener("mouseup", mouseUpEventHandler);
    canvasTop.addEventListener("mousemove", mouseMoveEventHandler);
    canvasTop.addEventListener("mousedown", mouseDownEventHandler);
    mouseDownEventHandler(detectEvent);
  }
  canvasTop.addEventListener("mousedown", setUpHandler);
}

function submitReviewCanvas() {
  if (!JOGETLINK) return

  var canvasMerge = document.createElement("CANVAS");
  var parentDiv = $("#reviewContent .modal-container2");
  canvasMerge.width = parentDiv.width();
  canvasMerge.height = parentDiv.height();

  var contextMerge = canvasMerge.getContext("2d");
  var canvasBase = document.getElementById("reviewCanvasImgBase");
  var canvasTop = document.getElementById("reviewCanvasImgTop");

  contextMerge.drawImage(canvasBase, 0, 0);
  contextMerge.drawImage(canvasTop, 0, 0);

  var dataURL = canvasMerge.toDataURL("image/png");
  var resURL = null;
  $.ajax({
    type: "POST",
    url: "backEnd/reviewerTools.php",
    dataType: "JSON",
    data: {
      functionName: "uploadScreenshot",
      imgBase64: dataURL,
    },
    success: function (obj) {
      resURL = obj.data;
      $("#reviewForm iframe").unbind("load");
        var url;
        var urlParam =
          "&orientation=" +
          reviewTools.orientationObj["heading"] +
          "," +
          reviewTools.orientationObj["pitch"] +
          "," +
          reviewTools.orientationObj["roll"] +
          "&coordinate=" +
          reviewTools.camPosition["x"] +
          "," +
          reviewTools.camPosition["y"] +
          "," +
          +reviewTools.camPosition["z"] +
          "&ImageFileName=" +
          resURL;
        
        if(JOGETLINK['cons_issue_markup']){
          url = JOGETLINK['cons_issue_markup'] + urlParam;
        }

        $("#reviewForm iframe")
          .attr("src", encodeURI(url))
          .css("height", "100%")
          .css("width", "100%")
          .css("border", "none");
        $('#reviewForm').css('display', 'block')
    },
  });
}

function getAllReviews() {
  var url = JOGETLINK['cons_datalist_markup'];

  changeAppWindowTitle("appWindow", "Review List");
  $("#appWindow iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%")
    .css("border", "none");
  jqwidgetBox("appWindow", 1);
  setCameraPosOrient();
}

function setCameraPosOrient() {
  if (reviewTools.listener === true) {
    return;
  } else {
    reviewTools.listener = true;
  }
  var eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
  // Listen to message from child window
  eventer(
    messageEvent,
    function (e) {
      var parsedData = JSON.parse(e.data);
      if (parsedData.orientation && parsedData.coordinate) {
        var coordinate = parsedData.coordinate.split(",");
        var orientation = parsedData.orientation.split(",");
        console.log({
          x: parseFloat(coordinate[0]),
          y: parseFloat(coordinate[1]),
          z: parseFloat(coordinate[2]),
        });
        viewer.camera.setView({
          destination: {
            x: parseFloat(coordinate[0]),
            y: parseFloat(coordinate[1]),
            z: parseFloat(coordinate[2]),
          },
          orientation: {
            heading: parseFloat(orientation[0]),
            pitch: parseFloat(orientation[1]),
            roll: parseFloat(orientation[2]),
          },
        });
      } else if (parsedData.imageName) {
        var imageUrl = encodeURI(
          "../Data/Projects/" +
            localStorage.p_id +
            "/" +
            parsedData.imageName +
            ".png"
        );
        window.open(imageUrl);
      }
    },
    false
  );
}

function reviewToolSwitchMode(mode){
  reviewTools.drawMode = mode

  if (mode == "erase"){
      $("#reviewCanvasImgTop").css("cursor", "url('Images/double-sided-eraser.png') 4 12, auto");
  }
  else{
      $("#reviewCanvasImgTop").css("cursor", "crosshair");

  }
}
