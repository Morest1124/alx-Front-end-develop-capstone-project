import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useRouter } from "../contexts/Routers";
import { getOpenJobs, getCategories } from "../api";
import { formatToZAR } from "../utils/currency";
import Loader from "./Loader";
import PredictiveSearchBar from "./PredictiveSearchBar"; // Ensure this path matches where you saved the component

// --- ProjectCard Component (Restored Inline) ---
const ProjectCard = ({ project, handleViewProject }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      onClick={() => handleViewProject(project)}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {project.title?.charAt(0) || "P"}
          </span>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
          {project.title || "Untitled Project"}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {project.description || "No description provided"}
        </p>

        {/* Client Info */}
        {project.client && (
          <div className="flex items-center mt-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-semibold">
              {project.client.first_name?.charAt(0) || 'C'}
            </div>
            <p className="ml-2 text-sm text-gray-700">
              {project.client.first_name} {project.client.last_name || ''}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-lg font-bold text-[var(--color-success)]">
              {formatToZAR(project.budget || 0)}
            </p>
          </div>
          <div className="text-right">
            <span className="badge-info">
              {project.status || "OPEN"}
            </span>
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


  // --- Filter State ---
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 10000 });

  // Fetch Categories on Mount
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
        console.log('Fetching open projects for Find Work...');

        // Server-side filtering parameters
        const params = {
          project_type: 'JOB',
          category: selectedCategory,
          min_price: budgetRange.min,
          max_price: budgetRange.max,
          ...(searchTerm ? { search: searchTerm } : {})
        };

        // Clean empty params
        Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);

        const projectsData = await getOpenJobs(params);
        console.log('Projects fetched:', projectsData);
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

    // Debounce fetch for filters
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
    setBudgetRange({ min: 0, max: 10000 });
  };


  // Client-side filtering is removed in favor of server-side filtering via useEffect above
  const filteredProjects = projects;

  if (loading && projects.length === 0) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Find Work</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Browse {projects.length} available jobs posted by clients
          </p>
          {/* Debug Indicator - Temporary for User Verification */}
          {searchTerm && (
            <p className="text-sm text-[var(--color-primary)] font-mono mb-4 bg-blue-50 inline-block px-3 py-1 rounded">
              Searching for: "{searchTerm}"
            </p>
          )}

          <div className="max-w-3xl mx-auto">
            <PredictiveSearchBar
              onSearch={(query) => setSearchTerm(query)}
              placeholder="Search for projects (e.g., 'React Native') or categories..."
              allowedTypes={['project', 'category']}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-[var(--color-primary)] font-medium hover:underline">Reset</button>
              </div>


              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm py-2 px-3"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Budget Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={budgetRange.min}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={budgetRange.max}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {loading && projects.length === 0 ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader size="large" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700">{error}</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                  {searchTerm
                    ? `No projects found matching "${searchTerm}"`
                    : "No projects available matching your filters."}
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[var(--color-primary)] font-medium hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} handleViewProject={handleViewProject} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWork;