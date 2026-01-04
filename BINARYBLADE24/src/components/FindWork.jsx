import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useRouter } from "../contexts/Routers";
import { getOpenJobs } from "../api";
import { formatToZAR } from "../utils/currency";
import Loader from "./Loader";

// Card component for displaying a single project
const ProjectCard = ({ project, handleViewProject }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      onClick={() => handleViewProject(project)}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {project.thumbnail && (
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      )}
      {!project.thumbnail && (
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

const FindWork = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { navigate } = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching open projects for Find Work...');
        const projectsData = await getOpenJobs();
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

    fetchProjects();
  }, []);

  const handleViewProject = (project) => {
    // Navigate to project details page
    if (project.id) {
      navigate(`/projects/${project.id}`);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2">Find Work - Browse Projects</h2>
        <p className="text-gray-600 mb-4">
          Browse {projects.length} available {projects.length === 1 ? 'project' : 'projects'} from clients
        </p>
        <input
          type="text"
          placeholder="Search for projects..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? `No projects found matching "${searchTerm}"`
              : "No projects available at the moment. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} handleViewProject={handleViewProject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindWork;
