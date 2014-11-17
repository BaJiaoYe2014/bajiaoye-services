<?php
//models

//Get all of the works
function getAllWorks() {
	$result = mysql_query("SELECT id, name FROM test");
	$ret = [];
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	    array_push($ret, $row);
	}

	mysql_free_result($result);
	return $ret;
}

?>