import React, { useState, useEffect } from 'react';
import { getOrders, releasePayment, cancelOrder } from '../api';
import { useCurrency } from '../contexts/CurrencyContext';
import Loader from '../components/Loader';
import { Package, Clock, CheckCircle, XCircle, DollarSign, User, Calendar, FileText, CreditCard, Shield } from 'lucide-react';

const MyOrders = () => {
    const { formatPrice } = useCurrency();
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
            alert('Payment released to freelancer! Order marked as completed.');
            await fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Failed to release payment:', error);
            alert('Failed to release payment. ' + (error.message || 'Please try again.'));
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
            alert('Order cancelled successfully!');
            await fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Failed to cancel order:', error);
            alert('Failed to cancel order. ' + (error.message || 'Please try again.'));
        } finally {
            setProcessingOrderId(null);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'Pending Payment' },
            PAID: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: DollarSign, text: 'Paid - In Progress' },
            COMPLETED: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Completed' },
            CANCELLED: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, text: 'Cancelled' },
            REFUNDED: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle, text: 'Refunded' },
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        const Icon = config.icon;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center space-x-1 border ${config.color}`}>
                <Icon size={14} />
                <span>{config.text}</span>
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader size="xl" />
                    <p className="text-gray-600 mt-4">Loading your billing history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <CreditCard className="w-8 h-8 mr-3 text-[var(--color-accent)]" />
                            Billing & Orders
                        </h1>
                        <p className="text-gray-600 mt-2">Manage your purchases, invoices, and payments.</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        {/* Placeholder for future payment method management */}
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm flex items-center shadow-sm">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Manage Payment Methods
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't purchased any gigs yet. Once you hire a freelancer, your orders and invoices will appear here.</p>
                        <a
                            href="/find-talent"
                            className="inline-flex items-center px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition font-semibold shadow-md hover:shadow-lg"
                        >
                            Browse Gigs
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                {/* Order Header */}
                                <div className="bg-gray-50 border-b border-gray-200 p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900">Order #{order.order_number}</h3>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Calendar size={14} className="mr-1.5" />
                                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-[var(--color-accent)]">{formatPrice(order.total_amount, 'USD')}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Amount</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex-1">
                                                    <h5 className="font-semibold text-gray-900 text-lg mb-1">
                                                        {item.project_details?.title || 'Gig Service'}
                                                    </h5>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center">
                                                            <User size={14} className="mr-1.5" />
                                                            {item.freelancer_details?.first_name} {item.freelancer_details?.last_name}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                                                            {item.tier} Package
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right mt-4 sm:mt-0 sm:ml-6">
                                                    <div className="font-bold text-gray-900">{formatPrice(item.final_price, 'USD')}</div>
                                                    {item.base_price !== item.final_price && (
                                                        <div className="text-xs text-gray-500 line-through">{formatPrice(item.base_price, 'USD')}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Escrow Status */}
                                    {order.escrow && (
                                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h5 className="font-semibold text-blue-900">Secure Escrow Payment</h5>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${order.escrow.status === 'HELD' ? 'bg-blue-200 text-blue-800' :
                                                        order.escrow.status === 'RELEASED' ? 'bg-green-200 text-green-800' :
                                                            'bg-gray-200 text-gray-800'
                                                        }`}>
                                                        {order.escrow.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-blue-700">
                                                    Your funds are held securely in escrow. Payment is only released to the freelancer once you approve the work.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                        {order.status === 'PAID' && order.escrow?.status === 'HELD' && (
                                            <button
                                                onClick={() => handleReleasePayment(order.id)}
                                                disabled={processingOrderId === order.id}
                                                className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
                                            >
                                                {processingOrderId === order.id ? (
                                                    <>
                                                        <Loader size="small" color="white" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={18} />
                                                        <span>Approve & Release Funds</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {['PENDING', 'PAID', 'IN_PROGRESS'].includes(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={processingOrderId === order.id}
                                                className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                            >
                                                {processingOrderId === order.id ? (
                                                    <span>Processing...</span>
                                                ) : (
                                                    <>
                                                        <XCircle size={18} />
                                                        <span>Cancel Order</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {order.status === 'COMPLETED' && (
                                            <div className="flex-1 px-6 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg font-semibold text-center flex items-center justify-center space-x-2">
                                                <CheckCircle size={18} />
                                                <span>Transaction Completed</span>
                                            </div>
                                        )}

                                        <button className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center justify-center">
                                            <FileText size={16} className="mr-2" />
                                            Invoice
                                        </button>
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
