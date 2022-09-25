<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageHelper.php");
$page = $_GET['page'] ?? '';
$rows = $_GET['rows'] ?? '';
$sortByColumn = $_GET['sortByColumn'] ?? '';
$sortOrder = $_GET['sortOrder'] ?? '';
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';
$valid_sort_columns = array("Author", "Title", "Publisher", "Year", "id");

if((is_numeric($page)) && ($page > 0) &&
    (is_numeric($rows)) && ($rows > 0) &&
    (in_array($sortByColumn, $valid_sort_columns))) {

    $search = preg_replace("/[\']/","\\'", $search);
    require_once "db.php";
    $arr = getBookList($page, $rows, $sortByColumn, $sortOrder, $lang, $search, $db);
    $str = PageHelper::getPage(getRecordsSQL($search), $rows, $page, $arr, $db);
    mysqli_close($db);

    echo json_encode($str);
} else {
    echo "Are u trying to do something?\n:(";
}

function getBookList($page, $rows, $sortByColumn, $sortOrder, $lang, $search, $db): array
{
    $start_from = ($page - 1) * $rows;
    if($lang == "zh"){
        $columns = "Author, Title, Location, Publisher, Year, Code, Category AS CatId, CategoryName AS CatName, id";
    } else {
        $columns = "Author, Title, Location, Publisher, Year, Code, Category AS CatId, EnCatName AS CatName, id";
    }
    if($search == ""){
        if($sortByColumn == 'id'){
            $sql = "SELECT $columns FROM books JOIN category ON books.Category = category.CategoryID ORDER BY $sortByColumn DESC LIMIT $start_from, $rows";
        } else if($sortOrder == "asc"){
            $sql = "SELECT $columns FROM books JOIN category ON books.Category = category.CategoryID ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci ASC LIMIT $start_from, $rows";
        } else {
            $sql = "SELECT $columns FROM books JOIN category ON books.Category = category.CategoryID ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci DESC LIMIT $start_from, $rows";
        }
    } else {
        if($sortByColumn == 'id'){
            $sql = "SELECT $columns FROM books JOIN category ON books.Category = category.CategoryID WHERE Title LIKE '%$search%' ORDER BY $sortByColumn DESC LIMIT $start_from, $rows";
        } else if($sortOrder == "asc"){
            $sql = "SELECT $columns FROM books JOIN category ON books.Category = category.CategoryID WHERE Title LIKE '%$search%' ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci ASC LIMIT $start_from, $rows";
        } else {
            $sql = "SELECT $columns FROM books JOIN category ON books.Category = category.CategoryID WHERE Title LIKE '%$search%' ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci DESC LIMIT $start_from, $rows";
        }
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    if($result != false) {
        while($row = mysqli_fetch_array($result))
        {
            $arr[] = ["title"=>$row['Title'], "author"=>$row['Author'], "publisher"=>$row['Publisher'], "location"=>$row['Location'],
                "year"=>$row['Year'], "code"=>$row['Code'], "catId"=>$row['CatId'], "catName"=>$row['CatName'], "id"=>$row['id']];
        }
    }
    return $arr;
}

function getRecordsSQL($search): string
{
    if($search == ""){
        $sql = "SELECT COUNT(*) FROM books";
    } else {
        $sql = "SELECT COUNT(*) FROM books WHERE Title LIKE '%$search%'";
    }
    return $sql;
}