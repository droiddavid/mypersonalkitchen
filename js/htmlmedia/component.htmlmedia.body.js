'use strict';

angular.module('app').component('htmlmediaBody', {
	bindings: {
		invites: '<'
	},
	controller: function ($http, $state, $stateParams, Session, InvitationService, Database, htmlmediaService) {

		var that = this;

		this.Invitation = undefined;

		this.showVideo = true;
		this.showPhoto = false;

		this.showVideoOrPhoto = function (choice) {
			if (choice === "video") {
				this.showVideo = true;
				this.showPhoto = false;				
			}
			if (choice === "photo") {
				this.showVideo = false;
				this.showPhoto = true;
			}
		};


		// The width and height of the captured photo. We will set the
		// width to the value defined here, but the height will be
		// calculated based on the aspect ratio of the input stream.

		var width = 1024;    // We will scale the photo width to this
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
		this.db_images = undefined;



		this.$onInit = function () {
			that.Invitation = InvitationService.Invitation;

			/* Define your database */
			this.db_images = new Dexie("images_database");
			this.db_images.version(1).stores({
				images: 'filename,imageData'
			});


			if ($stateParams.data) {
				that.Invitation = $stateParams.data;
				InvitationService.Invitation = that.Invitation;
			}

			this.video 			= document.getElementById('video');
			this.canvas 		= document.getElementById('canvas');
			this.photo 			= document.getElementById('photo');
			this.startbutton 	= document.getElementById('startbutton');
			this.output 		= document.getElementById('output');

			navigator.getMedia = ( navigator.getUserMedia ||
								navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia ||
								navigator.msGetUserMedia);

			navigator.getMedia(
				{ video: true, audio: false },
				function(stream) {
					if (navigator.mozGetUserMedia) {
						that.video.mozSrcObject = stream;
					} else {
						var vendorURL = window.URL || window.webkitURL;
						that.video.src = vendorURL.createObjectURL(stream);
					}
					that.video.play();
				},
				function(err) {
					console.log("An error occured! " + err);
				}
			);

			this.video.addEventListener(
				'canplay', 
				function(ev){

					if (!streaming) {
						height = that.video.videoHeight / (that.video.videoWidth/width);

						// Firefox currently has a bug where the height can't be read from
						// the video, so we will make assumptions if this happens.

						if (isNaN(height)) { height = width / (4/3); }

						// debugger;
						 var w = window.innerWidth;
						// var _output = that.output;
						// write(_output, '_output');

						that.output.setAttribute('width', w);

						that.video.setAttribute('width', width);
						that.video.setAttribute('height', height);
						that.canvas.setAttribute('width', width);
						that.canvas.setAttribute('height', height);
						streaming = true;
					}
				}, false
			);

			that.startbutton.addEventListener('click', function(ev){
				that.takepicture();
				ev.preventDefault();
			}, false);

			that.clearphoto();

		};



		this.takepicture = function () {
			
			var context = that.canvas.getContext('2d');

			if (width && height) {
				that.canvas.width = width;
				that.canvas.height = height;
				context.drawImage(that.video, 0, 0, width, height);

				var imageData = that.canvas.toDataURL('image/png');
				that.photo.setAttribute('src', imageData);

				that.Invitation.photo_imageData = imageData;

				htmlmediaService.Image.filename = new Date().getTime();
				htmlmediaService.Image.data = imageData;

			} else {
				that.clearphoto();
			}
		};



		this.saveImageFile = function () {

			that.Invitation.photo_filename = new Date().getTime();

			var fileExistUrl = 'http://' + WEB_SERVER + '/mypersonalkitchen/images/imageExists.php';

			//SAVE TO JSON FILE
			$http.post(fileExistUrl, { 
				fileName: that.Invitation.photo_filename + '.json', 
				data: that.Invitation.photo_imageData 
			})
				.then(
					function (response) {
						return response.data; //returns "1" or "0"
					}
				)
				.then(
					function () {
						$http.post('./images/imageWriter.php', { 
							fileName: that.Invitation.photo_filename,
							data: that.Invitation.photo_imageData
						})
						.then(function (response) {
							return response.data;
						});
					}
				);

			



			//SAVE TO DB

			//Remove the photo_imageData property because it does not exist in the db table.
			//the photo_imageDate is only needed for saving the data to the .json photo file.
			//If it is not removed, then it will be included in the requiredColumnsArray, which
			//will cause the SQL to fail since the field no longer exists in the table.
			//Also, make a copy (assignment) so that we don't accidentally change the original
			//invitation (that.invitation)
			var _invitation = Object.assign({}, that.Invitation);
			delete _invitation.photo_imageData



			var where = {
					"userId" : _invitation.userId,
					"id" : _invitation.id
				},
				table = "invitations", 
				columnsArray = _invitation,
				requiredColumnsArray = Object.keys(_invitation);

			Database.update(table, columnsArray, where, requiredColumnsArray)
				.then(function (response) {
					if (response) { //***CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						var retVal = (response.statusText === "OK") ? "Update Successful" : "Update Failed";
						return retVal;
					} 
				});
			//var $table, $columnsArray, $where, $requiredColumnsArray



			//SAVE TO LOCALSTORAGE			
			that.db_images.images.put({filename: that.Invitation.photo_filename, imageData: that.Invitation.photo_imageData })
				.then (function(){	
					return that.db_images.images.get(that.Invitation.photo_filename);
				})
				.catch(function(error) {
					alert ("Ooops: " + error);
				});


			write(that.invitations, 'that.invitatinos');


			InvitationService.Invitation = that.Invitation;

			that.go('invitations');
		}; //this.saveImageFile






		// Fill the photo with an indication that none has been
		// captured.
		this.clearphoto = function () {
			var context = that.canvas.getContext('2d');
			context.fillStyle = "#AAA";
			context.fillRect(50, 50, this.canvas.width, this.canvas.height);

			var data = that.canvas.toDataURL('image/png');
			that.photo.setAttribute('src', data);
		}

		this.go = function (page) {
			$state.go(page);
		};
		this.save = function (html5media) {

			var obj = {};
			
			//Add the form's elements to the insert object.
			for (var key in html5media) {
				// skip loop if the property is from prototype
				if (!html5media.hasOwnProperty(key)) continue;			
				obj[key] = html5media[key];
			}

			obj.userId 		= Session.id;
			obj.status 		= 1;
			obj.table 		= "html5media";
			this.html5mediaList.push(obj);

			//Insert the object into the db.
			that.db.insert(obj)
				.then(function (response) {
					if (response) { //////****************************CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						var retVal = (response.statusText === "OK") ? "Registration Successful" : "Registration Failed";
						return retVal;
					}
				});

		};
		this.update = function (html5media) {
			//debugger;
			var where = {
				"userId" : Session["id"],
				"id" : html5media.id
			};
			var table = "html5media", 
				columnsArray = html5media,
				requiredColumnsArray = Object.keys(html5media);

			this.db.update(table, columnsArray, where, requiredColumnsArray)
				.then(function (response) {
					if (response) { //***CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						var retVal = (response.statusText === "OK") ? "Update Successful" : "Update Failed";

						that.updateFormData(html5media);
						
						return retVal;
					} 
				});
			//var $table, $columnsArray, $where, $requiredColumnsArray
		};

		/*** UTILITIES ***/
		//update the food type dialog box
		this.updateFormData = function (html5media) {
			//debugger;
			that.html5media.id = html5media.id;
			that.html5media.title = html5media.title;
			that.html5media.message = html5media.message;

			var _bDate = new Date(html5media.beginDate);
			that.html5media.beginDate = _bDate;

			var _eDate = new Date(html5media.endDate);
			that.html5media.endDate = _eDate;

			that.html5media.photo_filename = html5media.photo_filename;
			that.html5media.userId = Session.id;
			that.html5media.status = html5media.status;
		};

	},
	templateUrl: 'partials/htmlmedia/htmlmedia.body.html'
});