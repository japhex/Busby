'use strict';

var ui = require('./utilities/ui');
var moduleArticle = require('./modules/article');

var init = function() {
	if (!window.console) console = {log: function() {}};
	ui.init();
};

$(document).ready(init);