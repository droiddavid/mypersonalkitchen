/* Menus Component */
angular.module('app').component('dashboardMenus', {
	bindings: {
		menus: '<',
		plateitems: '<', //platterItems
		allplates: '<' //platters
	},
	controller: function ($state, Session, DashboardService) {
		this.$onInit = function () {

			var that = this;
			var _allplates = this.allplates;
			var _platesitems = this.plateitems;
			var MenuDB = this.menus;
			var UniqueFoodItems = selectDistinct(MenuDB, "food_id");
			var UniqueMenus = selectDistinct(MenuDB, "menus_id");
			var platters = [];
			var food = [];
			this.Menus = [];
			debugger;


			this.menusdisplay = undefined;

			if (Session.role === 2) { //USER_ROLES.cook

				//Distinct menus

				/***** MENU TAB	*****/
				//Cycle though each unique menu
				UniqueMenus.forEach(function (menu, index) {
					var Menu = {
						menuId: menu.menus_id,
						menus_status: menu.menus_status,
						menus_title: menu.menus_title,
						menus_userId: menu.menus_userId,
						menustoplatters_menuId: menu.menustoplatters_menuId,
						menustoplatters_platterId: menu.menustoplatters_platterId,
						platters_id: menu.platters_id,
						Platters: []
					}; //Menu

					Menu.menus_status = (Menu.menus_status === 1) ? Menu.menus_status = "AVAILABLE" : Menu.menus_status = "OUT OF STOCK";

					_allplates.forEach(function (Platter, index) {

						//debugger;
						if (Menu.menustoplatters_platterId === Platter.platter_id) {
							Menu.Platters.push(Platter);
						}

					});

					that.Menus.push(Menu);
				}); //UniqueMenus.forEach();

				this.menusdisplay = this.Menus;

			} //if role === cook

		}; //this.$onInit



		/*** UTILITIES ***************************************/
		this.showPlatterPage = function (menu) {
			DashboardService.menu = menu;
			$state.go('index.dashboardMenuDetail');
		};

	},
	template: `
		<div>
			<ul>
				<li ng-repeat="menu in $ctrl.menusdisplay">
					Menu ID #:{{ menu.menuId }} | In Stock: {{ menu.menus_status }}<br />
					Title: {{ menu.menus_title }}
					Platters: {{ menu.Platters.length }}<br />
					<a id="showPlatterPageButton" 
						class="btn btn-xs btn-primary"
						ng-click="$ctrl.showPlatterPage(menu)" 
						aria-label="Show Platter Page Button">
						<span class="glyphicon glyphicon-chevron-right"></span> Next
					</a>
				</li>
			</ul>
		</div>
	`
});



































