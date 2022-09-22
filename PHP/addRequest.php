<?php
header('Content-Type:text/json;charset=utf-8');
$book = $_POST['book'] ?? '';
$user_name = $_POST['user_name'] ?? '';
$user_id = $_POST['user_id'] ?? '';
$user_email = $_POST['email'] ?? '';
session_start();
if(isset($_SESSION["Username"])) {
    if ($user_name == $_SESSION["Username"]) {
        if (!preg_match("/[();]/", $book)) {
            require_once "db.php";
            $time = date('Y-m-d H:i:s');
            $sql = "INSERT INTO request (Book, User, Email, Time, Status)
                    VALUES ('$book', '$user_id', '$user_email', '$time', 'N')";
            mysqli_query($db, $sql);
            $code = 200;
            mysqli_close($db);
        } else {
            $code = 201;
        }
    } else {
        $code = 401;
    }
} else {
    $code = 401;
}
$jsonEncode = json_encode(array('code' => $code));
echo $jsonEncode;