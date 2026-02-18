<?php 

include_once 'sharePoint.func.php';

if (!isset($conn)) {
	session_start();
}

if (!isset($_POST['functionName'])) return;

$ret = ''; 
$response =[];
switch ($_POST['functionName']) {
	case 'fetchGroup':
		if (!isset($_POST["url"]) || !isset($_POST["tenantId"]) || !isset($_POST["clientSecret"]) || !isset($_POST["clientID"])) {
			echo "Parameter Error!";
			exit();
		}

		$spInfo = array(
			'url' => rtrim($_POST["url"], "/"),
			'tenant_id' => $_POST["tenantId"],
			'client_id' => $_POST["clientID"],
			'client_secret' => $_POST["clientSecret"]
		);
		// save the credential on db
		$ret =  getSPGroup($spInfo, "Shared Documents/", true);
		break;
	case 'getSPFile':
		$ret =  getFile($spInfo, $_POST['file_url']);
		break;
	case 'updateDocMethod':
		if (!isset($_POST["method"])) {
			echo "Parameter Error!";
			exit();
		}
		$ret =  updateProjectFileMethod($_POST["method"]);
		break;
	case 'updateSPRepo':
			if (!isset($_POST["folder"])) {
				echo "Parameter Error!";
				exit();
			}
			if (!isset($_POST["url"]) || !isset($_POST["tenantId"]) || !isset($_POST["clientSecret"]) || !isset($_POST["clientID"])) {
				echo "Parameter Error!";
				exit();
			}
			include_once('../login/include/db_connect.php');
	
			$spInfo = array(
				'url' => rtrim($_POST["url"], "/"),
				'tenant_id' => $_POST["tenantId"],
				'client_id' => $_POST["clientID"],
				'client_secret' => $_POST["clientSecret"]
			);
			// save the credential on db
			updatSPCredTable($conn, $spInfo);

			$_SESSION['file_method'] = $_POST["fileMethod"];
			updateProjectFileMethod($conn, $_POST["fileMethod"]);
			$ret = true;
			if ($_POST["folder"]){
				$ret =  updateSPRepo($conn, $_POST["folder"]);
			}
			
			break;
	case 'fetchFolder':
		// get spInfo from db
		// fetch SP data
		include_once('../login/include/db_connect.php');

		$pp_id = $_SESSION['project_id'];
		$sql = "SELECT * FROM configSP WHERE project_id = '$pp_id'";
		$stmt = sqlsrv_query($conn, $sql);
		if ($stmt === false) {
			die(print_r(sqlsrv_errors(), true));
		}
		if(!sqlsrv_has_rows($stmt)){// config details has not been set for this project
			$response['msg'] ="config details have not been set";
			echo json_encode($response);
			exit();

		}
		while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
			$fileMethod = $_SESSION['file_method'];
			$spUrl = $row['url'].'/sites/'.$row['site_repo'];
			$spTenantId =  $row['tenant_id'];
			$spClientId =  $row['client_id'];
			$spClientSecret =  $row['client_secret'];
			$spSiteRepo =  $row['site_repo'];
		}
		$ret = array();
		$spInfo = array(
			'url' => $spUrl,
			'tenant_id' => $spTenantId,
			'client_id' => $spClientId,
			'client_secret' => $spClientSecret
		);
		if (isset($_POST['url'])) {
            $path = $_POST['url'];
        }else{
            $path = "Shared Documents/";
            $ret['root'] = $spSiteRepo;
        }
        $ret['child'] = getSPFolderContent($spInfo, $path, true);
		break;
	default:
		$ret =  array('Nothing here. Move On');
		break;
}

echo json_encode($ret);
