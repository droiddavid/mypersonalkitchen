angular.module('app').component('cooksPlatters', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 
	function ($http, $state, $mdToast, Database, Session) {
		var that = this;

		this.selectedCookId = undefined;

		this.$onInit = function () {
			that.selectedCookId = Session.selectedCookId;

			var obj = {
				table: 'platters',
				fields: 'userId',
				where: that.selectedCookId
			};
			Database.select(obj)
				.then(function (response) {
					that.cooksPlatters = Session.Collections.cooksPlatters = response.data.data;
				});
		};

	}],
	templateUrl: 'partials/components/component.cooksPlatters.html'
});