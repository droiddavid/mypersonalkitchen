angular.module('app').service('FoodTypeService', 
	['Database', '$rootScope', 'Session', function (Database, $rootScope, Session) {

	var that = this;

	this.foodTypes = [];
	this.initialized = false;

	this.init = function () {

		//Get the defaulyt food types
		that.loadDefaultFoodTypes();

		//Load user defined food types
		that.loadFoodTypes();

		//Sort the array
		that.sort();

	};


	this.loadDefaultFoodTypes = function () {
		//Get the default food types
		var obj = {
			table: 'foodTypes',
			fields: [{ name: 'userId'}, { name: 'status' }],
			where: [{ value: 0 }, { value: 1 }]	
		};
		Database.select2(obj)
			.then(function (response) {
				if (response && response.data && response.data.data) {
					that.foodTypes = response.data.data;
					//$rootScope.$broadcast('foodTypes.defaults.loaded');
				}
			});
	};
	//$rootScope.$on('foodTypes.defaults.loaded', that.getFoodTypes);


	this.loadFoodTypes = function () {

		//GETTING FOOD TYPES BY USER ID
		var obj = {
			table: 'foodTypes',
			fields: [{ name: 'userId'}, { name: 'status' }],
			where: [{ value: Session.id }, { value: 1 }]
		};
		Database.select2(obj)
			.then(function (response) {

				if (response && response.data && response.data.data) {
					var _foodTypes = response.data.data;

					_foodTypes.forEach(function (foodType, index) {
						that.foodTypes.push(foodType);
					});

					//sort the array
					that.sort();
					that.initialized = true;
				}

			});

		// Database.select({ 
		// 	fields: 'foodTypeId', 
		// 	table: 'foodTypes', 
		// 	where: '%'
	};

	this.sort = function () {

		// sort by food type
		that.foodTypes.sort(function(a, b) {

			var valueA = a.type.toUpperCase(); // ignore upper and lowercase
			var valueB = b.type.toUpperCase(); // ignore upper and lowercase

			if (valueA < valueB) {
				return -1;
			}

			if (valueA > valueB) {
				return 1;
			}

			// names must be equal
			return 0;
		});
	};

	//Handles adding a new food type
	this.addFoodType = function (newFoodType) {

		var _exists = false;

		that.foodTypes.forEach(function (foodType, index) {
			if (newFoodType === foodType.type) {
				_exists = true;
			}
		});

		if (!_exists) {
			//insert the food type to the DB using the service
			that.insertFoodType(newFoodType);

			//clear array
			that.foodTypes.length = 0;

			//get new list
			that.getDefaultFoodTypes();
		}
	};

	//Handles the DB entry.
	this.insertFoodType = function (foodType) {
		Database.insert({
			"table": 'foodTypes',
			"userId": Session.id,
			"type": foodType,
			"status": 1
		}).then(function (response) {
			if (response && response.data) {
				return response;
			}
		});
	};

}]);