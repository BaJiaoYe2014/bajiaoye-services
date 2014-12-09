<?php
//Route
require 'models/works.php';
require 'models/template.php';
require 'models/file-manager.php';
require 'models/upload.php';
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

$app->get('/showWorks/:worksId', 'middleware', function ($worksId) {
	$result = getShowWorks($worksId);
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
			$obj = getShowWorks($works->id);
			completeCopyWorks($works->id, $works->userId, $obj, $works->url);
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
	// print_r($jsonObj);
	$reWorks = refactorWorks($jsonObj, $jsonObj->id);
	// print_r($reWorks);
	$result = updateWorks($reWorks);
	if($result) {
		$obj = getShowWorks($jsonObj->id);
		completeCopyWorks($jsonObj->id, $jsonObj->userId, $obj, $jsonObj->url);
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

$app->post('/fileUpload', function () use ($app) {
	$request = $app->request;
	$params = $request->post();
    $result = filesUpload($params['userId']);
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
		if(!empty($item->animateImgs)) {
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

function replaceImgPath($src) {
	$arr = explode('/', $src);
	$len = count($arr) - 1;
	return $arr[$len];
}

function getShowWorks($worksId) {
	$ret = array();
	$result = getWorksById($worksId);
	// print_r($result);
	$basic = array();
	$basic['pageTitle'] = $result['pageTitle'];
	$basic['pageDescribe'] = $result['pageDescribe'];
	$basic['shareImage'] = replaceImgPath($result['shareImage']);
	$music = $result['music'];
	$music->name = replaceImgPath($result['music']->name);
	$basic['music'] = $music;
	$ret['global'] = $basic;
	$startObj = $result['pages'][0];
	$startObj->clickImg = replaceImgPath($startObj->clickImg);
	$ret['startAnimate'] = $startObj;
	$content = array();
	foreach ($result['pages'] as $key => $value) {
		if($key === 0) continue;
		if(!empty($value->background)) {
			$value->background = replaceImgPath($value->background);
		}
		if(!empty($value->tipImg)) {
			$value->tipImg = replaceImgPath($value->tipImg);
		}
		if(!empty($value->button)) {
			$value->button = replaceImgPath($value->button);
		}
		if(!empty($value->videoScreenshot)) {
			$value->videoScreenshot = replaceImgPath($value->videoScreenshot);
		}
		if(!empty($value->videoButton)) {
			$value->videoButton = replaceImgPath($value->videoButton);
		}

		if(!empty($value->animateImgs)) {
			$item = $value->animateImgs;
			for($i=0; $i<count($item); $i++) {
				if($item[$i]->src) {
					$item[$i]->src = replaceImgPath($item[$i]->src);
				}
			}
			$value->animateImgs = $item;
		}
		$content[] = $value;
	}
	$ret['contentPageList'] = $content;
	// print_r($ret);
	return $ret;
}

?>