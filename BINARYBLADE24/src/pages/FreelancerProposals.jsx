import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getFreelancerProposals, getOpenJobs, submitProposal } from '../api';
import { useRouter } from '../contexts/Routers';
import { useCurrency } from '../contexts/CurrencyContext';
import Loader from '../components/Loader';
import { Briefcase, Send, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

const FreelancerProposals = () => {
    const { user } = useContext(AuthContext);
    const { formatPrice } = useCurrency();
    const { navigate } = useRouter();
    const [activeTab, setActiveTab] = useState('submitted');

    const [submittedProposals, setSubmittedProposals] = useState([]);
    const [submittedLoading, setSubmittedLoading] = useState(true);
    const [submittedError, setSubmittedError] = useState(null);

    const [availableJobs, setAvailableJobs] = useState([]);
    const [availableLoading, setAvailableLoading] = useState(false);
    const [availableError, setAvailableError] = useState(null);

    const [showProposalModal, setShowProposalModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [thumbnail, setThumbnail] = useState(null); // Add thumbnail state
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user?.userId) return;
        const fetchSubmittedProposals = async () => {
            try {
                setSubmittedLoading(true);
                const data = await getFreelancerProposals(user.userId);
                setSubmittedProposals(data);
                setSubmittedError(null);
            } catch (err) {
                setSubmittedError(err.message || 'Failed to fetch your proposals.');
                setSubmittedProposals([]);
            } finally {
                setSubmittedLoading(false);
            }
        };
        fetchSubmittedProposals();
    }, [user?.userId]);

    useEffect(() => {
        if (activeTab === 'available' && availableJobs.length === 0) {
            fetchAvailableJobs();
        }
    }, [activeTab]);

    const fetchAvailableJobs = async () => {
        try {
            setAvailableLoading(true);
            const data = await getOpenJobs();
            // Filter for OPEN GIGS (freelancer service offerings in Fiverr model)
            const jobs = data.filter(project => project.project_type === 'GIG' && project.status === 'OPEN');
            setAvailableJobs(jobs);
            setAvailableError(null);
        } catch (err) {
            setAvailableError(err.message || 'Failed to fetch available jobs.');
            setAvailableJobs([]);
        } finally {
            setAvailableLoading(false);
        }
    };

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
            const data = await getFreelancerProposals(user.userId);
            setSubmittedProposals(data);
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

    const openProposalModal = (job) => {
        setSelectedJob(job);
        setShowProposalModal(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACCEPTED': return <CheckCircle className="text-green-600" size={20} />;
            case 'REJECTED': return <XCircle className="text-red-600" size={20} />;
            default: return <Clock className="text-yellow-600" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">My Proposals</h1>
            <p className="text-gray-600 mb-6">Manage your submitted proposals and discover new work opportunities</p>
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('submitted')}
                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'submitted' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FileText size={18} className="inline mr-2" />
                    My Submissions ({submittedProposals.length})
                </button>
                <button
                    onClick={() => setActiveTab('available')}
                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'available' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Briefcase size={18} className="inline mr-2" />
                    Available Work
                </button>
            </div>
            {activeTab === 'submitted' && (
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
                                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
                                                <p className="text-2xl font-bold text-indigo-600">{formatPrice(proposal.bid_amount, 'USD')}</p>
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
            {activeTab === 'available' && (
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
                                        <span className="ml-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">GIG</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t pt-4 mt-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Budget</p>
                                            <p className="text-2xl font-bold text-green-600">{formatPrice(job.budget, 'USD')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Deadline</p>
                                            <p className="text-sm font-medium text-gray-700">{new Date(job.deadline).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => openProposalModal(job)}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
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
            {showProposalModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Submit Proposal</h2>
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{selectedJob.description}</p>
                            <p className="text-xl font-bold text-green-600 mt-2">{formatPrice(selectedJob.budget, 'USD')}</p>
                        </div>
                        <form onSubmit={handleSubmitProposal}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    required
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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

export default FreelancerProposals;
