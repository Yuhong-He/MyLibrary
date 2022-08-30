<?php
$page=$_GET['page'];
$rows=$_GET['rows'];
$sortByColumn=$_GET['sortByColumn'];
$sortOrder=$_GET['sortOrder'];
$lang=$_GET['lang'];
$search=$_GET['search'];
require_once "db.php";
$start_from = ($page - 1) * $rows;
if($search == ""){
    if($sortByColumn == 'id'){
        $sql = "SELECT * FROM books ORDER BY $sortByColumn DESC LIMIT $start_from, $rows";
    } else if($sortOrder == "asc"){
        $sql = "SELECT * FROM books ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci ASC LIMIT $start_from, $rows";
    } else {
        $sql = "SELECT * FROM books ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci DESC LIMIT $start_from, $rows";
    }
} else {
    if($sortByColumn == 'id'){
        $sql = "SELECT * FROM books WHERE Title LIKE '%$search%' ORDER BY $sortByColumn DESC LIMIT $start_from, $rows";
    } else if($sortOrder == "asc"){
        $sql = "SELECT * FROM books WHERE Title LIKE '%$search%' ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci ASC LIMIT $start_from, $rows";
    } else {
        $sql = "SELECT * FROM books WHERE Title LIKE '%$search%' ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci DESC LIMIT $start_from, $rows";
    }
}
$result=mysqli_query($db, $sql);
while($row = mysqli_fetch_array($result))
{
    $count[]=$row[0];
    echo "<tr>";
    echo "<td>" . $row['Title'] . "</td>";
    echo "<td>" . $row['Author'] . "</td>";
    echo "<td>" . $row['Publisher'] . "</td>";
    echo "<td>" . $row['Year'] . "</td>";
    $cateID = $row['Category'];
    $cateName = "";
    if($lang == "zh"){
        $cateNameResult=mysqli_query($db,"SELECT CategoryName FROM category JOIN books ON category.CategoryID = $cateID");
    } else {
        $cateNameResult=mysqli_query($db,"SELECT EnCatName FROM category JOIN books ON category.CategoryID = $cateID");
    }
    while ($rowCate=mysqli_fetch_row($cateNameResult))
    {
        $cateName = $rowCate[0];
        break;
    }
    echo "<td><a href='by_category.php?id=" . $cateID . "'>" . $cateName . "</a></td>";
    echo "<td>
            <button class='btn btn-default btn-sm cite_btn' cite-id='" . $row['id'] . "'><span class='glyphicon glyphicon-book'></span></button>
            <button class='btn btn-primary btn-sm'><span class='glyphicon glyphicon-pencil'></span></button>
            <button class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-trash'></span></button>
          </td>";
    echo "</tr>";
}
if(empty($count)==TRUE)
{
    if($lang == "zh"){
        echo "<td colspan='6' style='text-align: center; font-size: large; color: grey;'>暂无数据</td>";
    } else {
        echo "<td colspan='6' style='text-align: center; font-size: large; color: grey;'>No Data Found</td>";
    }
}
mysqli_close($db);