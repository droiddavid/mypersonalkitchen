<?php

// set up the connection variables
$db_name  = 'iforkandspoon';  //$hostname = 'localhost';
$hostname = '127.0.0.1';
$username = 'root';
$password = 'mysqlpass';

try {
	$mysqli = new PDO("mysql:host=$hostname;dbname=$db_name;charset=utf8", $username, $password, array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
} catch(PDOException $e) {
	echo $e->getMessage();
}

$_POST = json_decode(file_get_contents('php://input'), true);

if (empty($_POST['zipcodes'])) $errors['zipcodes'] = 'zipcodes is required.';
$zipcodes = $_POST['zipcodes'];

$sql = $mysqli->prepare("SELECT * FROM profiledata WHERE zip IN ($zipcodes)");
$sql->execute();

$result = $sql->fetchAll(PDO::FETCH_ASSOC);

$json_response = json_encode($result);
echo $json_response;

?>