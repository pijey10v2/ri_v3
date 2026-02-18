var $jogetHost = JOGETHOST;
function OnClickHome() {
    // temp for demo purpose
    if (localStorage.p_name == "Gandaria Mall") {
        viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
            orientation: {
                roll: (95 * (Math.PI / 180))
            }
        })
    } else {
        viewer.camera.flyHome(2)
    }

}

function OnClickGlobe() {
    var camera = new Cesium.Camera(viewer.scene);
    var vert = (north + south) / 2;
    var hori = (east + west) / 2;
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(hori, vert, 13000000.0),
        orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0
        }
    });
}

function resetpinpointtoolVlaue() {
    viewer.scene.primitives.remove(tempModel);
    $('.inputcontainer .column1').find('input').prop("checked", false);
    $('.inputcontainer .column2').find('input').prop("checked", false);
    $('.inputcontainer .column3').find('input').prop("checked", false);
}

/* function OnClickIdentity() {
     if (flagTilesetInfo == false) {
         flagTilesetInfo = true;
     }
     else {
         flagTilesetInfo = false;
         viewer.selectedEntity = undefined;
         silhouetteGreen.selected = [];
     };
 }*/

function OnClickDistance() {
    MeasureTool = "Distance";
    document.getElementsByTagName("body")[0].style.cursor = "url('Images/ccrosshair.cur'),auto";
    showinstruction()
    instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png">  to mark points.')
    for (var i = 0; i < 3; i++) {
        labelEntity[i].label.show = false;
    };
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    distanceEntity = 0;
    distance = 0;
    flagPosEntities = false;
}

function OnClickArea() {
    MeasureTool = "Area";
    document.getElementsByTagName("body")[0].style.cursor = "url('Images/ccrosshair.cur'),auto";
    showinstruction()
    instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png">  to mark points.')

    for (var i = 0; i < 3; i++) {
        labelEntity[i].label.show = false;
        //instructions('Click  <img src="Images/icons/instructions/light_color/rightclick.png">  to finish.')
    };
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    distanceEntity = 0;
    distance = 0;
    flagPosEntities = false;
}

function OnClickPoint() {
    MeasureTool = "Position";

    showinstruction()
    instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png">  to mark points.')

    document.getElementsByTagName("body")[0].style.cursor = "url('Images/ccrosshair.cur'),auto";
    for (var i = 0; i < 3; i++) {
        labelEntity[i].label.show = false;
    };
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    distanceEntity = 0;
    distance = 0;
    flagPosEntities = false;
}

function OnClickDraw() {
    //$(".admin-function.active").removeClass("active")
    if ($("#draw").hasClass("active")) {
        $(".admin-function.active").removeClass("active")
        flagDraw = false;
        closeAllWindow()
        document.getElementsByTagName("body")[0].style.cursor = "default";
        // ShowLocationDirectory(true)
        hideinstruction()
        instructions("")
    } else {
        closeAllWindow()
        $(".admin-function.active").removeClass("active")

        $("#draw").addClass("active")
        flagDraw = true;
        document.getElementsByTagName("body")[0].style.cursor = "url('Images/ccrosshair.cur'),auto";
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/leftclick.png">  to mark location.<br> Press <kbd>Esc</kbd> to exit.')
    }
}

function OnClickModelFormSave() {
    var e = document.getElementById('modelLayerName');
    var layerid = e.options[e.selectedIndex].value;
    var bldType = $('#modelBuildingType').val();
    var bldOwner = $('#modelBuildingOwner').val();
    var assetID = $('#modelAssetID').val();
    var assetName = $('#modelAssetName').val();
    var assetSLA = $('#modelAssetSLA').val();
    if (layerid == "" || assetName == "" || assetID == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Need Asset Name, Asset ID and Layer Name  to Save the Model!',
        });
        return;
    };
    if (isNaN(assetSLA)) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Asset SLA needs to be a number  to Save the Model!',
        });
        return;
    };

    document.getElementById('modelentityForm').style.display = 'none';
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };

    var model = tempModelData.pop();
    var modeldetails = {};
    modeldetails['layer_id'] = layerid;
    modeldetails['bldOwner'] = bldOwner;
    modeldetails['bldType'] = bldType;
    modeldetails['assetID'] = assetID;
    modeldetails['assetName'] = assetName;
    modeldetails['assetSLA'] = assetSLA;


    var formdata = new FormData();
    if (flagEditModel && modelIndex != -1) {
        console.log(modelIndex);
        myModels[modelIndex].Layer_id = layerid;
        myModels[modelIndex].BuildingType = bldType;
        myModels[modelIndex].BuildingOwner = bldOwner;
        myModels[modelIndex].AssetID = assetID;
        myModels[modelIndex].AssetName = assetName;
        myModels[modelIndex].AssetSLA = assetSLA;
        viewer.selectedEntity = undefined;
        var selectedEntity = new Cesium.Entity();
        selectedEntity.name = myModels[modelIndex].AssetName
        var myDesc = '<table ><tbody >';
        myDesc += '<tr><td>' + "Building Type : " + bldType + '</td></tr>';
        myDesc += '<tr><td>' + "Building Owner Name :" + bldOwner + '</td></tr>';
        myDesc += '<tr><td>' + "Asset ID :" + assetID + '</td></tr>';
        myDesc += '<tr><td>' + "Asset Name :" + assetName + '</td></tr>';
        myDesc += '<tr><td>' + "Asset SLA :" + assetSLA + '</td></tr>';
        myDesc += '</tbody></table>';
        selectedEntity.description = myDesc;
        viewer.selectedEntity = selectedEntity;

        var row = document.getElementById('assetData').rows;
        var cells = row[modelIndex + 1].cells;
        cells[1].innerText = assetID;
        cells[2].innerText = assetName;
        cells[3].innerText = bldType
        cells[4].innerText = bldOwner;
        cells[5].innerText = assetSLA;
        modeldetails['entityid'] = myModels[modelIndex].EntityID;
        flagEditModel = false;
        formdata.append('modeldetails', JSON.stringify(modeldetails));
    } else {
        if (model) {
            formdata.append('model', JSON.stringify(model));
            formdata.append('modeldetails', JSON.stringify(modeldetails));
        }
    };

    var request = new XMLHttpRequest();
    request.open("POST", "BackEnd/saveModelAssetData.php", true);
    request.send(formdata);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == "200") {
            var response = JSON.parse(request.responseText);
            var msg = response.msg;
            var data = response.data;
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: msg,
            });
            if (data) {
                myModels.push(data);
                var center = new Cesium.Cartesian3(data.X, data.Y, data.Z);
                var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
                var hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(data.Head, data.Pitch, data.Roll));
                var hpr = Cesium.Matrix4.fromRotationTranslation(hprRotation, new Cesium.Cartesian3(0.0, 0.0, -2.0));
                Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
                var building1;
                if (data.Shape == 1) {
                    building1 = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: new Cesium.EllipsoidGeometry({
                                radii: new Cesium.Cartesian3(data.Width, data.Length, data.Height)
                            }),
                            modelMatrix: modelMatrix,
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
                                show: new Cesium.ShowGeometryInstanceAttribute(true)
                            },
                            id: data.EntityID

                        }),
                        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                    }));

                } else if (data.Shape == 0) {
                    building1 = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: Cesium.BoxGeometry.fromDimensions({
                                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                                dimensions: new Cesium.Cartesian3(data.Width, data.Length, data.Height)
                            }),
                            modelMatrix: modelMatrix,
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
                                show: new Cesium.ShowGeometryInstanceAttribute(true)
                            },
                            id: data.EntityID
                        }),
                        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                    }));

                };
                modelsArray.push(building1);
                var tbody = document.getElementById('assetData');
                var row = tbody.insertRow();
                var cell = row.insertCell();
                var cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.class = 'annotateModel';
                cb.setAttribute('id', data.EntityID);
                cb.setAttribute('checked', true);
                cb.setAttribute('onchange', "OnChangeAnnotateModel(this)")
                cell.appendChild(cb);
                row.insertCell(1).innerHTML = data.AssetID;
                row.insertCell(2).innerHTML = data.AssetName;
                row.insertCell(3).innerHTML = data.BuildingType;
                row.insertCell(4).innerHTML = data.BuildingOwner;
                row.insertCell(5).innerHTML = data.AssetSLA;
            };
        };
    }
}

