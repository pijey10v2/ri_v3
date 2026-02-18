var $jogetHost = JOGETHOST;
function IniatiateConOp(ele) {  //where overall list is loaded
  neutralImportExportButton();
  var processType = $(ele).attr("data");

  $(ele).parent().find(".active").removeClass("active");
  $(ele).addClass("active");
  
  if (!JOGETLINK) return
  else if (!jogetAppProcesses["app_" + processType]) {
    return;
  }

  resetJogetConOpDraw();
  jqwidgetBox("appWindow", false);
  //url is UserviewID+ "_" +  list ID in the userview
  $("#appWindow iframe").unbind("load");

  if(jogetAppProcesses["app_"+processType] === 1 && JOGETLINK['cons_datalist_'+processType]){
    var url = JOGETLINK['cons_datalist_'+processType];
  }

  $("#conopPage1 iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");

  zoomToGetData();
}

//function Hazirah create to open the form once the form completed/
//rejected/close
function openCloseForm(idForm, ele) {
  var windowsName = "";
  switch (ele) {
    case "MA":
      processType = "MS";
      windowsName = (localStorage.project_owner == 'JKR_SABAH') ? "Material Acceptance" : "Material Approval";
      break;
    case "MS":
      processType = "MOS";
      windowsName = "Method Statement"
      break;
    case "RFI":
      processType = "RFI";
      if(localStorage.project_owner == 'JKR_SABAH'){
        windowsName = "Request For Information Technical"
      }
      else{
        windowsName = "Request For Information"
      }
      break;
    case "IR":
      processType = "IR";
      windowsName = "Incident"
      break;
    case "WIR":
      processType = "WIR";
      if(localStorage.project_owner == 'JKR_SABAH'){
        windowsName = "Request For Inspection"
      }
      else{
        windowsName = "Work Inspection Request"
      }
      break;
    case "NCR":
      processType = "NCR";
      windowsName = "Non Conformance Report"
      break;
    case "RS":
      processType = "RS";
      windowsName = "Report Submission"
      break;
    case "SDL":
      processType = "SDL";
      windowsName = "Site Daily Log"
      break;
    case "SD":
      processType = "SD";
      windowsName = "Site Instruction"
      break;
    case "DCR":
      processType = "DCR";
      windowsName = "Design Change Request"
      break;
    case "NOI":
      if(localStorage.project_owner == 'JKR_SABAH'){
        windowsName = "Site Memo / Notice Of Improvement"
      }
      else{
        windowsName = "Notice Of Improvement"
      }
      processType = "NOI";
      break;
    case "PBC":
      processType = "PBC";
      windowsName = "Public Complaint"
      break;
    case "DA":
      processType = "DA";
      windowsName = "URW - Approved Design Drawing"
      break;
    case "PU":
      processType = "PU";
      windowsName = "URW - Progress Update"
      break;
    case "RSDL":
      processType = "RSDL";
      windowsName = "RET's Site Diary Log"
      break;
  }

  if (isParent && !JOGETLINK) {
    return;
  }
  else if (!jogetAppProcesses["app_" + processType]) {
    return;
  }
  
  //url is UserviewID+ "_" + ID based on the information passed
  $("#assignmentInbox iframe").unbind("load");

  if(jogetAppProcesses["app_"+processType] === 1 && JOGETLINK['cons_form_'+processType]){
    var url = JOGETLINK['cons_form_'+processType] + idForm;
  }

  jqwidgetBox("appWindow", 1);
  changeAppWindowTitle("appWindow", windowsName);
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  zoomToGetData();
}

function OnClickRiskUpload(){
    neutralImportExportButton()

    $(".tab.active").removeClass("active");
    $("#riskUploadTab").addClass("active");
    $("#conopPage1 iframe").attr("src", 'Dashboard/riskUpload.php').css("height", "100%").css("width", "100%");
    
    ConOpBrowser();
}

