/*global angular, console */
/*jslint plusplus: true */
'use strict';
angular.module('app').component('register', {
	//NOTE: nothing to bind to because user is attempting to register
	controller: ['$http', '$state', '$mdToast', 'Database', function ($http, $state, $mdToast, Database) {

		var that = this;

		this.person = undefined;
		this.registered = false;


		this.$onInit = function () {
			that.person = {
				firstName: "David",
				lastName: "Davis",
				emailAddress: "droiddavid@gmail.com",
				password: "G0th5mC1t4@25Ot"
			};
		};



		this.register = function (person) {
			that.person = {
				firstName: person.firstName,
				lastName: person.lastName,
				emailAddress: person.emailAddress,
				password: person.password
			};

			var obj = {
				table: 'users',
				fields: [{ name: 'emailAddress'}, { name: 'password' }],
				where: [{ value: that.person.emailAddress }, { value: that.person.password }]
			};
			Database.select2(obj)
				.then(function (response) {
					if (response.data) {
						if (response.data.data) {
							if (response.data.data[0] === undefined) {
								that.addNewUser();
							} else {
								that.shouldLogin(obj);
							}
						}
					} else {
						return response;
					}
				});
		};



		this.addNewUser = function () {
			var obj = {
				table: 'users',
				firstName: that.person.firstName,
				lastName: that.person.lastName,
				emailAddress: that.person.emailAddress,
				password: that.person.password,
				role: 6, //guest
				userName: that.person.emailAddress.substr(0, that.person.emailAddress.search("@")),
				lastLogin: new Date(),
				message: 'Tell us something about yourself.',
				lastUpdate: Date.now(),
				status: 1
			};
			Database.insert(obj)
				.then(function (response) {
					var message = response.data.message,
						status = response.data.status;

					if (status === "success") {
						that.registered = true;

						//Inform user of successful registration.
						$mdToast.show(
							$mdToast.simple()
							.textContent('Registration successful...')
							.hideDelay(4000)
						);

						//navigate to user's role level state, i.e. guest, cook, etc.
						//that.accoutCreated(obj);
						that.shouldLogin(obj);						
					} else {

						//inform user of failed registration.
						$mdToast.show(
							$mdToast.simple()
							.textContent('Registration failed. Err Msg: [' + message + '].  Please try again.')
							.hideDelay(5000)
						);

						//Set a login count here, then divert based on unsuccessful attempts.
						//Clear the sign up form.
					}

	
				});
		};



		this.accoutCreated = function (user) {
			//Notice: your account has been created.
			//Continue to login now

			//debugger;
			var suser = user;
			Database.select(user)
				.then(function (response) {
					debugger;
					var role = response.data.role
					switch (role) {
						case "guest":
							$state.go("guestDashboard");
							break;
						case "customer":
							$state.go("customerDashboard");
							break;
						case "cook":
							$state.go("cookDashboard");
							break;
						case "driver":
							$state.go("driverDashboard");
							break;
						default:
							$state.go("index");
							break;
					}
				});

		}; //this.accoutCreated



		this.shouldLogin = function (user) {

			var obj = {
				table: 'users',
				fields: 'emailAddress',
				where: user.where[0].value
			};

			Database.select(obj)
				.then(function (response) {
					debugger;
					// $state.go("guestDashboard");

					var role = undefined;
					
					if (response) {
						if (response.data) {
							if (response.data.data[0]) {
								role = response.data.data[0].role;
							}
						}
					}

					switch (role) {

						case 6: //"guest":
							$state.go("guestDashboard");
							break;
						case 5: //"member":
							$state.go("memberDashboard");
							break;
						case 4: //"invitee":
							$state.go("inviteeDashboard");
							break;
						case 3: //"customer":
							$state.go("customerDashboard");
							break;
						case 2: //"cook":
							$state.go("cookDashboard");
							break;
						case 1: //"admin":
							$state.go("adminDashboard");
							break;
						case 0: //"all":
							$state.go("allDashboard");
							break;
						default:
							$state.go("index");
							break;
					}
				});

				// debugger;
			// var iconButton = document.querySelector(".iconbar");
			// //iconButton.click();

			// //add the register form to the display
			// var register = document.querySelector(".register");
			// register.style.display = "none";

			// //add the login form to the display
			// var login = document.querySelector(".login");
			// login.style.display = "block";

			// console.log("You should login.");
		};
	}],
	templateUrl: 'partials/register/register.html'
});