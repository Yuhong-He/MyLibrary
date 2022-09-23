let page = 1;
let display_delete = false;

$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    to_page();
    displayAfterLoad();
});

function navBlockColor() {
    $("#nav_manage").addClass("active");
    $("#nav_manage_request").addClass("active");
}

$(document).on("click", "#display_deleted_requests", function(){
    display_delete = display_delete === false;
    page = 1;
    to_page();
});

function to_page() {
    $.ajax({
        url:"../PHP/allRequests.php",
        method:"GET",
        data:{
            page: page,
            user_name: getCookie("username"),
            user_auth: getCookie(getCookie("username") + "Auth"),
            user_id: getCookie(getCookie("username") + "Id"),
            display_delete: display_delete
        },
        success:function(result){
            if(result.code === 200) {
                build_all_requests_table(result);
                build_page_info(result);
                build_page_nav(result);
                extendMainContainerHeight();
            } else if(result.code === 401) {
                window.location.replace("index.html");
            }
        }
    });
}

function build_all_requests_table(result) {
    if(result.count > 0) {
        $("#all_requests_table_body").empty();
        const request = result.body;
        $.each(request, function(index, item){
            const book = $("<td></td>").append(item.book);
            const user = $("<td></td>").append(item.user);
            const email = $("<td></td>").append(item.email);
            const time = $("<td></td>").append(item.time);
            let status_icon = "";
            if(item.status === "N") {
                status_icon = "<i style='color: red' title='" + arrLang[lang]["NOT_FINISH_YET"]
                    + "' class='fa-regular fa-circle-xmark'></i>";
            } else if(item.status === "Y") {
                status_icon = "<i style='color: green' title='" + arrLang[lang]["FINISH"]
                    + "' class='fa-regular fa-circle-check'></i>";
            } else if(item.status === "D") {
                status_icon = "<i style='color: grey' title='" + arrLang[lang]["DELETED"]
                    + "' class='fa-solid fa-trash-can'></i>";
            }
            const status = $("<td></td>").append(status_icon);
            const admin = $("<td></td>").append(item.admin);
            let doneBtn = "";
            if(item.status === "N") {
                doneBtn = $("<button></button>").addClass("btn btn-primary btn-sm done-btn")
                    .append($("<span></span>").addClass("glyphicon glyphicon-ok"));
                doneBtn.attr("done-id", item.id);
            }
            let delBtn = "";
            if(item.status !== "D") {
                delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del-btn pull-right")
                    .append($("<span></span>").addClass("glyphicon glyphicon-trash"));
                delBtn.attr("del-id", item.id);
            }
            const btnTd = $("<td></td>").append(doneBtn).append(" ").append(delBtn);
            $("<tr></tr>").append(book).append(user).append(email).append(time).append(status).append(admin).append(btnTd)
                .appendTo("#all_requests_table_body");
        })
    } else {
        $("#all_requests_table_body").html(
            "<td colspan='7' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}