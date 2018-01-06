/* Platters Component */
angular.module('app').component('dashboardPlatters', {
	//templateUrl: 'partials/dashboard/dashboard.platters.html',
	templateUrl: 'partials/platters/platters.html',
	controller: [
		'$http', '$state', '$stateParams', '$mdToast', '$rootScope',
		'Session', 'Cook', 'Database', 'ToolbarService',
		'FoodService', 'PlatterService', 'PlatterItemService', 
		function (
			$http, $state, $stateParams, $mdToast, $rootScope,
			Session, Cook, Database, ToolbarService,
			FoodService, PlatterService, PlatterItemService) {

		var that = this;
		this.platter 			= {};
		this.platters 			= undefined;
		this.platterItems 		= undefined;
		this.foodList 			= undefined;
		this.addPlatterPanel 	= undefined;
		this.buttonList 		= undefined;
		this.platterName		= undefined;
		this.description		= undefined;
		this.price				= undefined;

		this.$onInit = function () {
			//Initialize the PlatterService--get Session.Collections.platters and platterItems
			if (!PlatterService.initialized) {
				PlatterService.init(); 
			} else {
				if (that.platters === undefined) {
					that.platters = [];
					that.platters = PlatterService.platters;
				} else {
					that.platters = PlatterService.platters;
				}
			}

			if (!PlatterItemService.initialized) {
				PlatterItemService.init(); } 
			else {
				if (that.platterItems === undefined) {
					that.platterItems = [];
					that.platterItems = PlatterItemService.platterItems;
				} else {
					that.platterItems = PlatterItemService.platterItems;
				}
	
			}

			if (!FoodService.initialized) {
				FoodService.init();
			} else {
				if (that.foodList === undefined) {
					that.foodList = [];
					that.foodList = FoodService.Food;
				} else {
					that.foodList = FoodService.Food;
				}
			}

			ToolbarService.init({
				btnPrevious: {
					id: 'btnPrevious',
					class: 'glyphicon glyphicon-chevron-left brand',
					state: 'cookDashboard',
					style: 'color: white;'
				},
				btnBrand: {
					id: 'btnBrand',
					class: 'brand',
					state: 'cookDashboard',
					style: 'color: white;',
					value: 'Platters'
				},
				menu: [
					{ name: 'HOME (logout)', state: 'index' },
					{ name: 'Invitations', state: 'invitations' },
					{ name: 'Memberships', state: 'memberships' },
					{ name: 'Profile', state: 'profile' }
				]
			}); //ToolbarService.init(...)

			that.addPlatterPanel = document.querySelector("#addPlatterPanel");
			that.addPlatterPanel.style.display = "none";

			that.buttonList = document.querySelector("#buttonList");
			that.buttonList.style.display = "block";

		};
		this.hideAddPlatterPanel = function () {
			if (that.buttonList.style.display === "none") {
				that.buttonList.style.display = "block";
			} else { that.buttonList.style.display = "none"; }

			if (that.addPlatterPanel.style.display === "none") {
				that.addPlatterPanel.style.display = "block";
				that.buttonList.style.display = "none";
			} else { that.addPlatterPanel.style.display = "none"; }
		};
		$rootScope.$on('Platters.loaded', that.loadPlatters);
		this.loadPlatters = function () {
			if ((PlatterService.platters && PlatterService.isInitialized) && !that.platters) {
				that.platters = PlatterService.platters;
			}};
		this.close = function () {
			PlatterItemService.close();
		};
		this.removeFoodItem = function (platter, foodItem) {
			PlatterService.removeFoodItem(platter, foodItem);
		};
		this.addPlatter = function () {

			var Platter = {};
			Platter.name = that.platterName;
			Platter.description = that.description;
			Platter.price = that.price;
			Platter.table = "platters";
			Platter.userId = Session.id;
			Platter.menuId = 0;
			Platter.status = 1;
			Platter.lastUpdate = Date.now();
			Platter.id = undefined;

			var cook = new Cook();
			//Add the platter
			cook.addPlatter(Platter)
				.then(function (response) {
					//Get the newly added platter id by using the lastUpdate value
					Database.select({ fields: "lastUpdate", table: "platters", where: Platter.lastUpdate })
						.then(function (response) {
							if ( response.data.data !== undefined && response.data.data.length > 0 ) {
								var platterRecord = response.data.data[0];
								Platter.platter_name = platterRecord.name;
								Platter.platter_id = platterRecord.id;
								Platter.id = platterRecord.id;
								Platter.price = platterRecord.price;
								Platter.cook_id = platterRecord.userId;
								Platter.status = platterRecord.status;
								that.platters.push(Platter);
							} else {
								console.log("Insert or Select Failed.");
							}
							for (var index = 0; index < that.platters.length; index++) {
								if (that.platters[index].id === Platter.id) {
									var a = that.platters.splice(index,1);	// removes the item
									that.platters.unshift(a[0]);			// adds it back to the beginning
									break;
								}
							}
							//Reset the form fields
							that.platterName		= undefined;
							that.description		= undefined;
							that.price				= undefined;
						});
				}); //.then(function (response) {  --> from cook.addPlatter(Platter)

			that.hideAddPlatterPanel();}; //this.addPlatter
		this.addFoodItemToPlatter = function (platter) {
			$state.go('addPlatterItemActivity', {
				"data": {
					"platter": platter
				}
			});	}

		//Move this code to the addPlatterActivity component
		//Move this code to the addPlatterActivity component
		this.add = function (foodItem) {
			foodItem.food_name = foodItem.name;
			foodItem.platter_id = PlatterService.platter.platter_id;

			PlatterService.platter.Food.push(foodItem);

			//Add the food item to the DB
			PlatterItemService.add(foodItem);

			PlatterService.isOnPlatter();
		};
		//Move this code to the addPlatterActivity component
		//Move this code to the addPlatterActivity component

		this.onDelete = function (platter) {
			that.deletePlatter(platter);
			that.deletePlatterItems(platter);
			that.deletePlatterItemsFromArray(platter);};
		this.deletePlatter = function (platter) {
			//Remove platter from db.platters where platterId = platter.id
			var obj = {
				table: "platters",
				fieldName: "id",
				fieldValue: platter.id
			};
			Database.delete(obj)
				.then(function (response) {
					return response;
				});};
		this.deletePlatterItems = function (platter) {
			//Remove platterItems from db.platterItems where platterId = platter.id
			var obj = {
				table: "platterItems",
				fieldName: "platterId",
				fieldValue: platter.id
			};
			Database.delete(obj)
				.then(function (response) {
					return response;
				});};
		this.deletePlatterItemsFromArray = function (platter) {
			var index = that.platters.indexOf(platter);
			that.platters.splice(index, 1);};
	}]
});