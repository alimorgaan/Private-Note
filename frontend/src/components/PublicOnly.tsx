import { Outlet } from "react-router-dom";
import AuthContext from "@/contexts/AuthContext";
import Home from "./Home";
import { useContext } from "react";

const PublicOnly = () => {
  const auth = useContext(AuthContext);

  return auth.isLoggedIn ? <Home /> : <Outlet />;
};

export default PublicOnly;
