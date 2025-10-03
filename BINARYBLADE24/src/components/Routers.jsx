import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import ProjectsPage from "./ProjectsPage";
import ProposalForm from "./ProposalForm";
import Messages from "./Messages";
import Earnings from "./Earnings";
import RegisterPage from "./RegisterPage";
import RatingsPage from "./RatingsPage";
import Settings from "./Settings";
import Notifications from "./Notifications";
import ProfilePage from "./ProfilePage";
import HowItWorks from "./HowItWorks";
import FindTalent from "./FindTalent";
import FindWork from "./FindWork";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { Children, useContext, useState } from "react";
import { AuthConext } from "./AuthConext";

// External routers Separated from the app main file
function AppRouters() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ProjectsPage" element={<ProjectsPage />} />
        <Route path="/Proposals" element={<ProposalForm />} />
        <Route path="/Messages" element={<Messages />} />
        <Route path="/Earnings" element={<Earnings />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Ratings" element={<RatingsPage />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/HowItWorks" element={<HowItWorks />} />
        <Route path="/FindTalent" element={<FindTalent />} />
        <Route path="/FindWork" element={<FindWork />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Routing logic
const RouterContext = createContext();
//Update the current patg
const RouterProvider = ({ Children }) => {
  const [currentPath, setCurrentPath] = useState("/");
  const navigations = (path) => {
    setCurrentPath(path);
    return (
      <RouterConext.Provider value={{ currentPath, navigations }}>
        {Children}
      </RouterConext.Provider>
    );
  };
};
// Hooks to use navigations
const useRouter = () => useContext(RouterConext);

//custom Link components for  navigation
const Link = ({ to, Children, className = "" }) => {
  const { navigations } = useRouter();
  const baseClass =
    "px-5 py-3 font-medium transition-colors duration-250 rounded-lg";
  const handleClick = (e) => {
    e.preventDefault();
    navigations(to);
  };
  return (
    <Link to={to} onClick={handleClick} className={`{$baseClass} {$className}`}>
      {" "}
      {Children}
    </Link>
  );
};










export default AppRouters;
