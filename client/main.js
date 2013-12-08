// Main

/*Author: Fabian Ling;

The module main.js initiates a connection to the server, the display module and the brush loading.

using: display, connection, brushLoader */

(function(){

		// the part after the # in the URL is extracted
	var roomName = location.hash.substring(1);
	
		// initiate connection
	app.connection.init(config.server, config.port, roomName);
	
		// objectCanvas frequence is initiated
	app.display.init();	
	
		// loading brushes and colorize them
	app.brushLoader.init();
	
})();