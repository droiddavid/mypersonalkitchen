angular
	.module('app')
	.component('index', {
		bindings: {
			applicationMenu: '<'
		},
		controller: function ($state) {

			'use strict';

			var that = this;
			this.HomeContainer = function () {
				return {
					dom: $('#homeContainer')["0"],
					node: document.querySelector("#homeContainer"),
					height: document.querySelector("#homeContainer").clientHeight,
					width: $('#homeContainer')["0"].clientWidth || $('#homeContainer')["0"].clientWidth
				};
			};
			this.ToolBar = function () {
				return {
					dom: $('#mdToolbar')["0"],
					node: document.querySelector("#mdToolbar"),
					height: document.querySelector("#mdToolbar").clientHeight,
					width: $('#mdToolbar')["0"].clientWidth || $('#mdToolbar')["0"].outerWidth
				};
			};
			this.Panel = function () {
				return {
					dom: $('#homePanel')["0"],
					node: document.querySelector("#homePanel"),
					height: document.querySelector("#homePanel").clientHeight,
					width: $('#homePanel')["0"].clientWidth || $('#homePanel')["0"].outerWidth
				};
			};
			this.CookPanel = function () {
				return {
					dom: $('#cookPanel')["0"],
					node: document.querySelector("#cookPanel"),
					height: document.querySelector("#cookPanel").clientHeight,
					width: $('#cookPanel')["0"].clientWidth || $('#cookPanel')["0"].outerWidth
				};
			};
			this.EarnPanel = function () {
				return {
					dom: $('#earnPanel')["0"],
					node: document.querySelector("#earnPanel"),
					height: document.querySelector("#earnPanel").clientHeight,
					width: $('#earnPanel')["0"].clientWidth || $('#earnPanel')["0"].outerWidth
				};
			};
			this.Footer = function () {
				return {
					dom: $('#footer')["0"],
					node: document.querySelector("#footer"),
					height: document.querySelector("#footer").clientHeight,
					width: $('#footer')["0"].clientWidth || $('#footer')["0"].outerWidth
				};
			};







			this.$onInit = function () {
				var homeContainer = that.HomeContainer().dom;
				homeContainer.style.position = "relative";
				homeContainer.style.left = "0px";
				homeContainer.style.top = "0px";



				var toolbar = that.ToolBar().dom;
				toolbar.style.position = "relative";
				toolbar.style.left = "0px";
				toolbar.style.top = "0px";



				var homePanel = that.Panel().dom;
				var hpHeight = that.HomeContainer().height - (that.ToolBar().height * 2);
				hpHeight = hpHeight + "px";
				homePanel.style.height = hpHeight;
				homePanel.style.position = "relative";
				homePanel.style.padding = "5px";
				homePanel.style.width = "100%";
				homePanel.style.background = "#388E3C";
				homePanel.style.position = "absolute";
				homePanel.style.top = that.ToolBar().height + "px";
				homePanel.style.left = "0px";

				var cookPanel = that.CookPanel().dom;
				cookPanel.style.position = "relative";
				cookPanel.style.padding = "5px";
				cookPanel.style.width = "100%";
				cookPanel.style.background = "#FF6D00";
				cookPanel.style.position = "absolute";
				cookPanel.style.top = that.ToolBar().height + "px";
				cookPanel.style.left = that.HomeContainer().height + "px";
				cookPanel.style.height = hpHeight;

				var earnPanel = that.EarnPanel().dom;
				earnPanel.style.position = "relative";
				earnPanel.style.padding = "5px";
				earnPanel.style.width = "100%";
				earnPanel.style.background = "#546E7A";
				earnPanel.style.position = "absolute";
				earnPanel.style.top = that.ToolBar().height + "px";
				earnPanel.style.left = that.HomeContainer().height + "px";
				earnPanel.style.height = hpHeight;



				var footer = that.Footer().dom;
				var footerHeight = homeContainer.clientHeight - (toolbar.clientHeight + (that.HomeContainer().height - (that.ToolBar().height * 2)) );
				footerHeight = footerHeight + "px";
				footer.style.height = footerHeight;
				footer.style.width = "100%";
				footer.style.background = "#2C7130";
				footer.style.position = "absolute";
				footer.style.bottom = "0px";
			};

			this.go = function (menuItem) {
				$state.go(menuItem.url);
			};

			this.showPanel = function (panel) {
				var homeContainer = that.HomeContainer().dom;
				var toolbar = that.ToolBar().dom;
				var homePanel = that.Panel().dom;
				var cookPanel = that.CookPanel().dom;
				var earnPanel = that.EarnPanel().dom;
				var footer = that.Footer().dom;


				if (panel === 'cook') {
					toolbar.style.background = "#CC5700";
					homePanel.style.left = that.HomeContainer().width + "px";
					earnPanel.style.left = that.HomeContainer().width + "px";
					cookPanel.style.left = "0px";
					footer.style.background = "#CC5700";
				}
					
				if (panel === 'earn') {
					toolbar.style.background = "#435861";
					homePanel.style.left = that.HomeContainer().width + "px";
					cookPanel.style.left = that.HomeContainer().width + "px";
					earnPanel.style.left = "0px";
					footer.style.background = "#435861";
				}
					
				if (panel === 'home') {
					toolbar.style.background = "#2C7130";
					cookPanel.style.left = that.HomeContainer().width + "px";
					earnPanel.style.left = that.HomeContainer().width + "px";
					homePanel.style.left = "0px";
					footer.style.background = "#2C7130";
				}
			};

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
		},
		templateUrl: 'partials/login/loginBody.html'
	});


