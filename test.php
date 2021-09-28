<?php
    $dir = 'C:\xampp\htdocs\MyLibrary';
    if(is_dir($dir)){
        $info = opendir($dir);
        while (($file = readdir($info)) !== false) {
			echo '<a href="';
			echo $file;
			echo '">';
            echo $file.'<br>';
			echo '</a>';
        }
        closedir($info);
    }
?>