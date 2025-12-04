import React, { useState, useEffect } from 'react';
import { getOrders, cancelOrder } from '../api';
import { useCurrency } from '../contexts/CurrencyContext';
import Loader from '../components/Loader';
import { Package, Clock, CheckCircle, DollarSign, User, Calendar, TrendingUp, XCircle } from 'lucide-react';

const FreelancerOrders = () => {
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingOrderId, setProcessingOrderId] = useState(null);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        pendingEarnings: 0,
        completedOrders: 0,
        activeOrders: 0
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            const ordersList = Array.isArray(data) ? data : data.results || [];
            setOrders(ordersList);

            // Calculate stats
            const completed = ordersList.filter(o => o.status === 'COMPLETED');
            const active = ordersList.filter(o => o.status === 'PAID');
            const totalEarnings = completed.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
            const pendingEarnings = active.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

            setStats({
                totalEarnings,
                pendingEarnings,
                completedOrders: completed.length,
                activeOrders: active.length
            });
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? If paid, funds will be refunded to the client.')) {
            return;
        }

        try {
            setProcessingOrderId(orderId);
            await cancelOrder(orderId);
            alert('✅ Order cancelled successfully!');
            await fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Failed to cancel order:', error);
            alert('❌ Failed to cancel order. ' + (error.message || 'Please try again.'));
        } finally {
            setProcessingOrderId(null);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Awaiting Payment' },
            PAID: { color: 'bg-blue-100 text-blue-800', icon: DollarSign, text: 'In Progress' },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Completed & Paid' },
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        const Icon = config.icon;

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${config.color}`}>
                <Icon size={16} />
                <span>{config.text}</span>
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader size="xl" />
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                        <Package className="w-10 h-10 mr-3 text-[var(--color-accent)]" />
                        My Orders
                    </h1>
                    <p className="text-gray-600">Track your gig orders and earnings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-100">Total Earnings</span>
                            <TrendingUp className="w-6 h-6 text-green-200" />
                        </div>
                        <div className="text-3xl font-bold">{formatPrice(stats.totalEarnings, 'USD')}</div>
                        <div className="text-sm text-green-200 mt-1">From completed orders</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Pending</span>
                            <DollarSign className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-600">{formatPrice(stats.pendingEarnings, 'USD')}</div>
                        <div className="text-sm text-gray-500 mt-1">In escrow</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Completed</span>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-green-600">{stats.completedOrders}</div>
                        <div className="text-sm text-gray-500 mt-1">Orders finished</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Active</span>
                            <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{stats.activeOrders}</div>
                        <div className="text-sm text-gray-500 mt-1">In progress</div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">You haven't received any orders yet.</p>
                        <a
                            href="/freelancer/gigs"
                            className="inline-block px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/90 transition font-semibold"
                        >
                            View My Gigs
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] p-6 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-1">Order #{order.order_number}</h3>
                                            <p className="text-white/80 flex items-center">
                                                <Calendar size={16} className="mr-2" />
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-indigo-100 flex items-center mt-1">
                                                <User size={16} className="mr-2" />
                                                Client: {order.client_details?.first_name} {order.client_details?.last_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold">{formatPrice(order.total_amount, 'USD')}</div>
                                            <div className="mt-2">{getStatusBadge(order.status)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                                    <div className="space-y-4">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-gray-900 mb-2">
                                                            {item.project_details?.title || 'Gig'}
                                                        </h5>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span className="px-2 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded font-semibold">
                                                                {item.tier} Package
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-xl font-bold text-gray-900">{formatPrice(item.final_price, 'USD')}</div>
                                                        <div className="text-sm text-gray-500">Base: {formatPrice(item.base_price, 'USD')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Escrow Status */}
                                    {order.escrow && (
                                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="font-semibold text-blue-900 mb-1">💰 Payment Status</h5>
                                                    <p className="text-sm text-blue-700">
                                                        {order.escrow.status === 'HELD' && 'Funds are held in escrow until client approves your work'}
                                                        {order.escrow.status === 'RELEASED' && 'Payment has been released to you!'}
                                                        {order.escrow.status === 'REFUNDED' && 'Payment was refunded to client'}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.escrow.status === 'HELD' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.escrow.status === 'RELEASED' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.escrow.status}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Messages & Actions */}
                                    <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <div className="flex-1 w-full">
                                            {order.status === 'PENDING' && (
                                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                                                    ⏳ Waiting for client to complete payment
                                                </div>
                                            )}
                                            {order.status === 'PAID' && (
                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                                                    🚀 Payment received! Start working on this order. Client will release payment when satisfied.
                                                </div>
                                            )}
                                            {order.status === 'COMPLETED' && (
                                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                                                    ✅ Order completed! Payment has been released to you.
                                                </div>
                                            )}
                                            {order.status === 'CANCELLED' && (
                                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                                    ❌ Order cancelled.
                                                </div>
                                            )}
                                            {order.status === 'REFUNDED' && (
                                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                                    💸 Order refunded to client.
                                                </div>
                                            )}
                                        </div>

                                        {['PENDING', 'PAID', 'IN_PROGRESS'].includes(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={processingOrderId === order.id}
                                                className="w-full sm:w-auto px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
                                            >
                                                {processingOrderId === order.id ? (
                                                    <span>Processing...</span>
                                                ) : (
                                                    <>
                                                        <XCircle size={20} />
                                                        <span>Cancel Order</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreelancerOrders;
