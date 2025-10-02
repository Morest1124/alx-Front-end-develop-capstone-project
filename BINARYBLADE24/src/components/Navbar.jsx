import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">BINARYBLADE24</Link>
      </div>
      <NavLinks />
    </nav>
  );
};


const ClientNavLinks = () => {
  return (
    <>
      <Link to="/">Dashboard</Link>
      <Link to="/howtouse">How to use</Link>
      <Link to="/findtalent">Find Talent</Link>
      <Link to="/ProjectsPage">My projects</Link>
      <Link to="/Messages">Post Job</Link>
      <Link to="/Settings">Settings</Link>
      <Link to="/Profile Page">Profile Page</Link>
      <button>
        Dark mode<span>Light Mode</span>
      </button>
    </>
  );
};

const FreelancerNavLinks = () => {
  return (
    <>
      <Link to="/">Dashboard</Link>
      <Link to="/findwork">Find Work</Link>
      <Link to="/projects">My Projects</Link>
      <Link to="/messages">Messages</Link>
      <Link to="/earnings">Earnings</Link>
      <Link to="/Messages">Post Job</Link>
      <Link to="/Settings">Settings</Link>
      <Link to="/Profile Page">Profile Page</Link>
      <button>
        Dark mode<span>Light Mode</span>
      </button>
    </>
  );
};

const PublicNavLinks = () => {
  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/howitworks">How It Works</Link>
      <Link to="/findtalent">Find Talent</Link>
      <Link to="/findwork">Find Work</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
      <button>
        Dark mode<span>Light Mode</span>
      </button>
    </>
  );
};


export default Navbar;