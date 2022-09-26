<?php

class PageHelper
{
    public static function getPage($sql, $rows, $page, $arr, mysqli $db, $extra): array
    {
        $result = mysqli_query($db, $sql);
        $total_records = 0;
        if($result != false) {
            while ($row = mysqli_fetch_row($result)) {
                $total_records = $row[0];
            }
        }

        $total_pages = ceil($total_records / $rows);
        $max_nav_pages = 5;
        $curr_page = intval($page);

        $nav = self::getNavArray($max_nav_pages, $curr_page, $total_pages);
        return array
        (
            'code' => 200,
            'count'=>$total_records,
            'pages'=>$total_pages,
            'currentPage'=>$curr_page,
            'navigatePageNums'=>$nav,
            'body'=>$arr,
            'extra'=>$extra
        );
    }

    public static function getNavArray($max_nav_pages, $curr_page, $total_pages): array
    {
        $nav_pages = min($total_pages, $max_nav_pages);
        $gap_num = floor($nav_pages / 2);
        $nav = [$nav_pages];
        if(($total_pages >= $max_nav_pages) && ($curr_page > $total_pages - $gap_num)) {
            for($i = 0; $i < $nav_pages; $i++) {
                $nav[$i] = $total_pages - $nav_pages + $i + 1;
            }
        } else if (($total_pages >= $max_nav_pages) && ($curr_page > $gap_num)) {
            for($i = 0; $i < $nav_pages; $i++) {
                $nav[$i] = $curr_page - $gap_num + $i;
            }
        } else {
            for($i = 0; $i < $nav_pages; $i++) {
                $nav[$i] = $i + 1;
            }
        }
        return $nav;
    }
}