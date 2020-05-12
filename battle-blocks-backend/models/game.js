const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  playersBlocks: [
    [
      {
        id: Number,
        power: Number,
        position: { x: Number, y: Number },
        directions: [Boolean],
      },
    ],
  ],
  previousPlayersBlocks: [
    [
      {
        id: Number,
        power: Number,
        position: { x: Number, y: Number },
        directions: [Boolean],
      },
    ],
  ],
  lastMove: {
    id: Number,
    power: Number,
    position: { x: Number, y: Number },
    directions: [Boolean],
  },
  lastMoveDate: Date,
  turn: Number,
  state: Number,
  playersState: [Number],
  winner: Number,
});

const Game = new mongoose.model("Game", gameSchema);

exports.Game = Game;
