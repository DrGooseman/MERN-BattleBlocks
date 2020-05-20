import React from "react";

function CurrentGameHeading(props) {
  const { game, playerNum, otherPlayerNum, yourScore, theirScore } = props;

  function getTurnText(props) {
    if (game.state === 0) {
      if (game.playersState[playerNum] === 0) return "Awaiting your response";
      else return "Awaiting their response";
    }

    if (game.state === 3)
      return game.players[otherPlayerNum].username + " left!";

    if (game.turn === playerNum) return "It's your turn.";
    else return "Waiting for opponent's move...";
  }

  return (
    <div className={"current-game-heading"}>
      {game && (
        <React.Fragment>
          <img
            src={
              process.env.REACT_APP_ASSET_URL +
              game.players[otherPlayerNum].picture
            }
            alt="prof pic"
          />

          <div className="current-game-heading-score">
            <p>You: {yourScore}</p>
            <p>
              {game.players[otherPlayerNum].username}: {theirScore}
            </p>
          </div>
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
