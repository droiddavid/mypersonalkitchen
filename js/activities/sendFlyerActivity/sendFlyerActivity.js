angular
	.module('app')
	.component('sendFlyerActivity', {
		templateUrl: 'partials/activities/sendFlyerActivity/sendFlyerActivity.html',
		controller: [
			'$http', '$state', '$stateParams', 
			'Session', 'Database', 'ToolbarService', 'InvitationService', function (
			$http, $state, $stateParams, 
			Session, Database, ToolbarService, InvitationService
		) {

			'use strict'; 

			var that = this;

			this.flyer = {};
			this.mode = "";
			this.invitation = undefined;
			this.recipients = []; //a list of recipients for THIS flyer (RecipientServcie needed?)
			this.recipient = {
				"name": undefined,
				"phone": undefined,
				"message": undefined
			};

			this.$onInit = function () {
				if (InvitationService && InvitationService.invitation) {
					that.invitation = InvitationService.invitation;
				}
				if ($stateParams && $stateParams.data && $stateParams.data.flyer) {
					that.flyer = $stateParams.data.flyer;
					that.mode = $stateParams.data.mode;
				}
				ToolbarService.init({
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'invitationDetail',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'invitationDetail',
						style: 'color: white;',
						value: 'New Flyer' //'Send Flyer: ' + that.flyer.title
					},
					menu: [
						{ name: 'HOME (logout)', state: 'index' },
						{ name: 'Invitations', state: 'invitations' },
						{ name: 'Memberships', state: 'memberships' },
						{ name: 'Profile', state: 'profile' }
					]
				}); //ToolbarService.init(...)
			};
			this.send = function () {
				debugger;
				//Send an SMS from HTML5

			};
			this.cancel = function () {
				debugger;
				// $state.go('invitationDetail', {
				// 	"data": that.flyer
				// });
			};
		}]

}); //sendFlyerActivity component