function InitAsgnmtBox(ele) {
  if (!JOGETLINK) return;
  let tabToActive = $(ele).attr("rel");
  $("#notiDrop").removeClass("active");
  $("#notiDrop").css("display", "none");

  $(ele).parent().find(".active").removeClass("active");
  $("#assignmentInbox").addClass("active");

  $("#" + tabToActive).addClass("active");

  $(".conopTab").removeClass("active");
  $(".page-container.active").css("display", "none");
  $(".page-container.active").removeClass("active");

  jqwidgetBox("assignments", 1);

  var processType = $(ele).attr("data");
  resetJogetConOpDraw();

  $("#assignmentInbox iframe").unbind("load");

  if(JOGETLINK['cons_datalist_inbox_'+processType]){
    var url = JOGETLINK['cons_datalist_inbox_'+processType];
  }

  $("#assignmentInbox iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");
  zoomToGetData();
}

function zoomToGetData() {
  if(conOpEventListener){
    return
  }
  conOpEventListener = true;
  var eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
  // Listen to message from child window
  eventer(
    messageEvent,
    function (e) {
      if (e.data.close){
        return;
      }
      var parsedData = JSON.parse(JSON.stringify(e.data));
      if (jogetConOpDraw.entity) {
        viewer.entities.remove(jogetConOpDraw.entity);
      }
      jogetConOpDraw.entity = drawConOpTempEntity(parsedData);
    },
    false
  );
}

function drawConOpTempEntity(obj) {
  if (!obj.coord) {
    console.log("No coordinate found.");
    return;
  }
  let coordArray = obj.coord.split(",");
  var drawnEntity;

  if (coordArray.length == 2) {
    //point
    drawnEntity = viewer.entities.add({
      name: entityName,
      position: Cesium.Cartesian3.fromDegrees(coordArray[0], coordArray[1], 0),
      billboard: {
        image: "Images/redPlaceholder.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        width: 30,
        height: 30,
      },
    });
  } else if (coordArray.length >= 6) {
    //polygon
    let hierarchyArray = Cesium.Cartesian3.fromDegreesArray(coordArray);
    drawnEntity = viewer.entities.add({
      polygon: {
        hierarchy: hierarchyArray,
        outline: true,
        height: 0,
        extrudedHeight: 0,
        material: Cesium.Color.BLUE,
      },
    });
  }
  //////####define array structure
  var entityName = "Point";
  var mydata =[], data =[];
  let desc = '<div class="projectDesc">';
  desc += "<table ><tbody >";
  Object.keys(obj).forEach((key) => {
    if (key == "ref") {
      drawnEntity.name = obj[key];
    } else if (key == "coord") {
      //skip
    } else if (typeof obj[key] == "object") {
      //skip
    } else if (key == "processId") {
      //skip
    } else if (key == "processName") {
      //skip
    } else if (key == "message") {
      //skip
    } else if (key == "function_name") {
      //skip
    } else if (key == "ElementID") {
      //skip
    }else if( key == "ASSET_ID"){
      mydata['asset_id'] = obj[key];
      desc += "<tr><th>ASSET ID</th><td>" + obj[key] + "</td></tr>";

    }else if (key == "ASSET_NAME") {
      mydata['asset_name'] = obj[key];
      drawnEntity.name = obj[key];
     desc += "<tr><th>ASSET NAME</th><td> " + obj[key] + "</td></tr>";

    }else if( key == "CULVERT_TYPE"){
      mydata['culvert_type'] = obj[key];
      desc += "<tr><th>CULVERT TYPE</th><td>" + obj[key] + "</td></tr>";

    }else if( key == "SLOPE_TYPE"){
      desc += "<tr><th>SLOPE TYPE</th><td>" + obj[key] + "</td></tr>";

    }else if( key == "ROAD_FURNITURE_TYPE"){
      mydata['road_furniture_type'] = obj[key];
      desc += "<tr><th>ROAD FURNITURE TYPE</th><td>" + obj[key] + "</td></tr>";

    }else if( key == "GUARDRAIL_TYPE"){
      mydata['guardrail_type']= obj[key];
      desc += "<tr><th>GUARDRAIL TYPE</th><td>" + obj[key] + "</td></tr>";
    }else if( key == "PAVEMENT_TYPE"){
      desc += "<tr><th>PAVEMENT TYPE</th><td>" + obj[key] + "</td></tr>";

    }else if( key == "DRAINAGE_TYPE"){
      mydata['drainage_type']= obj[key];
      desc += "<tr><th>DRAINAGE TYPE</th><td>" + obj[key] + "</td></tr>";

    }else if( key == "BRIDGE_TYPE"){
      mydata['bridge_type'] = obj[key];
      desc += "<tr><th>BRIDGE TYPE</th><td>" + obj[key] + "</td></tr>";

    }else if( key == "ASSET_STATUS"){
      mydata['asset_status'] = obj[key];
     desc += "<tr><th>ASSET STATUS</th><td>" + obj[key] + "</td></tr>";

     }else if( key == "ASSET_POSITION"){
      mydata['asset_position'] = obj[key];
      desc += "<tr><th>ASSET POSITION</th><td>" + obj[key] + "</td></tr>";
 
     }else if( key == "ASSET_CATEGORY"){
      mydata['asset_category'] = obj[key];
      desc += "<tr><th>ASSET CATEGORY</th><td>" + obj[key] + "</td></tr>";
 
     }else if( key == "NOTE"){
      mydata['notes'] = obj[key];
      desc += "<tr><th>NOTE</th><td>" + obj[key] + "</td></tr>";
 
     }else if( key == "CHAINAGE_START"){
      mydata['chainage_start'] = obj[key];
      desc += "<tr><th>CHAINAGE START</th><td>" + obj[key] + "</td></tr>";
 
     }else if( key == "CHAINAGE_END"){
      mydata['chainage_end'] = obj[key];
      desc += "<tr><th>CHAINAGE END</th><td>" + obj[key] + "</td></tr>";
 
     }else {
       desc += "<tr><th>" + key + "</th><td>" + obj[key] + "</td></tr>";
    }
  });
  desc += "</tbody></table></div>";
  var ddata = [];
  ddata.push(mydata);
  data['data']= ddata;
  assetDataAPI.splice(0, assetDataAPI.length, data)
  drawnEntity.description = desc;
  setTimeout(function () {
    movePosition = {
      y: null,
      x: null,
    };
    movePosition.x = window.innerWidth / 2;
    movePosition.y = window.innerHeight / 2;
    $("#floatbox-tabs")
      .children()
      .each(function () {
        if (!$(this).is(":contains('Info')")) {
          $(this).hide();
        }
      });
    floatboxTurnON(drawnEntity.name, desc);
  }, 3000);
  viewer.flyTo(drawnEntity);
  return drawnEntity;
}

