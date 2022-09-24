$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    displayTotalBooks();
});

function displayTotalBooks() {
    $.ajax({
        url:"../PHP/countBooks.php",
        method:"GET",
        success:function(result){
            $("#total_books").html(result);
        }
    });
}

function navBlockColor() {
    $("#nav_home").addClass("active");
}