import React from 'react';
import { convertToZAR } from '../utils/currency';

const Earnings = () => {
  // Mock data for earnings in USD
  const earningsData = {
    totalEarnings: 4500,
    recentTransactions: [
      { id: 1, project: 'E-commerce Website', amount: 1500, date: '2023-10-20' },
      { id: 2, project: 'Mobile App Design', amount: 2000, date: '2023-10-15' },
      { id: 3, project: 'Logo Design', amount: 1000, date: '2023-10-10' },
    ],
  };

  const totalEarningsInZAR = convertToZAR(earningsData.totalEarnings, 'USD');

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-4">Earnings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Total Earnings</h3>
          <p className="text-4xl font-bold text-green-600">
            {totalEarningsInZAR ? `R${totalEarningsInZAR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${earningsData.totalEarnings.toLocaleString()}`}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Recent Transactions</h3>
          <ul>
            {earningsData.recentTransactions.map((transaction) => {
              const amountInZAR = convertToZAR(transaction.amount, 'USD');
              return (
                <li key={transaction.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-semibold">{transaction.project}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <p className="font-bold text-green-600">
                    {amountInZAR ? `+R${amountInZAR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `+$${transaction.amount.toLocaleString()}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Earnings;