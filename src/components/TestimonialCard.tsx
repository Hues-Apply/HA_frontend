import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  image?: string;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  image = "https://randomuser.me/api/portraits/lego/1.jpg", // Default image
  className = "",
}) => {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <p className="text-gray-600 italic mb-2">"{quote}"</p>
          <p className="text-gray-800 font-medium">{name}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
