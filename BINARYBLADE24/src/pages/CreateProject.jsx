/**
 * CreateProject Component - Hybrid Marketplace with 3-Level Category Selection
 * 
 * Adapts based on user role:
 * - Freelancers: Create service offerings (Gigs) - Fiverr-style
 * - Clients: Post work requirements (Jobs) - Upwork-style
 * 
 * Features:
 * - 3-Level hierarchical category selection using CategorySelector
 * - Backend automatically sets project_type based on user role
 */

import React, { useState, useContext } from 'react';
import { useRouter } from '../contexts/Routers';
import { AuthContext } from '../contexts/AuthContext';
import { createProject } from '../api';
import CategorySelector from '../components/CategorySelector';

const CreateProject = () => {
    const { user } = useContext(AuthContext);
    const { navigate } = useRouter();

    // Determine if user is a freelancer or client
    const isFreelancer = user?.role === 'freelancer';
    const isClient = user?.role === 'client';

    // Dynamic labels based on role
    const pageTitle = isFreelancer ? 'Create a Gig' : 'Post a Job';
    const titleLabel = isFreelancer ? 'Gig Title' : 'Job Title';
    const descriptionLabel = isFreelancer ? 'What service do you offer?' : 'Job Description';
    const budgetLabel = isFreelancer ? 'Price (R)' : 'Budget (R)';
    const submitButtonText = isFreelancer ? 'Create Gig' : 'Post Job';
    const successMessage = isFreelancer ? 'Gig created successfully!' : 'Job posted successfully!';
    const redirectPath = isFreelancer ? '/freelancer/gigs' : '/client/dashboard';

    const [selectedPath, setSelectedPath] = useState('');
    const [projectDetails, setProjectDetails] = useState({
        title: '',
        description: '',
        budget: '',
        price: '', // Same as budget
        category: '', // Will store subcategory ID
        thumbnail: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Handle category selection from CategorySelector
    const handleCategorySelect = (mainName, subName, subId) => {
        const fullPath = `${mainName} / ${subName}`;
        setSelectedPath(fullPath);
        setProjectDetails(prev => ({ ...prev, category: subId }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectDetails((prev) => ({
            ...prev,
            [name]: value,
            // Keep price in sync with budget
            ...(name === 'budget' ? { price: value } : {})
        }));
    };

    const handleFileChange = (e) => {
        setProjectDetails((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!projectDetails.category) {
            setError('Please select a category');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Create FormData for file upload support
            const formData = new FormData();
            formData.append('title', projectDetails.title);
            formData.append('description', projectDetails.description);
            formData.append('budget', projectDetails.budget);
            formData.append('price', projectDetails.budget); // Same as budget
            formData.append('category', projectDetails.category); // Subcategory ID

            if (projectDetails.thumbnail) {
                formData.append('thumbnail', projectDetails.thumbnail);
            }

            // Backend automatically sets project_type based on user role
            await createProject(formData);

            alert(successMessage);
            navigate(redirectPath);
        } catch (error) {
            console.error('Failed to create project:', error);
            setError(error.message || 'Failed to create. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h2>
                        <p className="text-gray-600 mb-6">
                            {isFreelancer
                                ? 'Showcase your skills and attract clients'
                                : 'Find the perfect freelancer for your project'}
                        </p>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    {titleLabel} *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={projectDetails.title}
                                    onChange={handleChange}
                                    placeholder={isFreelancer ? "e.g., I will design a professional logo" : "e.g., Need a React developer"}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    {descriptionLabel} *
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows="6"
                                    value={projectDetails.description}
                                    onChange={handleChange}
                                    placeholder={isFreelancer
                                        ? "Describe what you offer, your experience, and what's included..."
                                        : "Describe what you need, required skills, deliverables..."}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    required
                                />
                            </div>

                            {/* 3-Level Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <CategorySelector
                                    selectedPath={selectedPath}
                                    onSelect={handleCategorySelect}
                                    label="Select Project Category..."
                                />
                            </div>

                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                                    {budgetLabel} *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">R</span>
                                    <input
                                        type="number"
                                        name="budget"
                                        id="budget"
                                        value={projectDetails.budget}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        required
                                    />
                                </div>
                                {isFreelancer && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        This is the fixed price clients will pay for your service
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                                    {isFreelancer ? 'Gig Image (Optional)' : 'Project Image (Optional)'}
                                </label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    id="thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? 'Creating...' : submitButtonText}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Display selected category */}
                {selectedPath && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-2">✓ Category Selected:</h3>
                        <p className="text-green-800">{selectedPath}</p>
                    </div>
                )}

                {/* Info section */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        {isFreelancer ? '💡 Tip for success:' : '💡 Tip for best results:'}
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        {isFreelancer ? (
                            <>
                                <li>• Choose the most specific category for better visibility</li>
                                <li>• Be specific about what you deliver</li>
                                <li>• Price competitively to attract clients</li>
                                <li>• Use a clear, eye-catching image</li>
                            </>
                        ) : (
                            <>
                                <li>• Select the right category to reach qualified freelancers</li>
                                <li>• Clearly describe your requirements</li>
                                <li>• Set a realistic budget</li>
                                <li>• Include any specific skills needed</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
