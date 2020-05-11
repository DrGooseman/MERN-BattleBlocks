//const error = require("../middleware/error");

const users = require("./routes/users");
const games = require("./routes/games");
//const auth = require("../routes/auth");
const express = require("express");

module.exports = function (app, io, socketList) {
  app.use((req, res, next) => {
    res.io = io;
    res.socketList = socketList;
    next();
  });
  app.use(express.json({ limit: "50MB" }));
  app.use("/api/users", users);

  app.use("/api/games", games);
  //  app.use('/api/auth', auth);
  // app.use(error);
};
