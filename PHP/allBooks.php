<?php
header('Content-Type:text/json;charset=utf-8');
$page = $_GET['page'] ?? '';
$rows = $_GET['rows'] ?? '';
$sortByColumn = $_GET['sortByColumn'] ?? '';
$sortOrder = $_GET['sortOrder'] ?? '';
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';
if($page != '') {
    require_once "db.php";
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
        $res = ["title"=>$row['Title'], "author"=>$row['Author'], "publisher"=>$row['Publisher'], "location"=>$row['Location'],
            "year"=>$row['Year'], "code"=>$row['Code'], "catId"=>$row['CatId'], "catName"=>$row['CatName'], "id"=>$row['id']];
        $arr[] = $res;
    }
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
    $total_pages = ceil($total_records / $rows);
    mysqli_close($db);
    $max_nav_pages = 5;
    $nav_pages = $total_pages > $max_nav_pages ? $max_nav_pages : $total_pages;
    $curr_page = intval($page);
    $nav = [$nav_pages];
    if($total_pages < $max_nav_pages) {
        for($i = 0; $i < $nav_pages; $i++) {
            $nav[$i] = $i + 1;
        }
    } else {
        if($curr_page > $total_pages - 2) {
            for($i = 0; $i < $nav_pages; $i++) {
                $nav[$i] = $total_pages - $nav_pages + $i + 1;
            }
        } else if($curr_page > $max_nav_pages / 2) {
            for($i = 0; $i < $nav_pages; $i++) {
                $nav[$i] = $curr_page - 2 + $i;
            }
        } else {
            for($i = 0; $i < $nav_pages; $i++) {
                $nav[$i] = $i + 1;
            }
        }
    }
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
