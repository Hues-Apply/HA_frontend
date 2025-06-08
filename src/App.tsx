import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// Layout components
import Navbar from "./components/navbar";
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
import Login from "./sections/login";
import Signup from "./sections/signup";
import VerifyEmail from "./sections/VerifyEmail";
import Onboarding from "./sections/Onboarding";
import OnboardingStage1 from "./sections/Onboarding1";
import OnboardingStage2 from "./sections/Onboarding2";
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