function OnClickModelFormCancel() {
    document.getElementsByTagName("body")[0].style.cursor = "default";
    document.getElementById('modelentityForm').style.display = 'none';
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    if (flagEditModel) {
        flagEditModel = false;
    }
}

function OnClickPinpointToolSave() {

    jqwidgetBox("pintpointTool", false);

    var x, y, z;
    x = $('#inputx').val();
    y = $('#inputy').val();
    z = $('#inputz').val();

    var width, length, height;
    width = $('#sizewidth').val();
    length = $('#sizelength').val();
    height = $('#sizeheight').val();

    var head, pitch, roll;
    head = $('#orientationhead').val();
    pitch = $('#orientationpitch').val();
    roll = $('#orientationroll').val();
    var myid = $('[name="shape"]:checked').prop('id');
    tempModelData.push({
        x: x,
        y: y,
        z: z,
        shape: myid,
        width: width,
        length: length,
        height: height,
        head: head,
        pitch: pitch,
        roll: roll
    });

    document.getElementsByTagName("body")[0].style.cursor = "default";
    document.getElementById('modelentityForm').style.display = 'block';
    document.getElementById('modelentityForm').classList.add("active");
    hideinstruction()
    instructions("")
    resetpinpointtoolVlaue()
}

function OnClickPinpointToolCancel() {
    //remove the mark pin
    // console.log(distEntities.length);
    //closeAllWindow()
    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };
    distEntities.splice(0, distEntities.length);
    //console.log(distEntities.length);
    viewer.scene.primitives.remove(tempModel); //remove the drawing
}

function OnChangeInputPinpointValues() {
    var x, y, z;
    x = $('#inputx').val();
    y = $('#inputy').val();
    z = $('#inputz').val();
    if (!x || !y || !z) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a center point to draw the geometry!',
        });
        return;
    }
    var myid = $('[name="shape"]:checked').prop('id');

    var width, length, height;
    width = $('#sizewidth').val();
    length = $('#sizelength').val();
    height = $('#sizeheight').val();

    var head, pitch, roll;
    head = $('#orientationhead').val();
    pitch = $('#orientationpitch').val();
    roll = $('#orientationroll').val();

    viewer.scene.primitives.remove(tempModel);
    var center = new Cesium.Cartesian3(x, y, z);
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    var hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(head, pitch, roll));
    var hpr = Cesium.Matrix4.fromRotationTranslation(hprRotation, new Cesium.Cartesian3(0.0, 0.0, -2.0));
    Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);

    if (myid == "radioelipsoid") {
        tempModel = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.EllipsoidGeometry({
                    radii: new Cesium.Cartesian3(width, length, height)
                }),
                modelMatrix: modelMatrix,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
                    show: new Cesium.ShowGeometryInstanceAttribute(true)
                },
                id: x
            }),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
        }));

    } else if (myid == "radiobox") {
        tempModel = viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: Cesium.BoxGeometry.fromDimensions({
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                    dimensions: new Cesium.Cartesian3(width, length, height)
                }),
                modelMatrix: modelMatrix,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 1.0, 0.3)),
                    show: new Cesium.ShowGeometryInstanceAttribute(true)
                },
                id: x

            }),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
        }));
    }
}

function OnChangeCameraPinHeight() {
    var name = $('#camName').val()
    var height = $('#camHeight').val();
    var lng = $('#camLong').val();
    var lat = $('#camLat').val();
    if (videoPinEdit == true) {
        viewer.entities.removeById(videoPinsArray[videoPinIndex].id);
        videoPinsArray.splice(videoPinIndex, 1);
        videoPinsArray.splice(videoPinIndex, 0, addVideoPin(name, lng, lat, height, true));
    } else {
        viewer.entities.removeById(tempVideoPin.id);
        tempVideoPin = addVideoPin("untitled", lng, lat, height, true);
    };
}

function OnClickMark() {
    flagDraw = false;
    flagEdit = false;
    flagAddImage = false; //make the flag for camera false as both are on right click
    flagCamera = false; //make the flag for camera false as both are on right click
    if ($('#mark').hasClass('active')) {
        $(".admin-function.active").removeClass("active")
        document.getElementById('newentityForm').style.display = "none";
        closeAllWindow()
        flagEntity = false;
        document.getElementsByTagName("body")[0].style.cursor = "default";
        hideinstruction()
        instructions("")
    } else {
        closeAllWindow()
        $(".admin-function.active").removeClass("active")

        $("#mark").addClass("active")
        flagEntity = true;
        jqwidgetBox("function9-1", 1);
        document.getElementsByTagName("body")[0].style.cursor = "url('Images/ccrosshair.cur'),auto";
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/rightclick.png">  to mark point.<br> Press <kbd>Esc</kbd> to exit.')
    }
}

function OnClickNewEntitySave() {
    hideinstruction()
    instructions('')
    var locationName = $('#lName').val();
    var regionName = $('#rName').val();
    if (locationName == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please enter a name for the location!',
        });
        return;
    } else if (regionName == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please enter a Region for the location!',
        });
        return;
    };
    document.getElementById('newentityForm').style.display = 'none';
    SaveMyData(locationName, regionName, currentLng, currentLat);
    //to update the locationList for the JStree...
    var isRegion = false;
    for (var j = 0; j < locationList.length; j++) {
        if (locationList[j].id == regionName) {
            isRegion = true;
        };
    };
    var name;
    if (!isRegion) {
        locationList.push({
            id: regionName,
            parent: "regions",
            text: regionName
        });
        infoLocationList.push({
            id: regionName,
            parent: "regions",
            text: regionName
        });
        $('#rootNode').jstree().create_node('#regions', {
            "id": regionName,
            "text": regionName
        }, 'last');
        $('#infoRootNode').jstree().create_node('#regions', {
            "id": regionName,
            "text": regionName
        }, 'last');
    };
    locationList.push({
        id: locationName,
        parent: regionName,
        text: locationName
    });
    infoLocationList.push({
        id: locationName,
        parent: regionName,
        text: locationName
    });
    name = "#" + regionName
    $('#rootNode').jstree().create_node(name, {
        "id": locationName,
        "text": locationName
    }, 'last');
    $('#infoRootNode').jstree().create_node(name, {
        "id": locationName,
        "text": locationName
    }, 'last');
    flagEntity = false;
    document.getElementsByTagName("body")[0].style.cursor = "default";
}

function OnClickNewEntityCancel() {
    document.getElementById('newentityForm').style.display = "none";
    flagEntity = false;
    $('.admin-function.active').removeClass('active')
    hideinstruction()
    instructions("")
}

function OnClickEdit() {
    flagDraw = false;
    flagCamera = false;
    flagAddImage = false; //make the flag for camera false as both are on right click
    flagEntity = false;

    hideinstruction()
    instructions("")
    if (isEntityPicked) {
        flagEdit = true;
        document.getElementById('editentityForm').style.display = "block";
        $(':input').val('');
        $('#changePWPath').prop('checked', false);
        $(".modal-container#editentity .doublefield.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #folderRoot.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #refreshpwfolder.appearoncheck").css('display', 'none')
        var i = entityIndex;
        $('#locationName').val(locations[i].locationName);
        $('#locationName').prop('disabled', true);
        $('#regionName').prop('disabled', true);
        $('#regionName').val(locations[i].region);
        $('#locationstatus').val(locations[i].status).prop('selected', true);
        $('#PWPathDisplay').val(locations[i].projectwisePath);
        $('#folderRoot').jstree('deselect_all');
        $('#folderRoot').jstree('close_all');
        $('#folderRootSP').jstree('deselect_all');
        $('#folderRootSP').jstree('close_all');
    } else if (isModelPicked) {
        flagEditModel = true;
        document.getElementById('modelentityForm').style.display = "block";
        console.log(modelIndex);
        $(':input').val('');
        $('#modelLayerName').val(myModels[modelIndex].layer_id);
        $('#modelBuildingType').val(myModels[modelIndex].BuildingType);
        $('#modelBuildingOwner').val(myModels[modelIndex].BuildingOwner);
        $('#modelAssetID').val(myModels[modelIndex].AssetID);
        $('#modelAssetName').val(myModels[modelIndex].AssetName);
        $('#modelAssetSLA').val(myModels[modelIndex].AssetSLA);
    } else {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please pick a Location/Model to edit!',
        });
        return;
    };
}

