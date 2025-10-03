import React, { useContext } from "react";
import AuthProvider, { AuthContext } from "./contexts/AuthContext";
import { RouterProvider, useRouter } from "./contexts/Routers";
import Navbar from "./components/Navbar";
import PublicHome from "./pages/PublicHome";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import UnknownPage from "./pages/UnknownPage";
import PageWrapper from "./pages/PageWrapper";

// The main App component which combines all parts (like App.jsx)
const AppContent = () => {
  const { currentPath } = useRouter();
  const { user } = useContext(AuthContext);

  // Simple routing logic (like a switch/case block)
  const renderPage = () => {
    // PUBLIC PAGES
    if (currentPath === "/") return <PublicHome />;
    if (
      currentPath === "/jobs" ||
      currentPath === "/talent" ||
      currentPath === "/about" ||
      currentPath === "/login"
    )
      return <PublicHome />;

    // AUTHENTICATED PAGES
    if (user.isLoggedIn) {
      if (user.role === "client") {
        if (
          currentPath.startsWith("/client/dashboard") ||
          currentPath.startsWith("/client/projects")
        )
          return <ClientDashboard />;
        if (currentPath.startsWith("/client/post-job"))
          return (
            <PageWrapper title="Post New Job">
              Form to create a job listing here.
            </PageWrapper>
          );
      }

      if (user.role === "freelancer") {
        if (
          currentPath.startsWith("/freelancer/dashboard") ||
          currentPath.startsWith("/freelancer/jobs")
        )
          return <FreelancerDashboard />;
        if (currentPath.startsWith("/freelancer/proposals"))
          return (
            <PageWrapper title="My Proposals">
              List of submitted proposals and their status.
            </PageWrapper>
          );
        if (currentPath.startsWith("/freelancer/earnings"))
          return (
            <PageWrapper title="Earnings">
              Detailed payment history and invoices.
            </PageWrapper>
          );
      }

      // Shared authenticated pages
      if (currentPath === "/settings")
        return (
          <PageWrapper title="Settings">
            Manage your account preferences.
          </PageWrapper>
        );
      if (currentPath.startsWith("/messages"))
        return (
          <PageWrapper title="Messages">
            Your privete massage center.
          </PageWrapper>
        );
    }

    // Default 404
    return <UnknownPage />;
  };

  return (
    <>
      <Navbar />
      <main>{renderPage()}</main>
      <footer className="p-4 text-center text-sm text-gray-500 bg-white border-t">
        Role:{" "}
        <span className="font-semibold text-indigo-600">
          {user.role || "Public"}
        </span>{" "}
        | Current Path:{" "}
        <span className="font-semibold text-gray-700">{currentPath}</span>
      </footer>
    </>
  );
};

// Main Export
const App = () => (
  <div className="font-inter">
    <style>{`
            /* To smoothen transitions for links and buttons */
            .transition-colors {
                transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 200ms;
            }
        `}</style>
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  </div>
);

export default App;
