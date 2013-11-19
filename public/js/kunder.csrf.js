var kunder = kunder || {};
kunder.CSRF = (function($) {
	
	$(document).on("ajaxSend", function(elm, xhr, s){
	   if (s.type == "POST") {
	      xhr.setRequestHeader('X-CSRFToken', _getCookie('csrftoken'));
	   }
	});
	
	function _getCookie(name) {
	    var cookieValue = null;
	    if (document.cookie && document.cookie != '') {
	        var cookies = document.cookie.split(';');
	        for (var i = 0; i < cookies.length; i++) {
	            var cookie = jQuery.trim(cookies[i]);
	            // Does this cookie string begin with the name we want?
	            if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                break;
	            }
	        }
	    }
	    return cookieValue;
	}
	
	return {
		get: _getCookie,
	};
	
}(jQuery));