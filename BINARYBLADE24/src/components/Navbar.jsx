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
  Folder,
  Settings,
  Inbox,
  Star,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter, Link } from "../contexts/Routers";

// Links for unauthenticated users
const PublicNavLinks = () => {
  const { currentPath } = useRouter();


  const isActive = (path) =>
    currentPath === path
      ? "text-indigo-600 bg-indigo-50"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <>
      <Link
        key="/jobs"
        to="/jobs"
        className={`${isActive("/jobs")} text-sm md:text-base`}
      >
        <Briefcase size={16} className="inline mr-1" /> Find Work
      </Link>
      <Link
        key="/talent"
        to="/talent"
        className={`${isActive("/talent")} text-sm md:text-base`}
      >
        <Search size={16} className="inline mr-1" /> Find Talent
      </Link>
      <Link
        key="/about"
        to="/about"
        className={`${isActive("/about")} text-sm md:text-base`}
      >
        How It Works
      </Link>

      {/* Auth Links */}
      <div className="flex items-center space-x-3 ml-4">
        <Link
          key="/login"
          to="/login"
          className="text-gray-600 hover:text-indigo-600 border-r pr-3 border-gray-200 text-sm md:text-base"
        >
          <LogIn size={16} className="inline mr-1" /> Log In
        </Link>
        <Link
          to="/signup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50 transform transition duration-300 hover:scale-105 px-4 py-2 rounded-lg text-sm md:text-base"
        >
          Sign Up
        </Link>
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
      <Link
        key="/client/dashboard"
        to="/client/dashboard"
        className={`${isActive("/client/dashboard")} text-sm md:text-base`}
      >
        <LayoutDashboard size={16} className="inline mr-1" /> My Dashboard
      </Link>
      <Link
        key="/client/talent"
        to="/client/talent"
        className={`${isActive("/client/talent")} text-sm md:text-base`}
      >
        <Search size={16} className="inline mr-1" /> Find Talent
      </Link>
      <Link
        key="/client/projects"
        to="/client/projects"
        className={`${isActive("/client/projects")} text-sm md:text-base`}
      >
        <Folder size={16} className="inline mr-1" /> My Projects
      </Link>
      <Link
        key="/client/messages"
        to="/client/messages"
        className={`${isActive("/client/messages")} text-sm md:text-base`}
      >
        <Inbox size={16} className="inline mr-1" />
        Messages
      </Link>
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
      <Link
        key="/freelancer/jobs"
        to="/freelancer/jobs"
        className={`${isActive("/freelancer/jobs")} text-sm md:text-base`}
      >
        <Briefcase size={16} className="inline mr-1" /> My Dashboard
      </Link>
      <Link
        key="/freelancer/projects"
        to="/freelancer/projects"
        className={`${isActive("/freelancer/projects")} text-sm md:text-base`}
      >
        <Folder size={16} className="inline mr-1" /> My Projects
      </Link>
      <Link
        key="/freelancer/proposals"
        to="/freelancer/proposals"
        className={`${isActive("/freelancer/proposals")} text-sm md:text-base`}
      >
        <Send size={16} className="inline mr-1" /> My Proposals
      </Link>
      <Link
        key="/freelancer/earnings"
        to="/freelancer/earnings"
        className={`${isActive("/freelancer/earnings")} text-sm md:text-base`}
      >
        <DollarSign size={16} className="inline mr-1" /> Earnings
      </Link>
      <Link
        key="/freelancer/messages"
        to="/freelancer/messages"
        className={`${isActive("/freelancer/messages")} text-sm md:text-base`}
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
    ? user.role?.toUpperCase() === "CLIENT"
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <div className="flex-shrink-0">
            <Link
              to={user.isLoggedIn ? `/${user.role}/dashboard` : "/"}
              className="text-2xl font-extrabold text-indigo-600 tracking-tight flex items-center"
            >
              <img
                className="w-30 h-auto"
                src="BinaryBlade-official.png"
                alt="Logo "
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex md:space-x-4 items-center">
            <NavLinksComponent />

            {/* User/Profile Section (Only logged in) */}
            {user.isLoggedIn && (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 ml-10 mr-0 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <User size={20} className="text-gray-700" />
                  <span className="text-xs font-semibold text-gray-900 hidden lg:inline">
                    {user.username}
                    {user.role &&
                      ` (${user.role.charAt(0).toUpperCase()}${user.role
                        .slice(1)
                        .toLowerCase()})`}
                  </span>
                  <span>
                    <img
                      className=" h-auto rounded-4xl w-5"
                      src="https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/3a5bd9c55f194c0af002a43912a5c643a3743107/f442a1ccf0d3c93dae3f42c751c1d51cfc9194da"
                    ></img>
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 transition-0.9">
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} className="mr-2" /> Settings
                    </Link>
                    {user.availableRoles?.length > 1 && (
                      <button
                        onClick={handleSwitchRole}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left"
                      >
                        <User size={16} className="mr-2" /> Switch to{" "}
                        {user.role.toUpperCase() === "CLIENT"
                          ? "Freelancer"
                          : "Client"}
                      </button>
                    )}
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
                {user.availableRoles?.length > 1 && (
                  <button
                    onClick={handleSwitchRole}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left rounded-lg"
                  >
                    <User size={16} className="mr-2" /> Switch to{" "}
                    {user.role?.toUpperCase() === "CLIENT" ? "Freelancer" : "Client"}
                  </button>
                )}
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
