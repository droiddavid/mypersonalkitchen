'use strict';

angular.module('app').component('invitationsBody', {
	bindings: {
		invites: '<'
	},
	controller: function ($state, Session, Database, InvitationService, dexie) {

		var that = this;

		this.$onInit = function () {

			var i = this.invites;

			//list of invitatoins
			this.invitationList = this.invites;

			InvitationService.Invitations = this.invitationList;


			//Invitation object
			this.invitation = { id: undefined, beginDate: undefined, dateSent: undefined, 
				endDate: undefined, message: undefined, photo_filename: undefined, 
				photo_imageData: undefined, status: undefined, title: undefined, 
				userId: undefined
			};

			// if (InvitationService.Invitation !== undefined) {
			// 	for (var x = 0; x < this.invitationList.length; x++) {
			// 		if (this.invitationList.id === InvitationService.Invitation.id) {
			// 			this.invitation = InvitationService.Invitation;
			// 		}
			// 	}				
			// }

			// if (InvitationService.Invitation !== undefined) {
			// 	this.invitationList.forEach(function (item) {
			// 		if (item.id === InvitationService.Invitation.id) {
			// 			item.photo_imageData = InvitationService.Invitation.photo_imageData;
			// 		}
			// 	});				
			// }

			//Reference to the database.
			this.db = Database;

		};

		//Assign the imageData from localStorage to each photo in the list.
		// this.getPhotoImageData = function (invitationList) {
		// 	invitationList.forEach(function (item) {
		// 		item.photo_imageData = localStorage.getItem(item.photo_filename);
		// 	});
		// };


		//Send filename only.
		//Ex. 02310403, not 02310403.json 
		//this.getImage = function (filename) {



		this.updateImageData = function () {
			that.invites.forEach(function (item) {
				var image_id = InvitationService.Invitation.photo_filename;

				if (image_id === that.invites.photo_filename)
					item.photo_imageData = InvitationService.Invitation.photo_imageData;

			});
			
		};



		this.go = function (sender) {
			//debugger;
			$state.go(sender.state, { 
				data: sender.data,
				invitationId: sender.invitationId
			});
		};



		this.save = function (invitation) {

			var obj = {};
			
			//Add the form's elements to the insert object.
			for (var key in invitation) {
				// skip loop if the property is from prototype
				if (!invitation.hasOwnProperty(key)) continue;			
				obj[key] = invitation[key];
			}

			obj.userId 		= Session.id;
			obj.status 		= 1;
			obj.table 		= "invitations";
			this.invitationList.push(obj);

			//Insert the object into the db.
			that.db.insert(obj)
				.then(function (response) {
					if (response) { //////****************************CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						var retVal = (response.statusText === "OK") ? "Registration Successful" : "Registration Failed";
						return retVal;
					}
				});

		};
		this.update = function (invitation) {
			//debugger;
			var where = {
				"userId" : Session["id"],
				"id" : invitation.id
			};
			var table = "invitations", 
				columnsArray = invitation,
				requiredColumnsArray = Object.keys(invitation);

			this.db.update(table, columnsArray, where, requiredColumnsArray)
				.then(function (response) {
					if (response) { //***CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						var retVal = (response.statusText === "OK") ? "Update Successful" : "Update Failed";

						that.updateFormData(invitation);
						
						return retVal;
					} 
				});
			//var $table, $columnsArray, $where, $requiredColumnsArray
		};

		/*** UTILITIES ***/
		//update the food type dialog box
		this.updateFormData = function (invitation) {
			//debugger;
			that.invitation.id = invitation.id;
			that.invitation.title = invitation.title;
			that.invitation.message = invitation.message;

			var _bDate = new Date(invitation.beginDate);
			that.invitation.beginDate = _bDate;

			var _eDate = new Date(invitation.endDate);
			that.invitation.endDate = _eDate;

			that.invitation.photo_filename = invitation.photo_filename;
			that.invitation.userId = Session.id;
			that.invitation.status = invitation.status;
		};

		/*
			sendAsFacebookMessage(invitation)
			sendAsFacebookFeed(msg)
			shareOnFacebook(msg)
		*/

		//takes a link which should lead to the invitation being sent.
		this.sendAsFacebookMessage = function (invitation) {
			debugger;
			write(invitation, "invitation");
			sendAsFacebookMessage(invitation.message);

			//'http://www.nytimes.com/europe-favorite-streets.html'




		};


	},
	templateUrl: 'partials/invitations/invitations.body.html'
});