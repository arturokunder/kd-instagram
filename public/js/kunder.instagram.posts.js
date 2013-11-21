var kunder = kunder || {};
kunder.Instagram = kunder.Instagram || {};
kunder.Instagram.Posts = (function($) {
	
	function _initialize() {
		$(document).ready(function() {
			$('img.load').each(function(i, item){
				$(item).attr('src', $(item).data('src'));
				$(item).removeClass('load');
			});
			
			window.setInterval(_getNewPostsCount, 15000);
		});
		
		$(document).on('click', '.post .picture.is-video', _playVideo);
		
	}
	
	function _playVideo(event) {
		event.preventDefault();
		
		var picture = $(this);
		var video = picture.parent().find('video').first();
		console.log(video);
		video.attr('src', video.data('src'));
		video[0].load();
		
		video.on('ended', function(){
			video.parent().hide();
			picture.show();
		});
		
		picture.hide();
		video.parent().show();
		video[0].play();
	}
	
	function _getNewPostsCount(event) {
		if($('#last-post').val() !== '') {
			var id = $('#last-post').val();

			return $.ajax({
				url:	'/ajax/posts/getNewPostsCount',
				type:	'POST',
				data:	{
					id: id,
				},
				dataType:	'json',
				success	: function(data) {
					if(data.success) {
						$('.new-posts').text(data.count);
					}
				},
			});
		}
		
		
		
		$('.new-posts')
	}
	
	return {
		Initialize :	_initialize
	};
	
}(jQuery));