function checkLoginAndDisplayUsername() {
    setTimeout(() => displayUsername(), 50);
}
function displayUsername() {
    const username = getCookie("username");
    if(username===""||username===null){
        const usernameReplaceLogin = document.getElementById('username_btn');
        usernameReplaceLogin.innerHTML = "";
        const usernameBlock = document.getElementById('username_block');
        usernameBlock.style.display = "none";
        const loginLogout = document.getElementById('loginLogout_btn');
        loginLogout.innerHTML = "登录";
    } else {
        const usernameReplaceLogin = document.getElementById('username_btn');
        usernameReplaceLogin.innerHTML = username;
        const usernameBlock = document.getElementById('username_block');
        usernameBlock.style.display = "block";
        const loginLogout = document.getElementById('loginLogout_btn');
        loginLogout.innerHTML = "登出";
    }
}