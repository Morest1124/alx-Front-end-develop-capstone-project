import React, { createContext, useState, useEffect } from 'react';
import { getGigs, createJob } from '../api';

const GigsContext = createContext();

const GigsProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGigs = async () => {
    try {
      const gigsData = await getGigs();
      setGigs(gigsData);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const addGig = async (gig) => {
    try {
      const newGig = await createJob(gig);
      await fetchGigs(); // Refresh gigs after creating new one
      return newGig;
    } catch (error) {
      console.error("Error creating gig:", error);
      throw error;
    }
  };

  return (
    <GigsContext.Provider value={{ gigs, loading, addGig, fetchGigs }}>
      {children}
    </GigsContext.Provider>
  );
};

export { GigsContext, GigsProvider };