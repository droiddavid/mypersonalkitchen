angular
	.module('app')
	.component('addActivity', {
		templateUrl: 'partials/activities/addActivity/addActivity.html',
		controller: function (
			$http, $state, $stateParams, Session, Database, Cook, 
			ToolbarService, FoodItemListService
		) {

			'use strict'; 

			var that = this;
			this.toolbar = undefined;
			this.fieldList = undefined;
			this.action = undefined;
			this.buttons = undefined;
			this.messages = [];
			this.FoodItem = {
				"userId": undefined,
				"type": undefined,
				"name": undefined,
				"description": undefined,
				"image": undefined,
				"status": undefined
			};
			this.cameraInput = document.querySelector('#cameraInput');
			this.cameraOutput = document.querySelector('#cameraOutput');
			this.cameraImage = document.querySelector('#cameraImage');

			this.$onInit = function () {

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

				if($stateParams.data) {
					if ($stateParams.data.toolbar) {
						ToolbarService.init($stateParams.data.toolbar);
					}
				}
				if (FoodItemListService.FoodItems) {
					//There are no items for the current food type.
					if (FoodItemListService.FoodItems.length === 0) {
						that.messages.push({
							message: "There are no " + 
								$stateParams.data.toolbar.name + 
								" items listed."
						});
					} else {
						that.fieldList = FoodItemListService.FoodItems;
					}					
				}
			};
			this.addFoodItem = function () {
				//1. Verify foodItem has required data.
				//2. Verify foodItem is not already in the DB.
				//3. If not, then add to the DB.
				//4. Inform user.
				//5. Change button from 'Add' to 'Edit'.
				//6. Add a 'Delete' button.
				that.FoodItem.type = ToolbarService.btnBrand.value;
				that.FoodItem.userId = Session.id;
				that.FoodItem.table = "food";

				var cook = new Cook();
				cook.addFood(that.FoodItem)
					.then(function (response) {
						if (response) {
							return response;
						}
					});
				//2. Verify foodItem is not already in the DB.//3. If not, then add to the DB.//4. Inform user.//5. Change button from 'Add' to 'Edit'.//6. Add a 'Delete' button.
			};
			this.takePhoto = function () {
				$state.go('photo');
			};
			this.cameraInput_click = function () {
				that.messages.push({ "message": "cameraInput_click: defined" });
				var camerabutton = document.querySelector('#cameraInput');
				camerabutton.style = "display: block;";
				that.messages.push({ "message": "cameraInput_click: clicked" });
				camerabutton.click();
			};
			this.setBody = function () {};
			this.setFooter = function () {};
		}
}); //login component















