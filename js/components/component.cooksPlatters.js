angular.module('app').component('cooksPlatters', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 
	function ($http, $state, $mdToast, Database, Session) {
		var that = this;

		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')
		this.cooksPlatters = undefined;
		this.cooksPlattersPlatterItemsIds = '';
		this.cooksPlattersPlatterItems = [];
		this.sqlInString = '';

		this.$onInit = function () {
			that.cooks = Session.Collections.cooks;

			that.cooks.forEach(function (cook, index) {
				that.sqlInString += cook.userId + ',';
			});
			that.sqlInString = that.sqlInString.substring(that.sqlInString, that.sqlInString.length - 1);

			//List of platters for all cooks in these zip codes
			var objPlatters = { 
				table: 'platters', 
				field: 'userId', 
				fieldList: that.sqlInString 
			};
			Database.selectIn(objPlatters)
				.then(function (response) {
					Session.Collections.cooksPlatters = response.data;
					that.cooksPlatters = Session.Collections.cooksPlatters;

					that.cooksPlatters.forEach(function (platterItem, index) {
						that.cooksPlattersPlatterItemsIds += platterItem.id + ',';
					});
					that.cooksPlattersPlatterItemsIds = that.cooksPlattersPlatterItemsIds.substring(that.cooksPlattersPlatterItemsIds, that.cooksPlattersPlatterItemsIds.length - 1);

					//List of food for all cooks in these zip codes
					var obj = { 
						table: 'platterItems', 
						field: 'platterId', 
						fieldList: that.cooksPlattersPlatterItemsIds
					};
					Database.selectIn(obj)
						.then(function (response) {


							START HERE -- START HERE -- START HERE -- START HERE -- START HERE -- 

							Now that you have the platter ids, you need the food id of each.
							With the food id, select the food item in order to get the food name.
							With the food name, list it on the platter for customer information



						});


					debugger;
				});
		};

	}],
	templateUrl: 'partials/components/component.cooksPlatters.html'
});