// Configuration

/*Author: Fabian Ling;

The module config.js holds configuration data and declares the namespace of the application*/

window.config = {

	server		: 'http://localhost:',
	port		: 4000
};

// Namespace

window.app = {
	
	interval: 50,
	minBoxSize: 30,
	scrollbarSize: 18,
	offset: 4,
	
	handleColor: 'grey',
	handleStroke: 2,
	iconOffset: 2,
	transIconSize: 20,
	rotateIconSize: 26,
	deleteIconSize: 16,
	
	initialImageSize: 100, // width of image object after upload
	maxFileSize: 105000,
	resizeWidth: 500,
	resizeFactor: 0.6,
	leftContainerWidth: 250,
	footerHeight: 40,
	belowRectangularityCCW: -70,
	aboveRectangularityCCW: -110,
	belowRectangularityCW: -250,
	aboveRectangularityCW: -290,
	
	yellow: 'rgb(230,170,30)',
	red: 'rgb(210,88,61)',
	green: 'rgb(137,156,63)',
	baby: 'rgb(117,165,167)',
	blue: 'rgb(31,88,132)',
	black: 'rgb(20,20,20)',
	
	pencilWidth: 3.5,
	brushWidth: 24
	
};
