<?php
//header
require 'libs/vendor/autoload.php';

$app = new \Slim\Slim();
// $request = $app->request;
// print_r($request);


require 'conn.php';

require 'middleware.php';

require 'router.php';

?>