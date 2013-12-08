// TextBox

/*Author: Fabian Ling;

The module app.textBox.js provides an object that inherits from app.rect.js and can store text data.
An textBox can check if it includes certain coordinates and it can draw itself.

using: objectStorage, rect, display  */
	
app.textBox = (function(){
	
	var objectCanvas = app.display.objectCanvas;	
	var objectCtx = app.display.objectCtx;
	
		// text object
	var textBox = function(x, y, width, height, id, index, textLines, font, fontSize, fontWeight, fontColor, fontRatio) {
	
		app.rect.rect.call(this, x, y, width, height, id, index); // Apply Box function logic to new TextBox object

		this.textLines = textLines;
		this.font = font;
		this.fontSize = fontSize;
		this.fontWeight = fontWeight;
		this.fontColor = fontColor;
		this.fontRatio = fontRatio;
	}
	
	
	textBox.prototype = {

		constructor: textBox,
		
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

						for (var i = 0; i < this.textLines.length; i++) {
							
							var text = this.textLines[i];
							var y = Math.round(this.y + this.height/this.textLines.length * i);
							objectCtx.fillStyle = this.fontColor;
							objectCtx.font = this.fontWeight+' '+this.fontSize+' '+this.font;
							objectCtx.textBaseline = 'top';
							objectCtx.fillText(text, -this.width/2,  -this.height/2 + (this.height/this.textLines.length * i));
						}		
						
							objectCtx.restore();
							
						}else{
						
							for (var i = 0; i < this.textLines.length; i++) {
							
							var text = this.textLines[i];
							var y = Math.round(this.y + this.height/this.textLines.length * i);
							objectCtx.fillStyle = this.fontColor;
							objectCtx.font = this.fontWeight+' '+this.fontSize+' '+this.font;
							objectCtx.textBaseline = 'top';
							objectCtx.fillText(text, this.x, y);
						}
						}
		},
		
		contains: function(xPos, yPos) {
		
			if(xPos > this.xHandle && xPos <= ((this.xHandle + this.widthHandle) ) &&
				yPos > this.yHandle && yPos <= ((this.yHandle + this.heightHandle ))) return true;					
		}
	}
	
		// creates a textbox and stores it in app.objectStorage
	var addTextBox = function(x, y, width, height, id, index, textLines, font, fontSize, fontWeight, fontColor, fontRatio) {

			var tb = new textBox(x, y, width, height, id, index, textLines, font, fontSize, fontWeight, fontColor, fontRatio);

			app.objectStorage.addObject(tb);

		}
		
		
	return {			
		
			textBox: textBox,
			addTextBox: addTextBox
		}

})();