
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PredictiveSearchBar from '../components/PredictiveSearchBar';
import { globalSearch, getCategories, getSearchOptions, getOpenJobs } from '../api';
import Loader from '../components/Loader';
import { formatToZAR } from '../utils/currency';

const FindTalent = () => {
    const [results, setResults] = useState({ freelancers: [], projects: [], categories: [] });
    // Keep filterOptions for ratings, but use separate state for categories
    const [filterOptions, setFilterOptions] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('projects'); // Default to projects (Gigs) only

    // Focused Freelancer Projects (when single result found)
    const [focusedProjects, setFocusedProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    // Filters State
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [selectedRating, setSelectedRating] = useState('');

    // Search State
    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [searchTrigger, setSearchTrigger] = useState(0);

    const location = useLocation();

    // Fetch Filter Options on Mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // Fetch Categories (User Request: /api/projects/categories/)
                const catResponse = await getCategories();
                setCategories(catResponse || []);

                // Fetch other options (ratings, etc.) if needed
                const response = await getSearchOptions();
                setFilterOptions(response || {}); // Also remove .data here if getSearchOptions uses the same client
            } catch (error) {
                console.error("Error fetching search options:", error);
            }
        };
        fetchOptions();
    }, []);

    // Initialize search from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) setActiveSearchTerm(q);
    }, [location.search]);

    // Fetch Freelancer Projects when exactly one freelancer is found
    useEffect(() => {
        const fetchUserProjects = async () => {
            if (results?.freelancers && results.freelancers.length === 1) {
                const freelancer = results.freelancers[0];
                setProjectsLoading(true);
                try {
                    // Fetch projects owned by this freelancer
                    const projects = await getOpenJobs({ client: freelancer.id, project_type: 'GIG' });
                    setFocusedProjects(projects || []);
                } catch (err) {
                    console.error("Error fetching freelancer projects:", err);
                    setFocusedProjects([]);
                } finally {
                    setProjectsLoading(false);
                }
            } else {
                setFocusedProjects([]);
            }
        };

        fetchUserProjects();
    }, [results.freelancers]); // Depend on freelancer list changing

    // Main Search Effect - Triggers on activeSearchTerm or filter changes
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setFocusedProjects([]); // Reset on new search
            try {
                const params = {
                    q: activeSearchTerm,
                    type: activeSearchTerm ? 'all' : 'projects', // Only fetch freelancers if searching
                    project_type: 'GIG', // FindTalent detects GIGS (Freelancer posts)
                    category: selectedCategory,
                    min_price: priceRange.min,
                    max_price: priceRange.max,
                    rating: selectedRating
                };

                // Clean up empty params
                Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

                const response = await globalSearch(params);
                // SAFEGUARD: Ensure structure is always correct to prevent crashes
                setResults({
                    freelancers: response?.freelancers || [],
                    projects: response?.projects || [],
                    categories: response?.categories || []
                });
            } catch (error) {
                console.error("Error fetching results:", error);
                // On error, we might want to clear or keep previous, but let's at least not crash
                setResults({ freelancers: [], projects: [], categories: [] });
            } finally {
                setLoading(false);
            }
        };

        // Debounce small delay to avoid rapid requests during typing if bounded directly
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [activeSearchTerm, activeTab, selectedCategory, selectedRating, searchTrigger]); // added searchTrigger for explicit price apply

    // Handle Search from SearchBar
    const handleSearch = (query) => {
        setActiveSearchTerm(query);
        // Optionally update URL without reloading
        const params = new URLSearchParams(location.search);
        if (query) params.set('q', query);
        else params.delete('q');
        // Use replaceState to avoid cluttering history stack with every keystroke if desired, or pushState for navigation history
        window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    };

    // Handlers for Price Range
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({ ...prev, [name]: value }));
    };

    const applyPriceFilter = () => {
        setSearchTrigger(prev => prev + 1);
    };

    const renderFreelancerCard = (user) => {
        if (!user) return null;
        const profile = user.profile || {};
        return (
            <div key={user.id || Math.random()} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 mb-4">
                <div className="flex-shrink-0">
                    {profile.avatar ? (
                        <img src={profile.avatar} alt={user.username || 'User'} className="h-20 w-20 rounded-full object-cover border-2 border-gray-50" />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold border-2 border-gray-50">
                            {(user.first_name?.[0] || 'U')}{(user.last_name?.[0] || '')}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{user.first_name || 'Unknown'} {user.last_name || ''}</h3>
                            <p className="text-gray-500 text-sm">{profile.title || 'Freelancer'}</p>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-green-600">
                                {profile.hourly_rate ? formatToZAR(profile.hourly_rate) : 'R0.00'}/hr
                            </div>
                            <div className="text-yellow-500 text-sm font-bold flex items-center justify-end">
                                ★ {profile.rating || '0.0'}
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">{profile.bio || 'No bio available'}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {profile.skills ? profile.skills.split(',').slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>
                        )) : null}
                    </div>
                </div>
            </div>
        );
    };

    const renderProjectCard = (project) => {
        if (!project) return null;
        const clientName = project.owner?.username || project.client?.username || 'Unknown';
        const clientInitial = (project.owner?.first_name || project.client?.first_name || 'U').charAt(0);

        return (
            <div
                key={project.id || Math.random()}
                onClick={() => handleViewProject(project)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer"
            >
                {/* Thumbnail Section */}
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={project.title || 'Project'}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                            {project.title?.charAt(0) || "P"}
                        </span>
                    </div>
                )}

                {/* Content Section */}
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                        {project.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{project.description || 'No description'}</p>

                    {/* Owner/Client Info */}
                    <div className="flex items-center mt-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {clientInitial}
                        </div>
                        <p className="ml-2 text-sm text-gray-700">
                            {clientName}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                        <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="text-lg font-bold text-[var(--color-success)]">
                                {project.budget ? formatToZAR(project.budget) : 'R0.00'}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">
                                {project.project_type || 'GIG'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Search Header */}
            <div className="bg-white border-b border-gray-200 pt-8 pb-10 px-4">
                <div className="max-w-5xl mx-auto space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">
                        Find <span className="text-[var(--color-accent)]">Talent</span>
                    </h1>
                    <div className="relative z-10">
                        <PredictiveSearchBar
                            onSearch={handleSearch}
                            placeholder="Search by name or skill..."
                            allowedTypes={['user', 'skill']}
                        />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {/* Tabs removed - defaulting to Freelancers Only */}
                        <h2 className="text-xl text-gray-500 font-medium">Search for Top Freelancers</h2>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

                            {/* Categories */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price / Rate Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {activeTab === 'projects' ? 'Budget Range' : 'Hourly Rate'}
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        name="min"
                                        value={priceRange.min}
                                        onChange={handlePriceChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        placeholder="Min"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        name="max"
                                        value={priceRange.max}
                                        onChange={handlePriceChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                                <button
                                    onClick={applyPriceFilter}
                                    className="mt-2 w-full py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 rounded"
                                >
                                    Apply
                                </button>
                            </div>

                            {/* Ratings Filter (Freelancers only) */}
                            {(activeTab !== 'projects' || (results.freelancers && results.freelancers.length > 0)) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(e.target.value)}
                                    >
                                        <option value="">Any Rating</option>
                                        {filterOptions?.ratings && filterOptions.ratings.map(r => (
                                            <option key={r} value={r}>{r}+ Stars</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        ) : (
                            <div>
                                {/* Categories Match (if any and in 'all' tab) */}
                                {activeTab === 'all' && results?.categories && results.categories.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="font-bold text-gray-800 mb-3">Matching Categories</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {results.categories.map(cat => (
                                                <span key={cat.id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {(activeTab === 'all' || activeTab === 'projects') && results.projects && (
                                    <div className="mb-8">
                                        {(activeTab === 'all' && results.projects.length > 0) && (
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                                                {results.projects.length >= 5 && <button onClick={() => setActiveTab('projects')} className="text-[var(--color-accent)] text-sm font-bold">View All</button>}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {results.projects.length === 0 && activeTab === 'projects' && <p className="text-gray-500 col-span-full">No projects found.</p>}
                                            {results.projects.map(renderProjectCard)}
                                        </div>
                                    </div>
                                )}

                                {/* Freelancers */}
                                {results.freelancers && results.freelancers.length > 0 && (
                                    <div>
                                        {(activeTab === 'all' && results.freelancers.length > 0) && (
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {results.freelancers.length === 1 ? 'Freelancer Profile' : 'Freelancers'}
                                                </h2>
                                                {results.freelancers.length >= 5 && <button onClick={() => setActiveTab('freelancers')} className="text-[var(--color-accent)] text-sm font-bold">View All</button>}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 gap-4">
                                            {results.freelancers.map(renderFreelancerCard)}
                                        </div>

                                        {/* Focused Freelancer Projects Section */}
                                        {results.freelancers.length === 1 && (
                                            <div className="mt-8 pt-8 border-t border-gray-200">
                                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                                    Projects by {results.freelancers[0].first_name}
                                                </h3>
                                                {projectsLoading ? (
                                                    <div className="flex justify-center py-8"><Loader /></div>
                                                ) : focusedProjects.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {focusedProjects.map(renderProjectCard)}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 italic">This freelancer has no active projects.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(!results.projects?.length && !results.freelancers?.length && !results.categories?.length) && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No results found matching your criteria.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindTalent;
