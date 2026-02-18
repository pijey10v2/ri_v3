<?php
session_start();

//check license module
include_once 'app_properties.php';
global $LICENSEPROPERTIES;
if($LICENSEPROPERTIES['insights']['value'] === 'false') header("Location: login/postlogin");;


if(isset($_SESSION['created'])&&(time() - $_SESSION['created'] >= 60*60*24)&&!isset($_SESSION['email'])){
  session_destroy();
  header("Location: signin");
  exit();
}

elseif(!isset($_SESSION['project_id'])){
	header("Location: login/postlogin");
	exit();
}

else{
	$project_list = $_SESSION['project_list'];
	$user_access = false;
	$this_pro = $_SESSION['project_id'];
	foreach($project_list as $pro){
		$pro_id = $pro -> project_id;
		if($pro_id == $this_pro){
			$user_access = true;
		}
	}
	if ($user_access == false){
		  session_destroy();
		  header("Location: signin");
		  exit();
	}
}

?>
