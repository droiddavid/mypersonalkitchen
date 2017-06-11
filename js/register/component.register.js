
angular.module('app').component('register', {
	//NOTE: nothing to bind to because user is attempting to register
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'Person', 'DataService', function ($http, $state, $mdToast, Database, Session, Person, DataService) {
		var that = this;

		this.person = undefined;
		this.registered = false;

		this.$onInit = function () {
			//console.log('Register Component controller.');
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
					if (response.data.data[0] === undefined) {
						that.addNewUser();
					} else {
						console.log(person.firstName + ' is found.');
						that.shouldLogin();
					}
					return response;
				});
		};
		that.addNewUser = function () {
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
					that.registered = true;
					//inform the user that the food item is on the platter
					$mdToast.show(
						$mdToast.simple()
						.textContent('Registration successful. Use Login Tab to login.')
						.hideDelay(3000)
					);
				});
		};
		that.shouldLogin = function () {

		};
	}],
	templateUrl: 'partials/register/register.html'
});


