function displayInfo(){
    const username = getCookie("username");
    if(username===""){
        window.location.replace("index.html");
        return false;
    }
    $("#username").text(username);
    const password = getCookie(username);
    let hiddenPassword = "";
    for(let i=0; i<password.length; i++){
        hiddenPassword = hiddenPassword + "*";
    }
    $("#password").text(hiddenPassword);
    const email = getCookie(username + "Email");
    $("#email").text(email);
}

function navBlockColor() {
    const nav = document.getElementById('nav_profile');
    nav.className += 'active';
}