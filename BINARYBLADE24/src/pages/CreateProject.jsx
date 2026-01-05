import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
    Plus,
    Info,
    CheckCircle2,
    ChevronRight,
    Image as ImageIcon,
    DollarSign,
    FileText,
    Layers,
    AlertCircle,
    ArrowLeft,
    Rocket,
    X,
    Calendar
} from 'lucide-react';

import { useNavigate as useRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import CategorySelector from '../components/CategorySelector';
import MilestoneManager from '../components/MilestoneManager';
import { createProject, createMilestone } from '../api';
import { useCurrency } from '../contexts/CurrencyContext';

// Mocks removed. Using actual components and API functions.

/**
 * MAIN COMPONENT
 */
const CreateProject = () => {
    const { user } = useContext(AuthContext);
    const { userCurrency, convertPrice, exchangeRates } = useCurrency();
    const router = useRouter(); // useNavigate
    const navigate = (path) => router(path);

    const [selectedPath, setSelectedPath] = useState('');
    const [projectDetails, setProjectDetails] = useState({
        title: '',
        description: '',
        budget: '',
        price: '',
        category: '',
        thumbnail: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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
            ...(name === 'budget' ? { price: value } : {})
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProjectDetails((prev) => ({ ...prev, thumbnail: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectDetails.category && !selectedPath) {
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
            const formData = new FormData();

            // Convert price/budget to USD for backend consistency
            const amountInUSD = convertPrice(projectDetails.budget, userCurrency, 'USD');

            formData.append('title', projectDetails.title);
            formData.append('description', projectDetails.description);
            formData.append('budget', amountInUSD);
            formData.append('price', amountInUSD);
            formData.append('category', projectDetails.category);

            if (projectDetails.thumbnail) {
                formData.append('thumbnail', projectDetails.thumbnail);
            }

            // Determine project type
            const isClient = user.role?.toUpperCase() === 'CLIENT';
            formData.append('project_type', isClient ? 'JOB' : 'GIG');

            const response = await createProject(formData);
            const projectId = response.id || response.data?.id;

            if (!projectId) {
                throw new Error('Project ID not received from server.');
            }

            if (milestones.length > 0) {
                await Promise.all(milestones.map(m => {
                    // Convert milestone amount to USD as well
                    const milestoneAmountInUSD = convertPrice(m.amount, userCurrency, 'USD');
                    return createMilestone({
                        ...m,
                        amount: milestoneAmountInUSD,
                        project: projectId
                    });
                }));
            }

            navigate(isClient ? '/client/projects' : '/freelancer/gigs');
        } catch (err) {
            setError(err.message || 'An error occurred while publishing.');
            console.error('Submit Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isClient = user?.role?.toLowerCase() === 'client';

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={() => router(-1)}
                            className="flex items-center text-slate-500 hover:text-sky-600 text-sm font-medium mb-4 transition-colors group"
                        >
                            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            {isClient ? <FileText className="text-sky-500" /> : <Rocket className="text-sky-500" />}
                            {isClient ? 'Post a New Job' : 'Create Your Gig'}
                        </h1>
                        <p className="mt-2 text-slate-500 text-lg">
                            {isClient
                                ? 'Define your project and find the perfect freelancer to bring it to life.'
                                : 'Set up your service and start attracting clients from around the world.'}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 flex items-center p-4 text-red-800 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-top-4">
                        <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Step 1: Basic Info Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
                            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">1</div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Project Overview</h2>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    {isClient ? 'Job Title' : 'Gig Title'} <span className="text-sky-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={projectDetails.title}
                                    onChange={handleChange}
                                    placeholder={isClient ? "e.g., Need a React Expert for SaaS" : "e.g., I will design a modern minimalist logo"}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                        Category <span className="text-sky-500">*</span>
                                    </label>
                                    <CategorySelector
                                        selectedPath={selectedPath}
                                        onSelect={handleCategorySelect}
                                        label={isClient ? "Select Job Type..." : "Select Service Area..."}
                                    />
                                    {selectedPath && (
                                        <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center">
                                            <CheckCircle2 size={12} className="mr-1" /> Selected: {selectedPath}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                        Price / Budget ({userCurrency}) <span className="text-sky-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-200 pr-3">
                                            {userCurrency}
                                        </div>
                                        <input
                                            type="number"
                                            name="budget"
                                            value={projectDetails.budget}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-20 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none text-slate-900"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    Description <span className="text-sky-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    rows="6"
                                    value={projectDetails.description}
                                    onChange={handleChange}
                                    placeholder="Dive into the details... What are the goals, requirements, and deliverables?"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none text-slate-900 placeholder:text-slate-400 resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Visuals Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
                            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">2</div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Media & Attachments</h2>
                        </div>
                        <div className="p-8">
                            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                                Cover Thumbnail
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    id="thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="thumbnail"
                                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-10 cursor-pointer transition-all ${previewUrl ? 'border-sky-500 bg-sky-50/20' : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50'
                                        }`}
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <p className="text-white text-sm font-bold">Change Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 mb-4 group-hover:scale-110 transition-transform">
                                                <ImageIcon size={32} />
                                            </div>
                                            <p className="text-slate-900 font-bold">Click to upload image</p>
                                            <p className="text-slate-400 text-xs mt-1">PNG, JPG or WebP (Max 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Milestones Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
                            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">3</div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Project Milestones</h2>
                        </div>
                        <div className="p-8">
                            <div className="mb-6 flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <Info className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    Break your project into manageable phases. Each milestone represents a delivery point and a payment trigger.
                                </p>
                            </div>
                            <MilestoneManager
                                milestones={milestones}
                                setMilestones={setMilestones}
                                totalBudget={parseFloat(projectDetails.budget) || 0}
                            />
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                        <div className="text-slate-500 text-sm hidden md:flex items-center">
                            <div className="w-2 h-2 rounded-full bg-sky-500 mr-2 animate-pulse" />
                            All fields marked with * are required to publish.
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => router(-1)}
                                className="flex-1 sm:flex-none px-8 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                            >
                                Save Draft
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none px-12 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-sky-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        {isClient ? 'Publish Job' : 'Publish Gig'}
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Sidebar-style Tips (Bottom) */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm mb-4">
                            <CheckCircle2 size={24} />
                        </div>
                        <h4 className="font-bold text-emerald-900 mb-1">Be Specific</h4>
                        <p className="text-emerald-700 text-xs leading-relaxed">Clear titles and detailed descriptions reduce revision cycles by 40%.</p>
                    </div>
                    <div className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-sm mb-4">
                            <ImageIcon size={24} />
                        </div>
                        <h4 className="font-bold text-sky-900 mb-1">Visual Impact</h4>
                        <p className="text-sky-700 text-xs leading-relaxed">High-quality thumbnails increase click-through rates by up to 3x.</p>
                    </div>
                    <div className="bg-violet-50 p-6 rounded-[2rem] border border-violet-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-violet-500 shadow-sm mb-4">
                            <Layers size={24} />
                        </div>
                        <h4 className="font-bold text-violet-900 mb-1">Milestones</h4>
                        <p className="text-violet-700 text-xs leading-relaxed">Defining milestones builds trust and ensures timely payments.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;