// Connection

/*Author: Fabian Ling;

The module app.connection.js initiated by the main.js. It contacts the server to initiate a session, 
either inside a certain user room or within a new created user room. It can send user requests to the server and receive request from the server.
Moreover it sends update of locally modified object to the server.

using: manager, objectStorage */

	
app.connection = (function(){
	
	var socket;
				
	var manager = app.manager;
	var objectStorage = app.objectStorage;
	var loading = true;

						
		// connecting with server, telling server if there is roomName stored in the URL
	var init = function(server, port, roomName){
				
				socket = io.connect(server+port);
	
				socket.on('connect', function(){

					send('init', roomName);
															
				});
				
					// incoming messages from the server
				socket.on('message', function(msg){

					//var msg = JSON.parse(msg);
					manager.handle[msg.action](msg.data);		
					
					if(loading){
							//hide loading clock.gif
						$('#clock').fadeOut();
						loading = false;
					}									
				});

	}
	
		// sending messages to the server
	var send = function(request,data){
	
				var msg = {
					
					request: request,
					data: data		
				};

				socket.emit('message', msg);
	}
	
	var sendUpdateObject = function(object, age){		
				
				var objectUpdate;
				
				if(object.source){
				
					if(age ==="new"){
						objectUpdate = {											
											id: object.id,
											x: object.x,
											y: object.y,
											width: object.width,
											height: object.height,
											rotation: object.rotation,
											index: object.index,
											source: object.source,
											xHandle: object.xHandle,
											yHandle: object.yHandle,
											widthHandle: object.widthHandle,
											heightHandle: object.heightHandle,
											rotationHandle: object.rotationHandle,						
										}
					}else{
						objectUpdate = {											
											id: object.id,
											x: object.x,
											y: object.y,
											width: object.width,
											height: object.height,
											rotation: object.rotation,
											index: object.index,
											sw: object.sw,
											
											xHandle: object.xHandle,
											yHandle: object.yHandle,
											widthHandle: object.widthHandle,
											heightHandle: object.heightHandle,
											rotationHandle: object.rotationHandle,						
										}

					}
				}else{
				
					objectUpdate = {
										id: object.id,
										x: object.x,
										y: object.y,
										width: object.width,
										height: object.height,
										rotation: object.rotation,
										index: object.index,
										
										xHandle: object.xHandle,
										yHandle: object.yHandle,
										widthHandle: object.widthHandle,
										heightHandle: object.heightHandle,
										rotationHandle: object.rotationHandle,						
								
										textLines: object.textLines,
										font: object.font,
										fontSize: object.fontSize,
										fontWeight: object.fontWeight,
										fontColor: object.fontColor,
										fontRatio: object.fontRatio
									}
				}								
				
				if(age ==="new"){
				
					send('object', objectUpdate);	
				}else{
					var data = { objectUpdate: objectUpdate, userName: objectStorage.getUserName() };
					send('objectUpdate', data);	
				}
	}
	
	
	return {
		
		init: init,
		send: send,
		sendUpdateObject: sendUpdateObject
	}
})();
