<?php
	$_POST = json_decode(file_get_contents('php://input'), true);

	if (!isset($_POST['fileName'])) { $errors['fileName'] = 'fileName is required.'; }

	$fileName 	= $_POST['fileName'];

	unlink($fileName) or die("Couldn't delete file");
?>