function resetJogetConOpDraw() {
  hideinstruction();
  instructions("");
  document.getElementsByTagName("body")[0].style.cursor = "default";
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
    jogetConOpDraw.entity = null;
  }
  if (jogetConOpDraw.billboardEntities) {
    jogetConOpDraw.billboardEntities.forEach(function (entity) {
      viewer.entities.remove(entity);
    });
    jogetConOpDraw.billboardEntities = [];
  }

  jogetConOpDraw.processName = null;
  jogetConOpDraw.flag = false;
  jogetConOpDraw.shape = null;
  jogetConOpDraw.coordsArray = [];
  jogetConOpDraw.hierarchyArray = [];
  jogetConOpDraw.coordsRad = [];
  jogetConOpDraw.loadedFreq = null;
  flagLandBoth = false;
  flagLinkLand = false;
  if(pickedLot && pickedLot._polygon && pickedLot._polygon.material){
    pickedLot._polygon.material = new Cesium.Color(polyLotRed, polyLotGreen, polyLotBlue, polyLotAlpha);
  }
  else if(shpPickedLot){
    ChangeWMSTile();
  }

  shpLotId = "";
  lot = "";
  chainage = "";
  struct = "";
  fileLandName = "";
  msgLand = "";
  chainage = "";
  struct = "";

  console.log("Reset");
}

