import React from "react";

function GameMessage(props) {
  const { game, playerNum, otherPlayerNum } = props;

  function getMessage() {
    if (game.state === 0) {
      if (game.playersState[playerNum] === 0)
        return (
          <div className="game-message">
            <h1>
              {game.players[otherPlayerNum].username} has challenged you to
              play.
            </h1>
            <button onClick={props.handleAccept}>Accept</button>
            <button onClick={props.handleDecline}>Decline</button>
          </div>
        );
      else
        return (
          <div className="game-message">
            <h1>
              Waiting for {game.players[otherPlayerNum].username} to accept your
              invitation.
            </h1>
            <button onClick={props.handleDecline}>Cancel</button>
          </div>
        );
    } else if (game.state === 1 && game.turn !== playerNum) {
      return (
        <div className="game-message">
          <h1>{game.players[otherPlayerNum].username}'s' turn...</h1>
        </div>
      );
    } else if (game.state === 2) {
      return (
        <div className="game-message">
          <h1>
            {game.winner === playerNum ? "You won! Congrats!" : "You lost :("}
          </h1>
          <button onClick={props.handleDecline}>Leave Game</button>
        </div>
      );
    } else if (game.state === 3) {
      return (
        <div className="game-message">
          <h1>
            {game.players[otherPlayerNum].username} has left the game. You win
            by default!
          </h1>
          <button onClick={props.handleDecline}>Leave Game</button>
        </div>
      );
    }
  }

  return <React.Fragment>{getMessage()}</React.Fragment>;
}

export default GameMessage;
