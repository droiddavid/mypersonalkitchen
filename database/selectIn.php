<?php
	require_once 'dbHelper.php';

	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	//Declare all variables
	$table = '';
	$field = '';
	$fieldList = '';
	
	if (!isset($_POST['table'])) { $errors['table'] = 'table is required.'; }
	if (!isset($_POST['field'])) { $errors['field'] = 'field is required.'; }
	if (!isset($_POST['fieldList'])) { $errors['fieldList'] = 'fieldList is required.'; }

	$table 		= $_POST['table'];
	$field 		= $_POST['field'];
	$fieldList 	= $_POST['fieldList'];

	// echo "table: $table \n\r";
	// echo "field: $field \n\r";
	// echo "fieldList: $fieldList \n\r \n\r";

	//$sql = $mysqli->prepare("SELECT * FROM $table WHERE $field IN ($fieldList)");

	//$rows = $db->selectIn($table, $field, $fieldList);
	$rows = $db->selectIn($table, $fieldList);
	
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );
	
	echo "$json";
?>