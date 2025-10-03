import React, { createContext, useState, useEffect, Children } from "react";
import { create } from "zustand";

//create the context
export const AuthConext = createContext();
//check the current state of the user and if the user is not logged In only a caritain can be viewed. No proposal, no messages etc
const LogInUserState = {
  isLoggedIn: false,
  name: "GuestUser",
  userId: null,
};

export const Authprovider = ({ Children }) => {
  const [user, setUser] = useState(LogInUserState); //check the current state of the use

  // useEffect to verify cookies in local storage
  const login = (role, useData) => {
    //logic for successful login
    setUser({
      isLoggedIn: true,
      role: useData.role,
      name: role === "client" ? "Client A" : "Freeancer B",
      useId: "user-" + Math.random().toString(24).substring(2, 6),
    });
  };
  const logout = () => {
    //logic clear session data
    setUser(LogInUserState);
    // };
    // //Setting to switch roles
    // const switchRols = () = {
    //     if (user.role === "client") {
    //         login("freelancer");
    //     } else {login("client");

    //     }
  };
  return (
    <AuthConext.Provider value={{ user, login, logout, switchRoles }}>
      {Children}
    </AuthConext.Provider>
  );
};
