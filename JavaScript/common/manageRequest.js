$(document).on("click", ".del-btn", function(){
    $("#del_request_fail").css("display", "none");
    const req_id = $(this).attr("del-id");
    $.ajax({
        url:"../PHP/getOneRequest.php",
        method:"GET",
        data:{
            id: req_id
        },
        success:function(result){
            if(result.code === 200) {
                $("#confirm_delete_request_info").html(result.book);
                $("#confirm_delete_request").attr("req-id", req_id);
            }
        }
    });
    $("#delRequestModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#close_del_request_fail", function(){
    $("#del_request_fail").css("display", "none");
});