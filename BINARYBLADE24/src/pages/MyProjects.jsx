import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getOrders } from '../api';
import PageWrapper from './PageWrapper';
import { useCurrency } from '../contexts/CurrencyContext';
import { Link, useRouter } from '../contexts/Routers';
import Loader from '../components/Loader';
import { Briefcase, Clock, CheckCircle, User, Calendar, DollarSign } from 'lucide-react';

const MyProjects = () => {
    const { user } = useContext(AuthContext);
    const { currentPath } = useRouter();
    const { formatPrice } = useCurrency();
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
                const currentUserId = user.userId || user.id;

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
                        id: order.id,
                        projectId: project.id,
                        title: project.title || `Order #${order.order_number}`,
                        description: project.description || `Order for ${item.tier} tier`,
                        budget: order.total_amount,
                        status: order.status,
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
    const activeProjects = projects.filter(p =>
        p.status === 'PENDING' ||
        p.status === 'PAID' ||
        p.status === 'IN_PROGRESS'
    );
    const pastProjects = projects.filter(p => p.status === 'COMPLETED');

    const getStatusConfig = (status) => {
        const configs = {
            COMPLETED: {
                color: 'bg-green-100 text-green-800',
                icon: CheckCircle,
                text: 'Completed'
            },
            PAID: {
                color: 'bg-blue-100 text-blue-800',
                icon: DollarSign,
                text: 'In Progress'
            },
            PENDING: {
                color: 'bg-yellow-100 text-yellow-800',
                icon: Clock,
                text: 'Pending Payment'
            },
            IN_PROGRESS: {
                color: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
                icon: Briefcase,
                text: 'Active'
            }
        };
        return configs[status] || configs.PENDING;
    };

    if (loading) {
        return (
            <PageWrapper title="My Projects">
                <div className="flex flex-col items-center justify-center p-12">
                    <Loader size="large" />
                    <p className="mt-4 text-gray-600">Loading your projects...</p>
                </div>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper title="My Projects">
                <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-semibold">Error: {error}</p>
                </div>
            </PageWrapper>
        );
    }

    const displayProjects = activeTab === 'active' ? activeProjects : pastProjects;

    return (
        <PageWrapper title="My Projects">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80">Active Projects</span>
                        <Briefcase className="w-6 h-6 text-white/60" />
                    </div>
                    <div className="text-4xl font-bold">{activeProjects.length}</div>
                    <div className="text-sm text-white/70 mt-1">Currently working on</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Completed</span>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-4xl font-bold text-green-600">{pastProjects.length}</div>
                    <div className="text-sm text-gray-500 mt-1">Successfully finished</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`py-3 px-6 text-lg font-semibold transition-colors ${activeTab === 'active'
                        ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Briefcase className="w-5 h-5 inline mr-2" />
                    Active Projects ({activeProjects.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`py-3 px-6 text-lg font-semibold transition-colors ${activeTab === 'past'
                        ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Completed ({pastProjects.length})
                </button>
            </div>

            {/* Projects List */}
            <div className="space-y-6">
                {displayProjects.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        {activeTab === 'active' ? (
                            <>
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No active projects</p>
                                <p className="text-gray-400 text-sm mt-2">You don't have any active projects at the moment.</p>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No completed projects</p>
                                <p className="text-gray-400 text-sm mt-2">You haven't completed any projects yet.</p>
                            </>
                        )}
                    </div>
                ) : (
                    displayProjects.map((project) => {
                        const statusConfig = getStatusConfig(project.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                            >
                                {/* Project Header with Gradient */}
                                <div className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] p-6 text-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold mb-2">
                                                {project.title}
                                            </h3>
                                            <p className="text-white/90 line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                        <div className="ml-6 text-right">
                                            <div className="text-3xl font-bold">
                                                {formatPrice(project.budget, 'USD')}
                                            </div>
                                            <div className="text-sm text-white/70 mt-1">Earnings</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {/* Status Badge */}
                                        <div className="flex items-center">
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusConfig.color}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {statusConfig.text}
                                            </span>
                                        </div>

                                        {/* Client Info */}
                                        {project.client_details && (
                                            <div className="flex items-center text-gray-700">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="font-medium">Client:</span>
                                                <span className="ml-2">
                                                    {project.client_details.first_name} {project.client_details.last_name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timestamps */}
                                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-medium mr-1">Started:</span>
                                            {new Date(project.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-medium mr-1">Updated:</span>
                                            {new Date(project.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <Link
                                            to={`/freelancer/billing`}
                                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            <Briefcase className="w-5 h-5 mr-2" />
                                            View Order Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </PageWrapper>
    );
};

export default MyProjects;
