<?php 
// to load function and handle response from ajax
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

global $api_username, $api_password, $jogetHost, $JOGETLINKOBJ;
include_once("class/jogetLink.class.php");
$JOGETLINKOBJ = new JogetLink();
$api_username = $JOGETLINKOBJ->getAdminUserName();
$api_password = $JOGETLINKOBJ->getAdminUserPassword();
$jogetHost = $JOGETLINKOBJ->jogetHost;
$package_uuid = $JOGETLINKOBJ->currPackageUuid;

if (isset($_POST['functionName'])) {
	if ($_POST['functionName'] == 'getDocDatalistInfo_Joget') {
		$res = getDocDatalistInfo_Joget();		
		echo json_encode($res);
	}
}

function getDocDatalistInfo_Joget(){
    global $api_username, $api_password, $jogetHost, $JOGETLINKOBJ, $package_uuid;

	// checking if logged in or not
	if (!isset($_SESSION['email']) && !isset($_SESSION['password'])) {
        $ret['ok'] = 0;
        $ret['msg'] = 'Error. Invalid session';
	}

    $host = $jogetHost . "jw/web/json/data/list/document_mgmt/list_document?d-2584378-fn_package_uuid=".$package_uuid; 
    $ret = array();

    // because only admin can see the api
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$api_username:$api_password")
    );

    $ch = curl_init($host);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, array());
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $resp = curl_exec($ch);

    if (curl_errno($ch)) {
        $err = curl_error($ch);
        $ret['error'] = 1;
    }else{
        $res = json_decode($resp, true);
        if (isset($res['error'])) {
            $ret['ok'] = 0;
            $ret['msg'] = $res['error']['code'].': '.$res['error']['message'];
        }else{
            $ret['ok'] = 1;
            $ret['total'] = $res['total'];
            if ($ret['total']>0) {
	            $date = max(array_column($res['data'], 'dateCreated'));
	            $ret['maxDocDate'] = date('jS F, Y', strtotime($date));
            }
        }
    }
    curl_close($ch);
    return $ret;
}

function makeGlobalJSVar($var, $val) {
    echo "<script> var ".$var." = '".$val."'</script>";
}