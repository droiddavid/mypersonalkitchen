angular.module('app').factory('Customer', ['$http', 'User', 'Cook', 'Database', function ($http, User, Cook, Database) {
	'use strict';

	//Create sub-class and extend base class.
	Customer.prototype = new User();
	Customer.constructor = Customer;

	function Customer(userId) {
		//Customer.call(this);
		this.personId = userId;
	}; //Customer - constructor function

	var db = Database; //Instantiate the form's database


	//class level instance variables
	Customer.prototype.firstName = "";
	Customer.prototype.lastName = "";
	Customer.prototype.emailAddress = "";
	Customer.prototype.CookCollection = [];
	Customer.prototype.Cook = {
		id: 0,
		firstName: "",
		lastName: "",
		accountType: "",
		emailAddress: "",
		message: "",
		cooks: [],
		foodItems: [],
		platters: [],
		platterItems: [],
		menus: []
	};
	Customer.prototype.Cooks = [];

	Customer.prototype.QUERIES = {
		Cooks: {
			fields: "id", 
			table: "vw_customer_cooks"
		},
		Cooks_Food: {
			fields: "id",
			table: "vw_customer_cooks_food"
		},
		Cooks_Menus: {
			fields: "id",
			table: "vw_customer_cooks_menus"
		},
		Cooks_Menus_foodItems: {
			fields: "id",
			table: "vw_customer_cooks_menus_fooditems"
		},		
		Cooks_Menus_platters: {
			fields: "id",
			table: "vw_customer_cooks_menus_platters"
		},		
		Cooks_Menus_platters_platterItems: {
			fields: "id",
			table: "vw_customer_cooks_menus_platters_platterItems"
		},		
		Cooks_Platters: {
			fields: "id",
			table: "vw_customer_cooks_platters"
		},		
		Cooks_Platters_platterItems: {
			fields: "id",
			table: "vw_customer_cooks_platters_platterItems"
		}
	}; //Customer.prototype.QUERIES



	//Class level instance methods
	Customer.prototype.getCooks = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Food = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Menus = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Menus_foodItems = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Menus_platters = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Menus_platters_platterItems = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Platters = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Platters_platterItems = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};

	Customer.prototype.getCooks_Platters_platterItems = function (customerId, db_view, args) {

		return db.select({
			fields: customerId,
			table: db_view,
			where: args
		});
	};





	Customer.prototype.CustomerMenusWithFoodItems = function (userId) {
		var menu = new Menu(userId);
		return menu.CustomerMenusWithFoodItems(userId);
	};

	Customer.prototype.getMenuPlatters = function (userId) {
		var menu = new Menu(userId);
		return menu.getMenuPlatters(userId);
	};

	Customer.prototype.getMenus = function (personId) {
		var menu = new Menu(personId);
		return menu.getMenus(personId);
	};

	Customer.prototype.getFoodItemsView = function (foodieId) {
		return $http.post(vwfoodiefooditems, { foodieId: foodieId });
	};

	Customer.prototype.getPlattersView = function (userId) {
		return $http.post(db_single_column_base_url, { 
				table: "customerplatters",
				fieldName: "personId",
				fieldValue: userId
			});	
	};

	Customer.prototype.getFoodItems = function (tableName, fieldName_1, fieldValue_1, fieldName_2, fieldValue_2) {
		return $http.post(db_dual_column_base_url, {
			table: tableName,
			firstFieldName: fieldName_1,
			firstFieldValue: fieldValue_1,
			secondFieldName: fieldName_2,
			secondFieldValue: fieldValue_2
		});
	};//food:id, userId, type, name, description, status

	Customer.prototype.getFoodieItems = function (table, firstFieldName, firstFieldValue, secondFieldName, secondFieldValue) {
		return $http.post(db_dual_column_base_url, {
			table: table,
			firstFieldName: firstFieldName,
			firstFieldValue: firstFieldValue,
			secondFieldName: secondFieldName,
			secondFieldValue: secondFieldValue
		});
	};

	return Customer;
}]); //app.factories.factory



