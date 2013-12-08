// Upload

/*Author: Fabian Ling;

The module app.upload.js provides image uploads. It checks file type and data size and prepares the data to be stored as imageBox.

using: inputEdit, display, objectStorage  */

app.upload = (function(){

	var reader = new FileReader();
	var objectCanvas = app.display.objectCanvas;	
	var objectCtx = app.display.objectCtx;
	var canvasWidth = objectCanvas.width;
	var canvasHeight = objectCanvas.height;
	
		// reading data of upload and create an image object
	var uploadImage = function(e, uploadTechnique){
	
				var file;
				var isFile = false;
				
				if(uploadTechnique === "drop"){

					file = e.dataTransfer.files[0];
					
					isFile = true;
						// if the input is an url
					if(!file){ 
					
						isFile = false;
						
						var input = e.dataTransfer.getData('text/html');

							// filter src from HTML-URL
						var patt=/src\s*=\s*"(.+?)"/;

						var source = patt.exec(input);
						
						createImage(source[1], "fromUrl");
					}
				}
				
				if(uploadTechnique === "button"){
					
					file = e.target.files[0];
					isFile = true;
				}

				if(isFile && checkFile(file)){

					reader.readAsDataURL( file );
	
					reader.onloadend = function(){
				
						var source = this.result;

						createImage(source, uploadTechnique);									
					}	
				}
	}	
	
		// checking file type and file size
	var checkFile = function(file) {
	
				var legalTypes = ["image/png", "image/jpeg", "image/gif"];
			  
				if(legalTypes.indexOf(file.type) === -1) {
				
					alert("Please only upload image files!");
					return false;
				}

				if(file.size > app.maxFileSize){
					
						// clock position
					$('#clock').css({"position": "absolute","left": $('#canvas_container').width() /2 - 30, "top": $('#canvas_container').height() /2 - 30}).fadeIn();
					
						// inform user about resize
					var data = { userName: "@"+app.objectStorage.getUserName(), data: "Your image is being resized."}
					app.interfaceUpdate.updateChat(data);
					
					reader.readAsDataURL( file );
	
					reader.onloadend = function(){
				
						var source = this.result;

						resizeImage(source);
						
							//hide loading clock.gif
						$('#clock').fadeOut();
					}
					return false;
				}
				
				return true;
	}
	
	var resizeImage = function(source){
	
					var img = new Image();					
				
					img.src = source;	

					img.onload = function() {
					
						var width;
						var height;
					
						if(img.width > img.height){
						
							width = img.width / (img.width/app.resizeWidth);
							height = img.height / (img.width/app.resizeWidth);
						}else{
						
							width = img.width / (img.height/app.resizeWidth);
							height = img.height / (img.height/app.resizeWidth);
						}

						var resizeCanvas = document.createElement('canvas');
						resizeCanvas.width = width;
						resizeCanvas.height = height;
						var resizeCtx = resizeCanvas.getContext('2d');
	
						resizeCtx.drawImage(img, 0, 0, width, height);
						var resizeCanvasURL = resizeCanvas.toDataURL('image/jpeg', '0.1');					

					
						width = img.width / (img.width/app.initialImageSize);
						height = img.height / (img.width/app.initialImageSize);
						
						var resizeImg = new Image();					
				
						resizeImg.src = resizeCanvasURL;	
						
						resizeImg.onload = function() {
						
							var imgBoxId = app.objectStorage.makeObjectId();
						
								// set the highest index for new object
							app.objectStorage.incrementObjectIndex();
							var index = app.objectStorage.getObjectIndex();
							
							app.imgBox.addImgBox( app.inputEdit.getMouse().mouseX, app.inputEdit.getMouse().mouseY, width, height, imgBoxId, index, resizeImg, resizeCanvasURL);
							app.inputEdit.setObjectSelectable(true);
							$(".tool").removeClass("tool_active"); 
							$("#cross").addClass("tool_active"); 
							$('#brush_options').hide();
							$('#text_options').hide();
							$('#color_bar').hide();
							$('#image_options').show();
						}						
						
					}						
	}
	
	var createImage = function(source, origin){
	
					var img = new Image();
					
					if(origin === "fromUrl") img.crossOrigin = "anonymous";			

					var x = app.inputEdit.getMouse().mouseX;
					var y = app.inputEdit.getMouse().mouseY;
					
					
					
					img.onload = function() {
						
						var width = img.width / (img.width/app.initialImageSize);
						var height = img.height / (img.width/app.initialImageSize);
						
						if(origin === "button"){
					
							x = $('#canvas_container').width()/2 - width/2;
							y = $('#canvas_container').height()/2 - height/2;
						}
						
						var imgBoxId = app.objectStorage.makeObjectId();
						
							// set the highest index for new object
						app.objectStorage.incrementObjectIndex();
						var index = app.objectStorage.getObjectIndex();
						
						app.imgBox.addImgBox( x, y, width, height, imgBoxId, index, img, img.src);
						app.inputEdit.setObjectSelectable(true);
						$(".tool").removeClass("tool_active"); 
						$("#cross").addClass("tool_active"); 
						$('#brush_options').hide();
						$('#text_options').hide();
						$('#color_bar').hide();
						$('#image_options').show();
					}
					img.src = source;	
	}
	
	return {
		uploadImage: uploadImage
	}
})();
