jQuery.Charts = (function($) {
	
	var seriesColors = ['#28f03c', '#f02e28', '#f09228', '#3228f0', 
	                      '#0D9C1F', '#0D8995', '#A6550E', '#A6150E',
	                      '#86F894', '#84E9F2', '#FFC18A', '#FF908A'
	                      ]; 
	
	function _drawChart(dataTable, options, chartDiv) {
		dataTable = typeof dataTable !== 'undefined' ? dataTable : new google.visualization.DataTable(_options.data);
		chartDiv = typeof chartDiv !== 'undefined' ? chartDiv : $('<div>');
		
		//options.chartOptions.title = options.title;
		var _options = {
			chartOptions	: {},
			type			: "pie",
			dataType		: "num",
			toolTip			: true,
			toolTipOptions	: {
				config  : true,
				download : true,
				magnify	: true,
				close	: true,
			},
			magnified		: false,
			title			: "",
			choicesColors	: {},
			configOptions	: {
				showLabels	:	false,
			},
		};
		
		var _chartOptions = {
			'title'			: $('<div>' + options.title + '</div>').text(),
			'titleTextStyle': {
								'fontSize' : 14,
							  },
			'width' 		: 350,
			'height'		: 250,
			'sliceVisibilityThreshold' : 0,
			'colors'		: seriesColors.slice(0),
			'legend'		: {
								'position' : 'right',
								'alignment': 'center',
								'textStyle': {
												'fontSize' : 12,
											 },
							  },
			/*'vAxes': { 0: {format: '#%',}, 1: {format: '#,###', maxValue: 10, },},
			'series': {
		            0:{ type: "columns", targetAxisIndex: 0 },
		            1: { type: "columns", targetAxisIndex: 1},	
		     },*/
			'backgroundColor': 'transparent',
			'tooltip' 		: { 
								'showColorCode' : true,
								'textStyle': {
												'fontSize' : 12,
											 },
								'isHtml' : true,
							  },
			'vAxis'			: {
								'format' : '#',
								'minValue' : 0,
			},
		};
		
		_options = $.extend(_options, options);
		_options.chartOptions = $.extend(_chartOptions, options.chartOptions);
		
		//para colores personalizados de series
		if(_options.choicesColors != {}){
			var series_aux = 0;
			for(var i = 1; i < dataTable.getNumberOfColumns(); i++) {
				if(dataTable.getColumnRole(i) == "") {
					if(typeof _options.choicesColors[dataTable.getColumnId(i)] !== 'undefined') {
						_options.chartOptions.colors[series_aux] = _options.choicesColors[dataTable.getColumnId(i)];
					}
					series_aux++;
				}
			}
		}
		
		if(options.type != 'pie' && options.dataType == 'percentaje') {
			if(options.type == 'bar') {
				_options.chartOptions.hAxis = {
					format	: '#%',
					minValue: 0,
					maxValue: 1,
				}; 
			}
			else {
				_options.chartOptions.vAxis = { 
					format	: '#%',
					minValue: 0,
					maxValue: 1,
				}; 
			}
		}
		
		chartDiv.append($('<div>', {
				class : 'chartToolTip'
			}))
			.append($('<div>', {
				class : 'chartDrawArea'
			}));
		
		var chart = null;
		var drawDiv = chartDiv.children('.chartDrawArea')[0];
		
		switch (_options.type) {
			case "bar"	:
				chart = new google.visualization.BarChart(drawDiv);
				break;
			case "line":
				dataTable.addColumn({type: 'string', role: 'annotation'});
				for(var i = 0; i < dataTable.getNumberOfRows(); i++){
					var column = dataTable.getNumberOfColumns() - 1;
					if(parseFloat(dataTable.getValue(i, column - 1)) != 0) {
						dataTable.setValue(i, column, dataTable.getFormattedValue(i, column - 1));
					}
				}
				if(_options.magnified && ( _options.granularity == 'day' || _options.granularity == 'hour')) {
					_options.chartOptions.showRangeSelector = true;
					_options.chartOptions.strokeWidth = 2;
					_options.chartOptions.labelsSeparateLines = true;
					_options.chartOptions.fillGraph = true;
					_options.chartOptions.displayAnnotations = true;
					_options.chartOptions.drawCallback = function() {
						if(!_options.configOptions.showLabels) {
							$('.dygraphDefaultAnnotation').hide();
						}
					};
					chart = new Dygraph.GVizChart(drawDiv);
				}
				else {
					
					chart = new google.visualization.AreaChart(drawDiv);
					if(!_options.configOptions.showLabels) {
						google.visualization.events.addListener(chart, 'ready', function() {
							_lineChartDisplayLabels(drawDiv, false);
						});
					}
					google.visualization.events.addListener(chart, 'onmouseover', function() {
						if(!_options.configOptions.showLabels) {
							_lineChartDisplayLabels(drawDiv, false);
						}
					});
					google.visualization.events.addListener(chart, 'onmouseout', function() {
						if(!_options.configOptions.showLabels) {
							_lineChartDisplayLabels(drawDiv, false);
						}
					});
				}
				
				break;
			
			case "pie":
				chart = new google.visualization.PieChart(drawDiv);
				break;
				
			case "column":
				chart = new google.visualization.ColumnChart(drawDiv);
				break;
				
			case "table":
				dataTable.setColumnLabel(0, options.chartOptions.title);
				chart = new google.visualization.Table(drawDiv);
				break;
		}
		
		if(chart != null) {
			chart.draw(dataTable, _options.chartOptions);
			chartDiv.removeClass("chartLoading");
			
			if(_options.toolTip) {
				chartDiv.children('.chartToolTip').append(_generateChartToolbar(chartDiv, _options, dataTable));
			}
		}
	}
	
	function _generateChartToolbar(chartDiv, options, dataTable) {
		var _toolTipOptions = {
			config  : true,
			edit	: false,
			download : true,
			magnify	: true,
			close	: true,
		};
		
		_toolTipOptions = $.extend(_toolTipOptions, options.toolTipOptions);
		
		var toolTip =  $('<div>', {
    		class 	: 'chartToolTip'
		});
		
		var toolTipBaseClass = 'chartToolTipTool '; 
		
		if(options.magnified) {
			toolTip.addClass('magnified');
			toolTipBaseClass += 'magnified ';
		}
		
		if(_toolTipOptions.close) {
			var closeDiv = $('<div>', {
				class	: toolTipBaseClass + 'close ',
			}).click(function() {
				chartDiv.trigger({
					type : 'deleteChart',
					chartId : chartDiv.data('chartId')
				});
				chartDiv.remove();
			});
			
			toolTip.append(closeDiv);
		}
		
		if(_toolTipOptions.magnify) {
			var magnifyDiv = $('<div>', {
				class	: toolTipBaseClass + 'magnify ',
			}).click(function() {
				chartDiv.trigger({
					type : 'magnifyChart',
					chartId : chartDiv.data('chartId')
				});
			});
			
			toolTip.append(magnifyDiv);
		}
		
		if(_toolTipOptions.edit) {
			var editDiv = $('<div>', {
				class	: toolTipBaseClass + 'edit '
			}).click(function() {
				chartDiv.trigger({
					type : 'editChart',
					chartId : chartDiv.data('chartId')
				});
			});
			
			toolTip.append(editDiv);
		}
		
		//solo si se soporta canvas
		
		if(_toolTipOptions.download && !!document.createElement('canvas').getContext) {

			var hidden = $('<input>', {
				type : 'hidden',
				name : 'image'
			});
			
			var downloadForm = $('<form>', {
				action : '/reports/panel/chart/png/',
				method : 'POST',
			}).append(hidden)
			.append(
					$('<input>', {
						type : 'hidden',
						name : 'csrfmiddlewaretoken',
						value: kunder.CSRF.get('csrftoken')
					})
			);
			
			downloadForm.submit(function() {
			    //se envia imagen al servidor y este retorna archivo PNG
			    var chartArea = $(chartDiv).find('svg').parent()[0];
			    console.log(chartArea.offsetWidth);
			    console.log(chartArea.offsetWidth * 2);
			    var svg = $(chartArea).html();
			    var canvas = $('<canvas>').attr('height', chartArea.offsetHeight * 2).attr('width', chartArea.offsetWidth * 2);

          		$('body').append(canvas);

			    svg = svg.replace(new RegExp('font-family="Arial"', 'g'), 'font-family="Kunder"');
			    
			    canvg(canvas[0], svg, { ignoreDimensions : true, scaleWidth : chartArea.offsetWidth * 2, scaleHeight : chartArea.offsetHeight * 2 });
			    
			    var ctx = canvas[0].getContext('2d');
			    ctx.font = 'bold 25px Kunder';
			    ctx.fillText('kunder.cl', canvas[0].width - 100, canvas[0].height - 20);
			    var imgData = canvas[0].toDataURL("image/png").replace("data:image/png;base64,", "");
			    hidden.val(imgData);
			    canvas.remove();
			    
				chartDiv.trigger({
					type : 'downloadChart',
					chartId : chartDiv.data('chartId')
				});
			});
			
			var downloadDiv = $('<div>', {
				class	: toolTipBaseClass + 'download '
			}).click(function() {
				downloadForm.submit();
				chartDiv.trigger({
					type : 'downloadChart',
					chartId : chartDiv.data('chartId')
				});
			});
			
			toolTip.append(downloadDiv);
		}
		
		//boton de configuracion
		if(_toolTipOptions.config) {
			
			var configMenuDiv = $('<div>', {
				class: 'chartConfigMenu',
			});
		
			//div show labels
			var configMenuShowLabelsDiv = $('<div>', {})
			.append(
				$('<input>', {
					type : 'checkbox',
					id : 'showValues-' + chartDiv.data('chartId')
				}).change(function() {
					//cuando scheckbox cambia de estado
					chartDiv.trigger({
						type : 'chartLabelsDisplayChanged',
						chartId : chartDiv.data('chartId'),
						state : this.checked
					});
					
					if(this.checked) {
						options.configOptions.showLabels = true;
						switch (options.type) {
							case 'column':
								_columnChartCreateLabels(chartDiv, dataTable);
								if(options.magnified) {
									chartDiv.find('svg > g > g > g > text.valueLabelText').attr('font-size', '14');
								}
								break;
	
							case 'line':
								if(!options.magnified) {
									_lineChartDisplayLabels(chartDiv, true);
								}
								else {
									$('.dygraphDefaultAnnotation').show();
								}
								break;
						}
					}
					else {
						options.configOptions.showLabels = false;
						switch (options.type) {
							case 'column':
								chartDiv.find('svg > g > g > g > text.valueLabelText').remove();
								break;
	
							case 'line':
								if(!options.magnified) {
									_lineChartDisplayLabels(chartDiv, false);
								}
								else {
									$('.dygraphDefaultAnnotation').hide();
								}
								break;
						}
					}
				})
			)
			.append($('<label>', {
				text : 'Mostrar valores',
				'for': 'showValues-' + chartDiv.data('chartId')
			}));
			
			configMenuDiv.append(configMenuShowLabelsDiv);
			
			if(options.magnified) {
				configMenuDiv.addClass('magnified');
			}
			
			//boton de menu de configuracion
			var configDiv = $('<div>', {
				class	: toolTipBaseClass + 'config ',
			});
			configDiv.click(function(e) {
				if(!options.magnified) {
					configMenuDiv.css({ 
						top: ($(this).height() + 5) + 'px',
						left : ($(this).position().left - 120) + 'px'
					});
				}
				else {
					configMenuDiv.css({ 
						//top: ($(this).height() + 10) + 'px',
					});
				}
				$('.chartConfigMenu').not(configMenuDiv).hide('slide', { direction : 'up' }, 500);
				$('.chartToolTipTool.config').not(configDiv).removeClass('configMenuActive');
				configDiv.toggleClass('configMenuActive');
				
				configMenuDiv.toggle('slide', { direction : 'up' }, 500);
				
				chartDiv.trigger({
					type : 'configChart',
					chartId : chartDiv.data('chartId')
				});
				
				e.stopImmediatePropagation();
			});
			
			//para que div de opciones de configuracion desaparezca con clicks en cualquier parte
			$(document).click(function(event) {
				if(!configMenuDiv.is(event.target) && !configDiv.is(event.target)) {
					$('.chartConfigMenu').hide('slide', { direction : 'up' }, 500);
					$('.chartToolTipTool.config').removeClass('configMenuActive');
				}
			});
			
			toolTip.append(configDiv);
			toolTip.append(configMenuDiv);
		}
			
		return toolTip;
	}
	
	function _lineChartDisplayLabels(chartDiv, show) {
		if(show){
			$(chartDiv).find('svg > g > g > g > g > text').show();
			$(chartDiv).find('svg > g > g > g > rect').each(function(){
				if($(this).attr('width') == '1' && $(this).attr('height') == '12') {
					$(this).show();
				}
			});
		}
		else {
			$(chartDiv).find('svg > g > g > g > g > text').hide();
			$(chartDiv).find('svg > g > g > g > rect').each(function(){
				if($(this).attr('width') == '1' && $(this).attr('height') == '12') {
					$(this).hide();
				}
			});
		}
	}
	
	function _columnChartCreateLabels(chartDiv, dataTable) {
		//Se agregan labels de valores
		//http://jsfiddle.net/augustomen/FE2nh/
		
	    rects = chartDiv.find('svg > g > g > g > rect').sort(function(a, b) {
	    	var va = parseFloat($(a).attr('x'));
	    	var vb = parseFloat($(b).attr('x'));
	    	return va < vb ? -1 : va > vb ? 1 : 0;
	    });
	    
	    var row = 0;
	    var serie = 1;
	    
	    for (var i = 0; i < rects.length; i++) {

	    	// this selector also retrieves gridlines and legend
	        // we're excluding them by height and fill-opacity
	        el = $(rects[i]);
	        if (parseFloat(el.attr("height")) <= 2 || parseFloat(el.attr("fill-opacity")) <= 0) { continue; }
	        aparent = el.parent();
	        
	    	//se parte de 1 para saltarse nombre de la serie
	    	for(serie; serie < dataTable.getNumberOfColumns(); serie++) {
		    	if(dataTable.getColumnRole(serie) == 'tooltip' ||  parseFloat(dataTable.getValue(row, serie)) == 0) { 
		    		continue; 
		    	}
		    	
		        text = dataTable.getFormattedValue(row, serie);
		        
		        if (text) {
		            pos = _getElementPos(el);
		            attrs = {
		            		x: pos.x + pos.width / 2, 
		            		y: pos.y - 2,
		            		fill: 'black', 
		            		'font-family': 'Arial', 
		            		'font-size': 11, 
		            		'text-anchor': 'middle',
		            		'fill' : '#444444',
		            		'class': 'valueLabelText',
		            	};
		            aparent.append(_addTextNode(attrs, text));
		        }
		        
		        //se busca proxima serie
		        serie++;
		        for(serie; serie < dataTable.getNumberOfColumns(); serie++) {
		        	if(dataTable.getColumnRole(serie) == 'tooltip' ||  parseFloat(dataTable.getValue(row, serie)) == 0) { 
			    		continue; 
			    	}
		        	else { break; }
		        }
		        break;
	    	}
	    	console.log('after serie ' + serie);
	    	
	    	if (serie >= dataTable.getNumberOfColumns()) { 
	    		console.log('reset serie');
	    		serie = 1;
	    		row++;
	    	}
	        
	    }
	}
	
	function _getElementPos(element) {
	    // returns an object with the element position
	    return {
	        x: parseFloat(element.attr("x")),
	        width: parseFloat(element.attr("width")),
	        y: parseFloat(element.attr("y")),
	        height: parseFloat(element.attr("height")),
	    };
	}
	
	function _addTextNode(attrs, text) {
	    // creates an svg text node
	  var el = document.createElementNS('http://www.w3.org/2000/svg', "text");
	 
	  for (var k in attrs) { 
		  el.setAttribute(k, attrs[k]); 
	  }
	  
	  var textNode = document.createTextNode(text);
	  el.appendChild(textNode);
	  return el;
	}
	
	return {
		DrawChart	: _drawChart,
	};
}(jQuery));