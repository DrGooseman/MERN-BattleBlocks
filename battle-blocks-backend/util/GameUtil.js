const { Game } = require("../models/game");

function createNewGame(users) {
  const player1Blocks = generateNewBlocks();
  const player2Blocks = generateNewBlocks();

  const newGame = new Game({
    players: users,
    playersBlocks: [player1Blocks, player2Blocks],
    previousPlayersBlocks: null,
    lastMove: undefined,
    lastMoveDate: new Date(),
    turn: 0,
    state: 0,
    playersState: [1, 0],
  });
  console.log(newGame);
  return newGame;
}

function generateNewBlocks() {
  const blocks = [];

  for (let i = 1; i < 11; i++) {
    let numOfDirections;

    if (i == 1 || i == 2) numOfDirections = 8;
    else if (i == 3) numOfDirections = 7;
    else if (i == 4) numOfDirections = 6;
    else if (i == 5) numOfDirections = 5;
    else if (i == 6) numOfDirections = 4;
    else if (i == 7) numOfDirections = 3;
    else if (i == 8) numOfDirections = 2;
    else if (i == 9 || i == 10) numOfDirections = 1;

    const directions = Array(8).fill(false);
    const directionOptions = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let j = 0; j < numOfDirections; j++) {
      const randomNum = Math.floor(Math.random() * directionOptions.length);
      const direction = directionOptions[randomNum];
      directionOptions.splice(randomNum, 1);
      directions[direction] = true;
    }
    const block = { id: i, power: i, position: undefined, directions };

    blocks.push(block);
  }
  return blocks;
}

exports.createNewGame = createNewGame;
