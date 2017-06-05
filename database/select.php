<?php
	require_once 'dbHelper.php';

	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	//Declare all variables
	$table = '';
	$fields = '';
	$where = '';
	
	if (!isset($_POST['table'])) { $errors['table'] = 'table is required.'; }
	if (!isset($_POST['fields'])) { $errors['fields'] = 'fields is required.'; }
	if (!isset($_POST['where'])) { $errors['where'] = 'where is required.'; }


	$table = $_POST['table'];
	$fields = $_POST['fields'];
	$where = $_POST['where'];

	if ($table == "invitationModes") {
		$rows = $db->select("invitationModes",array());
	} else {
		$rows = $db->select($table,array($fields=>$where));
	}
	
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );
	
	echo "$json";
?>