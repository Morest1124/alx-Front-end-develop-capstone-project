import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getOrders } from '../api';
import PageWrapper from './PageWrapper';
import { formatToZAR } from '../utils/currency';
import { Link, useRouter } from '../contexts/Routers';

const MyProjects = () => {
    const { user } = useContext(AuthContext);
    const { currentPath } = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'

    // Set active tab based on URL
    useEffect(() => {
        if (currentPath.includes('/concluded')) {
            setActiveTab('past');
        } else {
            setActiveTab('active');
        }
    }, [currentPath]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const data = await getOrders();

                // Filter orders where the current user is the freelancer
                // The API returns orders where user is client OR freelancer
                // We want orders where user is NOT the client (so they must be the freelancer)
                // OR check items if available

                const currentUserId = user.userId || user.id; // Handle both cases just to be safe

                const freelancerOrders = data.filter(order => {
                    // If user is client, skip
                    if (order.client == currentUserId) return false;

                    // If items are populated, check if user is freelancer on any item
                    if (order.items && order.items.length > 0) {
                        return order.items.some(item => item.freelancer == currentUserId);
                    }

                    // Fallback: if not client, assume freelancer (due to API filter)
                    return true;
                });

                // Transform orders into project-like structure for display
                const transformedProjects = freelancerOrders.map(order => {
                    const item = order.items && order.items.length > 0 ? order.items[0] : {};
                    const project = item.project_details || {};

                    return {
                        id: order.id, // Use Order ID for linking
                        projectId: project.id,
                        title: project.title || `Order #${order.order_number}`,
                        description: project.description || `Order for ${item.tier} tier`,
                        budget: order.total_amount,
                        status: order.status, // PENDING, PAID, COMPLETED
                        client_details: order.client_details,
                        created_at: order.created_at,
                        updated_at: order.updated_at
                    };
                });

                setProjects(transformedProjects);
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
    }, [user?.isLoggedIn, user?.userId, user?.id]);

    // Filter projects based on active tab
    // Active = PENDING or PAID or IN_PROGRESS
    // Past = COMPLETED
    const activeProjects = projects.filter(p =>
        p.status === 'PENDING' ||
        p.status === 'PAID' ||
        p.status === 'IN_PROGRESS'
    );
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
                                            <span className="font-semibold mr-2">Earnings:</span>
                                            <span className="text-green-600 font-bold">
                                                {formatToZAR(project.budget)}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    {project.client_details && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Client:</span>{' '}
                                                {project.client_details.first_name} {project.client_details.last_name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="ml-6">
                                    <Link
                                        to={`/freelancer/billing`}
                                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                    >
                                        View Order
                                    </Link>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                                <span>Started: {new Date(project.created_at).toLocaleDateString()}</span>
                                <span>Last Update: {new Date(project.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageWrapper>
    );
};

export default MyProjects;
