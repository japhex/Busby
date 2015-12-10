'use strict';
var instance = false;


function ui() {

	function init() {
		_toggle();
		_masonry();
		_fullHeight();
	}

	function _toggle(){
		var $dataToggle = $('[data-toggle]');

		$($dataToggle).on('click', function(){
			var $toggle = $(this),
				$matchingElement = $($toggle.data('toggle')),
				dataAnimation = $toggle.data('trigger-animation') !== undefined ? $toggle.data('trigger-animation') : 'none' ;

			if (dataAnimation !== 'none') {
				_animate($matchingElement, dataAnimation);
			} else {
				$matchingElement.toggle();
			}

			return false;
		})
	}

	function _animate($element, animation){
		$element.slideToggle();
	}

	function _masonry(){
		if ($('[data-masonry]').length > 0){
			$(window).load(function(){
				var container = $('[data-masonry]')[0];
				var msnry = new Masonry(container);
			});
		}
	}

	function _fullHeight(){
		if (document.documentElement.clientWidth > 991) {
			$('body > .container').css({'min-height':$(document).height() - 511});
		}
	}

	return {
		init: init
	};
}


module.exports = (instance ? instance : instance = ui());