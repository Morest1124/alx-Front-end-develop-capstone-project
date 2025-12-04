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
import logo from '../assets/BinaryBlade-official.png';
import { AuthContext } from "../contexts/AuthContext";
import { useRouter, Link } from "../contexts/Routers";

// Links for unauthenticated users
const PublicNavLinks = () => {
  const { currentPath } = useRouter();


  const isActive = (path) =>
    currentPath === path
      ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <>
      <Link
        key="/how-it-works"
        to="/how-it-works"
        className={`${isActive("/how-it-works")} text-sm md:text-base`}
      >
        How It Works
      </Link>
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

      {/* Auth Links */}
      <div className="flex items-center space-x-3 ml-4">
        <Link
          key="/login"
          to="/login"
          className="text-gray-600 hover:text-[var(--color-accent)] border-r pr-3 border-gray-200 text-sm md:text-base"
        >
          <LogIn size={16} className="inline mr-1" /> Log In
        </Link>
        <Link
          to="/signup"
          className="btn-primary transform transition duration-300 hover:scale-105 text-sm md:text-base"
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
      ? "text-[var(--color-accent)] font-bold border-b-2 border-[var(--color-accent)]"
      : "text-gray-700 hover:text-[var(--color-accent)]";

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
      ? "text-[var(--color-secondary)] font-bold border-b-2 border-[var(--color-secondary)]"
      : "text-gray-700 hover:text-[var(--color-secondary)]";

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

  const getRoleBadge = () => {
    if (!user.isLoggedIn) return null;

    const isClient = user.role?.toUpperCase() === "CLIENT";
    const bgColor = isClient ? "bg-[var(--color-accent-light)]" : "bg-[var(--color-secondary-light)]";
    const textColor = isClient ? "text-[var(--color-accent)]" : "text-[var(--color-secondary)]";
    const label = isClient ? "Client" : "Freelancer";

    return (
      <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${bgColor} ${textColor} border border-current hidden sm:inline-block`}>
        {label}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo/Home Link */}
          <div className="flex-shrink-0 flex items-center">

            <Link
              to={user.isLoggedIn ? `/${user.role?.toLowerCase()}/dashboard` : "/"}
              className="text-2xl font-extrabold text-[var(--color-accent)] tracking-tight flex items-center"
            >
              <img
                className="w-30 h-auto"
                src={logo}
                alt="Logo "
              />
            </Link>
            {/* disable for future use */}
            {/* {getRoleBadge()} */}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex md:space-x-4 items-center">
            <NavLinksComponent />

            {/* User/Profile Section (Only logged in) */}
            {user.isLoggedIn && (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 ml-4 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <User size={20} className="text-gray-700" />
                  <span className="text-xs font-semibold text-gray-900 hidden lg:inline">
                    {user.username}
                  </span>
                  {getRoleBadge()}
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
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      {/* <p className="text-sm font-medium text-gray-900">{user.username}</p> */}
                      <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[var(--color-accent-light)] w-full"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} className="mr-2" /> Settings
                    </Link>
                    {user.availableRoles?.length > 1 && (
                      <button
                        onClick={handleSwitchRole}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[var(--color-accent-light)] w-full text-left"
                      >
                        <User size={16} className="mr-2" /> Switch to{" "}
                        {user.role?.toUpperCase() === "CLIENT"
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
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-accent)]"
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
                <div className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${user.role?.toUpperCase() === 'CLIENT' ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]' : 'bg-[var(--color-secondary-light)] text-[var(--color-secondary)]'}`}>
                    {user.role} Mode
                  </span>
                </div>
                {user.availableRoles?.length > 1 && (
                  <button
                    onClick={handleSwitchRole}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[var(--color-accent-light)] w-full text-left rounded-lg"
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
