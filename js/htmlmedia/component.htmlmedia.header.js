'use strict';

angular.module('app').component('htmlmediaHeader', {
	controller: function ($http, $state, Session, Person, FileService) {
		var that = this;

		this.$onInit = function () {
			console.log('component.htmlmediaHeader...');
			console.log('...component.htmlmediaHeader');
			
		};		
		this.go = function (page) {
			$state.go(page);
		};
	},
	templateUrl: 'partials/htmlmedia/htmlmedia.header.html'
});