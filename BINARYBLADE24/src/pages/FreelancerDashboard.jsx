import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Expects AuthContext file in ../contexts/
import PageWrapper from "./PageWrapper"; // Expects PageWrapper file in the same directory (./)
import { LucideIcon, DashboardCard } from "./DashboardUtils"; // Expects DashboardUtils in the same directory (./)

/**
 * FreelancerDashboard Component
 * Displays key performance metrics, financial data, and recent activity
 * relevant to a freelance user.
 */
const FreelancerDashboard = () => {
  // Access user context to display personalized data (e.g., name)
  const { user } = useContext(AuthContext);

  return (
    <PageWrapper title={`Freelancer Dashboard | ${user.name}`}>
      <div className="space-y-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Freelancer Dashboard
        </h2>

        {/* ROW 1: Financial and Contract Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Earnings (YTD)"
            value="$24,800"
            icon="TrendingUp"
            to="/freelancer/earnings"
            bgColor="bg-green-50"
            textColor="text-green-700"
          >
            <span className="text-sm text-gray-500">
              Up 15% from last quarter
            </span>
          </DashboardCard>
          <DashboardCard
            title="Estimated Monthly Tax"
            value="$522"
            icon="CreditCard"
            to="/freelancer/tax"
            bgColor="bg-red-50"
            textColor="text-red-700"
          >
            <span className="text-sm text-gray-500">
              Based on 18% flat rate.
            </span>
          </DashboardCard>
          <DashboardCard
            title="Active Projects"
            value="2"
            icon="Briefcase"
            to="/freelancer/projects/active"
            bgColor="bg-white"
            textColor="text-indigo-700"
          >
            <span className="text-sm text-red-600 font-medium">
              Deadline next week
            </span>
          </DashboardCard>
          <DashboardCard
            title="Concluded Projects"
            value="43"
            icon="CheckCircle"
            to="/freelancer/projects/concluded"
            bgColor="bg-green-50"
            textColor="text-green-700"
          >
            <span className="text-sm text-gray-500">
              All successfully delivered
            </span>
          </DashboardCard>
        </div>

        {/* ROW 2: Performance and Profile Reach Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <DashboardCard
            title="Total Orders"
            value="45"
            icon="ShoppingBag"
            to="/freelancer/projects"
            bgColor="bg-white"
            textColor="text-indigo-700"
          >
            <span className="text-sm text-gray-500">
              Total contracts won lifetime
            </span>
          </DashboardCard>
          <DashboardCard
            title="Achievement Rating"
            value="98%"
            icon="Trophy"
            to="/freelancer/reviews"
            bgColor="bg-white"
            textColor="text-green-700"
          >
            <span className="text-sm text-gray-500">
              Based on client feedback
            </span>
          </DashboardCard>
          <DashboardCard
            title="Response Rate"
            value="95%"
            icon="MailCheck"
            to="/messages"
            bgColor="bg-green-50"
            textColor="text-green-700"
          >
            <span className="text-sm text-green-600 font-medium">
              Excellent communication!
            </span>
          </DashboardCard>
          <DashboardCard
            title="Total Impressions"
            value="18.5K"
            icon="Eye"
            to="/freelancer/analytics"
            bgColor="bg-white"
            textColor="text-indigo-700"
          >
            <span className="text-sm text-gray-500">
              Profile views in last 30 days
            </span>
          </DashboardCard>
        </div>

        {/* Recent Proposals */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <LucideIcon
              name="Target"
              size={20}
              className="mr-2 text-indigo-500"
            />{" "}
            Recent Proposals
          </h3>
          <ul className="space-y-4">
            {[
              "E-commerce Backend (Pending)",
              "Mobile App UI (Accepted)",
              "Marketing Strategy (Declined)",
            ].map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b last:border-b-0 text-gray-600"
              >
                <span>{item}</span>
                <span className="text-sm text-gray-400">yesterday</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FreelancerDashboard;
