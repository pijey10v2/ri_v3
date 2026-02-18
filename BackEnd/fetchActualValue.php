<?php 
    session_start();
    require '../Login/include/db_connect.php';
    require '../Login/include/_include.php';
    global $CONN;

    $pid = $_SESSION['projectID'];
    $start = $_POST['startDate'];
    $type = $_POST['scheduleType'];

    $myresult = array(
    	'result' => false,
    	'data' => array()
    );

    $dataSql = "select * from project_progress_summary_actual where ppsa_schedule_type =:0 and ppsa_projectid = :1 and ppsa_month_year = :2 order by ppsa_section asc";
    $res = $CONN->fetchAll($dataSql,array($type, $pid, $start));

    if ($res) {
    	$tempArr = array();
    	foreach ($res as $k => $v) {
    		$section = ($v['ppsa_section']) ? $v['ppsa_section'] : 'overall';
    		$tempArr[$section] = $v;
    	}

		$myresult['result'] = true;
		$myresult['data'] = $tempArr;
    }

    echo json_encode($myresult);

