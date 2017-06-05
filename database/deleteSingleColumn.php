<?php
	require_once 'dbHelper.php';

	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	
	if (!isset($_POST['table'])) { $errors['table'] = 'table is required.'; }
	if (!isset($_POST['fieldName'])) { $errors['fieldName'] = 'fieldName is required.'; }
	if (!isset($_POST['fieldValue'])) { $errors['fieldValue'] = 'fieldValue is required.'; }


	$table = $_POST['table'];
	$fieldName = $_POST['fieldName'];
	$fieldValue = $_POST['fieldValue'];

	$rows = $db->delete($table,array($fieldName=>$fieldValue));
	
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );
	
	echo "$json";
?>