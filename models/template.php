<?php
// read json file from local server

//Get template list
function getTemplateList() {
	$jasonStr = file_get_contents('templates/tpls/tpl-list.json');
	return $jasonStr;
}

// Get one template by id
function getTemplateById($tplId) {
	$fileName = 'templates/tpls/tpl'.$tplId.'.json';
	if (file_exists($fileName)) {
		$jasonStr = file_get_contents($fileName);
	}else{
		$obj = (object)array();
		$jasonStr = json_encode($obj);
	}
	return $jasonStr;
}

//Get template list
function getTemplateStyleList($type) {
	$jasonStr = file_get_contents('templates/styles/style-'.$type.'-list.json');
	return $jasonStr;
}

// Get one template by id
function getTemplateStyleById($styleId) {
	$fileName = 'templates/styles/'.$styleId.'/style.json';
	if (file_exists($fileName)) {
		$jasonStr = file_get_contents($fileName);
	}else{
		$obj = (object)array();
		$jasonStr = json_encode($obj);
	}
	return $jasonStr;
}

?>