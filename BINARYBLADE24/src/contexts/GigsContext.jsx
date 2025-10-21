import React, { createContext, useState, useEffect } from 'react';
import { getGigs, createJob } from '../api';

const GigsContext = createContext();

const GigsProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchGigs();
  }, []);

  const addGig = async (gig) => {
    try {
      const newGig = await createJob(gig);
      setGigs([...gigs, newGig]);
    } catch (error) {
      console.error("Error creating gig:", error);
    }
  };

  return (
    <GigsContext.Provider value={{ gigs, loading, addGig }}>
      {children}
    </GigsContext.Provider>
  );
};

export { GigsContext, GigsProvider };