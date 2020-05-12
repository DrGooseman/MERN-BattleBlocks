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

function GamePage() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentGame, setCurrentGame] = useState(null);
  const [openGames, setOpenGames] = useState(null);

  function selectGame(newGameId) {
    setCurrentGame(openGames.find((game) => game._id === newGameId));
  }

  function handleLogout() {
    disconnect();
    auth.logout();
  }

  useEffect(() => {
    if (auth.username) connectToSocket(auth.username, receiveIncomingUpdate);
  }, [auth.username]);

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

  function sortGames(games) {
    games.sort((a, b) =>
      new Date(a.lastMoveDate) > new Date(b.lastMoveDate)
        ? -1
        : new Date(b.lastMoveDate) > new Date(a.lastMoveDate)
        ? 1
        : 0
    );
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
        {openGames &&
          openGames.map((game) => (
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
        {!openGames && "No open games."}
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
      </div>
      {currentGame && <GameBoard game={currentGame} />}
    </div>
  );
}

export default GamePage;

//  style={{ gridArea:"" + (i + 1) + " / " + (j + 1) + " / " + (i + 2) + " / " + (j + 2)}}
