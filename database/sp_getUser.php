<?php

// set up the connection variables
$db_name  = 'iforkandspoon';
//$hostname = 'localhost';
$hostname = '127.0.0.1';
$username = 'root';
$password = 'mysqlpass';

// try {
// 	$mysqli = new PDO("mysql:host=$hostname;dbname=$db_name;charset=utf8", $username, $password, array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
// } catch(PDOException $e) { echo $e->getMessage(); }

try {
	$pdo = new PDO("mysql:host=$hostname;dbname=$db_name", $username, $password);
} catch (PDOException $e) {
	die("Error occurred:" . $e->getMessage());
}

$_POST = json_decode(file_get_contents('php://input'), true);

if (empty($_POST['emailAddress'])) $errors['emailAddress'] = 'emailAddress is required.';
if (empty($_POST['password'])) $errors['password'] = 'password is required.';

$email 	= 	$_POST['emailAddress'];
$password = $_POST['password'];

// execute the stored procedure
//$sql = 'CALL GetCustomers()';
$query	=	"CALL getUser('$email', '$password');";

try {
	// call the stored procedure
	$q = $pdo->query($query);
	$q->setFetchMode(PDO::FETCH_ASSOC);
	print_r($q->queryString);
} catch (PDOException $e) {
	die("Error occurred:" . $e->getMessage());
}

return json_encode($q);
?>