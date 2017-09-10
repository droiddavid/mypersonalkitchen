angular.module('app').component('memberDashboardDetail', {
	//NOTE: nothing to bind to at this time.
	controller: ['$scope', '$http', '$state', '$stateParams', '$mdToast', 'Database', 'Session', 'ShoppingCart',
	function ($scope, $http, $state, $stateParams, $mdToast, Database, Session, ShoppingCart) {
		var that = this;

		this.food = [],
		this.types = [],
		this.foodList = [];
		this.cookUserId = undefined;

		$scope.oneAtATime = true;

		this.shoppingCart = undefined;
		this.total = ShoppingCart.getTotal();
		this.taxes = undefined;
		this.internetFee = undefined;
		this.grandTotal = undefined;

		this.getFood = function (userId) {
			//Get the food for the selected cook
			Session.Collections.cooksFood.forEach(function (foodItem, index) {
				if (foodItem.userId === userId) {
					that.food.push(foodItem);
				}
			});
		}; //this.getFood

		this.setListByTypes = function () {
			//We need distinct types to display on the food in separate sections.
			that.unfilteredTypes = selectDistinct(that.food, "type");
			that.unfilteredTypes.forEach(
				function (item, index) {
					that.types.push({ type: item.type });
				}
			);
			//For each food type, add the food type, the list of items related to that type and an
			//indication determining whether the typed list is open or closed (groupOpen).
			that.types.forEach(function (type, index) {
				var foodItem = [];
				that.food.forEach(function (food, ndx) {
					if (type.type === food.type) {
						food.quantity = 0;
						food.foodId = food.id;
						foodItem.push(food);
					}
				});
				that.foodList.push({ type: type.type, items: foodItem, groupOpen: false });
			});
		}; //this.setListByTypes


		this.documentWidth = undefined;
		this.selectFoodNavBarHeight = undefined;
		this.selectFoodNavBarWidth = undefined;
		this.shoppingCartPanelWidth = undefined;
		this.shoppingCartPanelPosition = undefined;

		this.$onInit = function () {

			/* SELECTED COOK SELECTED COOK SELECTED COOK SELECTED COOK */
			that.cookUserId = Session.selectedCookId = $stateParams['cookUserId'];

			that.getFood(that.cookUserId);
			that.setListByTypes();	

			//Absolutely postion the shopping cart panel.
			that.selectFoodNavBarHeight = $('#selectFoodNavBar').height();
			that.selectFoodNavBarWidth = $('#selectFoodNavBar').width();
			that.documentWidth = $( document ).width();
			that.shoppingCartPanelWidth = $( document ).width() / 2;
			that.shoppingCartPanelPosition = that.documentWidth - (that.shoppingCartPanelWidth);
			
			$( "#shoppingCartPanel" ).width( that.documentWidth )
				.css('position', 'absolute')
				.css('left', that.documentWidth)
				.css('top', that.selectFoodNavBarHeight);

		};


		this.$doCheck = function () {

			if (ShoppingCart.items.length > 0) {
				console.log("There are " + ShoppingCart.items.length + " items in ShoppingCart.items");
			}

			if (that.shoppingCart !== undefined) {
				calculateTotal();
				that.shoppingCart = ShoppingCart.shoppingCart();
			} else {
				calculateTotal();
				that.shoppingCart = this.shoppingCart = ShoppingCart.shoppingCart();
			}

		};

		this.toggleShoppingCart = function () {
			$('#shoppingCartPanel')
				.removeClass('shoppingCartPanelCloseMenu')
				.addClass('shoppingCartPanelShowMenu');

			write(that.shoppingCart, 'that.shoppingCart');
		};

		this.closeShoppingCart = function () {
			$('#shoppingCartPanel')
				.removeClass('shoppingCartPanelShowMenu')
				.addClass('shoppingCartPanelCloseMenu');
		};



		//On the food tab, toggle each section as open or closed
		this.toggleOpen = function (foodListItem) {
			that.foodList.forEach(function (foodObj, index) {				
				if (foodListItem.type === foodObj.type && foodListItem.groupOpen === true) {
					foodObj.groupOpen = false;
				} else {
					if (foodListItem.type === foodObj.type) {
						foodObj.groupOpen = true; 
					} else {
						foodObj.groupOpen = false;
					}
				}
			});
		};

		this.addToCart = function (item) {

			ShoppingCart.add(item);
			that.shoppingCart = ShoppingCart.shoppingCart();

			calculateTotal();

		};

		function calculateTotal() {

			that.total = ShoppingCart.getTotal();
			that.taxes = ShoppingCart.getTaxes();
			that.internetFee = ShoppingCart.getInternetFee() * .5;
			that.grandTotal = ShoppingCart.getGrandTotal();

		};

		this.removeFromCart = function (item) {
			//find object in array.
			var obj = undefined;

			ShoppingCart.items.forEach(function (itm, index) {
				if (item.food.id === itm.food.id) {
					obj = itm;
					obj.index = index;
				}

			});

			//get the index.
			var index = obj.index;

			//get the quantity.
			var quantity = obj.food.quantity;

			//if the quantity is equal to 0, then remove item.
			//	otherwise subtract 1 from quantity.
			if (quantity === 1) {
				ShoppingCart.items[index].food.quantity -= 1;
				ShoppingCart.items.splice(index, 1);
				calculateTotal();
			} else {
				ShoppingCart.items[index].food.quantity -= 1;
				calculateTotal();
			}

			// console.log('Removing...');
			// write(ShoppingCart.items, 'ShoppingCart.items');

			// //we need to remove one from this item also.  see foodList.types.items
			// var test = item;
			// debugger;
		};
	}],
	templateUrl: 'partials/guestDashboard/guestDashboardDetail.html'
});