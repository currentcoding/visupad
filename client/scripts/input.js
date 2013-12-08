// Input

/*Author: Fabian Ling;

The module app.input.js provides eventListeners for user input.
The input is send to inputEdit or to the Server.

using: manager, inputEdit, upload, connection  */

var manager = app.manager;
	var canvas = app.display.canvas;

	// part of upload an image via drag&drop
document.body.addEventListener('dragover', function ( e ) {

	e.stopPropagation();
	e.preventDefault();
});


	// upload an image via drag&drop
document.body.addEventListener('drop', function ( e ) {

	e.stopPropagation();
	e.preventDefault();

	app.upload.uploadImage(e, "drop"); 				
});
	
	// upload an image via button       
document.getElementById("files").addEventListener("change", function ( e ){

	app.upload.uploadImage(e, "button");	
	document.getElementById("files").value = "";
});

	// mousedown is handled 
canvas.addEventListener('mousedown', function(e) {  app.inputEdit.mouseDown(e, "mouse"); }, 0);

	// mousemove is handled 
canvas.addEventListener('mousemove', function(e) { app.inputEdit.mouseMove(e, "mouse"); }, 0);

	// mouseup is handled 
canvas.addEventListener('mouseup', function() { app.inputEdit.mouseUp();}, 0);

	// doubleclick make selected text oject editable
canvas.addEventListener('dblclick', function(){ app.inputEdit.dblClick(); });


//------------------ touch events ------------------------//


	// touch devices like iPad or AndroidPads are detected
if ( 'ontouchstart' in window ) handleTouch();

	// eventListeners for touch events are added, touch input is treated like mouse input
function handleTouch() {

		canvas.addEventListener('touchstart', start);
		function start(e){ app.inputEdit.mouseDown(e, "touch"); touchDefautls(e); }

		canvas.addEventListener('touchmove', move );
		function move(e){ app.inputEdit.mouseMove(e, "touch"); touchDefautls(e); }
		
		canvas.addEventListener('touchend', end );
		function end(e){ app.inputEdit.mouseUp(e,"touch"); touchDefautls(e); }
		
		canvas.addEventListener('touchcancel', cancel );
		function cancel(e){ touchDefautls(e); }
		
		canvas.addEventListener('touchleave', leave );
		function leave(e){ touchDefautls(e); }
}
	
	// stop detecting touch input
function touchDefautls(e){
		
		e.preventDefault();
		e.stopPropagation();
}
