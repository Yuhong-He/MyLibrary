<?php
session_start();
$un = $_POST["username"] ?? '';
if($un != "") {
    unset($_SESSION["Username"]);
    unset($_SESSION[$un ."Password"]);
    unset($_SESSION[$un ."Auth"]);
    session_destroy();
}