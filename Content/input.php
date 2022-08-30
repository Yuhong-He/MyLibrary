<!DOCTYPE html>
<html>
	<head>
		<title>录入书籍信息</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Resources/CSS/index.css">
		<link rel="stylesheet" type="text/css" href="../Resources/CSS/input.css">
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
			<h1><nobr>录入书籍信息</nobr></h1>
			<div id="wrapper">
				<div id="login">
					<div class="loginSystem">
						<form method="post">
							<dl><dt>作者：</dt><dd><input name="Author" class="field-value" type="text"/></dd></dl>
							<dl><dt>书名：</dt><dd><input name="Title" class="field-value" type="text"/></dd></dl>
							<dl><dt>地点：</dt><dd><input name="Location" class="field-value" type="text"/></dd></dl>
							<dl><dt>出版社：</dt><dd><input name="Publisher" class="field-value" type="text"/></dd></dl>
							<dl><dt>年份：</dt><dd><input name="Year" class="field-value" type="text"/></dd></dl>
							<dl><dt>书号：</dt><dd><input name="Code" class="field-value" type="text"/></dd></dl>
							<dl><dt>分类：</dt><dd><input name="Category" class="field-value" type="text"/></dd></dl>
							<div class="btns"><input type="submit" value="录入"/></div>
						</form>
					</div>
				</div>
			</div>
		</div>
<?php
require_once "../db.php";
$result=mysqli_query($db,"SELECT Title,Code FROM books");
while($row=mysqli_fetch_row($result))
{
	$all_title[]=$row[0];
	$all_code[]=$row[1];
}
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
		for($start=0;$start<sizeof($all_title);$start++)
		{
			if($tt==$all_title[$start]){
				$temp_title=$start;
				break;}
			else{
				$temp_title=NULL;}
		}
		for($start=0;$start<sizeof($all_title);$start++){
			if($cd==$all_code[$start]){
				$temp_code=$start;
				break;}
			else{
				$temp_code=NULL;}
		}
		if($temp_title!=NULL){
			if($cd==NULL){
				if($all_code[$temp_title]!=NULL){
					$check=2;}
				else{
					$check=1;}
			}
			else{
				if($temp_code!=NULL){
					if($cd==$all_code[$temp_code]){
						$check=3;}
					else{
						$check=1;}
				}
				else{
					$check=2;}
			}
		}
		else
		{
			if($cd==NULL){
				$check=2;}
			else
			{
				if($temp_code!=NULL){
					$check=3;}
				else{
					$check=2;}
			}
		}
	}
	if($check==2)
	{
		$sql="INSERT INTO books (Author,Title,Location,Publisher,Year,Code,Category)
			VALUES ('$au','$tt','$lc','$ps','$yr','$cd','$cg')";
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
	alert("这本书很可能已经在数据库中，请检查")
}
else if(check==2)
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
	alert("成功录入书籍：\n"+display);
}
else if(check==3)
{
	alert("出现一号多书，请检查")
}
</script>
		<script type="text/javascript" src="../Resources/common/footer.js"></script>
	</body>
</html>