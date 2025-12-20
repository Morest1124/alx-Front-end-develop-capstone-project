import React, { useState, useContext } from 'react';
import { useRouter } from '../contexts/Routers';
import { AuthContext } from '../contexts/AuthContext';
import CategorySelector from '../components/CategorySelector';
import MilestoneManager from '../components/MilestoneManager';
import { createProject, createMilestone } from '../api';
import { useCurrency } from '../contexts/CurrencyContext';

/**
 * CreateProject Component - Gig Creation for Freelancers
 * 
 * Pure Fiverr Model:
 * - ONLY Freelancers can create gigs (service offerings)
 * - Accessed via /freelancer/create-gig route
 * - Clients browse and purchase gigs, they don't post jobs
 */

const CreateProject = () => {
    // 1. Context and Hooks
    const { user } = useContext(AuthContext);
    const { navigate } = useRouter();
    const { formatPrice, userCurrency, exchangeRates, convertPrice } = useCurrency();

    // 2. State Management
    const [selectedPath, setSelectedPath] = useState('');
    const [projectDetails, setProjectDetails] = useState({
        title: '',
        description: '',
        budget: '',
        price: '', // Same as budget for simplicity
        category: '', // Stores subcategory ID
        thumbnail: null,
    });
    const [milestones, setMilestones] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // 3. Handlers

    // Handle 3-Level category selection
    const handleCategorySelect = (mainName, subName, subId) => {
        const fullPath = `${mainName} / ${subName}`;
        setSelectedPath(fullPath);
        setProjectDetails(prev => ({ ...prev, category: subId }));
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectDetails((prev) => ({
            ...prev,
            [name]: value,
            // Keep price in sync with budget
            ...(name === 'budget' ? { price: value } : {})
        }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setProjectDetails((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!projectDetails.category) {
            setError('Please select a category.');
            return;
        }
        if (!projectDetails.title || !projectDetails.description || !projectDetails.budget) {
            setError('Please fill out all required fields.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Convert Price from User Currency to USD (Base Currency)
            // Backend expects USD
            let budgetInUSD = projectDetails.budget;
            if (userCurrency !== 'USD') {
                // Inverse calculation: UserValue / Rate = BaseValue
                // Because convertPrice does: BaseValue * Rate = UserValue
                if (exchangeRates[userCurrency]) {
                    budgetInUSD = parseFloat(projectDetails.budget) / exchangeRates[userCurrency];
                }
            }

            // Prepare FormData for API call
            const formData = new FormData();
            formData.append('title', projectDetails.title);
            formData.append('description', projectDetails.description);
            formData.append('budget', budgetInUSD);
            formData.append('price', budgetInUSD);
            formData.append('category', projectDetails.category);

            if (projectDetails.thumbnail) {
                formData.append('thumbnail', projectDetails.thumbnail);
            }

            // 1. Create the gig
            const newProject = await createProject(formData);

            // 2. Create milestones if any were added
            if (milestones.length > 0 && newProject.id) {
                const milestonePromises = milestones.map(milestone => {
                    return createMilestone({
                        project: newProject.id,
                        title: milestone.title,
                        description: milestone.description,
                        amount: milestone.amount,
                        due_date: milestone.due_date,
                        status: 'PENDING'
                    });
                });
                await Promise.all(milestonePromises);
            }

            // Success feedback and redirection
            alert(`${user.role?.toLowerCase() === 'client' ? 'Project' : 'Gig'} created successfully!`);
            navigate(user.role?.toLowerCase() === 'client' ? '/client/projects' : '/freelancer/gigs');
        } catch (error) {
            console.error('Failed to create gig:', error);
            setError(error.message || 'Failed to create gig. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 4. Render
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {user.role?.toLowerCase() === 'client' ? 'Post a Job' : 'Create a Gig'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {user.role?.toLowerCase() === 'client'
                                ? 'Describe your project requirements and find the best talent'
                                : 'Showcase your skills and attract clients'}
                        </p>

                        {error && (
                            <div className="mb-6 bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Field */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    {user.role?.toLowerCase() === 'client' ? 'Project Title *' : 'Gig Title *'}
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={projectDetails.title}
                                    onChange={handleChange}
                                    placeholder={user.role?.toLowerCase() === 'client' ? "e.g., Need a React Developer for Dashboard" : "e.g., I will design a professional logo"}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
                                    required
                                />
                            </div>

                            {/* Description Field */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    {user.role?.toLowerCase() === 'client' ? 'Project Description *' : 'What service do you offer? *'}
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows="6"
                                    value={projectDetails.description}
                                    onChange={handleChange}
                                    placeholder="Describe what you offer, your experience, and what's included..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
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
                                    label={user.role?.toLowerCase() === 'client' ? "Select Project Category..." : "Select Gig Category..."}
                                />
                            </div>

                            {/* Price Field */}
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ({userCurrency}) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">{userCurrency}</span>
                                    <input
                                        type="number"
                                        name="budget"
                                        id="budget"
                                        value={projectDetails.budget}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Enter the price in your local currency. It will be converted to USD for processing.
                                </p>
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                                    {user.role?.toLowerCase() === 'client' ? 'Project Image (Optional)' : 'Gig Image (Optional)'}
                                </label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    id="thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-accent-light)] file:text-[var(--color-accent)] hover:file:bg-[var(--color-accent-hover)] hover:file:text-white transition-colors"
                                />
                            </div>

                            {/* Milestone Manager */}
                            <div className="border-t pt-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {user.role?.toLowerCase() === 'client' ? 'Project Milestones (Optional)' : 'Gig Milestones (Optional)'}
                                </h3>
                                <MilestoneManager
                                    milestones={milestones}
                                    setMilestones={setMilestones}
                                    totalBudget={parseFloat(projectDetails.budget) || 0}
                                />
                            </div>

                            {/* Submit Buttons */}
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
                                    className="px-8 py-2 btn-primary focus:ring-4 focus:ring-[var(--color-accent-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? 'Creating...' : (user.role?.toLowerCase() === 'client' ? 'Post Project' : 'Create Gig')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Display selected category */}
                {selectedPath && (
                    <div className="mt-6 bg-[var(--color-success-light)] border border-[var(--color-success)] rounded-lg p-4">
                        <h3 className="font-semibold text-[var(--color-success)] mb-2">✓ Category Selected:</h3>
                        <p className="text-[var(--color-success)]">{selectedPath}</p>
                    </div>
                )}

                {/* Tips section */}
                <div className="mt-6 bg-[var(--color-info-light)] border border-[var(--color-info)] rounded-lg p-4">
                    <h3 className="font-semibold text-[var(--color-info)] mb-2">
                        💡 Tips for success:
                    </h3>
                    <ul className="text-sm text-[var(--color-info)] space-y-1">
                        <li>• Choose the most specific category for better visibility.</li>
                        <li>• Be specific about what you deliver.</li>
                        <li>• Price competitively to attract clients.</li>
                        <li>• Use a clear, eye-catching image.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;