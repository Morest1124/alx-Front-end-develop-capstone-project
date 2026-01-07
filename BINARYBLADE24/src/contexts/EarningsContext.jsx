import React, { createContext, useState, useMemo } from 'react';
import MyOrders from '../pages/MyOrders';

const EarningsContext = createContext({
  transactions: [],
  monthlyEarnings: 0,
  totalEarnings: 0,
  monthlyTax: 0,
  TAX_RATE: 0.18,
});

const TAX_RATE = 0.18; // 18%

const Transactions = MyOrders.length===0?[]:MyOrders;


const EarningsProvider = ({ children }) => {
  const [transactions] = useState(Transactions);

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
