<?php
	require_once 'dbHelper.php';
	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	$sql = array(); 		//fieldName => fieldValue
	$reqCols = array(); 	//required fields for the insert
	$table = $_POST["table"];

	/*
		1. Accepts an object.  The object must have at least two key, value pairs:
			a. The first key, value pair must be table and table name.
				i. "table": "tablename"
			b. The second key, value pair can be any fieldname, fieldvalue pair.
				Example:
					"id": 999,
					"name": "Hello",
					etc...
		2. This script strips the second and subsequent key, values pairs and separate them
			into two separate arrays.  The first array contains db fieldnames and the second
			array contains a corresponding value
		3. The caller:
			Database.insert: function (obj) {
				return $http.post(url.insert, obj);
			}
		4. The callee:
			See 46 below.
	*/
	
	//KEY
	foreach ($_POST as $key => $value) {
		if (!($key == "table"))
			$reqCols[] = $key;
	}
	unset($value);

	//VALUE
	foreach ($_POST as $key => $value) {
		if (!($key == "table"))
			$sql[$key] = $value;
	}
	unset($value);

	//fetch rows
	$rows = $db->insert($_POST["table"], $sql, $reqCols);

	// convert to json
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );

	//return the json response.
	echo "$json";
?>