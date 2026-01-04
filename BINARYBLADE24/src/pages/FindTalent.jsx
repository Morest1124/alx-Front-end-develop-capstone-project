
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PredictiveSearchBar from '../components/PredictiveSearchBar';

const FindTalent = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const fetchFreelancers = async (searchQuery = '') => {
        setLoading(true);
        try {
            // Build query params
            let url = `http://127.0.0.1:8000/api/users/search/?q=${searchQuery}`;
            // Add other filters here if present in state

            const response = await axios.get(url);
            setFreelancers(response.data);
        } catch (error) {
            console.error("Error fetching freelancers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        fetchFreelancers(q);
    }, [location.search]);

    const handleSearch = (query) => {
        // Update URL to reflect search (optional, or just fetch)
        // For better UX, let's update URL so back button works
        const params = new URLSearchParams(location.search);
        if (query) params.set('q', query);
        else params.delete('q');
        window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
        fetchFreelancers(query);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero / Search Section */}
            <div className="bg-white border-b border-gray-100 pt-12 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Find the perfect <span className="text-green-600">talent</span> for your project
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Search through our network of expert freelancers using our advanced predictive search engine.
                    </p>
                    <div className="pt-4">
                        <PredictiveSearchBar onSearch={handleSearch} />
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar (Placeholder) */}
                    <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                                        <option>All Categories</option>
                                        <option>Development</option>
                                        <option>Design</option>
                                        <option>Writing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Hourly Rate</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input type="number" placeholder="Min" className="w-full px-2 py-1 border rounded text-sm" />
                                        <span className="text-gray-400">-</span>
                                        <input type="number" placeholder="Max" className="w-full px-2 py-1 border rounded text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {loading ? 'Searching...' : `${freelancers.length} Freelancers Found`}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Sort by:</span>
                                <select className="text-sm border-none bg-transparent font-medium text-gray-900 focus:ring-0 cursor-pointer">
                                    <option>Recommended</option>
                                    <option>Rating: High to Low</option>
                                    <option>Newest</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse bg-white p-6 rounded-xl shadow-sm h-48"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {freelancers.map((user) => (
                                    <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                                        {/* Avatar Column */}
                                        <div className="flex-shrink-0">
                                            {user.profile?.avatar ? (
                                                <img src={user.profile.avatar} alt={user.username} className="h-24 w-24 rounded-full object-cover border-4 border-gray-50" />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-50">
                                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 hover:text-green-600 cursor-pointer">{user.first_name} {user.last_name}</h3>
                                                    <p className="text-gray-500 font-medium">{user.profile?.title || 'Freelancer'}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                        {user.country_origin || 'Unknown Location'}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-gray-900">${user.profile?.hourly_rate || '0'}/hr</div>
                                                    <div className="flex items-center justify-end text-yellow-400 mt-1">
                                                        <span className="font-bold text-gray-900 mr-1">{user.profile?.rating || '0.0'}</span>
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                        <span className="text-gray-400 text-sm ml-1">({user.profile?.reviews_count || 0})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-gray-600 line-clamp-2">{user.profile?.bio || 'No bio available yet.'}</p>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {user.profile?.skills ? user.profile.skills.split(',').slice(0, 4).map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                        {skill.trim()}
                                                    </span>
                                                )) : (
                                                    <span className="text-xs text-gray-400 italic">No skills listed</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {freelancers.length === 0 && !loading && (
                                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No freelancers found</h3>
                                        <p className="text-gray-500">Try adjusting your search terms or filters.</p>
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
