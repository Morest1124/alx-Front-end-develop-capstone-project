import React, { useState, useEffect } from 'react';
import { getProposalsForProject, updateProposalStatus } from "../api";

// This component is for a CLIENT to view proposals for one of their projects.
const Proposals = ({ projectId }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        const data = await getProposalsForProject(projectId);
        setProposals(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch proposals.");
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [projectId]); // Re-fetch if the projectId changes

  const handleStatusUpdate = async (proposalId, newStatus) => {
    try {
      // Optimistic UI update
      setProposals(
        proposals.map((p) =>
          p.id === proposalId ? { ...p, status: newStatus } : p
        )
      );
      await updateProposalStatus(proposalId, newStatus);
    } catch (err) {
      // Revert on error
      alert(`Failed to update status: ${err.message}`);
      // To refetch or revert the state more gracefully here
      const originalProposals = await getProposalsForProject(projectId);
      setProposals(originalProposals);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading proposals...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Received Proposals</h2>
      <div className="space-y-6">
        {proposals.length === 0 ? (
          <p className="text-gray-500">
            No proposals have been submitted for this project yet.
          </p>
        ) : (
          proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">
                  Proposal from {proposal.freelancer.username}
                </h3>
                <p className="text-gray-600">{proposal.cover_letter}</p>
                <p className="text-lg font-bold text-gray-800">
                  Offer: R{proposal.bid_amount}
                </p>
                <p className="text-gray-500">Status: {proposal.status}</p>
              </div>
              {proposal.status === "PENDING" && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleStatusUpdate(proposal.id, "ACCEPTED")}
                    className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(proposal.id, "REJECTED")}
                    className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Proposals;
