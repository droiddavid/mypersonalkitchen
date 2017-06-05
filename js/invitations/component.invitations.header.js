'use strict';

angular.module('app').component('invitationsHeader', {
	controller: function ($http, $state, Session, Person, FileService) {
		var that = this;

		this.$onInit = function () {
			console.log('component.invitationsHeader...');
			
		};		
		this.go = function (page) {
			$state.go(page);
		};
	},
	templateUrl: 'partials/invitations/invitations.header.html'
});