var datasource, layer, popup, startPoint, endPoint, abRouting, resultsPanel;
var startPoint = false;
var endPoint = false;
var setPointAFlag = false;
var setPointBFlag = false;
var addedRouteID = [];

// to store value for routing matrix
var teamInfo, woInfo;
var suggestedRoute = [];
var addedSuggestedRouteID = [];

// object property that exclude in search function
var skipKey = ["color", "image", "imageUrl", "offset", "Array", "AZMap_DEV2", "anchor", "size", "_azureMapsShapeId"];

//The minimum number of characters needed in the search input before a search is performed.
var minSearchInputLength = 2;

//The number of ms between key strokes to wait before performing a search.
var keyStrokeDelay = 150;

//Store a reference to the Search Info Panel.

// custom popup
var popupTemplate = '<div class="customInfobox"><div class="name">Info</div>Test</div>';

//Create a popup which we can reuse for each result.
popup = new atlas.Popup();

$(document).ready(function () {

    resultsPanel = document.getElementById("results-panel");

    // for multi select 
    $('#crew').multiSelect({
        // selectableHeader: "<div class='custom-header'>Available crew</div>",
    });

    // for multi select 
    $('#wo').multiSelect({
        // selectableHeader: "<div class='custom-header'>Available crew</div>",
    });

    // hide all dropdown when click anywhere on windows
    $(window).click(function (e) {
        // alert(e.target.id); // gives the element's ID 
        // alert(e.target.className); // gives the elements class(es)
        $('.search-info-box').hide();
    });

    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        center: [111.58652501186822, 2.0812257669426657],
        zoom: 11,
        view: 'Auto',

        //Add your Azure Maps key to the map SDK. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: 'p937L1lSyql9LO4CR0h0S06EChBBsOVPbuLROaCrtn8'
        }
    });

    //Wait until the map resources are ready.
    map.events.add('ready', function () {

        //Create a data source and add it to the map.
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //Add a simple data layer for rendering the data.
        layer = new atlas.layer.SimpleDataLayer(datasource);
        map.layers.add(layer);

        atlas.io.read('data/KM_Marker.kml').then(async r => {
            if (r) {
                //Check to see if there are any icons in the data set that need to be loaded into the map resources.
                if (r.icons) {
                    //For each icon image, create a promise to add it to the map, then run the promises in parrallel.
                    var imagePromises = [];

                    //The keys are the names of each icon image.
                    var keys = Object.keys(r.icons);

                    if (keys.length !== 0) {
                        keys.forEach(function (key) {
                            imagePromises.push(map.imageSprite.add(key, r.icons[key]));
                        });

                        await Promise.all(imagePromises);
                    }
                }

                //Load all features.
                if (r.features && r.features.length > 0) {
                    datasource.add(r.features);
                }

                //Load all ground overlays.
                if (r.groundOverlays && r.groundOverlays.length > 0) {
                    map.layers.add(r.groundOverlays);
                }

                //If bounding box information is known for data, set the map view to it.
                // if (r.bbox) {
                //     map.setCamera({
                //         bounds: r.bbox,
                //         padding: 50,
                //         zoom: 14
                //     });
                // }
            }
        });

        //Add key up event to the search box. 
        searchInput = document.getElementById("search-input");
        searchInput.addEventListener("keyup", function (e) {
            searchInputKeyup(e, searchInput, resultsPanel);
        });

        // search for routing a
        raSearchInput = document.getElementById("point-a");
        var raResultPanel = document.getElementById("search-info-point-a");
        raSearchInput.addEventListener("keyup", function (e) {
            searchInputKeyup(e, raSearchInput, raResultPanel, 'selectPointA');
        });

        // search for routing b
        rbSearchInput = document.getElementById("point-b");
        var rbResultPanel = document.getElementById("search-info-point-b");
        rbSearchInput.addEventListener("keyup", function (e) {
            searchInputKeyup(e, rbSearchInput, rbResultPanel, 'selectPointB');
        });

        //////////////// Routing Start
        //Add a layer for rendering the route lines and have it render under the map labels.
        map.layers.add(new atlas.layer.LineLayer(datasource, null, {
            strokeColor: '#2272B9',
            strokeWidth: 5,
            lineJoin: 'round',
            lineCap: 'round'
        }), 'labels');

        //Add a layer for rendering point data.
        map.layers.add(new atlas.layer.SymbolLayer(datasource, null, {
            iconOptions: {
                image: ['get', 'icon'],
                allowOverlap: true
            },
            textOptions: {
                textField: ['get', 'title'],
                offset: [0, 1.2]
            },
            filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']] //Only render Point or MultiPoints in this layer.
        }));

        //Add a hover event to the symbol layer.
        map.events.add('click', function (e) {
            var position = [e.position[0], e.position[1]];
            // console.log(position);
            resultsPanel.innerHTML = '';
            if (setPointAFlag) {
                setPoint('a', position);
                setPointAFlag = false;
            }
            if (setPointBFlag) {
                setPoint('b', position);
                setPointBFlag = false;
            }
        });

        // add crew and work order info
        loadWOData('data/wo.geojson');
        loadCrewData('data/crew.geojson');
    });

    //onchange checkbox for route date and time
    $('#show-date-checkbox').removeAttr('checked');
    $('#show-date-checkbox').change(function () {
        if ($(this).is(":checked")) {
            $(".route-datetime").show();
        } else {
            $(".route-datetime").hide();
        }
        setRoute();
    });

    $('#date').change(function () {
        if ($('#show-date-checkbox').is(":checked")) {
            dval = $('#date').val();
            var j = new Date(dval);
            var k = new Date();
            if (k.toDateString() != j.toDateString() && (j - k) < 0) {
                $('#error-time').show();
            } else {
                $('#error-time').hide();
            }
            if (j) setRoute();
        }
    });

    $('#time').change(function () {
        dval = $('#date').val();
        tval = $('#time').val();
        if ($('#show-date-checkbox').is(":checked")) {
            var l = new Date(dval + ' ' + tval);
            var k = new Date();
            if ((l - k) < 0) {
                $('#error-time').show();
            } else {
                $('#error-time').hide();
            }
            if (l) setRoute();
        }
    });

    $('#time-type').change(function () {
        setRoute();
    });

    $("#category").change(function () {
        let cat = $(this).val();
        console.log(cat);

        // deselect all for both
        $('#crew').multiSelect('deselect_all');
        $('#wo').multiSelect('deselect_all');

        if (cat == "all") {
            //show all
            $("#crew option").show();
            $("#wo option").prop('selected', true).show();
        } else {
            // only show related to this cat
            var crewOpt = $("#crew").find("option");
            crewOpt.each(function () {
                let crewTypeStr = $(this).data('type');
                let crewType = crewTypeStr.split(',');
                if (crewType.includes(cat)) {
                    $(this).show()
                } else {
                    $(this).hide()
                }
            });

            var woOpt = $("#wo").find("option");
            woOpt.each(function () {
                let woType = $(this).data('type');
                if (woType == cat) {
                    $(this).show();
                    $(this).prop('selected', true);
                } else {
                    $(this).hide();
                }
            });
        }
        // refresh both
        $('#crew').multiSelect("refresh");
        $('#wo').multiSelect("refresh");

        // if no work order promp and disabled button
        // check all select value for work order and 
        if ($("#wo").children("option:selected").length == 0) {
            $(".rm-error-msg").html("No work order found.").show();
            $('#rm-process').attr('disabled', true);
        } else {
            $('#rm-process').attr('disabled', false);
            $(".rm-error-msg").html("").hide();
        }
    });

    // Optimise maintenance crew button
    $("#opti-crew-wo").change(optiMaintCrewShowNearWo);

});

