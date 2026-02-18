<?php
include_once dirname(__DIR__).'../app_properties.php';
global $DB_SERVERNAME, $DB_USERNAME, $DB_PASSWORD, $DB_DBNAME, $PRODUCTION_FLAG;
function mssql_escape($data)
{
    if (is_numeric($data))
        return $data;
    $unpacked = unpack('H*hex', $data);
    return '0x' . $unpacked['hex'];
}

// Since UID and PWD are not specified in the $connectionInfo array,
// The connection will be attempted using Windows Authentication.
$connectionInfo = array("Database" => $DB_DBNAME, "UID" => $DB_USERNAME, "PWD" => $DB_PASSWORD);
$conn = sqlsrv_connect($DB_SERVERNAME, $connectionInfo);

if ($conn) {
} else {
    die(print_r(sqlsrv_errors(), true));
}