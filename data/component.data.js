//component.data.js
'use strict';

angular.module('app').component('data', {
	controller: function ($state, $http, Session, FileService, Cook, Profile, DataService) {
		var that = this;

		this.dataSets = [
			{ name: 'food', completed: false },
			{ name: 'foodTypes', completed: false }, 
			{ name: 'platters', completed: false },
			{ name: 'platterItems', completed: false },
			{ name: 'profile', completed: false }, 
			{ name: 'menus', completed: false },
			{ name: 'menusPlatters', completed: false },
			{ name: 'menusPlattersPlatterItems', completed: false },
			{ name: 'invitationModes', completed: false }, 
			{ name: 'invitations', completed: false },
			{ name: 'invitationRecipients', completed: false }
		];

		this.$onInit = function () {

			//Initialize the DataService, i.e. does the JSON files exist.
			//DataService.onInit();
		};


		this.getFood = function () {
			DataService.getDataFromDB("userId", "food", Session.id)
				.then(function (response) {
					return response;
				});
		};

	}
}); //component.data.js