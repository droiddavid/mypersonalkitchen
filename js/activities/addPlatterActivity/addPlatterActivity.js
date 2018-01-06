angular
	.module('app')
	.component('addPlatterActivity', {
		templateUrl: 'partials/activities/addPlatterActivity/addPlatterActivity.html',
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
			this.cameraInput = document.querySelector('#cameraInput');
			this.cameraOutput = document.querySelector('#cameraOutput');
			this.cameraImage = document.querySelector('#cameraImage');

			this.platter = undefined;

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
}); //login component















