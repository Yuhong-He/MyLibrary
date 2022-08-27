<?php
$page=$_GET['page'];
$rows=$_GET['rows'];
$sortByColumn=$_GET['sortByColumn'];
$sortOrder=$_GET['sortOrder'];
require_once "db.php";
$start_from = ($page - 1) * $rows;
if($sortByColumn == 'hscode'){
    $sql = "SELECT * FROM books ORDER BY $sortByColumn DESC LIMIT $start_from, $rows";
} else if($sortOrder == "asc"){
    $sql = "SELECT * FROM books ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci ASC LIMIT $start_from, $rows";
} else {
    $sql = "SELECT * FROM books ORDER BY convert($sortByColumn using gbk) collate gbk_chinese_ci DESC LIMIT $start_from, $rows";
}
$result=mysqli_query($db, $sql);
while($row = mysqli_fetch_array($result))
{
    echo "<tr>";
    echo "<td>" . $row['Title'] . "</td>";
    echo "<td>" . $row['Author'] . "</td>";
    echo "<td>" . $row['Publisher'] . "</td>";
    echo "<td>" . $row['Year'] . "</td>";
    echo "<td>" . $row['Category'] . "</td>";
    echo "<td>
            <button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-bookmark'></span></button>
            <button class='btn btn-primary btn-sm'><span class='glyphicon glyphicon-pencil'></span></button>
            <button class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-trash'></span></button>
          </td>";
    echo "</tr>";
}
mysqli_close($db);