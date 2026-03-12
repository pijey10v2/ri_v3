
<?php
include("login/verify_proadmin.php");
require("login/include/db_connect.php");
include_once("BackEnd/class/jogetLink.class.php");
$adminLinkObj = new JogetLink();
$adminLinkObj->setToGlobalJSVariable();

global $CONN, $SYSTEM;

// fetch SP data
$pp_id = $_SESSION['project_id'];
if($_SESSION['file_method'] == 'sp'){


    $sql = "SELECT * FROM configSP WHERE project_id = '$pp_id'";
    $stmt = sqlsrv_query($conn, $sql);
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    }

    while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
        $fileMethod = $_SESSION['file_method'];
        $spUrl = $row['url'];
        $spTenatId =  $row['tenant_id'];
        $spClientId =  $row['client_id'];
        $spClientSecret =  $row['client_secret'];
        $spRepo = $row['site_repo'];
        
    }
}else{
    $fileMethod = $_SESSION['file_method'];
    $spUrl = "";
    $spTenatId =  "";
    $spClientId =  "";
    $spClientSecret =  "";
    $spRepo = "";
}

$constructRoles = ["Bumi Officer","Construction Engineer", "Contract Executive", "Corporate Comm Officer","Director","Doc Controller","Finance Head","Finance Officer","Head of Department", "Land Officer","Planning Engineer","Project Director","Project Manager","Project Monitor","QAQC Engineer","Risk Engineer","Safety Officer","Zone Manager"];
$assetRoles = ["Assistant Director (Road Asset)","Assistant Engineer (Division)","Assistant Engineer (District)","Asset Engineer Section","Civil Engineer (Division)","Civil Engineer (District)","Civil Engineer (Road Asset)","Contract Assistance","Divisional Engineer","District Engineer",
               "Facility Management Department","Head of Contract","Head of Finance","Head of Section", "KKR", "Quantity Surveyor","Senior Civil Engineer (Division)","Senior Civil Engineer (District)","Senior Civil Engineer (Road Asset)","Senior Quantity Surveyor","Technical Inspector Section"];
$roles = (isset($_SESSION['Project_type']) && $_SESSION['Project_type'] == 'ASSET') ? $assetRoles : $constructRoles;

if(isset( $_SESSION['appsLinks']) ){
    $appListsEncode = json_decode($_SESSION['appsLinks']);
}

