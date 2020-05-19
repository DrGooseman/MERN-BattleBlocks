import React, { useState, useContext, useEffect } from "react";

import OpenGames from "../components/OpenGames";
import GameBoard from "./../components/GameBoard";
import PlayerHeading from "../components/PlayerHeading";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../auth-context";
import { connectToSocket } from "../api";
import { disconnect } from "../api";
import NewGameModal from "../components/NewGameModal";
import CurrentGameHeading from "./../components/CurrentGameHeading";

function GamePage() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentGame, setCurrentGame] = useState(null);
  const [openGames, setOpenGames] = useState(null);
  const [showingNewGameModal, setShowingNewGameModal] = useState(false);
  const [playerNum, setPlayerNum] = useState(0);
  const [otherPlayerNum, setOtherPlayerNum] = useState(1);
  const [yourScore, setYourScore] = useState(0);
  const [theirScore, setTheirScore] = useState(0);

  function selectGame(newGameId) {
    console.log(openGames.find((game) => game._id === newGameId));
    updateCurrentGame(openGames.find((game) => game._id === newGameId));
  }

  function handleLogout() {
    disconnect();
    auth.logout();
  }

  useEffect(() => {
    if (auth.username) connectToSocket(auth.username, receiveIncomingUpdate);
    getOpenGames();
  }, [auth.username]);

  function updateOpenGames(gameToUpdate) {
    const newOpenGames = openGames.filter(
      (game) => game._id !== gameToUpdate._id
    );
    newOpenGames.unshift(gameToUpdate);
    setOpenGames(newOpenGames);
  }

  function updateCurrentGame(game) {
    let yourNum = 0;
    let theirNum = 1;
    if (game.players[1]._id === auth._id) {
      yourNum = 1;
      theirNum = 0;
    }
    setPlayerNum(yourNum);
    setOtherPlayerNum(theirNum);
    setCurrentGame(game);

    let yourScore = 0;
    game.playersBlocks[yourNum].forEach((block) => (yourScore += block.power));
    setYourScore(yourScore);
    let theirScore = 0;
    game.playersBlocks[theirNum].forEach(
      (block) => (theirScore += block.power)
    );
    setTheirScore(theirScore);
  }

  function receiveIncomingUpdate(err, updatedGame) {
    // setLastUpdatedChat(updatedChat);
    // setChats(prevChats => {
    //   const newChats = [
    //     ...prevChats.filter(chat => chat._id !== updatedChat._id),
    //     updatedChat
    //   ];
    //   sortChats(newChats);
    //   return newChats;
    // });
  }

  async function getOpenGames() {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/games",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: auth.token,
        }
      );

      let games = responseData.games;

      sortGames(games);

      setOpenGames(games);

      // getQuestion();
    } catch (err) {}
  }

  async function makeMove(selectedBlock) {
    try {
      const movedPiece = {
        id: selectedBlock.id,
        position: selectedBlock.position,
      };
      const move = { playerID: auth._id, gameID: currentGame._id, movedPiece };
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/games",
        "PATCH",
        JSON.stringify(move),
        {
          "Content-Type": "application/json",
          Authorization: auth.token,
        }
      );
      console.log(responseData.game);
      updateOpenGames(responseData.game);
      updateCurrentGame(responseData.game);
    } catch (err) {}
  }

  async function leaveGame() {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/games/leave",
        "PATCH",
        JSON.stringify({ gameID: currentGame._id }),
        {
          "Content-Type": "application/json",
          Authorization: auth.token,
        }
      );
      setCurrentGame(null);
    } catch (err) {}
  }

  async function acceptGame() {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/games/accept",
        "PATCH",
        JSON.stringify({ playerID: auth._id, gameID: currentGame._id }),
        {
          "Content-Type": "application/json",
          Authorization: auth.token,
        }
      );
      updateOpenGames(responseData.game);
      updateCurrentGame(responseData.game);
    } catch (err) {}
  }

  function sortGames(games) {
    games.sort((a, b) =>
      new Date(a.lastMoveDate) > new Date(b.lastMoveDate)
        ? -1
        : new Date(b.lastMoveDate) > new Date(a.lastMoveDate)
        ? 1
        : 0
    );
  }

  function handleCreateGame(game) {
    console.log(game);
    updateCurrentGame(game);
  }

  return (
    <div className="container2 grid-container">
      <div className="side-area">
        <h1>Battle Blocks</h1>
        <PlayerHeading
          username={auth.username}
          pic={process.env.REACT_APP_ASSET_URL + auth.picture}
          handleLogout={handleLogout}
        />

        <CurrentGameHeading
          game={currentGame}
          _id={auth._id}
          handleLeave={leaveGame}
          playerNum={playerNum}
          otherPlayerNum={otherPlayerNum}
          yourScore={yourScore}
          theirScore={theirScore}
        />

        <div className="side-area-open-games">
          {openGames &&
            openGames.map((game) => (
              <OpenGames
                key={game._id}
                game={game}
                isActive={currentGame && game._id === currentGame._id}
                turn={game.turn}
                localPlayerID={auth._id}
                lastMoveDate={game.lastMoveDate}
                handleClick={() => selectGame(game._id)}
              />
            ))}
          {(!openGames || openGames.length === 0) && "No open games."}
        </div>

        {error && (
          <Alert variant="danger" onClose={clearError} dismissible>
            <Alert.Heading>An error has occured :(</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}
        {isLoading && (
          <div className="center-items-flex">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
        <div className="side-area-bottom">
          <h4>Start New Game</h4>
          <button onClick={() => setShowingNewGameModal(true)}>+</button>
        </div>

        <NewGameModal
          handleCreateGame={handleCreateGame}
          show={showingNewGameModal}
          onHide={() => setShowingNewGameModal(false)}
        />
      </div>
      {currentGame && (
        <GameBoard
          game={currentGame}
          handleMove={makeMove}
          playerNum={playerNum}
          otherPlayerNum={otherPlayerNum}
          handleDecline={leaveGame}
          handleAccept={acceptGame}
        />
      )}
    </div>
  );
}

export default GamePage;

//  style={{ gridArea:"" + (i + 1) + " / " + (j + 1) + " / " + (i + 2) + " / " + (j + 2)}}
