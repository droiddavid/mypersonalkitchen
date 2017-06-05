angular.module('app').service('htmlmediaService', ['$http', 'Database', function($http, Database) {
'use strict';

	var that = this;

	this.fileExistUrl = 'http://' + WEB_SERVER + '/mypersonalkitchen/images/imageExists.php';
	this.IMAGE_WRITER = './images/imageWriter.php';
	this.db = Database;
	this.Images = []; //list of images
	this.Image = {
		filename: undefined,
		data: undefined
	};

	//this.ImagesDB = undefined;
	/* Define your database */
	this.ImagesDB = new Dexie("ImagesDB");
	this.ImagesDB.version(1).stores({
		images: 'filename,data'
	});
	//this.Invitation.photo_filename = new Date().getTime();

	//Send filename only.
	//Ex. 02310403, not 02310403.json 
	this.getImage = function (filename) {
		return $http.get('./images/' + filename + '.json', { cache: true })
	};


	//DETERMINE IF JSON FILE EXISTS
	this.jsonFileExists = function (file, data) {
		return $http.post(that.fileExistUrl, { 
			fileName: file + '.json', 						//that.Invitation.photo_filename + '.json', 
			data: data 										// that.Invitation.photo_imageData 
		})

		// .then(
		// 	function (response) { return response.data; } 	//returns "1" or "0"
		// );

	};


	//SAVE TO JSON
	this.saveToJSON = function (file, data) {
		return $http.post(IMAGE_WRITER, { 
			fileName: file,									//that.Invitation.photo_filename,
			data: data										//that.Invitation.photo_imageData
		})
		
		//.then(function (response) { return response.data;
		//});
	};


	//SAVE TO INDEXED DB
	this.saveToIndexedDB = function () {
		//SAVE TO LOCALSTORAGE
		that.ImagesDB.images.put({
			filename: that.Image.filename,
			data: that.Image.data
		}).then(function () {
			return that.ImagesDB.images.get(that.Image.filename)
		}).catch(function (error) {
			console.log("The following error occurred: " + error);
		});
	};


	//SAVE TO THE BACKEND DB	
	this.save = function (image) {

		var obj = {};
		
		//Add the form's elements to the insert object.
		for (var key in image) {
			// skip loop if the property is from prototype
			if (!image.hasOwnProperty(key)) continue;			
			obj[key] = image[key];
		}

		obj.userId 		= Session.id;
		obj.status 		= 1;
		obj.table 		= "html5media";
		//this.html5mediaList.push(obj);

		//Insert the object into the db.
		that.db.insert(obj)
			.then(function (response) {
				if (response) { //////****************************CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
					var retVal = (response.statusText === "OK") ? "Registration Successful" : "Registration Failed";
					return retVal;
				}
			});

	};


	//UPDATE THE BACKEND DB
	this.updateToDB = function () {

		var where = {
				"userId" : _invitation.userId,
				"id" : _invitation.id
			},
			table = "invitations", 
			columnsArray = _invitation,
			requiredColumnsArray = Object.keys(_invitation);

		that.db.update(table, columnsArray, where, requiredColumnsArray)
			.then(function (response) {
				if (response) { //***CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
					var retVal = (response.statusText === "OK") ? "Update Successful" : "Update Failed";
					return retVal;
				} 
			});
		//var $table, $columnsArray, $where, $requiredColumnsArray
	};

	return this;
}]);
