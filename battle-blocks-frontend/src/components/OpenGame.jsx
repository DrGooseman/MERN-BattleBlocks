import React from "react";

function OpenGame(props) {
  const playerNum = props.localPlayerID === props.game.players[0]._id ? 0 : 1;
  const otherPlayerNum = playerNum === 0 ? 1 : 0;
  const otherPlayerName = props.game.players[otherPlayerNum].username;
  const otherPlayerPic = props.game.players[otherPlayerNum].picture;

  function getStateString() {
    if (props.game.state === 0) return "Waiting to start...";
    if (props.game.state === 3) return otherPlayerName + " left!";
    if (props.game.state === 2) return "Game over!";

    if (props.game.turn === playerNum) return "Your turn...";
    else return "Their turn...";
  }

  return (
    <div
      className={"open-game" + (props.isActive ? " active" : "")}
      onClick={props.handleClick}
    >
      <img
        src={process.env.REACT_APP_ASSET_URL + otherPlayerPic}
        alt="prof pic"
      />
      <div className="name-text">{otherPlayerName}</div>
      <div className="last-move-date">{props.game.lastMessageDate}</div>
      <div className="open-game-message">{getStateString()}</div>
    </div>
  );
}

export default OpenGame;
