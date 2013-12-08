// Rect

/*Author: Fabian Ling;

The module app.rect.js provides an object that holds position data of an object.
An rect can check if it includes certain coordinates and it can draw itself.

using: display  */

app.rect = (function(){

	var objectCanvas = app.display.objectCanvas;	
	var objectCtx = app.display.objectCtx;

	var transIcon = new Image();
	transIcon.src = 'img/trans.png';
	var rotateIcon = new Image();
	rotateIcon.src = 'img/rotate.png';
	var deleteIcon = new Image();
	deleteIcon.src = 'img/delete.png';
		
		// creates rectangle object that additionally stores its handle positions
	var rect = function Rect(x, y, width, height, id, index) {
	
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.wRatio = width/height;
		this.hRatio = height/width;
		this.index = index;
		this.block = null;
		
		this.rotation = 0;
		this.rotationInit = true;
		//coordinates for the handles
		this.xHandle = x;
		this.yHandle = y;
		this.widthHandle = width;
		this.heightHandle = height;
		this.rotationHandle = 0;
		this.wGridRatio = width/height;
		this.hGridRatio = height/width;
		this.rectheightGridheightRatio = 1;
	}
	
		// put functions via prototype, because they are the same for all rect-objects
	rect.prototype = {
		
		constructor: rect,
	
		draw: function(rotate, dragBox){
		
			var handleColor = app.handleColor;
			var iconOffset = app.iconOffset;
			var transIconSize = app.transIconSize;
			var rotateIconSize = app.rotateIconSize;
			var deleteIconSize = app.deleteIconSize;
		
			if(rotate && dragBox){
			
				objectCtx.save();
				objectCtx.translate( (dragBox.xHandle + dragBox.widthHandle/2), (dragBox.yHandle + dragBox.heightHandle/2) );
				objectCtx.rotate( dragBox.rotationHandle*Math.PI/180 );

				objectCtx.strokeStyle = app.handleColor;
				objectCtx.lineWidth = app.handleStroke;
				objectCtx.strokeRect((0 - dragBox.widthHandle/2),(0 - dragBox.heightHandle/2) ,dragBox.widthHandle,dragBox.heightHandle);

				
				var xTrans = - dragBox.widthHandle/2;
				var yTrans =  - dragBox.heightHandle/2;
				objectCtx.drawImage(deleteIcon, xTrans - deleteIconSize - app.iconOffset, yTrans - deleteIconSize - app.iconOffset);		
				objectCtx.drawImage(rotateIcon, xTrans + dragBox.widthHandle, yTrans  - rotateIconSize);	
				objectCtx.drawImage(transIcon, xTrans + dragBox.widthHandle + app.iconOffset, yTrans + dragBox.heightHandle + app.iconOffset);	

				objectCtx.restore();
				
			}else{

				objectCtx.drawImage(deleteIcon,dragBox.xHandle - deleteIconSize - iconOffset, dragBox.yHandle - deleteIconSize - iconOffset);	
				objectCtx.drawImage(rotateIcon, dragBox.xHandle + dragBox.widthHandle, dragBox.yHandle - rotateIconSize );	
				objectCtx.drawImage(transIcon, dragBox.xHandle + dragBox.widthHandle + iconOffset, dragBox.yHandle+dragBox.heightHandle + iconOffset);
				
				if(dragBox) {
			
					objectCtx.strokeStyle = app.handleColor;
					objectCtx.lineWidth = app.handleStroke;
					objectCtx.strokeRect(dragBox.xHandle,dragBox.yHandle,dragBox.widthHandle,dragBox.heightHandle);
				}
			}
			
		},
					
		
		contains: function(xPos, yPos) {
			if(xPos > this.x && xPos <= ((this.x + this.width) ) &&
				yPos > this.y && yPos <= ((this.y + this.height ))) return true;
		}
		
	}		
	
	return {			
		
			rect: rect
		}
	
})();	