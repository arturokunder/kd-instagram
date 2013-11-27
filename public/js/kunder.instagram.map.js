var kunder = kunder || {};
kunder.Instagram = kunder.Monitor || {};
kunder.Instagram.Map = (function($) {

	var PostMap;
	var markers = new Array();
	var mapHeightOffset = 0;
	
	function _initialize() {
    	//_makeMapGeo(posts);
    	
    	//var markerCluster = new MarkerClusterer(PostMap, markers, { maxZoom : 14 });
		_makeHeatMap(posts);
	}
	
	function _makeMapGeo(posts) {
		$.each(posts, function(i, item) {
			try {
				if(item.location.latitude && item.location.longitude) {
					var options = {
						postId : item._id,
						position : {
							lat : item.location.latitude,
							long : item.location.longitude
						},
						title : item._id,
						scrollToMap : false,
						goToMarker : false,
						infoWindow : false,
						success : function(marker) {
							marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
						}
					};
					_addPostToMap(options);
				}
			}
			catch(e){
				
			}
		});
	}
	
	function _makeHeatMap(posts){
		if($('#post-map').data('map-created') == false) {
			_initializeMap({  }, {});
		};
		if(markers.length == 0 && $('#post-map').css('height') == '0px') {
			$(window).resize(_resizeMap);
			_resizeMap();
		}
		
		var points = [];
		$.each(posts, function(i, item) {
			try {
				if(item.location.latitude && item.location.longitude) {
					var point = new google.maps.LatLng(item.location.latitude, item.location.longitude);
					points.push(point);
				}
			}
			catch(e){
				
			}
		});
		
		var heatmap = new google.maps.visualization.HeatmapLayer({
		    data: points
		  });
		var gradient = [
			'rgba(0, 255, 255, 0)',
			'rgba(0, 255, 255, 1)',
			'rgba(0, 191, 255, 1)',
			'rgba(0, 127, 255, 1)',
			'rgba(0, 63, 255, 1)',
			'rgba(0, 0, 255, 1)',
			'rgba(0, 0, 223, 1)',
			'rgba(0, 0, 191, 1)',
			'rgba(0, 0, 159, 1)',
			'rgba(0, 0, 127, 1)',
			'rgba(63, 0, 91, 1)',
			'rgba(127, 0, 63, 1)',
			'rgba(191, 0, 31, 1)',
			'rgba(255, 0, 0, 1)'
		];
		heatmap.set('gradient', gradient);
		heatmap.set('radius', 15);
		heatmap.set('opacity', 1);
		heatmap.setMap(PostMap);
	}
	
	
	function _initializeMap(options, other) {
		var _options = {
		          center: new google.maps.LatLng(-18.4800786, -70.3244204),
		          zoom: 3,
		          mapTypeId: google.maps.MapTypeId.ROADMAP,
		};
		
		var _other = {
				mapHeightOffset : 0
		};
		_options = $.extend(_options, options);
		_other = $.extend(_other, other);
		
		mapHeightOffset = _other.mapHeightOffset;
		$('#post-map').removeClass('hidden');
		
		PostMap = new google.maps.Map($('#post-map')[0], _options);
		$('#post-map').data('map-created', true);
		
		//Suscripción de eventos y resize de mapa
		$(window).resize(_resizeMap);
		_resizeMap();
		
		
	}
	
	function _addPostToMap(options) {
		var _options = {
			postId : 0,
			position : {
				lat : 0,
				long : 0
			},
			title : '',
			scrollToMap : true,
			goToMarker : true,
			infoWindow : false,
			infoWindowOptions : {
				tweetText : '',
				tweetUser : '' ,
			},
			success : function(marker) {}
		};
		
		_options = $.extend(_options, options);
		
		var position = new google.maps.LatLng(_options.position.lat, _options.position.long);

		if($('#post-map').data('map-created') == false) {
			_initializeMap({  }, {});
		}
		
		//Si no hay marcadores y mapa esta escondido se muestra mapa y se suscribe al evento de resize
		if(markers.length == 0 && $('#post-map').css('height') == '0px') {
			$(window).resize(_resizeMap);
			_resizeMap();
		}
		
		var marker = new google.maps.Marker({
		    position: position,
		    map: PostMap,
		    animation: google.maps.Animation.DROP,
		    draggable: false,
		    title: $('<div>' + _options.title + '</div>').text()
		});
		
		if(_options.infoWindow) {
			var infoWindow = new google.maps.InfoWindow({
				content: 
						'<h4>' + $('<div>@' + _options.infoWindowOptions.tweetUser + '</div>').text() + '</h4>'
						+ '<h6>' + $('<div>' + _options.infoWindowOptions.tweetText + '</div>').text() + '</h6>',
			});
			
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.open(PostMap, marker);
			});
		}
		
		if(_options.scrollToMap) {
			var offset = parseInt($('body').css('padding-top'));
			var scroll = isNaN(offset) ? $('#post-map').offset().top - 50 : $('#post-map').offset().top - offset;
			$('body').animate({ scrollTop: scroll }, 350);
		}
		
		if(_options.goToMarker) {
			PostMap.setCenter(position);
			PostMap.setZoom(14);
		}

		markers.push(marker);
		_options.success(marker);
	}
	
	function _resizeMap(){
		var offset = parseInt($('body').css('padding-top'));
		var height = isNaN(offset) ? $(window).height() - 50 - mapHeightOffset : $(window).height() - offset - mapHeightOffset;

		$('#post-map').css('height',(height - 20) + 'px');
		window.setTimeout(function() {
			google.maps.event.trigger(PostMap, 'resize');
		}, 500);
	}
	
	return {
		Initialize:	_initialize,
	};
	
}(jQuery));