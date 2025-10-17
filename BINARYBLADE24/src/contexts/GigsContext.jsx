import React, { createContext, useState, useEffect } from 'react';

const GigsContext = createContext();

const GigsProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/db.json')
      .then(response => response.json())
      .then(data => {
        setGigs(data.gigs);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching gigs:", error);
        setLoading(false);
      });
  }, []);

  const addGig = (gig) => {
    // This would be a POST request in a real API
    setGigs([...gigs, { ...gig, id: gigs.length + 1 }]);
  };

  return (
    <GigsContext.Provider value={{ gigs, loading, addGig }}>
      {children}
    </GigsContext.Provider>
  );
};

export { GigsContext, GigsProvider };
