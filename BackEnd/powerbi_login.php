<?php
include_once ('../Login/app_properties.php');
global $PHPCACERTPATH;

function get_access_token(){
  $curl = curl_init();
  $certificate_location = $PHPCACERTPATH;
  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://login.microsoftonline.com/common/oauth2/token",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_SSL_VERIFYPEER => $certificate_location,
    CURLOPT_SSL_VERIFYHOST => $certificate_location,
    CURLOPT_CUSTOMREQUEST => "POST",
  //	CURLOPT_POSTFIELDS => "client_id=a2da5cdd-55ea-4188-9afd-aace9185c12a&grant_type=password&resource=https%3A%2F%2Fanalysis.windows.net%2Fpowerbi%2Fapi&username=dionnald.beh%40reveronconsulting.com&password=H%40ppysk4V2HhM&undefined=",
  CURLOPT_POSTFIELDS => "client_id=a2da5cdd-55ea-4188-9afd-aace9185c12a&grant_type=password&resource=https%3A%2F%2Fanalysis.windows.net%2Fpowerbi%2Fapi&username=dionnald.beh%40reveronconsulting.com&password=H%40ppysk4V2HhM&undefined=",
    CURLOPT_HTTPHEADER => array(
      "Cache-Control: no-cache",
      "Content-Type: application/x-www-form-urlencoded",
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);
  curl_close($curl);

  if ($err) {
    return "cURL Error #:" . $err;
  } else {
    $data = json_decode($response, true);
	  return $data["access_token"];
   // return $data;
  }
};

function generate_token(){
    $curl = curl_init();
    $auth_token = "Bearer ".get_access_token();
   // echo $auth_token;
   
    curl_setopt_array($curl, array(
      //link for LBU powerbi display
     CURLOPT_URL => "https://api.powerbi.com/v1.0/myorg/groups/2d9818cf-20fb-4334-9879-17dde60cf12f/reports/a7827d26-f7e4-43df-ae85-712e0c9762ed/GenerateToken",
      //link for DOTr powerbi 
    //  CURLOPT_URL => "https://api.powerbi.com/v1.0/myorg/groups/50704b05-6b8f-452b-b99a-1aadb970621a/reports/1f1c9af4-f58a-4636-a1d2-1bfa226cc881/GenerateToken",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => "accessLevel=View&allowSaveAs=false",
      CURLOPT_HTTPHEADER => array(
        "Accept: application/json",
        "Authorization: ".$auth_token,
        "Cache-Control: no-cache",
        "Content-Type: application/x-www-form-urlencoded"
      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
      $uResult['msg']=  "cURL Error #:" . $err;
      $uResult['code'] = "error";
     // return "cURL Error #:" . $err;
       return json_encode($uResult);
    } else {
      $data = json_decode($response, true);
     /* if($data["code"]=="InvalidRequest")
      {
        $uResult['msg']= $data["message"];
        $uResult['code'] = "InvalidRequest";
        return json_encode($uResult);
      }else{
        $uResult['data']= $data["token"];
        $uResult['code'] = "success";
        return json_encode($uResult);
      }*/
     return $data["token"];
   //return json_encode($data);
    }
};
echo generate_token();
?>
