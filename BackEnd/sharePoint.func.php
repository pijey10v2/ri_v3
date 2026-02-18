<?php 


function getSPAccessToken($spInfo){
	// [todo]: store token info in table, so no need to call everytime. just check on db
	$resourceCode = '00000003-0000-0ff1-ce00-000000000000';

	$uriArr = parse_url($spInfo['url']);

	$url = 'https://accounts.accesscontrol.windows.net/'.$spInfo['tenant_id'].'/tokens/OAuth/2';
	$postField = array(
		'grant_type' => 'client_credentials',
		'client_id' => $spInfo['client_id'].'@'.$spInfo['tenant_id'],
		'client_secret' => $spInfo['client_secret'],
		'resource' => $resourceCode.'/'.$uriArr['host'].'@'.$spInfo['tenant_id']
	);
	$curlResp = executeCurl($url, $postField, array(), true);

	$ret = '';
	if (isset($curlResp['access_token']) && !empty($curlResp['access_token'])) {
		$ret = $curlResp['access_token'];
	}
	return $ret;
}

function getSPFolderContent($spInfo, $folderPath, $folderOnly = false, $recursive = false){
	
	$token = getSPAccessToken($spInfo);
	if (empty($token)) {
		return array("ERROR"=>1, "ERROR_CODE"=>"TOKEN_ERR", "ERROR_MSG"=>"Token Error");
	}
	
	$url = $spInfo['url']."/_api/Web/GetFolderByServerRelativeUrl('".rawurlencode($folderPath)."')?\$expand=Files,Folders/Files,Folders/Folders/Files,Folders/Folders/Folders/Files,Folders/Folders/Folders/Folders/Files,Folders/Folders/Folders/Folders/Folders/Files";

	$hdr_arr = array(
		'Accept:application/json;odata=verbose',
		'Authorization:Bearer '.$token 
	);
	$curlRes = executeCurl($url, array(), $hdr_arr, true);

	$files = $curlRes['d']['Files']['results'];
	$folder = $curlRes['d']['Folders']['results'];

	$fileArr = $folderArr = array();	
	foreach ($files as $f) {
		$tempArr = array();
		$tempArr['name'] = $f['Name'];
		$tempArr['url'] = $f['ServerRelativeUrl'];
		$fileArr[] = $tempArr;

	}

	foreach ($folder as $fd) {
		// special handling for hidden folder
		if ($fd['Name'] == 'Forms') continue; 
		$tempArr = array();
		$tempArr['name'] = $fd['Name'];
		$tempArr['url'] = $fd['ServerRelativeUrl'];
		$folderArr[] = $tempArr;
	}

	if ($recursive) {
		$subFolderFiles = getSubFolderFiles($folder);
		foreach ($subFolderFiles as $fs) {
			$tempArr = array();
			$tempArr['name'] = $fs['Name'];
			$tempArr['url'] = $fs['ServerRelativeUrl'];
			$fileArr[] = $tempArr;
		}
	}

	$ret['folder'] = $folderArr;
	if (!$folderOnly) {
		$ret['files'] = $fileArr;
	} 
	return $ret;
}

function getSubFolderFiles($folderArr){
	$ret = $fileTempArr = array(); 
	foreach ($folderArr as $key => $folderMain) {
		if (!empty($folderMain['Folders']['results'])) {
			$subFile = getSubFolderFiles($folderMain['Folders']['results']);
			$ret = array_merge($ret,$subFile);
		}
		if (!empty($folderMain['Files']['results'])) {
			$ret = array_merge($folderMain['Files']['results'],$ret);
		}
	}
	return $ret;
}

function getFile($spInfo, $filePath, $savePath){
    $token = getSPAccessToken($spInfo);
	if (empty($token)){
		return array("ERROR"=>1, "ERROR_CODE"=>"TOKEN_ERR", "ERROR_MSG"=>"Token Error");
	}
	$urlPrefix = $spInfo['url'];
    $url = $urlPrefix."/_api/Web/GetFileByServerRelativeUrl('".($filePath)."')/\$value?binaryStringResponseBody=true";
    $hdr_arr = array(
        'Authorization : Bearer '.$token 
    );

    $curlRes = executeCurl($url, array(), $hdr_arr);
    
    // save file in temp path, then return the path
    file_put_contents($savePath, $curlRes);

    return $savePath;
}
function executeCurl($url, $postField = array(), $headerArr = array(), $convert = false){
	//defaults
	$hdr_def = array("Content-Type: multipart/form-data");
	$headers = (!empty($headerArr)) ? $headerArr : $hdr_def;
	$ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    if (!empty($postField)) {
    	curl_setopt($ch, CURLOPT_POST, 1);
    	curl_setopt($ch, CURLOPT_POSTFIELDS, $postField);
    }
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	$response = curl_exec($ch);
	if ($convert) {
		$ret = json_decode($response, true); 
	}else{
		$ret = $response; 
	}
	curl_close($ch);
	return $ret;
}

