import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Users,
    Search,
    Filter,
    ChevronDown,
    X,
    Compass,
    Sparkles,
    Star,
    MapPin,
    Clock,
    DollarSign,
    ArrowRight,
    LayoutGrid,
    List,
    TrendingUp,
    Briefcase
} from "lucide-react";
import PredictiveSearchBar from '../components/PredictiveSearchBar';
import { globalSearch, getCategories, getSearchOptions, getOpenJobs } from '../api';
import Loader from '../components/Loader';
import { useCurrency } from "../contexts/CurrencyContext";
import { useRouter } from "../contexts/Routers";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

// --- FreelancerCard Component ---
const FreelancerCard = ({ user }) => {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
    const { formatPrice } = useCurrency();
    const profile = user.profile || {};

    return (
        <div
            ref={ref}
            className={`group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col ${isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
        >
            <div className="relative h-32 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    {profile.avatar ? (
                        <img src={profile.avatar} alt={user.username} className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-black border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-16 p-6 text-center flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-sky-600 transition-colors">
                    {user.first_name} {user.last_name}
                </h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">
                    {profile.title || 'Freelancer'}
                </p>

                <div className="flex items-center justify-center gap-1 mb-6">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-slate-700">{profile.rating || '5.0'}</span>
                    <span className="text-xs text-slate-400 font-bold">(24 reviews)</span>
                </div>

                <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10 leading-relaxed font-medium">
                    {profile.bio || "No bio available for this talent."}
                </p>

                <div className="mt-auto flex flex-wrap justify-center gap-2 mb-6">
                    {profile.skills ? profile.skills.split(',').slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-tighter">
                            {skill.trim()}
                        </span>
                    )) : null}
                </div>

                <div className="flex justify-between items-end pt-5 border-t border-slate-50">
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Rate</span>
                        <span className="text-lg font-black text-slate-900">
                            {formatPrice(profile.hourly_rate || 0)}<span className="text-xs text-slate-400">/hr</span>
                        </span>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-200 transition-all duration-300">
                        Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ProjectCard Component ---
const GigCard = ({ project }) => {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
    const { formatPrice } = useCurrency();
    const { navigate } = useRouter();

    return (
        <div
            ref={ref}
            onClick={() => project.id && navigate(`/projects/${project.id}`)}
            className={`group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden ${isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
        >
            <div className="relative h-48 overflow-hidden">
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <Briefcase size={40} className="text-white/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                        {project.project_type || 'GIG'}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
                    {project.title || "Untitled Gig"}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
                    {project.description || "No description provided"}
                </p>

                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                        {(project.owner?.first_name || project.client?.first_name || 'U').charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        {project.owner?.first_name || project.client?.first_name || 'Anonymous'}
                    </span>
                </div>

                <div className="flex justify-between items-end pt-5 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Price Starts</span>
                        <span className="text-lg font-black text-slate-900">
                            {formatPrice(project.budget || 0)}
                        </span>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main FindTalent Component ---
const FindTalent = () => {
    const [results, setResults] = useState({ freelancers: [], projects: [], categories: [] });
    const [filterOptions, setFilterOptions] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [focusedProjects, setFocusedProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [selectedRating, setSelectedRating] = useState('');

    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [searchTrigger, setSearchTrigger] = useState(0);

    const location = useLocation();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const catResponse = await getCategories();
                setCategories(catResponse || []);
                const response = await getSearchOptions();
                setFilterOptions(response || {});
            } catch (error) {
                console.error("Error fetching search options:", error);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) setActiveSearchTerm(q);
    }, [location.search]);

    useEffect(() => {
        const fetchUserProjects = async () => {
            if (results?.freelancers && results.freelancers.length === 1) {
                const freelancer = results.freelancers[0];
                setProjectsLoading(true);
                try {
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
    }, [results.freelancers]);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setFocusedProjects([]);
            try {
                const params = {
                    q: activeSearchTerm,
                    type: 'all',
                    project_type: 'GIG',
                    category: selectedCategory,
                    min_price: priceRange.min,
                    max_price: priceRange.max,
                    rating: selectedRating
                };

                Object.keys(params).forEach(key => (params[key] === '' || params[key] === null || params[key] === undefined) && delete params[key]);

                const response = await globalSearch(params);
                setResults({
                    freelancers: response?.freelancers || [],
                    projects: response?.projects || [],
                    categories: response?.categories || []
                });
            } catch (error) {
                console.error("Error fetching results:", error);
                setResults({ freelancers: [], projects: [], categories: [] });
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [activeSearchTerm, selectedCategory, selectedRating, searchTrigger]);

    const handleSearch = (query) => {
        setActiveSearchTerm(query);
        const params = new URLSearchParams(location.search);
        if (query) params.set('q', query);
        else params.delete('q');
        window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        setActiveSearchTerm("");
        setSelectedCategory("");
        setPriceRange({ min: 0, max: 100000 });
        setSelectedRating("");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32">
            {/* Hero Header */}
            <div className="bg-white border-b border-slate-100 pt-16 pb-12 px-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <Users size={14} />
                        World-Class Talent
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
                        Hire the Best <span className="text-indigo-600">Expertise</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Connect with specialized freelancers and explore premium service offerings.
                    </p>

                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="p-2 bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 flex items-center">
                            <div className="flex-1">
                                <PredictiveSearchBar
                                    onSearch={handleSearch}
                                    placeholder="Search designers, developers, or agencies..."
                                    allowedTypes={['user', 'skill']}
                                    className="!border-0 !shadow-none !bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Modern Filter Bar */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${isFilterOpen ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-600 border border-slate-100 shadow-sm hover:border-indigo-200'
                                    }`}
                            >
                                <Filter size={18} />
                                Advanced Filters
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                                <button
                                    onClick={() => setSelectedCategory("")}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === "" ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    All
                                </button>
                                {categories.slice(0, 4).map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Filter Reveal */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 backdrop-blur-sm">
                                <div className="text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Category</label>
                                    <select
                                        className="w-full bg-white border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(cat => (
                                            <React.Fragment key={cat.id}>
                                                <option value={cat.id} className="font-bold">{cat.name}</option>
                                                {cat.subcategories?.map(sub => (
                                                    <option key={sub.id} value={sub.id}>&nbsp;&nbsp;&nbsp;{sub.name}</option>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </select>
                                </div>

                                <div className="text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Price Range</label>
                                    <div className="flex items-center gap-4 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-700 outline-none rounded-xl"
                                            placeholder="Min"
                                        />
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-700 outline-none rounded-xl"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Min Rating</label>
                                    <select
                                        className="w-full bg-white border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer"
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(e.target.value)}
                                    >
                                        <option value="">Any Rating</option>
                                        {[4.5, 4.0, 3.5, 3.0].map(r => (
                                            <option key={r} value={r}>{r}+ Stars</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32">
                        <Loader size="large" />
                        <p className="mt-4 text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Hunting for talent...</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* Freelancers Section */}
                        {results.freelancers.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                            <Users size={20} />
                                        </div>
                                        <span className="text-slate-900 font-black text-xl tracking-tight uppercase">
                                            Top Freelancers ({results.freelancers.length})
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {results.freelancers.map(user => (
                                        <FreelancerCard key={user.id} user={user} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects / Gigs Section */}
                        {results.projects.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                                            <Sparkles size={20} />
                                        </div>
                                        <span className="text-slate-900 font-black text-xl tracking-tight uppercase">
                                            Services & Gigs ({results.projects.length})
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {results.projects.map(project => (
                                        <GigCard key={project.id} project={project} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Focused Talent Detail Section */}
                        {results.freelancers.length === 1 && focusedProjects.length > 0 && (
                            <section className="bg-indigo-50/30 rounded-[3rem] p-12 border border-indigo-100">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                                        <LayoutGrid size={20} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                        More from {results.freelancers[0].first_name}
                                    </h3>
                                </div>

                                {projectsLoading ? (
                                    <div className="flex justify-center py-20"><Loader /></div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {focusedProjects.map(project => (
                                            <GigCard key={project.id} project={project} />
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {results.freelancers.length === 0 && results.projects.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <Compass size={64} className="text-slate-200 mx-auto mb-6" />
                                <h3 className="text-slate-900 font-black text-2xl mb-2 italic">No talent found</h3>
                                <p className="text-slate-400 text-lg max-w-sm mx-auto mb-10">
                                    We couldn't find anyone matching your current filters. Try different keywords or broaden your search!
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-10 py-4 bg-slate-900 text-white font-black rounded-3xl shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-xs"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindTalent;