function OnClickAddCamera() {
    flagDraw = false;
    flagEdit = false;
    flagAddImage = false; //make the flag for camera false as both are on right click
    flagEntity = false; //make the flag for entity false as it are on right click
    uploadType = "VIDEO";
    if ($('#addcamera').hasClass('active')) {
        $(".admin-function.active").removeClass("active")
        OnClickAddCameraCancel()
        closeAllWindow()
        document.getElementsByTagName("body")[0].style.cursor = "default";
        jqwidgetBox("function9-1", 1);
        for (var i = 0; i < videoPinsArray.length; i++) {
            videoPinsArray[i].show = false;
        }

    } else {
        closeAllWindow()
        $(".admin-function.active").removeClass("active")
        jqwidgetBox("camerafeed", 1);
        $("#addcamera").addClass("active")
        OnClickCameraFeed()
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/rightclick.png">  to mark point.<br> Press <kbd>Esc</kbd> to exit.')
        $('#embedLinkInput').val("")
        $(".video-statuscontainer").css('display', 'none')
        jqwidgetBox("addcamera", 1);
        videoR.cancel();
        flagCamera = true;
        document.getElementsByTagName("body")[0].style.cursor = "url('Images/ccrosshair.cur'),auto";
        for (var i = 0; i < videoPinsArray.length; i++) {
            videoPinsArray[i].show = true;
        }
    }
}

function OnClickAddCameraSave() {   //save cam record
    hideinstruction()
    instructions('')
    event.preventDefault();
    var name = $('#camName').val();
    var height = $('#camHeight').val();
    var lng = $('#camLong').val();
    var lat = $('#camLat').val();
    var videoName = ""
    var videoType;
    if ($("#videoSourceRadio input[name=video]:checked").attr('id') == "localVideo") {
        if (videoR.files.length > 0) {
            videoName = videoR.files[0].fileName;
        }
        videoType = 0
    } else {
        videoType = 1
        videoName = $("#embedLinkInput").val()
    }

    if (videoPinEdit == true) {
        var videoPinDetails = {
            id: videoPinData[videoPinIndex].videoPinID,
            name: name,
            height: height,
            vURL: videoName,
            vType: videoType,
            functionName: 'updateVideoCam'
        };

        $.ajax({
            type: "POST",
            url: 'BackEnd/DataFunctions.php',
            dataType: 'json',
            data: videoPinDetails,
            success: function (obj, textstatus) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                // CameraHeight(false);
                jqwidgetBox("cameraheight", false);
                var i = videoPinIndex;
                viewer.entities.removeById(videoPinsArray[i].id);
                videoPinsArray.splice(i, 1);
                var mypin = addVideoPin(name, videoPinData[i].longitude, videoPinData[i].latitude, height, true);
                videoPinsArray.splice(i, 0, mypin);
                videoPinData[i].videoPinName = name;
                videoPinData[i].height = height;
                videoPinData[i].videoURL = obj['videoPath'];
                videoPinData[i].videoType = videoType;
                $('#cameraPinList').find('label').eq(i).text(name);
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
        videoPinEdit = false;
    } else {
        var videoPinDetails = {
            name: name,
            longitude: lng,
            latitude: lat,
            height: height,
            vURL: videoName,
            vType: videoType,
            functionName: 'addVideoCam'
        };
        $.ajax({
            type: "POST",
            url: 'BackEnd/DataFunctions.php',
            dataType: 'json',
            data: videoPinDetails,
            success: function (obj, textstatus) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg'],
                });
                var data = obj['data'];
                jqwidgetBox("cameraheight", false);
                viewer.entities.removeById(tempVideoPin.id);
                var mydiv = document.getElementById('cameraPinList'); //ul list
                var ul_li = document.createElement('li'); //CREATE li  
                ul_li.setAttribute('id', "videoID_" + data.videoPinID);
                var lyr_icon = document.createElement('img');
                lyr_icon.setAttribute('class', 'fileicon');
                lyr_icon.setAttribute('src', 'Images/icons/camerafeed_window/mp4.png');
                lyr_icon.setAttribute('title', data.videoPinName);

                var lbl = document.createElement('label'); // CREATE LABEL.
                lbl.setAttribute('for', data.videoPinName);
                // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
                lbl.appendChild(document.createTextNode(data.videoPinName));
                // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
                ul_li.appendChild(lyr_icon);
                ul_li.appendChild(lbl);

                ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/remove.png' title='Delete Camera' onclick='deleteVideoPin(this)' class='remove'>"
                ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/edit.png' title= 'Edit Camera' onclick= 'editVideoPinDetails(this)' class='edit'>"
                ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/play.png' onclick = 'playVideoPin(this)'class='play'>"
                ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/magnifier.png' onclick = 'flyToVideoPin(this)' class='flyto'>"
                mydiv.appendChild(ul_li);
                videoPinsArray.push(addVideoPin(name, lng, lat, height, true));
                videoPinData.push(data);

            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }
        });
    }
}

function OnClickEditfloatbox() {
    if (isEntityPicked) {
        flagEdit = true;
        document.getElementById('editentityForm').style.display = "block";
        $(':input').val('');
        $('#changePWPath').prop('checked', false);
        $(".modal-container#editentity .doublefield.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #folderRoot.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #refreshpwfolder.appearoncheck").css('display', 'none')
        var i = entityIndex;
        $('#locationName').prop('disabled', true);
        $('#regionName').prop('disabled', true);
        $('#regionName').val(locations[i].region);
        $('#locationstatus').val(locations[i].status).prop('selected', true);
        $('#PWPathDisplay').val(locations[i].projectwisePath);
        $('#folderRoot').jstree('deselect_all');
        $('#folderRoot').jstree('close_all');

        // $('.topmenu .fourth-button').addClass('active');
        // $('.topmenu .fourth-button').css('display', 'block')
        // $('.topmenu .fourth-button').css({'padding-top':-30}).animate({'padding-top': 0}, 200)

        // $('.topmenu .fourth-button admin-function#edit').addClass('active')

        // ShowLocationDirectory(true);
    } else if (isModelPicked) {
        flagEditModel = true;
        document.getElementById('modelentityForm').style.display = "block";
        console.log(modelIndex);
        $(':input').val('');
        $('#modelLayerName').val(myModels[modelIndex].layer_id);
        $('#modelBuildingType').val(myModels[modelIndex].BuildingType);
        $('#modelBuildingOwner').val(myModels[modelIndex].BuildingOwner);
        $('#modelAssetID').val(myModels[modelIndex].AssetID);
        $('#modelAssetName').val(myModels[modelIndex].AssetName);
        $('#modelAssetSLA').val(myModels[modelIndex].AssetSLA);
    } else {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please pick a Location/Model to edit!',
        });
        return;
    };
}

function OnClickEntityFormSave() {
    hideinstruction()
    instructions('')
    flagEntity = false;
    document.getElementById('editentityForm').style.display = 'none';
    var i = entityIndex;
    var node = $('#folderRoot').jstree().get_selected(true)[0];
    if (node !== undefined) {
        locations[i].folderID = node.id;
        console.log(node.id);
        var path = $('#folderRoot').jstree().get_path(node, "/");
        console.log(path);
        locations[i].projectwisePath = path;
    } else {
        locations[i].folderID = "";
    }

    locations[i].status = $('#locationstatus').val();


    SaveFileData(i);

}

function OnClickEntityFormCancel() {
    jqwidgetBox("function9-1", 1);
    document.getElementById('editentityForm').style.display = "none";
    flagEdit = false;
    flagEntity = false;
}

function OnClickBrowse() {
    event.preventDefault();
    //window.open("http://103.21.34.145:801/login.aspx");
    if (folderTree) {
        $('#folderRoot').jstree("destroy").empty();
        folderTree = false;
    }
    var folderid = $('#Path').val();
    var folderName = $('#Path :selected').text();
    console.log(folderName);
    console.log(folderid);
    $('div.loadingcontainer-mainadmin').css('display', 'block')
    $('#loadingText').text("Getting PW subfolders");
    $('#entityFormSave').prop('disabled', true);
    $('#entityFormCancel').prop('disabled', true);
    $('#closebutton-editentityForm').css('display', 'none')
    $.ajax({
        type: "POST",
        url: 'BackEnd/getProjectWiseFolders.php',
        dataType: 'json',
        data: {
            instanceID: folderid
        },
        success: function (obj, textstatus) {
            //console.log(obj);
            var data = obj;
            var mydata = {
                id: folderid,
                text: folderName,
                parent: "#"
            }
            data.splice(0, 0, mydata);
            console.log(data);
            if (folderTree) {
                $('#folderRoot').jstree("destroy").empty();
            }
            $('#folderRoot').jstree({
                'core': {
                    'data': data,
                    'check_callback': true
                },
                'plugins': ["sort"]
            });
            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
            $('#entityFormSave').prop('disabled', false);
            $('#entityFormCancel').prop('disabled', false);
            $('#closebutton-editentityForm').css('display', 'block')
            folderTree = true;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Error in fetching the Projectwise folders!. Please click the browse again to fetch.'
            });
        }
    });
}

