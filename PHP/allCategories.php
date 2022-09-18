<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageSelector.php");
$page = $_GET['page'] ?? '';
$rows = $_GET['rows'] ?? '';
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';

if($page != '') {

    require_once "db.php";
    $arr = getCategoryList($page, $rows, $lang, $search, $db);
    $total_records = getTotalRecords($search, $lang, $db);
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

function getCategoryList($page, $rows, $lang, $search, $db): array
{
    $start_from = ($page - 1) * $rows;
    if($lang == "zh"){
        $columns = "CategoryID, CategoryName";
        $cat_lang_column = "CategoryName";
    } else {
        $columns = "CategoryID, EnCatName";
        $cat_lang_column = "EnCatName";
    }
    if($search == ""){
        $sql = "SELECT $columns FROM category ORDER BY CategoryID ASC LIMIT $start_from, $rows";
    } else {
        $sql = "SELECT $columns FROM category WHERE $cat_lang_column LIKE '%$search%' ORDER BY CategoryID ASC LIMIT $start_from, $rows";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    while($row = mysqli_fetch_array($result))
    {
        $sql = "SELECT count(*) FROM books WHERE Category = '$row[0]'";
        $resultCount = mysqli_query($db, $sql);
        $categoryTotal = 0;
        while($rowTotal = mysqli_fetch_array($resultCount))
        {
            $categoryTotal = $rowTotal[0];
        }
        $arr[] = ["id"=>$row[0], "name"=>$row[1], "total"=>$categoryTotal];
    }
    return $arr;
}

function getTotalRecords($search, $lang, mysqli $db)
{
    if($lang == "zh"){
        $cat_lang_column = "CategoryName";
    } else {
        $cat_lang_column = "EnCatName";
    }
    if($search == ""){
        $sql = "SELECT COUNT(*) FROM category";
    } else {
        $sql = "SELECT COUNT(*) FROM category WHERE $cat_lang_column LIKE '%$search%'";
    }
    $result = mysqli_query($db, $sql);
    $total_records=0;
    while ($row = mysqli_fetch_row($result))
    {
        $total_records=$row[0];
    }
    return $total_records;
}