function ConOpViewWholeList(ele) {
  let processName = $(ele).val();
  var polygonProcess = "";
  switch (processName) {
    case "NOI":
      colourProcess = "Images/icons/layerProcess/pointNCR.png"
			polygonProcess = Cesium.Color.ORANGERED
      break;
    case "NCR":
      colourProcess = "Images/icons/layerProcess/pointNCR.png"
			polygonProcess = Cesium.Color.ORANGERED
      break;
    case "WIR":
      colourProcess = "Images/icons/layerProcess/pointWIR.png"
			polygonProcess = Cesium.Color.LIME
      break;
    case "MS":
      colourProcess = "Images/icons/layerProcess/pointMS.png"
			polygonProcess = Cesium.Color.BLUE
      break;
    case "RS":
      colourProcess = "Images/icons/layerProcess/pointRS.png"
			polygonProcess = Cesium.Color.DARKGOLDENROD
      break;
    case "DCR":
      colourProcess = "Images/icons/layerProcess/pointRS.png"
      polygonProcess = Cesium.Color.DARKGOLDENROD
      break;
    case "RFI":
      colourProcess = "Images/icons/layerProcess/pointRFI.png"
			polygonProcess = Cesium.Color.GOLD
      break;
    case "IR":
      colourProcess = "Images/icons/layerProcess/pointIR.png"
			polygonProcess = Cesium.Color.HOTPINK
      break;
    case "MOS":
      colourProcess = "Images/icons/layerProcess/pointMOS.png"
			polygonProcess = Cesium.Color.AQUA
      break;
    case "SD":
      colourProcess = "Images/icons/layerProcess/pointSD.png"
			polygonProcess = Cesium.Color.DARKSALMON
      break;
    case "SDL":
      colourProcess = "Images/icons/layerProcess/pointSDL.png"
			polygonProcess = Cesium.Color.DARKORCHID
      break;
    case "PBC":
      colourProcess = "Images/icons/layerProcess/pointRS.png"
      polygonProcess = Cesium.Color.DARKGOLDENROD
      break;
    case "SP" :
      colourProcess = "Images/icons/layerProcess/pointIR.png"
			polygonProcess = Cesium.Color.HOTPINK
      break;
    case "DA":
      colourProcess = "Images/icons/layerProcess/pointSDL.png"
      polygonProcess = Cesium.Color.DARKORCHID
      break;
    default:
      colourProcess = "Images/icons/layerProcess/pointMS.png"
			polygonProcess = Cesium.Color.BLUE
      break;
  }
  if ($(ele).is(":checked")) {
    //load relevant data from api
    $.ajax({
      type: "POST",
      url: "BackEnd/joget.php",
      dataType: "json",
      data: {
        functionName: "getJogetProcessRecords",
        processName: processName,
      },
      success: function (obj) {
        if (obj.message) {
          $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "No record found.",
          });
          return;
        }
        obj.data.forEach(function (item) {
          if(processName == "SP"){
            // let drawnEntity;
            // let refID =item.ref_no;
            if(item["longitude"] != "" || item["latitude"] !=""){
              let long = parseFloat(item["longitude"]);
              let lat = parseFloat( item["latitude"]);
              let chainage = item["chainage"].split(" ");
              let chainageString = "CH "+ (parseInt(chainage[1])- 49)+ " - " + (parseInt(chainage[1]) + 50);
             //point
              drawnEntity = viewer.entities.add({
                name: "Site Photo at " + chainageString,
                position: Cesium.Cartesian3.fromDegrees(
                long,
                lat,
                  0
                ),
                billboard: {
                  image: colourProcess,
                  horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  width: 30,
                  height: 30,
                },
              });

              let desc = '<div class="projectDesc">';
              desc += "<table ><tbody >";
              desc += "<tr><td> Longitude : " + long;
              desc += "<tr><td> Latitude : " + lat;

              let data = item.info.split(",");
             
              let mystring = "";
              for(var i=0; i <data.length; i++){
                let mydata = data[i].split("::");
                mystring += "<tr><td> Ref No : " + mydata[0] + "</td></tr>";
                mystring += "<tr><td> Title : " + mydata[1] + "</td></tr>";
                mystring += "<tr><td> Chainage : " + mydata[4] + "</td></tr>";
              
                let string = $jogetHost+ "jw/web/client/app/document_mgmt/latest/form/download/sitePhoto/"+mydata[3] +"/"+ encodeURI(mydata[2]) + ".";
                mystring += "<tr><td> Photo : <a target= _blank  href="+string+">"+ mydata[2] +"</a></td></tr>";
                mystring += "<tr><td> </td></tr>";
              }
              desc += mystring;
              desc += "</tbody></table></div>";
              drawnEntity.description = desc;
              jogetConOpEntities[processName].push(drawnEntity);
            }
           

          }else{
            let coordsArray = item.coordinates;
            if (coordsArray !== "") {
              coordsArray = coordsArray.split(",");
              let refID =
                item.c_ref_no ||
                item.ref_no ||
                item.ReferenceID ||
                item.RefNo ||
                item.ReferenceNo ||
                item.NCR ||
                item.WIRRefNo;
              let drawnEntity;
              if (coordsArray.length == 2) {
                //point
                drawnEntity = viewer.entities.add({
                  name: processName + "-" + refID,
                  position: Cesium.Cartesian3.fromDegrees(
                    coordsArray[0],
                    coordsArray[1],
                    0
                  ),
                  billboard: {
                    image: colourProcess,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    width: 30,
                    height: 30,
                  },
                });
              } else if (coordsArray.length >= 6) {
                //polygon
                let hierarchyArray = Cesium.Cartesian3.fromDegreesArray(
                  coordsArray
                );
                drawnEntity = viewer.entities.add({
                  name: processName + "-" + refID,
                  polygon: {
                    hierarchy: hierarchyArray,
                    outline: true,
                    height: 0,
                    extrudedHeight: 0,
                    material: polygonProcess,
                  },
                });
              } else {
                return;
              }

              let desc = '<div class="projectDesc">';
              desc += "<table ><tbody >";
              Object.keys(item).forEach((key) => {
                if (
                  key == "ReferenceID" ||
                  key == "RefNo" ||
                  key == "ReferenceNo" ||
                  key == "NCR" ||
                  key == "WIRRefNo"
                ) {
                } else if (key == "coordinates") {
                  //skip
                } else if (key == "processId") {
                  //skip
                } else if (key == "processName") {
                  //skip
                } else if (key == "message") {
                  //skip
                } else {
                  desc += "<tr><td>" + key + ": " + item[key] + "</td></tr>";
                }
              });
              desc += "</tbody></table></div>";
              drawnEntity.description = desc;
              jogetConOpEntities[processName].push(drawnEntity);
              
            }
          }
        });
      },
    });
  } else {
    jogetConOpEntities[processName].forEach(function (entity) {
      viewer.entities.remove(entity);
    });
    jogetConOpEntities[processName] = [];
  }
}

