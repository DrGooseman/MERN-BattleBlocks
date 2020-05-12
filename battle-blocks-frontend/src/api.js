import openSocket from "socket.io-client";
let socket;

function connectToSocket(username, cb) {
  socket = openSocket(process.env.REACT_APP_SOCKET_URL, {
    query: `username=${username}`
  });
  socket.on("updateChat", chat => cb(null, chat));
}

function disconnect() {
  socket.disconnect();
}

export { connectToSocket, disconnect };
