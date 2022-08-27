function displayTotalBooks() {
    $.ajax({
        url:"../Assets/common/php/countBooks.php",
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