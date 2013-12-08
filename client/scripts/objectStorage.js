// ObjectStorage

/*Author: Fabian Ling;

The module app.objectStorage.js manages synchronisation of text and image objects with the server.
Taking care of: init, index, deletes, updates, blocking

using: textEdit, display, connection, inputEdit, textBox, imgBox */
	
app.objectStorage = (function(){

		// holds all textBoxes/images
	var storage = {}; 
		
		// holds userName as unique id for objects 
	var userName;
	
		// holds the order of the object by index
	var objectIndex = 0;
	
		// return userName
	var getUserName = function(){ return userName; }
	
		// set userName
	var setUserName = function(name){ userName = name; }
	
		// return objectIndex
	var getObjectIndex = function(){ return objectIndex; }
	
		// increments index for objects with every click
	var incrementObjectIndex  = function(){ objectIndex++; }
	
		// receive current objectStorage of the room from server
	var serverObjectStorage = function(objectStorage){

				for(var key in objectStorage) {
					
					serverAddObject(objectStorage[key]);
				}								
	};
	
		// send current storage to new client
	var sendObjectStorage = function(socketId){ 	
				
					// return if nothing is in storage to send
				if(Object.keys(storage).length == 0) return;

					// tell new client to set a clock.gif
				app.connection.send('setClock', socketId); 				
	
				var storageExport = {}; 
				
				for(var key in storage) {
					
					var object = storage[key];
					var objectUpdate = object;

						// if image object, the JavaScript image object inside the object has to be excluded
						// because it is too complex and cannot be sent 
					if(objectUpdate.source){					

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

					}						
		
					storageExport[objectUpdate.id] = objectUpdate;
				}
				
				var msg = { objectStorage: storageExport, socketId: socketId };
				
				app.connection.send('objectStorage', msg); 
	}		
	
		// send current objectIndex to new client
	var sendObjectIndex = function(socketId){ 
	
				var msg = { objectIndex: objectIndex, socketId: socketId };
				
				app.connection.send('objectIndex', msg); 
	}
	
		// server can set objectIndex
	var serverObjectIndex = function(value){
		objectIndex = value; 	
		app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
	
		// add an text or image object
	var addObject = function(object){				

				storage[object.id] = object;	
				app.connection.sendUpdateObject(object, "new");					
	}
	
		// server adds an text or image object
	var serverAddObject = function(object){	
	
					// check if this object is already in store
				if(!(object.id in storage)){
				

						// check if it is an textObject
					if(object.font){
						
						if(object.index >objectIndex) objectIndex = object.index;
						var tb = app.textBox.addTextBox(object.x, object.y, object.width, object.height, object.id, object.index, object.textLines, object.font, object.fontSize, object.fontWeight, object.fontColor, object.fontRatio);							
						storage[object.id].rotation = object.rotation;							
						
						app.display.makeRefresh(true, app.inputEdit.getRotate());
						
							// hide clock
						$('#clock').fadeOut();														
					}
				
						// check if it is an imgObject
					if(object.source){
					
						var imgObject = new Image();						
						
						imgObject.onload = function() {

							if(object.index >objectIndex) objectIndex = object.index;
							
							var img = new app.imgBox.imgBox(object.x, object.y, object.width, object.height, object.id, object.index, imgObject, object.source);							
							img.rotation = object.rotation;							
							storage[object.id] = img;	

							app.display.makeRefresh(true, app.inputEdit.getRotate());
							
								// hide clock
							$('#clock').fadeOut();								
								
						}
						
						imgObject.src = object.source;
					}
				}
	}
	
		// delete an text or image object
	var deleteObject = function(dragBox){
				
					// inform server 
				app.connection.send('deleteObject', dragBox.id);
				
				delete storage[dragBox.id]; 
				app.display.makeRefresh(true, app.inputEdit.getRotate());
				app.inputEdit.setEditable(false);
				$('#message').val('');	
	}
	
		// delete an text or image object by the server
	var serverDeleteObject = function(dragBoxId){
	
				if(app.inputEdit.getDragBox() && app.inputEdit.getDragBox().id == dragBoxId) app.inputEdit.setDragBox(null);
				if(storage[dragBoxId]) delete storage[dragBoxId]; 
				app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
	
		// objects in storage are updated by the server
	var serverUpdateObject = function(object){
	
				var objectUpdate = object.objectUpdate;
				
				if(objectUpdate.id in storage){
				
					objectIndex = objectUpdate.index;
				
					var localObject = storage[objectUpdate.id];

					localObject.x = objectUpdate.x;
					localObject.y = objectUpdate.y;
					localObject.width = objectUpdate.width;
					localObject.height = objectUpdate.height;
					localObject.rotation = objectUpdate.rotation;
					localObject.index = objectUpdate.index;

					localObject.xHandle = objectUpdate.xHandle;
					localObject.yHandle = objectUpdate.yHandle;
					localObject.widthHandle = objectUpdate.widthHandle;
					localObject.heightHandle = objectUpdate.heightHandle;
					localObject.rotationHandle = objectUpdate.rotationHandle;
					
						// check if it is an text object and update text features
					if(localObject.font){
					
						localObject.textLines = objectUpdate.textLines;
						localObject.font = objectUpdate.font;
						localObject.fontSize = objectUpdate.fontSize;
						localObject.fontWeight = objectUpdate.fontWeight;							
						localObject.fontColor = objectUpdate.fontColor;
						localObject.fontRatio = objectUpdate.fontRatio;
						
						app.textEdit.resizeText(localObject);
				
					}else{
							// if it is an image object, check if update is needed to sw colors
						if(!localObject.sw){

							if(objectUpdate.sw) app.filter.swFilter(localObject);	
						}
					}
					app.inputEdit.setDragBox(null);
					app.display.makeRefresh(true, app.inputEdit.getRotate());
				}
	}
	
		// block/unblocks an object for user users
	var blockObject = function(object){
					
					var block = { block: object.block, id: object.id};
					app.connection.send('blockObject', block);
	}	
	
		// server blocks an object
	var serverBlockObject = function(object){
	
					storage[object.id].block = object.block;
					
					if(app.inputEdit.getDragBox() == storage[object.id]) app.inputEdit.setDragBox(null);
					app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
	
		// server unblocks objects of users that went offline while blocking
	var unblockOffline = function(userName){
	
					for(var key in storage) {
						
							if( storage[key].block === userName){
								
								storage[key].block = null;
							}
						}
						
					app.display.makeRefresh(true, app.inputEdit.getRotate());
	}
	
		// create an unique id for the object
	var makeObjectId = function(){
		
		var id = (Date.now().toString() + userName + Math.random().toString());

		return id;
	}
	
		// show clock, when init data is coming from server
	var setClock = function(){
	
			// clock position
		$('#clock').css({"position": "absolute","left": $('#canvas_container').width() /2 - 30, "top": $('#canvas_container').height() /2 - 30}).fadeIn();
	}
	
	return {		
	
		deleteObject: deleteObject,
		addObject: addObject,
		serverAddObject: serverAddObject,
		serverUpdateObject: serverUpdateObject,
		serverDeleteObject: serverDeleteObject,
		makeObjectId: makeObjectId,
		storage: storage,
		setUserName: setUserName,
		getUserName: getUserName,
		getObjectIndex: getObjectIndex,
		serverObjectIndex: serverObjectIndex,
		sendObjectStorage: sendObjectStorage,
		serverObjectStorage: serverObjectStorage,
		sendObjectIndex: sendObjectIndex,
		incrementObjectIndex: incrementObjectIndex,
		blockObject: blockObject,
		serverBlockObject: serverBlockObject,
		unblockOffline: unblockOffline,
		setClock:setClock
	}
})();
