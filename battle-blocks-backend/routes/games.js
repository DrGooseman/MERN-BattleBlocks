const auth = require("../middleware/auth");
const { Game } = require("../models/game");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

const fileUpload = require("../middleware/file-upload");
const HttpError = require("../models/http-error");
const {
  createNewGame,
  attackSurroundingBlocks,
  finishGame,
} = require("../util/GameUtil");

router.get("/", auth, async (req, res, next) => {
  let userGames;
  try {
    userGames = await Game.find({
      players: req.user._id,
    }).populate("players", "-password -email");
  } catch (err) {
    return next(new HttpError("Could not fetch game, server error.", 500));
  }

  const openGames = userGames.filter((game) => {
    const playerNum = req.user._id == game.players[0]._id ? 0 : 1;
    return game.playersState[playerNum] !== 2;
  });

  let wins = 0;
  let losses = 0;
  let draws = 0;
  userGames.forEach((game) => {
    const playerNum = req.user._id == game.players[0]._id ? 0 : 1;
    if (game.winner === playerNum) wins++;
    else if (game.winner === 2) draws++;
    else losses++;
  });

  res.send({ games: openGames, playerRecord: { wins, losses, draws } });
});

router.post("/", auth, async (req, res, next) => {
  const usersInGame = req.body.users;

  let newGame;

  try {
    newGame = createNewGame(usersInGame);
  } catch (err) {
    return next(
      new HttpError("Could not create game, invalid input. " + err, 400)
    );
  }

  try {
    await newGame.save();
  } catch (err) {
    return next(new HttpError("Could not create game, server error.", 500));
  }

  let newGameFromDatabase;
  try {
    newGameFromDatabase = await Game.findById(newGame._id).populate(
      "players",
      "-password -email"
    );
  } catch (err) {
    return next(new HttpError("Could not fetch game, server error.", 500));
  }

  if (res.socketList[newGameFromDatabase.players[1].username])
    res.io
      .to(res.socketList[newGameFromDatabase.players[1].username])
      .emit("updateGame", newGameFromDatabase);

  res.send({ newGame: newGameFromDatabase });
});

router.patch("/", auth, async (req, res, next) => {
  const { gameID, playerID, movedPiece } = req.body;

  const game = await Game.findById(gameID).populate(
    "players",
    "-password -email"
  );

  if (!game) return next(new HttpError("No game found with this id.", 404));

  if (playerID !== req.user._id)
    return next(
      new HttpError("You are not authorized to make this move.", 403)
    );

  for (let i = 0; i < game.playersBlocks[0].length; i++) {
    if (game.playersBlocks[0][i].position === movedPiece.position)
      return next(new HttpError("Invalid move.", 400));
  }
  for (let i = 0; i < game.playersBlocks[1].length; i++) {
    if (game.playersBlocks[1][i].position === movedPiece.position)
      return next(new HttpError("Invalid move.", 400));
  }

  const playerNum = playerID == game.players[0]._id ? 0 : 1;
  const otherPlayerNum = playerNum === 0 ? 1 : 0;

  game.previousPlayersBlocks = [...game.playersBlocks];

  const movedBlockInArray = game.playersBlocks[playerNum][movedPiece.id - 1];
  movedBlockInArray.position = movedPiece.position;

  attackSurroundingBlocks(
    movedBlockInArray,
    game.playersBlocks[otherPlayerNum]
  );

  game.turn = !game.turn;
  game.turnNumber++;

  if (game.turnNumber === 20) finishGame(game);

  game.lastMoveDate = new Date();

  try {
    await game.save();
  } catch (err) {
    return next(new HttpError("Could not save move, server error. ", 500));
  }

  if (res.socketList[game.players[otherPlayerNum].username])
    res.io
      .to(res.socketList[game.players[otherPlayerNum].username])
      .emit("updateGame", game);

  res.send({ game });
});

router.patch("/leave/", auth, async (req, res, next) => {
  const { gameID, playerID } = req.body;

  console.log("game id " + gameID);

  const game = await Game.findById(gameID).populate(
    "players",
    "-password -email"
  );

  const playerNum = playerID == game.players[0]._id ? 0 : 1;
  const otherPlayerNum = playerNum === 0 ? 1 : 0;

  if (game.state === 0) {
    try {
      await Game.deleteOne({ _id: gameID });

      if (res.socketList[game.players[otherPlayerNum].username])
        res.io
          .to(res.socketList[game.players[otherPlayerNum].username])
          .emit("removeGame", gameID);
    } catch (err) {
      return next(new HttpError("Could not delete game, server error.", 500));
    }
  } else if (game.state === 1) {
    game.playersState.set(playerNum, 2);
    game.winner = otherPlayerNum;
    game.state = 3;

    if (res.socketList[game.players[otherPlayerNum].username])
      res.io
        .to(res.socketList[game.players[otherPlayerNum].username])
        .emit("updateGame", game);
  } else if (game.state === 2 || game.state === 3) {
    game.playersState.set(playerNum, 2);
  }

  if (game.state !== 0) {
    try {
      await game.save();
    } catch (err) {
      return next(new HttpError("Could not leave game, server error.", 500));
    }
  }

  res.send({ gameID });
});

router.patch("/accept/", auth, async (req, res, next) => {
  const { gameID, playerID } = req.body;

  const game = await Game.findById(gameID).populate(
    "players",
    "-password -email"
  );

  if (!game) return next(new HttpError("No game found with this id.", 404));

  if (playerID !== req.user._id)
    return next(
      new HttpError("You are not authorized to make this move.", 403)
    );

  const playerNum = playerID == game.players[0]._id ? 0 : 1;
  const otherPlayerNum = playerNum === 0 ? 1 : 0;

  game.playersState.set(playerNum, 1);

  if (game.playersState[0] === 1 && game.playersState[1] === 1) game.state = 1;

  try {
    await game.save();
  } catch (err) {
    return next(new HttpError("Could not save move, server error.", 500));
  }

  if (res.socketList[game.players[otherPlayerNum].username])
    res.io
      .to(res.socketList[game.players[otherPlayerNum].username])
      .emit("updateGame", game);

  res.send({ game });
});

module.exports = router;
