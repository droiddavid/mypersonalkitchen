/*global angular */
/*jslint plusplus: true */

'use strict';
angular.module('app').component('cookDashboard', {
	templateUrl: 'partials/dashboards/cookDashboard/cookDashboard.html',
	controller: [
		'USER_ROLES', '$http', '$state', '$rootScope', '$mdToast', 
		'Database', 'Session', 'ToolbarService', 
		'FoodService', 'FoodTypeService',
		'PlatterService', 'PlatterItemService',
		'InvitationService', 'ContactsService', 
		function (
			USER_ROLES, $http, $state, $rootScope, $mdToast, 
			Database, Session, ToolbarService, 
			FoodService, FoodTypeService,
			PlatterService, PlatterItemService, 
			InvitationService, ContactsService) {

		var that = this;

		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')
		this.messages = [];
		this.count = 0;

		this.$onInit = function () {

			//Initialize the cook's data
			if (!FoodTypeService.initialized) { FoodTypeService.init(); }
			if (!FoodService.initialized) { FoodService.init(); }
			if (!PlatterService.initialized) { PlatterService.init(); }
			if (!PlatterItemService.initialized) { PlatterItemService.init(); }
			if (!InvitationService.initialized) { InvitationService.init(); }
			if (!ContactsService.initialized) { ContactsService.init(); }


			ToolbarService.init({
				btnBrand: {
					id: 'btnBrand',
					class: 'brand',
					state: 'cookDashboard',
					style: 'color: white;',
					value: 'Cook'
				},
				menu: [
					{ name: 'HOME', state: 'index' },
					{ name: 'Profile', state: 'profile' },
					{ name: 'Memberships', state: 'memberships' }
				]
			}); //ToolbarService.init(...)

			/*
				GET THE COOKS FOR THIS "COOK" USER IN THE LIST OF ZIPCODES.
				1. Determine if cook collection exists.
				2. Build a list of cook ids.
				3. Create an SQL object.
				4. Select data from the table.
				5. Return the response. */
			if (Session) {
				if (Session.Collections) {
					if (Session.Collections.cooks) {
						that.cooks = Session.Collections.cooks;

						that.cooks.forEach(function (cook) {
							that.sqlInString += cook.userId + ',';
						});
						that.sqlInString = that.sqlInString.substring(that.sqlInString, that.sqlInString.length - 1);

						//List of food for all cooks in these zip codes
						var obj = { 
							table: 'food', 
							field: 'userId', 
							fieldList: that.sqlInString  //csv list of zip codes
						};
						Database.selectIn(obj)
							.then(function (response) {
								Session.Collections.cooksFood = response.data;
							});			
					}					
				}
			}
		};

		this.go = function (state) {
			$state.go(state);
		};
	}]
});