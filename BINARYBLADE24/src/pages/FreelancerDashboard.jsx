import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import PageWrapper from './PageWrapper';

const FreelancerDashboard = () => {
    const { user } = useContext(AuthContext);
    return (
        <PageWrapper title={`Freelancer Dashboard | ${user.name}`}>
            <p className="text-lg text-green-700 font-semibold mb-4">You are logged in as a Freelancer.</p>
            <div className="bg-white p-6 rounded-xl shadow">
                <p>You have <span className="font-bold text-green-600">12 jobs saved</span> and <span className="font-bold text-green-600">8 active proposals</span>. Check your Earnings page for your latest payment status.</p>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Go to Earnings</button>
            </div>
        </PageWrapper>
    );
};

export default FreelancerDashboard;