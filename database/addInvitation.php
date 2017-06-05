<?php
	require_once 'dbHelper.php';
	$db = new dbHelper();

	$_POST = json_decode(file_get_contents('php://input'), true);

	// checking for blank values.
	if (empty($_POST['userId'])) $errors['userId'] = 'User ID is required.';
	if (empty($_POST['title'])) $errors['title'] = 'Title is required.';
	if (empty($_POST['message'])) $errors['message'] = 'Message is required.';
	if (empty($_POST['dateSent'])) $errors['dateSent'] = 'Date Sent is required.'; 


	$userId		=	$_POST['userId'];
	$title 		= 	$_POST['title'];
	$message 	= 	$_POST['message'];
	$dateSent 	= 	$_POST['dateSent'];

	$rows = $db->insert("invitations", array('userId' => $userId, 'title' => $title, 'message' => $message, 'dateSent' => $dateSent), array('userId', 'title', 'message', 'dateSent'));

	// convert to json
	$json = json_encode( $rows,JSON_NUMERIC_CHECK );

	//The echoed value will appear as part of the response.
	echo "$json";

	// echo the json string
	//return $json;

?>

