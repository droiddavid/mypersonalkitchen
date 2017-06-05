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
