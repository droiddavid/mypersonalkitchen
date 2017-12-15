angular
	.module('app')
	.component('photo', {
		templateUrl: 'partials/photo/photo.html',
		controller: function (ToolbarService, PhotoService, htmlmediaService) {
			'use strict';

			var that = this;

			this.Invitation = undefined;

			this.showVideo = true;
			this.showPhoto = false;

			this.showVideoOrPhoto = function (choice) {
				(choice === "video") ? that.showVideo = true : that.showPhoto = false;
				// if (choice === "video") { that.showVideo = true; that.showPhoto = false;}
				// if (choice === "photo") { that.showVideo = false; that.showPhoto = true;}
			};

			// The width and height of the captured photo. We will set the
			// width to the value defined here, but the height will be
			// calculated based on the aspect ratio of the input stream.

			var width = window.innerWidth;    // We will scale the photo width to this
			var height = 0;     // This will be computed based on the input stream

			// |streaming| indicates whether or not we're currently streaming
			// video from the camera. Obviously, we start at false.

			var streaming = false;

			// The various HTML elements we need to configure or control. These
			// will be set by the startup() function.
			
			var video = null;
			var canvas = null;
			var photo = null;
			var startbutton = null;
			var output = null;
			var db_images = undefined;

			this.toolbar 			= undefined;
			this.cameraContainer 	= undefined;
			this.cameraButtons 		= undefined;
			this.cameraInput		= undefined;
			this.cameraImage		= undefined;


			this.messages = [];


			this.$onInit = function () {
				ToolbarService.init({
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'addFoodActivity',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'photo',
						style: 'color: white;',
						value: 'Camera'
					},
					menu: [
						{ name: 'HOME (logout)', state: 'index' },
						{ name: 'Profile', state: 'profile' },
						{ name: 'Memberships', state: 'memberships' }
					]
				}); //ToolbarService.init(...)

				that.toolbar 			= document.querySelector('#toolbar');
				that.cameraContainer 	= document.querySelector('#cameraContainer');
				that.cameraButtons 		= document.querySelector('#cameraButtons');
				that.cameraInput		= document.querySelector('#cameraInput');
				that.cameraImage		= document.querySelector('#cameraImage');
				//that.cameraInput 		= document.createElement('input');

				//Add event listener to the camera button
				that.cameraInput.addEventListener("change", function handleFiles(FileList) {
					var preview = document.querySelector('#cameraImage');
					var file = FileList.currentTarget.files[0];
					var reader  = new FileReader();

					reader.addEventListener("load", function () {
						//preview.src = that.FoodItem.image = reader.result;
						preview.src = that.cameraImage = reader.result;
					}, false);

					if (file) {
						reader.readAsDataURL(file);
					}
				}, false);
				
				that.cameraInput.type = "file";
				that.cameraInput.id = "cameraInput";
				//that.cameraInput.class = "btn btn-success";
				that.cameraInput.name = "cameraInput";
				that.cameraInput.capture = "camera";
				that.cameraInput.accept = "image/*";

				// setTimeout(function(){
				// 	$("#cameraInput").click();
				// },200);

			}; //this.$onInit



			this.takepicture = function () {
				
				var context = that.canvas.getContext('2d');

				if (width && height) {
					that.canvas.width = width;
					that.canvas.height = height;
					context.drawImage(that.video, 0, 0, width, height);

					var imageData = that.canvas.toDataURL('image/png');
					that.photo.setAttribute('src', imageData);

					//that.Invitation.photo_imageData = imageData;

					htmlmediaService.Image.filename = new Date().getTime();
					htmlmediaService.Image.data = imageData;
					that.showVideo = false;
					that.showPhoto = true;

				} else {
					that.clearphoto();
				}
			}; //this.takepicture


			// Fill the photo with an indication that none has been captured.
			this.clearphoto = function () {
				var context = that.canvas.getContext('2d');
				context.fillStyle = "#AAA";
				context.fillRect(50, 50, this.canvas.width, this.canvas.height);

				var data = that.canvas.toDataURL('image/png');
				that.photo.setAttribute('src', data);
			}; //this.clearphoto

		} //controller

	}); //photo component