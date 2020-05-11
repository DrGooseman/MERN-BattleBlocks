import React from "react";

function OpenGames(props) {
  function getStateString(state) {
    if (state === 0) return "Your turn...";
    else if (state === 1) return "Their turn...";
    if (state === 2) return "You won!";
    if (state === 2) return "You lost :/";
  }
  return (
    <div
      className={"open-game" + (props.isActive ? " active" : "")}
      onClick={props.handleClick}
    >
      <img src={props.pic} alt="prof pic" />
      <div className="name-text">{props.name}</div>
      <div className="last-move-date">{props.lastMessageDate}</div>
      <div className="open-game-message">
        {getStateString(props.lastMessage)}
      </div>
    </div>
  );
}

export default OpenGames;
