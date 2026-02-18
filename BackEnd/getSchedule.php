<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    session_start();
    global $SYSTEM;
    $type = $_POST['schedule_Type'];
    $id = $_SESSION['project_id'];
     $sql = "SELECT * FROM Project_Schedule WHERE Pro_ID = '$id' AND Sch_Ver = 0 AND scheduleType = '$type'"; 
      $res = sqlsrv_query($conn,$sql);
      if(!$res){
        echo "SQL error!";
        exit();
      }
      $arr = [];
      while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
        $arr[] = $row;
      }
      $return_value['data'] = $arr;

      // -------------- ONLY OBYU ----------------//
      if($SYSTEM == 'OBYU'){
        // get section data as well here to create dynamic input field for section actual value
        $return_value['section'] = array();
        include_once("class/jogetLink.class.php");
        $constructLinkObj = new JogetLink();
        $constructLinkObj->getLink('document');
        if (isset($constructLinkObj->jogetAppLink['api']['document_list_section'])) {
          $url = $constructLinkObj->jogetAppLink['api']['document_list_section'].'&rows=9999';
          $usr = $constructLinkObj->getAdminUserName();
          $pwd = $constructLinkObj->getAdminUserPassword();
          $headers = array(
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode("$usr:$pwd")
            );
          $ch = curl_init($url);
          curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
          curl_setopt($ch, CURLOPT_TIMEOUT, 30);
          curl_setopt($ch, CURLOPT_POST, 1);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
          curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
          curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
          $return = curl_exec($ch);
          $err    = curl_error($ch);
          curl_close($ch);
  
          $retArr = ($return) ? json_decode($return, true) : [];
          if (isset($retArr['data'])) {
            $tempArr = array();
            foreach ($retArr['data'] as $section) {
              $tempArr[] = $section['section_name'];
            }
            $return_value['section'] = $tempArr;
          }
        }
      }

      $return_json = json_encode($return_value);
      echo $return_json;
?>
