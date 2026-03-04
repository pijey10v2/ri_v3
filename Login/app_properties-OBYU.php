<?php
global $LICENSEPROPERTIES, $FILEINFO, $PRODUCTION_FLAG;
global $JOGETDOMAIN, $JOGETASSETDOMAIN, $JOGETSUPPORTDOMAIN, $JOGETIP,$JOGETASSETIP, $JOGETSUPPORTIP,$GEOSERVERDOMAIN, $GEOSERVERIP, $RIHOST;
global $JOGETADMINUSER, $JOGETADMINPWD, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD, $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD, $GEOSERVERADMINUSER, $GEOSERVERADMINPWD;
global $PHPCACERTPATH;
global $DB_SERVERNAME, $DB_USERNAME, $DB_PASSWORD, $DB_DBNAME;
global $PROJECTIDNOSBH, $PROJECTIDNOSRWK;
global $RIFOLDERDIR;
global $SYSTEM, $IS_DOWNSTREAM, $MAPBOX_TOKEN;

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
}else{
	$LICENSEPROPERTIES = dev_license_properties();
	$FILEINFO = true;

	$RIHOST = "https://ri.digile.com/ri_v3/";
    $RIFOLDERDIR = 'ri_obyu';

    // link
    $JOGETDOMAIN = "https://jogetob.digile.com/";
    $JOGETIP = "http://46.250.224.223:8080/";
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

	// support joget link
	$JOGETSUPPORTDOMAIN = "https://jogetk.digile.com/";
	$JOGETSUPPORTIP ="http://154.26.128.219/";
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

	$MAPBOX_TOKEN = "pk.eyJ1IjoiZGV2LXR3aW5zaWdodHNtYXAiLCJhIjoiY21jdmN3YTB4MGFkMTJsczNmNzNtZm95MCJ9.88qL93JrS-chRNuaDNFGCA";
}

if ($LICENSEPROPERTIES === false && $FILEINFO === false)
{
	echo "License file corrupted.";
	return;
}