function OnClickAddImage() {
    flagDraw = false;
    flagEdit = false;
    flagCamera = false; //make the flag for camera false as both are on right click
    flagEntity = false; //make the flag for entity false as it are on right click
    $("h5.localImage").html("Upload File")
    if ($('#addimage').hasClass('active')) {
        $(".admin-function.active").removeClass("active")
        closeAllWindow()
        flagAddImage = false;
        document.getElementsByTagName("body")[0].style.cursor = "default";
    } else {
        closeAllWindow()
        $(".admin-function.active").removeClass("active")
        $("#addimage").addClass("active")
        flagAddImage = true;
        document.getElementsByTagName("body")[0].style.cursor = "url('Images/ccrosshair.cur'),auto";
        showinstruction()
        instructions('Click  <img src="Images/icons/instructions/light_color/rightclick.png">  to mark point.<br> Press <kbd>Esc</kbd> to exit.')
    }
}

function OnChangeImagePinHeight() {
    var name = $('#imgName').val()
    var height = $('#imgHeight').val();
    var lng = $('#imgLong').val();
    var lat = $('#imgLat').val();
    if (earthPinEdit == true) {
        viewer.entities.removeById(earthPinsArray[earthPinIndex].id);
        earthPinsArray.splice(earthPinIndex, 1);
        earthPinsArray.splice(earthPinIndex, 0, addEarthPin(name, lng, lat, height, true));
    } else {
        viewer.entities.removeById(tempImagePin.id);
        tempImagePin = addEarthPin("untitled", lng, lat, height, true);
    };
}

function OnClickAddImageCancel() {
    hideinstruction()
    instructions('')
    event.preventDefault();
    closeAllWindow()
    jqwidgetBox("addImage", false);
    $("#addimage.active").removeClass('active')
    $('#imgName').val("")
    $('#imgLong').val("");
    $('#imgLat').val("");
    $('#imgHeight').val("");
    $('#imageFileName').val("");
    $("#initImage").val("src", "")
    $(".initImageDiv").css("display", "none")
    $("#initImage").removeClass("active")
    $(".verticalLine").css("left", "13px")
    $("#northReset").css("display", "none")
    $(".instructionBox").html("Select center point (North) of image")
}


$('#folderRoot').on("select_node.jstree", function (e, data) {
    console.log(data.node.text);
    // var children = $('#folderRoot').jstree().get_children_dom(data.node.id);
    $('#folderRoot').jstree().show_all();
    var children = $('#folderRoot').jstree().get_node(data.node.id).children;
    //console.log(children.length);
    //  console.log(children);
    if (children.length != 0) {

        return;
    }
    $('div.loadingcontainer-mainadmin').css('display', 'block')
    $('#loadingText').text("Getting PW subfolders");
    $('#entityFormSave').prop('disabled', true);
    $('#entityFormCancel').prop('disabled', true);
    $('#closebutton-editentityForm').css('display', 'none')
    $.ajax({
        type: "POST",
        url: 'BackEnd/getProjectWiseFolders.php',
        dataType: 'json',
        data: {
            instanceID: data.node.id
        },
        success: function (obj, textstatus) {
            console.log(obj);
            if (obj['data']['errorID']) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Error in fetching the Projectwise folders!. Please click the folder again to fetch.'
                });
                $('div.loadingcontainer-mainadmin').css('display', 'none')
                $('.loader').css("animation-duration", '1000ms');
                $('#entityFormSave').prop('disabled', false);
                $('#entityFormCancel').prop('disabled', false);
                $('#closebutton-editentityForm').css('display', 'block');
                return;

            }
            var mydata = obj['data']['instances'];
            for (var i = 0; i < mydata.length; i++) {
                $('#folderRoot').jstree().create_node(data.node.id, {
                    "id": mydata[i].instanceId,
                    "text": mydata[i].properties.Label
                })
            }

            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
            $('#entityFormSave').prop('disabled', false);
            $('#entityFormCancel').prop('disabled', false);
            $('#closebutton-editentityForm').css('display', 'block')
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);

            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Error in fetching the Projectwise folders!. Please click the browse again to fetch.'
            });
            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
            $('#entityFormSave').prop('disabled', false);
            $('#entityFormCancel').prop('disabled', false);
            $('#closebutton-editentityForm').css('display', 'block')
        }
    });

});

function OnClickDelete() {
    if (isEntityPicked) {
        if (entityIndex != -1) {
            $.confirm({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Confirm!',
                content: 'Are you sure you want to delete the location?',
                buttons: {
                    confirm: function () {
                        var locationid = locations[entityIndex].locationID;
                        console.log(locationid);
                        $.post("BackEnd/deleteLocationData.php", {
                            locationID: locationid
                        })
                            .done(function (data) {
                                var response = JSON.parse(data);
                                $.alert({
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    title: 'Message',
                                    content: response['msg'],
                                });
                                if (response['result']) {
                                    locations.splice(entityIndex, 1);
                                    var billboard = entitiesArray[entityIndex];
                                    viewer.entities.removeById(billboard.id);
                                    entitiesArray.splice(entityIndex, 1);
                                    $('#rootNode').jstree().delete_node(selectedNodeId);
                                    $('#infoRootNode').jstree().delete_node(selectedNodeId);
                                    var i = 0;
                                    while (i < locationList.length) {
                                        if (locationList[i].id == selectedNodeId) {
                                            locationList.splice(i, 1);
                                            break;
                                        };
                                        i++;
                                    };
                                    isEntityPicked = false;
                                }
                            });
                    },
                    cancel: function () {
                        return
                    }
                }
            });
        };
    } else if (isModelPicked) {
        if (modelIndex != -1) {
            $.confirm({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Confirm!',
                content: 'Are you sure you want to delete the Model?',
                buttons: {
                    confirm: function () {
                        var entityid = myModels[modelIndex].EntityID;
                        console.log(entityid);
                        $.post("BackEnd/deleteModelAssetData.php", {
                            EntityID: entityid
                        })
                            .done(function (data) {
                                var response = JSON.parse(data);
                                $.alert({
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    title: 'Message',
                                    content: response['msg'],
                                });
                                if (response['result']) {
                                    myModels.splice(modelIndex, 1);

                                    var polygon = modelsArray[modelIndex];
                                    viewer.scene.primitives.remove(polygon);
                                    modelsArray.splice(modelIndex, 1);
                                    isModelPicked = false;
                                }
                            });
                    },
                    cancel: function () {
                        return
                    }
                }
            });
        };
    } else {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please select a location or a Model to delete!',
        });
        return;
    };
}

