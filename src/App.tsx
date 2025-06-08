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
// Import placeholders for components that will be implemented later
const VerifyEmail = () => <div>Email Verification</div>;
const Onboarding = () => <div>Onboarding</div>;
const OnboardingStage1 = () => <div>Onboarding Stage 1</div>;
const OnboardingStage2 = () => <div>Onboarding Stage 2</div>;
import JobPortal from "./sections/JobPortal";

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

        {/* Protected routes without main layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<JobPortal />} />
        </Route>

        {/* Protected onboarding routes with main layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/step-1" element={<OnboardingStage1 />} />
          <Route path="/onboarding/step-2" element={<OnboardingStage2 />} />
        </Route>

        {/* Routes with main layout */}
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route index element={<Homepage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
