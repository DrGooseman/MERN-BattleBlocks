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
    turnNumber: 0,
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
  let returnDamage = 0;

  theirBlocks.forEach((block) => {
    if (block.position.x) {
      grid[block.position.y][block.position.x] = block;
    }
  });

  if (yourBlock.position.x > 0 && yourBlock.position.y > 0) {
    if (yourBlock.directions[0])
      attackBlock(
        grid[yourBlock.position.y - 1][yourBlock.position.x - 1],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y - 1][yourBlock.position.x - 1],
      7
    );
  }
  if (yourBlock.position.y > 0) {
    if (yourBlock.directions[1])
      attackBlock(
        grid[yourBlock.position.y - 1][yourBlock.position.x],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y - 1][yourBlock.position.x],
      6
    );
  }
  if (yourBlock.position.x < 4 && yourBlock.position.y > 0) {
    if (yourBlock.directions[2])
      attackBlock(
        grid[yourBlock.position.y - 1][yourBlock.position.x + 1],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y - 1][yourBlock.position.x + 1],
      5
    );
  }
  if (yourBlock.position.x > 0) {
    if (yourBlock.directions[3])
      attackBlock(
        grid[yourBlock.position.y][yourBlock.position.x - 1],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y][yourBlock.position.x - 1],
      4
    );
  }
  if (yourBlock.position.x < 4) {
    if (yourBlock.directions[4])
      attackBlock(
        grid[yourBlock.position.y][yourBlock.position.x + 1],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y][yourBlock.position.x + 1],
      3
    );
  }
  if (yourBlock.position.x > 0 && yourBlock.position.y < 4) {
    if (yourBlock.directions[5])
      attackBlock(
        grid[yourBlock.position.y + 1][yourBlock.position.x - 1],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y + 1][yourBlock.position.x - 1],
      2
    );
  }
  if (yourBlock.position.y < 4) {
    if (yourBlock.directions[6])
      attackBlock(
        grid[yourBlock.position.y + 1][yourBlock.position.x],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y + 1][yourBlock.position.x],
      1
    );
  }
  if (yourBlock.position.x < 4 && yourBlock.position.y < 4) {
    if (yourBlock.directions[7])
      attackBlock(
        grid[yourBlock.position.y + 1][yourBlock.position.x + 1],
        yourBlock.power
      );
    returnDamage += calcReturnDamage(
      grid[yourBlock.position.y + 1][yourBlock.position.x + 1],
      0
    );
  }

  //return damage
  yourBlock.power -= returnDamage;
  if (yourBlock.power <= 0) {
    yourBlock.power = 0;
    yourBlock.position = undefined;
  }
}

function attackBlock(block, power) {
  if (!block) return;

  block.power -= power;
  if (block.power <= 0) {
    block.power = 0;
    block.position = undefined;
  }
}

function calcReturnDamage(block, direction) {
  if (!block || block.power === 0) return 0;

  if (block.directions[direction]) return block.power;

  return 0;
}

function finishGame(game) {
  game.state = 2;
  let player1Score = 0;
  let player2Score = 0;
  game.players[0].blocks.forEach((block) => (player1Score += block.power));
  game.players[0].blocks.forEach((block) => (player2Score += block.power));
  console.log(player1Score);
  console.log(player2Score);
  if (player1Score > player2Score) game.winner = 0;
  else if (player2Score > player1Score) game.winner = 1;
  else game.winner = 2;
  console.log(game.winner);
}

exports.createNewGame = createNewGame;
exports.attackSurroundingBlocks = attackSurroundingBlocks;
exports.finishGame = finishGame;
