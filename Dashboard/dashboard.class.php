<?php
include_once dirname(__FILE__).'/../Login/app_properties.php';
global $SYSTEM;

if($SYSTEM == 'OBYU'){
	include_once("V3/OBYU/dashboard.class.OBYU.php");
}else{
	include_once("dashboard.class.KKR.php");
}
