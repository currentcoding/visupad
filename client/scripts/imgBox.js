// ImgBox

/*Author: Fabian Ling;

The module app.imgBox.js provides an object that inherits from app.rect.js and can store image data.
An imgBox can check if it includes certain coordinates and it can draw itself.

using: inputEdit, objectStorage, rect, display  */

app.imgBox = (function(){
	
	var objectCanvas = app.display.objectCanvas;	
	var objectCtx = app.display.objectCtx;
	
		// img object
	var imgBox = function(x, y, width, height, id, index, img, source) {
	
		app.rect.rect.call(this, x, y, width, height, id, index); // Apply Box function logic to new imgBox object

		this.img = img;
		this.source = source;
		this.sw = false;
	}
	
	
	imgBox.prototype = {

		constructor: imgBox,
		
		draw: function(){
		
				if( (this.block != null) && (this.block != app.objectStorage.getUserName()) ){
				
					objectCtx.globalAlpha = 0.5;
				}else{
					objectCtx.globalAlpha = 1.0;
				}
				
				if(this.rotation != 0){
				
						objectCtx.save();
						objectCtx.translate( (this.x + this.width/2), (this.y + this.height/2) );
						objectCtx.rotate( this.rotation*Math.PI/180 );
						objectCtx.drawImage(this.img, - this.width/2, - this.height/2, this.width, this.height);
					
						objectCtx.restore();
						
					}else{
										
						objectCtx.drawImage(this.img, this.x, this.y, this.width, this.height);						
					}
		},
		
		contains: function(xPos, yPos) {
			
				if(xPos > this.xHandle && xPos <= ((this.xHandle + this.widthHandle) ) &&
					yPos > this.yHandle && yPos <= ((this.yHandle + this.heightHandle ))) return true;					
		}
	}
	
		// creates a imgBox and stores it in app.objectStorage
	var addImgBox = function(x, y, width, height, id, index, img, source) {
			
				var img = new imgBox(x, y, width, height, id, index, img, source);

				app.objectStorage.addObject(img);
				app.inputEdit.setDragBox(img);
				app.inputEdit.putHandle(img);
				app.display.makeRefresh(true, app.inputEdit.getRotate());
		}
		
	return {			
		
			imgBox: imgBox,
			addImgBox: addImgBox
		}	
})();
