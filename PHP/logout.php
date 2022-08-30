<?php
session_start();
$un=$_POST["username"];
unset($_SESSION[$un]);