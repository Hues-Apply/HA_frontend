import React from 'react';

const Opportunity: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="opportunity-title">
      <div className="max-w-3xl mx-auto text-center">
        <h2 
          id="opportunity-title" 
          className="text-3xl sm:text-4xl font-semibold text-green-500 mb-4"
        >
          Your Next Opportunity<br />
          Awaits You
        </h2>
        
        <p className="text-gray-700 text-sm sm:text-base mb-8">
          Join the platform and get opportunities tailored for you. Get 
          started today and never look back.
        </p>
        
        <div className="flex justify-center">
          <a 
            href="/register" 
            className="bg-[#4B9CD3] text-white font-medium py-2 px-6 rounded-full transition hover:bg-[#3D84FF] focus:outline-none focus:ring-2 focus:ring-[#4B9CD3] focus:ring-offset-2"
            aria-label="Get started with Hues Apply"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default Opportunity;
