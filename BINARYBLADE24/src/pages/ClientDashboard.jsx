import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import PageWrapper from './PageWrapper';
import { DashboardCard, LucideIcon } from './DashboardUtils';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    return (
        <PageWrapper title={`Client Dashboard | ${user.name}`}>
            <div className="space-y-10">
                <h2 className="text-3xl font-bold text-gray-800">
                    Client Dashboard
                </h2>

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
                        value="$12,500"
                        icon="DollarSign"
                        to="/client/billing"
                        bgColor="bg-green-50"
                        textColor="text-green-700"
                    >
                        <span className="text-sm text-gray-500">
                            Across 15 projects.
                        </span>
                    </DashboardCard>
                    <DashboardCard
                        title="Proposals Received"
                        value="12"
                        icon="Mail"
                        to="/client/proposals"
                        bgColor="bg-yellow-50"
                        textColor="text-yellow-700"
                    >
                        <span className="text-sm text-gray-500">
                            For 3 open jobs.
                        </span>
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
                    <ul className="space-y-4">
                        {[
                            "Payment of $2,500 made to John D.",
                            "New proposal received for 'Website Redesign'.",
                            "Project 'Mobile App Development' marked as complete.",
                        ].map((item, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center py-2 border-b last:border-b-0 text-gray-600"
                            >
                                <span>{item}</span>
                                <span className="text-sm text-gray-400">today</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ClientDashboard;
