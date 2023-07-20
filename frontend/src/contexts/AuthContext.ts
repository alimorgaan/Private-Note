import { createContext } from "react";
import React from "react";
const AuthContext = createContext<{isLoggedIn : boolean , setIsLoggedIn : React.Dispatch<React.SetStateAction<boolean>> }>({
    isLoggedIn : false,
    setIsLoggedIn : () => {}
});
export default AuthContext;