<?php
include "verify_postlogin.php";
require "include/db_connect.php";

$postLoginRole = 'User';
$dummy ="dummy";
global $projectManager;

echo '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reveron Insights</title>
    <link rel="shortcut icon" href="../revicons.ico" type="image/x-icon" />
    <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>
    <script src="../JS/JsLibrary/jquery-ui.js"></script>
    <link rel="stylesheet" href="../CSS/blue/menuAnimation.css">
    <link rel ="stylesheet" href ="../CSS/tooltip1.css" type ="text/css" />
    <script src="../JS/JsLibrary/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="../JS/JsLibrary/jquery-confirm.min.css">
    <script src="../JS/resizeable.js"></script>
    <link rel="stylesheet" href="../CSS/kbd.css">
    <script src = "JS/JsLibrary/jquery.validate.min.js"></script>
    <script src="../JS/fontawesome.js"></script>
    <link rel="stylesheet" href="../CSS/jquery.scrollbar.css">
    <link rel="stylesheet" href="../CSS/scrollBarCollapse.css">                            <!--     CSS for project info (click to drop mor info)-->
    <script src="../JS/JsLibrary/jquery.scrollbar.js"></script>                    <!--     JS for-->
</head>';

echo '
<body>';

    echo '
        <div id = "topDashboard" style = "width: 100%; height: 100%; position: absolute; z-index: 7; background:#F5F5F5; display:'.((isset($_SESSION['top_level']) && $_SESSION['top_level']) ? 'block' : 'none').'">
            <iframe src = "../Dashboard/General/executiveManagement.php" style = "width: 100%; height: 100%; border: unset;">
            </iframe>
        </div>';

    echo '
    
        <nav class="nav-bar index active" >
            <span class="sidebarItem" title="Menu Bar" id="sidebarItemOpen"><img src="../Images/icons/navbar/dark_red/show-apps-button.png" alt=""></span>
            <span title="Profile" class="navbarItem" id="usersetting" rel="profileDrop">
                <div  class="navbar-infopicture">
                    <span class = "initial" id ="navbar_initial">';
                        if (isset($_SESSION["firstname"]) && isset($_SESSION["lastname"])) {
                            echo (substr($_SESSION["firstname"], 0, 1) . substr($_SESSION["lastname"], 0, 1));
                        }
                        echo '
                    </span>
                </div>
            </span>
            <ul class="button">
                <li>
                    <a style="text-decoration: none" href="https://www.reveronconsulting.com/" target="_blank">
                        <img src="../Images/icons/navbar/dark_red/logo-light.png">
                        <span>Reveron Insights</span>
                    </a>
                </li>
            </ul>
        </nav>

        <div class="minimize" id="demo">&or;</div>

        <div class="appsbar">
            <div class="sidebarItem" id="sidebarItemClose"><img src="../Images/icons/navbar/show-apps-button(red).png" alt=""></div>

            <div class="appscontainer">
                <h3>Apps</h3>
                <div class="scrollcontainer scrollbar-inner">
                    <div class="appsbutton"  id="sideBarButtonLink">
                        <button onclick="window.open(\'https://wsg.reveronconsulting.com/ReveronInsights/Documentation/Home.php\')"><span class="img"><img src="../Images/icons/appsbar/icons8-literature-40.png"></span><span class="atag"><a>Product Documentation</a></span></button>
                        <button value="Open Window" onclick="window.open(\'https://www.reveronconsulting.com/\')" ><span class="img"><img src="../Images/icons/appsbar/Adobe_20190729_160447.png"></span><span class="atag"><a>Reveron website</a></span></button>';
                        if (isset($_SESSION['support_user']) && $_SESSION['support_user'] == true ){
                            echo '
                            <button onclick= "OnClickRaiseSupport()"><span class="img"><img src="../Images/icons/appsbar/service_request.png"></span><span class="atag"><a>Raise Support</a></span></button>';
                        }
                    echo'
                    </div>
                </div>
            </div>
        </div>

        <div class = "dropitem" id= "profileDrop">
            <div class="profileitems" id="usernameEmail">
                <strong>
                    Hi, ' . $_SESSION["firstname"] . '
                </strong>
                <br>
                <p id="myprofileEmail">' .
                    $_SESSION["email"] . '
                </p>
            </div>
            <button class="profileitems log" id="viewProfile" rel = "profileUserViewID" onclick="OnClickViewProfile()"><span><img src="../Images/icons/navbar/icons8-user-100.png" ></span>View Profile</button><br>
            <button class="profileitems" id="changeUi" onclick="newUI()">
                <span>
                    <img src="../Images/icons/navbar/setting.png" >
                </span>Change to New UI
            </button><br>
            <form action ="include/logout">
                <button class="profileitems" id="signOut" name = "signOut" type = "submit" ><span><img src="../Images/icons/navbar/icons8-exit-100.png" ></span>Sign Out</button>
            </form>
        </div>

        <div class = "dropitem" id= "notiDrop">
        </div>

    <div class ="financePage">
        <div class="filterContainer">
            <img class="icon" src="../Images/icons/postlogin/search.png">
            <input type="text" placeholder="Search" onkeyup="searchForName(this)" rel="cardContainer">
        </div>
        <div class="cardContainer" id="cardContainer">';

        //flag for checking if the user is project manager
        $projectManager = false;
