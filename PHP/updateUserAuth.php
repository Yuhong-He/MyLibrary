<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_POST['id'] ?? '';
$auth = $_POST['authority'] ?? '';
$banned = $_POST['banned'] ?? '';
$admin_un = $_POST['user_name'] ?? '';
$admin_auth = $_POST['user_auth'] ?? '';
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$admin_un ."Auth"])) {
    if ($admin_un == $_SESSION["Username"] && $admin_auth == $_SESSION[$admin_un ."Auth"]) {
        if($admin_auth == 3) {
            require_once "db.php";
            if($auth == 2 && $banned == "Y") {
                $str = array('code' => 201);
            } else {
                $sql = "UPDATE user SET Authority='$auth', Banned='$banned' WHERE id='$id'";
                mysqli_query($db, $sql);
                mysqli_close($db);
                $str = array('code' => 200);
            }
        } else {
            $str = array('code' => 402);
        }
    } else {
        $str = array('code' => 401);
    }
} else {
    $str = array('code' => 401);
}
$jsonEncode = json_encode($str);
echo $jsonEncode;
