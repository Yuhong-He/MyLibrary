<!DOCTYPE html>
<html>
	<head>
		<title>文献互助</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/index.css">
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/obtain.css">
		<script type="text/javascript">
function AllSubmit()
{
	var T=true;
	var Id=false;
	var identity = document.getElementsByName('Identity');
	for (var i = 0; i < identity.length; i++) {
		if (identity[i].checked) {
			Id = true;
			break;
		}
	}
	for(var i=1;i<=3;i++)
	{
		if(eval("txt"+i).value=="")
		{
			T=false;
			break;
		}
	}
	if(!T||!Id)
	{
		alert("请填写所有表格");
		return false;
	}
	else
	{
		if(document.getElementById("agreement").checked)
		{
			return true;
		}
		else
		{
			alert("请勾选同意“仅合理使用”");
			return false;
		}
	}
}
		</script>
	</head>
	<body>
		<script type="text/javascript" src="header.js"></script>
		<div class="article">
			<h1><nobr>文献互助</nobr></h1>
			<div id="wrapper">
				<div id="login">
					<div class="loginSystem">
						<form method="post" onsubmit="return AllSubmit()">
							<dl><dt>需要的书籍：</dt><dd><input name="Book" class="field-value" type="text" id="txt1"/></dd></dl>
							<dl><dt>发送到邮箱：</dt><dd><input name="Email" class="field-value" type="text" id="txt2"/></dd></dl>
							<dl><dt>我是...</dt><dd>
							<label for="id1"><span style="margin-left:20px;">维基人</span></label><input type="radio" id="id1" name="Identity" value="维基人">
							<label for="id2"><span style="margin-left:20px;">研究者</span></label><input type="radio" id="id2" name="Identity" value="研究者">
							<label for="id3"><span style="margin-left:20px;">爱好者</span></label><input type="radio" id="id3" name="Identity" value="爱好者"></dd></dl>
							<dl style="height:300;"><dt>理由是...</dt><dd><textarea style="height:47px; width:537px; resize:none; margin-top:8px; padding:10px;" name="Reason" class="field-value" type="text" placeholder="我是维基人，我要编写的条目是……&#13;&#10;&#13;&#10;我不是维基人，我学习/研究的对象是……          默认发百度网盘，如不接受请说明。" id="txt3"></textarea></dd></dl>
							<dd><input type="checkbox" id="agreement" name="agreement" style="margin-left:50px;"><label for="agreement">我同意只在《<a href="http://www.npc.gov.cn/npc/c30834/202011/848e73f58d4e4c5b82f69d25d46048c6.shtml" target="_blank">中华人民共和国著作权法</a>》第二十四条所规定的“<span style="color:red;">合理使用</span>”范围内使用电子书。</label></dd>
							<div class="btns"><input type="submit" value="提交"/></div>
						</form>
					</div>
				</div>
			</div>
		</div>
<?php
require_once "../db.php";
if(	isset($_POST['Book']) && isset($_POST['Email']) && isset($_POST['Identity']) && isset($_POST['Reason']) )
{
	$bk=$_POST['Book'];
	$em=$_POST['Email'];
	$id=$_POST['Identity'];
	$rs=$_POST['Reason'];
	$tm=date('Y-m-d H:i:s');
	$ps='N';
	$sql="INSERT INTO obtain (Book,Email,Identity,Reason,Time,Process)VALUES ('$bk','$em','$id','$rs','$tm','$ps')";
	mysqli_query($db,$sql);
}
mysqli_close($db);
?>
<script type="text/javascript">
var book = "<?php echo $bk ?>";
var email = "<?php echo $em ?>";
alert("您已成功提交“"+book+"”的互助申请。我会尽快将书籍发送到邮箱“"+email+"”，请耐心等待。如您急需该书，可以直接向我发邮件。");
</script>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>