import React, { useContext, useEffect, useCallback } from "react";
import AuthProvider, { AuthContext } from "./contexts/AuthContext";
import { RouterProvider, useRouter, Link } from "./contexts/Routers";
import Navbar from "./components/Navbar";
import PublicHome from "./pages/PublicHome";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import UnknownPage from "./pages/UnknownPage";
import PageWrapper from "./pages/PageWrapper";
import Projects from "./components/Projects";
import Talent from "./components/Talent";
import GigsPage from "./components/Gigs";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import FindWork from "./components/FindWork";
import Proposals from "./components/Proposals";
import ProposalsPage from "./pages/ProposalsPage";
import Messages from "./components/Messages";
import { GigsProvider } from "./contexts/GigsContext";
import { EarningsProvider } from "./contexts/EarningsContext";
import { ClientDashboardProvider } from "./contexts/ClientDashboardContext";
import GigDetailsPage from "./pages/GigDetailsPage";
import ClientProjects from "./pages/ClientProjects";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CreateProject from "./pages/CreateProject";
import MyProjects from "./pages/MyProjects";
import Earnings from "./pages/Earnings";
import Settings from "./components/Settings";
import Tax from "./pages/Tax";
import PaymentSimulator from "./pages/PaymentSimulator";
import MyOrders from "./pages/MyOrders";
import FreelancerOrders from "./pages/FreelancerOrders";
import { fetchRates } from "./utils/currency";

// The main App component which combines all parts
const AppContent = () => {
  const { currentPath } = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);
  const { navigate } = useRouter();

  // Check if user is authenticated
  const requireAuth = () => {
    if (!user.isLoggedIn) {
      navigate("/login");
      return false;
    }
    return true;
  };

  // Get appropriate dashboard path based on user role
  const getDashboardPath = useCallback(() => {
    const role = user.role?.toLowerCase();
    return role === "client" ? "/client/dashboard" : "/freelancer/dashboard";
  }, [user.role]);

  useEffect(() => {
    // Redirect to appropriate dashboard if user is logged in and tries to access auth pages
    if (
      user.isLoggedIn &&
      (currentPath === "/login" || currentPath === "/signup")
    ) {
      navigate(getDashboardPath());
    }
  }, [currentPath, user.isLoggedIn, navigate, getDashboardPath]);

  // routing logic
  const renderPage = () => {
    // Handle Gig Details Page
    if (currentPath.startsWith("/gigs/")) {
      const gigId = currentPath.split("/")[2];
      return requireAuth() ? <GigDetailsPage gigId={gigId} /> : null;
    }

    // Handle Project Details Page
    if (currentPath.startsWith("/projects/")) {
      const projectId = currentPath.split("/")[2];
      return requireAuth() ? (
        <ProjectDetailsPage projectId={projectId} />
      ) : null;
    }

    // PUBLIC PAGES
    if (currentPath === "/") return <FindWork />;
    if (currentPath === "/jobs") return <FindWork />;
    if (currentPath === "/talent") return <Talent />;
    if (currentPath === "/about") return <PublicHome />;
    if (currentPath === "/login") return <LogIn />;
    if (currentPath === "/signup") return <SignUp />;

    // AUTHENTICATED PAGES
    if (user.isLoggedIn) {
      const userRole = user.role?.toLowerCase();

      if (userRole === "client") {
        if (currentPath.startsWith("/client/dashboard"))
          return <ClientDashboard />;
        if (currentPath.startsWith("/client/projects"))
          return <ClientProjects />;
        if (currentPath.startsWith("/client/talent")) return <Talent />;
        if (currentPath.startsWith("/client/proposals"))
          return <ProposalsPage />;
        if (currentPath.startsWith("/client/earnings"))
          return (
            <PageWrapper title="Earnings">
              <Earnings />
            </PageWrapper>
          );
        // Note: Clients CANNOT post jobs in Pure Fiverr Model
        // They browse and purchase gigs created by freelancers
      }

      if (userRole === "freelancer") {
        if (
          currentPath.startsWith("/freelancer/dashboard") ||
          currentPath.startsWith("/freelancer/jobs")
        )
          return <FreelancerDashboard />;
        if (currentPath.startsWith("/freelancer/projects")) return <MyProjects />;
        if (currentPath.startsWith("/freelancer/gigs")) return <GigsPage />;
        if (currentPath.startsWith("/freelancer/proposals"))
          return <ProposalsPage />;
        if (currentPath.startsWith("/freelancer/create-gig"))
          return <CreateProject />;
        if (currentPath.startsWith("/freelancer/earnings"))
          return (
            <PageWrapper title="Earnings">
              <Earnings />
            </PageWrapper>
          );
        if (currentPath.startsWith("/freelancer/billing"))
          return <FreelancerOrders />;
      }

      // Client-specific pages
      if (currentPath === "/client/dashboard") return <ClientDashboard />;
      if (currentPath === "/client/projects") return <ClientProjects />;
      if (currentPath === "/client/billing") return <MyOrders />;
      if (currentPath === "/payment-simulator") return <PaymentSimulator />;
      if (
        currentPath.startsWith("/client/messages") ||
        currentPath.startsWith("/freelancer/messages")
      )
        return <Messages />;

      // Shared authenticated pages
      if (currentPath === "/settings") return <Settings />;
      if (currentPath === "/settings/tax") return <Tax />;
    }

    // Default 404
    return <UnknownPage />;
  };

  return (
    <>
      <Navbar />
      <main>
        {authLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          renderPage()
        )}
      </main>
      <footer className="p-4 text-center text-sm text-gray-500 bg-white border-t">
        <p>&copy; 2025 BINARYBLADE24. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/terms" className="hover:text-indigo-600">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:text-indigo-600">
            Privacy Policy
          </a>
        </div>
      </footer>
    </>
  );
};

// Main Export
const App = () => {
  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <>
      <div className="font-inter">
        <style>{`
            /* To smoothen transitions for links and buttons */
            .transition-colors {
                transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 200ms;
            }
        `}</style>
        <RouterProvider>
          <AuthProvider>
            <GigsProvider>
              <ClientDashboardProvider>
                <EarningsProvider>
                  <AppContent />
                </EarningsProvider>
              </ClientDashboardProvider>
            </GigsProvider>
          </AuthProvider>
        </RouterProvider>
      </div>
    </>
  );
};

export default App;