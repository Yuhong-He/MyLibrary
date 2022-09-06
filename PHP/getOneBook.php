<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_GET['id'] ?? '';
$lang = $_GET['lang'] ?? '';
if($id != '') {
    require_once "db.php";
    if($lang == "zh"){
        $columns = "Author, Title, Location, Publisher, Year, Code, Category AS CatId, CategoryName AS CatName, id";
    } else {
        $columns = "Author, Title, Location, Publisher, Year, Code, Category AS CatId, EnCatName AS CatName, id";
    }
    $sql = "SELECT $columns FROM books JOIN category ON books.Category = category.CategoryID WHERE id = $id";
    $result=mysqli_query($db, $sql);
    $res = null;
    while($row = mysqli_fetch_array($result))
    {
        $res = ["author"=>$row['Author'], "title"=>$row['Title'], "location"=>$row['Location'],
            "publisher"=>$row['Publisher'], "year"=>$row['Year'], "code"=>$row['Code'],
            "catId"=>$row['CatId'], "catName"=>$row['CatName'], "id"=>$row['id']];
    }
    mysqli_close($db);
    echo json_encode($res);
}