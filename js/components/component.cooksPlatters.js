angular.module('app').component('cooksPlatters', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'ShoppingCart', 
	function ($http, $state, $mdToast, Database, Session, ShoppingCart) {
		var that = this;

		this.selectedCookId = undefined;
		this.cooksPlatters = [];

		this.TAX_RATE = .08;

		this.$onInit = function () {
			that.selectedCookId = Session.selectedCookId;

			var obj = {
				table: 'platters',
				fields: 'userId',
				where: that.selectedCookId
			};
			Database.select(obj)
				.then(function (response) {
					var platter = {};

					if (response.data) {
						Session.Collections.cooksPlatters = response.data.data;
					}

					if (Session.Collections.cooksPlatters.length > 0) {
						Session.Collections.cooksPlatters.forEach(function (item, index) {
							platter = item;
							platter.quantity = 0;
							platter.tax = item.price * that.TAX_RATE;
							platter.platterId = item.id;
							that.cooksPlatters.push(platter);
							platter = {};
						});
					}
				});
		};

		this.addToCart = function (item) {

			ShoppingCart.add(item);

		};

	}],
	templateUrl: 'partials/components/component.cooksPlatters.html'
});