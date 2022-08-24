<!DOCTYPE html>
<html>
	<head>
		<title>更新书籍信息</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/index.css">
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/input.css">
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
		</script>
	</head>
	<body>
		<script type="text/javascript" src="common.js"></script>
		<div class="article" style="padding-bottom:80px;">
			<h1><nobr>更新书籍信息</nobr></h1>
			<div id="wrapper">
				<div id="login">
					<div class="loginSystem">
						<form method="post" onsubmit="return AllSubmit()">
<?php
$hscode=$_GET['id'];
require_once "../db.php";
$book_info=mysqli_query($db,"SELECT * FROM books WHERE hscode='$hscode'");
while ($row=mysqli_fetch_row($book_info))
{
	echo('<dl><dt>作者：</dt><dd><input name="Author" class="field-value" type="text" value="');
	echo($row[0]);
	echo('"/></dd></dl>');
	echo('<dl><dt>书名：</dt><dd><input name="Title" class="field-value" type="text" value="');
	echo($row[1]);
	echo('"/></dd></dl>');
	echo('<dl><dt>地点：</dt><dd><input name="Location" class="field-value" type="text" value="');
	echo($row[2]);
	echo('"/></dd></dl>');
	echo('<dl><dt>出版社：</dt><dd><input name="Publisher" class="field-value" type="text" value="');
	echo($row[3]);
	echo('"/></dd></dl>');
	echo('<dl><dt>年份：</dt><dd><input name="Year" class="field-value" type="text" value="');
	echo($row[4]);
	echo('"/></dd></dl>');
	echo('<dl><dt>书号：</dt><dd><input name="Code" class="field-value" type="text" value="');
	echo($row[5]);
	echo('"/></dd></dl>');
	echo('<dl><dt>分类：</dt><dd><input name="Category" class="field-value" type="text" value="');
	echo($row[6]);
	echo('"/></dd></dl>');
}
?>
							<div class="btns"><input type="submit" value="更新"/></div>
						</form>
					</div>
				</div>
			</div>
		</div>
<?php
require_once "../db.php";
if(	isset($_POST['Author']) && isset($_POST['Title']) && isset($_POST['Location']) && 
	isset($_POST['Publisher']) && isset($_POST['Year']) && isset($_POST['Code']) && isset($_POST['Category']) )
{
	$au=$_POST['Author'];
	$tt=$_POST['Title'];
	$lc=$_POST['Location'];
	$ps=$_POST['Publisher'];
	$yr=$_POST['Year'];
	$cd=$_POST['Code'];
	$cg=$_POST['Category'];
	if($tt==NULL||$cg==NULL)
	{
		$check=0;
	}
	else
	{
		$check=1;
	}
	if($check==1)
	{
		$sql="UPDATE books SET Author='$au',Title='$tt',Location='$lc',Publisher='$ps',Year='$yr',Code='$cd',Category='$cg' WHERE hscode='$hscode'";
		mysqli_query($db,$sql);
	}
}
mysqli_close($db);
?>
<script type="text/javascript">
var check = "<?php echo $check ?>";
if(check==0)
{
	alert("书名和分类必须输入")
}
else if(check==1)
{
	var au = "<?php echo $au ?>"+". ";
	var tt = "<?php echo $tt ?>"+". ";
	var lc = "<?php echo $lc ?>"+": ";
	var ps = "<?php echo $ps ?>"+". ";
	var yr = "<?php echo $yr ?>"+". ";
	var cd = "<?php echo $cd ?>";
	if(cd.length<13)
	{
		cd="CSBN"+" "+cd+".";
	}
	else
	{
		cd="ISBN"+" "+cd+".";
	}
	var display = au+tt+lc+ps+yr+cd;
	alert("更新成功：\n"+display);
	window.top.close();
}
</script>
		<script type="text/javascript" src="../Assets/common/footer.js"></script>
	</body>
</html>