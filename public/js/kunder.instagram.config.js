var kunder = kunder || {};
kunder.Instagram = kunder.Instagram || {};
kunder.Instagram.Config = (function($) {
	
	function _initialize() {
		$(document).on('click', '#add-link', _newTag);
		$(document).on('click', 'a.remove', _removeTag);
	}
	
	function _newTag(e) {
		e.preventDefault();
		if($('#add-input').val() !== '') {
			var tag = $('#add-input').val();
			if(tag.indexOf('#') == 0) {
				tag = tag.substring(1, tag.length);
			}
			
			return $.ajax({
				url:	'/ajax/config/addTag',
				type:	'POST',
				data:	{
					tag: tag,
				},
				dataType:	'json',
				success	: function(data) {
					if(data.success) {
						$('#add-input').val('');
						$('#insert-row').before($('<tr>')
							.append($('<td>', { text : '#' + data.tag.tag, 'data-id' : data.tag._id }))
							.append($('<td>', { html : '<a href="#" data-id="528bd0e4e243ab7de880398d" class="remove"><span class="glyphicon glyphicon-remove"></span></a>'})));
					}
				},
			});
		}
		
	}
	
	function _removeTag(e) {
		e.preventDefault();
		var selected = $(this);
		return $.ajax({
			url:	'/ajax/config/removeTag',
			type:	'POST',
			data:	{
				id: selected.data('id'),
			},
			dataType:	'json',
			success	: function(data) {
				if(data.success) {
					selected.parent().parent().remove();
				}
			},
		});
		
	}
	
	return {
		Initialize :	_initialize
	};
	
}(jQuery));