'use strict';

angular.module('app').component('invitations', {
	templateUrl: 'partials/invitations/invitations.html',
	controller: [
		'$http', '$state', 'Session', 'ToolbarService', 'InvitationService', function (
		$http, $state, Session, ToolbarService, InvitationService
		) {

		var that = this;

		this.invitations = [];
		this.invitation = {};

		this.$onInit = function () {
			if (!InvitationService.initialized) {
				InvitationService.init();
			} else {
				if (that.invitations === undefined) {
					that.invitations = [];
					that.invitations = InvitationService.invitations;
				} else {
					that.invitations = InvitationService.invitations;
				}
			}

			ToolbarService.init({
				btnPrevious: {
					id: 'btnPrevious',
					class: 'glyphicon glyphicon-chevron-left brand',
					state: 'cookDashboard',
					style: 'color: white;'
				},
				btnBrand: {
					id: 'btnBrand',
					class: 'brand',
					state: 'cookDashboard',
					style: 'color: white;',
					value: 'Flyers'
				},
				menu: [
					{ name: 'HOME (logout)', state: 'index' },
					{ name: 'Memberships', state: 'memberships' },
					{ name: 'Profile', state: 'profile' }
				]
			}); //ToolbarService.init(...)

			that.addInvitationPanel = document.querySelector("#addInvitationPanel");
			that.addInvitationPanel.style.display = "none";

			that.buttonList = document.querySelector("#buttonList");
			that.buttonList.style.display = "block";

		};
		this.hideAddInvitationPanel = function () {
			if (that.buttonList.style.display === "none") {
				that.buttonList.style.display = "block";
			} else { that.buttonList.style.display = "none"; }

			if (that.addInvitationPanel.style.display === "none") {
				that.addInvitationPanel.style.display = "block";
				that.buttonList.style.display = "none";
			} else { that.addInvitationPanel.style.display = "none"; }
		};
		this.view = function (invitation) {
			InvitationService.invitation = invitation;
			that.go('invitationDetail');
		};
		this.go = function (page) {
			$state.go(page);
		};
		this.addInvitation = function () {
			var Invitation = that.invitation;
			Invitation.table = "invitations";
			Invitation.userId = Session.id;
			Invitation.status = 1; //active

			InvitationService.addInvitation(Invitation)
				.then(function (response) {
					that.hideAddInvitationPanel();
					return response;
				});

			that.invitations.push(that.invitation);
		};
	}]
});