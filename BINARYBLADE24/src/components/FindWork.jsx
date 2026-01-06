import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Briefcase,
  Search,
  Filter,
  ChevronDown,
  X,
  Compass,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  LayoutGrid,
  List
} from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useRouter } from "../contexts/Routers";
import { getOpenJobs, getCategories } from "../api";
import { useCurrency } from "../contexts/CurrencyContext";
import Loader from "./Loader";
import PredictiveSearchBar from "./PredictiveSearchBar";

// --- ProjectCard Component ---
const ProjectCard = ({ project, handleViewProject }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
  const { formatPrice } = useCurrency();

  return (
    <div
      ref={ref}
      onClick={() => handleViewProject(project)}
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
          <div className="w-full h-full bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center">
            <Briefcase size={40} className="text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
            {project.status || "OPEN"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-sky-600 transition-colors">
          {project.title || "Untitled Project"}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
          {project.description || "No description provided"}
        </p>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
            {project.client?.first_name?.charAt(0) || 'C'}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            {project.client?.first_name} {project.client?.last_name || ''}
          </span>
        </div>

        <div className="flex justify-between items-end pt-5 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Budget</span>
            <span className="text-lg font-black text-slate-900">
              {formatPrice(project.budget || 0)}
            </span>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-all duration-300">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main FindWork Component ---
const FindWork = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { navigate } = useRouter();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetRange, setBudgetRange] = useState({ min: "", max: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategories();
        setCategories(response || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const params = {
          project_type: 'JOB',
          category: selectedCategory,
          min_price: budgetRange.min,
          max_price: budgetRange.max,
          ...(searchTerm ? { search: searchTerm } : {})
        };

        Object.keys(params).forEach(key => (params[key] === '' || params[key] === null || params[key] === undefined) && delete params[key]);

        const projectsData = await getOpenJobs(params);
        setProjects(projectsData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError(error.message || "Failed to load projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, budgetRange.min, budgetRange.max]);

  const handleViewProject = (project) => {
    if (project.id) {
      navigate(`/projects/${project.id}`);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setBudgetRange({ min: 0, max: 100000 });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-12 px-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            Explore New Opportunities
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Discover Your Next <span className="text-sky-600">Great Job</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Browse through thousands of high-quality projects posted by trusted clients daily.
          </p>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="p-2 bg-white rounded-3xl shadow-2xl shadow-sky-100 border border-slate-100 flex items-center">
              <div className="flex-1">
                <PredictiveSearchBar
                  onSearch={(query) => setSearchTerm(query)}
                  placeholder="Search jobs, skills, or categories..."
                  allowedTypes={['project', 'category']}
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
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${isFilterOpen ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-600 border border-slate-100 shadow-sm hover:border-sky-200'
                  }`}
              >
                <Filter size={18} />
                Advanced Filters
                <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Quick Category Pills */}
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === "" ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  All
                </button>
                {categories.slice(0, 4).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs font-bold animate-in fade-in slide-in-from-left-2"
                >
                  <X size={14} />
                  Category Active
                </button>
              )}
            </div>

            {/* Advanced Filter Reveal */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 backdrop-blur-sm">
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Refine Category</label>
                  <select
                    className="w-full bg-white border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all cursor-pointer shadow-sm"
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Budget Range</label>
                  <div className="flex items-center gap-4 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    <input
                      type="number"
                      value={budgetRange.min}
                      onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm font-bold text-slate-700 outline-none rounded-xl"
                      placeholder="Min"
                    />
                    <div className="h-6 w-px bg-slate-100" />
                    <input
                      type="number"
                      value={budgetRange.max}
                      onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm font-bold text-slate-700 outline-none rounded-xl"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-slate-900 font-black text-xl tracking-tight uppercase">
              Available Jobs ({projects.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-sky-600 bg-sky-50 rounded-lg border border-sky-100 hover:bg-sky-100 transition-colors">
              <LayoutGrid size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Results Grid - 4 Columns on Large Screens */}
        <div className="flex-1">
          {loading && projects.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[400px]">
              <Loader size="large" />
              <p className="mt-4 text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching opportunities...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-12 text-center max-w-xl mx-auto">
              <X size={48} className="text-rose-400 mx-auto mb-4" />
              <p className="text-rose-900 font-bold text-lg mb-2">Error Loading Projects</p>
              <p className="text-rose-600 mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-black">Retry</button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <Compass size={64} className="text-slate-200 mx-auto mb-6" />
              <h3 className="text-slate-900 font-black text-2xl mb-2 italic">Nothing found around here</h3>
              <p className="text-slate-400 text-lg max-w-sm mx-auto mb-10">
                We couldn't find any projects matching your current filters. Try broader criteria!
              </p>
              <button
                onClick={clearFilters}
                className="px-10 py-4 bg-slate-900 text-white font-black rounded-3xl shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} handleViewProject={handleViewProject} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindWork;