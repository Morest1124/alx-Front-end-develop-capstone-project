import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from './Routers';
import { login as apiLogin, register as apiRegister } from "../api";

// Create the context
export const AuthContext = createContext();

// Define the initial state for a logged-out user
const LoggedOutUserState = {
  isLoggedIn: false,
  role: null,
  name: "Guest",
  userId: null,
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize state from localStorage to keep user logged in across sessions
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : LoggedOutUserState;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { navigate } = useRouter();

  useEffect(() => {
    // Persist user state changes to localStorage
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      // The API login response includes the user object with role, name, and id
      const userData = await apiLogin(credentials);
      setUser({
        isLoggedIn: true, // Access nested user object
        role: userData.user.role,
        name: userData.user.username,
        userId: userData.user.id,
      });
      // Navigate to the appropriate dashboard after login
      navigate(
        userData.user.role === "client"
          ? "/client/dashboard"
          : "/freelancer/dashboard"
      );
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      // After successful registration navigate user to the dashboard page.
      await apiRegister(userData);
      navigate("client " ? "/client/dashboard" : "/freelancer/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear user state
    setUser(LoggedOutUserState);
    // Remove token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Navigate to home page
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
