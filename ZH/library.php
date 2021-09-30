<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<head>
		<title>滇志阁</title>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="../Assets/CSS/index.css">
		<style>
.find-content li
{
	padding:0 10px;
	font-size: 50px;
	font-family: STXingkai;
	list-style:none;
	margin-top:1.5%;
	display:inline;
	margin:20px;
}
.find-content li a:link {color:green;}
.find-content li a:visited {color:green;}
		</style>
		<script type="text/javascript">
			function secret()
			{
				alert("你找到了我的祖传秘籍！");
				window.location.replace("secret.php");
			}
		</script>
	</head>
<?php
require_once "../db.php";
$result=mysqli_query($db,"SELECT * FROM books");
while ($row=mysqli_fetch_row($result))
{
	$count[]=$row[1];
}
$total=sizeof($count);
mysqli_close($db);
?>
	<body>
		<script type="text/javascript" src="header.js"></script>
		<div class="article" style="padding-bottom:60px;">
			<h1><nobr>滇志阁</nobr></h1>
			<img src="../Assets/image/Dali Prefectural Museum.jpg" title="大理白族自治州博物馆" style="width:40%; border-radius:30px; float:right; margin-top:20px; margin-left:20px; margin-bottom:10px;" onclick='secret()'/>
			<p style="text-align:left;text-indent:2em;">滇志阁录入了我拥有的有关云南的电子书信息，目前共有<span style="text-decoration:underline; text-decoration-color:red;"><?php echo $total; ?></span>本书。滇志阁最早放在我的维基百科用户页子页面中，随着书籍增多已不便使用，遂转到自己的网站里。</p>
			<p style="text-align:left;text-indent:2em;">学者著书不易，我不会在网站直接放置下载链接。但知识无价，学术自由，合理的文献互助请求我会支持。如果你编写维基百科，或者学习、研究云南地方文化历史而需要我所收集的资料，请通过本站的“互助”提交请求，也可以向我的邮箱发送邮件。我不收取任何费用，希望云南这片土地能被更多人了解。</p>
			<ul class='find-content' style='margin-top:4%;'>
				<li><a href='search.php'>精确搜索</a></li>
				<li><a href='category.php'>分类查找</a></li>
			</ul>
		</div>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>