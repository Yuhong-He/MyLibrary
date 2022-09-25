<?php
header('Content-Type:text/json;charset=utf-8');
$book = $_POST['book'] ?? '';
$user_name = $_POST['user_name'] ?? '';
$user_id = $_POST['user_id'] ?? '';
$user_email = $_POST['email'] ?? '';
session_start();
if(isset($_SESSION["Username"])) {
    if ($user_name == $_SESSION["Username"]) {
        require_once "db.php";
        $sql = "SELECT Banned FROM user WHERE id = $user_id";
        $result = mysqli_query($db, $sql);
        $banned = "";
        while ($row = mysqli_fetch_array($result)) {
            $banned = $row[0];
        }
        if($banned == "N") {
            if (!preg_match("/[();]/", $book)) {
                $time = date('Y-m-d H:i:s');
                $sql = "INSERT INTO request (Book, User, Email, Time, Status)
                    VALUES ('$book', '$user_id', '$user_email', '$time', 'N')";
                mysqli_query($db, $sql);
                $code = 200;
            } else {
                $code = 201;
            }
        } else {
            $code = 402;
        }

        mysqli_close($db);
    } else {
        $code = 401;
    }
} else {
    $code = 401;
}
$jsonEncode = json_encode(array('code' => $code));
echo $jsonEncode;