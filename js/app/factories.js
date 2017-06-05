'use strict';

angular.module('app').factory('AuthService', function ($http, Session, Person) {
	'use strict';

	var authService = {};

	authService.login = function (user) {
		return Person.getPerson(user)
			.then(function (res) {
				if (res.data.data && res.data.data.length > 0) {
					var _id, _userId, _role; //for readability

					_id = res.data.data[0].id;
					_userId = res.data.data[0].id;
					_role = res.data.data[0].role;
				
					Session.create(_id, _userId, _role);

					return res;
				} else {
					console.log("Error: " + res.statusText);
					return res;
				}
			});
	};

	authService.register = function (credentials) {
		return Person.register(credentials)
			.then(function (res) {
				if (res.status === 200 || res.statusText === "success")
					return res;
			});
	}; //authService.register

	authService.isAuthenticated = function () {
		return !!Session.userId;
	};

	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.role) !== -1);
	};

	return authService;
}); //app.factories.factory.AuthService


angular.module('app').factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', function ($rootScope, $q, AUTH_EVENTS) {
	'use strict';

	return {
		responseError: function (response) {
			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized,
				419: AUTH_EVENTS.sessionTimeout,
				440: AUTH_EVENTS.sessionTimeout
			}[response.status], response); //$rootScope.$broadcast
			return $q.reject(response);
		} //responseError
	}; //return
}]); //app.factories.factory.AuthInterceptor


angular.module('app').factory('AuthResolver', function ($q, $rootScope, $state) {
	'use strict';

	return {
		resolve: function () {
			var
				deferred = $q.defer(),
				unwatch = $rootScope.$watch('currentUser',
					function (currentUser) {
						if (angular.isDefined(currentUser)) {
							if (currentUser) {
								deferred.resolve(currentUser);
							} else {
								deferred.reject();
								$state.go('profile');
							} //if

							unwatch();
						}
					}); //if<--function (currentUser)<--$rootScope.$watch

			return deferred.promise;

		}
	}; //resolve: function -- return

}); //app.factories.factory.AuthResolver




angular.module('app').factory('Person', function ($http) {
	'use strict';
	var Person = {
		personId: '',
		firstname: 'initial_firstname',
		lastname: '',
		accountType: '',
		emailaddress: 'flash@gordon.com',
		password: 'locutus',
		data: []
	},
		urlBase = 'http://' + WEB_SERVER + '/mypersonalkitchen/database/',
		urls = {
			//sp_getUser: 				'sp_getUser.php',
			getUser:					'getUser.php',
			addPerson:					'addPerson.php',
			getMenus:					'getMenus.php',
			getPlatters:				'getPlatters.php',
			getPlatter:					'getPlatter.php',
			getPlatterByIdAndName:		'getPlatterByIdAndName.php',
			addPlatter:					'addPlatter.php',
			addPlatterItem:				'addPlatterItem.php',
			getPlatterItems:			'getPlatterItems.php',
			getPlattersList:			'getPlattersList.php',
			getDistinctPlattersList:	'getDistinctPlattersList.php',
			getUserByUserId: 			'getUserByUserId.php',
			register: 					'register.php'
		};


	Person.register = function (credentials) {
		return $http.post(urlBase + urls.register, credentials);
	};

	Person.getDistinctPlattersList = function (person) {
		return $http.post(urlBase + urls.getDistinctPlattersList, person);
	}; //Person.getDistinctPlattersList

	Person.getPlattersList = function (person) {
		return $http.post(urlBase + urls.getPlattersList, person);
	}; //Person.getPlatterList

	Person.getPlatterItems = function (personId) {
		return $http.post(urlBase + urls.getPlatterItems, personId);
	};

	//Person.getPlatterItems = function (platterId) {
	//return $http.post(urlBase + urls.getPlatterItems, platterId);
	//}; //Person.getPlatterItems

	Person.addPlatterItem = function (person) {
		return $http.post(urlBase + urls.addPlatterItem, person);
	}; //Person.addPlatterItem

	Person.getPlatterByIdAndName = function (person) {
		return $http.post(urlBase + urls.getPlatterByIdAndName, person);
	}; //getPlatterByIdAndName

	Person.getPlatter = function (person) {
		return $http.post(urlBase + urls.getPlatter, person);
	}; //Person.getPlatter

	Person.addPlatter = function (person) {
		return $http.post(urlBase + urls.addPlatter, person);
	}; //Person.addPlatter

	Person.getPerson = function (person) {
		// write(urlBase, 'urlBase');
		// write(urls.getUser, 'urls.getUser');
		// write(person, 'person');

		// debugger;

		return $http.post(urlBase + urls.getUser, person);
	}; //Person.getPerson

	Person.getUserByUserId = function (id) {
		return $http.post(urlBase + urls.getUserByUserId, id);
	};

	Person.getPlatters = function (person) {
		return $http.post(urlBase + urls.getPlatters, person);
	}; //Person.getPlatters

	Person.setPersonId = function (id) { Person.personId = id; }; //Person.setPersonId
	Person.getPersonId = function () { return Person.personId; }; //Person.getPersonId

	Person.setFirstName = function (firstname) { Person.firstname = firstname; }; //Person.firstname
	Person.getFirstName = function () { return Person.firstname; }; //Person.firstname

	Person.setLastName = function (lastname) { Person.lastname = lastname; }; //Person.lastname
	Person.getLastName = function () { return Person.lastname; }; //Person.lastname

	Person.setAccountType = function (accountType) { Person.accountType = accountType; }; //Person.accountType
	Person.getAccountType = function () { return Person.accountType; }; //Person.accountType

	Person.setEmailAddress = function (emailAddress) { Person.emailAddress = emailAddress; }; //Person.emailAddress
	Person.getEmailAddress = function () { return Person.emailAddress; }; //Person.emailAddress

	Person.setPassword = function (password) { Person.password = password; }; //Person.password
	Person.getPassword = function () { return Person.password; }; //Person.password

	Person.setData = function (data) { Person.data = data; }; //Person.data
	Person.getData = function () { return Person.data; }; //Person.data

	return Person;
}); //app.factory(Person)