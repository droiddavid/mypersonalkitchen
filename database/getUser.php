<?php
	require_once 'dbHelper.php';

	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	if (empty($_POST['emailAddress'])) { $errors['emailAddress'] = 'Email address is required.'; }
	if (empty($_POST['password'])) { $errors['password'] = 'Password is required.'; }

	$emailAddress 	= 	$_POST['emailAddress'];
	$password 		= 	$_POST['password'];

	$rows = $db->select("users",array('emailAddress'=>$emailAddress, 'password'=>$password));
	
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );
	
	echo "$json";

?>