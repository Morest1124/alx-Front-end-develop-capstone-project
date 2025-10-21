import React, { createContext, useState, useEffect, useMemo } from 'react';

const ClientSpendingContext = createContext({
  transactions: [],
  totalSpent: 0,
  loading: true,
});

const mockClientTransactions = [
  { id: 1, project: 'Website Redesign', amount: 2500, date: '2025-10-20' },
  { id: 2, project: 'Mobile App Development', amount: 8000, date: '2025-10-15' },
  { id: 3, project: 'Logo Design for New Brand', amount: 2000, date: '2025-09-10' },
];

const ClientSpendingProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data from an API
  useEffect(() => {
    setLoading(true);
    // Simulate a network delay
    const timer = setTimeout(() => {
      setTransactions(mockClientTransactions);
      setLoading(false);
    }, 500); // 0.5 second delay

    return () => clearTimeout(timer);
  }, []);

  const totalSpent = useMemo(() => {
    return transactions.reduce((total, t) => total + t.amount, 0);
  }, [transactions]);

  const value = {
    transactions,
    totalSpent,
    loading,
  };

  return (
    <ClientSpendingContext.Provider value={value}>
      {children}
    </ClientSpendingContext.Provider>
  );
};

export { ClientSpendingContext, ClientSpendingProvider };
