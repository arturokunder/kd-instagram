var kunder = kunder || {};
kunder.Instagram = kunder.Instagram || {};
kunder.Instagram.Index = (function($) {
	
	function _initialize() {
		_postsByDay(posts);
		
		$(document).ready(function() {
			$('img.load').each(function(i, item){
				$(item).attr('src', $(item).data('src'));
				$(item).removeClass('load');
				$(item).error(function(event) {
					$(this).attr('src', 'img/image-error.png');
				});
			});
		});
	}
	
	function _postsByDay(posts) {
		var options = {
				type			: "line",
				dataType		: "num",
				toolTip			: false,
				toolTipOptions	: {
					config  : false,
					download : false,
					magnify	: false,
					close	: false,
				},
				magnified		: false,
				title			: "Posts por d\u00eda",
				configOptions	: {
					showLabels	:	false,
				},
				chartOptions : {
					'legend' : 'none',
					'width'  : 700,
					'height' : 350,
				}
			};
			var div = $('<div>', {
				class 			: "chart chartLoading questionChart big",
				//style : 'float : none',
			});
			
			$('#posts-day').empty();
			$('#posts-day').show();
			$('#posts-day').append(div);
			
			var rows = [];
			$.each(posts, function(i, item){
				var aux = [];
				aux.push(new Date(item.date));
				aux.push(item.posts);
				rows.push(aux);
			});
			
			$.Charts.DrawChart($.DataTable.NewDataTableFromArray(rows, [{ type : 'date', name: 'Fecha' }, { type : 'number', name: 'Total' }]), options, div);
	}
	
	return {
		Initialize :	_initialize
	};
	
}(jQuery));