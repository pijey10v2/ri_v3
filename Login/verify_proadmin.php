<?php
session_start();
//check license module
include_once 'app_properties.php';
global $LICENSEPROPERTIES;
if($LICENSEPROPERTIES['projectadmin']['value'] === 'false') header("Location: login/postlogin");;

if(!isset($_SESSION['email'])&&!isset($_SESSION['project_id'])){
  session_destroy();
  header("Location: signin");
  exit();
}
else if($_SESSION['admin_pro'] == 0){

  header("Location: login/postlogin");
  exit();
}
else{
	$admin_access = false;
	$project_id = $_SESSION['project_id'];
	$admin_pro = $_SESSION['admin_pro'];
	foreach ($admin_pro as $admin) {
		if ($project_id == $admin){
			$admin_access = true;
		}	
	}

	if ($admin_access == false){
		header("Location: login/postlogin");
		exit();
	}
}

?>
