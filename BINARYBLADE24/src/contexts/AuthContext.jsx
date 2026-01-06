import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from './Routers';
import { login as apiLogin, register as apiRegister } from "../api";
import LoadingOverlay from '../components/LoadingOverlay';

// Create the context
export const AuthContext = createContext();

// Define the initial state for a logged-out user
const LoggedOutUserState = {
  isLoggedIn: false,
  role: null,
  availableRoles: [],
  name: "",
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
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    // Persist user state changes to localStorage
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // Auto-logout logic
  useEffect(() => {
    let inactivityTimer;
    let warningTimer;
    const INACTIVITY_LIMIT = 10 * 60 * 60 * 1000; // 10 hours in milliseconds
    const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before logout

    const showWarning = () => {
      // You could replace this with a modal/toast component
      const shouldStay = window.confirm(
        "Your session will expire in 5 minutes due to inactivity. Click OK to stay logged in."
      );
      if (shouldStay) {
        resetTimer(); // User chose to stay, reset the timer
      }
    };

    const resetTimer = () => {
      if (user.isLoggedIn) {
        clearTimeout(inactivityTimer);
        clearTimeout(warningTimer);

        // Set warning timer (5 minutes before logout)
        warningTimer = setTimeout(() => {
          console.log("Session expiring soon. Showing warning...");
          showWarning();
        }, INACTIVITY_LIMIT - WARNING_TIME);

        // Set logout timer (1 hour)
        inactivityTimer = setTimeout(() => {
          console.log("Session expired due to inactivity. Logging out...");
          logout();
        }, INACTIVITY_LIMIT);
      }
    };

    // Events to track activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    if (user.isLoggedIn) {
      // Set initial timer
      resetTimer();

      // Add event listeners
      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });
    }

    return () => {
      // Cleanup
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user.isLoggedIn]);

  // Check JWT token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('access_token');
      if (!token || !user.isLoggedIn) return;

      try {
        // Decode JWT token (format: header.payload.signature)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        if (timeUntilExpiry <= 0) {
          // Token already expired
          console.log("Your session has expired. Logging out...");
          logout();
        } else if (timeUntilExpiry < 5 * 60 * 1000) {
          // Less than 5 minutes until expiry, show warning
          console.log(`Your session will expire in ${Math.floor(timeUntilExpiry / 60000)} minutes`);
        } else {
          // Set a timer to check again when token is about to expire
          const checkTimer = setTimeout(() => {
            checkTokenExpiration();
          }, timeUntilExpiry - 5 * 60 * 1000); // Check 5 minutes before expiry

          return () => clearTimeout(checkTimer);
        }
      } catch (error) {
        console.error("Error checking token expiration:", error);
      }
    };

    if (user.isLoggedIn) {
      checkTokenExpiration();
    }
  }, [user.isLoggedIn]);

  // Listen for global logout events (e.g. from api 401 errors)
  useEffect(() => {
    const handleLogoutEvent = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      // The API login response includes the user object with role, name, and id
      const response = await apiLogin(credentials);
      const userData = response.user || response;

      // Handle different response formats
      // Roles are at the top level of response, not in userData
      const userRole = (response.roles && response.roles[0])?.toUpperCase() ||
        (userData.role)?.toUpperCase() ||
        (userData.roles && userData.roles[0])?.toUpperCase();

      if (!userRole) {
        console.error("Login failed: User role not found in response", { response, userData });
        throw new Error("Unable to determine user role. Please contact support.");
      }
      const userName =
        userData.username ||
        (userData.first_name && userData.last_name
          ? `${userData.first_name} ${userData.last_name}`
          : "User");

      // Set user state with verified data
      const newUserState = {
        isLoggedIn: true,
        role: userRole,
        availableRoles: response.roles || [userRole],
        name: userName,
        userId: userData.id,
      };

      setUser(newUserState);
      // Explicitly save to localStorage before reload to avoid race condition
      localStorage.setItem("user", JSON.stringify(newUserState));

      // Navigate to the appropriate dashboard after login
      const dashboardPath = userRole.toLowerCase() === "client"
        ? "/client/dashboard"
        : "/freelancer/dashboard";
        window.location.reload();
        navigate(dashboardPath);
      // window.location.href = dashboardPath;
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
      const newUserState = {
        isLoggedIn: true,
        role: role.toUpperCase(),
        availableRoles: response.roles || [role.toUpperCase()],
        name:
          userData.username || userData.first_name + " " + userData.last_name,
        userId: response.id || response.user?.id,
      };

      setUser(newUserState);
      // Explicitly save to localStorage before reload to avoid race condition
      localStorage.setItem("user", JSON.stringify(newUserState));

      // Navigate to the appropriate dashboard after registration
      const dashboardPath = role.toLowerCase() === "client"
        ? "/client/dashboard"
        : "/freelancer/dashboard";
        window.location.reload();
        navigate(dashboardPath);
      // window.location.href = dashboardPath;
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
    // Only allow switching if user has multiple roles
    if (!user.availableRoles || user.availableRoles.length < 2) {
      console.warn('Only freelancers can switch roles');
      return;
    }

    setIsSwitchingRole(true);

    const newRole =
      user.role?.toUpperCase() === "CLIENT" ? "FREELANCER" : "CLIENT";

    const newUserState = {
      ...user,
      role: newRole,
    };

    setUser(newUserState);
    localStorage.setItem("user", JSON.stringify(newUserState));

    // Navigate to the appropriate dashboard
    const newPath = newRole.toLowerCase() === "client"
      ? "/client/dashboard"
      : "/freelancer/dashboard";

    // Small delay to show loading animation before reload
    setTimeout(() => {
      // Force page reload to refresh entire UI for the new role
      window.location.reload();
    }, 300);
  };

  const updateUser = (updates) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updates };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, error, switchRole, setError, updateUser }}
    >
      {isSwitchingRole && <LoadingOverlay message="Switching role..." />}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
