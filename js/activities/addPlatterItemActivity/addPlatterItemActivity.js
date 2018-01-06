angular
	.module('app')
	.component('addPlatterItemActivity', {
		templateUrl: 'partials/activities/addPlatterItemActivity/addPlatterItemActivity.html',
		controller: [
			'$http', '$state', '$stateParams', 
			'Session', 'Database', 'ToolbarService', 
			'PlatterService', 'PlatterItemService', 'FoodService', function (
			$http, $state, $stateParams, 
			Session, Database, ToolbarService, 
			PlatterService, PlatterItemService, FoodService
		) {

			'use strict'; 

			var that = this;

			this.platter = undefined;
			this.Food = undefined;
			this.foodList = [];
			this.activeType = undefined;
			this.selectedFoodList = [];

			this.toggleFoodList = function (foodType) {
				that.selectedFoodList.length = 0;

				if (that.activeType === foodType) {
					that.activeType = !foodType;
				} else {
					that.activeType = foodType;
				}

				if (that.activeType !== undefined) {
					var categorizedFood = that.filterByType(foodType);
					categorizedFood.forEach(function (foodItem, index) {
						var temp = foodItem.split("||"); //i.e. temp[], split returns an array						
						var id = parseInt(temp[0]);
						var price = parseInt(temp[4]);
						var categorizedFoodItem = {
							"id": id,
							"type": temp[1],
							"name": temp[2],
							"description": temp[3],
							"price": price,
							"status": temp[5],
							"isOnPlatter": undefined
						};
						for (var i=0; i<that.platter.Food.length; i++) {
							var platter_food_id = that.platter.Food[i].id;

							if (categorizedFoodItem.id === platter_food_id) {
								categorizedFoodItem.isOnPlatter = true;
							}
						};

						that.selectedFoodList.push(categorizedFoodItem);
						var thatFood = that.platter.Food;
					});
				}
			};

			this.filterByType = function (foodType) {
				return that.Food
					.where(function (m) { return (m.type === foodType); })
					.select(function (f) {
						return f.id + "||" + f.type + "||" + f.name + "||" + f.description + "||" + f.price + "||" + f.status;
					});
			};

			this.cameraInput = document.querySelector('#cameraInput');
			this.cameraImage = document.querySelector('#cameraImage');

			this.findFoodItemOnPlatter = function (foodItem) {
				var found = false;

				that.platter.Food.forEach(function (item, index) {
					if (foodItem.id === item.id) {
						found = true;
					}
				});

				return found;
			};

			this.addFoodItemToPlatter = function (foodItem) {
				/*
					1. Verify the platter exists.
					2. Determine if the foodItem is on the platter...
						a. if it is on the platter
							return
						b. otherwise
							i. add to the db (platterItems table)
							ii. add to PlatterService.platter.Food
							iii. update PlatterService.platters with the updated PlatterService.platter
							iv. verify platter.Food is refreshed in the list ($ctrl.platter.Food)
							v. verify PlatterService.platter update is reflected on the platters page.
				*/
				if (!that.platter || !foodItem) {
					return;
				}

				//Is the foodItem on the platter?
				var onPlatter = that.platter.Food.filter(function (item, index) {
					return item.id === foodItem.id;
				});
				//If the foodItem is NOT on the plater
				if (onPlatter.length === 0) {
					
					//1. Get the platter's index from the PlatterService's platters.
					var platterIndex = PlatterService.platters.findIndex(function (platter) {
						return platter.id === that.platter.id;
					});

					//2. Add the food Item to the PlatterService's platters' Food array.
					PlatterService.platters[platterIndex].Food.push(foodItem);

					//3. Add the food Item to the current page's platter's Food array.
					that.platter.Food.push(foodItem);

					//Build the insert object.
					var obj = {};
					obj.platterId 	= that.platter.id;
					obj.foodId 		= foodItem.id;
					obj.userId 		= Session.id;
					obj.table 		= "platterItems";

					//Insert the object into the db
					Database.insert(obj)
						.then(function (response) {
							return response;
						});

				} else {
					return;
				}



				//inform the user that the food item is on the platter
				// $mdToast.show(
				// 	$mdToast.simple()
				// 	.textContent(foodItem.name + ' added.')                       
				// 	.hideDelay(3000)
				// );
				that.isOnPlatter();
			};


			this.$onInit = function () {

				//Reference to the current platter.
				if ($stateParams && $stateParams.data && $stateParams.data.platter) {
					that.platter = $stateParams.data.platter;
				}
				//Reference to this cook's food table data
				if (FoodService) {
					that.Food = FoodService.Food;
				}

				ToolbarService.init({
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'platters',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'platters',
						style: 'color: white;',
						value: that.platter.name
					},
					menu: [
						{ name: 'HOME (logout)', state: 'index' },
						{ name: 'Invitations', state: 'invitations' },
						{ name: 'Memberships', state: 'memberships' },
						{ name: 'Profile', state: 'profile' }
					]
				}); //ToolbarService.init(...)

				//Add event listener to the camera button
				that.cameraInput.addEventListener(
					"change", function handleFiles(FileList) {

					var preview = document.querySelector('#cameraImage');
					var file = FileList.currentTarget.files[0];
					var reader  = new FileReader();

					reader.addEventListener("load", function () {
						preview.src = that.FoodItem.image = reader.result;
					}, false);

					reader.addEventListener("loadend", function () {
						var camerabutton = document.querySelector('#cameraInput');
						camerabutton.style = "display: none;";
					}, false);

					if (file) {
						reader.readAsDataURL(file);
					}
				}, false);

				that.buildFoodListByType();
				that.isOnPlatter();

			};
			this.buildFoodListByType = function () {

				//We need distinct types to display on each tab.
				that.unfilteredTypes = selectDistinct(that.Food, "type");
				that.types = [];
				that.unfilteredTypes.forEach(
					function (item, index) {
						that.types.push({ type: item.type });
					}
				);
				that.types.forEach(function (type, index) {
					var foodItem = [];
					that.Food.forEach(function (food, ndx) {
						if (type.type === food.type) {
							foodItem.push(food);
						}
					});
					that.foodList.push({ type: type.type, items: foodItem });
				});

				that.isOnPlatter();

			};
			this.isOnPlatter = function () {
				that.platter.Food.forEach(function (foodItem, i) {
					that.selectedFoodList.forEach(function (selectedFoodItem, index) {
						if (foodItem.id === selectedFoodItem.id) {
							that.platter.Food[i].isOnPlatter = true;
						}
					});
				});
			};
			this.takePhoto = function () {
				$state.go('photo');
			};
			this.cameraInput_click = function () {
				var camerabutton = document.querySelector('#cameraInput');
				camerabutton.style = "display: block;";
				camerabutton.click();
			};

		}]
}); //addPlatterItemActivity component