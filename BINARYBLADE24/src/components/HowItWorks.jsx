import React, { useState } from 'react';
import { 
  User, Briefcase, Shield, DollarSign, Search, MessageSquare, 
  CheckCircle, Star, Globe, Clock, Lock, ArrowRight, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('client');

  const clientSteps = [
    {
      title: "1. Find Talent",
      icon: Search,
      description: "Choose how you want to work:",
      details: [
        "Post a Job: Create a detailed job post and receive proposals from qualified freelancers.",
        "Browse Services: Search our catalog of pre-packaged services. Filter by delivery time, price, and seller level."
      ]
    },
    {
      title: "2. Hire & Collaborate",
      icon: MessageSquare,
      description: "Connect with the perfect professional:",
      details: [
        "Communicate directly via our secure messaging system.",
        "Share files, track milestones, and manage project requirements in one dashboard.",
        "Compare bids, reviews, and portfolios before making a decision."
      ]
    },
    {
      title: "3. Pay Securely",
      icon: Shield,
      description: "Payment Protection Guarantee:",
      details: [
        "Funds are held in escrow and only released to the freelancer once you review and approve the work.",
        "No surprise fees. You know exactly what you're paying for upfront."
      ]
    }
  ];

  const freelancerSteps = [
    {
      title: "1. Create Your Profile",
      icon: User,
      description: "Showcase your skills to the world:",
      details: [
        "Sign up for free and highlight your expertise.",
        "Upload a portfolio of your best work.",
        "Set your rates and get verification badges to stand out to potential clients."
      ]
    },
    {
      title: "2. Get Hired",
      icon: Briefcase,
      description: "Two ways to land jobs:",
      details: [
        "Submit Proposals: Browse active job listings and submit custom proposals to clients.",
        "Sell Services: Package your skills into fixed-price services (Gigs) that clients can purchase instantly."
      ]
    },
    {
      title: "3. Get Paid",
      icon: DollarSign,
      description: "Secure and reliable earnings:",
      details: [
        "Deliver high-quality work and receive payment securely.",
        "Withdraw earnings via Direct Deposit, PayPal, or Wire Transfer.",
        "Benefit from our payment protection on every order."
      ]
    }
  ];

  const trustFeatures = [
    {
      title: "Payment Protection",
      icon: Lock,
      desc: "All transactions are protected. Clients pay upfront; freelancers get paid upon approval. Financial security for both parties."
    },
    {
      title: "24/7 Customer Support",
      icon: Clock,
      desc: "Our support team is available around the clock to assist with disputes, technical issues, or account questions."
    },
    {
      title: "Quality Guarantee",
      icon: Star,
      desc: "Review seller ratings, completion rates, and client feedback before hiring. Verification checks ensure authentic profiles."
    },
    {
      title: "Dispute Resolution",
      icon: CheckCircle,
      desc: "Dedicated mediation services are available to resolve issues fairly if a project does not go as planned."
    }
  ];

  const categories = [
    "Web Development", "Mobile Apps", "WordPress", "Graphic Design", 
    "Logo Design", "Video Editing", "SEO", "Content Writing", 
    "Social Media Marketing", "Virtual Assistants", "Data Entry", "Translation"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect with Global Talent. <br/> Get Work Done.
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            The Marketplace for Professional Freelance Services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/find-talent" className="px-8 py-3 bg-white text-[var(--color-secondary)] rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              Find Talent
            </Link>
            <Link to="/find-work" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition">
              Find Work
            </Link>
          </div>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From quick tasks to major projects, find the right professional in minutes. 
            Secure payments. Verified talent. 24/7 Support.
          </p>
          
          {/* Role Toggle */}
          <div className="flex justify-center mt-8">
            <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm inline-flex">
              <button
                onClick={() => setActiveTab('client')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === 'client' 
                    ? 'bg-[var(--color-accent)] text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                For Clients
              </button>
              <button
                onClick={() => setActiveTab('freelancer')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === 'freelancer' 
                    ? 'bg-[var(--color-secondary)] text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                For Freelancers
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(activeTab === 'client' ? clientSteps : freelancerSteps).map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                activeTab === 'client' ? 'bg-cyan-50 text-[var(--color-accent)]' : 'bg-indigo-50 text-[var(--color-secondary)]'
              }`}>
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="font-medium text-gray-700 mb-4">{step.description}</p>
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="text-gray-600 text-sm flex items-start">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trust, Safety & Quality</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We prioritize your security with verified profiles, secure payments, and 24/7 support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition">
                <feature.icon className="w-10 h-10 text-[var(--color-accent)] mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories SEO Section */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Professional Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              to={`/gigs?category=${cat.toLowerCase().replace(' ', '-')}`}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[var(--color-accent)] hover:shadow-sm transition group"
            >
              <span className="text-gray-700 font-medium group-hover:text-[var(--color-accent)]">{cat}</span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--color-accent)]" />
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--color-accent-light)] py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to get started?</h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Join a growing network of businesses and independent professionals today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup?role=client" className="px-8 py-3 bg-[var(--color-accent)] text-white rounded-lg font-bold hover:bg-[var(--color-accent-hover)] transition shadow-md">
            Post a Job
          </Link>
          <Link to="/signup?role=freelancer" className="px-8 py-3 bg-white text-[var(--color-accent)] border border-[var(--color-accent)] rounded-lg font-bold hover:bg-gray-50 transition">
            Become a Seller
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
