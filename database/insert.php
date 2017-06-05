<?php
	require_once 'dbHelper.php';
	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	$sql = array(); 		//fieldName => fieldValue
	$reqCols = array(); 	//required fields for the insert
	$table = $_POST["table"];

	echo "sql: ";
	print_r($sql);


	foreach ($_POST as $key => $value) {
		if (!($key == "table"))
			$sql[$key] = $value;
	}
	unset($value);

	echo "sql: ";
	print_r($sql);

	foreach ($_POST as $key => $value) {
		if (!($key == "table"))
			$reqCols[] = $key;
	}
	unset($value);

	echo "reqCols: ";
	print_r($reqCols);

	echo "post table";
	print_r($_POST["table"]);

	//fetch rows
	$rows = $db->insert($_POST["table"], $sql, $reqCols);

	// convert to json
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );

	//return the json response.
	echo "$json";
?>