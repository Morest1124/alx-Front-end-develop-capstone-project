import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
    getFreelancerProposals,
    getOpenJobs,
    submitProposal,
    getClientProjects,
    getProposalsForProject,
    updateProposalStatus
} from '../api';
import { useRouter } from '../contexts/Routers';
import { useCurrency } from '../contexts/CurrencyContext';
import Loader from '../components/Loader';
import { Briefcase, Send, CheckCircle, XCircle, Clock, FileText, Inbox } from 'lucide-react';

const ProposalsPage = () => {
    const { user } = useContext(AuthContext);
    const { formatPrice } = useCurrency();
    const { navigate } = useRouter();
    const isClient = user?.role?.toUpperCase() === 'CLIENT';
    const [activeTab, setActiveTab] = useState(isClient ? 'received' : 'submitted');

    // Received Proposals (for clients)
    const [receivedProposals, setReceivedProposals] = useState([]);
    const [receivedLoading, setReceivedLoading] = useState(false);
    const [receivedError, setReceivedError] = useState(null);

    // Submitted Proposals (for freelancers)
    const [submittedProposals, setSubmittedProposals] = useState([]);
    const [submittedLoading, setSubmittedLoading] = useState(false);
    const [submittedError, setSubmittedError] = useState(null);

    // Available Work (for freelancers)
    const [availableJobs, setAvailableJobs] = useState([]);
    const [availableLoading, setAvailableLoading] = useState(false);
    const [availableError, setAvailableError] = useState(null);

    // Proposal Modal State
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [thumbnail, setThumbnail] = useState(null); // Add thumbnail state
    const [submitting, setSubmitting] = useState(false);

    const fetchReceivedProposals = async () => {
        try {
            setReceivedLoading(true);
            const myProjects = await getClientProjects();
            // Flatten proposals from all projects
            const allProposals = [];
            for (const project of myProjects) {
                const proposals = await getProposalsForProject(project.id);
                if (Array.isArray(proposals)) {
                    allProposals.push(...proposals);
                }
            }
            setReceivedProposals(allProposals);
            setReceivedError(null);
        } catch (err) {
            console.error("Error fetching received proposals:", err);
            setReceivedError("Failed to fetch proposals.");
        } finally {
            setReceivedLoading(false);
        }
    };

    const fetchSubmittedProposals = async () => {
        if (!user?.user_id && !user?.id) return;
        try {
            setSubmittedLoading(true);
            const userId = user.user_id || user.id;
            const data = await getFreelancerProposals(userId);
            setSubmittedProposals(Array.isArray(data) ? data : []);
            setSubmittedError(null);
        } catch (err) {
            console.error("Error fetching submitted proposals:", err);
            setSubmittedError("Failed to fetch your proposals.");
        } finally {
            setSubmittedLoading(false);
        }
    };

    const fetchAvailableJobs = async () => {
        try {
            setAvailableLoading(true);
            const data = await getOpenJobs();
            const jobs = Array.isArray(data) ? data : (data.results || []);
            // Filter for OPEN GIGS only (freelancer service offerings)
            // In Fiverr model: Freelancers create GIGs, Clients browse and hire
            const openJobs = jobs.filter(job =>
                job.project_type === 'GIG' &&
                job.status === 'OPEN'
            );

            setAvailableJobs(openJobs);
            setAvailableError(null);
        } catch (err) {
            console.error("Error fetching available jobs:", err);
            setAvailableError("Failed to load available jobs.");
        } finally {
            setAvailableLoading(false);
        }
    };

    useEffect(() => {
        if (isClient) {
            if (activeTab === 'received') {
                fetchReceivedProposals();
            }
        } else {
            if (activeTab === 'submitted') {
                fetchSubmittedProposals();
            } else if (activeTab === 'available') {
                fetchAvailableJobs();
            }
        }
    }, [isClient, activeTab, user]);

    const handleSubmitProposal = async (e) => {
        e.preventDefault();
        if (!selectedJob || !coverLetter.trim()) return;
        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append('cover_letter', coverLetter);
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            await submitProposal(selectedJob.id, formData);
            await fetchSubmittedProposals();
            setShowProposalModal(false);
            setSelectedJob(null);
            setCoverLetter('');
            setThumbnail(null);
            alert('Proposal submitted successfully!');
        } catch (err) {
            alert(`Failed to submit proposal: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateProposalStatus = async (proposal, newStatus) => {
        try {
            await updateProposalStatus(proposal.project.id, proposal.id, newStatus);
            await fetchReceivedProposals();
            alert(`Proposal ${newStatus.toLowerCase()} successfully!`);
        } catch (err) {
            alert(`Failed to update proposal: ${err.message}`);
        }
    };

    const openProposalModal = (job) => {
        setSelectedJob(job);
        setShowProposalModal(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACCEPTED': return <CheckCircle className="text-[var(--color-success)]" size={20} />;
            case 'REJECTED': return <XCircle className="text-[var(--color-error)]" size={20} />;
            default: return <Clock className="text-[var(--color-warning)]" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'badge-success';
            case 'REJECTED': return 'badge-error';
            default: return 'badge-warning';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Proposals</h1>
            <p className="text-gray-600 mb-6">
                {isClient
                    ? 'Manage proposals received on your projects'
                    : 'Manage your submitted proposals and discover new work opportunities'}
            </p>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                {isClient ? (
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'received' ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Inbox size={18} className="inline mr-2" />
                        Received ({receivedProposals.length})
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => setActiveTab('submitted')}
                            className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'submitted' ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText size={18} className="inline mr-2" />
                            My Submissions ({submittedProposals.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'available' ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Briefcase size={18} className="inline mr-2" />
                            Available Work
                        </button>
                    </>
                )}
            </div>

            {/* Received Proposals Tab (for Clients) */}
            {isClient && activeTab === 'received' && (
                <div>
                    {receivedLoading ? (
                        <div className="text-center p-8">
                            <Loader size="large" />
                            <p className="mt-4 text-gray-600">Loading received proposals...</p>
                        </div>
                    ) : receivedError ? (
                        <div className="text-center p-8 text-red-500">Error: {receivedError}</div>
                    ) : receivedProposals.length === 0 ? (
                        <div className="text-center p-12 bg-gray-50 rounded-lg">
                            <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 text-lg">You haven't received any proposals yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {receivedProposals.map((proposal) => (
                                <div
                                    key={proposal.id}
                                    className="bg-white rounded-lg shadow-md p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                                {proposal.project.title}
                                            </h3>
                                            <p className="text-gray-600 mb-2">
                                                From: {proposal.freelancer_details?.username || 'Freelancer'}
                                            </p>
                                            <p className="text-gray-700">{proposal.cover_letter}</p>
                                            {proposal.thumbnail && (
                                                <div className="mt-3">
                                                    <img
                                                        src={proposal.thumbnail}
                                                        alt="Proposal Attachment"
                                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            {getStatusIcon(proposal.status)}
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(proposal.status)}`}>
                                                {proposal.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Bid Amount</p>
                                            <p className="text-2xl font-bold text-[var(--color-accent)]">{formatPrice(proposal.bid_amount, 'USD')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Submitted</p>
                                            <p className="text-sm font-medium text-gray-700">
                                                {new Date(proposal.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {proposal.status === 'PENDING' && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleUpdateProposalStatus(proposal, 'ACCEPTED')}
                                                    className="px-6 py-2 bg-[var(--color-success)] text-white rounded-lg hover:opacity-90 transition font-semibold"
                                                >
                                                    <CheckCircle size={18} className="inline mr-2" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateProposalStatus(proposal, 'REJECTED')}
                                                    className="btn-danger"
                                                >
                                                    <XCircle size={18} className="inline mr-2" />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Submitted Proposals Tab (for Freelancers) */}
            {!isClient && activeTab === 'submitted' && (
                <div>
                    {submittedLoading ? (
                        <div className="text-center p-8">
                            <Loader size="large" />
                            <p className="mt-4 text-gray-600">Loading your proposals...</p>
                        </div>
                    ) : submittedError ? (
                        <div className="text-center p-8 text-red-500">Error: {submittedError}</div>
                    ) : submittedProposals.length === 0 ? (
                        <div className="text-center p-12 bg-gray-50 rounded-lg">
                            <Send size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 text-lg">You haven't submitted any proposals yet.</p>
                            <button
                                onClick={() => setActiveTab('available')}
                                className="mt-4 btn-primary"
                            >
                                Browse Available Work
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {submittedProposals.map((proposal) => (
                                <div
                                    key={proposal.id}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/projects/${proposal.project.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{proposal.project.title}</h3>
                                            <p className="text-gray-600 line-clamp-2">{proposal.project.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            {getStatusIcon(proposal.status)}
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(proposal.status)}`}>
                                                {proposal.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-500">Your Bid</p>
                                                <p className="text-2xl font-bold text-[var(--color-accent)]">{formatPrice(proposal.bid_amount, 'USD')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Submitted</p>
                                                <p className="text-sm font-medium text-gray-700">{new Date(proposal.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 mb-1">Cover Letter:</p>
                                            <p className="text-gray-700 line-clamp-2">{proposal.cover_letter}</p>
                                            {proposal.thumbnail && (
                                                <div className="mt-3">
                                                    <img
                                                        src={proposal.thumbnail}
                                                        alt="Proposal Attachment"
                                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Available Work Tab (for Freelancers) */}
            {!isClient && activeTab === 'available' && (
                <div>
                    {availableLoading ? (
                        <div className="text-center p-8">
                            <Loader size="large" />
                            <p className="mt-4 text-gray-600">Loading available jobs...</p>
                        </div>
                    ) : availableError ? (
                        <div className="text-center p-8 text-red-500">Error: {availableError}</div>
                    ) : availableJobs.length === 0 ? (
                        <div className="text-center p-12 bg-gray-50 rounded-lg">
                            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 text-lg">No open jobs available at the moment.</p>
                            <p className="text-gray-500 text-sm mt-2">Check back later for new opportunities!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {availableJobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                            <p className="text-gray-600">{job.description}</p>
                                        </div>
                                        <span className="ml-4 badge-info">GIG</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t pt-4 mt-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Budget</p>
                                            <p className="text-2xl font-bold text-[var(--color-success)]">{formatPrice(job.budget, 'USD')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Deadline</p>
                                            <p className="text-sm font-medium text-gray-700">{new Date(job.deadline).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => openProposalModal(job)}
                                            className="btn-primary"
                                        >
                                            Submit Proposal
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Proposal Submission Modal */}
            {showProposalModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Submit Proposal</h2>
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{selectedJob.description}</p>
                            <p className="text-xl font-bold text-[var(--color-success)] mt-2">{formatPrice(selectedJob.budget, 'USD')}</p>
                        </div>
                        <form onSubmit={handleSubmitProposal}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    required
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    placeholder="Explain why you are the best fit for this project..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Tip: Highlight your relevant experience and explain your approach to the project.
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attach Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setThumbnail(e.target.files[0])}
                                    accept="image/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-accent-light)] file:text-[var(--color-accent)] hover:file:bg-[var(--color-accent-hover)] hover:file:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload a relevant sample or thumbnail for your proposal.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProposalModal(false);
                                        setSelectedJob(null);
                                        setCoverLetter('');
                                        setThumbnail(null);
                                    }}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={submitting || !coverLetter.trim()}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalsPage;
