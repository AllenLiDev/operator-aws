<?php
session_start();

// retrieve data from ajax request
$difficulty = intval($_GET['difficulty']);
$hard = $_GET['hard'];
if ($hard) {
    $table = "HardQuestions";
} else {
    $table = "EasyQuestions";
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

$sql = "SELECT * FROM $table LIMIT 1";
$problem = $conn->query($sql);
$row = $problem->fetch_assoc();

// echoes json with card data
echo json_encode( array( "card1"=>$row["card1"], "card2"=>$row["card2"], "card3"=>$row["card3"], "card4"=>$row["card4"]));
?>
