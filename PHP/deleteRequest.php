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
        require_once "db.php";
        $sql = "SELECT count(*) AS num FROM request WHERE id = $id AND User = $user_id";
        $resRequest = mysqli_query($db, $sql);
        $rewRequest = mysqli_fetch_assoc($resRequest);
        if ($rewRequest['num'] == 1 || $user_auth == 2 || $user_auth == 3) {
            $sql = "UPDATE request SET Status = 'D' WHERE id = $id";
            mysqli_query($db, $sql);
            $code = 200;
        } else {
            $code = 201;
        }
        mysqli_close($db);
    }
}
$str = array
(
    'code' => $code
);
$jsonEncode = json_encode($str);
echo $jsonEncode;