'use strict'; 
// console.log('js/updates/component.updates.js');

angular.module('app').component('updates', {
	controller: function ($state, $http, Session, ProfileService) {
		var that = this;

		this.$onInit = function () {
			// console.log("component.data.js");
		};

		this.update = function (collectionToUpdate) {
			// write(collectionToUpdate, 'collectionToUpdate');

			ProfileService.getProfile(Session.id)
				.then(function (response) {
					Session.Collections.profile = response.data.data;
				})
				.then(function () {
					$http.post('./data/fileWriter.php', { 
						fileName: Session.FileNames.profile + ".json",
						data: Session.Collections.profile
					});
				}); //write the data to a local file (update current data)\
		};
	},
	templateUrl: 'partials/updates/updates.html'
});