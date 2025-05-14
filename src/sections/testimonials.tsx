import React, { useState, useEffect } from "react";

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
];

const TestimonialSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-white">
      <div className="text-sm text-blue-500 font-semibold mb-2">
        Testimonials & Success Stories
      </div>
      <div className="text-2xl font-bold text-green-600 mb-2">
        Trusted by users worldwide
      </div>
      <div className="text-gray-500 mb-8 text-center max-w-2xl">
        These testimonials showcase the real impacts that Hues Apply AI have on jobseekers & students
      </div>

      <div className="relative w-full max-w-3xl flex items-center justify-center">
        {/* Left button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ◀
        </button>

        {/* Testimonial Card */}
        <div className="flex flex-col md:flex-row items-center bg-white shadow-lg p-6 rounded-xl w-full transition-all duration-500 ease-in-out">
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-700 mb-4">"{testimonials[current].text}"</p>
            <div className="font-bold">{testimonials[current].name}</div>
            <div className="text-sm text-gray-500">{testimonials[current].title}</div>
          </div>
          <div className="flex-1 flex justify-center mt-6 md:mt-0">
            <img
              src={testimonials[current].image}
              alt={testimonials[current].name}
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Right button */}
        <button
          onClick={handleNext}
          className="absolute right-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;

