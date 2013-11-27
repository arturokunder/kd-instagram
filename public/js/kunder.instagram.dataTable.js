//Wrapper para clase dataTable de Google
jQuery.DataTable = (function($) {
	
	function _newDataTable(data) {
		return  new google.visualization.DataTable(data);
	}
	
	function _newDataTableFromArray(array, columns) {
		var data = new google.visualization.DataTable();
		$.each(columns, function(i, item) {
			data.addColumn(item.type, item.name);
		});
		data.addRows(array);
		return data;
	}
	
	function _toPercentaje(dataTable) {
		var _old = _newDataTable(dataTable.toJSON());
		//dataTable.addColumn({type: 'string', role: 'tooltip'});
		
		for(var i = 0; i < dataTable.getNumberOfRows(); i++) {
			var rowSum = 0;
			
			try {
				for(var j = 1; j < dataTable.getNumberOfColumns(); j++) {
					rowSum += parseFloat(dataTable.getValue(i, j));
				}
			}
			catch(error) {
			}
			
			if(rowSum != 0) {
				for(var j = 1; j < dataTable.getNumberOfColumns(); j++) {
					var aux = dataTable.getValue(i, j) / rowSum;
					dataTable.setValue(i, j, aux);
					dataTable.setFormattedValue(i, j, Math.round(aux*1000) / 10 + "%");
				}
			}
			else {
				for(var j = 1; j < dataTable.getNumberOfColumns(); j++) {
					dataTable.setValue(i, j, 0);
					dataTable.setFormattedValue(i, j, "0%");
				}
			}
		}
		
		//Seteo de tooltip
		var inserted = 0;
		for(var i = 1; i < _old.getNumberOfColumns(); i++) {
			//Si se quiere tooltip con html, usar linea siguiente
			//dataTable.insertColumn(i + 1 + inserted, {type: 'string', role: 'tooltip', 'p': {'html': true}});
			dataTable.insertColumn(i + 1 + inserted, {type: 'string', role: 'tooltip'});
			
			for(var j = 0; j < _old.getNumberOfRows(); j++) {
				dataTable.setValue(j, i + 1 + inserted, 
						_old.getValue(j, 0) + "\n" 
						+ _old.getColumnLabel(i) + ": " 
						+ _old.getValue(j, i) + "\n" 
						+ dataTable.getFormattedValue(j, i + inserted));
			}
			
			inserted += 1;
		}
		
		return dataTable;
	}
	
	function _sumRows(dataTable) {
		//Para el caso de los piecharts hay que sumar las columnas.
		data = new google.visualization.DataTable();
		/*data.addColumn({
			type 	: dataTable.getColumnType(0),
			label	: dataTable.getColumnLabel(0),
			id		: dataTable.getColumnId(0),
			role	: dataTable.getColumnRole(0),
			pattern : dataTable.getColumnPattern(0),
		});*/
		
		data.addColumn('string');
		data.addColumn({
			type 	: 'number',
			label	: 'suma',
		});
		
		for(var i = 0; i < dataTable.getNumberOfRows(); i++) {
			
			var rowSum = 0;
			
			try {
				for(var j = 1; j < dataTable.getNumberOfColumns(); j++) {
					rowSum += parseFloat(dataTable.getValue(i, j));
				}
			}
			catch(error) {
			}
			
			//Sólo dejamos las columnas que son mayores que 0.
			if(rowSum > 0) {
				data.addRow([dataTable.getFormattedValue(i, 0), rowSum]);
			}
		}
		
		return data;
	}
	
	function _sumColumns(dataTable) {
		data = new google.visualization.DataTable();
		
		/*if(dataTable.getNumberOfColumns() > 1) {
			data.addColumn({
				type 	: 'string',
				label	: dataTable.getColumnLabel(1),
				id		: dataTable.getColumnId(1),
				role	: dataTable.getColumnRole(1),
				pattern : dataTable.getColumnPattern(1),
			});
		}
		else {
			data.addColumn('string');
		}*/
		
		data.addColumn('string');
		data.addColumn({
			type 	: 'number',
			label	: 'suma',
		});
		
		for(var i = 1; i < dataTable.getNumberOfColumns(); i++) {
			
			var columnSum = 0;
			
			try {
				for(var j = 0; j < dataTable.getNumberOfRows(); j++) {
					columnSum += parseFloat(dataTable.getValue(j, i));
				};
			}
			catch(error) {	
			}
			
			data.addRow([dataTable.getColumnLabel(i), columnSum]);
		}
		
		return data;
	}
	
	return {
		NewDataTable 	: _newDataTable,
		NewDataTableFromArray : _newDataTableFromArray,
		
		ToPercentaje	: _toPercentaje,
		
		SumRows			: _sumRows,
		SumColumns		: _sumColumns,
		
	};
}(jQuery));
