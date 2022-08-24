function checkLoginAndDisplayUsername() {
    setTimeout(() => displayUsername(), 50);
}
function displayUsername() {
    const username = getCookie("username");
    if(username===""){
        const usernameReplaceLogin = document.getElementById('login_btn');
        usernameReplaceLogin.innerHTML="登录";
    } else {
        const usernameReplaceLogin = document.getElementById('login_btn');
        usernameReplaceLogin.innerHTML=username;
    }
}