<?php

file_put_contents('/tmp/'.$_GET['filename'], base64_decode($_GET['data']));

echo $_GET['filename'];
?>