<?php
//models

//Get all of the works
function getAllWorksByUserId($userId) {
	$result = mysql_query("SELECT * FROM works where userId = $userId");
	$ret = array();
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	    array_push($ret, $row);
	}

	mysql_free_result($result);
	return $ret;
}

// Get one works by workId
function getWorksById($worksId) {
	$result = mysql_query("SELECT * FROM works where id = $worksId");
	$row = mysql_fetch_array($result, MYSQL_ASSOC);

	mysql_free_result($result);
	$row["pages"] = json_decode($row["pages"]);
	$row["music"] = json_decode($row["music"]);
	return $row;
}

// Init one works
function initWorks($works) {
	$ret = 0;
	// $works = (object) $works;
	// print_r($works);
	$result = mysql_query("SELECT * FROM users where userId = $works->userId");
	$user = (object) mysql_fetch_array($result, MYSQL_ASSOC);
	// print_r($user);
	if($user) {
		$jsonStr = convertChar($works);
		$music = json_encode($works->music);
		$url = substr(base64_encode(rand(0,9999).time()), 0, 10);
		$sql = "INSERT INTO works (name, author, thumb, userId, originBy, pages, music, backgroundColor, pageTitle, pageDescribe, shareImage, url) values (".
			"'$works->name', '$user->name', '$works->thumb', '$user->userId', '$works->originBy', '$jsonStr', '$music', '$works->backgroundColor', '$works->pageTitle', '$works->pageDescribe', '$works->shareImage', '$url')";
		mysql_query($sql);
		$ret = mysql_insert_id();
	}
	return $ret;
}

function updateWorks($works) {
	// $works = (object) $works;
	$jsonStr = convertChar($works);
	$phptime = time();
	$mysqltime=date('Y-m-d H:i:s',$phptime);
	$sql = "UPDATE works SET ";
	if(!empty($works->name)) {
		$sql .= "name = '$works->name', ";
	}
	if(!empty($works->author)) {
		$sql .= "author = '$works->author', ";
	}
	if(!empty($works->thumb)) {
		$sql .= "thumb = '$works->thumb', ";
	}
	if(!empty($works->url)) {
		$sql .= "url = '$works->url', ";
	}
	if(!empty($works->pages)) {
		// $jsonStr = json_encode($works->pages);
		$sql .= "pages = '$jsonStr', ";
	}
	if(!empty($works->music)) {
		$music = json_encode($works->music);
		$sql .= "music = '$music', ";
	}
	if(!empty($works->pageTitle)) {
		$sql .= "pageTitle = '$works->pageTitle', ";
	}
	if(!empty($works->pageDescribe)) {
		$sql .= "pageDescribe = '$works->pageDescribe', ";
	}
	if(!empty($works->backgroundColor)) {
		$sql .= "backgroundColor = '$works->backgroundColor', ";
	}
	if(!empty($works->shareImage)) {
		$sql .= "shareImage = '$works->shareImage', ";
	}
	$sql .= "lastModify='$mysqltime' WHERE id = '$works->id'";
	// echo $sql;
	$ret = mysql_query($sql);
	return $ret;
}

function deleteWorksById($worksId) {
	$sql = "DELETE FROM works where id = $worksId";
	$result = mysql_query($sql);

	return $result;
}

function convertChar($works) {
	// print_r($works);
	// return;
	$pages = array();
    foreach ( $works->pages as $item ) {
    	// print_r($item);
    	if(!empty($item->name)) {
    		$item->name = urlencode($item->name);
    	}
    	if(!empty($item->imgName)) {
    		$item->imgName = urlencode($item->imgName);
    	}
    	if(!empty($item->imgTipName)) {
    		$item->imgTipName = urlencode($item->imgTipName);
    	}
    	if(!empty($item->address)) {
    		$item->address = urlencode($item->address);
    	}

    	if(!empty($item->title)) {
    		$item->title = urlencode($item->title);
    	}
        
        if(!empty($item->animateImgs)) {
        	$elements = array();
	        foreach($item->animateImgs as $ele) {
	        	if(!empty($ele->name)) {
	        		$ele->name = urlencode($ele->name);
	        	}
	        	if(!empty($ele->imgName)) {
	        		$ele->imgName = urlencode($ele->imgName);
	        	}
	        	
	        	$elements[] = $ele;
	        }
	        $item->animateImgs = $elements;
        }// if
        $pages[] = $item;
    }
    $jsonStr = urldecode(json_encode($pages));
    return $jsonStr;
}

function refactorWorks($works, $worksId) {
	// $works = (object) $works;
	// print_r($works);
	foreach ($works as $key => $value) {
		if(getValidValues($key, $value)){//value is valid
			if(strrpos($value, "works/".$worksId) === false){
				$fullName = getNewName($worksId, $value);
				$works->$key = $fullName;
			}
		}
	}
	if(!empty($works->music)) {
		$works->music = (object) $works->music;
		foreach ($works->music as $key => $value) {
			if(getValidValues($key, $value)){//value is valid
				if(strrpos($value, "works/".$worksId) === false){
					$fullName = getNewName($worksId, $value);
					$works->music->$key = $fullName;
				}
			}
		}
	}
	$temp = array();
	// $works->pages = (object) $works->pages;
	foreach ($works->pages as $j=>$item) {
		foreach ($item as $k => $v) {
			if(getValidValues($k, $v)){//value is valid
				if(strrpos($v, "works/".$worksId) === false){
					if(strrpos($v, "styles/") === false) {
						$fullName = getNewName($worksId, $v);
					}else{
						$fullName = getStyleNewName($worksId, $v, $item->type, $j);
					}
					
					$item->$k = $fullName;
				}
			}
			if($k == 'animateImgs') {
				$animateImgs = array();
				foreach ($v as $a) {
					foreach ($a as $key => $value) {
						if(getValidValues($key, $value)){//value is valid
							if(strrpos($value, "works/".$worksId) === false){
								if(strrpos($value, "styles/") === false) {
									$fullName = getNewName($worksId, $value);
								}else{
									$fullName = getStyleNewName($worksId, $value, $item->type, $j);
								}
								$a->$key = $fullName;
							}
						}
					}
					$animateImgs[] = $a;
				}
				$item->animateImgs = $animateImgs;
			}
			if($k == 'imgList') {
				$imgList = array();
				foreach ($v as $key => $value) {
					if(getValidValues($key+1, $value)){//value is valid
						if(strrpos($value, "works/".$worksId) === false){
							$fullName = getNewName($worksId, $value);
							$imgList[] = $fullName;
						}
					}
				}
				$item->imgList = $imgList;
			}
		}// for
		$temp[] = $item;
	}
	$works->pages = $temp;
	return $works;
}

function getNewName($worksId,$value) {
	$replacePath = 'works/'.$worksId.'/images/';
	
	$arr = explode('/', $value);
	$last = count($arr) - 1;
	$fullName = $replacePath.$arr[$last];
	// $works->$key = $fullName;
	return $fullName;
}

function getStyleNewName($worksId,$value, $type, $num) {
	$replacePath = 'works/'.$worksId.'/images/';
	
	$arr = explode('/', $value);
	$last = count($arr) - 1;
	$fullName = $replacePath.$type.'_'.$num.'_'.$arr[$last];
	// $works->$key = $fullName;
	return $fullName;
}


?>