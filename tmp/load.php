<?php

if ($data = file_get_contents('/tmp/'.$_GET['filename'])) {
    unlink('/tmp/'.$_GET['filename']);
    echo $data;
};

?>