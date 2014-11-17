<?php
//Route

//Get all of the works
$app->get('/works', 'middleware', function () {
	require 'models/works.php';
	$result = getAllWorks();
	echo json_encode($result);
});

$app->get('/works/:id', 'middleware', function ($id) {
    echo "Hello, $id";
});

$app->get('/login', function () {
    echo "Hello";
});

?>