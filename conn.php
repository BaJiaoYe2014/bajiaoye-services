<?php
//TODO need to put in config file
mysql_connect("localhost", "root", "123456") or
    die("Could not connect: " . mysql_error());
mysql_select_db("bajiaoye");

?>