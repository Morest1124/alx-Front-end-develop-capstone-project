import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from '../contexts/Routers';
import { formatToZAR } from '../utils/currency';
import { AuthContext } from '../contexts/AuthContext';

import { getProjectDetails, approveProject } from '../api';

const fetchProjectById = async (id) => {
  try {
    const data = await getProjectDetails(id);
    return data;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
};

const ProjectDetailsPage = ({ projectId }) => {
  const { navigate } = useRouter();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

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
              <img src={project.thumbnail || "https://via.placeholder.com/150"} alt={project.owner_details?.username || "User"} className="w-12 h-12 rounded-full mr-4 object-cover" />
              <div>
                <p className="font-bold text-gray-800">
                  {project.owner_details?.first_name
                    ? `${project.owner_details.first_name} ${project.owner_details.last_name}`
                    : (project.owner_details?.username || "Unknown User")}
                </p>
                <p className="text-sm text-gray-600">
                  {project.project_type === 'GIG' ? 'Freelancer' : 'Client'}
                </p>
                {/* Revealed Contact Info */}
                {project.owner_details?.email && (
                  <div className="mt-2 text-sm text-indigo-600 bg-indigo-50 p-2 rounded">
                    <p><strong>Email:</strong> {project.owner_details.email}</p>
                    {project.owner_details.phone_number && (
                      <p><strong>Phone:</strong> {project.owner_details.phone_number}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Budget:</span>
                <span className="font-bold text-green-600 text-lg">{formatToZAR(project.budget)}</span>
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

            {/* Client-only: Approve Work button for IN_PROGRESS projects */}
            {user && user.role?.toUpperCase() === 'CLIENT' && project.status === 'IN_PROGRESS' && (
              <button
                onClick={async () => {
                  if (window.confirm('Approve this work and release payment to the freelancer?')) {
                    setIsApproving(true);
                    try {
                      await approveProject(projectId);
                      alert('Work approved! Payment released to freelancer.');
                      // Refresh project data
                      const updatedProject = await getProjectDetails(projectId);
                      setProject(updatedProject);
                    } catch (error) {
                      alert(error.message || 'Failed to approve work.');
                    } finally {
                      setIsApproving(false);
                    }
                  }
                }}
                disabled={isApproving}
                className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? 'Approving...' : '✓ Approve Work & Release Payment'}
              </button>
            )}

            {/* Freelancer: Submit Proposal button (Only for Jobs) */}
            {user && user.role?.toUpperCase() === 'FREELANCER' && project.project_type === 'JOB' && project.status === 'OPEN' && (
              <button className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105">
                Submit a Proposal
              </button>
            )}

            {/* Client: Contact Freelancer (Only for Gigs) */}
            {user && user.role?.toUpperCase() === 'CLIENT' && project.project_type === 'GIG' && (
              <button
                onClick={() => alert(`Contacting ${project.owner_details?.first_name || 'Freelancer'}...`)}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105"
              >
                Contact Freelancer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
