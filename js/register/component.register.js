/*global angular, console */
/*jslint plusplus: true */
'use strict';
angular.module('app').component('register', {
	//NOTE: nothing to bind to because user is attempting to register
	controller: ['$http', '$state', '$mdToast', 'Database', function ($http, $state, $mdToast, Database) {

		var that = this;

		this.person = undefined;
		this.registered = false;

		this.$onInit = function () {};
		this.register = function (person) {
			// that.person = {
			// 	firstName: person.firstName,
			// 	lastName: person.lastName,
			// 	emailAddress: person.emailAddress,
			// 	password: person.password
			// };
			that.person = {
				firstName: "Test Data Firstname",
				lastName: "Test Data Lastname",
				emailAddress: "TestData@EmailAddr.ess",
				password: "Test Data Password"
			};

			var obj = {
				table: 'users',
				fields: [{ name: 'emailAddress'}, { name: 'password' }],
				where: [{ value: that.person.emailAddress }, { value: that.person.password }]
			};
			Database.select2(obj)
				.then(function (response) {
					var resp = response;
					var respdata = response.data;
					if (response.data === "") {
						that.addNewUser();
					} else {
						console.log(person.firstName + ' is found.');
						that.shouldLogin();
					}

					if (response.data.data) {
						if (response.data.data[0] === undefined) {
							that.addNewUser();
						} else {
							console.log(person.firstName + ' is found.');
							that.shouldLogin();
						}
					}

					return response;
				});
		};
		this.addNewUser = function () {
			Database.testPHP();
			// var obj = {
			// 	table: 'users',
			// 	firstName: that.person.firstName,
			// 	lastName: that.person.lastName,
			// 	emailAddress: that.person.emailAddress,
			// 	password: that.person.password,
			// 	role: 6, //guest
			// 	userName: that.person.emailAddress.substr(0, that.person.emailAddress.search("@")),
			// 	lastLogin: new Date(),
			// 	message: 'Tell us something about yourself.',
			// 	lastUpdate: Date.now(),
			// 	status: 1
			// };
			// Database.insert(obj)
			// 	.then(function (response) {
			// 		//debugger;
			// 		that.registered = true;
			// 		//inform the user that the food item is on the platter
			// 		$mdToast.show(
			// 			$mdToast.simple()
			// 			.textContent('Registration successful. Use Login Tab to login.')
			// 			.hideDelay(3000)
			// 		);
			// 		return response;
			// 	});
		};
		this.shouldLogin = function () {};
	}],
	templateUrl: 'partials/register/register.html'
});


