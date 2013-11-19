//Entrega fecha y hora UTC en formato YYYY-MM-DD hh:mm:ss
jQuery.DateTimeFormatter = (function($) {
		
		function _format(date, utc) {
			return date.getUTCFullYear() + "-" + _formatNumber((date.getUTCMonth() + 1)) + "-" + _formatNumber(date.getUTCDate()) + " " 
			+ _formatNumber(date.getUTCHours()) + ":" + _formatNumber(date.getUTCMinutes()) + ":" + _formatNumber(date.getUTCSeconds());
		}
		
		function _now() {
			return _format(new Date());
		}
		
		function _endOfDay(date) {
			date.setHours(23, 59, 59, 999);
			return _format(date);
		}
		
		function _endOfToday() {
			return _endOfDay(new Date());
		}
		
		function _formatNumber(number) {
			if(parseInt(number) == Number.NaN)
			{
				return number;
			}
			
			if(number < 10 && number > -10)
			{
				return "0" + number;
			}
			else
			{
				return "" + number;
			}
		}
		
		function _stringToDate(date) {
			try {
				return new Date(
						date.substring(0, 4),
						parseFloat(date.substring(5,7))-1,
						date.substring(8, 10),
						date.substring(11, 13),
						date.substring(14, 16),
						date.substring(17, 19),
						0
					);
			}
			catch (e) {
				return new Date();
			}
		}
		
		function _dateToLongString(date) {
			var days = ['Domingo', 'Lunes', 'Martes', 'Mi�rcoles', 
			            'Jueves', 'Viernes', 'S&aacute;bado'];
			var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
			              'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
			
			return days[date.getDay()] + ' ' + date.getDate() + ' de ' + months[date.getMonth()]
			+ ' de ' + date.getFullYear() + ', ' + _formatNumber(date.getHours()) + ':' + _formatNumber(date.getMinutes());
		}
		
		return {
		    Now: _now,
		    Format: _format,
		    EndOfDay : _endOfDay,
		    EndOfToday : _endOfToday,
		    StringToDate : _stringToDate,
		    DateToLongString : _dateToLongString
		  };
}(jQuery));

//Sorter para ordenar por cualquier propiedad de algun arreglo
jQuery.Sorter = (function($) {
	
	function _sortAsc(array, property) {
		return _sort(array, property, true);
	}
	
	function _sortDesc(array, property) {
		return _sort(array, property, false);
	}
	
	function _sort(array, property, asc) {
		array = array.sort(function(a,b) {
			if(a[property] == b[property]) {
				return 0;
			}
			if(asc) return a[property]> b[property] ? 1 : -1;
			else return a[property]> b[property] ? -1 : 1;
		});
		
		return array;
	}
	
	return {
		SortAsc: _sortAsc,
		SortDesc: _sortDesc,
	};
	
}(jQuery));

jQuery.FormatNumber = (function($) {
	
	function _format(n, c, d, t){ 
		c = isNaN(c = Math.abs(c)) ? 0 : c, 
		d = d == undefined ? "," : d, 
		t = t == undefined ? "." : t, 
		s = n < 0 ? "-" : "", 
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
		j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}
	
	return {
		Format : _format,
	};
	
}(jQuery));
