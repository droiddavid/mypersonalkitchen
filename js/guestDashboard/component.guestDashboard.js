angular.module('app').component('guestDashboard', {
	//NOTE: nothing to bind to at this time.
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', function ($http, $state, $mdToast, Database, Session) {
		var that = this;

		this.cooks = undefined;
		this.sqlInString = ''; //list of cook userIds ('999', '999', '999')

		this.$onInit = function () {

			that.cooks = Session.Collections.cooks;

			that.cooks.forEach(function (cook, index) {
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

		};
	}],
	templateUrl: 'partials/guestDashboard/guestDashboard.html'
});