angular.module('app').factory('Cook', 
	[
		'User', 
		'Food', 'Platter', 'PlatterItem', 'Menu', 
		'Invitation', 'Database', 
		function (
			User, 
			Food, Platter, PlatterItem, Menu, 
			Invitation, Database) {

	'use strict';

	//Create sub-class and extend base class.
	Cook.prototype = new User();
	Cook.constructor = Cook;

	function Cook(userId) {
		User.call(this);
		this.userId = userId;
	} //Cook

	//class level instance variables
	Cook.prototype.firstName = "";
	Cook.prototype.FoodCollection = [];
	Cook.prototype.Platters = [];
	Cook.prototype.Menus = [];
	Cook.prototype.Invitations = [];
	Cook.prototype.Subscribers = [];
	Cook.prototype.Messages = [];
	Cook.prototype.userId = undefined;

	var db = Database; //Instantiate the form's database

	//QUERIES
	Cook.prototype.QUERIES = {
		Food: { fields: "cook_id", table: "vw_cook_food"},
		FoodTypes: { fields: "cook_id", table: "foodtypes"},
		Platters: { fields: "cook_id", table: "vw_cook_platters"},
		PlatterItems: { fields: "cook_id", table: "vw_cook_platters_platteritems"},
		Menus: { fields: "cook_id", table: "vw_cook_menus"},
		Menus_Platters: { fields: "cook_id", table: "vw_cook_menus_platters"},
		Menus_Platters_PlatterItems: { fields: "cook_id", table: "vw_cook_menus_platters_platteritems"},
		InvitationModes: { fields: "id", table: "invitationmodes", where: "%" },
		Invitations: { fields: "userId", table: "invitations"},
		InvitationRecipients: { fields: "userId", table: "InvitationRecipients"}
	};

	Cook.prototype.getData = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args //where userId = x
		});
	}; //getData

	Cook.prototype.getFood = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args //where userId = x
		});

	}; //getFood
	Cook.prototype.getFoodTypes = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args //where userId = x
		});
	}; //getFoodTypes
	//Class level instance methods
	Cook.prototype.getPlatters = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.getPlatterItems = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.getMenus = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.getMenusPlatters = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.getMenusPlatterItems = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.getMenus_Platters_PlatterItems = function (cookId, db_view, args) {
		return db.select({
			fields: cookId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.getInvitationModes = function (id, table, where) {
		return db.select({
			fields: id,
			table: table,
			where: where
		});
	};
	Cook.prototype.getInvitations = function (userId, db_view, args) {
		return db.select({
			fields: userId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.getInvitationRecipients = function (userId, db_view, args) {
		return db.select({
			fields: userId,
			table: db_view,
			where: args
		});
	};
	Cook.prototype.addFood = function (obj) {
		return db.insert(obj);
	};
	Cook.prototype.deleteFoodItem = function (tbl_food, fld_id, food_id) {
		return db.delete({
			table: tbl_food,
			fieldName: fld_id,
			fieldValue: food_id
		});
	};
	Cook.prototype.updateFoodItem = function (table, columnsArray, where, requiredColumnsArray) {
		return db.update(table, columnsArray, where, requiredColumnsArray);
	};
	Cook.prototype.addPlatter = function (platter) {
		return db.insert(platter);
	};
	Cook.prototype.addPlatterItem = function (platterItem) {
		return db.insert(platterItem);
	};
	Cook.prototype.removePlatterItem = function (platterItem) {
		return db.delete(platterItem);
	};

	return Cook;

}]); //Cook