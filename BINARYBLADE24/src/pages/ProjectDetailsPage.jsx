import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from '../contexts/Routers';
import Loader from '../components/Loader';
import { useCurrency } from '../contexts/CurrencyContext';
import { AuthContext } from '../contexts/AuthContext';
import { ShoppingCart, MessageCircle, Check, Star } from 'lucide-react';

import { getProjectDetails, approveProject, createOrder, markOrderPaid, startConversation, recordProjectView, submitProposal } from '../api';

const fetchProjectById = async (id) => {
  try {
    const data = await getProjectDetails(id);
    return data;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
};

const ProjectDetailsPage = ({ projectId }) => {
  const { navigate } = useRouter();
  const { formatPrice } = useCurrency();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  // Proposal Submission States
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      fetchProjectById(projectId).then(data => {
        setProject(data);
        setIsLoading(false);
        // Record the view (impression)
        recordProjectView(projectId).catch(err => console.error("Failed to record view:", err));
      });
    }
  }, [projectId]);

  const handleContact = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Create or get existing conversation
      const conversation = await startConversation(project.id, project.owner_details.id);

      // Navigate to messages with conversation selected
      const messagePath = user.role?.toUpperCase() === 'CLIENT' ? '/client/messages' : '/freelancer/messages';
      navigate(messagePath, { state: { selectedConversationId: conversation.id } });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('cover_letter', coverLetter);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      await submitProposal(project.id, formData);
      alert("Proposal submitted successfully!");

      // Refresh project to update 'user_has_submitted' flag
      const updatedProject = await getProjectDetails(projectId);
      setProject(updatedProject);

      // Close modal and reset
      setShowProposalModal(false);
      setCoverLetter('');
      setThumbnail(null);
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      alert(error.response?.data?.detail || error.response?.data?.message || "Failed to submit proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the project you were looking for.</p>
        <button onClick={() => navigate('/')} className="btn-primary py-2 px-4">
          &larr; Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 bg-white rounded-lg shadow-lg mt-6">
      <button onClick={() => navigate(-1)} className="mb-6 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
        &larr; Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <img src={project.thumbnail} alt={project.title} className="w-full h-auto object-cover rounded-lg shadow-md" style={{ maxHeight: '450px' }} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
          <p className="text-gray-700 text-lg">
            This is a placeholder for the full project description. It would detail the project's goals, scope, required skills, and other relevant information for potential freelancers.
          </p>
        </div>

        {/* Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Details</h2>

            <div className="flex items-center mb-4">
              <img src={project.thumbnail || "https://via.placeholder.com/150"} alt={project.owner_details?.username || "User"} className="w-12 h-12 rounded-full mr-4 object-cover" />
              <div>
                <p className="font-bold text-gray-800">
                  {project.owner_details?.first_name
                    ? `${project.owner_details.first_name} ${project.owner_details.last_name}`
                    : (project.owner_details?.username || "Unknown User")}
                </p>
                <p className="text-sm text-gray-600">
                  {project.project_type === 'GIG' ? 'Freelancer' : 'Client'}
                </p>
                {/* Revealed Contact Info */}
                {project.owner_details?.email && (
                  <div className="mt-2 text-sm text-[var(--color-accent)] bg-[var(--color-accent-light)] p-2 rounded">
                    <p><strong>Email:</strong> {project.owner_details.email}</p>
                    {project.owner_details.phone_number && (
                      <p><strong>Phone:</strong> {project.owner_details.phone_number}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Budget:</span>
                <span className="font-bold text-[var(--color-success)]">{formatPrice(project.budget, 'USD')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Deadline:</span>
                <span>
                  {project.delivery_days
                    ? new Date(project.delivery_days).toLocaleDateString()
                    : 'Flexible'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`font-bold ${project.status === 'OPEN' ? 'text-[var(--color-success)]' :
                  project.status === 'IN_PROGRESS' ? 'text-[var(--color-info)]' : 'text-gray-600'
                  }`}>
                  {project.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Views:</span>
                <span className="text-gray-600">{project.view_count || 0}</span>
              </div>
              {/* Gig Rating */}
              <div className="flex justify-between items-center">
                <span className="font-medium">Gig Rating:</span>
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(project.average_rating || 0) ? 'fill-current' : 'text-gray-300 fill-none'}`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({project.review_count || 0})
                  </span>
                </div>
              </div>

              {/* Freelancer Rating */}
              <div className="flex justify-between items-center">
                <span className="font-medium">Freelancer Rating:</span>
                <div className="flex items-center text-[var(--color-info)]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(project.owner_details?.avg_rating || 0) ? 'fill-current' : 'text-gray-300 fill-none'}`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({project.owner_details?.avg_rating || 'New'})
                  </span>
                </div>
              </div>
            </div>

            {/* Client-only: Approve Work button for IN_PROGRESS projects */}
            {user && user.role?.toUpperCase() === 'CLIENT' && project.status === 'IN_PROGRESS' && (
              <button
                onClick={async () => {
                  if (window.confirm('Approve this work and release payment to the freelancer?')) {
                    setIsApproving(true);
                    try {
                      await approveProject(projectId);
                      alert('Work approved! Payment released to freelancer.');
                      // Refresh project data
                      const updatedProject = await getProjectDetails(projectId);
                      setProject(updatedProject);
                    } catch (error) {
                      alert(error.message || 'Failed to approve work.');
                    } finally {
                      setIsApproving(false);
                    }
                  }
                }}
                disabled={isApproving}
                className="mt-6 w-full btn-success py-3 text-lg font-semibold transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? 'Approving...' : '✓ Approve Work & Release Payment'}
              </button>
            )}

            {/* Freelancer: Submit Proposal & Contact Client (Only for Jobs) */}
            {user && user.role?.toUpperCase() === 'FREELANCER' && project.project_type === 'JOB' && project.status === 'OPEN' && (
              <div className="mt-6 space-y-3">
                {project.owner_details?.id !== (user.userId || user.id) ? (
                  <>
                    {project.user_has_submitted ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-medium">
                        ✓ You have already submitted a proposal for this project.
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowProposalModal(true)}
                        className="w-full btn-primary py-3 text-lg font-semibold transition-transform transform hover:scale-105"
                      >
                        Submit a Proposal
                      </button>
                    )}

                    <button
                      onClick={handleContact}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 border border-gray-300"
                    >
                      <MessageCircle size={20} />
                      <span>Contact Client</span>
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-center">
                    This is your job listing. You cannot submit proposals to it.
                  </div>
                )}
              </div>
            )}

            {/* Client: Buy Gig & Contact Freelancer (Only for Gigs) */}
            {user && user.role?.toUpperCase() === 'CLIENT' && project.project_type === 'GIG' && (
              <div className="mt-6 space-y-3">
                {project.owner_details?.id !== (user.userId || user.id) ? (
                  <>
                    {/* Buy Gig Button - More Prominent */}
                    <button
                      onClick={() => setShowPricingModal(true)}
                      className="w-full bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-hover)] text-white py-4 rounded-lg text-xl font-bold hover:from-[var(--color-success-hover)] hover:to-[var(--color-success)] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={24} />
                      <span>Buy This Gig</span>
                    </button>

                    {/* Contact Freelancer Button - Secondary */}
                    <button
                      onClick={handleContact}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 border border-gray-300"
                    >
                      <MessageCircle size={20} />
                      <span>Contact Freelancer</span>
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-center">
                    This is your gig listing. You cannot purchase it.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Tier Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Select Your Package</h2>
              <button
                onClick={() => {
                  setShowPricingModal(false);
                  setSelectedTier(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Simple Tier */}
              <div
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${selectedTier === 'simple'
                  ? 'border-[var(--color-success)] bg-[var(--color-success-light)] shadow-lg'
                  : 'border-gray-200 hover:border-[var(--color-success-light)]'
                  }`}
                onClick={() => setSelectedTier('simple')}
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Simple</h3>
                  <p className="text-gray-600 text-sm mb-4">Basic package for simple needs</p>
                  <div className="text-4xl font-bold text-[var(--color-success)] mb-2">
                    {formatPrice(project.budget, 'USD')}
                  </div>
                  <p className="text-gray-500 text-sm">Base price</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Standard delivery time</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Basic features</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>1 revision included</span>
                  </li>
                </ul>
              </div>

              {/* Medium Tier */}
              <div
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 relative ${selectedTier === 'medium'
                  ? 'border-[var(--color-success)] bg-[var(--color-success-light)] shadow-lg'
                  : 'border-[var(--color-success-light)] hover:border-[var(--color-success)]'
                  }`}
                onClick={() => setSelectedTier('medium')}
              >
                <div className="absolute top-0 right-0 bg-[var(--color-success)] text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-semibold">
                  POPULAR
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Medium</h3>
                  <p className="text-gray-600 text-sm mb-4">Enhanced package with more features</p>
                  <div className="text-4xl font-bold text-[var(--color-success)] mb-2">
                    {formatPrice(project.budget * 1.5, 'USD')}
                  </div>
                  <p className="text-gray-500 text-sm">+50% from base</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Priority delivery</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Advanced features</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>3 revisions included</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>

              {/* Expert Tier */}
              <div
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${selectedTier === 'expert'
                  ? 'border-[var(--color-success)] bg-[var(--color-success-light)] shadow-lg'
                  : 'border-gray-200 hover:border-[var(--color-success-light)]'
                  }`}
                onClick={() => setSelectedTier('expert')}
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Expert</h3>
                  <p className="text-gray-600 text-sm mb-4">Premium package with all features</p>
                  <div className="text-4xl font-bold text-[var(--color-success)] mb-2">
                    {formatPrice(project.budget * 2, 'USD')}
                  </div>
                  <p className="text-gray-500 text-sm">+100% from base</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Express delivery</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Premium features</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Unlimited revisions</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>24/7 priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-[var(--color-success)] mr-2 mt-1 flex-shrink-0" />
                    <span>Source files included</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowPricingModal(false);
                  setSelectedTier(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedTier) {
                    alert('Please select a package tier');
                    return;
                  }

                  try {
                    setIsLoading(true);

                    // Step 1: Create the order (PENDING status)
                    const orderData = {
                      items_data: [{
                        project_id: project.id,
                        tier: selectedTier.toUpperCase()
                      }]
                    };

                    console.log('Creating order...', orderData);
                    const order = await createOrder(orderData);
                    console.log('Order created:', order);

                    // Step 2: Close modal
                    setShowPricingModal(false);
                    setSelectedTier(null);

                    // Step 3: Redirect to Payment Simulator for approval
                    const prices = {
                      simple: project.budget,
                      medium: project.budget * 1.5,
                      expert: project.budget * 2
                    };

                    // Store order info in sessionStorage for payment simulator
                    sessionStorage.setItem('pendingOrder', JSON.stringify({
                      orderId: order.id,
                      orderNumber: order.order_number,
                      amount: prices[selectedTier],
                      tier: selectedTier.toUpperCase(),
                      gigTitle: project.title,
                      freelancer: project.owner_details?.first_name + ' ' + project.owner_details?.last_name
                    }));

                    // Navigate to payment simulator
                    navigate('/payment-simulator');

                  } catch (error) {
                    console.error('Checkout failed:', error);
                    alert(`Order Creation Failed\n\n${error.message || 'Please try again later.'}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={!selectedTier || isLoading}
                className="px-8 py-3 btn-success rounded-lg transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader size="small" color="white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Continue to Checkout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Submission Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit Your Proposal</h2>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-lg text-blue-900">{project.title}</h3>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Project Budget</p>
                  <p className="text-2xl font-bold text-blue-900">{formatPrice(project.budget, 'USD')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Client</p>
                  <p className="font-medium text-blue-900">{project.owner_details?.first_name} {project.owner_details?.last_name}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all resize-none"
                  placeholder="Explain why you are the best fit for this project. Highlight your relevant skills and approach..."
                />
                <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                  <span>💡</span>
                  A great cover letter focuses on the client's needs and how you can solve their problem.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attach Sample or Thumbnail (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[var(--color-accent)] transition-colors cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-accent)]">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) => setThumbnail(e.target.files[0])}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  {thumbnail && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="text-green-600" size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{thumbnail.name}</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThumbnail(null);
                            }}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="w-full sm:w-1/2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-1/2 btn-primary py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={submitting || !coverLetter.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader size="small" color="white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Proposal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