function itemClicked(id, showPopupFlag = true) {
    // var shape = datasource.getShapeById(id);

    //Center the map over the clicked item from the result list.
    var shape = datasource.getShapeById(id);
    if (showPopupFlag) {
        showPopup(shape);
    }
    map.setCamera({
        center: shape.getCoordinates(),
        zoom: 17
    });
}

function searchInputKeyup(e, srchInp, resPanel, fn) {
    centerMapOnResults = false;
    if (srchInp.value.length >= minSearchInputLength) {
        if (e.keyCode === 13) {
            centerMapOnResults = true;
        }
        //Wait 100ms and see if the input length is unchanged before performing a search. 
        //This will reduce the number of queries being made on each character typed.
        setTimeout(function () {
            if (searchInputLength == srchInp.value.length) {
                search(resPanel, srchInp.value, fn);
            }
        }, keyStrokeDelay);
    } else {
        resPanel.innerHTML = '';
    }
    searchInputLength = srchInp.value.length;
}

function search(resPanel, query, fn = 'itemClicked') {
    // popup.close();
    $(resPanel).hide();
    resPanel.innerHTML = '';

    var allShapes = datasource.getShapes();
    var filteredShape = allShapes.filter(function (el) {
        let prop = el.data.properties;
        let srchStr = '';
        Object.keys(prop).forEach(function (key) {
            if (!skipKey.includes(key)) {
                if (typeof prop[key] === 'object' && prop[key] != null && prop[key] != 'undefined') {
                    srchStr = srchStr + ' ' + prop[key].value;
                } else {
                    srchStr = srchStr + ' ' + prop[key];
                }
            };
        });
        // if (el.data.properties.KILOMETER) {
        // var searchString = el.data.properties.KILOMETER.value+' '+el.data.properties.Section.value; 
        return srchStr.toLowerCase().includes(query.toLowerCase());
        // }
        return false;
    });

    // based on kml data
    var html = [];
    filteredShape.forEach(function (el1, id1) {
        var shape = datasource.getShapeById(el1.data.id);
        var sProp = shape.getProperties();
        html.push('<li onclick="' + fn + '(\'', el1.data.id, '\')"">');
        if (sProp.KILOMETER) {
            html.push(sProp.Section.value + ' - ' + sProp.KILOMETER.value);
        } else if (sProp.name) {
            html.push(sProp.name);
        } else if (sProp.Name) {
            html.push(sProp.Name);
        } else {
            // console.log(sProp);
        }
        html.push('</li>');
    });
    resPanel.innerHTML = html.join('');

    //Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    //Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    //Construct the SearchURL object
    var searchURL = new atlas.service.SearchURL(pipeline);

    searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
        lon: map.getCamera().center[0],
        lat: map.getCamera().center[1],
        maxFuzzyLevel: 4,
        view: 'Auto'
    }).then((results) => {

        //Extract GeoJSON feature collection from the response and add it to the datasource
        var data = results.geojson.getFeatures();
        datasource.add(data);

        if (centerMapOnResults) {
            map.setCamera({
                bounds: data.bbox
            });
        }
        // console.log(data);
        //Create the HTML for the results list.
        var html = [];
        for (var i = 0; i < data.features.length; i++) {
            var r = data.features[i];
            // html.push('<li onclick="itemClicked(\'', r.id, '\')" onmouseover="itemHovered(\'', r.id, '\')">')
            html.push('<li onclick="' + fn + '(\'' + r.id + '\')"">');
            html.push('<div class="title">');
            if (r.properties.poi && r.properties.poi.name) {
                html.push(r.properties.poi.name);
            } else {
                html.push(r.properties.address.freeformAddress);
            }
            html.push('</div><div class="info">' + r.properties.type + ': ' + r.properties.address.freeformAddress + '</div>');
            if (r.properties.poi) {
                if (r.properties.phone) {
                    html.push('<div class="info">phone: ' + r.properties.poi.phone + '</div>');
                }
                if (r.properties.poi.url) {
                    html.push('<div class="info"><a href="http://' + r.properties.poi.url + '">http://' + r.properties.poi.url + '</a></div>');
                }
            }
            html.push('</li>');
            resPanel.innerHTML += html.join(' ');
        }
        $(resPanel).show();
    });
}

