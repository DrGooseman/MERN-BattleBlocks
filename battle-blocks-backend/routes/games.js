const auth = require("../middleware/auth");
const { Game } = require("../models/game");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

const fileUpload = require("../middleware/file-upload");
const HttpError = require("../models/http-error");
const { createNewGame, attackSurroundingBlocks } = require("../util/GameUtil");

router.get("/", auth, async (req, res, next) => {
  let userGames;
  try {
    userGames = await Game.find({
      players: req.user._id,
    }).populate("players", "-password -email");
  } catch (err) {
    return next(new HttpError("Could not fetch game, server error.", 500));
  }

  res.send({ games: userGames });
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

  // usersInChat.forEach((user) =>
  //   res.io.to(res.socketList[user.username]).emit("updateChat", chat)
  // );

  let newGameFromDatabase;
  try {
    newGameFromDatabase = await Game.findById(newGame._id).populate(
      "players",
      "-password -email"
    );
  } catch (err) {
    return next(new HttpError("Could not fetch game, server error.", 500));
  }

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

  game.lastMoveDate = new Date();

  try {
    await game.save();
  } catch (err) {
    return next(new HttpError("Could not save move, server error.", 500));
  }

  // chat.users.forEach((user) => {
  //   if (res.socketList[user.username])
  //     res.io.to(res.socketList[user.username]).emit("updateChat", chat);
  // });

  res.send({ game });
});

router.patch("/leave/", auth, async (req, res, next) => {
  const { gameID } = req.body;

  await Game.findOneAndRemove(gameID);

  res.send({});
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

  let playerNum;
  if (playerID == game.players[0]._id) playerNum = 0;
  else if (playerID == game.players[1]._id) playerNum = 1;

  game.playersState[playerNum] = 1;

  if (game.playersState[0] === 1 && game.playersState[1] === 1) game.state = 1;

  try {
    await game.save();
  } catch (err) {
    return next(new HttpError("Could not save move, server error.", 500));
  }

  // chat.users.forEach((user) => {
  //   if (res.socketList[user.username])
  //     res.io.to(res.socketList[user.username]).emit("updateChat", chat);
  // });

  res.send({ game });
});

module.exports = router;