function getSharePointFolders() {
    $('div.loadingcontainer-mainadmin').css('display', 'block')
    $('#loadingText').text("Getting SharePoint folders");
    $.ajax({
        type: "POST",
        url: 'BackEnd/sharePoint.json.php',
        dataType: 'json',
        data: {
            functionName: 'fetchFolder',
        },
        success: function (obj, textstatus) {
            console.log(obj);
            if (obj['msg']) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg']
                });
                $('div.loadingcontainer-mainadmin').css('display', 'none')
                $('#loadingText').text("");
                return;
            }
            var data = [];
            // need to add error handling
            // populate root folder
            var mydata = {
                id: "rootFolder",
                text: obj.root,
                parent: "#"
            }
            data.push(mydata);
            for (var i = 0; i < obj.child.folder.length; i++) {
                var mydata = {
                    id: "firstChild" + i,
                    text: obj.child.folder[i].name,
                    parent: "rootFolder",
                    li_attr: { "dataUrl": obj.child.folder[i].url, "lvl": 1 }
                }
                data.push(mydata);
            }
            if (folderTreeSP) {
                $('#folderRootSP').jstree("destroy").empty();
            }
            $('#folderRootSP').jstree({
                'core': {
                    'data': data,
                    'check_callback': true
                },
                'plugins': ["sort"]

            }).bind("loaded.jstree", function (event, data) {
                $(this).jstree("open_all");
                $(this).on("select_node.jstree", function (e, data) {
                    if (data.node.id == "rootFolder") {
                        return;
                    }
                    let selFol = data.node;
                    data.node.children = [];
                    $('div.loadingcontainer-mainadmin').css('display', 'block')
                    $('#loadingText').text("Getting SP subfolders");
                    $('#entityFormSave').prop('disabled', true);
                    $('#entityFormCancel').prop('disabled', true);
                    $('#closebutton-editentityForm').css('display', 'none');
                    $.ajax({
                        type: "POST",
                        url: 'BackEnd/sharePoint.json.php',
                        dataType: 'json',
                        data: {
                            functionName: 'fetchFolder',
                            url: selFol.li_attr.dataUrl,
                        },
                        success: function (obj, textstatus) {
                            // error handling
                            let childlvl = selFol.li_attr.lvl + 1;
                            for (var i = 0; i < obj.child.folder.length; i++) {
                                $('#folderRootSP').jstree('create_node', $("#" + selFol.id), { "text": obj.child.folder[i].name, "id": "child" + childlvl + "_" + i, li_attr: { "dataUrl": obj.child.folder[i].url, "lvl": childlvl } });
                                $("#folderRootSP").jstree("open_node", $("#" + selFol.id));
                            }

                            folderTreeSP = true;

                            $('div.loadingcontainer-mainadmin').css('display', 'none')
                            $('.loader').css("animation-duration", '1000ms');
                            $('#entityFormSave').prop('disabled', false);
                            $('#entityFormCancel').prop('disabled', false);
                            $('#closebutton-editentityForm').css('display', 'block')
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            var str = textStatus + " " + errorThrown;
                            console.log(str);



                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: 'Message',
                                content: 'Error in fetching the Share Point folders!. Please click the browse again to fetch.'
                            });
                            $('div.loadingcontainer-mainadmin').css('display', 'none')
                            $('.loader').css("animation-duration", '1000ms');
                            $('#entityFormSave').prop('disabled', false);
                            $('#entityFormCancel').prop('disabled', false);
                            $('#closebutton-editentityForm').css('display', 'block')
                        }
                    });

                });
            });


            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Error in getting the sharePoint Folders. Please click the check box again to get the folders'
            });
            $('div.loadingcontainer-mainadmin').css('display', 'none')
            $('.loader').css("animation-duration", '1000ms');
        }
    });
}

function getProjectWiseFolders() {
    if (!getPWFolderData) {
        $('div.loadingcontainer-mainadmin').css('display', 'block')
        $('#loadingText').text("Getting PW folders");
        $.ajax({
            type: "POST",
            url: 'BackEnd/getProjectWiseFolders.php',
            dataType: 'json',
            success: function (obj, textstatus) {
                console.log(obj);
                //if(!obj['msg']){/// need to code for error
                var data = [];
                if (obj['data']['errorID'] || obj['root']['errorID']) {
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: 'Error in fetching the Projectwise folders!. Please click the folder again to fetch.'
                    });
                    $('div.loadingcontainer-mainadmin').css('display', 'none')
                    $('.loader').css("animation-duration", '1000ms');
                    return;

                }

                if (obj['root']) {
                    var mydata = {
                        id: obj['root'].instanceId,
                        text: obj['root'].properties.DisplayLabel,
                        parent: "#"
                    }
                    data.push(mydata);
                };
                if (obj['data']) {
                    for (var i = 0; i < obj['data'].length; i++) {
                        var mydata = {
                            id: obj['data'][i].instanceId,
                            text: obj['data'][i]['properties']['Label'],
                            parent: obj['root'].instanceId
                        }
                        data.push(mydata);
                    }
                }
                console.log(data);

                if (folderTree) {
                    $('#folderRoot').jstree("destroy").empty();
                }
                $('#folderRoot').jstree({
                    'core': {
                        'data': data,
                        'check_callback': true
                    },
                    'plugins': ["sort"]
                });
                getPWFolderData = true;
                // }



                $('div.loadingcontainer-mainadmin').css('display', 'none')
                $('.loader').css("animation-duration", '1000ms');
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Error in getting the projectwise Folders. Please click the check box again to get the folders'
                });
                $('div.loadingcontainer-mainadmin').css('display', 'none')
                $('.loader').css("animation-duration", '1000ms');
            }
        });
    };
}

var timer;
// The function to refresh the progress bar.
function refreshProgress() {
    // We use Ajax again to check the progress by calling the checker script.
    // Also pass the session id to read the file because the file which storing the progress is placed in a file per session.
    // If the call was success, display the progress bar.
    console.log("refresh");

    $.ajax({
        url: "BackEnd/progressCheck.php",
        success: function (data) {
            console.log(data.percent);
            console.log(data.message);
            //$("#progress").html('<span class="bar" id="pw-progress-inner" style=" display: block; height: 35px; background-color: #34c2e3; border-radius: 3px; -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset; position: relative; width:' + data.percent + '%"></span>');
            $("#pw-progress-inner").css("width", data.percent + "%")
            $("#message").html(data.message);
            // If the process is completed, we should stop the checking process.
            if (data.percent == 100) {
                window.clearInterval(timer);
                timer = window.setInterval(completed, 1000);
            }
        }
    });
}

function completed() {
    $("#message").html("Completed");
    $("#pw-progress-inner").css("width", "0%")
    window.clearInterval(timer);
    //$("#progress").html('<span class="bar" id="pw-progress-inner" style="width:' + data.percent + '%"></span>');
}

function OnClickFolderDirectory() {
    // if (!getPWFileData) {
    //     $('div.loadingcontainer-splitcontent').css('display', 'block')
    //     //  $('#loadingText2').text("Getting PW files for all locations");
    //     console.log("Retrieving files");


    //     $.ajax({
    //         type: "POST",
    //         url: 'BackEnd/getProjectWiseFiles.php', //in php checking if it is share point or projectwise files
    //         dataType: 'json',
    //         success: function (obj, textstatus) {
    //             console.log(obj);
    //             if (obj['msg'] !== "success") {
    //                 $.alert({
    //                     boxWidth: '30%',
    //                     useBootstrap: false,
    //                     title: 'Message',
    //                     content: obj['msg']
    //                 });
    //                 window.clearInterval(timer);
    //                 timer = window.setInterval(completed, 1000);
    //                 $('div.loadingcontainer-splitcontent').css('display', 'none')
    //                 $('.loader').css("animation-duration", '1000ms');
    //                 return;
    //             } else {
    //                 getPWFileData = true;
    //                 filedata = obj['data'];
    //                 for (var i = 0; i < locations.length; i++) {
    //                     var k = 0;
    //                     while (k < filedata.length) {
    //                         if (filedata[k].locationID == locations[i].locationID) {

    //                             if (filedata[k].files) {
    //                                 for (var l = 0; l < filedata[k].files.length; l++) {
    //                                     //  console.log(l);
    //                                     //  console.log(filedata[k].files[l].text);
    //                                     if (filedata[k].files[l].folder == true) {
    //                                         $('#infoRootNode').jstree().create_node(filedata[k].files[l].parent, {
    //                                             "id": filedata[k].files[l].id,
    //                                             "text": filedata[k].files[l].text
    //                                         })
    //                                     }
    //                                 }
    //                             };
    //                             break;
    //                         };
    //                         k++;

    //                     };

    //                 }
    //                 $('div.loadingcontainer-splitcontent').css('display', 'none')
    //                 $('.loader').css("animation-duration", '1000ms');
    //             }
    //         },
    //         error: function (xhr, textStatus, errorThrown) {
    //             var str = textStatus + " " + errorThrown;
    //             console.log(str);
    //             $.alert({
    //                 boxWidth: '30%',
    //                 useBootstrap: false,
    //                 title: 'Message',
    //                 content: 'Error in fetching the projectwise File details. Please click the Refresh button to fetch the files'
    //             });
    //             window.clearInterval(timer);
    //             timer = window.setInterval(completed, 1000);
    //             $('div.loadingcontainer-splitcontent').css('display', 'none')
    //             $('.loader').css("animation-duration", '1000ms');
    //         }
    //     });

    //     if (!$("#folderRootSP").length != 0) {
    //         timer = window.setInterval(refreshProgress, 1000);
    //     }


    // } else {
    //     console.log("files already fetched");
    // }

}

