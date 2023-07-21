import { Outlet } from "react-router-dom";
import Intro from "./Intro";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
const Protected = () => {
  const auth = useContext(AuthContext);

  return auth.isLoggedIn ? <Outlet /> : <Intro />;
};

export default Protected;
