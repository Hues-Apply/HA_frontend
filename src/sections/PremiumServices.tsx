import React from 'react';
import ServiceCard from '../components/ServiceCard';

const PremiumServices: React.FC = () => {
  const services = [
    {
      title: "Opportunity Matching",
      description: "Personalized recommendations for scholarships, fellowships, grants, jobs, and other opportunities tailored to your qualifications, interests, and goals."
    },
    {
      title: "Application Document Assistance",
      description: "Expert guidance and resources to help you craft standout CVs, personal statements, cover letters, and other essential application materials."
    },
    {
      title: "AI generated application essays",
      description: "Automated tools to generate and refine application documents using cutting-edge AI, saving you time and effort."
    },
    {
      title: "Professional Review Services",
      description: "Get detailed feedback and suggestions on your applications from experienced consultants to maximize your chances of success."
    },
    {
      title: "Comprehensive Resource Library",
      description: "Access articles, templates, and guides on everything from interview preparation to personal development and application strategies."
    },
    {
      title: "Exclusive Opportunity Alerts",
      description: "Receive real-time notifications about new opportunities in your field, ensuring you never miss a chance. These services support students and professionals alike, simplifying the application process."
    }
  ];

  return (
    <section 
      className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-16" 
      aria-labelledby="premium-services-title"
    >
      <span 
        id="premium-services-title"
        className="bg-[#E8F3FB] text-[#4B9CD3] font-semibold text-sm px-6 py-2 rounded-full inline-flex items-center justify-center"
      >
        Premium services
      </span>
      
      <div className="text-center my-6 max-w-3xl">
        <h2 className="sr-only">Our Premium Services</h2>
        <p className="text-gray-700 text-sm sm:text-base">
          These testimonials showcase the real impacts that Hues Apply AI have on jobseekers & students
        </p>
      </div>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full mt-4 list-none">
        {services.map((service, index) => (
          <li key={index}>
            <ServiceCard 
              title={service.title}
              description={service.description}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PremiumServices;
