// Display

/*Author: Fabian Ling;

The module app.display is managing the canvas for brush stroke and converts input data into strokes on the canvas.
It can load a pgn with drawings that have been made befor the user entered the room. The Server can ask for the current canvas to send it to new users.
The module app.display is managing a second canvas for image and text objects, which can be refreshed if objects have been updated.

using: inputEdit, objectStorage, connection, brushLoader */


app.display = (function(){
				
		// color for drawings and text
	var colorSelected = 'black';
	
	var eraserSelected = false;
	var bgBrush = false;
	
		// setting canvas size to its parent and fix parent size
	var canvas_container = $('#canvas_container');
	var canvasWidth = canvas_container.width();
	var canvasHeight = canvas_container.height();
	canvas_container.css({width: canvasWidth, height: canvasHeight, 'position':'relative'});
	var scrollbar = app.scrollbarSize;
	
	
		// canvas for brush stroke
	var canvas = document.getElementById('canvas');       
	var ctx = canvas.getContext('2d');
	canvas.width = canvasWidth - scrollbar;
	canvas.height = canvasHeight - scrollbar;
	canvas.onselectstart = function () { return false; } // ie, prevent text selection
	canvas.onmousedown = function () { return false; } // mozilla, prevent text selection

		// canvas for colorizing
	var colorCanvas = document.getElementById('colorCanvas');       
	var colorCtx = colorCanvas.getContext('2d');
	colorCanvas.width = canvasWidth - scrollbar;
	colorCanvas.height = canvasHeight - scrollbar;
	colorCanvas.onselectstart = function () { return false; } // ie, prevent text selection
	colorCanvas.onmousedown = function () { return false; } // mozilla, prevent text selection	
	
		// canvas for objects
	var objectCanvas = document.getElementById('objectCanvas');		
	var objectCtx = objectCanvas.getContext('2d');
	objectCanvas.width = canvasWidth - scrollbar;
	objectCanvas.height = canvasHeight - scrollbar;		
	objectCanvas.onselectstart = function () { return false; } // ie, prevent text selection
	objectCanvas.onmousedown = function () { return false; } // mozilla, prevent text selection	
	
	var refresh = false;
	var rotate = false;		
	
	var init = function(){
				
					// redraw canvas
				setInterval(redraw, app.interval);				
	}
	
		// adjust canvasContainer and canvas to window size
	var setCanvasContainer = function(){ 
				
				var reloadCanvasContent = false;
				var canvasURL;
				var colorCanvasURL;
				var width = $(window).width() - app.leftContainerWidth;
				var height = $(window).height() - app.footerHeight;
				canvas_container.css({width: width, height: height});
				
				if((width > canvas.width) || (height > canvas.height)){
					reloadCanvasContent = true;
						// store current canvas before resizing
					canvasURL = canvas.toDataURL();
					colorCanvasURL = colorCanvas.toDataURL();
				}	
					
				if(width > canvas.width){
					canvasWidth = width - scrollbar;
					canvas.width = canvasWidth;
					objectCanvas.width  = canvasWidth;
					colorCanvas.width = canvasWidth;
					app.interfaceUpdate.sendCanvasSize(canvasWidth, canvasHeight);
				}
				
				if(height > canvas.height){
					canvasHeight = height - scrollbar;
					canvas.height = canvasHeight;
					objectCanvas.height  = canvasHeight;
					colorCanvas.height = canvasHeight;
					app.interfaceUpdate.sendCanvasSize(canvasWidth, canvasHeight);
				}
				
				if(reloadCanvasContent){
						// reload stored canvas after resize
					var imageCanvas = new Image();
					imageCanvas.onload = function() {					
						ctx.drawImage(this, 0, 0);
					};

					imageCanvas.src = canvasURL;	
					
					var imageColorCanvas = new Image();
					imageColorCanvas.onload = function() {					
						colorCtx.drawImage(this, 0, 0);
					};

					imageColorCanvas.src = colorCanvasURL;
				}
				
				app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
	

		// set canvas size
	var setCanvasSize = function(width, height){ 
					// store current canvas before resizing
				var canvasURL = canvas.toDataURL();
				var colorCanvasURL = colorCanvas.toDataURL();
				
					// if initCanvas, check if this canvas already is bigger than received canvas size
				if((width < canvas.width ) || (height < canvas.height)){
					
					app.interfaceUpdate.sendCanvasSize(canvas.width , canvas.height );
				}else{
					width -= scrollbar;
					height -= scrollbar;
					objectCanvas.height = height;
					objectCanvas.width = width;
					canvas.height = height;
					canvas.width = width;	
					colorCanvas.height = height;
					colorCanvas.width = width;
					
					canvasWidth = width;
					canvasHeight = height;
					
						// reload stored canvas after resize
					var imageCanvas = new Image();
					imageCanvas.onload = function() {					
						ctx.drawImage(this, 0, 0);
					};				
					imageCanvas.src = canvasURL;	
					
					var imageColorCanvas = new Image();
					imageColorCanvas.onload = function() {					
						colorCtx.drawImage(this, 0, 0);
					};

					imageColorCanvas.src = colorCanvasURL;							
					
					app.display.makeRefresh(true, app.inputEdit.getRotate());
				}
	}

		// set bgBrush true/false
	var setBgBrush =function(state){bgBrush = state;};
	
		// set bgBrush true/false
	var getBgBrush =function(){return bgBrush;};
	
		// set eraser true/false
	var setEraser = function(status){ eraserSelected = status; }
	
		// rotate is set true/false
	var setRotate = function(status){ rotate = status; }
	
		// set color to user-selected color //app[color]
	var setColor = function(color){ colorSelected = color; }		

		// return user-selected color or eraser
	var getColor = function(){
	
				if(eraserSelected){
					return "eraserSelected"; 
				}else{
					return colorSelected;
				}					
	}
	
		// if refresh is set to true, the canvas is redrawn
	var makeRefresh = function(make, status){
	
				refresh = make;
				rotate = status;
	}
	
	
		// redraw is called each interval, but only executed, when var refresh is true
	var redraw = function redraw() {

				if (refresh) {
				
					objectCtx.clearRect(0, 0, canvasWidth, canvasHeight);
					
					var storage = app.objectStorage.storage;
					
						// looping over all objects, drawing objects from low to high index							
					for(var i = 0; i <= app.objectStorage.getObjectIndex(); i++){
					
						for(var key in storage) {
							if( storage[key].index === i){
								storage[key].draw(); 
							}
						}
					}
					
					var dragBox = app.inputEdit.getDragBox();

					
					if (dragBox){
					
						app.inputEdit.getDeleteHandle().draw(rotate, dragBox);	//called to draw transGrid and handles icons
						dragBox.draw();
					}
				   
					refresh = false;
				}
	}
	
		// draws a line between 2points
	var draw = function(pos, color, bgBrush){
				
				var deltaX = pos[1].x - pos[0].x ;
				var deltaY = pos[1].y  - pos[0].y ;

				
					// distance via pytageros
				var distance = Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) );
				var angle = Math.atan2( deltaY, deltaX );
				
					// draw texture between 2 points
				var textureHalfSize;
				if(!bgBrush){
					textureHalfSize = app.pencilWidth ;
				}else{
					textureHalfSize = app.brushWidth;	
				}
				
				var x,y;
				
					// calculate points per step
				for ( var i = 0; i <= distance; i++ ) {
					x = pos[0].x + (Math.cos(angle) * i) - textureHalfSize;
					y = pos[0].y + (Math.sin(angle) * i) - textureHalfSize;						
					
						// check if eraser or brush is selected
					if(color === "eraserSelected"){
						
						ctx.globalCompositeOperation = "destination-out";
						ctx.drawImage(app.brushLoader.eraser, x, y);
						colorCtx.globalAlpha = 1.0;
						colorCtx.globalCompositeOperation = "destination-out";
						colorCtx.drawImage(app.brushLoader.eraser, x, y);
						
					}else if(bgBrush){
							// according to selected color the brush is loaded and drawn
						colorCtx.globalCompositeOperation = "source-over";
						colorCtx.globalAlpha = 0.1;
						colorCtx.drawImage(app.brushLoader.bgBrushColors[color], x, y);	
						
					}else{
							// according to selected color the brush is loaded and drawn
						ctx.globalCompositeOperation = "source-over";
						ctx.drawImage(app.brushLoader.eddingColors[color], x, y);	
					}						

				}
	}
		
		// sends the current canvas to the server
	var sendCanvas = function(socketId){			
				
				var canvasURL = canvas.toDataURL();
		
					// send colorCanvas with size of 70% and as JPEG to make it smaller
				var mergeCanvas = document.createElement('canvas');
				
				mergeCanvas.width = canvasWidth;
				mergeCanvas.height = canvasHeight;
				var checkBlancSize = mergeCanvas.toDataURL();
					// compare size of colorCanvas with empty mergeCanvas as png, 
					// if they are almost the same, the compared canvas is empty and should not be sent
				if( checkBlancSize.length - canvasURL.length >= 0)  canvasURL = null;
				
				var width = canvasWidth * app.resizeFactor;
				var height = canvasHeight * app.resizeFactor;
				
				mergeCanvas.width = width;
				mergeCanvas.height = height;
				var mergeCtx = mergeCanvas.getContext('2d');
				
				checkBlancSize = mergeCanvas.toDataURL('image/jpeg', '0.1');
				mergeCtx.fillStyle = "#fff";
				mergeCtx.fillRect(0, 0, width, height);
				mergeCtx.drawImage(colorCanvas, 0, 0, width, height);
				var colorCanvasURL = mergeCanvas.toDataURL('image/jpeg', '0.1');				
				
					// compare size of colorCanvas with empty mergeCanvas as png, 
					// if they are almost the same, the compared canvas is empty and should not be sent
				if( checkBlancSize.length - colorCanvasURL.length >= 0)  colorCanvasURL = null;
				
				if(canvasURL == null && colorCanvasURL == null) return;

					// tell new client to set a clock.gif
				app.connection.send('setClock', socketId); 
				
				var msg = {
					canvasURL: canvasURL,
					colorCanvasURL: colorCanvasURL,
					socketId: socketId,
					width: canvasWidth,
					height: canvasHeight 					
				};
						
				app.connection.send('sendCanvas', msg);
	}
	
		// loads the current canvas of the group on the canvas
	var initCanvas = function(data){

				setCanvasSize(data.width, data.height);
				var imageObj = new Image();

				
				imageObj.onload = function() {
	
					ctx.drawImage(this, 0, 0, canvasWidth, canvasHeight);
					
						// hide clock
					$('#clock').fadeOut();					
				};

				imageObj.src = data.canvasURL;			
				
					// loading canvas for wide brush strokes
				
				var imageColorCanvas = new Image();
				imageColorCanvas.onload = function() {					
					colorCtx.drawImage(this, 0, 0, canvasWidth, canvasHeight);
					
						// hide clock
					$('#clock').fadeOut();
				};
				imageColorCanvas.src = data.colorCanvasURL;	
	
	}
	
		// merge the 3 canvas objects to create a download pic
	var downloadMerge = function(){
				
				app.inputEdit.setDragBox(null);
				app.display.makeRefresh(true, app.inputEdit.getRotate());
				
				var mergeCanvas = document.createElement('canvas');
				mergeCanvas.width = canvasWidth;
				mergeCanvas.height = canvasHeight;
				var mergeCtx = mergeCanvas.getContext('2d');

				mergeCtx.fillStyle = "#fff";
				mergeCtx.fillRect(0, 0, canvasWidth, canvasHeight);
				mergeCtx.drawImage(colorCanvas, 0, 0);
				mergeCtx.drawImage(objectCanvas, 0, 0);
				mergeCtx.drawImage(canvas, 0, 0);
				var downloadPic = mergeCanvas.toDataURL();
			
					// create download window, so actual session isn't disturbed
				var downloadWindow=window.open('','Download Canvas','width=170,height=170, location=0, menubar=0, toolbar=0');
				downloadWindow.document.write("<body style=\"background-color:#3b3b3b;margin:0; padding:0;\"><a id=\"download_pic\" href="+downloadPic+" download=\"letsVisual_canvas.png\"><img src=\"data:image/gif;base64,R0lGODlhaABkAKIAAExHR+bi4XZubce9vKWYl/Px8P///zs7OyH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTFFRjJGRjJEODc2MTFFMjg5NzJERTBDQThEMjg4REMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTFFRjJGRjNEODc2MTFFMjg5NzJERTBDQThEMjg4REMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMUVGMkZGMEQ4NzYxMUUyODk3MkRFMENBOEQyODhEQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBMUVGMkZGMUQ4NzYxMUUyODk3MkRFMENBOEQyODhEQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAAAAAAALAAAAABoAGQAAAP/eLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHCoAhQMyKRyyWwiiRRAwEmtJqETqXXbxEq03PDTCwGLueTy9IxOO8zsqvu9jsvnDLi9i1/o90t9fnWATIIKf4VjgomKhweNhY+RgJOEileHlHuWmIaal56dnkqjpIt9m3amp6ykrqKgp5mMoZiwt4+2jkQCvr/AvkezBlAExJgBOgLIgAMAOwLDzWLPPczUYQNA0tlWBEICu97gQ6qz5UTnngJkAAPeBgXtae/Z83j2yPip8LMB9A758xQA2iMFx5IZPIhQkTWGDBLaeQiRATY22yo+uBgmU51GB924ePwIchqVkSTpVAmYMkIjli1dhoIZ0+VAfjUr2MOZ0wIBmj2DCh1KtKjRo0iTOojHCQfTVU6fsskhdarSq1izat3KtavXr2DDih1LtkcCADs=\" /></a></body>");
				downloadWindow.focus();
				downloadWindow.document.getElementById('download_pic').click();
	}
	
	return {

		init: init,
		canvas: canvas,
		ctx: ctx,
		objectCanvas: objectCanvas,
		objectCtx: objectCtx,
		draw: draw,
		sendCanvas: sendCanvas,
		initCanvas: initCanvas,	
		makeRefresh: makeRefresh,
		setCanvasContainer: setCanvasContainer,
		setColor: setColor,
		getColor: getColor,
		setEraser: setEraser,
		setCanvasSize: setCanvasSize,
		setBgBrush: setBgBrush,
		getBgBrush: getBgBrush,
		downloadMerge: downloadMerge
		
	}
})();
