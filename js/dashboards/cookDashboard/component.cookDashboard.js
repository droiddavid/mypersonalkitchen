/*global angular */
/*jslint plusplus: true */

'use strict';
angular.module('app').component('cookDashboard', {
	templateUrl: 'partials/dashboards/cookDashboard/cookDashboard.html',
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'ToolbarService',
		function ($http, $state, $mdToast, Database, Session, ToolbarService) {

		var that = this;

		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')

		this.$onInit = function () {

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

			/*	1. Determine if cook collection exists.
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
							fieldList: that.sqlInString 
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