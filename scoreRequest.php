<?php
session_start();


$hard = $_GET['hard'];
if ($hard) {
    $upperCard = 13;
} else {
    $upperCard = 9;
}

$servername = "localhost";
$username = "headhuntar";
$password = "Group21rocks"; 
$db = "headhunt_operator"; 
$conn = new mysqli($servername, $username, $password, $db);
if ($conn->connect_error) {
    die("connection failed: " . $conn->connect_error);
}
$sql = "SELECT name, score
    FROM TimeAttackScores`1-" . $upperCard . "`
    ORDER BY score DESC
    LIMIT 5";
$result = $conn->query($sql); 
$scores = array();
$names = array();
for ($iterator = 0; $iterator <= 4; $iterator++){
    $row = $result->fetch_assoc();
    $names[$iterator] = $row["name"];
    $scores[$iterator] = $row["score"]; 
}
echo json_encode( array("name1"=>$names[0], "score1" =>$scores[0], "name2"=>$names[1], "score2" =>$scores[1],
"name3"=>$names[2], "score3" =>$scores[2], "name4"=>$names[3], "score4" =>$scores[3]
,"name5"=>$names[4], "score5" =>$scores[4]));
}
?>