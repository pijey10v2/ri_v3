<?php
include_once ('../Login/app_properties.php');
global $PHPCACERTPATH;

function get_defect_access_token(){
  global $PHPCACERTPATH;
  $curl = curl_init();
  $certificate_location = $PHPCACERTPATH;
  curl_setopt_array($curl, array(
     CURLOPT_URL => "https://login.microsoftonline.com/common/oauth2/token",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_SSL_VERIFYPEER => $certificate_location,
    CURLOPT_SSL_VERIFYHOST => $certificate_location,
	CURLOPT_POSTFIELDS => "client_id=a2da5cdd-55ea-4188-9afd-aace9185c12a&grant_type=password&resource=https%3A%2F%2Fanalysis.windows.net%2Fpowerbi%2Fapi&username=dionnald.beh%40reveronconsulting.com&password=sk4V2HhM%21%2B&undefined=",
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
  }
};

function generate_defect_token(){
    $curl = curl_init();
    $auth_token = "Bearer ".get_defect_access_token();
    curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.powerbi.com/v1.0/myorg/groups/2d9818cf-20fb-4334-9879-17dde60cf12f/reports/af6ef1ed-67c1-48a2-9e12-549bbc554108/GenerateToken",
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
      return "cURL Error #:" . $err;
    } else {
      $data = json_decode($response, true);
      return $data["token"];
    }

};
echo generate_defect_token();
?>
