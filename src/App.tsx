import React from "react"
import Navbar from "./components/navbar";
import Hero from "./sections/Hero";
import PremiumServices from "./sections/PremiumServices";
import FAQ from "./sections/FAQ";
import Opportunity from "./sections/Opportunity";
import Footer from "./sections/Footer";
import Testimonials from "./sections/Testimonials";
import HowItWorks from "./sections/HowItWorks";

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <Testimonials />
        <PremiumServices />
        <FAQ />
        <Opportunity />
      </main>
      <Footer />
    </>
  )
}

export default App
