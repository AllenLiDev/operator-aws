<?php
session_start();

// retrieve data from ajax request
$hard = $_GET['hard'];
$name = $_GET['name'];
$scores = $_GET['scores'];
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

// selects table based on $upperCard
$sql = "INSERT INTO `TimeAttackScores1-" . $upperCard . "` (`name`, `score`) VALUES ('$name', $scores)";
// inserts score data into timeattackTable
$conn->query($sql);
$conn->close();