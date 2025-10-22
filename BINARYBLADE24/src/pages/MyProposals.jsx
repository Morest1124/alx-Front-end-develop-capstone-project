import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getFreelancerProposals } from '../api';
import PageWrapper from './PageWrapper';

const MyProposals = () => {
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        const data = await getFreelancerProposals(user.id);
        setProposals(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch your proposals.");
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user?.id]);

  if (loading) {
    return (
      <PageWrapper title="My Proposals">
        <div className="text-center p-8">Loading your proposals...</div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="My Proposals">
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Submitted Proposals">
      <div className="space-y-6">
        {proposals.length === 0 ? (
          <p className="text-gray-500">You have not submitted any proposals yet.</p>
        ) : (
          proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold">Project: {proposal.project.title}</h3>
              <p className="text-lg font-bold text-gray-800">
                Your Offer: R{proposal.bid_amount}
              </p>
              <p className="text-gray-500">Status: {proposal.status}</p>
              <p className="text-gray-600 mt-2">Your Cover Letter: {proposal.cover_letter}</p>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
};

export default MyProposals;
