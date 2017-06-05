angular.module('app').service('shoppingCart', ['$http', 'Database', function ($http, Database) {
	'use strict';

	var that = this;


	this.items = []; //list of items
	this.item = undefined; //current item

	

	this.add = function (item) {
		that.items.push(item);
	}; //add

	this.shoppingCart = function () {
		return items;
	};

	this.remove = function (item) {
		//that.shoppingCart.splice();
	};

	this.getTotal = function () {
		var _total = 0;
		for (var i = 0; i < items.length; i++) {
			_total += items.price;
		}
		return _total;
	};

	this.getTaxes = function () {
		var _taxes = 0;
		for (var taxes = 0; taxes < that.shoppingCart.length; taxes++) {
			_taxes += items.tax;
		}
		return _taxes;
	};

	return this;

}]); //angular.module('app').service('InvitationService'




