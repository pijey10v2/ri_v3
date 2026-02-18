<?php
include "verify_postlogin.php";
require "include/db_connect.php";

$postLoginRole = 'User';
$dummy ="dummy";

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
    <link rel="stylesheet" href="../CSS/v3/home.css">
    <link rel ="stylesheet" href ="../CSS/tooltip1.css" type ="text/css" />
    <script src="../JS/JsLibrary/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="../JS/JsLibrary/jquery-confirm.min.css">
    <script src="../JS/resizeable.js"></script>
    <link rel="stylesheet" href="../CSS/kbd.css">
    <script src = "JS/JsLibrary/jquery.validate.min.js"></script>
</head>';

echo '
<body>

<nav class="nav-bar active" >
    <div class="navbarButton menuButton" title="Menu Bar" id="sidebarItemOpen"><img src="../Images/icons/navbar/dark_red/show-apps-button.png" alt=""></div>
    <div class="navbarButton RiLogo">
        <img class="riImage" src="../Images/icons/navbar/dark_red/logo-light.png">
        <div>
            Reveron Insights
        </div>
    </div>
    <div class="navbarButton profile" id="usersetting" rel="profileDrop" title="Profile" >
        <img class="userImage" src="../Images/image.jfif">
    </div>
</nav>

    <div class="minimize" id="demo">&or;</div>

    <div class="appsbar">
        <div class="navbarButton menuButton" id="sidebarItemClose"><img src="../Images/icons/navbar/show-apps-button(red).png" alt=""></div>

        <div class="appscontainer">
            <h3>Apps</h3>
            <div class="scrollcontainer scrollbar-inner">
                <div class="appsbutton"  id="sideBarButtonLink">
                    <button onclick="window.open(\'https://wsg.reveronconsulting.com/ReveronInsights/Documentation/Home.php\')"><span class="img"><img src="../Images/icons/appsbar/icons8-literature-40.png"></span><span class="atag"><a>Product Documentation</a></span></button>
                    <button value="Open Window" onclick="window.open(\'https://www.reveronconsulting.com/\')" ><span class="img"><img src="../Images/icons/appsbar/Adobe_20190729_160447.png"></span><span class="atag"><a>Reveron website</a></span></button>
                </div>
            </div>
        </div>
    </div>

    <div class = "dropitem" id= "profileDrop">
        <div class="profileitems userName" id="usernameEmail">
            <strong>
                Hi, ' . $_SESSION["firstname"] . '
            </strong>
            <br>
            <p id="myprofileEmail">' .
    $_SESSION["email"] . '
            </p>
	    </div>
        <button class="profileitems log" id="viewProfile" rel = "profileUserViewID" onclick="OnClickViewProfile()"><span><img src="../Images/icons/navbar/icons8-user-100.png" ></span>View Profile</button><br>
        <form action ="include/logout">
            <button class="profileitems" id="signOut" name = "signOut" type = "submit" ><span><img src="../Images/icons/navbar/icons8-exit-100.png" ></span>Sign Out</button>
        </form>
    </div>

    <div class = "dropitem" id= "notiDrop">
    </div>

    <div style="width: 100%;height: calc(100% - 10px);position: relative;top: 55px;">
        <div style="display: inline-block;position: absolute;height: 100%;width: 60px;background-color: beige;"></div>
    <div style="display: flex;position: absolute;height: 100%;width: 60px;background-color: beige;overflow: hidden; flex-direction: column; border-radius: 0.25rem;">

    </div>

    <div style="width: 100%;height: calc(100% - 10px);position: relative;top: 55px;display: none">
        <div style="display: inline-block;margin: 5px;position: absolute;width: calc(100% - 110px);right: 40px; height: calc(100% - 100px)">
            <div style="height: 80px;">header</div>
            <div style="height: calc(100% - 80px);">
                <div style="display: inline-block;width: calc(70% - 15px);">
                    <div style="height: 80px;">title</div>
                    <div>
                        <div style="">
                            <div style="display: inline-flex;justify-content: space-evenly; width: 300px">
                                <a>All</a>
                                <a>Recent</a>
                                <a>Favourite</a>
                            </div>
                            <div style="display: inline-block;float: right;">
                                <img style="width: 20px" class="icon" src="../Images/icons/postlogin/search.png">
                                <input type="text" placeholder="Search" onkeyup="searchForName(this)" rel="cardContainer">
                            </div>
                        </div>
                        <div>list</div>
                    </div>
                </div>
                <div style="display: none;width: calc(30% - 15px);">
                    <div style="height: 80px;">title</div>
                        <div style="">
                            <div>
                                <div style="display: inline-block;float: right;">
                                    <img style="width: 20px" class="icon" src="../Images/icons/postlogin/search.png">
                                    <input type="text" placeholder="Search" onkeyup="searchForName(this)" rel="cardContainer">
                                </div>
                                <div>list</div>
                            </div>
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
