/* Food Component */
angular.module('app').component('dashboardFood', {
	bindings: {
		food: '<'
	},
	controller: function ($http, $state, Session, Cook, Database) {
		var that = this;


		this.$onInit = function () {
			//list of food
			this.foodList = []; 
			var x = this.food;

//			this.foodListCategories = selectDistinct(objects, property);

			//form field values for adding a new food item.
			this.NewFoodItem = {
				name: undefined,
				type: undefined,
				description: undefined
			};

			this.unfilteredTypes = selectDistinct(this.food, "type");
			this.types = [];

			this.unfilteredTypes.forEach(
				function (item, index) {
					that.types.push({ type: item.type });
				}
			);

			this.types.forEach(function (type, index) {
				var foodItem = [];
				that.food.forEach(function (food, ndx) {
					if (type.type === food.type) {
						foodItem.push(food);
					}
				});
				that.foodList.push({ type: type.type, items: foodItem });
			});

			this.cook = new Cook();
		};

		this.setType = function (type) {
			that.NewFoodItem.type = type;
			if (that.selectedFoodItem.type) that.selectedFoodItem.type = type;
		};

		this.selectedFoodItem = {
			name: undefined,
			type: undefined,
			description: undefined
		};

		this.onSave = function (foodToAdd) {
			var obj = {};
			
			//Add the form's elements to the insert object.
			for (var key in foodToAdd) {
				// skip loop if the property is from prototype
				if (!foodToAdd.hasOwnProperty(key)) continue;			
				obj[key] = foodToAdd[key];
			}

			obj.userId 		= Session.id;
			obj.status 		= 1;
			obj.table 		= "food";
			that.foodList.push(obj);

			//Insert the object into the db.
			that.cook.addFood(obj)
				.then(function (response) {
					if (response) { //////****************************CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						retVal = (response.statusText === "OK") ? "Registration Successful" : "Registration Failed";
						return retVal;
					}
				});
		};

		this.onCancel = function () {
		};

		this.onDelete = function (food) {

			var tbl_food = "food",
				fld_id = "id";

			that.foodList.forEach(function (item, ndx) {
				//Remove it from the local array first.
				const index = that.foodList.indexOf(item);
				if (index !== -1) {
					that.foodList.splice(index, 1);
				}
			});

			//Then remove it from the db
			that.cook.deleteFoodItem(tbl_food, fld_id, food.food_id)
				.then(function (response) {
					that.deleteFile('food')
						.then(function () {
							$state.go('data');
						});
					if (response) { //***CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						retVal = (response.statusText === "OK") ? "Deletion Successful" : "Deletion Failed";
						return retVal;
					}
				});
		};

		this.deleteFile = function (filename) {
			return $http.post('./data/fileDeleter.php', {
				fileName: filename + ".json"
			});
		};

		this.onUpdate = function (columnsObject) {
			var where = {
				"userId" : columnsObject["userId"],
				"id" : columnsObject["id"]
			};
			var table = "food", 
				columnsArray = columnsObject,
				requiredColumnsArray = Object.keys(columnsObject);

			that.cook.updateFoodItem(table, columnsArray, where, requiredColumnsArray)
				.then(function (response) {
					if (response) { //***CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
						retVal = (response.statusText === "OK") ? "Update Successful" : "Update Failed";
						return retVal;
					} 
				});
			//var $table, $columnsArray, $where, $requiredColumnsArray
		};

		/*** UTILITIES ***/
		//update the food type dialog box
		this.updateFormData = function (foodItem) {
			that.selectedFoodItem.name = foodItem.name;
			that.selectedFoodItem.type = foodItem.type;
			that.selectedFoodItem.description = foodItem.description;
			that.selectedFoodItem.userId = Session.id;
			that.selectedFoodItem.status = foodItem.status;
			that.selectedFoodItem.id = foodItem.food_id;
		};

		this.toggleSelection = function (status) {

			var available = $('#option-status-available'),
				not_available = $('#option-status-not-available');

			if (status === 'option-status-not-available') {
				that.selectedFoodItem.status = 0;

				available["ng-checked"] = false;
				not_available["ng-checked"] = true;

			} else {
				that.selectedFoodItem.status = 1;

				available["ng-checked"] = true;
				not_available["ng-checked"] = false;
			}
		};

	}, //controller
	templateUrl: 'partials/dashboard/dashboard.food.html'
});