/*global angular */
/*jslint plusplus: true */

'use strict';
angular.module('app').component('customerDashboard', {
	templateUrl: 'partials/dashboards/customerDashboard/customerDashboard.html',
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'ToolbarService', 
		function ($http, $state, $mdToast, Database, Session, ToolbarService) {

		var that = this;

		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')
		this.message = "";
		this.buttons = [];

		this.$onInit = function () {

			that.initToolbar();

			if (Session.Collections) {
				if (Session.Collections.cooks) {
					if (Session.Collections.cooks.length > 0) {
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
								//debugger;
								Session.Collections.cooksFood = response.data;
							});			
					} else {
						that.message = "Cooks count is less equals zero. \r\n Enter your zip code above to search for cooks in your area.";
					} //Session.Collections.cooks.length > 0
				} else {
					that.message = "No Cooks Available.<br />Enter your zip code above to search for cooks in your area.";
				} //Session.Collections.cooks
			} else {
				that.message = "No Collections Available.<br />Enter your zip code above to search for cooks in your area.";
			} //Session.Collections

		};

		this.initToolbar = function () {
			var toolbar = {};

			toolbar.buttons = [];
			toolbar.buttons.push({
				text: 'test'
			});

			toolbar.label = '';

			toolbar.leftButton = {};
			toolbar.leftButton.label = null; //icon button
			toolbar.leftButton.url = null;

			toolbar.title = 'Customer';
			toolbar.name = 'customerDashboard';

			toolbar.menu = [];
			toolbar.menu.push({
				state: 'profile', //url
				label: 'Profile',
				sronly: '(current)'
			});
			toolbar.menu.push({
				state: 'memberships', //url
				label: 'Memberships',
				sronly: ''
			});
			toolbar.menu.push({
				state: 'cookDashboard', //url
				label: 'Upgrade To Cook',
				sronly: ''
			});
			ToolbarService.init(toolbar);
		};

	}]
});