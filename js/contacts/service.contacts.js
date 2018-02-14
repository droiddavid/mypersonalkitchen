/* global angular */
/*jslint plusplus: true */
'use strict';

angular.module('app').service('ContactsService', [
	'$http', '$state', 'Session', 'Database',
	function ($http, $state, Session, Database) {
	var that = this;

	this.Contacts = undefined;
	this.Contact = {};

	this.UsersToContacts = undefined;
	this.UserToContact = {};

	this.ContactDetails = undefined;
	this.ContactDetail = {};

	this.proxyCORS = "https://cors-anywhere.herokuapp.com/";

	this.initialized = false;

	this.init = function () {
		if (!that.initialized) {
			that.getData();
		}
	};

	this.junctionIDs = [];
	this.getData = function () {
		//First get the user's contacts,
		that.getContacts(Session.id)
			.then(function (response) {
				if (response && response.data && response.data.data) {
					that.Contacts = response.data.data;
					debugger;
				}
			})

		//Then, get the user's junction data,
		.then(function () {
			that.getUsersToContacts()
				.then(function (response) {
					if (response && response.data && response.data.data) {
						that.UsersToContacts = response.data.data;
						debugger;
					}
				})
		})

		//Then, get the contactDetails for each contactId in the junction data,
		.then(function () {
			if (!that.UsersToContacts) {
				that.getUsersToContacts()
					.then(function (response) {
						if (response && response.data && response.data.data) {
							that.UsersToContacts = response.data.data;
							debugger;
						}
					})
			} else {
				that.UsersToContacts.forEach(function (UsersToContactsRecord, index) {
					that.junctionIDs.push(UsersToContactsRecord.contactId);
					debugger;
				});
			}

		})

		.then(function () {
			debugger;
			if (that.junctionIDs.length > 0) {
				Database.selectIn({
					"table": "contactDetails",
					"field": "contactId",
					"fieldList": that.junctionIDs
				})
				.then(function (response) {
					if (response && response.data && response.data.data) {
						that.ContactDetails = response.data.data;
						debugger;
					}
					that.initialized = true;
				});			
			}
	
		});
	};

	this.getUsersToContacts = function () {
		return Database.getData("userstocontacts", "userId", Session.id);
	};

	this.getContacts = function () {
		return Database.select({
			"table": "vw_contacts",
			"fields": "users_id",
			"where": Session.id
		});
	};

	// this.getContact = function (id) {
	// 	if (that.Contacts && that.Contacts.length > 0) {
	// 		return that.Contacts.find(function (contact) {
	// 		return contact.id === id;
	// 		});
	// 	} else {
	// 		return Database.select({
	// 			table: "contacts",
	// 			fields: "id",
	// 			where: id
	// 		});
	// 	}
	// };

	this.getContactByLastUpdate = function (lastUpdate) {
		return Database.select({
			"table": "contacts",
			"fields": "lastUpdate",
			"where": lastUpdate
		});
	};

	this.getContact = function (fields, where) {
		return Database.select({
			"table": "contacts",
			"fields": fields,
			"where": where
		});
	};

	this.isAMember = function (Contact) {
		return Database.getData("userstocontacts", "contactId", Contact.id);
	};

	this.AddUsersToContactsRecord = function (UserId, ContactId) {
		var obj = {};
		obj.table = "userstocontacts";
		obj.userId = UserId;
		obj.contactId = ContactId;
		return Database.insert(obj);
	};

	this.numVerify = function (phoneNumber) {
		var url = {
			"url": that.proxyCORS + 'http://apilayer.net/api/validate?',
			"access_key": '046d61f48ad7888e6e360d8d5eb034a4',
			"number": phoneNumber,
			"country_code": '',
			"format": 1
		};

		var data = url.url + 'access_key=' + url.access_key + '&number=1' + phoneNumber + '&country_code=' + '&format=' + 1;
		return $http.get(data);
	};

	this.addContactDetails = function (contact) {
		var Email = {
			"contactId": contact.id,
			"contactType": "email",
			"contactValue": contact.emailAddress
		};
		//1. Search db for phone number.
		//2. If not found
		//3.		numVerify
		//4.		then add to db
		//5.	Otherwise (it WAS found in the db)
		//6. 	isValid?
		//7.			If not,
		//8.				has numverify been attempted?
		//9.				if yes, send msg... number invalid 
		//10.			no numVerify

			//return phone and phoneDetails objects

		var Phone = {
			"contactId": contact.id,
			"contactType": "phone",
			"contactValue": contact.phone
		};

		that.numVerify(contact.phone)
			.then(function (response) {
				var resp = response;
				debugger;
			})
			.then(function (response) {
				var PhoneDetails = {
					"contactId": contact.id,
					"contactType": "PhoneDetails",
					"contactValue": PhoneDetails.phoneDetails
				};
				// var SMSAddress = {
				// 	"contactId": contact.id,
				// 	"contactType": "smsAddress",
				// 	"contactValue": contact.smsAddress
				// };
				//that.insertContactDetail(SMSAddress)
			});

		
		that.insertContactDetail(Email)
		that.insertContactDetail(Phone)
		
	};

	that.insertContactDetail = function (contactDetail) {
		return Database.insert({
			"table": "contactDetails",
			"contactId": contactDetail.contactId,
			"contactType": contactDetail.contactType,
			"contactValue": contactDetail.contactValue
		});
	};

	this.insertContact = function (Contact) {
		return Database.insert(Contact);
	};

	this.updateContact = function (Contact) {
		return Database.update(Contact);
	};

	this.deleteContact = function (Contact) {
		return Database.delete(Contact);
	};

}]);//ContactsService