import React, { useState, useEffect } from 'react';
import { getOrders, releasePayment, cancelOrder } from '../api';
import { formatToZAR } from '../utils/currency';
import { Package, Clock, CheckCircle, XCircle, DollarSign, User, Calendar } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingOrderId, setProcessingOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReleasePayment = async (orderId) => {
        if (!window.confirm('Are you sure you want to approve this work and release payment to the freelancer?')) {
            return;
        }

        try {
            setProcessingOrderId(orderId);
            await releasePayment(orderId);
            alert('✅ Payment released to freelancer! Order marked as completed.');
            await fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Failed to release payment:', error);
            alert('❌ Failed to release payment. ' + (error.message || 'Please try again.'));
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? If paid, funds will be refunded.')) {
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
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending Payment' },
            PAID: { color: 'bg-blue-100 text-blue-800', icon: DollarSign, text: 'Paid - In Progress' },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Completed' },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelled' },
            REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Refunded' },
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
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
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
                        <Package className="w-10 h-10 mr-3 text-indigo-600" />
                        My Orders
                    </h1>
                    <p className="text-gray-600">View and manage your gig purchases</p>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">You haven't purchased any gigs yet.</p>
                        <a
                            href="/find-talent"
                            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                        >
                            Browse Gigs
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-1">Order #{order.order_number}</h3>
                                            <p className="text-indigo-100 flex items-center">
                                                <Calendar size={16} className="mr-2" />
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold">{formatToZAR(order.total_amount)}</div>
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
                                                            <span className="flex items-center">
                                                                <User size={16} className="mr-1" />
                                                                Freelancer: {item.freelancer_details?.first_name} {item.freelancer_details?.last_name}
                                                            </span>
                                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded font-semibold">
                                                                {item.tier} Package
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-xl font-bold text-gray-900">{formatToZAR(item.final_price)}</div>
                                                        <div className="text-sm text-gray-500">Base: {formatToZAR(item.base_price)}</div>
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
                                                    <h5 className="font-semibold text-blue-900 mb-1">💰 Escrow Status</h5>
                                                    <p className="text-sm text-blue-700">
                                                        Funds are being held securely until you approve the work
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

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        {order.status === 'PAID' && order.escrow?.status === 'HELD' && (
                                            <button
                                                onClick={() => handleReleasePayment(order.id)}
                                                disabled={processingOrderId === order.id}
                                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                            >
                                                {processingOrderId === order.id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={20} />
                                                        <span>Approve Work & Release Payment</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {['PENDING', 'PAID', 'IN_PROGRESS'].includes(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={processingOrderId === order.id}
                                                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

                                        {order.status === 'COMPLETED' && (
                                            <div className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold text-center flex items-center justify-center space-x-2">
                                                <CheckCircle size={20} />
                                                <span>Work Approved - Payment Released</span>
                                            </div>
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

export default MyOrders;
