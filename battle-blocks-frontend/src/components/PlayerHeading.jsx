import React from "react";

function PlayerHeading(props) {
  return (
    <div className={"player-heading"}>
      <img src={props.pic} alt="prof pic" />
      <div className="player-heading-name">{props.username}</div>
      <div className="player-heading-logout" onClick={props.handleLogout}>
        Log Out
      </div>
      <div className="player-heading-message">WIns: 0 Losses: 0 Draws: 0</div>
    </div>
  );
}

export default PlayerHeading;
