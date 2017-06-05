angular.module('app').component('dashboardPlatterDetail', {
	controller: function ($state, DashboardService, Session, Cook) {
		var that 			= this;
		this.$onInit = function () {

			this.filteredFoodType = [];
			this.filteredFoodList = [];
			this.the_list = [];


			//The currently selected platter
			this.platter 		= DashboardService.platter;
			//We need to get any platter items that already exist.
			//Then we need to put those items into the this.the_list array.

			//A distinct list of food types for filtering food (used on the filter buttons).
			this.foodTypes = selectDistinct(Session.Collections.food, "type")
				.select(function (t) {
					return t.type;
				});

			//A list of platterItems
			this.selected_Platter_PlatterItems = [];

			//Entire list of the cook's platterItems
			this.platterItems 	= Session.PlatterItemCollection
				.where(function (p) { return (p.platter_id === that.platter.platter_id); })
				.select(
					function (pi) { 
						return pi.foodId 
							+ "||" + pi.food_id
							+ "||" + pi.food_userId 	
							+ "||" + pi.type
							+ "||" + pi.food_name 	
							+ "||" + pi.description 	
							+ "||" + pi.food_status;
					});

			//For each platterItems, SELECT the id, name, price and its collection of food.
			this.platterItems.forEach(function (platterItem, index) {
				var pItem = platterItem;

				//Create an array to hold a single foodItem
				var foodItem = platterItem.split("||");

				//Create a Platter object.
				var PlatterItem = {
					foodId: 		foodItem[0],
					food_id: 		foodItem[1],
					food_userId: 	foodItem[2],
					type: 			foodItem[3],
					food_name: 		foodItem[4],
					name: 			foodItem[4], // <----- !!!
					description: 	foodItem[5],
					food_status: 	foodItem[6]
				};

				//Add the platterItem to the list of platters.
				that.the_list.push(PlatterItem);
			});

			this.cook = new Cook();
		}; //this.$onInit
		this.getFilteredFoodList = function (foodType) {
			that.filteredFoodList.length = 0;

			var _filtered_list = Session.Collections.food
				.where(function (f) {
					return (f.type === foodType)
				})
				.select(function (foodItem) {
					return foodItem.cook_id + "||" + foodItem.description + "||" + foodItem.emailAddress + "||" + 
						foodItem.firstName + "||" + foodItem.food_cook_id + "||" + foodItem.food_id + "||" + 
						foodItem.lastName + "||" + foodItem.message + "||" + foodItem.name + "||" + 
						foodItem.role + "||" + foodItem.status + "||" + foodItem.type + "||" + foodItem.userName;
				});

			_filtered_list.forEach(function (value, key) { 				
				var item = value.split("||");
				var foodItem = {
					cook_id: 		item[0],	description: 	item[1],
					emailAddress: 	item[2],	firstName: 		item[3],
					food_cook_id: 	item[4],	food_id: 		item[5],
					lastName: 		item[6],	message: 		item[7],
					name: 			item[8],	role: 			item[9],
					status: 		item[10],	type: 			item[11],
					userName: 		item[12]
				};

				that.filteredFoodList.push(foodItem);
			});
		};
		this.addFoodItem = function (foodItem) {

			var idx = that.the_list.find(function (element) {
				return element.name === foodItem.name
			});

			if (idx === undefined) {
				that.the_list.push(foodItem);
			}
		};
		this.removeFoodItem = function (index) {
			that.the_list.splice(index, 1);
		};
		this.save = function () {
			var PlatterItems = [];

			//Remove ALL of the current platterItems so that
			//adding will not create new records.
			var PlatterItemToRemove = {
				fieldName: 	"platterId",
				table: 		"platterItems",
				fieldValue: that.platter.platter_id
			};

			that.cook.removePlatterItem(PlatterItemToRemove)
				.then(function (response) {
					for (var i = 0; i < that.the_list.length; i++) {

						var PlatterItem = {
							platterId: 	that.platter.platter_id,
							foodId: 	that.the_list[i].food_id,
							table: 		"platterItems"
						}
						that.cook.addPlatterItem(PlatterItem)
							.then(function (response) {
								return response;
						});

					};
					return response;
				});

		};

	},
	templateUrl: 'partials/dashboard/dashboard.platters.detail.html'

}); //js/dashboard/dashboardplatterdetail.js