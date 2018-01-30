angular.module('app').service('InvitationService', ['$http', 'Session', 'Database', function ($http, Session, Database) {
	'use strict';

	var that = this;

	this.invitations = []; 	//list of invitations
	this.invitation = {};	//current invitation
	this.initialized = false;
	this.messages = [];

	this.init = function () {
		if (that.invitations.length === 0) {
			that.loadInvitations()
				.then(function (response) {
					if (response && response.data && response.data.data) {
						that.invitations = response.data.data;
						that.initialized = true;
					}
				});
		}
	};
	this.loadInvitations = function () {
		return Database.select({
				"table": "invitations",
				"fields": "userId",
				"where": Session.id
			});
	};
	this.getInvitations = function () {
		return that.invitations;
	};
	this.getInvitation = function (id) {
		var invite = that.invitations.find(function (invitation) {
			return invitation.id = id;
		});
		return invite;
	};
	this.getPhotoFileName = function (filename) {
		return $http.get(Session.getFileName(filename));
	};
	this.addInvitation = function (invite) {
		return Database.insert(invite);
	};


}]);