function OnClickRefreshPWFolder() {
    getPWFileData = false;
    console.log(getPWFileData);
    /*  $('#infoRootNode').jstree("destroy").empty();
      $('#infoRootNode').jstree({
         'core': {
             'data': infoLocationList,
             'check_callback': true
         },
         'plugins': ["sort"]
     });
     OnClickFolderDirectory();*/
    for (var i = 0; i < locations.length; i++) {
        console.log(locations[i].locationName);
        var children = $('#infoRootNode').jstree(true).get_node(locations[i].locationName).children;
        console.log(children);
        $('#infoRootNode').jstree(true).delete_node(children);
    }
    $('#infoRootNode').jstree(true).redraw();

    OnClickFolderDirectory();
}


function OnClickDashboard() {
    if (dashboardLoaded == false) {
        $.ajax({
            type: "POST",
            url: 'BackEnd/getConfigDetailsPWPBi.php',
            dataType: 'json',
            data: {
                functionName: "getSpecificConfig"
            },
            success: function (obj, textstatus) {
                if (obj == null) {
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: "Power BI config not found",
                    });
                    return
                }
                PowerBIURL = obj
                dashboardWindow = window.open('backend/pbi_login.php?url=' + obj, "_blank", "height=450px,top=230px,location=no,width=750px, directories=no, menubar=no,titlebar=no,toolbar=no,dependent=on");
                dashboardLoaded = true;
                dashboardWindow.focus()
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                console.log(str);
            }

        });
    } else {
        if (dashboardWindow.closed) {
            dashboardWindow = window.open(PowerBIURL, "_blank", "height=450px,top=230px,location=no,width=750px, directories=no, menubar=no,titlebar=no,toolbar=no,dependent=on");
        }
        console.log(dashboardWindow)
        dashboardWindow.focus();
    }
}

function OnClickCameraFeed() {
    if (videoPinData.length == 0) { // if array is empty, load data...
        LoadVideoPinData(function (data) {
            if (!data) {
                return
            }
            videoPinData = data
            var mydiv = document.getElementById('cameraPinList'); //ul list
            if (!data) {
                return
            }
            for (var i = 0; i < data.length; i++) {
                var ul_li = document.createElement('li'); //CREATE li  
                ul_li.setAttribute('id', "videoID_" + data[i].videoPinID);
                var lyr_icon = document.createElement('img');
                lyr_icon.setAttribute('class', 'fileicon');
                lyr_icon.setAttribute('src', 'Images/icons/camerafeed_window/mp4.png');
                lyr_icon.setAttribute('title', data[i].videoPinName);

                var lbl = document.createElement('label'); // CREATE LABEL.
                lbl.setAttribute('for', data[i].videoPinName);
                // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
                lbl.appendChild(document.createTextNode(data[i].videoPinName));
                // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
                ul_li.appendChild(lyr_icon);
                ul_li.appendChild(lbl);
                if (localStorage.usr_role == "Project Manager" || localStorage.usr_role == "Project Monitor") {
                    ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/remove.png' title='Delete Camera' onclick='deleteVideoPin(this)' class='remove'>"
                    ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/edit.png' title= 'Edit Camera' onclick= 'editVideoPinDetails(this)' class='edit'>"
                }
                ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/play.png' onclick = 'playVideoPin(this)'class='play'>"
                ul_li.innerHTML += "<img src='Images/icons/camerafeed_window/magnifier.png' onclick = 'flyToVideoPin(this)' class='flyto'>"
                mydiv.appendChild(ul_li)

                var myvideoPin = addVideoPin(data[i].videoPinName, data[i].longitude, data[i].latitude, data[i].height, true);
                videoPinsArray.push(myvideoPin);
            };
        });
    } else {
        videoPinsArray.forEach(function (videoPin) {
            videoPin.show = true
        })
    }
}
function OnClickAssetDataTable() {
    agileClickWOFlag = false;
    floatboxTurnOFF()
    var e = window.event;
    var target = e.target || e.srcElement;
    if (target.tagName.toLowerCase() == "td") {
        if (!assetTableCellPicked) {
            assetTableCellPicked = target.parentNode;
            assetTableCellOldColor = target.bgColor;
        } else {
            assetTableCellPicked.style.backgroundColor = assetTableCellOldColor;
            assetTableCellPicked = target.parentNode;
            assetTableCellOldColor = target.bgColor;
        };
        var row = target.parentNode;
        row.style.backgroundColor = '#e6fff7';
        var index = target.parentNode.rowIndex;
        console.log(index);
        modelIndex = index - 1;
        if (localStorage.p_name == "Gandaria Mall") {
            var myDesc = '<table ><tbody >';
            myDesc += '<tr><td>' + "Asset ID :" + myModels[modelIndex].AssetID + '</td></tr>';
            myDesc += '<tr><td>' + "Asset Name :" + myModels[modelIndex].AssetName + '</td></tr>';
            myDesc += '<tr><td>' + "Asset SLA :" + myModels[modelIndex].AssetSLA + '</td></tr>';
            var j = 0;
            while (j < pwAssetData.length) {
                if (pwAssetData[j].AssetID == myModels[modelIndex].AssetID) {
                    myDesc += '<tr><td>' + "Floor :" + pwAssetData[j].Floor + '</td></tr>';
                    myDesc += '<tr><td>' + "Inventory ID :" + pwAssetData[j].InventoryID + '</td></tr>';
                    myDesc += '<tr><td>' + "Asset Category :" + pwAssetData[j].AssetCategory + '</td></tr>';
                    myDesc += '<tr><td>' + "Asset Status :" + pwAssetData[j].AssetStatus + '</td></tr>';
                    myDesc += '<tr><td>' + "Brand :" + pwAssetData[j].Brand + '</td></tr>';
                    myDesc += '<tr><td>' + "Description :" + pwAssetData[j].Description + '</td></tr>';
                    myDesc += '<tr><td>' + "Type :" + pwAssetData[j].Type + '</td></tr>';
                    break;
                }
                j++;
            }
            myDesc += '</tbody></table>';

            if (pwAssetData[j].Floor == '1') {
                for (var i = 0; i < tilesetlist.length; i++) {
                    if (tilesetlist[i].name == "Gandaria Floor 1") {
                        tilesetlist[i].tileset.show = true;
                        $("input[id= 'Gandaria Floor 1']").prop('checked', true);
                    } else if (tilesetlist[i].name == "Gandaria Floor 2") {
                        tilesetlist[i].tileset.show = false;
                        $("input[id= 'Gandaria Floor 2']").prop('checked', false);
                    }
                }

            } else if (pwAssetData[j].Floor == '2') {
                for (var i = 0; i < tilesetlist.length; i++) {
                    if (tilesetlist[i].name == "Gandaria Floor 1") {
                        tilesetlist[i].tileset.show = false;
                        $("input [id= 'Gandaria Floor 1']").prop('checked', false);
                    } else if (tilesetlist[i].name == "Gandaria Floor 2") {
                        tilesetlist[i].tileset.show = true;
                        $("input [id= 'Gandaria Floor 2']").prop('checked', true);
                    }
                }
            }
        }
        else {
            var myDesc = '<table ><tbody >';
            myDesc += '<tr><td>' + "Asset Type : " + myModels[modelIndex].BuildingType + '</td></tr>';
            //myDesc += '<tr><td>' + "Building Name : " + myModels[i].BuildingName + '</td></tr>';
            myDesc += '<tr><td>' + "Asset Owner :" + myModels[modelIndex].BuildingOwner + '</td></tr>';
            myDesc += '<tr><td>' + "Asset ID :" + myModels[modelIndex].AssetID + '</td></tr>';
            myDesc += '<tr><td>' + "Asset Name :" + myModels[modelIndex].AssetName + '</td></tr>';
            myDesc += '<tr><td>' + "Asset SLA :" + myModels[modelIndex].AssetSLA + '</td></tr>';
            myDesc += '</tbody></table>';

            console.log("dasdas")
            //this is for MMSP project
            if (myModels[modelIndex].AssetID == "JBALB_FM_001") {
                var path = "Data/Others/nrwmanager_csv_export_2020_02_08_10_00_44.json";
                getAssetChartData(path);
                $("#floatbox-tabs").children().each(function () {
                    if ($(this).is(":contains('Bar Chart')") || $(this).is(":contains('Line Chart')") || $(this).is(":contains('Data Table')") || $(this).is(":contains(Progress')") || $(this).is(":contains('Land')")) {
                        $(this).hide();
                    } else if ($(this).is(":contains('Chart')")) {
                        $(this).show();
                    }
                });


            } else if (myModels[modelIndex].AssetID == "JBALB_OFM_001") {
                var path = "Data/Others/nrwmanager_csv_export_2020_02_08_10_01_57.json";
                getAssetChartData(path);
                $("#floatbox-tabs").children().each(function () {
                    if ($(this).is(":contains('Bar Chart')") || $(this).is(":contains('Line Chart')") || $(this).is(":contains('Data Table')") || $(this).is(":contains(Progress')") || $(this).is(":contains('Land')")) {
                        $(this).hide();
                    } else if ($(this).is(":contains('Chart')")) {
                        $(this).show();
                    }
                });

            }
        }





        var cartesian = new Cesium.Cartesian3(myModels[modelIndex].X, myModels[modelIndex].Y, myModels[modelIndex].Z);
        var cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian);
        var lon = Cesium.Math.toDegrees(cartographicPosition.longitude).toFixed(6);
        var lat = Cesium.Math.toDegrees(cartographicPosition.latitude).toFixed(6);
        $(".floatbox#floatbox").css("top", "50%")
        $(".floatbox#floatbox").css("left", "50%")

        $(".floatbox-body .scrollcontainer#page1").html(myDesc);
        $(".floatbox-header h4").html(myModels[modelIndex].AssetName)
        $(".floatbox#floatbox").css("transform", "translate(-50%, -100%)")

        viewer.camera.flyTo({
            destination: new Cesium.Cartesian3.fromDegrees(lon, lat, 50),
            complete: function () {
                $(".floatbox-body .scrollcontainer#page1").html(myDesc);
                $(".floatbox-header h4").html(myModels[modelIndex].AssetName)
                $(".floatbox#floatbox").fadeIn(150)
                cameraClickPosition = {
                    lon: lon,
                    lat: lat,
                    alt: 0
                };
            }
        });

    };
}

