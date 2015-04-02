<?php
//Route
require 'models/works.php';
require 'models/template.php';
require 'models/file-manager.php';
require 'models/upload.php';
require 'models/user.php';

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
		// remove images not need
		//print_r($jsonObj);
		if(!empty($jsonObj->delImages)) {
			removeDeletedImages($jsonObj->delImages);
		}
	}
	echo json_encode($result);
});

$app->post('/opusDelete/:worksId', 'middleware', function ($worksId) {
	$ret = deleteUserWorksFiles($worksId);
	$result = deleteWorksById($worksId);
	echo json_encode($result);
});

$app->post('/savePage/:worksId', 'middleware', function ($worksId) use ($app) {
	//find images to replace
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	$index = $jsonObj->index;
	// print_r($jsonObj);
	foreach ($jsonObj as $key=>$item) {
		if(getValidValues($key, $item)){//value is valid
			$tmpArr = explode('_', $item);
			$newImg = $tmpArr[0].'_'.$index.'_'.$tmpArr[2];
			$jsonObj->$key = $newImg;
			copy($item, $newImg);
		}
		if($key == 'animateImgs') {
			$animateImgs = array();
			foreach ($item as $ani) {
				foreach ($ani as $k => $value) {
					if(getValidValues($k, $value)){//value is valid
						$tmpArr = explode('_', $value);
						$newImg = $tmpArr[0].'_'.$index.'_'.$tmpArr[2];
						$ani[$k] = $newImg;
						if(file_exists($value)) {
							copy($value, $newImg);
						}
						
					}
				}
				$animateImgs[] = $ani;
			}
			$jsonObj->$key = $animateImgs;
		}
	}
	// $jsonObj = (object) $jsonObj;
	// append page works
	$works = (object) getWorksById($worksId);
	$works->pages[] = $jsonObj;
	$result = updateWorks($works);
	if($result) {
		$obj = getShowWorks($worksId);
		completeCopyWorks($worksId, $works->userId, $obj, $works->url);
	}
	$newWorks = (object) getWorksById($worksId);
	echo json_encode($newWorks);
});

$app->post('/deletePage/:worksId', 'middleware', function ($worksId) use ($app) {
	//find images to replace
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	$index = $jsonObj->index;
	// print_r($jsonObj);
	foreach ($jsonObj as $key=>$item) {
		if(getValidValues($key, $item)){//value is valid
			if(file_exists($item)) {
				unlink($item);
			}
		}
		if($key == 'animateImgs') {
			$animateImgs = array();
			foreach ($item as $ani) {
				foreach ($ani as $k => $value) {
					if(getValidValues($k, $value)){//value is valid
						if(file_exists($value)) {
							unlink($value);
						}
					}
				}
			}
		}
	}
	$works = (object) getWorksById($worksId);
	$pages = array();
	foreach ($works->pages as $key=>$item) {
		if($item->index != $index) {
			$pages[] = $item;
		}
	}
	$works->pages = $pages;
	$result = updateWorks($works);
	if($result) {
		$obj = getShowWorks($worksId);
		completeCopyWorks($worksId, $works->userId, $obj, $works->url);
	}
	$newWorks = (object) getWorksById($worksId);
	echo json_encode($newWorks);
});

$app->get('/tplList', 'middleware', function () {
	$result = getTemplateList();
	echo $result;
});

$app->get('/tpl/:tplId', 'middleware', function ($tplId) {
	$result = getTemplateById($tplId);
	echo $result;
});

$app->get('/styleList/:type', 'middleware', function ($type) {
	$result = getTemplateStyleList($type);
	echo $result;
});

$app->get('/style/:styleId', 'middleware', function ($styleId) {
	$result = getTemplateStyleById($styleId);
	echo $result;
});

$app->post('/fileUpload', function () use ($app) {
	$request = $app->request;
	$params = $request->post();
    $result = filesUpload($params['userId']);
    echo $result;

});


$app->post('/login', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	$result = loginWithPassword($jsonObj->email, $jsonObj->password);
	echo json_encode($result);
});

$app->post('/register', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	$result = addUser($jsonObj);
	echo json_encode($result);
});

$app->get('/users/:userId', 'middleware', function ($userId) {
	$result = getUserInfoById($userId);
	echo json_encode($result);
	// echo 123;
});

$app->post('/userUpdate', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	$result = updateUser($jsonObj);
	echo json_encode($result);
});

$app->post('/userPass/reset', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();;
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	$result = resetNewPassword($jsonObj);
	echo json_encode($result);
});

$app->get('/forgetNewPass/:email', 'middleware', function ($email) {
	$result = getForgetNewPassword($email);
	echo json_encode($result);
});

$app->get('/getSignature', 'middleware', function () {
	$url = $_GET["url"];
	$url = urldecode($url);
	$appId = 'wx4f3d14438ebc049c';
	$appSecret = '0a8e39b225a522d519e2f3c7fb14da6e';
	$tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appId.'&secret='.$appSecret;
	$res = file_get_contents($tokenUrl);
    $resToken = json_decode($res, true);
    // print_r($resToken);
    // Array ( [access_token] => I5BR3VkuWJyFBoo5Z5YQ3y31Lj0dQPJR36k9lUNfyn8kw3ceQ5xBtJvjj2TYrL3ooyaWxV3HcGk3PN_GX_J7Ra8hTlhLzl6fEaSUOfU7Z4c [expires_in] => 7200 )
    $token = $resToken['access_token'];
    $ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='.$token.'&type=jsapi';
    $res = file_get_contents($ticketUrl);
    $resTicket = json_decode($res, true);
    // {"errcode":0,"errmsg":"ok","ticket":"sM4AOVdWfPE4DxkXGEs8VMKv7FMCPm-I98-klC6SO3Q3AwzxqljYWtzTCxIH9hDOXZCo9cgfHI6kwbe_YWtOQg","expires_in":7200}
    // print_r($resTicket);
    $ticket = $resTicket['ticket'];
    // signature
    $timestamp = time();
    $nonceStr = "bajiaoye";
    //$wxticket = wx_get_jsapi_ticket();
    $wxOri = 'jsapi_ticket='.$ticket.'&noncestr='.$nonceStr.'&timestamp='.$timestamp.'&url='.$url;
    $signature = sha1($wxOri);
    $ret = array();
    $ret['appId'] = $appId;
    $ret['timestamp'] = $timestamp;
    $ret['nonceStr'] = $nonceStr;
    $ret['signature'] = $signature;
	echo json_encode($ret);
});

$app->post('/signup', 'middleware', function () use ($app) {
	$request = $app->request;
	$params = $request->getBody();
	// print_r($request->getBody());
	$jsonObj = json_decode($params, true);
	$jsonObj = (object) $jsonObj;
	// print_r($jsonObj);
	$result = addSignupUser($jsonObj);
	echo json_encode($result);
});

$app->get('/signupList', 'middleware', function () {
	$result = getSignupUsers();
	echo json_encode($result);
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
	$basic['backgroundColor'] = $result['backgroundColor'];
	$music = $result['music'];
	$music->name = replaceImgPath($result['music']->name);
	$basic['music'] = $music;
	$ret['global'] = $basic;
	$startObj = $result['pages'][0];
	$startObj->imgSrc = replaceImgPath($startObj->imgSrc);
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