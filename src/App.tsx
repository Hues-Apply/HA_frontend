import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Layout components
import Navbar from "./components/NavBar";
import Footer from "./sections/Footer";
import ProtectedRoute, { AdminRoute, EmployerRoute } from "./components/ProtectedRoute";
import SidebarWrapper from "./components/SidebarWrapper";

// Homepage sections
import Hero from "./sections/Hero";
import PremiumServices from "./sections/PremiumServices";
import FAQ from "./sections/FAQ";
import Opportunity from "./sections/Opportunity";
import Testimonials from "./sections/Testimonials";
import HowItWorks from "./sections/HowItWorks";

// Authentication & onboarding pages
import Login from "./sections/Login";
import Signup from "./sections/Signup";
import OnboardingReview from "./sections/OnboardingReview";
import OnboardingComplete from "./sections/Onboarding";
// Import placeholders for components that will be implemented later
const VerifyEmail = () => <div>Email Verification</div>;
import Onboarding1 from "./sections/Onboarding1";
import Onboarding2 from "./sections/Onboarding2";
import JobPortal from "./sections/JobPortal";
import Profile from "./sections/Profile";
import AdminDashboard from "./sections/AdminDashboard";
import AdminScholarshipsList from "./components/AdminScholarshipsList";
import AdminScholarshipForm from "./components/AdminScholarshipForm";
import AdminJobsList from "./components/AdminJobsList";
import AdminJobForm from "./components/AdminJobForm";
import UsersList from "./components/UsersList";
import ScholarshipList from "./components/ScholarshipList";
import ScholarshipDetails from "./sections/ScholarshipDetails";
import ComingSoon from "./components/ComingSoon";


// Homepage component
const Homepage = () => (
  <>
    <Hero />
    <HowItWorks />
    <Testimonials />
    <PremiumServices />
    <FAQ />
    <Opportunity />
  </>
);

// Layout component for main site pages
const MainLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <HelmetProvider>
        <Routes>
          {/* Public routes - No authentication required */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Routes with main layout - Public */}
          <Route element={<MainLayout />}>
            <Route index element={<Homepage />} />
          </Route>

          {/* Protected routes - Require authentication */}
          <Route element={<ProtectedRoute />}>
            {/* Onboarding routes */}
            <Route path="/onboarding/step-1" element={<Onboarding1 />} />
            <Route path="/onboarding/step-2" element={<Onboarding2 />} />
            <Route path="/onboarding/review" element={<OnboardingReview />} />
            <Route path="/onboarding/complete" element={<OnboardingComplete />} />
            <Route path="/onboarding/*" element={<ComingSoon />} />

            {/* Dashboard routes - Require authentication */}
            <Route element={<SidebarWrapper />}>
              <Route path="/dashboard" element={<JobPortal />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard/scholarships/:id" element={<ScholarshipDetails />} />
              <Route path="/dashboard/*" element={<ComingSoon />} />
            </Route>
          </Route>

          {/* Admin routes - Require admin role */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/scholarships" element={<AdminScholarshipsList />} />
            <Route path="/admin/scholarships/new" element={<AdminScholarshipForm />} />
            <Route path="/admin/scholarships/edit/:id" element={<AdminScholarshipForm />} />
            <Route path="/admin/jobs" element={<AdminJobsList />} />
            <Route path="/admin/jobs/new" element={<AdminJobForm />} />
            <Route path="/admin/jobs/edit/:id" element={<AdminJobForm />} />
            <Route path="/users-list" element={<UsersList />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </HelmetProvider>
    </Router>
  );
}

export default App;
