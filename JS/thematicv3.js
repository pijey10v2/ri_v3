var originalColorLot = [];
async function updateThematicv3() {
    await removeThemev3()
    pipeAttr = $("#pipeAttr option:selected").val()

    
    if(localStorage.Project_type == 'ASSET'){
      //get the selected layer
      layer = $("#thematicLayer option:selected").val();
      if(!layer) {
          $.alert({
              boxWidth: '30%',
              useBootstrap: false,
              title: 'Message',
              content: "No KML data is loaded. Please load kml and then select the layer to apply the thematics."
          });
          return;
      }

      var ind = (tilesetlist.findIndex(x => x.id === layer));
      delete thematicProps.roadAsset;
      var tileset = tilesetlist[ind].tileset;

      if (Object.prototype.toString.call(tileset) === "[object Promise]") { //resolve promise
          await tileset.then(async (result) => {
              thematicProps.roadAsset = result.entities.values.filter((entity) => {
                  if (!entity._kml.extendedData) return
                  //return match value and filter out entities without shape (non graphics)
                  return entity._kml.extendedData;
              })
          })
      }
    }
  
    var legendsTable = legendsTable = document.getElementById("pipeLegends")
    $(".header").show();

    switch (pipeAttr) {
        case "LAA":
            if (!thematicProps.landEntities) {
                return;
            }
            $.ajax({
                type: "POST",
                url: '../BackEnd/fetchDatav3.php',
                dataType: 'json',
                data: {
                    functionName: 'getLandList',
                    list: "landRegistration"
                },
                success: function (obj, textstatus) {
                    if (!obj.data) return;
                    thematicProps.landEntities.forEach((entity) => {
                        if (!entity._kml.extendedData || !entity._polygon) {
                            return;
                        };
                        if (entity._kml.extendedData.LOT.value !== undefined && !entity._polygon){
                            return;
                        };
                        if(entity && entity._polygon && entity._polygon.material && entity._polygon.material._color && entity._polygon.material._color._value){
                            var red = (entity._polygon.material._color._value.red) ? entity._polygon.material._color._value.red : 0;
                            var green = (entity._polygon.material._color._value.green) ? entity._polygon.material._color._value.green : 0;
                            var blue = (entity._polygon.material._color._value.blue) ? entity._polygon.material._color._value.blue : 0;
                            var alpha = (entity._polygon.material._color._value.alpha) ? entity._polygon.material._color._value.alpha : 0;
                            
                            originalColorLot = [
                                red, 
                                green, 
                                blue, 
                                alpha
                            ];
                        };
                        for(let i = 0; i<obj.data.length; i++){
                            let item = obj.data[i]
                            if (!item.lotId || item.lotId == undefined) {
                                continue; 
                            }       
                            else if (entity._kml.extendedData.LOT.value === item.lotId) {
                                entity._polygon.material = new Cesium.Color(0, 1, 0, 0.7)
                                return;
                            }
                            else if (entity._kml.extendedData.LOT.value !== undefined && entity._polygon && entity._kml.extendedData.LOT.value !== item.lotId) {
                                if (localStorage.project_owner == "SSLR2") {
                                    entity._polygon.material = new Cesium.Color(1, 0, 0, 0)
                                } else {
                                    entity._polygon.material = new Cesium.Color(1, 0, 0, 0.7)
                                }
                            }
                        };
                    });
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr, errorThrown);
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Error',
                        content: textStatus
                    });
                }
            });
            legendsTable.innerHTML = "<tr><td style='background-color:rgb(10%, 95%, 3%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Acquired Land</td></tr>"
            if (localStorage.project_owner != "SSLR2") {
                legendsTable.innerHTML += "<tr><td style='background-color:rgb(90%, 5%, 5%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Non-acquired Land</td></tr>"
            }
            break;
        case "LT":
            if (!thematicProps.landEntities) {
                return
            }
            thematicProps.landEntities.forEach(function (entity) {
                if (entity._kml.extendedData !== undefined && entity._polygon) {
                    if(entity && entity._polygon && entity._polygon.material && entity._polygon.material._color && entity._polygon.material._color._value){
                        var red = (entity._polygon.material._color._value.red) ? entity._polygon.material._color._value.red : 0;
                        var green = (entity._polygon.material._color._value.green) ? entity._polygon.material._color._value.green : 0;
                        var blue = (entity._polygon.material._color._value.blue) ? entity._polygon.material._color._value.blue : 0;
                        var alpha = (entity._polygon.material._color._value.alpha) ? entity._polygon.material._color._value.alpha : 0;
                        
                        originalColorLot = [
                            red, 
                            green, 
                            blue, 
                            alpha
                        ];
                    };
                    switch (entity._kml.extendedData.STRUCTURE_.value.toUpperCase()) {
                        case "MILITARY":
                          entity._polygon.material = new Cesium.Color(1, 0, 0, 1);
                          break;
                        case "ANIMAL KEEPING":
                          entity._polygon.material = new Cesium.Color(0.44, 1, 0.72, 1);
                          break;
                        case "EDUCATIONAL":
                          entity._polygon.material = new Cesium.Color(1, 0.5, 0.5, 1);
                          break;
                        case "HEALTH CENTER":
                          entity._polygon.material = new Cesium.Color(1, 0.63, 0.63, 1);
                          break;
                        case "AGRICULTURE":
                          entity._polygon.material = new Cesium.Color(0.69, 1, 0.69, 1);
                          break;
                        case "BROWNFIELD":
                          entity._polygon.material = new Cesium.Color(0.19, 0.46, 1, 1);
                          break;
                        case "COMMERCIAL":
                          entity._polygon.material = new Cesium.Color(0.65, 0.31, 1, 1);
                          break;
                        case "RETAIL":
                          entity._polygon.material = new Cesium.Color(1, 0.89, 0.88, 1);
                          break;
                        case "RELIGIOUS":
                          entity._polygon.material = new Cesium.Color(1, 0.8, 0.6, 1);
                          break;
                        case "RESIDENTIAL":
                          entity._polygon.material = new Cesium.Color(1, 0.5, 0, 1);
                          break;
                        case "BASIN":
                          entity._polygon.material = new Cesium.Color(0.68, 0.85, 0.9, 1);
                          break;
                        case "CEMETERY":
                          entity._polygon.material = new Cesium.Color(0.85, 0.85, 0.85, 1);
                          break;
                        case "LANDFILL":
                          entity._polygon.material = new Cesium.Color(0.74, 0.72, 0.42, 1);
                          break;
                        case "RESERVOIR":
                          entity._polygon.material = new Cesium.Color(0.69, 0.88, 0.9, 1);
                          break;
                        case "PORT":
                          entity._polygon.material = new Cesium.Color(1, 1, 0, 1);
                          break;
                        case "GARAGES":
                          entity._polygon.material = new Cesium.Color(0.86, 0.86, 0.86, 1);
                          break;
                        case "ALLOTMENTS":
                          entity._polygon.material = new Cesium.Color(0.94, 1, 0.94, 1);
                          break;
                        case "GRASS":
                          entity._polygon.material = new Cesium.Color(0.63, 0.63, 0, 1);
                          break;
                        case "VILLAGE GREEN":
                          entity._polygon.material = new Cesium.Color(0.6, 0.98, 0.6, 1);
                          break;
                        case "RECREATION GROUND":
                          entity._polygon.material = new Cesium.Color(0.96, 1, 0.98, 1);
                          break;
                        case "SALT POND":
                          entity._polygon.material = new Cesium.Color(0.53, 0.81, 0.92, 1);
                          break;
                        case "QUARRY":
                          entity._polygon.material = new Cesium.Color(0.66, 0.66, 0.66, 1);
                          break;
                        case "FOREST":
                          entity._polygon.material = new Cesium.Color(0.33, 0.51, 0.21, 1);
                          break;
                        case "AQUACULTURE":
                          entity._polygon.material = new Cesium.Color(0.2, 0.8, 0.8, 1);
                          break;
                        case "GREENHOUSE":
                          entity._polygon.material = new Cesium.Color(0.96, 0.96, 0.96, 1);
                          break;
                        case "FARMYARD":
                          entity._polygon.material = new Cesium.Color(0.98, 0.92, 0.56, 1);
                          break;
                        case "ORCHARD":
                          entity._polygon.material = new Cesium.Color(0.56, 0.93, 0.56, 1);
                          break;
                        case "FARMLAND":
                          entity._polygon.material = new Cesium.Color(0.97, 0.97, 1, 1);
                          break;
                        case "ABANDONED LAND":
                          entity._polygon.material = new Cesium.Color(0.3, 0.74, 0, 1);
                          break;
                        case "BARE LAND":
                          entity._polygon.material = new Cesium.Color(0.71, 1, 0.25, 1);
                          break;
                        case "DESERT":
                          entity._polygon.material = new Cesium.Color(1, 0.39, 0.28, 1);
                          break;
                        case "INDUSTRIAL":
                          entity._polygon.material = new Cesium.Color(0.65, 0.31, 1, 1);
                          break;
                        default:
                          break;
                    }
                    legendsTable.innerHTML = "<tr><td style='background-color:rgba(100%, 0%, 0%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>MILITARY</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(44%, 100%, 72%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>ANIMAL KEEPING</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(100%, 50%, 50%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>EDUCATIONAL</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(100%, 63%, 63%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>HEALTH CENTER</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(69%, 100%, 69%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>AGRICULTURE</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(75%, 75%, 75%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>BROWNFIELD</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(19%, 46%, 100%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>COMMERCIAL</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(65%, 31%, 100%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>INDUSTRIAL</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(100%, 89%, 88%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>RETAIL</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(100%, 80%, 60%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>RELIGIOUS</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(100%, 50%, 0%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>RESIDENTIAL</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(68%, 85%, 90%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>BASIN</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(85%, 85%, 85%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>CEMETERY</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(74%, 72%, 42%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>LANDFILL</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(69%, 88%, 90%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>RESERVOIR</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(100%, 100%, 0%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>PORT</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(86%, 86%, 86%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>GARAGES</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(94%, 100%, 94%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>ALLOTMENTS</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(63%, 63%, 0%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>GRASS</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(60%, 98%, 60%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>VILLAGE GREEN</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(96%, 100%, 98%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>RECREATION GROUND</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(53%, 81%, 92%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>SALT POND</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(66%, 66%, 66%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>QUARRY</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(33%, 51%, 21%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>FOREST</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(20%, 80%, 80%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>AQUACULTURE</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(96%, 96%, 96%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>GREENHOUSE</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(98%, 92%, 56%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>FARMYARD</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(56%, 93%, 56%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>ORCHARD</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(97%, 97%, 100%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>FARMLAND</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(30%, 74%, 0%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>ABANDONED LAND</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(71%, 100%, 25%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>BARE LAND</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgba(100%, 39%, 28%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>DESERT GROUND</td></tr>"
                }
            })
            break;
        case "LS":
            if (!thematicProps.landEntities) {
                return;
            }
            $.ajax({
                type: "POST",
                url: '../BackEnd/fetchDatav3.php',
                dataType: 'JSON',
                data: {
                    functionName: 'getLandList',
                    list: "landIssue"
                },
                success: function (obj, textstatus) {
                    if (!obj.data) return;
                    thematicProps.landEntities.forEach((entity) => {
                        if (!entity._kml.extendedData || !entity._polygon) {
                            return;
                        }
                        if (entity._kml.extendedData.LOT.value !== undefined && !entity._polygon){
                            return;
                        }
                        if(entity && entity._polygon && entity._polygon.material && entity._polygon.material._color && entity._polygon.material._color._value){
                            var red = (entity._polygon.material._color._value.red) ? entity._polygon.material._color._value.red : 0;
                            var green = (entity._polygon.material._color._value.green) ? entity._polygon.material._color._value.green : 0;
                            var blue = (entity._polygon.material._color._value.blue) ? entity._polygon.material._color._value.blue : 0;
                            var alpha = (entity._polygon.material._color._value.alpha) ? entity._polygon.material._color._value.alpha : 0;
                            
                            originalColorLot = [
                                red, 
                                green, 
                                blue, 
                                alpha
                            ];
                        };
                        for(let i = 0; i<obj.data.length; i++){
                            let item = obj.data[i]
                            if (!item.lotId || item.lotId == undefined) {
                                continue; 
                            }       
                            else if (entity._kml.extendedData.LOT.value === item.lotId) {
                                if (item.issueStatus == "Pending") {
                                    entity._polygon.material = new Cesium.Color(0, 0, 1, 1)
                                } else if (item.issueStatus == "Closed" || item.issueStatus == "Completed") {
                                    entity._polygon.material = new Cesium.Color(0, 1, 0, 1)
                                } else {
                                    entity._polygon.material = new Cesium.Color(1, 1, 1, 1)
                                }
                                return;
                            }
                            else if (entity._kml.extendedData.LOT.value !== undefined && entity._polygon && entity._kml.extendedData.LOT.value !== item.lotId) {
                                entity._polygon.material = new Cesium.Color(1, 0, 0, 0.7)
                            }
                        }
                    })
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr, errorThrown);
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Error',
                        content: textStatus
                    });
                }
            });
            legendsTable.innerHTML = "<tr><td style='background-color:rgb(0%, 0%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Pending</td></tr>"
            legendsTable.innerHTML += "<tr><td style='background-color:rgb(0%, 100%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Closed</td></tr>"
            legendsTable.innerHTML += "<tr><td style='background-color:rgb(100%, 100%, 100%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>No Value</td></tr>"
            legendsTable.innerHTML += "<tr><td style='background-color:rgb(90%, 5%, 5%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Unregistered</td></tr>"
            break;
            case 'IRI':
            console.log("IRI");
            if (!thematicProps.roadAsset) return;
            $.ajax({
                type: "GET",
                url: '../BackEnd/getMlpData.php',
                dataType: 'json',
                success: function (obj2, textstatus) {
                    var firstflag =false;
                    var entextendedDataFlag = false;
                    if(obj2.data){
                        var obj = obj2.data;
                        var lgd = obj2.legend;
                        var lgdGood = (lgd.good) ? parseFloat(lgd.good) : 2.5;
                        var lgdFair = (lgd.fair) ? parseFloat(lgd.fair) : 3.5;
                        var lgdPoor = (lgd.poor) ? parseFloat(lgd.poor) : 4.5;
                        thematicProps.roadAsset.forEach((entity) => {
                           
                            if( firstflag == false ){
                                // console.log("no old colour");
                                if(entity._polyline != undefined){
                                    originalColorLot = [
                                        entity._polyline.material._color._value.red, 
                                        entity._polyline.material._color._value.green, 
                                        entity._polyline.material._color._value.blue, 
                                        entity._polyline.material._color._value.alpha
                                    ];
                                    firstflag = true;
                                    console.log(originalColorLot)
                                }
                            }
                            if (!entity._kml.extendedData) return;
                            if(entity._kml.extendedData['Direction']  && obj[entity._kml.extendedData['Direction'].value] && obj[entity._kml.extendedData['Direction'].value][entity._kml.extendedData['Start_CH'].value.toUpperCase()] ){
                                var iriValue = parseFloat(obj[entity._kml.extendedData['Direction'].value][entity._kml.extendedData['Start_CH'].value.toUpperCase()][entity._kml.extendedData['Type'].value]['iri']);
                                entextendedDataFlag = true;
                                switch (true){
                                    case (iriValue < lgdGood):
                                        if(entity._polyline != undefined)
                                        entity._polyline.material = new Cesium.Color(0, 1, 0, 1);
                                        break;
                                    case (iriValue >= lgdGood && iriValue < lgdFair):
                                        if(entity._polyline != undefined )
                                        entity._polyline.material = new Cesium.Color(1, 1, 0, 1)
                                        break;
                                    case (iriValue >= lgdFair && iriValue < lgdPoor):
                                        if(entity._polyline != undefined )
                                        entity._polyline.material =Cesium.Color.ORANGERED;
                                        break;
                                    case (iriValue >= lgdPoor):
                                        if(entity._polyline != undefined)
                                        entity._polyline.material = new Cesium.Color(1, 0, 0 , 1);
                                        break;
                                }
                            }
                            
                        });
                        if(!entextendedDataFlag){
                            // not the correct KML
                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: 'Message',
                                content: "The KML data does not have the required extended Data to apply IRI Thematics."
                            });
                        }
                    }else{
                        $.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: 'Message',
                            content: "No MLP data uploaded."
                        });
                    }
                    legendsTable.innerHTML = "<tr><td style='background-color:rgb(0%, 100%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Good (IRI < "+lgdGood+")</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgb(100%, 100%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Fair (IRI between "+lgdGood+" & "+lgdFair+") </td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgb(100%, 45%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Poor (IRI between "+lgdFair+" & "+lgdPoor+")</td></tr>"
                    legendsTable.innerHTML += "<tr><td style='background-color:rgb(100%, 0%, 0%);font-family: Arial, Helvetica, sans-serif;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>Bad ( IRI >= "+lgdPoor+")</td></tr>"
                         
                    thematicProps.flag = true
                    if (legendsTable.innerHTML) {
                      $(".legendToolList", 1);
                    }
                  
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr, errorThrown);
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Error',
                        content: textStatus
                    });
                }
            });
            break;
    }
    // since iri will have custom legend html it will be render in the ajax
    if(pipeAttr != 'IRI'){
      thematicProps.flag = true
      if (legendsTable) {
          $(".legendToolList");
      }
    }
}

