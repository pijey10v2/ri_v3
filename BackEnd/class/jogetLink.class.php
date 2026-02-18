<?php
include_once dirname(__FILE__).'/../../Login/app_properties.php';
global $SYSTEM;

if($SYSTEM == 'OBYU'){
	include_once("jogetLink.class.OBYU.php");
}else{
	include_once("jogetLink.class.KKR.php");
}
