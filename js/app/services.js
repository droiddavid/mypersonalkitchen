/* js/services.js */
angular.module('app').service('Session', ['$log', '$rootScope', 'Cook', 'Customer', 'AUTH_EVENTS', 'USER_ROLES', function ($log, $rootScope, Cook, Customer, AUTH_EVENTS, USER_ROLES) {
	'use strict';

	var id, userId, role, customer, cook, currentUser,
		that = this, 

		//if User is a Cook
		FoodCollection,
		FoodTypes, 
		PlatterCollection, 
		PlatterItemCollection,
		MenuCollection,
		vw_cook_menus,
		MenusPlattersCollection,
		Menus_Platters_PlatterItems,
		InvitationModes,
		Invitations,
		InvitationRecipients,
		

		//if User is a Customer
		Customer_Cooks,
		Customer_Cooks_Food,
		Customer_Cooks_Menus,
		Customer_Cooks_Menus_foodItems,
		Customer_Cooks_Menus_platters,
		Customer_Cooks_Menus_platters_platterItems,
		Customer_Cooks_Platters,
		Customer_Cooks_Platters_platterItems,
		CustomerShoppingCart,
		foodie; //represents the current user as a foodie.

	this.createGuest = function (Guest) {
		this.id = Guest.id;
		this.firstName = Guest.firstName;
		this.lastName = Guest.lastName;
		this.role = Guest.role;
		this.GuestName = Guest.GuestName;
		this.password = Guest.password;
		this.emailAddress = Guest.emailAddress;
		this.lastLogin = Guest.lastLogin;
		this.message = Guest.message;
		this.selectedCookId = 0; //Holds the selected cook's id for guestDashboardDetails
		this.Collections = {
			cooks: [],
			cooksFood: [],
			cooksPlatters: []
		};
		this.FileNames = {
			cooks: 'cooks'
		};
		this.filenames = [
			'cooks'
		];
		this.getFileName = function (filename) {
			var ext_begin = './data/', ext_end = '.json',
				directory_and_file = ext_begin + filename + ext_end;
			return directory_and_file; 
		};
		console.log('Guest created!');
	};

	this.createUser = function (User) {
		this.id = User.id;
		this.firstName = User.firstName;
		this.lastName = User.lastName;
		this.role = User.role;
		this.userName = User.userName;
		this.password = User.password;
		this.emailAddress = User.emailAddress;
		this.lastLogin = User.lastLogin;
		this.message = User.message;
		this.Collections = {
			food: [],
			foodTypes: [],
			platters: [],
			platterItems: [],
			profile: [],
			menus: [],
			menusPlatters: [],
			menusPlattersPlatterItems: [],
			invitationModes: [],
			invitations: [],
			invitationRecipients: []
		};
		this.FileNames = {
			food: 'food',
			foodTypes: 'foodTypes', 
			platters: 'platters', 
			platterItems: 'platterItems',
			profile: 'profile',
			menus: 'menus',
			menusPlatters: 'menusPlatters',
			menusPlattersPlatterItems: 'menusPlattersPlatterItems',
			invitationModes: 'invitationModes',
			invitations: 'invitations',
			invitationRecipients: 'invitationRecipients'
		};
		this.filenames = [
			'food',
			'foodTypes', 
			'platters', 
			'platterItems',
			'profile',
			'menus',
			'menusPlatters',
			'menusPlattersPlatterItems',
			'invitationModes',
			'invitations',
			'invitationRecipients'
		];
		this.getFileName = function (filename) {
			var ext_begin = './data/', ext_end = '.json',
				directory_and_file = ext_begin + filename + ext_end;
			return directory_and_file; 
		};
	};

	this.create = function (sessionId, userId, role) {
		this.id = sessionId;
		this.userId = userId;
		this.role = role;
	};

	this.destroy = function (sessionId, userId, role) {
		this.id = null;
		this.userId = null;
		this.role = null;
	};

}]); //app.service.Session
angular.module('app').service('ProfileService', ['$http', 'Database', 'Session', function ($http, Database, Session) {
	var db = Database;

	this.getProfile = function (id) {
		return db.select({ fields: "userId", table: "profileData", where: id})
	};

}]); //service.ProfileService
angular.module('app').service('Database', ['$http', function ($http) {
	'use strict';
	//development baseUrl
	//var baseUrl = 'http://' + WEB_SERVER + '/mypersonalkitchen/database';

	//production baseUrl
	var baseUrl = 'https://' + WEB_SERVER + '/database';

	var url = {
		select: baseUrl + '/select.php',
		select2: baseUrl + '/select2.php',
		selectIn: baseUrl + '/selectIn.php',
		insert: baseUrl + '/insert.php',
		update: baseUrl + '/update.php',
		delete: baseUrl + '/delete.php',
		delete2: baseUrl + '/delete2.php'
	};

	return this.Database = {
		getData: function (table, fields, where) {
			return $http.post(url.select, {
				"table": 	table,
				"fields": 	fields,
				"where": 	where
			});
		},
		select: function (obj) {
			return $http.post(url.select, {
				fields: 	obj.fields,
				table: 		obj.table,
				where: 		obj.where
			});
		},
		select2: function (obj) {
			return $http.post(url.select2, {
				table: obj.table,
				firstFieldName: obj.fields[0].name,
				firstFieldValue: obj.where[0].value,
				secondFieldName: obj.fields[1].name,
				secondFieldValue: obj.where[1].value
			});
		},
		selectIn: function (obj) {
			return $http.post(url.selectIn, {
				table: obj.table,
				field: obj.field,
				fieldList: obj.fieldList
			});
		},
		insert: function (obj) {
			return $http.post(url.insert, obj);
		},
		delete: function (obj) {
			return $http.post(url.delete, {
				fieldName: 	obj.fieldName,
				table: 		obj.table,
				fieldValue: obj.fieldValue
			});
		},
		delete2: function (obj) {
			//debugger;
			return $http.post(url.delete2, {
				table: obj.table,
				firstFieldName: obj.firstFieldName,
				firstFieldValue: obj.firstFieldValue,
				secondFieldName: obj.secondFieldName,
				secondFieldValue: obj.secondFieldValue
			});
		},
		update: function (table, columnsArray, where, requiredColumnsArray) {

			return $http.post(url.update, {
				table: table, 
				columnsArray: columnsArray, 
				where: where, 
				requiredColumnsArray: requiredColumnsArray
			});
		},
		//Build a select statement based on a form's fields and a fieldList of required fields.
		buildSelect: function (formFields, table, fieldList) {

			var select = {
				fields: [],
				table: table,
				where: [], //Change this to match the query's where clause.
				requiredFields: fieldList
			};

			for (var fieldName in formFields) {

				if (formFields.hasOwnProperty(fieldName)) {

					select.requiredFields.forEach(function (requiredField) {

						if (requiredField === fieldName) {

							select.fields.push({
								name: fieldName
							});
							select.where.push({
								name: fieldName,
								value: formFields[fieldName]
							});

						} //if

					}); //forEach

				} //if

			} //for

			return select;
		} //buildSelect

	}; // this.Database

}]); //service.Database
angular.module('app').service('FileService', ['$http', function ($http) {
	//var fileExistUrl = 'http://localhost/mypersonalkitchen/data/fileExists.php';
	var fileExistUrl = 'https://' + WEB_SERVER + '/data/fileExists.php';
	
	
	this.isFileExists = function (file_name) {
		var that = this;
		this.f = file_name;
		$http.post(fileExistUrl, { fileName: file_name + '.json' })
			.then(function (response) {
				return response.data; //returns "1" or "0"
			})};

}]); //service.FileService
angular.module('app').service('ApplicationMenuService', function($http) { 
	return {
		list: function() {
			return $http.get('./data/ApplicationMenus.json', { cache: true })
				.then(function (resp) {
					return resp.data;
				});
		}
	};
}); //service.ApplicationMenuService
angular.module('app').service('DashboardService', ['$http', 'Session', function ($http, Session) {
	var self = this,
		Platters = [],
		food 			= Session.Collections.food,
		foodTypes  		= Session.FoodTypes,
		platters 		= Session.PlatterCollection,
		platterItems 	= Session.PlatterItemCollection,
		menus 			= Session.MenuCollection,
		Menus_Platters_PlatterItems = Menus_Platters_PlatterItems,
		menu 			= {};
		platter 		= {};
}]); //service.DashboardService
angular.module('app').service('DynamicDashboardService', [function () {
	this.header = {
		name: 'Guest',
		menu: [
			{
				name: 'menuItem',
				url: 'menuItemUrl'
			}
		]
	};
}]); //service.DynamicDashboardService
angular.module('app').service('ToolbarService', [function () {

	var that = this;

	this.btnPrevious = {};
	this.btnBrand = {};
	this.menu = {};

	this.init = function (toolbar) {

		that.btnPrevious = toolbar.btnPrevious;
		that.btnBrand = toolbar.btnBrand;
		that.menu = toolbar.menu;

	};

}]); //service.ToolbarService
angular.module('app').service('ToolbarPreviousPageService', [function () {

	var that = this;

	this.btnPrevious = {};
	this.btnBrand = {};
	this.menu = {};

	this.init = function (toolbar) {

		that.btnPrevious = toolbar.btnPrevious;
		that.btnBrand = toolbar.btnBrand;
		that.menu = toolbar.menu;

	};

}]); //service.ToolbarPreviousPageService
angular.module('app').service('FoodItemListService', ['$state', '$stateParams', '$rootScope', 'Database', 'Session', function ($state, $stateParams, $rootScope, Database, Session) {
	'use strict';

	var that = this;
	this.FoodItems = [];
	this.foodType = undefined;

	this.init = function (foodType) {
	};

	this.getFoodType = function () {
		return that.foodType;
	};
	this.setFoodType = function (foodType) {
		that.foodType = foodType;
	};
	this.addFoodItem = function (foodItem) {
		that.FoodItems.push(foodItem);
	};
	this.getFoodItems = function (foodType) {
		return that.FoodItems;
	};
	this.resetFoodItems = function () {
		if (that.FoodItems)
			that.FoodItems.length = 0;
	};
}]); //service.FoodItemListService
angular.module('app').service('PhotoService', ['$http', function ($http) {
	var that = this;

	this.init = function () {
		debugger;
	};
}]); //service.PhotoService
angular.module('app').service('FoodService', ['$http', '$rootScope', 'Session', 'Database', function ($http, $rootScope, Session, Database) {
	var that = this;

	this.Food = [];			//List of food items.
	this.initialized = false;

	this.init = function () {
		if(!that.initialized) {
			that.loadFood().then(function (response) {
				if (response && response.data && response.data.data) {
					that.Food = response.data.data;
					that.initialized = true;

					$rootScope.$broadcast('FoodService.loaded');
				}
			});
		}
	};
	this.loadFood = function () {
		return Database.select({
			table: "food",
			fields: "userId",
			where: Session.id
		})
	};
	this.getFood = function () {
		return that.Food;
	};
}]); //service.FoodService