<?php
session_start();

// retrieve data from ajax request
$hard = $_GET['hard'];
$name = $_GET['name'];
$scores = $_GET['scores'];
$date = $_GET['date'];
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

// selects table based on $upperCard
$sql = "INSERT INTO `TimeAttackScores1-" . $upperCard . "` (`name`, `score`, `dateKey`) VALUES ('$name', $scores, $date)";
// inserts score data into timeattackTable
$conn->query($sql);
$conn->close();