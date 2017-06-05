angular.module('app').factory('User', [function () {
	'use strict';
	
	/* Constructor, with class name */
	function User(userId) {
		this.personId = userId;
	} //User

	/* Public properties, assigned to the instance ('this') */
	User.prototype.personId = 0;

	/* Public method, assigned to prototype */ /* Getters and Setters */
	User.prototype.getPersonId = function () { return this.personId; };
	User.prototype.getFullName = function () {
		return this.firstName + " " + this.lastName;
	}; //getFullName

	/* Return the constructor function */
	return User;
}]); //app.factories.factory.User