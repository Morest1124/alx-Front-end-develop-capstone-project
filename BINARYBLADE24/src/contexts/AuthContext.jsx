import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from './Routers';

// Create the context
export const AuthContext = createContext();

//check the current state of the user and if the user is not logged In only a caritain can be viewed. No proposal, no messages etc
const LogInUserState = {
  isLoggedIn: false,
  role: null, // 'client', 'freelancer', or GuestUser
  name: "GuestUser",
  userId: null,
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : LogInUserState;
  });
  const { navigate } = useRouter();

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Login function setting a successful session

  const login = (role) => {
    setUser({
      isLoggedIn: true,
      role: role,
      name: role === "client" ? "Morest" : "BinaryBlade24",
      userId: "user-" + Math.random().toString(24).substring(2, 9),
    });
  };

  //Logout function
  const logout = () => {
    setUser(LogInUserState);
    navigate('/');
  };

  //settings page
  const switchRole = () => {
    const newRole = user.role === "client" ? "freelancer" : "client";
    login(newRole);
    navigate(`/${newRole}/dashboard`);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
