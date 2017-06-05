'use strict';

angular.module('app').component('invitationDetail', {
	bindings: {
		invitation: '<'
	},
	controller: function ($http, $state, $stateParams, Session, InvitationService, shoppingCart) {
		var that = this;

		this.Invitation = undefined;
		this.shoppingCart = shoppingCart;

		this.$onInit = function () {
			write($stateParams.data, '$stateParams.data');
			write($stateParams.invitationId, '$stateParams.invitationId');

			//component.invitation.detail.js
			InvitationService.getInvitation($stateParams.invitationId)
				.then(function (response) {
					//debugger;
					that.Invitation = response.data.data[0];
				});
		};		

		this.go = function (page) {
			$state.go(page);
		};

		this.addToCart = function (invitation) {
			that.shoppingCart.add(invitation);
		};
	},
	templateUrl: 'partials/invitations/invitation.detail.html'
});