function updateProjectFileMethod($conn, $method){
	// update file method on project table based on the sessions for DB
	$pp_id = $_SESSION['project_id'];
	$sql = "UPDATE projects SET file_method='$method' WHERE project_id_number='$pp_id'";
	$stmt = sqlsrv_query($conn, $sql);
	return true;
}


function updatSPCredTable($conn, $spInfo){
	$url = $spInfo['url'];
	$tenant_id = $spInfo['tenant_id'];
	$client_id = $spInfo['client_id'];
	$client_secret = $spInfo['client_secret'];
	$pp_id = $_SESSION['project_id'];
	
	$sql = "SELECT * FROM configSP WHERE project_id = '$pp_id'";
	$stmt = sqlsrv_query($conn, $sql);
	if ($stmt === false) {
		die(print_r(sqlsrv_errors(), true));
	}else{
		// return "sharepoint updated";
		if(!sqlsrv_has_rows($stmt)){
			$sql = "INSERT INTO configSP (project_id,tenant_id, client_id, client_secret, url) VALUES ('$pp_id', '$tenant_id', '$client_id', '$client_secret', '$url' )";
			$stmt = sqlsrv_query($conn, $sql);
		}else{
			$sql = "UPDATE configSP SET tenant_id='$tenant_id', client_id='$client_id', client_secret='$client_secret', url='$url' WHERE project_id='$pp_id'";
			$stmt = sqlsrv_query($conn, $sql);
		}
	}
}


function updateSPRepo($conn, $folder) {
	// sp table that tie to project
	$folder_exp = explode('/',$folder);
	$pp_id = $_SESSION['project_id'];
	$site_repo = end($folder_exp);
	$sql = "UPDATE configSP SET site_repo='$site_repo' WHERE project_id='$pp_id'";
	$stmt = sqlsrv_query($conn, $sql);
}


function getSPGroup($spInfo){
    $token = getSPAccessToken($spInfo);
    if (empty($token)){
		return array("ERROR"=>1, "ERROR_CODE"=>"TOKEN_ERR", "ERROR_MSG"=>"Token Error");
	}  

    // group list to be filtered out in setup
    $hideGroup = array("All Company", "Team Site");

    $url = $spInfo['url']."/_api/search/query";
    $paramArr = array(
    	"querytext" => "'(contentclass:STS_Site)(SiteName:\"".$spInfo['url']."/sites/*\")'",
    	"trimduplicates" => "false",
    	"rowlimit" => "5000",
    	"selectproperties" => "'Title,Url'",
    	"properties" => "'Key:Title'"
    );
    $url = $url."?".http_build_query($paramArr);
    $hdr_arr = array(
        'Authorization : Bearer '.$token, 
        'Accept : application/json;odata=verbose'
    );

    $curlRes = executeCurl($url, array(), $hdr_arr, true);
    $queryRes = $curlRes['d']['query']['PrimaryQueryResult']['RelevantResults']['Table']['Rows']['results'];

    $res = array();
	if ($queryRes) {
	    foreach ($queryRes as $qres) {
    		$tmpArr = array();
	    	$qresCell = $qres['Cells']['results'];
	    	foreach ($qresCell as $qrc) {
	    		if($qrc['Key'] == 'Title'){
	    			if (in_array($qrc['Value'], $hideGroup)) {
	    				continue 2;
	    				continue;
	    			}
	    			$tmpArr['Title'] = $qrc['Value'];
	    		}
	    		if($qrc['Key'] == 'Url'){
	    			$strArr = explode('/', $qrc['Value']);
	    			$tmpArr['Val'] = array_pop($strArr);
	    			$tmpArr['Url'] = $qrc['Value'];
	    		}
	    	}
	    	$res[] = $tmpArr;
	    }
	}
    return $res;
}