angular
	.module('app')
	.component('login', {
		bindings: {
			person: '<'
		},
		controller: function ($http, $state, Session, Person, USER_ROLES, FileService, DataService) {
			
			'use strict';

			var that = this;

			this.$onInit = function () {
				// this.person = {
				// 	firstName: 'Craig',
				// 	lastName: 'Mack',
				// 	emailAddress: 'craig@mack.com',
				// 	password: 'locutus',
				// 	role: '2'
				// };


				// this.person = {
				// 	firstName: 'Flash',
				// 	lastName: 'Gordon',
				// 	emailAddress: 'flash@gordon.com',
				// 	password: 'locutus',
				// 	role: '2'
				// };


				this.person = {
					firstName: 'Betty',
					lastName: 'Garcia',
					emailAddress: 'betty@garcia.com',
					password: 'locutus',
					role: '6'
				};


				// this.person = {
				// 	firstName: 'Ion',
				// 	lastName: 'Kasch',
				// 	emailAddress: 'ionkasch@cheerful.com',
				// 	password: 'cdfv42t9',
				// 	role: '3'
				// };
			};
			// this.$onChanges = function (changes) {
			// 	if (changes.person) {
			// 		this.person = Object.assign({}, this.person);
			// 	}
			// };
			this.onLogin = function () {

				// all: 		'*', 			//0
				// admin: 		'admin', 		//1
				// cook: 		'cook', 		//2
				// customer: 	'customer', 	//3
				// invitee: 	'invitee', 		//4
				// member: 		'member', 		//5
				// guest: 		'guest' 		//6


				Person.getPerson(this.person)
					.then(function (response) {
						if (response.data) {
							if (response.data.data.length) {
								var User = response.data.data[0];
							}
							if (User.role === USER_ROLES.cook || User.role === 2) { //Cook
								Session.createUser(User);
								DataService.onInit();
							}
							if (User.role ===  USER_ROLES.guest || User.role ===  6) { //Guest
								Session.createGuest(User);
								DataService.onInit();
							}

						} else {
							$state.go('login');
						}
					});
			};
			
		
			this.go = function (page) {
				$state.go(page);
			};
		},
		templateUrl: 'partials/login/login.html'
}); //login component





angular.module('app').component('html5media', {
	bindings: {
		video: '<',
		canvas: '<',
		photo: '<',
		startbutton: '<' 
	},
	controller: function () {
		var that = this;

		this.$onInit = function () {
			console.log('component.html5media ...');
		};
	},
	templateUrl: 'partials/html5media/html5media.html'

});




/*****************************************************/
angular.module('app').component('elements', {
	templateUrl: 'elements.html'
});
angular.module('app').component('contact', {
	templateUrl: 'contact.html'
});
angular.module('app').component('generic', {
	templateUrl: 'generic.html'
});
angular.module('app').component('mdCardTemplate', {
	templateUrl: 'mdCardTemplate.html'
});

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