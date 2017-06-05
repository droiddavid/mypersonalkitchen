<?php
	require_once 'dbHelper.php';
	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	$table = $_POST["table"];
	$columnsArrayPost = $_POST["columnsArray"];
	$wherePost = $_POST["where"];
	$requiredColumnsArrayPost = $_POST["requiredColumnsArray"];


	$columnsArray = array(); 		//fieldName => fieldValue
	foreach ($columnsArrayPost as $key => $value) {
		if (!($key == "table")) $columnsArray[$key] = $value; 
	} 
	unset($value); 
	echo "columnsArray: "; 
	print_r($columnsArray); 
	echo("<br /><br />");





	$where = array(); 	//required fields for the insert
	foreach ($wherePost as $key => $value) { 
		if (!($key == "table")) $where[$key] = $value; 
	}
	unset($value);
	echo "where: "; 
	print_r($where); 
	echo("<br /><br />");





	$requiredColumnsArray = array(); 	//required fields for the insert
	foreach ($requiredColumnsArrayPost as $key => $value) { 
		if (!($key == "table")) $requiredColumnsArray[$key] = $value; 
	}
	unset($value); 
	echo "requiredColumnsArray: "; 
	print_r($requiredColumnsArray); 
	echo("<br /><br />");


	//fetch rows
	$rows = $db->update($table, $columnsArray, $where, $requiredColumnsArray);
	// convert to json
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );


	//return the json response.
	echo "$json";
?>