function neutralAllMenu() {
    $(".admin-function.active").removeClass("active")
    $(".bottommenu").css("display", "none")

    $('.sidebar').animate({
        width: '0'
    }, 100, function () {
        // $('.sidebar').css('width', '25%')
        $(this).css('display', 'none')
        $('#function9').removeClass('active');
    })
    $(".sidemenu .third-button .tool").removeClass('active');
    $(".sidemenu .third-button .admin").removeClass('active');
    $(".sidemenu .third-button .measure").removeClass('active');
    $(".sidemenu .third-button .nav").removeClass('active');
    $(".sidemenu .third-button.active").removeClass('active');
    $(".sidemenu .third-button").css('display', 'none');
    //$(".second-button").fadeIn().css({width:70}).animate({width:0}, 200)
    //$(".second-button").css('display', 'none');
    //$(".second-button .button-menu.active").removeClass('active');
    $(".second-button").css({
        'padding-right': 30
    }).animate({
        'padding-right': 0
    }, 100, function () {
        $(this).css('padding-right', '30px')
        $(this).css('display', 'none')
        $(this).removeClass('active');
        $(".second-button .button-menu.active").removeClass('active');
    })
}

//tabs panel button functions
$('.tabbutton').on('click', function () {
    $(".tabbutton.active").removeClass("active");
    $(this).addClass("active");
    let $paneltoOpen = $(this).attr('rel')
    $('.optioncontainer .panel.active').removeClass('active')
    $('.optioncontainer .panel#' + $paneltoOpen).addClass('active')
    //$('.optioncontainer .panel#'+paneltoOpen).css('display','block')
});

////uploadform close button
function OnClickUploadClose() {
    // close progress upload as well
    $("#progressUploadForm").css('display', 'none');


    $("#uploadform").css('display', 'none');
    $("#uploadform").removeClass('active');
    $(".sidemenu #group4 .admin.active").removeClass('active');
    geoDataClear()
}

function OnClickDIVbtn() {
    $('#uploadform').css('display', 'block')
    $("#filetb").hide();
    uploadType = "KML"
    $(".tabbutton.active").removeClass('active');
    $(".tabbutton[rel=kmldiv]").addClass('active');
    $(".uploadtool #kmldiv.itemscontainer").addClass('active');

    OnClickKML();
}
/// function to close the manage layer/data form///
function OnClickManageLayerCancel() {
    $('#managelayer').fadeOut(150)
    $('#managelayer').removeClass('active')
    $('.sidemenu #group4 .admin.active').removeClass('active')
}

function OnClickAddCameraCancel() {
    hideinstruction()
    instructions('')
    event.preventDefault();
    //$("#addcameraModal").fadeOut(100)
    // CameraHeight(false);
    jqwidgetBox("cameraheight", false);
    closeAllWindow()
    $("#addcamera.active").removeClass('active')
}

function OnClickReviewTools() {
    $('#reviewTool').css('display', 'block')
}

function lantaibutton(ele) {
    var floor = $(ele).closest('td').text();
    console.log(floor);
    if (floor == '1') {
        for (var i = 0; i < tilesetlist.length; i++) {
            if (tilesetlist[i].name == "Gandaria Floor 1") {
                tilesetlist[i].tileset.show = true;
                $("input[id= 'Gandaria Floor 1']").prop('checked', true);
            } else if (tilesetlist[i].name == "Gandaria Floor 2") {
                tilesetlist[i].tileset.show = false;
                $("input[id= 'Gandaria Floor 2']").prop('checked', false);
            }
        }

    } else if (floor == '2') {
        for (var i = 0; i < tilesetlist.length; i++) {
            if (tilesetlist[i].name == "Gandaria Floor 1") {
                tilesetlist[i].tileset.show = false;
                $("input [id= 'Gandaria Floor 1']").prop('checked', false);
            } else if (tilesetlist[i].name == "Gandaria Floor 2") {
                tilesetlist[i].tileset.show = true;
                $("input [id= 'Gandaria Floor 2']").prop('checked', true);
            }
        }
    }
    FacilitiesSummary(false);
}


function getPWTableData() {

    $.ajax({
        type: "GET",
        url: 'BackEnd/getPWTableData.php',
        dataType: 'json'

        ,
        success: function (obj, textstatus) {
            console.log(obj);
            $('#pwPage1Table').empty();
            $('#pwPage2Table').empty();
            $('#pwPage3Table').empty();
            var p1data = obj['page1'];
            var p2data = obj['page2'];
            var p3data = obj['page3'];

            for (var i = 0; i < p1data.length; i++) {
                var mytr = $("<tr></tr>");
                mytr.append("<td>" + p1data[i].NR + "</td>");
                mytr.append("<td>" + p1data[i].NAME + "</td>");
                mytr.append("<td>" + p1data[i].Floor + "<button onclick='lantaibutton(this)'></button></td>");
                mytr.append("<td>" + p1data[i].LAYOUTCODE + "</td>");
                mytr.append("<td>" + p1data[i].InventoryID + "</td>");
                mytr.append("<td>" + p1data[i].AssetName + "</td>");
                mytr.append("<td>" + p1data[i].QNTY + "</td>");
                $('#pwPage1Table').append(mytr);

            };

            for (var i = 0; i < p2data.length; i++) {
                var mytr = $("<tr></tr>");
                mytr.append("<td>" + p2data[i].NR + "</td>");
                mytr.append("<td>" + p2data[i].NAME + "</td>");
                mytr.append("<td>" + p2data[i].Floor + "<button onclick='lantaibutton(this)'></button></td>");
                mytr.append("<td>" + p2data[i].LAYOUTCODE + "</td>");
                mytr.append("<td>" + p2data[i].InventoryID + "</td>");
                mytr.append("<td>" + p2data[i].AssetName + "</td>");
                mytr.append("<td>" + p2data[i].QNTY + "</td>");
                $('#pwPage2Table').append(mytr);

            };

            for (var i = 0; i < p3data.length; i++) {
                var mytr = $("<tr></tr>");
                mytr.append("<td>" + p3data[i].NR + "</td>");
                mytr.append("<td>" + p3data[i].NAME + "</td>");
                mytr.append("<td>" + p3data[i].Floor + "<button onclick='lantaibutton(this)'></button></td>");
                mytr.append("<td>" + p3data[i].LAYOUTCODE + "</td>");
                mytr.append("<td>" + p3data[i].InventoryID + "</td>");
                mytr.append("<td>" + p3data[i].AssetName + "</td>");
                mytr.append("<td>" + p3data[i].QNTY + "</td>");
                $('#pwPage3Table').append(mytr);

            };


        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);

            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Error in fetching the Projectwise folders!. Please click the browse again to fetch.'
            });
        }
    });

}


