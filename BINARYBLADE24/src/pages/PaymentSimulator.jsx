import React, { useState, useEffect } from 'react';
import { getOrders, markOrderPaid } from '../api';
import { formatToZAR } from '../utils/currency';
import { CreditCard, CheckCircle, Clock, XCircle, TrendingUp, Wallet, AlertCircle } from 'lucide-react';

const PaymentSimulator = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bankBalance, setBankBalance] = useState(50000); // Starting balance
    const [transactions, setTransactions] = useState([]);
    const [pendingOrder, setPendingOrder] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchOrders();

        // Check for pending order from checkout
        const storedOrder = sessionStorage.getItem('pendingOrder');
        if (storedOrder) {
            const orderData = JSON.parse(storedOrder);
            setPendingOrder(orderData);
            setShowPaymentModal(true);
            sessionStorage.removeItem('pendingOrder'); // Clear it
        }
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(Array.isArray(data) ? data : data.results || []);

            // Calculate transactions from orders
            const orderTransactions = (Array.isArray(data) ? data : data.results || []).map(order => ({
                id: order.id,
                orderNumber: order.order_number,
                amount: order.total_amount,
                status: order.status,
                timestamp: order.created_at,
                paidAt: order.paid_at,
                type: 'PAYMENT'
            }));

            setTransactions(orderTransactions);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePayment = async () => {
        if (!pendingOrder) return;

        try {
            setProcessing(true);

            // Mark order as paid
            await markOrderPaid(pendingOrder.orderId);

            // Deduct from bank balance
            setBankBalance(prev => prev - parseFloat(pendingOrder.amount));

            // Show success
            alert(
                `✅ Payment Successful!\n\n` +
                `Order #: ${pendingOrder.orderNumber}\n` +
                `Amount: ${formatToZAR(pendingOrder.amount)}\n` +
                `Gig: ${pendingOrder.gigTitle}\n` +
                `Freelancer: ${pendingOrder.freelancer}\n\n` +
                `The freelancer has been notified and will start working on your project!`
            );

            // Close modal and refresh
            setShowPaymentModal(false);
            setPendingOrder(null);
            await fetchOrders();

        } catch (error) {
            console.error('Payment failed:', error);
            alert(`❌ Payment Failed\n\n${error.message || 'Please try again.'}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelPayment = () => {
        setShowPaymentModal(false);
        setPendingOrder(null);
        alert('Payment cancelled. Order remains pending.');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PAID':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'CANCELLED':
            case 'REFUNDED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID':
                return 'badge-success';
            case 'PENDING':
                return 'badge-warning';
            case 'CANCELLED':
            case 'REFUNDED':
                return 'badge-error';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const totalPaid = transactions
        .filter(t => t.status === 'PAID')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalPending = transactions
        .filter(t => t.status === 'PENDING')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-accent-light)] to-[var(--color-secondary-light)] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                        <Wallet className="w-10 h-10 mr-3 text-[var(--color-accent)]" />
                        Payment Simulator Bank
                    </h1>
                    <p className="text-gray-600">Monitor all payment transactions in real-time</p>
                </div>

                {/* Payment Approval Modal */}
                {showPaymentModal && pendingOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-10 h-10 text-yellow-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Approve Payment</h2>
                                <p className="text-gray-600">Review and confirm this transaction</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order #:</span>
                                    <span className="font-semibold text-gray-900">{pendingOrder.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Gig:</span>
                                    <span className="font-semibold text-gray-900 text-right">{pendingOrder.gigTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Package:</span>
                                    <span className="font-semibold text-gray-900">{pendingOrder.tier}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Freelancer:</span>
                                    <span className="font-semibold text-gray-900">{pendingOrder.freelancer}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                        <span className="text-2xl font-bold text-[var(--color-success)]">{formatToZAR(pendingOrder.amount)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Bank Balance:</strong> {formatToZAR(bankBalance)}
                                </p>
                                <p className="text-sm text-blue-800 mt-1">
                                    <strong>After Payment:</strong> {formatToZAR(bankBalance - parseFloat(pendingOrder.amount))}
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCancelPayment}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApprovePayment}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 btn-success transition font-semibold disabled:opacity-50 flex items-center justify-center"
                                >
                                    {processing ? (
                                        <>
                                            <Loader size="small" color="white" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Approve Payment
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Bank Balance */}
                    <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white opacity-80">Bank Balance</span>
                            <Wallet className="w-6 h-6 text-white opacity-80" />
                        </div>
                        <div className="text-3xl font-bold">{formatToZAR(bankBalance)}</div>
                        <div className="text-sm text-white opacity-80 mt-1">Available Funds</div>
                    </div>

                    {/* Total Paid */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Total Paid</span>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-[var(--color-success)]">{formatToZAR(totalPaid)}</div>
                        <div className="text-sm text-gray-500 mt-1">{transactions.filter(t => t.status === 'PAID').length} transactions</div>
                    </div>

                    {/* Pending Payments */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Pending</span>
                            <Clock className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="text-3xl font-bold text-[var(--color-warning)]">{formatToZAR(totalPending)}</div>
                        <div className="text-sm text-gray-500 mt-1">{transactions.filter(t => t.status === 'PENDING').length} awaiting</div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
                            Recent Transactions
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <Loader size="large" />
                            <p className="mt-4 text-gray-600">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No transactions yet</p>
                            <p className="text-sm text-gray-400 mt-2">Payments will appear here when clients purchase gigs</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Paid At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(transaction.status)}
                                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                                        {transaction.orderNumber}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatToZAR(transaction.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.paidAt ? new Date(transaction.paidAt).toLocaleString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Refresh Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={fetchOrders}
                        className="px-6 py-3 btn-primary font-semibold shadow-lg"
                    >
                        🔄 Refresh Transactions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSimulator;
