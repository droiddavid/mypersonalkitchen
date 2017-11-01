//js/profile/component.profile.js
'use strict';

angular.module('app').component('profile', {
	templateUrl: "partials/profile/profile.html",
	bindings: {
		profileData: '<'
	},
	controller: [
		'$http', '$state', 'Session', 'Profile', 'ProfileService', 'ToolbarService', 
		function ($http, $state, Session, Profile, ProfileService, ToolbarService) { 
		
		'use strict';

		var that = this;

		//Initialize the component.
		this.$onInit = function () {
			//Create a local profile object based on the array in either the Session collection or the .json file.
			this.profile = this.profileData[0] || {};
			that.initToolbar();
		};

		this.initToolbar = function () {

			ToolbarService.init({
				btnPrevious: {
					id: 'btnPrevious',
					class: 'glyphicon glyphicon-chevron-left brand',
					state: 'cookDashboard',
					style: 'color: white;'
				},
				btnBrand: {
					id: 'btnBrand',
					class: 'brand',
					state: 'cookDashboard',
					style: 'color: white;',
					value: 'Profile'
				},
				menu: [
					{ name: 'HOME (logout)', state: 'index' },
					{ name: 'Memberships', state: 'memberships' }
				]
			}); //ToolbarService.init(...)

		};


		//Update the user's profile.
		this.update = function ( profile ) {

			var obj = {};

			//Add the form's elements to the insert object.
			for (var key in profile) {
				// skip loop if the property is from prototype
				if (!profile.hasOwnProperty(key)) continue;

				// skip loop if the property is the table name.
				if (key === 'table') continue;

				var val = profile[key];

				//If the profile value is blank or empty, assign an empty value
				obj[key] = (val === "") ? "' '" : profile[key];

			}

			var where = {
				"userId" : Session.id
			};

			var table = "profileData", 
				columnsArray = obj,
				requiredColumnsArray = Object.keys(obj);

			//Clear the profile
			Session.Collections.profile.length = 0;

			//Add this profile data to the Session
			Session.Collections.profile.push(profile);


			Profile.update(table, columnsArray, where, requiredColumnsArray)
				.then(function (response) {

					ProfileService.getProfile(Session.id)
						.then(function (response) {
							return Session.Collections.profile = response.data.data;
						})
						.then(function () {
							$http.post('./data/fileWriter.php', { 
								fileName: Session.FileNames.profile + ".json",
								data: Session.Collections.profile
							});

							return Session.Collections.profile;
						}); //write the data to a local file (update current data)\

					return response;

				});

		};


		//Add a new profile for this user.
		this.add = function ( profile ) {
			this.addToDB(profile);
			this.addToSession(profile);

		}; //this.add

		this.addToJSONFile = function (profile) {
			var obj = {};

			//Add the form's elements to the insert object.
			for (var key in profile) {
				// skip loop if the property is from prototype
				if (!profile.hasOwnProperty(key)) continue;			
				obj[key] = profile[key];
			}

			//Add the user's id and the profile table to the object for the db.insert function.
			obj.userId  	= Session.id;


			ProfileService.getProfile(Session.id)
				.then(function (response) {
					return Session.Collections.profile = response.data.data;
				})
				.then(function () {
					$http.post('./data/fileWriter.php', { 
						fileName: Session.FileNames.profile + ".json",
						data: Session.Collections.profile
					});

					debugger;
					return Session.Collections.profile;
				}); //write the data to a local file (update current data)\
		

		};
		


		//Add the new profile to the Session
		this.addToSession = function (profile) {
			Session.Collections.profile.push(profile);
		};


		//Add a new profile to the DB
		this.addToDB = function (profile) {

			//Create an object to hold the form data to be added to the db and .json file.
			var obj = {};

			//Add the form's elements to the insert object.
			for (var key in profile) {
				// skip loop if the property is from prototype
				if (!profile.hasOwnProperty(key)) continue;			
				obj[key] = profile[key];
			}

			//Add the user's id and the profile table to the object for the db.insert function.
			obj.userId  	= Session.id
			obj.table 		= "profileData";

			//Insert the object into the db.
			Profile.addProfile( obj )
				.then(function (response) {
					that.addToJSONFile(profile);
					return response;
				});

		}; //addToDB


	}], //controller
}); //component.profile