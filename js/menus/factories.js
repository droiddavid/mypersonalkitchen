angular.module('app').factory('Menu', ['$http', function ($http) {
	'use strict';
	
	/* Constructor, with class name */
	function Menu(personId) {
		this.personId = personId;
		this.menuId = 0;
		this.title = '';
		this.status = 0;
		this.menus = [];
	};

	var url_base = 'https://' + WEB_SERVER + 'mypersonalkitchen/database/',
		db_single_column_base_url 	= "getDataSingleColumn.php",
		db_dual_column_base_url 	= "getDataDualColumn.php";


	Menu.prototype.CustomerMenusWithFoodItems = function (userId) {
		return $http.post(url_base + db_single_column_base_url, {
			table: "vwCustomerMenusWithFoodItems",
			fieldName: "personId",
			fieldValue: userId
		});
	};


	Menu.prototype.getMenuPlatters = function (userId) {
		return $http.post(url_base + db_single_column_base_url, {
			table: "menuplatters",
			fieldName: "userId",
			fieldValue: userId
		});
	}
	Menu.prototype.getMenus = function (personId) {
		return $http.post(url_base + db_single_column_base_url, { 
				table: "vwcustomermenus",
				fieldName: "personId",
				fieldValue: personId
			});	
	};
	Menu.prototype.getPersonId = function () { return this.personId; };
	Menu.prototype.getTitle = function () { return this.title; };
	Menu.prototype.getStatus = function () { return status; };

	/* Return the constructor function */
	return Menu;
}]);