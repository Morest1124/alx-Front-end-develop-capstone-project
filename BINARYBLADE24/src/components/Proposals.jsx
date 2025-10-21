import React, { useState, useEffect } from 'react';

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => {
        setProposals(data.proposals);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching proposals:", error);
        setLoading(false);
      });
  }, []);

  const handleAccept = (id) => {
    alert(`Proposal ${id} accepted`);
    setProposals(
      proposals.map((p) => (p.id === id ? { ...p, status: 'Accepted' } : p))
    );
  };

  const handleDeny = (id) => {
    alert(`Proposal ${id} denied`);
    setProposals(
      proposals.map((p) => (p.id === id ? { ...p, status: 'Denied' } : p))
    );
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Received Proposals</h2>
      <div className="space-y-6">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{proposal.projectTitle}</h3>
              <p className="text-gray-600">From: {proposal.clientName}</p>
              <p className="text-lg font-bold text-gray-800">
                Offer: R{proposal.offer}
              </p>
              <p className="text-gray-500">Status: {proposal.status}</p>
            </div>
            {proposal.status === "Pending" && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAccept(proposal.id)}
                  className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeny(proposal.id)}
                  className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Deny
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proposals;
