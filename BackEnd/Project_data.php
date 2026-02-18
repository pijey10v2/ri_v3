<?php
//session_start();
include_once "joget.php";

if (isset($_SESSION['email'])) {
	$response = array();
	if ($_POST['page'] == "systemadmin") {
		$response['signed_In_Email'] = $_SESSION['email'];
	} else if ($_POST['page'] == "index" ||$_POST['page'] == "admin" || $_POST['page'] == "finance" || $_POST['page'] == "doc" ) {
		$response['UserName'] = $_SESSION['firstname'] . " " . $_SESSION['lastname'];
		$response['signed_In_Email'] = $_SESSION['email'];
		$response['user_org'] = $_SESSION['user_org'];
		$response['Pro_Role'] = $_SESSION['project_role'];
		$response['project_id'] = $_SESSION['project_id']; //project_id_number
		$response['project_id_name'] = $_SESSION['projectID'];
		$response['project_name'] = $_SESSION['project_name'];
		$response['longitude1'] = $_SESSION['longitude_1'];
		$response['longitude2'] = $_SESSION['longitude_2'];
		$response['latitude1'] = $_SESSION['latitude_1'];
		$response['latitude2'] = $_SESSION['latitude_2'];
		$response['iconurl'] = $_SESSION['icon_url'];
		$response['projectlist'] = $_SESSION['project_list'];
		$response['isParent'] = $_SESSION['is_Parent'];
		$response['project_owner'] = $_SESSION['project_owner'];
		$response['Project_type'] = $_SESSION['Project_type'];
		if (isset($_SESSION['parent_project_id'])) { 
			$response['parent_project_id'] = $_SESSION['parent_project_id'];
		}
		//if ($_SESSION['is_Parent'] !== "isParent" && isset($_SESSION['appsLinks'])) {
		if (isset($_SESSION['appsLinks'])) { //need applinks for both overall and pacakge project
			$response['appsLinks'] = $_SESSION['appsLinks'];
		}
		$response['project_role'] = $_SESSION['project_role'];
		if (isset($_SESSION['start_date']) && isset($_SESSION['end_date'])) {
			$response['start_date'] = $_SESSION['start_date'];
			$response['end_date'] = $_SESSION['end_date'];
		}
	}
	
} else {
	$response['error'] = "No Email found";
}
echo json_encode($response);
