import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getFreelancerJobs } from '../api';
import PageWrapper from './PageWrapper';
import { formatToZAR } from '../utils/currency';
import { Link } from '../contexts/Routers';

const MyProjects = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                console.log('Fetching freelancer projects...');
                const data = await getFreelancerJobs();
                console.log('Projects fetched:', data);
                setProjects(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message || "Failed to fetch your projects.");
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?.isLoggedIn) {
            fetchProjects();
        } else {
            setLoading(false);
        }
    }, [user?.isLoggedIn]);

    // Filter projects based on active tab
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS');
    const pastProjects = projects.filter(p => p.status === 'COMPLETED');

    if (loading) {
        return (
            <PageWrapper title="My Projects">
                <div className="text-center p-8">Loading your projects...</div>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper title="My Projects">
                <div className="text-center p-8 text-red-500">Error: {error}</div>
            </PageWrapper>
        );
    }

    const displayProjects = activeTab === 'active' ? activeProjects : pastProjects;

    return (
        <PageWrapper title="My Projects">
            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`py-3 px-6 text-lg font-semibold ${activeTab === 'active'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Active Projects ({activeProjects.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`py-3 px-6 text-lg font-semibold ${activeTab === 'past'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Past Projects ({pastProjects.length})
                </button>
            </div>

            {/* Projects List */}
            <div className="space-y-6">
                {displayProjects.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">
                            {activeTab === 'active'
                                ? "You don't have any active projects at the moment."
                                : "You haven't completed any projects yet."}
                        </p>
                    </div>
                ) : (
                    displayProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Budget:</span>
                                            <span className="text-green-600 font-bold">
                                                {formatToZAR(project.budget)}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'IN_PROGRESS'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {project.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
                                            </span>
                                        </div>
                                        {project.category_details && (
                                            <div className="flex items-center">
                                                <span className="font-semibold mr-2">Category:</span>
                                                <span>{project.category_details.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Client Info */}
                                    {project.client_details && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Client:</span>{' '}
                                                {project.client_details.first_name} {project.client_details.last_name}
                                            </p>
                                            {project.client_details.email && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold">Email:</span>{' '}
                                                    {project.client_details.email}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="ml-6">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                                <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageWrapper>
    );
};

export default MyProjects;
