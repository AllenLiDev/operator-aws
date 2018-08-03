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

$servername = "localhost";
$username = "headhuntar";
$password = "Group21rocks"; 
$db = "headhunt_operator";

// connects to database
$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
    die("connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM `TimeAttackScores1-" . $upperCard . "` WHERE `score` < ". $scores ." ORDER BY `score` ASC";
$result = $conn->query($sql);
// number of rows greater than score
$position = $result->num_rows;
// score position is number of rows greater than score + 1
$position++;

echo json_encode(array("position"=>$position));
?>