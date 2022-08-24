function setCookie(username, password, email, authority) {
    document.cookie="username=" + username;
    document.cookie=username + "=" + password;
    document.cookie=username + "Email=" + email;
    document.cookie=username + "Auth=" + authority;
}

function getCookie(cName)
{
    const name = cName + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++)
    {
        const c = ca[i].trim();
        if (c.indexOf(name)===0) return c.substring(name.length,c.length);
    }
    return "";
}

function destroyCookie(username) {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Email=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}