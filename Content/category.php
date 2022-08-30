<!DOCTYPE html>
<html>
	<head>
		<title>滇志阁·分类</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<script type="text/javascript">    
		function tablecolor(id)
		{
			if(document.getElementsByTagName)
			{ 
				var table = document.getElementById(id); 
				var rows = table.getElementsByTagName("tr");
				for(i=0;i<rows.length;i++)
				{         
					if(i%2==0)
					{
						rows[i].className="evenrowcolor";
					}
					else
					{
						rows[i].className="oddrowcolor";
					}     
				}
			}
		}		
        window.onload=function()
		{
            tablecolor('tablecolor');
        }
		</script>
	</head>
	<body>
		<script type="text/javascript" src="common.js"></script>
		<div class="article">
			<h1><nobr>分类</nobr></h1>
			<div style="width:50%; margin: 0px auto; text-align: center; padding-bottom:60px;">
<?php
require_once "../PHP/db.php";
$category=mysqli_query($db,"SELECT * FROM category ORDER BY CategoryID ASC");
echo '<table id="tablecolor" style="font-size:15px;">'."\n";
echo ("<tr><th>分类编号</th><th>分类名称</th><th>总计</th></tr>");
while ($row=mysqli_fetch_row($category))
{
	$result=mysqli_query($db,"SELECT * FROM books WHERE Category='$row[0]'");
	while ($rowbook=mysqli_fetch_row($result))
	{
		$count[]=$rowbook[1];
	}
	if(isset($count))
	{
		echo("<tr><td>");
		echo($row[0]);
		echo("</td><td><a href='by_category.php?id=$row[0]' target='_blank'>");
		echo($row[1]);
		echo("</a></td><td>");
		echo(sizeof($count));
		echo("</td></tr>\n");
	}
	unset($count);
}
echo "</table>\n";
mysqli_close($db);
?>
			</div>
		</div>
	</body>
</html>