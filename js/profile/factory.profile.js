//factory.profile.js
'use strict';

angular.module('app').factory('Profile', ['$http', 'Database', function ($http, Database) {
	'use strict';

	//Create sub-class and extend base class.
	//Profile.prototype = new User(); //Note: No need to inherit from a super class because Profile a super class.
	Profile.constructor = Profile;
	function Profile() {
		if (!(this instanceof Profile)) { 
			return new Profile();
		}

		this.db = Database;

		this.id = undefined;
		this.firstName = undefined;
		this.lastName = undefined;
		this.company = undefined;
		this.phone = undefined;
		this.email = undefined;
		this.password = undefined;
		this.address1 = undefined;
		this.address2 = undefined;
		this.city = undefined;
		this.state = undefined;
		this.zip = undefined;
		this.country = undefined;
		this.howHeard = undefined;
		this.hours = undefined;
		this.description = undefined;
		this.getProfile = function (cookId, db_view, args) {
			return db.select({
				fields: cookId,
				table: db_view,
				where: args //where userId = x
			});
		};

		this.urlBase = "https://" + WEB_SERVER + "/mypersonalkitchen/database/";
		this.urls = {
			insert:				'insert.php',
			readProfile: 		'readProfile.php',
			update:				'update.php',
			deleteProfile: 		'deleteProfile.php'
		};
		this.addProfile = function ( profile ) {
			
			profile.table 		= "profileData";

			// write( profile, 'profile' );
			// console.log("... [ Profile.this.addProfile ] ...");
			return $http.post(this.urlBase + this.urls.insert, profile);
		};
		this.getProfile = function ( profile ) {
			write( profile, 'profile' );
		};

		this.update = function (table, columnsArray, where, requiredColumnsArray) {
			//debugger;
			write( requiredColumnsArray, 'requiredColumnsArray');
			return db.update(table, columnsArray, where, requiredColumnsArray);
		};

		this.delete = function ( profile ) {
			write( profile, 'profile' );
		};

	}; //Profile

	//class level instance variables
	var db = Database; //Instantiate the form's database

	//QUERIES
	Profile.prototype.QUERIES = {
		Profile: { fields: "id", table: "vw_profile" }
	};

	var profile = new Profile;

	return profile;

}]); //factory.Profile