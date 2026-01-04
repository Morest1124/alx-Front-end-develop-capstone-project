
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PredictiveSearchBar from '../components/PredictiveSearchBar';
import { globalSearch, getCategories, getSearchOptions } from '../api';
import Loader from '../components/Loader';
import { formatToZAR } from '../utils/currency';

const FindTalent = () => {
    const [results, setResults] = useState({ freelancers: [], projects: [], categories: [] });
    // Keep filterOptions for ratings, but use separate state for categories
    const [filterOptions, setFilterOptions] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // Default to all (freelancers + projects)

    // Filters State
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [selectedRating, setSelectedRating] = useState('');

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

    // Fetch Search Results
    const fetchResults = async (searchQuery = '') => {
        setLoading(true);
        try {
            const params = {
                q: searchQuery,
                type: activeTab,
                project_type: 'GIG', // FindTalent detects GIGS (Freelancer posts)
                category: selectedCategory,
                min_price: priceRange.min,
                max_price: priceRange.max,
                rating: selectedRating
            };

            // Clean up empty params
            Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

            const response = await globalSearch(params);
            setResults(response || { freelancers: [], projects: [], categories: [] });
        } catch (error) {
            console.error("Error fetching results:", error);
            // Don't set empty results on error, keep previous or set specific error state
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when params change
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        fetchResults(q);
    }, [location.search, activeTab, selectedCategory, selectedRating]); // removed priceRange to avoid fetch on every slide, maybe add debounce for it

    const handleSearch = (query) => {
        const params = new URLSearchParams(location.search);
        if (query) params.set('q', query);
        else params.delete('q');
        window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
        fetchResults(query);
    };

    // Handlers for Price Range (Debounce logic could be added here)
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({ ...prev, [name]: value }));
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(location.search);
        fetchResults(params.get('q') || '');
    };

    const renderFreelancerCard = (user) => (
        <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 mb-4">
            <div className="flex-shrink-0">
                {user.profile?.avatar ? (
                    <img src={user.profile.avatar} alt={user.username} className="h-20 w-20 rounded-full object-cover border-2 border-gray-50" />
                ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold border-2 border-gray-50">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
                        <p className="text-gray-500 text-sm">{user.profile?.title || 'Freelancer'}</p>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-green-600">{formatToZAR(user.profile?.hourly_rate || 0)}/hr</div>
                        <div className="text-yellow-500 text-sm font-bold flex items-center justify-end">
                            ★ {user.profile?.rating || '0.0'}
                        </div>
                    </div>
                </div>
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">{user.profile?.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {user.profile?.skills?.split(',').slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderProjectCard = (project) => (
        <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.title}</h3>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">{project.project_type}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description}</p>
            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                <div className="text-green-600 font-bold">{formatToZAR(project.budget)}</div>
                <div className="text-xs text-gray-500">Posted by {project.client?.first_name}</div>
            </div>
        </div>
    );

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
                            {activeTab !== 'projects' && (
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
                                        <div>
                                            {results.projects.length === 0 && activeTab === 'projects' && <p className="text-gray-500">No projects found.</p>}
                                            {results.projects.map(renderProjectCard)}
                                        </div>
                                    </div>
                                )}

                                {/* Freelancers */}
                                {(activeTab === 'all' || activeTab === 'freelancers') && results.freelancers && (
                                    <div>
                                        {(activeTab === 'all' && results.freelancers.length > 0) && (
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-xl font-bold text-gray-900">Freelancers</h2>
                                                {results.freelancers.length >= 5 && <button onClick={() => setActiveTab('freelancers')} className="text-[var(--color-accent)] text-sm font-bold">View All</button>}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 gap-4">
                                            {results.freelancers.length === 0 && activeTab === 'freelancers' && <p className="text-gray-500">No freelancers found.</p>}
                                            {results.freelancers.map(renderFreelancerCard)}
                                        </div>
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
