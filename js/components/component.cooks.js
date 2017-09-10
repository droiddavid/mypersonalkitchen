angular.module('app').component('cooks', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 
	function ($http, $state, $mdToast, Database, Session) {
		var that = this;

		this.cooks = undefined;

		this.$onInit = function () {
			if (Session.Collections) {
				that.cooks = Session.Collections.cooks;	
			}
		};

		this.cookDetails = function (item) {
			$state.go('guestDashboardDetail', { cookUserId: item.userId });
		};

	}],
	templateUrl: 'partials/components/component.cooks.html'
});