let canvas;
let ctx; // context
let canvasWidth = 1400;
let canvasHeight = 1000;
let keys = []; // allow for multiple, simultaneous key inputs (and manipulation)
let ship;
let bullets = []; // array to hold bullets
let asteroids = []; // array to hold asteroids
let score = 0;
let lives = 3;
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

	for (let i = 0; i < 8; i++) {
		asteroids.push(new Asteroid());
	}

	document.body.addEventListener("keydown", function(e) { // when user presses down
		keys[e.keyCode] = true;
	});
	document.body.addEventListener("keyup", function(e) { // when user released key
		keys[e.keyCode] = false;
		if (e.keyCode === 32) {
			bullets.push(new Bullet(ship.angle));
		}
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

		// location where bullet spawns
		this.noseX = canvasWidth / 2 + 15; //this.radius;
		this.noseY = canvasHeight / 2;
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

		// where bullets are drawn from
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
		this.x = ship.noseX;
		this.y = ship.noseY;
		this.angle = angle;
		this.height = 4;
		this.width = 4;
		this.speed = 5;
		this.velX = 0;
		this.velY = 0;
	}

	Update() {
		let radians = this.angle / Math.PI * 180; // converting angle from degrees to radians
		this.x -= Math.cos(radians) * this.speed;
		this.y -= Math.sin(radians) * this.speed;
	}
	
	Draw() {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class Asteroid {
	constructor(x, y, radius, level, collisionRadius) {
		this.visible = true;
		this.x = x || Math.floor(Math.random() * canvasWidth); // rotating down the x-position of the asteroid
		this.y = y || Math.floor(Math.random() * canvasHeight);
		this.speed = 6;
		this.radius = radius || 50;
		this.angle = Math.floor(Math.random() * 359);
		this.strokeColor = 'white';

		this.collisionRadius = collisionRadius || 46;
		this.level = level || 1; // determines size of asteroid: 1 - largest, 2 - intermediate, 3 - smallest
	}

	Update() {
		let radians = this.angle / Math.PI * 180;
		this.x += Math.cos(radians) * this.speed;
		this.y += Math.sin(radians) * this.speed;

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
	}

	Draw() {
		ctx.beginPath();
		let vertAngle = ((Math.PI * 2) / 6);
		let radians = this.angle / Math.PI * 180;

		for (let i = 0; i < 6; i++) { // cycle through points of the triangle
			ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians),
				this.y - this.radius * Math.sin(vertAngle * i + radians));
		}

		ctx.closePath();
		ctx.stroke();
	}
}

function CircleCollision(p1x, p1y, r1, p2x, p2y, r2) {
	let radiusSum = r1 + r2;
	let xDiff = p1x - p2x;
	let yDiff =  p1y - p2y;
	//radiusSum = r1 + r2;
	//xDiff = p1x - p2x;
	//yDiff = p1y - p2y;
	if (radiusSum > Math.sqrt(xDiff * xDiff + Math.pow(yDiff, 2))) {
		return true;
	}
	else {
		return false;
	}
}

function DrawLifeShips() {
	let startX = 1350;
	let startY = 10;
	let points = [[9,9], [-9,9]];
	ctx.strokeStyle = 'white';

	for (let i = 0; i < lives; i++) {
		ctx.beginPath(); // begins drawing
		ctx.moveTo(startX, startY); //  drawing at origin point

		for (let j = 0; j < points.length; j++) {
			ctx.lineTo(startX + points[j][0], startY + points[j][1]);
		}

		ctx.closePath();
		ctx.stroke();
		startX -= 30;
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
	ctx.fillStyle = 'white';
	ctx.font = '21px Arial';
	ctx.fillText('SCORE: ' + score.toString(), 20, 35);
	if (lives <= 0) {
		ship.visible = false;
		ctx.fillStyle =  'white';
		ctx.font = '50px Arial';
		ctx.fillText('GAME OVER', canvasWidth / 2 - 150 , canvasWidth / 2 - 150);
	}

	DrawLifeShips();

	if (asteroids.length > 0 ) { // checking if ship collides with asteroid
		for (let i = 0; i < asteroids.length; i++) {
			if (CircleCollision(ship.x, ship.y, 11, asteroids[i].x, asteroids[i].y, asteroids[i].collisionRadius)) {
				// can add explosion (uses same approach as code for bullets, except change it to starting from the center)
				ship.x = canvasWidth / 2;
				ship.y = canvasHeight / 2;
				ship.velX = 0;
				ship.velY = 0;
				lives -= 1;
			}
		}
	}

	if (asteroids.length > 0 && bullets.length > 0) { // checking for bullet collision with asteroid
loop1:
		for (let i = 0; i < asteroids.length; i++) {
			for (let j = 0; j < bullets.length; j++) {
				if (CircleCollision(bullets[j].x, bullets[j].y, 3, asteroids[i].x, asteroids[i].y, asteroids[i].collisionRadius)) {
					// insert HW of deleting bullets from the array (if bullet goes off screen)
					if (asteroids[i].level === 1) {
						asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y - 5), 25, 2, 22);
						asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y + 5), 25, 2, 22);
					}
					else if (asteroids[i] === 2) {
						asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y - 5), 15, 3, 12);
						asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y + 5), 15, 3, 12);
					}
					asteroids.splice(i , 1);
					bullets.splice(j, 1);
					score += 20;
					break loop1;
				}
			}
		}
	}

	if (ship.visible) {
		ship.Update();
		ship.Draw();
	}

	if (bullets.length !== 0) {
		for (let i = 0; i < bullets.length; i++) {
			bullets[i].Update();
			bullets[i].Draw();
		}
	}

	if (asteroids.length !== 0) {
		for (let i = 0; i < asteroids.length; i++) {
			asteroids[i].Update();
			asteroids[i].Draw(i);
		}
	}

	requestAnimationFrame(Render);
}
