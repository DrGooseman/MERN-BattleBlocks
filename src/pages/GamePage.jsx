import React, { useState } from "react";
import OpenGames from "../components/OpenGames";
import GameBoard from "./../components/GameBoard";

const yourBlocks = [
  {
    id: 2,
    power: 2,
    position: null,
    directions: [true, false, true, false, true, false, true, false],
  },
  {
    id: 4,
    power: 4,
    position: { x: 1, y: 0 },
    directions: [false, true, false, false, false, true, false, true],
  },
  {
    id: 5,
    power: 5,
    position: null,
    directions: [true, false, true, false, true, false, true, false],
  },
  {
    id: 6,
    power: 6,
    position: null,
    directions: [true, false, true, false, true, false, true, false],
  },
  {
    id: 9,
    power: 9,
    position: null,
    directions: [false, false, false, true, false, false, true, false],
  },
  {
    id: 10,
    power: 10,
    position: null,
    directions: [false, false, true, false, false, false, false, false],
  },
];
const theirBlocks = [
  {
    id: 2,
    power: 2,
    position: { x: 2, y: 1 },
    directions: [true, false, true, false, true, false, true, false],
  },
  {
    id: 4,
    power: 4,
    position: null,
    directions: [false, true, false, false, false, true, false, true],
  },
  {
    id: 7,
    power: 7,
    position: { x: 3, y: 3 },
    directions: [false, false, true, false, false, true, false, true],
  },
];

const openGames = [
  {
    _id: 0,
    players: ["Joe"],
    state: 0,
    lastMoveDate: "Apr 12 17:41",
  },
  {
    _id: 1,
    players: ["Billy"],
    state: 1,
    lastMoveDate: "Apr 12 12:10",
  },
  {
    _id: 2,
    players: ["Artyem"],
    state: 2,
    lastMoveDate: "Apr 13 09:41",
  },
];

function GamePage() {
  const [currentGame, setCurrentGame] = useState(null);

  function selectGame(newGameId) {
    setCurrentGame(openGames.find((game) => game._id === newGameId));
  }

  return (
    <div className="container2 grid-container">
      <div className="side-area">
        <h1>Battle Blocks</h1>
        {openGames.map((game) => (
          <OpenGames
            key={game._id}
            isActive={currentGame && game._id === currentGame._id}
            name={game.players[0]}
            lastMessage={game.state}
            lastMessageDate={game.lastMoveDate}
            pic="https://picsum.photos/24"
            handleClick={() => selectGame(game._id)}
          />
        ))}
      </div>
      <GameBoard yourBlocks={yourBlocks} theirBlocks={theirBlocks} />
    </div>
  );
}

export default GamePage;

//  style={{ gridArea:"" + (i + 1) + " / " + (j + 1) + " / " + (i + 2) + " / " + (j + 2)}}
