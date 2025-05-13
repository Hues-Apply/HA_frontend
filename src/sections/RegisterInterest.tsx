import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import SurveyForm from "../components/SurveyForm";
import TestimonialCard from "../components/TestimonialCard";
import { FaStar, FaRegPaperPlane, FaRegLightbulb } from "react-icons/fa";
// Import image
import canadaSuccessImg from "../assets/img/canada_success.jpg";

const RegisterInterest: React.FC = () => {
  const [step, setStep] = useState(1);
  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const handleInitialSubmit = (data: typeof initialData) => {
    setInitialData(data);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSurveySubmit = (data: any) => {
    console.log("Complete registration data:", data);
    // Here you would typically send the data to your backend API
    setSubmissionComplete(true);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  return (
    <section id="register-interest" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff]">
      {/* Background elements for visual interest */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#4B9CD310] rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#4B9CD315] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[#4B9CD308] rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header content */}
        <div className="text-center mb-12">
          <span className="bg-[#E8F3FB] text-[#4B9CD3] font-semibold text-sm px-6 py-2 rounded-full inline-block mb-4">
            Join Our Waitlist
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Be the First to Experience Hues Apply
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Register your interest to get early access to our platform and unlock a world of 
            personalized opportunity matching, expert support, and AI-powered tools.
          </p>
        </div>

        {/* Main content with floating cards and form */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left side - Feature highlights */}
          <div className="w-full lg:w-5/12 space-y-6">
            {!submissionComplete && (
              <>
                {/* Feature card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start">
                    <div className="bg-[#4B9CD310] p-3 rounded-full mr-4">
                      <FaStar className="text-[#4B9CD3] text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Opportunity Matching</h3>
                      <p className="text-gray-600">
                        Our AI-driven platform connects you with scholarships, fellowships, grants, 
                        and jobs tailored to your qualifications and goals.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start">
                    <div className="bg-[#4B9CD310] p-3 rounded-full mr-4">
                      <FaRegPaperPlane className="text-[#4B9CD3] text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Document Assistance</h3>
                      <p className="text-gray-600">
                        Get expert guidance and resources to craft standout CVs, personal statements, 
                        and cover letters that increase your chances of success.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start">
                    <div className="bg-[#4B9CD310] p-3 rounded-full mr-4">
                      <FaRegLightbulb className="text-[#4B9CD3] text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Generated Application Essays</h3>
                      <p className="text-gray-600">
                        Leverage cutting-edge AI tools to generate and refine application documents, 
                        saving you time and increasing your chances of acceptance.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Success message (shown after submission) */}
            {submissionComplete && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                    <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Complete!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for registering your interest in Hues Apply! We've received your information 
                    and will notify you when we're ready to launch.
                  </p>
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="font-medium text-gray-800 mb-4">What happens next?</h3>
                    <ul className="text-left text-gray-600 space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        You'll receive a confirmation email shortly
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        We'll keep you updated on our progress
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        You'll get early access to the platform when we launch
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-7/12">
            {step === 1 && !submissionComplete && (
              <RegisterForm onSubmit={handleInitialSubmit} />
            )}
            
            {step === 2 && !submissionComplete && (
              <SurveyForm 
                onSubmit={handleSurveySubmit} 
                onBack={handleBack}
                initialData={initialData}
              />
            )}
            
            {submissionComplete && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Connect With Us</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Follow on Facebook
                  </a>
                  <a href="#" className="bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Follow on Twitter
                  </a>
                </div>
              </div>
            )}
            
            {/* Testimonials Section */}
            {!submissionComplete && (
              <div className="mt-8 space-y-6">
                <TestimonialCard
                  quote="Hues Apply made my dream to study in Canada come true. From admission to visa assistance, essay writing, and even off-campus housing. They supported me every step of the way. I secured a scholarship and a student loan, and I didn't need $10,000 to start. Truly life-changing!"
                  name="Successful Applicant, Canada"
                  image={canadaSuccessImg}
                />
                
                <TestimonialCard
                  quote="I used to be overwhelmed by the application process. Now, I get matched with the right opportunities and I'm guided every step of the way."
                  name="Kwame A, Aspiring Data Scientist"
                  image="https://randomuser.me/api/portraits/men/54.jpg"
                />
                
                <TestimonialCard
                  quote="Thanks to Hues Apply, I landed a fully funded fellowship I didn't even know existed. The platform felt like a personal coach."
                  name="Priya R, Final-Year Student"
                  image="https://randomuser.me/api/portraits/women/28.jpg"
                />
                
                <TestimonialCard
                  quote="I appreciated how simple and focused the platform was. It showed me roles that truly aligned with my goals."
                  name="Fatima B, Early-Career Professional"
                  image="https://randomuser.me/api/portraits/women/54.jpg"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Additional benefits section */}
        {!submissionComplete && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why Join Our Waitlist?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#4B9CD310] p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-[#4B9CD3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Early Access</h3>
                <p className="text-gray-600">Be among the first to access our platform when we launch</p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#4B9CD310] p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-[#4B9CD3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Exclusive Updates</h3>
                <p className="text-gray-600">Receive insider news and launch details before anyone else</p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#4B9CD310] p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-[#4B9CD3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-2.6 1.5L5 5m7 3v13m0-13h2.8a4 4 0 012.6 1.5l1.2 1.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Founding Member Benefits</h3>
                <p className="text-gray-600">Get special perks reserved only for our earliest supporters</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegisterInterest;
