<?php
	$_POST = json_decode(file_get_contents('php://input'), true);
	
	$fileName = $_POST['fileName'];

	//print("fileName: ".$fileName);

	if (file_exists($fileName)) {
		//print("fileName: ".$fileName);
		echo true;
	} else {

		//print("fileName: ".$fileName);
		$myfile = fopen($fileName, "w") or die("Unable to open file!");
		fwrite($myfile, '[]');
		fclose($myfile);

		if (file_exists($fileName)) {
			//print("fileName: ".$fileName);
			echo true;
		} else {
			//print("fileName: ".$fileName);
			echo false;
		}
	}
?>