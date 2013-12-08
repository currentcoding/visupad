//TextEdit

/*Author: Fabian Ling;

The module app.textEdit.js prepares and updates size and content of a textBox inputs before it can be rendered to the canvas.

using: inputEdit, display, connection, objectStorage, rectTransform  */

app.textEdit = (function(){

	var objectCanvas = app.display.objectCanvas;	
	var objectCtx = app.display.objectCtx;
	var canvasWidth = objectCanvas.width;
	var canvasHeight = objectCanvas.height;
	
	var drag = false;  // Boolean draggable, for active text/image object
	var boldFont = false;
	
		// boldFont is set true/false
	var setBoldFont = function(status){ boldFont = status; }
	
		// boldFont is returned
	var getBoldFont = function(){ return boldFont; }
	
	// textInput to Array
	var textInput = function(editable){
	
				var text = $('#message').val();
				//console.log(text);
				var textLines = text.split("\n");

				for (var i = textLines.length-1; i>=0; i--) {
					
					text = textLines[i];
					textLines[i] = text;

					// text is deleted if is empty or is mere linebreak
					if(textLines[i] === "" || textLines[i] === "\n\n	"){
			
						textLines.splice(i, 1);					
					}
				}
				
				var dragBox = app.inputEdit.getDragBox();
				
				if(textLines.length >0){					

					if(editable){
					
						updateText(textLines, dragBox);
						app.inputEdit.setEditable(false);
						
						app.connection.sendUpdateObject(dragBox, 'update');							
						
					}else{
					
						prepareText(textLines);
					}
				}else{
				
					if(dragBox){
						
						app.objectStorage.deleteObject(dragBox);
						app.inputEdit.setDragBox(null);
						app.display.makeRefresh(true, app.inputEdit.getRotate());
					}
				}
				
				$('#message').val('');						
	}

		// prepare textInput to be stored in a objectCanvas text object
	var prepareText = function(textLines){
	
				var font = 'Arial';
				var fontSize = '30px';
				var fontWeight;

				if(boldFont){
					fontWeight = 'bold';
				}else{
					fontWeight = 'normal';
				}
				
				var fontColor = app[app.display.getColor()];
				objectCtx.font = fontWeight+' '+fontSize+' '+font;
				var width = 0;
				for (var i = 0; i < textLines.length; i++) {
					
					var text = textLines[i];
					var currentWidth = objectCtx.measureText(text).width;
					if( currentWidth > width) width = currentWidth;
				}
				
				var lineHeight = Math.round(objectCtx.measureText('M').width + 0.5 * objectCtx.measureText('M').width) ;
				var height = lineHeight * textLines.length;
				var fontRatio = fontSize.substring(0,2) / width;

				var x = Math.round(canvasWidth/2 - width/2);
				var y = Math.round(canvasHeight/2 - height/2 );

				var textBoxId = app.objectStorage.makeObjectId();
				
					// set the highest index for new object
				app.objectStorage.incrementObjectIndex();
				var index = app.objectStorage.getObjectIndex();
				
				app.textBox.addTextBox(x, y, width, height, textBoxId, index, textLines, font, fontSize, fontWeight, fontColor, fontRatio);
				
					// activate the new text object on the objectCanvas and show set its transformation grid
				var currentDragBox = app.objectStorage.storage[textBoxId];					
				app.inputEdit.setDragBox(currentDragBox);
				app.inputEdit.putHandle(currentDragBox);
				app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
	
		// TextBox content is updated and its transformation grid adjusted
	var updateText = function(textLines, dragBox){
				
				dragBox.textLines = textLines;

				if(boldFont){
					dragBox.fontWeight = 'bold';
				}else{
					dragBox.fontWeight = 'normal';
				}
				
				var width = 0;
				for (var i = 0; i < textLines.length; i++) {
					
					var text = textLines[i];
					objectCtx.font = dragBox.fontWeight+' '+dragBox.fontSize+' '+dragBox.font;
					var currentWidth = objectCtx.measureText(text).width;
					if( currentWidth > width) width = currentWidth;
				}
				
				dragBox.width = width;
				var lineHeight = Math.round(objectCtx.measureText('M').width + 0.5 * objectCtx.measureText('M').width) ;
				dragBox.height = lineHeight * textLines.length;
				dragBox.fontRatio = dragBox.fontSize.substring(0,2) / dragBox.width;
				
				dragBox.wRatio = dragBox.width/dragBox.height;
				dragBox.hRatio = dragBox.height/dragBox.width;
				
					//update transformation grid after text content has changed
				if(dragBox.rotation ==0 ){
					
					dragBox.widthHandle = dragBox.width;
					dragBox.heightHandle = dragBox.height;												

				}else{
					
					app.rectTransform.updateTransGrid(dragBox);
				}
				
				dragBox.fontColor = app[app.display.getColor()];
				
				app.inputEdit.setUpdateHandle(true);					
				app.inputEdit.putHandle(dragBox);
				app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
	
		//the fontSize is adjusted proportionally to the textbox-width
	var resizeText = function(dragBox){

		dragBox.fontSize = Math.round(dragBox.fontRatio * dragBox.width)+'px';
	}
	
		// text is loaded into the text area to be edited
	var editText = function(dragBox){
	
				var text='';
				for (var i = 0; i < dragBox.textLines.length; i++) {
					
					
					text += dragBox.textLines[i];//.replace(/ /g, '&nbsp;') + '\n';

				}
				$('#message').val(text);
	};
			
	return {
	
		resizeText: resizeText,
		textInput: textInput,
		editText: editText,
		updateText: updateText,
		getBoldFont: getBoldFont,
		setBoldFont: setBoldFont
	}	
})();