import React, { createContext, useState, useMemo } from 'react';

const EarningsContext = createContext({
  transactions: [],
  monthlyEarnings: 0,
  totalEarnings: 0,
  monthlyTax: 0,
  TAX_RATE: 0.18,
});

const TAX_RATE = 0.18; // 18%

const mockTransactions = [
  { id: 1, project: 'E-commerce Website', amount: 25000, date: '2025-10-20' },
  { id: 2, project: 'Mobile App Design', amount: 35000, date: '2025-10-15' },
  { id: 3, project: 'Logo Design', amount: 17000, date: '2025-10-10' },
  { id: 4, project: 'Marketing Campaign', amount: 15000, date: '2025-09-25' },
  { id: 5, project: 'API Integration', amount: 28000, date: '2025-09-18' },
];

const EarningsProvider = ({ children }) => {
  const [transactions] = useState(mockTransactions);

  const monthlyEarnings = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      })
      .reduce((total, t) => total + t.amount, 0);
  }, [transactions]);

  const totalEarnings = useMemo(() => {
    return transactions.reduce((total, t) => total + t.amount, 0);
  }, [transactions]);

  const monthlyTax = useMemo(() => {
    return monthlyEarnings * TAX_RATE;
  }, [monthlyEarnings]);

  const value = {
    transactions,
    monthlyEarnings,
    totalEarnings,
    monthlyTax,
    TAX_RATE,
  };

  return (
    <EarningsContext.Provider value={value}>
      {children}
    </EarningsContext.Provider>
  );
};

export { EarningsContext, EarningsProvider };
