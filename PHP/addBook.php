<?php
header('Content-Type:text/json;charset=utf-8');
$au = $_POST['author'] ?? '';
$tt = $_POST['title'] ?? '';
$lc = $_POST['location'] ?? '';
$ps = $_POST['publisher'] ?? '';
$yr = $_POST['year'] ?? '';
$cd = $_POST['code'] ?? '';
$cg = $_POST['category'] ?? '';
$bookNotRepeat = $_POST['bookNotRepeat'] ?? '';
$codeNotRepeat = $_POST['codeNotRepeat'] ?? '';
$un = $_POST['username'] ?? '';
$auth = $_POST['authority'] ?? '';
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$un ."Auth"])) {
    if ($un == $_SESSION["Username"] && $auth == $_SESSION[$un . "Auth"]) {
        if($auth == 2 || $auth == 3) {
            require_once "db.php";
            $code = 200;
            if ($bookNotRepeat != "true") {
                $resTitle = mysqli_query($db, "SELECT count(Title) as num FROM books where Title = '$tt'");
                $rewTitle = mysqli_fetch_assoc($resTitle);
                if ($rewTitle['num'] != 0) {
                    $code = 201;
                }
            }
            if ($code == 200 && $cd != "" && $codeNotRepeat != "true") {
                $resCode = mysqli_query($db, "SELECT count(Code) as num FROM books where Code = '$cd'");
                $rewCode = mysqli_fetch_assoc($resCode);
                if ($rewCode['num'] != 0) {
                    $code = 202;
                }
            }
            if ($code == 200 && $cg != "") {
                $resCode = mysqli_query($db, "SELECT count(CategoryID) as num FROM category where CategoryID = '$cg'");
                $rewCode = mysqli_fetch_assoc($resCode);
                if ($rewCode['num'] != 1) {
                    $code = 203;
                }
            }
            if ($code == 200) {
                $sql = "INSERT INTO books (Author, Title, Location, Publisher, Year, Code, Category)
			VALUES ('$au', '$tt', '$lc', '$ps', '$yr', '$cd', '$cg')";
                mysqli_query($db, $sql);
            }
        } else {
            $code = 402;
        }
    } else {
        $code = 401;
    }
} else {
    $code = 401;
}
$str = array
(
    'code' => $code
);
$jsonEncode = json_encode($str);
echo $jsonEncode;