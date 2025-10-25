import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ClientDashboardContext } from '../contexts/ClientDashboardContext'; // Updated import
import PageWrapper from './PageWrapper';
import { DashboardCard, LucideIcon } from './DashboardUtils';
import { formatToZAR } from '../utils/currency';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    // Use the new, comprehensive context
    const { dashboardData, loading, error } = useContext(ClientDashboardContext);

    if (loading) {
      return (
        <PageWrapper title="Loading Dashboard...">
          <div className="text-center p-8">Loading...</div>
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
                title="Active Projects"
                value={dashboardData.active_projects}
                icon="Briefcase"
                to="/client/projects/active"
                bgColor="bg-blue-50"
                textColor="text-blue-700"
              />
              <DashboardCard
                title="Completed Projects"
                value={dashboardData.completed_projects}
                icon="CheckCircle"
                to="/client/projects/concluded"
                bgColor="bg-green-50"
                textColor="text-green-700"
              />
              <DashboardCard
                title="Total Spent"
                value={formatToZAR(dashboardData.total_spent, 'ZAR')}
                icon="DollarSign"
                to="/client/billing"
                bgColor="bg-green-50"
                textColor="text-green-700"
              />
              <DashboardCard
                title="Proposals Received"
                value={dashboardData.proposals_received}
                icon="Mail"
                to="/client/proposals"
                bgColor="bg-yellow-50"
                textColor="text-yellow-700"
              />
              <DashboardCard
                title="Freelancers Hired"
                value={dashboardData.freelancers_hired}
                icon="Users"
                to="/client/freelancers"
                bgColor="bg-indigo-50"
                textColor="text-indigo-700"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <LucideIcon
                  name="Activity"
                  size={20}
                  className="mr-2 text-indigo-500"
                />{" "}
                Recent Activity
              </h3>
              <ul className="space-y-4">
                {dashboardData.recent_transactions.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0 text-gray-600"
                  >
                    <span>Payment of {formatToZAR(item.amount, 'ZAR')} made for "{item.project}".</span>
                    <span className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </PageWrapper>
    );
};

export default ClientDashboard;
