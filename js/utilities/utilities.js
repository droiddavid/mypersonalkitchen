/*global angular, $, console */
/*jslint plusplus: true */


/**** UTILITIES.JS ****/

/************************************************************************************

FOR MORE INFORMATION ON fold, map, filter, where and select read the following article...

Bringing the querying power of SQL to JavaScript by Dorian Corompt, January 21, 2013
https://blogs.msdn.microsoft.com/doriancorompt/2013/01/21/bringing-the-querying-power-of-sql-to-javascript/

************************************************************************************/
function fold(func, start, arr) {
    'use strict';

	var acculator = start, i = 0;
	for (i = 0; i < arr.length; ++i) {
        acculator = func(acculator, arr[i]);
    }

	return acculator;
}

function map(func, arr) {
    'use strict';
	return fold(function (acculator, val) { return acculator.concat(func(val)); }, [], arr);
}

function filter(func, arr) {
    'use strict';
	return fold(function (acculator, val) {
        if (func(val)) {
            return acculator.concat(val);
        } else {
            return acculator;
        }
    }, [], arr);
}

Array.prototype.where = function (func) {
    'use strict';
    return filter(func, this);
};
Array.prototype.select = function (func) {
    'use strict';
    return map(func, this);
};




function selectDistinct(objects, property) {
    'use strict';

	var dstinct_values = {};

	objects.forEach(function (object) {
		if (!dstinct_values.hasOwnProperty(object[property])) {
			dstinct_values[object[property]] = object;
		}
    });

	return Object.values(dstinct_values);
}



function write(item, itemDescription) {
    'use strict';
	//console.clear();
	console.log("writing..." + itemDescription);
	console.log(item + "...");
	console.table([item]);
}



function onSignIn(googleUser) {
	// Useful data for your client-side scripts:
    'use strict';
    
	var profile = googleUser.getBasicProfile(), id_token;
	console.log("ID: " + profile.getId()); // Don't send this directly to your server!
	console.log('Full Name: ' + profile.getName());
	console.log('Given Name: ' + profile.getGivenName());
	console.log('Family Name: ' + profile.getFamilyName());
	console.log("Image URL: " + profile.getImageUrl());
	console.log("Email: " + profile.getEmail());

	// The ID token you need to pass to your backend:
	id_token = googleUser.getAuthResponse().id_token;
	console.log("ID Token: " + id_token);
}


//var WEB_SERVER = "127.0.0.1";
var WEB_SERVER = "www.mypersonalkitchen.com";

var MEDIA_QUERIES = {
	viewport: ""
};
function mediaQuery_xsmall(viewport_xsmall) {
	document.body.style.backgroundColor = (viewport_xsmall.matches) ? "green" : "green";
	//console.log("window.MEDIA_QUERIES.viewport: " + window.MEDIA_QUERIES.viewport + " | " + window.innerWidth);
	return window.MEDIA_QUERIES.viewport; }
function mediaQuery_small(viewport_small) { return window.MEDIA_QUERIES.viewport; }
function mediaQuery_medium(viewport_medium) { return window.MEDIA_QUERIES.viewport; }
function mediaQuery_large(viewport_large) { return window.MEDIA_QUERIES.viewport; }
function mediaQuery_xlarge(viewport_xlarge) { return window.MEDIA_QUERIES.viewport; }
function mediaQuery_xxlarge(viewport_xxlarge) { return window.MEDIA_QUERIES.viewport; }

var viewport_xsmall = window.matchMedia("(max-width: 320px)");
viewport_xsmall.addListener(mediaQuery_xsmall);

var viewport_small = window.matchMedia("(max-width: 480px)");
viewport_small.addListener(mediaQuery_small);

var viewport_medium = window.matchMedia("(max-width: 640px)");
viewport_medium.addListener(mediaQuery_medium);

var viewport_large = window.matchMedia("(max-width: 800px)");
viewport_large.addListener(mediaQuery_large);

var viewport_xlarge = window.matchMedia("(max-width: 1024px)")
viewport_xlarge.addListener(mediaQuery_xlarge);

var viewport_xxlarge = window.matchMedia("(max-width: 1200px)")
viewport_xxlarge.addListener(mediaQuery_xxlarge);