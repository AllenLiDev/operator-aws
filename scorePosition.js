/*
getMarathonScorePosition(int scores, int hard)
tells you the ranking of a score in the leaderboards
@param scores score
@hard 1 = hard, 0 = easy
@return position on the leaderboard
*/
function getMarathonScorePosition(scores, hard) {
    var position = null;
    $.ajax({
        async: false,
        type: "GET",
        url: "marathonScorePosition.php",
        dataType: "json",
        data: {scores: scores, hard: hard},
        success: function(data) {
            position = data.position;
        }
    });
    return position;
}

/*
getTimeAttackScorePosition(double scores, int hard)
tells you the ranking of a score in the leaderboards
@param scores time taken
@hard 1 = hard, 0 = easy
@return position on the leaderboard
*/
function getTimeAttackScorePosition(scores, hard) {
    var position = null;
    $.ajax({
        async: false,
        type: "GET",
        url: "timeAttackScorePosition.php",
        dataType: "json",
        data: {scores: scores, hard: hard},
        success: function(data) {
            position = data.position;
        }
    });
    return position;
}