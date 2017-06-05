angular.module('app').service('UserService', function($http) { 
	return {
		list: function() {
			return $http.get('./data/users.json', { cache: true })
				.then(function (resp) {
					return resp.data;
				});
		}
	};
});