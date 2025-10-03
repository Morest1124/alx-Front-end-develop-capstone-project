import React, { useContext, useState } from "react";
import {
  LogIn,
  User,
  Briefcase,
  Search,
  DollarSign,
  Send,
  LayoutDashboard,
  Menu,
  X,
  Settings,
  Inbox,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter, Link } from "../contexts/Routers";

// Links for unauthenticated users
const PublicNavLinks = () => {
  const { currentPath } = useRouter();
  const { login } = useContext(AuthContext);

  const isActive = (path) =>
    currentPath === path
      ? "text-indigo-600 bg-indigo-50"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <>
      <Link to="/jobs" className={isActive("/jobs")}>
        <Briefcase size={16} className="inline mr-1" /> Find Work
      </Link>
      <Link to="/talent" className={isActive("/talent")}>
        <Search size={16} className="inline mr-1" /> Find Talent
      </Link>
      <Link to="/about" className={isActive("/about")}>
        How It Works
      </Link>

      {/* Auth Links */}
      <div className="flex items-center space-x-3 ml-4">
        <Link
          to="/login"
          className="text-gray-600 hover:text-indigo-600 border-r pr-3 border-gray-200"
        >
          <LogIn size={16} className="inline mr-1" /> Log In
        </Link>
        <button
          onClick={() => login("client")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50 transform transition duration-300 hover:scale-105 px-4 py-2 rounded-lg"
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

// Links for Authenticated Clients
const ClientNavLinks = () => {
  const { currentPath } = useRouter();
  const isActive = (path) =>
    currentPath.startsWith(path)
      ? "text-indigo-600 font-bold"
      : "text-gray-700 hover:text-indigo-600";

  return (
    <>
      <Link to="/client/projects" className={isActive("/client/projects")}>
        <LayoutDashboard size={16} className="inline mr-1" /> My Dashboard
      </Link>
      <Link to="/talent" className={isActive("/talent")}>
        <Search size={16} className="inline mr-1" /> Find Talent
      </Link>
      <Link to="/client/messages" className={isActive("/client/messages")}>
        <Inbox size={16} className="inline mr-1" />
        Messages
      </Link>
      <Link
        to="/client/post-job"
        className="bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/50 transform transition duration-300 hover:scale-[1.02] ml-4"
      >
        Post a Job
      </Link>
      {/* <p className="bg-purple-600 text-blue-950 rounded-2xl  m-1">
        <Search size={16} className="inline mr-1" /> Find Talent
      </p> */}
    </>
  );
};

// Links for Authenticated Freelancer
const FreelancerNavLinks = () => {
  const { currentPath } = useRouter();
  const isActive = (path) =>
    currentPath.startsWith(path)
      ? "text-indigo-600 font-bold"
      : "text-gray-700 hover:text-indigo-600";

  return (
    <>
      <Link to="/freelancer/jobs" className={isActive("/freelancer/jobs")}>
        <Briefcase size={16} className="inline mr-1" /> My Dashboard
      </Link>
      <Link
        to="/freelancer/proposals"
        className={isActive("/freelancer/proposals")}
      >
        <Send size={16} className="inline mr-1" /> My Proposals
      </Link>
      <Link
        to="/freelancer/earnings"
        className={isActive("/freelancer/earnings")}
      >
        <DollarSign size={16} className="inline mr-1" /> Earnings
      </Link>
      <Link
        to="/freelancer/messages"
        className={isActive("/freelancer/messages")}
      >
        <Inbox size={16} className="inline mr-1" /> Messages
      </Link>
    </>
  );
};

const Navbar = () => {
  const { user, logout, switchRole } = useContext(AuthContext);
  const { navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Determine which links to show based on role
  const NavLinksComponent = user.isLoggedIn
    ? user.role === "client"
      ? ClientNavLinks
      : FreelancerNavLinks
    : PublicNavLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileOpen(false);
  };

  const handleSwitchRole = () => {
    switchRole();
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <div className="flex-shrink-0">
            <Link
              to={user.isLoggedIn ? `/${user.role}/dashboard` : "/"}
              className="text-2xl font-extrabold text-indigo-600 tracking-tight flex items-center"
            >
              BINARYBLADE24
            </Link>
          </div>
          <h1 className="text-red-600 justify-center">You are not logged in</h1>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex md:space-x-4 items-center">
            <NavLinksComponent />

            {/* User/Profile Section (Only logged in) */}
            {user.isLoggedIn && (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <User size={20} className="text-gray-700" />
                  <span className="text-xs font-semibold text-gray-900 hidden lg:inline">
                    {user.name} (
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)})
                  </span>
                  <span>
                    <img
                      className=" h-auto rounded-4xl w-10"
                      src="https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/3a5bd9c55f194c0af002a43912a5c643a3743107/f442a1ccf0d3c93dae3f42c751c1d51cfc9194da"
                    ></img>
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleSwitchRole}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left"
                    >
                      <User size={16} className="mr-2" /> Switch to{" "}
                      {user.role === "client" ? "Freelancer" : "Client"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogIn size={16} className="mr-2 rotate-180" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Conditionally rendered) */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLinksComponent />
            {user.isLoggedIn && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleSwitchRole}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left rounded-lg"
                >
                  <User size={16} className="mr-2" /> Switch to{" "}
                  {user.role === "client" ? "Freelancer" : "Client"}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left rounded-lg mt-1"
                >
                  <LogIn size={16} className="mr-2 rotate-180" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
