// inputEdit

/*Author: Fabian Ling;

The module app.inputEdit.js examines user inputs and manages drawing, text editing and object transformations.

using: textEdit, display, connection, objectStorage, rect, rectTransform  */

app.inputEdit = (function(){ 
	
	var dragBox = null; // active text/image object
	var transHandle = null; // handle of dragBox
	var rotateHandle = null; // handle of dragBox
	var deleteHandle = null; // handle of dragBox
	var updateHandle = false; // locks/unlocks handle postion update
	
	var objectCanvas = app.display.objectCanvas;	
	var objectCtx = app.display.objectCtx;
	
	var mouseX; // x-pos of mouse
	var mouseY; // y-pos of mouse
	var offsetX; // move object, from where the mousedown x is tracked
	var offsetY; // move object, from where the mousedown y is tracked
	
	var rotationStarted = false; // locks/unlocks calculation of dragBox rotation
	var rotate = false; // locks/unlocks rotation
	var resize = false; // locks/unlocks resizing
	var drag = false; // locks/unlocks dragging
	var editable = false; // locks/unlocks text edition
	var objectSelectable = false // locks object transformation

	var pos = []; // holds current stroke position
	var strokeDown = false; // if true, user can draw
	var blockedArea = false; // prevent drawing area of blocked objects
	var blockInput = false; // prevent drawing input during intro
	
		// rotate is returned
	var getRotate = function(){ return rotate; }
	
		// editable is returned
	var getEditable = function(){ return editable; }
	
		// editable is set true/false
	var setEditable = function(status){ editable = status; }

		// BlockInput is set true/false
	var setBlockInput = function(status){ blockInput = status; }
	
		// DeleteHandle is returned
	var getDeleteHandle = function(){ return deleteHandle; }
	
		// setUpdateHandle is set true/false
	var setUpdateHandle = function(status){ updateHandle = status; }
	
		// rotationStarted is set true/false
	var setRotationStarted = function(status){ rotationStarted = status; }
	
		// objectSelectable is set true/false
	var setObjectSelectable = function(status){ objectSelectable = status; }

		// the active object on the objectCanvas is stored in dragBox
	var setDragBox = function(updatedDragBox){ dragBox = updatedDragBox; }
	
		// the active object on the objectCanvas is stored in dragBox
	var getDragBox = function(){ return dragBox; }
	
		// returning mouse pos
	var getMouse = function(e) {

				return {

					mouseX: mouseX,
					mouseY: mouseY
				};
	}
	
		// returning events cross browser safe
	var getPos = function(e) {

				return {

					x: (e.clientX || e.offsetX || e.layerX || e.pageX),
					y: (e.clientY || e.offsetY || e.layerY || e.pageY)
				};
	}
				
		// define mouse position relatively to the objectCanvas
	var getMousePos = function(e, inputTechnique){

				if(inputTechnique === "mouse"){
					
					var mouse = getPos(e);
					mouseX = mouse.x - objectCanvas.offsetLeft + $('#canvas_container').scrollLeft() + $(document).scrollLeft();
					mouseY = mouse.y - objectCanvas.offsetTop + $('#canvas_container').scrollTop() + $(document).scrollTop();
				}
				
				if(inputTechnique === "touch"){
					
					var touch = getPos( e.changedTouches[0] );
					
					mouseX = touch.x - objectCanvas.offsetLeft + $('#canvas_container').scrollLeft();
					mouseY = touch.y - objectCanvas.offsetTop + $('#canvas_container').scrollTop();
				}
	}
	
		// check if user hit delete button
	var deleteCheck = function(){
				
				if(deleteHandle && deleteHandle.contains(mouseX, mouseY) ){

					$("#canvas_container").css('cursor','auto');
					
					app.objectStorage.deleteObject(dragBox);												
					dragBox = null;
					deleteHandle = null;
					rotateHandle = null;
					transHandle = null;
					
					app.display.makeRefresh(true, rotate);
				}
	}

		// calculation of handle positions
	var putHandle = function(dragBox) {

				var handleColor = app.handleColor;
				var iconOffset = app.iconOffset;
				var transIconSize = app.transIconSize;
				var rotateIconSize = app.rotateIconSize;
				var deleteIconSize = app.deleteIconSize;

				if(!transHandle) {

					deleteHandle = new app.rect.rect(dragBox.xHandle - deleteIconSize - iconOffset, dragBox.yHandle - deleteIconSize - iconOffset, deleteIconSize, deleteIconSize, handleColor, 0);								
					rotateHandle = new app.rect.rect(dragBox.xHandle + dragBox.widthHandle, dragBox.yHandle - rotateIconSize, rotateIconSize, rotateIconSize, handleColor, 1);	
					transHandle = new app.rect.rect(dragBox.xHandle + dragBox.widthHandle + iconOffset, dragBox.yHandle+dragBox.heightHandle + iconOffset, transIconSize, transIconSize, handleColor, 2);	

				}
				
				if(updateHandle){
				
					deleteHandle.x = dragBox.xHandle - deleteIconSize - iconOffset;
					deleteHandle.y = dragBox.yHandle - deleteIconSize - iconOffset;
					rotateHandle.x = dragBox.xHandle + dragBox.widthHandle;
					rotateHandle.y = dragBox.yHandle - rotateIconSize;
					transHandle.x = dragBox.xHandle + dragBox.widthHandle + iconOffset;
					transHandle.y = dragBox.yHandle + dragBox.heightHandle + iconOffset;
					
					updateHandle = false;
				}
	}
		// checks if user clicked on an object, declares it as dragBox
	var currentDragBox = function(object){

				if(object.contains(mouseX, mouseY)){													

						// only set dragBox if object is not blocked or blocked by this user
					if( (object.block != null) && (object.block != app.objectStorage.getUserName()) ){
							// if user tries to dragg a Object that is blocked no unwanted strokes will appear instead
						blockedArea = true; 
						return;
					}
				
					drag = true;
					dragBox = object;
					
						//set options menu according to object type
					if(dragBox.source){
						app.interfaceUpdate.setPicMenu();
					}else{
						app.interfaceUpdate.setTextMenu();
					}
					
						// set the highest index for current dragBox
					app.objectStorage.incrementObjectIndex();
					dragBox.index = app.objectStorage.getObjectIndex();

					offsetX = mouseX - dragBox.x;
					offsetY = mouseY - dragBox.y;	
					dragBox.x = mouseX - offsetX;
					dragBox.y = mouseY - offsetY;						
					putHandle(dragBox);	
					return true;
				}
	}
	
		// checks if user clicked on a object handle
	var handleActiveCheck = function(object){
		
				if(transHandle && (transHandle.contains(mouseX, mouseY) || deleteHandle.contains(mouseX, mouseY) || rotateHandle.contains(mouseX, mouseY))){

					drag = true;

					offsetX = mouseX - dragBox.x;
					offsetY = mouseY - dragBox.y;	

					putHandle(dragBox);	
					
					return true;
				}
	}
	
		// checks if user clicked on empty objectCanvas and none of the objects is active
	var noneIsActiveCheck = function(object){
				
				var setCurrentNull = function(){ dragBox = null; transHandle = null; rotateHandle = null; deleteHandle = null; editable = false; blockedArea = false; $('#message').val(""); }
				
				if(!(object.contains(mouseX, mouseY)) && !(transHandle)){

					setCurrentNull();
					
				}else if(!(object.contains(mouseX, mouseY)) && !(transHandle.contains(mouseX, mouseY)) && !(rotateHandle.contains(mouseX, mouseY) && !(deleteHandle.contains(mouseX, mouseY)))){

					setCurrentNull();
				}					
	}
	
		// draw current mouse position
	var drawPosition = function(){
				
				pos.push({
					x: mouseX,
					y: mouseY
				 }); 
		
				if (pos.length === 2) {
				
					var endX = pos[1].x;
					var endY = pos[1].y;
				 
						// draw locally
					app.display.draw(pos, app.display.getColor(), app.display.getBgBrush());
					
						// send pos and color to the server
					var data = { pos: pos, color: app.display.getColor(), bgBrush: app.display.getBgBrush() };
					app.connection.send('draw', data);
									 
					pos.length = 0;
					pos.push({
						x: endX,
						y: endY
					});
				}	
	}
	
	
		// user event is handled
	var mouseDown = function(e, inputTechnique){

				getMousePos(e, inputTechnique);				
				
				rotationStarted = true;
				
				if(objectSelectable){
				
					deleteCheck();
					
					if(!resize || !rotate) {
					
						var storage = app.objectStorage.storage;
						
							// index from top to bottom, checking if object is clicked
						for(var i = app.objectStorage.getObjectIndex() ; i > 0 ; i--){
						
							for(var key in storage) {
									
								if( storage[key].index === i){
										// end the loop that is looking for the clicked Object, if a handle is hit
									if(handleActiveCheck(storage[key])){
									
										return;
										// end the loop if an object is hit and no handle
									}else if(currentDragBox(storage[key])){

										return;
									}
									noneIsActiveCheck(storage[key]);
								}							
							}
						}
					
						app.display.makeRefresh(true, rotate);
					}
				}else{
				
						// if no object is active, the user can draw						
					if(!dragBox && !blockedArea && !blockInput){

						strokeDown = true;
					}
				}
	}
	
		// user event is handled
	var mouseMove = function(e, inputTechnique){
				
				getMousePos(e, inputTechnique);

					// extra offset for the brush
				var brushOffset = 0;
				if(app.display.getBgBrush()){
					brushOffset = app.brushWidth/3;
				}else{
					brushOffset = app.pencilWidth;
				}

					// reset user input if mouse pos is not within the canvas
				if(((mouseX >= $('#canvas_container').width() + $('#canvas_container').scrollLeft() - app.scrollbarSize - brushOffset)  || (mouseY >= $('#canvas_container').height() + $('#canvas_container').scrollTop() - app.offset -app.scrollbarSize)) || ((mouseX - $('#canvas_container').scrollLeft() <=  1) || (mouseY - $('#canvas_container').scrollTop() <=  1) )  ){

					drag = false;
					rotate = false;
					resize = false;
					strokeDown = false;
					pos.length = 0;
				}
				
					// current mouse position is drawn
				if(strokeDown) drawPosition();
				
				
					// block object for other users					
				if(dragBox && (drag || rotate || resize)){

					if(!dragBox.block){
					
						dragBox.block = app.objectStorage.getUserName();
						app.objectStorage.blockObject(dragBox);
					}
				}
				
				
				if(objectSelectable){

						// active object is dragged
					var dragX = mouseX - offsetX;
					var dragY = mouseY - offsetY;
					if(drag && dragBox) app.rectTransform.dragDragBox(dragBox, dragX, dragY, rotate); 
						
						// active object is resized
					if(resize) app.rectTransform.resizeDragBox(dragBox, mouseX, mouseY);					
						
						// active object is rotated
					if(rotate) app.rectTransform.rotateDragBox(dragBox, mouseX, mouseY, rotationStarted);
										
					if(!drag) $("#canvas_container").css('cursor','auto');
					
					if(dragBox && dragBox.contains(mouseX, mouseY)) $("#canvas_container").css('cursor','move');
					
					if(deleteHandle && deleteHandle.contains(mouseX, mouseY) ) $("#canvas_container").css('cursor','auto');					
					
					if(transHandle && transHandle.contains(mouseX, mouseY) ){
						
						$("#canvas_container").css('cursor','se-resize');
							
						if (drag && !resize) {
							
							resize = true;
							drag = false;
						}						
					}
					
					if(rotateHandle && rotateHandle.contains(mouseX, mouseY) ){

						$("#canvas_container").css('cursor','auto');	
						
						if (drag && !rotate) {

							rotate = true;
							drag = false;
						}
					}	
				}				
	}
	
		// user event is handled
	var mouseUp = function(){
				
				if(rotate) app.rectTransform.updateTransGrid(dragBox);	
				
				if(dragBox){
				
					updateHandle = true;
					putHandle(dragBox);
					
					if(dragBox.block){
						
						dragBox.block = null;
						app.objectStorage.blockObject(dragBox);
					}
					
					if(drag || rotate || resize){
					
							// send object to server without source
						app.connection.sendUpdateObject(dragBox, 'update');
					}
				}
													
				drag = false;
				rotate = false;
				resize = false;
				strokeDown = false;
				pos.length = 0;
				
				app.rectTransform.setxHandle(true);
				app.display.makeRefresh(true, rotate);
	}
	
		// user event is handled		
	var dblClick = function(){
	
				if(dragBox && dragBox.font){
		
					editable = true;
					app.textEdit.editText(dragBox);		
				}
	}
	

	
	return {

		getDragBox: getDragBox,
		setDragBox: setDragBox,
		getDeleteHandle: getDeleteHandle,
		setUpdateHandle: setUpdateHandle,
		setRotationStarted: setRotationStarted,
		setEditable: setEditable,
		mouseDown: mouseDown,		
		mouseMove: mouseMove,
		mouseUp: mouseUp,
		dblClick: dblClick,
		putHandle: putHandle,
		getRotate: getRotate,
		getEditable :getEditable,
		setObjectSelectable: setObjectSelectable,
		getMouse: getMouse,
		setBlockInput:setBlockInput
	}
})();
