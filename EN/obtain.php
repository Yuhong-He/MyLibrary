<!DOCTYPE html>
<html>
	<head>
		<title>Mutual Aid</title>
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
		alert("Fill all the boxes please.");
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
			alert('Clike "fair use only" please.');
			return false;
		}
	}
}
		</script>
	</head>
	<body>
		<script type="text/javascript" src="header.js"></script>
		<div class="article">
			<h1><nobr>Mutual Aid</nobr></h1>
			<div id="wrapper">
				<div id="login">
					<div class="loginSystem">
						<form method="post" onsubmit="return AllSubmit()">
							<dl><dt>I need book:</dt><dd><input name="Book" class="field-value" type="text" id="txt1"/></dd></dl>
							<dl><dt>Send to Email:</dt><dd><input name="Email" class="field-value" type="text" id="txt2"/></dd></dl>
							<dl><dt>I am...</dt><dd>
							<label for="id1"><span style="margin-left:20px;">Wikipedian</span></label><input type="radio" id="id1" name="Identity" value="维基人">
							<label for="id2"><span style="margin-left:20px;">Scholar</span></label><input type="radio" id="id2" name="Identity" value="研究者">
							<label for="id3"><span style="margin-left:20px;">Enthusiast</span></label><input type="radio" id="id3" name="Identity" value="爱好者"></dd></dl>
							<dl style="height:300;"><dt>Reason...</dt><dd><textarea style="height:47px; width:537px; resize:none; margin-top:8px; padding:10px;" name="Reason" class="field-value" type="text" placeholder="I am a Wikipedian, the article I want to edit is...&#13;&#10;&#13;&#10;I am not a Wikipedian, my study object is..." id="txt3"></textarea></dd></dl>
							<dd style="line-height:25px; padding-bottom:15px; padding-left:50px; padding-right:50px;"><input type="checkbox" id="agreement" name="agreement" style="margin-left:50px; "><label for="agreement">I agree to use e-books only within the scope of "<span style="color:red;">fair use</span>" stipulated in Article 24 of the <a href="http://www.npc.gov.cn/npc/c30834/202011/848e73f58d4e4c5b82f69d25d46048c6.shtml" target="_blank" style="font-style:italic;">Copyright Law of the People's Republic of China</a>.</label></dd>
							<div class="btns"><input type="submit" value="Submit"/></div>
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
alert("You send the request of “"+book+"” successful. I will send the book to email “"+email+"” soon, please be patient. If you urgent need the book, you can send me an email.");
</script>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>