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