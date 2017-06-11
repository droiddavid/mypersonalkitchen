/*global angular, $, console */
/*jslint plusplus: true */
'use strict';


let app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngMaterial', 'ngAnimate']);

app.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
	all: 		'*', 			//0
	admin: 		'admin', 		//1
	cook: 		'cook', 		//2
	customer: 	'customer', 	//3
	invitee: 	'invitee', 		//4
	member: 	'member', 		//5
	guest: 		'guest' 		//6
});

app.constant('dexie', window.Dexie);




//see https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec#.5hla7w66w
//for explaination of AUTH_EVENTS, USER_ROLES and $httpProvider.
//Inject $mdThemingProvider in order to change the primary, accent and warn colors.
app.config(function($stateProvider, $urlServiceProvider, $mdThemingProvider) {

	$mdThemingProvider
		.theme('default')
		.primaryPalette( 'green' )
		.accentPalette( 'light-green' )
		.warnPalette( 'red' );

	$urlServiceProvider.rules.otherwise({ state: 'index' });
	
	/* 
		REMEMBER, index component's templateUrl calls partials/login/loginBody.html.
		partials/login/loginBody.html instantiates a login component. 
	*/
	$stateProvider.state('index', {
		url: '/index',
		component: 'index',
		resolve: {
			applicationMenu: function (ApplicationMenuService) { //See js/app/services.js:369
				return ApplicationMenuService.list();
			}
		}
	});

	/* DEVELOPMENT COMPONENTS - DEVELOPMENT COMPONENTS - DEVELOPMENT COMPONENTS */
	$stateProvider.state('elements', {
		url: '/elements',
		component: 'elements'
	});

	$stateProvider.state('contact', {
		url: '/contact',
		component: 'contact'
	});

	$stateProvider.state('generic', {
		url: '/generic',
		component: 'generic'
	});

	$stateProvider.state('mdCardTemplate', {
		url: '/mdCardTemplate',
		component: 'mdCardTemplate'
	});
	/* DEVELOPMENT COMPONENTS - DEVELOPMENT COMPONENTS - DEVELOPMENT COMPONENTS */


	$stateProvider.state('index.header', {	url: '/header',	component: 'iheader'});
	$stateProvider.state('index.body', {	url: '/body',	component: 'ibody'});
	$stateProvider.state('index.footer', {	url: '/footer',	component: 'ifooter'});

	$stateProvider.state('index.register', {
		url: '/register',
		component: 'register'
	});

	$stateProvider.state('data', {
		url: '/data',
		component: 'data'
	});

	$stateProvider.state('updates', {
		url: '/updates',
		component: 'updates'
	});

	$stateProvider.state('platterItemsManager', {
		url: '/platterItemsManager',
		component: 'platterItemsManager',
		params: {
			platter: null
		},
		resolve: {
			platters: ['Session', 'PlatterService', function (Session, PlatterService) {
				if (Session.role === 2) {
					return PlatterService.platters;
				}
			}],
			platterItems: ['Session', 'PlatterService', function (Session, PlatterService) {
				if (Session.role === 2) {
					return PlatterService.platterItems;
				}
			}],
			unfilteredTypes: ['Session', function (Session) {
				return Session.Collections.food;
			}]
		}
	});

	$stateProvider.state('guestDashboard', {
		url: '/guestDashboard',
		component: 'guestDashboard',
		resolve: {
			cooks: ['Session', function (Session) {
				if (Session.role === 6) {
					return Session.Collections.cooks;
				}
			}]
		}
	});

	$stateProvider.state('dashboard', {
		url: '/dashboard',
		component: 'dashboard',
		resolve: {
			food: ['Session', function (Session) {
				if (Session.role === 2) {
					return Session.Collections.food;
				}
			}],
			platters: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) {
					return Session.Collections.platters;
				}
			}],
			platterItems: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) {
					return Session.Collections.platterItems;
				}
			}],
			menusPlatters: [
				'$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) {
					return Session.Collections.menusPlatters;	
				}
			}],
			menuPlattersPlatterItems: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) {
					return Session.Collections.menusPlattersPlatterItems;
				}
			}],
			menus: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) {
					return Session.Collections.menusPlattersPlatterItems;
				}
			}]
		}
	});


	$stateProvider.state('dashboard.header', {
		url: '/dashboardHeader',
		component: 'dashboardHeader'
	});
	$stateProvider.state('dashboard.body', {
		url: '/dashboardBody',
		component: 'dashboardBody',
		resolve: {
			food: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) { //USER_ROLES.cook
					return Session.Collections.food;
					// }
				} //if
			}],
			platters: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) { //USER_ROLES.cook
					return Session.Collections.platters;
				} //if
			}],
			platterItems: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) { //USER_ROLES.cook
					return Session.Collections.platterItems;
				} //if
			}],
			menusPlatters: [
				'$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) { //USER_ROLES.cook
					return Session.Collections.menusPlatters;	
				}//if
			}],
			menuPlattersPlatterItems: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) {
					return Session.Collections.menusPlattersPlatterItems;
				} //if
			}],
			menus: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) { //USER_ROLES.cook
					return Session.Collections.menusPlattersPlatterItems;
				}
			}]
		}
	});
	$stateProvider.state('dashboard.footer', {
		url: '/dashboardFooter',
		component: 'dashboardFooter'
	});
	$stateProvider.state('dashboard.dashboardMenuDetail', {
		url: '/dashboardMenuDetail',
		component: 'dashboardMenuDetail'
	});
	$stateProvider.state('dashboard.dashboardPlatterDetail', {
		url: '/dashboardPlatterDetail',
		component: 'dashboardPlatterDetail'
	});
	$stateProvider.state('profile', {
		url: '/profile',
		component: 'profile',
		resolve: {
			profileData: ['Session', function (Session) {
				return Session.Collections.profile;
			}]
		}
	});

	$stateProvider.state('invitations', {
		url: '/invitations',
		component: 'invitations',
		resolve: {
			invitations: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
				if (Session.role === 2) { //USER_ROLES.cook

					if (!Session.Collections.invitations || Session.Collections.invitations.length === 0) {
						var cook = new Cook(Session.id);
						cook.getInvitations(cook.QUERIES.Invitations.fields, cook.QUERIES.Invitations.table, Session.id)
							.then(function (response) {
								Session.Collections.invitations = response.data.data;
							})
							.then(function () {
								$http.post('./data/fileWriter.php', { 
									fileName: Session.FileNames.invitations + ".json",
									data: Session.Collections.invitations
								});
							}); //write the data to a local file (update current data)
					} else {
						return Session.Collections.invitations;
					}

					return Session.Collections.invitations;
				} //if
			}]
		}
	});

	$stateProvider.state('invitationDetail', {
		url: '/invitationDetail/:invitationId',
		component: 'invitationDetail',
		params: {
			data: null,
			invitationId: null
		}
		// resolve: {
		// 	Invitation: ['$http', 'Session', 'Cook', 'InvitationService', function ($http, Session, Cook, InvitationService) {
		// 		if (!InvitationService.Invitation || InvitationService.Invitation.length === 0) {
		// 			InvitationService.getInvitation(userId)
		// 				.then(function (response) {
		// 					debugger;
		// 					return response;
		// 				});
		// 		} else {
		// 			return InvitationService.Invitation;
		// 		}
		// 	}]
		// }
	});



	$stateProvider.state('htmlmedia', {
		url: '/htmlmedia',
		component: 'htmlmedia',
		params: {
			data: null
		},
		resolve: {
			// html5media: ['$http', '$timeout', 'Session', 'Cook', function ($http, $timeout, Session, Cook) {
			// 	if (Session.role === 2) { //USER_ROLES.cook

			// 		if (!Session.Collections.html5media || Session.Collections.html5media.length === 0) {
			// 			var cook = new Cook(Session.id);
			// 			cook.gethtml5media(cook.QUERIES.html5media.fields, cook.QUERIES.html5media.table, Session.id)
			// 				.then(function (response) {
			// 					Session.Collections.html5media = response.data.data;
			// 				})
			// 				.then(function () {
			// 					$http.post('./data/fileWriter.php', { 
			// 						fileName: Session.FileNames.html5media + ".json",
			// 						data: Session.Collections.html5media
			// 					});
			// 				}); //write the data to a local file (update current data)
			// 		} else {
			// 			return Session.Collections.html5media;
			// 		}

			// 		return Session.Collections.html5media;
			// 	} //if
			// }]
		}
	});


















  
	$stateProvider.state('userlist', {
		url: '/users',
		component: 'users',
		resolve: {
			users: function(UserService) {
				return UserService.list();
			},
			menus: function (ApplicationMenuService) { //See js/app/services.js:369
				return ApplicationMenuService.list();
			}
		}
	});
	$stateProvider.state('userlist.detail', {
		url: '/:userId',
		component: 'userDetail',
		resolve: {
			user: function($transition$, users) {
				return users.find(function (user) {
					user.id = $transition$.params().userId;
				});
			}
		}
	});
	$stateProvider.state('index.food', {
		url: '/food',
		component: 'food'
	});
	$stateProvider.state('index.subscriptions', {
		url: '/subscriptions',
		component: 'subscriptions'
	});
});


app.controller('IndexController', ['$scope', function ($scope) {

	$scope.initialize = function () {

		//This code is for credentials management
		if ('credentials' in navigator) {
			navigator.credentials.get({password: true})
			.then(function(creds) {
				// write(creds, 'creds');
				// console.log("You have logged in with credentials.");
			});
		} else {
			// console.log("You have to login normally. :(");
		};
	};


	$scope.onSignIn = function (googleUser) {
		var profile = googleUser.getBasicProfile();
		// console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		// console.log('Name: ' + profile.getName());
		// console.log('Image URL: ' + profile.getImageUrl());
		// console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	};


	$scope.signOut = function () {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			// console.log('User signed out.');
		});
	};


	$scope.initialize();

}]);