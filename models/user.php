<?php
require 'mail.php';
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

function getUserByEmail($email) {
	$result = mysql_query("SELECT userId, email, password FROM users where email = '$email'");
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

function checkValidateUser($userId, $pass) {
	$ret = false;
	$result = mysql_query("SELECT userId, email, password FROM users where userId = $userId");
	$user = mysql_fetch_array($result, MYSQL_ASSOC);
	mysql_free_result($result);
	if(!empty($user)) {
		$checkingPass = md5($pass . '&*(^(*^(*)(*)');
		if($checkingPass == $user['password']) {
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

function updateUserPassword($userId, $password) {
	$password = md5($password . '&*(^(*^(*)(*)');
	$sql = "UPDATE users SET ";
	if(!empty($password)) {
		$sql .= "password = '$password' ";
	}
	$sql .= "WHERE userId = $userId";
	// echo $sql;
	$ret = mysql_query($sql);
	return $ret;
}

function getForgetNewPassword($email) {
	$ret = false;
	$tmp = false;
	$newPass = substr(base64_encode(rand(0,9999).time()), 0, 8);
	$user = getUserByEmail($email);
	if(!empty($user)) {
		$tmp = updateUserPassword($user["userId"], $newPass);
	}
	if($tmp) {
		$ret = sendEmail($email, $newPass);
	}
	return $ret;
}

function resetNewPassword($user) {
	$ret = false;
	$check = checkValidateUser($user->userId, $user->oldPassword);
	if($check) {
		$ret = updateUserPassword($user->userId, $user->newPassword);
	}
	return $ret;
}

// Add one signup user
function addSignupUser($user) {
	$ret = false;
	// print_r($user);
	$sql = "INSERT INTO customer (name, phone, position, company, shop) values (".
		"'$user->name', '$user->phone', '$user->position', '$user->company', '$user->shop')";
	mysql_query($sql);
	if(mysql_insert_id()) {
		$ret = true;
	}
	return $ret;
}

// Get all sign up users
function getSignupUsers() {
	$result = mysql_query("SELECT * FROM customer");
	$ret = array();
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	    array_push($ret, $row);
	}

	mysql_free_result($result);
	return $ret;
}

?>