<?php 
include_once dirname(__DIR__).'../app_properties.php';
include_once('lib/dbPdo.class.php');
global $DB_SERVERNAME,$DB_USERNAME, $DB_PASSWORD, $DB_DBNAME;
$connArr = array('dsn'=>"sqlsrv:Server=$DB_SERVERNAME;database=$DB_DBNAME", 'username'=>$DB_USERNAME, 'pass'=>$DB_PASSWORD);

global $CONN;

$CONN  = new dbconnect($connArr);

?>