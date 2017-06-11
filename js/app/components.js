'use strict'; 
// console.log('js/app/components.js');

angular.module('app').component('index', {
	bindings: {
		applicationMenu:'<'
	},
	controller: function ($state) {

		this.$onInit = function () {
			// console.log('this.$onInit.component.index.this.$onInit...');
			// console.log('...this.$onInit.component.index.this.$onInit');
		};

		this.go = function (menuItem) {
			$state.go(menuItem.url);
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

	},
	templateUrl: 'partials/login/loginBody.html'
	// ,
	// //template: '<login-form person="$ctrl.person"></login-form>'
	// templateUrl: "partials/index.html"
});


angular.module('app').component('login', {
	bindings: {
		person: '<'
	},
	controller: function ($http, $state, Session, Person, USER_ROLES, FileService, DataService) {
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
		this.$onChanges = function (changes) {
			if (changes.person) {
				this.person = Object.assign({}, this.person);
			}
		};
		this.onLogin = function () {
			Person.getPerson(this.person)
				.then(function (response) {
					if (response.data) {
						if (response.data.data.length) {
							var User = response.data.data[0];
						}
						if (User.role === USER_ROLES.cook || User.role === 0) { //Cook
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