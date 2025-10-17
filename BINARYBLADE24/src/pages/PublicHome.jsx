import React from 'react';
import { ArrowRight } from "lucide-react";

const PublicHome = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="text-center py-20 bg-white shadow-sm">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to BinaryBlade24
        </h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          The premier marketplace connecting innovative clients with elite
          freelance talent.
        </p>
      </header>

      {/* Call to Action Sections */}
      <main className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Client Section */}
          <div className="bg-white p-10 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Are you a Client?</h2>
            <p className="text-gray-600 mb-6">
              Post a job and find the perfect freelancer for your project.
              Access a global pool of verified experts.
            </p>
            <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto">
              Find Talent
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Freelancer Section */}
          <div className="bg-white p-10 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Are you a Freelancer?</h2>
            <p className="text-gray-600 mb-6">
              Find your next project and showcase your skills to top clients.
              The best opportunities await.
            </p>
            <button className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center mx-auto">
              Find Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicHome;