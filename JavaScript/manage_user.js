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
    $("#nav_manage_user").addClass("active");
}

function to_page() {
    $.ajax({
        url:"../PHP/allUser.php",
        method:"GET",
        data:{
            page: page,
            user_name: getCookie("username"),
            user_auth: getCookie(getCookie("username") + "Auth"),
            search: search
        },
        success:function(result){
            if(result.code === 200) {
                build_user_table(result);
                build_page_info(result);
                build_page_nav(result);
                extendMainContainerHeight();
            } else if(result.code === 401) {
                window.location.replace("index.html");
            }
        }
    });
}

function build_user_table(result) {
    if(result.count > 0) {
        $("#all_user_body").empty();
        const user = result.body;
        $.each(user, function(index, item){
            const username = $("<td></td>").append(item.username);
            const email = $("<td></td>").append(item.email);
            let authority_name = "";
            if(parseInt(item.authority) === 1) {
                authority_name = arrLang[lang]["USER"];
            } else if (parseInt(item.authority) === 2) {
                authority_name = arrLang[lang]["ADMIN"];
            } else if (parseInt(item.authority) === 3) {
                authority_name = arrLang[lang]["SUPER_ADMIN"];
            }
            const authority = $("<td></td>").append(authority_name);
            let banned;
            if(item.banned === "N") {
                banned = $("<td></td>");
            } else {
                banned = $("<td></td>").append("<i style='color: red' class='fa-solid fa-ban'></i>");
            }
            let manageBtn = $("<button></button>").addClass("btn btn-primary btn-sm manage-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-cog"));
            manageBtn.attr("manage-id", item.id);
            const btnTd = $("<td></td>").append(manageBtn);
            $("<tr></tr>").append(username).append(email).append(authority).append(banned).append(btnTd)
                .appendTo("#all_user_body");
        })
    } else {
        $("#all_user_body").html(
            "<td colspan='5' style='text-align: center; font-size: large; color: grey;'>" +
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
        page = 1;
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