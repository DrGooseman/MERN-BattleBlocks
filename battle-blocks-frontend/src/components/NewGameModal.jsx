import React, { useState, useEffect, useContext } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../auth-context";
import AddUserBubble from "./AddUserBubble";

function NewGameModal(props) {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [isValid, setIsValid] = useState(false);

  function addUser(user) {
    setSelectedUser(user);
    setSearch("");
  }
  function changeText(event) {
    setSearch(event.target.value);
  }

  useEffect(() => {
    if (props.show) getUsers();
  }, [props.show]);

  // useEffect(() => {
  //   const user = users.find(
  //     user => user.username === search && user.username !== auth.username
  //   );
  //   setSelectedUser(user);
  // }, [search]);

  useEffect(() => {
    setIsValid(selectedUser);
  }, [selectedUser]);

  async function getUsers() {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: auth.token,
        }
      );

      setUsers(responseData.users);
    } catch (err) {}
  }

  async function createGame() {
    const game = {
      users: [{ _id: auth._id }, { _id: selectedUser._id }],
    };

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/games",
        "POST",
        JSON.stringify(game),
        {
          "Content-Type": "application/json",
          Authorization: auth.token,
        }
      );
      setSelectedUser(null);
      props.handleCreateGame(responseData.game);
      props.onHide();
    } catch (err) {}
  }

  function handleSend() {
    createGame();
  }

  function handleRemoveUser(username) {
    setSelectedUser(null);
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="new-chat-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title
        // id="contained-modal-title-vcenter"
        >
          Start a New Game
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          className="form-control"
          type="text"
          value={search}
          onChange={changeText}
          placeholder="Search"
          aria-label="Search"
        />

        <div className="new-chat-modal-added-users">
          {selectedUser && (
            <AddUserBubble
              key={selectedUser.username}
              user={selectedUser}
              handleRemoveUser={handleRemoveUser}
            />
          )}
        </div>

        <div className="new-chat-modal-body">
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
          {users && (
            <ul>
              {users
                .filter((user) =>
                  user.username.toLowerCase().includes(search.toLowerCase())
                )
                .map(
                  (user) =>
                    user.username !== auth.username && (
                      <li
                        key={user.username}
                        onClick={() => addUser(user)}
                        className={
                          selectedUser &&
                          selectedUser.username === user.username
                            ? "new-chat-modal-item-found"
                            : ""
                        }
                      >
                        <img
                          src={process.env.REACT_APP_ASSET_URL + user.picture}
                          alt={"pic"}
                        />
                        {user.username}
                      </li>
                    )
                )}
            </ul>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSend} disabled={!isValid}>
          Send Game Request
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NewGameModal;
