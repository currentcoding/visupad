// rectTransform

/*Author: Fabian Ling;

The module app.rectTransform.js manages rotation, positioning and resizing of an objects and provides its transformation grid.

using: textEdit, display, inputEdit  */

app.rectTransform = (function(){
	
	var canvasWidth = app.display.objectCanvas.width;
	var canvasHeight = app.display.objectCanvas.height;
	
	var startAngle = 0;
	var rotationOffset = 0;
	var xHandleSet = true; // lock/unlock init of xHandle
	var xHandle = 0; // x-Pos of a 90°rotated object
	var yHandle = 0;

		// xHandleSet is set true/false, to receive initial value for each scale operation
	var setxHandle = function(status){ xHandleSet = status; }
	
		// updates position while rotating
	var rotateDragBox = function(dragBox, mouseX, mouseY, rotationStarted){				
				
				var transY;
				var transX;																	
									
				$("#canvas_container").css('cursor','move');
				
					// calculating angle of mouse position in the unit circle of the dragBox:
					// while rotating dragBox.x and dragBox.y never change only the representation through a rotated ctx
					// to determine if rotation is ccw or cw mouse positions are compared to object x & y
					// then by translation to the origin of the coordinate system an y and x value is received that can be used for angle calculation
				if (mouseY < (dragBox.yHandle+(dragBox.heightHandle/2))){
					
					transY = (dragBox.yHandle+(dragBox.heightHandle/2)) -mouseY;
				}else{
				
					transY = -(mouseY - (dragBox.yHandle+(dragBox.heightHandle/2)));
				}
				
				if (mouseX >(dragBox.xHandle + (dragBox.widthHandle/2))){
					
					transX = mouseX - (dragBox.xHandle + (dragBox.widthHandle/2));

				}else{
				
					transX = -((dragBox.xHandle + (dragBox.widthHandle/2)) - mouseX);
					if(transX === 0)transX= 0.0001;
				}

					// mouse position describes an angle on unit circle of the dragBox
				var currentAngle = Math.atan(transY / transX)/Math.PI*180;
				
					// angle determination via atangens needs a consideration of the quadrants
				if(transX<0 && transY>=0) currentAngle = 180 + currentAngle; // tan ergibt winkel alpha positiv
				if(transX<=0 && transY<0) currentAngle = 180 + currentAngle;  // tan ergibt winkel 90-|alpha| und negativ
				if(transX>0 && transY<=0) currentAngle = 360 + currentAngle;
				
				var rotateAngle =  -(currentAngle);

				if(rotationStarted){
				
					startAngle = rotateAngle;
					app.inputEdit.setRotationStarted(false);
					rotationOffset = startAngle;
				}
				
				if( dragBox.rotationInit ){
				
					dragBox.rotation = rotateAngle - startAngle;
					dragBox.rotationInit = false;

				}else{
					dragBox.rotation = (dragBox.rotation +(rotateAngle - rotationOffset))%360;
				}
		
					// transformation grid is supposed to rotate similar to the mouse position while rotating
				dragBox.rotationHandle = rotateAngle - startAngle;
				
				app.display.makeRefresh(true, app.inputEdit.getRotate());	

				rotationOffset = rotateAngle;				
	}
	
		//updates position while dragging
	var dragDragBox = function(dragBox, dragX, dragY, rotate){				
				
				dragBox.x = dragX;
				dragBox.y = dragY;
				updateTransGrid(dragBox);	
				app.inputEdit.setUpdateHandle(true);					
				app.inputEdit.putHandle(dragBox);
				
				if(!rotate) {
					dragBox.rotationHandle = 0;
					app.display.makeRefresh(true, app.inputEdit.getRotate());
				}
	}
		
		//updates values dragBox while resizing
	var resizeDragBox = function(dragBox, mouseX, mouseY){								
				
				$("#canvas_container").css('cursor','se-resize');

				var dragWidth; 
				var dragHeight;

				if(xHandleSet == true){
					xHandle = dragBox.xHandle;
					yHandle = dragBox.yHandle;
					xHandleSet = false;
				}
				
				// determine grid height and width, later on taking the one with the larger value and determine the second dimension via a ratio				
				dragWidth = mouseX - xHandle;
				dragHeight = mouseY - yHandle;
				
				
				if( (dragBox.widthHandle/dragWidth) >  (dragBox.heightHandle/dragHeight) ){
					
					dragHeight = Math.floor(dragWidth * dragBox.hGridRatio);
					
				}else{
					
					dragWidth = Math.floor(dragHeight * dragBox.wGridRatio);
				}
				
				
				
				if(dragWidth < app.minBoxSize){
					
					dragWidth = app.minBoxSize;
					dragHeight = Math.floor(dragWidth * dragBox.hGridRatio);				
				}
				
				if(dragHeight < app.minBoxSize){
					
					dragHeight = app.minBoxSize;
					dragWidth = Math.floor(dragHeight * dragBox.wGridRatio);
				}
				

				dragBox.height = dragHeight * dragBox.rectheightGridheightRatio;
				dragBox.width = dragBox.height * dragBox.wRatio;
				resizeTransGrid(dragBox);
				app.textEdit.resizeText(dragBox);
				app.inputEdit.setUpdateHandle(true);
				app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
		
		// updates the handles and transformation grid after a rotation
	var updateTransGrid = function updateTransGrid(dragBox){
			
				var cos = Math.cos(dragBox.rotation/180*Math.PI);
				var sin = Math.sin(dragBox.rotation/180*Math.PI);
				
				if(cos == 1){
					dragBox.xHandle = dragBox.x;
					dragBox.yHandle = dragBox.y;
					dragBox.widthHandle = dragBox.width;
					dragBox.heightHandle = dragBox.height;
					
				}else{
				
					var xTrans = dragBox.x + (0.5*dragBox.width);
					var yTrans = dragBox.y + (0.5*dragBox.height);
					
					var x1 = (cos*(- (0.5*dragBox.width)) -sin*(- (0.5*dragBox.height))) + xTrans;
					var y1 = (sin*(- (0.5*dragBox.width)) + cos*(- (0.5*dragBox.height))) + yTrans;
					
					var x2 = (cos*(dragBox.width - (0.5*dragBox.width)) -sin*(- (0.5*dragBox.height))) + xTrans;
					var y2 = (sin*(dragBox.width - (0.5*dragBox.width)) + cos*(- (0.5*dragBox.height))) + yTrans;

					var x3 = (cos*(dragBox.width - (0.5*dragBox.width)) -sin*(dragBox.height - (0.5*dragBox.height))) + xTrans;
					var y3 = (sin*(dragBox.width - (0.5*dragBox.width)) + cos*(dragBox.height - (0.5*dragBox.height))) + yTrans;

					var x4 = (cos*(- (0.5*dragBox.width)) -sin*(dragBox.height - (0.5*dragBox.height))) + xTrans;
					var y4 = (sin*(- (0.5*dragBox.width)) + cos*(dragBox.height - (0.5*dragBox.height))) + yTrans;

					var extremXPos = [x1,x2,x3,x4];
					var extremYPos = [y1,y2,y3,y4];
					
					var xS = canvasWidth;
					var xL = 0;
					var yS = canvasHeight;
					var yL = 0;

					for(var i=0; i < extremXPos.length; i++){
					
						if(extremXPos[i] < xS) xS = extremXPos[i];
						if(extremXPos[i] > xL) xL = extremXPos[i];
						if(extremYPos[i] < yS) yS = extremYPos[i];
						if(extremYPos[i] > yL) yL = extremYPos[i];
					}
					

					dragBox.xHandle = xS;
					dragBox.yHandle = yS;					
					dragBox.widthHandle = xL - xS;
					dragBox.heightHandle = yL - yS;
					dragBox.wGridRatio = dragBox.widthHandle/dragBox.heightHandle;
					dragBox.hGridRatio = dragBox.heightHandle/dragBox.widthHandle;
					dragBox.rectheightGridheightRatio = dragBox.height / dragBox.heightHandle;
				}
				
				app.inputEdit.setDragBox(dragBox);
				app.inputEdit.setUpdateHandle(true);
	}
	
			// updates the handles and transformation grid while rotated rect is resized
	var resizeTransGrid = function resizeTransGrid(dragBox){
			
				var cos = Math.cos(dragBox.rotation/180*Math.PI);
				var sin = Math.sin(dragBox.rotation/180*Math.PI);
				
				if(cos == 1){
					dragBox.xHandle = dragBox.x;
					dragBox.yHandle = dragBox.y;
					dragBox.widthHandle = dragBox.width;
					dragBox.heightHandle = dragBox.height;
					
				}else{
				
					var xTrans = dragBox.x + (0.5*dragBox.width);
					var yTrans = dragBox.y + (0.5*dragBox.height);
					
					var x1 = (cos*(- (0.5*dragBox.width)) -sin*(- (0.5*dragBox.height))) + xTrans;
					var y1 = (sin*(- (0.5*dragBox.width)) + cos*(- (0.5*dragBox.height))) + yTrans;
					
					var x2 = (cos*(dragBox.width - (0.5*dragBox.width)) -sin*(- (0.5*dragBox.height))) + xTrans;
					var y2 = (sin*(dragBox.width - (0.5*dragBox.width)) + cos*(- (0.5*dragBox.height))) + yTrans;

					var x3 = (cos*(dragBox.width - (0.5*dragBox.width)) -sin*(dragBox.height - (0.5*dragBox.height))) + xTrans;
					var y3 = (sin*(dragBox.width - (0.5*dragBox.width)) + cos*(dragBox.height - (0.5*dragBox.height))) + yTrans;

					var x4 = (cos*(- (0.5*dragBox.width)) -sin*(dragBox.height - (0.5*dragBox.height))) + xTrans;
					var y4 = (sin*(- (0.5*dragBox.width)) + cos*(dragBox.height - (0.5*dragBox.height))) + yTrans;

					var extremXPos = [x1,x2,x3,x4];
					var extremYPos = [y1,y2,y3,y4];
					
					var xS = canvasWidth;
					var xL = 0;
					var yS = canvasHeight;
					var yL = 0;

					for(var i=0; i < extremXPos.length; i++){
					
						if(extremXPos[i] < xS) xS = extremXPos[i];
						if(extremXPos[i] > xL) xL = extremXPos[i];
						if(extremYPos[i] < yS) yS = extremYPos[i];
						if(extremYPos[i] > yL) yL = extremYPos[i];
					}
					
						// translation is calculated, so that sourrounding does not change position while resizing a rotated rect
					var xPosTranslation = 0;
					var yPosTranslation = 0;
					
					if(dragBox.xHandle > xS){
						xPosTranslation = (dragBox.xHandle - xS);
						dragBox.x += xPosTranslation;
					}else{
					
						xPosTranslation = (xS - dragBox.xHandle);
						dragBox.x -= xPosTranslation;
					}
						
					if(dragBox.yHandle > yS){

						yPosTranslation = (dragBox.yHandle - yS);
						dragBox.y += yPosTranslation;
					}else{
					
						yPosTranslation = (yS - dragBox.yHandle);
						dragBox.y -= yPosTranslation;
					}
					 
				
					dragBox.widthHandle = xL - xS;
					dragBox.heightHandle = yL - yS;
					dragBox.wGridRatio = dragBox.widthHandle/dragBox.heightHandle;
					dragBox.hGridRatio = dragBox.heightHandle/dragBox.widthHandle;
					dragBox.rectheightGridheightRatio = dragBox.height / dragBox.heightHandle;
				}
				
				app.inputEdit.setDragBox(dragBox);
				app.inputEdit.setUpdateHandle(true);
	}
	
	return {			
	
		dragDragBox: dragDragBox,
		updateTransGrid: updateTransGrid,
		resizeDragBox: resizeDragBox,
		rotateDragBox: rotateDragBox,
		setxHandle: setxHandle
	}
})();