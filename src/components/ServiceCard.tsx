import React from 'react';
import targetIcon from '../assets/target.svg';

interface ServiceCardProps {
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col gap-4">
        <div className="w-10 h-10 rounded-full text-white flex items-center justify-center">
          <img src={targetIcon} alt="Target" className="w-5 h-5" />
        </div>
        
        <h3 className="text-[#4B9CD3] text-lg font-semibold">{title}</h3>
        
        <p className="text-gray-700 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
