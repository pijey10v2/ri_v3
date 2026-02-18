<?php
include_once("../Login/app_properties.php");
global $JOGETSUPPORTDOMAIN, $RIHOST, $PHPCACERTPATH;

$username=urlencode($_POST['username']);
$host = $JOGETSUPPORTDOMAIN."jw/web/json/directory/admin/user/list?name=".$username;
// echo $host;
$headers = array(
    'Content-Type: application/json',
    'Authorization: Basic ' . base64_encode("admin:@dmin0415"),
);
$ch = curl_init($host);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $PHPCACERTPATH);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $PHPCACERTPATH);
$return = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if (!$err) {
    $decodedText = html_entity_decode($return);
    echo $decodedText;
    // exit();
}