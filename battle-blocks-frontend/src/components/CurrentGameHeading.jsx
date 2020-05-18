import React from "react";

function CurrentGameHeading(props) {
  const { playerNum, otherPlayerNum } = props;

  function getTurnText(props) {
    if (props.game.state === 0) {
      if (props.game.playersState[playerNum] === 0)
        return "Awaiting your response";
      else return "Awaiting their response";
    }

    if (props.game.turn === playerNum) return "It's your turn.";
    else return "Waiting for opponent's move...";
  }

  return (
    <div className={"current-game-heading"}>
      {props.game && (
        <React.Fragment>
          <img
            src={
              process.env.REACT_APP_ASSET_URL +
              props.game.players[otherPlayerNum].picture
            }
            alt="prof pic"
          />

          <div className="current-game-heading-score">Jim: 0 Bob: 0</div>
          <div className="">
            <button onClick={props.handleLeave}>Leave Game</button>
          </div>

          <div className="current-game-heading-message">
            {getTurnText(props)}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default CurrentGameHeading;
