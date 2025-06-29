import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="bg-[#f0f8ff] min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Top-left title */}
      <div className="absolute top-6 left-6 text-lg font-semibold text-sky-500">
        Hues Apply
      </div>

      {/* Success Icon */}
      <div className="w-48 h-60 bg-white rounded-md shadow-md mb-8 flex items-center justify-center">
        <div className="text-green-500 text-6xl">✓</div>
      </div>

      {/* Success message */}
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        Congratulations! You have successfully <br />
        created your profile
      </h2>

      <p className="text-gray-600 mb-6">
        Redirecting you to your dashboard in 3 seconds...
      </p>

      {/* Continue button */}
      <button 
        onClick={handleContinue}
        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        Continue to Dashboard
      </button>
    </div>
  );
};

export default OnboardingComplete;
