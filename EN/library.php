<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<head>
		<title>Library</title>
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
		<div class="article">
			<h1><nobr>Yunnan Gazetteer Library</nobr></h1>
			<img src="../Assets/image/Dali Prefectural Museum.jpg" title="Dali Prefectural Museum" style="width:40%; border-radius:30px; float:right; margin-top:20px; margin-left:20px; margin-bottom:10px;"/>
			<p style="text-align:left;text-indent:2em;">Yunnan Gazetteer Library recorded the catalogue of my e-books about Yunnan. For now, there are <span style="text-decoration:underline; text-decoration-color:red;"><?php echo $total; ?></span> books that exist.</p>
			<p style="text-align:left;text-indent:2em;">It is not easy for scholars to publish their research results. So I would not put the download link on the website. But for the free knowledge and academic freedom purpose, I'd like to help with the reasonable e-book obtain request.  If you need the e-books I have when you edit Wikipedia or study the local history & culture of Yunnan, please leave your requirements on my <a href="https://zh.wikipedia.org/wiki/User_talk:瑞丽江的河水">Wikipedia user talk page</a>, and also you can send requirements through the "Obtain" page of this website. I don't charge any fees. I hope Yunnan, the marvellous place, could be known by more people.</p>
			<ul class='find-content' style='margin-top:3%;'>
				<li><a href='search.php'>Search</a></li>
				<li><a href='category.php'>Category</a></li>
			</ul>
		</div>
		<script type="text/javascript" src="../Assets/js/footer.js"></script>
	</body>
</html>