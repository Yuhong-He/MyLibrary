<!DOCTYPE html>
<html>
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
<?php
if($check==0)
{
	$code=$_GET['id'];
	require_once "db.php";
	$sql="UPDATE obtain SET Process='Y' WHERE Code='$code'";
	mysqli_query($db,$sql);
	mysqli_close($db);
}
?>
<script type="text/javascript">
alert("标记为已解决！");
var opened=window.open('about:blank','_self');
opened.close();
</script>
</html>