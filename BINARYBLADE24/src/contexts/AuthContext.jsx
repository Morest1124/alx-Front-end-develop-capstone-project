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
      const response = await apiLogin(credentials);
      const userData = response.user || response;

      // Handle different response formats
      const userRole = (
        userData.role ||
        userData.roles?.[0] ||
        "FREELANCER"
      ).toUpperCase();
      const userName =
        userData.username ||
        (userData.first_name && userData.last_name
          ? `${userData.first_name} ${userData.last_name}`
          : "User");

      // Set user state with verified data
      setUser({
        isLoggedIn: true,
        role: userRole,
        name: userName,
        userId: userData.id,
      });

      // Navigate to the appropriate dashboard after login
      navigate(
        userRole.toLowerCase() === "client"
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

  const register = async (userData, role) => {
    try {
      setLoading(true);
      setError(null);
      // First, try to register the user
      const response = await apiRegister(userData);

      // If registration is successful, set up the user session
      setUser({
        isLoggedIn: true,
        role: role.toUpperCase(),
        name:
          userData.username || userData.first_name + " " + userData.last_name,
        userId: response.id || response.user?.id,
      });

      // Navigate to the appropriate dashboard after registration
      navigate(
        role.toLowerCase() === "client"
          ? "/client/dashboard"
          : "/freelancer/dashboard"
      );
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

  const switchRole = () => {
    const newRole =
      user.role.toUpperCase() === "CLIENT" ? "FREELANCER" : "CLIENT";
    setUser({
      ...user,
      role: newRole,
    });
    // Navigate to the appropriate dashboard
    navigate(
      newRole.toLowerCase() === "client"
        ? "/client/dashboard"
        : "/freelancer/dashboard"
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, error, switchRole, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
