<!DOCTYPE html>
<html>
	<head>
		<title>管理系统</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/index.css">
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
		<style>
.find-content li
{
	padding:0 10px;
	font-size: 50px;
	font-family: STXingkai;
	list-style:none;
	margin-top:1.5%;
	margin-left:-45px;
}
.find-content li a:link {color:green;}
.find-content li a:visited {color:green;}
		</style>
	</head>
	<body>
		<script type="text/javascript" src="header.js"></script>
		<div class="article">
			<h1><nobr>管理系统</nobr></h1>
			<ul class='find-content' style='margin-top:5%;'>
				<li><a href='input.php'>录入新书</a></li>
				<li><a href='request.php'>文献互助</a></li>
			</ul>
		</div>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>