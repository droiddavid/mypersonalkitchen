angular.module('app').service('FoodTypeService', 
	['Database', '$rootScope', 'Session', function (Database, $rootScope, Session) {

	var that = this;

	this.foodTypes = [];

	this.init = function () {
		that.getDefaultFoodTypes();
		//that.getFoodTypes();

		//Sort the array
		that.sort();
	};

	this.getFoodTypes = function () {
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
					$rootScope.$broadcast('foodTypes.loaded', { response: response });
				}

			});

		// Database.select({ 
		// 	fields: 'foodTypeId', 
		// 	table: 'foodTypes', 
		// 	where: '%' 
		// // }).then(function (response) {
		// 	if (response && response.data && response.data.data) {
		// 		that.foodTypes = response.data.data;

		// 		//sort the array
		// 		that.sort();
		// 		$rootScope.$broadcast('foodTypes.loaded', { response: response });
		// 	}
		// });
	};

	this.getDefaultFoodTypes = function () {
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
					$rootScope.$broadcast('foodTypes.defaults.loaded', { response: response })
				}
			});
	};
	$rootScope.$on('foodTypes.defaults.loaded', that.getFoodTypes);

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

}]);