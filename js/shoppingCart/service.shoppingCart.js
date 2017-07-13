angular.module('app').service('ShoppingCart', ['$http', 'Database', function ($http, Database) {
	'use strict';

	var that = this;


	this.items = []; //list of items
	this.item = undefined; //current item

	this.TAX_RATE = 0.00 //0.08;
	this.INTERNET_FEE = .20;

	this.total = undefined;
	this.taxes = undefined;
	this.internetFee = undefined;
	this.grandTotal = undefined;
	

	this.add = function (food) {

		var isFound = false;

		that.items.forEach(function (obj, index) {
			if (obj.food.id === food.id) {
				obj.food.quantity = obj.food.quantity + 1;
				console.log(food.name + ' added. There are now ' + obj.food.quantity + '.');
				isFound = true;
			}
		});
		if (!isFound) {
			food.quantity += 1;

			var obj = {
				food: food,
				tax: (food.quantity * food.price) * that.TAX_RATE
			};

			that.items.push(obj);
			isFound = false;
		}

	}; //add

	this.shoppingCart = function () {
		return that.items;
	};

	this.remove = function (item) {
		//that.shoppingCart.splice();
	};

	this.getTotal = function () {
		var _total = 0;
		for (var i = 0; i < that.items.length; i++) {
			_total += ( that.items[i].food.price * that.items[i].food.quantity );
		}

		that.total = _total;

		return _total;
	};

	this.getTaxes = function () {
		var taxes = that.taxes = that.getTotal() * that.TAX_RATE;
		return taxes;
	};

	this.getInternetFee = function () {
		var ifee = that.internetFee =  that.total * that.INTERNET_FEE;
		return ifee;
	};

	this.getGrandTotal = function () {
		var _grandTotal =  that.total + that.taxes + ( that.internetFee * .5 );
		return _grandTotal;
	};

	return this;

}]); //angular.module('app').service('InvitationService'