function OnClickPwCredentialsSave() {
    var username = $('#pwUserName').val();
    var password = $('#pwPassword').val();
    if (username == "" || password == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please enter values for username and password!',
        });
        return;
    };
    //console.log(username + " " + password);
    document.getElementById('pwCredentials').style.display = 'none';
   
    $.ajax({
        type: "POST",
        url: 'BackEnd/doc_viewer.php',
        dataType: 'json',
        data: {
            fileUrl: fileUrl,
            fileName: fileName,
            userName: username,
            passWord: password
        },
        success: function (obj, textstatus) {
            console.log(obj);
            var message = obj['msg'];
            console.log(message);
            if(message == "success") {
                
                var url = obj['fileurl'];
                window.open(url);
                pwloginCredentials = true;
            } else  if("download".includes(message)){
                var url = obj['fileurl'];
                console.log(url);
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    //var url = URL.createObjectURL(data['d']);
                    link.setAttribute("href", url);
                    link.setAttribute("download", fileName);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
                pwloginCredentials = true;
            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: message
                });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: str
            });
        }
    });
    

}

function OnClickPwCredentialsCancel() {
    document.getElementById('pwCredentials').style.display = 'none';


}

function OnClickImodelJS() {
    if (!bentleyCredentialsflag) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.responseText == " ") {
                    document.getElementById('bentleyUserName').value = "";
                    document.getElementById('bentleyPassword').value = "";
                    document.getElementById('BentleyCredential').style.display = 'block';
                } else {
                    console.log(" data");
                    myWindow = window.open("BackEnd/jq.php", "_blank", "width=200, height=150");

                    setTimeout(() => { myWindow.close(); }, 4000);
                    setTimeout(() => { window.open("https://wsg.reveronconsulting.com/imodelJS"); }, 6000); //#demo

                }
            }
        });
        xhr.open("GET", "BackEnd/bentley_login.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send();
    } else {
        console.log("flag true");
        myWindow = window.open("BackEnd/jq.php", "_blank", "width=200, height=150");

        setTimeout(() => { myWindow.close(); }, 4000);
        setTimeout(() => { window.open("https://wsg.reveronconsulting.com/imodelJS"); }, 6000); //#demo
    }

}

function OnClickCredentialSave() {
    event.preventDefault();
    var name = $('#bentleyUserName').val();
    var pwd = $('#bentleyPassword').val();
    if (name == "" || pwd == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please enter values for username and password!',
        });
        return;
    }
    $.ajax({
        type: "POST",
        url: 'BackEnd/saveBentleyInfo.php',
        dataType: 'json',
        data: {
            userName: name,
            passWord: pwd
        },
        success: function (obj, textstatus) {
            console.log(obj);
            if (obj['msg'] == "success") {
                bentleyCredentialsflag = true;
                document.getElementById('BentleyCredential').style.display = 'none';
                myWindow = window.open("BackEnd/jq.php", "_blank", "width=200, height=150");

                setTimeout(() => {
                    myWindow.close();
                }, 4000);
                setTimeout(() => {
                    window.open("https://wsg.reveronconsulting.com/imodelJS");
                }, 6000); //#demo

            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj['msg']
                });
                document.getElementById('BentleyCredential').style.display = 'none';
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: str
            });
            document.getElementById('BentleyCredential').style.display = 'none';
        }
    });


}

function OnClickCredentialCancel() {
    event.preventDefault();
    document.getElementById('BentleyCredential').style.display = 'none';
}

function PwIssueButton() {
    console.log("No function defined")
}

// function for cliking the AIC button in measure tool //
function OnClickAic() {
    AicViewer(true)
    $(".aic_popup#aicpage").css("display", "block")
}


function OnClickEarthView() {
    if (!flagLoadedEarth) {
        LoadEarthPinData(function (myResponse) {
            earthPinData = JSON.parse(myResponse);
            for (var i = 0; i < earthPinData.length; i++) {
                viewer.entities.remove(earthPinsArray[i]);
            }
            earthPinsArray.splice(0, earthPinsArray.length);
            $("#imagePinList").html("")
            if (earthPinData == 0) {
                $("#imagePinList").html("").append(
                    "<h3>There are no details stored for Earth View</h3>"
                )
            }
            else {
                var mydiv = document.getElementById('imagePinList'); //ul list
                for (var i = 0; i < earthPinData.length; i++) {
                    var ul_li = document.createElement('li'); //CREATE li  
                    ul_li.setAttribute('id', "imageID_" + earthPinData[i].imagePinID);
                    var lyr_icon = document.createElement('img');
                    lyr_icon.setAttribute('class', 'fileicon');
                    lyr_icon.setAttribute('src', 'Images/icons/imagefeed_window/image.png');
                    lyr_icon.setAttribute('title', earthPinData[i].imagePinName);

                    var lbl = document.createElement('label'); // CREATE LABEL.
                    lbl.setAttribute('for', earthPinData[i].imagePinName);
                    // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
                    lbl.appendChild(document.createTextNode(earthPinData[i].imagePinName));
                    // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT
                    ul_li.appendChild(lyr_icon);
                    ul_li.appendChild(lbl);
                    if (localStorage.usr_role == "Project Manager" || localStorage.usr_role == "Project Monitor") {
                        ul_li.innerHTML += "<img src='Images/icons/imagefeed_window/remove.png' title='Delete Image' onclick='deleteImagePin(this)' class='remove'>"
                        ul_li.innerHTML += "<img src='Images/icons/imagefeed_window/edit.png' title= 'Edit Image' onclick= 'editImagePinDetails(this)' class='edit'>"
                    }
                    ul_li.innerHTML += "<img src='Images/icons/imagefeed_window/openImage.png' title='View Image' onclick = 'openEarthImagePin(this)'class='play'>"
                    mydiv.appendChild(ul_li)

                    var myEarthPin = addEarthPin(earthPinData[i].imagePinName, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, true);
                    earthPinsArray.push(myEarthPin);
                };
            }

        });
    }
    else {
        jqwidgetBox("earthFeed-jqx", 1);
        if (earthPinData == 0) {
            $("#imagePinList").html("").append(
                "<h3>There are no details stored for Earth View</h3>"
            )
        }
    }

}

//support
function OnClickRaiseSupport(){
    window.open('BackEnd/jogetloginSupport.php', '_blank');
   
}

function onClickAssetList(ele) {
    var assetType = $(ele).attr("rel");
    if(assetType == 'list_networkSite'){
        $("#assetListIframe").hide();
        $("#list_networkSite_tab").show()
    }else{
        $("#assetListIframe").show();
        $("#list_networkSite_tab").hide()
    }
    if (!JOGETLINK) return;
    $("#notiDrop").removeClass("active");
    $("#notiDrop").css("display", "none");

    $(ele).parent().find(".active").removeClass("active");
    $("#assetListIframe").addClass("active");
    $("#" + assetType).addClass("active");

    $(".conopTab").removeClass("active");
    $(".page-container.active").css("display", "none");
    $(".page-container.active").removeClass("active");

    resetJogetConOpDraw();

    $("#assetListIframe iframe").unbind("load");
    if(JOGETLINK['asset_'+assetType]){
        var url = JOGETLINK['asset_'+assetType];
    }

    $("#assetListIframe iframe")
    .attr("src", url);
    zoomToGetData();
}

function OnClickPaveAnalysis(){
    if($('.assetAnalysisTab.active')){
        $('.assetAnalysisTab.active').click();
    }
    jqwidgetBox("paveanalysis", 1);
    
}

function onClickAssetAnalysis(ele){
    $("#assetPaveAnalysis iframe").attr("src","");
    $('#tabPaveAnalysis > ul > li').removeClass('active');
    $(ele).addClass("active");
    var tabId = $(ele).attr("id");
    // FWDAnalysis MLPAnalysis
    $("#assetPaveAnalysis iframe").attr("src", 'Components/assetAnalysis/'+tabId).css("height", "100%").css("width", "100%");
}

function onClickAssetAnalysisUpload(ele){
    var dataToUpload = $(ele).data("upload");
    jqwidgetBox("analysisUpl", 1);
    $("iframe#analysisUplContainer").attr("src", 'Components/assetAnalysis/analysisUpl.php?upload='+dataToUpload).css("height", "100%").css("width", "100%").css("border","none");
}