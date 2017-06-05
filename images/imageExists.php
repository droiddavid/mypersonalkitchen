<?php
	$_POST = json_decode(file_get_contents('php://input'), true);
	
	$fileName = $_POST['fileName'];

	if (file_exists($fileName)) {
		echo true;
	} else {
		$myfile = fopen($fileName, "w") or die("Unable to open file!");
		fwrite($myfile, '[]');
		fclose($myfile);

		if (file_exists($fileName)) {
			echo true;
		} else {
			echo false;
		}
	}
?>