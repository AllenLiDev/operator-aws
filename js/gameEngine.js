//******************************************************************//
/*                    CANVAS/RENDERING CODE                        */
//****************************************************************//

/*Canvas namespace and data management*/
var gameArea = {
	canvas : null,
	ctx : null,
	WIDTH : 960,
	HEIGHT : 540,
	ratioX : null,
	ratioY : null,
	entities : [],
	lastTime : null,
	gameTime : 0,
	state : 3,
	refTime : 0,
	xMouse : null,
	yMouse : null,
	difficulty : 0,
	score : 0,
	sound : true,
	init : function() {//Sets the initial gameArea, starts the game loop
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ratioX = this.canvas.width / gameArea.WIDTH;
		this.ratioY = this.canvas.height / gameArea.HEIGHT;

		gameArea.resize();

		if (detectmob()) {
			gameArea.canvas.addEventListener("touchstart", touchCollision);
			gameArea.canvas.addEventListener("touchmove", getCoords);
			gameArea.canvas.addEventListener("touchend", dropCollision);
			window.addEventListener("deviceorientation", gameArea.resize);
		} else {
			gameArea.canvas.addEventListener("click", clickCollision);
			gameArea.canvas.addEventListener("mousedown", dragCollision);
			gameArea.canvas.addEventListener("mousemove", getCoords);
			gameArea.canvas.addEventListener("mouseup", dropCollision);
			window.addEventListener("resize", gameArea.resize);
		}
		
		gameArea.entities = load.menuScreen();

		this.lastTime = Date.now();
		main();
	},
	resize : function() {//Resize the canvas to window, sets new aspect ratio
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		gameArea.ratioX = this.canvas.width / gameArea.WIDTH;
		gameArea.ratioY = this.canvas.height / gameArea.HEIGHT;
	},
	render : function() {//Canvas render cycle
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.entities.length > 0) {//Draws images
			for (var i = 0; i < this.entities.length; i++) {
				if (this.entities[i].z != 1) {
					var img = new Image();
					img.src = this.entities[i].src;
					img.width = this.entities[i].width;
					img.height = this.entities[i].height;
					img.xPos = this.entities[i].xPos;
					img.yPos = this.entities[i].yPos;
					img.index = this.entities[i].index;
					this.ctx.drawImage(img, 0, img.index * img.height, img.width, img.height, img.xPos * this.ratioX, img.yPos * this.ratioY, img.width * this.ratioX, img.height * this.ratioY);
				}
			}
		} else {
			alert("Programmer error. Empty entities list.");
		}
		if (load.strings.length > 0) {//Draws text
			this.ctx.scale(this.ratioX, this.ratioY);
			for (var i = 0; i < load.strings.length; i++) {
				this.ctx.fillStyle = load.strings[i].colour;
				this.ctx.font = load.strings[i].sizeInit + load.strings[i].font;
				this.ctx.fillText(load.strings[i].parameter, load.strings[i].xPos, load.strings[i].yPos, load.strings[i].maxWidth);
			}
			this.ctx.scale(1 / this.ratioX, 1 / this.ratioY);
		}
		for (var i = 0; i < this.entities.length; i++) {//Z-index correction loop
			if (this.entities[i].z == 1) {
				var img = new Image();
				img.src = this.entities[i].src;
				img.width = this.entities[i].width;
				img.height = this.entities[i].height;
				img.xPos = this.entities[i].xPos;
				img.yPos = this.entities[i].yPos;
				img.index = this.entities[i].index;
				this.ctx.drawImage(img, 0, img.index * img.height, img.width, img.height, img.xPos * this.ratioX, img.yPos * this.ratioY, img.width * this.ratioX, img.height * this.ratioY);
			}
		}
	}
}

/*Update cycle - frame and data manager:
- Calculate DT since last cycle
- Updates entity data
- Render images to 2D Canvas context
- Sets new refernce frame
- Restarts loop*/
function main() {
	var now = Date.now();
	var dt = (now - gameArea.lastTime) / 1000.0;

	update(dt);
	gameArea.render();

	gameArea.lastTime = now;
	window.requestAnimFrame(main);
}

//******************************************************************//
/*                          STATE LOGIC                            */
//****************************************************************//

