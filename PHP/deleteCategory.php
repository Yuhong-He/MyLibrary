<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_POST['id'] ?? '';
$un = $_POST['username'] ?? '';
$auth = $_POST['authority'] ?? '';
$code = 401;
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$un ."Auth"])) {
    if ($un == $_SESSION["Username"] && $auth == $_SESSION[$un . "Auth"]) {
        if($auth == 2 || $auth == 3) {
            if ($id != '') {
                require_once "db.php";
                $sql = "SELECT count(*) FROM books WHERE Category = '$id'";
                $resultCount = mysqli_query($db, $sql);
                $categoryTotal = 0;
                while($rowTotal = mysqli_fetch_array($resultCount))
                {
                    $categoryTotal = $rowTotal[0];
                }
                if($categoryTotal > 0) {
                    $code = 201;
                } else {
                    $sql = "DELETE FROM category WHERE CategoryID = $id";
                    mysqli_query($db, $sql);
                    $code = 200;
                }
                mysqli_close($db);
            }
        } else {
            $code = 402;
        }
    }
}
$str = array
(
    'code' => $code
);
$jsonEncode = json_encode($str);
echo $jsonEncode;