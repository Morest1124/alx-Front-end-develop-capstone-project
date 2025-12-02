import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useRouter } from "../contexts/Routers";
import { getPublicProposals } from "../api";
import { formatToZAR } from "../utils/currency";
import Loader from "./Loader";

// Card component for displaying a single proposal
const ProposalCard = ({ proposal, handleViewProposal }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      onClick={() => handleViewProposal(proposal)}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {proposal.project?.thumbnail && (
        <img
          src={proposal.project.thumbnail}
          alt={proposal.project.title}
          className="w-full h-48 object-cover"
        />
      )}
      {!proposal.project?.thumbnail && (
        <div className="w-full h-48 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {proposal.project?.title?.charAt(0) || "P"}
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
          {proposal.project?.title || "Untitled Project"}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {proposal.cover_letter || "No description provided"}
        </p>

        {/* Freelancer Info */}
        {proposal.freelancer && (
          <div className="flex items-center mt-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-semibold">
              {proposal.freelancer.first_name?.charAt(0) || 'F'}
            </div>
            <p className="ml-2 text-sm text-gray-700">
              {proposal.freelancer.first_name} {proposal.freelancer.last_name}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-lg font-bold text-[var(--color-success)]">
              {formatToZAR(proposal.bid_amount || proposal.project?.budget)}
            </p>
          </div>
          <div className="text-right">
            <span className="badge-info">
              {proposal.status || "PENDING"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FindWork = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { navigate } = useRouter();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        console.log('Fetching public proposals for Find Work...');
        const proposalsData = await getPublicProposals();
        console.log('Proposals fetched:', proposalsData);
        setProposals(proposalsData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
        setError(error.message || "Failed to load proposals");
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleViewProposal = (proposal) => {
    // Navigate to project details page
    if (proposal.project?.id) {
      navigate(`/projects/${proposal.project.id}`);
    }
  };

  const filteredProposals = proposals.filter((proposal) =>
    proposal.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.cover_letter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2">Find Work - Browse Proposals</h2>
        <p className="text-gray-600 mb-4">
          Browse {proposals.length} available {proposals.length === 1 ? 'proposal' : 'proposals'} from clients
        </p>
        <input
          type="text"
          placeholder="Search for proposals..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProposals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? `No proposals found matching "${searchTerm}"`
              : "No proposals available at the moment. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} handleViewProposal={handleViewProposal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindWork;
