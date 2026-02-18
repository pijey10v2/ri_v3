<?php
global $LICENSEPROPERTIES, $FILEINFO, $PRODUCTION_FLAG;
global $JOGETDOMAIN, $JOGETASSETDOMAIN, $JOGETSUPPORTDOMAIN, $JOGETIP,$JOGETASSETIP, $JOGETSUPPORTIP,$GEOSERVERDOMAIN, $GEOSERVERIP, $RIHOST;
global $JOGETADMINUSER, $JOGETADMINPWD, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD, $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD, $GEOSERVERADMINUSER, $GEOSERVERADMINPWD;
global $PHPCACERTPATH;
global $DB_SERVERNAME, $DB_USERNAME, $DB_PASSWORD, $DB_DBNAME;
global $PROJECTIDNOSBH, $PROJECTIDNOSRWK;
global $SYSTEM, $IS_DOWNSTREAM, $MAPBOX_TOKEN;

$PRODUCTION_FLAG = false;
$SYSTEM = 'KKR'; // OBYU or KKR

$IS_DOWNSTREAM = true;

function dev_license_properties(){
	$ret['Doc']['value'] = true;
	$ret['PFS']['value'] = true;
	$ret['insights']['value'] = true;
	$ret['projectadmin']['value'] = true;
	$ret['systemadmin']['value'] = true;
	$ret['homepage']['value'] = true;


	return $ret; 
} 

//check license module
if ($PRODUCTION_FLAG) {
	 
}else{
	$LICENSEPROPERTIES = dev_license_properties();
	$FILEINFO = true;
	// if (function_exists('ioncube_license_properties')) {
	// 	$LICENSEPROPERTIES = ioncube_license_properties();
	// 	$FILEINFO = ioncube_file_info();
	// }else{
	// 	die('Error! ioncube not properly configured.');
	// }

    $RIHOST = "https://bimserver.reveronconsulting.com/ri_kkr_construct/";

    // construct jogetlink
    $JOGETDOMAIN = "https://jogetk.reveronconsulting.com/";
    $JOGETIP = "http://20.188.99.39/";
	// password
	$JOGETADMINUSER = "admin";
	$JOGETADMINPWD = "@dmin0415";

	// asset joget link
	$JOGETASSETDOMAIN = "https://joget.reveronconsulting.com/";
	$JOGETASSETIP = "http://52.163.242.240:8080/";
	// password
	$JOGETASSETADMINUSER = "admin";
	$JOGETASSETADMINPWD = "rev@dmin123+";

	// support joget link
	$JOGETSUPPORTDOMAIN = "https://jogetk.reveronconsulting.com/";
	$JOGETSUPPORTIP ="http://20.188.99.39/";
	// password Support
	$JOGETSUPPORTADMINUSER = "admin";
	$JOGETSUPPORTADMINPWD = "@dmin0415";

	//geoserver
    $GEOSERVERDOMAIN = "https://geo.reveronconsulting.com";
    $GEOSERVERIP = "http://52.187.3.206:8080";
	//password	
	$GEOSERVERADMINUSER = "admin";
    $GEOSERVERADMINPWD = "insightGeo@23#";

	// cacert path
	$PHPCACERTPATH = "C:/PHP/cacert.pem";

	// db connect
	$DB_SERVERNAME = "DEV-TWINSIGHTS-\SQLEXPRESS";
	$DB_USERNAME = "sa";
	$DB_PASSWORD = "@twinSights_AI";
	$DB_DBNAME = "RI_Constructs_Assets_V4";

	$PROJECTIDNOSBH = "74";
	$PROJECTIDNOSRWK = "84";

	$MAPBOX_TOKEN = "pk.eyJ1IjoicmF5bGVlbmRpZ2lsZSIsImEiOiJjbHhlOWh3ZzQwZjdkMm1vYXZvdTgxazQ2In0.kIkFHsB9I0MSRkLKdCBm0g";
}

// if ($LICENSEPROPERTIES === false && $FILEINFO === false)
// {
// 	echo "License file corrupted.";
// 	return;
// }