//******************************************************************/
/*                         SERVER API                             */
//****************************************************************/

/*
getProblem(int difficulty, int level).
Server script for pulling problems sets
@param difficulty integer from 1 to 5.
@param level 1 = hard, 0 = easy, 2 = tutorial
hard 1-13, easy/tutorial 1-9
@return array containing the card numbers
*/
function getProblem(difficulty, level) {
    var cards = [];
    var hard;
    switch (level) {
        case 0:
            hard = 0;
            break;
        case 1:
            hard = 1;
            break;
        case 2:
            hard = 0;
            break;
    }
    $.ajax({
        async: true,
        type: "GET",
        url: "getProblem.php",
        dataType: "json",
        data: {difficulty: difficulty, hard: hard},
        success: function(data) {
        	callback(data);
        }
    });
}

/*On AJAX success, calls this function
to feed the data into the card data*/
function callback(data) {
	gameArea.problem[1] = data.card1;
	gameArea.problem[2] = data.card2;
	gameArea.problem[3] = data.card3;
	gameArea.problem[4] = data.card4;
}

/*Validates the problem set and operators in BEDMAS order*/
function validate(c1, c2, c3, c4, op1, op2, op3) {
    var string = c1 + op1 + c2 + op2 + c3 + op3 + c4;
    if (eval(string) == 24) {
        return true;
    }
    return false;
}

/*
timeAttackDifficulty(int problemNum, int level)
@param problemNum problem number
@param level 1 = hard, 0 = easy, 2 = tutorial
@return difficulty for problem number
*/
function timeAttackDifficulty(problemNum, level) {
    var difficulty = 1;
    var twoPoint;
    var threePoint;
    var fourPoint;
    var fivePoint;
    switch (level) {
        case 0: 
            twoPoint = 2;
            threePoint = 5;
            fourPoint = 9;
            fivePoint = 9999;
            break;
        case 1:
            twoPoint = 1;
            threePoint = 3;
            fourPoint = 5;
            fivePoint = 8;
            break;
        case 2:
            twoPoint = 3;
            threePoint = 5;
            fourPoint = 9999;
            fivePoint = 9999;
            break;
    }
    if (problemNum >= fivePoint) {
        difficulty = 5;
    } else if (problemNum >= fourPoint) {
        difficulty = 4;
    } else if (problemNum >= threePoint) {
        difficulty = 3;
    } else if (problemNum >= twoPoint) {
        difficulty = 2;
    }
    return difficulty;
}

/*
genDifficulty(double average, double spread)
helper function
@param average average difficulty
@param spread +- this amount
@return random difficulty
*/
function genDifficulty(average, spread) {
    var min = average - spread;
    var max = average + spread;
    var rng = Math.random();
    var addThing = rng * spread;
    var difficulty = min + addThing;
    difficulty = Math.round(difficulty);
    difficulty = Math.min(difficulty, 5);
    difficulty = Math.max(difficulty, 1);
    return difficulty;
}

/*
difficultyCurve(int problemNum, boolean hard)
@param problemNum problem number
@param hard true is hard, false is easy
@return random difficulty
*/
function difficultyCurve(problemNum, hard) {
    var exponent = 0.45;
    var upperBound = 4.5;
    if (hard) {
        exponent = 0.5;
        upperBound = 4.75
    }
    var average = Math.pow(problemNum, exponent);
    average = Math.min(average, upperBound);
    var difficulty = genDifficulty(average, 0.5);
    return difficulty;
}

/*
getScores(int limit).
retrieves top x scores for time attack
@limit the number of scores to retrieve
@return array with names and scores.
TIME ATTACK IS SORTED BY TIME IN ASCENDING ORDER
MARATHON IS SORTED BY SCORE IN DESCENDING ORDER
INDEX NUMBER
0: Time Attack Easy Names
1: Time Attack Easy Scores
2: Time Attack Hard Names
3: Time Attack Hard Scores
4: Marathon Easy Names
5: Marathon Easy Scores
6: Marathon Hard Names
7: Marathon Hard Scores
*/
function getScores(limit) {
    var namesTimeEasy;
    var namesTimeHard;
    var scoresTimeEasy;
    var scoresTimeHard;
    var namesMarathonEasy;
    var namesMarathonHard;
    var scoresMarathonEasy;
    var scoresMarathonHard;
    $.ajax({
        async: false,
        type: "GET",
        url: "getScores.php",
        dataType: "json",
        data: {limit: limit},
        success: function(data) {
            namesTimeEasy = data.namesTimeEasy;
            scoresTimeEasy = data.scoresTimeEasy;
            namesTimeHard = data.namesTimeHard;
            scoresTimeHard = data.scoresTimeHard;
            namesMarathonEasy = data.namesMarathonEasy;
            scoresMarathonEasy = data.scoresMarathonEasy;
            namesMarathonHard = data.namesMarathonHard;
            scoresMarathonHard = data.scoresMarathonHard;
        }
    });
    return [namesTimeEasy, scoresTimeEasy, namesTimeHard, scoresTimeHard,
        namesMarathonEasy, scoresMarathonEasy, namesMarathonHard, scoresMarathonHard];
}

