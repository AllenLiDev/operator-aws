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
timeAttackDifficulty(int problemNum, boolean hard)
@param problemNum problem number
@param hard true is hard, false is easy
@return difficulty for problem number
*/
function timeAttackDifficulty(problemNum, hard) {
    var difficulty = 1;
    var twoPoint = 2;
    var threePoint = 5;
    var fourPoint = 9;
    var fivePoint = 11;
    if (hard) {
        twoPoint = 1;
        threePoint = 3;
        fourPoint = 5;
        fivePoint = 8;
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

function displayDifficulty() {
    var x = "";
    for (var i = 1; i < 11; i++) {
        x += timeAttackDifficulty(i) + ", ";
    }
    alert(x);
}