function showPopup(shape) {
    var properties = shape.getProperties();
    var html = [];

    // special handling for kml data
    $(".popup-collection-container").hide();
    if (!properties.poi) {
        html.push('<div class="azure-maps-control-popup-template-title">' + properties.name + '</div>');
        html.push('<body><div class="azure-maps-control-popup-template" style="padding:0;width:365px"><table class="azure-maps-control-popup-template-table"><tbody>');
        Object.keys(properties).forEach(function (key) {
            if (!skipKey.includes(key)) {
                if (typeof properties[key] === 'object' && properties[key] != null && properties[key] != 'undefined') {
                    html.push('<tr><th>' + key + '</th><td>' + properties[key].value + '</td></tr>');
                } else {
                    html.push('<tr><th>' + key + '</th><td>' + properties[key] + '</td></tr>');
                }
            };
        });
        html.push('</tbody></table></div></body>');

    } else {
        //Create the HTML content of the POI to show in the popup.
        html.push('<div class="poi-box">');
        //Add a title section for the popup.
        html.push('<div class="poi-title-box"><b>');

        if (properties.poi && properties.poi.name) {
            html.push(properties.poi.name);
        } else {
            html.push(properties.address.freeformAddress);
        }
        html.push('</b></div style="margin:20px;">');
        //Create a container for the body of the content of the popup.
        html.push('<div class="poi-content-box">');
        html.push('<div class="info location">', properties.address.freeformAddress, '</div>');
        if (properties.poi) {
            if (properties.poi.phone) {
                html.push('<div class="info phone">', properties.phone, '</div>');
            }
            if (properties.poi.url) {
                html.push('<div><a class="info website" href="http://', properties.poi.url, '">http://', properties.poi.url, '  </a></div>');
            }
        }
        html.push('</div></div>');
    }
    $(".popup-collection-container").show();

    popup.setOptions({
        position: shape.getCoordinates(),
        content: html.join('')
    });
    popup.open(map);
}

