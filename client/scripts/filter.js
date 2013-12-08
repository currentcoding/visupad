// Filter

/*Author: Fabian Ling;

The module app.filter.js provides filter for image data.

using: inputEdit, display  */

app.filter = (function(){

	
		// reading data of upload and create an image object
	var swFilter = function(imgBox){
	
	
					if(imgBox.sw){

					return;
					
					}
					/*
					if(imgBox.source.length > 34000){

						alert("Currently only small images can be filtert.");
						return;
					}*/
					
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
				
					var img = document.createElement("img");
					var source;
							
							
					img.onload = function () {
					
						canvas.width = img.width;
						canvas.height = img.height;
						ctx.drawImage(img, 0, 0, img.width, img.height);
						
						var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
						
						var pixels = imgData.data;
						
						for (var i = 0; i < pixels.length; i += 4) {
						
						  var r = pixels[i];
						  var g = pixels[i + 1];
						  var b = pixels[i + 2];
						  var average = (r+g+b)/3;
						  pixels[i] = average;
						  pixels[i + 1] = average;
						  pixels[i + 2] = average;
						}

						ctx.putImageData(imgData, 0, 0);
						
						//img.src = canvas.toDataURL();
						imgBox.source = canvas.toDataURL();
						
						var imgFiltered = new Image();
						
						imgFiltered.onload = function(){
						
							imgBox.img = imgFiltered;							
							if(!imgBox.sw) app.display.makeRefresh(true, app.inputEdit.getRotate());
							imgBox.sw = true;
							app.connection.sendUpdateObject(imgBox, 'update');							
						}
						imgFiltered.src = canvas.toDataURL();						
					}
						// if image source was originally from a website, then security issues have to be turned off
					if(imgBox.source.substring(0,4) == "http") img.crossOrigin = "anonymous";

					img.src = imgBox.source;
				
	}	
	
	return {
		swFilter: swFilter
	}
})();
