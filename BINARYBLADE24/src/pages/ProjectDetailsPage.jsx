import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from '../contexts/Routers';
import { formatToZAR } from '../utils/currency';
import { AuthContext } from '../contexts/AuthContext';
import { ShoppingCart, MessageCircle, Check, Star } from 'lucide-react';

import { getProjectDetails, approveProject, createOrder, markOrderPaid } from '../api';

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
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      fetchProjectById(projectId).then(data => {
        setProject(data);
        setIsLoading(false);
      });
    }
  }, [projectId]);

  if (isLoading) {
    return <div className="text-center py-10">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the project you were looking for.</p>
        <button onClick={() => navigate('/')} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
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
                  <div className="mt-2 text-sm text-indigo-600 bg-indigo-50 p-2 rounded">
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
                <span className="font-bold text-green-600">{formatToZAR(project.budget)}</span>
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
                <span className={`font-bold ${project.status === 'OPEN' ? 'text-green-600' :
                  project.status === 'IN_PROGRESS' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                  {project.status}
                </span>
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
                <div className="flex items-center text-blue-500">
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
                className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? 'Approving...' : '✓ Approve Work & Release Payment'}
              </button>
            )}

            {/* Freelancer: Submit Proposal button (Only for Jobs) */}
            {user && user.role?.toUpperCase() === 'FREELANCER' && project.project_type === 'JOB' && project.status === 'OPEN' && (
              <button className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105">
                Submit a Proposal
              </button>
            )}

            {/* Client: Buy Gig & Contact Freelancer (Only for Gigs) */}
            {user && user.role?.toUpperCase() === 'CLIENT' && project.project_type === 'GIG' && (
              <div className="mt-6 space-y-3">
                {/* Buy Gig Button - More Prominent */}
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg text-xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={24} />
                  <span>Buy This Gig</span>
                </button>

                {/* Contact Freelancer Button - Secondary */}
                <button
                  onClick={() => navigate('/messages')} // Or open messaging interface
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 border border-gray-300"
                >
                  <MessageCircle size={20} />
                  <span>Contact Freelancer</span>
                </button>
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
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 hover:border-green-300'
                  }`}
                onClick={() => setSelectedTier('simple')}
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Simple</h3>
                  <p className="text-gray-600 text-sm mb-4">Basic package for simple needs</p>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatToZAR(project.budget)}
                  </div>
                  <p className="text-gray-500 text-sm">Base price</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Standard delivery time</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Basic features</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>1 revision included</span>
                  </li>
                </ul>
              </div>

              {/* Medium Tier */}
              <div
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 relative ${selectedTier === 'medium'
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-green-400 hover:border-green-500'
                  }`}
                onClick={() => setSelectedTier('medium')}
              >
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-semibold">
                  POPULAR
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Medium</h3>
                  <p className="text-gray-600 text-sm mb-4">Enhanced package with more features</p>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatToZAR(project.budget * 1.5)}
                  </div>
                  <p className="text-gray-500 text-sm">+50% from base</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Priority delivery</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Advanced features</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>3 revisions included</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>

              {/* Expert Tier */}
              <div
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${selectedTier === 'expert'
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 hover:border-green-300'
                  }`}
                onClick={() => setSelectedTier('expert')}
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Expert</h3>
                  <p className="text-gray-600 text-sm mb-4">Premium package with all features</p>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatToZAR(project.budget * 2)}
                  </div>
                  <p className="text-gray-500 text-sm">+100% from base</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Express delivery</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Premium features</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Unlimited revisions</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>24/7 priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
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

                    // Step 1: Create the order
                    const orderData = {
                      items_data: [{
                        project_id: project.id,
                        tier: selectedTier.toUpperCase()
                      }]
                    };

                    console.log('Creating order...', orderData);
                    const order = await createOrder(orderData);
                    console.log('Order created:', order);

                    // Step 2: Simulate payment (mark as paid)
                    console.log('Processing payment...');
                    await markOrderPaid(order.id);
                    console.log('Payment successful!');

                    // Step 3: Close modal and show success
                    setShowPricingModal(false);
                    setSelectedTier(null);

                    const prices = {
                      simple: project.budget,
                      medium: project.budget * 1.5,
                      expert: project.budget * 2
                    };

                    alert(
                      `✅ Order Successful!\n\n` +
                      `Order #: ${order.order_number}\n` +
                      `Package: ${selectedTier.toUpperCase()}\n` +
                      `Amount Paid: ${formatToZAR(prices[selectedTier])}\n\n` +
                      `The freelancer has been notified and will start working on your project!`
                    );

                    // Refresh project data
                    const updatedProject = await getProjectDetails(projectId);
                    setProject(updatedProject);

                  } catch (error) {
                    console.error('Checkout failed:', error);
                    alert(`❌ Payment Failed\n\n${error.message || 'Please try again later.'}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={!selectedTier}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Continue to Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