function OnLoadNotiCount() {
  if(localStorage.Project_type == 'ASSET')  return;
  $.ajax({
    type: "POST",
    url: "BackEnd/jogetConstruct.php",
    dataType: "json",
    data: {
      functionName: "getListOfNotification",
    },
    success: function (obj, textstatus) {
      $("#notiCount").text(obj["total"]);
      document.getElementById("notiDrop").innerHTML = "";
      let i = 0;
      while (i < 5) {
        if (i < obj["total"]) {
          let concat =
            '<button class="notiitems" rel="rfi" onclick="getCoordinate(`' +
            obj.data[i]["processId"] +
            "`,`" +
            obj.data[i]["activityId"] +
            "`,`" +
            obj.data[i]["processName"] +
            '`);"><b>' +
            obj.data[i]["label"] +
            "</b><br>" +
            obj.data[i]["processApp"] + ": " + obj.data[i]["Ref"] +
            "</button><br>";
          document.getElementById("notiDrop").innerHTML =
            document.getElementById("notiDrop").innerHTML + concat;
        } else {
          break;
        }
        i++;
      }

      let concat =
        '<button class="notiitems" data="NCR" rel="assTab1" onclick="InitAsgnmtBox(this);" ><br>View all assignments</button><br>';
      document.getElementById("notiDrop").innerHTML =
        document.getElementById("notiDrop").innerHTML + concat;
    },
  });
}

