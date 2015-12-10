'use strict';
var instance = false;


function article() {

	function init() {
	}

	return {
		init: init
	};
}


module.exports = (instance ? instance : instance = article());