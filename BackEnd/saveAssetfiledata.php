<?php

$str_json = file_get_contents('php://input');
$my_obj = json_decode($str_json);
function get_data($my_url, $headers){
	include_once ('../Login/app_properties.php');
	global $PHPCACERTPATH;

	$ch = curl_init();
	$certificate_location = $PHPCACERTPATH;
	curl_setopt_array($ch, array(
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_URL => $my_url,
		CURLOPT_HTTPHEADER => $headers,
		CURLOPT_SSL_VERIFYPEER => $certificate_location,
		CURLOPT_SSL_VERIFYHOST => $certificate_location,
		)
	);
	$res = curl_exec($ch);
	curl_close($ch);
	if($res){
		 $obj = json_decode($res, true);
	 return( $obj);
	}
	else{
		 return('Error:"'.curl_strerror($ch).'" - code: '.curl_errno($ch));
	};
}

if (!preg_match('/none/', $my_obj->getFileUrlEntity)){
	$entity = $my_obj->getFileUrlEntity;
	$my_entities = $my_obj->records;
	$no_of_entities = $my_obj->entities;
	$path_info = $my_obj->Paths;
	$account_details;
	$my_url;
	$k = 0;
	while ($k < $no_of_entities){
		if($my_obj->records[$k]->Name == $entity){
			break;
		}else {
			$k++;
		};
	};
	$no = $k;
	if($path_info){
		$path=[];
		$j=0;
		while ($path_info){
			$pos = strpos($path_info, '\\');
			if($pos !== false){
				$path[$j] = trim(substr($path_info, 0, $pos));
				$path_info = substr($path_info, $pos+1);
				$j++;
			}else {
				$path[$j] =trim($path_info);
				$path_info ="";
				$no_of_path = $j +1;
			}
		};
		$string_data = 'pwadmin:pwadmin';
		$base64 = base64_encode($string_data);
		$auth = 'Authorization: Basic '.$base64;
		$my_header = [];
		$my_header[0] =$auth;
		$my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
		$my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';
		
		$my_url = 'https://wsg.reveronconsulting.com/ws/v2.5/Repositories/Bentley.PW--Reveron-VM.REVERONCONSULTING.COM~3ACELCOM_CAFM/Navigation/NavNode?$filter=Label+eq+%27'.$path[0].'%27';
		$resp = get_data($my_url, $my_header);	
		if (isset($resp)){
			$p = 1;
			$flag = true;
			$instanceId = $resp['instances'][0]['instanceId'];
			while($p < $no_of_path && $flag ==true){
				$my_path = str_replace(' ','%20',$path[$p]);
				$my_url = 'https://wsg.reveronconsulting.com/ws/v2.5/Repositories/Bentley.PW--Reveron-VM.REVERONCONSULTING.COM~3ACELCOM_CAFM/Navigation/NavNode/'.$instanceId.'/NavNode?$filter=Label+eq+%27'.$my_path.'%27';
				$resp = get_data($my_url, $my_header);	
				if(isset($resp)){
					$instanceId = $resp['instances'][0]['instanceId'];
					$flag = true;
				} else {
					$flag = false;
				};
				$p++;
			};
			$m = count($resp['instances']);
			if($m){
				$instanceId = $resp['instances'][0]['instanceId'];
				$my_url = 'https://wsg.reveronconsulting.com/ws/v2.5/Repositories/Bentley.PW--Reveron-VM.REVERONCONSULTING.COM~3ACELCOM_CAFM/Navigation/NavNode/'.$instanceId.'/NavNode';
				$resp = get_data($my_url, $my_header);	
				if(isset($resp)){
					$m = count($resp['instances']);
					$data =[];
					for($i=0; $i<$m; $i++){
						$data[$i]['folder'] = $resp['instances'][$i]['properties']['Label'];
						$keyinstanceId = $resp['instances'][$i]['properties']['Key_InstanceId'];
						$className = $resp['instances'][$i]['properties']['Key_ClassName'];
						if($className == "Project"){
							$my_url = 'https://wsg.reveronconsulting.com/ws/v2.5/Repositories/Bentley.PW--Reveron-VM.REVERONCONSULTING.COM~3ACELCOM_CAFM/PW_WSG/Document?$filter=ParentGuid+eq+%27'.$keyinstanceId.'%27';
							$fileresp = get_data($my_url, $my_header);	
							if(isset($resp)){
								$n = count($fileresp['instances']);
								$files =[];
								for($j=0; $j<$n; $j++){
									$fileinstanceId = $fileresp['instances'][$j]['instanceId'];
									$file_url = 'https://wsg.reveronconsulting.com/ws/v2.5/Repositories/Bentley.PW--Reveron-VM.REVERONCONSULTING.COM~3ACELCOM_CAFM/PW_WSG/Document/'.$fileinstanceId.'/$file';
									$files[$j]['fileName'] = $fileresp['instances'][$j]['properties']['FileName'];
									$files[$j]['Url'] = $file_url;
								};
							};
							$data[$i]['fileData'] =$files;
							$my_obj->records[$no]->Data = $data;
						};
						
					};
				}
			};
			
		}else{
				echo("unable to fetch the files");
		};				
	};
	$my_json = json_encode($my_obj);
	$fp = fopen("../Data/myAssetdata.json","wb");
	if($fp==false){
		$msg ="not able to open the file";
		echo($msg);
	}else
	{
		fwrite($fp, $my_json);
		fclose($fp);
		$msg = "Saved the data";
	};
	echo($my_json);
};
?>