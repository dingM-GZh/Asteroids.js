let canvas;
let ctx; // context
let canvasWidth = 1400;
let canvasHeight = 1000;
let keys = []; // allow for multiple, simultaneous key inputs (and manipulation)
let ship;
let bullets = []; // array to hold bullets
let asteroids = []; // array to hold asteroids
//let shapeSize = 3;

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
	canvas = document.getElementById('my-canvas'); // get a reference to the canvas from the HTML
	ctx = canvas.getContext('2d'); // set context (used to draw stuff and work with the canvas in general)
	canvas.width = canvasWidth; // set width of canvas
	canvas.height = canvasHeight; // set height of canvas
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width, canvas.height); // 0,0 - Coordinates of rectangle; width,height - the size of the rectangle

	ship = new Ship();

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
		this.radius = 15; // size of the ship
		this.angle = 0;
		this.strokeColor = 'white';

		// where bullet comes out
		this.noseX = canvasWidth / 2 + 15; //this.radius;
		this.noseY = canvasHeight;
	}

	Rotate(dir) { // rotating the ship
		this.angle += (this.rotateSpeed * dir);
	}

	Update() {
		let radians = this.angle / Math.PI * 180; // current direction that ship is facing

		if (this.movingForward) {
			// oldX + cos(radians) * distance
			this.velX += Math.cos(radians) * this.speed;
			// oldY + sin(radians) * distance
			this.velY += Math.sin(radians) * this.speed;
		}

		// if ship goes out of bounds of the screen
		if (this.x < this.radius) {
			this.x = canvas.width;
		}
		if (this.y < this.radius) {
			this.y = canvas.height;
		}
		if (this.x > canvas.width) {
			this.x = this.radius;
		}
		if (this.y > canvas.height) {
			this.y = this.radius;
		}
		// simulates the ship slowing down (when key is not being pressed)
		this.velX *= 0.99;
		this.velY *= 0.99;

		// changing value of X and Y (air friction)
		this.x -= this.velX;
		this.y -= this.velY;
	}

	Draw() {
		ctx.strokeStyle = this.strokeColor;
		ctx.beginPath(); // starts a brand new drawing of lines
		let vertAngle = ((Math.PI * 2) / 3); // calculates angles between the vertices of the ship
		let radians = this.angle / Math.PI * 180; // changes degrees to radians

		this.noseX = this.x - this.radius * Math.cos(radians);
		this.noseY = this.y - this.radius * Math.sin(radians);

		for (let i = 0; i < 3; i++) { // cycle through points of the triangle

			ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians),
					   this.y - this.radius * Math.sin(vertAngle * i + radians));
		}

		ctx.closePath();
		ctx.stroke();
	}
}

class Bullet {
	constructor(angle) { // angle of ship is passed as argument
		this.visible = true;
		this.x =
	}
}

// draws and updates all positions of shapes on the screen
function Render() {
	ship.movingForward = (keys[87]); // 87 is w
	if (keys[68]) { // 68 is d
		ship.Rotate(1);
	}
	if (keys[65]) { // 65 is a
		ship.Rotate(-1);
	}
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	ship.Update();
	ship.Draw();
	requestAnimationFrame(Render);
}