async function removeThemev3() {
    if (!thematicProps.flag) return
    thematicProps.flag = false
    var i = 0;
    if (thematicProps.landEntities) {
        if(!originalColorLot){
            while (i < tilesetlist.length) {
            for(let k = 0; k < landThematic.length; k++) {
                    if(landThematic[k].id === tilesetlist[i].id) {
                        if (tilesetlist[i].url.toLowerCase().includes("lot")) {
                            if (tilesetlist[i].tileset && Object.prototype.toString.call(tilesetlist[i].tileset) === "[object Promise]") {
                                tilesetlist[i].tileset.then(async (value) => {
                                    await viewer.dataSources.remove(value);
                                    console.log("promise")
                                })
                            } else {
                                viewer.dataSources.remove(tilesetlist[i].tileset);
                                console.log("not promise")
                            }
                            mykml = await LoadKMLData(tilesetlist[i].url)
                            tilesetlist[i].tileset = mykml
                            break;
                        }
                    }
                }
                i++;
            };
        }
        if(originalColorLot && originalColorLot.length == 4){
            thematicProps.landEntities.forEach((entity) => {
                if (!entity._kml.extendedData || !entity._polygon) return;
                if (entity._kml.extendedData.LOT.value !== undefined && !entity._polygon) return;
                entity._polygon.material = new Cesium.Color(originalColorLot[0],originalColorLot[1],originalColorLot[2],originalColorLot[3]);
            })
        }
        originalColorLot = [];
    }
    $("#pipeLegends").html("")
    $(".legendToolList", false);
}