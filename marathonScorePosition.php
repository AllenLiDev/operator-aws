<?php
session_start();

// retrieve data from ajax request
$scores = $_GET['scores'];
$hard = $_GET['hard'];
if ($hard) {
    $upperCard = 13;
} else {
    $upperCard = 9;
}

$servername = "operator-game.cl1klhlysvku.us-west-2.rds.amazonaws.com";
$username = "headhuntar";
$password = "operator"; 
$db = "operator";

// connects to database
$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
    die("connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM `MarathonScores1-" . $upperCard . "` WHERE `score` > ". $scores ." ORDER BY `score` DESC";
$result = $conn->query($sql);
// number of rows greater than score
$position = $result->num_rows;
// score position is number of rows greater than score + 1
$position++;

echo json_encode(array("position"=>$position));
?>