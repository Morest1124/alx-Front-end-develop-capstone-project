import React, { useState } from "react";
import GigsContent from "../pages/GigsContent";

const projects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    client: "ABC Corp",
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

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProjects = filteredProjects.filter(
    (p) => p.status === "In Progress"
  );
  const pastProjects = filteredProjects.filter((p) => p.status === "Completed");

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
            onClick={() => setActiveTab("gigs")}
            className={`py-2 px-4 text-lg R{
              activeTab === "gigs"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            My Gigs
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-4 text-lg R{
              activeTab === "active"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-4 text-lg R{
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
                      className={`absolute top-2 right-2 text-white px-2 py-1 text-xs font-bold rounded R{
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
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
