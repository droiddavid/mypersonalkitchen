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

}]);


angular.module('app').service('Database', ['$http', function ($http) {
	'use strict';

	var baseUrl = 'http://' + WEB_SERVER + '/mypersonalkitchen/database';

	var url = {
		select: baseUrl + '/select.php',
		select2: baseUrl + '/select2.php',
		insert: baseUrl + '/insert.php',
		update: baseUrl + '/update.php',
		delete: baseUrl + '/delete.php',
		delete2: baseUrl + '/delete2.php'
	};

	return this.Database = {
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

}]);


angular.module('app').service('FileService', ['$http', function ($http) {
	//var fileExistUrl = 'http://localhost/mypersonalkitchen/data/fileExists.php';
	var fileExistUrl = 'http://' + WEB_SERVER + '/mypersonalkitchen/data/fileExists.php';
	
	
	this.isFileExists = function (file_name) {
		var that = this;
		this.f = file_name;
		$http.post(fileExistUrl, { fileName: file_name + '.json' })
			.then(function (response) {
				return response.data; //returns "1" or "0"
			})};

}]);


angular.module('app').service('ApplicationMenuService', function($http) { 
	return {
		list: function() {
			return $http.get('./data/ApplicationMenus.json', { cache: true })
				.then(function (resp) {
					return resp.data;
				});
//				.then(resp => resp.data)
		}
	};
});


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
}]);