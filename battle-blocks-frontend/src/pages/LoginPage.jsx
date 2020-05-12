import React, { useContext, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../auth-context";
import ImageUpload from "./../components/ImageUpload";

function LoginPage() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isValid, setIsValid] = useState(false);

  function switchLoginMode() {
    setIsLoginMode((prev) => !prev);
  }

  function handleInput(event) {
    if (event.target.name === "username") {
      setUsername(event.target.value);
      if (event.target.value === "")
        setErrorUsername("Username cannot be empty.");
      else setErrorUsername();
    } else if (event.target.name === "email") {
      setEmail(event.target.value);
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(event.target.value))
        setErrorEmail("You must enter a valid email.");
      else setErrorEmail();
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
      if (event.target.value.length < 6)
        setErrorPassword("Password must be at least 6 characters long.");
      else setErrorPassword();
    }
  }

  useEffect(() => {
    if (errorEmail || errorPassword || (!isLoginMode && errorUsername))
      setIsValid(false);
    else if (!email || !password || (!isLoginMode && (!username || !picture)))
      setIsValid(false);
    else setIsValid(true);
  }, [errorEmail, errorUsername, errorPassword, isLoginMode, picture]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: email,
            password: password,
          }),
          { "Content-Type": "application/json" }
        );
        console.log(responseData.picture);
        auth.login(
          responseData._id,
          responseData.token,
          responseData.username,
          null,
          responseData.picture,
          responseData.email
        );
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("picture", picture);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/",
          "POST",
          formData
        );

        auth.login(
          responseData._id,
          responseData.token,
          responseData.username,
          null,
          responseData.picture,
          responseData.email
        );
      } catch (err) {}
    }
  }

  function handleImageUpload(id, pickedFile, fileIsValid) {
    setPicture(pickedFile);
  }

  return (
    <React.Fragment>
      {error && (
        <Alert variant="danger" onClose={clearError} dismissible>
          <Alert.Heading>An error has occured :(</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      <Form className="center-container">
        <div className="center-items">
          <h1>{isLoginMode ? "Login" : "Register"}</h1>
          <Button
            className="center"
            onClick={switchLoginMode}
            variant="outline-secondary"
          >
            {isLoginMode
              ? "Don't have an account? Create one here."
              : "Already have an account? Login here."}
          </Button>
        </div>
        {!isLoginMode && (
          <div className="center-items">
            <ImageUpload
              id="image"
              onInput={handleImageUpload}
              errorText="Please provide an image"
              center
            />
          </div>
        )}

        {!isLoginMode && (
          <Form.Group controlId="formBasicName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={username}
              onChange={handleInput}
              placeholder="Enter create a Username"
              isInvalid={errorUsername && true}
              isValid={!errorUsername && username && true}
              // {errorName ? isInvalid : isValid}
            />
            <Form.Control.Feedback type="invalid">
              {errorUsername}
            </Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            value={email}
            onChange={handleInput}
            type="email"
            placeholder="Enter email"
            isInvalid={errorEmail && true}
            isValid={!errorEmail && email && true}
          />
          <Form.Control.Feedback type="invalid">
            {errorEmail}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            value={password}
            onChange={handleInput}
            type="password"
            placeholder="Password"
            isInvalid={errorPassword && true}
            isValid={!errorPassword && password && true}
          />
          <Form.Control.Feedback type="invalid">
            {errorPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          block
          disabled={isLoading || !isValid}
          onClick={!isLoading ? handleSubmit : null}
        >
          {isLoading ? "Loading…" : "Submit"}
        </Button>
      </Form>
      {isLoading && (
        <div className="center-items-flex">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    </React.Fragment>
  );
}

export default LoginPage;
