<?php
// read json file from local server

//Get template list
function getTemplateList() {
	$jasonStr = file_get_contents('templates/tpls/tpl-list.json');
	return $jasonStr;
}

// Get one works by workId
function getTemplateById($worksId) {
	
	return $row;
}

?>