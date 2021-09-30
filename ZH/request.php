<!DOCTYPE html>
<html>
	<head>
		<title>文献互助管理</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/index.css">
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/table.css">
		<?php
		session_start();
		if (isset($_SESSION["admin"])&&$_SESSION["admin"]!=NULL)
		{
			$check=0;
		}
		else
		{
			$check=1;
		}
		?>
		<script type="text/javascript">
		var check = "<?php echo $check ?>";
		if(check==1)
		{
			alert("请核对暗号，瑞丽江畔...")
			var opened=window.open('about:blank','_self');
			window.location.replace("login.php");
		}  
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
			<h1><nobr>文献互助管理</nobr></h1>
			<div style="margin: 0px auto; text-align: center; padding-bottom:60px;">
<?php
require_once "../db.php";
$result=mysqli_query($db,"SELECT * FROM obtain WHERE Process='N' ORDER BY Code ASC");
echo '<table id="tablecolor" style="font-size:15px;">'."\n";
echo ("<tr><th>书籍信息</th><th>邮箱</th><th>身份</th><th>理由</th><th>时间</th><th></th></tr>");
while ($row=mysqli_fetch_row($result))
{
	$count[]=$row[0];
	echo("<tr><td>");
	echo($row[0]);
	echo("</td><td>");
	echo($row[1]);
	echo("</td><td>");
	echo($row[2]);
	echo("</td><td>");
	echo($row[3]);
	echo("</td><td>");
	echo($row[4]);
	echo("</td><td>");
	echo("<a href='done.php?id=$row[5]' target='_blank'>解决</a>");
	echo("</td></tr>\n");
}
echo ("<th colspan='6' style='text-align:center;'>");
echo "共有";
if(isset($count)){
	echo (sizeof($count));
}
else{
	echo("0");
}
echo "个请求未处理";
echo ("</th>");
echo "</table>\n";
mysqli_close($db);
?>
			</div>
		</div>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>