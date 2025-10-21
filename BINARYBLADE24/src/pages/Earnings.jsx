import React, { useContext } from 'react';
import { EarningsContext } from '../contexts/EarningsContext';
import { formatToZAR } from '../utils/currency';

const Earnings = () => {
  const { transactions, totalEarnings } = useContext(EarningsContext);

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-4">Earnings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Total Lifetime Earnings</h3>
          <p className="text-4xl font-bold text-green-600">
            {formatToZAR(totalEarnings, 'ZAR')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">All Transactions</h3>
          <ul>
            {transactions.map((transaction) => {
              return (
                <li key={transaction.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-semibold">{transaction.project}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <p className="font-bold text-green-600">
                    +{formatToZAR(transaction.amount, 'ZAR')}
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