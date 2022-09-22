let page = 1;

$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    to_page();
    displayAfterLoad();
});

function to_page() {
    $.ajax({
        url:"../PHP/myRequests.php",
        method:"GET",
        data:{
            page: page,
            user_name: getCookie("username"),
            user_id: getCookie(getCookie("username") + "Id")
        },
        success:function(result){
            if(result.code === 200) {
                build_my_requests_table(result);
                build_page_info(result);
                build_page_nav(result);
                extendMainContainerHeight();
            } else if(result.code === 401) {
                window.location.replace("index.html");
            }
        }
    });
}

function build_my_requests_table(result){
    if(result.count > 0) {
        $("#my_requests_table_body").empty();
        const request = result.body;
        $.each(request, function(index, item){
            const book = $("<td></td>").append(item.book);
            const time = $("<td></td>").append(item.time);
            let status_icon = "";
            if(item.status === "N") {
                status_icon = "<i style='color: red' title='" + arrLang[lang]["NOT_FINISH_YET"]
                                + "' class='fa-regular fa-circle-xmark'></i>";
            } else if(item.status === "Y") {
                status_icon = "<i style='color: green' title='" + arrLang[lang]["FINISH"]
                                + "' class='fa-regular fa-circle-check'></i>";
            }
            const status = $("<td></td>").append(status_icon);
            const admin = $("<td></td>").append(item.admin);
            let delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-trash"));
            delBtn.attr("del-id", item.id);
            const btnTd = $("<td></td>").append(delBtn);
            $("<tr></tr>").append(book).append(time).append(status).append(admin).append(btnTd)
                .appendTo("#my_requests_table_body");
        })
    } else {
        $("#my_requests_table_body").html(
            "<td colspan='5' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}