if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];
    //read the access control json file
    $access_control = json_decode(file_get_contents("../BackEnd/accessControl.json"), true);
    $access_control_asset = json_decode(file_get_contents("../BackEnd/accessControlAsset.json"), true);
    //echo(json_encode($access_control));
    $sql = "SELECT * FROM users u left join pro_usr_rel pur on u.user_ID = pur.Usr_ID left join projects p on p.project_id_number=pur.Pro_ID where u.user_email='$email' AND u.user_type != 'non_active' ORDER BY p.project_name ASC;";
    $triggered = false;
    $triggered2 = false;
    $proid_array = array();
    $admin_array = array();
    $result = sqlsrv_query($conn, $sql);
    //echo ' <select class="selectprojectlist" name="projectid" id="selectprojectlist">';
    while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
        $p_Name = $row['project_name'];
        $icon_url = $row['icon_url'];
        $icon_link = "../../" . $row['icon_url'];
        $p_ID = $row['project_id_number'];
        $is_parent = $row['parent_project_id_number'];

        if ($triggered2 == false) {
            $triggered2 = true;
            if ($row['theme_preference'] == 1) {
                $_SESSION['theme'] = "blue";
            } else if ($row['theme_preference'] == 2) {
                $_SESSION['theme'] = "dark_red";
            } else if ($row['theme_preference'] == 3) {
                $_SESSION['theme'] = "light_color";
            }
            $_SESSION['user_org'] = $row['user_org'];
        }

        if ($row['user_type'] == 'system_admin') {
            $postLoginRole = 'System Admin';
            if ($triggered == false) {
                //  echo '<option value="SystemAdmin">System Admin</option>';
                echo '<div class="card" id="SystemAdmin" title="System Admin">
                                <img src="../Images/icons/appsbar/sysadmin.png">
                                <a class="pName">System Admin</a>
                                </div>';
                $triggered = true;
                $_SESSION['isSysadmin'] = true;
            }
        }
        if ($row['Pro_Role'] == 'non_Member' || $row['status'] == 'archive' || !$row['status']) {
            continue;
        }
        $object = (object) [
            'project_id' => $p_ID, 'project_name' => $p_Name,
            'icon_url' => $icon_url, 'project_par_id' => $is_parent,
        ];
        array_push($proid_array, $object);
        echo '<div class="card" id="card' . $p_ID . '"  title="' . $p_Name . '">
                            <img  src = "' . (file_exists($icon_link) ? $icon_link : '../favicon.ico') . '">
                    <a class="pName">' . $p_Name . '</a>
                    <div class="buttonContainer">';
        if ($is_parent != null) { // package project

            if (isset($access_control[$row['Pro_Role']])) {
                //check and set UI elements based on rights
                if (isset($access_control[$row['Pro_Role']]["Project_Document"])) {
                    echo '<button rel="card' . $p_ID . '" id = "' . $p_ID . ':doc" onclick ="OnClickbutton(this)">
                                    <img class="appicon" src="../Images/icons/navbar/dark_red/logo-light.png">
                                    <a class="caption">Project Doc</a>
                                    </button>';
                } else {
                    echo '<div></div>';
                }
            }

            if($row['project_type'] == "ASSET"){ //different roles have project Admin access\
                echo '<div></div>';
            }
        } else {
            echo '<div></div>'; // overall project no need to go to document page
        }
            echo ' 
                    <button rel="card' . $p_ID . '" id = "' . $p_ID . ':index" onclick ="OnClickbutton(this)">
                        <img class="appicon" src="../Images/icons/navbar/dark_red/logo-light.png">
                        <a class="caption">Reveron Insights</a>
                    </button>';
        if($row['project_type'] == "ASSET"){ //different roles have project Admin access
            if (isset($access_control_asset[$row['Pro_Role']]["Project_Admin"])) {
                echo '<button rel="card' . $p_ID . '" id = "' . $p_ID . ':admin" onclick ="OnClickbutton(this)">
                            <img class="appicon" src="../Images/icons/appsbar/projectadmin.png">
                            <a class="caption">Project Admin</a>
                        </button>';
                array_push($admin_array, $p_ID);
            } else {
                echo '<div></div>';
            }

        }else  if ($row['Pro_Role'] == "Project Manager" || $row['Pro_Role'] == "Planning Engineer" || $row['Pro_Role'] == "Project Monitor" || ($row['Pro_Role'] == "Land Officer" && $row['project_owner'] == "JKR_SABAH")) {
            echo '<button rel="card' . $p_ID . '" id = "' . $p_ID . ':admin" onclick ="OnClickbutton(this)">
                        <img class="appicon" src="../Images/icons/appsbar/projectadmin.png">
                        <a class="caption">Project Admin</a>
                    </button>';
            array_push($admin_array, $p_ID);
        } else {
            echo ' <div></div>';
        }
        if($row['project_type'] == "ASSET"){ // overall project  can have contract for asset
            if (isset($access_control_asset[$row['Pro_Role']]["PFS"])) {
                echo '<button rel="card' . $p_ID . '" id = "' . $p_ID . ':finance" onclick ="OnClickbutton(this)">
                                <img class="appicon" src="../Images/icons/appsbar/money.png">
                                <a class="caption">Project Financial</a>
                                </button>';
            } else {
                echo '<div></div>';
            }

        }else if ($is_parent != null) { // package project

            if (isset($access_control[$row['Pro_Role']]["PFS"])) {
                echo '<button rel="card' . $p_ID . '" id = "' . $p_ID . ':finance" onclick ="OnClickbutton(this)">
                                <img class="appicon" src="../Images/icons/appsbar/money.png">
                                <a class="caption">Project Financial</a>
                                </button>';
            } else {
                echo '<div></div>';
            }

        } else {
            echo '<div></div>'; // overall project construct no need to go to finance page
        }
        echo '</div>
                        </div>'; // closing divs for button container and card container

        // go through each project, check if current user is Project Manager in one of the project
        if($row['Pro_Role'] == "Project Manager" || $row['Pro_Role'] == "Project Monitor"){
            $projectManager = true;
        }
        if($row['Pro_Role'] == "Planning Engineer" && $_SESSION['user_org'] == "JKRS"){
            $projectManager = true;
        }

        $_SESSION['digitalReporting_projectManager'] = $projectManager;
    }
    ;
    
    $_SESSION['project_list'] = $proid_array;
    $_SESSION['admin_pro'] = $admin_array;
    //echo $admin_array[0];
    echo '<form name = "projectPageSelection" action="postlogin_processing" method="POST" style="display:none" >';
    echo ' <input  name="projectid" id= "projectid">';
    echo ' <input  name="buttonclicked" id= "buttonclicked" >';
    echo ' </form>';
}
        $showNewsFeed = (isset($_SESSION['shownewsfeed']) && $_SESSION['shownewsfeed']) ? true : false;
