<?php
    session_start();
    require ('../login/include/db_connect.php');

$ws_links = "";
$pid = $_SESSION['project_id'];

$sql = "SELECT pw_project_id FROM projects WHERE project_id_number = '$pid'";
$stmt = sqlsrv_query($conn, $sql);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
    $pwid = $row['pw_project_id'] ;
}

$sql = "SELECT * FROM pw_webservice_url";
$stmt = sqlsrv_query($conn, $sql);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
    $pw_ws_name = $row['webservice_name'] ;
    $pw_ws_url = urldecode ($row['webservice_url']) ;
    $pw_ws_url = preg_replace('#{id}#', $pwid, $pw_ws_url);

    if($_SESSION['ui_pref'] == 'ri_v3'){
        $ws_links= $ws_links.'<button value="Open Window" onclick="window.open(\'../BackEnd\/jq_pw365_login.php?urlRedirect='.$pw_ws_url.'\')" ><span class="img"><img class="riLogoNavbar" src=""></span><span class="atag"><a>'.$pw_ws_name.'</a></span></button>';
    }else{
        $ws_links= $ws_links.'<button value="Open Window" onclick="window.open(\'BackEnd\/jq_pw365_login.php?urlRedirect='.$pw_ws_url.'\')" ><span class="img"><img class="riLogoNavbar" src=""></span><span class="atag"><a>'.$pw_ws_name.'</a></span></button>';
    }
}

$data['pwLink'] = $ws_links;
echo json_encode($data);
