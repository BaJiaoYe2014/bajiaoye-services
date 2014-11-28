<?php
//header
require 'libs/vendor/autoload.php';

$app = new \Slim\Slim();
// $request = $app->request;
// print_r($request);

date_default_timezone_set("PRC");

require 'conn.php';

require 'middleware.php';

require 'router.php';

?>