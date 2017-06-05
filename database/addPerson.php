<?php

// set up the connection variables
$db_name  = 'iforkandspoon';
//$hostname = 'localhost';
$hostname = '127.0.0.1';
$username = 'root';
$password = 'mysqlpass';

try {
	$mysqli = new PDO("mysql:host=$hostname;dbname=$db_name;charset=utf8", $username, $password, array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
	print "Connection Established!";
}
catch(PDOException $e) {
    echo $e->getMessage();
}

// Getting posted data and decodeing json
$_POST = json_decode(file_get_contents('php://input'), true);



foreach ($_POST as $key => $value) {
	echo "$key: $value<br>";
}
echo "...and also...";
print_r($_POST);



// checking for blank values.
if (empty($_POST['fname'])) $errors['fname'] = 'fname is required.';
if (empty($_POST['lname'])) $errors['lname'] = 'lname is required.';
if (empty($_POST['email'])) $errors['email'] = 'email is required.';
if (empty($_POST['password'])) $errors['password'] = 'password is required.';
if (empty($_POST['type'])) $errors['type'] = 'type is required.';



$fname 	= 	$_POST['firstname'];
$lname 	= 	$_POST['lastname'];
$email 	= 	$_POST['emailAddress'];
$password = $_POST['password'];
$type 	= 	$_POST['type'];



$query	=	"INSERT INTO person(firstname, lastname, emailAddress, password, type) VALUES ('$fname', '$lname', '$email', '$password', '$type');";
echo "query: $query";

//$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

echo $json_response = json_encode($result);


?>