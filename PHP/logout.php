<?php
session_start();
$un = $_POST["username"] ?? '';
if($un != "") {
    unset($_SESSION["Username"]);
    unset($_SESSION[$un ."Id"]);
    unset($_SESSION[$un ."Auth"]);
    session_destroy();
}