echo '
        </div>
    </div>';
    echo ($showNewsFeed) ? '<button class="newsfeedOpen" onclick="openFeed()">' : '<button class="newsfeedOpen"  style="display:block;" onclick="openFeed()">';
        echo '
            <i class="fa-duotone fa-newspaper"></i>
            <span>Software Update</span>
            </button>';

        if ($projectManager == true) {
            echo '<button class="digitalReportOpen" style="display:block;" onclick="openDigitalReporting()">
                <i class="fa-duotone fa-dashboard"></i>
                <span>Digital Reporting</span>
            </button>';
        }
        else{
            '';
        } 


        echo ($showNewsFeed) ? '<div class="newsFeed active">' : '<div class="newsFeed" style="width: 0px; transition: width 0.2s ease-out 0s;">';
        echo '
        <div class="headerContainer">
            <a>Software Update Announcement</a>
            <button onclick="closeFeed()"><i class="fa-solid fa-right"></i></button>
        </div>
        <div id="newsContentContainer" class="contentContainer  scrollbar-inner">
        </div>
    </div>

    <div class="newsFeedModal" id="newsModal">
        <button id="closeNewsModal" onclick="closeNewsModal()"><i class="fa-solid fa-xmark"></i></button>
        <div class="newsFeedContent">
            <div class="image">
                <div class="backgroundImage"></div>
                <img src="https://buffer.com/library/content/images/library/wp-content/uploads/2017/03/customize-my-facebook-news-feed-featured-image.png">
            </div>
            <div class="flexContainer">
                <div class="title">News On New Reveron Insights Feature</div>
                <div class="footer">
                    <div class="timeStamp"><i class="fa-regular fa-clock"></i> 6m</div>&nbsp&nbsp•&nbsp&nbsp
                </div>
                <div class="desc scrollbar-inner" id="desc">
                    <p>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                    </p>
                    <p>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                    </p>
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
            <div class="infoHeader-readonly"><h3 id = "h3_fullname_profileuser">Name</h3><h4>'.$postLoginRole.'</h4></div>
            <div class="infoHeader-edit"><h3>Edit User</h3></div>
            <span id="profileCloseButton" class ="closebutton" rel = "profileUserViewID">&times;</span>
            <div class="infoContainerMainBody">
                <div class="infoContainerBody-edit">
                    <div class="doubleinput">
                        <div class="column1">
                            <label>First Name</label>
                            <br>
                            <input type="text" required id="firstnameprofile" name="firstnameprofile"  pattern="[A-Za-z]\S.*"> </div>
                        <div class="column2">
                            <label>Last Name</label>
                            <br>
                            <input type="text" required id="lastnameprofile" name="lastnameprofile"  pattern="[A-Za-z]\S.*"> </div>
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
                    </select>

                    <input type="checkbox" class="resetcheck" id="checkresetpasswordprofile" name="Reset Password?">
                    <label class="resetcheck" id="checkresetlabelprofile">Change Password?</label>
                    <br>
                    <div class="resetpasswordcontainer" style="display: none;">
                        <label class="required">Password</label>
                        <br>
                        <input placeholder="Enter your password here" required type="password" id="newpasswordprofile" name="newpasswordprofile" pattern=".{5,}" autocomplete="new-password">
                        <div class="password-showhide">
                            <button type="button" class="password-show" rel="newpasswordprofile"><img title="Show Password" src="../Images/icons/gen_button/visibility.png" alt=""></button>
                            <button type="button" style="display:none" class="password-hide" rel="newpasswordprofile"><img title="Hide Password" src="../Images/icons/gen_button/hide.png" alt=""></button>
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
                            <button type="button" class="password-show-confirm" rel="newconfirmpasswordprofile"><img title="Show Password" src="../Images/icons/gen_button/visibility.png" alt=""></button>
                            <button type="button" style="display:none" class="password-hide-confirm" rel="newconfirmpasswordprofile"><img title="Hide Password" src="../Images/icons/gen_button/hide.png" alt=""></button>
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
                    <img src="../Images/icons/profileuserview/profile-user.png"><span title ="Name" id="img_fullname">Name</span>
                    <br> <img src="../Images/icons/profileuserview/email.png" ><span title ="Email" id="img_email">Email</span>
                    <br> <img src="../Images/icons/profileuserview/briefcase.png"><span title ="Organization" id="img_org" title ="Organization">Company</span>
                    <br> <img src="../Images/icons/profileuserview/dark-earth-globe-symbol-of-international-business.png" ><span title ="Country" id="img_country">Country</span>
                    <br></div>
            </div>
            <div class="profileuserFooter">
                <div class="editPage">
                    <button id="postlogin-profileuserSave">Save</button>
                    <button id="profileuserCancel">Cancel</button>
                </div>
                <div class="readonly">
                    <button id="profileuserEdit">Edit</button>
                    <button id="profileuserClose">Close</button>
                </div>
            </div>
        </form>
    </div>

    <script src ="../JS/tooltip.js"></script>
    <script src="../JS/navbaranimation.js"></script>
    <script src="../JS/postlogin.js"></script>
</body> ';
