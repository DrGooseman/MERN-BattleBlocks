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
    turn: 1,
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

function attackSurroundingBlocks(yourBlock, theirBlocks) {
  const grid = [[], [], [], [], []];

  theirBlocks.forEach((block) => {
    if (block.position.x) {
      grid[block.position.y][block.position.x] = block;
    }
  });

  if (
    yourBlock.directions[0] &&
    yourBlock.position.x > 0 &&
    yourBlock.position.y > 0
  )
    attackBlock(
      grid[yourBlock.position.y - 1][yourBlock.position.x - 1],
      yourBlock.power
    );
  if (yourBlock.directions[1] && yourBlock.position.y > 0)
    attackBlock(
      grid[yourBlock.position.y - 1][yourBlock.position.x],
      yourBlock.power
    );
  if (
    yourBlock.directions[2] &&
    yourBlock.position.x < 4 &&
    yourBlock.position.y > 0
  )
    attackBlock(
      grid[yourBlock.position.y - 1][yourBlock.position.x + 1],
      yourBlock.power
    );
  if (yourBlock.directions[3] && yourBlock.position.x > 0)
    attackBlock(
      grid[yourBlock.position.y][yourBlock.position.x - 1],
      yourBlock.power
    );
  if (yourBlock.directions[4] && yourBlock.position.x < 4)
    attackBlock(
      grid[yourBlock.position.y][yourBlock.position.x + 1],
      yourBlock.power
    );
  if (
    yourBlock.directions[5] &&
    yourBlock.position.x > 0 &&
    yourBlock.position.y < 4
  )
    attackBlock(
      grid[yourBlock.position.y + 1][yourBlock.position.x - 1],
      yourBlock.power
    );
  if (yourBlock.directions[6] && yourBlock.position.y < 4)
    attackBlock(
      grid[yourBlock.position.y + 1][yourBlock.position.x],
      yourBlock.power
    );
  if (
    yourBlock.directions[7] &&
    yourBlock.position.x < 4 &&
    yourBlock.position.y < 4
  )
    attackBlock(
      grid[yourBlock.position.y + 1][yourBlock.position.x + 1],
      yourBlock.power
    );
}

function attackBlock(block, power) {
  if (!block) return;

  block.power -= power;
  if (block.power <= 0) {
    block.power = 0;
    block.position = undefined;
  }
}

exports.createNewGame = createNewGame;
exports.attackSurroundingBlocks = attackSurroundingBlocks;
