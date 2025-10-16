import React, { useState } from "react";
import GigsContent from "../pages/GigsContent";

const projects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    client: "ABC Corp",
    name: "John",
    lastName: "Doe",
    countryOfOrigin: "USA",
    status: "In Progress",
    deadline: "2025-12-31",
    budget: 5000,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=E-commerce",
    client_avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 2,
    title: "Mobile App Design",
    client: "XYZ Inc",
    name: "Jane",
    lastName: "Smith",
    countryOfOrigin: "UK",
    status: "Completed",
    deadline: "2025-10-15",
    budget: 3000,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Mobile+App",
    client_avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 3,
    title: "Social Media Campaign",
    client: "Jane Doe",
    name: "Peter",
    lastName: "Jones",
    countryOfOrigin: "Canada",
    status: "In Progress",
    deadline: "2025-11-30",
    budget: 1500,
    rating: 4.7,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Social+Media",
    client_avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 4,
    title: "Logo Design",
    client: "John Smith",
    name: "Mary",
    lastName: "Williams",
    countryOfOrigin: "Australia",
    status: "Completed",
    deadline: "2025-09-01",
    budget: 500,
    rating: 5.0,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
    client_avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 5,
    title: "E-commerce Website Development",
    client: "ABC Corp",
    name: "David",
    lastName: "Brown",
    countryOfOrigin: "Germany",
    status: "In Progress",
    deadline: "2025-12-31",
    budget: 5000,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=E-commerce",
    client_avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    title: "Mobile App Design",
    client: "XYZ Inc",
    name: "Sarah",
    lastName: "Davis",
    countryOfOrigin: "France",
    status: "Completed",
    deadline: "2025-10-15",
    budget: 3000,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Mobile+App",
    client_avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    title: "Social Media Campaign",
    client: "Jane Doe",
    name: "Chris",
    lastName: "Miller",
    countryOfOrigin: "Spain",
    status: "In Progress",
    deadline: "2025-11-30",
    budget: 1500,
    rating: 4.7,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Social+Media",
    client_avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 8,
    title: "Logo Design",
    client: "John Smith",
    name: "Jessica",
    lastName: "Wilson",
    countryOfOrigin: "Italy",
    status: "Completed",
    deadline: "2025-09-01",
    budget: 500,
    rating: 5.0,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
    client_avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 9,
    title: "E-commerce Website Development",
    client: "ABC Corp",
    name: "Mark",
    lastName: "Moore",
    countryOfOrigin: "Japan",
    status: "In Progress",
    deadline: "2025-12-31",
    budget: 5000,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=E-commerce",
    client_avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 10,
    title: "Mobile App Design",
    client: "XYZ Inc",
    name: "Laura",
    lastName: "Taylor",
    countryOfOrigin: "Brazil",
    status: "Completed",
    deadline: "2025-10-15",
    budget: 3000,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Mobile+App",
    client_avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 11,
    title: "Social Media Campaign",
    client: "Jane Doe",
    name: "Robert",
    lastName: "Anderson",
    countryOfOrigin: "India",
    status: "In Progress",
    deadline: "2025-11-30",
    budget: 1500,
    rating: 4.7,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Social+Media",
    client_avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 12,
    title: "Logo Design",
    client: "John Smith",
    name: "Linda",
    lastName: "Thomas",
    countryOfOrigin: "Mexico",
    status: "Completed",
    deadline: "2025-09-01",
    budget: 500,
    rating: 5.0,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
    client_avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 13,
    title: "E-commerce Website Development",
    client: "ABC Corp",
    name: "James",
    lastName: "Hernandez",
    countryOfOrigin: "Argentina",
    status: "In Progress",
    deadline: "2025-12-31",
    budget: 5000,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=E-commerce",
    client_avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 14,
    title: "Mobile App Design",
    client: "XYZ Inc",
    name: "Patricia",
    lastName: "Martinez",
    countryOfOrigin: "Chile",
    status: "Completed",
    deadline: "2025-10-15",
    budget: 3000,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Mobile+App",
    client_avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 15,
    title: "Social Media Campaign",
    client: "Jane Doe",
    name: "Michael",
    lastName: "Garcia",
    countryOfOrigin: "Peru",
    status: "In Progress",
    deadline: "2025-11-30",
    budget: 1500,
    rating: 4.7,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Social+Media",
    client_avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 16,
    title: "Logo Design",
    client: "John Smith",
    name: "Barbara",
    lastName: "Rodriguez",
    countryOfOrigin: "Colombia",
    status: "Completed",
    deadline: "2025-09-01",
    budget: 500,
    rating: 5.0,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
    client_avatar: "https://i.pravatar.cc/150?img=8",
  },
];

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("gigs");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProjects = filteredProjects.filter(
    (p) => p.status === "In Progress"
  );
  const pastProjects = filteredProjects.filter((p) => p.status === "Completed");

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

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
            className={`py-2 px-4 text-lg ${
              activeTab === "active"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("gigs")}
            className={`py-2 px-4 text-lg ${
              activeTab === "gigs"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            My Gigs
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-4 text-lg ${
              activeTab === "past"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Past Projects
          </button>
        </div>

        {activeTab === "gigs" && <GigsContent />}

        {activeTab !== "gigs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "active" ? activeProjects : pastProjects).map(
              (project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <span
                      className={`absolute top-2 right-2 text-white px-2 py-1 text-xs font-bold rounded ${
                        project.status === "In Progress"
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
                    <div className="text-center mt-4">
                      <button
                        onClick={() => openModal(project)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Send
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

