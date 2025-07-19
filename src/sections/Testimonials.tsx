import React, { useState, useRef, useEffect } from "react";
import TestimonialCard from "../components/TestimonialCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    text: "Hues Apply completely transformed my job search. The AI recommendations were spot-on and helped me discover opportunities I never would have found on my own. Within 3 weeks, I landed a role at a top tech company. The platform's intuitive design made the entire process seamless.",
    name: "Sarah Chen",
    title: "Software Engineer at Google",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    text: "As a recent graduate, I was overwhelmed by the job market. Hues Apply's scholarship matching feature helped me secure funding for my master's degree, and their job recommendations led me to my dream internship. The personalized approach really makes a difference.",
    name: "Marcus Rodriguez",
    title: "Data Science Intern at Microsoft",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: 3,
    text: "I've been using Hues Apply for both job hunting and scholarship applications. The platform's ability to track my applications and provide insights on my profile strength has been invaluable. I've received multiple interview invitations and secured two scholarships worth $15,000.",
    name: "Priya Patel",
    title: "Marketing Specialist at Amazon",
    image: "https://randomuser.me/api/portraits/women/64.jpg",
  },
  {
    id: 4,
    text: "The AI-powered matching on Hues Apply is incredible. It found opportunities that perfectly aligned with my skills and career goals. The application tracking feature kept me organized, and I landed a senior position at a startup within a month. Highly recommend!",
    name: "David Kim",
    title: "Product Manager at Stripe",
    image: "https://randomuser.me/api/portraits/men/42.jpg",
  },
  {
    id: 5,
    text: "Hues Apply helped me navigate the competitive internship market. Their scholarship recommendations were particularly helpful - I secured funding for my summer research project. The platform's user-friendly interface and comprehensive resources made everything so much easier.",
    name: "Emily Thompson",
    title: "Research Assistant at Stanford",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
  },
];

const Testimonials: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const visibleCount = 3;
  const sliderRef = useRef<HTMLDivElement>(null);

  // Create a circular array to allow infinite scrolling
  const getVisibleTestimonials = () => {
    const result: typeof testimonials = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % testimonials.length;
      result.push(testimonials[index]);
    }
    return result;
  };

  // Handle the animation timing
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
      }, 500); // match this to the duration in CSS
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Navigation functions
  const goToPrevious = () => {
    if (isAnimating) return; // Prevent rapid clicking
    setSlideDirection('right');
    setIsAnimating(true);

    // Delay the actual index change to allow animation to start
    setTimeout(() => {
      setStartIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    }, 50);
  };

  const goToNext = () => {
    if (isAnimating) return; // Prevent rapid clicking
    setSlideDirection('left');
    setIsAnimating(true);

    // Delay the actual index change to allow animation to start
    setTimeout(() => {
      setStartIndex((prevIndex) =>
        (prevIndex + 1) % testimonials.length
      );
    }, 50);
  };

  const jumpToIndex = (index: number) => {
    if (isAnimating) return;
    const direction = index > startIndex ? 'left' : 'right';
    setSlideDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      setStartIndex(index);
    }, 50);
  };

  const visibleTestimonials = getVisibleTestimonials();

  // Generate CSS class based on animation state
  const getSliderClass = () => {
    if (!isAnimating) return 'transition-transform duration-500';
    if (slideDirection === 'left') return 'animate-slide-left';
    if (slideDirection === 'right') return 'animate-slide-right';
    return '';
  };

  return (
    <section className="w-full flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="testimonials-title">
      <style>{`
        @keyframes slideLeft {
          0% { transform: translateX(5%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideRight {
          0% { transform: translateX(-5%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .animate-slide-left {
          animation: slideLeft 500ms ease-out;
        }

        .animate-slide-right {
          animation: slideRight 500ms ease-out;
        }
      `}</style>

      <div className="text-[#3D84FF] font-semibold text-sm px-6 py-2 flex justify-center items-center bg-[#4B9CD31A] rounded-full">
        Testimonials & Success Stories
      </div>

      <h2 id="testimonials-title" className="text-3xl font-semibold text-green-500 mt-6 mb-4 text-center">
        Trusted by users worldwide
      </h2>

      <p className="text-gray-600 mb-12 text-center max-w-2xl">
        These testimonials showcase the real impacts that Hues Apply AI have on jobseekers & students
      </p>

      <div className="relative w-full max-w-6xl overflow-hidden">
        <div
          className={`flex flex-col md:flex-row gap-6 ${getSliderClass()}`}
          ref={sliderRef}
        >
          {visibleTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.id}-${startIndex}-${index}`} className="flex-1">
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
          onClick={goToPrevious}
          disabled={isAnimating}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-0 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B9CD3] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous testimonial"
        >
          <FiChevronLeft className="w-6 h-6 text-gray-600" aria-hidden="true" />
        </button>

        <button
          onClick={goToNext}
          disabled={isAnimating}
          className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-0 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B9CD3] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next testimonial"
        >
          <FiChevronRight className="w-6 h-6 text-gray-600" aria-hidden="true" />
        </button>

        {/* Indicator dots */}
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => jumpToIndex(index)}
              disabled={isAnimating}
              className={`h-2 w-2 rounded-full mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B9CD3] disabled:opacity-50 ${index === startIndex ? "bg-[#4B9CD3]" : "bg-gray-300"
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === startIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
