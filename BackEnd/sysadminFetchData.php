<?php
include_once '../login/include/_include.php';
global $CONN;

$sysAdminData = array();

#user
$userTotal = $CONN->fetchOne("select count(*) from users");
$userActive = $CONN->fetchOne("select count(*) from users where user_type != 'non_active' ");
$userInactive = $userTotal-$userActive;

$userLastUpd =  $CONN->fetchOne("select max(created_time) from users");
$userLastUpd = (is_object($userLastUpd)) ? $userLastUpd->format('jS F, Y') : $userLastUpd;

#project
$projTotal = $CONN->fetchOne("select count(*) from projects");
$projActive = $CONN->fetchOne("select count(*) from projects where status='active'");
$projInactive = $projTotal - $projActive;
$projNoDuration = $CONN->fetchOne("select count(*) from projects where ISNULL(duration,'') = '' and status !='archive'");
// $projNoLoc = $CONN->fetchOne("select count(*) from projects where ISNULL(location,'') = '' and status !='archive'", $conn);
$projNoLoc = $CONN->fetchOne("select count(*) from projects where longitude_1 + longitude_2 + latitude_1 + latitude_2 = 0 and status !='archive'");
$projNotAccessByUser = 0;

#warnings
$firstLogin = 0;
if (!isset($_SESSION['lastlogin']) || $_SESSION['lastlogin'] == null) $firstLogin = 1;

$projNoUser = $CONN->fetchOne("select count(*) from projects where project_id_number not in (select pro_id from pro_usr_rel) and status !='archive'");
$projNoAdminUser = $CONN->fetchOne("select count(*) from projects where project_id_number not in (select pro_id from pro_usr_rel where pro_role = 'Project Manager') and status !='archive'");
$projFinInTwoMon = $CONN->fetchOne("select count(*) from projects where end_date BETWEEN  GETDATE() and DATEADD(month, 2, GETDATE()) and status !='archive'");


$sysAdminData['userInfo']['Active'] = $userActive;
$sysAdminData['userInfo']['Inactive'] = $userInactive;

$sysAdminData['projectInfo']['Active'] = $projActive;
$sysAdminData['projectInfo']['Inactive'] = $projInactive;

$sysAdminData['warning']['projNoDuration'] = $projNoDuration;
$sysAdminData['warning']['projNoLoc'] = $projNoLoc;

$sysAdminData['warning']['projNoUser'] = $projNoUser;
$sysAdminData['warning']['projNoAdminUser'] = $projNoAdminUser;
$sysAdminData['warning']['projFinInTwoMon'] = $projFinInTwoMon;




echo json_encode($sysAdminData);