function getCoordinate(processId, activityId, processAppName) {
  floatboxTurnOFF();
  jqwidgetBox("appWindow", false);
  $("#notiDrop").removeClass("active");
  $("#notiDrop").css("display", "none");
  openFormNoti(activityId);
  resetJogetConOpDraw();

  $.ajax({
    type: "POST",
    url: "BackEnd/joget.php",
    dataType: "json",
    data: {
      functionName: "getCoordinate",
      processId: processId,
    },
    success: function (obj) {
      let processNameBefore = processId.split("_");
      let processNameAfter = processNameBefore[3];
      switch (processNameAfter) {
        case "ma":
          changeAppWindowTitle("appWindow", (localStorage.project_owner == 'JKR_SABAH') ? "Material Acceptance" : "Material Approval");
          break;
        case "ms":
          changeAppWindowTitle("appWindow", "Method Statement");
          break;
        case "rfi":
          if(localStorage.project_owner == 'JKR_SABAH'){
            changeAppWindowTitle("appWindow", "Request For Inspection");
          }else{
            changeAppWindowTitle("appWindow", "Request For Information");
          }
          break;
        case "rfit":
            changeAppWindowTitle("appWindow", "Request For Information Technical");
          break;
        case "inc":
          changeAppWindowTitle("appWindow", "Incident");
          break;
        case "wir":
          if(localStorage.project_owner == 'JKR_SABAH'){
            changeAppWindowTitle("appWindow", "Request For Inspection");
          }
          else{
            changeAppWindowTitle("appWindow", "Work Inspection Request");
          }
          break;
        case "ncr":
          changeAppWindowTitle("appWindow", "Non Conformance Report");
          break;
        case "rs":
          changeAppWindowTitle("appWindow", "Report Submission");
          break;
        case "dcr":
          changeAppWindowTitle("appWindow", "Design Change Request");
          break;
        case "noi":
          if(localStorage.project_owner == 'JKR_SABAH'){
            changeAppWindowTitle("appWindow", "Site Memo / Notice Of Improvement");
          }
          else{
            changeAppWindowTitle("appWindow", "Notice Of Improvement");
          }
          break;
        case "pubc":
          changeAppWindowTitle("appWindow", "Public Complaint");
          break;
        case "sdl":
          changeAppWindowTitle("appWindow", "Site Daily Log");
          break;
        case "sd":
          if(localStorage.project_owner == 'JKR_SABAH'){
            changeAppWindowTitle("appWindow", "Site Instruction");
          }
          else{
            changeAppWindowTitle("appWindow", "Site Direction");
          }
          break;
        case "rsdl":
          changeAppWindowTitle("appWindow", "RET's Site Diary Log (RSDL)");
          break;
        default:
          changeAppWindowTitle("appWindow", processAppName);
          break;
      }
      jqwidgetBox("appWindow", 1);
      if (obj.status == false){
        return;
      }
      else {
        if (!obj.data.c_coordinates) {
          console.log("No coordinate found.");
          return;
        }
        let coordArray = obj.data.c_coordinates;
        coordArray = coordArray.split(",");
        var drawnEntity;
        //////####define array structure
        if (coordArray.length == 2) {
          //point
          drawnEntity = viewer.entities.add({
            name: "Point",
            position: Cesium.Cartesian3.fromDegrees(
              coordArray[0],
              coordArray[1],
              0
            ),
            billboard: {
              image: "Images/redPlaceholder.png",
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              width: 30,
              height: 30,
            },
          });
        } else if (coordArray.length >= 6) {
          //polygon
          let hierarchyArray = Cesium.Cartesian3.fromDegreesArray(coordArray);
          drawnEntity = viewer.entities.add({
            polygon: {
              hierarchy: hierarchyArray,
              outline: true,
              height: 0,
              extrudedHeight: 0,
              material: Cesium.Color.BLUE,
            },
          });
        }
        jogetConOpDraw.entity = drawnEntity;
        jogetConOpDraw.flag = true;
  
        let desc = '<div class="projectDesc">';
        desc += "<table ><tbody >";
        Object.keys(obj.data).forEach((key) => {
          if (key == "ReferenceID") {
            drawnEntity.name = obj[key];
          } else if (key == "c_coordinates") {
            //skip
          } else if (key == "createdByName"){
            desc += "<tr><td>" + key + ": " + obj.data[key] + "</td></tr>";
          } else if (key == "dateCreated") {
            desc += "<tr><td>" + key + ": " + obj.data[key] + "</td></tr>";
          } else if (key == "dateModified") {
            desc += "<tr><td>" + key + ": " + obj.data[key] + "</td></tr>";
          } else if (key == "modifiedByName") {
            desc += "<tr><td>" + key + ": " + obj.data[key] + "</td></tr>";
          } else if (key == "c_ref_no") {
            desc += "<tr><td>ref: " + obj.data[key] + "</td></tr>";
          } else if (key == "c_subject") {
            desc += "<tr><td>subject: " + obj.data[key] + "</td></tr>";
          }
        });
  
        desc += "</tbody></table></div>";
        drawnEntity.description = desc;
        setTimeout(function () {
          movePosition = {
            y: null,
            x: null,
          };
          movePosition.x = window.innerWidth / 2;
          movePosition.y = window.innerHeight / 2;
          $("#floatbox-tabs")
            .children()
            .each(function () {
              if (!$(this).is(":contains('Info')")) {
                $(this).hide();
              }
            });
          floatboxTurnON(drawnEntity.name, desc);
        }, 3000);
        viewer.flyTo(drawnEntity);
      }
    },
  });
}

