<?php
global $db;
$db = mysqli_connect('localhost:8889','root','1234567890','myLibrary');
if($db===FALSE) die('Fail message');
