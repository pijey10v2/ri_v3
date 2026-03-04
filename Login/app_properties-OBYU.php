<?php
global $LICENSEPROPERTIES, $FILEINFO, $PRODUCTION_FLAG;
global $JOGETDOMAIN, $JOGETASSETDOMAIN, $JOGETSUPPORTDOMAIN, $JOGETIP,$JOGETASSETIP, $JOGETSUPPORTIP,$GEOSERVERDOMAIN, $GEOSERVERIP, $RIHOST;
global $JOGETADMINUSER, $JOGETADMINPWD, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD, $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD, $GEOSERVERADMINUSER, $GEOSERVERADMINPWD;
global $PHPCACERTPATH;
global $DB_SERVERNAME, $DB_USERNAME, $DB_PASSWORD, $DB_DBNAME;
global $PROJECTIDNOSBH, $PROJECTIDNOSRWK;
global $RIFOLDERDIR;
global $SYSTEM, $IS_DOWNSTREAM;

$SYSTEM = 'OBYU'; // OBYU or KKR
$PRODUCTION_FLAG = true;

$IS_DOWNSTREAM = false;

function dev_license_properties(){
	$ret['Doc']['value'] = true;
	$ret['PFS']['value'] = true;
	$ret['insights']['value'] = true;
	$ret['projectadmin']['value'] = true;
	$ret['systemadmin']['value'] = true;
	$ret['Constructs']['value'] = 6;
	$ret['MaxOwnerOrg']['value'] = 6;
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

	$RIHOST = "https://ri.e-dims.com.my/RI/";
    $RIFOLDERDIR = 'RI';

	// link
	$JOGETDOMAIN = "https://doc.e-dims.com.my/";
    $JOGETIP = "http://192.168.0.55:8080/";
	// password
	$JOGETADMINUSER = "admin";
    $JOGETADMINPWD = "@dmin123+";

	// link geoserver
	$GEOSERVERDOMAIN = "";
	$GEOSERVERIP = "";
	//password geoserver
	$GEOSERVERADMINUSER = "";
	$GEOSERVERADMINPWD = "";

	// link asset
	$JOGETASSETDOMAIN = "";
	$JOGETASSETIP = "";
	// password asset
	$JOGETASSETADMINUSER = "";
	$JOGETASSETADMINPWD = "";

	// link support
	$JOGETSUPPORTDOMAIN = "https://jogetk.reveronconsulting.com/";
	$JOGETSUPPORTIP ="http://20.188.99.39/";
	// password support
	$JOGETSUPPORTADMINUSER = "admin";
	$JOGETSUPPORTADMINPWD = "@dmin0415";

	// cacert path
	$PHPCACERTPATH = "C:/PHP7.3/cacert.pem";

	// db connect
	$DB_SERVERNAME = "";
	$DB_USERNAME = "";
	$DB_PASSWORD = "";
	$DB_DBNAME = "";

	$PROJECTIDNOSBH = "";
	$PROJECTIDNOSRWK = "";

}else{
	$LICENSEPROPERTIES = dev_license_properties();
	$FILEINFO = true;

	$RIHOST = "https://ri.reveronconsulting.com/ri_obyu/";
    $RIFOLDERDIR = 'ri_obyu';

    // link
    $JOGETDOMAIN = "https://jogetob.reveronconsulting.com/";
    $JOGETIP = "http://52.148.70.130:8080/";
	// password
	$JOGETADMINUSER = "admin";
    $JOGETADMINPWD = "@dmin123+";

	// link geoserver
    $GEOSERVERDOMAIN = "";
    $GEOSERVERIP = "";
	//password geoserver
	$GEOSERVERADMINUSER = "";
    $GEOSERVERADMINPWD = "";

	// link asset
	$JOGETASSETDOMAIN = "";
	$JOGETASSETIP = "";
	// password
	$JOGETASSETADMINUSER = "";
	$JOGETASSETADMINPWD = "";

	// link support
	$JOGETSUPPORTDOMAIN = "https://jogetk.reveronconsulting.com/";
	$JOGETSUPPORTIP ="http://20.188.99.39/";
	// password Support
	$JOGETSUPPORTADMINUSER = "admin";
	$JOGETSUPPORTADMINPWD = "@dmin0415";

	// cacert path
	$PHPCACERTPATH = "C:/PHP 7.3/cacert.pem";

	// db connect
    $DB_SERVERNAME = "RI";
    $DB_USERNAME = "RI_ADMIN";
    $DB_PASSWORD = "Reveron123+";
    $DB_DBNAME = "RI_OBYU";

	$PROJECTIDNOSBH = "";
	$PROJECTIDNOSRWK = "";
}

if ($LICENSEPROPERTIES === false && $FILEINFO === false)
{
	echo "License file corrupted.";
	return;
}