function openFormNoti(activityId) {
  if (!JOGETLINK) return

  //need update
  conOpData.loadedFreq = 0;
  var urlInbox;
  if(JOGETLINK['cons_json_open_inbox']){
    urlInbox = JOGETLINK['cons_json_open_inbox'];
  }
  let url = urlInbox + "_mode=assignment&activityId=" + activityId;
  $("#appWindow iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");
  $("#appWindow iframe").unbind("load");
  $("#appWindow iframe").on("load", function () {
    //#### reset jogetConOpDraw
    conOpData.loadedFreq++;
    if (conOpData.loadedFreq > 1) {
      OnLoadNotiCount();
      conOpData.loadedFreq = 0;
    }
  });
}

function processLinkParam(urlName, varArr){
  if (!JOGETLINK || !JOGETLINK[urlName]) return false;
  var rawUrl =  JOGETLINK[urlName];
  if (varArr) {
    for (const [idx, ele] of Object.entries(varArr)) {
       rawUrl = rawUrl.replace("{?}", ele);
    }
  }
  return rawUrl;
}

function openConOpDashboard(tabId, processType, page, url, appWinTitle = false){

  $("#dashboardform").css('z-index', '1');

  // parent will open normal window instead of conOp
  if(isParent !== undefined && isParent !== null){
    jqwidgetBox("appWindow", false);
		$("#appWindow iframe").unbind("load")
    $("#appWindow iframe").attr("src", url)
					.css("height", "100%")
					.css("width", "100%");
    changeAppWindowTitle("appWindow", (appWinTitle) ? appWinTitle : 'Process');
		jqwidgetBox("appWindow", 1);
  }else{
    $("#assetMaintenance-button").click();
    $('.tab').removeClass('active');
    jqwidgetBox("appWindow", false);
    $("#appWindow iframe").unbind("load");
    _assetMtnTabToggle(page)
    if($('#'+tabId)) $('#'+tabId).addClass('active');
    if($("#"+page).length != 0) $("#"+page+" iframe").attr("src", url);

  }
}

/////function neutral conop Import/Export button/////
function neutralImportExportButton(){
  $("#importConop").removeClass("active");
  $("#bulkdownloadConop").removeClass("active");
  $(".tab.active").removeClass("active");
  $(".importProcessHeader").css("display", "none");
}

function onClickImportSetting(){
  var conopHeight = $("#conopbrowser").height();
  var tabHeight = $("#conopbrowser #tabConop").height();
  var settingHeight = $(".importProcessHeader").height();
  var totalHeight = settingHeight + tabHeight;
  var contentHeight = conopHeight - totalHeight;

  if(!$("#bulkImportSetting").hasClass("active")){
      $("#bulkImportSetting").addClass("active");
      $("#bulkImportConfig").css({
          'display': 'block',
          'z-index': '10'
      });
  }
  $("#bulkimportCloseButton").on("click", function () {
      $("#bulkImportSetting").removeClass("active");
      $("#contentConop").css("height", contentHeight);
  })
}

function onClickImportTool(){
  var conopHeight = $("#conopbrowser").height();
  var tabHeight = $("#conopbrowser #tabConop").height();
  var settingHeight = $(".importProcessHeader").height();
  var totalHeight = settingHeight + tabHeight;
  var contentHeight = conopHeight - totalHeight;

  if(!$("#importConop").hasClass("active")){
      IniatiateConOp();
      $("#importConop").addClass("active");
      $(".importProcessHeader").css("display", "block");
      $("#contentConop").css("height", contentHeight);
      $("#conopPage1").html('<iframe type="text/html" allow="fullscreen" src="Components/bulkImport/import.php"></iframe>');
  } else {
      $("#contentConop").css("height", contentHeight);
      $(".importProcessHeader").css("display", "block");
      $("#conopPage1").html('<iframe type="text/html" allow="fullscreen" src="Components/bulkImport/import.php"></iframe>');
  }
}

