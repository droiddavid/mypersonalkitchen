'use strict';

angular.module('app').component('invitations', {
	bindings: {
		invitations: '<'
	},
	controller: function ($http, $state, Session, Person, FileService) {
		var that = this;

		this.$onInit = function () {
			console.log('component.invitations...');
			write(this.invitations, 'this.invitations');
			console.log('...component.invitations');
		};		
		this.go = function (page) {
			$state.go(page);
		};
	},
	templateUrl: 'partials/invitations/invitations.html'
});