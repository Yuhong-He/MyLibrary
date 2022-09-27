<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageHelper.php");
$page = $_GET['page'] ?? '';
$user_name = $_GET['user_name'] ?? '';
$user_auth = $_GET['user_auth'] ?? '';
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$user_name ."Auth"])) {
    if ($user_name == $_SESSION["Username"] && $user_auth == $_SESSION[$user_name . "Auth"]) {
        if ($user_auth == 2 || $user_auth == 3) {

            require_once "db.php";
            $rows = 5;
            $arr = getRequestsList($page, $rows, $lang, $search, $db);
            $str = PageHelper::getPage(getRecordsSQL($search), $rows, $page, $arr, $db, "", "");
            mysqli_close($db);

            echo json_encode($str);
        } else {
            echo json_encode(array('code' => 401));
        }
    } else {
        echo json_encode(array('code' => 401));
    }
} else {
    echo json_encode(array('code' => 401));
}

function getRequestsList($page, $rows, $lang, $search, $db): array
{
    $start_from = ($page - 1) * $rows;
    if($lang == "zh"){
        $columns = "Author, Title, Publisher, Category AS CatId, CategoryName AS CatName, UserName, del_books.id";
    } else {
        $columns = "Author, Title, Publisher, Category AS CatId, EnCatName AS CatName, UserName, del_books.id";
    }
    if($search == "") {
        $sql = "SELECT $columns FROM del_books
                JOIN category ON del_books.Category = category.CategoryID
                JOIN User ON del_books.admin_id = user.id
                ORDER BY id DESC LIMIT $start_from, $rows";
    } else {
        $sql = "SELECT $columns FROM del_books
                JOIN category ON del_books.Category = category.CategoryID
                JOIN User ON del_books.admin_id = user.id
                WHERE Title LIKE '%$search%'
                ORDER BY id DESC LIMIT $start_from, $rows";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    if($result != false) {
        while($row = mysqli_fetch_array($result)) {
            $arr[] = ["title"=>$row['Title'], "author"=>$row['Author'], "publisher"=>$row['Publisher'], "catId"=>$row['CatId'],
                "catName"=>$row['CatName'], "admin"=>$row['UserName'], "id"=>$row['id']];
        }
    }
    return $arr;
}

function getRecordsSQL($search): string
{
    if($search == '') {
        $sql = "SELECT COUNT(*) FROM del_books";
    } else {
        $sql = "SELECT COUNT(*) FROM del_books WHERE Title LIKE '%$search%'";
    }
    return $sql;
}
