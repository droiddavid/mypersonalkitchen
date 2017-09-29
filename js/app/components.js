/*global angular, $, console */
/*jslint plusplus: true */

angular
	.module('app')
	.component('index', {
		/*templateUrl: 'partials/login/loginBody.html',*/
		templateUrl: 'partials/index/index.html',
		controller: function ($state, $scope, ToolbarService) {

			'use strict';

			var that = this;

			that.person = undefined;

			this.$onInit = function () {
				ToolbarService.init({
					button: { //icon button
						label: null,
						url: null
					},
					title: 'My Personal Kitchen',
					name: 'index',
					menu: [
						{
							state: 'login', //url
							label: 'Login',
							sronly: '(current)'
						},
						{
							state: 'register', //url
							label: 'Register',
							sronly: ''
						}
					]
				});
			};

			this.go = function (menuItem) {
				$state.go(menuItem.url);
			};

			

			// this.signup = function () {

			// 	//remove the cards from the display
			// 	var cards = document.querySelector(".cards");
			// 	cards.style.display = "none";

			// 	//add the login form to the display
			// 	var login = document.querySelector(".login");
			// 	login.style.display = "none";

			// 	//add the register form to the display
			// 	var register = document.querySelector(".register");
			// 	register.style.display = "block";
			// };

			/*
				this.onSignIn = function (googleUser) {
					var profile = googleUser.getBasicProfile();
					// console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
					// console.log('Name: ' + profile.getName());
					// console.log('Image URL: ' + profile.getImageUrl());
					// console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
				};

				this.signOut = function() {
					var auth2 = gapi.auth2.getAuthInstance();
					auth2.signOut().then(function () {
						// console.log('User signed out.');
					});
			};
			*/
		}
	}); //index component


angular
	.module('app')
	.component('toolbar', {
		templateUrl: 'partials/toolbar/toolbar.html',
		controller: function ($http, $state, ToolbarService) {

			var that = this;

			this.title = undefined;
			this.menu = [];
			this.label = undefined;
			this.state = undefined;
			this.buttons = [];

			this.$onInit = function () {

				that.title = ToolbarService.title;
				that.menu = ToolbarService.menu;
				that.label = ToolbarService.label;
				that.state = ToolbarService.state;
				that.buttons = ToolbarService.buttons

			};

			this.go = function (link) {
				$state.go(link);
			};
		}
	}); //toolbar component


angular
	.module('app')
	.component('register', {
		templateUrl: 'partials/register/register.html',
		controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'DataService', 'ToolbarService', 'Person', function ($http, $state, $mdToast, Database, Session, DataService, ToolbarService, Person) {

			'use strict';

			var that = this;

			this.person = undefined;
			this.registered = false;

			this.$onInit = function () {
				// that.person = {
				// 	firstName: "David",
				// 	lastName: "Davis",
				// 	emailAddress: "droiddavid@gmail.com",
				 	password: "G0th5mC1t4@25Ot"
				// };

				that.initToolbar();
			};

			this.initToolbar = function () {
				var toolbar = {};

				toolbar.button = {};
				toolbar.button.label = null; //icon button
				toolbar.button.url = null;

				toolbar.title = 'Register';
				toolbar.name = 'register';

				toolbar.menu = [];
				toolbar.menu.push({
					state: 'index', //url
					label: 'HOME',
					sronly: '(current)'
				});
				toolbar.menu.push({
					state: 'login', //url
					label: 'Login',
					sronly: ''
				});
				ToolbarService.init(toolbar);
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
					role: 5, //customer
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
							// $mdToast.show(
							// 	$mdToast.simple()
							// 	.textContent('Registration successful...')
							// 	.hideDelay(4000)
							// );

							that.login(obj);						
						} else {

							//inform user of failed registration.
							// $mdToast.show(
							// 	$mdToast.simple()
							// 	.textContent('Registration failed. Err Msg: [' + message + '].  Please try again.')
							// 	.hideDelay(5000)
							// );

							//Set a login count here, then divert based on unsuccessful attempts.
							//Clear the sign up form.
						}

		
					});
			};

			this.login = function (user) {

				// $mdToast.show(
				// 	$mdToast.simple()
				// 	.textContent('Account ready. Logging you in.')
				// 	.hideDelay(9000)
				// );

				var person = {
					emailAddress: user.emailAddress,
					password: user.password,
					role: user.role
				};

				Person.getPerson(person)
					.then(function (response) {
						if (response.data) {
							if (response.data.data) {
								if (response.data.data.length) {
									var User = response.data.data[0];
									if (User.role === 5) { //customer
										Session.createGuest(User);
									}
									if (User.role === 2) { //cook
										Session.createUser(User);
									}
									//Session.createUser(User);

									//create app objects
									switch (person.role) {
										/* Disable temporarily until we decide if admins and all level
											security should be available during a registration. */
										// case 0: //"all":
										// 	$state.go("allDashboard");
										// 	break;
										// case 1: //"admin":
										// 	$state.go("adminDashboard");
										// 	break;
										case 2: //"cook":
											$state.go("cookDashboard");
											break;
										case 3: //"member":
											$state.go("memberDashboard");
											break;
										case 4: //"driver":
											$state.go("driverDashboard");
											break;
										case 5: //"customer":
											$state.go("customerDashboard", {
												data: User
											});
											break;
										case 6: //"guest":
											$state.go("guestDashboard");
											break;
										default:
											$state.go("index");
											break;
									}								
								}
							}
						} else {
							$state.go('login');
						}
					});

				
			};

			this.shouldLogin = function (user) {

				//inform user of account already exists.
				// $mdToast.show(
				// 	$mdToast.simple()
				// 	.textContent('Account ready.  Please login.')
				// 	.hideDelay(9000)
				// );

				$state.go('login');
			};
		}]
	}); //register component




























