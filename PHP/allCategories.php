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

    require_once "db.php";
    $arr = getCategoryList($page, $rows, $lang, $search, $db);
    $str = PageHelper::getPage(getRecordsSQL($search, $lang), $rows, $page, $arr, $db, "", "");
    mysqli_close($db);

    echo json_encode($str);
} else {
    echo "Are u trying to do something?\n:(";
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
    if($result != false) {
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
    }
    return $arr;
}

function getRecordsSQL($search, $lang): string
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
    return $sql;
}