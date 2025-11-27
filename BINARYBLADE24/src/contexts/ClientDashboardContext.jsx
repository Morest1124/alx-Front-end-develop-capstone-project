import React, { createContext, useState, useEffect } from 'react';
import { getClientDashboard } from '../api';

const ClientDashboardContext = createContext();

const ClientDashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getClientDashboard();
        console.log('Data from getClientDashboard:', data);
        setDashboardData(data); 
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data.");
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    dashboardData,
    loading,
    error,
  };

  return (
    <ClientDashboardContext.Provider value={value}>
      {children}
    </ClientDashboardContext.Provider>
  );
};

export { ClientDashboardContext, ClientDashboardProvider };
