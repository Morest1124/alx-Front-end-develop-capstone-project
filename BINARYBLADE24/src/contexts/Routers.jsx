import React, { createContext, useContext, useState } from 'react';


// router logic using state for the current view
export const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/');
  
  //  navigate function to update the currentPath state
  const navigate = (path) => {
    setCurrentPath(path);
 
  };
  
  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

// Custom hook to use navigation
export const useRouter = () => useContext(RouterContext);

// Custom Link component for internal navigation
export const Link = ({ to, children, className = '' }) => {
  const { navigate } = useRouter();
  const baseClasses = 'px-4 py-2 font-medium transition-colors duration-200 rounded-lg';
  
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={`${baseClasses} ${className}`}>
      {children}
    </a>
  );
};
