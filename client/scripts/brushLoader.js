// BrushLoader

/*Author: Fabian Ling; 

The module app.brushLoader loads the brush textures and tints them*/



app.brushLoader = (function(){

		// holds all edding colors
	var eddingColors = {}; 
	
		// holds all bg brush colors
	var bgBrushColors = {}; 
	
		// testure for eraser
	var eraser = new Image();
	eraser.src = 'img/eraser_stroke.png';

		// canvas element to colorize the images
	var buffer = document.createElement('canvas');
	var bx = buffer.getContext('2d');
	
	var init = function(){
		
		eddingColorize();
		bgBrushColorize();
	}
	
		// loading the edding-texture and assigning colors					
	var eddingColorize = function(){						

				var brushImage = new Image();
				

				brushImage.onload = function () {
				
					buffer.width = brushImage.width;
					buffer.height = brushImage.height;
					bx.drawImage(brushImage, 0, 0);
					
					eddingColors["yellow"] = colorize(app.yellow, brushImage);
					eddingColors["red"] = colorize(app.red, brushImage);
					eddingColors["green"] = colorize(app.green, brushImage);
					eddingColors["baby"] = colorize(app.baby, brushImage);
					eddingColors["blue"] = colorize(app.blue, brushImage);
					eddingColors["black"] = colorize(app.black, brushImage);

				}

				brushImage.src = 'img/edding_stroke.png';					
	}
	
		// loading the bg-brush-texture and assigning colors					
	var bgBrushColorize = function(){						

				var brushImage = new Image();
				

				brushImage.onload = function () {
				
					buffer.width = brushImage.width;
					buffer.height = brushImage.height;
					bx.drawImage(brushImage, 0, 0);
					
					bgBrushColors["yellow"] = colorize(app.yellow, brushImage);
					bgBrushColors["red"] = colorize(app.red, brushImage);
					bgBrushColors["green"] = colorize(app.green, brushImage);
					bgBrushColors["baby"] = colorize(app.baby, brushImage);
					bgBrushColors["blue"] = colorize(app.blue, brushImage);
					bgBrushColors["black"] = colorize(app.black, brushImage);

				}

				brushImage.src = 'img/bg_brush_stroke.png';					
	}
	
	var colorize = function(color, brushImage ){
	
				bx.save();
				bx.clearRect(0, 0, buffer.width, buffer.height);
				bx.drawImage(brushImage, 0, 0);
				bx.globalCompositeOperation = "source-in";
				bx.fillStyle = color;
				bx.rect(0, 0, buffer.width, buffer.height);
				bx.fill();
				bx.restore(); // to reset globalCompositeOperation, so that next texture can be drawn on it
				var coloredBrush = new Image();
				coloredBrush.src = buffer.toDataURL();
				return (coloredBrush);					
	}


	return {

		init: init,
		eddingColors: eddingColors,
		bgBrushColors: bgBrushColors,
		eraser: eraser
	}
})();
