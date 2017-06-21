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

if (empty($_POST['table'])) $errors['table'] = 'table is required.';
if (empty($_POST['field'])) $errors['field'] = 'field is required.';
if (empty($_POST['fieldList'])) $errors['fieldList'] = 'fieldList is required.';
$table = $_POST['table'];
$field = $_POST['field'];
$fieldList = $_POST['fieldList'];

$sql = $mysqli->prepare("SELECT * FROM $table WHERE $field IN ($fieldList)");
$sql->execute();

$result = $sql->fetchAll(PDO::FETCH_ASSOC);

$json_response = json_encode($result);
echo $json_response;

?>