<?php
//header
require 'libs/vendor/autoload.php';

$app = new \Slim\Slim();

require 'conn.php';

require 'middleware.php';

require 'route.php';

?>