import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  FileText,
  Briefcase,
  History,
  TrendingUp,
  Layout,
  Filter
} from "lucide-react";
import { getClientProjects, startConversation } from "../api";
import { useNavigate as useRouter } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Loader from '../components/Loader';

const ClientProjects = () => {
  const navigate = useRouter();
  const { user } = useContext(AuthContext);
  const { userCurrency, formatPrice } = useCurrency();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await getClientProjects();

      if (!Array.isArray(data) && data.results && Array.isArray(data.results)) {
        data = data.results;
      }

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
        setError("Invalid data format received from server.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const projectsByStatus = useMemo(() => {
    return {
      open: filteredProjects.filter(p => p.status === "OPEN"),
      active: filteredProjects.filter(p => p.status === "IN_PROGRESS"),
      completed: filteredProjects.filter(p => p.status === "COMPLETED"),
      canceled: filteredProjects.filter(p => p.status === "CANCELED")
    };
  }, [filteredProjects]);

  const handleContact = async (e, project) => {
    e.stopPropagation();
    if (!user.isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      // Logic for client to contact the assigned freelancer
      // This assumes the project has an associated freelancer through an accepted proposal
      const freelancerId = project.freelancer?.id || project.owner_details?.id;
      if (!freelancerId) {
        alert("No freelancer assigned to this project yet.");
        return;
      }
      const conversation = await startConversation(project.id, freelancerId);
      navigate('/client/messages', { state: { selectedConversationId: conversation.id } });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CANCELED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const ProjectCard = ({ project }) => (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${getStatusStyle(project.status)}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
            {project.title}
          </h3>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Budget</span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatPrice(project.budget)}
            </span>
          </div>
          <div className="flex gap-2">
            {project.status === 'OPEN' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/client/proposals', { state: { projectId: project.id } });
                }}
                className="p-3 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 transition-colors"
                title="Manage Proposals"
              >
                <Layout size={20} />
              </button>
            ) : (
              <button
                onClick={(e) => handleContact(e, project)}
                className="p-3 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 transition-colors"
                title="Message Freelancer"
              >
                <MessageSquare size={20} />
              </button>
            )}
            <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, icon: Icon, projects, color }) => (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
            <Icon size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-bold">
            {projects.length}
          </span>
        </div>
        <div className="h-[1px] flex-1 bg-slate-100 mx-8 hidden md:block" />
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Icon size={32} />
          </div>
          <h3 className="text-slate-900 font-bold mb-1">No {title.toLowerCase()} found</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            You don't have any projects in this status at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center py-20">
        <Loader size="large" />
        <p className="mt-6 text-slate-500 font-medium animate-pulse">Organizing your projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sky-600 font-bold text-sm tracking-widest uppercase mb-3">
              <TrendingUp size={16} />
              Project Portfolio
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
              My <span className="text-sky-600">Projects</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Track your hiring progress, manage active work, and review your project history all in one place.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search projects by title..."
                className="w-full md:w-80 pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none text-slate-600 font-medium shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate('/client/post-job')}
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-sky-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Briefcase size={20} />
              Post New Job
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-lg mx-auto mt-20">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-sm">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-rose-900 font-bold text-lg mb-2">Something went wrong</h3>
            <p className="text-rose-700 mb-6">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-8 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Section
              title="Open Requests"
              icon={Briefcase}
              projects={projectsByStatus.open}
              color="sky"
            />

            <Section
              title="Active Work"
              icon={Clock}
              projects={projectsByStatus.active}
              color="amber"
            />

            <Section
              title="Completed History"
              icon={History}
              projects={projectsByStatus.completed}
              color="emerald"
            />

            {projectsByStatus.canceled.length > 0 && (
              <Section
                title="Canceled Projects"
                icon={AlertCircle}
                projects={projectsByStatus.canceled}
                color="slate"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProjects;
