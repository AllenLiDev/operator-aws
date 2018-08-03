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