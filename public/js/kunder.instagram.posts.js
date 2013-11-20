var kunder = kunder || {};
kunder.Instagram = kunder.Instagram || {};
kunder.Instagram.Posts = (function($) {
	
	function _initialize() {
		$(document).ready(function() {
			console.log('hola');
			$('img.load').each(function(i, item){
				$(item).attr('src', $(item).data('src'));
				$(item).removeClass('load');
			})
		});
		
		
	}
	

	
	return {
		Initialize :	_initialize
	};
	
}(jQuery));