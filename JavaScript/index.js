$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    displayAfterLoad();
    displayTotalBooks();
    setTimeout(() => navBlockColor(), 50);
});

function displayTotalBooks() {
    $.ajax({
        url:"../PHP/countBooks.php",
        method:"GET",
        success:function(result){
            document.getElementById("total_books").innerHTML=result;
        }
    });
}
function navBlockColor() {
    const nav = document.getElementById('nav_home');
    nav.className += 'active';
}