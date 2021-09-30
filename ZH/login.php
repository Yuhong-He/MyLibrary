<!DOCTYPE html>
<html>
	<head>
		<title>核对暗号</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/index.css">
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/login.css">
		<script type="text/javascript">
function AllSubmit()
{
	var T=true;
	for(var i=1;i<=2;i++)
	{
		if(eval("txt"+i).value=="")
		{
			T=false;
			break;
		}
	}
	if(!T)
	{
		alert("核对暗号！");
	}
	return T;
}
		</script>
	</head>
	<body>
		<script type="text/javascript" src="header.js"></script>
		<div class="article">
			<h1><nobr>核对暗号</nobr></h1>
			<div class="noticeinfo">核对成功后可进行下一步操作</div>
			<div id="wrapper">
				<div id="login_content">
					<div id="login">
						<div class="loginSystem">
							<form method="post" onsubmit="return AllSubmit()">
								<dl><dt>瑞丽江畔：</dt><dd><input name="UserName" class="field-value" type="text" id="txt1"/></dd></dl>
								<dl><dt>高黎贡山：</dt><dd><input name="Password" class="field-value" type="password" id="txt2"/></dd></dl>
								<div class="urls"><a href="log_out.php" target="_blank">取消核对</a></div>
								<div class="btns"><input type="submit" value="检查"/></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
		require_once "../db.php";
		$username=mysqli_query($db,"SELECT UserName FROM user");
		while($row=mysqli_fetch_row($username))
		{
			$all_user_name[]=$row[0];
		}
		$password=mysqli_query($db,"SELECT Password FROM user");
		while($row=mysqli_fetch_row($password))
		{
			$all_password[]=$row[0];
		}
		if(isset($_POST['UserName'])&&isset($_POST['Password']))
		{
			$un=$_POST['UserName'];
			$pw=$_POST['Password'];
			for($start=0;$start<sizeof($all_user_name);$start++)
			{
				if($un==$all_user_name[$start])
				{
					if($pw==$all_password[$start])
					{
						session_start();
						$_SESSION["admin"]=$un;
						$check=1;
						break;
					}
					else
					{
						$check=2;
						break;
					}
				}
				else
				{
					$check=3;
				}
			}
		}
		mysqli_close($db);
		?>
		<script type="text/javascript">
		var check = "<?php echo $check ?>";
		var user = "<?php echo $un ?>";
		if(check==1)
		{
			alert("核对成功！"+ user);
			window.location.replace("manage.php");
		}
		else if(check==2)
		{
			alert("你一定是对面的卧底！");
		}
		else if(check==3)
		{
			alert("你一定是对面派来的的卧底！");
		}
		</script>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>