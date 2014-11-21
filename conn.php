<?php
//TODO need to put in config file
mysql_connect("localhost", "root", "123456") or
    die("Could not connect: " . mysql_error());
mysql_set_charset('utf8');
mysql_select_db("bajiaoye");

?>