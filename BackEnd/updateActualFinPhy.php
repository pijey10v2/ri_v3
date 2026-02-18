<?php
    session_start();
    require '../Login/include/db_connect.php';
    require '../Login/include/_include.php';
    global $CONN;

    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $start = $_POST['scheduleStart'];
    $type = $_POST['scheduleType'];
    $phyActual = $_POST['physicalActualVal'];
    $finActual = $_POST['financialActualVal'];
    $myresult = array();

    // $type Weekly - 0, Monthly - 1, Quarterly - 2
    $sqlUpd = "update project_progress_summary_actual set ppsa_physical_actual =:0, ppsa_financial_actual=:1 where ppsa_projectid = :2 and ppsa_month_year = :3 and ppsa_schedule_type =:4 and ppsa_section is null";
    $updRes = $CONN->execute($sqlUpd,array($phyActual, $finActual, $_SESSION['projectID'], $start, $type));
    if ($sqlUpd) {
      // no update then insert
      if ($CONN->lastRowCount() == 0) {
          $sqlIns = "insert into project_progress_summary_actual (ppsa_physical_actual, ppsa_financial_actual, ppsa_projectid, ppsa_month_year, ppsa_schedule_type, ppsa_created_by) values (:0, :1, :2, :3, :4, :5)";
          $insRes = $CONN->execute($sqlIns,array($phyActual, $finActual, $_SESSION['projectID'], $start, $type, $user));
          if (!$insRes) {
            $myresult['bool'] = false;
            $myresult['msg'] = "SQL Error";
            echo json_encode($myresult);
            exit;      
          }
      }
    }else{
      $myresult['bool'] = false;
      $myresult['msg'] = "SQL Error";
      echo json_encode($myresult);
      exit;
    }

    // for section as well
    if (isset($_POST['sectionPhyActVal'])) {
      foreach ($_POST['sectionPhyActVal'] as $section => $val) {
        $phyActual = $val;

        $sqlUpd = "update project_progress_summary_actual set ppsa_physical_actual =:0 where ppsa_projectid = :1 and ppsa_month_year = :2 and ppsa_schedule_type =:3 and ppsa_section = :4";
        $updRes = $CONN->execute($sqlUpd,array($phyActual, $_SESSION['projectID'], $start, $type, $section));
        if ($updRes) {
          // no update then insert
          if ($CONN->lastRowCount() == 0) {
              $sqlIns = "insert into project_progress_summary_actual (ppsa_physical_actual, ppsa_projectid, ppsa_month_year, ppsa_schedule_type, ppsa_created_by, ppsa_section) values (:0, :1, :2, :3, :4, :5)";
              $insRes = $CONN->execute($sqlIns,array($phyActual, $_SESSION['projectID'], $start, $type, $user, $section));
              if (!$insRes) {
                $myresult['bool'] = false;
                $myresult['msg'] = "SQL Error";
                echo json_encode($myresult);
                exit;      
              }
          }
        }else{
          $myresult['bool'] = false;
          $myresult['msg'] = "SQL Error";
          echo json_encode($myresult);
          exit;
        }
      }
    }

    if (isset($_POST['sectionFinActVal'])) {
      foreach ($_POST['sectionFinActVal'] as $section => $val) {
        $finActual = $val;

        $sqlUpd = "update project_progress_summary_actual set ppsa_financial_actual =:0 where ppsa_projectid = :1 and ppsa_month_year = :2 and ppsa_schedule_type =:3 and ppsa_section = :4";
        $updRes = $CONN->execute($sqlUpd,array($finActual, $_SESSION['projectID'], $start, $type, $section));
        if ($sqlUpd) {
          // no update then insert
          if ($CONN->lastRowCount() == 0) {
              $sqlIns = "insert into project_progress_summary_actual (ppsa_financial_actual, ppsa_projectid, ppsa_month_year, ppsa_schedule_type, ppsa_created_by, ppsa_section) values (:0, :1, :2, :3, :4, :5)";
              $insRes = $CONN->execute($sqlIns,array($finActual, $_SESSION['projectID'], $start, $type, $user, $section));
              if (!$insRes) {
                $myresult['bool'] = false;
                $myresult['msg'] = "SQL Error";
                echo json_encode($myresult);
                exit;      
              }
          }
        }else{
          $myresult['bool'] = false;
          $myresult['msg'] = "SQL Error";
          echo json_encode($myresult);
          exit;
        }
      }
    }

  $myresult['bool'] = true;
  $myresult['msg'] = "Updated";
  echo json_encode($myresult);
?>
