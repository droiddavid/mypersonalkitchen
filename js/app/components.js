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
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'index',
						style: 'display: none;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'index',
						style: 'color: white;',
						value: 'My Personal Kitchen'
					},
					menu: [
						{ name: 'Login', state: 'login' },
						{ name: 'Register', state: 'register' }
					]
				}); //ToolbarService.init(...)
			};

			this.go = function (menuItem) {
				$state.go(menuItem.url);
			};

			
			/*

			this.signup = function () {

				//remove the cards from the display
				var cards = document.querySelector(".cards");
				cards.style.display = "none";

				//add the login form to the display
				var login = document.querySelector(".login");
				login.style.display = "none";

				//add the register form to the display
				var register = document.querySelector(".register");
				register.style.display = "block";
			};

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

			this.btnPrevious = {};
			this.btnBrand = {};
			this.menu = {};

			this.$onInit = function () {
				that.btnPrevious = ToolbarService.btnPrevious;
				that.btnBrand = ToolbarService.btnBrand;
				that.menu = ToolbarService.menu;
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
		controller: ['$rootScope', '$http', '$state', '$mdToast', 'Database', 'Session', 'DataService', 'ToolbarService', 'Person', function ($rootScope, $http, $state, $mdToast, Database, Session, DataService, ToolbarService, Person) {

			'use strict';

			var that = this;

			this.person = undefined;
			this.FIRST_RECORD_INDEX = 0;
			this.registerButton = document.querySelector('#registerButton');

			this.$onInit = function () {

				that.registerButton.addEventListener('touchstart click', function (e) {

					that.registerButton.addEventListener('touchmove', function (e) {}, true);
					that.registerButton.addEventListener('touchend', function (e) {
						that.register(that.person);
					}, true);

				}, true);

				that.initToolbar();

			};

			this.initToolbar = function () {
				ToolbarService.init({
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'index',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'register',
						style: 'color: white;',
						value: 'Register'
					},
					menu: [
						{ name: 'HOME', state: 'index' },
						{ name: 'Login', state: 'login' }
					]
				}); //ToolbarService.init(...)
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
						if (response.data && response.data.data) {
							var _data = response.data.data[that.FIRST_RECORD_INDEX];

							if (_data === undefined || _data.length === 0) {
								$rootScope.$broadcast('register.accountNotFound');
							} else {
								$rootScope.$broadcast('register.accountFound');
							}

						} else { return response; }

					});
			};

			this.addNewUser = function () {

				if (that.person) {

					that.person.table = 'users',
					that.person.role = 5, //customer
					that.person.userName = that.person.emailAddress.substr(0, that.person.emailAddress.search("@")),
					that.person.lastLogin = new Date(),
					that.person.message = 'Tell us something about yourself.',
					that.person.lastUpdate = Date.now(),
					that.person.status = 1

					Database.insert(that.person)
						.then(function (response) {

							if (response && response.data) {

								var message = response.data.message,
									status = response.data.status;

								if (status === "success") {

									$rootScope.$broadcast('register.addSuccess');

								} else {

									//$rootScope.$broadcast('register.addFailure');

									/*	Toast 'Registration failed. Err Msg: [' + message + '].  
										Please try again.' */

									//Set a login count here, then divert based on unsuccessful attempts.
									//Clear the sign up form.
								}

							} else {

								return false;

							} //if response exists

						});
				}
			};

			this.getUser = function () {
				Database.select({
					table: 'users',
					fields: 'emailAddress',
					where: that.person.emailAddress
				})
					.then(function (response) {
						if (response && response.data && response.data.data) {
							var newUser = response.data.data[that.FIRST_RECORD_INDEX];
							that.person.userId = newUser.id;
							$rootScope.$broadcast('register.userRetrieved');
						}

					});
			};

			this.createProfile = function () {

				var profileData = {
					userId: that.person.userId,
					firstName: that.person.firstName,
					lastName: that.person.lastName,
					company: undefined,
					emailAddress: that.person.emailAddress,
					password: that.person.password,
					phoneNumber: undefined,
					addressLine1: undefined,
					addressLine2: undefined,
					city: undefined,
					state: undefined,
					zip: undefined,
					country: undefined,
					howHeard: undefined,
					hours: undefined,
					description: undefined,
					table: 'profiledata'
				};

				if (profileData) {

					Database.insert(profileData)
						.then(function (response) {
							that.login(that.person);
						});				

				}
			};

			this.login = function (user) {
				// Toast = 'Account ready. Logging you in.'

				var person = {
					emailAddress: user.emailAddress,
					password: user.password,
					role: user.role
				};

				Person.getPerson(person)
					.then(function (response) {
						if (response.data && response.data.data && response.data.data.length) {

							var User = response.data.data[that.FIRST_RECORD_INDEX];

							if (User.role === 5) { Session.createGuest(User); } //customer
							if (User.role === 2) { Session.createUser(User); }	//cook

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
						} else {
							$state.go('login');
						}
					});
			}; //this.login

			this.accountFound = function () {
				//Toast 'Account already exists.  Please login.'
				$state.go('login');
			};

			/* EVENT HANDLERS EVENT HANDLERS EVENT HANDLERS EVENT HANDLERS EVENT HANDLERS */
			$rootScope.$on('register.accountFound', that.accountFound);
			$rootScope.$on('register.accountNotFound', that.addNewUser);
			$rootScope.$on('register.adding', that.verifyAdded);
			$rootScope.$on('register.addSuccess', that.getUser);
			$rootScope.$on('register.userRetrieved', that.createProfile);
			//$rootScope.$on('register.addFailure', that.addNewUserFailure);
			/* EVENT HANDLERS EVENT HANDLERS EVENT HANDLERS EVENT HANDLERS EVENT HANDLERS */

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
			
			'use strict'; 

			var that = this;

			this.FIRST_RECORD_INDEX = 0;

			this.loginButton = document.querySelector('#loginButton');

			this.$onInit = function () {
				that.loginButton.addEventListener('touchstart', function (e) {

					that.loginButton.addEventListener('touchmove', function (e) {}, true);
					that.loginButton.addEventListener('touchend', function (e) {}, true);
					that.loginButton.addEventListener('click', function (e) {
						that.login();
					}, true);

					that.login();

				}, true);

				ToolbarService.init({
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'index',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'index',
						style: 'color: white;',
						value: 'Login'
					},
					menu: [
						{ name: 'HOME', state: 'index' },
						{ name: 'Register', state: 'register' }
					]
				}); //ToolbarService.init(...)

			};

			this.login = function () {

				Person.getPerson(this.person)
					.then(function (response) {

						if (response.data && response.data.data && response.data.data.length) {

							var User = response.data.data[that.FIRST_RECORD_INDEX];
							if (User.role === 5) { Session.createGuest(User); } //customer
							if (User.role === 2) { 
								Session.createUser(User);
							}	//cook

							//create app objects
							switch (User.role) {
								/* Disable temporarily until we decide if admins and all level
									security should be available during a registration. */
								// case 0: //"all":
								// 	$state.go("allDashboard");
								// 	break;
								// case 1: //"admin":
								// 	$state.go("adminDashboard");
								// 	break;
								case 2: //"cook":
									$state.go("cookDashboard", {
										data: User
									});
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

						} else {
							$state.go('login');
						}

					});

			};
			this.go = function (page) { $state.go(page); };
		}
}); //login component


