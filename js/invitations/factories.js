angular.module('app').factory('Invitation', ['$http', 'Database', function ($http, Database) {
	'use strict';

	var status = 0;

	function Invitation() {
		/* Public properties, assigned to the instance ('this') */
		this.id = '';
		this.userId = 0;

		this.title = '';
		this.message = '';
		this.sender = '';
		this.recipient = {};

		this.firstName = '';
		this.lastName = '';
		this.recipients = [];

		this.response = '';
		this.dateSent = '';
		this.modeId = 0;

		var baseUrl = 'http://' + WEB_SERVER + '/mypersonalkitchen/database';
		this.urls = {
			"getInvitations":					baseUrl + '/getInvitations.php',
			"getInvitationModes":				baseUrl + '/getInvitationModes.php',
			"getInvitationRecipients":			baseUrl + '/getInvitationRecipients.php',
			"getInvitationRecipientsView":		baseUrl + '/getInvitationRecipientsView.php',
			"addInvitation":					baseUrl + '/addInvitation.php',
			"getMaxInvitationId":				baseUrl + '/getMaxInvitationId.php',
			"getMaxPersonIdByEmailAddress":		baseUrl + '/getMaxPersonIdByEmailAddress.php',
			"addRecipient":						baseUrl + '/addRecipient.php'
		};
	};

	var db = Database; //Instantiate the form's database

	Invitation.prototype.getUserId = function () { return this.userId; };
	Invitation.prototype.setUserId = function (id) { this.userId = id; };



	Invitation.prototype.addInvitation = function (obj) {
		return db.insert(obj);
//		return $http.post(this.urls.addInvitation, invite);
	};
	Invitation.prototype.getHeaderId = function (userId) {
		return $http.post(this.urls.getMaxInvitationId, userId);
	};
	Invitation.prototype.getMaxPersonIdByEmailAddress = function (emailAddress) {
		return $http.post(this.urls.getMaxPersonIdByEmailAddress, emailAddress);
	};
	Invitation.prototype.addRecipient = function (recipient) {
		return $http.post(this.urls.addRecipient, recipient); 
	};
	
	Invitation.prototype.getInvitationModes = function () {
		return $http.post(this.urls.getInvitationModes);
	};
	
	Invitation.prototype.getInvitations = function (userId) {
		return $http.post(this.urls.getInvitations, {userId: userId});
	};

	Invitation.prototype.getInvitationRecipients = function (userId) {
		return $http.post(this.urls.getInvitationRecipients, {userId: userId});
	};

	Invitation.prototype.getInvitationRecipientsView = function (userId) {
		return $http.post(this.urls.getInvitationRecipientsView, {userId: userId});
	};

	return Invitation;

}]); //app.factories.factory.Invitation