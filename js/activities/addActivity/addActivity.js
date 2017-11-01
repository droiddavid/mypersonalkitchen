angular
	.module('app')
	.component('addActivity', {
		templateUrl: 'partials/activities/addActivity/addActivity.html',
		controller: function (
			$http, $state, $stateParams, Session, 
			ToolbarService, FoodItemListService
		) {

			'use strict'; 

			var that = this;
			this.toolbar = undefined;
			this.fieldList = undefined;
			this.action = undefined;
			this.buttons = undefined;
			this.messages = [];

			this.$onInit = function () {
				if($stateParams.data) {
					if ($stateParams.data.toolbar) {
						ToolbarService.init($stateParams.data.toolbar);
					}
				}
				//There are no items for the current food type.
				if (FoodItemListService.FoodItems.length === 0) {
					that.messages.push({
						message: "There are no " + 
									$stateParams.data.toolbar.name + 
									" items listed.";
					});
				} else {
					that.fieldList = FoodItemListService.FoodItems;
				}
				debugger;
			};
			this.setBody = function () {

			};
			this.setFooter = function () {

			};
			this.go = function (page, data) { 
				$state.go(page, data);
			};
		}
}); //login component
