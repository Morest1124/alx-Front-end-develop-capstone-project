import React, { useContext, useEffect } from 'react';
import { ArrowRight, CheckCircle, Shield, Globe, Star, Users, Zap } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Image imports for hero collage
import webDevImg from '../assets/web_development.png';
import dataScienceImg from '../assets/data_science.png';
import graphicDesignImg from '../assets/graphic_design.png';
import virtualAssistantImg from '../assets/virtual_assistant.png';
import mobileAppImg from '../assets/mobile_app.png';
import marketingImg from '../assets/marketing.png';

const PublicHome = () => {
  return (
    <div className="bg-white text-gray-900 font-inter overflow-x-hidden">
      {/* Premium Hero Section */}
      <header className="relative min-h-[90vh] flex items-center pt-20 pb-12 lg:pt-0 lg:pb-0 bg-gradient-to-br from-white via-blue-50/30 to-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-[var(--color-accent-light)] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[50%] bg-[var(--color-secondary-light)] rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] font-semibold text-sm border border-[var(--color-accent-hover)]/20 animate-bounce-slow">
                <Zap size={16} className="mr-2" />
                <span>The Future of Freelancing is Here</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.1]">
                Connect with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)]">
                  Elite Global Talent.
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Secure payments. Verified experts. 24/7 Premium Support.
                Experience the world's most trusted marketplace for professional services.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup?role=client"
                  className="px-10 py-5 bg-[var(--color-accent)] text-white font-bold rounded-2xl hover:bg-[var(--color-accent-hover)] transition-all transform hover:scale-105 shadow-[0_20px_40px_-15px_rgba(var(--color-accent-rgb),0.3)] flex items-center justify-center text-lg"
                >
                  Hire the Best
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/signup?role=freelancer"
                  className="px-10 py-5 bg-white text-[var(--color-accent)] font-bold rounded-2xl border-2 border-[var(--color-accent)]/20 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all flex items-center justify-center text-lg"
                >
                  Start Earning
                </Link>
              </div>

              {/* Social Proof / Stats */}
              <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-8 border-t border-gray-100">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="rounded-full" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-[10px] text-white font-bold">
                    +10k
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-sm font-medium text-gray-500">Trusted by over 10,000 businesses</p>
                </div>
              </div>
            </div>

            {/* Right Side: Dynamic Image Collage */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Main Center Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] z-20 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white rotate-3 transition-transform hover:rotate-0 duration-500 group">
                <img src={webDevImg} alt="Web Dev" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-bold text-sm">Development</p>
                </div>
              </div>

              {/* Floating Image 1: Data */}
              <div className="absolute top-[10%] left-[15%] w-[180px] h-[180px] z-10 rounded-3xl overflow-hidden shadow-xl border-4 border-white -rotate-6 animate-float-slow">
                <img src={dataScienceImg} alt="Data Science" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-bold text-xs">Analytics</p>
                </div>
              </div>

              {/* Floating Image 2: Design */}
              <div className="absolute bottom-[10%] right-[10%] w-[200px] h-[200px] z-30 rounded-3xl overflow-hidden shadow-xl border-4 border-white rotate-6 animate-float">
                <img src={graphicDesignImg} alt="Graphic Design" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-bold text-xs">Creative</p>
                </div>
              </div>

              {/* Floating Image 3: Mobile App */}
              <div className="absolute top-[5%] right-[5%] w-[160px] h-[160px] z-10 rounded-3xl overflow-hidden shadow-xl border-4 border-white 12-rotate-12 animate-float-delayed">
                <img src={mobileAppImg} alt="Mobile App" className="w-full h-full object-cover" />
              </div>

              {/* Floating Image 4: Marketing */}
              <div className="absolute bottom-[20%] left-[5%] w-[180px] h-[180px] z-10 rounded-3xl overflow-hidden shadow-xl border-4 border-white -rotate-12 animate-float">
                <img src={marketingImg} alt="Marketing" className="w-full h-full object-cover" />
              </div>

              {/* Floating Decorative Cards */}
              <div className="absolute top-[40%] right-[0%] p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 z-40 animate-pulse-slow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-success-light)] flex items-center justify-center text-[var(--color-success)]">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Project Completed</p>
                    <p className="text-[10px] text-gray-500">Released $2,500.00</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[40%] left-[0%] p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 z-40 animate-float-slow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-info-light)] flex items-center justify-center text-[var(--color-info)]">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Active Talent</p>
                    <p className="text-[10px] text-gray-500">1,248 available now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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