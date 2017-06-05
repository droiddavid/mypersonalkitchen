/* js/dashboard/component.dashboard.js */
//console.log("js/dashboard/component.dashboard.js");

angular.module('app').component('dashboard', {
	bindings: {
		food: '<',
		platters: '<',
		platterItems: '<',
		menus: '<',
		menusPlatters: '<',
		menusPlattersPlatterItems: '<'
	},
	controller: function (Session) {
		this.$onInit = function () {
			if (!this.food) {
				this.food = Session.Collections.food;
			}

			if (!this.platters) 
				this.platters = Session.Collections.platters;

			if (!this.platterItems) 
				this.platterItems = Session.Collections.platterItems;

			if (!this.menus)
				this.menus = Session.Collections.menusPlattersPlatterItems;

			if (!this.menusPlatters)
				this.menusPlatters = Session.Collections.menusPlatters;

			if (!this.menusPlattersPlatterItems)
			 	this.menusPlattersPlatterItems = Session.Collections.menusPlattersPlatterItems;

		};
	},
	templateUrl: 'partials/dashboard/dashboard.html'
});
angular.module('app').component('dashboardHeader', {
	bindings: {
		link: '<',
		linkTest: '<'
	},
	controller: function () {
		var that = this;
		console.log('dashboardHeader.$onInit...');
		this.$onInit = function () {};
		console.log('...dashboardHeader.$onInit');
	
	},
	templateUrl: 'partials/dashboard/dashboard.header.html'
});
angular.module('app').component('dashboardBody', {
	controller: function () {
		var that = this;
		console.log('dashboardBody.$onInit...');
		this.$onInit = function () {};
		console.log('...dashboardBody.$onInit');
	
	},
	templateUrl: 'partials/dashboard/dashboard.body.html'
});
angular.module('app').component('dashboardFooter', {
	controller: function () {
		var that = this;
		console.log('dashboardFooter.$onInit...');
		this.$onInit = function () {};
		console.log('...dashboardFooter.$onInit');
	
	},
	templateUrl: 'partials/dashboard/dashboard.footer.html'
});