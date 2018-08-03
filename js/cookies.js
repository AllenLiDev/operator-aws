/*
Code taken from http://www.w3schools.com/js/js_cookies.asp
*/
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
/*
Code taken from http://www.w3schools.com/js/js_cookies.asp
*/
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkSoundCookie() {
    var sound = getCookie("sound");
    if (sound == "") {
        return false;
    }
    return true;
}

/**
* refreshCookie(String name)
* checks to see if a cookie has a value, and if it does sets the expire time to 30 days
*/
function refreshCookie(name) {
    if (getCookie(name) != "") {
        setCookie(name, getCookie(name), 30);
    }
}

/**
* refreshAllCookies()
* refreshes all the cookies
*/
function refreshAllCookies() {
    refreshCookie("time1Easy");
    refreshCookie("time2Easy");
    refreshCookie("time3Easy");
    refreshCookie("time1Hard");
    refreshCookie("time2Hard");
    refreshCookie("time3Hard");
    refreshCookie("mileHighClub");
    refreshCookie("millionaire");
    refreshCookie("jackBauer");
    refreshCookie("satan");
    refreshCookie("leet");
    refreshCookie("combo1");
    refreshCookie("combo2");
    refreshCookie("combo3");
    refreshCookie("combo4");
    refreshCookie("sound");
    refreshCookie("difficulty");
}