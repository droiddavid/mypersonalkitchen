angular.module('app').factory('PlatterItem', ['$http', function ($http) {
	'use strict';

	var that = this;

	/* Constructor, with class name */
	function PlatterItem(personId) {
		//Protect the global window.  If this instance was created without
		//the new keyword, return a new one anyway.
		//Ex. var platterItem = PlatterItem(); is equivalent to var platterItem = new PlatterItem();
		if (!(this instanceof PlatterItem)) { 
			return new PlatterItem(personId);
		}

		//class level instance properties
		this.personId = personId;
	}; //PlatterItem


	/* Public properties, assigned to the instance ('this') */
	PlatterItem.prototype.personId = 0;
	PlatterItem.prototype.urls = {
		"getPlatterItems": "https://" + WEB_SERVER + "/mypersonalkitchen/database/getPlatterItems_vw.php"
	}; //urls


	/* Public methods, assigned to prototype */
	PlatterItem.prototype.getPersonId = function () { return this.personId; };
	PlatterItem.prototype.setPersonId = function (id) { this.personId = id; };
	
	PlatterItem.prototype.getPlatterItems = function (userId) {
		return $http.post(this.urls.getPlatterItems, { "personId": this.personId });
	};

	return PlatterItem;

}]); //app.factories.factory.PlatterItem

angular.module('app').factory('Platter', ['$http', 'PlatterItem', function ($http, PlatterItem) {
	'use strict';

	/* Constructor, with class name */
	function Platter(userId) {
		//Protect the global window.  If this instance was created without
		//the new keyword, return a new one anyway.
		//Ex. var platter = Platter(); is equivalent to var platter = new Platter();
		if (!(this instanceof Platter)) { 
			return new Platter(userId);
		}

		//class level instance properties
		this.personId = userId;
	}; //Platter

	/* Public properties, assigned to the instance ('this') */
	Platter.prototype.personId = 0;
	Platter.prototype.urls = {
		"getPlatters": "https://" + WEB_SERVER + "/mypersonalkitchen/database/getPlatters.php"
	};



	/* Public methods, assigned to prototype */
	Platter.prototype.getPersonId = function () { return this.personId; };
	Platter.prototype.setPersonId = function (id) { this.personId = id; };

	Platter.prototype.getPlatters = function (userId) {
		return $http.post(this.urls.getPlatters, { "personId": userId });
	};

	Platter.prototype.getPlatterItems = function (platterId) {
		var platterItems = new PlatterItem(platterId);
		return platterItems.getPlatterItems(this.platterId);

		//return $http.post(this.urls.getPlatterItems, { "platterId": platterId });
	};


	return Platter;

}]); //app.factories.factory.Platter