angular
	.module('app')
	.component('login', {
		templateUrl: 'partials/login/login.html',
		bindings: {
			person: '<'
		},
		controller: function ($http, $state, Session, Person, USER_ROLES, FileService, DataService, ToolbarService) {
			'use strict'; var that = this;
			this.$onInit = function () {
				ToolbarService.init({
					button: { //icon button
						label: null,
						url: null
					},
					title: 'Login',
					name: 'login',
					menu: [
						{
							state: 'index', //url
							label: 'HOME',
							sronly: '(current)'
						},
						{
							state: 'register', //url
							label: 'Register',
							sronly: ''
						}
					]
				});
			};
			this.login = function () {
				Person.getPerson(this.person)
					.then(function (response) {
						if (response.data) {
							if (response.data.data) {
								if (response.data.data.length) {
									var User = response.data.data[0];
									Session.createUser(User);
									DataService.onInit();								
								}
							}
						} else {
							$state.go('login');
						}
					});
			};
			this.go = function (page) { $state.go(page); };
		}
}); //login component


/*****************************************************/
angular.module('app').component('users', {
	bindings: {
		users: '<',
		menus: '<'},
	controller: function($state) {
		this.go = function(state) {
			$state.go(state);
		};
		this.SideNav = [
			{	title : "Food",				url: "food",			description : "Manage Food, Platters and Menus."},
			{	title : "Profile",			url: "profile",			description : "Manage your profile data."},
			{	title : "Invitations",		url: "invitations",		description : "Manage Invitations."},
			{	title : "Subscriptions",	url: "subscriptions",	description : "Manage Subscriptions."} ];
		this.toggleMenu = function () { $mdSidenav('left').toggle(); };
		this.link = function (state) {
			$state.go(state);
		};
	}, templateUrl: 'partials/index.html'
});
angular.module('app').component('userDetail', {
	bindings: { user: '<' },
	templateUrl: 'partials/index.detail.html'
});
angular.module('app').component('food', {
	bindings: { total: '<' },
	controller: function () { this.getFood = function () { alert("Food"); } },
	template: "<div style='background-color: #f09;'><p>Food template realised.</p></div>"
}); //component.food
angular.module('app').component('subscriptions', {
	bindings: { total: '<' },
	controller: function () { this.getProfile = function () { alert("Profile"); } },
	template: "<div style='background-color: #369;'><p>Subscriptions template realised.</p></div>"
}); //component.subscriptions