const auth = require("../middleware/auth");
const { Game } = require("../models/game");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

const fileUpload = require("../middleware/file-upload");
const HttpError = require("../models/http-error");
const {createNewGame} = require("../util/GameUtil");

router.get("/", auth, async (req, res, next) => {
  const userGames = await Chat.find({
    users: {
      $elemMatch: {
        _id: req.user._id
        //username: req.user.username,
      },
    },
  });

  res.send({ games: userGames });
});

router.post("/", auth, async (req, res, next) => {
  const usersInGame = req.body.users;

  const newGame;
  try{
    newGame = createNewGame(usersInGame);
    } catch (err) {
      return next(new HttpError("Could not create game, invalid input.", 400));
    }

  try {
    newGame.save();
  } catch (err) {
    return next(new HttpError("Could not create game, server error.", 500));
  }

  // usersInChat.forEach((user) =>
  //   res.io.to(res.socketList[user.username]).emit("updateChat", chat)
  // );

  res.send({ newGame });
});

// router.patch("/", auth, async (req, res, next) => {
//   const chat = await Chat.findById(req.body.chatId);

//   if (!chat) return next(new HttpError("No chat found with this id.", 404));

//   chat.messages.push(req.body.message);

//   try {
//     chat.save();
//   } catch (err) {
//     return next(new HttpError("Could not add message, server error.", 500));
//   }

//   chat.users.forEach((user) => {
//     if (res.socketList[user.username])
//       res.io.to(res.socketList[user.username]).emit("updateChat", chat);
//   });

//   res.send({ chat: chat });
// });

module.exports = router;
