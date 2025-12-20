import React from 'react';
import {
  User, Briefcase, Shield, DollarSign, Search, MessageSquare,
  CheckCircle, Star, Clock, Lock, ChevronRight, Code, Database, Palette, Headset
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Image imports
import webDevImg from '../assets/web_development.png';
import dataScienceImg from '../assets/data_science.png';
import graphicDesignImg from '../assets/graphic_design.png';
import virtualAssistantImg from '../assets/virtual_assistant.png';

const HowItWorks = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const freelanceCategories = [
    {
      title: "Web Development",
      icon: Code,
      image: webDevImg,
      description: "From React applications to robust backends, our developers build the modern web.",
      details: ["Frontend (React, Vue)", "Backend (Node, Python)", "Fullstack Solutions"]
    },
    {
      title: "Data Science & AI",
      icon: Database,
      image: dataScienceImg,
      description: "Extract insights from data and build intelligent machine learning models.",
      details: ["Data Analysis", "Machine Learning", "Predictive Modeling"]
    },
    {
      title: "Creative Design",
      icon: Palette,
      image: graphicDesignImg,
      description: "Compelling brand identities, sleek UI/UX, and stunning digital illustrations.",
      details: ["Logo & Branding", "UI/UX Design", "Illustration"]
    },
    {
      title: "Virtual Assistance",
      icon: Headset,
      image: virtualAssistantImg,
      description: "Expert administrative support, data entry, and project management.",
      details: ["Data Entry", "Email Management", "Scheduling"]
    }
  ];

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
            Connect with Global Talent. <br /> Get Work Done.
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            The Marketplace for Professional Freelance Services.
          </p>
          <p className="text-lg mb-8 opacity-80">
            From quick tasks to major projects, find the right professional in minutes. <br />
            Secure payments. Verified talent. 24/7 Support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => scrollToSection('for-clients')}
              className="px-8 py-3 bg-white text-[var(--color-secondary)] rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
            >
              I'm a Client - Find Talent
            </button>
            <button
              onClick={() => scrollToSection('for-freelancers')}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition"
            >
              I'm a Freelancer - Find Work
            </button>
          </div>
        </div>
      </div>

      {/* For Clients Section */}
      <section id="for-clients" className="py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works - For Clients</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ease of use, security, and quality assurance. Hire the best freelancers in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {clientSteps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-cyan-50 text-[var(--color-accent)]">
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

        <div className="text-center mt-12">
          <Link to="/signup?role=client" className="inline-block px-8 py-3 bg-[var(--color-accent)] text-white rounded-lg font-bold hover:bg-[var(--color-accent-hover)] transition shadow-md">
            Get Started as a Client
          </Link>
        </div>
      </section>

      {/* For Freelancers Section */}
      <section id="for-freelancers" className="py-16 px-4 max-w-7xl mx-auto bg-gray-100 rounded-3xl scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works - For Freelancers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Flexibility, payment reliability, and exposure. Start earning with your skills today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {freelancerSteps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-indigo-50 text-[var(--color-secondary)]">
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

        <div className="text-center mt-12">
          <Link to="/signup?role=freelancer" className="inline-block px-8 py-3 bg-[var(--color-secondary)] text-white rounded-lg font-bold hover:bg-[var(--color-secondary-hover)] transition shadow-md">
            Get Started as a Freelancer
          </Link>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <div className="bg-gray-900 text-white py-20 px-4 mt-16">
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

      {/* Freelance Excellence Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Expertise Across Industries</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether it's data analytics, complex engineering, or creative storytelling,
              find specialists who bring your vision to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {freelanceCategories.map((cat, index) => (
              <div key={index} className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <cat.icon size={24} className="mb-2" />
                    <h3 className="text-xl font-bold">{cat.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.details.map((detail, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-500">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Professional Services Section (Original) */}
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
