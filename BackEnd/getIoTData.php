<?php
include_once '../login/include/_include.php';
include_once '../login/include/iot_notification.php';
session_start();

$response = array();
$functionName = filter_input(INPUT_POST, 'functionName', FILTER_SANITIZE_STRING);

if (!$functionName) {
    $response['bool'] = false;
    $response['msg'] = "Invalid function";
    echo json_encode($response);
    exit();
}

switch ($functionName) {
    case "getCurrentIoTData":
        getCurrentIoTData();
    break;
    case "getAssetIoTData":
        getAssetIoTData();
    break;
    case "updateIoTNotification":
        updateIoTNotification();
    break;
    case "getNotificationHistory":
        getNotificationHistory();
    break;
}
echo(json_encode($response));

        
function getCurrentIoTData(){
    global $response;
    global $CONN;
    
    $res = $CONN->fetchAll("select c.* ,d.asset_id,d.asset_type, d.value, d.sensorstate,d.datetime, d.created_at, CAST(d.asset_id AS INT) as col from iot_asset c LEFT JOIN  (select * from tb_sensor a where a.created_at = (select max(b.created_at) from tb_sensor b))d  on c.element_id = d.asset_id order by col desc");
    // $res = sqlsrv_query($conn,$sql);
    // if($res){
    // }else{
    //    $response['bool'] = false;
    //     $response['msg'] ="Error occured";
    //     return $response;
    // }
    $arr = [];
    $i=0;
    foreach($res as $row) {
        $arr[$i] = $row;
        $red = explode(",", $row['red']);
        $yellow = explode(",", $row['yellow']);
        $id = $row['id'];
        $iot_id = $row['iot_id'];
        $iot_name = $row['iot_name'];
        $iot_type = $row['iot_type'];
        $element_id = $row['element_id'];
        $value = $row['value'];
        $datetime = $row['datetime'];
        $created_at = $row['created_at'];

        if($row['sensorstate'] == null){
            //not getting data for the registered iot sensor
            $arr[$i]['sensorColour']= "purple";
        }else if($row['sensorstate'] !=1){
            //not getting sensor reading -need to insert record in log table for notification
            $arr[$i]['sensorColour']= "grey";
            //check if there is an entry for this asset in the last 60 mins. we dont want to register and email every 5 mins. so will add a second entry if it still having a problem after every one hour.
            $countGrey = $CONN->fetchOne("SELECT count(*) from iot_notification where iot_id_no = :0 and sensor_colour ='grey' and  created_at >=  DATEADD(HOUR, -1, GETDATE())", array($id)) ;
            if($countGrey == 0){
                // no record so add 
                $insertGrey = "INSERT into iot_notification (iot_id_no, iot_id, iot_name, iot_type, element_id, datetime, created_at, sensor_colour, status) values(:0, :1, :2, :3, :4, :5, GETDATE(),:6, :7)";
                $ok = $CONN->execute($insertGrey, array($id, $iot_id, $iot_name, $iot_type, $element_id, $datetime, 'grey', 'registered'));
                //send email notification
                sendThresholdBreachNotification($_SESSION['firstname'],$element_id,$iot_type,$value,$datetime,'grey',$_SESSION['email']);
                if(!$ok){
                    $response[$id] = "unable to insert record in notification table";
                }
            }
        }else if(floatval($row['value'])>= floatval($red[1])){
            //red threshold broken - notify and insert record in log table
            $arr[$i]['sensorColour']= "red";
            $countRed = $CONN->fetchOne("SELECT count(*) from iot_notification where iot_id_no = :0 and sensor_colour ='red' and  created_at >=  DATEADD(HOUR, -1, GETDATE())", array($id)) ;
            if($countRed == 0){
                $insertRed = "INSERT into iot_notification (iot_id_no, iot_id, iot_name, iot_type, element_id, value, datetime, created_at, sensor_colour, status) values(:0, :1, :2, :3, :4, :5, :6, GETDATE(),:7, :8)";
                $okRed = $CONN->execute($insertRed, array($id, $iot_id, $iot_name, $iot_type, $element_id, $value, $datetime, 'red', 'registered'));
                //send email notification
                sendThresholdBreachNotification($_SESSION['firstname'],$element_id,$iot_type,$value,$datetime,'red',$_SESSION['email']);
                if(!$okRed){
                    $response[$id] = "unable to insert record in notification table";
                }
            }
        }else if(floatval($row['value'])>= floatval($yellow[1])){
            //yellow threshold broken - notify and insert record in log table
            $arr[$i]['sensorColour']= "yellow";
            $countYellow = $CONN->fetchOne("SELECT count(*) from iot_notification where iot_id_no = :0 and sensor_colour ='yellow' and  created_at >=  DATEADD(HOUR, -1, GETDATE())", array($id)) ;
            if($countYellow == 0){
                $insertYellow = "INSERT into iot_notification (iot_id_no, iot_id, iot_name, iot_type, element_id, value, datetime, created_at, sensor_colour, status) values(:0, :1, :2, :3, :4, :5, :6, GETDATE(),:7, :8)";
                $okYellow = $CONN->execute($insertYellow, array($id, $iot_id, $iot_name, $iot_type, $element_id, $value, $datetime, 'yellow', 'registered'));
                //send email notification
                $response['email']= sendThresholdBreachNotification($_SESSION['firstname'],$element_id,$iot_type,$value,$datetime,'red',$_SESSION['email']);
                if(!$okYellow){
                    $response[$id] = "unable to insert record in notification table";
                }
            }
        }else{
            // green colour - all ok
            $arr[$i]['sensorColour']= "green";
        }
        $i++;
    }
    // SQL to get the trend for each of these sensor values
    $resTrend = $CONN->fetchAll("SELECT * FROM (SELECT ID, asset_id, asset_type, value,sensorstate,	created_at, ROW_NUMBER() OVER (PARTITION BY asset_id Order by created_at DESC) AS rno FROM dbo.tb_sensor )RNK WHERE rno <=3");
    if($resTrend){
    }else{
        $response['bool'] = true;
        $response['msg'] ="Unable to get the trend details!";
        $response['data']= $arr;
        return $response;
    }
    $id= null;
    $firstValue = null;
    $secondValue = null;
    $lastrowNo = 0;
    $arr_trend =[];
    
    foreach($resTrend as $row1) {
    
        if($row1['rno']== 1){
            if($lastrowNo == 0){
                // new asset
                $id = $row1['asset_id'];
                $firstValue = $row1['value'];
                $lastrowNo = 1;
            }else if($lastrowNo == 1 ){
                // the earlier asset had only one record. so trend is same
            
                array_push($arr_trend, (object)[
                'asset_id' => $id,
                'trend' => 'same'
                ]);
                // update current values 
                $id = $row1['asset_id'];
                $firstValue = $row1['value'];
                $lastrowNo = 1;
            }else if( $lastrowNo == 2){
                // the earlier asset has only two record. so find trend with these two
                $trend = null;
                if($firstValue - $secondValue  == 0){
                    $trend = "same";
                }else if($firstValue - $secondValue < 0){
                    $trend = "down";
                }else{
                    $trend = "up";
                };

                array_push($arr_trend, (object)[
                    'asset_id' => $id,
                    'trend' => $trend 
                ]);
                // update current values 
                $id = $row1['asset_id'];
                $firstValue = $row1['value'];
                $secondValue = null;
                $lastrowNo = 1;
            }
        }else if($row1['rno']== 2){
            $secondValue = $row1['value'];
            $lastrowNo = 2;
        }else if($row1['rno']== 3){
            $trend = null;
            if($firstValue - $row1['value']  == 0){
                $trend = "same";
            }else if($firstValue - $row1['value'] < 0){
                $trend = "down";
            }else{
                $trend = "up";
            };

            array_push($arr_trend, (object)[
                'asset_id' => $row1['asset_id'],
                'trend' => $trend 
            ]);
            // update current values 
            $id = null;
            $firstValue = null;
            $secondValue = null;
            $lastrowNo = 0;
        }
    }

    //get the notifications
    $resNoti = $CONN->fetchAll("SELECT * FROM iot_notification where status = 'registered'");
    if($resNoti){
    }else{
        $response['bool'] = true;
        $response['msg'] ="Unable to get the notification details!";
        $response['data']= $arr;
        $response['trend']= $arr_trend;
        return $response;
    }
    $response['bool'] = true;
    $response['data']= $arr;
    $response['trend']= $arr_trend;
    $response['noti'] = $resNoti;
    return $response;
}
function getAssetIoTData(){
    global $response;
    global $CONN;
    $asset_id = filter_input(INPUT_POST, 'asset_id', FILTER_SANITIZE_STRING);
    $asset_type = filter_input(INPUT_POST, 'asset_type', FILTER_SANITIZE_STRING);
    
    $res = $CONN->fetchAll("SELECT COALESCE( convert(float, a.value), 0.00) as value, a.datetime from tb_sensor a where a.asset_id = :0 and a.asset_type =:1 order by a.datetime asc", array($asset_id, $asset_type));
    if(!$res){
        $response['bool'] = false;
        $response['msg'] ="Error occured";
        return $response;
    }
    $arr_datetime = [];
    $arr_value = [];
    $i=0;
    foreach($res as $row) {
        $arr_datetime[$i] = $row['datetime'];
        $arr_value[$i] = $row['value'];
        $i++;
    }
    $response['bool'] = true;
    $response['data']['datetime']= $arr_datetime;
    $response['data']['value']= $arr_value;
    return $response;
}
function updateIoTNotification(){
    global $response;
    global $CONN;

    $rec_id = json_decode($_POST['rec_id']);

    foreach ($rec_id as $rid) {
        if (!filter_var($rid, FILTER_VALIDATE_INT)) {
            $response['bool'] = false;
            $response['msg'] = "Invalid parameter";
            return;
        }
    }

    $idsStr = implode(', ', $rec_id);
    $updateSql = "UPDATE iot_notification SET status = 'acknowledged', acknowledged_at = GETDATE() where rec_no IN ($idsStr)";
    $res = $CONN->execute($updateSql);
    if($res){
        $response['bool'] = true;
        $response['msg'] = "records are updated.";
    }
    return $response;
}

function getNotificationHistory(){
    global $response;
    global $CONN;
    $asset_id = filter_input(INPUT_POST, 'asset_id', FILTER_SANITIZE_STRING);
    $asset_type = filter_input(INPUT_POST, 'asset_type', FILTER_SANITIZE_STRING);

    $res = $CONN->fetchAll("SELECT a.* FROM iot_notification a WHERE a.element_id = :0 AND a.iot_type = :1 ORDER BY a.created_at DESC", array($asset_id, $asset_type));
    
    if (!$res) {
        $response['bool'] = false;
        $response['msg'] = 'Unable to fetch record!';
        return false;
    } else {
        $data = [];
        foreach ($res as $noti) {
            $data[] = $noti;
        }
        $response['bool'] = true;
        $response['msg'] = "Record Fetched";
        $response['data'] = $data;
        return $response;
    }
}
?>