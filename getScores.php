<?php
session_start();

// retrieve data from ajax request
$limit = $_GET['limit'];

$servername = "localhost";
$username = "headhuntar";
$password = "Group21rocks"; 
$db = "headhunt_operator";

// connects to database
$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
    die("connection failed: " . $conn->connect_error);
}

$time9sql = "SELECT * FROM `TimeAttackScores1-9` ORDER BY `score` ASC, `dateKey` ASC LIMIT " . $limit;
$time13sql = "SELECT * FROM `TimeAttackScores1-13` ORDER BY `score` ASC, `dateKey` ASC LIMIT " . $limit;
$marathon9sql = "SELECT * FROM `MarathonScores1-9` ORDER BY `score` DESC, `dateKey` ASC LIMIT " . $limit;
$marathon13sql = "SELECT * FROM `MarathonScores1-13` ORDER BY `score` DESC, `dateKey` ASC LIMIT " . $limit;

$namesTimeEasy = array();
$scoresTimeEasy = array();
$namesTimeHard = array();
$scoresTimeHard = array();

$namesMarathonEasy = array();
$scoresMarathonEasy = array();
$namesMarathonHard = array();
$scoresMarathonHard = array();

$time9 = $conn->query($time9sql);
$time13 = $conn->query($time13sql);
$marathon9 = $conn->query($marathon9sql);
$marathon13 = $conn->query($marathon13sql);

while ($row = $time9->fetch_assoc()) {
    global $namesTimeEasy;
    global $scoresTimeEasy;
    array_push($namesTimeEasy, $row["name"]);
    array_push($scoresTimeEasy, $row["score"]);
}

while ($row13 = $time13->fetch_assoc()) {
    global $namesTimeHard;
    global $scoresTimeHard;
    array_push($namesTimeHard, $row13["name"]);
    array_push($scoresTimeHard, $row13["score"]);
}

while ($row = $marathon9->fetch_assoc()) {
    global $namesMarathonEasy;
    global $scoresMarathonEasy;
    array_push($namesMarathonEasy, $row["name"]);
    array_push($scoresMarathonEasy, $row["score"]);
}

while ($row13 = $marathon13->fetch_assoc()) {
    global $namesMarathonHard;
    global $scoresMarathonHard;
    array_push($namesMarathonHard, $row13["name"]);
    array_push($scoresMarathonHard, $row13["score"]);
}

echo json_encode(array("namesTimeEasy"=>$namesTimeEasy,
                        "scoresTimeEasy"=>$scoresTimeEasy,
                        "namesTimeHard"=>$namesTimeHard,
                        "scoresTimeHard"=>$scoresTimeHard,
                        "namesMarathonEasy"=>$namesMarathonEasy,
                        "scoresMarathonEasy"=>$scoresMarathonEasy,
                        "namesMarathonHard"=>$namesMarathonHard,
                        "scoresMarathonHard"=>$scoresMarathonHard));
?>