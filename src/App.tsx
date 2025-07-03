import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// Layout components
import Navbar from "./components/NavBar";
import Footer from "./sections/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

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
import UsersList from "./components/UsersList";

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
const MainLayout = () => (
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/users-list" element={<UsersList />} />        {/* Protected routes without main layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<JobPortal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        {/* Protected onboarding routes without main layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding/step-1" element={<Onboarding1 />} />
          <Route path="/onboarding/step-2" element={<Onboarding2 />} />
          <Route path="/onboarding/review" element={<OnboardingReview />} />
          <Route path="/onboarding/complete" element={<OnboardingComplete />} />
        </Route>

        {/* Routes with main layout */}
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route index element={<Homepage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
