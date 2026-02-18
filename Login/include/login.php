<?php
//V3 file
session_start();
if(isset($_POST['login'])){
	require 'db_connect.php';
	$email = $_POST['email'];
	$password =  base64_decode($_POST['password']);
	if(empty($email)||empty($password)){
		header('Location: ../../?err=empty'.((isset($_GET['redirect'])) ? '&redirect='.urlencode($_GET['redirect']) : ''));
		exit();
	}
	else{
		$sql = "SELECT * FROM users u left join organization o on u.user_org = o.orgID WHERE u.user_email='$email'";
		$result = sqlsrv_query($conn,$sql);
		$resultCheck = sqlsrv_has_rows($result);
		if($resultCheck==false){
			header('Location: ../../signin?err=invalidemail'.((isset($_GET['redirect'])) ? '&redirect='.urlencode($_GET['redirect']) : ''));
			exit();
		}
		else{
			if($row = sqlsrv_fetch_array($result)){
				$hashedPwdCheck = password_verify($password,$row['user_password']);
				if($hashedPwdCheck == false){
					header("Location: ../../signin?err=wrongpw".((isset($_GET['redirect'])) ? '&redirect='.urlencode($_GET['redirect']) : ''));
					exit();
				}
				else if($hashedPwdCheck == true){
					$_SESSION['user_id'] = $row['user_id'];
					$_SESSION['email'] = trim($row['user_email'], " ");
					$_SESSION['firstname'] = $row['user_firstname'];
					$_SESSION['lastname'] = $row['user_lastname'];
					$_SESSION['user_org'] = $row['user_org'];
					$_SESSION['user_designation'] = $row['user_designation'];
					$_SESSION['password'] = $password;
					$_SESSION['created'] = time();
					$_SESSION['lastlogin']= $row['last_login'];
					$_SESSION['theme_mode']= $row['theme_mode'];
					$_SESSION['ui_pref']= $row['ui_pref'];
					$_SESSION['profile_img']= $row['profile_img'];
					$_SESSION['profile_header']= $row['profile_header'];
					$_SESSION['fav_proj']= $row['fav_proj'];
					$_SESSION['shownewsfeed']= $row['show_news_feed'];
					$_SESSION['support_user']= $row['support_user'];
					$_SESSION['top_level'] = ($email == 'testCeoSabah@gmail.com' || $email == 'testCeoSarawak@gmail.com' || $email == 'digitalReportingSarawak@gmail.com' || $email == 'digitalReportingSabah@gmail.com') ? true : false;
					$user_email = $row['user_email'];
					$_SESSION['is_Parent'] = '';
					$_SESSION['construct_license'] = $row['Constructs'];
					$_SESSION['view_pref'] = $row['view_pref'];
					$_SESSION['show_reporting'] = $row['show_reporting'];

					if ($row['user_type'] == 'system_admin') {
						$_SESSION['isSysadmin'] = true;
					}

					if ($row['theme_preference'] == 1) {
                        $_SESSION['theme'] = "blue";
                    } else if ($row['theme_preference'] == 2) {
                        $_SESSION['theme'] = "dark_red";
                    } else if ($row['theme_preference'] == 3) {
                        $_SESSION['theme'] = "light_color";
                    }
					sqlsrv_free_stmt($result);

					$sql2 = "UPDATE users SET last_login = GETDATE() WHERE user_email = '$user_email'";
					$Updateresult = sqlsrv_query($conn,$sql2);
					sqlsrv_free_stmt($Updateresult);  

					$_SESSION['proj_owner_sbh'] = false;
					$_SESSION['proj_owner_swk'] = false;
					if($row['user_org'] == 'KKR'){
						$sql3 = "SELECT * FROM users u left join pro_usr_rel pur on u.user_ID = pur.Usr_ID left join projects p on p.project_id_number=pur.Pro_ID where u.user_email='$user_email' AND u.user_type != 'non_active'";
						$result3    = sqlsrv_query($conn, $sql3);
						while ($row3 = sqlsrv_fetch_array($result3, SQLSRV_FETCH_ASSOC)) {
							$proj_owner = $row3['project_owner'];
							
							if($proj_owner == 'JKR_SABAH'){
								$_SESSION['proj_owner_sbh'] = true;
							}else if($proj_owner == 'JKR_SARAWAK'){
								$_SESSION['proj_owner_swk'] = true;
							}
						}
					}

					include_once("../../BackEnd/class/jogetLink.class.php");
					$constructLinkObj = new JogetLink();
					$constructLinkObj->setToGlobalJSVariable();							
					if (isset($_GET['redirect']) && isset($_SESSION['email'])) {
						// code same as in postlogin.php and signin.php
						$url = parse_url($_GET['redirect']);
						$path = rtrim($url['path'],".php");
						parse_str($url['query'], $urlParam);

						if($_SESSION['ui_pref'] == 'ri_v3'){
							if (isset($_SESSION['email'])){
								$_SESSION['url_from_email']  = $url['query'];
								
								if(isset($urlParam['action']) && $urlParam['action'] == 'openCorrNoti'){
									if(!isset($urlParam['u'])){
										header('Location:logout?signOut=1');
									}
									else{
										$linkEmail = $urlParam['u'];
										$checkEmail = base64_encode(base64_encode($_SESSION['email']));
										if ($linkEmail != $checkEmail){
											header('Location:logout?signOut=1');
										}
									}
								}

								// if v3 will login joget here
								?> 
								<script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>
								<script src="../../JS/JsLibrary/jogetUtil.js" ></script>
								<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js"></script>
								<script>
									var v3_flag = true;
									var jogetHost = JOGETHOST+'jw';
									var jogetAssetHost = JOGETASSETHOST+'jw';
									var username = "<?php echo $_SESSION['email'];?>";
									var password = "<?php echo $_SESSION['password'];?>";
									var detailsPass = "<?php echo $_SESSION['url_from_email'];?>";

									$(document).ready(function(){

										var loginCallbackAsset = {
											success : function(response){
												//sign out of joget first to signin so the joget session time is in sync with RI session timing
												async function logoutLogin(){
													await AssignmentManager.logout(jogetHost);
													AssignmentManager.loginWithHash(jogetHost, username, password, loginCallback);
												}
												logoutLogin();
											}
										}

										var loginCallback = {
											success : function(response){
												if(response.username == username){
													window.location.href = "../homePage.php?param="+detailsPass;
												}else{
													alert("Login fail. Please try again.");
													window.location.href = "logout?signOut=1";
												}
											}
										};
										
										if(SYSTEM && SYSTEM == 'KKR'){
											var jogetAssetHost = JOGETASSETHOST+'jw';
											//sign out of joget first to signin so the joget session time is in sync with RI session timing
											async function logoutLoginAsset(){
												//logout of joget from asset joget is causing a problem. so not doing for joget.reveron for now
												//only logging out of construct joget
												await AssignmentManager.logout(jogetHost);
												AssignmentManager.loginWithHash(jogetAssetHost, username, password, loginCallbackAsset);
											}
											logoutLoginAsset();
										}else{
											//sign out of joget first to signin so the joget session time is in sync with RI session timing
											async function logoutLogin(){
												await AssignmentManager.logout(jogetHost);
												AssignmentManager.loginWithHash(jogetHost, username, password, loginCallback);
											}
											logoutLogin();	
										}
									});

									
								</script>
								<?php
							}
						}
						else{
							if (isset($_SESSION['email'])) {
								$email = $_SESSION['email'];
	
								//read the access control json file
								$access_control = json_decode(file_get_contents("../../BackEnd/accessControl.json"), true);
								$sql = "SELECT * FROM users u left join pro_usr_rel pur on u.user_ID = pur.Usr_ID left join projects p on p.project_id_number=pur.Pro_ID where u.user_email='$email' AND u.user_type != 'non_active';";
								$proid_array = array();
								$admin_array = array();
								$result    = sqlsrv_query($conn, $sql);
								while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
									$p_Name = $row['project_name'];
									$icon_url = $row['icon_url'];
									$p_ID = $row['project_id_number'];
									$is_parent = $row['parent_project_id_number'];
	
									if (!isset($_SESSION['user_org'])) {
										$_SESSION['user_org'] = $row['user_org'];
									}
	
									if (!isset($_SESSION['theme'])) {
										if ($row['theme_preference'] == 1) {
											$_SESSION['theme'] = "dark_red";
										} else {
											$_SESSION['theme'] = "light_color";
										}
									}
	
									if ($row['user_type'] == 'system_admin') {
										$_SESSION['isSysadmin'] = true;
									}
									
									if ($row['Pro_Role'] == 'non_Member' || $row['status'] == 'archive' || !$row['status']) {
										continue;
									}
	
									$object = (object) [
										'project_id' => $p_ID, 'project_name' => $p_Name,
										'icon_url' => $icon_url, 'project_par_id' => $is_parent
									];
	
									array_push($proid_array, $object);
									if ($row['Pro_Role'] == "Project Manager" || $row['Pro_Role'] == "Project Monitor") {
										array_push($admin_array, $p_ID);
									}
								};

								if (isset($urlParam['pidName'])){
									$processID = $urlParam['pidName'];
									$sql = "SELECT project_id_number FROM projects WHERE project_id = '$processID'";
									$stmt = sqlsrv_query( $conn, $sql);
							
									while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
										$urlParam['pid'] = $row['project_id_number'];	
									}
								}
						
								$_SESSION['project_list'] = $proid_array;
								$_SESSION['admin_pro'] = $admin_array;
								echo '<form name = "projectPageSelection" action="../postlogin_processing" method="POST" style="display:none" id="projectPageSelection">';
								echo ' <input  name="projectid" id= "projectid" value= "'.$urlParam['pid'].'">';
								echo ' <input  name="buttonclicked" id= "buttonclicked" value="'.$path.'">';
								echo ' <input  name="urlparam" value="'.$url['query'].'">';
								echo ' </form>';
							}

							echo '<script>
								document.getElementById("projectPageSelection").submit();
							</script>';
						}
					}
					else{
						if($_SESSION['ui_pref'] == 'ri_v3'){
							// if v3 will login joget here
							?> 
							<script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>
							<script src="../../JS/JsLibrary/jogetUtil.js" ></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js"></script>
							<script>
								var v3_flag = true;
								var jogetHost = JOGETHOST+'jw';
								var username = "<?php echo $_SESSION['email'];?>";
								var password = "<?php echo $_SESSION['password'];?>";

								$(document).ready(function(){
									var loginCallbackAsset = {
										success : function(response){
											if(response.username == username){
												//logout of construct joget already done below
												AssignmentManager.loginWithHash(jogetHost, username, password, loginCallback);
											}else{
												alert("Login fail. Please try again.");
												window.location.href = "logout?signOut=1";
											}
											
											
										}
									}

									var loginCallback = {
										success : function(response){
											if(response.username == username){
												window.location.href = "../homePage.php";
											}else{
												alert("Login fail. Please try again.");
												window.location.href = "logout?signOut=1";
											}
										}
									};

									// if asset host is defined then try login else skip normal login
									if(SYSTEM && SYSTEM == 'KKR'){
										var jogetAssetHost = JOGETASSETHOST+'jw';
										//sign out of joget first to signin so the joget session time is in sync with RI session timing
										async function logoutLoginAsset(){
											//logout of joget from asset joget is causing a problem. so not doing for joget.reveron for now
											//only logging out of construct joget
											await AssignmentManager.logout(jogetHost);
											AssignmentManager.loginWithHash(jogetAssetHost, username, password, loginCallbackAsset);
										}
										logoutLoginAsset();
										
									}else{
										//sign out of joget first to signin so the joget session time is in sync with RI session timing
										async function logoutLogin(){
											await AssignmentManager.logout(jogetHost);
											AssignmentManager.loginWithHash(jogetHost, username, password, loginCallback);
										}
										logoutLogin();
										
									}	

								});

								
							</script>
							<?php
						}
						else{
							?> 
							<script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>
							<script src="../../JS/JsLibrary/jogetUtil.js" ></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js"></script>
							<script>
								var v3_flag = true;
								var jogetHost = JOGETHOST+'jw';
								var username = "<?php echo $_SESSION['email'];?>";
								var password = "<?php echo $_SESSION['password'];?>";

								$(document).ready(function(){
									var loginCallbackAsset = {
										success : function(response){
											if(response.username == username){
												//logout of construct joget already done below
												AssignmentManager.loginWithHash(jogetHost, username, password, loginCallback);
											}else{
												alert("Login fail. Please try again.");
												window.location.href = "logout?signOut=1";
											}
										}
									}

									var loginCallback = {
										success : function(response){
											if(response.username == username){
												window.location.href = "../postlogin.php";
											}else{
												alert("Login fail. Please try again.");
												window.location.href = "logout?signOut=1";
											}
										}
									};

									// if asset host is defined then try login else skip normal login
									if(SYSTEM && SYSTEM == 'KKR'){
										var jogetAssetHost = JOGETASSETHOST+'jw';
										//sign out of joget first to signin so the joget session time is in sync with RI session timing
										async function logoutLoginAsset(){
											//logout of joget from asset joget is causing a problem. so not doing for joget.reveron for now
											//only logging out of construct joget
											await AssignmentManager.logout(jogetHost);
											AssignmentManager.loginWithHash(jogetAssetHost, username, password, loginCallbackAsset);
										}
										logoutLoginAsset();
									}else{
										//sign out of joget first to signin so the joget session time is in sync with RI session timing
										async function logoutLogin(){
											await AssignmentManager.logout(jogetHost);
											AssignmentManager.loginWithHash(jogetHost, username, password, loginCallback);
										}
										logoutLogin();	
									}	
								});
							</script>
							<?php
						}
						exit();
					}
				}
			}
		}
	}
}else{
	header('Location: ../../');
	exit();
}
?>
