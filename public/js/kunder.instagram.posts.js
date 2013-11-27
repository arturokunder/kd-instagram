var kunder = kunder || {};
kunder.Instagram = kunder.Instagram || {};
kunder.Instagram.Posts = (function($) {
	
	function _initialize() {		
		$(document).ready(function() {
			$('img.load').each(function(i, item){
				$(item).attr('src', $(item).data('src'));
				$(item).removeClass('load');
				$(item).error(function(event) {
					$(this).attr('src', 'img/image-error.png');
				});
			});
			
			$(document).on('click', '.more-posts-link', function(event) {
				event.preventDefault();
				_loadOnScroll();
				
				return false;
			});
			
			_loadOnScroll();
			
			window.setInterval(_getNewPostsCount, 15000);
		});
		
		$(document).on('click', '.post .picture.is-video', _playVideo);
		
	}
	
	function _loadOnScroll() {
		$('.infinite-posts').waypoint('infinite', {
			container: 'auto',
			  items: '.post',
			  more: '.more-posts-link',
			  offset: 'bottom-in-view',
			  onBeforePageLoad : function() {
				  $('.more-posts-link').hide();
				  $('.more-posts-loading').show();
			  },
			  onAfterPageLoad  : function() { 
				  $('.more-posts-link').show();
				  $('.more-posts-loading').hide();
				  
				  $('img.load').each(function(i, item){
						$(item).attr('src', $(item).data('src'));
						$(item).removeClass('load');
						$(item).error(function(event) {
							$(this).attr('src', 'img/image-error.png');
						});
					});
				  return $(this);
			  }
		});
	}
	
	function _playVideo(event) {
		event.preventDefault();
		
		var picture = $(this);
		var video = picture.parent().find('video').first();
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
					if(data.success && data.count > 0) {
						var text = ' nueva';
						text += data.count > 1 ? 's publicaciones' : ' publicacion';
						$('.new-posts .number').text(data.count + text);
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