'use strict';

angular.module('app').component('htmlmedia', {
	bindings: {
		html5media: '<'
	},
	controller: function ($http, $state, $stateParams, Session, Person, FileService) {

		var that = this;

		this.data = undefined;

		this.$onInit = function () {
			console.log('component.html5media...');

			write($stateParams, '$stateParams');
			write($state, '$state');

			that.data = $stateParams.data;

			var _invitation = that.data;

			//write(this.html5media, 'this.html5media');
			console.log('...component.html5media');

		};		
		this.go = function (page) {
			$state.go(page);
		};

	},
	templateUrl: 'partials/htmlmedia/htmlmedia.html'
});