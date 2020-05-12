import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export function useAuth() {
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [_id, setUserId] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [picture, setPicture] = useState();

  const login = useCallback(
    (uid, token, username, oldExpirationDate, picture, email) => {
      setToken(token);
      setUsername(username);
      setPicture(picture);
      setUserId(uid);
      setEmail(email);
      const tokenExpirationDate =
        oldExpirationDate ||
        new Date(new Date().getTime() + 1000 * 60 * 60 * 12);
      setTokenExpirationDate(tokenExpirationDate);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          _id: uid,
          username: username,
          token: token,
          picture: picture,
          email: email,
          expiration: tokenExpirationDate.toISOString()
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else clearTimeout(logoutTimer);
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    )
      login(
        storedData._id,
        storedData.token,
        storedData.username,
        new Date(storedData.expiration),
        storedData.picture,
        storedData.email
      );
  }, [login]);

  return { token, login, logout, _id, username, picture, email };
}
