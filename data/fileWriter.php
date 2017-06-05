<?php
	$_POST = json_decode(file_get_contents('php://input'), true);

	if (!isset($_POST['fileName'])) { $errors['fileName'] = 'fileName is required.'; }
	if (!isset($_POST['data'])) { $errors['data'] = 'data is required.'; }

	$fileName 	= $_POST['fileName'];
	$data 		= $_POST['data'];

	$myfile = fopen($fileName, "w") or die("Unable to open file!");
	fwrite($myfile, json_encode($data));
	fclose($myfile);
?>