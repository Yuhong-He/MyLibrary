<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<head>
		<title>Search</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/index.css">
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/table.css">
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
		<script type="text/javascript" src="header.js"></script>
		<div class="article">
			<h1><nobr>Search</nobr></h1>
			<div style="margin: 0px auto; padding-bottom:60px; text-align: center;">
				<form method="post">
					<p>
					<input name="Title" style="height: 30px; width: 224px;" type="text" placeholder="Seach title please"/>
					<input type="submit" style="height: 35px; width: 70px;" value="Submit"/>
					</p>
				</form>
<?php
require_once "../db.php";
if(isset($_POST['Title']))
{
	$title_get=$_POST['Title'];
	$result=mysqli_query($db,"SELECT * FROM books WHERE title LIKE '%$title_get%' ORDER BY year asc, title asc");
	echo '<table id="tablecolor" style="font-size:11px;">'."\n";
	echo ("<th colspan='7' style='text-align:center;'>");
	if(empty($title_get)==TRUE)
	{
		echo "Let's search something.";
	}
	else
	{
		echo "Title contains - ";
		echo ($title_get);
	}
	echo ("</th>");
	echo("<tr><td>Author</td><td>Title</td><td>Publisher</td><td>Year</td><td>ISBN / CSBN</td><td>Category</td><td></td></tr>");
	if($title_get!=NULL)
	{
		while ($row=mysqli_fetch_row($result))
		{
			$count[]=$row[1];
			echo("<tr><td>");
			echo($row[0]);
			echo("</td><td>");
			echo($row[1]);
			echo("</td><td>");
			echo($row[3]);
			echo("</td><td>");
			echo($row[4]);
			echo("</td><td>");
			echo($row[5]);
			echo("</td><td>");
			echo("<div style='white-space:nowrap;'><a href='by_category.php?id=$row[6]' style='cursor:help;' title='");
			$catename=mysqli_query($db,"SELECT CategoryName FROM category JOIN books ON category.CategoryID = $row[6]");
			while ($rowcate=mysqli_fetch_row($catename))
			{
				echo($rowcate[0]);
				break;
			}
			echo("' target='_blank'>");
			echo($row[6]);
			echo("</a></div>");
			echo("</td><td>");
			echo("<div style='white-space:nowrap;'><a href='reference.php?id=$row[7]' target='_blank'><button>Cite</button></a></div>");
			echo("</td></tr>\n");
		}
	}
	echo ("<th colspan='7' style='text-align:center;'>");
	if(empty($count)==TRUE)
	{
		echo "Nothing found.";
	}
	else
	{
		echo "There are ";
		echo (sizeof($count));
		echo " books found.";
	}
	echo ("</th>");
	echo "</table>\n";
}
mysqli_close($db);
?>
			</div>
		</div>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>