function formatCoordinate(c, d = 4) {
    return c.toFixed(d);
}

// pointA - start, pointB - end
function setPoint(point, coordinate, title = false, ico = 'pin-round-blue') {
    var raInput = document.getElementById("point-" + point);
    raInput.value = (title) ? title : formatCoordinate(coordinate[0]) + ', ' + formatCoordinate(coordinate[1]);

    if (point == 'a') {
        // remove old start point before create new
        if (typeof startPoint == 'object') {
            datasource.remove(startPoint);
        }

        startPoint = new atlas.data.Feature(new atlas.data.Point(coordinate), {
            title: (title) ? title : 'Start',
            icon: ico,
        });
        startPoint.id = 'route-start-point';
        datasource.add(startPoint);

    } else {
        if (typeof endPoint == 'object') {
            datasource.remove(endPoint);
        }
        endPoint = new atlas.data.Feature(new atlas.data.Point(coordinate), {
            title: (title) ? title : 'End',
            icon: "ico",
        });
        endPoint.id = 'route-end-point';
        datasource.add(endPoint);
    }
    //clear the search
    var raResultPanel = document.getElementById("search-info-point-" + point);
    $(raResultPanel).hide();
    raResultPanel.innerHTML = '';

    // set the route
    setRoute();
}

function pickPointA() {
    setPointAFlag = true;
    setPointBFlag = false;
}

function pickPointB() {
    setPointBFlag = true;
    setPointAFlag = false;
}

function selectPointA(id) {
    var shape = datasource.getShapeById(id);
    var shapeProp = shape.getProperties();

    var title = false;
    if (shapeProp.type == 'POI') {
        title = shapeProp.poi.name;
    } else if (shapeProp.KILOMETER) {
        title = shapeProp.Section.value + ' - ' + shapeProp.KILOMETER.value;
    } else if (shapeProp.Name) {
        title = shapeProp.Name;
    } else if (shapeProp.name) {
        title = shapeProp.name;
    }

    setPoint('a', shape.getCoordinates(), title);
}
function selectPointB(id) {
    var shape = datasource.getShapeById(id);
    var shapeProp = shape.getProperties();

    // populate the input with some value        
    var title = false;
    if (shapeProp.type == 'POI') {
        title = shapeProp.poi.name;
    } else if (shapeProp.KILOMETER) {
        title = shapeProp.Section.value + ' - ' + shapeProp.KILOMETER.value;
    } else if (shapeProp.Name) {
        title = shapeProp.Name;
    } else if (shapeProp.name) {
        title = shapeProp.name;
    }

    setPoint('b', shape.getCoordinates(), title);
}

