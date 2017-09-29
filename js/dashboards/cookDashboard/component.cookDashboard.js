/*global angular */
/*jslint plusplus: true */

'use strict';
angular.module('app').component('cookDashboard', {
	//NOTE: nothing to bind to at this time.
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'ToolbarService',
		function ($http, $state, $mdToast, Database, Session, ToolbarService) {

		var that = this;

		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')

		this.$onInit = function () {

			that.initToolbar();

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

		this.initToolbar = function () {
			var toolbar = {};

			toolbar.buttons = [];
			toolbar.buttons.push({
				text: 'test'
			});

			toolbar.label = '';

			toolbar.leftButton = {};
			toolbar.leftButton.label = '<'; //icon button
			toolbar.leftButton.url = 'stateGoesHere';

			toolbar.title = 'Cook';
			toolbar.name = 'cookDashboard';

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
			ToolbarService.init(toolbar);
		};
	}],
	templateUrl: 'partials/dashboards/cookDashboard/cookDashboard.html'
});