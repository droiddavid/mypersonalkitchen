
angular
	.module('app')
	.component('foodTemplate', {
		templateUrl: 'partials/foodTemplate/foodTemplate.html',
		controller: function ($http, $state, $stateParams, Session, ToolbarService, FoodItemListService) {

			'use strict'; 

			var that = this;
			this.type = undefined;
			this.List = undefined;

			this.$onInit = function () {
				if ($stateParams.data.toolbar) {
					ToolbarService.init($stateParams.data.toolbar);
				}
				if ($stateParams.data.foodType) {
					that.type = $stateParams.data.foodType.type;
					that.List = FoodItemListService.FoodItems;
				}
			};
			this.addFoodItem = function () {
				$state.go('addActivity', {
					"data": {	
						"toolbar": that.toolbar,
						"fieldList": that.fieldList,
						"action": that.action,
						"buttons" : that.buttons
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