function setRoute() {

    if (!startPoint || !endPoint || !startPoint.geometry || !endPoint.geometry) return;


    map.setCamera({
        bounds: atlas.data.BoundingBox.fromData([startPoint, endPoint]),
        padding: 80
    });

    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);

    //Start and end point input to the routeURL
    var coordinates = [[startPoint.geometry.coordinates[0], startPoint.geometry.coordinates[1]], [endPoint.geometry.coordinates[0], endPoint.geometry.coordinates[1]]];

    var routeOptions = { traffic: true };

    // if date and time is set then add the options
    if ($('#show-date-checkbox').is(":checked")) {
        var date = $('#date').val();
        var time = $('#time').val();
        if (date) {
            time = (time) ? time : '00:00';
            routeOptions.departAt = date + 'T' + time;
        }
    }

    //Make a search route request
    routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates, routeOptions).then((directions) => {
        //Remove old route.
        if (addedRouteID.length != 0) {
            datasource.remove(addedRouteID);
            addedRouteID = [];
        }
        abRouting = directions.geojson.getFeatures();
        // adding to first index
        datasource.add(abRouting, 0);
        var lastAddId = datasource.shapes[0].getId();
        addedRouteID.push(lastAddId);
    });
}

function getTeamShapeId() {
    var teamArr = [];
    datasource.shapes.forEach(function (j, k) {
        if (j.data.properties.identifier && j.data.properties.identifier == 'MT') {
            let v = datasource.getShapeById(j.data.id);
            teamArr.push(v);
        }
    })
    return teamArr;
}

function getWOShapeId() {
    var woArr = [];
    datasource.shapes.forEach(function (j, k) {
        if (j.data.properties.identifier && j.data.properties.identifier == 'WO') {
            let v = datasource.getShapeById(j.data.id);
            woArr.push(v);
        }
    })
    return woArr;
}

function getSelectedTeamInfo() {
    var ret = [];

    crewSel = $("#crew").children("option:selected");
    crewSel.each(function () {
        let q = [];
        let cId = $(this).val();

        let o = datasource.getShapeById(cId);
        let l = o.getProperties();
        let g = o.getCoordinates();

        q.name = (l.name) ? l.name : l.Name;
        q.coordinate = [g[0], g[1]];
        q.shapeInfo = o;
        ret.push(q);
    });
    return ret;
}

function getSelectedWOInfo() {
    var ret = [];
    woSel = $("#wo").children("option:selected");
    woSel.each(function () {
        let q = [];
        let cId = $(this).val();

        let o = datasource.getShapeById(cId);
        let l = o.getProperties();
        let g = o.getCoordinates();

        q.name = (l.name) ? l.name : l.Name;
        q.coordinate = [g[0], g[1]];
        q.shapeInfo = o;
        ret.push(q);
    });
    return ret;
}

function loadWOData(url) {
    // move this to be param passed to this function
    // let url = 'data/wo.geojson';
    atlas.io.read(url).then(r => {
        if (r) {
            // change it to custom icon

            //Update the features in the data source.
            datasource.add(r);

            let woShape = getWOShapeId();
            woShape.forEach(function (el, idx) {
                let woId = el.getId();
                let woProp = el.getProperties();
                $('#wo').append('<option value="' + woId + '" data-type = "' + woProp.Type + '">' + woProp.Name + '</option>');
                // apped another dropdown for Optimise Maintenance Crew
                $('#opti-crew-wo').append('<option value="' + woId + '" data-type = "' + woProp.Type + '">' + woProp.Name + '</option>');
            });
            $('#wo').multiSelect('refresh');
            $('#wo').multiSelect('select_all')
        }
    });
}

function loadCrewData(url) {
    atlas.io.read(url).then(r => {
        if (r) {
            // change it to custom icon with header

            //Update the features in the data source.
            datasource.add(r);

            let crewShape = getTeamShapeId();
            crewShape.forEach(function (el, idx) {
                let crewId = el.getId();
                let crewProp = el.getProperties();
                $('#crew').append('<option value="' + crewId + '" data-type = "' + crewProp.Type + '">' + crewProp.Name + '</option>');
                $('#crew').multiSelect('addOption', { value: crewId, text: crewProp.Name });
            });
            $('#crew').multiSelect('refresh');
        }
    });
}

