import React, { createContext, useContext, useState, useEffect } from "react";
import LoadingOverlay from "../components/LoadingOverlay";

// router logic using state for the current view
export const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = () => {
      setIsNavigating(true);
      setCurrentPath(window.location.pathname);
      // Short delay to show loading animation
      setTimeout(() => setIsNavigating(false), 300);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path, state = {}) => {
    setIsNavigating(true);
    window.history.pushState(state, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
    // Short delay to show loading animation
    setTimeout(() => setIsNavigating(false), 300);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, isNavigating }}>
      {isNavigating && <LoadingOverlay message="Loading..." />}
      {children}
    </RouterContext.Provider>
  );
};

// Custom hook to use navigation
export const useRouter = () => useContext(RouterContext);

// Custom Link component for internal navigation
export const Link = ({ to, children, className = "" }) => {
  const { navigate } = useRouter();
  const baseClasses =
    "px-4 py-2 font-medium transition-colors duration-200 rounded-lg";

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </a>
  );
};
