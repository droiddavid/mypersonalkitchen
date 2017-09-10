angular.module('app').factory('Food', ['$http', function ($http) {
	'use strict';

	/* Constructor, with class name */
	function Food(userId) {
		//Protect the global window.  If this instance was created without
		//the new keyword, return a new one anyway.
		//Ex. var food = Food(); is equivalent to var food = new Food();
		if (!(this instanceof Food)) { 
			return new Food(userId);
		}

		//class level instance properties
		this.personId = userId;

	}; //Food

	/* Public properties, assigned to the instance ('this') */
	Food.prototype.personId = 0;

	var baseUrl = 'https://' + WEB_SERVER + '/mypersonalkitchen/database';
	Food.prototype.urls = {
		"getFood"			: baseUrl + '/getFood.php',
		"addNew" 			: baseUrl + '/addNewFoodItem.php',
		"getFoodTypes" 		: baseUrl + '/getFoodTypes.php',
		"getFoodItems" 		: baseUrl + '/getFoodItems.php',
		"removeFoodItem" 	: baseUrl + '/removeFoodItem.php'
	}; //urls

	/* Public methods, assigned to prototype */
	Food.prototype.getUserId = function () { return this.userId; };
	Food.prototype.setUserId = function (id) { this.userId = id; };

	Food.prototype.getFood = function (userId) {
		return $http.post(this.urls.getFood, { "userId": userId, "status": 1 });
	}; //getFood

	Food.prototype.addNewFoodItem = function (userId) {
		return $http.post(this.urls.addNew, { userId: userId });
	};

	Food.prototype.getFoodItems = function (Person) {
		return $http.post(this.urls.getFoodItems, Person);
	};

	Food.prototype.getFoodTypes = function (userId) {
		return $http.post(this.urls.getFoodTypes);
	};

	/* Return the constructor function */
	return Food;

}]); //app.factories.factory.Food