angular
	.module('app')
	.component('food', {
		templateUrl: 'partials/food/food.html',
		controller: function (
			$http, $state, $rootScope, Session, Database, 
			ToolbarService, FoodTypeService, FoodItemListService) {
			
			'use strict'; 

			var that = this;

			this.foodTypes = undefined;
			this.toolbar = undefined;
			this.addCategoryButton = document.querySelector('#addCategoryButton');

			this.$onInit = function () {

				FoodTypeService.init();


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
						state: 'food',
						style: 'color: white;',
						value: 'Food'
					},
					menu: [
						{ name: 'HOME (logout)', state: 'index' },
						{ name: 'Profile', state: 'profile' },
						{ name: 'Memberships', state: 'memberships' }
					]
				}); //ToolbarService.init(...)


				that.addCategoryButton.addEventListener('touchstart click', function (e) {
					that.addCategoryButton.addEventListener('touchmove', function (e) {}, true);
					that.addCategoryButton.addEventListener('touchend', function (e) {
						that.addCategory();
					}, true);
				}, true);//$('#addNewFoodTypePanel').style="display: none;";
			};
			this.getFoodTypes = function (response) {
				that.foodTypes = FoodTypeService.foodTypes;
			};
			this.showFoodPage = function (foodType) {

				//set toolbar
				that.toolbar = {
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'food',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'food',
						style: 'color: white;',
						value: foodType.type
					},
					menu: [
						{ name: 'HOME (logout)', state: 'index' },
						{ name: 'Profile', state: 'profile' },
						{ name: 'Memberships', state: 'memberships' }
					]
				};

				//init food item service

				var obj = {
					table: 'food',
					fields: [{ name: 'userId'}, { name: 'type' }],
					where: [{ value: Session.id }, { value: foodType.type }]
				};
				Database.select2(obj)
					.then(function (response) {
						if (response.data && response.data.data) {
							var _data = response.data.data;

							if (_data === undefined || _data.length === 0) {
								//ADD $on function
								//$rootScope.$broadcast('getListData.noFoodDatasetFound');
								//Add message - no food found in this category, then
								//change to the food page.  The user will add food to the category
								//there.

								//But first, set the FoodItemList Service count to zero.
								FoodItemListService.resetFoodItems();


								$state.go('foodTemplate', { 
									"data": {	
										"toolbar": that.toolbar,
										"foodType": foodType,
										"foodItems": []
									}
								});
							} else {
								FoodItemListService.FoodItems = response.data.data;

								$state.go('foodTemplate', { 
									"data": {	
										"toolbar": that.toolbar,
										"foodType": foodType,
										"foodItems": FoodItemListService.FoodItems
									}
								});
							}

						} else { return response; }

					});
			};
			this.go = function (state) {
				$state.go(state);
			};
			this.addCategory = function () {
				var _newFoodType = document.querySelector('#newFoodType');
				var _foodType = undefined;

				if (_newFoodType.value) {
					_foodType = _newFoodType.value;
				}

				if (_foodType) {
					FoodTypeService.addFoodType(_foodType);
					that.getFoodTypes();
				}

				_newFoodType.value = "";
			};

			$rootScope.$on('foodTypes.loaded', that.getFoodTypes);
		}
}); //food component

//SEE THE PHOTO JS FILE
// angular
// 	.module('app')
// 	.component('photo', {
// 		templateUrl: 'partials/photo/photo.html',




















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
angular.module('app').component('subscriptions', {
	bindings: { total: '<' },
	controller: function () { this.getProfile = function () { alert("Profile"); } },
	template: "<div style='background-color: #369;'><p>Subscriptions template realised.</p></div>"
}); //component.subscriptions