/*global angular */
/*jslint plusplus: true */

'use strict';
angular.module('app').component('guestDashboard', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'DynamicDashboardService',
		function ($http, $state, $mdToast, Database, Session, DynamicDashboardService) {

		var that = this;

		/*** Dashboard Header, Body, Footer ***/
		this.Dashboard = undefined;
		this.header = undefined;
		this.menu = undefined;
		this.body = undefined;
		this.footer = undefined;

		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')

		this.$onInit = function () {

			this.Dashboard = DynamicDashboardService;
			this.header = this.Dashboard.header;
			this.header.name = "Guest";
			this.menu = this.header.menu;
			this.body = this.Dashboard.body;
			this.footer = this.Dashboard.footer;

			if (Session.Collections) {
				if (Session.Collections.cooks.length > 0) {
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
		};
	}],
	templateUrl: 'partials/dashboards/guestDashboard/guestDashboard.html'
});