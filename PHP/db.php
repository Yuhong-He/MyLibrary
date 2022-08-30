<?php
global $db;
$db = new mysqli('localhost:8889','root','1234567890','myLibrary');
if($db->connect_error) {
    die('Database Connection Error: ' .$db->connect_error);
}