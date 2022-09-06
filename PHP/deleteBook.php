<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_POST['id'] ?? '';
$un = $_POST['username'] ?? '';
$auth = $_POST['authority'] ?? '';
$code = 401;
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$un ."Auth"])) {
    if ($un == $_SESSION["Username"] && $auth == $_SESSION[$un . "Auth"]) {
        if ($id != '') {
            require_once "db.php";
            $sql = "SELECT * FROM books JOIN category ON books.Category = category.CategoryID WHERE id = $id";
            $result = mysqli_query($db, $sql);
            $res = null;
            while ($row = mysqli_fetch_array($result)) {
                $au = $row['Author'];
                $tt = $row['Title'];
                $lc = $row['Location'];
                $ps = $row['Publisher'];
                $yr = $row['Year'];
                $cd = $row['Code'];
                $cg = $row['Category'];
            }

            $sql = "INSERT INTO del_books (Author, Title, Location, Publisher, Year, Code, Category)
			VALUES ('$au', '$tt', '$lc', '$ps', '$yr', '$cd', '$cg')";
            mysqli_query($db, $sql);

            $sql = "DELETE FROM books WHERE id = $id";
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