/*Handles state logic for:
- Time Attack
- Endless Mode
- Easter Egg*/
function update(dt) {
	gameArea.gameTime += dt;

	switch(gameArea.state) {
		case 1: //time attack logic

			gameArea.refTime += dt;

			/*Naive animation update for preloading screen*/
			if (gameArea.refTime > 1 && gameArea.entities.length == 2 && gameArea.entities[1].index < gameArea.entities[1].frames - 1) {
				gameArea.refTime -= 1;
				gameArea.entities[1].index += 1;
			} else if (gameArea.refTime > 1 && gameArea.entities.length == 2 && gameArea.entities[1].index == gameArea.entities[1].frames - 1) {
				gameArea.entities = [];
				gameArea.refTime = 0;
				gameArea.entities = load.gameScreen();
				getProblem(timeAttackDifficulty(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
			} else if (load.strings.length > 0) {//loaded game logic
				for (var i = 1; i < load.strings.length; i++) {
					if (load.strings[i].parameter > 9) {
						load.strings[i].xPos = load.strings[i].xInit - (load.strings[i].maxWidth / 6);
					} else {
						load.strings[i].xPos = load.strings[i].xInit;
					}
				}

				if (gameArea.entities[3].ticks != 0) {
					gameArea.entities[3].ticks += 1;
				}
				if (gameArea.entities[3].ticks > gameArea.entities[3].ticksPer) {
					gameArea.entities[3].index = 0;
					gameArea.entities[3].ticks = 0;
				}

				if (isNaN((Math.floor(gameArea.refTime * 10) % (Math.floor(gameArea.refTime) * 10)))) {
					load.strings[0].parameter = Math.floor(gameArea.refTime) + "." + Math.floor(gameArea.refTime * 10);
				} else {
					load.strings[0].parameter = Math.floor(gameArea.refTime) + "." + (Math.floor(gameArea.refTime * 10) % (Math.floor(gameArea.refTime) * 10));
				}
				
				if (load.droppable[0].isFilled && load.droppable[1].isFilled && load.droppable[2].isFilled) {

					if (validate(load.strings[1].parameter, load.strings[2].parameter, load.strings[3].parameter, load.strings[4].parameter, load.droppable[0].parameter, load.droppable[1].parameter, load.droppable[2].parameter)) {

						gameArea.entities[3].index = 1;
						gameArea.entities[3].ticks = 1;
						gameArea.score += 1;

						if (gameArea.score == 10) {
							gameArea.entities = [];
							gameArea.state = 0;
							gameArea.entities = load.scoreScreen();
							load.strings[0].parameter = Math.floor(gameArea.refTime) + "." + (Math.floor(gameArea.refTime * 10) % (Math.floor(gameArea.refTime) * 10));
							load.strings[1].parameter = gameArea.score;
						} else {
							gameArea.entities[10].index = gameArea.score;
							getProblem(timeAttackDifficulty(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
							for (var i = 0; i < load.droppable.length; i++) {
								load.droppable[i].parameter = "";
								load.droppable[i].isFilled = false;
							}

							gameArea.entities[6].caseOp = 1;
							gameArea.entities[7].caseOp = 1;
							gameArea.entities[8].caseOp = 1;
							gameArea.entities[9].caseOp = 1;
							gameArea.entities.pop();
							gameArea.entities.pop();
							gameArea.entities.pop();
						}
					} else {

						gameArea.entities[3].index = 2;
						gameArea.entities[3].ticks = 1;

						for (var i = 0; i < load.droppable.length; i++) {
							load.droppable[i].parameter = "";
							load.droppable[i].isFilled = false;
						}

						gameArea.entities[6].caseOp = 1;
						gameArea.entities[7].caseOp = 1;
						gameArea.entities[8].caseOp = 1;
						gameArea.entities[9].caseOp = 1;
						gameArea.entities.pop();
						gameArea.entities.pop();
						gameArea.entities.pop();
						
					}
				}
			}
			break;

		case 2: //Endless logic ONLY DIFFERENCE SO FAR IS DIFFICULTY CURVE

			gameArea.refTime -= dt;

			/*Naive animation update for preloading screen*/
			if (load.strings.length > 0) {
				for (var i = 1; i < load.strings.length; i++) {
					if (load.strings[i].parameter > 9) {
						load.strings[i].xPos = load.strings[i].xInit - (load.strings[i].maxWidth / 6);
					} else {
						load.strings[i].xPos = load.strings[i].xInit;
					}
				}

				if (gameArea.entities[3].ticks != 0) {
					gameArea.entities[3].ticks += 1;
				}
				if (gameArea.entities[3].ticks > gameArea.entities[3].ticksPer) {
					gameArea.entities[3].index = 0;
					gameArea.entities[3].ticks = 0;
				}



				load.strings[0].parameter = load.strings[0].parameter = Math.floor(gameArea.refTime) + "." + (Math.floor(gameArea.refTime * 10) % (Math.floor(gameArea.refTime) * 10));
				if (load.droppable[0].isFilled && load.droppable[1].isFilled && load.droppable[2].isFilled) {

					if (validate(load.strings[1].parameter, load.strings[2].parameter, load.strings[3].parameter, load.strings[4].parameter, load.droppable[0].parameter, load.droppable[1].parameter, load.droppable[2].parameter)) {

						gameArea.entities[3].index = 1;
						gameArea.entities[3].ticks = 1;
						gameArea.score += 1;

						gameArea.entities[10].index = gameArea.score;
						getProblem(difficultyCurve(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
						for (var i = 0; i < load.droppable.length; i++) {
							load.droppable[i].parameter = "";
							load.droppable[i].isFilled = false;
						}

						gameArea.entities[6].caseOp = 1;
						gameArea.entities[7].caseOp = 1;
						gameArea.entities[8].caseOp = 1;
						gameArea.entities[9].caseOp = 1;
						gameArea.entities.pop();
						gameArea.entities.pop();
						gameArea.entities.pop();
					} else {

						gameArea.entities[3].index = 2;
						gameArea.entities[3].ticks = 1;

						for (var i = 0; i < load.droppable.length; i++) {
							load.droppable[i].parameter = "";
							load.droppable[i].isFilled = false;
						}

						gameArea.entities[6].caseOp = 1;
						gameArea.entities[7].caseOp = 1;
						gameArea.entities[8].caseOp = 1;
						gameArea.entities[9].caseOp = 1;
						gameArea.entities.pop();
						gameArea.entities.pop();
						gameArea.entities.pop();
						
					}
				}

				if (gameArea.refTime <= 0) {
					gameArea.entities = [];
					gameArea.state = 0;
					gameArea.entities = load.scoreScreen();
					load.strings[0].parameter = ((Math.floor(gameArea.refTime * 10) / 10));
					load.strings[1].parameter = gameArea.score;
				}
			} else if (gameArea.refTime < 0 && gameArea.entities.length == 2 && gameArea.entities[1].index == 2) {//Pre-load screen
				gameArea.entities = [];
				gameArea.entities = load.gameScreen();
				gameArea.refTime = 60;
				getProblem(difficultyCurve(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
			} else if (gameArea.refTime < 1 && gameArea.entities.length == 2 && gameArea.entities[1].index == 1) {//Pre-load screen
				gameArea.entities[1].index += 1;
			} else if (gameArea.refTime < 2 && gameArea.entities.length == 2 && gameArea.entities[1].index == 0) {//Pre-load screen
				gameArea.entities[1].index += 1;
			}

			break;

		case 3://Easter egg menu logic

			if (load.clickable[6].state && load.clickable[7].state && load.clickable[8].state && load.clickable[9].state) {
				gameArea.state = 0;
				var rng = Math.floor((Math.random() * 5) + 1);
				gameArea.entities = [];
				gameArea.entities = load.easterScreen(rng);
			}
			break;

		default: //null logic
	}

	handleInput(dt);
}

//******************************************************************//
/*                       SCREEN LOADER                             */
//****************************************************************//

/*"Load" sets the stage for the scene and stores
the scene data for:
images, hit boxes, draggable items,
drop zones, and strings*/
var load = {
	entities : [],
	clickable : [],
	droppable : [],
	strings : [],
	score : [],
	clear : function() {//Clears current game data.
		load.entities = [];
		load.clickable = [];
		load.droppable = [];
		load.strings = [];
		load.score = [];
	},
	menuScreen : function() {//Loads menu screen objects
		load.clear();

		var background = {
			src : "./assets/menuAssets/background.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var staticImage = new Image();
		staticImage = {
			src : "./assets/menuAssets/staticBackground.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var timeAtkImage = new Image();
		timeAtkImage = {
			src : "./assets/menuAssets/timeAttackButton.png",
			width : 480,
			height : 130,
			xPos : 0,
			yPos : 270,
			index: 0
		}

		var timeAtkBox = {
			xMin : 20,
			yMin : 270,
			xMax : 475,
			yMax : 390,
			/*Loads pre-game screen and starts time attack*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.entities = load.preGameScreen();
				gameArea.state = 1;
			}
		}
		
		var endlessImage = new Image();
		endlessImage = {
			src : "./assets/menuAssets/endlessButton.png",
			width : 480,
			height : 130,
			xPos : 480,
			yPos : 270,
			index: 0
		}

		var endlessBox = {
			xMin : 485,
			yMin : 270,
			xMax : 940,
			yMax : 390,
			/*Loads pre-game screen and starts endless mode*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.entities = load.preGameScreen();
				gameArea.state = 2;
				gameArea.refTime = 3;
			}
		}
		
		var audioImage = new Image();
		audioImage = {
			src : "./assets/menuAssets/audioButton.png",
			width : 126,
			height : 126,
			xPos : 834,
			yPos : 0,
			index: (function() {
				if (gameArea.sound) {
					return 0;
				} else {
					return 1;
				}
			})(),
			frames: 2
		}

		var audioBox = {
			xMin : 846,
			yMin : 25,
			xMax : 926,
			yMax : 105,
			/*Sets the audio state to on or off*/
			clicked : function() {
				if (gameArea.sound) {
					gameArea.entities[4].index = 1;
					gameArea.sound = false;
				} else {
					gameArea.entities[4].index = 0;
					gameArea.sound = true;
				}
			}
		}

		var leaderImage = new Image();
		leaderImage = {
			src : "./assets/menuAssets/leaderButton.png",
			width : 329,
			height : 140,
			xPos : 631,
			yPos : 400,
			index: 0
		}

		var leaderBox = {
			xMin : 640,
			yMin : 400,
			xMax : 940,
			yMax : 520,
			/*Loads leader screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 0;
				gameArea.entities = load.leaderScreen();
			}
		}

		var guideImage = new Image();
		guideImage = {
			src : "./assets/menuAssets/guideButton.png",
			width : 300,
			height : 140,
			xPos : 331,
			yPos : 400,
			index: 0
		}

		var guideBox = {
			xMin : 331,
			yMin : 400,
			xMax : 631,
			yMax : 520,
			/*Load guide screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 0;
				gameArea.entities = load.guideScreen();
			}
		}

		var settingImage = new Image();
		settingImage = {
			src : "./assets/menuAssets/settingButton.png",
			width : 331,
			height : 140,
			xPos : 0,
			yPos : 400,
			index: 0
		}

		var settingBox = {
			xMin : 20,
			yMin : 400,
			xMax : 320,
			yMax : 520,
			/*Loads settings screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 0;
				gameArea.entities = load.settingScreen();
			}
		}

		var symbolAdd = {
			xMin : 348,
			yMin : 174,
			xMax : 413,
			yMax : 243,
			state : false,
			/*Clickable operator addition*/
			clicked : function(){
				if (load.clickable[8].state) {
					load.clickable[6].state = true;
				} else {
					load.clickable[9].state = false;
					load.clickable[8].state = false;
					load.clickable[7].state = false;
					load.clickable[6].state = false;
				}
			}
		}

		var symbolMinus = {
			xMin : 414,
			yMin : 174,
			xMax : 479,
			yMax : 243,
			state : false,
			/*Clickable operator subtraction*/
			clicked : function(){
				if (load.clickable[6].state) {
					load.clickable[7].state = true;
				}
			}
		}

		var symbolMulti = {
			xMin : 480,
			yMin : 174,
			xMax : 545,
			yMax : 243,
			state : false,
			/*Clickable operator multiplication*/
			clicked : function(){
				if (load.clickable[9].state) {
					load.clickable[8].state = true;
				} else {
					load.clickable[9].state = false;
					load.clickable[8].state = false;
					load.clickable[7].state = false;
					load.clickable[6].state = false;
				}
			}
		}

		var symbolDivide = {
			xMin : 546,
			yMin : 174,
			xMax : 611,
			yMax : 243,
			state : false,
			/*Clickable operator division*/
			clicked : function(){
				load.clickable[9].state = true;
				load.clickable[8].state = false;
				load.clickable[7].state = false;
				load.clickable[6].state = false;
			}
		}

		load.entities.push(background, staticImage, timeAtkImage, endlessImage, audioImage, leaderImage, guideImage, settingImage);
		load.clickable.push(timeAtkBox, endlessBox, audioBox, leaderBox, guideBox, settingBox, symbolAdd, symbolMinus, symbolMulti, symbolDivide);

		return load.entities;
	},
	easterScreen : function(comicNum) {//Loads menu screen objects
		load.clear();

		var background = new Image();
		background = {
			src : "./assets/menuAssets/background.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var staticImage = new Image();
		staticImage = {
			src : "./assets/menuAssets/staticBackground.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var timeAtkImage = new Image();
		timeAtkImage = {
			src : "./assets/menuAssets/timeAttackButton.png",
			width : 480,
			height : 130,
			xPos : 0,
			yPos : 270,
			index: 0
		}
		
		var endlessImage = new Image();
		endlessImage = {
			src : "./assets/menuAssets/endlessButton.png",
			width : 480,
			height : 130,
			xPos : 480,
			yPos : 270,
			index: 0
		}
		
		var audioImage = new Image();
		audioImage = {
			src : "./assets/menuAssets/audioButton.png",
			width : 126,
			height : 126,
			xPos : 834,
			yPos : 0,
			index: (function() {
				if (gameArea.sound) {
					return 0;
				} else {
					return 1;
				}
			})(),
			frames: 2
		}

		var leaderImage = new Image();
		leaderImage = {
			src : "./assets/menuAssets/leaderButton.png",
			width : 329,
			height : 140,
			xPos : 631,
			yPos : 400,
			index: 0
		}

		var guideImage = new Image();
		guideImage = {
			src : "./assets/menuAssets/guideButton.png",
			width : 300,
			height : 140,
			xPos : 331,
			yPos : 400,
			index: 0
		}

		var settingImage = new Image();
		settingImage = {
			src : "./assets/menuAssets/settingButton.png",
			width : 331,
			height : 140,
			xPos : 0,
			yPos : 400,
			index: 0
		}

		var exitEaster = {
			xMin : 0,
			yMin : 0,
			xMax : 960,
			yMax : 540,
			/*Exit easter egg*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 3;
				gameArea.entities = load.menuScreen();
			}
		}
		
		switch (comicNum) {
			case 1:
				var easterImage = new Image();
				easterImage = {
					src : "./assets/menuAssets/easter1.jpg",
					width : 540,
					height : 540,
					xPos : 210,
					yPos : 0,
					index: 0
				}
				break;
			case 2:
				var easterImage = new Image();
				easterImage = {
					src : "./assets/menuAssets/easter2.jpg",
					width : 424,
					height : 540,
					xPos : 268,
					yPos : 0,
					index: 0
				}
				break;
			case 3:
				var easterImage = new Image();
				easterImage = {
					src : "./assets/menuAssets/easter3.png",
					width : 600,
					height : 524,
					xPos : 180,
					yPos : 8,
					index: 0
				}
				break;
			case 4:
				var easterImage = new Image();
				easterImage = {
					src : "./assets/menuAssets/easter4.jpg",
					width : 428,
					height : 540,
					xPos : 267,
					yPos : 0,
					index: 0
				}
				break;
			case 5:
				var easterImage = new Image();
				easterImage = {
					src : "./assets/menuAssets/easter5.jpg",
					width : 937,
					height : 299,
					xPos : 11.5,
					yPos : 120,
					index: 0
				}
				break;
		}

		load.entities.push(background, staticImage, timeAtkImage, endlessImage, audioImage, leaderImage, guideImage, settingImage, easterImage);
		load.clickable.push(exitEaster);

		return load.entities;
	},
	preGameScreen : function() {//Loads pre-game screen objects
		load.clear();

		var background = new Image();
		background = {
			src : "./assets/preGameAssets/pregame.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var countSprite = new Image();
		countSprite = {
			src : "./assets/preGameAssets/countdown.png",
			width : 170,
			height : 231,
			xPos : 395,
			yPos : 210,
			index : 0,
			frames : 3
		}

		load.entities.push(background, countSprite);

		return load.entities;
	},
	gameScreen : function() {//Load game screen objects
		load.clear();

		var background = new Image();
		background = {
			src : "./assets/gameAssets/background.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var gameBorderImage = new Image();
		gameBorderImage = {
			src : "./assets/gameAssets/gameBorderImage.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var cardsImage = new Image();
		cardsImage = {
			src : "./assets/gameAssets/cardsImage.png",
			width : 920,
			height : 224,
			xPos : 20,
			yPos : 208,
			index: 0,
			frames : 3,
			ticks : 0,
			ticksPer : 130
		}

		var quitImage = new Image();
		quitImage = {
			src : "./assets/gameAssets/quitImage.png",
			width : 220,
			height : 208,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var quitBox = {
			xMin : 20,
			yMin : 20,
			xMax : 220,
			yMax : 110,
			/*Loads menu screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 3;
				gameArea.refTime = 0;
				gameArea.score = 0;
				gameArea.entities = load.menuScreen();
			}
		}

		var skipImage = new Image();
		skipImage = {
			src : "./assets/gameAssets/skipImage.png",
			width : 220,
			height : 208,
			xPos : 740,
			yPos : 0,
			index: 0
		}

		var plusOperator = new Image();
		plusOperator = {
			src : "./assets/gameAssets/plusOperator.png",
			width : 80,
			height : 80,
			xPos : 260,
			yPos : 449,
			xInit : 260,
			yInit : 449,
			index : 0,
			xMin : 260,
			yMin : 449,
			xMax : 340,
			yMax : 529,
			caseOp : 1,
			isDraggable : true,
			isClicked : false,
			parameter : " + ",
			z : 1,
			drop : function() {
				window["plusOp" + this.caseOp] = {
					src : "./assets/gameAssets/plusOperator.png",
					width : 80,
					height : 80,
					index : 0,
					position : 0
				}
				gameArea.entities.push(window["plusOp" + this.caseOp]);
				this.caseOp += 1;
			}
		}
		
		var minusOperator = new Image();
		minusOperator = {
			src : "./assets/gameAssets/minusOperator.png",
			width : 80,
			height : 80,
			xPos : 380,
			yPos : 449,
			xInit : 380,
			yInit : 449,
			index : 0,
			xMin : 380,
			yMin : 449,
			xMax : 460,
			yMax : 529,
			caseOp : 1,
			isDraggable : true,
			isClicked : false,
			parameter : "-",
			z : 1,
			drop : function() {
				window["minusOp" + this.caseOp] = {
					src : "./assets/gameAssets/minusOperator.png",
					width : 80,
					height : 80,
					index : 0,
					position : 0
				}
				gameArea.entities.push(window["minusOp" + this.caseOp]);
				this.caseOp += 1;
			}
		}

		var multiOperator = new Image();
		multiOperator = {
			src : "./assets/gameAssets/multiOperator.png",
			width : 80,
			height : 80,
			xPos : 500,
			yPos : 449,
			xInit : 500,
			yInit : 449,
			index : 0,
			xMin : 500,
			yMin : 449,
			xMax : 580,
			yMax : 529,
			caseOp : 1,
			isDraggable : true,
			isClicked : false,
			parameter : "*",
			z : 1,
			drop : function() {
				window["multiOp" + this.caseOp] = {
					src : "./assets/gameAssets/multiOperator.png",
					width : 80,
					height : 80,
					index : 0,
					position : 0
				}
				gameArea.entities.push(window["multiOp" + this.caseOp]);
				this.caseOp += 1;
			}
		}

		var divOperator = new Image();
		divOperator = {
			src : "./assets/gameAssets/divOperator.png",
			width : 80,
			height : 80,
			xPos : 620,
			yPos : 449,
			xInit : 620,
			yInit : 449,
			index : 0,
			xMin : 620,
			yMin : 449,
			xMax : 700,
			yMax : 529,
			caseOp : 1,
			isDraggable : true,
			isClicked : false,
			parameter : "/",
			z : 1,
			drop : function() {
				window["divOp" + this.caseOp] = {
					src : "./assets/gameAssets/divOperator.png",
					width : 80,
					height : 80,
					index : 0,
					position : 0
				}
				gameArea.entities.push(window["divOp" + this.caseOp]);
				this.caseOp += 1;
			}
		}

		var firstDrop = {
			xMin : 200,
			yMin : 278,
			xMax : 280,
			yMax : 358,
			isFilled : false,
			parameter : "",
			position : 1
		}

		var secondDrop = {
			xMin : 440,
			yMin : 278,
			xMax : 520,
			yMax : 358,
			isFilled : false,
			parameter : "",
			position : 2
		}

		var thirdDrop = {
			xMin : 680,
			yMin : 278,
			xMax : 760,
			yMax : 358,
			isFilled : false,
			parameter : "",
			position : 3
		}

		var timerString = {
			font : "px Digital7",
			sizeInit : 140,
			xPos : 368,
			yPos : 175,
			parameter : gameArea.refTime,
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var card1 = {
			font : "px Calibri",
			sizeInit : 200,
			xPos : 67,
			xInit : 67,
			yPos : 378,
			parameter : 0,
			maxWidth : 141,
			colour : "#FFFFFF"
		}

		var card2 = {
			font : "px Calibri",
			sizeInit : 200,
			xPos : 307,
			xInit : 307,
			yPos : 378,
			parameter : 0,
			maxWidth : 141,
			colour : "#FFFFFF"
		}

		var card3 = {
			font : "px Calibri",
			sizeInit : 200,
			xPos : 548,
			xInit : 548,
			yPos : 378,
			parameter : 0,
			maxWidth : 141,
			colour : "#FFFFFF"
		}

		var card4 = {
			font : "px Calibri",
			sizeInit : 200,
			xPos : 788,
			xInit : 788,
			yPos : 378,
			parameter : 0,
			maxWidth : 141,
			colour : "#FFFFFF"
		}

		load.entities.push(background, gameBorderImage, scoreImage, cardsImage, quitImage, skipImage, plusOperator, minusOperator, multiOperator, divOperator);
		load.clickable.push(quitBox);
		load.droppable.push(firstDrop, secondDrop, thirdDrop);
		load.strings.push(timerString, card1, card2, card3, card4);

		switch (gameArea.state) {
			case 1:
				var score = new Image();
				score = {
					src : "./assets/gameAssets/progress.png",
					width : 198,
					height : 32,
					xPos : 491,
					yPos : 30,
					index: 0,
					frames: 11
				}

				var scoreImage = new Image();
				scoreImage = {
					src : "./assets/gameAssets/scoreboard.png",
					width : 439,
					height : 178,
					xPos : 260,
					yPos : 20,
					index: 0
				}

				var skipBox = {
					xMin : 740,
					yMin : 20,
					xMax : 940,
					yMax : 110,
					/*Loads new problem and resets operators*/
					clicked : function() {
						getProblem(timeAttackDifficulty(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
						for (var i = 0; i < load.droppable.length; i++) {
							if (load.droppable[i].isFilled) {
								gameArea.entities.pop();
							}
							load.droppable[i].parameter = "";
							load.droppable[i].isFilled = false;
						}

						gameArea.entities[6].caseOp = 1;
						gameArea.entities[7].caseOp = 1;
						gameArea.entities[8].caseOp = 1;
						gameArea.entities[9].caseOp = 1;
					}
				}

				load.entities[2] = scoreImage;
				load.entities.push(score);
				load.clickable.push(skipBox);
				break;

			case 2:

				var scoreImage = new Image();
				scoreImage = {
					src : "./assets/gameAssets/scoreImage.png",
					width : 520,
					height : 208,
					xPos : 215,
					yPos : 0,
					index: 0
				}

				var skipBox = {
					xMin : 740,
					yMin : 20,
					xMax : 940,
					yMax : 110,
					/*Loads new problem and resets operators*/
					clicked : function() {
						getProblem(timeAttackDifficulty(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
						for (var i = 0; i < load.droppable.length; i++) {
							if (load.droppable[i].isFilled) {
								gameArea.entities.pop();
							}
							load.droppable[i].parameter = "";
							load.droppable[i].isFilled = false;
						}

						gameArea.entities[6].caseOp = 1;
						gameArea.entities[7].caseOp = 1;
						gameArea.entities[8].caseOp = 1;
						gameArea.entities[9].caseOp = 1;
					}
				}

				load.entities[2] = scoreImage;
				load.clickable.push(skipBox);
				break;

			default:
		}

		return load.entities;

	},
	settingScreen : function() {//Load settings screen objects
		load.clear();

		var background = new Image();
		background = {
			src : "./assets/menuAssets/background.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var border = new Image();
		border = {
			src : "./assets/settingsAssets/border.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var quitImage = new Image();
		quitImage = {
			src : "./assets/gameAssets/quitImage.png",
			width : 220,
			height : 208,
			xPos : 0,
			yPos : 0,
			index: 0

		}

		var quitBox = {
			xMin : 20,
			yMin : 20,
			xMax : 220,
			yMax : 110,
			/*Loads menu screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 3;
				gameArea.entities = load.menuScreen();
			}
		}

		var settingsTitle = new Image();
		settingsTitle = {
			src : "./assets/settingsAssets/settingsLabel.png",
			width : 392,
			height : 110,
			xPos : 284,
			yPos : 48,
			index : 0
		}

		var difficultyWindow = new Image();
		difficultyWindow = {
			src : "./assets/settingsAssets/difficultyWindow.png",
			width : 365,
			height : 180,
			xPos : 84,
			yPos : 225,
			index : 0
		}

		var difficultyOptions = new Image();
		difficultyOptions = {
			src : "./assets/settingsAssets/difficultyOptions.png",
			width : 280,
			height : 68,
			xPos : 130,
			yPos : 325,
			index: (function() {
				if (gameArea.difficulty == 1) {
					return 1
				} else {
					return 0;
				}
			})(),
			frames: 2
		}

		var easyBox = {
			xMin : 116,
			yMin : 326,
			xMax : 246,
			yMax : 390,
			/*Enables easy mode*/
			clicked : function() {
				if (gameArea.difficulty == 1) {
					gameArea.entities[5].index -= 1;
					gameArea.difficulty = 0;
				}
			}
		}

		var hardBox = {
			xMin : 284,
			yMin : 326,
			xMax : 410,
			yMax : 390,
			/*Enable hard mode*/
			clicked : function() {
				if (gameArea.difficulty == 0) {
					gameArea.entities[5].index +=1;
					gameArea.difficulty = 1;
				}
			}
		}


		var audioWindow = new Image();
		audioWindow = {
			src : "./assets/settingsAssets/audioWindow.png",
			width : 365,
			height : 180,
			xPos : 515,
			yPos : 225,
			index : 0
		}

		var audioOptions = new Image();
		audioOptions = {
			src : "./assets/settingsAssets/audioOptions.png",
			width : 280,
			height : 68,
			xPos : 563,
			yPos : 325,
			index: (function() {
				if (gameArea.sound) {
					return 0;
				} else {
					return 1;
				}
			})(),
			frames: 2
		}

		var onBox = {
			xMin : 576,
			yMin : 326,
			xMax : 676,
			yMax : 390,
			isClicked : true,
			/*Enable sound*/
			clicked : function() {
				if (!gameArea.sound) {
					gameArea.sound = true;
					gameArea.entities[7].index = 0;
					//code needs to be here one day
				}
			}
		}

		var offBox = {
			xMin : 713,
			yMin : 326,
			xMax : 813,
			yMax : 390,
			isClicked : false,
			/*Disable sound*/
			clicked : function() {
				if (gameArea.sound) {
					gameArea.sound = false;
					gameArea.entities[7].index = 1;
				}
			}
		}


		load.entities.push(background, border, quitImage, settingsTitle, difficultyWindow, difficultyOptions, audioWindow, audioOptions);
		load.clickable.push(quitBox, easyBox, hardBox, onBox, offBox);

		return load.entities;

	},
	leaderScreen : function() {//Loads leader screen objects
		load.clear();
		load.score = getScores(5);

		var background = new Image();
		background = {
			src : "./assets/leaderboardAssets/leaderboard.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var quitImage = new Image();
		quitImage = {
			src : "./assets/gameAssets/quitImage.png",
			width : 220,
			height : 208,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var quitBox = {
			xMin : 20,
			yMin : 20,
			xMax : 220,
			yMax : 110,
			/*Loads menu screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 3;
				gameArea.entities = load.menuScreen();
			}
		}

		var easyTime1 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 105,
			yPos : 241,
			parameter : load.score[0][0] + " " + load.score[1][0],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyTime2 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 105,
			yPos : 292,
			parameter : load.score[0][1] + " " + load.score[1][1],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyTime3 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 105,
			yPos : 344,
			parameter : load.score[0][2] + " " + load.score[1][2],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyTime4 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 105,
			yPos : 396,
			parameter : load.score[0][3] + " " + load.score[1][3],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyTime5 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 105,
			yPos : 448,
			parameter : load.score[0][4] + " " + load.score[1][4],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardTime1 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 285,
			yPos : 241,
			parameter : load.score[2][0] + " " + load.score[3][0],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardTime2 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 285,
			yPos : 292,
			parameter : load.score[2][1] + " " + load.score[3][1],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardTime3 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 285,
			yPos : 344,
			parameter : load.score[2][2] + " " + load.score[3][2],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardTime4 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 285,
			yPos : 396,
			parameter : load.score[2][3] + " " + load.score[3][3],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardTime5 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 285,
			yPos : 448,
			parameter : load.score[2][4] + " " + load.score[3][4],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyMara1 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 555,
			yPos : 241,
			parameter : load.score[4][0] + " " + load.score[5][0],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyMara2 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 555,
			yPos : 292,
			parameter : load.score[4][1] + " " + load.score[5][1],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyMara3 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 555,
			yPos : 344,
			parameter : load.score[4][2] + " " + load.score[5][2],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyMara4 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 555,
			yPos : 396,
			parameter : load.score[4][3] + " " + load.score[5][3],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var easyMara5 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 555,
			yPos : 448,
			parameter : load.score[4][4] + " " + load.score[5][4],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardMara1 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 735,
			yPos : 241,
			parameter : load.score[6][0] + " " + load.score[7][0],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardMara2 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 735,
			yPos : 292,
			parameter : load.score[6][1] + " " + load.score[7][1],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardMara3 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 735,
			yPos : 344,
			parameter : load.score[6][2] + " " + load.score[7][2],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardMara4 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 735,
			yPos : 396,
			parameter : load.score[6][3] + " " + load.score[7][3],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		var hardMara5 = {
			font : "px Calibri",
			sizeInit : 22,
			xPos : 735,
			yPos : 448,
			parameter : load.score[6][4] + " " + load.score[7][4],
			maxWidth : 304,
			colour : "#5C5C5C"
		}

		load.entities.push(background, quitImage);
		load.clickable.push(quitBox);
		load.strings.push(easyTime1, easyTime2, easyTime3, easyTime4, easyTime5, hardTime1, hardTime2, hardTime3, hardTime4, hardTime5, easyMara1, easyMara2, easyMara3, easyMara4, easyMara5, hardMara1, hardMara2, hardMara3, hardMara4, hardMara5);

		return load.entities;

	},
	guideScreen : function() {//Loads guide screen objects
		load.clear();

		var background = new Image();
		background = {
			src : "./assets/guideAssets/guide.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var quitImage = new Image();
		quitImage = {
			src : "./assets/gameAssets/quitImage.png",
			width : 220,
			height : 208,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var quitBox = {
			xMin : 20,
			yMin : 20,
			xMax : 220,
			yMax : 110,
			/*Loads menu screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.state = 3;
				gameArea.entities = load.menuScreen();
			}
		}

		load.entities.push(background, quitImage);
		load.clickable.push(quitBox);

		return load.entities;
	},
	scoreScreen : function() {//Loads score screen objects
		load.clear();

		var background = new Image();
		background = {
			src : "./assets/scoreAssets/timeAttackScore.png",
			width : 960,
			height : 540,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var replayImage = new Image();
		replayImage = {
			src : "./assets/scoreAssets/replay.png",
			width : 200,
			height : 90,
			xPos : 740,
			yPos : 20,
			index: 0
		}

		var replayBox = {
			xMin : 740,
			yMin : 20,
			xMax : 940,
			yMax : 110,
			/*Reloads pre-game screen and game mode*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.refTime = 0;
				gameArea.score = 0;
				gameArea.state = 1;
				gameArea.entities = load.preGameScreen();
			}
		}

		var submitImage = new Image();
		submitImage = {
			src : "./assets/scoreAssets/submit.png",
			width : 300,
			height : 67,
			xPos : 330,
			yPos : 413,
			index: 0
		}

		var quitImage = new Image();
		quitImage = {
			src : "./assets/gameAssets/quitImage.png",
			width : 220,
			height : 208,
			xPos : 0,
			yPos : 0,
			index: 0
		}

		var quitBox = {
			xMin : 20,
			yMin : 20,
			xMax : 220,
			yMax : 110,
			/*Loads menu screen*/
			clicked : function() {
				gameArea.entities = [];
				gameArea.refTime = 0;
				gameArea.score = 0;
				gameArea.state = 3;
				gameArea.entities = load.menuScreen();
			}
		}

		var finalTime = {
			font : "px Calibri",
			sizeInit : 50,
			xPos : 527,
			yPos : 203,
			parameter : "",
			maxWidth : 141,
			colour : "#5C5C5C"
		}

		var completed = {
			font : "px Calibri",
			sizeInit : 50,
			xPos : 527,
			yPos : 261,
			parameter : "",
			maxWidth : 141,
			colour : "#5C5C5C"
		}

		load.entities.push(background, replayImage, submitImage, quitImage);
		load.clickable.push(quitBox, replayBox);
		load.strings.push(finalTime, completed);

		return load.entities;
	}
}

//******************************************************************//
/*                         INPUT CONTROLLER                        */
//****************************************************************//

/*Returns x and y coordinates of mouse or touch events*/
function getCoords(event) {
	if (detectmob()) {
		gameArea.xMouse = parseInt(event.changedTouches[0].clientX);
		gameArea.yMouse = parseInt(event.changedTouches[0].clientY);
	} else {
		gameArea.xMouse = event.clientX;
		gameArea.yMouse = event.clientY;
	}
}

/*Checks if mouse coordinates are within a hit box range*/
function clickCollision() {
	var xCoord = gameArea.xMouse;
	var yCoord = gameArea.yMouse;

	for (var i = 0; i < load.clickable.length; i++) {
		if (load.clickable[i].xMin * gameArea.ratioX <= xCoord && load.clickable[i].xMax * gameArea.ratioX >= xCoord && load.clickable[i].yMin * gameArea.ratioY <= yCoord && load.clickable[i].yMax * gameArea.ratioY >= yCoord) {
			load.clickable[i].clicked();
		}
	}
}

/*Checks if mouse coordinates are within draggable objects range*/
function dragCollision() {
	var xCoord = gameArea.xMouse;
	var yCoord = gameArea.yMouse;

	for (var i = 0; i < gameArea.entities.length; i++) {
		if (gameArea.entities[i].xMin * gameArea.ratioX <= xCoord && gameArea.entities[i].xMax * gameArea.ratioX >= xCoord && gameArea.entities[i].yMin * gameArea.ratioY <= yCoord && gameArea.entities[i].yMax * gameArea.ratioY >= yCoord && gameArea.entities[i].isDraggable) {
			gameArea.entities[i].isClicked = true;
		}
	}
}

/*Compacts drag collision and click collision
for touch events*/
function touchCollision(event) {
	getCoords(event);
	var xCoord = gameArea.xMouse;
	var yCoord = gameArea.yMouse;

	if (load.clickable.length > 0) {
		for (var i = 0; i < load.clickable.length; i++) {
			if (load.clickable[i].xMin * gameArea.ratioX <= xCoord && load.clickable[i].xMax * gameArea.ratioX >= xCoord && load.clickable[i].yMin * gameArea.ratioY <= yCoord && load.clickable[i].yMax * gameArea.ratioY >= yCoord) {
				load.clickable[i].clicked();
			}
		}
	}
	
	for (var i = 0; i < gameArea.entities.length; i++) {
		if (gameArea.entities[i].xMin * gameArea.ratioX <= xCoord && gameArea.entities[i].xMax * gameArea.ratioX >= xCoord && gameArea.entities[i].yMin * gameArea.ratioY <= yCoord && gameArea.entities[i].yMax * gameArea.ratioY >= yCoord && gameArea.entities[i].isDraggable) {
			gameArea.entities[i].isClicked = true;
		}
	}
}

/*Detects drop collision with drag object by breaking the object into
quads. This does not account for larger drag objects than hit boxes.*/
function dropCollision() {
	for (var i = 0; i < gameArea.entities.length; i++) {
		if (gameArea.entities[i].isClicked) {
			for (var d = 0; d < load.droppable.length; d++) {
				if ((((gameArea.entities[i].xPos * gameArea.ratioX) >= (load.droppable[d].xMin * gameArea.ratioX)
					&& (gameArea.entities[i].xPos * gameArea.ratioX) <= (load.droppable[d].xMax * gameArea.ratioX)
					&& ((gameArea.entities[i].yPos + gameArea.entities[i].height) * gameArea.ratioY) >= (load.droppable[d].yMin * gameArea.ratioY)
					&& ((gameArea.entities[i].yPos + gameArea.entities[i].height) * gameArea.ratioY) <= (load.droppable[d].yMax * gameArea.ratioY))
					|| (((gameArea.entities[i].xPos + gameArea.entities[i].width) * gameArea.ratioX) >= (load.droppable[d].xMin * gameArea.ratioX)
					&& ((gameArea.entities[i].xPos + gameArea.entities[i].width) * gameArea.ratioX) <= (load.droppable[d].xMax * gameArea.ratioX)
					&& ((gameArea.entities[i].yPos + gameArea.entities[i].height) * gameArea.ratioY) >= (load.droppable[d].yMin * gameArea.ratioY)
					&& ((gameArea.entities[i].yPos + gameArea.entities[i].height) * gameArea.ratioY) <= (load.droppable[d].yMax * gameArea.ratioY))
					|| ((gameArea.entities[i].yPos * gameArea.ratioY) >= (load.droppable[d].yMin * gameArea.ratioY)
					&& (gameArea.entities[i].yPos * gameArea.ratioY) <= (load.droppable[d].yMax * gameArea.ratioY)
					&& ((gameArea.entities[i].xPos + gameArea.entities[i].width) * gameArea.ratioX) >= (load.droppable[d].xMin * gameArea.ratioX)
					&& ((gameArea.entities[i].xPos + gameArea.entities[i].width) * gameArea.ratioX) <= (load.droppable[d].xMax * gameArea.ratioX))
					|| ((gameArea.entities[i].xPos * gameArea.ratioX) >= (load.droppable[d].xMin * gameArea.ratioX)
					&& (gameArea.entities[i].xPos * gameArea.ratioX) <= (load.droppable[d].xMax * gameArea.ratioX)
					&& (gameArea.entities[i].yPos * gameArea.ratioY) >= (load.droppable[d].yMin * gameArea.ratioY)
					&& (gameArea.entities[i].yPos * gameArea.ratioY) <= (load.droppable[d].yMax * gameArea.ratioY)))
					&& gameArea.entities[i].isClicked) {

					

					if (load.droppable[d].isFilled) {
						for (var pos = 0; pos < gameArea.entities.length; pos++) {
							if (load.droppable[d].position == gameArea.entities[pos].position) {
								gameArea.entities.splice(pos, 1);
								gameArea.entities[i].drop();
								gameArea.entities[gameArea.entities.length - 1].xPos = load.droppable[d].xMin;
								gameArea.entities[gameArea.entities.length - 1].yPos = load.droppable[d].yMin;
								gameArea.entities[gameArea.entities.length - 1].position = load.droppable[d].position;
								gameArea.entities[i].xPos = gameArea.entities[i].xInit;
								gameArea.entities[i].yPos = gameArea.entities[i].yInit;
								gameArea.entities[i].isClicked = false;
								load.droppable[d].parameter = gameArea.entities[i].parameter;
								load.droppable[d].isFilled = true;
							}
						}
					} else {
						gameArea.entities[i].drop();
						gameArea.entities[gameArea.entities.length - 1].xPos = load.droppable[d].xMin;
						gameArea.entities[gameArea.entities.length - 1].yPos = load.droppable[d].yMin;
						gameArea.entities[gameArea.entities.length - 1].position = load.droppable[d].position;
						gameArea.entities[i].xPos = gameArea.entities[i].xInit;
						gameArea.entities[i].yPos = gameArea.entities[i].yInit;
						gameArea.entities[i].isClicked = false;
						load.droppable[d].parameter = gameArea.entities[i].parameter;
						load.droppable[d].isFilled = true;
					}
				}
			}
			if (gameArea.entities[i].isClicked) {
				gameArea.entities[i].xPos = gameArea.entities[i].xInit;
				gameArea.entities[i].yPos = gameArea.entities[i].yInit;
				gameArea.entities[i].isClicked = false;
			}
		}
	}
}

/*Handles draggable location on click*/
function handleInput(dt) {
	for (var i = 0; i < gameArea.entities.length; i++) {
		if (gameArea.entities[i].isClicked) {
			gameArea.entities[i].xPos = (gameArea.xMouse / gameArea.ratioX) - (gameArea.entities[i].width / 2);
			gameArea.entities[i].yPos = (gameArea.yMouse / gameArea.ratioY) - (gameArea.entities[i].height / 2);
		}
	}
}

//******************************************************************//
/*                       ACCESSIBILITY CODE                        */
//****************************************************************//

/*Request animation frame shim for accessibility*/
window.requestAnimFrame = (function() {
return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

/*Returns boolean based on if mobile device*/
function detectmob() { 
	if( navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i)
	){
		return true;
	}
	else {
		return false;
	}
}

//******************************************************************/
/*                         SERVER API                             */
//****************************************************************/

/*
getProblem(int difficulty, int hard).
Server script for pulling problems sets
@param difficulty integer from 1 to 5.
@param hard 1 for 1-13, 0 for 1-9
@return array containing the card numbers
*/
function getProblem(difficulty, hard) {
    var cards = [];
    $.ajax({
        async: true,
        type: "GET",
        url: "getProblem.php",
        dataType: "json",
        data: {difficulty: difficulty, hard: hard},
        success: function(data) {
        	callback(data);
        }
    });
}

/*On AJAX success, calls this function
to feed the data into the card data*/
function callback(data) {
	load.strings[1].parameter = data.card1;
	load.strings[2].parameter = data.card2;
	load.strings[3].parameter = data.card3;
	load.strings[4].parameter = data.card4;
}

/*Validates the problem set and operators in BEDMAS order*/
function validate(c1, c2, c3, c4, op1, op2, op3) {
    var string = c1 + op1 + c2 + op2 + c3 + op3 + c4;
    if (eval(string) == 24) {
        return true;
    }
    return false;
}

/*
timeAttackDifficulty(int problemNum, boolean hard)
@param problemNum problem number
@param hard true is hard, false is easy
@return difficulty for problem number
*/
function timeAttackDifficulty(problemNum, hard) {
    var difficulty = 1;
    var twoPoint = 2;
    var threePoint = 5;
    var fourPoint = 9;
    var fivePoint = 11;
    if (hard) {
        twoPoint = 1;
        threePoint = 3;
        fourPoint = 5;
        fivePoint = 8;
    }
    if (problemNum >= fivePoint) {
        difficulty = 5;
    } else if (problemNum >= fourPoint) {
        difficulty = 4;
    } else if (problemNum >= threePoint) {
        difficulty = 3;
    } else if (problemNum >= twoPoint) {
        difficulty = 2;
    }
    return difficulty;
}

/*
genDifficulty(double average, double spread)
helper function
@param average average difficulty
@param spread +- this amount
@return random difficulty
*/
function genDifficulty(average, spread) {
    var min = average - spread;
    var max = average + spread;
    var rng = Math.random();
    var addThing = rng * spread;
    var difficulty = min + addThing;
    difficulty = Math.round(difficulty);
    difficulty = Math.min(difficulty, 5);
    difficulty = Math.max(difficulty, 1);
    return difficulty;
}

/*
difficultyCurve(int problemNum, boolean hard)
@param problemNum problem number
@param hard true is hard, false is easy
@return random difficulty
*/
function difficultyCurve(problemNum, hard) {
    var exponent = 0.45;
    var upperBound = 4.5;
    if (hard) {
        exponent = 0.5;
        upperBound = 4.75
    }
    var average = Math.pow(problemNum, exponent);
    average = Math.min(average, upperBound);
    var difficulty = genDifficulty(average, 0.5);
    return difficulty;
}

/*
getScores(int limit).
retrieves top x scores for time attack
@limit the number of scores to retrieve
@return array with names and scores.
TIME ATTACK IS SORTED BY TIME IN ASCENDING ORDER
MARATHON IS SORTED BY SCORE IN DESCENDING ORDER
INDEX NUMBER
0: Time Attack Easy Names
1: Time Attack Easy Scores
2: Time Attack Hard Names
3: Time Attack Hard Scores
4: Marathon Easy Names
5: Marathon Easy Scores
6: Marathon Hard Names
7: Marathon Hard Scores
*/
function getScores(limit) {
    var namesTimeEasy;
    var namesTimeHard;
    var scoresTimeEasy;
    var scoresTimeHard;
    var namesMarathonEasy;
    var namesMarathonHard;
    var scoresMarathonEasy;
    var scoresMarathonHard;
    $.ajax({
        async: false,
        type: "GET",
        url: "getScores.php",
        dataType: "json",
        data: {limit: limit},
        success: function(data) {
            namesTimeEasy = data.namesTimeEasy;
            scoresTimeEasy = data.scoresTimeEasy;
            namesTimeHard = data.namesTimeHard;
            scoresTimeHard = data.scoresTimeHard;
            namesMarathonEasy = data.namesMarathonEasy;
            scoresMarathonEasy = data.scoresMarathonEasy;
            namesMarathonHard = data.namesMarathonHard;
            scoresMarathonHard = data.scoresMarathonHard;
        }
    });
    return [namesTimeEasy, scoresTimeEasy, namesTimeHard, scoresTimeHard,
        namesMarathonEasy, scoresMarathonEasy, namesMarathonHard, scoresMarathonHard];
}