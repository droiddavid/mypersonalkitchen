angular
	.module('app')
	.component('index', {
		bindings: {
			applicationMenu: '<'
		},
		controller: function ($state) {

			'use strict';

			this.$onInit = function () {
				//var mdtoolbar = document.querySelector('md-toolbar');
				var homeContainer = $('#homeContainer'),
					homeContainerHeight = homeContainer.outerHeight(),

					mdtoolbar = $('#mdToolbar'),
					mdtoolbarouterheight = mdtoolbar.outerHeight(),

					homePanel = $('#homePanel'),
					homePanelHeight = homePanel.outerHeight(),

					homePanelButtons = $('#homePanelButtons'),
					homePanelButtonsHeight = homePanelButtons.outerHeight();

					write(mdtoolbarouterheight, 'mdtoolbarouterheight');

				//homeContainer = mdtoolbar = homePanel = homePanelButtons = undefined;

				var homeContainerDOM = document.querySelector("#homeContainer");
				homeContainerDOM.style.position = "relative";
				homeContainerDOM.style.left = "0px";
				homeContainerDOM.style.top = "0px";

				var toolBarDOM = document.querySelector("#mdToolbar");
				toolBarDOM.style.position = "relative";
				toolBarDOM.style.left = "0px";
				toolBarDOM.style.top = "0px";


				var homePanelDOM = document.querySelector("#homePanel");
				var hpHeight = homeContainerHeight - (mdtoolbarouterheight * 5);
				
				hpHeight = hpHeight + "vh";
				//homePanelDOM.style.height = "80vh";
				homePanelDOM.style.padding = "5px";
				homePanelDOM.style.width = "100%";
				homePanelDOM.style.background = "#388E3C";
				homePanelDOM.style.position = "absolute";
				homePanelDOM.style.top = mdtoolbarouterheight.toString() + "px";
				//homePanelDOM.style.left = "20px";

				var homePanelButtonsDOM = document.querySelector("#homePanelButtons");
				//homePanelButtonsDOM.style.border = "1px solid yellow";
				homePanelButtonsDOM.style.height = "7vh";
				homePanelButtonsDOM.style.width = "100%";
				homePanelButtonsDOM.style.background = "#2C7130";
				homePanelButtonsDOM.style.position = "absolute";
				homePanelButtonsDOM.style.bottom = "0px";

				var homePanelButtonsDOMHeight = $('#homePanelButtons');
				var hpBDHeight = homePanelButtonsDOMHeight.outerHeight();
				homePanelDOM.style.bottom = hpBDHeight + "px";
				//homePanelButtonsDOM.style.top = "0px";
			};

			this.go = function (menuItem) {
				$state.go(menuItem.url);
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