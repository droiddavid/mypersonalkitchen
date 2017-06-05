angular.module('app').service('InvitationService', ['$http', 'Database', function ($http, Database) {
	'use strict';

	this.Invitations = []; //list of invitations
	this.Invitation = undefined; //current invitation


	this.getPhotoFileName = function (filename) {
		return $http.get(Session.getFileName(filename));
	}


	this.getInvitations = function (userId) {
		console.log('Getting invitations by userId: ' + userId);
	}; //getInvitations


	this.getInvitation = function (id) {

		return Database.select({ fields: 'id', table: "invitations", where: id })

	}; //getInvitation


	return this;

}]); //angular.module('app').service('InvitationService'