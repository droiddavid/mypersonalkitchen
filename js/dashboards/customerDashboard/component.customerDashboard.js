/*global angular */
/*jslint plusplus: true */

'use strict';
angular.module('app').component('customerDashboard', {
	//NOTE: nothing to bind to at this time.
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'DynamicDashboardService', 
		function ($http, $state, $mdToast, Database, Session, DynamicDashboardService) {

		var that = this;

		/*** Dashboard Header, Body, Footer ***/
		this.Dashboard = this.header = this.menu = this.body = this.footer = undefined;
		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')
		this.message = "";

		this.$onInit = function () {

			that.setHeader();

			if (Session.Collections) {
				if (Session.Collections.cooks.length > 0) {
					debugger;
					that.cooks = Session.Collections.cooks;
					that.message = Session.Collections.cooks.length + " Cooks found.";

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
			} else {
				that.message = "0 Cooks Available.";
			} //if...else Session.Collections

		};

		this.setHeader = function () {
			this.Dashboard = DynamicDashboardService;
			this.header = this.Dashboard.header;
			this.header.name = "Customer";

			//Initialize the men
			this.menu = this.header.menu;
			this.menu.length = 0;
			this.menu.push({ name: 'Profile', url: 'profile' });
			this.menu.push({ name: 'Memberships', url: 'memberships' });

			this.body = this.Dashboard.body;
			this.footer = this.Dashboard.footer;
		};
	}],
	templateUrl: 'partials/dashboards/customerDashboard/customerDashboard.html'
});