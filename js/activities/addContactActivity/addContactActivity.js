angular
	.module('app')
	.component('addContactActivity', {
		templateUrl: 'partials/activities/addContactActivity/addContactActivity.html',
		controller: [
			'$http', '$state', '$stateParams', 
			'Session', 'Database', 'ToolbarService', 'ContactsService', function (
			$http, $state, $stateParams, 
			Session, Database, ToolbarService, ContactsService
		) {

			'use strict'; 

			var that = this;

			this.contacts = []; //a list of contacts
			this.contact = {
				"name": undefined,
				"phone": undefined,
				"emailAddress": undefined
			};	//a single contact

			this.$onInit = function () {
				if (ContactsService && ContactsService.contact) {
					that.contact = ContactsService.contact;
				}
				ToolbarService.init({
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'contacts',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'contacts',
						style: 'color: white;',
						value: 'New Contact'
					},
					menu: [
						{ name: 'HOME (logout)', state: 'index' },
						{ name: 'Invitations', state: 'invitations' },
						{ name: 'Memberships', state: 'memberships' },
						{ name: 'Profile', state: 'profile' }
					]
				}); //ToolbarService.init(...)
			};
			this.contacts = function () {
				$state.go('contacts');
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
			this.add = function () {
				debugger;
				/*
					1. Insert a new contact into contact.db
					2. Select the new contact and obtain its id
				
				
						Database.select({ fields: "lastUpdate", table: "platters", where: Platter.lastUpdate })
						.then(function (response) {
			
				
				*/
				var _lastUpdate = Date.now();
				var Contact = {
					"table": "contacts",
					"contactName": that.contact.name,
					"lastUpdate": _lastUpdate,
					"status": 1
				};
				Database.insert(Contact)
					.then(function (response) {
						debugger;
						if (response) {
							Database.select({
								"table": "contacts",
								"fields": "lastUpdate",
								"where": _lastUpdate
							})
							.then(function (response) {
								if (response && response.data && response.data.data) {
									that.contact = response.data.data;
									debugger;
								}
							});
						}
					});
			};
		}]

}); //sendFlyerActivity component