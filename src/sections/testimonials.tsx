import React from "react";
import TestimonialCard from "../components/TestimonialCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    text: "I was struggling to find relevant job openings, but Hues AI made everything simple. The AI recommendations matched my skills, and the easy application process made job hunting effortless. I received an offer within a month! Thank you, Hues AI.",
    name: "Adam Zampa",
    title: "HR Manager at Meta",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    text: "I was struggling to find relevant job openings, but Hues AI made everything simple. The AI recommendations matched my skills, and the easy application process made job hunting effortless. I received an offer within a month! Thank you, Hues AI.",
    name: "Adam Zampa",
    title: "HR Manager at Meta",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: 3,
    text: "I was struggling to find relevant job openings, but Hues AI made everything simple. The AI recommendations matched my skills, and the easy application process made job hunting effortless. I received an offer within a month! Thank you, Hues AI.",
    name: "Adam Zampa",
    title: "HR Manager at Meta",
    image: "https://randomuser.me/api/portraits/men/64.jpg",
  },
  {
    id: 4,
    text: "I was struggling to find relevant job openings, but Hues AI made everything simple. The AI recommendations matched my skills, and the easy application process made job hunting effortless. I received an offer within a month! Thank you, Hues AI.",
    name: "Adam Zampa",
    title: "HR Manager at Meta",
    image: "https://randomuser.me/api/portraits/men/64.jpg",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="testimonials-title">
      <div className="text-[#3D84FF] font-semibold text-sm px-6 py-2 flex justify-center items-center bg-[#4B9CD31A] rounded-full">
        Testimonials & Success Stories
      </div>
      
      <h2 id="testimonials-title" className="text-3xl font-semibold text-green-500 mt-6 mb-4 text-center">
        Trusted by users worldwide
      </h2>
      
      <p className="text-gray-600 mb-12 text-center max-w-2xl">
        These testimonials showcase the real impacts that Hues Apply AI have on jobseekers & students
      </p>

      <div className="relative w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-1">
              <TestimonialCard
                text={testimonial.text}
                name={testimonial.name}
                title={testimonial.title}
                image={testimonial.image}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B9CD3]"
          aria-label="Previous testimonial"
        >
          <FiChevronLeft className="w-6 h-6 text-gray-600" aria-hidden="true" />
        </button>
        
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B9CD3]"
          aria-label="Next testimonial"
        >
          <FiChevronRight className="w-6 h-6 text-gray-600" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
