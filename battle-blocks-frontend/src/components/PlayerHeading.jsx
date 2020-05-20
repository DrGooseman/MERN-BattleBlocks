import React from "react";

function PlayerHeading(props) {
  return (
    <div className={"player-heading"}>
      <img src={props.pic} alt="prof pic" />
      <div className="player-heading-name">{props.username}</div>
      <button className="player-heading-logout" onClick={props.handleLogout}>
        Log Out
      </button>
      <div className="player-heading-message">
        <p>Wins: {props.playerRecord.wins}</p>
        <p>Losses: {props.playerRecord.losses}</p>
        <p>Draws: {props.playerRecord.draws}</p>
      </div>
    </div>
  );
}

export default PlayerHeading;
