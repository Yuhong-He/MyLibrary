$('.dropdown-toggle').dropdown();

function login(){
    reset_form("#loginModel form");
    $("#loginModel").modal({
        backdrop:"static"
    });
}

$("#loginLogout_btn").click(function() {
    const username = getCookie("username");
    if(username===""){
        login();
    } else {
        logout();
    }
});

function logout() {
    $("#logoutModel").modal({
        backdrop:"static"
    });
}

$("#confirm_logout_btn").click(function(){
    const username = getCookie("username");
    $.ajax({
        url:"../Assets/common/php/logout.php",
        method:"POST",
        data:{
            username: username
        },
        success:function(){
            const username = getCookie("username");
            destroyCookie(username);
            location.reload();
        }
    });
});

$("#username_btn").click(function() {
    window.location.replace("profile.html");
});

$("#signup_btn").click(function() {
    reset_form("#registerModel form");
    $("#registerModel").modal({
        backdrop:"static"
    });
});