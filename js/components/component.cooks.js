angular.module('app').component('cooks', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 
	function ($http, $state, $mdToast, Database, Session) {
		var that = this;

		this.cooks = undefined;

		this.$onInit = function () {
			this.cooks = Session.Collections.cooks;
		};


	}],
	templateUrl: 'partials/components/component.cooks.html'
});