echo '
    <!DOCTYPE html>
    <html lang="en" class="gr__127_0_0_1">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes">
            <link rel="stylesheet" href="JS/JsLibrary/JSTree/style.min.css" />
            <link rel="stylesheet" href="CSS/v3/home.css">
            <link rel="stylesheet" href="CSS/v3/Wizard.css">
            <link rel="stylesheet" href="CSS/v3/Navbar.css">
            <link rel="stylesheet" href="CSS/v3/admin.css">
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />    
            <link rel="stylesheet" href="CSS/jquery.scrollbar.css">
            <link rel="stylesheet" href="CSS/scrollBarCollapse.css">
            <link rel="stylesheet" href="JS/ganttV3/gantt.css" type="text/css"/>
            
            <link rel="stylesheet" href="JS/JsLibrary/jquery-confirm.min.css">
            <link rel="stylesheet" href="JS/JsLibrary/jquery-ui.css"> 
            <link href="JS/RICore/Widgets/widgets.css" rel="stylesheet"> 
            <link rel="stylesheet" href="CSS/kbd.css">
    
            <link rel ="stylesheet" href ="CSS/V3/tooltip.css" type ="text/css" />
            <link href="JS/RICore/Widgets/widgets.css" rel="stylesheet"> 
            <script  src="JS/JsLibrary/jquery-3.5.1.js"></script>
            <script src="JS/RICore/Cesium.js"></script>
            <script src="JS/JsLibrary/jquery-ui.js"></script>
            <script src="JS/JsLibrary/jquery-confirm.min.js"></script>
            <script src="JS/JsLibrary/jquery.scrollbar.js"></script>
            <script src="JS/resizeable.js"></script>
            <script src="JS/ganttV3/gantt.js"></script>
            <script src="JS/JsLibrary/JSTree/jstree.min.js"></script>
            <script src="JS/JsLibrary/openLayer/openLayer.js"></script>
            <title>Reveron Insights</title>
            <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/all.min.css">
            <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/fontawesome.min.css">
            <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/solid.min.css">
            <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/regular.min.css">
            <link rel="stylesheet" href="CSS/fontawesome7/fontawesome-free/css/brands.min.css">

            <!-- <script src="JS/fontawesome.js"></script> -->
            <script src="JS/all.js"></script>
            <script src="JS/JsLibrary/mixitup.min.js"></script>
            
            <style>
                #myUL{
                    width: 100%;
                    height: calc(100% - 60px); /* adjust depending on header space */
                    overflow-x: auto;
                    overflow-y: auto;
                    box-sizing: border-box;
                    scrollbar-width: thin;
                }
                #myUL .jstree-anchor{
                    white-space: nowrap;
                }
                .btn-link-transparent{
                    background-color: transparent;
                    border-color: transparent;
                    box-shadow: none;
                    color: #212221ff;
                    padding: 0;
                    position: relative;
                    cursor: pointer;
                }

                #omniClassContainer{
                    display: flex;
                    width: 100%;
                    height: 100%;
                }
                    
                #omniClassContainer > div{
                    min-width: 0;
                }

                .container-table-hierarchy{
                    width: 50%;
                    margin: 5px;
                    padding:  0px 10px 0 10px;
                    background: #fff;
                    overflow: auto;
                    min-width: 0;
                    max-width: 50%;
                    border: unset;
                }

                .container-table-datalist{
                    width: 50%;
                    margin: 5px;
                    padding:  10px 10px 0 10px;
                    background: #fff;
                    overflow: auto;
                    min-width: 0;
                    max-width: 50%;
                    border: unset;
                }
                .btnAsset{
                    flex-shrink: 0;
                    margin-left: 6px;
                }
                .tree-text{
                    flex: 1;
                    word-break: break-word;
                }

                

                .btnAssetType {
                    background-color: #2F3E5A;
                    color: #fff;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 5px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.25s ease;
                }

                .btnAssetType i{
                    font-size: 15px;
                }

                .btnAssetType:hover{
                    background-color: #384663ff;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
                    transform: translateY(-1px);
                }

                .btnAssetType:active{
                    transform: translateY(0);
                    box-shadow: none;
                }
                .btnAssetType:hover i{
                    transform: rotate(90deg);
                    transition: transform 0.3s ease;
                }
            </style>

        </head>';

        $themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';


    echo '
    <body class='.$themeClass.'>
        <div class="admin-page">
            <div id="main-user">
                <div class="mainHeader">
                    <span class="titleLabel">Project Users</span>
                    <div class="searchTable">';
                        if($SYSTEM == 'KKR'){
                            if ($_SESSION['project_owner'] == "JKR_SABAH"){
                                echo'
                                    <button class="circle" title="Edit User" id="userListEdit" onclick="OnClickEditUserList()"><i class="fa-solid fa-pencil"></i></button>
                                    <button class="circle" title="Saved User" id="userListSave" onclick="OnClickSaveUserList()"><i class="fa-solid fa-floppy-disk"></i></button>
                                    <button class="circle cancel" title="Cancel User" id="userListCancel" onclick="loadProjectUsers()"><i class="fa-solid fa-ban"></i></button>';
                            }
                        }
                        echo'
                        <input type="text" id="adminProjectUsersSearch" rel="adminProjectUsers" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="container-table">
                    <div class="tableHeader admin fiveColumn">
                        <span class="columnMiddle">Email
                            <button type="button" class="control unset" data-sort="user-email:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="user-email:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="user-email:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnMiddle">Name
                            <button type="button" class="control unset" data-sort="user-name:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="user-name:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="user-name:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnMiddle">Organisation
                            <button type="button" class="control unset" data-sort="user-organisation:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="user-organisation:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="user-organisation:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnMiddle">Country
                            <button type="button" class="control unset" data-sort="user-country:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="user-country:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="user-country:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnMiddle">Project Role
                            <button type="button" class="control unset" data-sort="user-role:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="user-role:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="user-role:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>';
                        if($SYSTEM == 'KKR'){
                            if ($_SESSION['project_owner'] == "JKR_SABAH"){
                                echo'<span class="columnMiddle">Designation</span>';
                            }
                        }
                    echo '</div>
                    <div class="tableBody" id="adminProjectUsers" rel="1"></div>
                </div>
                <div class="loadingcontainer-mainadmin">
                    <div class="loader" style="display: block"></div>
                    <div id="loadingText">Working...</div>
                </div>
            </div>

            <div id="main-layerdata">
                <div class="mainHeader">
                    <span class="titleLabel">Data Catalog for GIS, BIM and Reality Model</span>
                    <div class="searchTable">
                        <input type="text" rel="dataTable" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="container-table">
                    <div class="tableHeader admin eightColumn">
                        <span class="columnSmall">Attached</span>
                        <span class="columnSmall">Share</span>
                        <span class="columnLarge">Data Layer Name
                            <button type="button" class="control unset" data-sort="data-name:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-name:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-name:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnSmall no-wrap">Data Type
                            <button type="button" class="control unset" data-sort="data-type:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-type:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-type:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnLarge">Owner
                            <button type="button" class="control unset" data-sort="data-owner:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-owner:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-owner:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnLarge">File name
                            <button type="button" class="control unset" data-sort="data-file:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-file:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-file:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnMiddle">File Date</span>
                        <span class="columnMiddle">Projects Using Data</span>
                    </div>
                    <div class="tableBody" id="dataTable" rel="0"></div>  
                    <div id="parkContainer">
                    </div>     
                    <div id = "moveContainer">
                        <div class="buttonContainerData">
                            <button id = "btn_dataAttach" onclick = "attachmentToggle()">Attach</button>
                            <div  class ="hiddencontainer"  id="attachlayerContainer">
                                <label>Enter Layer Name:</label><br>
                                <input type="text" id="attachLayer"><br>
                                <a>Display on Default  </a><input type="checkbox" id="setdefaultLayer">
                                <button onclick="saveLayerAttach()">Save</button><button id="cancelAttach">Cancel</button>
                            </div>
                            <button id = "btn_dataPermission" onclick="permissionToggle()">Share</button>
                            <div><button id = "btn_dataDelete" onclick ="deleteData()" >Delete</button></div>
                            <div><button id = "btn_submitDataUsers" onclick ="submitDataUsers()" >View Projects</button></div>
                            <button id = "btn_dataAdjustPosition">Adjust Elevation</button>
                            <div class = "hiddencontainer" id="adjustlayerContainer">
                                <input id = "heightadjustPosition" type="number" step ="1.0" onchange = "OnChangeHeightAdjustPositionValues()">Height<br>
                                <input id = "xadjustPosition" type="number" step ="1.0" value=0 onchange = "OnChangeHeightAdjustPositionValues()"><br>X<br>
                                <input id = "yadjustPosition" type="number" step ="1.0" value=0 onchange = "OnChangeHeightAdjustPositionValues()"><br>Y<br>
                                <button id = "saveadjustPosition" onclick = "OnClickSaveAdjustPosition()">Save</button>
                                <button id = "canceladjustPotition">Cancel</button>
                            </div>

                            <div><button id ="btn_AddToGroup">Group Layer</button></div>
                            <div class ="hiddencontainer" id="addToGroup">
                                <div class = "groupSelection">
                                    <select id="groupLayerSelect">
                                    </select>
                                </div>
                                <div id="hiddencontainer2">
                                    <label for="newGroupName">Group Name: </label><br>
                                    <input class="inputForm" type="text" id="newGroupName" placeholder="Enter group name"><br>
                                    <div class="flex">
                                        <label for="newGroupCheck">Default Display: </label>
                                        <input type="checkbox" id="newGroupCheck"/><br>
                                    </div>
                                </div>
                                <div id="hiddencontainer4" style = "display: none;">
                                    <select id="groupSubLayerSelect">
                                    </select>
                                </div>
                                <div id="hiddencontainer5" style = "display: none;">
                                    <label for="newSubGroupName">Sub Group Name: </label><br>
                                    <input class="inputForm" type="text" id="newSubGroupName" placeholder="Enter sub group name"><br>
                                </div>
                                <div id="hiddencontainer3" style = "display: none;">
                                    <label for="newLayerName">Merge Layer Name: </label><br>
                                    <input class="inputForm" type="text" id="newLayerName" placeholder="Enter layer name"><br>
                                </div>
                                <button id="saveGroupLyrBtn" onclick ="OnClickSaveLayerGroup()">Save</button>
                                <button id="canceladdgroup">Cancel</button>
                                <br/>
                                <button id="editGroupLyrBtn" value="0" onclick ="OnClickRemoveLayerGroup(this)">Remove<br/>Group</button>
                                <button id="editGroupLyrBtn" value="0" onclick ="OnClickEditLayerGroup(this)">Edit<br/>Group</button>
                            </div>

                            <button id="btn_dataStyling" onclick="parseKMLStyle()">Style</button>
                            <div class="hiddencontainer" id="KmlStylingDiv">
                                <h3>Style Data</h3>
                                <div id="shpStylingDiv">
                                    <label for="shpStyleSelect">Style List:</label>
                                    <select id="shpStyleSelect" onChange="shpStyleSelectChange()">
                                    </select>
                                    <button id="shpStyleEditBtn" onClick="parseShpStyle()">Edit</button>
                                    <br>
                                    <div class="subcontainer" id="shpStyleChk" style="display:none">
                                
                                        <label for="shpStyleName">Style Name</label>
                                        <input type="text" id="shpStyleName">
                                    
                                        <div class="flex">
                                            <label class="w50" for="shpStylePointChk">Point</label>   
                                            <input class="marginLeft" type="checkbox" id="shpStylePointChk" onChange="shpSymbologyChk(this)"/>
                                        </div>

                                        <div class="flex">
                                            <label class="w50" for="shpStyleLineChk">Line</label>
                                            <input class="marginLeft" type="checkbox" id="shpStyleLineChk" onChange="shpSymbologyChk(this)"/>
                                        </div class="flex">
                                        
                                        <div class="flex">
                                            <label class="w50" for="shpStylePolygonChk">Polygon</label>
                                            <input class="marginLeft" type="checkbox" id="shpStylePolygonChk" onChange="shpSymbologyChk(this)"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="subcontainer" id="IconStyleDiv" style="display:block">
                                    <h4>Icon Style</h4><br>
                                    <div class="classContainer">
                                        <div class="leftContainer icon">
                                            <label>Icon</label>
                                            <select type="text" onchange ="UpdateIconHref()" onclick="document.getElementById(\'IconImage-kml\').src=value" id="IconStyleHref" name="IconStyleHref"  >           
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png">Yellow Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png">Blue Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png">Green Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/ltblu-pushpin.png">Light Blue Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/pink-pushpin.png">Pink Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/purple-pushpin.png">Purple Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png">Red Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png">White Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png">Circle</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/red-circle.png" >Red Paddle Pin</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/A.png">Paddle Pin A</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/B.png">Paddle Pin B</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/C.png">Paddle Pin C</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/D.png">Paddle Pin D</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/E.png">Paddle Pin E</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/F.png">Paddle Pin F</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/1.png">Paddle Pin 1</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/2.png">Paddle Pin 2</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/3.png">Paddle Pin 3</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/4.png">Paddle Pin 4</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/5.png">Paddle Pin 5</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/6.png">Paddle Pin 6</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/7.png">Paddle Pin 7</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/8.png">Paddle Pin 8</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/9.png">Paddle Pin 9</option>
                                                <option value="http://maps.google.com/mapfiles/kml/paddle/10.png">Paddle Pin 10</option>
                                                <option value="https://maps.gstatic.com/mapfiles/ms2/micons/rail.png">Station</option>
                                            </select>
                                        </div>
                                        <div class="rightContainer icon">
                                            <img src="" id="IconImage-kml" width="30" height="30" alt=""/>  
                                        </div>
                                    </div>
                                </div><br>
                        
                                <div class="subcontainer" id="LineStyleDiv" style="display:none">
                                    <h4>Line Style</h4><br>
                                    <label>Color:</label><br>
                                    <input type="text" onchange ="UpdateLineColor()" name="LineColorVal" id="LineColorVal" class="jscolor" ><br>
                                    <label>Line:</label><br>
                                    <input type="number" onchange ="UpdateLineColor()" name="LineWidthVal" id="LineWidthVal" step="1" min="1" max="5"><br>
                                </div><br>
                        
                                <div class="subcontainer" id="PolyStyleDiv" style="display:none">
                                    <h4>Polygon Style</h4><br>
                                    <div class="classContainer">
                                        <div class="leftContainer">
                                            <label>Fill: </label>
                                            <input type="checkbox" onchange = "UpdateFillBoolean(this)" id="PolygonFillBoolean"><br>
                                            <div id="PolygonFillDiv" class="hiddencontainer-inner">
                                                <label>Color: </label>
                                                <input type="text" onchange ="UpdatePolygonColor()" name="PolygonColorVal" id="PolygonColorVal" class="jscolor" ><br>
                                                <label>Opacity(%): </label> 
                                                <input type="number" onchange ="UpdatePolygonColor()" name="PolygonOpacityVal" id="PolygonOpacityVal" step="10" min="0" max="100"><br>
                                            </div> 
                                        </div>
                                        <div class="rightContainer">
                                            <label>Outline:</label>
                                            <input type="checkbox" onchange="UpdateOutlineBoolean(this)" id="OutlineBoolean"><br>
                                            <div id="OutlineDiv" class="hiddencontainer-inner">
                                                <label>Color :</label> <input type="text" onchange ="UpdatePolygonOutline()" name="OutlineColorVal" id="OutlineColorVal" class="jscolor" ><br>
                                            </div>
                                        </div>
                                    </div> 
                                </div><br>
                                <button onclick="submitKmlStyle()">Submit</button>
                                <button id="cancelKmlStyle">Cancel</button>
                            </div>
                        </div>
                        <div id="datapreview" style="width: 75%; margin-left: 0px;">
                        </div>
                        <div class="cesium-viewer-toolbar-admin">
                            <button title ="Adjust background brightness" id="adjustBrightness" class="cesium-button cesium-toolbar-button"><img src="Images/icons/admin_page/layer_preview/sun_max.png" style="height: 25px;"></button>
                            <button title ="Fly to data" id="flyToData" class="cesium-button cesium-toolbar-button"><img src="Images/icons/admin_page/layer_preview/binoculars.png" style="height: 25px;"></button>
                            <button title ="Switch Terrain Mode" id="switchTerrainMode" class="cesium-button cesium-toolbar-button"><i class="onPrimary fa-solid fa-mountain fa-lg"></i></button>
                        </div>
                    </div>   
                <br><br>
				</div>
            </div>

            <div id="main-projectwise365">
                <div class="mainHeader">
                    <span class="titleLabel">ProjectWise 365</span>
                </div>
                <div class="headerButton">
                    <button id ="editprojectwise365" class="readonly">Edit</button>
                    <button id ="saveprojectwise365" class="edit" onclick = "OnClickProjectWise365DetailsSave()">Save</button>
                    <button id ="cancelprojectwise365" class="edit">Cancel</button>
                </div>
                <div class="config-container">
                    <div class="projectwise365Page  readonly">
                        <div title="ProjectWise365 URL">
                            <i class="fa-solid fa-link"></i><p id="projectwise365url"></p>
                        </div>
                    </div>
                    <div class="projectwise365Page  edit">
                        <label>ProjectWise365 ID</label><br>
                        <input type="text"  id = "p365URL" value = "">
                    </div>
                </div>
            </div>

            <div id="main-projectwise">
                <div class="mainHeader">
                    <span class="titleLabel">ProjectWise</span>
                </div>
                <div class="headerButton">
                    <button id ="clearpwfiles" class="readonly" onclick = "OnClickPWDetailsClear()">Clear</button>
                    <button id ="editpwfiles" class="readonly">Edit</button>
                    <button id ="savepwfiles" class="edit" onclick = "OnClickPWDetailsSave()">Save</button>
                    <button id ="cancelpwfiles" class="edit">Cancel</button>
                </div>
                <div class="config-container">
                    <div  class="pwfilesPage readonly">
                        <div title="Projectwise Username">
                            <i class="fa-solid fa-user-tie"></i><p id="pwusernamedisplay">Projectwise Username</p>
                        </div>
                        <div  title="Projectwise URL">
                            <i class="fa-solid fa-link"></i><p id="pwurldisplay">Projectwise URL</p>
                        </div>
                    </div>
                    <div class="pwfilesPage edit">
                        <div class="pwurlContainer">
                            <div class="column1">
                                <label>ProjectWise URL</label><br>  
                                <input type="text" id= "pwURL"  placeholder="The URL must be SSL certified (https)">
                            </div>
                            <div class="column2">
                                <button class="hideonclick" onclick = "OnclickGetDatasource()">Get Datasource</button>
                                <label  class="hideoncancel">Repository</label>
                                <select class="hideoncancel" id = "pwRepositoryList">
                                </select>
                                <button class="hideoncancel" onclick ="OnclickCancelDatasource()">Cancel</button>
                            </div>
                        </div><br>
                        <div class="doubleinput">
                            <div class="column1">
                                <label class="hideoninitial">ProjectWise Username</label><br>
                                <input class="hideoninitial" type="text" id = "pwUserName">
                            </div>
                            <div class="column2">
                                <label class="hideoninitial">ProjectWise Password</label><br>
                                <input class="hideoninitial" type="password" id = "pwPassword">
                            </div>
                        </div>         
                    </div>
                </div>
                <div class="loadingcontainer-mainadmin">
                    <div class="loader"></div>
                    <div id="loadingText">Working...</div>
                </div>
            </div>

            <div id="main-powerbi">
                <div class="mainHeader">
                    <span class="titleLabel">PowerBI</span>
                </div>
                <div class="headerButton">
                    <button id ="editpowerbi" class="readonly">Edit</button>
                    <button id ="savepowerbi" class="edit" onclick = "OnClickPowerBiDetailsSave()">Save</button>
                    <button id ="cancelpowerbi" class="edit">Cancel</button>
                </div>
                <div class="config-container">
                    <div class="powerbiPage readonly">
                        <div title="PowerBi Username">
                            <i class="fa-solid fa-user-tie"></i><p id="powerbiusernamedisplay">PowerBi Username</p>
                        </div>
                        <div title="PowerBI URL">
                            <i class="fa-solid fa-link"></i><p id="powerbiurl">PowerBI Embed</p>
                        </div>
                    </div>
                    <div class="powerbiPage edit">
                        <label>PowerBI Link</label><br>
                        <input type="text"  id = "pBiURL"><br>
                        <div class="doubleinput">
                            <div class="column1">
                                <label class="hideoninitial">PowerBi Username</label><br>
                                <input class="hideoninitial" type="text" id = "powerbiUserName">
                            </div>
                            <div class="column2">
                                <label class="hideoninitial">PowerBi Password</label><br>
                                <input class="hideoninitial" type="password" id = "powerbiPassword">
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
            
            <div id="main-project-dashboard">
                <div class="mainHeader">
                    <h3>Project Progress</h3>
                    <div class="headerButton">
                    </div>
                </div>
                <div class="projectDashboardContainer" id = "digitalReportingInfo">
                    <iframe id = "myAdminInnerFrame" src = "" style="width: 100%; height: 100%; border: unset;"></iframe>
                    <div class="omniclass-container" id="omniClassContainer" style="width: 100%; height: 100%; border: unset; display: flex;">
                        <div id="addOmniClass" class="modal" style="z-index: 50;">
                            <div class="modal-content">
                                <span id="wizardClose" class ="closebuttonWizard" rel ="" onclick="wizardCancelPage()">&times;</span>
                                <span id="wizardMaximize" class ="maximizebutton" rel =""><img src="./Images/icons/form/maximize.png"></span>
                                <div class="modal-header"><a></a></div>
                    
                                <div class="modal-container" id="omniClassContainer1" style="display: block !important">
                                    <iframe id = "myAdminInnerFrame2" src = "" style="width: 100%; height: 100%; border: unset;"></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="container-table-hierarchy">
                            <h4 style="margin-left: 10px;">Hierarchy</h4>
                            <hr>
                            <button type="button" class="btnAssetType" id="btnCreateAssetType">
                                Add New  
                                <i class="fa fa-plus-circle" style="color: #FFFFFF"></i>
                            </button>
                            </br></br>
                            <div class="hierarchy-container">
                                <input class="btn btn-sm-primary" type="text" id="treeSearch" placeholder="Search asset..." style="width:100%; margin-bottom:5px;">
                                <div id="assetHierarchyTreeAdmin" class="tree-list"></div>
                            </div>
                        </div>
                        <div class="container-table-datalist">
                            <h4 style="margin-left: 10px;">Data List</h4>
                            <hr>
                            <iframe id = "myAdminInnerFrame1" src = "" style="width: 100%; height: 90%; border: unset;"></iframe>
                        </div>
                    </div>

                </div>
            </div>';

            if ($fileMethod == "sp")
                $fileMethodName = 'SharePoint';
            else 
                $fileMethodName = 'ProjectWise';

            echo'       
            <div id="main-schedule">
                <div class="mainHeader">
                    <span class="titleLabel">Project Schedule</span>
                </div>
                <div class="schedule-container" id="schedule-container">
                    <div class="sidebar">
                        <div class="scheduleList">
                            <div class="selectcontainer">
                                <select id="scheduleType" onchange="changeSchedule()">';
                                    if($SYSTEM == 'KKR'){
                                        echo 
                                        '<option>Baseline</option>';
                                    }
                                    echo '
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                </select>
                            </div>
                            <div id="scrollThisCont" class="scrollcontainer">
                                <ul id="scheduleListing">
                                </ul>
                            </div>
                        </div>
                        
                        <div class="scheduleInfo">
                            <div class="flexContainer">
                                <div class="propcontainer">Schedule Properties</div>
                                <div class="buttonContainer">
                                    <button class="log" id="reviseschedule" style="display:none">Revise</button>';
                                    if($SYSTEM == 'OBYU'){
                                        echo'
                                        <button class="log" id="updateActualBtn" style="display:none">Update Actual</button>';
                                    }
                                    echo'
                                </div>
                            </div>
                            
                            <div class="metadatacontainer">
                                <div class="doublefield">
                                    <div class="column1 first">
                                        Name
                                    </div>
                                    <div class="column2 first" title="Schedule name" id="scheduleName" >
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="column1">
                                        Version
                                    </div>
                                    <div class="column2" title="Schedule revision" id="scheduleRevision">
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="column1">
                                        Uploaded On
                                    </div>
                                    <div class="column2 title="Schedule upload date" id="scheduleUploadedDate"">
                                    </div>
                                </div>
                                <div class="doublefield">
                                    <div class="column1 last">
                                        Uploaded By
                                    </div>
                                    <div class="column2 last" title="Schedule owner" id="scheduleOwner">
                                    </div>
                                </div>';
                                if ($SYSTEM == 'OBYU'){
                                    echo'
                                    <div class="doublefield">
                                        <div class="column1 last">
                                            Physical Actual (%)
                                        </div>
                                        <div class="column2 last" title="Physical Actual (%)" id="physicalActTb">
                                        </div>
                                    </div>
                                    <div class="doublefield">
                                        <div class="column1 last">
                                            Financial Actual (%)
                                        </div>
                                        <div class="column2 last" title="Financial Actual (%)" id="financialActTb">
                                        </div>
                                    </div>';
                                }
                            echo'    
                            </div>
                            <div class="filescontainer">
                                <ul id="revisionList">
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="right-container">
                        <div class="loadingcontainer-mainadmin" id = "loadingGanttChart">
                            <div class="loader"></div>
                            <div id="loadingText">Loading...</div>
                        </div>
                        <div id ="gdiv" onclick="stickyScroll()"></div>
                        <div id="scheduleMessage" class="messagecontainer" style="display:none">
                            <p>No schedule found.</p>
                            <p>Click to add your project Schedule.</p>
                            <button class ="log" id="newschedule">Add Schedule</button>';
                            if ($SYSTEM == 'OBYU'){
                                echo'
                                <div>
                                    <p>or</p>
                                    <button class ="log" id="newactual">Add/Update Actual Physical/Financial</button>
                                </div>';
                            }
                            echo'
                        </div>
                        <div class="messagecontainer noProjectDate" style="display:none">
                            <p>Project Start date and End date is not specified.</p>
                            <p>Click the button below to add project Start and End date in Edit Project.</p>
                            <button class ="log editproject" onclick = "editProject()">Edit Project</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="main-aerial">
                <div class="mainHeader">
                    <span class="titleLabel">Aerial Imagery</span>
                </div>
                <div class="aerial-container" id="aerial-container">
                    <div class="sidebar">
                        <div class="aerialList">
                            <div class="selectcontainer">
                                <select id="AicRoutineType" onchange="changeAicRoutine(this)">
                                    <option value="0">Weekly</option>
                                    <option value="1">Monthly</option>
                                    <option value="2">Quarterly</option>
                                </select>
                            </div>
                            <div id="aicScrollDiv" class="scrollcontainer">
                                <ul id="AicRoutineList">
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="right-container">
                        <div class="container-table">
                            <div class="tableHeader admin threeColumn">
                                <span class="columnMiddle routineType">Types: </span>
                                <span class="columnMiddle startDate">Start: </span>
                                <span class="columnMiddle endDate">End: </span>
                            </div>
                            <div id ="gdiv2">
                                <div class="tableHeader admin sixColumn">
                                    <span class="columnMiddle">Package</span>
                                    <span class="columnMiddle">Image Captured Date</span>
                                    <span class="columnMiddle">Registered By</span>
                                    <span class="columnMiddle">Registered Date</span>
                                    <span class="columnMiddle" '.($SYSTEM=='OBYU'?'style="display:none"':'').'>File Name</span>
                                    <span class="columnMiddle" '.($SYSTEM=='OBYU'?'style="display:none"':'').'>Owner Project</span>
                                    <span class="columnMiddle"></span>
                                </div>
                                <div class="tablecontainer tableBody" id="aicRecordTable" style="display: none">
                                </div>
                                <div class="formcontainer"  id="addEditAIC" style="display:none">
                                    <div class="doubleinput">
                                        <div class="column1">
                                            <label>Start Date</label><br>
                                            <input class="inputForm" type="date" id="aicFormStartDate" readonly="readonly">
                                        </div>
                                        <div class="column2">
                                            <label>End Date</label><br>
                                            <input type="date" id="aicFormEndDate" readonly="readonly">
                                        </div>
                                    </div>
                                    <div class="doubleinput">
                                        <div class="column1">
                                            <label>Image Registered Date</label><br>
                                            <input id="aicFormRegDate" readonly="readonly">
                                        </div>
                                        <div class="column2">
                                            <label>Image Registered By</label><br>
                                            <input id="aicFormRegBy" readonly="readonly">
                                        </div>
                                    </div>
                                    <div class="doubleinput">
                                        <div class="column1">
                                            <label>Image Captured Date</label><br>
                                            <input type="date" id="aicFormCapturedDate">
                                        </div>
                                        <div class="column2">
                                            
                                        </div>
                                    </div>';
                                    if ($_SESSION['is_Parent'] == "isParent") {
                                        echo '
                                        <div class="doubleinput">
                                            <div class="column1">
                                                <label>Package No.</label><br>
                                                <select  id="aicFormPackageId">
                                                    <option disabled selected value> -- select an option -- </option>';
                                                    $p_id = $_SESSION['project_id'];
                                                    $sql = "SELECT project_id_number, project_id, project_name FROM projects WHERE parent_project_id_number = '$p_id'";
                                                    $stmt = sqlsrv_query($conn, $sql);
                                                    if ($stmt === false) {
                                                        die(print_r(sqlsrv_errors(), true));
                                                    }
                                                    while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
                                                        echo ' <option data ="' . $row['project_name'] .  '" data-2="' . $row['project_id'] . '" value="' . $row['project_id_number'] . '">' . $row['project_id'] . '</option>';
                                                    }
                                                    echo '
                                                </select>
                                            </div>
                                        <div class="column2">
                                            <label>Package Name</label><br>
                                            <input  id="aicFormPackageName" readonly="readonly">
                                        </div>
                                    </div>';
                                    }
                                    echo ' 
    
                                    <div class="singleinput">
                                        <label>File</label><br>
                                        <button id="aicFormImgInput">Browse Image</button>
                                        <label id="aicFileName"></label>
                                        <label id="aicUploadStatus"></label>
                                    </div>
    
                                    <div class="buttoncontainer">
                                        <button onclick="cancelAicForm()" class="cancel">Cancel</button>
                                        <button id="AicUpdateButton" onclick="updateAicRoutineInfo()" style="display:none">Update</button>
                                        <button id="AicSaveButton">Register</button>
                                    </div>
                                </div>
                                <div class="formcontainer" id="aicGroup" style="display:none">
                                    <div class="doubleinput">
                                        <div class="column1">
                                            <label>Group</label><br>
                                            <select id="groupAerialSelect"></select>
                                        </div>
                                        <div class="column2">
                                            <label>Sub Group</label><br>
                                            <select id="subGroupAerielSelect"></select>
                                        </div>
                                    </div>

                                    <div class="doubleinput">
                                        <div class="column1" id="hiddenAerialContainer">
                                            <label for="newGroupAerialName">Group Name: </label><br>
                                            <input type="text" id="newGroupAerialName" placeholder="Enter group name"><br>
                                        </div>
                                        <div class="column2" id="hiddenAerialSubContainer">
                                            <label for="newsubGroupAerialName">Sub Group Name: </label><br>
                                            <input type="text" id="newsubGroupAerialName" placeholder="Enter subgroup name"><br>
                                        </div>
                                    </div>
                                    <div class="buttonContainer">
                                        <button id="saveGroupAerialBtn" onclick ="OnClickSaveAerialGroup(this)">Save</button>
                                        <button id="canceladdgroupAerial">Cancel</button>
                                    </div>
                                </div>
                            </div>
                            <button class="mainButton" id="aicNewReg" onclick="aicNewReg()" style="visibility: hidden">New Registration</button>
                        </div>
                    </div>
                    <div class="messagecontainer" style="display:none">
                        <p>Project Start date and End date is not specified.</p>
                        <p>Click to Edit Project to add add project Start and End date.</p>
                        <button class ="log editproject">Edit Project</button>
                    </div>
                </div>
            </div>

            <div id="main-shareAerial">
                <div class="mainHeader">
                    <span class="titleLabel">Share Aerial Images across projects</span>
                    <div class="searchTable">
                        <input type="text" rel="shareAerial" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="container-table">
                    <div class="tableHeader admin eightColumn">
                        <span class="columnSmall">Attached</span>
                        <span class="columnSmall">Share</span>
                        <span class="columnLarge">Image Filename
                            <button type="button" class="control unset" data-sort="data-name:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-name:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-name:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnSmall wrap">Image Type
                            <button type="button" class="control unset" data-sort="data-type:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-type:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-type:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnLarge">Image Captured Date
                            <button type="button" class="control unset" data-sort="data-owner:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-owner:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-owner:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnLarge">Routine Type
                            <button type="button" class="control unset" data-sort="data-file:desc"><i class="fa-solid fa-sort"></i></button>
                            <button type="button" class="control asc" data-sort="data-file:desc" style="display:none"><i class="fa-solid fa-sort-up"></i></button>
                            <button type="button" class="control desc" data-sort="data-file:asc" style="display:none"><i class="fa-solid fa-sort-down"></i></button>
                        </span>
                        <span class="columnMiddle">Start Date</span>
                        <span class="columnMiddle">Owner</span>
                        <span class="columnSmallDouble">Projects Using Data</span>
                    </div>
                    <div class="tableBody" id="shareAerial" rel="0"></div>  
                    <div id="parkContainerAerial">
                    </div>     
                    <div id = "moveContainerAerial">
                        <div class="buttonContainerData">
                            <button id = "btn_aerialAttach" onclick = "aerialAttachmentToggle()">Attach AIC</button>
                            <div  class ="hiddencontainer"  id="attachAICContainer">
                                <label>Image Captured Date:</label><br>
                                <input type="date" id="capturedDate" disabled><br>
                                <button onclick="saveSharedAicRoutineInfo()">Save</button><button id="cancelAICAttach">Cancel</button>
                            </div>
                            <button id = "btn_aerialPermission" onclick="aerialPermissionToggle()">Share</button>
                            <div><button id = "btn_submitAerialUsers" onclick ="getAerialDataUsers()" >View Projects</button></div>
                           
                        </div>
                        
                    </div>   
                <br><br>
				</div>
            </div>

            <div id ="aerialinfoView" class="layerinfoView aerialinfoView">
                <div class="layerinfoContent">
                    <div class="layerinfoHeader"><span id = "h3_fullname_aerialtinfo">AIC name here</span></div> 
                    <span id="aerialCloseButton" class ="closebutton" rel = "aerialinfoView" onclick = "closemodal(this)" >&times;</span>
                    <div class="layerinfoContainerMainBody">
                        <div class="layerinfoContainerBody1">
                            <div class="layerinfoDisplay">
                                <label>Data Name</label>
                                <input type="text" id="aerialinfoName" disabled><br>
                                <label>Data Type</label>
                                <input type="text" id="aerialinfoType" disabled><br>
                                <label>Owner</label>
                                <input type="text" id="aerialinfoOwner" disabled><br>
                                <label>Added date</label>
                                <input type="text" id="aerialinfoAddeddate" disabled>
                            </div>
                        </div>
                        <div class="layerinfoContainerBody2">
                            <div class="layerinfoTable">
                                <span>Project(s) using this data:</span>
                                <div class="tablecontainer">
                                    <div class="tableHeader admin fourColumn">
                                        <span class="columnMiddle">Project ID</span>
                                        <span class="columnMiddle">Project Name</span>
                                        <span class="columnMiddle">Attached By</span>
                                    </div>
                                    <div class="tableBody" id="aerialUsersTable"></div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            <div id="main-schedulemap">
                <div class="mainHeader">
                    <span class="titleLabel">Schedule Mapping</span>
                </div>
                <div class="topcontainer">
                    <div class="leftcontainer">
                        <div class="selectcontainer">
                            <select id="scheduleFileName" onchange = "onChangeScheduleFileName()">
                            </select>
                        </div>
                        <div class="jstreecontainer">
                            <div id = "scheduleMapRootNode"></div>
                        </div>
                    </div>
                    <div class="rightcontainer">
                        <div class="buttoncontainer">
                            <button onclick = "onClickResetScheduleSelection()">Reset</button>
                            <button onclick = "onClickAddScheduleMapping()">Add</button>
                        </div>
                        <div class="jstreecontainer">
                            <div id = "scheduleMapLocationRootNode"></div>
                        </div>
                    </div>
                </div>
                <div class="bottomcontainer">
                    <div class="innerheader">
                        <div class="headercontainer">
                            <span>Schedule Item</span>
                        </div>
                        <div class="headercontainer">
                            <span>Map Location</span>
                        </div>
                    </div>
                    <div class="innercontainer" id = "scheduleMapInput">
                        <!-- <div class="doubleinput">
                            <div class="column1">
                                <input type="checkbox">
                            </div>
                            <div class="column2">
                                <input type="text">
                            </div>
                            <div class="column3">
                                <input type="text">
                            </div>
                        </div> -->
                    </div>
                    <div class="footercontainer">
                        <button onclick = "onClickSaveScheduleMapping()">Save</button>
                        <button onclick = "onClickDeleteScheduleMapping()">Delete</button>
                    </div>
                </div>
            </div>
            
            <div id="addscheduleForm" class="formView">
                <div class="formContent" id="addscheduleformContent">
                    <div class="formHeader-addschedule"><span>Upload Schedules</span></div>
                    <span id="addscheduleCloseButton" class ="closebutton">&times;</span>
                    <div class="formcontainerMainBody">';
                    if ($SYSTEM == 'OBYU'){
                        $template_path = 'Templates/systemadmin/ConstructionSchedule_Sample.xml';
                        if (file_exists($template_path)) {
                            echo '<div>Schedule XML sample: <a href="'.$template_path.'" download>ConstructionSchedule_Sample.xml</a></div>';
                        }
                    }
                        echo'
                        <label>Schedule Name</label>
                        <input type="text" id="schedulename" disabled>
                        <div class="doubleinput">
                            <div class="column1">
                                <Label>Schedule Type</Label><br>
                                <input type="text" id="scheduletype" disabled>
                            </div>
                            <div class="column2">
                                <label>File</label><br>
                                <input type="file" name="xmlInp" id="xmlInp" accept=".xml">
                            </div>
                        </div>
                        <div class="doubleinput">
                            <div class="column1">
                                <Label>Schedule Start Date</Label><br>
                                <input type="date" id="scheduledatestart" disabled>
                            </div>
                            <div class="column2">
                                <Label>Schedule End Date</Label><br>
                                <input type="date" id="scheduledateend" disabled>
                            </div>
                        </div>
                        <div class="revisioncontainer">
                            <div class="doubleinput">
                                <div class="column1">
                                    <label>Revision Number</label>
                                    <input type="text" id="revisionnumber" disabled>
                                </div>
                                <div class="column2">
                                    <label>Reason</label>
                                    <select id="revisionreason">';
                                        $sql = "SELECT * FROM RevReasonLookup";
                                        $stmt = sqlsrv_query($conn, $sql);
                                        if ($stmt === false) {
                                            die(print_r(sqlsrv_errors(), true));
                                        }
                                        echo ' <option></option>';
                                        while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
                                            echo ' <option value="' . $row['RevReasonID'] . '">' . $row['RevReasonDesc'] . '</option>';
                                        }
                                        echo'
                                    </select>
                                </div>
                            </div>
                            <label>Remarks</label>
                            <textarea id="revisionremarks"></textarea>
                        </div>
                    </div>
                    <div class="addscheduleFooter">
                        <div>
                            <button id="saveSchedule">Save</button>
                            <button id="addschedulecancel">Close</button>
                        </div>
                    </div>
                </div>
            </div>';
            if ($SYSTEM == 'OBYU'){
                echo '
                <div id="addactualForm" class="formView" style="display:none;">
                    <div class="formContent" id="addactualformContent">
                        <div class="formHeader-addactual"><span>Update Actual</span></div>
                        <span id="addactualCloseButton" class ="closebutton">&times;</span>
                        <div class="formcontainerMainBody" style="overflow-y:auto;">
                            <h2>Physical</h2>
                            <label>Overall (%)</label>
                            <input type="number" id="physicalActualValue" min="1" max="100">
                            <div class="sectionPhyActualContainer">
                            </div>
                            <h2>Financial</h2>
                            <label>Overall (%)</label>
                            <input type="number" id="financialActualValue" min="1" max="100">';
                            if ($_SESSION['project_owner'] == "KACC"){
                                echo '<div class="sectionFinActualContainer"></div>';
                            }
                            echo'
                        </div>
                        <div class="addactualFooter">
                            <div>
                                <button id="saveActual" onclick="saveActualValue()">Save</button>
                                <button id="addactualcancel">Close</button>
                            </div>
                        </div>
                    </div>
                </div>';
            }
            echo'
            <div id ="invitenewuserForm" class="">
                <div class="mainHeader">
                    <span class="titleLabel">Add User Project</span>
                    <div class="searchTable">
                        <button class="circle" title="Saved User" onclick="OnClickInviteUserSave()"><i class="fa-solid fa-floppy-disk"></i></button>
                        <button class="circle" title="Cancel User" id="inviteuserCancel"><i class="fa-solid fa-ban"></i></button>
                        <input type="text" rel="dataTable" placeholder="Search..." onkeyup = "searching(this)"> 
                    </div>
                </div>
                <div class="user-container">
                    <div class="container-tableLeft">
                        <div class="headercontainer">
                            <span> All Available User</span>
                        </div>
                        <div class="tablecontainer">
                            <div class="tableHeader admin threeColumn">
                                <span class="columnSmall"><input type = "checkbox"  onchange = "checkAllFormUserstableleft(this)"></span>
                                <span class="columnLarge">Email</span>
                                <span class="columnMiddle">Name</span>
                                <span class="columnLarge">Organization</span>
                            </div>
                            <div class="tableBody" id="adminUserTableBody" rel="2" rel2="4">';
                                if ($SYSTEM == 'KKR'){
                                    $pid = $_SESSION['project_id'];
                                
                                    $sql = "SELECT parent_project_id_number FROM projects where project_id_number = '$pid'";
                                    $stmt = sqlsrv_query( $conn, $sql);
                                    if( $stmt === false ) {
                                        die( print_r( sqlsrv_errors(), true));
                                    }
                                    $row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC);
                                    $id = $row['parent_project_id_number'];
                                    
                                
                                    if($id != null){
                                    $sql = "(SELECT u.user_id, u.user_email, u.user_firstname, o.orgType , o.orgName FROM users u, organization o,  pro_usr_rel r  WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'owner' AND r.Pro_ID = '$id' AND u.user_id = r.Usr_ID AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = '$pid' AND Pro_Role!= 'non_Member'))union
                                        (SELECT u.user_id, u.user_email, u.user_firstname , o.orgType , o.orgName  FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'contractor' AND p.contractor_org_id = o.orgID and p.project_id_number ='$pid'AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = '$pid' AND Pro_Role!= 'non_Member'))union
                                        (SELECT u.user_id , u.user_email , u.user_firstname , o.orgType , o.orgName  FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'consultant' AND p.consultant_org_id = o.orgID and p.project_id_number ='$pid'AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = '$pid' AND Pro_Role!= 'non_Member'))";

                                    }else{
                                        $sql = "(SELECT u.user_id, u.user_email, u.user_firstname , o.orgType , o.orgName  FROM users u, organization o  WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'owner' AND   u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = '$pid' AND Pro_Role!= 'non_Member'))union
                                        (SELECT u.user_id , u.user_email, u.user_firstname , o.orgType , o.orgName FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'contractor' AND p.contractor_org_id = o.orgID and p.project_id_number ='$pid'AND p.contractor_org_id != NULL AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = '$pid' AND Pro_Role!= 'non_Member'))union
                                        (SELECT u.user_id , u.user_email , u.user_firstname, o.orgType , o.orgName  FROM users u, organization o , projects p WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND o.orgType = 'consultant' AND p.consultant_org_id = o.orgID and p.project_id_number ='$pid'AND p.consultant_org_id != NULL AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = '$pid' AND Pro_Role!= 'non_Member'))";
                                    }
                                    //$sql = "SELECT u.user_id, u.user_email, u.user_firstname, o.orgType, o.orgName FROM users u, organization o  WHERE u.user_type !='non_active' AND u.user_org = o.orgID AND u.user_id NOT IN ( SELECT Usr_ID  FROM pro_usr_rel WHERE Pro_ID = '$pid' AND Pro_Role!= 'non_Member') ORDER BY o.orgID, u.user_id";
                                    $stmt = sqlsrv_query($conn, $sql);
                                    if ($stmt === false) {
                                        die(print_r(sqlsrv_errors(), true));
                                    }
                                    while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
                                        $userID = $row['user_id'];
                                        echo '
                                        <div class="row admin threeColumn searchv3">
                                            <div class="columnSmall textContainer"><input type ="checkbox"  class = "adminutable" value =' . $userID . ' onclick = ""></div>
                                            <div class="columnSmall textContainer" style = "display:none">' . $userID . '</div>
                                            <div class="columnLarge textContainer">' . $row['user_email'] . '</div>
                                            <div class="columnMiddle textContainer">' . $row['user_firstname'] . '</div>
                                            <div class="columnLarge textContainer">' . $row['orgName'] . '</div>
                                            <div class="columnSmall textContainer" style = "display:none">' . $row['orgType'] . '</div>
                                        </div>';
                                    }
                                }
                                echo' 
                            </div>
                        </div>
                    </div>
                    <div class = "container-button">
                        <div class="buttoncontainer">
                            <button id="adminaddUser" onclick= "OnClickAdminAddUser()" title="Add User(s) to Project">></button>
                            <button id="adminremoveUser" onclick ="OnClickAdminRemoveUser()" title="Remove User(s) from Project"><</button>
                            <br><br><br>
                            <button id="adminclearUser"onclick = "OnClickAdminClearUser()" title="Clear List at the Member of Project section"><img src="Images/icons/admin_page/trash-can.png"></button>
                        </div>
                    </div>
                    <div class="container-tableRight">
                        <div class="headercontainer">
                            <span> Member of Project</span>
                        </div>
                        <div class="tablecontainer">
                            <div class="tableHeader admin fourColumn">
                                <span class="columnSmall"><input type = "checkbox"  onchange = "checkAllFormUserstableright(this)"></span>
                                <span class="columnLarge">Email</span>
                                <span class="columnMiddle">Name</span>
                                <span class="columnLarge">Organization</span>
                                <span class="columnLarge">Project Role</span>';
                                if($_SESSION['is_Parent'] == "isParent" && $_SESSION['user_org'] == "JKR" && $_SESSION['project_role'] == "Project Monitor"){
                                    echo '<span class="columnSmall">Reporting</span>';
                                }
                            echo'</div>
                            <div class="tableBody" id="adminSelectUserTableBody" rel="2">';
                                if ($SYSTEM == 'KKR'){
                                    $pid = $_SESSION['project_id'];
                                    $sql = "SELECT u.user_id, u.user_email, u.user_firstname, p.Pro_Role, o.orgName, o.orgType FROM users u, pro_usr_rel p, organization o WHERE u.user_id = p.Usr_ID AND p.Pro_ID = '$pid' AND p.Pro_Role != 'non_Member' AND u.user_org = o.orgID ORDER BY o.orgID, u.user_id";
                                    $stmt = sqlsrv_query($conn, $sql);
                                    if ($stmt === false) {
                                        die(print_r(sqlsrv_errors(), true));
                                    }
                                    while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
                                        $userID = $row['user_id'];
                                        echo '<div class="row admin fourColumn">';
                                        echo '<div class="columnSmall textContainer"> <input type ="checkbox" id =' . $userID . ' class = "adminselectutable"></div>';
                                        echo '<div style = "display:none">' . $userID . '</div>';
                                        echo '<div class="columnLarge textContainer">' . $row['user_email'] . '</div>';
                                        echo '<div class="columnMiddle textContainer">' . $row['user_firstname'] . '</div>';
                                        echo '<div class="columnLarge textContainer">' . $row['orgName'] . '</div>';

                                        switch ($row['orgType']) {
                                            //case "Project Manager": case "Finance Officer": case "QAQC Engineer":  case "Director":  case "Construction Engineer": case "Safety Officer":  case "Planning Engineer":
                                            case "owner":
                                                echo '<div class="columnLarge textContainer">
                                                            <select id=' . "s" . $userID . ' class = "addadminuserselect">';
                                                            foreach ($roles as $r) {
                                                                echo '<option value= "'.$r.'" ';if ($row['Pro_Role'] == $r) echo ' selected="selected"'; echo'>'.$r.'</option>';
                                                            }
                                                            echo '</select>
                                                        </div>';
                                            break;
                                            case "contractor": 
                                                echo '<div class="columnLarge textContainer"><select id=' . "s" . $userID . ' class = "addadminuserselect">
                                                <option value= "Contractor PM" ';if ($row['Pro_Role'] == "Contractor PM") echo ' selected="selected"'; echo'>Contractor PM</option>
                                                <option value= "Contractor Engineer" ';if ($row['Pro_Role'] == "Contractor Engineer") echo ' selected="selected"'; echo'>Contractor Engineer</option>
                                                <option value= "Contractor DC" ';if ($row['Pro_Role'] == "Contractor DC") echo ' selected="selected"'; echo'>Contractor DC</option>
                                                <option value= "Site Supervisor" ';if ($row['Pro_Role'] == "Site Supervisor") echo ' selected="selected"'; echo'>Site Supervisor</option>
                                                <option value= "HSET Officer" ';if ($row['Pro_Role'] == "HSET Officer") echo ' selected="selected"'; echo'>HSET Officer</option>
                                                <option value= "Contractor CM" ';if ($row['Pro_Role'] == "Contractor CM") echo ' selected="selected"'; echo'>Contractor CM</option>
                                                <option value= "QAQC Officer" ';if ($row['Pro_Role'] == "QAQC Officer") echo ' selected="selected"'; echo'>QAQC Officer</option>
                                                <option value= "Contractor QS" ';if ($row['Pro_Role'] == "Contractor QS") echo ' selected="selected"'; echo'>Contractor QS</option>
                                                </select></div>';
                                            break;
                                            case "consultant":
                                                echo '<div class="columnLarge textContainer"><select id=' . "s" . $userID . ' class = "addadminuserselect">
                                                <option value= "Consultant CRE" ';if ($row['Pro_Role'] == "Consultant CRE") echo ' selected="selected"'; echo'>Consultant CRE</option>
                                                <option value= "Consultant RE" ';if ($row['Pro_Role'] == "Consultant RE") echo ' selected="selected"'; echo'>Consultant RE</option>
                                                <option value= "Consultant DC" ';if ($row['Pro_Role'] == "Consultant DC") echo ' selected="selected"'; echo'>Consultant DC</option>
                                                <option value= "Sys Consultant" ';if ($row['Pro_Role'] == "Sys Consultant") echo ' selected="selected"'; echo'>Sys Consultant</option>
                                                <option value= "Consultant QS" ';if ($row['Pro_Role'] == "Consultant QS") echo ' selected="selected"'; echo'>Consultant QS</option>
                                                </select></div>';
                                            break;
                                        }
                                        echo '<div style = "display:none">' . $row['orgType'] . '</div>';

                                        if($_SESSION['is_Parent'] == "isParent"){
                                            echo '<span class="textContainer"><input type ="checkbox"></span>';
                                        }

                                        echo '</div>';
                                    }
                                }
                                echo'
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id ="profileUserViewID" class="infoView">
                <form class="infoContent">
                    <div class="infoPicture">
                        <span class="infoInitial" id ="span_initial">';
                            if (isset($_SESSION["firstname"]) && isset($_SESSION["lastname"])) {
                                echo (substr($_SESSION["firstname"], 0, 1) . substr($_SESSION["lastname"], 0, 1));
                            }
                            echo '
                        </span>
                    </div>
                    <div class="infoHeader-readonly"><h3 id = "h3_fullname_profileuser">Name</h3><h4 id="h4_role">Title</h4></div> 
                    <div class="infoHeader-edit"><h3>Edit User</h3></div> 
                    <span id="profileCloseButton" class ="closebutton" rel = "profileUserViewID" onclick = "closemodal(this)">&times;</span>
                    <div class="infoContainerMainBody">
                        <div class="infoContainerBody-edit">';
                            if($SYSTEM == 'KKR'){
                                echo'
                                <div class="idcontainer">
                                    <label>User ID</label>
                                    <br>
                                    <input class="newid" type="text" id="newIDprofile" readonly onfocus="this.blur" style="background-color: lightgrey; outline:none; cursor: not-allowed">
                                </div>
                                ';
                            }
                            echo'
                            <div class="doubleinput">
                                <div class="column1">
                                    <label>First Name</label>
                                    <br>
                                    <input type="text" required id="firstnameprofile" name="firstnameprofile"  pattern="[A-Za-z]\S.*">
                                </div>
                                <div class="column2">
                                    <label>Last Name</label>
                                    <br>
                                    <input type="text" required id="lastnameprofile" name="lastnameprofile"  pattern="[A-Za-z]\S.*">
                                </div>
                            </div>
                            <label>Country</label>
                            <br>
                            <select type="text" id="countryprofile" name="countryprofile">
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="American Samoa">American Samoa</option>
                                <option value="Andorra">Andorra</option>
                                <option value="Angola">Angola</option>
                                <option value="Anguilla">Anguilla</option>
                                <option value="Antarctica">Antarctica</option>
                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Aruba">Aruba</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahamas">Bahamas</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Barbados">Barbados</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Belize">Belize</option>
                                <option value="Benin">Benin</option>
                                <option value="Bermuda">Bermuda</option>
                                <option value="Bhutan">Bhutan</option>
                                <option value="Bolivia">Bolivia</option>
                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                <option value="Botswana">Botswana</option>
                                <option value="Bouvet Island">Bouvet Island</option>
                                <option value="Brazil">Brazil</option>
                                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                <option value="Brunei Darussalam">Brunei Darussalam</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Burkina Faso">Burkina Faso</option>
                                <option value="Burundi">Burundi</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Cameroon">Cameroon</option>
                                <option value="Canada">Canada</option>
                                <option value="Cape Verde">Cape Verde</option>
                                <option value="Cayman Islands">Cayman Islands</option>
                                <option value="Central African Republic">Central African Republic</option>
                                <option value="Chad">Chad</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Christmas Island">Christmas Island</option>
                                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Comoros">Comoros</option>
                                <option value="Congo">Congo</option>
                                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                <option value="Cook Islands">Cook Islands</option>
                                <option value="Costa Rica">Costa Rica</option>
                                <option value="Cote D\'ivoire">Cote D\'ivoire</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cuba">Cuba</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Djibouti">Djibouti</option>
                                <option value="Dominica">Dominica</option>
                                <option value="Dominican Republic">Dominican Republic</option>
                                <option value="Ecuador">Ecuador</option>
                                <option value="Egypt">Egypt</option>
                                <option value="El Salvador">El Salvador</option>
                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                <option value="Eritrea">Eritrea</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Ethiopia">Ethiopia</option>
                                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                <option value="Faroe Islands">Faroe Islands</option>
                                <option value="Fiji">Fiji</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="French Guiana">French Guiana</option>
                                <option value="French Polynesia">French Polynesia</option>
                                <option value="French Southern Territories">French Southern Territories</option>
                                <option value="Gabon">Gabon</option>
                                <option value="Gambia">Gambia</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Gibraltar">Gibraltar</option>
                                <option value="Greece">Greece</option>
                                <option value="Greenland">Greenland</option>
                                <option value="Grenada">Grenada</option>
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Guam">Guam</option>
                                <option value="Guatemala">Guatemala</option>
                                <option value="Guinea">Guinea</option>
                                <option value="Guinea-bissau">Guinea-bissau</option>
                                <option value="Guyana">Guyana</option>
                                <option value="Haiti">Haiti</option>
                                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                <option value="Honduras">Honduras</option>
                                <option value="Hong Kong">Hong Kong</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Jamaica">Jamaica</option>
                                <option value="Japan">Japan</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kiribati">Kiribati</option>
                                <option value="Korea, Democratic People\'s Republic of">Korea, Democratic People\'s Republic of</option>
                                <option value="Korea, Republic of">Korea, Republic of</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                <option value="Lao People\'s Democratic Republic">Lao People\'s Democratic Republic</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lesotho">Lesotho</option>
                                <option value="Liberia">Liberia</option>
                                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Macao">Macao</option>
                                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                <option value="Madagascar">Madagascar</option>
                                <option value="Malawi">Malawi</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Mali">Mali</option>
                                <option value="Malta">Malta</option>
                                <option value="Marshall Islands">Marshall Islands</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Mauritania">Mauritania</option>
                                <option value="Mauritius">Mauritius</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                <option value="Moldova, Republic of">Moldova, Republic of</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Mongolia">Mongolia</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Mozambique">Mozambique</option>
                                <option value="Myanmar">Myanmar</option>
                                <option value="Namibia">Namibia</option>
                                <option value="Nauru">Nauru</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Netherlands Antilles">Netherlands Antilles</option>
                                <option value="New Caledonia">New Caledonia</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nicaragua">Nicaragua</option>
                                <option value="Niger">Niger</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Niue">Niue</option>
                                <option value="Norfolk Island">Norfolk Island</option>
                                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Palau">Palau</option>
                                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                <option value="Panama">Panama</option>
                                <option value="Papua New Guinea">Papua New Guinea</option>
                                <option value="Paraguay">Paraguay</option>
                                <option value="Peru">Peru</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Pitcairn">Pitcairn</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Reunion">Reunion</option>
                                <option value="Romania">Romania</option>
                                <option value="Russian Federation">Russian Federation</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Saint Helena">Saint Helena</option>
                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                <option value="Saint Lucia">Saint Lucia</option>
                                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                <option value="Samoa">Samoa</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Serbia and Montenegro">Serbia and Montenegro</option>
                                <option value="Seychelles">Seychelles</option>
                                <option value="Sierra Leone">Sierra Leone</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="Solomon Islands">Solomon Islands</option>
                                <option value="Somalia">Somalia</option>
                                <option value="South Africa">South Africa</option>
                                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                <option value="Spain">Spain</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Sudan">Sudan</option>
                                <option value="Suriname">Suriname</option>
                                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                <option value="Swaziland">Swaziland</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                                <option value="Tajikistan">Tajikistan</option>
                                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Timor-leste">Timor-leste</option>
                                <option value="Togo">Togo</option>
                                <option value="Tokelau">Tokelau</option>
                                <option value="Tonga">Tonga</option>
                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                <option value="Tunisia">Tunisia</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Turkmenistan">Turkmenistan</option>
                                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                <option value="Tuvalu">Tuvalu</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                <option value="Uruguay">Uruguay</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="Vanuatu">Vanuatu</option>
                                <option value="Venezuela">Venezuela</option>
                                <option value="Viet Nam">Viet Nam</option>
                                <option value="Virgin Islands, British">Virgin Islands, British</option>
                                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                <option value="Wallis and Futuna">Wallis and Futuna</option>
                                <option value="Western Sahara">Western Sahara</option>
                                <option value="Yemen">Yemen</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                            </select>';
                            echo '                      
                            <input type="checkbox" class="resetcheck" id="checkresetpasswordprofile" name="Reset Password?">
                            <label class="resetcheck" id="checkresetlabelprofile">Change Password?</label>
                            <br>
                            <div class="resetpasswordcontainer" style="display: none;">
                                <label class="required">Password</label>
                                <br>
                                <input placeholder="Enter your password here" required type="password" id="newpasswordprofile" name="newpasswordprofile" pattern=".{5,}" autocomplete="new-password">
                                <div class="password-showhide">  
                                    <button type="button" class="password-show" rel="newpasswordprofile"><img title="Show Password" src="Images/icons/gen_button/visibility.png" alt=""></button>
                                    <button type="button" style="display:none" class="password-hide" rel="newpasswordprofile"><img title="Hide Password" src="Images/icons/gen_button/hide.png" alt=""></button>
                                </div> 
                                <div class="passindicator" style= "width: 100%">
                                    <div id="passwordstrengthContainerprofile">
                                        <div id="passwordstrengthprofile"></div>
                                    </div>
                                    <span id="passwordstrengthTextprofile"></span>
                                </div>
                                <label class="required">Confirm Password</label>
                                <br>
                                <input type="password" id="newconfirmpasswordprofile" name="newconfirmpasswordprofile" autocomplete="new-password">
                                <div class="confirm-password-showhide">  
                                    <button type="button" class="password-show-confirm" rel="newconfirmpasswordprofile"><img title="Show Password" src="Images/icons/gen_button/visibility.png" alt=""></button>
                                    <button type="button" style="display:none" class="password-hide-confirm" rel="newconfirmpasswordprofile"><img title="Hide Password" src="Images/icons/gen_button/hide.png" alt=""></button>
                                </div> 
                            </div>
                            <input type="checkbox" class="resetcheck" id="checkresetbentleycredentials" name="resetBentleycredentials">
                            <label class="resetcheck" id="checkresetBentleylabelprofile">Change Bentley Credentials?</label>
                            <div class="resetbentleycredscontainer" style="display: none;">
                                <label class = "required">username</label>
                                <br>
                                <input placeholder = "Enter your username here" require = "required" id="newbentleyusernameprofile" name = "newbentleyusernameprofile">
                                <label class="required">Password</label>
                                <br>
                                <input placeholder="Enter your password here" require="required"  type="password" id="newbentleypasswordprofile" name="newbentleypasswordprofile" >
                            </div>
                        </div>
                        <div class="infoContainerBody-readonly">
                            <img src="Images/icons/profileuserview/profile-user.png" title ="Name"><span id="img_fullname">Name</span>
                            <br> <img src="Images/icons/profileuserview/email.png" title ="Email"><span id="img_email">Email</span>
                            <br> <img src="Images/icons/profileuserview/mobilenumber.png" title ="Phone Number"><a id="img_mobileno">0123456789</a>
                            <br> <img src="Images/icons/profileuserview/briefcase.png" title ="Organization"><span id="img_org">Org</span>
                            <br> <img src="Images/icons/profileuserview/dark-earth-globe-symbol-of-international-business.png" title ="Country"><span id="img_country">Country</span>
                            <br></div>
                    </div>
                    <div class="profileuserFooter">
                        <div class="editPage">
                            <button id="profileuserSave">Save</button>
                            <button id="profileuserCancel">Cancel</button>
                        </div>
                        <div class="readonly">
                            <button id="profileuserEdit">Edit</button>
                            <button id="profileuserClose">Close</button>
                        </div>
                    </div>    
                </form>
            </div>';
            echo '
            <div id ="projectViewID" class="projectinfoView">
                <div class="projectinfoContent">
                    <div class="projectinfoPicture">
                        <span class="projectinfoInitial" id ="span_projectinitial"><img class= "img"  src= "';
                            if ($_SESSION['icon_url'] !== "") {
                                echo (file_exists('../'.$_SESSION['icon_url'])) ? '../'.$_SESSION['icon_url'] : 'favicon.ico';
                            }
                            echo '">
                        </span>
                    </div>
                    <div class="projectinfoHeader">
                        <h3 id = "h3_fullname_projectinfo">';
                            if (isset($_SESSION['project_name'])) {
                                echo $_SESSION['project_name'];
                            }
                            echo '
                        </h3>
                    </div> 
                    <span id="projectCloseButton" class ="closebutton" rel = "projectViewID">&times;</span>
                    <div class="projectinfoContainerMainBody">
                        <div class="projectinfoContainerBody ">
                            <img src="Images/icons/admin_page/profile/fingerprint.png" title ="Project ID">
                            <a id="viewprojectiddisplay">';
                                if (isset($_SESSION['projectID'])) {
                                    echo $_SESSION['projectID'];
                                }
                                echo '
                            </a><br>
                            <img src="Images/icons/admin_page/profile/projectname.png" title ="Project Name">
                            <a id="viewprojectnamedisplay">';
                                if (isset($_SESSION['project_name'])) {
                                    echo $_SESSION['project_name'];
                                }
                                echo '
                            </a><br>
                            <img src="Images/icons/admin_page/profile/factory.png" title ="Industry">
                            <a id="viewprojectindustrydisplay">';
                                if (isset($_SESSION['industry'])) {
                                    echo $_SESSION['industry'];
                                }
                                echo '
                            </a><br>
                            <img src="Images/icons/admin_page/profile/placeholder.png" title ="Location">
                            <a id="viewprojectlocationdisplay">';
                                if (isset($_SESSION['location'])) {
                                    echo $_SESSION['location'];
                                }
                                echo '
                            </a><br>';
                            if($SYSTEM == 'OBYU'){
                                if ($_SESSION['project_owner'] == "UTSB"){
                                    echo'
                                    <img src="Images/icons/admin_page/newprojectform/client-utsb.png" title ="Client">
                                    <a id="viewprojectclientdisplay"></a><br>
                                    <img src="Images/icons/admin_page/newprojectform/sme-utsb.png" title ="SME">
                                    <a id="viewprojectsmedisplay"></a><br>';
                                }
                            }
                            echo'
                            <img src="Images/icons/admin_page/profile/clock.png" title ="Timezone">
                            <a id="viewprojecttimezonedisplay">';
                                if (isset($_SESSION['time_zone_text'])) {
                                    echo $_SESSION['time_zone_text'];
                                }
                                echo '
                            </a><br>
                            <img src="Images/icons/admin_page/profile/pencil.png" title ="Created by"><a id="viewprojectcreatetimedisplay">' . $_SESSION['created_by'] . ' ' . $_SESSION['created_time'] .'</a><br>
                            <img src="Images/icons/admin_page/profile/pencil.png" title ="Last Update">
                            <a id="viewprojectlastupdatedisplay">';
                                if (!is_null($_SESSION['updated_by']) && !is_null($_SESSION['last_update'])) {
                                    echo $_SESSION['updated_by'] . ' ' . $_SESSION['last_update'];
                                } else {
                                    echo '';
                                }
                                echo '
                            </a><br>
                            <img src="Images/icons/admin_page/profile/duration.png" title ="Project Duration">
                            <a id="viewprojectstartdate">';
                                if (isset($_SESSION['start_date']) && isset($_SESSION['end_date']) && isset($_SESSION['projectDuration'])) {
                                    echo $_SESSION['start_date'] . ' - ' . $_SESSION['end_date'] . ' (' . $_SESSION['projectDuration'] . ' Days)';
                                } else {
                                    echo '';
                                }
                                echo '
                            </a><br>';
                            if (isset($_SESSION['EOT'])) {
                                echo  '
                                <img src="Images/icons/admin_page/profile/noti.png" title ="Project New End Date">
                                <a id="viewprojectnewenddate">' ./*$_SESSION["newEndDate"]*/ '</a><br><br>
                                <button class="collapsible">EOT Information</button>
                                <div class="contentAdmin">';
                                    foreach ($_SESSION['EOT'] as $obj) {
                                        echo "<a target=\'_blank\' href=" . $obj->docURL . ">" . $obj->duration . " days</a><br>";
                                    }
                                    echo '
                                </div>';
                            }
                            echo '
                            <br>
                            <button class="collapsible">Contact Project Admin</button>
                            <div class="contentAdmin">';
                            if (isset($_SESSION['Project Manager']) && is_array($_SESSION['Project Manager'])) {
                                foreach ($_SESSION['Project Manager'] as $admin) {
                                    echo '<a href="mailto:' . $admin . '">' . $admin . '</a><br>';
                                }
                            }
                            echo '
                            </div>
                        </div>    
                    </div>
                </div>
            </div>

            <div id ="layerinfoView" class="layerinfoView">
                <div class="layerinfoContent">
                    <div class="layerinfoHeader"><span id = "h3_fullname_layertinfo">layer name here</span></div> 
                    <span id="layerCloseButton" class ="closebutton" rel = "layerinfoView" onclick = "closemodal(this)" >&times;</span>
                    <div class="layerinfoContainerMainBody">
                        <div class="layerinfoContainerBody1">
                            <div class="layerinfoDisplay">
                                <label>Data Name</label>
                                <input type="text" id="layerinfoName" disabled><br>
                                <label>Data Type</label>
                                <input type="text" id="layerinfoType" disabled><br>
                                <label>Owner</label>
                                <input type="text" id="layerinfoOwner" disabled><br>
                                <label>Added date</label>
                                <input type="text" id="layerinfoAddeddate" disabled>
                            </div>
                        </div>
                        <div class="layerinfoContainerBody2">
                            <div class="layerinfoTable">
                                <span>Project(s) using this data:</span>
                                <div class="tablecontainer">
                                    <div class="tableHeader admin fourColumn">
                                        <span class="columnMiddle">Layer Name</span>
                                        <span class="columnMiddle">Project ID</span>
                                        <span class="columnMiddle">Project Name</span>
                                        <span class="columnMiddle">Attached By</span>
                                    </div>
                                    <div class="tableBody" id="layerUsersTable"></div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="imageViewer" class="formView">
                <div class="formContent" id="imageviewerformContent">
                    <span id="imageviewerCloseButton" class ="closebutton">&times;</span>
                    <div class="formcontainerMainBody">';
                        if($SYSTEM == 'KKR'){
                            echo'
                            <iframe id="previewWMS" style="width: 100%; height: 100%;"></iframe>';
                        }else if ($SYSTEM == 'OBYU'){
                            echo'
                            <img id="imageShow" src ="" style="width: 100%; height: 100%;"></img>';
                        }
                        echo'
                    </div>
                </div>
            </div>';

            $pid = $_SESSION['project_id'];
            $sql = "SELECT * FROM projects WHERE project_id_number =" . $pid;
            $stmt = sqlsrv_query($conn, $sql);
            if ($stmt === false) {
                die(print_r(sqlsrv_errors(), true));
            }

            while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
                $projectImg = (file_exists('../'.$row['icon_url'])) ? '../'.$row['icon_url'] : 'Images/project.png';
                echo'
                <div class="" id="main-project" style="display: block">
                    <div class="mainHeader"></div> 
                    <div class = "headerButton">
                        <button id ="savecurrentProject" class="edit">Save</button>
                        <button id ="cancelcurrentProject" class="edit">Cancel</button>
                    </div>
                    <div class="project-container">
                        <div class="formcontainerMainBody">
                            <div class="project-view" id ="readonly">
                                <div class="firstColumn">
                                    <div class="fieldcontainer">
                                        <div class="doublefield">
                                            <div class="column1 readonly" title = "Project ID">
                                                <i class="fa-solid fa-puzzle-piece"></i>
                                                <a id="projectiddisplay" class="textClamp">' . $row['project_id'] . '</a>
                                            </div>
                                            <div class="column2 readonly" title = "Industry">
                                                <i class="fa-solid fa-industry"></i>
                                                <a id="projectindustrydisplay" class="textClamp">';
                                                    if (is_null($row['industry'])) {
                                                        echo "";
                                                    } else {
                                                        echo $row['industry'];
                                                    };
                                                    echo '
                                                </a>
                                            </div>
                                        </div>
                                        <div class="doublefield">
                                            <div class="column1 readonly" title = "Location">
                                                <i class="fa-solid fa-location-dot"></i>
                                                <a id="projectlocationdisplay" class="textClamp">';
                                                    if (is_null($row['location'])) {
                                                        echo "";
                                                    } else {
                                                        echo $row['location'];
                                                    };
                                                    echo '
                                                </a>
                                            </div>                                
                                            <div class="column2 readonly" title = "Timezone">
                                                <i class="fa-solid fa-clock"></i>
                                                <a id="projecttimezonedisplay" class="textClamp">';
                                                    if (is_null($row['time_zone_text'])) {
                                                        echo "";
                                                    } else {
                                                        echo $row['time_zone_text'];
                                                    };
                                                    echo '
                                                </a>
                                            </div>
                                        </div>
                                        <div class="doublefield">
                                            <div class="column1 readonly" title = "Project Start Date">
                                                <i class="fa-solid fa-calendar-plus"></i>
                                                <a id="projectstartdatedisplay" class="textClamp">';
                                                    if (is_null($row['start_date'])) {
                                                        echo "";
                                                    } else {
                                                        echo date_format($row['start_date'], "d/m/Y");
                                                    };
                                                    echo '
                                                </a>
                                            </div>                                
                                            <div class="column2 readonly" title = "Project End Date">
                                                <i class="fa-solid fa-calendar-minus"></i>
                                                <a id="projectenddatedisplay" class="textClamp">';
                                                    if (is_null($row['end_date'])) {
                                                        echo "";
                                                    } else {
                                                        echo date_format($row['end_date'], "d/m/Y");
                                                    };
                                                    echo '
                                                </a>
                                            </div>
                                        </div>
                                        <div class="doublefield">
                                            <div class="column1 readonly" title = "Project Duration">
                                                <i class="fa-solid fa-hourglass-half"></i>
                                                <a id="projectdurationdisplay" class="textClamp">';
                                                    if (is_null($row['duration'])) {
                                                        echo "";
                                                    } else {
                                                        echo $row['duration'];
                                                    };
                                                    echo '
                                                </a>
                                            </div>';
                                            if ($SYSTEM == 'KKR'){
                                                echo'
                                                <div class="column2 readonly" title = "Warranty End Date">
                                                    <i class="fa-solid fa-stamp"></i>
                                                    <a id="projectwarrantydatedisplay" class="textClamp">';
                                                        if (is_null($row['warranty_end_date'])) {
                                                            echo "";
                                                        } else {
                                                            echo date_format($row['warranty_end_date'], "d/m/Y");
                                                        };
                                                        echo '
                                                    </a>
                                                </div>';
                                            }else if ($SYSTEM == 'OBYU'){
                                                echo '
                                                <div class="column2 readonly" title ="Montly Cut Off (Days)">
                                                    <i class="fa-solid fa-calendar-day"></i>
                                                    <a id="projectcutoffdisplay" class="textClamp">'.$row['cut_off_day'].'</a>
                                                </div>';
                                            }
                                            echo'
                                        </div>
                                        <div class="doublefield">
                                            <div class="column1 readonly" title = "Project Created By">
                                                <i class="fa-solid fa-file-circle-plus"></i>
                                                <a id="projectcreatedbydisplay" class="textClamp">' . $row['created_by'] . '</a>
                                            </div>
                                            <div class="column2 readonly" title = "Project Created Time">
                                                <i class="fa-solid fa-file-circle-plus"></i>
                                                <a id="projectcreatetimedisplay" class="textClamp">' . date_format($row['created_time'], 'd/m/Y') . '</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fieldcontainer secondrow">
                                        <div class="doublefield">
                                            <div class="column1 readonly" title = "Last Project Details Update">
                                                <div class="container">
                                                    <i class="fa-solid fa-arrows-rotate"></i>
                                                    <a id="projectlastupdatedisplay">';
                                                        if (!is_null($_SESSION['updated_by']) && !is_null($_SESSION['last_update'])) {
                                                            echo  $_SESSION['updated_by'] . ' ' . $_SESSION['last_update'];
                                                        };
                                                        echo '
                                                    </a>
                                                </div>
                                                <div class="container">';
                                                    if (isset($_SESSION['start_date']) && isset($_SESSION['end_date']) && isset($_SESSION['projectDuration'])) {
                                                        echo  '
                                                        <i class="fa-solid fa-calendar-days"></i>
                                                        <a id="viewprojectstartdate">' . $_SESSION['start_date'] . ' - ' . $_SESSION['end_date'] . ' (' . $_SESSION['projectDuration'] . ' Days)</a>';
                                                    }
                                                    echo '
                                                </div>
                                            </div>
                                            <div class="column2 readonly" title = "Project Extent Area">
                                                <i class="fa-solid fa-location-crosshairs"></i>
                                                <span class="coordinateContainer" id="coordinateval1">
                                                    <span class="column1 text-ellipsis"><span>NW: </span><span id="lati1">' . $row['latitude_1'] . '</span><span>  </span><span id="longi1"> ' . $row['longitude_1'] . ' </span></span>
                                                    <span class="column2 text-ellipsis"><span>SE: </span><span id="lati2"> ' . $row['latitude_2'] . ' </span><span>  </span><span id="longi2">' . $row['longitude_2'] . ' </span></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>';
                                        }
                                    echo '
                                </div>
                                <div class="secondColumn">
                                    <div class="RIWindow">
                                        <div id="RIContainer2" style="height:100%"></div>
                                    </div>
                                    <div class="projecticoncontainer">
                                        <div class="imagecontainer" title="Project Icon" id= "projectimagedisplay" rel = "' . $projectImg . '" style = "background-image: url(\'' . $projectImg . '\');"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="project-view" id= "edit">
                                <div class="newprojectContainerBody-editpage1 editContainer">
                                    <input type="text" id="projectidnumber" name="projectidnumber" readonly style="display:none">
                                    <div class="rightContainer">
                                        <div class="imagecontainer">
                                            <label for="imgInp" class="infoPicture">
                                                <div class="infoProfilePic"><img id="projectimage" src=""></div>
                                                <div class="infoContent"><img src="Images/icons/third_button/camera.png"></div>
                                            </label>
                                        </div>
                                        <input type="file" id="imgInp" name="imgInp" accept=".png, .jpeg, .jpg" hidden="true"> 
                                        <small>*Only PNG, BMP, JPEG and JPG format which are smaller than 1MB is supported</small>
                                    </div>
                                    <div class="leftContainer">
                                        <div class="doublefield">
                                            <div class="column1">
                                                <label>Project ID</label>
                                                <br>
                                                <input type="text" id="projectid" name="projectid" disabled>
                                            </div>
                                            <div class="column2">
                                                <label>Project Name</label>
                                                <br>
                                                <input type="text" id="projectname" name="projectname">
                                            </div>
                                        </div>
                                        <div class="doublefield">
                                            <div class="column1">
                                                <label>Industry</label>
                                                <br>
                                                <select type="text" id="projectindustry" name="projectindustry">
                                                    <option value="Building and Facilities">Building and Facilities</option>
                                                    <option value="Road">Road</option>
                                                    <option value="Water and Wastewater">Water and Wastewater</option>
                                                    <option value="Oil and Gas">Oil and Gas</option>
                                                    <option value="Others">Others...</option>
                                                </select>
                                            </div>
                                            <div class="column2">
                                                <label>Timezone</label>
                                                <br>
                                                <select type="text" id="projecttimezone" name="projecttimezone">
                                                    <option value="1" gmtAdjustment="GMT-12:00" useDaylightTime="0" adjuatmentValue="-12">(GMT-12:00) International Date Line West</option>
                                                    <option value="2" gmtAdjustment="GMT-11:00" useDaylightTime="0" adjuatmentValue="-11">(GMT-11:00) Midway Island, Samoa</option>
                                                    <option value="3" gmtAdjustment="GMT-10:00" useDaylightTime="0" adjuatmentValue="-10">(GMT-10:00) Hawaii</option>
                                                    <option value="4" gmtAdjustment="GMT-09:00" useDaylightTime="1" adjuatmentValue="-9">(GMT-09:00) Alaska</option>
                                                    <option value="5" gmtAdjustment="GMT-08:00" useDaylightTime="1" adjuatmentValue="-8">(GMT-08:00) Pacific Time (US & Canada)</option>
                                                    <option value="6" gmtAdjustment="GMT-08:00" useDaylightTime="1" adjuatmentValue="-8">(GMT-08:00) Tijuana, Baja California</option>
                                                    <option value="7" gmtAdjustment="GMT-07:00" useDaylightTime="0" adjuatmentValue="-7">(GMT-07:00) Arizona</option>
                                                    <option value="8" gmtAdjustment="GMT-07:00" useDaylightTime="1" adjuatmentValue="-7">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                                                    <option value="9" gmtAdjustment="GMT-07:00" useDaylightTime="1" adjuatmentValue="-7">(GMT-07:00) Mountain Time (US & Canada)</option>
                                                    <option value="10" gmtAdjustment="GMT-06:00" useDaylightTime="0" adjuatmentValue="-6">(GMT-06:00) Central America</option>
                                                    <option value="11" gmtAdjustment="GMT-06:00" useDaylightTime="1" adjuatmentValue="-6">(GMT-06:00) Central Time (US & Canada)</option>
                                                    <option value="12" gmtAdjustment="GMT-06:00" useDaylightTime="1" adjuatmentValue="-6">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                                                    <option value="13" gmtAdjustment="GMT-06:00" useDaylightTime="0" adjuatmentValue="-6">(GMT-06:00) Saskatchewan</option>
                                                    <option value="14" gmtAdjustment="GMT-05:00" useDaylightTime="0" adjuatmentValue="-5">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                                                    <option value="15" gmtAdjustment="GMT-05:00" useDaylightTime="1" adjuatmentValue="-5">(GMT-05:00) Eastern Time (US & Canada)</option>
                                                    <option value="16" gmtAdjustment="GMT-05:00" useDaylightTime="1" adjuatmentValue="-5">(GMT-05:00) Indiana (East)</option>
                                                    <option value="17" gmtAdjustment="GMT-04:00" useDaylightTime="1" adjuatmentValue="-4">(GMT-04:00) Atlantic Time (Canada)</option>
                                                    <option value="18" gmtAdjustment="GMT-04:00" useDaylightTime="0" adjuatmentValue="-4">(GMT-04:00) Caracas, La Paz</option>
                                                    <option value="19" gmtAdjustment="GMT-04:00" useDaylightTime="0" adjuatmentValue="-4">(GMT-04:00) Manaus</option>
                                                    <option value="20" gmtAdjustment="GMT-04:00" useDaylightTime="1" adjuatmentValue="-4">(GMT-04:00) Santiago</option>
                                                    <option value="21" gmtAdjustment="GMT-03:30" useDaylightTime="1" adjuatmentValue="-3.5">(GMT-03:30) Newfoundland</option>
                                                    <option value="22" gmtAdjustment="GMT-03:00" useDaylightTime="1" adjuatmentValue="-3">(GMT-03:00) Brasilia</option>
                                                    <option value="23" gmtAdjustment="GMT-03:00" useDaylightTime="0" adjuatmentValue="-3">(GMT-03:00) Buenos Aires, Georgetown</option>
                                                    <option value="24" gmtAdjustment="GMT-03:00" useDaylightTime="1" adjuatmentValue="-3">(GMT-03:00) Greenland</option>
                                                    <option value="25" gmtAdjustment="GMT-03:00" useDaylightTime="1" adjuatmentValue="-3">(GMT-03:00) Montevideo</option>
                                                    <option value="26" gmtAdjustment="GMT-02:00" useDaylightTime="1" adjuatmentValue="-2">(GMT-02:00) Mid-Atlantic</option>
                                                    <option value="27" gmtAdjustment="GMT-01:00" useDaylightTime="0" adjuatmentValue="-1">(GMT-01:00) Cape Verde Is.</option>
                                                    <option value="28" gmtAdjustment="GMT-01:00" useDaylightTime="1" adjuatmentValue="-1">(GMT-01:00) Azores</option>
                                                    <option value="29" gmtAdjustment="GMT+00:00" useDaylightTime="0" adjuatmentValue="0">(GMT+00:00) Casablanca, Monrovia, Reykjavik</option>
                                                    <option value="30" gmtAdjustment="GMT+00:00" useDaylightTime="1" adjuatmentValue="0">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
                                                    <option value="31" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                                                    <option value="32" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                                                    <option value="33" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                                                    <option value="34" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
                                                    <option value="35" gmtAdjustment="GMT+01:00" useDaylightTime="1" adjuatmentValue="1">(GMT+01:00) West Central Africa</option>
                                                    <option value="36" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Amman</option>
                                                    <option value="37" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Athens, Bucharest, Istanbul</option>
                                                    <option value="38" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Beirut</option>
                                                    <option value="39" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Cairo</option>
                                                    <option value="40" gmtAdjustment="GMT+02:00" useDaylightTime="0" adjuatmentValue="2">(GMT+02:00) Harare, Pretoria</option>
                                                    <option value="41" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                                                    <option value="42" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Jerusalem</option>
                                                    <option value="43" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Minsk</option>
                                                    <option value="44" gmtAdjustment="GMT+02:00" useDaylightTime="1" adjuatmentValue="2">(GMT+02:00) Windhoek</option>
                                                    <option value="45" gmtAdjustment="GMT+03:00" useDaylightTime="0" adjuatmentValue="3">(GMT+03:00) Kuwait, Riyadh, Baghdad</option>
                                                    <option value="46" gmtAdjustment="GMT+03:00" useDaylightTime="1" adjuatmentValue="3">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                                                    <option value="47" gmtAdjustment="GMT+03:00" useDaylightTime="0" adjuatmentValue="3">(GMT+03:00) Nairobi</option>
                                                    <option value="48" gmtAdjustment="GMT+03:00" useDaylightTime="0" adjuatmentValue="3">(GMT+03:00) Tbilisi</option>
                                                    <option value="49" gmtAdjustment="GMT+03:30" useDaylightTime="1" adjuatmentValue="3.5">(GMT+03:30) Tehran</option>
                                                    <option value="50" gmtAdjustment="GMT+04:00" useDaylightTime="0" adjuatmentValue="4">(GMT+04:00) Abu Dhabi, Muscat</option>
                                                    <option value="51" gmtAdjustment="GMT+04:00" useDaylightTime="1" adjuatmentValue="4">(GMT+04:00) Baku</option>
                                                    <option value="52" gmtAdjustment="GMT+04:00" useDaylightTime="1" adjuatmentValue="4">(GMT+04:00) Yerevan</option>
                                                    <option value="53" gmtAdjustment="GMT+04:30" useDaylightTime="0" adjuatmentValue="4.5">(GMT+04:30) Kabul</option>
                                                    <option value="54" gmtAdjustment="GMT+05:00" useDaylightTime="1" adjuatmentValue="5">(GMT+05:00) Yekaterinburg</option>
                                                    <option value="55" gmtAdjustment="GMT+05:00" useDaylightTime="0" adjuatmentValue="5">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
                                                    <option value="56" gmtAdjustment="GMT+05:30" useDaylightTime="0" adjuatmentValue="5.5">(GMT+05:30) Sri Jayawardenapura</option>
                                                    <option value="57" gmtAdjustment="GMT+05:30" useDaylightTime="0" adjuatmentValue="5.5">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                                    <option value="58" gmtAdjustment="GMT+05:45" useDaylightTime="0" adjuatmentValue="5.75">(GMT+05:45) Kathmandu</option>
                                                    <option value="59" gmtAdjustment="GMT+06:00" useDaylightTime="1" adjuatmentValue="6">(GMT+06:00) Almaty, Novosibirsk</option>
                                                    <option value="60" gmtAdjustment="GMT+06:00" useDaylightTime="0" adjuatmentValue="6">(GMT+06:00) Astana, Dhaka</option>
                                                    <option value="61" gmtAdjustment="GMT+06:30" useDaylightTime="0" adjuatmentValue="6.5">(GMT+06:30) Yangon (Rangoon)</option>
                                                    <option value="62" gmtAdjustment="GMT+07:00" useDaylightTime="0" adjuatmentValue="7">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                                                    <option value="63" gmtAdjustment="GMT+07:00" useDaylightTime="1" adjuatmentValue="7">(GMT+07:00) Krasnoyarsk</option>
                                                    <option value="64" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                                                    <option value="65" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Kuala Lumpur, Singapore</option>
                                                    <option value="66" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
                                                    <option value="67" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Perth</option>
                                                    <option value="68" gmtAdjustment="GMT+08:00" useDaylightTime="0" adjuatmentValue="8">(GMT+08:00) Taipei</option>
                                                    <option value="69" gmtAdjustment="GMT+09:00" useDaylightTime="0" adjuatmentValue="9">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                                                    <option value="70" gmtAdjustment="GMT+09:00" useDaylightTime="0" adjuatmentValue="9">(GMT+09:00) Seoul</option>
                                                    <option value="71" gmtAdjustment="GMT+09:00" useDaylightTime="1" adjuatmentValue="9">(GMT+09:00) Yakutsk</option>
                                                    <option value="72" gmtAdjustment="GMT+09:30" useDaylightTime="0" adjuatmentValue="9.5">(GMT+09:30) Adelaide</option>
                                                    <option value="73" gmtAdjustment="GMT+09:30" useDaylightTime="0" adjuatmentValue="9.5">(GMT+09:30) Darwin</option>
                                                    <option value="74" gmtAdjustment="GMT+10:00" useDaylightTime="0" adjuatmentValue="10">(GMT+10:00) Brisbane</option>
                                                    <option value="75" gmtAdjustment="GMT+10:00" useDaylightTime="1" adjuatmentValue="10">(GMT+10:00) Canberra, Melbourne, Sydney</option>
                                                    <option value="76" gmtAdjustment="GMT+10:00" useDaylightTime="1" adjuatmentValue="10">(GMT+10:00) Hobart</option>
                                                    <option value="77" gmtAdjustment="GMT+10:00" useDaylightTime="0" adjuatmentValue="10">(GMT+10:00) Guam, Port Moresby</option>
                                                    <option value="78" gmtAdjustment="GMT+10:00" useDaylightTime="1" adjuatmentValue="10">(GMT+10:00) Vladivostok</option>
                                                    <option value="79" gmtAdjustment="GMT+11:00" useDaylightTime="1" adjuatmentValue="11">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
                                                    <option value="80" gmtAdjustment="GMT+12:00" useDaylightTime="1" adjuatmentValue="12">(GMT+12:00) Auckland, Wellington</option>
                                                    <option value="81" gmtAdjustment="GMT+12:00" useDaylightTime="0" adjuatmentValue="12">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                                                    <option value="82" gmtAdjustment="GMT+13:00" useDaylightTime="0" adjuatmentValue="13">(GMT+13:00) Nuku\'alofa</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="doublefield">
                                            <div class="column1">
                                                <label>Start Date</label>
                                                <br>
                                                <input type="date" id="projectstartdate" name="projectstartdate">
                                            </div>
                                            <div class="column2">
                                                <label>End Date</label>
                                                <br>
                                                <input type="date" id="projectenddate" name="projectenddate">
                                            </div>
                                        </div>
                                        <div class="doublefield">';
                                            if($SYSTEM == "OBYU"){
                                                echo'
                                                <div class="column1">
                                                    <label>Duration (Days)</label>
                                                    <br>
                                                    <input type="text" id="projectduration" name="projectduration">
                                                </div>
                                                <div class="column2">
                                                    <label for="projectcutoff">Monthly Cut Off Days?</label><br>
                                                    <input type="number" value="25" id="projectcutoff" name="projectcutoff" min="1" max="31">
                                                </div>';
                                            }else if ($SYSTEM == 'KKR'){
                                                echo'
                                                <div class="column1"> 
                                                    <label>Duration (Days)</label>
                                                    <br>
                                                    <input type="text" id="projectduration" name="projectduration">
                                                </div>
                                                <div class="column2"> 
                                                    <label>Warranty End Date</label>
                                                    <br>
                                                    <input type="date" id="warrantyenddate" name="warrantyenddate">
                                                </div>';
                                            }
                                            echo'
                                        </div>                                
                                        <div class="doublefield">
                                            <div class="column1">
                                                <label>Location</label>
                                                <br>
                                                <input type="text" id="projectlocation" name="projectlocation">
                                            </div>
                                            <div class="column2">
                                                <label>Coordinates: </label><br>
                                                <div class="coordcontainer">
                                                    <div id = "coordinateval2">
                                                        <label>NW: </label><small><span id="latit1"></span><span> , </span><span id="longit1"></span></small>
                                                        &nbsp<label>SE: </label><small><span id="latit2"></span><span> , </span><span id="longit2"></span></small>
                                                    </div>
                                                    <span style="float: right"> <button onclick ="OnClickClearMap()">Clear map</button></span>
                                                </div>
                                                <div class="RIWindow">
                                                    <!--//////////Select Location Here ////////////-->
                                                    <div id="RIContainer1" style="width: 100%; height:100%"></div>
                                                    <span style="margin-left: 40%; text-align: center"><small>*Hold <kbd>Shift</kbd> and drag across the map</small></span>
                                                </div>
                                            </div>
                                        </div>
                                    <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <script src="JS/formsanimation.js"></script>
        <script src="JS/navbaranimation.js"></script>
        <script src="JS/getPID.js"></script>
        <script src="JS/adminpagev3.js"></script>
        <script src="JS/schedulev3.js"></script>
        <script src="JS/OnClickFunctionsGui.js"></script>
        <script src="JS/DefineAreaExtent.js"></script>
        <script src = "JS/scrollBarCollapse.js"></script>
        <script src = "JS/JsLibrary/jscolor.js"></script>
        <script src="JS/uploader/resumablejsv3/resumable.js"></script>
        <script src = "JS/uploader/AicUploaderv3.js"></script>
</body>
</html>';
?>
