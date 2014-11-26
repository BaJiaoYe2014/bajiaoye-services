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
	return $row;
}

// Init one works
function initWorks($works) {
	$ret = false;
	$works = (object) $works;
	// print_r($works);
	$result = mysql_query("SELECT * FROM users where userId = $works->userId");
	$user = (object) mysql_fetch_array($result, MYSQL_ASSOC);
	// print_r($user);
	if($user) {
		$jsonStr = json_encode($works->configurations);
		$sql = "INSERT INTO works (name, author, userId, originBy, configurations) values ('$works->name', '$user->name', '$user->userId', '$works->tplId', '$jsonStr')";
		$ret = mysql_query($sql);
	}
	return $ret;
}


?>