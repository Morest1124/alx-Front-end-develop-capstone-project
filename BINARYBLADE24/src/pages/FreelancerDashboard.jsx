import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import PageWrapper from "./PageWrapper";
import { LucideIcon, DashboardCard } from "./DashboardUtils";
import CreateGigForm from "../components/CreateGigForm";

const FreelancerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <PageWrapper title={` ${user.name}`}>
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-2 px-4 text-lg ${
            activeTab === "dashboard"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Dashboard
        </button>
        {/* <button
          onClick={() => setActiveTab("create-gig")}
          className={`py-2 px-4 text-lg ${
            activeTab === "create-gig"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Create Gig
        </button> */}
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-10">
          {/* ROW 1: Financial and Contract Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Earnings (ZAR)"
              value="R24,896,30"
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
              value="R4,481,33"
              icon="CreditCard"
              to="/freelancer/tax"
              bgColor="bg-red-50"
              textColor="text-red-700"
            >
              <span className="text-sm text-gray-500">
                Based on 18% ZAR rate.
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

          {/* Performance and Profile Reach Metrics */}
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
      )}

      {activeTab === "create-gig" && <CreateGigForm />}
    </PageWrapper>
  );
};

export default FreelancerDashboard;
