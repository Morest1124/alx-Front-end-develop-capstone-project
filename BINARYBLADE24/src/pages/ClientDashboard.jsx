import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ClientDashboardContext } from '../contexts/ClientDashboardContext';
import { getOrders } from '../api';
import PageWrapper from './PageWrapper';
import { DashboardCard, LucideIcon } from './DashboardUtils';
import { formatToZAR } from '../utils/currency';
import Loader from '../components/Loader';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const { dashboardData, loading, error } = useContext(ClientDashboardContext);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalSpent: 0,
    activeOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      const ordersList = Array.isArray(data) ? data : data.results || [];
      setOrders(ordersList);

      // Calculate stats
      const completed = ordersList.filter(o => o.status === 'COMPLETED');
      const active = ordersList.filter(o => o.status === 'PAID' || o.status === 'PENDING');
      const totalSpent = ordersList.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

      setOrderStats({
        totalSpent,
        activeOrders: active.length,
        completedOrders: completed.length
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Loading Dashboard...">
        <div className="flex flex-col items-center justify-center p-12">
          <Loader size="large" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Error">
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`Client Dashboard | ${user.name}`}>
      {dashboardData && (
        <div className="space-y-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Active Orders"
              value={orderStats.activeOrders}
              icon="ShoppingCart"
              to="/client/billing"
              bgColor="bg-[var(--color-info-light)]"
              textColor="text-[var(--color-info)]"
            />
            <DashboardCard
              title="Completed Orders"
              value={orderStats.completedOrders}
              icon="CheckCircle"
              to="/client/billing"
              bgColor="bg-[var(--color-success-light)]"
              textColor="text-[var(--color-success)]"
            />
            <DashboardCard
              title="Total Spent"
              value={formatToZAR(orderStats.totalSpent)}
              icon="DollarSign"
              to="/client/billing"
              bgColor="bg-[var(--color-success-light)]"
              textColor="text-[var(--color-success)]"
            />
            <DashboardCard
              title="Proposals Received"
              value={dashboardData.proposals_received || 0}
              icon="Mail"
              to="/client/proposals"
              bgColor="bg-[var(--color-warning-light)]"
              textColor="text-[var(--color-warning)]"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <LucideIcon
                name="Activity"
                size={20}
                className="mr-2 text-[var(--color-accent)]"
              />{" "}
              Recent Orders
            </h3>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            ) : (
              <ul className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <li
                    key={order.id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0 text-gray-600"
                  >
                    <span>Order #{order.order_number} - {order.status}</span>
                    <span className="text-sm text-gray-400">{formatToZAR(order.total_amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default ClientDashboard;
