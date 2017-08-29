<?php
	require_once 'dbHelper.php';
	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	$sql = array(); 		//fieldName => fieldValue
	$reqCols = array(); 	//required fields for the insert
	$table = $_POST["table"];


	foreach ($_POST as $key => $value) {
		if (!($key == "table"))
			$sql[$key] = $value;
	}
	unset($value);

	foreach ($_POST as $key => $value) {
		if (!($key == "table"))
			$reqCols[] = $key;
	}
	unset($value);

	//fetch rows
	$rows = $db->insert($_POST["table"], $sql, $reqCols);

	// convert to json
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );

	//return the json response.
	echo "$json";
?>