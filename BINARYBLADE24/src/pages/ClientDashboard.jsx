import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ClientSpendingContext } from '../contexts/ClientSpendingContext';
import PageWrapper from './PageWrapper';
import { DashboardCard, LucideIcon } from './DashboardUtils';
import { formatToZAR } from '../utils/currency';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const { totalSpent, transactions, loading } = useContext(ClientSpendingContext);

    return (
      <PageWrapper title={`Client Dashboard | ${user.name}`}>
        <div className="space-y-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Active Projects"
              value="4"
              icon="Briefcase"
              to="/client/projects/active"
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            >
              <span className="text-sm text-gray-500">
                2 projects are nearing deadline.
              </span>
            </DashboardCard>
            <DashboardCard
              title="Total Spent"
              value={loading ? 'Loading...' : formatToZAR(totalSpent, 'ZAR')}
              icon="DollarSign"
              to="/client/billing"
              bgColor="bg-green-50"
              textColor="text-green-700"
            >
              <span className="text-sm text-gray-500">Across {transactions.length} projects.</span>
            </DashboardCard>
            <DashboardCard
              title="Proposals Received"
              value="12"
              icon="Mail"
              to="/client/proposals"
              bgColor="bg-yellow-50"
              textColor="text-yellow-700"
            >
              <span className="text-sm text-gray-500">For 3 open jobs.</span>
            </DashboardCard>
            <DashboardCard
              title="Freelancers Hired"
              value="8"
              icon="Users"
              to="/client/freelancers"
              bgColor="bg-indigo-50"
              textColor="text-indigo-700"
            >
              <span className="text-sm text-gray-500">
                3 are new this month.
              </span>
            </DashboardCard>
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
            {loading ? (
              <p>Loading recent activity...</p>
            ) : (
              <ul className="space-y-4">
                {transactions.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0 text-gray-600"
                  >
                    <span>Payment of {formatToZAR(item.amount, 'ZAR')} made for "{item.project}".</span>
                    <span className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PageWrapper>
    );
};

export default ClientDashboard;
