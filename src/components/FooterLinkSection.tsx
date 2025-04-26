import React from 'react';

interface FooterLinkSectionProps {
  title: string;
  children: React.ReactNode;
  id: string;
}

const FooterLinkSection: React.FC<FooterLinkSectionProps> = ({ title, children, id }) => {
  return (
    <div className="flex flex-col space-y-3">
      <h3 id={id} className="text-lg font-semibold text-gray-800 mb-1">
        {title}
      </h3>
      <div className="flex flex-col space-y-2" aria-labelledby={id}>
        {children}
      </div>
    </div>
  );
};

export default FooterLinkSection;
