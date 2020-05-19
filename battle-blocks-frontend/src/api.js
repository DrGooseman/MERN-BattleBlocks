import openSocket from "socket.io-client";
let socket;

function connectToSocket(username, cb) {
  socket = openSocket(process.env.REACT_APP_SOCKET_URL, {
    query: `username=${username}`,
  });
  socket.on("updateGame", (game) => cb(null, game));
}

function disconnect() {
  socket.disconnect();
}

export { connectToSocket, disconnect };
