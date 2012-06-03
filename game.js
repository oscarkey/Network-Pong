/* 
* Network Pong
* Copyright 2012 Oscar Key, Jack Yuan, Will Kochanski  
*/

/* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function(pong, undefined) {
	pong.game = {}; // create the game namespace

	var CANVAS_ID = "pongCanvas";

	var FRAME_RATE = 30;

	var canvas = undefined;
	pong.game.context = undefined;
	var timeout = undefined;

	var paddle = {
		xPos: -100,
		yPos: 50,
		width: 25,
		height: 160,
		yVel: 0,
		accel: 5,
		targetYPos: 50,
	};

	var ball = {
		xPos: 1500,
		yPos: 500,
		width: 40,
		height: 40,
		xVel: -20,
		yVel: 10,
	};

	var court = {
		width: 0,
		height: window.innerHeight,
	};

	var viewPort = {
		xPos: 0,
		width: window.innerWidth,
		height: window.innerHeight,
		leftPaddle: false,
		rightPaddle: false,
	}

	pong.game.createGame = function(screenNo, totalScreens) {
		canvas = document.getElementById(CANVAS_ID);
		pong.game.context = canvas.getContext("2d");

		// set the size of the canvas
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// set the position information
		court.width = viewPort.width * totalScreens;
		viewPort.xPos = viewPort.width * screenNo;
		if (screenNo == 0) {
			viewPort.leftPaddle = true;
			paddle.xPos = 20;
		}
		if (screenNo == (totalScreens - 1)) {
			viewPort.rightPaddle = true;
			paddle.xPos = viewPort.width - 20 - paddle.width;
		}
		
		// add a mouse listener
		document.onmousemove = function(event) {
			paddle.targetYPos = event.pageY - Math.floor(paddle.height / 2);
		}
		
		// add a key listener
		document.onkeypress = function(event) {
			// check for the space bar
			if(event.keyCode == 32) {
				launchBall();
				sendGameState();
			}
		};
	}

	pong.game.checkCompatibility = function() {
		// check we can get the canvas context, if not, return false
		if (document.getElementById(CANVAS_ID).getContext("2D")) {
			return true;
		}
		return false;
	}

	pong.game.startGame = function() {
		// reset things
		resetBall();
		// start the animation
		var timeout = Math.floor(1000 / FRAME_RATE);
		timeout = setInterval(onLoop, timeout); // should use requestAnimationFrame() when supported
		updateStateIfResponsible();
	}

	pong.game.stopGame = function() {
		clearInterval(timeout);
	}
	
	
	function playerDied() {
		// for now, just reset the ball
		resetBall();
	}
	
	function resetBall() {
		ball.xVel = 0;
		ball.yVel = 0;
		// put the ball just off the middle of the screen
		ball.xPos = court.width / 2 + 100;
		ball.yPos = court.height / 2;
	}
	
	function launchBall() {
		resetBall();
		ball.xVel = Math.floor(Math.random() * 15) + 20;
		ball.yVel = Math.floor(Math.random() * 10) + 10;
		sendGameState(); // force an update even if we are not responsible
	}
	
	
	function updateStateIfResponsible() {
		// send the state to the server if we have the ball on our screen
		if(currentlyResponsible()) {
			sendGameState();
		}
	}
	
	function currentlyResponsible() {
		// check if the ball is in our viewport, return true if it is
		if(ball.xPos > viewPort.xPos && ball.xPos < (viewPort.xPos + viewPort.width)) {
			return true;
		}
		return false;
	}
	
	function sendGameState() {
		// create a state object and send it to the server
		var state = {
			ball: ball,
		}
		pong.network.sendState(state);
	}
	
	pong.game.receiveGameState = function(state) {
		// update our game according to the state
		ball = state.ball;
	}
	

	function onLoop() {
		// update the game and the draw it
		updateGame();
		drawFrame();
	}

	function updateGame() {
		// move the ball, check it is still on the screen
		ball.xPos += ball.xVel;
		ball.yPos += ball.yVel;
		if(ball.yPos <= 0) {
			ball.yVel *= -1;
			//updateStateIfResponsible();
		}
		if((ball.yPos + ball.height) >= viewPort.height) {
			ball.yVel *= -1;
			//updateStateIfResponsible();
		}
		
		// bounce the ball off the paddle, or end the game
		if((ball.xPos < (paddle.xPos + paddle.width) && viewPort.leftPaddle) 
			|| ((ball.xPos + ball.width) > (court.width - (viewPort.width - paddle.xPos)) && viewPort.rightPaddle)) {
			// check if the paddle is in position to affect the bounce
			if((ball.yPos + ball.height) > paddle.yPos && ball.yPos < (paddle.yPos + paddle.height)) {
				ball.xVel *= -1;
				updateStateIfResponsible();
			} else {
				// report a death
				playerDied();
			}
		}
		
		// move the paddle, check it is still on the screen and not going too fast
		paddle.yVel = Math.floor((paddle.targetYPos - paddle.yPos) / paddle.accel); // move depending on the distance between the paddle and the target: the mouse
		
		paddle.yPos += paddle.yVel;
		if(paddle.yPos < 0) {
			paddle.yPos = 0;
		}
		if((paddle.yPos + paddle.height) > viewPort.height) {
			paddle.yPos = viewPort.height - paddle.height;
		}
	}

	function drawFrame() {
		var context = pong.game.context;

		// draw the background
		context.fillStyle = pong.BLACK_COLOR;
		context.fillRect(0, 0, viewPort.width, viewPort.height);

		// set the colours
		context.fillStyle = pong.GREEN_COLOR;

		// draw the paddle
		context.fillRect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);

		// draw the ball
		context.fillRect(ball.xPos - viewPort.xPos, ball.yPos, ball.width, ball.height);
	}

}(window.pong = window.pong || {}));