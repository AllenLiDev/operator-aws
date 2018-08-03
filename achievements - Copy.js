/* note: everything relies on cookies.js */
/* getters retrieve values from cookies */

/**
* getFastestTimeEasy()
* gets the user's fastest time in Time Attack on EASY
* @return time in seconds
*/
function getFastestTimeEasy() {
    var fastestTime = getCookie("fastestTimeEasy");
    if (fastestTime === "") {
        fastestTime = null;
    }
    return fastestTime;
}

/**
* getFastestTimeHard()
* gets the user's fastest time in Time Attack on HARD
* @return time in seconds
*/
function getFastestTimeHard() {
    var fastestTime = getCookie("fastestTimeHard");
    if (fastestTime === "") {
        fastestTime = null;
    }
    return fastestTime;
}

/**
* getHighScoreEasy()
* gets the user's high score in Marathon on EASY
* @return score
*/
function getHighScoreEasy() {
    var highScore = getCookie("highScoreEasy");
    if (highScore === "") {
        highScore = null;
    }
    return highScore;
}

/**
* getHighScoreHard()
* gets the user's high score in Marathon on HARD
* @return score
*/
function getHighScoreHard() {
    var highScore = getCookie("highScoreHard");
    if (highScore === "") {
        highScore = null;
    }
    return highScore;
}

/**
* getMarathonProblemsHard()
* gets the user's longest run in Marathon on HARD
* @return number of problems
*/
function getMarathonProblemsHard() {
    var marathonProblems = getCookie("marathonProblemsHard");
    if (marathonProblems === "") {
        marathonProblems = null;
    }
    return marathonProblems;
}

/**
* getMaxCombo()
* gets the user's longest combo in Marathon on EASY or HARD
* @return max combo
*/
function getMaxCombo() {
    var maxCombo = getCookie("maxCombo");
    if (maxCombo === "") {
        maxCombo = null;
    }
    return maxCombo;
}

/* checkers check to see if the user has unlocked a certain achievement*/

/**
* checkTime1Easy()
* checks to see if the user has unlocked the "Walker" achievement
* @return boolean
*/
function checkTime1Easy() {
    var threshold = 180;
    var fastestTimeEasy = getFastestTimeEasy();
    var fastestTimeHard = getFastestTimeHard();
    if (fastestTimeEasy != null
            && fastestTimeEasy < threshold) {
        return true;
    }
    if (fastestTimeHard != null
            && fastestTimeHard < threshold) {
        return true;
    }
    return false;
}

/**
* checkTime2Easy()
* checks to see if the user has unlocked the "Jogger" achievement
* @return boolean
*/
function checkTime2Easy() {
    var threshold = 120;
    var fastestTimeEasy = getFastestTimeEasy();
    var fastestTimeHard = getFastestTimeHard();
    if (fastestTimeEasy != null
            && fastestTimeEasy < threshold) {
        return true;
    }
    if (fastestTimeHard != null
            && fastestTimeHard < threshold) {
        return true;
    }
    return false;
}

/**
* checkTime3Easy()
* checks to see if the user has unlocked the "Sprinter" achievement
* @return boolean
*/
function checkTime3Easy() {
    var threshold = 60;
    var fastestTimeEasy = getFastestTimeEasy();
    var fastestTimeHard = getFastestTimeHard();
    if (fastestTimeEasy != null
            && fastestTimeEasy < threshold) {
        return true;
    }
    if (fastestTimeHard != null
            && fastestTimeHard < threshold) {
        return true;
    }
    return false;
}

/**
* checkTime1Hard()
* checks to see if the user has unlocked the "Speedaholic" achievement
* @return boolean
*/
function checkTime1Hard() {
    var threshold = 180;
    var fastestTimeHard = getFastestTimeHard();
    if (fastestTimeHard != null
            && fastestTimeHard < threshold) {
        return true;
    }
    return false;
}

/**
* checkTime2Hard()
* checks to see if the user has unlocked the "Speed Freak" achievement
* @return boolean
*/
function checkTime2Hard() {
    var threshold = 120;
    var fastestTimeHard = getFastestTimeHard();
    if (fastestTimeHard != null
            && fastestTimeHard < threshold) {
        return true;
    }
    return false;
}

/**
* checkTime3Hard()
* checks to see if the user has unlocked the "Speed Demon" achievement
* @return boolean
*/
function checkTime3Hard() {
    var threshold = 60;
    var fastestTimeHard = getFastestTimeHard();
    if (fastestTimeHard != null
            && fastestTimeHard < threshold) {
        return true;
    }
    return false;
}

/**
* checkMileHighClub()
* checks to see if the user has unlocked the "Mile High Club" achievement
* @return boolean
*/
function checkMileHighClub() {
    var highScoreEasy = getHighScoreEasy();
    var highScoreHard = getHighScoreHard();
    if (highScoreEasy >= 5280
            || highScoreHard >= 5280) {
        return true;
    }
    return false;
}

/**
* checkMillionaire()
* checks to see if the user has unlocked the "Millionaire" achievement
* @return boolean
*/
function checkMillionaire() {
    var highScoreHard = getHighScoreHard();
    if (highScoreHard >= 1000000) {
        return true;
    }
    return false;
}

/**
* checkJackBauer()
* checks to see if the user has unlocked the "Jack Bauer" achievement
* @return boolean
*/
function checkJackBauer() {
    var marathonProblemsHard = getMarathonProblemsHard();
    if (marathonProblemsHard >= 24) {
        return true;
    }
    return false;
}

