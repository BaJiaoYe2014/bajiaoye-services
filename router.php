<?php
//Route
require 'models/works.php';
require 'models/template.php';
require 'models/file-manager.php';
// $pages = array(
// 	array("src"=>"templates/tpls/001/1-1.jpg"),
// 	array("src"=>"templates/tpls/001/1-2.png"),
// 	);
// $works = array(
// 	"thumb"=>"templates/tpls/001/thumb.jpg",
// 	"pages"=>$pages
// 	);
// $worksId = '6';
// $works = (object) $works;
// createWorksImages($works, $worksId);

//Get all of the works
$app->get('/userOpus/:userId', 'middleware', function ($userId) {
	$result = getAllWorksByUserId($userId);
	echo json_encode($result);
});

$app->get('/opus/:worksId', 'middleware', function ($worksId) {
	$result = getWorksById($worksId);
	echo json_encode($result);
});

$app->post('/opusCreate', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$result = initWorks($jsonObj);
	if($result) {
		// print_r($jsonObj);
		createWorksImages($jsonObj, $result);
	}
	echo json_encode($result);
});

$app->post('/opusUpdate', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$result = updateWorks($jsonObj);
	echo json_encode($result);
});

$app->post('/opusDelete/:worksId', 'middleware', function ($worksId) {
	$ret = deleteUserWorksFiles($worksId);
	$result = deleteWorksById($worksId);
	echo json_encode($result);
});

$app->get('/tplList', 'middleware', function () {
	$result = getTemplateList();
	echo $result;
});

$app->get('/tpl/:tplId', 'middleware', function ($tplId) {
	$result = getTemplateById($tplId);
	echo $result;
});


$app->get('/login', function () {
    echo "Hello";
});

$app->get('/foo', function () {
    echo "Foowwwww!";
});

?>