function checkRouteDistance() {
    var crewSel = getSelectedTeamInfo();
    var woSel = getSelectedWOInfo();
    var promises = [];
    $(".route-matrix-loader").show();
    crewSel.forEach(function (cEl, cIdx) {
        woSel.forEach(function (wEl, wIdx) {
            var coordinates = [cEl.coordinate, wEl.coordinate];
            promises.push(routeDirection(coordinates));
        })
    });
    let suggestObj = {};
    Promise.all(promises).then(function (res) {
        var i, j, temp, chunk = 2, crewIdx;
        var chunk = woSel.length;
        for (i = 0, j = res.length, crewIdx = 0; i < j; i += chunk, crewIdx++) {
            temp = res.slice(i, i + chunk);
            temp.forEach(function (ele, idx) {
                let routeId = 'route-' + crewIdx + idx;
                suggestedRoute[routeId] = ele.geojson.getFeatures();
                let rSummary = ele.routes[0].summary;

                if (!suggestObj[woSel[idx].name]) {
                    suggestObj[woSel[idx].name] = [];
                }

                if (suggestObj[woSel[idx].name].lengthInMeters) {
                    if (suggestObj[woSel[idx].name].lengthInMeters > rSummary.lengthInMeters) {
                        suggestObj[woSel[idx].name]['team'] = crewSel[crewIdx].name;
                        suggestObj[woSel[idx].name]['lengthInMeters'] = rSummary.lengthInMeters;
                        suggestObj[woSel[idx].name]['time'] = rSummary.travelTimeInSeconds;
                        suggestObj[woSel[idx].name]['routeid'] = routeId;
                        suggestObj[woSel[idx].name]['woShape'] = woSel[idx].shapeInfo;
                        suggestObj[woSel[idx].name]['woSelIndex'] = idx;
                    }
                } else {
                    suggestObj[woSel[idx].name]['team'] = crewSel[i].name;
                    suggestObj[woSel[idx].name]['lengthInMeters'] = rSummary.lengthInMeters;
                    suggestObj[woSel[idx].name]['time'] = rSummary.travelTimeInSeconds;
                    suggestObj[woSel[idx].name]['routeid'] = routeId;
                    suggestObj[woSel[idx].name]['woShape'] = woSel[idx].shapeInfo;
                    suggestObj[woSel[idx].name]['woSelIndex'] = idx;
                }
            });
        }
        let suggestHTML = [];

        for (const [key, val] of Object.entries(suggestObj)) {
            suggestHTML.push('<div class="route-suggestion" title="Show route" onclick="showRoute(\'' + val.routeid + '\')">Suggested crew for <b>' + key + '</b> : <b>' + val.team + '</b>, takes about ' + ((val.time) / 60).toFixed(2) + ' minute(s), with ' + ((val.lengthInMeters) / 1000).toFixed(3) + ' KM in distance</div>')
            let nearWoClass = "near-wo-" + val.routeid;
            suggestHTML.push('<div class="wo-within-range ' + nearWoClass + '"><div/>');
            suggestHTML.push('<br/>');

            // check for nearest work order 
            showNearestWO(val.woSelIndex, woSel, nearWoClass);
        }
        $(".route-matrix-loader").hide();
        $('#route-matrix-res').html(suggestHTML);

    }, function (err) {
        // error occurred
    });

}

function showRoute(id) {
    // remove old route
    if (addedSuggestedRouteID.length != 0) {
        datasource.remove(addedSuggestedRouteID);
        addedSuggestedRouteID = [];
    }

    var r;
    r = suggestedRoute[id];
    datasource.add(r, 0);

    map.layers.add(new atlas.layer.LineLayer(datasource, null, {
        strokeColor: 'red',
        strokeWidth: 5,
    }));

    var lastAddId = datasource.shapes[0].getId();
    addedSuggestedRouteID.push(lastAddId);
    if (r.bbox) {
        map.setCamera({
            bounds: r.bbox,
            padding: 50
        });
    }
}

function routeDirection(coordinates, checkTimeFlag = true) {
    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);

    var routeOptions = { traffic: true };

    // handle time and date
    if (checkTimeFlag) {
        var date = $('#date-route-m').val();
        var time = $('#time-route-m').val();
        if (date && time) {
            routeMatrixOptions.departAt = date + 'T' + time;
        }
    }

    return routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates, routeOptions).then((directions) => {
        return directions;
    });
}

