let page = 1;
let search = "";

$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    to_page();
});

function navBlockColor() {
    $("#nav_manage").addClass("active");
    $("#nav_restore_delete").addClass("active");
}

function to_page() {
    $.ajax({
        url:"../PHP/allDeletedBooks.php",
        method:"GET",
        data:{
            page: page,
            user_name: getCookie("username"),
            user_auth: getCookie(getCookie("username") + "Auth"),
            lang: getLang() === "en" ? "en" : "zh",
            search: search
        },
        success:function(result){
            if(result.code === 200) {
                build_deleted_book_table(result);
                build_page_info(result);
                build_page_nav(result);
                extendMainContainerHeight();
            } else if(result.code === 401) {
                window.location.replace("index.html");
            }
        }
    });
}

function build_deleted_book_table(result) {
    if(result.count > 0) {
        $("#all_deleted_book_body").empty();
        const request = result.body;
        $.each(request, function(index, item){
            const title = $("<td></td>").append(item.title);
            const author = $("<td></td>").append(item.author);
            const publisher = $("<td></td>").append(item.publisher);
            const catName = $("<td></td>").append($("<a></a>")
                .attr("href", "by_category.php?id=" + item.catId)
                .append(item.catName));
            const admin = $("<td></td>").append(item.admin);
            let restoreBtn = $("<button></button>").addClass("btn btn-success btn-sm restore-btn")
                    .append($("<span></span>").addClass("glyphicon glyphicon-repeat"));
            restoreBtn.attr("restore-id", item.id);
            const btnTd = $("<td></td>").append(restoreBtn);
            $("<tr></tr>").append(title).append(author).append(publisher).append(catName).append(admin).append(btnTd)
                .appendTo("#all_deleted_book_body");
        })
    } else {
        $("#all_deleted_book_body").html(
            "<td colspan='6' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}

$(function() {
    $("#search_box").bind("input propertychange", function () {
        let search_value = $("#search_box").val();
        if(search_value !== "") {
            $("#clean_search_box").css("display", "block");
        } else {
            $("#clean_search_box").css("display", "none");
        }
        search = search_value;
        to_page();
    });
});

$(document).on("click", "#clean_search_box", function(){
    search = "";
    $("#search_box").val("");
    $("#clean_search_box").css("display", "none");
    to_page();
});

$(document).on("click", ".restore-btn", function(){
    $("#restore_delete_fail").css("display", "none");
    const deleted_id = $(this).attr("restore-id");
    $.ajax({
        url:"../PHP/getOneDeleteBook.php",
        method:"GET",
        data:{
            id: deleted_id
        },
        success:function(result){
            if(result.code === 200) {
                $("#confirm_restore_delete_info").html(result.title);
                $("#confirm_restore_delete").attr("restore-id", deleted_id);
            }
        }
    });
    $("#confirmRestoreDeleteModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#confirm_restore_delete", function(){
    const deleted_id = $(this).attr("restore-id");
    $.ajax({
        url:"../PHP/restoreDelete.php",
        method:"POST",
        data:{
            id: deleted_id,
            user_name: getCookie("username"),
            user_auth: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200) {
                document.cookie = "book_display_rows=" + 5;
                document.cookie = "current_page=" + 1;
                document.cookie = "search_value=";
                document.cookie = "book_display_sort_column=id";
                document.cookie = "book_display_sort_order=desc";
                window.location.replace("search.html");
            } else if(result.code === 201) {
                $("#restore_delete_error").html(arrLang[lang]["BOOK_ALREADY_EXIST"]);
                $("#restore_delete_fail").css("display", "block");
            } else if(result.code === 401) {
                $("#restore_delete_error").html(arrLang[lang]["NO_ACCESS_RESTORE_DELETE"]);
                $("#restore_delete_fail").css("display", "block");
            }
        }
    });
});