/*
calcScore(int difficulty, double timeTaken, int comboMultiplier)
calculates the score for any given problem in marathon mode
@param difficulty difficulty of the problem from 1-5
@param timeTaken time it takes to solve the problem in seconds
@param comboMultiplier score multiplier
@return score
*/
function calcScore(difficulty, timeTaken, comboMultiplier) {
    var score = 100;
    var estimatedTime = 15 * difficulty;
    var minimumTime = 2.5 * (difficulty - 1) + 5;
    var adjustedTime = Math.max(timeTaken, minimumTime);
    adjustedTime = estimatedTime - adjustedTime;
    timeScore = Math.max(adjustedTime, 0);
    var timeMultiplier = 5;
    timeScore *= timeMultiplier;
    score += timeScore;
    var difficultyMultiplier = 1 + (difficulty - 1) * 0.1;
    score *= difficultyMultiplier;
    score *= comboMultiplier;
    score = Math.floor(score);
    return score;
}

/*
calcTime(int problemNumber)
calculates the amount of time to add to the timer in marathon mode
@param problemNumber problem number
@return time in seconds
*/
function calcTime(problemNumber) {
    var initialTime = 10;
    var fallOffStart = 5;
    var minimumTime = 5;
    var time = initialTime - Math.max(problemNumber - fallOffStart, 0) / 2;
    time = Math.floor(time);
    time = Math.max(time, minimumTime);
    return time;
}

/*
pushTimeAttackScore(String name, double scores, int hard) {
@param name 3 letter initials
@param scores time in milliseconds
@param hard 1 = hard, 0 = easy
}
*/
function pushTimeAttackScore(name, scores, hard) {
    var date = new Date().getTime();
    $.ajax({
        async: true,
        type: "GET",
        url: "timeAttackScore.php",
        data: {date: date, name: name, scores: scores, hard: hard},
    });
}

function pushMarathonScore(name, scores, hard) {
    var date = new Date().getTime();
    $.ajax({
        async: true,
        type: "GET",
        url: "marathonScore.php",
        data: {date: date, name: name, scores: scores, hard: hard},
    });
}

/*
Returns character string based on index position of scrollwheels
*/
function getCharacters(index1, index2, index3) {
    var input = [];
    input[0] = index1;
    input[1] = index2;
    input[2] = index3;
    var characters = "";

    for (var i = 0; i < input.length; i++) {
        switch (input[i]) {
            case 0:
                characters = characters + "A";
                break;
            case 1:
                characters = characters + "B";
                break;
            case 2:
                characters = characters + "C";
                break;
            case 3:
                characters = characters + "D";
                break;
            case 4:
                characters = characters + "E";
                break;
            case 5:
                characters = characters + "F";
                break;
            case 6:
                characters = characters + "G";
                break;
            case 7:
                characters = characters + "H";
                break;
            case 8:
                characters = characters + "I";
                break;
            case 9:
                characters = characters + "J";
                break;
            case 10:
                characters = characters + "K";
                break;
            case 11:
                characters = characters + "L";
                break;
            case 12:
                characters = characters + "M";
                break;
            case 13:
                characters = characters + "N";
                break;
            case 14:
                characters = characters + "O";
                break;
            case 15:
                characters = characters + "P";
                break;
            case 16:
                characters = characters + "Q";
                break;
            case 17:
                characters = characters + "R";
                break;
            case 18:
                characters = characters + "S";
                break;
            case 19:
                characters = characters + "T";
                break;
            case 20:
                characters = characters + "U";
                break;
            case 21:
                characters = characters + "V";
                break;
            case 22:
                characters = characters + "W";
                break;
            case 23:
                characters = characters + "X";
                break;
            case 24:
                characters = characters + "Y";
                break;
            case 25:
                characters = characters + "Z";
                break;
            case 26:
                characters = characters + "0";
                break;
            case 27:
                characters = characters + "1";
                break;
            case 28:
                characters = characters + "2";
                break;
            case 29:
                characters = characters + "3";
                break;
            case 30:
                characters = characters + "4";
                break;
            case 31:
                characters = characters + "5";
                break;
            case 32:
                characters = characters + "6";
                break;
            case 33:
                characters = characters + "7";
                break;
            case 34:
                characters = characters + "8";
                break;
            case 35:
                characters = characters + "9";
                break;
            case 36://Stitched index
                characters = characters + "A";
                break;
        }
    }

    return characters;
    
}

/*
Disables draggable feature of operators while new question is being loaded to avoid abuse of game mechanics.
*/
function disableDrag(onOff){
    if(onOff){
        gameArea.entities[9].isDraggable = false;
        gameArea.entities[8].isDraggable = false;
        gameArea.entities[7].isDraggable = false;
        gameArea.entities[6].isDraggable = false;
    } else {        
        gameArea.entities[9].isDraggable = true;
        gameArea.entities[8].isDraggable = true;
        gameArea.entities[7].isDraggable = true;
        gameArea.entities[6].isDraggable = true;
    }
}