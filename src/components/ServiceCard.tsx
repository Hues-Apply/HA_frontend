import React from 'react';
import targetIcon from '@/assets/target.svg';

interface ServiceCardProps {
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description }) => {
  return (
    <article className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-row gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <img src={targetIcon} alt="" className="w-8 h-8" />
        </div>
        
        <div>
          <h3 className="text-[#4B9CD3] text-lg font-semibold mb-2">{title}</h3>
          
          <p className="text-gray-700 text-sm">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
