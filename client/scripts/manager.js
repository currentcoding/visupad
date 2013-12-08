// Manager

/*Author: Fabian Ling;

The module app.manager.js manages requests from the server to maintain the objects in the user storage and drawing canvas.

using: display, objectStorage, interfaceUpdate */

app.manager = (function(){ 

		// manger handles requests from server	
	var handle = {										
		
		draw: function(data){ app.display.draw(data.pos, data.color, data.bgBrush); },
		
		sendCanvas: function(socketId){ app.display.sendCanvas(socketId); },
		
		initCanvas: function(data){ app.display.initCanvas(data); },
		
		addObject: function(object){ app.objectStorage.serverAddObject(object); },
		
		objectUpdate: function(object){ app.objectStorage.serverUpdateObject(object); },
		
		serverDeleteObject: function(dragBoxId){ app.objectStorage.serverDeleteObject(dragBoxId); },
		
		sendObjectStorage: function(socketId){ app.objectStorage.sendObjectStorage(socketId); },
		
		serverObjectStorage: function(objectStorage){ app.objectStorage.serverObjectStorage(objectStorage); },
		
		sendObjectIndex: function(socketId){ app.objectStorage.sendObjectIndex(socketId); },
		
		serverObjectIndex: function(value){ app.objectStorage.serverObjectIndex(value); },
		
		serverBlockObject: function(data){ app.objectStorage.serverBlockObject(data); },
		
		unblockOffline: function(userName){ app.objectStorage.unblockOffline(userName); },
		
		canvasSize: function(data){ app.interfaceUpdate.updateCanvasSize(data); },
					
		newUrl: function(data){	location.hash = data.roomName; $('#share_URL').val("http://visupad.com/#"+data.roomName); app.objectStorage.setUserName(data.userName);},
		
		setClock: function(data){ app.objectStorage.setClock();},
		
		updateChat: function(data){	app.interfaceUpdate.updateChat(data); }
	}
	
	return {

		handle: handle

	}
})();
