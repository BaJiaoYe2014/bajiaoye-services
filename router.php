<?php
//Route
require 'models/works.php';
require 'models/template.php';

//Get all of the works
$app->get('/userOpus/:userId', 'middleware', function ($userId) {
	$result = getAllWorksByUserId($userId);
	echo json_encode($result);
});

$app->get('/opus/:worksId', 'middleware', function ($worksId) {
	$result = getWorksById($worksId);
	echo json_encode($result);
});

$app->get('/tplList', 'middleware', function () {
	$result = getTemplateList();
	echo $result;
});


$app->get('/login', function () {
    echo "Hello";
});

$app->get('/foo', function () {
    echo "Foowwwww!";
});

?>