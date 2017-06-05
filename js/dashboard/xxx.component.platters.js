/* Platters Component */
angular.module('app').component('xxxdashboardPlatters', {
	bindings: {
		platters: '<',
		platterItems: '<',
		data: '<'
	},
	controller: function ($state, Session, Cook, Database, DashboardService) {
		var that = this, 
			_platters = undefined,
			_plattersWithFoodItems = undefined,
			_plattersWithFoodItems = [],
			_Platter = undefined;
			_db = undefined;
		this.platterFood = [];
		this.foodForPlatters = [];


		this.$onInit = function () {
			that._platters = this.platters;
			debugger;
			var _platterItems = this.platterItems;
			that._db = Database;


			var x = 1;
			Session.Collections.food.forEach(function (item, index) {
				if (x < 15) {
					if (item.food_name !== null) that.foodForPlatters.push(item);
					x++;	
				}
			});
			if (that.platterFood === undefined) that.platterFood.length = 0;


			/***** PLATTERS TAB *****/
			that._platters.forEach(function (platter, index) {

				//At least one platter item is required for each platter.
				var addPlatter = false;

				if (platter.platter_status !== 0) {
					var Platter = {
						id: platter.platter_id,
						name: platter.platter_name,
						price: platter.price,
						status: platter.platter_status,
						cook_id: platter.platter_cook_id,
						Food: [] //holds to food for this platter
					};  //Platter

					//Get the food items for each platter.
					_platterItems.forEach(function (platterItem, index) {
						var platterItems_platterId = platterItem.platter_id;

						if (Platter.id == platterItems_platterId && platterItem.food_id !== null) {
							Platter.Food.push(platterItem);
							addPlatter = true;
						}

					}); //forEach _platterItems

					if (addPlatter) {
						_plattersWithFoodItems.push(Platter);
						addPlatter = false;
					}
				}

			}); //forEach that._platters

			this.data = _plattersWithFoodItems;
		};
		//Triggered by the save button on the 'Add Platter' dialog box. 
		this.addPlatter = function (platter) {
			that._Platter = {};
			//Add the form's elements to the insert object.
			for (var key in platter) {
				// skip loop if the property is from prototype
				if (!platter.hasOwnProperty(key)) continue;			
				that._Platter[key] = platter[key];
			}
			that._Platter.table = "platters";
			that._Platter.userId = Session.id;
			that._Platter.menuId = 0;
			that._Platter.status = 1;
			that._Platter.lastUpdate = Date.now();
			that._Platter.id = undefined;

			var cook = new Cook();
			//Add the platter
			cook.addPlatter(that._Platter)
				.then(function (response) {
					//Get the newly added platter id by using the lastUpdate value
					that._db.select({
						fields: "lastUpdate",
						table: "platters",
						where: that._Platter.lastUpdate
					})
						.then(function (response) {
							var platterRecord = response.data.data;
							that._Platter.platter_name = platterRecord.name;
							that._Platter.platter_id = platterRecord.id;
							that._Platter.price = platterRecord.price;
							that._Platter.cook_id = platterRecord.cook_id;
							that._Platter.status = platterRecord.status;
							that.data.push(that._Platter);
						});
				});
		}; //this.onSave
		this.onDelete = function (platter_id) {
			console.log("onDelete..." + platter_id);
			return true;
		};
		this.onUpdate = function (platter_id) {
			console.log("onUpdate..." + platter_id);
			return true;
		};
		this.addFoodItemToPlatter = function (platter) {
			console.log("platter(arg)...");
			console.table([platter]);
	
			var data = {
				platter_cook_id: platter.cook_id,
				platter_id: platter.id,
				platter_name: platter.name,
				platter_status: platter.status,
				price: platter.price,
				Food: []
			}

			console.log("that.platterFood...");
			console.table([that.platterFood])
		};



		this.checkSelected = function (foodItem) {
			var idx = that.platterFood.indexOf(foodItem);
			return idx > -1;
		};
		this.addFoodItem = function (foodItem) {
			if (that.platterFood !== undefined) {
				var idx = that.platterFood.indexOf(foodItem);
				if (that.platterFood.indexOf(foodItem) == -1) {
					console.log('Pushing: ', foodItem)
					that.platterFood.push(foodItem);
					console.log(that.platterFood);
				} else {
					that.platterFood.splice(idx,1);
				}
			} else {
				console.log("Eh! that.platterFood is not defined :)");
			}
		};
		this.cancelAddPlatter = function () {
			that.platterFood.length = 0; //Clear the food from the array.
		};







		/*** UTILITIES ***************************************/
		this.showPlatterItemsPage = function (platter) {
			DashboardService.platter = platter;
			$state.go('index.dashboardPlatterDetail');
		};

	},
	templateUrl: 'partials/dashboard/dashboard.platters.html'
});
















