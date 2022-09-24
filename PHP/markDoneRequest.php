<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_POST['id'] ?? '';
$user_name = $_POST['user_name'] ?? '';
$user_id = $_POST['user_id'] ?? '';
$user_auth = $_POST['user_auth'] ?? '';
$code = 401;
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$user_name ."Auth"])) {
    if ($user_name == $_SESSION["Username"] && $user_auth == $_SESSION[$user_name . "Auth"]) {
        if($user_auth == 2 || $user_auth == 3) {
            require_once "db.php";
            $time = date('Y-m-d H:i:s');
            $sql = "UPDATE request SET Status = 'Y', Time = '$time', Admin = $user_id WHERE id = $id";
            mysqli_query($db, $sql);
            mysqli_close($db);
            $code = 200;
        }
    }
}
$str = array
(
    'code' => $code
);
$jsonEncode = json_encode($str);
echo $jsonEncode;