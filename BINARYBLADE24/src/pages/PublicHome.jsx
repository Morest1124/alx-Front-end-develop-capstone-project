import React from 'react';
import { ArrowRight, CheckCircle, Shield, Globe } from "lucide-react";
import { Link } from 'react-router-dom';

const PublicHome = () => {
  return (
    <div className="bg-gray-50 text-gray-800 font-inter">
      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Connect with Global Talent.</span>{' '}
                  <span className="block text-[var(--color-accent)] xl:inline">Get Work Done.</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Secure payments. Verified talent. 24/7 Support. From quick tasks to major projects, find the right professional in minutes.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/signup?role=client"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] md:py-4 md:text-lg md:px-10"
                    >
                      Find Talent
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/signup?role=freelancer"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-accent)] bg-[var(--color-accent-light)] hover:bg-cyan-100 md:py-4 md:text-lg md:px-10"
                    >
                      Find Work
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="Team working together"
          />
        </div>
      </header>

      {/* Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-[var(--color-accent)] font-semibold tracking-wide uppercase">Why Choose Us?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              The Marketplace for Professional Freelance Services
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Join a growing network of businesses and independent professionals.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[var(--color-accent)] text-white">
                  <Shield className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Payments</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Funds are held in escrow and only released when you're satisfied.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[var(--color-accent)] text-white">
                  <CheckCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Verified Talent</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  We verify freelancer identities and skills to ensure quality work.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[var(--color-accent)] text-white">
                  <Globe className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Global Network</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Access a global pool of experts ready to work on your schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Sections */}
      <main className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Client Section */}
          <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Are you a Client?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Post a job and find the perfect freelancer for your project.
              Access a global pool of verified experts.
            </p>
            <Link to="/find-talent" className="inline-flex items-center justify-center bg-[var(--color-accent)] text-white font-bold py-3 px-8 rounded-full hover:bg-[var(--color-accent-hover)] transition-colors shadow-md">
              Find Talent
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Freelancer Section */}
          <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Are you a Freelancer?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Find your next project and showcase your skills to top clients.
              The best opportunities await.
            </p>
            <Link to="/find-work" className="inline-flex items-center justify-center bg-[var(--color-secondary)] text-white font-bold py-3 px-8 rounded-full hover:bg-[var(--color-secondary-hover)] transition-colors shadow-md">
              Find Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicHome;