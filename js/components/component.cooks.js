angular.module('app').component('cooks', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 
	function ($http, $state, $mdToast, Database, Session) {
		var that = this;

		this.$onInit = function () {
			console.log('Cooks Component $onInit.');
		};


	}],
	templateUrl: 'partials/components/component.cooks.html'
});