function onClickBulkDownloadTool(){
  if(!$("#bulkdownloadConop").hasClass("active")){
      neutralImportExportButton();
      $("#bulkdownloadConop").addClass("active");
      $("#conopPage1").html('<iframe type="text/html" allow="fullscreen" src="Components/bulkImport/bulkDownload.php"></iframe>');
  } else{
      $("#conopPage1").html('<iframe type="text/html" allow="fullscreen" src="Components/bulkImport/bulkDownload.php"></iframe>');
  }
}

if (localStorage.isParent !== undefined && localStorage.Project_type == 'CONSTRUCT') {
  //|| no project links
  OnLoadNotiCount();
}

window.addEventListener("message", (event) => {
  // if (event.origin !=="https://jogetk.reveronconsulting.com")
  //   return;

  // event with reference id
  if (event.data.eventType && event.data.eventType == "submitForm" && event.data.processName && event.data.refId) {
     var contentMsg;
    if (event.data.processName == "Land Registration" || event.data.processName == "Land Issue Register" || event.data.processName == "Land Encumbrances Registration"){
      contentMsg = event.data.processName + " <b>" + event.data.refId + "</b> successfully submitted!";
    }else if (event.data.processName == "SA" ){
      contentMsg =  "You have submitted the Safety Activity data successfully (<b>" + event.data.refId + "</b>).";
    }else if (event.data.processName == "SMH" ){
      contentMsg =  "You have submitted the Total Man-Hours data successfully (<b>" + event.data.refId + "</b>).";
    }
    else{
      contentMsg = event.data.processName + " process <b>" + event.data.refId + "</b> successfully submitted!";
    }
    
    $.alert({
      boxWidth: '30%',
      useBootstrap: false,
      title: 'Success!',
      content: contentMsg
    });
  }

  if (event.data.processName == "BP" && event.data.refId){
    var contentMsg;
    if(event.data.eventType == "new"){
      contentMsg =  "This consortium <b>" + event.data.refId + "</b> has been successfully registered";
    }else if(event.data.eventType == "update"){
      contentMsg =  "This consortium <b>" + event.data.refId + "</b> has been successfully updated";
    }
    $.alert({
      boxWidth: '30%',
      useBootstrap: false,
      title: 'Success!',
      content: contentMsg
    });
  }

  if (event.data.eventType && event.data.eventType == "approvalForm") {
    var contextMsg = (event.data.refId) ? "Process <b>" + event.data.refId + "</b> successfully updated!" : "Process successfully updated!";
    $.alert({
      boxWidth: '30%',
      useBootstrap: false,
      title: 'Success!',
      content: contextMsg
    });
  }

  if(event.data.close){
      jqwidgetBox("appWindow", false);
      if( localStorage.Project_type == 'CONSTRUCT') OnLoadNotiCount();
      else OnLoadAssetNotiCount();
      conOpData.loadedFreq = 0;
      resetJogetConOpDraw(); 
  }

  if(event.data.process == "Bumi"){
    flyToEntity(event.data.kmlName, event.data.coord)
  }

  // added to trigger update noti and 5 time every 2 second
  var updCnt = 0;
  var updInt = setInterval(function(){ 
    if( localStorage.Project_type == 'CONSTRUCT') OnLoadNotiCount();
    else OnLoadAssetNotiCount();
    updCnt ++;
    if(updCnt == 5){
      clearInterval(updInt);
    }    
  }, 2000);

  if(event.origin === window.origin){
    if(event.data.function == 'openConOpDashboard'){
      var linkUrl = processLinkParam(event.data.linkName, event.data.linkParam);
      if(linkUrl){
        var linkWinTitle = (event.data.linkWinTitle) ? event.data.linkWinTitle : '';
        openConOpDashboard(event.data.conOpTabId, event.data.processType, event.data.iframeId,  linkUrl, linkWinTitle);
      }
    }
  }

}, false);