angular.module('app').component('cooksPlatters', {
	controller: ['$http', '$state', '$mdToast', 'Database', 'Session', 'ShoppingCart', 
	function ($http, $state, $mdToast, Database, Session, ShoppingCart) {
		var that = this;

		this.selectedCookId = undefined;

		this.$onInit = function () {
			that.selectedCookId = Session.selectedCookId;

			var obj = {
				table: 'platters',
				fields: 'userId',
				where: that.selectedCookId
			};
			Database.select(obj)
				.then(function (response) {
					that.cooksPlatters = Session.Collections.cooksPlatters = response.data.data;
				});
		};

		this.addToCart = function (item) {
			ShoppingCart.add(item);

			console.clear();
			console.log("Shopping Cart items...");

			var items = ShoppingCart.shoppingCart();
			console.log("items.length: " + items.length);
			items.forEach(function (platterOrFoodItem, index) {
				console.log(platterOrFoodItem.name);
			});
		};

	}],
	templateUrl: 'partials/components/component.cooksPlatters.html'
});