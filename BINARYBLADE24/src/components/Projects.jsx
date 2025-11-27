import React, { useState, useEffect } from "react";
import { getFreelancerJobs } from "../api";
import GigsContent from "../pages/GigsContent";
import { useRouter } from "../contexts/Routers";

const ProjectsPage = () => {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getFreelancerJobs();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProjects = filteredProjects.filter(
    (p) => p.status === "IN_PROGRESS"
  );
  const pastProjects = filteredProjects.filter((p) => p.status === "COMPLETED");

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleContact = (e, project) => {
    e.stopPropagation();
    alert(`Contacting ${project.client}`);
  };

  const handleViewProject = (project) => {
    navigate(`/projects/${project.id}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-4 text-lg ${activeTab === "active"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
              }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-4 text-lg ${activeTab === "past"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
              }`}
          >
            Past Projects
          </button>
        </div>

        {activeTab !== "gigs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "active" ? activeProjects : pastProjects).map(
              (project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => handleViewProject(project)}
                >
                  <div className="relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <span
                      className={`absolute top-2 right-2 text-white px-2 py-1 text-xs font-bold rounded ${project.status === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        }`}
                    >
                      {project.status}
                    </span>
                    <div className="absolute bottom-0 left-0 p-4 flex items-center">
                      <img
                        src={project.client_avatar}
                        alt={project.client}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <h2 className="text-lg font-bold text-white ml-2">
                        {project.client}
                      </h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 text-center">
                      {project.title}
                    </h2>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-lg font-bold text-green-600">
                        R{project.budget}
                      </p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-600">
                          {project.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-center mt-4 flex justify-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(project);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Send
                      </button>
                      <button
                        onClick={(e) => handleContact(e, project)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                      >
                        Contact Client
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Project Details</h2>
            <p><strong>Name:</strong> {selectedProject.name}</p>
            <p><strong>Last Name:</strong> {selectedProject.lastName}</p>
            <p><strong>ID:</strong> {selectedProject.id}</p>
            <p><strong>Country of Origin:</strong> {selectedProject.countryOfOrigin}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;