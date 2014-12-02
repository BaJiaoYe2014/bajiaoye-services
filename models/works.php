<?php
//models

//Get all of the works
function getAllWorksByUserId($userId) {
	$result = mysql_query("SELECT * FROM works where userId = $userId");
	$ret = [];
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
	return $row;
}

// Init one works
function initWorks($works) {
	$ret = 0;
	$works = (object) $works;
	// print_r($works);
	$result = mysql_query("SELECT * FROM users where userId = $works->userId");
	$user = (object) mysql_fetch_array($result, MYSQL_ASSOC);
	// print_r($user);
	if($user) {
		$jsonStr = convertChar($works);
		$sql = "INSERT INTO works (name, author, thumb, userId, originBy, pages) values ('$works->name', '$user->name', '$works->thumb', '$user->userId', '$works->tplId', '$jsonStr')";
		mysql_query($sql);
		$ret = mysql_insert_id();
	}
	return $ret;
}

function updateWorks($works) {
	$works = (object) $works;
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
	$pages = array();
    foreach ( $works->pages as $item ) {
    	// print_r($item);
        $item["name"] = urlencode($item["name"]);
        if($item["desc"]) {
        	$item["desc"] = urlencode($item["desc"]);
        }
        if($item["animateImgs"]) {
        	$elements = array();
	        foreach($item["animateImgs"] as $ele) {
	        	$ele["name"] = urlencode($ele["name"]);
	        	$elements[] = $ele;
	        }
	        $item["animateImgs"] = $elements;
        }// if
        $pages[] = $item;
    }
    $jsonStr = urldecode(json_encode($pages));
    return $jsonStr;
}


?>