import React from "react";
import {
  BrowserRouter,
  useLocation,
  useNavigate,
  Link as RouterLink,
} from "react-router-dom";

// RouterProvider now wraps the application in BrowserRouter
export const RouterProvider = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Custom hook to adapt react-router-dom hooks to the existing API
export const useRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return {
    currentPath: location.pathname,
    navigate,
    // Add other properties if needed, e.g., location state
    state: location.state,
  };
};

// Custom Link component for internal navigation
export const Link = ({ to, children, className = "" }) => {
  
  const baseClasses =
    "px-4 py-2 font-medium transition-colors duration-200 rounded-lg";

  return (
    <RouterLink to={to} className={`${baseClasses} ${className}`}>
      {children}
    </RouterLink>
  );
};

