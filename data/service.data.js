/* data/service.data.js */
angular.module('app').service('DataService', ['$http', '$state', '$stateParams', '$mdToast', 'Session', 'Database', 'FileService', 'Cook', function ($http, $state, $stateParams, $mdToast, Session, Database, FileService, Cook) {

	var that = this;

	this.NUMBER_OF_DATASETS = 11;


	this.cook = new Cook(Session.id);
	this.isDone = 0;
	this.dataSet = undefined;
	this.initialized = false;


	this.onInit = function () {	

		// //Determine if .json files exist. If not, create it.	
		that.fileExists();

		that.isDone = 0;
		if (!that.initialized) {
			that.initializeDataSets();
		}

	};


	this.checkIsDone = function () {

		that.isDone++;

		if (that.isDone === Object.keys(Session.Collections).length) {
			that.initialized = false;
			$state.go('dashboard');
		}

	};


	//This is the initial data load.  It loads all Session data variables.
	this.initializeDataSets = function () {
		debugger;
		if (Session.role === 2) { //role.2 === cook
			//what is the role level?
			that.cook.getFood(that.cook.QUERIES.Food.fields, that.cook.QUERIES.Food.table, Session.id)
				.then(function (response) {
					Session.Collections.food = response.data.data;
					that.checkIsDone();
				});
			that.cook.getFoodTypes(that.cook.QUERIES.FoodTypes.fields, that.cook.QUERIES.FoodTypes.table, Session.id)
				.then(function (response) {
					Session.Collections.foodTypes = response.data.data;
					that.checkIsDone();
				});
			that.cook.getPlatters(that.cook.QUERIES.Platters.fields, that.cook.QUERIES.Platters.table, Session.id)
				.then(function (response) {
					Session.Collections.platters = response.data.data;
					that.checkIsDone();
				});
			that.cook.getPlatterItems(that.cook.QUERIES.PlatterItems.fields, that.cook.QUERIES.PlatterItems.table, Session.id)
				.then(function (response) {
					Session.Collections.platterItems = response.data.data;
					that.checkIsDone();
				});
			that.cook.getMenus(that.cook.QUERIES.Menus.fields, that.cook.QUERIES.Menus.table, Session.id)
				.then(function (response) {
					Session.Collections.menus = response.data.data;
					that.checkIsDone();
				});
			that.cook.getMenusPlatters(that.cook.QUERIES.Menus_Platters.fields, that.cook.QUERIES.Menus_Platters.table, Session.id)
				.then(function (response) {
					Session.Collections.menusPlatters = response.data.data;
					that.checkIsDone();
				});
			that.cook.getMenusPlatterItems(that.cook.QUERIES.Menus_Platters_PlatterItems.fields, that.cook.QUERIES.Menus_Platters_PlatterItems.table, Session.id)
				.then(function (response) {
					Session.Collections.menusPlattersPlatterItems = response.data.data;
					that.checkIsDone();
				});
			that.cook.getInvitationModes(that.cook.QUERIES.InvitationModes.fields, that.cook.QUERIES.InvitationModes.table, Session.id)
				.then(function (response) {
					Session.Collections.invitationModes = response.data.data;
					that.checkIsDone();
				});
			that.cook.getInvitations(that.cook.QUERIES.Invitations.fields, that.cook.QUERIES.Invitations.table, Session.id)
				.then(function (response) {
					Session.Collections.invitations = response.data.data;
					that.checkIsDone();
				});
			that.cook.getInvitationRecipients(that.cook.QUERIES.InvitationRecipients.fields, that.cook.QUERIES.InvitationRecipients.table, Session.id)
				.then(function (response) {
					Session.Collections.invitationRecipients = response.data.data;
					that.checkIsDone();
				});

			//TAKE A CLOSE LOOK AT THE WAY THIS IS DONE
			$http.get(Session.getFileName(Session.FileNames.profile))
				.then(function (response) {
					Session.Collections[Session.FileNames.profile] = response.data;
					that.checkIsDone();
				});
		} //if cook

		if (Session.role === 6) { //role.6 === guest
			if (navigator.geolocation) {
				// geolocation is available
				console.log("geolocation is available");
			} 
			else {
				// geolocation is not supported
				console.log("geolocation is not supported");
			}
		}








		that.initialized = true;
	};

	/* 	1. check if files exist.
		If files exist, continue.  Otherwise
			create new file. */
	//Determine if .json file exist. If not, create.	
	this.fileExists = function () {
		for(var idx = 0; idx < Session.filenames.length; idx++) {
			FileService.isFileExists(Session.filenames[idx]);
		}
	};


	/*	2. check if an individual file has data.
		If the file has data, return it. Otherwise
			return negative value */
	//Determine if .jsonfile hasData. 1 = success; 0 = failure
	this.hasData = function (filename) {
		return $http.get(Session.getFileName(filename));
	};


	/*	3. attempt to get data from the DB.
		Return the result
	*/
	//Return AJAX result
	this.getDataFromDB = function (field, table, where) {
		var obj = {
			fields: field,
			table: 	table,
			where: 	where
		};
		return Database.select(obj);
	};


	/*	4. update session variable.
		Set session variable value to parameter's value */
	//Set session variable value.
	this.updateSession = function (sessionName) {

		switch (sessionName) {
			case 'food': 
				Session.FileNames.food = that.dataSet;
				break;
			case 'foodTypes':
				Session.FileNames.foodTypes = that.dataSet;
				break;
			case 'platters':
				Session.FileNames.platters = that.dataSet;
				break;
			case 'platterItems':
				Session.FileNames.platterItems = that.dataSet;
				break;
			case 'profile':
				Session.FileNames.profile = that.dataSet;
				break;
			case 'menus':
				Session.FileNames.menus = that.dataSet;
				break;		
			case 'menusPlatters':
				Session.FileNames.menusPlatters = that.dataSet;
				break;
			case 'menusPlattersPlatterItems':
				Session.FileNames.menusPlattersPlatterItems = that.dataSet;
				break;
			case 'invitationModes':
				Session.FileNames.invitationModes = that.dataSet;
				break;
			case 'invitations':
				Session.FileNames.invitations = that.dataSet;
				break;
			case 'invitationRecipients':
				Session.FileNames.invitationRecipients = that.dataSet;
				break;

		} //end switch

	}; //this.updateSession


	//Write to JSON file.
	this.writeToJSON = function (filename, collection) {
		return $http.post('./data/fileWriter.php', { 
			fileName: filename + ".json",
			data: collection
		});
	};

	//Remove JSON file
	this.deleteFile = function (filename) {
		return $http.post('./data/fileDeleter.php', {
			fileName: filename + ".json"
		});
	};


/*
	5. 
*/
	// that.getFoodFromFile(Session.FileNames.food);
	// that.getDataFromDB(cook.QUERIES.Food.fields, cook.QUERIES.Food.table);



		// 		.then(function (response) {
		// 			collection = response.data.data;
		// 		})
		// 		.then(function () {
		// 			$http.post('./data/fileWriter.php', { 
		// 				fileName: filename + ".json",
		// 				data: collection
		// 			});
		// 		}); //write the data to a local file (update current data)
		// } else {
		// 	return Session.Collections[filename] = response.data;
		// }
			// })
			// .then(function () {
			// 	that.dataSets[0].completed = true;
			// 	that.checkPromisesForCompletion();
			// });		


}]);