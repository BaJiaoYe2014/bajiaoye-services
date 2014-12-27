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


?>