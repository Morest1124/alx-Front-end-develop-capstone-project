import React, { useState, useEffect, useContext } from "react";
import { getProjects } from "../api";
import { useRouter } from "../contexts/Routers";
import { AuthContext } from '../contexts/AuthContext';

const ClientProjects = () => {
  const { navigate } = useRouter();
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  console.log("Current User:", user);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        console.log("Fetched projects:", data);
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  console.log("All projects:", projects);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Filtered projects:", filteredProjects);

  const activeProjects = filteredProjects.filter(
    (p) => p.status === "IN_PROGRESS"
  );
  const pastProjects = filteredProjects.filter((p) => p.status === "COMPLETED");
  console.log("Active projects:", activeProjects);
  console.log("Past projects:", pastProjects);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleContact = (e, project) => {
    e.stopPropagation();
    alert(`Contacting freelancer for project: ${project.title}`);
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

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activeProjects.map((project) => (
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
                  className={`absolute top-2 right-2 text-white px-2 py-1 text-xs font-bold rounded ${
                    project.status === "IN_PROGRESS"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {project.status}
                </span>
                <div className="absolute bottom-0 left-0 p-4 flex items-center"></div>
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
                    Contact Freelancer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Completed Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastProjects.map((project) => (
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
                  className={`absolute top-2 right-2 text-white px-2 py-1 text-xs font-bold rounded ${
                    project.status === "IN_PROGRESS"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {project.status}
                </span>
                <div className="absolute bottom-0 left-0 p-4 flex items-center"></div>
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
                    Contact Freelancer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default ClientProjects;