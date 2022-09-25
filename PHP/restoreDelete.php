<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_POST['id'] ?? '';
$un = $_POST['user_name'] ?? '';
$auth = $_POST['user_auth'] ?? '';
$code = 401;
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$un ."Auth"])) {
    if ($un == $_SESSION["Username"] && $auth == $_SESSION[$un . "Auth"]) {
        if($auth == 2 || $auth == 3) {
            require_once "db.php";

            $sql = "SELECT * FROM del_books WHERE id = $id";
            $result = mysqli_query($db, $sql);
            while ($row = mysqli_fetch_array($result)) {
                $au = $row['Author'];
                $tt = $row['Title'];
                $lc = $row['Location'];
                $ps = $row['Publisher'];
                $yr = $row['Year'];
                $cd = $row['Code'];
                $cg = $row['Category'];
            }
            $resTitle = mysqli_query($db, "SELECT count(Title) as num FROM books where Title = '$tt' and Code = '$cd'");
            $rewTitle = mysqli_fetch_assoc($resTitle);
            if ($rewTitle['num'] != 0) {
                $code = 201;
            }

            if($code != 201) {
                $sql = "INSERT INTO books (Author, Title, Location, Publisher, Year, Code, Category)
                    VALUES ('$au', '$tt', '$lc', '$ps', '$yr', '$cd', '$cg')";
                mysqli_query($db, $sql);

                $sql = "DELETE FROM del_books WHERE id = $id";
                mysqli_query($db, $sql);

                mysqli_close($db);
                $code = 200;
            }
        }
    }
}
$str = array
(
    'code' => $code
);
$jsonEncode = json_encode($str);
echo $jsonEncode;