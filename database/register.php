<?php

// set up the connection variables
$db_name  = 'iforkandspoon';
//$hostname = 'localhost';
$hostname = '127.0.0.1';
$username = 'root';
$password = 'mysqlpass';

try {
	$mysqli = new PDO("mysql:host=$hostname;dbname=$db_name;charset=utf8", $username, $password, array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
	//print "Connection Established!";
}
catch(PDOException $e) {
    echo $e->getMessage();
}

// Getting posted data and decodeing json
$_POST = json_decode(file_get_contents('php://input'), true);

// foreach ($_POST as $key => $value) {
// 	echo "$key: $value<br>";
// }
//echo "...and also...";
//print_r($_POST);

// checking for blank values.
if (empty($_POST['firstName'])) $errors['firstName'] = 'First name is required.';
if (empty($_POST['lastName'])) $errors['lastName'] = 'Last name is required.';
if (empty($_POST['emailAddress'])) $errors['emailAddress'] = 'Email Address is required.';
if (empty($_POST['password'])) $errors['password'] = 'Password is required.';
if (empty($_POST['role'])) $errors['role'] = 'Role is required.';
if (empty($_POST['status'])) $errors['status'] = 'Status is required.';
if (empty($_POST['userName'])) $errors['userName'] = 'UserName is required.';
if (empty($_POST['message'])) $errors['message'] = 'Message is required.';
if (empty($_POST['lastLogin'])) $errors['lastLogin'] = 'lastLogin is required.';

$fname 			= 	$_POST['firstName'];
$lname 			= 	$_POST['lastName'];
$email 			= 	$_POST['emailAddress'];
$password 		= 	$_POST['password'];
$role 			= 	$_POST['role'];
$status 		=  	$_POST['status'];
$userName 		= 	$_POST['userName'];
$message 		= 	$_POST['message'];
$lastLogin 		= 	$_POST['lastLogin'];

$query	=	"INSERT INTO users(firstName, lastName, emailAddress, password, role, status, userName, message, lastLogin) VALUES ('$fname', '$lname', '$email', '$password', '$role', '$status', '$userName', '$message', '$lastLogin');";
//echo "query: $query";

$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

echo $json_response = json_encode($result);

?>