let canvas; 
let ctx; // context
let canvasWidth = 1400;
let canvasHeight = 1000;
let keys = []; // allow for multiple, simultaneous key inputs (and manipulation)

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
	cavas = document.getElementById('my-canvas'); // get a reference to the canvas from the HTML
	ctx = canvas.getContext('2d'); // set context (used to draw stuff and work with the canvas in general)
	canvas.width = canvasWidth; // set width of canvas
	canvas.height = canvasHeight; // set height of canvas
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width, canvas.height); // 0,0 - Coordinates of rectangle; width,height - the size of the rectangle

	document.body.addEventListener("keydown", function(e) { // when user presses down
		keys[e.keyCode] = true;
	});
	document.body.addEventListener("keyup", function(e) { // when user released key
		keys[e.keyCode] = false;
	});

	Render();
}

class Ship { // ship is the user

	constructor() {
		this.visible = true;
		this.x = canvasWidth / 2;
		this.y = canvasHeight / 2;
		this.movingForward = false;
		this.speed = 0.1;
		this.velX = 0;
		this.velY = 0;
		this.rotateSpeed = 0.001;
		this.radius = 15;
		this.angle = 0;
		this.strokeColor = 'white';
	}
}

let ship = new Ship(); // creates a new ship object

// draws and updates all positions of shapes on the screen
function Render() {

}