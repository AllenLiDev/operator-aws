//******************************************************************//
/*                          STATE LOGIC                            */
//****************************************************************//

/*Handles state logic for:
- Time Attack
- Endless Mode
- Easter Egg*/
var popup = true;
var goup = false;
var pause = 0;

function update(dt) {

	if (gameArea.entities[0].index - 0.0005 < 0) {
		gameArea.entities[0].index = 0.9995;
	}
	gameArea.entities[0].index -= 0.0005;

	switch (gameArea.state) {

		case 1: //time attack logic

			gameArea.refTime += dt;

			/*Naive animation update for preloading screen*/
			if (gameArea.refTime > 1 && gameArea.entities.length == 4 && gameArea.entities[2].index < gameArea.entities[2].frames - 1) {
				gameArea.refTime -= 1;
				gameArea.entities[2].index += 1;
				getProblem(timeAttackDifficulty(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
			/*Loads game screen, post-load screen*/
			} else if (gameArea.refTime > 1 && gameArea.entities.length == 4 && gameArea.entities[2].index == gameArea.entities[2].frames - 1) {
				gameArea.clear();
				gameArea.refTime = 0;
				gameArea.loaded = load.gameScreen();
				gameArea.parse();
			/*Loaded game logic*/
			} else if (gameArea.strings.length > 0) {
				/*Pop down flag for correct, incorrect, and achievement feedback*/
				if (gameArea.entities[11].index != gameArea.entities[11].indexInit && gameArea.entities[11].index > gameArea.entities[11].indexInit - 1 && goup == false) {
					gameArea.entities[11].index -= 0.04;
				} else if (gameArea.entities[11].index != gameArea.entities[11].indexInit) {
					if (pause != 60) {
						pause += 1;
					} else {
						goup = true;
						if (gameArea.entities[11].index + 0.04 >= gameArea.entities[11].indexInit) {
							gameArea.entities[11].index = gameArea.entities[11].indexInit;
							popup = true;
							goup = false;
							pause = 0;
						} else {
							gameArea.entities[11].index += 0.04;
						}
					}
				}

				/*Loads in new problem sets if they exist*/
				if (gameArea.strings[1].parameter != gameArea.problem[1] && gameArea.entities[3].index != 1) {
					gameArea.strings[1].parameter = gameArea.problem[1];
					gameArea.strings[2].parameter = gameArea.problem[2];
					gameArea.strings[3].parameter = gameArea.problem[3];
					gameArea.strings[4].parameter = gameArea.problem[4];
				}

				/*Updates the timer*/
				if (gameArea.refTime < 1) {
					gameArea.strings[0].parameter = Math.floor(gameArea.refTime) + "." + Math.floor(gameArea.refTime * 10);
				} else {
					gameArea.strings[0].parameter = Math.floor(gameArea.refTime) + "." + (Math.floor(gameArea.refTime * 10) % (Math.floor(gameArea.refTime) * 10));
				}

				/*Updates the text width based on number of characters*/
				for (var i = 1; i < gameArea.strings.length; i++) {
					if (gameArea.strings[i].parameter > 9) {
						gameArea.strings[i].xPos = gameArea.strings[i].xInit - (gameArea.strings[i].maxWidth / 6);
					} else {
						gameArea.strings[i].xPos = gameArea.strings[i].xInit;
					}
				}

				/*User feedback for cards animation*/
				if (gameArea.entities[3].ticks != 0) {
					gameArea.entities[3].ticks += 1;
				}

				/*Loads in the problem when the user feedback is done*/
				if (gameArea.entities[3].ticks > gameArea.entities[3].ticksPer) {
					if (gameArea.entities[3].index == 1) {
						gameArea.strings[1].parameter = gameArea.problem[1];
						gameArea.strings[2].parameter = gameArea.problem[2];
						gameArea.strings[3].parameter = gameArea.problem[3];
						gameArea.strings[4].parameter = gameArea.problem[4];
					}
					gameArea.entities[3].index = 0;
					gameArea.entities[3].ticks = 0;
					disableDrag(0); //enable drag
				}
				
				/*Response to all operators being filled*/
				if (gameArea.droppable[0].isFilled && gameArea.droppable[1].isFilled && gameArea.droppable[2].isFilled) {
					//if answer is correct
					if (validate(gameArea.strings[1].parameter, gameArea.strings[2].parameter, gameArea.strings[3].parameter, gameArea.strings[4].parameter, gameArea.droppable[0].parameter, gameArea.droppable[1].parameter, gameArea.droppable[2].parameter)) {

						popup = false;
						gameArea.entities[11].indexInit = 1;
						gameArea.entities[11].index = 1;
						gameArea.entities[11].index -= 0.02;

						sfx[3].play();
						disableDrag(1); //disable drag

						gameArea.entities[3].index = 1;

						gameArea.entities[3].ticks = 1;

						gameArea.score += 1;

						//if game complete
						if (gameArea.score == 10) {
							gameArea.clear();
							gameArea.state = 3;
							gameArea.loaded = load.scoreScreen();
							gameArea.parse();
							gameArea.strings[0].parameter = Math.floor(gameArea.refTime) + "." + (Math.floor(gameArea.refTime * 10) % (Math.floor(gameArea.refTime) * 10));
							//achievement unlocks
							if (gameArea.difficulty == 0) {
								if (gameArea.refTime < 180 && checkTime1Easy() == false) {
									unlockTime1Easy();
									gameArea.entities[11].index = 1;
								}
								if (gameArea.refTime < 120 && checkTime2Easy() == false) {
									unlockTime2Easy();
									gameArea.entities[10].index = 1;
								}
								if (gameArea.refTime < 60 && checkTime3Easy() == false) {
									unlockTime3Easy();
									gameArea.entities[9].index = 1;
								}
							} else {
								if (gameArea.refTime < 180 && checkTime1Hard() == false) {
									unlockTime1Hard();
									gameArea.entities[11].index = 1;
								}
								if (gameArea.refTime < 120 && checkTime2Hard() == false) {
									unlockTime2Hard();
									gameArea.entities[10].index = 1;
								}
								if (gameArea.refTime < 60 && checkTime3Hard() == false) {
									unlockTime3Hard();
									gameArea.entities[9].index = 1;
								}
								if (gameArea.refTime < 180 && checkTime1Easy() == false) {
									unlockTime1Easy();
								}
								if (gameArea.refTime < 120 && checkTime2Easy() == false) {
									unlockTime2Easy();
								}
								if (gameArea.refTime < 60 && checkTime3Easy() == false) {
									unlockTime3Easy();
								}
							}
						} else { //if game incomplete, reset
							getProblem(timeAttackDifficulty(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
							gameArea.entities[10].index = gameArea.score;

							for (var i = 0; i < gameArea.droppable.length; i++) {
								gameArea.droppable[i].parameter = "";
								gameArea.droppable[i].isFilled = false;
							}

							gameArea.entities[6].caseOp = 1;
							gameArea.entities[7].caseOp = 1;
							gameArea.entities[8].caseOp = 1;
							gameArea.entities[9].caseOp = 1;
							gameArea.entities.pop();
							gameArea.entities.pop();
							gameArea.entities.pop();
						}
					} else { // question is wrong
						sfx[4].play();

						popup = false;
						gameArea.entities[11].indexInit = 3;
						gameArea.entities[11].index = 3;
						gameArea.entities[11].index -= 0.02;

						gameArea.entities[3].index = 2;	

						gameArea.entities[3].ticks = 1;

						for (var i = 0; i < gameArea.droppable.length; i++) {
							gameArea.droppable[i].parameter = "";
							gameArea.droppable[i].isFilled = false;
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

		case 2: //Endless logic

			gameArea.refTime -= dt;

			if (gameArea.strings.length > 0) {//Loaded endless logic
				gameArea.problemTime += dt;
				gameArea.totalTime += dt;

				/*Loads in problem set*/
				if (gameArea.strings[1].parameter != gameArea.problem[1] && gameArea.entities[3].index != 1) {
					gameArea.strings[1].parameter = gameArea.problem[1];
					gameArea.strings[2].parameter = gameArea.problem[2];
					gameArea.strings[3].parameter = gameArea.problem[3];
					gameArea.strings[4].parameter = gameArea.problem[4];
				}

				/*Pop down flag for correct, incorrect, and achievement feedback*/
				if (gameArea.entities[10].index != gameArea.entities[10].indexInit && gameArea.entities[10].index > gameArea.entities[10].indexInit - 1 && goup == false) {
					gameArea.entities[10].index -= 0.04;
				} else if (gameArea.entities[10].index != gameArea.entities[10].indexInit) {
					if (pause != 60) {
						pause += 1;
					} else {
						goup = true;
						if (gameArea.entities[10].index + 0.04 >= gameArea.entities[10].indexInit) {
							gameArea.entities[10].index = gameArea.entities[10].indexInit;
							popup = true;
							goup = false;
							pause = 0;
						} else {
							gameArea.entities[10].index += 0.04;
						}
					}
				}

				/*Updates the text width based on number of characters*/
				for (var i = 1; i < gameArea.strings.length - 1; i++) {
					if (gameArea.strings[i].parameter > 9) {
						gameArea.strings[i].xPos = gameArea.strings[i].xInit - (gameArea.strings[i].maxWidth / 6);
					} else {
						gameArea.strings[i].xPos = gameArea.strings[i].xInit;
					}
				}

				/*User feedback for cards animation*/
				if (gameArea.entities[3].ticks != 0) {
					gameArea.entities[3].ticks += 1;
				}

				/*Loads in the problem when the user feedback is done*/
				if (gameArea.entities[3].ticks > gameArea.entities[3].ticksPer) {
					if(gameArea.entities[3].index == 1){
						gameArea.strings[1].parameter = gameArea.problem[1];
						gameArea.strings[2].parameter = gameArea.problem[2];
						gameArea.strings[3].parameter = gameArea.problem[3];
						gameArea.strings[4].parameter = gameArea.problem[4];
					}
					gameArea.entities[3].index = 0;
					gameArea.entities[3].ticks = 0;
					disableDrag(0); //enable drag
				}

				/*Updates the timer*/
				if (gameArea.refTime < 1) {
					gameArea.strings[0].parameter = Math.floor(gameArea.refTime) + "." + (Math.floor(gameArea.refTime * 10));
				} else {
					gameArea.strings[0].parameter = Math.floor(gameArea.refTime) + "." + (Math.floor(gameArea.refTime * 10) % (Math.floor(gameArea.refTime) * 10));
				}
				
				/*Response to all operators being filled*/
				if (gameArea.droppable[0].isFilled && gameArea.droppable[1].isFilled && gameArea.droppable[2].isFilled) {
					//if answer is correct
					if (validate(gameArea.strings[1].parameter, gameArea.strings[2].parameter, gameArea.strings[3].parameter, gameArea.strings[4].parameter, gameArea.droppable[0].parameter, gameArea.droppable[1].parameter, gameArea.droppable[2].parameter)) {					
						disableDrag(1); //disable drag

						/*difficultyCurve is a probability generator; result needs to be saved for consistency*/
						var difficulty = difficultyCurve(gameArea.score + 1, gameArea.difficulty);

						getProblem(difficulty, gameArea.difficulty);

						gameArea.entities[3].index = 1;

						gameArea.entities[3].ticks = 1;

						gameArea.score += 1;

						if (calcScore(difficulty, gameArea.problemTime, gameArea.combo) == 666 && checkSatan() == false) {
							unlockSatan();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 23;
							gameArea.entities[10].index = 23;
							gameArea.entities[10].index -= 0.02;
						}
						if (calcScore(difficulty, gameArea.problemTime, gameArea.combo) == 1337 && checkLEET() == false) {
							unlockLEET();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 25;
							gameArea.entities[10].index = 25;
							gameArea.entities[10].index -= 0.02;
						}
						if (gameArea.score >= 10 && checkCombo1() == false && popup) {
							unlockCombo1();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 27;
							gameArea.entities[10].index = 27;
							gameArea.entities[10].index -= 0.02;
						}
						if (gameArea.score >= 25 && checkCombo2() == false && popup) {
							unlockCombo2();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 29;
							gameArea.entities[10].index = 29;
							gameArea.entities[10].index -= 0.02;
						}
						if (gameArea.score >= 50 && checkCombo3() == false && popup) {
							unlockCombo3();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 31;
							gameArea.entities[10].index = 31;
							gameArea.entities[10].index -= 0.02;
						}
						if (gameArea.score >= 100 && checkCombo4() == false && popup) {
							unlockCombo4();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 33;
							gameArea.entities[10].index = 33;
							gameArea.entities[10].index -= 0.02;
						}
						

						gameArea.scoreTotal += calcScore(difficulty, gameArea.problemTime, gameArea.combo);
						gameArea.problemTime = 0;
						gameArea.refTime += calcTime(gameArea.score);
						gameArea.strings[5].parameter = gameArea.scoreTotal;

						if (gameArea.scoreTotal >= 1000000 && checkMillionaire() == false && gameArea.diffficulty == 1 && popup) {
							unlockMillionaire();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 21;
							gameArea.entities[10].index = 21;
							gameArea.entities[10].index -= 0.02;
						} else if (gameArea.scoreTotal >= 5280 && checkMileHighClub() == false && popup) {
							unlockMileHighClub();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 17;
							gameArea.entities[10].index = 17;
							gameArea.entities[10].index -= 0.02;
						} else if (gameArea.score >= 24 && checkJackBauer() == false && popup && gameArea.difficulty == 1) {
							unlockJackBauer();
							sfx[2].play();
							popup = false;
							gameArea.entities[10].indexInit = 19;
							gameArea.entities[10].index = 19;
							gameArea.entities[10].index -= 0.02;
						} else {
							sfx[3].play();
							popup = false;
							gameArea.entities[10].indexInit = 1;
							gameArea.entities[10].index = 1;
							gameArea.entities[10].index -= 0.02;
						}

						for (var i = 0; i < gameArea.droppable.length; i++) {
							gameArea.droppable[i].parameter = "";
							gameArea.droppable[i].isFilled = false;
						}
						gameArea.combo += 1;

						gameArea.entities[6].caseOp = 1;
						gameArea.entities[7].caseOp = 1;
						gameArea.entities[8].caseOp = 1;
						gameArea.entities[9].caseOp = 1;
						gameArea.entities.pop();
						gameArea.entities.pop();
						gameArea.entities.pop();
					} else {

						sfx[4].play();

						popup = false;
						gameArea.entities[10].indexInit = 3;
						gameArea.entities[10].index = 3;
						gameArea.entities[10].index -= 0.02;

						gameArea.combo = 1;

						gameArea.entities[3].index = 2;

						gameArea.entities[3].ticks = 1;

						for (var i = 0; i < gameArea.droppable.length; i++) {
							gameArea.droppable[i].parameter = "";
							gameArea.droppable[i].isFilled = false;
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

				if (gameArea.refTime <= 0.0) {
					gameArea.clear();
					gameArea.state = 4;
					gameArea.problemTime = 0;
					gameArea.loaded = load.scoreScreen();
					gameArea.parse();
					gameArea.strings[0].parameter = gameArea.scoreTotal;
					gameArea.strings[1].parameter = Math.floor(gameArea.totalTime) + "." + (Math.floor(gameArea.totalTime * 10) % (Math.floor(gameArea.totalTime) * 10));
					gameArea.strings[2].parameter = gameArea.score;
				}

			/*Naive animation update for preloading screen*/
			} else if (gameArea.refTime < 0 && gameArea.entities.length == 4 && gameArea.entities[2].index == 2) {//Pre-load screen
				gameArea.clear();
				gameArea.refTime = 24;
				gameArea.loaded = load.gameScreen();
				gameArea.parse();
			} else if (gameArea.refTime < 1 && gameArea.entities.length == 4 && gameArea.entities[2].index == 1) {//Pre-load screen
				gameArea.entities[2].index += 1;
			} else if (gameArea.refTime < 2 && gameArea.entities.length == 4 && gameArea.entities[2].index == 0) {//Pre-load screen
				gameArea.entities[2].index += 1;
				getProblem(difficultyCurve(gameArea.score + 1, gameArea.difficulty), gameArea.difficulty);
			}

			break;
	}

	handleInput(dt);
}