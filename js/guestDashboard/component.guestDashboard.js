angular.module('app').component('guestDashboard', {
	//NOTE: nothing to bind to at this time.
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', function ($http, $state, $mdToast, Database, Session) {
		var that = this;

		this.person = undefined;
		this.registered = false;

		this.$onInit = function () {
			console.log('guestDashboard Component controller.');
		};
		this.register = function (person) {

		};
	}],
	templateUrl: 'partials/guestDashboard/guestDashboard.html'
});