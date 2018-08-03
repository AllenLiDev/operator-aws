// TIME ATTACK PSEUDO SPAGHETTI CODE

var problemNumber = 1;
var card1;
var card2;
var card3;
var card4;
var difficulty;
var problem;
createProblem();

function createProblem() {
    difficulty = timeAttackDifficulty(problemNumber, hard); // NOTE: hard is a variable that is set by difficulty selector in the settings. true = hard, false = easy.
    problem = genProblem(difficulty, hard); // array of card numbers
    card1 = problem[0];
    card2 = problem[1];
    card3 = problem[2];
    card4 = problem[3];
}

// PSEUDO CODE COMMENCE

when all operators are filled...

if (validate(card1, card2, card3, card4, op1, op2, op3)) {
    if (problemNumber == 10) {
        game over -> score menu and shit  // GAME ENDS WHEN PROBLEM 10 IS COMPLETED
    } else {
        problemNumber++
        createProblem();
    }
} else {
    THAT'S THE WRONG NUMBER
    clear operators
}
