/* global angular */
/*jslint plusplus: true */
'use strict';

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
				//Send an SMS from HTML5
			};
			this.cancel = function () {
				// $state.go('invitationDetail', {
				// 	"data": that.flyer
				// });
			};
			this.add = function () {
				var _lastUpdate = Date.now();
				//INSERT CONTACT
				var Contact = {
					"table": "contacts",
					"contactName": that.contact.name,
					"lastUpdate": _lastUpdate,
					"status": 1
				};
				//EXISTS?
				ContactsService.getContact("contactName", Contact.contactName)
					.then(function (response) {
						//NO, DOES NOT EXIST?
						if (response.data.status === "warning" && response.data.message === "No data found." && response.data.data.length === 0) {
							//ADD NEW CONTACT
							that.addContact(Contact);
						}
						//YES, EXISTS?
						if (response.data.status === "success") {
							debugger;
							//ContactService.isAMember(Contact)
								// .then(function (response) {

								// });
						}
					});
			};



			this.addContact = function (Contact) {
				//We already know the contact does not exist.  That's how we got here.

				//1. Insert contact into contacts db
				ContactsService.insertContact(Contact)
					.then(function (response) {
						return response;
					})
					.then(function (response) {

						//2. Retrieve the contact from the db to get its ID
						ContactsService.getContact("lastUpdate", Contact.lastUpdate)
							.then(function (response) {
								that.isAMember(response);
							});
					})
			}; //this.addContact
			this.isAMember = function (response) {
				debugger;
				//3. IF WE RETRIEVED A RECORD
				if (response.data.status === "success" && response.data.message === "Data selected from database" && response.data.data.length > 0) {
					debugger;
					var Contact = response.data.data[0];
					var id = Contact.id;

					//4. Check to see is the contact is already a member
					ContactsService.isAMember(Contact)
						.then(function (response) {
							debugger;
							that.AddUsersToContactsRecord(response, Contact);

							if (response.data.status === "success" && response.data.data && response.data.data.length > 0) {
								debugger;
								//8. Contact is already a member.  Add contact details.
								//YES
								ContactsService.addContactDetails(Contacts);
							}
						});
				}
				//2b. IF WE DID NOT RETRIEVE A RECORD
				if (response.data.status === "error") {
					debugger;
					return response;
				}
			};
			this.AddUsersToContactsRecord = function (response, Contact) {
				debugger;
				//5. Contact is not a member
				//NO
				if (response.data.status === "warning" && response.data.message === "No data found." && response.data.data.length === 0) {
					debugger;
					//6. Add the contact as a member
					ContactsService.AddUsersToContactsRecord(Session.id, Contact.id)
						.then(function (response) {

							//7. Then, for each detail, add the contact's details
							debugger;
							//Assign an id to the froms email and phone data
							//ContactsService.addContactDetails requires the contact id.
							that.contact.id = Contact.id;
							ContactsService.addContactDetails(that.contact);
						});
				}

			};
		}]

}); //sendFlyerActivity component