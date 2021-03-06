import openSocket from "socket.io-client";
let socket;

function connectToSocket(username, cbUpdate, cbRemove) {
  socket = openSocket(process.env.REACT_APP_SOCKET_URL, {
    query: `username=${username}`,
  });
  socket.on("updateGame", (game) => cbUpdate(null, game));
  socket.on("removeGame", (gameID) => cbRemove(null, gameID));
}

function disconnect() {
  socket.disconnect();
}

export { connectToSocket, disconnect };
