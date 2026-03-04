<?php
global $LICENSEPROPERTIES, $FILEINFO, $PRODUCTION_FLAG;
global $JOGETDOMAIN, $JOGETASSETDOMAIN, $JOGETSUPPORTDOMAIN, $JOGETIP,$JOGETASSETIP, $JOGETSUPPORTIP,$GEOSERVERDOMAIN, $GEOSERVERIP, $RIHOST;
global $JOGETADMINUSER, $JOGETADMINPWD, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD, $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD, $GEOSERVERADMINUSER, $GEOSERVERADMINPWD;
global $PHPCACERTPATH;
global $DB_SERVERNAME, $DB_USERNAME, $DB_PASSWORD, $DB_DBNAME;
global $PROJECTIDNOSBH, $PROJECTIDNOSRWK;
global $SYSTEM, $IS_DOWNSTREAM;

$PRODUCTION_FLAG = true;
$SYSTEM = 'KKR'; // OBYU or KKR

$IS_DOWNSTREAM = false;

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
	if (function_exists('ioncube_license_properties')) {
		$LICENSEPROPERTIES = ioncube_license_properties();
		$FILEINFO = ioncube_file_info();
	}else{
		die('Error! ioncube not properly configured.');
	}

	$RIHOST = "https://ri.kkr.gov.my/RIConstruct/";

	// link
	$JOGETDOMAIN = "https://geo.kkr.gov.my/";
	$JOGETIP = "http://192.168.0.62:8080/";
	// password
	$JOGETADMINUSER = "admin";
	$JOGETADMINPWD = "ConstructKKR@dmin!";

	//link
	$GEOSERVERDOMAIN = "https://construct.kkr.gov.my";
	$GEOSERVERIP = "http://192.168.0.45:8080";
	//password geoserver
	$GEOSERVERADMINUSER = "admin";
	$GEOSERVERADMINPWD = "rvgeo123";

	// asset joget link
	$JOGETASSETDOMAIN = "https://asset.kkr.gov.my/";
	$JOGETASSETIP = "http://192.168.0.60:8080/";
	// password Asset
	$JOGETASSETADMINUSER = "admin";
	$JOGETASSETADMINPWD = "AssetKKR@dmin!";

	// support joget link
	$JOGETSUPPORTDOMAIN = "https://jogetk.reveronconsulting.com/";
	$JOGETSUPPORTIP ="http://20.188.99.39/";
	// password Support
	$JOGETSUPPORTADMINUSER = "admin";
	$JOGETSUPPORTADMINPWD = "@dmin0415";

	// cacert path
	$PHPCACERTPATH = "C:/PHP/cacert.pem";

	
	$PROJECTIDNOSBH = "251";
	$PROJECTIDNOSRWK = "238";


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
	$DB_SERVERNAME = "RI-TestServer";
	$DB_USERNAME = "dbadmin";
	$DB_PASSWORD = "Rv0415+";
	$DB_DBNAME = "RI_Constructs_Assets";

	$PROJECTIDNOSBH = "74";
	$PROJECTIDNOSRWK = "84";
}

if ($LICENSEPROPERTIES === false && $FILEINFO === false)
{
	echo "License file corrupted.";
	return;
}