<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods, GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require 'header.php';

$app->run();
?>