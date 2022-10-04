<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageHelper.php");
$page = $_GET['page'] ?? '';
$author = $_GET['author'] ?? '';
$keyword1 = $_GET['keyword1'] ?? '';
$keyword2 = $_GET['keyword2'] ?? '';
$publisher = $_GET['publisher'] ?? '';

if((is_numeric($page)) && ($page > 0)) {

    $author = preg_replace("/[\']/","\\'", $author);
    $keyword1 = preg_replace("/[\']/","\\'", $keyword1);
    $keyword2 = preg_replace("/[\']/","\\'", $keyword2);
    $publisher = preg_replace("/[\']/","\\'", $publisher);
    $condition = "WHERE title LIKE '%$keyword1%'";
    if($keyword2 != "") {
        $condition = $condition ." AND title LIKE '%$keyword2%'";
    }
    if($author != "") {
        $condition = $condition ." AND author LIKE '%$author%'";
    }
    if($publisher != "") {
        $condition = $condition ." AND publisher LIKE '%$publisher%'";
    }
    require_once "db.php";
    $arr = getBookList($page, 20, $condition, $db);
    $str = PageHelper::getPage(getRecordsSQL($condition), 20, $page, $arr, $db, "", "");
    mysqli_close($db);

    echo json_encode($str);
} else {
    echo "Are u trying to do something?\n:(";
}

function getBookList($page, $rows, $condition, $db): array
{
    $start_from = ($page - 1) * $rows;
    $sql = "SELECT ssid, title, author, publisher, year, code FROM duxiu "
            .$condition
            ." ORDER BY ssid LIMIT $start_from, $rows";
    $result = mysqli_query($db, $sql);
    $arr = [];
    if($result != false) {
        while($row = mysqli_fetch_array($result))
        {
            $arr[] = ["title"=>$row[1], "author"=>$row[2], "publisher"=>$row[3], "year"=>$row[4], "code"=>$row[5], "id"=>$row[0]];
        }
    }
    return $arr;
}

function getRecordsSQL($condition): string
{
    return "SELECT COUNT(*) FROM duxiu " .$condition;
}