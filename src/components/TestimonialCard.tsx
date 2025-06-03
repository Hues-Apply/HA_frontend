import React from 'react';

interface TestimonialCardProps {
  text: string;
  name: string;
  title: string;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, name, title, image }) => {
  return (
    <div className="bg-white shadow-sm p-6 rounded-2xl flex flex-col items-center mx-2 h-full">
      <div className="mb-4">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 object-cover rounded-full"
        />
      </div>
      <p className="text-gray-700 text-center mb-4">"{text}"</p>
      <div className="mt-auto">
        <div className="font-bold text-center">{name}</div>
        <div className="text-sm text-gray-500 text-center">{title}</div>
      </div>
    </div>
  );
};

export default TestimonialCard;
