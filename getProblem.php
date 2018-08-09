<?php
session_start();

// retrieve data from ajax request
$difficulty = intval($_GET['difficulty']);
$hard = $_GET['hard'];
if ($hard) {
    $upperCard = 13;
    switch ($difficulty) {
    case 1:
        $randUpperBound = 1291;
        break;
    case 2:
        $randUpperBound = 1881;
        break;
    case 3:
        $randUpperBound = 1641;
        break;
    case 4:
        $randUpperBound = 1685;
        break;
    case 5:
        $randUpperBound = 812;
        break;
    }
} else {
    $upperCard = 9;
    switch ($difficulty) {
        case 1:
            $randUpperBound = 375;
            break;
        case 2:
            $randUpperBound = 30;
            break;
        case 3:
            $randUpperBound = 488;
            break;
        case 4:
            $randUpperBound = 637;
            break;
        case 5:
            $randUpperBound = 255;
            break;
    }
}

$servername = "operator-game.c98lcf4irdez.us-west-2.rds.amazonaws.com";
$username = "headhuntar";
$password = "Group21rocks"; 
$db = "headhunt_operator";

// connects to database
$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
    die("connection failed: " . $conn->connect_error);
}

// random row number from table
$rowNum = rand(1, $randUpperBound);
$sql = "SELECT * FROM `1-" . $upperCard . "Lv" . $difficulty . "` WHERE `rowNo` = " . $rowNum;
$problem = $conn->query($sql);
$row = $problem->fetch_assoc();

// echoes json with card data
echo json_encode( array( "card1"=>$row["card1"], "card2"=>$row["card2"], "card3"=>$row["card3"], "card4"=>$row["card4"]));
?>
