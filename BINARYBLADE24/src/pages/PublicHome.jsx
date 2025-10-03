import React from 'react';
import PageWrapper from './PageWrapper';

const PublicHome = () => (
  <PageWrapper title="Welcome to FreelancingPro's ">
    <p className="text-gray-600">
      The platform connecting great clients and talented freelancers. Please Log
      In or Sign Up to see your dashboard.
    </p>
    <h1 className="text-red-600 justify-center">You are not logged in</h1>
  </PageWrapper>
);



export default PublicHome;