function showNearestWO(currWoIdx, allWo, cls, range = 3000) {
    // for each suggested route, pick the coordinate
    var origCoor, destCoor;
    destCoor = [];
    origCoor = [];

    // need to check why not all loaded in allwo
    var woSel = getSelectedWOInfo();

    let currWo = woSel[currWoIdx];
    origCoor.push(currWo.shapeInfo.getCoordinates());

    // remove currWoIdx ffrom
    woSel.splice(currWoIdx, 1);
    woSel.forEach(function (ele, idx) {
        // if (idx != currWoIdx){
        destCoor.push(ele.shapeInfo.getCoordinates());
        // }
    });

    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);

    //Start and end point input to the routeURL
    var routeMatrixRequestBody = {
        "origins": {
            "type": "MultiPoint",
            "coordinates": origCoor
        },
        "destinations": {
            "type": "MultiPoint",
            "coordinates": destCoor
        }
    };

    var routeMatrixOptions = {
        'format': 'json',
        'api-version': '1.0',
        'RouteType': 'fastest',
        'traffic': true,
    };

    // handle time and date
    var date = $('#date-route-m').val();
    var time = $('#time-route-m').val();
    if (date && time) {
        routeMatrixOptions.departAt = date + 'T' + time;
    }

    //Make a search route request
    routeURL.calculateRouteMatrix(atlas.service.Aborter.timeout(10000), routeMatrixRequestBody, routeMatrixOptions).then((resp) => {
        let matrix = resp.matrix;
        let html = [];
        let woWithinParam = [];
        let tmp = [];

        matrix[0].forEach(function (ele, idx) {
            if (ele.response.routeSummary.lengthInMeters < range) {
                let v = woSel[idx].shapeInfo;
                tmp = [];
                tmp.sID = v.getId();
                tmp.name = woSel[idx].name;
                tmp.lengthInMeters = ele.response.routeSummary.lengthInMeters;
                woWithinParam.push(tmp);
            }
        });
        if (woWithinParam.length != 0) {
            html.push("<hX>Work Order within range</hX>");
            html.push('<ul>');
            woWithinParam.forEach(function (ele, idx) {
                html.push('<li class="wo-within-range-li" onclick="itemClicked(\'' + ele.sID + '\', false)">' + ele.name + ' (' + ((ele.lengthInMeters) / 1000).toFixed(3) + ' km)</li>');
            });
            html.push('</ul>');
            // append to the class
            $("." + cls).append(html.join(''));
        }
    });
}

function optiMaintCrewShowNearWo() {
    // clear the result
    $(".opti-crew-res").html("");

    var selVal = $('#opti-crew-wo').val();
    var selShape = datasource.getShapeById(selVal);
    var selCoor = selShape.getCoordinates();

    // show the shape on the map
    itemClicked(selVal, false);

    var travDisInp = $("#opti-crew-wo-tdis-inp").val();

    var notSelCrewWoOpt = $('#opti-crew-wo').find('option:not(:selected)');
    notSelCrewWoOpt.each(function (index) {
        if (!$(this).attr("disabled")) {
            let id = $(this).val();
            let shape = datasource.getShapeById(id);
            let coor = shape.getCoordinates();
            let sProp = shape.getProperties();
            // foreach coordinate call this function
            routeDirection([selCoor, coor]).then(function (res) {
                let routeId = 'wo-route-' + id;
                suggestedRoute[routeId] = res.geojson.getFeatures();
                let route = res.routes[0];

                // checking if the lengthInMeters is within travel distance
                if (route.summary.lengthInMeters < travDisInp) {
                    $(".opti-crew-res").append('<div class="opti-crew-res-item" onclick="showRoute(\'' + routeId + '\')">' + sProp.Name + ' (' + sProp.Type + ')</div>');
                }
            });
        }
    });
}

function __routeMatrix(origCoor, destCoor) {
    if (origCoor.length == 0 || destCoor.length == 0) return;

    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);

    //Start and end point input to the routeURL
    var routeMatrixRequestBody = {
        "origins": {
            "type": "MultiPoint",
            "coordinates": origCoor
        },
        "destinations": {
            "type": "MultiPoint",
            "coordinates": destCoor
        }
    };

    var routeMatrixOptions = {
        'format': 'json',
        'api-version': '1.0',
        'RouteType': 'fastest',
        'traffic': true,
    };

    //Make a search route request
    return routeURL.calculateRouteMatrix(atlas.service.Aborter.timeout(10000), routeMatrixRequestBody, routeMatrixOptions).then((resp) => {
        return resp;
    });
}

function showDiv(dv) {
    div = $(dv).data('dv') + '-main';
    if ($('.' + div).is(':visible')) {
        $('.left-panel-item').hide();
    } else {
        $('.left-panel-item').hide();
        $('.' + div).show();
    }
}