<?php
session_start();
$un = $_POST["username"] ?? '';
if($un != "") {
    unset($_SESSION[$un]);
}