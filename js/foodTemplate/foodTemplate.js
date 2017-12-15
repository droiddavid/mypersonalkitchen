/*
	A list of food items already filtered by category, 
	ie Meats = Category, List = Chicken, Steak, etc.
*/
angular
	.module('app')
	.component('foodTemplate', {
		templateUrl: 'partials/foodTemplate/foodTemplate.html',
		controller: function ($http, $state, $stateParams, Session, ToolbarService, FoodItemListService) {

			'use strict'; 

			var that = this;
			this.type = undefined;
			this.List = undefined;
			this.messages = [];

			this.$onInit = function () {
				if ($stateParams.data.toolbar) {
					ToolbarService.init($stateParams.data.toolbar);
				}
				if ($stateParams) {
					if ($stateParams.data) {
						if ($stateParams.data.foodType) {
							that.type = $stateParams.data.foodType.type;
						}
					}
				}
				if (FoodItemListService) {
					if (FoodItemListService.FoodItems) {
						if (FoodItemListService.FoodItems.length > 0) {
							that.List = FoodItemListService.FoodItems;
						} else {
							that.messages.push({
								message: "You have 0 " + that.type + " available."
							});
						}					
					} else {
						that.messages.push({
							message: "You have 0 " + that.type + " available."
						});
					}
				}
			};
			this.addFoodItem = function () {
				$state.go('addFoodActivity', {
					"data": {	
						"toolbar": that.toolbar,
						"fieldList": that.fieldList,
						"action": that.action,
						"buttons" : that.buttons,
						"type" : that.type
					}
				});
			};
			this.setBody = function () {};
			this.setFooter = function () {};

			this.go = function (page) { 
				$state.go(page, { 
					"data": {	
						"toolbar": that.toolbar,
						"fieldList": that.fieldList,
						"action": that.action,
						"buttons" : that.buttons
					}
				});
			};
		}
}); //login component
