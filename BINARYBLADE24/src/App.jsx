import React, { useContext, useEffect, useCallback } from "react";
import AuthProvider, { AuthContext } from "./contexts/AuthContext";
import { RouterProvider, useRouter } from "./contexts/Routers";
import { Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
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
import HowItWorks from "./components/HowItWorks";
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

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase())) {
    // Redirect to appropriate dashboard if role doesn't match
    const dashboard =
      user.role?.toLowerCase() === "client"
        ? "/client/dashboard"
        : "/freelancer/dashboard";
    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
};

// Wrapper components to extract params
const GigDetailsPageWrapper = () => {
  const { gigId } = useParams();
  return <GigDetailsPage gigId={gigId} />;
};

const ProjectDetailsPageWrapper = () => {
  const { projectId } = useParams();
  return <ProjectDetailsPage projectId={projectId} />;
};

// The main App component which combines all parts
const AppContent = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  // Get appropriate dashboard path based on user role
  const getDashboardPath = useCallback(() => {
    const role = user.role?.toLowerCase();
    return role === "client" ? "/client/dashboard" : "/freelancer/dashboard";
  }, [user.role]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HowItWorks />} />
          <Route path="/jobs" element={<FindWork />} />
          <Route path="/find-work" element={<FindWork />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/find-talent" element={<Talent />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<PublicHome />} />

          {/* Auth Routes - Redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              user.isLoggedIn ? <Navigate to={getDashboardPath()} replace /> : <LogIn />
            }
          />
          <Route
            path="/signup"
            element={
              user.isLoggedIn ? <Navigate to={getDashboardPath()} replace /> : <SignUp />
            }
          />

          {/* Shared Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/gigs/:gigId" element={<GigDetailsPageWrapper />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPageWrapper />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/tax" element={<Tax />} />
            <Route path="/payment-simulator" element={<PaymentSimulator />} />

            {/* Messages can be accessed by both, path differs but component is same */}
            <Route path="/client/messages" element={<Messages />} />
            <Route path="/freelancer/messages" element={<Messages />} />
          </Route>

          {/* Client Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["CLIENT"]} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/projects" element={<ClientProjects />} />
            <Route path="/client/talent" element={<Talent />} />
            <Route path="/client/proposals" element={<ProposalsPage />} />
            <Route
              path="/client/earnings"
              element={
                <PageWrapper title="Earnings">
                  <Earnings />
                </PageWrapper>
              }
            />
            <Route path="/client/billing" element={<MyOrders />} />
          </Route>

          {/* Freelancer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["FREELANCER"]} />}>
            <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
            <Route path="/freelancer/jobs" element={<FreelancerDashboard />} />
            <Route path="/freelancer/projects" element={<MyProjects />} />
            <Route path="/freelancer/gigs" element={<GigsPage />} />
            <Route path="/freelancer/proposals" element={<ProposalsPage />} />
            <Route path="/freelancer/create-gig" element={<CreateProject />} />
            <Route
              path="/freelancer/earnings"
              element={
                <PageWrapper title="Earnings">
                  <Earnings />
                </PageWrapper>
              }
            />
            <Route path="/freelancer/billing" element={<FreelancerOrders />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<UnknownPage />} />
        </Routes>
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