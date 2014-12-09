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
			"'$works->name', '$user->name', '$works->thumb', '$user->userId', '$works->tplId', '$jsonStr', '$music', '$works->backgroundColor', '$works->pageTitle', '$works->pageDescribe', '$works->shareImage', '$url')";
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
	if($works->name) {
		$sql .= "name = '$works->name', ";
	}
	if($works->author) {
		$sql .= "author = '$works->author', ";
	}
	if($works->thumb) {
		$sql .= "thumb = '$works->thumb', ";
	}
	if($works->url) {
		$sql .= "url = '$works->url', ";
	}
	if($works->pages) {
		// $jsonStr = json_encode($works->pages);
		$sql .= "pages = '$jsonStr', ";
	}
	if($works->music) {
		$music = json_encode($works->music);
		$sql .= "music = '$music', ";
	}
	if($works->pageTitle) {
		$sql .= "pageTitle = '$works->pageTitle', ";
	}
	if($works->pageDescribe) {
		$sql .= "pageDescribe = '$works->pageDescribe', ";
	}
	if($works->backgroundColor) {
		$sql .= "backgroundColor = '$works->backgroundColor', ";
	}
	if($works->shareImage) {
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
    	if($item->name) {
    		$item->name = urlencode($item->name);
    	}
    	if($item->imgName) {
    		$item->imgName = urlencode($item->imgName);
    	}
    	if($item->imgTipName) {
    		$item->imgTipName = urlencode($item->imgTipName);
    	}
    	if($item->address) {
    		$item->address = urlencode($item->address);
    	}
        
        if($item->animateImgs) {
        	$elements = array();
	        foreach($item->animateImgs as $ele) {
	        	if($ele->name) {
	        		$ele->name = urlencode($ele->name);
	        	}
	        	if($ele->imgName) {
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
			if(strrpos($value, "works/") === false){
				$fullName = getNewName($worksId, $value);
				$works->$key = $fullName;
			}
		}
	}
	if($works->music) {
		foreach ($works->music as $key => $value) {
			if(getValidValues($key, $value)){//value is valid
				if(strrpos($value, "works/") === false){
					$fullName = getNewName($worksId, $value);
					$works->music->$key = $fullName;
				}
			}
		}
	}
	$temp = array();
	// $works->pages = (object) $works->pages;
	foreach ($works->pages as $item) {
		foreach ($item as $k => $v) {
			if(getValidValues($k, $v)){//value is valid
				if(strrpos($v, "works/") === false){
					$fullName = getNewName($worksId, $v);
					$item->$k = $fullName;
				}
			}
			if($k == 'animateImgs') {
				$animateImgs = array();
				foreach ($v as $a) {
					foreach ($a as $key => $value) {
						if(getValidValues($key, $value)){//value is valid
							if(strrpos($value, "works/") === false){
								$fullName = getNewName($worksId, $value);
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
						if(strrpos($value, "works/") === false){
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


?>