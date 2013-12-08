// InterfaceUpdate

/*Author: Fabian Ling;

The module app.interfaceUpdate.js updates the view of the interface and sends updates to the server  

using: connection, display, filter, inputEdit, textEdit*/

app.interfaceUpdate = (function(){
	
		var coversationBox = $('#conversation');
		var scrollOffset = 0;
		
		
			// sending new canvas size to the server
		var sendCanvasSize = function(width, height){
		
						var msg = { width: width, height: height };
						
						app.connection.send('canvasSize', msg); 
		}	

			// server updates canvas size
		var updateCanvasSize = function(data){
		
						app.display.setCanvasSize(data.width, data.height);
		}	

			// server updates chat
		var updateChat = function(data){
		
						coversationBox.append('<span class="bold">'+data.userName + ':</span> ' + data.data + '<br>');
						coversationBox.scrollTop(coversationBox.height() + scrollOffset);
						scrollOffset += coversationBox.height();
		}		
		

			// chosen tool is selected
		$(".tool").click(function() {

						$(".tool").removeClass("tool_active"); 
						$(this).addClass("tool_active");  
						
							// show text tool and keep colors
						if(this.id == "text"){
							
							setTextMenu();
						}
						
						if(this.id == "draw"){
							$('#brush_options').show();
							$('#text_options').hide();
							$('#image_options').hide();
							$('#color_bar').show();

							// reset draw menu

							$("#pencil").addClass("option_box_active"); 
							$("#canvas_container").css('cursor','url(\'../img/pencil_tip.png\') 3 3,auto');
							$("#eraser").removeClass("option_box_active"); 
							$("#brush").removeClass("option_box_active"); 
							app.display.setEraser(false);
							app.display.setBgBrush(false);
							app.inputEdit.setDragBox(null);
							app.display.makeRefresh(true, app.inputEdit.getRotate());
							app.inputEdit.setObjectSelectable(false);
						}

						if(this.id == "pic"){
							
							setPicMenu();
						}	

						if(this.id == "cross"){
							app.inputEdit.setObjectSelectable(true);
						}				
		});

			// show options for text editing
		var setTextMenu = function(){
						$("#canvas_container").css('cursor','auto');
						$('#color_bar').show();
						$('#text_options').css("display","block"); 
						$('#message').focus()
						$('#brush_options').hide();
						$('#image_options').hide();
						app.inputEdit.setObjectSelectable(true);
						app.inputEdit.dblClick();
		}	
		
			// show options for image editing
		var setPicMenu = function(){
						$("#canvas_container").css('cursor','auto');
						$('#brush_options').hide();
						$('#text_options').hide();
						$('#color_bar').hide();
						$('#image_options').show();
						app.inputEdit.setObjectSelectable(true); 
		}			
		
			// initially cursor looks like a pencil
		$("#canvas_container").css('cursor','url(\'../img/pencil_tip.png\') 3 3,auto');
		
			// chosen color is selected
		$(".option_box").click(function() {

						$(".option_box").removeClass("option_box_active"); 
						$(this).addClass("option_box_active"); 
						app.inputEdit.setDragBox(null);
						app.display.makeRefresh(true, app.inputEdit.getRotate());
						
						if(this.id == 'eraser'){
							$("#canvas_container").css('cursor','url(\'../img/eraser_tip.png\') 5 5,auto');
							app.display.setEraser(true);
							app.display.setBgBrush(false);
							$('#color_bar').fadeOut();
							$(".tool").removeClass("tool_active"); 
							$("#draw").addClass("tool_active"); 
							app.inputEdit.setObjectSelectable(false);
						}
						
						if(this.id == 'pencil'){
							$("#canvas_container").css('cursor','url(\'../img/pencil_tip.png\') 3 3,auto');
							app.display.setEraser(false);
							app.display.setBgBrush(false);
							$('#color_bar').show();
							$("#cross").removeClass("tool_active"); 
							$("#draw").addClass("tool_active"); 
							app.inputEdit.setObjectSelectable(false);
						}
						
						if(this.id == 'brush'){
							$("#canvas_container").css('cursor','url(\'../img/brush_tip.png\') 10 10,auto');
							app.display.setEraser(false);
							app.display.setBgBrush(true);
							$('#color_bar').show();
							$("#cross").removeClass("tool_active"); 
							$("#draw").addClass("tool_active"); 
							app.inputEdit.setObjectSelectable(false);
						}
		});

			// chosen tool option is selected
		$(".color_box").click(function() {

						$(".color_box").removeClass("color_active"); 
						$(this).addClass("color_active");   
						app.display.setColor( this.id );
						
							// if current dragBox is text, then colorize it
						if(app.inputEdit.getDragBox() && app.inputEdit.getDragBox().fontColor){
						
							app.inputEdit.getDragBox().fontColor = app[app.display.getColor()];
							app.display.makeRefresh(true, app.inputEdit.getRotate());
							app.connection.sendUpdateObject(app.inputEdit.getDragBox(), 'update');
						}
		});

			// user changes window size
		$(window).resize(function() {

						if(this.resizeTO){
						
							clearTimeout(this.resizeTO);
						}
						
						this.resizeTO = setTimeout(function() {
						
							$(this).trigger('resizeEnd');
						}, 100);
						
							// align intro_box_wrap
						var widthIntro = ($(window).width() - 250) * 0.8;
						var heightIntro = $(window).height() * 0.8;
						var xPosInro = ($(window).width() - 250 - widthIntro) / 2;
						var yPosInro = ($(window).height() - heightIntro) / 2;
						$('#intro_box_wrap').css({"left": xPosInro, "top": yPosInro, "width":widthIntro, "height":heightIntro});
						$('#intro_box_wrap_cover').css({"left": xPosInro, "top": yPosInro, "width":widthIntro, "height":heightIntro});
						var marginIntro = (widthIntro*0.8 - $('#intro_img').width() )/ 2;
						$('#intro_img').css({"margin-left":marginIntro});
						if($(window).width() < 800){
							$('#intro_box_wrap').fadeOut();
							$('#intro_box_wrap_cover').fadeOut();
							app.inputEdit.setBlockInput(false);
						}

							// clock position
						$('#clock').css({"position": "absolute","left": ($(window).width() - 250) /2 - 30, "top": $(window).height() /2 - 30});						
		});

			// only resize canvas when window scaling has ended
		$(window).bind('resizeEnd', function() {

						app.display.setCanvasContainer();
		});

			// if the client sets user name
		$('#set_name').click( function() {		
						var message = $('#name_entry').val();
						
						if(message != ""){
							message = message.substring(0,9);
							$("#name_entry").css("color","white"); 
							
							app.connection.send('setUserName', message);
						}
		});	

			// user hits enter to set name
		$('#name_entry').keypress(function(e) {
						if(e.which == 13) {
							 e.preventDefault();
							$(this).blur();
							$('#set_name').click();
						}
		});



			// user hits send chat button
		$('#chat_send').click( function() {
						var message = $('#chat_entry').val();
						$('#chat_entry').val('');

						if(message != "") app.connection.send('chat', message);
		});

			// user hits enter to send chat
		$('#chat_entry').keypress(function(e) {
						if(e.which == 13) {

							 e.preventDefault();
							$(this).blur();
							$('#chat_send').click();
							$('#chat_entry').focus()
						}
		});	
		
		$(document).ready(function() {
			
				// align intro_box_wrap
			var widthIntro = $('#canvas_container').width() * 0.8;
			var heightIntro = $('#canvas_container').height() * 0.8;
			var xPosInro = ($('#canvas_container').width() - widthIntro) / 2;
			var yPosInro = ($('#canvas_container').height() - heightIntro) / 2;
			$('#intro_box_wrap').css({"left": xPosInro, "top": yPosInro, "width":widthIntro, "height":heightIntro}).fadeIn(100);			
			$('#intro_box_wrap_cover').css({"left": xPosInro, "top": yPosInro, "width":widthIntro, "height":heightIntro}).fadeIn(100);
			var marginIntro = (widthIntro * 0.8 - heightIntro * 0.8 * 0.8 )/ 2;
			$('#intro_img').css({"margin-left":marginIntro});
			
				//block drawing functionality until infobox is inactive
			app.inputEdit.setBlockInput(true);
			
				// on click fade out intro
			$('#intro_box_wrap_cover').click(function(){ $('#intro_box_wrap_cover').fadeOut(); $('#intro_box_wrap').fadeOut(); app.inputEdit.setBlockInput(false);});
			$('#close_introbox').click(function(){ $('#intro_box_wrap_cover').fadeOut(); $('#intro_box_wrap').fadeOut(); app.inputEdit.setBlockInput(false);});

		});				
		
			// open lightbox
		$('.popup').click( function() {
		
						$('#lightbox').css("display","block");
						var x = $(window).width() / 2 - $('#info_box_wrap').width() / 2;
						var y = $(window).height() / 2 - $('#info_box_wrap').height() / 2;
						$('#info_box_wrap').css({"left": x, "top": y});
						
						if(this.id == 'invite_button'){
							$('#invite').css("display","block");
							$('#share_URL').focus();
							$('#share_URL').select();
						}
						
						if(this.id == 'new_button'){
							$('#new_board').css("display","block");
						}
						
						if(this.id == 'impress_button'){
							$('#impress_text').css("display","block");
						}

		});	
		
		
			// close lightbox
		$('#close_lightbox').click( function() {
		
						$('#lightbox').fadeOut(300);
						$('#invite').fadeOut(300);
						$('#new_board').fadeOut(300);
						$('#impress_text').fadeOut(300);
						
		});	

			// perform sw filter
		$('#make_sw').click( function() {
		
						if((app.inputEdit.getDragBox()) && (app.inputEdit.getDragBox().source))app.filter.swFilter(app.inputEdit.getDragBox());					
		});	
		
			// perform  font weight
		$('#weightButton').click( function() {
					
						if(	$('#weight').is(':checked')){

							$('#weight').prop('checked', false);
							app.textEdit.setBoldFont(false);
						}else{
							$('#weight').prop('checked', true);
							app.textEdit.setBoldFont(true);
						}
		});	
		
			// perform  font weight
		$('#weight').click( function() {
					
						$('#weightButton').click();
		});	
		

			// text input is handled
		$('#text_label').click(function() { 
		
						app.textEdit.textInput(app.inputEdit.getEditable()); 
		});		

			// merge canvases for download
		$('#download_pic').click(function() { 
		
						app.display.downloadMerge(); 
		});	
		
			// clock position
		$('#clock').css({"position": "absolute","left": $('#canvas_container').width() /2 - 30, "top": $('#canvas_container').height() /2 - 30}).fadeIn();
		
			// alert if user leaves the webpage
		window.onbeforeunload = function(e) {
			return 'Thanks for using VISUPAD! Quit now?';
		};
		
		return {
			sendCanvasSize: sendCanvasSize,
			updateCanvasSize: updateCanvasSize,
			updateChat: updateChat,
			setPicMenu: setPicMenu,
			setTextMenu: setTextMenu
		}

})();
