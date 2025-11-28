import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getFreelancerDashboard } from "../api"; // Import the API function
import PageWrapper from "./PageWrapper";
import { LucideIcon, DashboardCard } from "./DashboardUtils";
import CreateGigForm from "../components/CreateGigForm";
import { formatToZAR } from "../utils/currency";

import { Link } from "../contexts/Routers";

const FreelancerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFreelancerDashboard();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data.");
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <PageWrapper title={` ${user.name}`}>
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-2 px-4 text-lg ${activeTab === "dashboard"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
            }`}
        >
          Dashboard
        </button>
        <Link
          to="/freelancer/create-gig"
          className={`py-2 px-4 text-lg ${activeTab === "create-gig"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
            }`}
        >
          Create Gig
        </Link>
      </div>

      {activeTab === "dashboard" && dashboardData && (
        <div className="space-y-10">
          {/* ROW 1: Financial and Contract Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Monthly Earnings (ZAR)"
              value={formatToZAR(dashboardData.total_earnings, "ZAR")}
              icon="TrendingUp"
              to="/freelancer/earnings"
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <DashboardCard
              title="Estimated Monthly Tax"
              value={formatToZAR(dashboardData.estimated_monthly_tax, "ZAR")}
              icon="CreditCard"
              to="/freelancer/tax"
              bgColor="bg-red-50"
              textColor="text-red-700"
            />
            <DashboardCard
              title="Active Projects"
              value={dashboardData.active_projects}
              icon="Briefcase"
              to="/freelancer/projects/active"
              bgColor="bg-white"
              textColor="text-indigo-700"
            />
            <DashboardCard
              title="Concluded Projects"
              value={dashboardData.concluded_projects}
              icon="CheckCircle"
              to="/freelancer/projects/concluded"
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
          </div>

          {/* Performance and Profile Reach Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <DashboardCard
              title="Total Orders"
              value={dashboardData.total_orders}
              icon="ShoppingBag"
              to="/freelancer/projects"
              bgColor="bg-white"
              textColor="text-indigo-700"
            />
            <DashboardCard
              title="Achievement Rating"
              value={`${dashboardData.achievement_rating}%`}
              icon="Trophy"
              to="/freelancer/reviews"
              bgColor="bg-white"
              textColor="text-green-700"
            />
            <DashboardCard
              title="Response Rate"
              value={`${dashboardData.response_rate}`}
              icon="MailCheck"
              to="/messages"
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <DashboardCard
              title="Total Impressions"
              value={dashboardData.total_impressions}
              icon="Eye"
              to="/freelancer/analytics"
              bgColor="bg-white"
              textColor="text-indigo-700"
            />
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
              {dashboardData.recent_proposals.map((proposal, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0 text-gray-600"
                >
                  <span>
                    {proposal.title} ({proposal.status})
                  </span>
                  <span className="text-sm text-gray-400">{proposal.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "create-gig" && <CreateGigForm />}
    </PageWrapper>
  );
};

export default FreelancerDashboard;
