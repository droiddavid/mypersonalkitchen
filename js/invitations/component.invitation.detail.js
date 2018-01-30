'use strict';

angular.module('app').component('invitationDetail', {
	templateUrl: 'partials/invitations/invitation.detail.html',
	controller: ['$http', '$state', '$stateParams', 'Session', 'ToolbarService', 'InvitationService',
		function ($http, $state, $stateParams, Session, ToolbarService, InvitationService) {

			var that = this;

			this.invitation = {};
			//this.shoppingCart = ShoppingCart;
			this.cameraInput = document.querySelector('#cameraInput');
			this.cameraImage = document.querySelector('#cameraImage');


			this.$onInit = function () {
				if (!InvitationService.initialized) {
					InvitationService.init();
				} else {
					if (that.invitation === undefined) {
						that.invitation = InvitationService.invitation;
					} else {
						that.invitation = InvitationService.invitation;
					}
				}

				ToolbarService.init({
					btnPrevious: {
						id: 'btnPrevious',
						class: 'glyphicon glyphicon-chevron-left brand',
						state: 'invitations',
						style: 'color: white;'
					},
					btnBrand: {
						id: 'btnBrand',
						class: 'brand',
						state: 'invitations',
						style: 'color: white;',
						value: InvitationService.invitation.title
					},
					menu: [
						{ name: 'HOME (logout)', state: 'index' },
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
						if (that.invitation.photo_filename !== undefined) {
							preview.src = that.invitation.photo_filename = reader.result;	
						}
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
			this.cameraInput_click = function () {
				var camerabutton = document.querySelector('#cameraInput');
				camerabutton.style = "display: block;";
				camerabutton.click();
			};
			this.isAvailable = function () {
				return (that.invitation.status === 0) ? '' : 'checked';
			};
			this.getInvitation = function (id) {
				//component.invitation.detail.js
				InvitationService.getInvitation(id)
					.then(function (response) {
						//debugger;
						that.Invitation = response.data.data[0];
					});
			};

			this.go = function (page) {
				$state.go(page);
			};



			this.getImage = function () {
				var camerabutton = document.querySelector('#cameraInput');
				camerabutton.style = "display: block;";
				camerabutton.click();
			};
			this.remove = function () {
				debugger;
			};
			this.save = function () {
				debugger;
			};
			this.send = function () {
				//state.go sendInvitation
				//1. Display invitation details.
				//2. Add recipients button display modes.
				//3. Mode button opens page with APPROPRIATE recipients list
				
				debugger;
			};
			this.sendFlyer = function (mode) {
				$state.go('sendFlyerActivity', {
					"data": {
						"flyer": that.invitation,
						"mode": mode
					}
				});
			};

		} //function
]});















