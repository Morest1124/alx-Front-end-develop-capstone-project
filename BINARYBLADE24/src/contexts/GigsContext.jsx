import React, { createContext, useState, useEffect } from 'react';
import { getProjects, createProject } from '../api';

const GigsContext = createContext();

const GigsProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Removed the standalone fetchGigs function as it's now defined inside useEffect
  // and also called from addGig, which means it needs to be a stable function.
  // Let's re-introduce it as a useCallback or keep it outside if it's called from addGig.
  // Given the instruction, the intent seems to be to move it inside useEffect for initial load.
  // However, addGig also calls fetchGigs. This implies fetchGigs needs to be stable and accessible.

  // Let's keep fetchGigs outside but modify its content as per the instruction.
  // The instruction snippet shows fetchGigs *inside* useEffect, which would make it inaccessible to addGig.
  // To make the change faithfully and syntactically correct, I will apply the filtering logic
  // to the existing fetchGigs function and keep its structure.
  // The instruction's snippet for `loading` state initialization is also incomplete.
  // I will assume the `useState(true)` for loading remains as is.

  const fetchGigs = async () => {
    try {
      setLoading(true);
      let data = await getProjects();
      console.log('Raw API response:', data); // Debug log

      // Handle potential pagination (results array)
      if (!Array.isArray(data) && data.results && Array.isArray(data.results)) {
        console.log('Detected paginated response, using .results');
        data = data.results;
      }

      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        setGigs([]);
        return;
      }

      // Filter to show only GIG type projects (freelancer services)
      // Make it case-insensitive and handle null/undefined
      const gigProjects = data.filter(p => {
        const projectType = p.project_type?.toUpperCase();
        return projectType === 'GIG';
      });
      console.log('Filtered GIG projects:', gigProjects); // Debug log
      setGigs(gigProjects);
    } catch (error) {
      console.error("Error fetching gigs:", error);
      setGigs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const addGig = async (gig) => {
    try {
      const newGig = await createProject(gig);
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