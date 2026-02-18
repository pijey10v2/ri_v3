<?php
    header('Content-Type: application/json');
    require '../Login/include/db_connect.php';
    include_once('sharePoint.func.php');
    include_once ('../Login/app_properties.php');
    global $PHPCACERTPATH;

    session_start();
    ini_set('max_execution_time', 0); // to get unlimited php script execution time

    function get_data($my_url, $headers){
        global $PHPCACERTPATH;
        $certificate_location = $PHPCACERTPATH;
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $my_url,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => $certificate_location,
            CURLOPT_SSL_VERIFYHOST => $certificate_location
            )
        );
        $res = curl_exec($ch);
        curl_close($ch);
        if($res){
             $obj = json_decode($res, true);
         return( $obj);
        }
        else{
           //  return('Error:"'.curl_strerror($ch).'" - code: '.curl_errno($ch));
            return(false);
        };
        
    }

    $pid = $_SESSION['project_id'];

    $file_method = $_SESSION['file_method'];
    if ($file_method == 'sp'){
        $sql = "SELECT * from locations WHERE project_id = '$pid' ";
        $lres = sqlsrv_query($conn,$sql);
        if(!$lres){
            $uResult['msg'] =  "Unable to get the Path details from the database for the locations.";
            echo (json_encode($uResult));
            exit();
        };
        $locations = [];
        $i =0;
        while( $row = sqlsrv_fetch_array( $lres, SQLSRV_FETCH_ASSOC) ) {
            $locations[$i] = $row;
            $i++;
        };
        $sql = "SELECT * FROM configSP WHERE project_id = '$pid'";
		$stmt = sqlsrv_query($conn, $sql);
		if ($stmt === false) {
			die(print_r(sqlsrv_errors(), true));
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
        $locationCount = count($locations);
        for($i =0; $i<$locationCount; $i++){
            if(!$locations[$i]['sharepointPath']){
                continue;
            }
            $sp_files = getSPFolderContent($spInfo,$locations[$i]['sharepointPath'], false, true);
            // var_dump($sp_files);
            $folder_arr = $sp_files['folder'];
            $file_arr = $sp_files['files'];
            $temp_arr = [];
            $temp_arr['locationID'] = $locations[$i]['locationID'];
            
            foreach($file_arr as $file){
                $file_arr = [];
               
                $file_arr['text'] = $file['name'];
                $file_arr['url'] = $file['url'];
                $file_arr['fileMethod'] = 'sp';
                $file_arr['id'] = '';
                $file_arr['folder'] = false;
               
                $temp_arr['files'][] = $file_arr;
            }
            $filedata[] = $temp_arr;
        }
        $uResult['msg'] = "success";
        $uResult['data'] = $filedata;
        echo(json_encode($uResult));
        //echo(json_encode($size));
        exit;

    }else{
        //write to file 0 percent
        $percent = intval(0);
        $arr_content['percent'] = $percent;
        $arr_content['message'] = "retrieving PW files";
        
        file_put_contents("progress.txt", json_encode($arr_content));
    
        $sql = "SELECT  url, userNamePassword FROM configPwPBi WHERE projectID = '$pid' AND type ='PW'";
        $res = sqlsrv_query($conn,$sql);
        if($res){
        if(!sqlsrv_has_rows ($res) ){
            $uResult['msg'] =  "Unable to get the config details for ProjectWise from the database. Please check with Project Admin.";
            echo (json_encode($uResult));
            exit();
        }
        }else{
            $uResult['msg'] =  "Unable to get the config details for ProjectWise from the database. Please check with Project Admin.";
            echo (json_encode($uResult));
            exit();
        }
        
        while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
            $my_url = $row['url'];
            $base64 = $row['userNamePassword'];
        };


        $auth = 'Authorization: Basic '.$base64;
        #echo $auth;
        $my_header = [];
        $my_header[0] =$auth;
        $my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
        $my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';

        $sql = "SELECT locationID,folderID, locationName from locations WHERE project_id = '$pid' ";
        $lres = sqlsrv_query($conn,$sql);
        if(!$lres){
            $uResult['msg'] =  "Unable to get the ProjectWise Path details from the database for the locations.";
            echo (json_encode($uResult));
            exit();
        };
        $locations = [];
        $i =0;
        while( $row = sqlsrv_fetch_array( $lres, SQLSRV_FETCH_ASSOC) ) {
            $locations[$i] = $row;
            $i++;
        };
    
        $filedata =[];
    
        $locationCount = count($locations);
        for($i =0; $i<$locationCount; $i++){
            $filedata[$i]['locationID'] = $locations[$i]['locationID'];
            $a =0;
            $folder = [];
            $id = $locations[$i]['folderID'];
            $url = $my_url.'Navigation/NavNode/'.$id.'/NavNode';//Bangsar SC
            $resp = get_data($url, $my_header);
        
            if($resp){
                $m = sizeof($resp['instances']);
                $documents = [];
                $b =0;
                for($j=0; $j<$m; $j++){
                    $instanceId = $resp['instances'][$j]['instanceId'];
                    $Children = $resp['instances'][$j]['properties']['HasChildren'];
                    if($Children){
                        $folder[$a]['id']= $resp['instances'][$j]['instanceId'];
                        $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                        $folder[$a]['parent'] = $locations[$i]['locationName'];//Bangsar Sc
                        $folder[$a]['folder'] = true;
                        $a++;
                        $url = $my_url.'Navigation/NavNode/'.$instanceId.'/NavNode'; //Floor1, Floor2, floor2, Others,Saved searches
                        $resp1 = get_data($url, $my_header);
                        
                        if($resp1){
                            $n = sizeof($resp1['instances']);
                            $mydocuments =[];
                            $c =0;
                            for($k =0; $k<$n; $k++){
                                $instanceId1 = $resp1['instances'][$k]['instanceId'];
                                $Children1 = $resp1['instances'][$k]['properties']['HasChildren'];
                                
                                if($Children1){
                                    $folder[$a]['id']= $resp1['instances'][$k]['instanceId'];
                                    $folder[$a]['text'] = $resp1['instances'][$k]['properties']['Label'];
                                    $folder[$a]['parent'] = $instanceId;//Others
                                    $folder[$a]['folder'] = true;
                                    $a++;
                                    $url = $my_url.'Navigation/NavNode/'.$instanceId1.'/NavNode';
                                    $resp2 = get_data($url, $my_header);
                                    
                                    if($resp2){
                                        $p = sizeof($resp2['instances']);
                                        $mydocs =[];
                                        $d =0;
                                        for($l =0; $l<$p; $l++){
                                            if($resp2['instances'][$l]['properties']['Key_ClassName'] == "Document"){
                                                $folder[$a]['id']= $resp2['instances'][$l]['properties']['Key_InstanceId'];
                                                $folder[$a]['text'] = $resp2['instances'][$l]['properties']['Label'];
                                                $folder[$a]['parent'] = $instanceId1;
                                                $folder[$a]['folder'] = false;
                                                $a++;
                                            }

                                        };
                                    
                                    };

                                }else if($resp1['instances'][$k]['properties']['Key_ClassName'] == "Document"){
                                    $folder[$a]['id']= $resp1['instances'][$k]['properties']['Key_InstanceId'];
                                    $folder[$a]['text'] = $resp1['instances'][$k]['properties']['Label'];
                                    $folder[$a]['parent'] = $instanceId;
                                    $folder[$a]['folder'] = false;
                                    $a++; 
                                
                                };

                            };
                        
                        };

                    }elseif($resp['instances'][$j]['properties']['Key_ClassName'] == "Document"){
                    $folder[$a]['id']= $resp['instances'][$j]['properties']['Key_InstanceId'];
                        $folder[$a]['text'] = $resp['instances'][$j]['properties']['Label'];
                        $folder[$a]['parent'] = $locations[$i]['locationName'];
                        $folder[$a]['folder'] = false;
                        $a++;
                    
                    };
                    
                };
            
            
                $filedata[$i]['files'] =$folder;
            };
            $p = $i+1;
            $percent = intval($p/$locationCount * 100);
            $arr_content['percent'] = $percent;
            $arr_content['message'] = $p . " locations processed.";
            
        
        // Write the progress into file and serialize the PHP array into JSON format.
            // The file name is the session id.
            file_put_contents("progress.txt", json_encode($arr_content));
        
            
        }
    
    /* $percent = intval(100);
        $arr_content['percent'] = $percent;
        $arr_content['message'] = "all files retrieved";
        
        file_put_contents("progress.txt", json_encode($arr_content));*/
        $uResult['msg'] = "success";
        $uResult['data'] = $filedata;
        echo(json_encode($uResult));
        //echo(json_encode($size));
        exit;
    }
?>