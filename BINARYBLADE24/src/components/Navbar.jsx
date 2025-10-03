import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthConext from "./AuthConext";
import AppRouters from "./Routers";

const Navbar = () => {
  const ClientNavLinks = () => {
    return (
      <>
        <Link to="/" className="nav-link">
          Dashboard
        </Link>
        <Link to="/HowItWorks" className="nav-link">
          How to use
        </Link>
        <Link to="/FindTalent" className="nav-link">
          Find Talent
        </Link>
        <Link to="/ProjectsPage" className="nav-link">
          My projects
        </Link>
        <Link to="/Proposals" className="nav-link">
          Post Job
        </Link>
        <Link to="/Settings" className="nav-link">
          Settings
        </Link>
        <Link to="/Profile" className="nav-link">
          Profile Page
        </Link>
        <button className="nav-link">
          Dark mode<span>Light Mode</span>
        </button>
      </>
    );
  };
  const FreelancerNavLinks = () => {
    return (
      <>
        <Link to="/" className="nav-link">
          Dashboard
        </Link>
        <Link to="/FindWork" className="nav-link">
          Find Work
        </Link>
        <Link to="/ProjectsPage" className="nav-link">
          My Projects
        </Link>
        <Link to="/Messages" className="nav-link">
          Messages
        </Link>
        <Link to="/Earnings" className="nav-link">
          Earnings
        </Link>
        <Link to="/Settings" className="nav-link">
          Settings
        </Link>
        <Link to="/Profile" className="nav-link">
          Profile Page
        </Link>
        <button className="nav-link">
          Dark mode<span>Light Mode</span>
        </button>
      </>
    );
  };

  const PublicNavLinks = () => {
    return (
      <>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/HowItWorks" className="nav-link">
          How It Works
        </Link>
        <Link to="/FindTalent" className="nav-link">
          Find Talent
        </Link>
        <Link to="/FindWork" className="nav-link">
          Find Work
        </Link>
        <Link to="/Login" className="nav-link">
          Login
        </Link>
        <Link to="/Signup" className="nav-link">
          Sign Up
        </Link>
        <button className="nav-link">
          Dark mode<span>Light Mode</span>
        </button>
      </>
    );
  };

  return (
    <nav className="bg-indigo-500 p-4 flex items-center justify-between">
      <PublicNavLinks />
    </nav>
  );
};
// Integrated the NavBar and the NavLink in one file ~Navbar.jsx
// Link for Authenticated users
const PublicNavLinks = () => {
  const { currentPath } = useRouter();
  const { login } = useContext(AuthConext);
  const isActive = (path) =>
    currentPath === path
      ? "text-indigo-500 bg-indigo-100"
      : "text-gray-500 hover:bg-gray-200";
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
    </>
  );
};

export default Navbar;
