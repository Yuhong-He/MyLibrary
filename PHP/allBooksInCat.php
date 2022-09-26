<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageHelper.php");
$page = $_GET['page'] ?? '';
$rows = $_GET['rows'] ?? '';
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';

if((is_numeric($page)) && ($page > 0) &&
    (is_numeric($rows)) && ($rows > 0)) {

    $search = preg_replace("/[\']/","\\'", $search);

    session_start();
    if(isset($_SESSION["CategoryID"])) {
        $cat_id = $_SESSION["CategoryID"];
        require_once "db.php";

        if(checkCatExist($cat_id, $db)) {
            $cat_name = getCatName($cat_id, $lang, $db);
            $arr = getBookList($cat_id, $page, $rows, $search, $db);
            $str = PageHelper::getPage(getRecordsSQL($cat_id, $search), $rows, $page, $arr, $db, $cat_name);
            echo json_encode($str);
        } else {
            echo "aaa";
            echo json_encode(array('code' => 201));
        }

        mysqli_close($db);
    } else {
        echo "bbb";
        echo json_encode(array('code' => 201));
    }
} else {
    echo "Are u trying to do something?\n:(";
}

function getBookList($cat_id, $page, $rows, $search, $db): array
{
    $start_from = ($page - 1) * $rows;
    $columns = "Author, Title, Location, Publisher, Year, Code, id";
    if($search == ""){
        $sql = "SELECT $columns FROM books
                WHERE Category = '$cat_id'
                ORDER BY id DESC
                LIMIT $start_from, $rows";
    } else {
        $sql = "SELECT $columns FROM books
                WHERE Title LIKE '%$search%' AND Category = '$cat_id'
                ORDER BY id DESC
                LIMIT $start_from, $rows";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    if($result != false) {
        while($row = mysqli_fetch_array($result))
        {
            $arr[] = ["title"=>$row['Title'], "author"=>$row['Author'], "publisher"=>$row['Publisher'], "location"=>$row['Location'],
                "year"=>$row['Year'], "code"=>$row['Code'], "id"=>$row['id']];
        }
    }
    return $arr;
}

function getRecordsSQL($cat_id, $search): string
{
    if($search == ""){
        $sql = "SELECT COUNT(*) FROM books WHERE Category = '$cat_id'";
    } else {
        $sql = "SELECT COUNT(*) FROM books WHERE Title LIKE '%$search%' AND Category = '$cat_id'";
    }
    return $sql;
}

function checkCatExist($cat_id, $db): bool
{
    $sql = "SELECT * FROM category WHERE CategoryID = $cat_id";
    $result = mysqli_query($db, $sql);
    $check = false;
    while(mysqli_fetch_array($result))
    {
        $check = true;
    }
    return $check;
}

function getCatName($cat_id, $lang, $db): string
{
    if($lang == "zh") {
        $sql = "SELECT CategoryName FROM category WHERE CategoryID = $cat_id";
    } else {
        $sql = "SELECT EnCatName FROM category WHERE CategoryID = $cat_id";
    }
    $result = mysqli_query($db, $sql);
    $cat_name = "";
    if($result != false) {
        while($row = mysqli_fetch_array($result))
        {
            $cat_name = $row[0];
        }
    }
    return $cat_name;
}