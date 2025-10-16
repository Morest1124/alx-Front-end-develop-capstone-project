import React, { useState } from 'react';

const ProposalForm = () => {
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle proposal submission logic here
    console.log('Proposal submitted:', { description, rate, deliveryTime });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Submit a Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Proposal Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="5"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Rate ($)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estimated Delivery Time (in days)</label>
          <input
            type="number"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Proposal
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;