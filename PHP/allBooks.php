<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageSelector.php");
$page = $_GET['page'] ?? '';
$rows = $_GET['rows'] ?? '';
$sortByColumn = $_GET['sortByColumn'] ?? '';
$sortOrder = $_GET['sortOrder'] ?? '';
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';

if($page != '') {

    require_once "db.php";
    $arr = getBookList($page, $rows, $sortByColumn, $sortOrder, $lang, $search, $db);
    $total_records = getTotalRecords($search, $db);
    mysqli_close($db);

    $total_pages = ceil($total_records / $rows);
    $max_nav_pages = 5;                                 // num of navigate bar block
    $curr_page = intval($page);

    $nav = PageSelector::getNavArray($max_nav_pages, $curr_page, $total_pages);
    $str = array
    (
        'count'=>$total_records,
        'pages'=>$total_pages,
        'currentPage'=>$curr_page,
        'navigatePageNums'=>$nav,
        'body'=>$arr
    );
    echo json_encode($str);
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
    while($row = mysqli_fetch_array($result))
    {
        $arr[] = ["title"=>$row['Title'], "author"=>$row['Author'], "publisher"=>$row['Publisher'], "location"=>$row['Location'],
            "year"=>$row['Year'], "code"=>$row['Code'], "catId"=>$row['CatId'], "catName"=>$row['CatName'], "id"=>$row['id']];
    }
    return $arr;
}

function getTotalRecords($search, mysqli $db)
{
    if($search == ""){
        $sql = "SELECT COUNT(*) FROM books";
    } else {
        $sql = "SELECT COUNT(*) FROM books WHERE Title LIKE '%$search%'";
    }
    $result = mysqli_query($db, $sql);
    $total_records=0;
    while ($row = mysqli_fetch_row($result))
    {
        $total_records=$row[0];
    }
    return $total_records;
}
