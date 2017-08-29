<?php
	require_once 'dbHelper.php';

	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	if (!isset($_POST['table'])) { $errors['table'] = 'table is required.'; }
	if (!isset($_POST['firstFieldName'])) { $errors['firstFieldName'] = 'First Field Name is required.'; }
	if (!isset($_POST['firstFieldValue'])) { $errors['firstFieldValue'] = 'First Field Value is required.'; }
	if (!isset($_POST['secondFieldName'])) { $errors['secondFieldName'] = 'Second Field Name is required.'; }
	if (!isset($_POST['secondFieldValue'])) { $errors['secondFieldValue'] = 'Second Field Value is required.'; }


	$table = $_POST['table'];
	$firstFieldName = $_POST['firstFieldName'];
	$firstFieldValue = $_POST['firstFieldValue'];
	$secondFieldName = $_POST['secondFieldName'];
	$secondFieldValue = $_POST['secondFieldValue'];

	$rows = $db->select($table,array($firstFieldName=>$firstFieldValue,$secondFieldName=>$secondFieldValue));
	
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );
	
	echo "$json";
?>