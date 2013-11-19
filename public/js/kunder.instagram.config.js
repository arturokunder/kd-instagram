var kunder = kunder || {};
kunder.Instagram = kunder.Instagram || {};
kunder.Instagram.Config = (function($) {
	
	function _initialize() {
		$('#newTag').click(_newTag);
	}
	
	function _newTag(tag) {
		tag = 'nofilter';
		return $.ajax({
			url:	'/ajax/config/addTag',
			type:	'POST',
			data:	{
				tag: tag,
			},
			dataType:	'json',
			success	: function(data) {
				console.log('ok');
			},
		});
	}
	
	return {
		Initialize :	_initialize,
		NewTag :		_newTag
	};
	
}(jQuery));