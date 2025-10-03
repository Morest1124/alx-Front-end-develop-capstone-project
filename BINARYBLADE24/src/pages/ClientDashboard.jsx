import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import PageWrapper from './PageWrapper';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    return (
        <PageWrapper title={`Client Dashboard | ${user.name}`}>
            <p className="text-lg text-indigo-700 font-semibold mb-4">You are logged in as a Client.</p>
            <div className="bg-white p-6 rounded-xl shadow">
                <p>Welcome back! You currently have <span className="font-bold text-indigo-600">4 active projects</span> and <span className="font-bold text-indigo-600">6 unread messages</span>.</p>
                <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">View Project Status</button>
            </div>
        </PageWrapper>
    );
};

export default ClientDashboard;