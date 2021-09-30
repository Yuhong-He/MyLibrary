<!DOCTYPE html>
<html>
<?php
session_start();
if(isset($_SESSION["admin"])&&$_SESSION["admin"]!=NULL)
{
	$un=$_SESSION["admin"];
}
else
{
	$un=NULL;
}
require_once "../db.php";
$username=mysqli_query($db,"SELECT UserName FROM user");
while($row=mysqli_fetch_row($username))
{
	$all_user_name[]=$row[0];
}
for($start=0;$start<sizeof($all_user_name);$start++)
{
	if($un==$all_user_name[$start])
	{
		unset($_SESSION['admin']);
		session_destroy();
		$check=0;
		break;
	}
	else
	{
		$check=1;
	}
}
?>
<script type="text/javascript">
var check = "<?php echo $check ?>";
if(check==0)
{
	alert("成功退出")
}
else if(check==1)
{
	alert("好的，再见")
}
var opened=window.open('about:blank','_self');
opened.close();
</script>
</html>