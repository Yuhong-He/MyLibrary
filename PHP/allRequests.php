<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageHelper.php");
$page = $_GET['page'] ?? '';
$user_name = $_GET['user_name'] ?? '';
$user_auth = $_GET['user_auth'] ?? '';
$display_delete = $_GET['display_delete'] ?? '';
$code = 401;
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$user_name ."Auth"])) {
    if ($user_name == $_SESSION["Username"] && $user_auth == $_SESSION[$user_name . "Auth"]) {
        if ($user_auth == 2 || $user_auth == 3) {

            require_once "db.php";
            $rows = 5;
            $arr = getRequestsList($page, $rows, $display_delete, $db);
            $total_records = PageHelper::getTotalRecords(getRecordsSQL($display_delete), $db);
            mysqli_close($db);

            $total_pages = ceil($total_records / $rows);
            $max_nav_pages = 5;
            $curr_page = intval($page);

            $nav = PageHelper::getNavArray($max_nav_pages, $curr_page, $total_pages);
            $str = array
            (
                'code' => 200,
                'count' => $total_records,
                'pages' => $total_pages,
                'currentPage' => $curr_page,
                'navigatePageNums' => $nav,
                'body' => $arr
            );
            echo json_encode($str);
        } else {
            echo json_encode(array('code' => 401));
        }
    } else {
        echo json_encode(array('code' => 401));
    }
} else {
    echo json_encode(array('code' => 401));
}

function getRequestsList($page, $rows, $display_delete, $db): array
{
    $start_from = ($page - 1) * $rows;
    if($display_delete == 'false') {
        $sql = "SELECT * FROM request WHERE Status != 'D' ORDER BY Time DESC LIMIT $start_from, $rows";
    } else {
        $sql = "SELECT * FROM request ORDER BY Time DESC LIMIT $start_from, $rows";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    if($result != false) {
        while($row = mysqli_fetch_array($result)) {
            $sql = "SELECT UserName FROM user WHERE id = $row[1]";
            $resultUser = mysqli_query($db, $sql);
            $userName = "";
            while($rowUser = mysqli_fetch_array($resultUser))
            {
                $userName = $rowUser["UserName"];
            }
            if($row[5] != null) {
                $sql = "SELECT UserName FROM user WHERE id = $row[5]";
                $resultAdmin = mysqli_query($db, $sql);
                $adminName = "";
                while($rowAdmin = mysqli_fetch_array($resultAdmin))
                {
                    $adminName = $rowAdmin["UserName"];
                }
                $arr[] = ["book"=>$row[0], "user"=>$userName, "email"=>$row[2], "time"=>$row[3], "status"=>$row[4], "admin"=>$adminName, "id"=>$row[6]];
            } else {
                $arr[] = ["book"=>$row[0], "user"=>$userName, "email"=>$row[2], "time"=>$row[3], "status"=>$row[4], "admin"=>"", "id"=>$row[6]];
            }
        }
    }
    return $arr;
}

function getRecordsSQL($display_delete): string
{
    if($display_delete == 'false') {
        $sql = "SELECT COUNT(*) FROM request WHERE Status != 'D'";
    } else {
        $sql = "SELECT COUNT(*) FROM request";
    }
    return $sql;
}