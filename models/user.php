<?php

// Add one user
function addUser($user) {
	$ret = false;
	// print_r($works);
	$passwd = md5($user->password . '&*(^(*^(*)(*)');
	$sql = "INSERT INTO users (name, email, password) values (".
		"'', '$user->email', '$passwd')";
	mysql_query($sql);
	if(mysql_insert_id()) {
		$ret = getUserById(mysql_insert_id());
	}
	
	return $ret;
}

// Get one user by id
function getUserById($id) {
	$result = mysql_query("SELECT userId, email, password FROM users where userId = $id");
	$row = mysql_fetch_array($result, MYSQL_ASSOC);

	mysql_free_result($result);
	return $row;
}

// Get one user by id
function getUserInfoById($id) {
	$result = mysql_query("SELECT * FROM users where userId = $id");
	$row = mysql_fetch_array($result, MYSQL_ASSOC);

	mysql_free_result($result);
	return $row;
}

function loginWithPassword($email, $pass) {
	$ret = false;
	$result = mysql_query("SELECT userId, email, password FROM users where email = '$email'");
	$user = mysql_fetch_array($result, MYSQL_ASSOC);
	mysql_free_result($result);
	if(!empty($user)) {
		$checkingPass = md5($pass . '&*(^(*^(*)(*)');
		if($checkingPass == $user['password']) {
			$ret = $user;
		}

	}
	return $ret;
}

function checkValidateUser($email, $pass) {
	$ret = false;
	$result = mysql_query("SELECT userId, email, password FROM users where email = $email");
	$user = mysql_fetch_array($result, MYSQL_ASSOC);
	mysql_free_result($result);
	if(!empty($row)) {
		if($pass == $user['password']) {
			$ret = true;
		}

	}
	return $ret;
}

function updateUser($user) {
	// $works = (object) $works;
	$sql = "UPDATE users SET ";
	if(!empty($user->name)) {
		$sql .= "name = '$user->name', ";
	}
	if(!empty($user->duty)) {
		$sql .= "duty = '$user->duty', ";
	}
	if(!empty($user->phone)) {
		$sql .= "phone = '$user->phone', ";
	}
	if(!empty($user->qq)) {
		$sql .= "qq = '$user->qq', ";
	}
	if(!empty($user->comName)) {
		$sql .= "comName = '$user->comName', ";
	}
	if(!empty($user->comProv)) {
		$sql .= "comProv = '$user->comProv', ";
	}
	if(!empty($user->comCity)) {
		$sql .= "comCity = '$user->comCity', ";
	}
	if(!empty($user->comSite)) {
		$sql .= "comSite = '$user->comSite'";
	}
	$sql .= " WHERE userId = '$user->userId'";
	// echo $sql;
	$ret = mysql_query($sql);
	return $ret;
}


?>