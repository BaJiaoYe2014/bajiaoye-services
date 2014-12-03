<?php
//Route
require 'models/works.php';
require 'models/template.php';
require 'models/file-manager.php';
// require 'models/test.php';
// $a = json_decode($test);
// $r = refactorWorks($a, '67');
// print_r($r);

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
	$jsonObj = (object) $jsonObj;
	$jsonObj = arrayToObejct($jsonObj);
	// print_r($jsonObj);
	$result = initWorks($jsonObj);
	if($result) {
		$works = (object) getWorksById($result);
		copyWorksImagesToTmp($works);
		// print_r($works);
		// refactor works format, change src path
		// print_r($works);
		$reWorks = refactorWorks($works, $works->id);
		// print_r($reWorks);
		$res = updateWorks($reWorks);
		if($res) {
			completeCopyWorks($works->id, $works->userId);
		}
	}
	echo json_encode($result);
});

$app->post('/opusUpdate', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	$jsonObj = arrayToObejct($jsonObj);

	copyWorksImagesToTmp($jsonObj);
	$reWorks = refactorWorks($jsonObj, $jsonObj->id);
	$result = updateWorks($reWorks);
	if($result) {
		completeCopyWorks($jsonObj->id, $jsonObj->userId);
	}
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

function arrayToObejct($works) {
	$temp = array();
	foreach ($works->pages as $item) {
		$item = (object) $item;
		if($item->animateImgs) {
			$ele = array();
			foreach ($item->animateImgs as $value) {
				$value = (object) $value;
				$ele[] = $value;
			}
			$item->animateImgs = $ele;
		}
		$temp[] = $item;
	}
	$works->pages = $temp;
	return $works;
}

?>