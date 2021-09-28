<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<head>
		<title>引用页</title>
		<link rel="stylesheet" type="text/css" href="Assets/CSS/index.css">
	</head>
	<body>
		<script type="text/javascript" src="Assets/js/header.js"></script>
<?php
$hscode=$_GET['id'];
require_once "db.php";
$book_info=mysqli_query($db,"SELECT * FROM books WHERE hscode='$hscode'");
while ($row=mysqli_fetch_row($book_info))
{
	echo "<div class='article' style='padding-bottom:60px;'><h1>";
	echo ($row[1]);
	echo "</h1>";
	echo "<h3 style='margin-left:5%; text-align:left;'>维基百科cite book模板</h3>";
	echo "<textarea style='margin-left:-10%; width:80%; height:32px; padding:10px 10px; border: 2px solid #ccc; border-radius: 4px; background-color: #f8f8f8;' id='citebook' readonly>";
	echo "<ref>{{cite book";
	if($row[0]!=NULL)
	{
		if(strpos($row[0],'; ') !== false)//author参数包含多个作者
		{
			echo " |author1=";
		}
		else//author参数只有一个作者
		{
			echo " |author=";
		}
	}
	$new_author=preg_replace("/; /"," |author2=",$row[0],1);
	$new_author=preg_replace("/; /"," |author3=",$new_author,1);
	$new_author=preg_replace("/; /"," |author4=",$new_author,1);
	$new_author=preg_replace("/; /"," |author5=",$new_author,1);
	$new_author=preg_replace("/; /"," |author6=",$new_author,1);
	$new_author=preg_replace("/; /"," |author7=",$new_author,1);
	$new_author=preg_replace("/; /"," |author8=",$new_author,1);
	echo($new_author);
	echo " |title=";
	echo($row[1]);
	if($row[2]!=NULL){
		echo " |location=";}
	echo($row[2]);
	if($row[3]!=NULL){
		echo " |publisher=";}
	echo ($row[3]);
	if($row[4]!=NULL){
		echo " |year=";}
	$new_year=str_split($row[4]);
	if(sizeof($new_year)>4)	{
		echo($new_year[11]);
		echo($new_year[12]);
		echo($new_year[13]);
		echo($new_year[14]);
		echo " |orig-year=";
		echo($new_year[0]);
		echo($new_year[1]);
		echo($new_year[2]);
		echo($new_year[3]);
	}
	else{
		echo($row[4]);}
	if($row[5]!=NULL)
	{
		$new_code=str_replace("-",'',$row[5]);
		$new_code=str_replace("·",'',$new_code);//砍去isbn或csbn中的连接符
		$check_csbn=str_split($new_code);
		if(sizeof($check_csbn)>9){
			echo " |isbn=";}
		else{
			echo " |csbn=";}
	}
	echo($row[5]);
	if($row[5]!=NULL)
	{
		if(sizeof($check_csbn)>9)
		{
			$arr_isbn=$check_csbn;
			if(sizeof($arr_isbn)==10)
			{
				$check_digit=(1*$arr_isbn[0]+2*$arr_isbn[1]+3*$arr_isbn[2]+4*$arr_isbn[3]+5*$arr_isbn[4]+6*$arr_isbn[5]
					+7*$arr_isbn[6]+8*$arr_isbn[7]+9*$arr_isbn[8])%11;
				if($check_digit==10)
				{
					$check_digit='X';
				}
				if($check_digit!=$arr_isbn[9])
				{
					echo(" |ignore-isbn-error=true");
				}
			}
			else if(sizeof($arr_isbn)==13)
			{
				$check_digit=(1*$arr_isbn[0]+3*$arr_isbn[1]+1*$arr_isbn[2]+3*$arr_isbn[3]+1*$arr_isbn[4]+3*$arr_isbn[5]
					+1*$arr_isbn[6]+3*$arr_isbn[7]+1*$arr_isbn[8]+3*$arr_isbn[9]+1*$arr_isbn[10]+3*$arr_isbn[11])%10;
				if($check_digit!=0)//余数为0，校验码为0
				{
					$check_digit=10-$check_digit;
				}
				if($check_digit!=$arr_isbn[12])
				{
					echo(" |ignore-isbn-error=true");
				}
			}
		}
	}
	echo " }}</ref>{{rp|}}";
	echo "</textarea>";
	echo "<button style='height:35px; width:50px; margin-left:20px; margin-top:11px; position: absolute;' onclick='citebook()'>复制</button>";
}
$book_info=mysqli_query($db,"SELECT * FROM books WHERE hscode='$hscode'");
while ($row=mysqli_fetch_row($book_info))
{
	echo "<h3 style='margin-left:5%; text-align:left;'>参考文献著录规则（GB/T 7714－2015）</h3>";
	echo "<textarea style='margin-left:-10%; width:80%; height:16px; padding:10px 10px; border: 2px solid #ccc; border-radius: 4px; background-color: #f8f8f8;' id='chinacite' readonly>";
	echo($row[0]);
	if($row[0]!=NULL){
		echo "．";}
	echo($row[1]);
	echo "［M］．";
	echo($row[2]);
	if($row[2]!=NULL){
		echo "：";}
	echo($row[3]);
	if($row[3]!=NULL){
		echo "，";}
	echo($row[4]);
	if($row[4]!=NULL){
		echo "．";}
	echo "</textarea>";
	echo "<button style='height:35px; width:50px; margin-left:20px; margin-top:3px; position: absolute;' onclick='chinacite()'>复制</button>";
}
$book_info=mysqli_query($db,"SELECT * FROM books WHERE hscode='$hscode'");
while ($row=mysqli_fetch_row($book_info))
{
	echo "<h3 style='margin-left:5%; text-align:left;'>温哥华参考文献格式</h3>";
	echo "<textarea style='margin-left:-10%; width:80%; height:16px; padding:10px 10px; border: 2px solid #ccc; border-radius: 4px; background-color: #f8f8f8;' id='vancouver' readonly>";
	echo($row[0]);
	if($row[0]!=NULL){
		echo ". ";}
	echo($row[1]);
	echo ". ";
	echo($row[2]);
	if($row[2]!=NULL){
		echo ": ";}
	echo($row[3]);
	if($row[3]!=NULL){
		echo "; ";}
	echo($row[4]);
	if($row[4]!=NULL){
		echo ".";}
	echo "</textarea>";
	echo "<button style='height:35px; width:50px; margin-left:20px; margin-top:3px; position: absolute;' onclick='vancouver()'>复制</button>";
}
mysqli_close($db);
?>
		</div>
<script type="text/javascript">
function citebook()
{
    var input = document.getElementById("citebook");
    input.select();
    document.execCommand("copy");
    alert("复制成功");
	window.top.close();
}
function chinacite()
{
    var input = document.getElementById("chinacite");
    input.select();
    document.execCommand("copy");
    alert("复制成功");
	window.top.close();
}
function vancouver()
{
    var input = document.getElementById("vancouver");
    input.select();
    document.execCommand("copy");
    alert("复制成功");
	window.top.close();
}
</script>
	<script type="text/javascript" src="Assets/js/footer.js"></script>
	</body>
</html>