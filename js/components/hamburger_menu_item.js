'use strict';

angular.module('app').component('hamburger', {
	bindings: {
		link: '<',
		linkText: '<'
	},
	controller: function () {
		var that = this;

		this.l = undefined;
		this.lt = undefined;

		this.$onInit = function () {
			// write(this, 'this');
			// debugger;
			// that.l = that.link;
			// that.lt = that.linkTest;
			// write(that.l, 'link');
			// write(that.lt, 'linkTest');
		}
	},
	templateUrl: 'partials/components/hamburger_menu_item.html'
});