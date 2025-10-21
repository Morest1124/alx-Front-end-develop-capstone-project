import React, { useState, useEffect } from 'react';
import { useRouter } from '../contexts/Routers';

// Mock function to fetch project details by ID from db.json
const fetchProjectById = async (id) => {
  try {
    const response = await fetch('/db.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const project = data.projects.find(p => p.id === parseInt(id));
    return project;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
};

const ProjectDetailsPage = ({ projectId }) => {
  const { navigate } = useRouter();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      fetchProjectById(projectId).then(data => {
        setProject(data);
        setIsLoading(false);
      });
    }
  }, [projectId]);

  if (isLoading) {
    return <div className="text-center py-10">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the project you were looking for.</p>
        <button onClick={() => navigate('/')} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          &larr; Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 bg-white rounded-lg shadow-lg mt-6">
      <button onClick={() => navigate(-1)} className="mb-6 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
        &larr; Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <img src={project.thumbnail} alt={project.title} className="w-full h-auto object-cover rounded-lg shadow-md" style={{ maxHeight: '450px' }} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
          <p className="text-gray-700 text-lg">
            This is a placeholder for the full project description. It would detail the project's goals, scope, required skills, and other relevant information for potential freelancers.
          </p>
        </div>

        {/* Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Details</h2>
            
            <div className="flex items-center mb-4">
              <img src={project.client_avatar} alt={project.client} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-bold text-gray-800">{project.client}</p>
                <p className="text-sm text-gray-600">Client</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Budget:</span>
                <span className="font-bold text-green-600 text-lg">${project.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Deadline:</span>
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">{project.status}</span>
              </div>
               <div className="flex justify-between">
                <span className="font-semibold">Rating:</span>
                <span className="flex items-center">{project.rating} &#9733;</span>
              </div>
            </div>

            <button className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105">
              Submit a Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