/**
* checkSatan()
* checks to see if the user has unlocked the "Literally Satan" achievement
* @return boolean
*/
function checkSatan() {
    var satan = getCookie("satan");
    if (satan === "true") {
        return true;
    }
    return false;
}

/**
* checkLEET()
* checks to see if the user has unlocked the "LEET" achievement
* @return boolean
*/
function checkLEET() {
    var leet = getCookie("leet");
    if (leet === "true") {
        return true;
    }
    return false;
}

/**
* checkCombo1()
* checks to see if the user has unlocked the "Combo Novice" achievement
* @return boolean
*/
function checkCombo1() {
    var threshold = 10;
    var maxCombo = getMaxCombo();
    if (maxCombo >= threshold) {
        return true;
    }
    return false;
}

/**
* checkCombo2()
* checks to see if the user has unlocked the "Combo Adept" achievement
* @return boolean
*/
function checkCombo2() {
    var threshold = 25;
    var maxCombo = getMaxCombo();
    if (maxCombo >= threshold) {
        return true;
    }
    return false;
}

/**
* checkCombo3()
* checks to see if the user has unlocked the "Combo Expert" achievement
* @return boolean
*/
function checkCombo3() {
    var threshold = 50;
    var maxCombo = getMaxCombo();
    if (maxCombo >= threshold) {
        return true;
    }
    return false;
}

/**
* checkCombo4()
* checks to see if the user has unlocked the "Combo Master" achievement
* @return boolean
*/
function checkCombo4() {
    var threshold = 100;
    var maxCombo = getMaxCombo();
    if (maxCombo >= threshold) {
        return true;
    }
    return false;
}

/* setters */

/**
* setFastestTimeEasy(double seconds)
* sets the user's fastest time in Time Attack on EASY
*/
function setFastestTimeEasy(seconds) {
    setCookie("fastestTimeEasy", seconds, 30);
}

/**
* setFastestTimeHard(double seconds)
* sets the user's fastest time in Time Attack on HARD
*/
function setFastestTimeHard(seconds) {
    setCookie("fastestTimeHard", seconds, 30);
}

/**
* setHighScoreEasy(int score)
* sets the user's high score in Marathon on EASY
*/
function setHighScoreEasy(score) {
    setCookie("highScoreEasy", score, 30);
}

/**
* setHighScoreHard(int score)
* sets the user's high score in Marathon on HARD
*/
function setHighScoreHard(score) {
    setCookie("highScoreHard", score, 30);
}

/**
* setMarathonProblemsHard(int problems)
* sets the user's longest run in Marathon on HARD
*/
function setMarathonProblemsHard(problems) {
    setCookie("marathonProblemsHard", problems, 30)
}

/**
* setMaxCombo(int combo)
* sets the user's longest combo in Marathon on HARD
*/
function setMaxCombo(combo) {
    setCookie("maxCombo", combo, 30);
}

/* These set achievements to unlocked */

/**
* unlockSatan()
* unlocks the "Literally Satan" achievement
*/
function unlockSatan() {
    setCookie("satan", "true", 30);
}

/**
* unlockLEET()
* unlocks the "LEET" achievement
*/
function unlockLEET() {
    setCookie("leet", "true", 30);
}

/* These functions compares values with those already stored in the cookies */

/**
* validateSetFastestTimeEasy(double seconds)
* checks to see if a time is the new fastest time in Time Attack on EASY and sets it if it is
*/
function validateSetFastestTimeEasy(seconds) {
    var fastestTime = getFastestTimeEasy();
    if (fastestTime == null
            || seconds < fastestTime) {
        setCookie("fastestTimeEasy", seconds, 30);
    }
}

/**
* validateSetFastestTimeHard(double seconds)
* checks to see if a time is the new fastest time in Time Attack on HARD and sets it if it is
*/
function validateSetFastestTimeHard(seconds) {
    var fastestTime = getFastestTimeHard();
    if (fastestTime == null
            || seconds < fastestTime) {
        setCookie("fastestTimeHard", seconds, 30);
    }
}

/**
* validateSetHighScoreEasy(int score)
* checks to see if a score is the new high score in Marathon on EASY and sets it if it is
*/
function validateSetHighScoreEasy(score) {
    var highScore = getHighScoreEasy();
    if (highScore == null
            || score > highScore) {
        setCookie("highScoreEasy", score, 30);
    }
}

/**
* validateSetHighScoreHard(int score)
* checks to see if a score is the new high score in Marathon on HARD and sets it if it is
*/
function validateSetHighScoreHard(score) {
    var highScore = getHighScoreHard();
    if (highScore == null
            || score > highScore) {
        setCookie("highScoreHard", score, 30);
    }
}

/**
* validateSetMarathonProblemsHard(int problems)
* checks to see if a run is the new longest run in Marathon on HARD and sets it if it is
*/
function validateSetMarathonProblemsHard(problems) {
    var marathonProblems = getMarathonProblemsHard();
    if (marathonProblems == null
            || problems > marathonProblems) {
        setCookie("marathonProblems", problems, 30);
    }
}

/**
* validateSetMaxCombo(int combo)
* checks to see if a combo is the new longest combo in Marathon on EASY or HARD and sets it if it is
*/
function validateSetMaxCombo(combo) {
    var maxCombo = getMaxCombo();
    if (maxCombo == null
            || combo > maxCombo) {
        setCookie("maxCombo", combo, 30);
    }
}