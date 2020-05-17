import React from "react";

function getTurnText(props) {
  if (props._id === props.game.players[0]._id) {
    if (props.game.turn === 0) return "It's your turn.";
    return "Waiting for opponent's move...";
  }
  if (props.game.turn === 1) return "It's your turn.";
  return "Waiting for opponent's move...";
}

function CurrentGameHeading(props) {
  return (
    <div className={"player-heading"}>
      {props.game && (
        <React.Fragment>
          <img src={props.pic} alt="prof pic" />
          <div className="player-heading-name">Jim: 0 Bob: 0</div>
          <div className="player-heading-logout">
            <button onClick={props.handleLeave}>Leave Game</button>
          </div>
          <div className="player-heading-message">{getTurnText(props)}</div>
        </React.Fragment>
      )}
    </div>
  );
}

export default CurrentGameHeading;
