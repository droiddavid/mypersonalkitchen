angular.module('app').component('dashboardMenuDetail', {
	controller: function ($state, DashboardService, Session) {
		this.$onInit = function () {
			var that = this;
			var menu = this.menu = DashboardService.menu; //The currently selected menu
			var PlattersData = this.getPlatters(menu);
			var PlatterItemsData = this.getPlatterItems(PlattersData);
			this.platters = PlatterItemsData;
		};

		this.getPlatterItems = function (PlatterItemsData) {
			var self = this;
			self._PlatterItems = [];
				
	//SELECT id, name, price FROM the Cook's menus
			PlatterItemsData.forEach(function (value, index) {
				//Create an array to hold a single plate
				var plate = value.split("||");

				//Create a Platter object.
				self.Platter = {
					platter_id: plate[0],
					platter_cook_id: plate[1],
					platter_name: plate[2],
					price: plate[3],
					platter_status: plate[4],
					food: [] //this platter's collection of food.
				};

				//SELECT foodId and foodName where the platter IDs match
				self.PlatterItems = Session.Collections.platterItems
					.where(function (platter) {
						return platter.platterId == self.Platter.platter_id
					})
					.select(function (foodItem) {
						return foodItem.foodId + "||" + foodItem.food_name;
					});

				self.PlatterItems.forEach(function (foodItem, index) {
					var item = foodItem.split("||");
					var Food = {
						foodId: item[0],
						food_name: item[1]
					};
					//Add the food to the platter
					self.Platter.food.push(Food);
				});

				self._PlatterItems.push(self.Platter);
			});

			//Add the platter to the list of platters.
			return this._PlatterItems;
		};

		this.getPlatters = function (menu) {
			return Session.Collections.menusPlatters
				.where(function (m) { return (m.menus_id == menu.menuId); })
				.select(function (p) { 
					return p.platter_id + "||" + p.platter_cook_id + "||" + p.platter_name 
						+ "||" + p.price + "||" + p.platter_status;
				});
		}; //this.getPlatters

		/*** UTILITIES ***************************************/
		this.goBack = function () {
			$state.go('index.dashboard');
		};
	},
	templateUrl: 'partials/dashboard/dashboard.menus.detail.html'
}); //component.menus.platters.js