import React, { useContext, useState, useEffect } from 'react';
import { EarningsContext } from '../contexts/EarningsContext';
import { getOrders } from '../api';
import { formatToZAR } from '../utils/currency';
import { DollarSign, TrendingUp, Clock, CheckCircle, Package, Calendar, User } from 'lucide-react';
import Loader from '../components/Loader';

const Earnings = () => {
  const { transactions, totalEarnings } = useContext(EarningsContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    totalFromOrders: 0,
    pendingInEscrow: 0,
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

      // Calculate order-based stats
      const completed = ordersList.filter(o => o.status === 'COMPLETED');
      const active = ordersList.filter(o => o.status === 'PAID');
      const totalFromOrders = completed.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
      const pendingInEscrow = active.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

      setOrderStats({
        totalFromOrders,
        pendingInEscrow,
        completedOrders: completed.length,
        activeOrders: active.length
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Awaiting Payment' },
      PAID: { color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.text}</span>;
  };

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-8">Earnings & Orders</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm">Total Earnings</span>
            <TrendingUp className="w-5 h-5 text-green-200" />
          </div>
          <div className="text-3xl font-bold">{formatToZAR(orderStats.totalFromOrders)}</div>
          <div className="text-xs text-green-200 mt-1">From completed orders</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">In Escrow</span>
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600">{formatToZAR(orderStats.pendingInEscrow)}</div>
          <div className="text-xs text-gray-500 mt-1">Pending release</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">{orderStats.completedOrders}</div>
          <div className="text-xs text-gray-500 mt-1">Orders finished</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Active</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{orderStats.activeOrders}</div>
          <div className="text-xs text-gray-500 mt-1">In progress</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <Package className="w-6 h-6 mr-2 text-indigo-600" />
          Recent Orders
        </h3>
        {loading ? (
          <div className="text-center py-8">
            <Loader size="large" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-gray-900">Order #{order.order_number}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <User size={14} className="mr-1" />
                        {order.client_details?.first_name} {order.client_details?.last_name}
                      </span>
                      {order.escrow && (
                        <span className={`text-xs px-2 py-1 rounded ${order.escrow.status === 'HELD' ? 'bg-yellow-100 text-yellow-800' :
                          order.escrow.status === 'RELEASED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          Escrow: {order.escrow.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-gray-900">{formatToZAR(order.total_amount)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legacy Transactions */}
      {transactions && transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4">All Transactions</h3>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <div>
                  <p className="font-semibold">{transaction.project}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <p className="font-bold text-green-600">
                  +{formatToZAR(transaction.amount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Earnings;