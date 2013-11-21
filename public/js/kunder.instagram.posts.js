var kunder = kunder || {};
kunder.Instagram = kunder.Instagram || {};
kunder.Instagram.Posts = (function($) {
	
	function _initialize() {
		$(document).ready(function() {
			$('img.load').each(function(i, item){
				$(item).attr('src', $(item).data('src'));
				$(item).removeClass('load');
			});
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
	
	return {
		Initialize :	_initialize
	};
	
}(jQuery));