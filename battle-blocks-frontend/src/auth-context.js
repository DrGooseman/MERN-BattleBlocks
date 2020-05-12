import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  _id: null,
  name: "",
  token: null,
  login: () => {},
  logout: () => {}
});
