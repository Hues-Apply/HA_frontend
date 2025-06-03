import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// Layout components
import Navbar from "./components/NavBar";
import Footer from "./sections/Footer";

// Homepage sections
import Hero from "./sections/Hero";
import PremiumServices from "./sections/PremiumServices";
import FAQ from "./sections/FAQ";
import Opportunity from "./sections/Opportunity";
import Testimonials from "./sections/Testimonials";
import HowItWorks from "./sections/HowItWorks";

// Authentication & onboarding pages
import Login from "./sections/login";
import Signup from "./sections/Signup";
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
        {/* Dashboard route without main layout */}
        <Route path="/dashboard" element={<JobPortal />} />
        {/* Onboarding routes */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/step-1" element={<OnboardingStage1 />} />
        <Route path="/onboarding/step-2" element={<OnboardingStage2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Routes with main layout */}
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route index element={<Homepage />} />
          <Route path="/" element={<Homepage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
