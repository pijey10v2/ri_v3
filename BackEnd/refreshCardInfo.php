<?php 
require ('../login/include/db_connect.php');

function fetchOne($sql, $conn){
    $stmt = sqlsrv_query($conn, $sql);
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    }
    sqlsrv_fetch($stmt);
    return sqlsrv_get_field( $stmt, 0);
}

$cardType = filter_input(INPUT_POST, 'cardType');

switch ($cardType) {
	case 'user':
		$userTotal = fetchOne("select count(*) from users", $conn);
		$userActive = fetchOne("select count(*) from users where user_type in ('user','system_admin')", $conn);
		$userLastUpd = fetchOne("select max(created_time) from users", $conn);
		$userLastUpd = (is_object($userLastUpd)) ? $userLastUpd->format('jS F, Y') : $userLastUpd;

		$user = array(
			"userTotal" => $userTotal,
			"userActive" => $userActive,
			"userLastUpd" => $userLastUpd 
		);
		$res['ok'] = 1;
		$res['data'] = $user;
		break;
	
	case 'project':
		$projTotal = fetchOne("select count(*) from projects", $conn);
		$projActive = fetchOne("select count(*) from projects where status='active'", $conn);
		$projInactive = $projTotal - $projActive;
		$projNoDuration = fetchOne("select count(*) from projects where ISNULL(duration,'') = '' and status !='archive'", $conn);
		// $projNoLoc = fetchOne("select count(*) from projects where ISNULL(location,'') = '' and status !='archive'", $conn); 
		//Location field checking was changed to Area 
		$projNoLoc = fetchOne("select count(*) from projects where longitude_1 + longitude_2 + latitude_1 + latitude_2 = 0 and status !='archive'", $conn);
		$projNotAccessByUser = 0;
		$projNoUser = fetchOne("select count(*) from projects where project_id_number not in (select pro_id from pro_usr_rel) and status !='archive'", $conn);
		$projNoAdminUser = fetchOne("select count(*) from projects where project_id_number not in (select pro_id from pro_usr_rel where pro_role = 'Project Manager') and status !='archive'", $conn);
		$projFinInTwoMon = fetchOne("select count(*) from projects where end_date BETWEEN  GETDATE() and DATEADD(month, 2, GETDATE()) and status !='archive'", $conn);

		$project = array(
			"projTotal" => $projTotal,
			"projActive" => $projActive,
			"projInactive" => $projInactive,
			"projNoDuration" => $projNoDuration,
			"projNoLoc" => $projNoLoc,
			"projNotAccessByUser" => $projNotAccessByUser,
			"projNoUser" => $projNoUser,
			"projNoAdminUser" => $projNoAdminUser,
			"projFinInTwoMon" => $projFinInTwoMon,
		);
		$res['ok'] = 1;
		$res['data'] = $project;
		break;
	default:
		$res['ok'] = 0;
		$res['msg'] = 'Error!';
		break;
}

echo json_encode($res);

