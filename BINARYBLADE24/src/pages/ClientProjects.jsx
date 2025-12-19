import React, { useState, useEffect, useContext } from "react";
import { getClientProjects, startConversation } from "../api";
import { useRouter } from "../contexts/Routers";
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/Loader';

const ClientProjects = () => {
  const { navigate } = useRouter();
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  console.log("Current User:", user);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await getClientProjects();
      console.log("Fetched projects:", data);

      // Handle potential pagination
      if (!Array.isArray(data) && data.results && Array.isArray(data.results)) {
        console.log('Detected paginated response, using .results');
        data = data.results;
      }

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("API response is not an array:", data);
        setProjects([]);
        setError("Invalid data format received from server.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleContact = async (e, project) => {
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // For client's projects, get the freelancer ID from accepted proposals
      // In a real scenario, you'd need to track which freelancer is assigned
      // For now, we'll use the client field (which might be the freelancer in the GIG model)
      const freelancerId = project.client?.id || project.owner_details?.id;
      const conversation = await startConversation(project.id, freelancerId);

      // Navigate to messages
      const messagePath = user.role?.toUpperCase() === 'CLIENT' ? '/client/messages' : '/freelancer/messages';
      navigate(messagePath, { state: { selectedConversationId: conversation.id } });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
  };

  const handleViewProject = (project) => {
    navigate(`/projects/${project.id}`);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchProjects}
          className="px-4 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Projects</h2>
        {activeProjects.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm mb-8">
            <p className="text-gray-500">No active projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => handleViewProject(project)}
              >
                <div className="relative">
                  <img
                    src={project.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 text-white px-2 py-1 text-xs font-bold rounded ${project.status === "IN_PROGRESS"
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
                        {project.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-4 flex justify-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(project);
                      }}
                      className="btn-secondary px-4 py-2"
                    >
                      Send
                    </button>
                    <button
                      onClick={(e) => handleContact(e, project)}
                      className="btn-primary px-4 py-2"
                    >
                      Contact Freelancer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Completed Projects
        </h2>
        {pastProjects.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No completed projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => handleViewProject(project)}
              >
                <div className="relative">
                  <img
                    src={project.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 text-white px-2 py-1 text-xs font-bold rounded ${project.status === "IN_PROGRESS"
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
                        {project.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-4 flex justify-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(project);
                      }}
                      className="btn-secondary px-4 py-2"
                    >
                      Send
                    </button>
                    <button
                      onClick={(e) => handleContact(e, project)}
                      className="btn-primary px-4 py-2"
                    >
                      Contact Freelancer
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              className="mt-4 btn-danger px-4 py-2"
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