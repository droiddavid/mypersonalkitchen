angular.module('app').component('contacts', {
	templateUrl: 'partials/contacts/contacts.html',
	controller: [
	'$http', '$state', '$stateParams', 'Session', 'Database','ToolbarService', 'ContactsService', 
	function (
	$http, $state, $stateParams, Session, Database, ToolbarService, ContactsService) {
		'use strict';

		var that = this;
		this.messages = [];

		this.Contacts = [];

		this.$onInit = function () {           
			ToolbarService.init({
				btnPrevious: {
					id: 'btnPrevious',
					class: 'glyphicon glyphicon-chevron-left brand',
					state: 'sendFlyerActivity',
					style: 'color: white;'
				},
				btnBrand: {
					id: 'btnBrand',
					class: 'brand',
					state: 'sendFlyerActivity',
					style: 'color: white;',
					value: 'Contacts'
				},
				menu: [
					{ name: 'HOME (logout)', state: 'index' },
					{ name: 'Invitations', state: 'invitations' },
					{ name: 'Memberships', state: 'memberships' },
					{ name: 'Profile', state: 'profile' }
				]
			}); //ToolbarService.init(...)

			if (ContactsService.Contacts && ContactsService.Contacts.length > 0) {
				that.configureContacts(ContactsService.Contacts);
			}
		};
		this.contactIDs = undefined;
		this.configureContacts = function (Contacts) {
			//A single contact
			var contact = {
				"id":  undefined,
				"contactName": undefined,
				"details": []
			};

			contact.id = Contacts[0].contacts_id;
			contact.contactName = Contacts[0].contactName;

			//List of contactIDs and UserIds
			var userstocontacts = selectDistinct(Contacts, "userstocontacts_contactId");

			//Build a list of distinct contacts
			var distinctContacts = [];
			userstocontacts.forEach(function (contact, index) {
				var contact = {
					"id":  contact.userstocontacts_contactId,
					"contactName": undefined,
					"details": []
				};
				distinctContacts.push(contact);
			});

			//For each contact, get the contact properties from the Contacts argument.
			distinctContacts.forEach(function (distinctContact, index) {
				Contacts.forEach(function (contact, ndx) {
					//Get the contact.db data
					if (distinctContact.id === contact.contacts_id) {
						distinctContact.contactName = contact.contactName;
					}
					//Get the contactDetails.db data
					if (distinctContact.id === contact.contactId) {
						distinctContact.details.push({
							"contactType": contact.contactType,
							"contactValue": contact.contactValue
						});
					};
				});
			});

			that.Contacts = distinctContacts;
		};
		this.addContact = function () {
			$state.go('addContactActivity');
		};
	}]
});











